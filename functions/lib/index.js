"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const config_1 = require("./config");
admin.initializeApp(config_1.default.getConfig());
// Phải init firebase app ngay đầu tiên
const Sv_1 = require("./Module/Sv");
const Triggle = require("./Triggle");
const RequestQueueTriggle = require("./Triggle/RequestQueue");
// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
exports.sv = functions.https.onRequest(Sv_1.default);
exports.onDeviceTopicCreate = functions.firestore
    .document('devices-topics/{dtId}').onCreate(Triggle.onDeviceTopicCreate);
exports.onDeviceTopicDelete = functions.firestore
    .document('devices-topics/{dtId}').onDelete(Triggle.onDeviceTokenDelete);
exports.onRequestQueueCreated = functions.firestore
    .document('request-queue/{dtId}').onCreate(RequestQueueTriggle.onCreated);
exports.testfcm = functions.https.onRequest((request, response) => {
    admin.firestore().collection('accounts')
        .where('serviceId', '==', 'mas6a8wJQ1qqJB5dsiz6')
        //.orderBy('serviceId')
        .orderBy('identifier')
        //.startAfter('mas6a8wJQ1qqJB5dsiz6', 14523)
        .startAfter(14522)
        .get()
        .then((snap) => {
        if (snap.empty) {
            response.send('ok');
        }
        else {
            console.log('snap.docs.length', snap.docs.length);
            response.send('not ok');
        }
    });
});
//# sourceMappingURL=index.js.map