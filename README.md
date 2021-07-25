# node鉴权
> cookie、session的介绍，koa实现redis存储session信息，以及使用koa实现简单的session的登陆认证！

## token原理

Bearer Token包含三个组成部分：`令牌头`、`payload`、`哈希`
> eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoidGVzdCIsImV4cCI6MTYyNzIyNTMzNiwiaWF0IjoxNjI3MjIxNzM2fQ.lePL9rI-92upu0H0aiinR-3Moj9kMu_KEWsoajlZLpA

* 签名：默认使用base64对payload编码，使用hs256算法对令牌头、payload和密钥进行签名生成哈希
* 验证：默认使用hs256算法对hs256算法对令牌中数据签名并将结果和令牌中哈希比对