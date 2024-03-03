'use client'
import axios from "axios";
import { requestNotificationPermission, showNotification } from "../Notification/notification";
// import { getRequestToken, onMessageListener } from "../firebase";
import { getRequestToken,onMessageListener } from "../firebase";
import { useEffect, useState } from "react";
import { FirebaseApp, getApp, getApps, initializeApp } from "firebase/app";
import { getFirebaseConfig } from "../common/server/getFirebaseConfig";
import { Messaging, getMessaging } from "firebase/messaging";
import { ApiRequest } from "../utils/apiRequest";

const firebaseConfig = getFirebaseConfig();

function FcmNotification(){

  const [messagePayload,setMessagePayload] = useState({messageId:"",title:"",body:"",data:""});
  useEffect(() => {
    (async() => {

      let firebaseApp:FirebaseApp;
      if(!getApps().length) {
        firebaseApp = initializeApp(firebaseConfig);
      } else {
        firebaseApp = getApp();
      }
       
      let messaging:Messaging = getMessaging(firebaseApp);
      //トークン取得
      let token = await getRequestToken(messaging);

      let req = {
        deviceToken:token,
        collectionName:"deviceToken"
      }

      try{
        let apiFunc = axios.patch("/api/deviceToken",req);
        let res = await ApiRequest(apiFunc);
        console.info(res);
      } catch(error:any){
        console.error(error);
      }

      onMessageListener(messaging)
      .then(async(payload:any) => {
        //通知を作成
        let notification = new Notification(
          payload.notification.title,
          {
            body:payload.notification.body,
            tag:"",
            data:payload.data
          }
        );

        await showNotification(notification);

        setMessagePayload({
          messageId:payload.messageId,
          title:payload.notification.title,
          body:payload.notification.body,
          data:payload.data
        });
      })

      //TODO firestoreにデバイストークンを保存する

      if("Notification" in window){
        const permission = Notification.permission;
        if(permission === "denied" || permission === "granted"){
          return;
        }
  
        try{
          await requestNotificationPermission();
        } catch(e){
          console.error(e);
        }
      }
    })()
  },[])

  //メッセージ受信時
  // onMessageListener(messaging)
  // .then(async(payload:any) => {
  //   //通知を作成
  //   let notification = new Notification(
  //     payload.notification.title,
  //     {
  //       body:payload.notification.body,
  //       tag:"",
  //       data:payload.data
  //     }
  //   );

  //   await showNotification(notification);

  //   setMessagePayload({
  //     messageId:payload.messageId,
  //     title:payload.notification.title,
  //     body:payload.notification.body,
  //     data:payload.data
  //   });
  // })

  return(
    <div></div>
  )
}

export default FcmNotification;