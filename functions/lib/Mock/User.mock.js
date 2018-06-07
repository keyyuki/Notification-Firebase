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
class UserModel extends MockBase_mock_1.default {
    constructor() {
        super(...arguments);
        this.toStandardData = (data) => {
            return Object.assign({ email: '', fullName: '' }, data);
        };
        this.get = (id) => __awaiter(this, void 0, void 0, function* () {
            if (!id) {
                return null;
            }
            try {
                const snap = yield this.db.collection(UserModel.TABLE_NAME)
                    .doc(id)
                    .get();
                if (!snap.exists) {
                    return null;
                }
                return snap;
            }
            catch (error) {
                console.error('Error at UserModel.get with params: ', { id });
                console.error(error);
                return null;
            }
        });
        this.getByEmail = (email) => __awaiter(this, void 0, void 0, function* () {
            if (!email) {
                return null;
            }
            try {
                const snap = yield this.db.collection(UserModel.TABLE_NAME)
                    .where('email', '==', email)
                    .limit(1)
                    .get();
                if (snap.empty) {
                    return null;
                }
                return snap.docs.shift();
            }
            catch (error) {
                console.error('Error at UserModel.getByEmail with params: ', { email });
                console.error(error);
                return null;
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
                const ref = yield this.db.collection(UserModel.TABLE_NAME)
                    .add(this.toStandardData(data));
                const snap = yield ref.get();
                return snap;
            }
            catch (error) {
                console.error('Error at UserModel.add with params: ', { data });
                console.error(error);
                throw error;
            }
        });
    }
}
UserModel.TABLE_NAME = 'users';
exports.default = UserModel;
//# sourceMappingURL=User.mock.js.map