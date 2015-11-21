(function(){
  var connection = function() {
    var self = this;
    var conn = null;

    self.setup = setup;

    function setup(io) {
      // define interactions with client
      io.sockets.on('connection', function(socket) {
        //send data to client
        socket.emit('welcome_message', {
          'texto': "Bienvenido a Brown (Emmet (Dr (AKA Doc)))"
        });

        //recieve client data
        socket.on('type', function(data) {
          console.log(data);
          // process.stdout.write(data.letter);
        });
      });
    }
  };

  module.exports.connection = connection();
}());
