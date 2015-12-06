(function() {
  var connection = require('./core/connection');
  var wolrd = require('./world/world');

  var Tierra = function(sockets) {
    var self = this;
    var conn = null;
    var world = null;
    var io = sockets;

    constructor();

    function constructor() {
      world = new World();
      conn = new Connection();
      conn.setup(io, world);
    }
  };

  module.exports.Tierra = Tierra();
}());