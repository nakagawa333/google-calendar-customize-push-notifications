import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

type reqFunction = (
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ) => Promise<any>;

export const ApiRequest = async(apiCall:reqFunction,path:string,req:any) => {
    //uidを共通リクエストとする
    let uid = localStorage.getItem("uid");
    req["uid"] = uid;
    let res;
    try{
        res = await apiCall.call(null,path,req);
    } catch(error:any){
        console.error(error);
        //匿名認証
        let anonymousAuthRes = await axios.post("/api/anonymous/auth")
        let resUid:string = anonymousAuthRes.data.uid;
        localStorage.setItem("uid",resUid);
        req["uid"] = uid;
        //再APIコール
        res = await await apiCall.call(null,path,req);
    }
    return res;
}