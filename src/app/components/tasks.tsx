import axios, { AxiosRequestConfig } from "axios";
import { indexing_v3 } from "googleapis";
import { useCallback, useEffect, useRef, useState } from "react";
import { ScrollObserver } from "./ScrollObserver";
import { TaskModal } from "./TaskModal";
import { userAuth } from "../common/client/userAuth";

type Props = {

}

export const Tasks = (props:Props) => {
    const [isOpen,setIsOpen] = useState<boolean>(false);
    const [tasks,setTasks] = useState<GoogleTask[]>([]);
    const [taskLists,setTaskLists] = useState<TaskListsItem[]>([]);
    const [isActiveObserver, setIsActiveObserver] = useState(true);
    const nextPageTokenRef = useRef<string | null>(null);
    const [task,setTask] = useState<GoogleTask>();
    const [taskList,setTaskList] = useState<TaskListsItem>();

    useEffect(() => {
        getTaskLists(); 
    },[])

    useEffect(() => {
        getGoogleTasks();
    },[taskList])


    const getTaskLists = async() => {
        //ユーザー認証
        await userAuth();
        let uid = localStorage.getItem("uid");
        const config:AxiosRequestConfig = {
          headers:{
            "Authorization":uid
          }
        }
        const res = await axios.get('/api/listGoogleTaskLists',config);
        const data = res.data;
        const taskLists = data.taskLists;
        if(Array.from(taskLists) && 0 < taskLists.length){
            setTaskLists(taskLists);
            setTaskList(taskLists[0]);
        }
    }

    const selectTaskLists = (e:any) => {
        let selectIndex = e.target.selectedIndex;
        let task = JSON.parse(JSON.stringify(taskLists[selectIndex]));
        setTaskList(task);
    }

    const getGoogleTasks = async() => {
        //ユーザー認証
        await userAuth();
        if(taskList && taskList.id){
            const urlSearchParams = new URLSearchParams();
            urlSearchParams.set("taskListId",taskList.id);
    
            let uid = localStorage.getItem("uid");
            const config:AxiosRequestConfig = {
              headers:{
                "Authorization":uid
              }
            }
            const res = await axios.get(`/api/getGoogleTasks?${urlSearchParams}`,config);
            const data = res.data;
    
            setTasks(data.tasks)
            if(!data.nextPageToken){
                return setIsActiveObserver(false);
            }
    
            nextPageTokenRef.current = data.nextPageToken;
        }
    }

    /**
     * Googleタスク一覧を取得する
     */
    const getNextGoogleTasks = useCallback(async() => {
        //ユーザー認証
        await userAuth();
        if(taskList && taskList.id){
            const nextPageToken = nextPageTokenRef.current;

            const urlSearchParams = new URLSearchParams();
            if(nextPageToken){
                urlSearchParams.set("nextPageToken",nextPageToken);
            }
            urlSearchParams.set("taskListId",taskList.id);

            let uid = localStorage.getItem("uid");
            const config:AxiosRequestConfig = {
              headers:{
                "Authorization":uid
              }
            }
            const res = await axios.get(`/api/getGoogleTasks?${urlSearchParams}`,config);
            const data = res.data;
    
            setTasks([...tasks,...data.tasks])
            if(!data.nextPageToken){
                return setIsActiveObserver(false);
            }
    
            nextPageTokenRef.current = data.nextPageToken;
        }
    },[tasks,taskList]);

    const taskClick = (task:GoogleTask) => {
        setTask(task);
        //モーダルを開く
        oepnTaskModal()
    }

    const oepnTaskModal = () => {
        setIsOpen(true);
    }

    const closeTaskModal = () => {
        setIsOpen(false);
    }

    return(
        <div className="mt-3">

            <div className="flex flex-wrap lg:w-4/5 sm:mx-auto sm:mb-2 -mx-2 p-4">
                <div className="p-2 sm:w-1/2 w-full">
                    <select 
                        id="countries" 
                        className="bg-gray-50 border border-gray-n300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        onChange={(e:any) => selectTaskLists(e)}                                                                                                                                                                                                                      
                    >
                        {
                            taskLists.map((taskList:TaskListsItem,index:number) => {
                                return(
                                    <option key={index}>{taskList.title}</option>
                                )
                            })
                        }
                    </select>
                </div>
            </div>
            <div className="flex flex-wrap lg:w-4/5 sm:mx-auto sm:mb-2 -mx-2 p-4">
                {
                    tasks.map((task:GoogleTask,index:any) => {
                        return(
                            <div key={index} className="p-2 sm:w-1/2 w-full" onClick={() => taskClick(task)}>
                                <div className="bg-gray-200 rounded-l-lg rounded-r-lg flex p-4 h-full items-center hover:bg-gray-100">
                                    <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3"
                                        className="text-indigo-500 w-6 h-6 flex-shrink-0 mr-4" viewBox="0 0 24 24">
                                        <path d="M22 11.08V12a10 10 0 11-5.93-9.14"></path>
                                        <path d="M22 4L12 14.01l-3-3"></path>
                                    </svg>
                                    <span className="font-medium">{task.title}</span>
                                </div>
                            </div>
                        )
                    })
                }
            </div>

            <ScrollObserver
                onIntersect={getNextGoogleTasks}
                isActiveObserver={isActiveObserver}
            />

            <TaskModal
              task={task}
              isOpen={isOpen}
              oepnTaskModal={oepnTaskModal}
              closeTaskModal={closeTaskModal}
            />
        </div>
    )

}