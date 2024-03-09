import { authenticateAnonymousUser } from "@/app/common/server/authenticateAnonymousUser";
import { deleteAnonymousUserUid } from "@/app/common/server/deleteAnonymousUserUid";
import { validateAccessToken } from "@/app/common/server/validateAccessToken";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest){
    
    const searchParams = request.nextUrl.searchParams;
    const nextPageToken = searchParams.get("nextPageToken");
    const taskListId = searchParams.get("taskListId");
    //Google task取得処理
    let reqUrl:string = `https://script.google.com/macros/s/${process.env.NEXT_PUBLIC_GET_GOOGLE_TASKS_API_ID}/exec?`;
    if(nextPageToken){
        reqUrl += `nextPageToken=${nextPageToken}`;
    }
    reqUrl += `&taskListId=${taskListId}`
    let data;

    try{
        
        const res = await axios.get(reqUrl);
        data = res.data;
    } catch(error:any){
        console.error(error);
        let response = NextResponse.json(
            {"message":"Googleタスクの取得に失敗しました"},
            {status:400}
        );
        return response;
    }

    let response = NextResponse.json(data);
    return response;
}
