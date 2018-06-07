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
class ServiceMock extends MockBase_mock_1.default {
    constructor() {
        super(...arguments);
        this.toStandardData = (data) => {
            return Object.assign({ name: '', code: '', token: '' }, data);
        };
        this.findByToken = (token) => __awaiter(this, void 0, void 0, function* () {
            if (!token) {
                throw new Error('Invalid param');
            }
            try {
                const snap = yield this.db.collection(ServiceMock.TABLE_NAME)
                    .where('token', '==', token)
                    .limit(1)
                    .get();
                if (snap.empty) {
                    return false;
                }
                return snap.docs.shift();
            }
            catch (error) {
                console.error('Error at ServiceMock.findByToken with params: ', { token });
                console.error(error);
                return false;
            }
        });
    }
}
ServiceMock.TABLE_NAME = 'services';
exports.default = ServiceMock;
//# sourceMappingURL=Service.mock.js.map