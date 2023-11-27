import { database, type item } from "./database.ts";

function getItem(id: number) {
  console.log(`INFO: item id: ${id}`);

  if (!Number.isInteger(id)) return null; // early return

  const queryResult = database.query<
    [number, string, number, string, number, number, string]
  >(
    `--sql
    SELECT
      item.id, "display_name", "price", "description", "owner_id", "state",member.user_name
    FROM
      item
      LEFT JOIN member ON member.id = item.owner_id
    WHERE item.id = ?`,
    [id],
  );

  console.log(`INFO: query result length: ${queryResult.length}`);

  let result: {
    status: "success";
    result: item & { owner_name: string };
  } | {
    status: "fail";
    message: string;
  };

  if (queryResult.length > 1) {
    return 500;
  }

  if (queryResult.length === 1) {
    result = {
      status: "success",
      result: {
        id: queryResult[0][0],
        display_name: queryResult[0][1],
        price: queryResult[0][2],
        description: queryResult[0][3],
        owner_id: queryResult[0][4],
        state: queryResult[0][5],
        owner_name: queryResult[0][6],
      },
    };
  } else {
    result = {
      status: "fail",
      message: "item not found",
    };
  }

  return result;
}

function getItemAll() {
  console.log("INFO: getall");

  const queryResult = database.query<
    [number, string, number, string, number, number, string]
  >(
    `--sql
    SELECT
      item.id, "display_name", "price", "description", "owner_id", "state", member.user_name
    FROM
      item
      LEFT JOIN member ON member.id = item.owner_id`,
  );

  console.log(queryResult[0]);

  let result: item[] = [];
  if (queryResult.length > 0) {
    result = [...queryResult].map((arr) => {
      return {
        id: arr[0],
        display_name: arr[1],
        price: arr[2],
        description: arr[3],
        owner_id: arr[4],
        state: arr[5],
        owner_name: arr[6],
      };
    });
  }

  return result;
}

export default async function apiController(req: Request): Promise<Response> {
  const url = new URL(req.url);
  console.log(`GET: /api call`);
  const pathName = url.pathname.replace("/api", "");
  console.log(`INFO: api path: ${pathName}`);

  switch (pathName) {
    case "/item": {
      const itemId = parseInt(url.searchParams.get("q") ?? "");
      const itemActon = url.searchParams.get("a");
      if (itemActon === null) {
        const getItemResult = getItem(itemId);
        if (getItemResult === null) break; // early jump to final error handling
        else if (getItemResult === 500) {
          return new Response(JSON.stringify({ status: 500 }), {
            status: 500,
            headers: {
              "content-type": "application/json",
            },
          });
        }
        return new Response(JSON.stringify(getItemResult), {
          status: 200,
          headers: {
            "content-type": "application/json",
          },
        });
      } else if (itemActon === "getall" && url.searchParams.get("q") === null) {
        return new Response(JSON.stringify(getItemAll()), {
          status: 200,
          headers: {
            "content-type": "application/json",
          },
        });
      } else if (itemActon === "alter") {
        if (req.headers.get("content-type") !== "application/json") break;
        type alterSchema = {
          id: number;
          state?: number;
          price?: number;
          display_name?: string;
          description?: string;
        };

        const requestJson: alterSchema = await req.json();

        const state = requestJson.state;
        if (Number.isInteger(state)) {
          database.query(`UPDATE item SET "state" = ? WHERE "id" = ? `, [
            state,
            requestJson.id,
          ]);
          return new Response(JSON.stringify({ status: 200 }), {
            status: 200,
            headers: {
              "content-type": "application/json",
            },
          });
        }

        const price = requestJson.price;
        console.log(`Number.isInteger(price) ${Number.isInteger(price)}`);
        if (Number.isInteger(price)) {
          database.query(`UPDATE item SET "price" = ? WHERE "id" = ? `, [
            price,
            requestJson.id,
          ]);
          return new Response(JSON.stringify({ status: 200 }), {
            status: 200,
            headers: {
              "content-type": "application/json",
            },
          });
        }

        if (requestJson.display_name !== null) {
          database.query(`UPDATE item SET "display_name" = ? WHERE "id" = ? `, [
            requestJson.display_name,
            requestJson.id,
          ]);
          return new Response(JSON.stringify({ status: 200 }), {
            status: 200,
            headers: {
              "content-type": "application/json",
            },
          });
        }

        if (requestJson.description !== null) {
          database.query(`UPDATE item SET "description" = ? WHERE "id" = ? `, [
            requestJson.description,
            requestJson.id,
          ]);
          return new Response(JSON.stringify({ status: 200 }), {
            status: 200,
            headers: {
              "content-type": "application/json",
            },
          });
        }
      } else if (itemActon === "create") {
        if (req.headers.get("content-type") !== "application/json") break;
        type createSchema = {
          owner_id: number;
          display_name: string;
          price: number;
          description: string;
        };

        const createJson: createSchema = await req.json();
        console.log(await createJson);
        database.query(
          `INSERT INTO item("display_name", "price", "description", "owner_id", "state") VALUES (?, ?, ?, ?, ?)`,
          [
            createJson.display_name,
            createJson.price,
            createJson.description,
            createJson.owner_id,
            1,
          ],
        );

        return new Response(JSON.stringify({ status: 200 }), {
          status: 200,
          headers: {
            "content-type": "application/json",
          },
        });
      }
    }
  }

  // default response
  return new Response(JSON.stringify({ status: 400 }), {
    status: 400,
    headers: {
      "content-type": "application/json",
    },
  });
}
