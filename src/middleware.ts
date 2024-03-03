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

    const response = NextResponse.next();

    // response.cookies.set("accessToken","アクセストークン");
    // response.cookies.set("refreshToken","リフレッシュトークン");
    return response;
}
export const config = {
    matcher: '/api/:path*',
}
  