import axios, { AxiosRequestConfig } from "axios";
import { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { SucessSnackbar } from "./snackbar/SucessSnackbar";
import { useMatchMedia } from "../common/useMatchMedia";
import { ApiGetRequest, ApiRequest } from "../utils/apiRequest";

type Props = {
    isOpen:boolean
    oepnTaskModal:() => void
    closeTaskModal:() => void
}

const uuid:string = uuidv4();
export const SchedulerModal = (props:Props) => {
    const isMobileSize = useMatchMedia("(width < 600px)");
    const tabIndex:number = -1;
    
    //分
    const mins:any[] = ["*","0","1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24","25","26","27","28","29","30","31","32","33","34","35","36","37","38","39","40","41","42","43","44","45","46","47","48","49","50","51","52","53","54","55","56","57","58","59"];
    //時間
    const times:any[] = ["*","0","1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20","21","22","23"]
    //日
    const days:any[] = ["*","0","1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24","25","26","27","28","29","30","31"];
    //月
    const months:any[] = ["*","0","1","2","3","4","5","6","7","8","9","10","11","12"];
    //曜日
    const weeks:string[] = ["*","月","火","水","木","金","土","日"];
    const weeksMap = new Map([
        ["*","*"],
        ["月","1"],
        ["火","2"],
        ["水","3"],
        ["木","4"],
        ["金","5"],
        ["土","6"],
        ["日","7"],
    ]);
    const valWeeksMap = new Map([
        ["*","*"],
        ["1","月"],
        ["2","火"],
        ["3","水"],
        ["4","木"],
        ["5","金"],
        ["6","土"],
        ["7","日"],
    ]);
    //スケジュール
    const [schedule,setSchedule] = useState<string>("");
    //スケジュール cron値
    const [cron,setCron] = useState<any>({
        min:"",
        time:"",
        day:"",
        month:"",
        week:""
    });
    const [parsers,setParsers] = useState<string[]>([]);

    const [isSucessSnackbarOpen,setIsSucessSnackbarOpen] = useState<boolean>(false);

    const isClick = useRef<boolean>(false);
    const [sucessSnackbar,setSucessSnackbar] = useState<any>();
    const [snackbars,setSnackbars] = useState<any[]>([]);
    const [isSnackbarOpens,setIsSnackbarOpens] = useState<boolean[]>([]);
    
    useEffect(() => {
        if(props.isOpen){
            setSnackbars([]);
            getCloudSchedule();
            isTargetCloseModal();
        }
    },[props.isOpen])

    const isTargetCloseModal = () => {
        const bodyElement = document.getElementsByTagName("body")[0];

        if(isClick.current === false){
            bodyElement.addEventListener("click",(e:any) => {
                if(e.target.id === uuid){
                    props.closeTaskModal();
                }
            })
            isClick.current = true;
        }
    }        

    /**
     * クラウドスケジュールを取得する
     */
    const getCloudSchedule = async() => {
        try{
            const res = await ApiGetRequest(axios.get,"/api/cloudScheduler")
            const data:any = res.data;
            let dataSchedule:any = data.schedule;
            if(0 < dataSchedule.length){
                let dataScheduleArr:any = dataSchedule.split(" ");
                let cron = {
                    min:dataScheduleArr[0],
                    time:dataScheduleArr[1],
                    day:dataScheduleArr[2],
                    month:dataScheduleArr[3],
                    week:dataScheduleArr[4]                
                }
                setSchedule(dataSchedule);
                setCron(cron);
            }
            let parsers = data.parsers;
            if(Array.isArray(parsers) && parsers.length !== 0){
                setParsers(parsers);
            }

        } catch(error:any){
            console.error(error);
            throw new Error(error.message);
        }
    }

    /**
     * スケジュール変更
     */
    const changeSchedule = async() => {
        try{
            let reqBody = {
                schedule:schedule
            };

            const res = await ApiRequest(axios.patch,"/api/cloudScheduler",reqBody);
            const data = res.data;

            let parsers = data.parsers;
            if(Array.isArray(parsers) && 0 < parsers.length){
                setParsers(parsers);
            }

            setSnackbars([...snackbars,{time:5000,msg:"成功しました",id:uuidv4()}]);
            setIsSnackbarOpens([...isSnackbarOpens,true])
            setIsSucessSnackbarOpen(true);
        } catch(error:any){
            console.error(error);
            throw new Error(error.message);
        }
    }

    const changeCron = async(key:string,value:string) => {
        const copyCron = JSON.parse(JSON.stringify(cron));
        if(key === "week"){
            let week = weeksMap.get(value);
            copyCron[key] = week;
        } else {
            copyCron[key] = value;
        }
        let schedule = "";
        Object.keys(copyCron).map((key) => {
            let value = copyCron[key];
            schedule += value + " ";
        })

        setSchedule(schedule.trim());
        setCron(copyCron);
    }

    return(
        props.isOpen ? (
            <div
               id={uuid} 
               className="fixed top-0 left-0 right-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full justify-center items-center flex"
               tabIndex={tabIndex}
               style={{ 
                    background: "rgba(200,200,200)", 
                }}  
            >
                <div 
                  className="relative flex flex-col p-5 rounded-lg shadow bg-white w-8/12"
                  style={{
                    maxHeight: isMobileSize ? "80%" : "90%",
                    width: isMobileSize ? "95%" : "50%"
                  }}
                  >
                    <div className="flex">
                        <div className="ml-3">
                            <h2 className="font-semibold text-gray-800">スケジュール変更</h2>
                            <button 
                             type="button" 
                             className="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" 
                             data-modal-hide="popup-modal"
                             onClick={() => props.closeTaskModal()}
                             >
                             <svg className="w-3 h-3" aria-hidden="true" xmlns="http:www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                 <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                             </svg>
                             <span className="sr-only">Close modal</span>
                             </button>
                        </div>
                    </div>

                    <div
                      style={{
                        overflowY:"scroll",
                      }}
                    >
                    <div className="mt-5">
                        <div className={`ml-3 ${isMobileSize === false ? "flex" : ""}`}>
                            <div className="">
                                <label>分</label>
                                <select 
                                   style={{ border:"solid"}}
                                   className="py-3 px-4 pe-16 block w-full border-red-500 rounded-lg text-sm focus:border-red-500 focus:ring-red-500 disabled:opacity-50 disabled:pointer-events-none dark:text-gray-400 dark:focus:ring-gray-600"
                                   value={cron["min"]}
                                   onChange={(e) => changeCron("min",e.target.value)}
                                >
                                    {
                                        mins.map((min:number,index:number) => {
                                            return(
                                                <option key={index}>
                                                    {min}
                                                </option>
                                            )
                                        })
                                    }
                                </select>
                            </div>
                            <div className="">
                                <label>時間</label>
                                <select
                                  style={{ border:"solid"}}
                                  className="py-3 px-4 pe-16 block w-full border-red-500 rounded-lg text-sm focus:border-red-500 focus:ring-red-500 disabled:opacity-50 disabled:pointer-events-none dark:text-gray-400 dark:focus:ring-gray-600"
                                  value={cron["time"]}
                                  onChange={(e) => changeCron("time",e.target.value)}
                                >
                                    {
                                        times.map((time:number,index:number) => {
                                            return(
                                                <option key={index}>
                                                    {time}
                                                </option>
                                            )
                                        })
                                    }
                                </select>
                            </div>
                            <div>
                                <label>日</label>
                                <select 
                                  style={{ border:"solid"}}
                                  className="py-3 px-4 pe-16 block w-full border-red-500 rounded-lg text-sm focus:border-red-500 focus:ring-red-500 disabled:opacity-50 disabled:pointer-events-none dark:text-gray-400 dark:focus:ring-gray-600"
                                  value={cron["day"]}
                                  onChange={(e) => changeCron("day",e.target.value)}
                                >
                                    {
                                        days.map((day:number,index:number) => {
                                            return(
                                                <option key={index}>
                                                    {day}
                                                </option>
                                            )
                                        })
                                    }
                                </select>
                            </div>
                            <div>
                                <label>月</label>
                                <select 
                                  style={{ border:"solid"}}
                                  className="py-3 px-4 pe-16 block w-full border-red-500 rounded-lg text-sm focus:border-red-500 focus:ring-red-500 disabled:opacity-50 disabled:pointer-events-none dark:text-gray-400 dark:focus:ring-gray-600"
                                  value={cron["month"]}
                                  onChange={(e) => changeCron("month",e.target.value)}
                                  >
                                    {
                                        months.map((month:number,index:number) => {
                                            return(
                                                <option key={index}>
                                                    {month}
                                                </option>
                                            )
                                        })
                                    }
                                </select>
                            </div>
                            <div>
                                <label>曜日</label>
                                <select 
                                   style={{ border:"solid"}}
                                   className="py-3 px-4 pe-16 block w-full border-red-500 rounded-lg text-sm focus:border-red-500 focus:ring-red-500 disabled:opacity-50 disabled:pointer-events-none dark:text-gray-400 dark:focus:ring-gray-600"
                                   value={valWeeksMap.get(cron["week"])}
                                   onChange={(e) => changeCron("week",e.target.value)}
                                >
                                    {
                                        weeks.map((week:string,index:number) => {
                                            return(
                                                <option key={index}>
                                                    {week}
                                                </option>
                                            )
                                        })
                                    }
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="flex mt-5">
                        <div className="ml-3">
                            <div>
                                <h3 className="font-semibold text-gray-800">cron</h3>
                            </div>
                            <div>
                                <input type="text" value={schedule}></input>
                            </div> 
                        </div>
                    </div>

                    <div className="flex mt-5">
                        <div className="ml-3">
                            <div>
                                <h3 className="font-semibold text-gray-800">次のトリガー日</h3>
                            </div>
                            <div>
                                {
                                    parsers.map((parser:string,index:number) => {
                                        return(
                                            <p key={index}>
                                                {parser}
                                            </p>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    </div>
                    </div>
                    <div className="flex justify-end items-center mt-3">
                            <button 
                            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-medium rounded-md"
                            onClick={props.closeTaskModal}
                            >
                                キャンセル
                            </button>

                            <button 
                              className="px-4 py-2 ml-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-md"
                              onClick={() => changeSchedule()}
                              >
                                変更
                            </button>
                    </div>

                    {
                        snackbars.map((snackbar:any,index:number) => {
                            return(
                                <SucessSnackbar
                                key={index}
                                id={snackbar.id}
                                time={snackbar.time}
                                msg={"成功しました"}
                                isOpen={isSnackbarOpens[index]}
                                snackbars={snackbars}
                                setSnackbars={setSnackbars}
                                index={index}
                              />
                            )
                        })
                    }
                </div>
            </div>
        ) : (
            <></>
        )
    )
}