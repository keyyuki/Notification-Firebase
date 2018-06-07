import * as admin from 'firebase-admin';


class MockBase {
    static TABLE_NAME = '';
    db = admin.app().firestore();

    currentDoc = null;

    getCurrentDoc = () : admin.firestore.DocumentSnapshot => {
        return this.currentDoc;
    }
}

export default MockBase;