import MockBase from './MockBase.mock';
import { DocumentSnapshot } from 'firebase-functions/lib/providers/firestore';

export default class OrganizationMock extends MockBase 
{
    static TABLE_NAME = 'organizations';    

    toStandardData = (data) => {
        return {
            name: '',
            identifier: '',
            serviceId: '',
            ...data
        };
    }

    isExisted = async(serviceId, identifier) : Promise<DocumentSnapshot | false> => {
        if(!serviceId || !identifier){
            throw new Error('Invalid param');
        }
        try {
            const snap = await this.db.collection(OrganizationMock.TABLE_NAME)
                .where('serviceId', '==', serviceId)       
                .where('identifier', '==', identifier)          
                .limit(1)
                .get();
            if(snap.empty){
                return false;
            }
            
            return snap.docs.shift(); 
        } catch (error) {
            console.error('Error at OrganizationMock.isExisted with params: ', {serviceId, identifier});
            console.error(error);
            throw new Error('unknow error');    
        }
    }

    /**
     * @returns Boolean | DocumentSnapshot (https://cloud.google.com/nodejs/docs/reference/firestore/0.13.x/DocumentSnapshot)
     */
    get = async(id) : Promise<DocumentSnapshot |null> =>{
        if(!id){
            throw new Error('invalid param');        
        }
        try {
            const snap = await this.db.collection(OrganizationMock.TABLE_NAME)
                .doc(id)
                .get();
            if(!snap.exists){
                return null;
            }
            
            return snap;
        } catch (error) {
            console.error('Error at OrganizationMock.get with params: ', {id});
            console.error(error);
            throw error;   
        }
    }

    /**
     * @returns Boolean | DocumentSnapshot (https://cloud.google.com/nodejs/docs/reference/firestore/0.13.x/DocumentSnapshot)
     */
    add = async(data) => {
        if(!data || !data.serviceId || !data.identifier){
            throw new Error('invalid param');   
        }
        try {
            const snap = await this.db.collection(OrganizationMock.TABLE_NAME)
                .add(this.toStandardData(data));
            return snap.get();
        } catch (error) {
            console.error('Error at OrganizationMock.add with params: ', {data});
            console.error(error);
            throw error ;
        }
    }

    
}