'use client'
import { Messaging, getMessaging, getToken, onMessage } from "firebase/messaging";
import { FirebaseApp, getApp, getApps, initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirebaseConfig } from "./common/server/getFirebaseConfig";
import firebase from "firebase/compat/app";

// const firebaseConfig = getFirebaseConfig();

// let firebaseApp:any
// let messaging:Messaging;

// // Initialize Firebase

// console.info(getApps().length);
// if (!getApps().length) {
//     console.info("アプリの数",getApps().length)
//     firebaseApp = initializeApp(firebaseConfig);
// }

// messaging = getMessaging(firebaseApp);
export class Firebase{
    messaging:Messaging
    constructor(messaging:Messaging){
        this.messaging = messaging;
    }

    getRequestToken = async():Promise<string> => {
        let vapidKey:string | undefined = process.env.NEXT_PUBLIC_FIREBASE_VAPIDKEY;
        if(vapidKey === undefined){
            throw new Error("vapidKeyを取得できませんでした");
        }
    
        let notificationPermission:NotificationPermission = await Notification.requestPermission();
        
        if(notificationPermission === "granted"){
            let token = await getToken(this.messaging,{"vapidKey":vapidKey});
            return token;
        }
        return "";
    }

    onMessageListener = () => {
        new Promise((resolve) => {
            onMessage(this.messaging,(payload) => {
                resolve(payload);
            })
        })
    }
}
/**
 * FCMのリクエストトークンを発行する
 * @returns トークン
 */
export const getRequestToken = async(messaging:Messaging):Promise<string> => {
    let vapidKey:string | undefined = process.env.NEXT_PUBLIC_FIREBASE_VAPIDKEY;
    if(vapidKey === undefined){
        throw new Error("vapidKeyを取得できませんでした");
    }

    let notificationPermission:NotificationPermission = await Notification.requestPermission();
    
    if(notificationPermission === "granted"){
        let token = await getToken(messaging,{"vapidKey":vapidKey});
        return token;
    }
    return "";
}

/**
 * 
 * @param messaging メッセージ
 * @returns 
 */
export const onMessageListener = (messaging:Messaging) =>
   new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
})
