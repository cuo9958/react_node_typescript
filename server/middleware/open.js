/**
 * 鉴权
 * @param ctx any
 * @param next any
 */
module.exports = function AuthMiddle(ctx, next) {
    const { uid, token } = ctx.headers;
    if (!uid || !token) {
        ctx.body = {
            code: 0,
            msg: '鉴权失败'
        };
    } else {
        next();
    }
};
