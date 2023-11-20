import {
  serveDir,
  serveFile,
} from "https://deno.land/std@0.206.0/http/file_server.ts";

import apiController from "./api.ts";

async function mainHandler(req: Request): Promise<Response> {
  const reqUrl = new URL(req.url);

  if (reqUrl.pathname.startsWith("/assets")) {
    console.log(Deno.cwd());
    return await serveDir(req, {
      fsRoot: `./dist/assets`,
      urlRoot: "assets",
    });
  }

  if (reqUrl.pathname.startsWith("/api")) {
    return await apiController(req);
  }

  return await serveFile(req, "./dist/index.html");
}

if (import.meta.main) {
  Deno.serve(mainHandler);
}
