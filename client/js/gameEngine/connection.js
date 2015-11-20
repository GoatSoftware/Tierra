// var socket = new io.Socket();

// var socket = io();
var socket = io(TIERRA.CONFIG.__IP_SERVER__+":"+TIERRA.CONFIG.__PORT_SERVER__);

// socket.connect(TIERRA.__IP_SERVER__+":"+TIERRA.__PORT_SERVER__);


socket.on('welcome_message', function(obj) {
  // obj.texto DOC BROWN
  socket.emit('type', 'mensaje');
});
