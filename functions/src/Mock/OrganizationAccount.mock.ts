import MockBase from './MockBase.mock';
import { DocumentSnapshot } from 'firebase-functions/lib/providers/firestore';

export default class OrganizationsAccounts extends MockBase 
{
    static TABLE_NAME = 'organizations-accounts';    

    toStandardData = (data) => {
        return {
            accountId: '',
            organizationId: '',       
            organizationIdentifier: '',
            accountIdentifier: '',
            ...data
        };
    }

    isExisted = async(accountId, organizationId) : Promise<DocumentSnapshot | false>=> {
        if(!accountId || !organizationId){
            throw new Error('Invalid param');
        }
        try {
            const snap = await this.db.collection(OrganizationsAccounts.TABLE_NAME)
                .where('accountId', '==', accountId)       
                .where('organizationId', '==', organizationId)          
                .limit(1)
                .get();
            if(snap.empty){
                return false;
            }
            this.currentDoc = snap.docs.shift();
            return this.currentDoc;    
        } catch (error) {
            console.error('Error at OrganizationsAccounts.isExisted with params: ', {accountId, organizationId});
            console.error(error);
            throw error;    
        }
    }

    /**
     * @returns Boolean | DocumentSnapshot (https://cloud.google.com/nodejs/docs/reference/firestore/0.13.x/DocumentSnapshot)
     */
    get = async(id) : Promise<DocumentSnapshot|null>=>{
        if(!id){
            return null;  
        }
        try {
            const snap = await this.db.collection(OrganizationsAccounts.TABLE_NAME)
                .doc(id)
                .get();
            if(!snap.exists){
                return null;
            }
            this.currentDoc = snap;
            return this.currentDoc;
        } catch (error) {
            console.error('Error at OrganizationsAccounts.get with params: ', {id});
            console.error(error);
            return null;  
        }
    }

    /**
     * @returns Boolean | DocumentSnapshot (https://cloud.google.com/nodejs/docs/reference/firestore/0.13.x/DocumentSnapshot)
     */
    add = async(data) : Promise<DocumentSnapshot> => {
        if(!data || !data.accountId || !data.organizationId){
            throw new Error('invalid param');   
        }
        try {
            const snap = await this.db.collection(OrganizationsAccounts.TABLE_NAME)
                .add(this.toStandardData(data));
            return snap.get();
        } catch (error) {
            console.error('Error at OrganizationsAccounts.add with params: ', {data});
            console.error(error);
            throw error;
        }
    }

    fetchAllByAccountId = async(accountId : String) : Promise<Array<FirebaseFirestore.QueryDocumentSnapshot>> => {
        if(!accountId){
            throw new Error('invalid param');   
        }
        try {
            const snap = await this.db.collection(OrganizationsAccounts.TABLE_NAME)
                .where('accountId', '==',accountId )
                .get();
            
            return snap.empty ? [] : snap.docs;
        } catch (error) {
            console.error('Error at OrganizationsAccounts.add with params: ', {accountId});
            console.error(error);
            throw error;
        }
    }
}