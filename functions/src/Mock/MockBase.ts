import * as admin from 'firebase-admin';
class MockBase {
    static TABLE_NAME = '';
    db = admin.app().firestore();
}

export default MockBase;