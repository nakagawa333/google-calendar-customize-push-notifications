import axios, { AxiosRequestConfig } from "axios";
import { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { SucessSnackbar } from "../snackbar/SucessSnackbar";
import { useMatchMedia } from "../../common/useMatchMedia";
import { ApiGetRequest, ApiRequest } from "../../utils/apiRequest";
import { Snackbar } from "../snackbar/Snackbar";
import { Loading } from "../Loading";
import { Queue } from "../../common/queue";
import { SchedulerModalContent } from "./SchedulerModalContent";

type Props = {
    isOpen:boolean
    oepnTaskModal:() => void
    closeTaskModal:() => void
}

const uuid:string = uuidv4();
let queue = new Queue();

export const SchedulerModal = (props:Props) => {
    const [loadingIsOpen,setLoadingIsOpen] = useState<boolean>(false);
    const [isSkeleton,setIsSkeleton] = useState<boolean>(true);
    const isMobileSize = useMatchMedia("(width < 600px)");
    const tabIndex:number = -1;

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
                setSchedule(() => dataSchedule);
                setCron(() =>  cron);
            }
            let parsers = data.parsers;
            if(Array.isArray(parsers) && parsers.length !== 0){
                setParsers(() => parsers);
            }

            setIsSkeleton(() => false);

        } catch(error:any){
            console.error(error);
            console.error(error.message);
        }
    }

    const changeScheduleClick = async() => {
        let reqBody = {
            schedule:schedule
        };

        let head = queue.head;
        queue.enqueue(ApiRequest(axios.patch,"/api/cloudScheduler",reqBody));
        if(head === null){
            changeSchedule();
        }
    }

    /**
     * スケジュール変更
     */
    const changeSchedule = async() => {
        setLoadingIsOpen(true);
        try{

            let res = await queue.head?.request;
            queue.dequeue();
            const data = res.data;

            let parsers = data.parsers;
            if(Array.isArray(parsers) && 0 < parsers.length){
                setParsers(parsers);
            }

            setSnackbars([...snackbars,{time:5000,msg:"スケジュール変更に成功しました",id:uuidv4(),snackbarType:"success"}]);
            setIsSnackbarOpens([...isSnackbarOpens,true]);
            setLoadingIsOpen(false);

            if(queue.head !== null){
                changeSchedule();
            }
        } catch(error:any){
            setSnackbars([...snackbars,{time:5000,msg:"スケジュール変更に失敗しました",id:uuidv4(),snackbarType:"error"}]);
            setIsSnackbarOpens([...isSnackbarOpens,true])
            console.error(error);
            queue.dequeue();
            setLoadingIsOpen(false);
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
                    background: "rgba(200,200,200,0.5)", 
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
                        {
                            isSkeleton ? (
                                <div role="status"className ="max-w-sm animate-pulse">
                                    <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4"></div>
                                    <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[360px] mb-2.5"></div>
                                    <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
                                    <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[330px] mb-2.5"></div>
                                    <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[300px] mb-2.5"></div>
                                    <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[360px]"></div>
                                    <span className="sr-only">Loading...</span>
                                </div>
                            ) : (
                                <SchedulerModalContent 
                                  isMobileSize={isMobileSize}
                                  cron={cron}
                                  changeCron={changeCron}
                                  schedule={schedule}
                                  parsers={parsers}
                                />
                            )
                        }
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
                              onClick={() => changeScheduleClick()}
                              >
                                変更
                            </button>
                        </div>
                    </div>

                    {
                        snackbars.map((snackbar:any,index:number) => {
                            return(
                                <Snackbar
                                key={index}
                                id={snackbar.id}
                                time={snackbar.time}
                                msg={snackbar.msg}
                                isOpen={isSnackbarOpens[index]}
                                snackbars={snackbars}
                                setSnackbars={setSnackbars}
                                index={index}
                                snackbarType={snackbar.snackbarType}
                              />
                            )
                        })
                    }

                    {
                        loadingIsOpen === true ? (
                            <Loading isOpen={loadingIsOpen} />
                        ) : (
                            <></>
                        )                           
                    }
                </div>
        ) : (
            <></>
        )
    )
}