const Router = require('koa-router');
const AuthService = require('../services/auth');
const OpenService = require('../services/open');
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
router.get('/all', async function(ctx) {
    try {
        const data = await UserModel.getAll();
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
    const { username, password, uuid } = ctx.request.body;
    try {
        const data = await AuthService.login(username, password);
        OpenService.update(uuid, data);
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
router.post('/change', async function(ctx) {
    const { username, status } = ctx.request.body;
    try {
        const data = await UserModel.change(username, status);
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
router.get('/detail', async function(ctx) {
    const { username } = ctx.query;
    try {
        const data = await UserModel.get(username);
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
router.post('/detail', async function(ctx) {
    const { username, rules, rules_name } = ctx.request.body;

    try {
        const model = {
            rules,
            ruleTxts: rules_name
        };
        await UserModel.update(model, username);

        ctx.body = {
            code: 1
        };
    } catch (error) {
        ctx.body = {
            code: 0,
            msg: error.message
        };
    }
});
router.post('/add', async function(ctx) {
    const { username, nickname } = ctx.request.body;
    try {
        const data = await UserModel.insert({
            username,
            nickname
        });

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

router.post('/section', async function(ctx) {
    const { section, username } = ctx.request.body;
    try {
        const data = await UserModel.update(
            {
                section
            },
            username
        );

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
