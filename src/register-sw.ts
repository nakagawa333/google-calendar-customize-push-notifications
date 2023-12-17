export const registerServiceWorker = async() => {
    if("serviceWorker" in navigator){
        try{
            await navigator.serviceWorker.register("./firebase-messaging-sw.ts")
        } catch(error){
            console.error(error);
        }
    }
}