import { DocumentSnapshot } from "firebase-functions/lib/providers/firestore";
import AccountMock  from '../../Mock/Account.mock';
import AccountDeviceMock from '../../Mock/AccountDevice.mock';
import DeviceTopicMock from '../../Mock/DeviceTopic.mock';
import RequestQueueMock from '../../Mock/RequestQueue.mock';



const onAccountUnsubcribeAll = async(createdSnap : DocumentSnapshot, context) : Promise<Boolean> => 
{
    try {
        const requestQueueMock = new RequestQueueMock();       
        

        if(!createdSnap.get('body') || !createdSnap.get('serviceId')){
            await requestQueueMock.update(createdSnap.id, {
                status: RequestQueueMock.STATUS_RESOLVER_ERROR,
                error: JSON.stringify({messages: ['Invalid Param']}),
                updatedDateTime: new Date()
            })
            return false;
        }
        const body = JSON.parse(createdSnap.get('body'));
        if(!body || !body['accountIdentifier']){
            await requestQueueMock.update(createdSnap.id, {
                status: RequestQueueMock.STATUS_RESOLVER_ERROR,
                error: JSON.stringify({messages: ['Invalid Param']}),
                updatedDateTime: new Date()
            })
            return false;
        }

        // 1. Tìm kiếm account theo accountIdentifier, nạp vào biến account
        const accountMock = new AccountMock();
        const account = await accountMock.getByIdentifier(body['accountIdentifier'], createdSnap.get('serviceId'));
        if(!account){
            await requestQueueMock.update(createdSnap.id, {
                status: RequestQueueMock.STATUS_RESOLVER_ERROR,
                error: JSON.stringify({messages: ['Not found account']}),
                updatedDateTime: new Date()
            })
            return false;
        }

        //2. Tìm trong bảng account-devices các record có accountId=account.id
        const accountDeviceMock = new AccountDeviceMock();
        const accountDeviceArray = await accountDeviceMock.fetchAllByAccount(account.id);

        //3. duyệt hết các record vừa tìm được. 
        const deviceTopicMock = new DeviceTopicMock();
        for (const accountDeviceDoc of accountDeviceArray) {
            //4. Tìm các device-topic có deviceId=accountDevice.deviceId
            const deviceTopics = await deviceTopicMock.fetchAll({
                serviceId: createdSnap.get('serviceId'),
                deviceId: accountDeviceDoc.get('deviceId')
            });

            // 4.1 Lặp duyệt các device-topic vừa tìm thấy
            for (const deviceTopic of deviceTopics) {                
                //4.3 Xóa record device topic
                await deviceTopicMock.delete(deviceTopic.id);                    
            }            
        }

        //5. cập nhật status=resolved cho requestQueue
         
        await requestQueueMock.update(createdSnap.id, {
            status: RequestQueueMock.STATUS_RESOLVER_SUCCESS,
            updatedDateTime: new Date()
        })
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
    return true;
}

export const onCreated = async(createdSnap : DocumentSnapshot, context) => {
    if(!createdSnap.get('type')){
        return false;
    }
    switch (createdSnap.get('type')) {
        case RequestQueueMock.TYPE_ACCOUNT_UNSUBCRIBE_ALL:
            return onAccountUnsubcribeAll(createdSnap, context);
        default:
            return false;            
    }
}