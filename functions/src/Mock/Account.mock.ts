import MockBase from './MockBase.mock';
import { DocumentSnapshot } from 'firebase-functions/lib/providers/firestore';

export default class Accounts extends MockBase 
{
    static TABLE_NAME = 'accounts';    

    toStandardData = (data) => {
        return {
            serviceId: '',
            userId: '',
            identifier: '',
            ...data
        };
    }

    isExisted = async(serviceId, userId) : Promise<DocumentSnapshot | false>=> {
        if(!serviceId || !userId){
            throw new Error('Invalid param');
        }
        try {
            const snap = await this.db.collection(Accounts.TABLE_NAME)
                .where('serviceId', '==', serviceId)       
                .where('userId', '==', userId)          
                .limit(1)
                .get();
            if(snap.empty){
                return false;
            }
            
            return snap.docs.shift();  
        } catch (error) {
            console.error('Error at Accounts.isExisted with params: ', {serviceId, userId});
            console.error(error);
            return false;
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
            const snap = await this.db.collection(Accounts.TABLE_NAME)
                .doc(id)
                .get();
            if(!snap.exists){
                return null;
            }           
            return snap;
        } catch (error) {
            console.error('Error at Accounts.get with params: ', {id});
            console.error(error);
            return null;  
        }
    }

    /**
     * @returns Boolean | DocumentSnapshot (https://cloud.google.com/nodejs/docs/reference/firestore/0.13.x/DocumentSnapshot)
     */
    add = async(data)=> {
        if(!data || !data.userId || !data.serviceId){
            throw new Error('invalid param');   
        }
        try {
            const snap = await this.db.collection(Accounts.TABLE_NAME)
                .add(this.toStandardData(data));
            return await snap.get();
        } catch (error) {
            console.error('Error at Accounts.add with params: ', {data});
            console.error(error);
            throw new Error('onAdd Account error');   
        }
    }

    /**
     * Hàm update sẽ cập nhật thêm field vào cho document
     * @returns Boolean | DocumentSnapshot (https://cloud.google.com/nodejs/docs/reference/firestore/0.13.x/DocumentSnapshot)
     */
    update = async(id, data) => {
        if(!id || !data ){
            throw new Error('invalid param');   
        }
        try {
            const snap = await this.db.collection(Accounts.TABLE_NAME).doc(id).update(data);
            
            return snap;
        } catch (error) {
            console.error('Error at Accounts.update with params: ', {id, data});
            console.error(error);
            return false;
        }
    }

    /**
     * hàm set sẽ set lại toàn bộ giá trị cho document
     * @returns Boolean | DocumentSnapshot (https://cloud.google.com/nodejs/docs/reference/firestore/0.13.x/DocumentSnapshot)
     */
    set = async(id, data) => {
        if(!id || !data || !data.nhanhUserId || !data.deviceToken){
            throw new Error('invalid param');   
        }
        try {
            const snap = await this.db.collection(Accounts.TABLE_NAME).doc(id).set(data);            
            return snap;
        } catch (error) {
            console.error('Error at Accounts.set with params: ', {id, data});
            console.error(error);
            return false;
        }
    }

    getByIdentifier = async(identifier, serviceId) : Promise<DocumentSnapshot | null> => {
        if(!identifier || !serviceId){
            throw new Error('invalid param');    
        }
        try {
            const snaps = await this.db.collection(Accounts.TABLE_NAME)
                .where('identifier', '==', identifier)
                .where('serviceId', '==', serviceId)
                .limit(1)
                .get();
            if(snaps.empty){
                return null;
            }
            return snaps.docs.shift();
        } catch (error) {
            console.error('Error at Accounts.getByIdentifier with params: ', {identifier, serviceId});
            console.error(error);
            throw error;
        }
    }
}