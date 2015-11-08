var http = require('http');
var url = require('url');
var fs = require('fs');
var server;

var aux = "";

server = http.createServer(function(req, res) {
  // your normal server code
  var path = url.parse(req.url).pathname;
  if (path.lastIndexOf('/client') === 0) {
    fs.readFile(__dirname + path, function(err, data) {
      if (err) {
        return send404(res);
      }
      res.writeHead(200, {
        'Content-Type': 'text/html'
      });
      res.write(data, 'utf8');
      res.end();
    });
  } else {
    switch (path) {
      case '/':
        aux = __dirname + '/client/index.html';
        fs.readFile(__dirname + '/client/index.html', function(err, data) {
          if (err) {
            return send404(res);
          }
          res.writeHead(200, {
            'Content-Type': 'text/html'
          });
          res.write(data, 'utf8');
          res.end();
        });
        break;
      case '/credits.html':
        aux = 'credits';
        fs.readFile(__dirname + '/client/' + path, function(err, data) {
          if (err) {
            return send404(res);
          }
          res.writeHead(200, {
            'Content-Type': path == 'json.js' ? 'text/javascript' : 'text/html'
          });
          res.write(data, 'utf8');
          res.end();
        });
        break;
      default:
        aux = 'Una mierda';
        send404(res);
    }
  }
});

var send404 = function(res) {
  res.writeHead(404);
  res.write('404 - ' + aux);
  res.end();
};

server.listen(5454);

// use socket.io
var io = require('socket.io').listen(server);

// define interactions with client
io.sockets.on('connection', function(socket) {
  //send data to client
  setInterval(function() {
    socket.emit('date', {
      'date': new Date()
    });
  }, 1000);

  //recieve client data
  socket.on('client_data', function(data) {
    process.stdout.write(data.letter);
  });
});
