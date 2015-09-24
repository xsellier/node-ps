'use strict';

var http = require('http');
var format = require('util').format;

var port = 1337;
var hostname = '127.0.0.1';

http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Hello World\n');
}).listen(port, hostname);

console.log(format('Server running at http://%s:%s/', hostname, port));
