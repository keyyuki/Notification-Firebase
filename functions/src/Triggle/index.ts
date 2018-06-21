import * as admin from 'firebase-admin';
import { DocumentSnapshot } from 'firebase-functions/lib/providers/firestore';
import DeviceTopicMock from '../Mock/DeviceTopic.mock';


const wait = (second) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(true)
        }, second*1000);
    })
}

/**
 * 
 * @param snap 
 * @param context 
 * Xử lí khi 1 deviceTopic được tạo ra. Khi đó sẽ subcribe device vào taopic đó
 * Tuy nhiên như cảnh báo của FCM, việc đăng kí này có thể xảy ra lỗi
 * nên cần 1 quy trình xử lí nếu xảy ra lỗi. Khi đó sẽ thử đăng kí lại sau mỗi khoảng 1s - 2s - 3s
 * nếu sau 3 lần vẫn không đăng kí dc thì ghi nhận đăng kí thất bại để xử lí bằng tay về sau
 */
export const onDeviceTopicCreate = async (snap : DocumentSnapshot, context) : Promise<Boolean>=> 
{    
    //1 Kiểm tra status của record.status == success
    if(snap.get('status') === DeviceTopicMock.STATUS_SUBSCRIBE_SUCCESS){        
        return false;
    }

    // 2. Lặp for index 1-> 3
    
    for (let index = 1; index <= 3; index++) {        
        //3. subcribe record.deviceToken vào record.topicCode
        try {
            const isSuccess = await admin.messaging()
                .subscribeToTopic([snap.get('deviceToken')], snap.get('topicCode'));            

            if(!isSuccess.failureCount){
                // 4. update record.status = success, record.error = null
                await snap.ref.update({
                    status: DeviceTopicMock.STATUS_SUBSCRIBE_SUCCESS,
                    error: admin.firestore.FieldValue.delete(),   
                    updatedDateTime: new Date()                 
                })
                return true;
            } else {
                
                //5. update record.status == error, record.error = error trả về
                await snap.ref.update({
                    status: DeviceTopicMock.STATUS_SUBSCRIBE_FAILED,
                    error: JSON.stringify(isSuccess.errors),
                    updatedDateTime: new Date()   
                })

                // 5.1. Kiểm tra responseFcm.error.code == ‘messaging/server-unavailable’
                if(isSuccess.errors && isSuccess.errors['code'] === 'messaging/server-unavailable'){
                    
                    //6. wait index*1000 ms
                    // nếu là bước lặp cuối cùng thì không cần đợi nữa
                    if(index === 3){
                        continue;
                    }
                    await wait(index);
                    continue;
                } else {
                    return false;
                }
            }
        } catch (error) {
            
            //5. update record.status == error, record.error = error trả về
            await snap.ref.update({
                status: DeviceTopicMock.STATUS_SUBSCRIBE_FAILED,
                error: error
            })

            //6. wait index*1000 ms
            // nếu là bước lặp cuối cùng thì không cần đợi nữa
            if(index === 3){
                continue;
            }
            await wait(index);
        }
    }
    return false;

}

export const onDeviceTokenDelete = async(snap : DocumentSnapshot, context) : Promise<Boolean> => {
    //1. for index 1->3
    let errorRuntime;
    for (let index = 1; index < 3; index++) {
        try {
            //2. call fcm để un-subcribe device khỏi topic
            const isSuccess = await admin.messaging()
            .unsubscribeFromTopic([snap.get('deviceToken')], snap.get('topicCode')); 
            
            if(!isSuccess.failureCount){
                return true;
            } else {
                //2.1 kiểm tra fcmResponse.errors.code == ‘messaging/server-unavailable’
                if(isSuccess.errors && isSuccess.errors['code'] === 'messaging/server-unavailable'){
                    // nếu là bước lặp cuối cùng thì không cần đợi nữa
                    if(index === 3){
                        continue;
                    }
                    await wait(index);
                } else {
                    //2.2 Gán errorRuntime = fcmResponse.errors
                    errorRuntime = isSuccess.errors;
                    break;
                }
            }
        } catch (error) {
            errorRuntime = error;
            break;
        }
    }

    await admin.firestore().doc(DeviceTopicMock.TABLE_NAME + '/' + snap.id).set({
        ...snap.data(),
        status: DeviceTopicMock.STATUS_DELETE_FAILED,
        updatedDateTime: new Date(),
        error : JSON.stringify(errorRuntime)
    });
    
    return false;
}