type Props = {
    isMobileSize:any
    cron:any
    changeCron:any
    schedule:string
    parsers:string[]
}

export const SchedulerModalContent = (props:Props) => {
    //分
    const mins:string[] = ["*","0","1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24","25","26","27","28","29","30","31","32","33","34","35","36","37","38","39","40","41","42","43","44","45","46","47","48","49","50","51","52","53","54","55","56","57","58","59"];
    //時間
    const times:string[] = ["*","0","1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20","21","22","23"]
    //日
    const days:string[] = ["*","0","1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24","25","26","27","28","29","30","31"];
    //月
    const months:string[] = ["*","0","1","2","3","4","5","6","7","8","9","10","11","12"];
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

    return(
        <>
            <div className="mt-5">
                <div className={`ml-3 ${props.isMobileSize === false ? "flex" : ""}`}>
                    <div className="">
                        <label>分</label>
                        <select 
                        style={{ border:"solid"}}
                        className="py-3 px-4 pe-16 block w-full border-red-500 rounded-lg text-sm focus:border-red-500 focus:ring-red-500 disabled:opacity-50 disabled:pointer-events-none dark:text-gray-400 dark:focus:ring-gray-600"
                        value={props.cron["min"]}
                        onChange={(e) => props.changeCron("min",e.target.value)}
                        >
                            {
                                mins.map((min:string,index:number) => {
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
                        value={props.cron["time"]}
                        onChange={(e) => props.changeCron("time",e.target.value)}
                        >
                            {
                                times.map((time:string,index:number) => {
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
                        value={props.cron["day"]}
                        onChange={(e) => props.changeCron("day",e.target.value)}
                        >
                            {
                                days.map((day:string,index:number) => {
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
                        value={props.cron["month"]}
                        onChange={(e) => props.changeCron("month",e.target.value)}
                        >
                            {
                                months.map((month:string,index:number) => {
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
                        value={valWeeksMap.get(props.cron["week"])}
                        onChange={(e) => props.changeCron("week",e.target.value)}
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
                        <input type="text" value={props.schedule}></input>
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
                            props.parsers.map((parser:string,index:number) => {
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
        </>
    )
}