"use client"
import { useEffect, useState } from 'react'
import FcmNotification from './components/FcmNotification';
import { Events } from './components/events';
import { Tasks } from './components/tasks';
import { SchedulerModal } from './components/SchedulerModal';


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
        <div className="flex flex-wrap lg:w-4/5 sm:mx-auto sm:mb-2 -mx-2 p-4">
          <div className="flex items-center me-4">
            <input
              checked={selectType === 0 ? true : false}
              id="event-radio"
              type="radio" value=""
              name="event-radio"
              className="w-4 h-4"
              onChange={() => selectTypeChange(0)}
              />
            <label htmlFor="event-radio" className="ms-2 text-sm font-medium text-black-900 dark:text-black-300">イベント</label>
          </div>
          <div className="flex items-center me-4">
            <input
              checked={selectType === 1 ? true : false}
              id="task-radio"
              type="radio"
              value="task-radio"
              name="colored-radio"
              className="w-4 h-4"
              onChange={() => selectTypeChange(1)}
              />
            <label className="ms-2 text-sm font-medium text-black-900 dark:text-black-300">タスク</label>
          </div>
          <div className="ml-auto">
            <button 
              type="button" 
              className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
              onClick={() => schedulerClick()}
              >
                スケジュール変更
            </button>
          </div>
        </div>
      </div>
      {
          selectType === 0 ? (
            <Events />
          ) : selectType === 1 ? (
            <Tasks />
          ) : (
            <></>
          )
        }
      
      <FcmNotification />
      <SchedulerModal 
        isOpen={isOpen}
        oepnTaskModal={openSchedulerModal}
        closeTaskModal={closeSchedulerModal}
      />
    </div>
  )

}
