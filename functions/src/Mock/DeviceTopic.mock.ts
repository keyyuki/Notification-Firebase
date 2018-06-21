import MockBase from './MockBase.mock';
import { DocumentSnapshot } from 'firebase-functions/lib/providers/firestore';

export default class DeviceTopic extends MockBase 
{
    static TABLE_NAME = 'devices-topics'; 

    static STATUS_NEW = 1;
    static STATUS_SUBSCRIBE_SUCCESS = 2;
    static STATUS_SUBSCRIBE_FAILED = 3;
    static STATUS_DELETE_FAILED = 4;
    toStandardData = (data) => {
        return {
            serviceId: '',
            deviceId: '',
            topicId: '',
            deviceToken: '',
            topicCode: '',
            status: DeviceTopic.STATUS_NEW,
            ...data
        };
    }

    isExisted = async(deviceId, topicId) : Promise<DocumentSnapshot | false> => {
        if(!deviceId || !topicId){
            throw new Error('Invalid param');
        }
        try {
            const snap = await this.db.collection(DeviceTopic.TABLE_NAME)
                .where('deviceId', '==', deviceId)       
                .where('topicId', '==', topicId)          
                .limit(1)
                .get();
            if(snap.empty){
                return false;
            }           
            return snap.docs.shift();   
        } catch (error) {
            console.error('Error at DeviceTopic.isExisted with params: ', {deviceId, topicId});
            console.error(error);
            throw new Error('unknow error');    
        }
    }

    add = async(data: Object) : Promise<DocumentSnapshot> => {
        if(!data || !data['serviceId'] || !data['deviceId'] || !data['topicId']){
            throw new Error('Invalid param');
        }
        try {
            const snap = await this.db.collection(DeviceTopic.TABLE_NAME)
                .add(this.toStandardData(data));
            return snap.get();
        } catch (error) {
            console.error('Error at DeviceTopic.add with params: ', {data});
            console.error(error);
            throw error;
        }
    }

    delete = async(id : string) : Promise<Boolean> => {
        if(!id){
            throw new Error('Invalid param');
        }
        try {
            await this.db.collection(DeviceTopic.TABLE_NAME).doc(id).delete();
            return true;
        } catch (error) {
            console.error('Error at DeviceTopic.delete with params: ', {id});
            console.error(error);
            throw error;
        }

    }

    fetchAll = async(filter: Object): Promise<Array<DocumentSnapshot>> => {
        if(!filter || !filter['serviceId']){
            throw new Error('Invalid param');
        }
        try {
            let query = this.db.collection(DeviceTopic.TABLE_NAME)
                .where('serviceId', '==', filter['serviceId'])
            if(filter['topicId']){
                query = query.where('topicId', '==', filter['topicId']);
            }
            if(filter['deviceId']){
                query = query.where('deviceId', '==', filter['deviceId']);
            }
            if(filter['deviceToken']){
                query = query.where('deviceToken', '==', filter['deviceToken']);
            }
            const result = await query.get();
            if(result.empty){
                return [];
            }
            return result.docs;
        } catch (error) {
            console.error('Error at DeviceTopic.fetchAll with params: ', {filter});
            console.error(error);
            throw error;
        }
    }

    update = async (id : string, data: Object) => {
        if(!id || !data){
            throw new Error('Invalid param');
        }

        try {
            await this.db.collection(DeviceTopic.TABLE_NAME).doc(id).update(data);
            return true;
        } catch (error) {
            console.error('Error at DeviceTopic.update with params: ', {id, data});
            console.error(error);
            throw error;
        }
    }
}