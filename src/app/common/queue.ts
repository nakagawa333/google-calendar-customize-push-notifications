export class Node{
    request:any
    next:Node | null
    constructor(request:any, next=null){
        this.request = request;
        this.next = next;
    }
}

export class Queue{
    head:Node | null
    tail:Node | null
    constructor(){
        this.head = null;
        this.tail = null;
    }

    enqueue(request:any){
        let newNode = new Node(request);
        if(this.head === null){
            this.head = newNode;
            this.tail = this.head;
            return;
        }

        if(this.tail !== null){
            this.tail.next = newNode;
            this.tail = this.tail.next;
        }
    }

    dequeue(){
        if(this.head === null){
            return;
        }

        let request = this.head.request;
        let nextHead = this.head.next;
        if(nextHead === null){
            this.tail = null;
        }
        this.head = nextHead;
        return request;
    }
}