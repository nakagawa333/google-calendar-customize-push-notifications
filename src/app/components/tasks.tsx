import axios, { AxiosRequestConfig } from "axios";
import { indexing_v3 } from "googleapis";
import { useCallback, useEffect, useRef, useState } from "react";
import { ScrollObserver } from "./ScrollObserver";
import { TaskModal } from "./TaskModal";
import { ApiGetRequest } from "../utils/apiRequest";

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

        try{
            let res = await ApiGetRequest(axios.get,`/api/googleTaskLists`);
            const data = res.data;
            const taskLists = data.taskLists;
            if(Array.from(taskLists) && 0 < taskLists.length){
                setTaskLists(taskLists);
                setTaskList(taskLists[0]);
            }
        } catch(error:any){
            console.error(error);            
        }
    }

    const selectTaskLists = (e:any) => {
        let selectIndex = e.target.selectedIndex;
        let task = JSON.parse(JSON.stringify(taskLists[selectIndex]));
        setTaskList(task);
    }

    const getGoogleTasks = async() => {
        if(taskList && taskList.id){
            const urlSearchParams = new URLSearchParams();
            urlSearchParams.set("taskListId",taskList.id);

            let data;
            try{
                let res = await ApiGetRequest(axios.get,`/api/googleTasks?${urlSearchParams}`);
                data = res.data;
            } catch(error:any){
                console.error(error);
            }
    
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
        if(taskList && taskList.id){
            const nextPageToken = nextPageTokenRef.current;

            const urlSearchParams = new URLSearchParams();
            if(nextPageToken){
                urlSearchParams.set("nextPageToken",nextPageToken);
            }
            urlSearchParams.set("taskListId",taskList.id);

            let data;
            try{
                let res = await ApiGetRequest(axios.get,`/api/googleTasks?${urlSearchParams}`);
                data = res.data;
            } catch(error:any){
                console.error(error);
            }
    
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
                        style={{ border:"solid"}}
                        className="py-3 px-4 pe-16 block w-full border-red-500 rounded-lg text-sm focus:border-red-500 focus:ring-red-500 disabled:opacity-50 disabled:pointer-events-none dark:text-gray-400 dark:focus:ring-gray-600"
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