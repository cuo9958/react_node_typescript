const Router = require('koa-router');

const router = new Router();

router.all('/', function(ctx) {
    ctx.body = '不存在的接口';
});

/**
 * 登录判断
 */
router.post('/login', function(ctx) {
    ctx.body = {
        code: 1,
        data: null
    };
});

module.exports = router.routes();
