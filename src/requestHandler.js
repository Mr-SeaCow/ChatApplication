const eventEmitter = require('events');
const {parse} = require('querystring');
Object.keys('')
class requestHandler extends eventEmitter {
    constructor(baseUrl) {
        super();
        this._baseUrl = baseUrl
    }
    post(link, middleware, callback) {
        if (link == undefined) throw 'Please provide a link';
        if (middleware == undefined) throw 'Please provide a callback!';
        if (callback == undefined) callback = middleware;

        this.on(`POST:${link}`, (...args) => {
            console.log('TEST',  parse(args[2]))
            args[2] = (args[2] !== undefined ? parse(args[2]) : undefined)
            callback(...args)
        })
    }
    get(link, middleware, callback) {
        if (link == undefined) throw 'Please provide a link';
        if (middleware == undefined) throw 'Please provide a callback!';
        if (callback == undefined) callback = middleware;

        this.on(`GET:${link}`, (...args) => {
            callback(...args)
        })
    }
    redirect(link, req, res) {
        res.writeHead(302, {'Location': `${this._baseUrl}/Test`});
        res.end();
    }
}

module.exports = requestHandler;
