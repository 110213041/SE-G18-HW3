/** Deprecate API, Do Not Use */
import { itemHandler } from "./controller/c_item.ts";

import { accountHandler } from "./controller/c_account.ts";
import { itemsHandler } from "./controller/c_items.ts";
import { cartHandler } from "./controller/c_cart.ts";
import { shoppingHandler } from "./controller/c_shopping.ts";
import { shippingHandler } from "./controller/c_shipping.ts";
import * as util from "./util.ts";

export default function apiController(
  req: Request,
): Promise<Response> | Response {
  const url = new URL(req.url);
  console.log(`GET: /api call`);
  const pathName = util.getFirstPath(url.pathname.replace("/api", ""));
  console.log(`INFO: api path: ${pathName}`);

  switch (pathName) {
    case "/account":
      return accountHandler(req);

    case "/cart":
      return cartHandler(req);

    case "/items":
      return itemsHandler(req);

    case "/shopping":
      return shoppingHandler(req);

    case "/shipping":
      return shippingHandler(req);

    /** Deprecate API, Do Not Use */
    case "/item":
      return itemHandler(req);
  }

  // default response
  return util.statusResponse(400);
}
