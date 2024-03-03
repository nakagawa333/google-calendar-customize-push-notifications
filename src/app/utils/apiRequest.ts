import axios, { AxiosResponse } from "axios";

export const ApiRequest = async(apiCall:Promise<AxiosResponse<any, any>>) => {
    let res;
    try{
        res = await apiCall;
    } catch(error:any){
        console.error(error);
        //匿名認証
        await axios.post("api/anonymous/auth")
        //再APIコール
        res = await apiCall;
    }
    return res;
}