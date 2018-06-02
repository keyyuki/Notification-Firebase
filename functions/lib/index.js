"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const config_1 = require("./config");
admin.initializeApp(config_1.default.getConfig());
// Phải init firebase app ngay đầu tiên
const Sv_1 = require("./Module/Sv");
const Service_mock_1 = require("./Mock/Service.mock");
// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
exports.sv = functions.https.onRequest(Sv_1.default);
exports.initialNhanhService = functions.https.onRequest((req, res) => {
    let service = new Service_mock_1.default();
    service.isExisted('admin-nhanh')
        .then(isExisted => {
        if (!isExisted) {
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
//# sourceMappingURL=index.js.map