export default class WS {
    constructor(url, onGetMessage) {
        this.ws = new WebSocket(url);
        //this.ws = new WebSocket('ws://localhost:3000/ws');
        this.onGetMessage = onGetMessage;
    }

    addListeners() {
        this.ws.addEventListener('open', (e) => {
            console.log(e);
            
            console.log('ws open');
        });

        this.ws.addEventListener('close', (e) => {
            console.log(e);
            
            console.log('ws close');
        });
        
        this.ws.addEventListener('error', (e) => {
            console.log(e);
            
            console.log('ws error');
        });

        this.ws.addEventListener('message', this.onGetMessage);
    }

    send(msg) {
        this.ws.send(msg);
    }

    close() {
        this.ws.close();
    }
}
