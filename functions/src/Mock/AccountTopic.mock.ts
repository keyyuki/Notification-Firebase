import MockBase from './MockBase.mock';
import { DocumentSnapshot } from 'firebase-functions/lib/providers/firestore';

export default class AccountTopic extends MockBase 
{
    static TABLE_NAME = 'accounts-topics'; 
    toStandardData = (data) => {
        return {
            serviceId: '',
            topicId: '',
            accountId: '',
            accountIdentifier: '',
            topicCode: '',
            ...data
        };
    }

    isExisted = async(accountId, topicId) : Promise<DocumentSnapshot | false> => {
        if(!accountId || !topicId){
            throw new Error('Invalid param');
        }
        try {
            const snap = await this.db.collection(AccountTopic.TABLE_NAME)
                .where('accountId', '==', accountId)       
                .where('topicId', '==', topicId)          
                .limit(1)
                .get();
            if(snap.empty){
                return false;
            }           
            return snap.docs.shift();   
        } catch (error) {
            console.error('Error at AccountTopic.isExisted with params: ', {accountId, topicId});
            console.error(error);
            throw new Error('unknow error');    
        }
    }

    add = async(data: Object) : Promise<DocumentSnapshot> => {
        if(!data || !data['serviceId'] || !data['accountId'] || !data['topicId']){
            throw new Error('Invalid param');
        }
        try {
            const snap = await this.db.collection(AccountTopic.TABLE_NAME)
                .add(this.toStandardData(data));
            return snap.get();
        } catch (error) {
            console.error('Error at AccountTopic.add with params: ', {data});
            console.error(error);
            throw error;
        }
    }

    fetchAll = async(filter: Object): Promise<Array<DocumentSnapshot>> => {
        if(!filter || !filter['serviceId']){
            throw new Error('Invalid param');
        }
        try {
            let query = this.db.collection(AccountTopic.TABLE_NAME)
                .where('serviceId', '==', filter['serviceId'])
            if(filter['topicId']){
                query = query.where('topicId', '==', filter['topicId']);
            }
            if(filter['accountId']){
                query = query.where('accountId', '==', filter['accountId']);
            }
            if(filter['accountIdentifier']){
                query = query.where('accountIdentifier', '==', filter['accountIdentifier']);
            }
            const result = await query.get();
            if(result.empty){
                return [];
            }
            return result.docs;
        } catch (error) {
            console.error('Error at AccountTopic.fetchAll with params: ', {filter});
            console.error(error);
            throw error;
        }
    }

    getTotalAccountOfTopic = async(topicId) : Promise<number> => {
        if(!topicId){
            return 0;
        }
        const snap = await this.db.collection(AccountTopic.TABLE_NAME).select()
            .where('topicId', '==', topicId)
            .get();
        return snap.size;
    }

    search = async(filter: Object): Promise<Array<DocumentSnapshot>> => {
        if(!filter || !filter['serviceId']){
            throw new Error('Invalid param');
        }
        try {
            let query = this.db.collection(AccountTopic.TABLE_NAME)
                .where('serviceId', '==', filter['serviceId'])
                .orderBy('accountIdentifier', 'desc')
                .limit(50);
            if(filter['topicId']){
                query = query.where('topicId', '==', filter['topicId']);
            }
            if(filter['accountId']){
                query = query.where('accountId', '==', filter['accountId']);
            }
            if(filter['accountIdentifier']){
                query = query.where('accountIdentifier', '==', filter['accountIdentifier']);
            }
            if(filter['pageToken']){
                query = query.where('accountIdentifier', '<', filter['pageToken']);
            }
            
            const result = await query.get();
            if(result.empty){
                return [];
            }
            return result.docs;
        } catch (error) {
            console.error('Error at AccountTopic.search with params: ', {filter});
            console.error(error);
            throw error;
        }
    }
}