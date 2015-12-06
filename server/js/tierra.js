(function() {
  var Connection = require('./core/connection');
  var World = require('./gameEngine/world/world');

  var Tierra = function(sockets) {
    var self = this;
    var conn = null;
    var world = null;
    var io = sockets;

    constructor();

    function constructor() {
      conn = new Connection();
      world = new World();
      conn.setup(io, world);
    }
  };

  module.exports = Tierra;
}());
