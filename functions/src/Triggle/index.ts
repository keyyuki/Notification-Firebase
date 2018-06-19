import * as admin from 'firebase-admin';
import { DocumentSnapshot } from 'firebase-functions/lib/providers/firestore';
import DeviceTopicMock from '../Mock/DeviceTopic.mock';

export const onDeviceTopicCreate = async (snap : DocumentSnapshot, context) : Promise<Boolean>=> {
    //1 Kiểm tra status của record.status == success
    if(snap.get('status') == DeviceTopicMock.STATUS_SUBSCRIBE_SUCCESS){
        return false;
    }

    // 2. Lặp for index 1-> 3
    const deviceTopicMock = new DeviceTopicMock();
    for (let index = 1; index <= 4; index++) {
        //3. subcribe record.deviceToken vào record.topicCode
        try {
            const isSuccess = await admin.messaging()
                .subscribeToTopic([snap.get('deviceToken')], snap.get('topicCode'));
            
            return true;
        } catch (error) {
            throw error;
        }
    }
    return true;

}