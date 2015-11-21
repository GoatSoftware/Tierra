(function(){
  var connection = require('core/connection.js');

  var tierra = function(sockets) {
    var self = this;
    var conn = null;
    var io = sockets;

    constructor();

    function constructor() {
      conn = new connection();
      conn.setup(io);
    }
  };

  module.exports.tierra = tierra();
}());
