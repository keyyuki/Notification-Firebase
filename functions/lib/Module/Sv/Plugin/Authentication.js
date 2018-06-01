"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Authentication_service_1 = require("../Service/Authentication.service");
const AuthenticatePlugin = (req, res, next) => {
    if ((!req.headers.authorization || !req.headers.authorization.startsWith('Bearer '))) {
        res.status(403).send('Unauthorized');
        return;
    }
    const idToken = req.headers.authorization.split('Bearer ')[1];
    if (idToken == '2ddec20f4234b18dd6418ac039a35a0d') {
        Authentication_service_1.AuthenService.token = idToken;
        next();
        return;
    }
    res.status(403).send('Authorized Failed');
    return;
};
exports.default = AuthenticatePlugin;
//# sourceMappingURL=Authentication.js.map