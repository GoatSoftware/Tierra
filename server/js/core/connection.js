(function() {
  var Connection = function() {
    var self = this;
    var conn = null;

    self.setup = setup;

    function setup(io, world) {
      // define interactions with client
      io.sockets.on('connection', playerConnect);
    }

    function playerConnect(socket) {
      //Actualizamos la lista de jugadores
      //Preparamos la lista de los jugadores para enviarla
      //Enviamos a todos los que esten alrededor un paquete para que vean a esta nueva conexión
      var players = world.addPlayer(socket);
      if (CONFIG.DEBUG) {
        console.log("Player connected");
      }

      //send data to client
      socket.emit('welcome_message', {
        'players': players,
        'texto': "Bienvenido a Brown (Emmet (Dr (AKA Doc)))"
      });

      //recieve client data
      socket.on('type', handlePacket);

      socket.on('disconnect', playerDisconnect);
    }

    function handlePacket(data) {
      console.log(data);
      // process.stdout.write(data.letter);
    }

    function playerDisconnect(socket) {
      console.log('Player disconnected');

      world.removePlayer(socket);
      // var i = allClients.indexOf(socket);
      // allClients.splice(i, 1);
    }
  };

  module.exports = Connection;
}());
