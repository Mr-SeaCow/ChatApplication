var WebSocketClient = require('websocket').client;
class chatClient extends WebSocketClient {
    constructor(username, websocketLink) {
        super().on('connectFailed', (error) => {
            console.log('Connect Error: ' + error.toString());
        });
        this.on('connect', (connection) => {
            this._connection = connection;
            console.log('WebSocket Client Connected');
            connection.on('error', (error) => {
                console.log("Connection Error: " + error.toString());
            });
            connection.on('close', () => {
                console.log('echo-protocol Connection Closed');
            });
            connection.on('message', (message) => {
                if (message.type === 'utf8') {
                    console.log("Received: '" + message.utf8Data + "'");
                }
            });
            function sendHello() {
                let helloObj = {
                    'op': '0',
                    'data': {
                        username
                    }
                }
                if (connection.connected) {
                    connection.sendUTF(JSON.stringify(helloObj))
                }
            }
            sendHello();
            this.emit('ready', connection);
        });
        this.connect(websocketLink, 'echo-protocol');
    }

    sendMessage(target, message) {
        if (this._connection.connected) {
            this._connection.sendUTF(JSON.stringify({
                'op': '1',
                'data': {
                    target,
                    message
                }
            }))
        }
    }


}

let c = new chatClient('mrseacow2', 'ws://localhost:8080/');

c.on('ready', (connection) => {
    console.log(connection)
    c.sendMessage('mrseacow1', 'Test')
})
//c.sendMessage('mrseacow1', 'Test')