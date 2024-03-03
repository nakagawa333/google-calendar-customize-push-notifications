import { NextRequest, NextResponse } from 'next/server';

import { FirebaseApp, FirebaseOptions, getApp, getApps,initializeApp } from 'firebase/app';
import { User, UserCredential, getAuth, signInAnonymously,signInWithCustomToken } from "firebase/auth";

export async function POST(request: NextRequest){
    let firebaseOptions:FirebaseOptions ={
        apiKey:process.env.NEXT_PUBLIC_FIREBASE_APIKEY,
        authDomain:process.env.NEXT_PUBLIC_FIREBASE_AUTHDOMAIN,
        projectId:process.env.NEXT_PUBLIC_FIREBASE_PROJECTID,
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGEBUCKET,
        messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGINGSENDERID,
        appId: process.env.NEXT_PUBLIC_FIREBASE_APPID,
        measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENTID
    }

    let app:FirebaseApp;

    if (!getApps().length) {
        app = initializeApp(firebaseOptions);
    } else {
        app = getApp();
    }

    const tokens = await getTokens(app);
    //アクセストークン、リフレッシュトークン取得失敗時
    if(tokens.errorFlag){
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }

    let body = {
        "message":"成功しました",
        "uid":tokens.uid
    }

    const response = NextResponse.json(body,{
        status:200
    });
    response.cookies.set("refreshToken",tokens.accessToken,{
        httpOnly: true,
        secure: true,
        path:"/"
    });
    response.cookies.set('accessToken', tokens.refreshToken,{
        httpOnly: true,
        secure: true,
        path:"/"      
    });
    return response;
}

const getTokens = async(app:FirebaseApp) => {
    const auth = getAuth(app);

    let response = {
        uid:"",
        accessToken:"",
        refreshToken:"",
        errorFlag:false
    }

    try{
        const userCredential:UserCredential = await signInAnonymously(auth);
        const user:User = userCredential.user;
        //uid
        const uid:string = user.uid;
        //アクセストークン
        const accessToken:string = await user.getIdToken();
        //リフレッシュトークン
        const refreshToken:string = user.refreshToken;

        response.accessToken = accessToken;
        response.refreshToken = refreshToken;
        response.uid = uid;
    } catch(error:any){
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error({
          errorCode:errorCode,
          errorMessage:errorMessage
        })
        response.errorFlag = true;
    }
    return response;
}