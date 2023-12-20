/**
 * ユーザーに通知の許可を求める
 * @returns 
 */
const requestNotificationPermission = async() => {
    return new Promise((reslove,reject) => {
        Notification.requestPermission().then((r) => {
            reslove(r);
        })
        .catch((e) => {
            reject(e);
        })
    })
}

/**
 * 通知を表示する
 * @param notification 通知API
 * @returns 
 */
const showNotification = async(notification:Notification) => {
    return new Promise((resolve,reject) => {
        //通知成功時
        notification.onshow = () => {
            resolve("成功");
        }

        //通知失敗時
        notification.onerror = () => {
            reject("失敗");
        }
    })
}

export {
    requestNotificationPermission,
    showNotification
}