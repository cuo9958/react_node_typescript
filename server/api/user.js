const Router = require('koa-router');
const AuthService = require('../services/auth');
const UserModel = require('../models/user');

const router = new Router();

/**
 * 用户列表
 */
router.get('/list', async function(ctx) {
    const { pageIndex, username } = ctx.query;
    try {
        const data = await UserModel.getCount(pageIndex, username);
        ctx.body = {
            code: 1,
            data
        };
    } catch (error) {
        ctx.body = {
            code: 0,
            msg: error.message
        };
    }
});

/**
 * 登录判断
 */
router.post('/login', async function(ctx) {
    const { username, password } = ctx.request.body;
    try {
        const data = await AuthService.login(username, password);
        ctx.body = {
            code: 1,
            data
        };
    } catch (error) {
        console.log(error);
        ctx.body = {
            code: 0,
            msg: error.message
        };
    }
});
//鉴权
router.get('/auth', async function(ctx) {
    const { username, uid, token } = ctx.headers;
    try {
        const data = await AuthService.auth(username, uid, token);
        ctx.body = {
            code: 1,
            data
        };
    } catch (error) {
        console.log(error);
        ctx.body = {
            code: 0,
            msg: error.message
        };
    }
});

module.exports = router.routes();
