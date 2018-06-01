import MockBase from './MockBase.mock';

class UserDevice extends MockBase 
{
    static TABLE_NAME = 'users-devices';    

    /**
     * @returns Boolean | DocumentSnapshot (https://cloud.google.com/nodejs/docs/reference/firestore/0.13.x/DocumentSnapshot)
     */
    isExisted = async(userId, deviceToken) => {
        if(!userId || !deviceToken){
            throw new Error('invalid param');            
        }
        try {
            const snap = await this.db.collection(UserDevice.TABLE_NAME)
                .where('nhanhUserId', '==', userId)
                .where('deviceToken', '==',  deviceToken)
                .limit(1)
                .get();
            if(snap.empty){
                return false;
            }
            this.currentDoc = snap.docs.shift();
            return this.currentDoc;
        } catch (error) {
            console.error('Error at UserDevice.isExisted with params: ', {userId, deviceToken});
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
            const snap = await this.db.collection(UserDevice.TABLE_NAME)
                .doc(id)
                .get();
            if(!snap.exists){
                return false;
            }
            this.currentDoc = snap;
            return this.currentDoc;
        } catch (error) {
            console.error('Error at UserDevice.get with params: ', {id});
            console.error(error);
            return false;  
        }
    }

    /**
     * @returns Boolean | DocumentSnapshot (https://cloud.google.com/nodejs/docs/reference/firestore/0.13.x/DocumentSnapshot)
     */
    add = async(data) => {
        if(!data || !data.nhanhUserId || !data.deviceToken){
            throw new Error('invalid param');   
        }
        try {
            const snap = await this.db.collection(UserDevice.TABLE_NAME).add(data);
            return snap;
        } catch (error) {
            console.error('Error at UserDevice.add with params: ', {data});
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
            const snap = await this.db.collection(UserDevice.TABLE_NAME).doc(id).update(data);
            
            return snap;
        } catch (error) {
            console.error('Error at UserDevice.update with params: ', {id, data});
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
            const snap = await this.db.collection(UserDevice.TABLE_NAME).doc(id).set(data);            
            return snap;
        } catch (error) {
            console.error('Error at UserDevice.set with params: ', {id, data});
            console.error(error);
            return false;
        }
    }
}

export default UserDevice;