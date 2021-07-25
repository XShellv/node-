// const redis = require("redis");

// const client = redis.createClient(6379,"localhost");

// client.set("redis","hello redis");
// client.get("redis",(err,value)=>{
//     console.log(value)
// })
const Koa = require("koa");
const session = require("koa-session");
const redis = require("redis");
const redisStore = require("koa-redis");
const wrapper = require("co-redis");

const app = new Koa();
app.keys = ["hello", "koa"];

const redisClient = redis.createClient(6379, "localhost");
const client = wrapper(redisClient);

const SESSION_CONFIG = {
    key: "koa-session",
    maxAge: 86400000,
    httpOnly: true,
    sign: true,
    store: redisStore({ client })
}

app.use(session(SESSION_CONFIG, app));

app.use((async (ctx, next) => {
    const keys = await client.keys("*");
    console.log(keys);
    keys.forEach(async key => {
        console.log(await client.get(key))
    });
    await next()
}));

app.use((ctx, next) => {
    if (ctx.path === "/favicon.ico") return;
    let n = ctx.session.count || 0;
    ctx.session.count = ++n;
    ctx.body = `第${n}次访问`;
})


app.listen(3000)