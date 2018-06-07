import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import globalConfig from './config';
admin.initializeApp(globalConfig.getConfig());
// Phải init firebase app ngay đầu tiên
import svModule from './Module/Sv';
import ServiceMock from './Mock/Service.mock';

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//

export const sv = functions.https.onRequest(svModule);

