// encode.js
const fs = require("fs");
const key = fs.readFileSync("./back-end-authentication-70d55-firebase-adminsdk-fbsvc-99bd52afcd.json", "utf8");
const base64 = Buffer.from(key).toString("base64");
console.log(base64);