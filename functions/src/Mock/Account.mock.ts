import MockBase from './MockBase.mock';
import { ENGINE_METHOD_DIGESTS } from 'constants';

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

    isExisted = async(serviceId, userId) => {
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
            this.currentDoc = snap.docs.shift();    
            return this.currentDoc;
        } catch (error) {
            console.error('Error at Accounts.isExisted with params: ', {serviceId, userId});
            console.error(error);
            throw new Error('unknow error');    
        }
    }

    /**
     * @returns Boolean | DocumentSnapshot (https://cloud.google.com/nodejs/docs/reference/firestore/0.13.x/DocumentSnapshot)
     */
    get = async(id) =>{
        if(!id){
            throw new Error('invalid param');        
        }
        try {
            const snap = await this.db.collection(Accounts.TABLE_NAME)
                .doc(id)
                .get();
            if(!snap.exists){
                return false;
            }
            this.currentDoc = snap;
            return this.currentDoc;
        } catch (error) {
            console.error('Error at Accounts.get with params: ', {id});
            console.error(error);
            return false;  
        }
    }

    /**
     * @returns Boolean | DocumentSnapshot (https://cloud.google.com/nodejs/docs/reference/firestore/0.13.x/DocumentSnapshot)
     */
    add = async(data) => {
        if(!data || !data.email){
            throw new Error('invalid param');   
        }
        try {
            const snap = await this.db.collection(Accounts.TABLE_NAME)
                .add(this.toStandardData(data));
            return snap;
        } catch (error) {
            console.error('Error at Accounts.add with params: ', {data});
            console.error(error);
            return false;
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
}