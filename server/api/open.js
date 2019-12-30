const Router = require('koa-router');
const AuthMiddle = require('../middleware/open');
const OpenService = require('../services/open');

const router = new Router();

/**
 * 鉴权接口
 */
router.get('/auth', AuthMiddle, function(ctx) {
    ctx.body = {
        code: 1,
        data: ctx.user
    };
});
/**
 * 登录
 */
router.post('/login', function(ctx) {
    const { username, pwd } = ctx.request.body;
    OpenService.login(username, pwd);
    ctx.body = {
        code: 1
    };
});

module.exports = router.routes();
