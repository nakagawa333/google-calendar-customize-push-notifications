"use client";

import { useEffect } from "react";
import { getFirebaseConfig } from "../server/getFirebaseConfig";

interface FirebaseConfig{
    apiKey:string,
    authDomain:string,
    projectId:string,
    storageBucket:string,
    messagingSenderId:string,
    appId:string,
    measurementId:string
}

export default function ServiceWorkerRegist(){
    useEffect(() => {
        (async() => {
            await serviceWorkerRegist();
        })()
    },[])

    const serviceWorkerRegist = async() => {
        if("serviceWorker" in navigator){
            const firebaseConfig:any = getFirebaseConfig();
            let searchParam = new URLSearchParams();
            Object.keys(firebaseConfig).map((key:string) => {
                let value = firebaseConfig[key];
                searchParam.set(key,value);
            })

            let scriptUrl:string = `/firebase-messaging-sw.js?${searchParam}`;
            let scope:string = "/"

            try{
                //serviceWorker開始
                await navigator.serviceWorker.register(scriptUrl,{scope:scope});
            } catch(error:any){
                console.error("serviceWorkerの開始に失敗しました");
                console.error(error);
            }
        }
    }

    return(
        <></>
    )
}
