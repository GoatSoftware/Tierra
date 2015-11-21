var http = require('http');
var url = require('url');
var fs = require('fs');
var server;

var aux = "";

server = http.createServer(function(req, res) {});

server.listen(5454);

// use socket.io
var io = require('socket.io').listen(server);

var game = new require('js/tierra.js')(io);
