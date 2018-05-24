import MockBase from './MockBase';

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

    isExisted = async(token) => {
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
    get = async(id) =>{
        if(!id){
            throw new Error('invalid param');        
        }
        try {
            const snap = await this.db.collection(Devices.TABLE_NAME)
                .doc(id)
                .get();
            if(!snap.exists){
                return false;
            }
            return snap;
        } catch (error) {
            console.error('Error at Devices.get with params: ', {id});
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
            const snap = await this.db.collection(Devices.TABLE_NAME)
                .add(this.toStandardData(data));
            return snap;
        } catch (error) {
            console.error('Error at Devices.add with params: ', {data});
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
            const snap = await this.db.collection(Devices.TABLE_NAME).doc(id).update(data);
            
            return snap;
        } catch (error) {
            console.error('Error at Devices.update with params: ', {id, data});
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
            const snap = await this.db.collection(Devices.TABLE_NAME).doc(id).set(data);            
            return snap;
        } catch (error) {
            console.error('Error at Devices.set with params: ', {id, data});
            console.error(error);
            return false;
        }
    }
}