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
class AccountsDevices extends MockBase_mock_1.default {
    constructor() {
        super(...arguments);
        this.toStandardData = (data) => {
            return Object.assign({ accountId: '', deviceId: '', accountIdentifier: '', deviceToken: '' }, data);
        };
        this.isExisted = (accountId, deviceId) => __awaiter(this, void 0, void 0, function* () {
            if (!accountId || !deviceId) {
                throw new Error('Invalid param');
            }
            try {
                const snap = yield this.db.collection(AccountsDevices.TABLE_NAME)
                    .where('accountId', '==', accountId)
                    .where('deviceId', '==', deviceId)
                    .limit(1)
                    .get();
                if (snap.empty) {
                    return false;
                }
                this.currentDoc = snap.docs.shift();
                return this.currentDoc;
            }
            catch (error) {
                console.error('Error at AccountsDevices.isExisted with params: ', { accountId, deviceId });
                console.error(error);
                throw new Error('unknow error');
            }
        });
        this.isExistedByIdentifierAndToken = (accountIdentifier, deviceToken) => __awaiter(this, void 0, void 0, function* () {
            if (!accountIdentifier || !deviceToken) {
                throw new Error('Invalid param');
            }
            try {
                const snap = yield this.db.collection(AccountsDevices.TABLE_NAME)
                    .where('accountIdentifier', '==', accountIdentifier)
                    .where('deviceToken', '==', deviceToken)
                    .limit(1)
                    .get();
                if (snap.empty) {
                    return false;
                }
                this.currentDoc = snap.docs.shift();
                return this.currentDoc;
            }
            catch (error) {
                console.error('Error at AccountsDevices.isExistedByIdentifierAndToken with params: ', { accountIdentifier, deviceToken });
                console.error(error);
                throw new Error('unknow error');
            }
        });
        /**
         * @returns Boolean | DocumentSnapshot (https://cloud.google.com/nodejs/docs/reference/firestore/0.13.x/DocumentSnapshot)
         */
        this.get = (id) => __awaiter(this, void 0, void 0, function* () {
            if (!id) {
                throw new Error('invalid param');
            }
            try {
                const snap = yield this.db.collection(AccountsDevices.TABLE_NAME)
                    .doc(id)
                    .get();
                if (!snap.exists) {
                    return false;
                }
                this.currentDoc = snap;
                return this.currentDoc;
            }
            catch (error) {
                console.error('Error at AccountsDevices.get with params: ', { id });
                console.error(error);
                return false;
            }
        });
        /**
         * @returns Boolean | DocumentSnapshot (https://cloud.google.com/nodejs/docs/reference/firestore/0.13.x/DocumentSnapshot)
         */
        this.add = (data) => __awaiter(this, void 0, void 0, function* () {
            if (!data || !data.email) {
                throw new Error('invalid param');
            }
            try {
                const snap = yield this.db.collection(AccountsDevices.TABLE_NAME)
                    .add(this.toStandardData(data));
                return snap;
            }
            catch (error) {
                console.error('Error at AccountsDevices.add with params: ', { data });
                console.error(error);
                return false;
            }
        });
        /**
         * Hàm update sẽ cập nhật thêm field vào cho document
         * @returns Boolean | DocumentSnapshot (https://cloud.google.com/nodejs/docs/reference/firestore/0.13.x/DocumentSnapshot)
         */
        this.update = (id, data) => __awaiter(this, void 0, void 0, function* () {
            if (!id || !data) {
                throw new Error('invalid param');
            }
            try {
                const snap = yield this.db.collection(AccountsDevices.TABLE_NAME).doc(id).update(data);
                return snap;
            }
            catch (error) {
                console.error('Error at AccountsDevices.update with params: ', { id, data });
                console.error(error);
                return false;
            }
        });
        /**
         * hàm set sẽ set lại toàn bộ giá trị cho document
         * @returns Boolean | DocumentSnapshot (https://cloud.google.com/nodejs/docs/reference/firestore/0.13.x/DocumentSnapshot)
         */
        this.set = (id, data) => __awaiter(this, void 0, void 0, function* () {
            if (!id || !data || !data.nhanhUserId || !data.deviceToken) {
                throw new Error('invalid param');
            }
            try {
                const snap = yield this.db.collection(AccountsDevices.TABLE_NAME).doc(id).set(data);
                return snap;
            }
            catch (error) {
                console.error('Error at AccountsDevices.set with params: ', { id, data });
                console.error(error);
                return false;
            }
        });
    }
}
AccountsDevices.TABLE_NAME = 'accounts-devices';
exports.default = AccountsDevices;
//# sourceMappingURL=AccountDevice.mock.js.map