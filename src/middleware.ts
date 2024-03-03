import { FirebaseApp } from "firebase/app";
import { Auth, User, UserCredential, signInAnonymously } from "firebase/auth";
import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { NextRequest, NextResponse } from "next/server";
import admin from 'firebase-admin';
import { getAuth } from "firebase-admin/auth";
import { getServiceAccount } from "./app/common/server/getServiceAccount";
import axios from "axios";


export async function middleware(request:NextRequest){
    let url = new URL(request.url);
    if(url.pathname === "/api/anonymous/auth"){
        return NextResponse.next();
    }
    let cookies = request.cookies;

    let accessToken:string | undefined = cookies.get("accessToken")?.value;
    let refreshToken:string | undefined = cookies.get("refreshToken")?.value;

    if(!accessToken){
        return NextResponse.error();
    }

    if(!refreshToken){
        return NextResponse.error();
    }

    // const serviceAccount = getServiceAccount();

    // let app:any;
    // if(!admin.apps.length){
    //     try{
    //         admin.initializeApp({
    //             credential:admin.credential.cert(serviceAccount)
    //         });
    //     } catch(error:any){
    //         return NextResponse.error();
    //     }
    // } else {
    //     app = admin.app();
    // }

    // const auth = getAuth(app);
    // try{
    //     //アクセストークン認証
    //     await auth.verifyIdToken(accessToken);
    // } catch(error:any){
    //     //アクセストークンが認証切れの場合、リフレッシュトークンを元にアクセストークンを再発行
    //     if(error.code === "auth/id-token-expired"){
    //         // アクセストークンの有効期限が切れた場合の処理
    //         let res = await refreshTokenToAccessToken(refreshToken);
    //         if(res.errorFlag){
    //             return NextResponse.error();
    //         }

    //         const response = NextResponse.next();
    //         response.cookies.set("accessToken",accessToken,{
    //             httpOnly: true,
    //             secure: true,
    //             sameSite:"none"
    //         });
    //         return response;
    //     }
    //     return NextResponse.error();
    // }


    const response = NextResponse.next();

    // response.cookies.set("acessToken","アクセストークン");
    // response.cookies.set("refreshToken","リフレッシュトークン");
    return response;
}

// const getTokens = async(app:FirebaseApp) => {
//     const auth:any = getAuth(app);

//     let response = {
//         uid:"",
//         accessToken:"",
//         refreshToken:"",
//         errorFlag:false
//     }

//     try{
//         const userCredential:UserCredential = await signInAnonymously(auth);
//         const user:User = userCredential.user;
//         //uid
//         const uid:string = user.uid;
//         //アクセストークン
//         const accessToken:string = await user.getIdToken();
//         //リフレッシュトークン
//         const refreshToken:string = user.refreshToken;

//         response.accessToken = accessToken;
//         response.refreshToken = refreshToken;
//         response.uid = uid;
//     } catch(error:any){
//         const errorCode = error.code;
//         const errorMessage = error.message;
//         console.error({
//           errorCode:errorCode,
//           errorMessage:errorMessage
//         })
//         response.errorFlag = true;
//     }
//     return response;
// }

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

export const config = {
    matcher: '/api/:path*',
}
  