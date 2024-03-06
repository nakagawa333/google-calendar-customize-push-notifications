// import { getAuth, signInWithCustomToken } from "firebase/auth";
import { NextRequest,NextResponse } from "next/server";
import { initializeApp } from 'firebase/app';
import { FirebaseApp, FirebaseOptions } from 'firebase/app';
import axios from "axios";
import { Auth, getAuth } from "firebase-admin/auth";
import admin from 'firebase-admin';
import { getServiceAccount } from "@/app/common/server/getServiceAccount";

/**
 * アクセストークンとリフレッシュトークンの認証を行う
 * @param request リクエスト
 * @returns 
 */
export async function POST(request: NextRequest){
    //cookie取得処理
    let cookies = request.cookies;

    let accessToken:string | undefined = cookies.get("accessToken")?.value;
    let refreshToken:string | undefined = cookies.get("refreshToken")?.value;

    //アクセストークンが存在しない場合
    if(!accessToken){
        return NextResponse.json({error:"アクセストークンは必須です。"},{status:401});
    }

    //リフレッシュトークンが存在しない場合
    if(!refreshToken){
        return NextResponse.json({error:"リフレッシュトークンは必須です。"},{status:401});
    }

    const serviceAccount = getServiceAccount();

    //アクセストークンが有効かを認証
    let app;

    //firebase認証
    if(!admin.apps.length){
        try{
            admin.initializeApp({
                credential:admin.credential.cert(serviceAccount)
            });
        } catch(error:any){
            console.error(error);
            let response = NextResponse.json(
                {"message":"firebaseの認証に失敗しました"},
                {"status":500}
            );
            return response;
        }
    } else {
        app = admin.app();
    }

    const auth = getAuth(app);

    let uid = request.headers.get("Authorization");

    if(!uid){
        const response = NextResponse.json(
            {"message":"uidは必須です"},
            {"status":403}
        );
        return response;
    }

    //uid認証
    try{
        await auth.getUser(uid);
    } catch(error:any){
        
        console.error(error);
        const response = NextResponse.json(
            {"message":"ユーザーが不正です"},
            {"status":403}
        );
        return response;
    }

    try{
        //アクセストークン認証
        await auth.verifyIdToken(accessToken);
    } catch(error:any){
        //アクセストークンが認証切れの場合、リフレッシュトークンを元にアクセストークンを再発行
        if (error.code === 'auth/id-token-expired') {
            // アクセストークンの有効期限が切れた場合の処理
            let res = await refreshTokenToAccessToken(refreshToken);
            if(res.errorFlag){
                let response = NextResponse.json(
                    {"message":"アクセストークンの新規作成に失敗しました"},
                    {status:400}    
                );

                //ユーザー削除処理
                await deleteAuthUser(auth,uid);
                return response;
            }

            let response = NextResponse.json(
                {
                    "message":"アクセストークンを更新しました",
                    "accessToken":accessToken                
                },
                {status:201}
            );

            return response;
        }

        let message:string = "";
        let status:number = 0;

        if (error.code === 'auth/invalid-id-token') {
            // アクセストークンが不正な場合の処理
            message = "アクセストークンが不正です";
            status = 403;
        } else {
            message = "エラーが発生しました";
            status = 500;
        }

        //ユーザー削除処理
        await deleteAuthUser(auth,uid);

        //TODO 認証失敗時 クッキーからアクセストークン、リフレッシュトークンを削除
        //TODO 認証失敗時 匿名認証のuidもfirebaseから削除
        const response = NextResponse.json(
            {"message":message},
            {status:status}
        );
        return response;
    }
    
    const response = NextResponse.json(
        {"message":"成功しました"},
        {status:200}
    );
    return response;
}

/**
 * firebase ユーザー削除処理
 * @param auth 
 * @param uid 
 */
const deleteAuthUser = async(auth:Auth,uid:string) => {
    try{
        //匿名ユーザー削除処理
        await auth.deleteUser(uid);
    } catch(error:any){
        console.error(error);
    }
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
