import MockBase from './MockBase.mock';
import * as admin from 'firebase-admin';
import { DocumentSnapshot } from 'firebase-functions/lib/providers/firestore';

export default class UserModel extends MockBase 
{
    static TABLE_NAME = 'users';    

    toStandardData = (data) => {
        return {
            email: '',
            fullName: '',
            ...data
        };
    }
    
    get = async(id) : Promise<DocumentSnapshot | null> =>{
        if(!id){
            return null;  
        }
        try {
            const snap = await this.db.collection(UserModel.TABLE_NAME)
                .doc(id)
                .get();
            if(!snap.exists){
                return null;
            }            
            return snap;
        } catch (error) {
            console.error('Error at UserModel.get with params: ', {id});
            console.error(error);
            return null;  
        }
    }

    getByEmail = async(email: String) : Promise<DocumentSnapshot | null>=> {
        if(!email){
            return null;
        }
        try {
            const snap = await this.db.collection(UserModel.TABLE_NAME)
            .where('email', '==', email)
            .limit(1)
            .get();
            if(snap.empty){
                return null;
            }
            return snap.docs.shift();
        } catch (error) {
            console.error('Error at UserModel.getByEmail with params: ', {email});
            console.error(error);
            return null;  
        }
    }

    /**
     * @returns Boolean | DocumentSnapshot (https://cloud.google.com/nodejs/docs/reference/firestore/0.13.x/DocumentSnapshot)
     */
    add = async(data) : Promise<admin.firestore.DocumentSnapshot>  => {
        if(!data || !data.email){
            throw new Error('invalid param');   
        }
        try {
            const ref = await this.db.collection(UserModel.TABLE_NAME)
                .add(this.toStandardData(data));
            const snap = await ref.get();
            return snap;
        } catch (error) {
            console.error('Error at UserModel.add with params: ', {data});
            console.error(error);
            throw error;   
        }
    }

    
}