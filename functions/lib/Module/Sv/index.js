"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const Authentication_1 = require("./Plugin/Authentication");
const Routers_1 = require("./Routers");
const Service_mock_1 = require("../../Mock/Service.mock");
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
app.use('/manage', Routers_1.default);
app.get('/', (req, res) => {
    res.send('please use route /manage !');
    return true;
});
app.get('/initialNhanhService', (req, res) => {
    let service = new Service_mock_1.default();
    service.isExisted('admin-nhanh')
        .then(isExisted => {
        if (isExisted) {
            service.add({
                name: 'Admin Nhanh.vn',
                code: 'admin-nhanh',
                token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiQWRtaW4gTmhhbmgudm4iLCJjb2RlIjoiYWRtaW4gbmhhbmgiLCJpYXQiOiJZVzRXZHFEd21EY29qRzJvVElxUiJ9'
            }).then(() => {
                res.send('Đã khởi tạo thành công Admin Nhanh.vn');
            });
        }
        else {
            res.send('Admin Nhanh.vn đã có trên hệ thống');
        }
    });
});
exports.default = app;
//# sourceMappingURL=index.js.map