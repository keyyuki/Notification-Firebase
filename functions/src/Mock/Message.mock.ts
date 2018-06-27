import MockBase from './MockBase.mock';
import { DocumentSnapshot } from 'firebase-functions/lib/providers/firestore';

export default class MessageMock extends MockBase 
{
    static TABLE_NAME = 'messages';    

    static STATUS_NEW = 'new';
    static STATUS_FCM_FAILED = 'fcm.failed';
    static STATUS_FCM_SUCCESS = 'fcm.success';

    static SENDTYPE_TOPIC = 'topic';
    static SENDTYPE_INDIVIDUAL = 'individual';


    toStandardData = (data) => {
        return {
            serviceId: '',
            topicId: '',
            topicCode: '',
            organizationId: '',
            organizationIdentifier: '',
            senderAccountIdentifier: '',
            title: '',
            body: '',
            fcmRequest: '',
            formData: '',

            status: MessageMock.STATUS_NEW,
            sendType: '',
            
            createdDateTime: new Date(),
            updatedDateTime: new Date(),
            ...data
        };
    }

    add = async(data) => {
        if(!data ||  !data.serviceId){
            throw new Error('invalid param');   
        }
        try {
            const snap = await this.db.collection(MessageMock.TABLE_NAME)
                .add(this.toStandardData(data));
            return await snap.get();
        } catch (error) {
            console.error('Error at Messages.add with params: ', {data});
            console.error(error);
            throw new Error('onAdd Messages error');   
        }
    }

    update = async(id, data) => {
        if(!id || !data ){
            throw new Error('invalid param');   
        }
        try {
            const snap = await this.db.collection(MessageMock.TABLE_NAME).doc(id).update(data);
            
            return snap;
        } catch (error) {
            console.error('Error at Accounts.update with params: ', {id, data});
            console.error(error);
            return false;
        }
    }
}