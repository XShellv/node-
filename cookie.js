const http = require("http");

let session = {};

http.createServer((req, res) => {
    if (req.url === "/favicon.ico") {
        res.end("");
        return
    }
    // console.log(req.headers.cookie);
    const sessionKey = "sid";
    const cookie = req.headers.cookie;
    if (cookie && cookie.indexOf(sessionKey) > -1) {
        // 已经来过了
        res.end("come back");
        const pattern = new RegExp(`${sessionKey}=([^;]+);?\s*`);
        const sid = pattern.exec(cookie)[1];
        console.log(sid,session[sid])
    } else {
        // 没来过
        const sid = (Math.random() * 999999).toFixed();
        session[sid] = { "name": "xxw" };
        res.setHeader("Set-Cookie",`${sessionKey}=${sid}`)
        res.end("hello")
    }
    // res.setHeader("Set-Cookie","cookie1=abc;");
    // res.end("hello cookie!");
}).listen(3000, () => {
    console.log("server start at 3000")
})