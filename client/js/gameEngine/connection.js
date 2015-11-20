// var socket = new io.Socket();

var socket = io();

// socket.connect(TIERRA.__IP_SERVER__+":"+TIERRA.__PORT_SERVER__);

// socket.emit('type', 'mensaje');

socket.on('welcome_message', function(obj) {
  // obj.texto DOC BROWN
});
