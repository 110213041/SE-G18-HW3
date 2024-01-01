import {
  getFirstPath,
  getRequestBody,
  isPostJson,
  responseTemplate,
  statusResponse,
} from "../util.ts";
import { database } from "../database.ts";

type login_request = {
  name: string;
  password: string;
};

function loginProcess(name: string, password: string) {
  return database.transaction(() => {
    const query = database.prepareQuery(`--sql
      SELECT "id" FROM member WHERE
        "user_name" = ? 
        AND "password" = ?
    `);

    const result = query.first([name, password]);
    if (result === undefined) {
      return null;
    }

    const userId = result[0] as number;
    const newSessionId = crypto.randomUUID();
    const lifeTime = Date.now() + 60 * 60 * 24 * 365 * 1000;

    database.prepareQuery(`--sql
      INSERT INTO "session" ("user_id", "session", "life_time")
      VALUES (?, ?, ?)
    `).execute([userId, newSessionId, lifeTime]);

    return {
      user_id: userId,
      session: newSessionId,
      life_time: lifeTime,
    };
  });
}

async function loginHandler(req: Request) {
  if (isPostJson(req)) return statusResponse(400);

  try {
    const loginRequest: login_request = JSON.parse(await getRequestBody(req));

    const loginResult = loginProcess(loginRequest.name, loginRequest.password);

    if (loginResult === null) {
      return statusResponse(403);
    }

    return responseTemplate({
      type: "login_response",
      content: {
        user_id: loginResult.user_id,
        session: loginResult.session,
        life_time: loginResult.life_time,
      },
    }, 200);
  } catch (e) {
    console.error(e);
    return statusResponse(500);
  }
}

type register_request = {
  name: string;
  email: string;
  password: string;
};

function registerProcess(payload: register_request) {
  return database.transaction(() => {
    const query = database.prepareQuery(`--sql
      SELECT id FROM member WHERE user_name = ? OR email = ?
    `);

    const result = query.first([payload.name, payload.email]);
    if (result !== undefined) {
      return false;
    }

    database.prepareQuery(`--sql
      INSERT INTO member ("user_name", "email", "password")
      VALUES (?, ?, ?)
    `).execute([payload.name, payload.email, payload.password]);

    return true;
  });
}

async function registerHandler(req: Request) {
  if (isPostJson(req)) return statusResponse(400);

  try {
    const registerRequest: register_request = JSON.parse(
      await getRequestBody(req),
    );

    if (
      registerRequest.name === undefined ||
      registerRequest.email === undefined ||
      registerRequest.password === undefined
    ) return statusResponse(400);

    if (registerProcess(registerRequest)) {
      return statusResponse(201);
    } else {
      return statusResponse(403);
    }
  } catch (e) {
    console.error(e);
    return statusResponse(500);
  }
}

type info_request = {
  id: number;
  session: string;
};

function isSessionValid(id: number, session: string): boolean {
  const result = database.prepareQuery<[number, number]>(
    `SELECT user_id, life_time FROM "session" WHERE "session" = ?`,
  ).first([session]);
  if (result === undefined) {
    return false;
  }

  const [userId, lifeTime] = result;

  if (userId === id && (Date.now() + 60 * 1000 < lifeTime)) {
    return true;
  }

  return false;
}

function infoProcess(id: number) {
  const [name, email] = database.prepareQuery<[string, string]>(
    `SELECT user_name, email FROM member WHERE id = ?`,
  ).first([id])!;

  const roleString = database.prepareQuery<[string]>(
    `SELECT GROUP_CONCAT("role") FROM member_role WHERE user_id = ? GROUP BY user_id`,
  ).first([id]);

  let roles: number[];

  if (roleString !== undefined) {
    roles = roleString[0].split(",").map((v) => parseInt(v));
  } else {
    roles = [];
  }

  return {
    name: name,
    email: email,
    role: {
      seller: roles.findIndex((v) => v === 1) !== -1,
      shipper: roles.findIndex((v) => v === 2) !== -1,
    },
  };
}

async function infoHandler(req: Request) {
  if (isPostJson(req)) return statusResponse(400);

  try {
    const infoRequest: info_request = JSON.parse(await getRequestBody(req));
    if (
      infoRequest.id === undefined ||
      infoRequest.session === undefined
    ) return statusResponse(403);

    if (!isSessionValid(infoRequest.id, infoRequest.session)) {
      return statusResponse(403);
    }

    return responseTemplate({
      type: "user_info",
      content: infoProcess(infoRequest.id),
    }, 200);
  } catch (e) {
    console.error(e);
    return statusResponse(500);
  }
}

export function accountHandler(req: Request) {
  const url = new URL(req.url);
  const pathName = getFirstPath(url.pathname.replace("/api/account", ""));
  console.log(`INFO: /account path: ${pathName}`);

  switch (pathName) {
    case "/login":
      return loginHandler(req);

    case "/register":
      return registerHandler(req);

    case "/info":
      return infoHandler(req);

    default:
      return statusResponse(400);
  }
}
