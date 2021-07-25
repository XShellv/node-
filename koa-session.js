const Koa = require("koa");
const session = require("koa-session");

const app = new Koa();
app.keys = ["hello", "koa"];

const SESSION_CONFIG = {
    key: "koa-session",
    maxAge: 86400000,
    httpOnly: true,
    sign: true
}

app.use(session(SESSION_CONFIG, app));

app.use(ctx => {
    if (ctx.path === "/favicon.ico") return;
    let n = ctx.session.count || 0;
    ctx.session.count = ++n;
    ctx.body = `第${n}次访问`;
})


app.listen(3000)