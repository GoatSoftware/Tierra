(function() {
  var Connection = function() {
    var self = this;
    var conn = null;

    self.setup = setup;

    function setup(io, world) {
      // define interactions with client
      io.sockets.on('connection', function(socket) {
        //Actualizamos la lista de jugadores
        //Preoparamos la lista de los jugadores para enviarla
        //Enviamos a todos los que esten alrededor un paquete para que vean a esta nueva conexión
        var players = world.addPlayer(socket);

        //send data to client
        socket.emit('welcome_message', {
          'texto': "Bienvenido a Brown (Emmet (Dr (AKA Doc)))",
          'players': players
        });

        //recieve client data
        socket.on('type', function(data) {
          console.log(data);
          // process.stdout.write(data.letter);
        });
      });
    }
  };

  module.exports = Connection;
}());
