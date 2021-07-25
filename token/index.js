const Koa = require("koa");
const router = require("koa-router")();
const static = require("koa-static");
const bodyParser = require("koa-bodyparser");
const jwt = require("jsonwebtoken");
const jwtAuth = require("koa-jwt");
const secret = "hello token";

const app = new Koa();

app.use(bodyParser());
app.use(static(__dirname, "/"));


router.post("/login-token", async ctx => {
    const { body } = ctx.request;
    const userinfo = body.username;
    ctx.body = {
        message: "登录成功",
        user: userinfo,
        token: jwt.sign({
            data: userinfo,
            exp: Math.floor(Date.now() / 1000) + 60 * 60 // 秒
        }, secret)
    }
});

router.get(
    "/getUser-token",
    jwtAuth({ secret }),
    async ctx => {
        console.log(ctx.state.user);
        ctx.body = {
            message: "获取数据成功",
            userinfo: ctx.state.user.data
        }
    });


app.use(router.routes());
// app.use(router.allowedMethods());

app.listen(3000);
