import { NextResponse } from 'next/server';
import { type NextRequest } from 'next/server';
import {cloudasset_v1, cloudscheduler_v1, google} from 'googleapis'
import { NextApiRequest } from 'next/types';
import parser from "cron-parser";
import { validateAccessToken } from '@/app/common/server/validateAccessToken';
import { authenticateAnonymousUser } from '@/app/common/server/authenticateAnonymousUser';
import { deleteAnonymousUserUid } from '@/app/common/server/deleteAnonymousUserUid';

const SCOPES:string = "https://www.googleapis.com/auth/cloud-platform";
const GOOGLE_PRIVATE_KEY:string = process.env.NEXT_PUBLIC_PRIVATE_KEY? process.env.NEXT_PUBLIC_PRIVATE_KEY.replace(/\\n/g, '\n') :"";
const GOOGLE_CLIENT_EMAIL:string = process.env.NEXT_PUBLIC_CLIENT_EMAIL? process.env.NEXT_PUBLIC_CLIENT_EMAIL : "";
const GOOGLE_PROJECT_NUMBER:string = process.env.NEXT_PUBLIC_GOOGLE_PROJECT_NUMBER ? process.env.NEXT_PUBLIC_GOOGLE_PROJECT_NUMBER : "";
const GOOGLE_CALENDAR_ID:string = process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_ID ? process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_ID : "";
const PROJECT_ID:string = process.env.NEXT_PUBLIC_PROJECT_ID ? process.env.NEXT_PUBLIC_PROJECT_ID : "";
const LOCATION_ID:string = process.env.NEXT_PUBLIC_LOCATION_ID ? process.env.NEXT_PUBLIC_LOCATION_ID : "";
const JOB_ID:string = process.env.NEXT_PUBLIC_JOB_ID ? process.env.NEXT_PUBLIC_JOB_ID : "";

/**
 * スケジューラー取得処理
 * @returns 
 */
export async function GET(request: NextRequest){
    
    let cloudscheduler:cloudscheduler_v1.Cloudscheduler | undefined = cloudschedulerAuth();
    let jobs;
    try{
        let params = {
            name:`projects/${PROJECT_ID}/locations/${LOCATION_ID}/jobs/${JOB_ID}`
        }
        jobs = await cloudscheduler.projects.locations.jobs.get(params);
    } catch(error:any){
        console.error(error);
        return NextResponse.json(
            { message: error.message },
            { status: error.status }
        );
    }

    let data = {
        schedule:"",
        parsers:[]
    }

    if(jobs && jobs?.data){
        let jobsData = jobs.data;
        if(jobsData.schedule){
            data["schedule"] = jobsData.schedule;
            data["parsers"] = getCronParser(jobsData.schedule);
        }
    }

    let response = NextResponse.json(data);
    return response;
}

/**
 * スケジューラー更新処理 
 * @returns 
 */
export async function PATCH(request: NextRequest){
    let data = await request.json();
    let cloudscheduler:cloudscheduler_v1.Cloudscheduler | undefined = cloudschedulerAuth();
    let parsers:string[] = [];
    try{
        const params = {
            name:`projects/${PROJECT_ID}/locations/${LOCATION_ID}/jobs/${JOB_ID}`,
            updateMask: 'schedule',
            requestBody:{
                schedule:data.schedule
            }
        }
        let res = await cloudscheduler.projects.locations.jobs.patch(params);
        if(res.data && res.data.schedule){
            parsers = getCronParser(res.data.schedule);
        }

    } catch(error:any){
        console.error(error);
        throw new Error(error.message);
    }

    let response = {
        parsers:parsers
    }
    return NextResponse.json(response);
}

const cloudschedulerAuth = () => {
    let schedular;

    try{
        const jwtClient = new google.auth.JWT(
            GOOGLE_CLIENT_EMAIL,
            undefined,
            GOOGLE_PRIVATE_KEY,
            SCOPES);
            
        schedular = google.cloudscheduler({
            version:"v1",
            auth:jwtClient
        })

    } catch(error:any){
        console.error(error.message,error);
        console.error("Google認証に失敗しました");
        throw new Error("Google認証に失敗しました");
    }
    return schedular;
}

/**
 * 
 * @param schedule スケジュール
 * @returns 
 */
const getCronParser = (schedule:string) => {
    let interval = parser.parseExpression(schedule);
    let parsers:any = [];
    for(let i = 0; i < 10; i++){
        let next = interval.next().toString();
        let localeDateString = new Date(next).toLocaleDateString("ja-JP", {year: "numeric",month: "2-digit",day: "2-digit",hour: '2-digit',minute:"2-digit",second:"2-digit"})
        parsers.push(localeDateString);
    }
    return parsers;
}