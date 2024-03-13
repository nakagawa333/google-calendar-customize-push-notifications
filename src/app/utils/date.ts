
/**
 * yyyy/mm/dd HH:mm:ss形式の日付を作成する
 * @param timeStamp タイムスタンプ
 * @returns yyyy/mm/dd HH:mm:ss
 */
export const formatTimestampToYYYYMMDDHHMMSS = (timeStamp:string) => {
    let date = new Date(timeStamp);
    if(isNaN(date.getTime())){
        //無効な日付の場合、nullを返却
        return "";
    }

    let year:number = date.getFullYear();
    let month:string = String(date.getMonth() + 1).padStart(2,"0");
    let day:string = String(date.getDate()).padStart(2,"0");
    let hour:string = String(date.getHours()).padStart(2,"0");
    let minutes:string = String(date.getMinutes()).padStart(2,"0");
    let second:string = String(date.getSeconds()).padStart(2,"0");
    return `${year}/${month}/${day} ${hour}:${minutes}:${second}`;
}

