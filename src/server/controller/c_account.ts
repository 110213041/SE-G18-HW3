import * as util from "../util.ts";
import * as DB from "../model/database.ts";
import * as AccountModel from "../model/m_account.ts";
type login_request = {
  name: string;
  password: string;
};

async function loginHandler(req: Request) {
  if (util.isPostJson(req)) return util.statusResponse(400);

  try {
    const loginRequest: login_request = JSON.parse(
      await util.getRequestBody(req),
    );

    const user = AccountModel.getIdByUserPassword(
      loginRequest.name,
      loginRequest.password,
    );
    if (user === undefined) {
      return util.statusResponse(403);
    }

    const newSession = AccountModel.createNewSession(user.id);
    if (newSession === null) {
      return util.statusResponse(500);
    }

    return util.responseTemplate({
      type: "login_response",
      content: newSession,
    }, 200);
  } catch (e) {
    console.error(e);
    return util.statusResponse(500);
  }
}

type register_request = {
  name: string;
  email: string;
  password: string;
};

function registerProcess(payload: register_request) {
  const user = AccountModel.getIdByUserEmail(payload.name, payload.email);
  if (user !== undefined) {
    return false;
  }

  return AccountModel.createNewAccount(
    payload.name,
    payload.email,
    payload.password,
  );
}

async function registerHandler(req: Request) {
  if (util.isPostJson(req)) return util.statusResponse(400);

  try {
    const registerRequest: register_request = JSON.parse(
      await util.getRequestBody(req),
    );

    if (
      registerRequest.name === undefined ||
      registerRequest.email === undefined ||
      registerRequest.password === undefined
    ) return util.statusResponse(400);

    if (registerProcess(registerRequest)) {
      return util.statusResponse(201);
    } else {
      return util.statusResponse(403);
    }
  } catch (e) {
    console.error(e);
    return util.statusResponse(500);
  }
}

type info_request = {
  id: number;
  session: string;
};

function infoProcess(id: number) {
  const userInfo = AccountModel.getUserById(id);
  if (userInfo === undefined) {
    console.error(`id=${id} don't have matched user`);
    return undefined;
  }

  return {
    ...userInfo,
    role: {
      ...AccountModel.getUserRoleById(id),
    },
  };
}

async function infoHandler(req: Request) {
  if (util.isPostJson(req)) return util.statusResponse(400);

  try {
    const infoRequest: info_request = JSON.parse(
      await util.getRequestBody(req),
    );
    if (
      infoRequest.id === undefined ||
      infoRequest.session === undefined
    ) return util.statusResponse(403);

    if (!AccountModel.isSessionValid(infoRequest.id, infoRequest.session)) {
      return util.statusResponse(403);
    }

    const userInfo = infoProcess(infoRequest.id);
    if (userInfo === undefined) {
      return util.statusResponse(403);
    }

    return util.responseTemplate({
      type: "user_info",
      content: userInfo,
    }, 200);
  } catch (e) {
    console.error(e);
    return util.statusResponse(500);
  }
}

export function accountHandler(req: Request) {
  const url = new URL(req.url);
  const pathName = util.getFirstPath(url.pathname.replace("/api/account", ""));
  console.log(`INFO: /account path: ${pathName}`);

  switch (pathName) {
    case "/login":
      return loginHandler(req);

    case "/register":
      return registerHandler(req);

    case "/info":
      return infoHandler(req);

    default:
      return util.statusResponse(400);
  }
}
