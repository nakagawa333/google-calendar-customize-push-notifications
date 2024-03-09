import { authenticateAnonymousUser } from "@/app/common/server/authenticateAnonymousUser";
import { deleteAnonymousUserUid } from "@/app/common/server/deleteAnonymousUserUid";
import { validateAccessToken } from "@/app/common/server/validateAccessToken";
import axios, { AxiosRequestConfig } from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request:NextRequest){    
    //Google taskリスト取得処理
    let reqUrl:string = `https://script.google.com/macros/s/${process.env.NEXT_PUBLIC_LIST_GOOGLE_TASKS_LIST_API_ID}/exec`;

    let data;
    try{
        const res = await axios.get(reqUrl);
        data = res.data;
    } catch(error:any){
        console.error(error);
        return NextResponse.json(
            { message: error.message },
            { status: error.status }
        );
    }

    let response = NextResponse.json(data)
    return response;
}