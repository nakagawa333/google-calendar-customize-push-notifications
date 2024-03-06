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

    let json = await request.json();
    let uid = json.uid;
    if(!uid){
        return NextResponse.error();
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

        let json = await response.json();

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

        return NextResponse.error();
    } catch(error:any){
        return NextResponse.error();
    }
    return response;
}

export const config = {
    matcher: '/api/:path*',
}
  