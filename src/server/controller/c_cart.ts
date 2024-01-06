import * as util from "../util.ts";
import * as ControlUtil from "./c_util.ts";
import * as AccountModel from "../model/m_account.ts";
import * as CartModel from "../model/m_cart.ts";

type get_request = {
  id: number;
  session: string;
};

async function getHandler(req: Request) {
  if (!util.isMethodJson(req, "GET")) return util.statusResponse(405);

  try {
    const getRequest: get_request = JSON.parse(await util.getRequestBody(req));

    let cart = CartModel.getCart(getRequest.id);

    if (cart === undefined && !CartModel.createCart(getRequest.id)) {
      return util.statusResponse(500);
    }

    cart = CartModel.getCart(getRequest.id);
    if (cart === undefined) {
      return util.statusResponse(500);
    }

    return util.responseTemplate({
      type: "cart",
      content: cart,
    }, 200);
  } catch (e) {
    console.error(e);
    return util.statusResponse(500);
  }
}

type set_request = {
  user_id: number;
  session: string;
  item_id: number;
  quantity: number;
};

async function setHandler(req: Request) {
  if (!util.isMethodJson(req, "POST")) return util.statusResponse(405);

  try {
    const setRequest: set_request = JSON.parse(await util.getRequestBody(req));
    if (
      CartModel.alterCart(
        setRequest.user_id,
        setRequest.item_id,
        setRequest.quantity,
      )
    ) {
      return util.statusResponse(500);
    }

    const cart = CartModel.getCart(setRequest.user_id);
    if (cart === undefined) {
      return util.statusResponse(500);
    }

    return util.responseTemplate({
      type: "cart",
      content: cart,
    }, 200);
  } catch (e) {
    console.error(e);
    return util.statusResponse(500);
  }
}

type del_request = {
  user_id: number;
  session: string;
  item_id: number;
};

export async function delHandler(req: Request) {
  if (!util.isMethodJson(req, "POST")) return util.statusResponse(405);

  try {
    const delRequest: del_request = JSON.parse(await util.getRequestBody(req));

    if (!CartModel.delCart(delRequest.user_id, delRequest.item_id)) {
      return util.statusResponse(500);
    }

    const cart = CartModel.getCart(delRequest.user_id);
    if (cart === undefined) {
      return util.statusResponse(500);
    }

    return util.responseTemplate({
      type: "cart",
      content: cart,
    }, 200);
  } catch (e) {
    console.error(e);
    return util.statusResponse(500);
  }
}

type clean_request = {
  user_id: number;
  session: string;
};

async function cleanHandler(req: Request) {
  if (!util.isMethodJson(req, "POST")) return util.statusResponse(405);

  try {
    const cleanRequest: clean_request = JSON.parse(
      await util.getRequestBody(req),
    );

    if (!CartModel.updateCart(cleanRequest.user_id, JSON.stringify([]))) {
      return util.statusResponse(500);
    }

    const cart = CartModel.getCart(cleanRequest.user_id);
    if (cart === undefined) {
      return util.statusResponse(500);
    }

    return util.responseTemplate({
      type: "cart",
      content: cart,
    }, 200);
  } catch (e) {
    console.error(e);
    return util.statusResponse(500);
  }
}

export async function cartHandler(req: Request) {
  const url = new URL(req.url);
  const pathName = util.getFirstPath(url.pathname.replace("/api/cart", ""));
  console.log(`INFO: /cart path: ${pathName}`);

  try {
    const session = ControlUtil.getSession(await util.getRequestBody(req));
    if (session === undefined || AccountModel.isSessionValid(session)) {
      return util.statusResponse(403);
    }
  } catch (e) {
    console.error(e);
    return util.statusResponse(400);
  }

  switch (pathName) {
    case "/get":
      return getHandler(req);
    case "/set":
      return setHandler(req);
    case "/del":
      return delHandler(req);
    case "/clean":
      return cleanHandler(req);
    default:
      return util.statusResponse(400);
  }
}
