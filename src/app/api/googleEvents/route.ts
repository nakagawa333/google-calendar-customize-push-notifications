import { NextResponse } from 'next/server';
import { type NextRequest } from 'next/server'

import {google, calendar_v3} from 'googleapis'
import axios from 'axios';
import { validateAccessToken } from '@/app/common/server/validateAccessToken';
import { authenticateAnonymousUser } from '@/app/common/server/authenticateAnonymousUser';
import { deleteAnonymousUserUid } from '@/app/common/server/deleteAnonymousUserUid';

const SCOPES:string = 'https://www.googleapis.com/auth/calendar';
const GOOGLE_PRIVATE_KEY:string = process.env.NEXT_PUBLIC_PRIVATE_KEY? process.env.NEXT_PUBLIC_PRIVATE_KEY.replace(/\\n/g, '\n') :"";
const GOOGLE_CLIENT_EMAIL:string = process.env.NEXT_PUBLIC_CLIENT_EMAIL? process.env.NEXT_PUBLIC_CLIENT_EMAIL : "";
const GOOGLE_PROJECT_NUMBER:string = process.env.NEXT_PUBLIC_GOOGLE_PROJECT_NUMBER ? process.env.NEXT_PUBLIC_GOOGLE_PROJECT_NUMBER : "";
const GOOGLE_CALENDAR_ID:string = process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_ID ? process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_ID : "";

/**
 * Googleカレンダーのイベント一覧を取得する
 * @param request リクエスト
 * @returns 
 */
export async function GET(request: NextRequest){
    const searchParams:URLSearchParams = request.nextUrl.searchParams;
    const timeMin:any = searchParams.get("timeMin");
    const nextPageToken:any = searchParams.get("nextPageToken");
    let calendar:calendar_v3.Calendar | undefined;

    try{
        calendar = googleCalendarAuth();
    } catch(error:any){
        console.error(error);
        let response = NextResponse.json(
            {"message":"Googleカレンダーの認証に失敗しました"},
            {status:403}
        );
        return response;
    }

    let methodOptions = {
        calendarId: GOOGLE_CALENDAR_ID,
        timeMin:timeMin,
        singleEvents: false,
        orderBy: 'updated',
        pageToken:nextPageToken
    }
    let events;

    try{
        events = await calendar.events.list(methodOptions);
    } catch(error:any){
        let response = NextResponse.json(
            {"message":"Googleカレンダーのイベントの取得に失敗しました"},
            {status:400}
        );
        return response;
    }
    let eventItems:EventTypes[] = [];
    if(events?.data?.items){
        for(let event of events.data.items){
            let startDate:string = "";
            let endDate:string = "";
            //日時指定なし
            if(event.start?.date){
                startDate = event.start?.date
            }

            if(event.end?.date){
                endDate = event.end?.date
            }

            if(event.start?.dateTime){
                startDate = event.start?.dateTime
            }

            if(event.end?.dateTime){
                endDate = event.end?.dateTime
            }

            eventItems.push({
                id:event.id,
                status:event.status,
                summary:event.summary,
                eventType:event.eventType,
                startDate:startDate,
                endDate:endDate
            });
        }
    }

    let data = {
        events:eventItems,
        nextPageToken:events?.data.nextPageToken
    }

    let response = NextResponse.json(data);
    return response;    
}

/**
 * Googleカレンダーの認証を行う
 */
const googleCalendarAuth = () => {

    let calendar:calendar_v3.Calendar;
    try{
        const jwtClient = new google.auth.JWT(
            GOOGLE_CLIENT_EMAIL,
            undefined,
            GOOGLE_PRIVATE_KEY,
            SCOPES);
        calendar = google.calendar({
            version: 'v3',
            auth: jwtClient
        });

    } catch(error:any){
        console.error(error.message,error);
        console.error("Google認証に失敗しました");
        throw new Error("Google認証に失敗しました");
    }

    return calendar;
}