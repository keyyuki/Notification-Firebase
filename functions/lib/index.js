"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const config_1 = require("./config");
admin.initializeApp(config_1.default.getConfig());
// Phải init firebase app ngay đầu tiên
const Sv_1 = require("./Module/Sv");
// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
exports.sv = functions.https.onRequest(Sv_1.default);
//# sourceMappingURL=index.js.map