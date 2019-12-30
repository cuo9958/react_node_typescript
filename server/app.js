const Koa = require('koa');
const Router = require('koa-router');
const KoaBody = require('koa-body');
const config = require('config');
const RunTimeMiddle = require('./middleware/run_time');

const app = new Koa();
const router = new Router();
const port = config.get('port');

app.use(
    KoaBody({
        multipart: true,
        formidable: {
            maxFieldsSize: 5 * 1024 * 1024
        }
    })
);

app.use(RunTimeMiddle);

const test = require('./api/index');
const user = require('./api/user');
const topic = require('./api/topic');

router.use('/api_user/user', user);
router.use('/api_user/topic', topic);
router.use('/api_user', test);

app.use(router.routes()).use(router.allowedMethods());

app.listen(port, function() {
    console.log(`服务器运行在http://127.0.0.1:${port}`);
});
