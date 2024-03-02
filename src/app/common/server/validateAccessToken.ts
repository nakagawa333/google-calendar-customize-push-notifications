import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";
import admin from 'firebase-admin';
import { getAuth } from "firebase-admin/auth";
import axios from "axios";
import { getServiceAccount } from "./getServiceAccount";

/**
 * アクセストークンの検証を行う
 * @param cookies クッキー
 * @returns 
 */
export const validateAccessToken = async(cookies:RequestCookie[]) => {
    let body:any = {
        errorFlag:false,
        status:200,
        message:"",
        accessToken:"",
        refreshToken:""
    }
    let cookieMap = new Map();
    for(let cookie of cookies){
        cookieMap.set(cookie.name,cookie.value);
    }

    let accessToken:string = cookieMap.get("accessToken");
    let refreshToken:string = cookieMap.get("refreshToken");

    //アクセストークンが存在しない場合
    if(!accessToken){
        body["message"] = "アクセストークンは必須です。";
        body["status"] = 401;
        body["errorFlag"] = true;
        return body;
    }

    //リフレッシュトークンが存在しない場合
    if(!refreshToken){
        body["message"] = "リフレッシュトークンは必須です。";
        body["status"] = 401;
        body["errorFlag"] = true;
        return body;
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
            console.error(error);
            body["message"] = "リフレッシュトークンは必須です。";
            body["status"] = 401;
            body["errorFlag"] = true;
            return body;
        }
    } else {
        app = admin.app(); 
    }
    
    try{
        //アクセストークン認証
        await getAuth(app).verifyIdToken(accessToken);
    } catch(error:any){
        if (error.code === 'auth/id-token-expired') {
            // アクセストークンの有効期限が切れた場合の処理
            let res = await refreshTokenToAccessToken(refreshToken);
            if(res.errorFlag){
                body["message"] = "アクセストークンの新規作成に失敗しました";
                body["status"] = 400;
                body["errorFlag"] = true;
                return body;
            }

            body["message"] = "アクセストークンを更新しました";
            body["status"] = 201;
            body["accessToken"] = res.accessToken;
            return body;
        }

        if (error.code === 'auth/invalid-id-token') {
            // アクセストークンが不正な場合の処理
            body["message"] = "アクセストークンが不正です";
            body["status"] = 403;
            body["errorFlag"] = true;
        } else {
            body["message"] = "エラーが発生しました";
            body["status"] = 500;
            body["errorFlag"] = true;
        }
        return body;
    }
    body["message"] = "成功しました";
    body["status"] = 200;
    return body;
}

/**
 * リフレッシュトークンからアクセストークンを作成する
 * @param refreshToken リフレッシュトークン
 * @returns アクセストークン リフレッシュトークン
 */
const refreshTokenToAccessToken = async(refreshToken:string) => {
    let accessToken:string = "";

    let apiKey: string | undefined = process.env.NEXT_PUBLIC_API_KEY;
    let errorFlag:boolean = false;

    if(apiKey){
        let reqUrlParams = new URLSearchParams();
        reqUrlParams.set("key",apiKey);
    
        let url:string = `https://securetoken.googleapis.com/v1/token?${reqUrlParams}`;
        let reqBodyParams = new URLSearchParams();
        reqBodyParams.set("grant_type","refresh_token");
        reqBodyParams.set("refresh_token",refreshToken);

        try{
            let res = await axios.post(url,reqBodyParams);
            accessToken = res.data.access_token;
        } catch(error:any){
            console.error(error);
            errorFlag = true;
        }
    }
    return {
        accessToken:accessToken,
        errorFlag:errorFlag
    }
}
