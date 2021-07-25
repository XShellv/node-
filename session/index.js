const Koa = require("koa");
const static = require("koa-static");
const router = require('koa-router')();
const bodyParser = require("koa-bodyparser");
const session = require('koa-session');
const app = new Koa();

app.keys = ["hello koa"];

app.use(static(__dirname + '/'));
app.use(session(app));
app.use(bodyParser());


app.use(async (ctx, next) => {
    if (ctx.path.indexOf("/login") > -1) {
        await next();
    } else {
        if (ctx.session.userinfo) {
            await next();
        } else {
            ctx.body = {
                message: "登陆失败！"
            }
        }
    }
});

router.post("/login", async (ctx, next) => {
    const { body } = ctx.request;
    const { username, password } = body;
    ctx.session.userinfo = username;
    ctx.body = {
        message: "登陆成功"
    }
});

router.post("/logout", async (ctx, next) => {
    delete ctx.session.userinfo;
    ctx.body = {
        message: "登出系统"
    }
})

router.get("/getUser", async (ctx, next) => {
    ctx.body = {
        message: "获取数据成功",
        userinfo: ctx.session.userinfo
    }
})

app.use(router.routes());

app.listen(3000)