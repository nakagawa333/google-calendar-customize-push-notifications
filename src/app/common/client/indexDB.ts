
interface FirebaseConfig{
    apiKey:string,
    authDomain:string,
    projectId:string,
    storageBucket:string,
    messagingSenderId:string,
    appId:string,
    measurementId:string
}

export enum Stores {
    FirebaseConfig = 'firebaseConfig',
}

export class IndexDB{
    db:IDBDatabase | null
    dbName:string
    keyPath:string
    constructor(dbName:string,keyPath:string){
        this.dbName = dbName;
        this.keyPath = keyPath;
        this.db = null;
    }

    /**
     * データベースを開く
     * @param dbName データベース名
     * @returns 
     */
    public async init(){
        return new Promise<IDBDatabase>((resolve,reject) => {
            let dbName = this.dbName;
            let db:any;
            let request:IDBOpenDBRequest = indexedDB.open(dbName);

            //成功時
            request.onsuccess = (event:Event) => {
                db = request.result;
                this.db = db;
                resolve(db)
            }

            //失敗時
            request.onerror = (event:any) => {
                reject(event);
            }

            //データベースが新しく作成された場合
            request.onupgradeneeded = () => {
                this.db = request.result;
                let db = this.db;

                if(!db){
                    throw new Error("dbが登録されていません");
                }
                // if the data object store doesn't exist, create it
                if (!db.objectStoreNames.contains(dbName)) {
                  db.createObjectStore(dbName)
                }
            }
        })
    }

    /**
     * データの登録を行う
     * @param param 登録データ 
     * @returns 
     */
    public async add(key:string,value:any){
        let dbName = this.dbName;
        if(!this.db){
            return;
        }
        let transaction:IDBTransaction = this.db.transaction(dbName, "readwrite");

        let objectStore:IDBObjectStore = transaction.objectStore(dbName);
        let request:IDBRequest<IDBValidKey> = objectStore.add(value,key);

        try{
            await this.waitForIDBRequestCompletion(request);
        } catch(error:any){
            console.error(error);
            //ロールバック
            transaction.abort();
            throw new Error(error.message);
        }

        //トランザクションを閉じる
        transaction.commit();
    }

    /**
     * データの検索処理を行う
     * @param query クエリ
     * @returns 検索結果
     */
    public async select(query:IDBValidKey){
        let dbName = this.dbName;
        if(!this.db){
            return;
        }

        let transaction:IDBTransaction = this.db.transaction(dbName, "readwrite");

        let objectStore:IDBObjectStore = transaction.objectStore(dbName);
        let request:IDBRequest<IDBValidKey> = objectStore.get(query);

        let data:any
        try{
            data = await this.waitForIDBRequestCompletion(request);
        } catch(error:any){
            console.error(error);
            //ロールバック
            transaction.abort();
            return null;
        }

        //トランザクションを閉じる
        transaction.commit();

        return data;
    }

    /**
     * 
     * @param query クエリ
     * @returns true:データが存在する false:データが存在しない
     */
    public async isExistIndexDB(query:IDBValidKey){
        let data = await this.select(query);
        return data !== null && data !== undefined;
    }

    private async waitForIDBRequestCompletion(request:IDBRequest<IDBValidKey>){
        return new Promise((resolve,reject) => {
            request.onsuccess = (event: Event) => {
                let data = request.result;
                resolve(data);
            }

            request.onerror = (error:any) => {
                let res = {
                    message:"IndexDBの登録に失敗しました",
                    stack:error.stack
                }
                reject(res);
            }
        })
    }

    /**
     * DBを閉じる
     */
    public async close(){
        if(this.db){
            this.db.close();
            this.db = null;
        }
    }
}