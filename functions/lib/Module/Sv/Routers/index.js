"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const Authentication_service_1 = require("../Service/Authentication.service");
const app = express.Router();
app.post('/create-topic', (request, response) => {
    response.send(Authentication_service_1.AuthenService.token);
});
exports.default = app;
//# sourceMappingURL=index.js.map