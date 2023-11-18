import {
    Application,
    Router,
    send,
} from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { staticFileMiddleware } from "./staticFileMiddleware.ts";

const PORT = 8000;

const app = new Application();
const route = new Router();

route
    .get("/", async (ctx) => {
        await send(ctx, `./index.html`, {
            root: `${Deno.cwd()}/dist`,
        });
    })
    .get("/api", (ctx) => {
        ctx.response.body = "api index";
    });

app.use(staticFileMiddleware);
app.use(route.routes());

app.addEventListener("listen", ({ hostname, port, secure }) => {
    console.log(
        `Listening on: ${secure ? "https://" : "http://"}${
            hostname ?? "localhost"
        }:${port}`,
    );
});

app.addEventListener("close", () => {
    console.log("Server Close");
});

app.addEventListener("error", (e) => {
    console.error(e);
});

if (import.meta.main) {
    await app.listen({ port: PORT });
}
