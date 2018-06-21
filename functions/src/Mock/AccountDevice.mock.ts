import MockBase from './MockBase.mock';
import { DocumentSnapshot } from 'firebase-functions/lib/providers/firestore';

export default class AccountsDevices extends MockBase 
{
    static TABLE_NAME = 'accounts-devices';    

    toStandardData = (data) => {
        return {
            accountId: '',
            deviceId: '',
            accountIdentifier: '',
            deviceToken: '',
            ...data
        };
    }

    isExisted = async(accountId, deviceId) : Promise<DocumentSnapshot | false> => {
        if(!accountId || !deviceId){
            throw new Error('Invalid param');
        }
        try {
            const snap = await this.db.collection(AccountsDevices.TABLE_NAME)
                .where('accountId', '==', accountId)       
                .where('deviceId', '==', deviceId)          
                .limit(1)
                .get();
            if(snap.empty){
                return false;
            }           
            return snap.docs.shift();   
        } catch (error) {
            console.error('Error at AccountsDevices.isExisted with params: ', {accountId, deviceId});
            console.error(error);
            throw new Error('unknow error');    
        }
    }

    isExistedByIdentifierAndToken = async(accountIdentifier, deviceToken) : Promise<DocumentSnapshot | false> => {
        if(!accountIdentifier || !deviceToken){
            throw new Error('Invalid param');
        }
        try {
            const snap = await this.db.collection(AccountsDevices.TABLE_NAME)
                .where('accountIdentifier', '==', accountIdentifier)       
                .where('deviceToken', '==', deviceToken)          
                .limit(1)
                .get();
            if(snap.empty){
                return false;
            }              
            return snap.docs.shift(); 
        } catch (error) {
            console.error('Error at AccountsDevices.isExistedByIdentifierAndToken with params: ', {accountIdentifier, deviceToken});
            console.error(error);
            throw new Error('unknow error');    
        }
    }

    /**
     * @returns Boolean | DocumentSnapshot (https://cloud.google.com/nodejs/docs/reference/firestore/0.13.x/DocumentSnapshot)
     */
    get = async(id) : Promise<DocumentSnapshot | null> =>{
        if(!id){
            return null;   
        }
        try {
            const snap = await this.db.collection(AccountsDevices.TABLE_NAME)
                .doc(id)
                .get();
            if(!snap.exists){
                return null;
            }            
            return snap;
        } catch (error) {
            console.error('Error at AccountsDevices.get with params: ', {id});
            console.error(error);
            return null;
        }
    }

    /**
     * @returns Boolean | DocumentSnapshot (https://cloud.google.com/nodejs/docs/reference/firestore/0.13.x/DocumentSnapshot)
     */
    add = async(data) : Promise<DocumentSnapshot> => {
        if(!data || !data.accountId || !data.deviceId || !data.accountIdentifier || !data.deviceToken){
            throw new Error('invalid param');   
        }
        try {
            const snap = await this.db.collection(AccountsDevices.TABLE_NAME)
                .add(this.toStandardData(data));
            return snap.get();
        } catch (error) {
            console.error('Error at AccountsDevices.add with params: ', {data});
            console.error(error);
            throw error;
        }
    }

    getAllByDeviceIdExceptAccountId = async(deviceId: String, exceptAccountId : String) : Promise<Array<DocumentSnapshot> | null>=> {
        if(!deviceId || !exceptAccountId)        {
            throw new Error('invalid param');
        }
        const snap = await this.db.collection(AccountsDevices.TABLE_NAME)
            .where('deviceId', '==', deviceId)
            .where('accountId', '>', exceptAccountId)
            .where('accountId', '<', exceptAccountId)
            .get()
        if(snap.empty){
            return null;
        }
        return snap.docs;
    }

    fetchAllByAccount = async(accountId: string) : Promise<Array<DocumentSnapshot>> => {
        if(!accountId){
            return [];
        }
        try {
            const snap = await this.db.collection(AccountsDevices.TABLE_NAME)
            .where('accountId', '==', accountId)
            .get();
            if(snap.empty){
                return [];
            }
            return snap.docs;
        } catch (error) {
            return [];
        }
    }
}