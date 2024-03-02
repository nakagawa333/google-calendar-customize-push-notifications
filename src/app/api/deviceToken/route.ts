import { NextRequest, NextResponse } from "next/server";
import admin from 'firebase-admin';
import { BatchResponse, Message, MulticastMessage, getMessaging } from "firebase-admin/messaging";
import { v4 as uuidv4 } from 'uuid';
import { getAuth } from "firebase-admin/auth";
import {google, calendar_v3, tasks_v1} from 'googleapis';
import dayjs from "dayjs";
import axios from "axios";
import { getServiceAccount } from "@/app/common/server/getServiceAccount";
import { getApp } from "firebase/app";

let env = process.env;
export async function PATCH(request: NextRequest){
    const serviceAccount = getServiceAccount();
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
    }

    let json = await request.json();
    //デバイストークン
    let deviceToken = json.deviceToken;
    //コレクション名
    let collectionName = json.collectionName;

    let isExsits;
    try{
        isExsits = await isExsitsFirestoreCollection(collectionName);
    } catch(error:any){
        let response = NextResponse.json(
            {"message":"コレクション取得に失敗しました"},
            {"status":500}
        );
        return response;
    }

    //コレクションにデバイストークンが存在しない場合
    if(!isExsits){
        let response = NextResponse.json(
            {"message":"コレクションが存在しません"},
            {"status":400}
        );
        return response; 
    }


    let isExsitsDocument;

    try{
        isExsitsDocument = await isExsitsFirestoreDocument(collectionName,deviceToken);
    } catch(error:any){
        let response = NextResponse.json(
            {"message":"firestoreのコレクション取得に失敗しました"},
            {"status":500}
        );
        return response;
    }

    if(!isExsitsDocument){
        try{
            let time = dayjs().format("YYYY/MM/DD HH:mm:ss");
            let data = {
                device_token:deviceToken,
                create_time:time,
                update_time:time,
            }
            await setsFirestoreDocument("deviceToken",deviceToken,data);
        } catch(error:any){
            let response = NextResponse.json(
                {"message":"firestoreのドキュメントの追加に失敗しました"},
                {"status":500}
            );
            return response;
        }
    }
    
    return NextResponse.json({},{status:200});
}

/**
 * firestoreに該当するコレクションが存在するかを判別する
 * @param collectionName 
 * @returns true:コレクションが存在 false:コレクションが存在しない
 */
const isExsitsFirestoreCollection = async(collectionName:string) => {
    const db = admin.firestore();
    const collectionRef = db.collection(collectionName);

    try{
        const snapShot = await collectionRef.get();
        return 0 < snapShot.size; 
    } catch(error:any){
        console.error(error);
        throw new Error("firestoreのコレクション取得に失敗しました");
    }
}

const isExsitsFirestoreDocument = async(collectionName:string,documentId:string) => {
    const db = admin.firestore();
    const collectionRef = db.collection(collectionName);

    try{
        let res = await collectionRef.doc(documentId).get();
        return res.exists;
    } catch(error:any){
        console.error(error);
        throw new Error("firestoreのドキュメント取得に失敗しました");
    }
}

const setsFirestoreDocument = async(collectionName:string,documentId:string,data:any) => {
    const db = admin.firestore();
    const collectionRef = db.collection(collectionName);

    try{
        let res = await collectionRef.doc(documentId).set(data);
        return res;
    } catch(error:any){
        console.error(error);
        throw new Error("firestoreのドキュメントの追加に失敗しました");
    }
}