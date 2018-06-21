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
class Accounts extends MockBase_mock_1.default {
    constructor() {
        super(...arguments);
        this.toStandardData = (data) => {
            return Object.assign({ serviceId: '', userId: '', identifier: '' }, data);
        };
        this.isExisted = (serviceId, userId) => __awaiter(this, void 0, void 0, function* () {
            if (!serviceId || !userId) {
                throw new Error('Invalid param');
            }
            try {
                const snap = yield this.db.collection(Accounts.TABLE_NAME)
                    .where('serviceId', '==', serviceId)
                    .where('userId', '==', userId)
                    .limit(1)
                    .get();
                if (snap.empty) {
                    return false;
                }
                return snap.docs.shift();
            }
            catch (error) {
                console.error('Error at Accounts.isExisted with params: ', { serviceId, userId });
                console.error(error);
                return false;
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
                const snap = yield this.db.collection(Accounts.TABLE_NAME)
                    .doc(id)
                    .get();
                if (!snap.exists) {
                    return null;
                }
                return snap;
            }
            catch (error) {
                console.error('Error at Accounts.get with params: ', { id });
                console.error(error);
                return null;
            }
        });
        /**
         * @returns Boolean | DocumentSnapshot (https://cloud.google.com/nodejs/docs/reference/firestore/0.13.x/DocumentSnapshot)
         */
        this.add = (data) => __awaiter(this, void 0, void 0, function* () {
            if (!data || !data.userId || !data.serviceId) {
                throw new Error('invalid param');
            }
            try {
                const snap = yield this.db.collection(Accounts.TABLE_NAME)
                    .add(this.toStandardData(data));
                return yield snap.get();
            }
            catch (error) {
                console.error('Error at Accounts.add with params: ', { data });
                console.error(error);
                throw new Error('onAdd Account error');
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
                const snap = yield this.db.collection(Accounts.TABLE_NAME).doc(id).update(data);
                return snap;
            }
            catch (error) {
                console.error('Error at Accounts.update with params: ', { id, data });
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
                const snap = yield this.db.collection(Accounts.TABLE_NAME).doc(id).set(data);
                return snap;
            }
            catch (error) {
                console.error('Error at Accounts.set with params: ', { id, data });
                console.error(error);
                return false;
            }
        });
        this.getByIdentifier = (identifier, serviceId) => __awaiter(this, void 0, void 0, function* () {
            if (!identifier || !serviceId) {
                throw new Error('invalid param');
            }
            try {
                const snaps = yield this.db.collection(Accounts.TABLE_NAME)
                    .where('identifier', '==', identifier)
                    .where('serviceId', '==', serviceId)
                    .limit(1)
                    .get();
                if (snaps.empty) {
                    return null;
                }
                return snaps.docs.shift();
            }
            catch (error) {
                console.error('Error at Accounts.getByIdentifier with params: ', { identifier, serviceId });
                console.error(error);
                throw error;
            }
        });
    }
}
Accounts.TABLE_NAME = 'accounts';
exports.default = Accounts;
//# sourceMappingURL=Account.mock.js.map