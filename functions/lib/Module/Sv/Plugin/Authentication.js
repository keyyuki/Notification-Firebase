"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Authentication_service_1 = require("../Service/Authentication.service");
const Service_mock_1 = require("../../../Mock/Service.mock");
const AuthenticatePlugin = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    if ((!req.headers.authorization || !req.headers.authorization.startsWith('Bearer '))) {
        res.status(403).send('Unauthorized');
        return;
    }
    const idToken = req.headers.authorization.split('Bearer ')[1];
    const serviceMock = new Service_mock_1.default();
    const snap = yield serviceMock.findByToken(idToken);
    if (snap) {
        Authentication_service_1.AuthenService.token = idToken;
        Authentication_service_1.AuthenService.setServiceSnap(snap);
        next();
        return;
    }
    res.status(403).send('Authorized Failed');
    return;
});
exports.default = AuthenticatePlugin;
//# sourceMappingURL=Authentication.js.map