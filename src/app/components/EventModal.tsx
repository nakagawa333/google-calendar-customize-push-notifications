import { useEffect, useRef } from "react"
import { v4 as uuidv4 } from 'uuid';

type Props = {
    event:GoogleEvent | undefined
    isOpen:boolean
    oepnTaskModal:() => void
    closeTaskModal:() => void
}

const uuid:string = uuidv4();
export const EventModal = (props:Props) => {
    const tabIndex:number = -1;

    const isClick = useRef<boolean>(false);
    useEffect(() => {
        const bodyElement = document.getElementsByTagName("body")[0];

        //モーダルが開いている状態の場合
        if(props.isOpen){
            if(isClick.current === false){
                bodyElement.addEventListener("click",(e:any) => {
                    if(e.target.id === uuid){
                        props.closeTaskModal();
                    }
                })
                isClick.current = true;
            }
        }
    },[props.isOpen])

    return(
        props.isOpen ? (
            <div
               id={uuid} 
               className="fixed top-0 left-0 right-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full justify-center items-center flex"
               tabIndex={tabIndex}
               style={{ background:  "rgba(200,200,200,.5)" }}  
            >
                <div className="relative flex flex-col p-5 rounded-lg shadow bg-white w-8/12">
                    <div className="flex">
                        <div className="ml-3">
                            <h2 className="font-semibold text-gray-800">タスク詳細変更</h2>
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
                            <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                                ステータス
                            </p>
                            <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                                {props.event?.status}
                            </p>
                            <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                                サマリー
                            </p>
                            <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                                {props.event?.summary}
                            </p>
                            <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                                イベント種別
                            </p>
                            <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                                {props.event?.eventType}
                            </p>
                            <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                                開始日時
                            </p>
                            <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                                {props.event?.startDate}
                            </p>
                            <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                                終了日時
                            </p>
                            <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                                {props.event?.endDate}
                            </p>                         
                        </div>
                        </div>

                        <div className="flex justify-end items-center mt-3">
                            <button 
                            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-medium rounded-md"
                            onClick={props.closeTaskModal}
                            >
                                キャンセル
                            </button>

                            <button className="px-4 py-2 ml-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-md">
                                保存
                            </button>
                    </div>
                </div>
            </div>
        ) : (
            <></>
        )
    )
}