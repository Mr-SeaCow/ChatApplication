var WebSocketClient = require('websocket').client;

var client = new WebSocketClient();

client.on('connectFailed', function(error) {
    console.log('Connect Error: ' + error.toString());
});
 
client.on('connect', function(connection) {
    console.log('WebSocket Client Connected');
    connection.on('error', function(error) {
        console.log("Connection Error: " + error.toString());
    });
    connection.on('close', function() {
        console.log('echo-protocol Connection Closed');
    });
    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            console.log("Received: '" + message.utf8Data + "'");
        }
    });

    function sendMessage(target, message) {
        if (connection.connected) {
            let messageObj = {
                'op': '1',
                'data': {
                    target,
                    message
                }
            }
            connection.sendUTF(JSON.stringify(messageObj));
            
            //setTimeout(sendNumber, 5000);
        }
    }

   function sendHello(){
       let helloObj = {
           'op': '0',
           'data': {
               'token': 'mrseacow2'
           }
       }
       if (connection.connected){
           connection.sendUTF(JSON.stringify(helloObj))
       }
   }
    sendHello();
    sendMessage('mrseacow', 'This is a test!')
});
 
client.connect('ws://localhost:8080/', 'echo-protocol');