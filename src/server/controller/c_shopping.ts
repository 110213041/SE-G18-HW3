import * as util from "../util.ts";
import * as AccountModel from "../model/m_account.ts";
import * as ShoppingModel from "../model/m_shopping.ts";
import * as ShippingModel from "../model/m_shipping.ts";

type all_request = {
  id: number;
  session: string;
};

async function allHandler(req: Request) {
  if (!util.isMethodJson(req, "POST")) return util.statusResponse(405);

  let allRequest: all_request;
  try {
    allRequest = JSON.parse(await util.getRequestBody(req));
  } catch (e) {
    console.error(e);
    return util.statusResponse(400);
  }

  if (!AccountModel.isSessionValid(allRequest.session, allRequest.id)) {
    return util.statusResponse(403);
  }

  const shopping_order = ShoppingModel.getShoppingByUserId(allRequest.id);

  try {
    const result = shopping_order.map((v) => {
      return {
        id: v.id,
        shipping: ShoppingModel.getOrderShipping(v.id).map((v) =>
          ShippingModel.getShippingById(v.shopping_id)!
        ),
      };
    });

    return util.responseTemplate({
      type: "shopping_record_all",
      content: result,
    }, 200);
  } catch (e) {
    console.error(e);
    return util.statusResponse(400);
  }
}

type get_request = {
  id: number;
  session: string;
  order_id: number;
};

async function getHandler(req: Request) {
  if (!util.isMethodJson(req, "POST")) return util.statusResponse(405);

  let getRequest: get_request;
  try {
    getRequest = JSON.parse(await util.getRequestBody(req));
  } catch (e) {
    console.error(e);
    return util.statusResponse(400);
  }

  if (!AccountModel.isSessionValid(getRequest.session, getRequest.id)) {
    return util.statusResponse(403);
  }

  const shopping_order = ShoppingModel.getShoppingById(getRequest.id);
  if (shopping_order === undefined) {
    return util.statusResponse(404);
  }

  try {
    const result = {
      id: shopping_order.id,
      shipping: ShoppingModel.getOrderShipping(shopping_order.id).map((v) =>
        ShippingModel.getShippingById(v.shopping_id)!
      ),
    };

    return util.responseTemplate({
      type: "shopping_record",
      content: result,
    }, 200);
  } catch (e) {
    console.error(e);
    return util.statusResponse(400);
  }
}

export function shoppingHandler(req: Request) {
  const url = new URL(req.url);
  const pathName = util.getFirstPath(url.pathname.replace("/api/shopping", ""));
  console.log(`INFO: /shopping path: ${pathName}`);

  switch (pathName) {
    case "/all":
      return allHandler(req);
    case "/get":
      return getHandler(req);
    default:
      return util.statusResponse(400);
  }
}
