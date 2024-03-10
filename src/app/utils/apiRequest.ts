import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

type reqFunction = (
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ) => Promise<any>;

//GETやDELETEの場合、上手くいかないため対応が必要
export const ApiRequest = async(apiCall:reqFunction,path:string,data:any) => {
    //uidを共通リクエストとする
    let uid = localStorage.getItem("uid");
    let config:AxiosRequestConfig = createAuthAxiosRequestConfig(uid);
    let res;

    try{
        res = await apiCall.call(null,path,data,config);
    } catch(error:any){
        console.error(error);
        //匿名認証
        let anonymousAuthRes = await axios.post("/api/anonymous/auth")
        let resUid:string = anonymousAuthRes.data.uid;
        localStorage.setItem("uid",resUid);
        config = createAuthAxiosRequestConfig(resUid);
        //再APIコール
        res = await apiCall.call(null,path,data,config);
    }
    return res;
}

export const ApiGetRequest = async(apiCall:reqFunction,path:string) => {
    //uidを共通リクエストとする
    let uid = localStorage.getItem("uid");
    let config:AxiosRequestConfig = createAuthAxiosRequestConfig(uid);
    let res;

    try{
        res = await apiCall.call(null,path,config);
    } catch(error:any){
        console.error(error);
        //匿名認証
        let anonymousAuthRes = await axios.post("/api/anonymous/auth")
        let resUid:string = anonymousAuthRes.data.uid;
        localStorage.setItem("uid",resUid);
        config = createAuthAxiosRequestConfig(resUid);
        //再APIコール
        res = await apiCall.call(null,path,config);
    }
    return res;
}

/**
 * 認証用リクエスト設定
 * @param data 
 * @param uid ユーザーID
 */
const createAuthAxiosRequestConfig = (uid:any) => {
    let config:AxiosRequestConfig = {
    }

    let headers = {
        "Authorization":uid,
    }

    config["headers"] = headers;
    config["data"] = {};
    return config;
}