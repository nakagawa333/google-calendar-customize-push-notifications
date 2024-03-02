import admin from 'firebase-admin';
import { Auth, getAuth } from "firebase-admin/auth";
import axios from "axios";
import { getServiceAccount } from './getServiceAccount';

/**
 * 匿名ユーザーの認証を行う
 * @param uid ユーザーID
 */
export const authenticateAnonymousUser = async(uid:string) => {
    let body:any = {
        errorFlag:false,
        status:200,
        message:"",
    }

    const serviceAccount = getServiceAccount();

    let app;

    //firebase認証
    if(!admin.apps.length){
        try{
            admin.initializeApp({
                credential:admin.credential.cert(serviceAccount)
            });
        } catch(error:any){
            body["message"] = "firebase認証エラー";
            body["status"] = 401;
            body["errorFlag"] = true;
            return body;
        }
    } else {
        app = admin.app();
    }

    const auth:Auth = getAuth(app);
 
    try{
        let user =await auth.getUser(uid);
    } catch(error:any){
        body["message"] = "不正なユーザーです";
        body["status"] = 403;
        body["errorFlag"] = true;
    }
    return body;
}