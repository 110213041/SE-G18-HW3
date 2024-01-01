import { itemHandler } from "./method/item.ts";
import { accountHandler } from "./method/account.ts";
import { getFirstPath, statusResponse } from "./util.ts";

export default function apiController(
  req: Request,
): Promise<Response> | Response {
  const url = new URL(req.url);
  console.log(`GET: /api call`);
  const pathName = getFirstPath(url.pathname.replace("/api", ""));
  console.log(`INFO: api path: ${pathName}`);

  switch (pathName) {
    case "/account":
      return accountHandler(req);

    case "/item":
      return itemHandler(req);
  }

  // default response
  return statusResponse(400);
}
