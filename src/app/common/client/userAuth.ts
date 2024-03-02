import axios, { AxiosRequestConfig } from "axios";

/**
 * ユーザー認証を行う
 */
export const userAuth = async() => {
    let uid = localStorage.getItem("uid");
      const config:AxiosRequestConfig = {
        headers:{
          "Authorization":uid
        }
      }

      try{
        //アクセストークンとユーザーID検証
        const res = await axios.post("/api/firebase/signInWith",{},config);
        const data = res.data;
      } catch(error:any){
        try{
          //匿名認証
          const res = await axios.get("/api/firebase/anonymous/auth");
          const data = res.data;
          //匿名ユーザーIDを保存
          localStorage.setItem("uid",data.uid);
        } catch(error:any){
            console.error("匿名認証に失敗しました");
            throw new Error("匿名認証に失敗しました");
        }
    }
}