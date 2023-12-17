import { getMessaging } from "firebase/messaging/sw";
import { onBackgroundMessage } from "firebase/messaging/sw";

declare const self: ServiceWorkerGlobalScope;

const messaging = getMessaging();
onBackgroundMessage(messaging,(payload) => {
    console.info("バックグラウンドでメッセージを受け取りました",payload);
    const notificationTitle:string = "background";
    const notificationOptions = {
        body:"background message body",
    }

    self.registration.showNotification(notificationTitle,notificationOptions);
})