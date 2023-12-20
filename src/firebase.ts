// Import the functions you need from the SDKs you need
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey:process.env.REACT_APP_FIREBASE_APIKEY,
    authDomain:process.env.REACT_APP_FIREBASE_AUTHDOMAIN,
    projectId:process.env.REACT_APP_FIREBASE_PROJECTID,
    storageBucket:process.env.REACT_APP_FIREBASE_STORAGEBUCKET,
    messagingSenderId:process.env.REACT_APP_FIREBASE_MESSAGINGSENDERID,
    appId:process.env.REACT_APP_FIREBASE_APPID,
    measurementId:process.env.REACT_APP_FIREBASE_MEASUREMENTID
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const messaging = getMessaging(firebaseApp);
const analytics = getAnalytics(firebaseApp);

/**
 * FCMのリクエストトークンを発行する
 * @returns トークン
 */
export const getRequestToken = async():Promise<string> => {
    let vapidKey:string | undefined = process.env.REACT_APP_FIREBASE_VAPIDKEY;
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

export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
})
