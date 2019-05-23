const WebSocketServer = require('websocket').server;
const http = require('http');
const ejs = require('ejs');
const RequestHandler = require('./src/requestHandler');

let requestHandler = new RequestHandler('http://localhost:8080');

const server = http.createServer(function (request, response) {
    const { method, url, headers } = request;
    let body = [];
    request.on('data', (chunk) => {
        body.push(chunk);
    }).on('end', () => {
        body = Buffer.concat(body).toString();
        switch (method){
            case 'POST': {
                requestHandler.emit(`POST:${url}`, request, response, body)
                break;
            }
            case 'GET': {
                requestHandler.emit(`GET:${url}`, request, response, body)
                break;
            }
        }
    });
    console.log((new Date()) + ' Received request for ' + request.url);

});

requestHandler.post('/Test', (req, res, params)=> {
    const { method, url, header } = req;
    console.log(params)

    //console.log(req)
    requestHandler.redirect('/Test', req, res)

})
requestHandler.get('/', (req, res)=> {
    const { method, url, header } = req;
    //console.log(method, url, header)
    res.writeHead(200);
    ejs.renderFile('./views/index.ejs', { name: 'Matthew' }, (err, str) => {
        if (err) throw err;
        res.write(str)
    });
    res.end();
})
requestHandler.get('/Test', (req, res)=> {
    const { method, url, header } = req;
    //console.log(method, url, header)
    res.writeHead(200);
    res.write('test')
    res.end();
})


server.listen(8080, function () {
    console.log((new Date()) + ' Server is listening on port 8080');
});

wsServer = new WebSocketServer({
    httpServer: server,
    // You should not use autoAcceptConnections for production
    // applications, as it defeats all standard cross-origin protection
    // facilities built into the protocol and the browser.  You should
    // *always* verify the connection's origin and decide whether or not
    // to accept it.
    autoAcceptConnections: false
});

function originIsAllowed(origin) {
    // put logic here to detect whether the specified origin is allowed.
    return true;
}

let curConnections = {};

wsServer.on('request', function (request) {
    if (!originIsAllowed(request.origin)) {
        // Make sure we only accept requests from an allowed origin
        request.reject();
        console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
        return;
    }

    var connection = request.accept('echo-protocol', request.origin);

    console.log((new Date()) + ' Connection accepted.');
    connection.on('message', function (message) {
        if (message.type === 'utf8') {
            const { op, data } = JSON.parse(message.utf8Data)
            switch (op) {
                case '0': {
                    connection.username = data.username
                    curConnections[data.username] = connection
                    console.log(`${data.username} has just connected to the channel.`)
                    break;
                }
                case '1': {
                    console.log(`${connection.username} just sent a message to ${data.target}, saying "${data.message}"`)
                    curConnections[data.target].sendUTF(JSON.stringify({
                        'op': '1',
                        'data': {
                            'sender': connection.username,
                            'message': data.message,
                            'time': Date.now()
                        }
                    }))
                    // curConnections[data.target].sendUTF(`${connection.username} just said ${data.message}`)
                    break;
                }
            }
        }
        else if (message.type === 'binary') {
            console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
            connection.sendBytes(message.binaryData);
        }
    });
    connection.on('close', function (reasonCode, description) {
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    });
});