import { useEffect } from "react"

type Props = {
    id:string
    time:number, //時間
    msg:string //メッセージ
    isOpen:boolean //表示状態
    index:number
    snackbars:any
    setSnackbars:any
    snackbarType:string
}

export const Snackbar = (props:Props) => {
    const topRem:number = 2 + props.index * 4;
    useEffect(() => {
        let timeoutID:any;
        if(props.isOpen){
            //指定時間以降に削除
            timeoutID = setTimeout(() => {
                onChange();
            },props.time);
        }

        return () => clearTimeout(timeoutID);
    },[props.snackbars])

    const onChange = () => {
        let copySnackbars = props.snackbars.filter((snackbar:any) => {
            return snackbar.id !== props.id;
        })

        props.setSnackbars(copySnackbars);
    }
    return(
        props.isOpen ? (
            <div 
                className={`fixed top-8 left-1/2 mb-4 mr-4 p-4 text-white rounded shadow-l ${props.snackbarType === 'success' ? 'bg-lime-300' : 'bg-red-600'}`}
                style={{transform: "translate(-50%, -50%)",top:`${topRem}rem`}}>
                <div className="flex items-center">
                    <div className="mr-2">
                        {
                            props.snackbarType === 'success' ? (
                                <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.5 11.5 11 14l4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                                </svg>
                            ) : (
                                <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m15 9-6 6m0-6 6 6m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                                </svg>
                            )
                        }
                    </div>
                    <div className="mr-10">
                        {props.msg}
                    </div>
                    <div onClick={() => onChange()}>

                        <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18 18 6m0 12L6 6"/>
                        </svg>  
                    </div>
                </div>
            </div>
        ) : (
            <></>
        )
    )
}