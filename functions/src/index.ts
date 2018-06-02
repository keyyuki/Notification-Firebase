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

export const initialNhanhService = functions.https.onRequest((req, res) => {
    let service = new ServiceMock();
    service.isExisted('admin-nhanh')
    .then(isExisted => {
        if(!isExisted){
            service.add({
                name: 'Admin Nhanh.vn',
                code: 'admin-nhanh',
                token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiQWRtaW4gTmhhbmgudm4iLCJjb2RlIjoiYWRtaW4gbmhhbmgiLCJpYXQiOiJZVzRXZHFEd21EY29qRzJvVElxUiJ9'
            }).then(() => {
                res.send('Đã khởi tạo thành công Admin Nhanh.vn');
            });
        } else {
            res.send('Admin Nhanh.vn đã có trên hệ thống');
        }
    });
});