import MockBase from './MockBase.mock';

export default class ServiceMock extends MockBase 
{
    static TABLE_NAME = 'services';    

    toStandardData = (data) => {
        return {
            name: '',
            code: '',
            token: '',
            ...data
        };
    }

    generateToken = () => {
        
    }

    findByToken = async(token) => {
        if(!token){
            throw new Error('Invalid param');
        }
        try {
            const snap = await this.db.collection(ServiceMock.TABLE_NAME)
                .where('token', '==', token)                
                .limit(1)
                .get();
            if(snap.empty){
                return false;
            }
            this.currentDoc = snap.docs.shift();    
            return this.currentDoc;
        } catch (error) {
            console.error('Error at ServiceMock.findByToken with params: ', {token});
            console.error(error);
            return false;
        }
    }

    isExisted = async(code) => {
        if(!code){
            throw new Error('Invalid param');
        }
        try {
            const snap = await this.db.collection(ServiceMock.TABLE_NAME)
                .where('code', '==', code)                
                .limit(1)
                .get();
            if(snap.empty){
                return false;
            }
            this.currentDoc = snap.docs.shift();    
            return this.currentDoc;
        } catch (error) {
            console.error('Error at ServiceMock.isExisted with params: ', {code});
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
            const snap = await this.db.collection(ServiceMock.TABLE_NAME)
                .doc(id)
                .get();
            if(!snap.exists){
                return false;
            }
            this.currentDoc = snap;
            return this.currentDoc;
        } catch (error) {
            console.error('Error at ServiceMock.get with params: ', {id});
            console.error(error);
            return false;  
        }
    }

    /**
     * @returns Boolean | DocumentSnapshot (https://cloud.google.com/nodejs/docs/reference/firestore/0.13.x/DocumentSnapshot)
     */
    add = async(data) => {
        if(!data || !data.code){
            throw new Error('invalid param');   
        }
        try {
            const snap = await this.db.collection(ServiceMock.TABLE_NAME)
                .add(this.toStandardData(data));
            return snap;
        } catch (error) {
            console.error('Error at ServiceMock.add with params: ', {data});
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
            const snap = await this.db.collection(ServiceMock.TABLE_NAME).doc(id).update(data);
            
            return snap;
        } catch (error) {
            console.error('Error at ServiceMock.update with params: ', {id, data});
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
            const snap = await this.db.collection(ServiceMock.TABLE_NAME).doc(id).set(data);            
            return snap;
        } catch (error) {
            console.error('Error at ServiceMock.set with params: ', {id, data});
            console.error(error);
            return false;
        }
    }
}