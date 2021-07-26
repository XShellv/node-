const jwt = require("jsonwebtoken");

const secret = "1234567890";

const opt = {
    secret: "hello jwt",
    key: "user"
}

const user = {
    username: "xiaowuxu",
    password: "199453xxw"
}

const token = jwt.sign({
    data: user,
    exp: Math.floor(Date.now() / 1000) + (60 * 60)
}, secret);

console.log(token);

console.log(jwt.verify(token, secret, opt))

