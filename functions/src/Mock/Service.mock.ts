import MockBase from './MockBase.mock';
import { DocumentSnapshot } from 'firebase-functions/lib/providers/firestore';



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

    findByToken = async(token) : Promise<DocumentSnapshot | false>=> {
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
            return snap.docs.shift();
        } catch (error) {
            console.error('Error at ServiceMock.findByToken with params: ', {token});
            console.error(error);
            return false;
        }
    }

    
}