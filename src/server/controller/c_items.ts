import * as util from "../util.ts";
import * as ItemsModel from "../model/m_items.ts";
import * as AccountModel from "../model/m_account.ts";

type get_request = {
  user_id: number;
  session: number;
  item_id: number;
};

async function getHandler(req: Request) {
  if (!util.isMethodJson(req, "POST")) return util.statusResponse(405);

  try {
    const getRequest: get_request = JSON.parse(await util.getRequestBody(req));
    const result = ItemsModel.getItemById(getRequest.item_id);
    if (result === undefined) return util.statusResponse(404);

    return util.responseTemplate({
      type: "items",
      content: result,
    }, 200);
  } catch (e) {
    console.error(e);
    return util.statusResponse(500);
  }
}

function allHandler(req: Request) {
  if (req.method !== "GET") return util.statusResponse(405);

  try {
    return util.responseTemplate({
      type: "items_all",
      content: ItemsModel.getItem(),
    }, 200);
  } catch (e) {
    console.error(e);
    return util.statusResponse(500);
  }
}

type alter_request = {
  user_id: number;
  session: string;
  item_id: number;
  attribute: ItemsModel.item_key;
  value: string | number;
};

async function alterHandler(req: Request) {
  if (!util.isMethodJson(req, "POST")) return util.statusResponse(405);

  try {
    const alterRequest: alter_request = JSON.parse(
      await util.getRequestBody(req),
    );

    if (
      !AccountModel.isSessionValid(alterRequest.session, alterRequest.user_id)
    ) {
      return util.statusResponse(403);
    }

    if (
      !new Set(["state", "price", "display_name", "description"]).has(
        alterRequest.attribute,
      )
    ) return util.statusResponse(400);

    if (
      ItemsModel.alterItem(
        alterRequest.item_id,
        alterRequest.attribute,
        alterRequest.value,
      )
    ) {
      return util.statusResponse(200);
    } else {
      return util.statusResponse(500);
    }
  } catch (e) {
    console.error(e);
    return util.statusResponse(500);
  }
}

export function itemsHandler(req: Request) {
  const url = new URL(req.url);
  const pathName = util.getFirstPath(url.pathname.replace("/api/items", ""));
  console.log(`INFO: /items path: ${pathName}`);

  switch (pathName) {
    case "/get":
      return getHandler(req);
    case "/all":
      return allHandler(req);
    case "/alter":
      return alterHandler(req);
    default:
      return util.statusResponse(400);
  }
}
