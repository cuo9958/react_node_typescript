/**
 * 加入执行时间
 */
export default async function(ctx: any, next: any) {
    const now = Date.now();
    await next();
    if (!ctx.body) {
        ctx.body = "";
    }
    if (ctx.body.data) {
        ctx.body.time = Date.now() - now;
    }
}
