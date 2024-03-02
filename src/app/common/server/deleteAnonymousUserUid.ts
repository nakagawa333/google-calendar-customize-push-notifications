import { App } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import admin from 'firebase-admin';
import { getServiceAccount } from "./getServiceAccount";

/**
 * 匿名ユーザーを削除する
 * @param uid uid
 * @param app firebase app
 */
export const deleteAnonymousUserUid = async(uid:string) => {
    const serviceAccount = getServiceAccount();
    let app;

    //firebase認証
    if(!admin.apps.length){
        try{
            admin.initializeApp({
                credential:admin.credential.cert(serviceAccount)
            });
        } catch(error:any){
            console.error(error);
            console.error({
                message:error.message,
                code:error.code,
                stackTrace:error.stack
            })
            throw new Error("firebaseの認証に失敗しました");
        }
    } else {
        app = admin.app();
    }

    let auth = getAuth(app);
    try{
        await auth.deleteUser(uid);
        return;
    } catch(error:any){
        console.error({
            message:error.message,
            code:error.code,
            stackTrace:error.stack
        })
        throw new Error("匿名ユーザーの削除に失敗しました");
    }
}