import { Box } from "@mui/material";
import { requestNotificationPermission, showNotification } from "../Notification/notification";
import { getRequestToken, onMessageListener } from "../firebase";
import { useEffect, useState } from "react";

function FcmNotification(){

  const [messagePayload,setMessagePayload] = useState({messageId:"",title:"",body:"",data:""});

  useEffect(() => {
    (async() => {
      //トークン取得    
      let token = await getRequestToken();
      console.info(token);

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
  },[messagePayload])

  //メッセージ受信時
  onMessageListener()
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

  return(
    <Box></Box>
  )
}

export default FcmNotification;