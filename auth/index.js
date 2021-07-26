const Koa = require("koa");
const static = require("koa-static");
const router = require("koa-router")();
const axios = require('axios');
const querystring = require("querystring");
const jwt = require("jsonwebtoken");
const jwtAuth = require("koa-jwt");
const accessTokens = {}
const secret = "it's a secret";

const app = new Koa();
app.use(static(__dirname, "/"));

const config = {
    client_id: '0e321dad39e2b848c731',
    client_secret: '3f3c424d31670d1500603992c7a204c5600afc4a'
}

router.get("/github/login", async ctx => {
    //重定向到认证接口,并配置参数
    var path = "https://github.com/login/oauth/authorize";
    path += '?client_id=' + config.client_id;

    //转发到授权服务器
    ctx.redirect(path);
});

router.get("/github/callback", async ctx => {
    const code = ctx.query.code;
    const params = {
        client_id: config.client_id,
        client_secret: config.client_secret,
        code: code
    }
    // code换取token
    let res = await axios.post('https://github.com/login/oauth/access_token', params);
    const access_token = querystring.parse(res.data).access_token;
    console.log(access_token);

    const uid = Math.random() * 99999999;
    accessTokens[uid] = access_token;
    const token = jwt.sign({
        data: uid,
        exp: Math.floor(Date.now() / 1000) + (60 * 60)
    }, secret);

    ctx.response.type = "html";
    console.log(token);
    ctx.response.body = ` <script>window.localStorage.setItem("authSuccess","true");window.localStorage.setItem("token","${token}");window.close();</script>`;
});

router.get("/github/userinfo", jwtAuth({
    secret
}), async ctx => {
    // 验证通过，state.user
    console.log('jwt playload:', ctx.state.user)
    const access_token = accessTokens[ctx.state.user.data];
    // 拿到token后可以获取想要的数据
    res = await axios({
        method: "get",
        url: `https://api.github.com/user`,
        headers: {
            accept: "application/json",
            Authorization: `token ${access_token}`,
        },
    });
    console.log('userAccess:', res.data)
    ctx.body = res.data;
})

app.use(router.routes()); // 启动路由
app.use(router.allowedMethods());


app.listen(3000)