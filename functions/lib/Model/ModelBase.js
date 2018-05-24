"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const admin = require("firebase-admin");
class ModelBase {
    constructor() {
        this.db = admin.app().firestore();
    }
}
ModelBase.TABLE_NAME = '';
exports.default = ModelBase;
//# sourceMappingURL=ModelBase.js.map