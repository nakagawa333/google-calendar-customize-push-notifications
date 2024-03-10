
importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js');


self.addEventListener('install', function(e) {
    console.log('[ServiceWorker] Install');
});
  
self.addEventListener('activate', function(e) {
    console.log('[ServiceWorker] Activate');
});

self.addEventListener('fetch', () => {
    let firebaseConfig = {

    }
    let params = new URL(location).searchParams;
    for(let key of params.keys()){
        firebaseConfig[key] = params.get(key);
    }
    self.firebaseConfig = firebaseConfig;
});
  

let params = new URL(location).searchParams;

const defaultConfig = {
    apiKey: true,
    projectId: true,
    messagingSenderId: true,
    appId: true,
};


firebase.initializeApp(self.firebaseConfig || defaultConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload){
    const notificationTitle = payload.notificationtitle;
    const notificationOptions = {
      body: payload.notification.body,
      tag:""
    };

    return self.registration.showNotification(notificationTitle,notificationOptions);
})