"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const admin = require("firebase-admin");
class MockBase {
    constructor() {
        this.db = admin.app().firestore();
    }
}
MockBase.TABLE_NAME = '';
exports.default = MockBase;
//# sourceMappingURL=MockBase.js.map