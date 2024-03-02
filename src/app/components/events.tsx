import axios, { AxiosRequestConfig } from "axios"
import { DOMAttributes, DetailedHTMLProps, DragEventHandler, HTMLAttributes, RefObject, createRef, useCallback, useEffect, useRef, useState } from "react"
import { EventModal } from "./EventModal";
import { ScrollObserver } from "./ScrollObserver";
import { indexedDBLocalPersistence } from "firebase/auth";
import { userAuth } from "../common/client/client/userAuth";

type Props = {

}
export const Events = (props:Props) => {
    const [isOpen,setIsOpen] = useState<boolean>(false);
    const [isActiveObserver, setIsActiveObserver] = useState(true);
    const [events,setEvents] = useState<GoogleEvent[]>([]);
    const [event,setEvent] = useState<GoogleEvent>();
    const nextPageTokenRef = useRef<string | null>(null);
    const eventRefs = useRef<RefObject<HTMLTableRowElement>[]>([]);

    /**
     * Googleイベント一覧を取得する
     */
    const getNextGoogleEvents = useCallback(async() => {
        //ユーザー認証
        await userAuth();
        
        let timeMin:string = new Date().toISOString();
        const nextPageToken = nextPageTokenRef.current;

        const urlSearchParams = new URLSearchParams();
        if(nextPageToken){
            urlSearchParams.set("nextPageToken",nextPageToken);
        }
        urlSearchParams.set("timeMin",timeMin);
        
        let uid = localStorage.getItem("uid");
        const config:AxiosRequestConfig = {
          headers:{
            "Authorization":uid
          }
        }
        const res = await axios.get(`/api/getGoogleEvents?${urlSearchParams}`,config);
        const data = res.data;

        setEvents([...events,...data.events])

        if(!data.nextPageToken){
            return setIsActiveObserver(false);
        }
        
        nextPageTokenRef.current = data.nextPageToken;
    },[events]);


    const eventClick = (event:GoogleEvent) => {
        setEvent(event);
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
                {
                    events.map((event:GoogleEvent,index:any) => {
                        return(
                            <div key={index} className="p-2 sm:w-1/2 w-full" onClick={() => eventClick(event)}>
                                <div className="bg-gray-200 rounded-l-lg rounded-r-lg flex p-4 h-full items-center hover:bg-gray-100">
                                    <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3"
                                        className="text-indigo-500 w-6 h-6 flex-shrink-0 mr-4" viewBox="0 0 24 24">
                                        <path d="M22 11.08V12a10 10 0 11-5.93-9.14"></path>
                                        <path d="M22 4L12 14.01l-3-3"></path>
                                    </svg>
                                    <span className="font-medium">{event.summary}</span>
                                </div>
                            </div>
                        )
                    })
                }
            </div>

            <ScrollObserver
                onIntersect={getNextGoogleEvents}
                isActiveObserver={isActiveObserver}
            />

            <EventModal
              event={event}              
              isOpen={isOpen}
              oepnTaskModal={oepnTaskModal}
              closeTaskModal={closeTaskModal}
            />
        </div>
    )
}