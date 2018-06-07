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
const MockBase_mock_1 = require("./MockBase.mock");
class Devices extends MockBase_mock_1.default {
    constructor() {
        super(...arguments);
        this.toStandardData = (data) => {
            return Object.assign({ token: '', platform: '', appId: '' }, data);
        };
        this.isExisted = (token) => __awaiter(this, void 0, void 0, function* () {
            if (!token) {
                throw new Error('Invalid param');
            }
            try {
                const snap = yield this.db.collection(Devices.TABLE_NAME)
                    .where('token', '==', token)
                    .limit(1)
                    .get();
                if (snap.empty) {
                    return false;
                }
                return snap.docs.shift();
            }
            catch (error) {
                console.error('Error at Devices.isExisted with params: ', { token });
                console.error(error);
                throw new Error('unknow error');
            }
        });
        /**
         * @returns Boolean | DocumentSnapshot (https://cloud.google.com/nodejs/docs/reference/firestore/0.13.x/DocumentSnapshot)
         */
        this.get = (id) => __awaiter(this, void 0, void 0, function* () {
            if (!id) {
                return null;
            }
            try {
                const snap = yield this.db.collection(Devices.TABLE_NAME)
                    .doc(id)
                    .get();
                if (!snap.exists) {
                    return null;
                }
                return snap;
            }
            catch (error) {
                console.error('Error at Devices.get with params: ', { id });
                console.error(error);
                return null;
            }
        });
        /**
         * @returns Boolean | DocumentSnapshot (https://cloud.google.com/nodejs/docs/reference/firestore/0.13.x/DocumentSnapshot)
         */
        this.add = (data) => __awaiter(this, void 0, void 0, function* () {
            if (!data || !data.token) {
                throw new Error('invalid param');
            }
            try {
                const snap = yield this.db.collection(Devices.TABLE_NAME)
                    .add(this.toStandardData(data));
                return snap.get();
            }
            catch (error) {
                console.error('Error at Devices.add with params: ', { data });
                console.error(error);
                throw error;
            }
        });
    }
}
Devices.TABLE_NAME = 'devices';
exports.default = Devices;
//# sourceMappingURL=Device.mock.js.map