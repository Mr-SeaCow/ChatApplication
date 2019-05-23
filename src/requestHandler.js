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
            args[2] = (args[2] !== undefined ? parse(args[2]) : undefined)
            callback(...args)
        })
    }
    get(link, middleware, callback) {
        if (link == undefined) throw 'Please provide a link';
        if (middleware == undefined) throw 'Please provide a callback!';
        if (callback == undefined) callback = middleware;
        this.on(`GET:${link}`, (...args) => {
            if (middleware !== callback){
                callback(...args, middleware(args[0]))
            } else {
                callback(...args)
            }
        })
    }
    redirect(link, req, res, params) {
        let k = Object.keys(params)
        res.writeHead(302, {'Location': `${this._baseUrl}/Test`, 'Set-Cookie': `${k[0]}=${params[k[0]]}; HttpOnly; Path=/`}, {'Set-Cookie': `${k[0]}=${params[k[0]]}; HttpOnly; Path=/`});
        res.end();
    }

    parseCookies (request) {
        let list = {},
            rc = request.headers.cookie;
    
        rc && rc.split(';').forEach(function( cookie ) {
            let parts = cookie.split('=');
            list[parts.shift().trim()] = decodeURI(parts.join('='));
        });
    
        return list;
    }
}

module.exports = requestHandler;
