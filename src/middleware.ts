import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { NextRequest, NextResponse } from "next/server";


export function middleware(request:NextRequest){
    let cookies = request.cookies;

    const response = NextResponse.next();

    response.cookies.set("acessToken","アクセストークン");
    response.cookies.set("refreshToken","リフレッシュトークン");
    return response;
}

export const config = {
    matcher: '/api/:path*',
}
  