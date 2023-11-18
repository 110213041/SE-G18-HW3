import { Context, send } from "https://deno.land/x/oak@v12.6.1/mod.ts";

// deno-lint-ignore ban-types
export const staticFileMiddleware = async (ctx: Context, next: Function) => {
    const path = `${Deno.cwd()}/dist${ctx.request.url.pathname}`;

    if (await fileExist(path)) {
        await send(ctx, ctx.request.url.pathname, {
            root: `${Deno.cwd()}/dist`,
        });
    } else {
        await next();
    }
};

async function fileExist(path: string) {
    try {
        const stats = await Deno.lstat(path);
        return stats && stats.isFile;
    } catch (e) {
        if (e && e instanceof Deno.errors.NotFound) {
            return false;
        } else {
            throw e;
        }
    }
}
