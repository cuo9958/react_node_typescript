const Router = require('koa-router');
const AuthMiddle = require('../middleware/open');
const OpenService = require('../services/open');
const AuthService = require('../services/auth');

const router = new Router();

/**
 * 鉴权接口
 */
router.get('/auth', async function(ctx) {
    const { uuid, uid, token } = ctx.query;
    ctx.set('Access-Control-Allow-Origin', '*');
    if (uuid) {
        const model = await OpenService.login(uuid);
        if (model) {
            return (ctx.body = {
                code: 1,
                data: model
            });
        }
    }
    if (uid && token) {
        const model = await AuthService.info(uid);
        if (model.token === token) {
            return (ctx.body = {
                code: 1,
                data: model
            });
        }
    }
    ctx.body = {
        code: 0
    };
});
/**
 * 指纹校验登录
 */
router.post('/login', function(ctx) {
    ctx.set('Access-Control-Allow-Origin', '*');
    const { fg } = ctx.request.body;
    OpenService.login(fg);
    ctx.body = {
        code: 1
    };
});

module.exports = router.routes();
