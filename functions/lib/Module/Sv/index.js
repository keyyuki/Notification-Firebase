"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const Authentication_1 = require("./Plugin/Authentication");
const Routes_1 = require("./Routes");
const cookieParse = require('cookie-parser')();
const cors = require('cors')({ origin: true });
const bodyParser = require('body-parser');
const app = express();
// enable cross domain
app.use(cors);
// enable cookie parser
app.use(cookieParse);
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
// implement custom authentication
app.use(Authentication_1.default);
// regis router manage/ 
app.use('/manage', Routes_1.default);
app.get('/', (req, res) => {
    res.send('please use route /manage !');
    return true;
});
app.use(function (req, res, next) {
    res.status(404).send({ code: 0, messages: ['404 Page not found'] });
});
exports.default = app;
//# sourceMappingURL=index.js.map