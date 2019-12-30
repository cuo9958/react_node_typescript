/**
 * 加入执行时间
 */
module.exports = async function(ctx, next) {
    const now = Date.now();
    await next();
    if (ctx.body && ctx.body.data) {
        ctx.body.time = Date.now() - now;
    }
};
