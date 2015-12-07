(function() {
  var CONFIG = require('./config/config');
  var Connection = require('./core/connection');
  var logger = require('./core/logger');
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
