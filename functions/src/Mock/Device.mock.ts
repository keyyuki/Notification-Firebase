import MockBase from './MockBase.mock';
import { DocumentSnapshot } from 'firebase-functions/lib/providers/firestore';

export default class Devices extends MockBase 
{
    static TABLE_NAME = 'devices';    

    toStandardData = (data) => {
        return {
            token: '',
            platform: '',
            appId: '',
            ...data
        };
    }

    isExisted = async(token) : Promise<DocumentSnapshot | false> => {
        if(!token){
            throw new Error('Invalid param');
        }
        try {
            const snap = await this.db.collection(Devices.TABLE_NAME)
                .where('token', '==', token)      
                .limit(1)
                .get();
            if(snap.empty){
                return false;
            }
           
            return snap.docs.shift();    
        } catch (error) {
            console.error('Error at Devices.isExisted with params: ', {token});
            console.error(error);
            throw new Error('unknow error');    
        }
    }

    /**
     * @returns Boolean | DocumentSnapshot (https://cloud.google.com/nodejs/docs/reference/firestore/0.13.x/DocumentSnapshot)
     */
    get = async(id) : Promise<DocumentSnapshot |null> =>{
        if(!id){
            return null;     
        }
        try {
            const snap = await this.db.collection(Devices.TABLE_NAME)
                .doc(id)
                .get();
            if(!snap.exists){
                return null;
            }
           
            return snap;
        } catch (error) {
            console.error('Error at Devices.get with params: ', {id});
            console.error(error);
            return null;
        }
    }

    /**
     * @returns Boolean | DocumentSnapshot (https://cloud.google.com/nodejs/docs/reference/firestore/0.13.x/DocumentSnapshot)
     */
    add = async(data) : Promise<DocumentSnapshot> => {
        if(!data || !data.token){
            throw new Error('invalid param');   
        }
        try {
            const snap = await this.db.collection(Devices.TABLE_NAME)
                .add(this.toStandardData(data));
            return snap.get();
        } catch (error) {
            console.error('Error at Devices.add with params: ', {data});
            console.error(error);
            throw error;
        }
    }

    
}