import * as util from "../util.ts";
import * as AccountModel from "../model/m_account.ts";
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

  try {
    return util.responseTemplate({
      type: "shipment_all",
      content: ShippingModel.getShippingAll(),
    }, 200);
  } catch (e) {
    console.error(e);
    return util.statusResponse(500);
  }
}

type get_request = {
  id: number;
  session: string;
  shipping_order: number;
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

  if (AccountModel.isSessionValid(getRequest.session, getRequest.id)) {
    return util.statusResponse(403);
  }

  const shipment = ShippingModel.getShippingById(getRequest.shipping_order);
  if (shipment === undefined) {
    return util.statusResponse(404);
  }

  return util.responseTemplate({
    type: "shipment",
    content: shipment,
  }, 200);
}

type alter_request = {
  id: number;
  session: string;
  shipping_order: number;
  state: number;
};

async function alterHandler(req: Request) {
  if (!util.isMethodJson(req, "POST")) return util.statusResponse(405);

  let alterRequest: alter_request;
  try {
    alterRequest = JSON.parse(await util.getRequestBody(req));
  } catch (e) {
    console.error(e);
    return util.statusResponse(400);
  }

  if (AccountModel.isSessionValid(alterRequest.session, alterRequest.id)) {
    return util.statusResponse(403);
  }

  if (alterRequest.state < 1 || alterRequest.state > 3) {
    return util.statusResponse(400);
  }

  const shippingOrder = ShippingModel.getShippingById(
    alterRequest.shipping_order,
  );
  if (shippingOrder === undefined) return util.statusResponse(400);

  const userRole = AccountModel.getUserRoleById(alterRequest.id);

  if (userRole.seller && alterRequest.state !== 1) {
    return util.statusResponse(403);
  }

  if (userRole.shipper && alterRequest.state !== 2) {
    return util.statusResponse(403);
  }

  try {
    ShippingModel.alterShipping(
      alterRequest.shipping_order,
      "ship_status",
      alterRequest.state,
    );
    return util.statusResponse(201);
  } catch (e) {
    console.error(e);
    return util.statusResponse(500);
  }
}

type rate_request = {
  id: number;
  session: string;
  shipping_order: number;
  rate: number;
};

async function rateHandler(req: Request) {
  if (!util.isMethodJson(req, "POST")) return util.statusResponse(405);

  let rateRequest: rate_request;

  try {
    rateRequest = JSON.parse(await util.getRequestBody(req));
  } catch (e) {
    console.error(e);
    return util.statusResponse(400);
  }

  if (AccountModel.isSessionValid(rateRequest.session, rateRequest.id)) {
    return util.statusResponse(403);
  }

  const shippingOrder = ShippingModel.getShippingById(
    rateRequest.shipping_order,
  );
  if (shippingOrder === undefined) {
    return util.statusResponse(404);
  }

  if (ShippingModel.getShippingRate(rateRequest.shipping_order) !== undefined) {
    return util.statusResponse(400);
  }

  if (shippingOrder.ship_status < 3) {
    return util.statusResponse(403);
  }

  if (rateRequest.rate < 1 || rateRequest.rate > 5) {
    return util.statusResponse(400);
  }

  try {
    ShippingModel.setShippingRate(rateRequest.shipping_order, rateRequest.rate);
    return util.statusResponse(201);
  } catch (e) {
    console.error(e);
    return util.statusResponse(500);
  }
}

type rate_get_request = {
  id: number;
  session: string;
  shipping_order: number;
};

async function rateGetHandler(req: Request) {
  if (!util.isMethodJson(req, "POST")) return util.statusResponse(405);

  try {
    const rateGetRequest: rate_get_request = JSON.parse(
      await util.getRequestBody(req),
    );
    if (
      AccountModel.isSessionValid(rateGetRequest.session, rateGetRequest.id)
    ) {
      return util.statusResponse(403);
    }

    const result = ShippingModel.getShippingRate(rateGetRequest.shipping_order);
    if (result === undefined) return util.statusResponse(404);

    return util.responseTemplate({
      type: "shipping_rate",
      content: result,
    }, 200);
  } catch (e) {
    console.error(e);
    return util.statusResponse(500);
  }
}

export function shippingHandler(req: Request) {
  const url = new URL(req.url);
  const pathName = util.getFirstPath(url.pathname.replace("/api/shipping", ""));
  console.log(`INFO: /shipping path: ${pathName}`);

  switch (pathName) {
    case "/all":
      return allHandler(req);

    case "/get":
      return getHandler(req);

    case "/alter":
      return alterHandler(req);

    case "/rate":
      return rateHandler(req);

    case "/rate_get":
      return rateGetHandler(req);

    default:
      return util.statusResponse(400);
  }
}
