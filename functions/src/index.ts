import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import globalConfig from './config';
admin.initializeApp(globalConfig.getConfig());
// Phải init firebase app ngay đầu tiên
import svModule from './Module/Sv';

import * as Triggle from './Triggle';
import * as RequestQueueTriggle from './Triggle/RequestQueue';


// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//

export const sv = functions.https.onRequest(svModule);

export const onDeviceTopicCreate = functions.firestore
    .document('devices-topics/{dtId}').onCreate(Triggle.onDeviceTopicCreate);

export const onDeviceTopicDelete = functions.firestore
    .document('devices-topics/{dtId}').onDelete(Triggle.onDeviceTokenDelete);

export const onRequestQueueCreated = functions.firestore
    .document('request-queue/{dtId}').onCreate(RequestQueueTriggle.onCreated);

export const testfcm = functions.https.onRequest((request, response) => {
    admin.firestore().collection('accounts')
        .where('serviceId', '==', 'mas6a8wJQ1qqJB5dsiz6')
        //.orderBy('serviceId')
        .orderBy('identifier')
        //.startAfter('mas6a8wJQ1qqJB5dsiz6', 14523)
        .startAfter(14522)
        .get()
        .then((snap) => {
            if(snap.empty){
                response.send('ok');
            } else {
                console.log('snap.docs.length', snap.docs.length);
                response.send('not ok');
            }
        })
})