import MockBase from './MockBase.mock';
import { DocumentSnapshot } from 'firebase-functions/lib/providers/firestore';

export default class RequestQueue extends MockBase 
{
    static TABLE_NAME = 'request-queue'; 

    static STATUS_NEW = 1;
    static STATUS_RESOLVER_SUCCESS = 2;
    static STATUS_RESOLVER_ERROR = 3;

    static TYPE_ACCOUNT_UNSUBCRIBE_ALL = 'account.unsubcribeAll';

    toStandardData = (data) => {
        return {
            serviceId: '',
            status: RequestQueue.STATUS_NEW,
            type: '',
            body: '',
            header: '',    
            createdDateTime: new Date(),  
            updatedDateTime: null,
            ...data
        };
    }

    add = async(data: Object) : Promise<DocumentSnapshot> => {
        if(!data || !data['serviceId'] || !data['type'] ){
            throw new Error('Invalid param');
        }
        try {
            const snap = await this.db.collection(RequestQueue.TABLE_NAME)
                .add(this.toStandardData(data));
            return snap.get();
        } catch (error) {
            console.error('Error at RequestQueue.add with params: ', {data});
            console.error(error);
            throw error;
        }
    }

    update = async (id : string, data: Object) => {
        if(!id || !data){
            throw new Error('Invalid param');
        }

        try {
            await this.db.collection(RequestQueue.TABLE_NAME).doc(id).update(data);
            return true;
        } catch (error) {
            console.error('Error at DeviceTopic.update with params: ', {id, data});
            console.error(error);
            throw error;
        }
    }
}