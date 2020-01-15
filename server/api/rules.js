const Router = require('koa-router');
const RuleModel = require('../models/rules');

const router = new Router();

router.get('/', async function(ctx) {
    const { pageIndex, title } = ctx.query;
    try {
        const data = await RuleModel.getCount(pageIndex, title);
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
        const data = await RuleModel.getAll();
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
        const data = await RuleModel.get(id);
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
    const { id, title, sort_name, topic_name, topic_id } = ctx.request.body;

    try {
        const model = {
            title,
            sort_name,
            topic_name,
            topic_id
        };
        if (id && id > 0) {
            await RuleModel.update(model, id);
        } else {
            await RuleModel.insert(model);
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

router.post('/del', async function(ctx) {
    const { id } = ctx.request.body;

    try {
        await RuleModel.del(id);
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

module.exports = router.routes();
