import MockBase from './MockBase';

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

    isExisted = async(accountId, deviceId) => {
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

    isExistedByIdentifierAndToken = async(accountIdentifier, deviceToken) => {
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
    get = async(id) =>{
        if(!id){
            throw new Error('invalid param');        
        }
        try {
            const snap = await this.db.collection(AccountsDevices.TABLE_NAME)
                .doc(id)
                .get();
            if(!snap.exists){
                return false;
            }
            return snap;
        } catch (error) {
            console.error('Error at AccountsDevices.get with params: ', {id});
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
            const snap = await this.db.collection(AccountsDevices.TABLE_NAME)
                .add(this.toStandardData(data));
            return snap;
        } catch (error) {
            console.error('Error at AccountsDevices.add with params: ', {data});
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
            const snap = await this.db.collection(AccountsDevices.TABLE_NAME).doc(id).update(data);
            
            return snap;
        } catch (error) {
            console.error('Error at AccountsDevices.update with params: ', {id, data});
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
            const snap = await this.db.collection(AccountsDevices.TABLE_NAME).doc(id).set(data);            
            return snap;
        } catch (error) {
            console.error('Error at AccountsDevices.set with params: ', {id, data});
            console.error(error);
            return false;
        }
    }
}