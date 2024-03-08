"use client"
import { useEffect, useState } from 'react'
import FcmNotification from './components/FcmNotification';
import { Events } from './components/events';


export default function Home() {
  const [count, setCount] = useState<number>(0);
  const [calendars,setCalendars] = useState([]);
  //0:イベント 1:タスク
  const [selectType,setSelectType] = useState<number>(0);
  const [isOpen,setIsOpen] = useState<boolean>(false);
  const taskLimist:number = 10;

  const selectTypeChange = (selectType:number) => {
    setSelectType(selectType);
  }

  const schedulerClick = () => {
    openSchedulerModal();
  }

  const openSchedulerModal = () => {
    setIsOpen(true);
  }

  const closeSchedulerModal = () => {
    setIsOpen(false);
  }

  return(
    <div className="container m-auto">

      <div className="flex flex-wrap mt-3">
        <div className="flex items-center me-4">
          <input
            checked={selectType === 0 ? true : false}
            id="red-radio"
            type="radio" value=""
            name="colored-radio"
            className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 focus:ring-red-500 dark:focus:ring-red-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            onChange={() => selectTypeChange(0)}
            />
          <label className="ms-2 text-sm font-medium text-black-900 dark:text-black-300">イベント</label>
        </div>
        <div className="flex items-center me-4">
          <input
            checked={selectType === 1 ? true : false}
            id="red-radio"
            type="radio"
            value=""
            name="colored-radio"
            className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 focus:ring-red-500 dark:focus:ring-red-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            onChange={() => selectTypeChange(1)}
            />
          <label className="ms-2 text-sm font-medium text-black-900 dark:text-black-300">タスク</label>
        </div>
        <div>
          <button 
            type="button" 
            className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
            onClick={() => schedulerClick()}
            >
              スケジュール変更
          </button>
        </div>
      </div>
      <Events />
      
      <FcmNotification />
    </div>
  )

}
