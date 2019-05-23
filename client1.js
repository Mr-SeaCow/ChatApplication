var WebSocketClient = require('websocket').client;
/*
//var client = new WebSocketClient();

client.on('connectFailed', function (error) {
    console.log('Connect Error: ' + error.toString());
});

client.on('connect', function (connection) {
    console.log('WebSocket Client Connected');
    connection.on('error', function (error) {
        console.log("Connection Error: " + error.toString());
    });
    connection.on('close', function () {
        console.log('echo-protocol Connection Closed');
    });
    connection.on('message', function (message) {
        if (message.type === 'utf8') {
            console.log("Received: '" + message.utf8Data + "'");
        }
    });
    function sendHello() {
        let helloObj = {
            'op': '0',
            'data': {
                'token': 'mrseacow'
            }
        }
        if (connection.connected) {
            connection.sendUTF(JSON.stringify(helloObj))
        }
    }
    sendHello();
});

client.connect('ws://localhost:8080/', 'echo-protocol');
*/
class chatClient extends WebSocketClient {
    constructor(username, websocketLink) {
        super().on('connectFailed', (error) => {
            console.log('Connect Error: ' + error.toString());
        });
        super.on('connect', (connection) => {
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
                    let messageObj = JSON.parse(message.utf8Data);
                    switch(messageObj.op) {
                        case '1': {
                            console.log(messageObj.data)
                        }
                    }
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
        });
        super.connect(websocketLink, 'echo-protocol');
    }

    sendMessage(target, message) {
        if (this._connection.connected) {
            connection.sendUTF(JSON.stringify({
                'op': '1',
                'data': {
                    target,
                    message
                }
            }))
        }
    }


}

let c = new chatClient('mrseacow1', 'ws://localhost:8080/');

