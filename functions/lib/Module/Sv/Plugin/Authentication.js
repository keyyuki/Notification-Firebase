"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Authentication_service_1 = require("../Service/Authentication.service");
const Service_mock_1 = require("../../../Mock/Service.mock");
const AuthenticatePlugin = (req, res, next) => {
    if ((!req.headers.authorization || !req.headers.authorization.startsWith('Bearer '))) {
        res.status(403).send('Unauthorized');
        return;
    }
    const idToken = req.headers.authorization.split('Bearer ')[1];
    const serviceMock = new Service_mock_1.default();
    if (serviceMock.findByToken(idToken)) {
        Authentication_service_1.AuthenService.token = idToken;
        Authentication_service_1.AuthenService.serviceSnap = serviceMock.getCurrentDoc();
        next();
        return;
    }
    res.status(403).send('Authorized Failed');
    return;
};
exports.default = AuthenticatePlugin;
//# sourceMappingURL=Authentication.js.map