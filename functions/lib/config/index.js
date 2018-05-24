"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const EVN = 'development';
// const EVN = 'application';
const admin = require("firebase-admin");
exports.default = {
    getConfig: () => {
        let config = null;
        let serviceAccount = null;
        if (EVN == 'development') {
            serviceAccount = require("../../config/development/google-json-key.json");
            config = {
                credential: admin.credential.cert(serviceAccount),
                databaseURL: "https://nhanh-notification-dev.firebaseio.com",
                projectId: "nhanh-notification-dev",
                storageBucket: "nhanh-notification-dev.appspot.com",
                messagingSenderId: "820207856177"
            };
        }
        else if (EVN == 'application') {
            // chưa có môi trường thực, chưa setup dc
        }
        if (!config) {
            throw new Error('no config');
        }
        return config;
    }
};
//# sourceMappingURL=index.js.map