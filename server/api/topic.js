const Router = require('koa-router');
const TopicModel = require('../models/topic');

const router = new Router();

router.get('/list', async function(ctx) {
    const { pageIndex, title } = ctx.query;
    try {
        const data = await TopicModel.getCount(pageIndex, title);
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

router.post('/save', async function(ctx) {
    const { title, img, id } = ctx.request.body;
    try {
        if (!title) throw new Error('项目名称不能为空');
        const model = {
            title,
            img
        };
        if (!isNaN(id) && id > 0) {
            await TopicModel.update(model, id);
        } else {
            await TopicModel.insert(model);
        }

        ctx.body = {
            code: 1,
            data: {}
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
        if (!isNaN(id) && id > 0) {
            await TopicModel.del(id);
        } else {
            throw new Error('项目不存在');
        }

        ctx.body = {
            code: 1,
            data: {}
        };
    } catch (error) {
        ctx.body = {
            code: 0,
            msg: error.message
        };
    }
});
module.exports = router.routes();
