import MockBase from './MockBase.mock';
import { DocumentSnapshot } from '@google-cloud/firestore';

export default class Apps extends MockBase 
{
    static TABLE_NAME = 'apps';    

    toStandardData = (data) => {
        return {
            name: '',
            platform: '',
            serviceId: '',
            ...data
        };
    }

    isExisted = async(name) :Promise<DocumentSnapshot | false> => {
        if(!name){
            throw new Error('Invalid param');
        }
        try {
            const snap = await this.db.collection(Apps.TABLE_NAME)
                .where('name', '==', name)
                .limit(1)
                .get();
            if(snap.empty){
                return false;
            }
            
            return snap.docs.shift();
        } catch (error) {
            console.error('Error at Apps.isExisted with params: ', {name});
            console.error(error);
            throw new Error('unknow error');    
        }
    }

    /**
     * @returns Boolean | DocumentSnapshot (https://cloud.google.com/nodejs/docs/reference/firestore/0.13.x/DocumentSnapshot)
     */
    get = async(id) : Promise<DocumentSnapshot | null>=>{
        if(!id){
            return null;        
        }
        try {
            const snap = await this.db.collection(Apps.TABLE_NAME)
                .doc(id)
                .get();
            if(!snap.exists){
                return null;
            }
            
            return snap;
        } catch (error) {
            console.error('Error at Apps.get with params: ', {id});
            console.error(error);
            return null;  
        }
    }

    /**
     * @returns Boolean | DocumentSnapshot (https://cloud.google.com/nodejs/docs/reference/firestore/0.13.x/DocumentSnapshot)
     */
    add = async(data) : Promise<DocumentSnapshot> => {
        if(!data || !data.name){
            throw new Error('invalid param');   
        }
        try {
            const snap = await this.db.collection(Apps.TABLE_NAME)
                .add(this.toStandardData(data));
            return snap.get();
        } catch (error) {
            console.error('Error at Apps.add with params: ', {data});
            console.error(error);
            throw error;
        }
    }

    
}