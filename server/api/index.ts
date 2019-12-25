import Router from "koa-router";

const router = new Router();

router.all("/", function(ctx) {
    ctx.body = "不存在的接口";
});

export default router.routes();
