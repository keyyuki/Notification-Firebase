"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthenService = {
    token: '',
    serviceSnap: null,
    setServiceSnap: function (snap) {
        exports.AuthenService.serviceSnap = snap;
    },
    getServiceSnap: function () {
        return exports.AuthenService.serviceSnap;
    },
    getServiceId: function () {
        return exports.AuthenService.serviceSnap ? exports.AuthenService.serviceSnap.id : null;
    }
};
//# sourceMappingURL=Authentication.service.js.map