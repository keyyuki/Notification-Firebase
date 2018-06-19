import MockBase from './MockBase.mock';
import { DocumentSnapshot } from 'firebase-functions/lib/providers/firestore';
//import { DocumentSnapshot } from 'firebase-functions/lib/providers/firestore';

export default class TopicMock extends MockBase
{
    static TABLE_NAME = 'topics';    
    static TYPE_SYSTEM = 1;
    static TYPE_ORGANIZATION = 2;

    static SEND_MODE_ALL = 1;
    static SEND_MODE_INDIVIDUAL = 2;

    static STATUS_ACTIVE = 'ACTIVE';
    static STATUS_INACTIVE = 'INACTIVE';
    toStandardData = (data) => {
        return {
            name: '',
            code: '',
            serviceId: '',
            organizationId: '',
            organizationIdentifier: '',
            
            isStatic: true, // xác định topic đó có phải topic mặc định như đơn hàng, bán lẻ hay ko
            status: TopicMock.STATUS_ACTIVE, // status ACTIVE và INACTIVE
            type: TopicMock.TYPE_ORGANIZATION, // enum [1 | 2], đánh dấu đây là topic của service hay organization
            sendMode: TopicMock.SEND_MODE_ALL, // enum [1 | 2], đánh dấu topic này là gửi cho tất cả account trong doanh nghiệp hay gửi riêng từng người
            ...data
        };
    }  

    isExisted = async(code): Promise<DocumentSnapshot | false> => {
        if(!code){
            throw new Error('invalid params');
        }
        try {
            const snap = await this.db.collection(TopicMock.TABLE_NAME)
                .where('code', '==', code)
                .limit(1)
                .get();
            if(snap.empty){
                return false;
            }
            return snap.docs.shift();
        } catch (error) {
            console.error('Error at TopicMock.isExisted with params: ', {code});
            console.error(error);
            throw error;
        }        
    }

    add = async(data) : Promise<DocumentSnapshot> => {
        if(!data || !data.code){
            throw new Error('invalid param');   
        }
        try {
            const snap = await this.db.collection(TopicMock.TABLE_NAME)
                .add(this.toStandardData(data));
            return snap.get();
        } catch (error) {
            console.error('Error at TopicMock.add with params: ', {data});
            console.error(error);
            throw error;
        }
    }

    get = async(id) : Promise<DocumentSnapshot | null> => {
        if(!id){
            throw new Error('Invalid param');
        }
        try {
            const snap = await this.db.collection(TopicMock.TABLE_NAME)
                .doc(id).get();
            if(!snap.exists){
                return null;
            }
            return snap;
        } catch (error) {
            console.error('Error at TopicMock.add with params: ', {id});
            console.error(error);
            throw error;
        }
    }

    checkCodeIsExisted = async(code, exceptId) : Promise<Boolean> => {
        if(!code || !exceptId){
            throw new Error('invalid params');
        }
        try {
            const snap = await this.db.collection(TopicMock.TABLE_NAME)
            .where('code', '==', code)            
            .get();
            if(snap.empty){
                return false;
            }
            let isExisted = false;
            snap.forEach(doc => {
                if(doc.id != exceptId){
                    isExisted = true;
                }
            })
            return isExisted;
        } catch (error) {
            console.error('Error at TopicMock.checkCodeIsExisted with params: ', {code, exceptId});
            console.error(error);
            throw error;
        }

    }

    update = async(id, data) : Promise<DocumentSnapshot> => {
        if(!id || !data){
            throw new Error('invalid params');
        }
        try {
            await this.db.collection(TopicMock.TABLE_NAME).doc(id).update(data);
            return await this.db.collection(TopicMock.TABLE_NAME).doc(id).get();
        } catch (error) {
            console.error('Error at TopicMock.update with params: ', {id, data});
            console.error(error);
            throw error;
        }
    }

    fetchAll = async(filter : Object) : Promise<Array<DocumentSnapshot>> => {
        if(!filter['serviceId']){
            throw new Error('invalid params');
        }
        try {
            let query =  this.db.collection(TopicMock.TABLE_NAME)
                .where('serviceId', '==', filter['serviceId']);

            if(filter['organizationId']){
                query = query.where('organizationId', '==', filter['organizationId'])
            }
            if(filter['organizationIdentifier']){
                query = query.where('organizationIdentifier', '==', filter['organizationIdentifier'])
            }                
            if(filter['status']){
                query = query.where('status', '==', filter['status']);
            }
            if(filter['sendMode']){
                query = query.where('sendMode', '==', filter['sendMode']);
            }
            if(filter['type']){
                query = query.where('type', '==', filter['type']);
            }

            const result = await query.get();
            if(result.empty){
                return [];
            }
            return result.docs;
        } catch (error) {
            console.error('Error at TopicMock.fetchAll with params: ', {filter});
            console.error(error);
            throw error;
        }
    }

    
}