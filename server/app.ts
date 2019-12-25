import Koa from "koa";
import Router from "koa-router";
import KoaBody from "koa-body";
import config from "config";

import RunTimeMiddle from "./middleware/run_time";

import test from "./api/index";

const app = new Koa();
const router = new Router();
const port = config.get("port");

app.use(
    KoaBody({
        multipart: true,
        formidable: {
            maxFieldsSize: 5 * 1024 * 1024
        }
    })
);

app.use(RunTimeMiddle);

router.use("/", test);

app.use(router.routes()).use(router.allowedMethods());

app.listen(port, function() {
    console.log(`服务器运行在http://127.0.0.1:${port}`);
});
