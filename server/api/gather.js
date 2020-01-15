const Router = require('koa-router');
const GatherModel = require('../models/gather');

const router = new Router();

router.get('/', async function(ctx) {
    const { pageIndex, title } = ctx.query;
    try {
        const data = await GatherModel.getCount(pageIndex, title);
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
        const data = await GatherModel.getAll();
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
    const { id } = ctx.query;
    try {
        const data = await GatherModel.get(id);
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
    const { id, title, rules, rules_name } = ctx.request.body;

    try {
        const model = {
            title,
            rules,
            rules_name
        };
        if (id && id > 0) {
            await GatherModel.update(model, id);
        } else {
            await GatherModel.insert(model);
        }

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
router.post('/change', async function(ctx) {
    const { id, status } = ctx.request.body;
    try {
        const data = await GatherModel.change(id, status);
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
module.exports = router.routes();
