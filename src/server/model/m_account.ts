import * as DB from "../model/database.ts";

export function getIdByUserPassword(name: string, password: string) {
  const query = DB.database.prepareQuery<
    never,
    { id: number },
    [string, string]
  >(`--sql
      SELECT "id" FROM member WHERE
        "user_name" = ? 
        AND "password" = ?
    `);

  const result = query.firstEntry([name, password]);
  query.finalize();

  return result;
}

export function getIdByUserEmail(name: string, email: string) {
  const query = DB.database.prepareQuery<
    never,
    { id: number },
    [string, string]
  >(`--sql
      SELECT id FROM member WHERE
      user_name = ? 
      AND email = ?
    `);

  const result = query.firstEntry([name, email]);
  query.finalize();

  return result;
}

export function createNewAccount(
  name: string,
  email: string,
  password: string,
) {
  try {
    DB.database.transaction(() => {
      const query = DB.database.prepareQuery<
        never,
        never,
        [string, string, string]
      >(`--sql
        INSERT INTO member ("user_name", "email", "password")
        VALUES (?, ?, ?)
    `);
      query.execute([name, email, password]);
      query.finalize();
    });
  } catch (e) {
    console.error(e);
    return false;
  }

  return true;
}

export function createNewSession(userId: number) {
  const newSessionId = crypto.randomUUID();
  const lifeTime = Date.now() + 60 * 60 * 24 * 365 * 1000;

  try {
    const query = DB.database.prepareQuery<
      never,
      never,
      [number, string, number]
    >(`--sql
    INSERT INTO "session" ("user_id", "session", "life_time")
    VALUES (?, ?, ?)
    `);
    query.execute([userId, newSessionId, lifeTime]);
    query.finalize();
  } catch (e) {
    console.error(e);
    return null;
  }

  return {
    user_id: userId,
    session: newSessionId,
    life_time: lifeTime,
  };
}

export function isSessionValid(session: string, id?: number): boolean {
  const query = DB.database.prepareQuery<
    never,
    { user_id: number; life_time: number },
    [string]
  >(
    `SELECT user_id, life_time FROM "session" WHERE "session" = ?`,
  );

  const result = query.firstEntry([session]);
  query.finalize();

  if (result === undefined) {
    return false;
  }

  if (id === undefined) {
    return true;
  } else {
    // return (result.user_id === id &&
    //   (Date.now() + 60 * 1000 < result.life_time));
    return result.user_id === id;
  }
}

export function getUserById(id: number) {
  const query = DB.database.prepareQuery<
    never,
    { user_name: string; email: string },
    [number]
  >(
    `SELECT user_name, email FROM member WHERE id = ?`,
  );

  const result = query.firstEntry([id]);
  query.finalize();

  return result;
}

export function getUserRoleById(id: number) {
  const query = DB.database.prepareQuery<never, { role: number }, [number]>(
    `SELECT "role" FROM member_role WHERE user_id = ?`,
  );

  const result = query.allEntries([id]);
  query.finalize();

  return {
    seller: result.findIndex((v) => v.role === 1) !== -1,
    shipper: result.findIndex((v) => v.role === 2) !== -1,
  };
}
