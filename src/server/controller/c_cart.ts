import * as util from "../util.ts";
import * as ControlUtil from "./c_util.ts";
import * as AccountModel from "../model/m_account.ts";
import * as CartModel from "../model/m_cart.ts";

type get_request = {
  user_id: number;
  session: string;
};

async function getHandler(req: Request) {
  if (!util.isMethodJson(req, "POST")) return util.statusResponse(405);

  try {
    const getRequest: get_request = JSON.parse(await util.getRequestBody(req));
    if (!AccountModel.isSessionValid(getRequest.session, getRequest.user_id)) {
      return util.statusResponse(403);
    }

    let cart = CartModel.getCart(getRequest.user_id);

    if (cart === undefined && !CartModel.createCart(getRequest.user_id)) {
      return util.statusResponse(500);
    }

    cart = CartModel.getCart(getRequest.user_id);
    if (cart === undefined) {
      return util.statusResponse(500);
    }

    return util.responseTemplate({
      type: "cart",
      content: JSON.parse(cart.cart),
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

    if (!AccountModel.isSessionValid(setRequest.session, setRequest.user_id)) {
      return util.statusResponse(403);
    }

    if (setRequest.quantity < 1) return util.statusResponse(400);

    if (
      !CartModel.alterCart(
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
      content: JSON.parse(cart.cart),
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

    if (!AccountModel.isSessionValid(delRequest.session, delRequest.user_id)) {
      return util.statusResponse(403);
    }

    if (!CartModel.delCart(delRequest.user_id, delRequest.item_id)) {
      return util.statusResponse(500);
    }

    const cart = CartModel.getCart(delRequest.user_id);
    if (cart === undefined) {
      return util.statusResponse(500);
    }

    return util.responseTemplate({
      type: "cart",
      content: JSON.parse(cart.cart),
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

    if (
      !AccountModel.isSessionValid(cleanRequest.session, cleanRequest.user_id)
    ) {
      return util.statusResponse(403);
    }

    if (!CartModel.updateCart(cleanRequest.user_id, JSON.stringify([]))) {
      return util.statusResponse(500);
    }

    const cart = CartModel.getCart(cleanRequest.user_id);
    if (cart === undefined) {
      return util.statusResponse(500);
    }

    return util.responseTemplate({
      type: "cart",
      content: JSON.parse(cart.cart),
    }, 200);
  } catch (e) {
    console.error(e);
    return util.statusResponse(500);
  }
}

type checkout_request = {
  user_id: number;
  session: number;
};

async function checkoutHandler(req: Request) {
  if (!util.isMethodJson(req, "POST")) return util.statusResponse(405);

  try {
    const checkoutRequest: checkout_request = JSON.parse(
      await util.getRequestBody(req),
    );

    const cartStr = CartModel.getCart(checkoutRequest.user_id)?.cart;
    if (cartStr === undefined || JSON.parse(cartStr).length < 1) {
      return util.statusResponse(400);
    }

    const orderId = CartModel.checkoutCart(checkoutRequest.user_id);

    if (
      orderId > 0 &&
      CartModel.updateCart(checkoutRequest.user_id, JSON.stringify([]))
    ) {
      return util.responseTemplate({
        type: "checkout",
        content: {
          order_id: orderId,
        },
      }, 200);
    } else {
      console.log(`${orderId}???`);
      return util.statusResponse(500);
    }
  } catch (e) {
    console.error(e);
    return util.statusResponse(500);
  }
}

export function cartHandler(req: Request) {
  const url = new URL(req.url);
  const pathName = util.getFirstPath(url.pathname.replace("/api/cart", ""));
  console.log(`INFO: /cart path: ${pathName}`);

  switch (pathName) {
    case "/get":
      return getHandler(req);
    case "/set":
      return setHandler(req);
    case "/del":
      return delHandler(req);
    case "/clean":
      return cleanHandler(req);
    case "/checkout":
      return checkoutHandler(req);
    default:
      return util.statusResponse(400);
  }
}
