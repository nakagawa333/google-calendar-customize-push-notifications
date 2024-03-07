import { FirebaseApp } from "firebase/app";
import { Auth, User, UserCredential, signInAnonymously } from "firebase/auth";
import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { NextRequest, NextResponse } from "next/server";
import admin from 'firebase-admin';
import { getAuth } from "firebase-admin/auth";
import { getServiceAccount } from "./app/common/server/getServiceAccount";
import axios from "axios";
import { NestedMiddlewareError } from "next/dist/build/utils";


export async function middleware(request:NextRequest){
    let url = new URL(request.url);
    if(url.pathname === "/api/anonymous/auth"){
        return NextResponse.next();
    }

    if(url.pathname === "/api/anonymous/check"){
        return NextResponse.next();
    }

    let uid = request.headers.get("Authorization");;
    if(!uid){
        return Response.json(
            { success: false, message: 'uidが存在しません' },
            { status: 401 }
        )
    }

    let cookies = request.cookies;

    let accessToken:string | undefined = cookies.get("accessToken")?.value;
    let refreshToken:string | undefined = cookies.get("refreshToken")?.value;

    if(!accessToken){
        return Response.json(
            { success: false, message: 'アクセストークンが存在しません' },
            { status: 401 }
        )
    }

    if(!refreshToken){
        return Response.json(
            { success: false, message: 'リフレッシュトークンが存在しません' },
            { status: 401 }
        )
    }
    let response = NextResponse.next();

    //TODO middlewareでは、firebaseの認証、axiosは使えないためfetchを使用
    let cookie = `accessToken=${accessToken}; refreshToken=${refreshToken}`;
    try{
        const options = {
            method:"POST",
            headers:{
                "Authorization":uid,
                'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'Cookie': cookie,
            },
        }
        let checkRes = await fetch(`${url.origin}/api/anonymous/check`,options);
        let status = checkRes.status;

        let json = await checkRes.json();

        if(status === 200){
            return response;
        }
        if(status === 201){
            //アクセストークン更新
            let accessToken = json.accessToken;
            response.cookies.set("accessToken",accessToken,{
                httpOnly:true,
                secure:true,
                path:"/",
                sameSite:"strict"
            });
            return response;
        }

        return Response.json(
            { success: false, message: '認証エラー' },
            { status: 401 }
        )
    } catch(error:any){
        return Response.json(
            { success: false, message: '認証エラー' },
            { status: 401 }
        )
    }
    return response;
}

export const config = {
    matcher: '/api/:path*',
}
  