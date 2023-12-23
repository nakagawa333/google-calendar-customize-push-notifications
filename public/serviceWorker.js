if("serviceWorker" in navigator){
    navigator.serviceWorker.register("./firebase-messaging-sw.js",{scope:"/"})
      .then((registration) => {
        console.info("Service worker開始しました")
    })

    navigator.serviceWorker.ready.then((registration) => {
      console.info("既にservice workerは起動しています。");
    })
}    