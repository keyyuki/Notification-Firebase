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
                return snap.docs.shift();
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
                return snap.docs.shift();
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
                return null;
            }
            try {
                const snap = yield this.db.collection(AccountsDevices.TABLE_NAME)
                    .doc(id)
                    .get();
                if (!snap.exists) {
                    return null;
                }
                return snap;
            }
            catch (error) {
                console.error('Error at AccountsDevices.get with params: ', { id });
                console.error(error);
                return null;
            }
        });
        /**
         * @returns Boolean | DocumentSnapshot (https://cloud.google.com/nodejs/docs/reference/firestore/0.13.x/DocumentSnapshot)
         */
        this.add = (data) => __awaiter(this, void 0, void 0, function* () {
            if (!data || !data.accountId || !data.deviceId || !data.accountIdentifier || !data.deviceToken) {
                throw new Error('invalid param');
            }
            try {
                const snap = yield this.db.collection(AccountsDevices.TABLE_NAME)
                    .add(this.toStandardData(data));
                return snap.get();
            }
            catch (error) {
                console.error('Error at AccountsDevices.add with params: ', { data });
                console.error(error);
                throw error;
            }
        });
        this.getAllByDeviceIdExceptAccountId = (deviceId, exceptAccountId) => __awaiter(this, void 0, void 0, function* () {
            if (!deviceId || !exceptAccountId) {
                throw new Error('invalid param');
            }
            const snap = yield this.db.collection(AccountsDevices.TABLE_NAME)
                .where('deviceId', '==', deviceId)
                .where('accountId', '>', exceptAccountId)
                .where('accountId', '<', exceptAccountId)
                .get();
            if (snap.empty) {
                return null;
            }
            return snap.docs;
        });
        this.fetchAllByAccount = (accountId) => __awaiter(this, void 0, void 0, function* () {
            if (!accountId) {
                return [];
            }
            try {
                const snap = yield this.db.collection(AccountsDevices.TABLE_NAME)
                    .where('accountId', '==', accountId)
                    .get();
                if (snap.empty) {
                    return [];
                }
                return snap.docs;
            }
            catch (error) {
                return [];
            }
        });
    }
}
AccountsDevices.TABLE_NAME = 'accounts-devices';
exports.default = AccountsDevices;
//# sourceMappingURL=AccountDevice.mock.js.map