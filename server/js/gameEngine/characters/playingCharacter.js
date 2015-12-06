(function() {
  var PlayingCharacter = function(io) {
    var self = this;
    var conn = io;

    self.hasConnection = hasConnection;

    function hasConnection(io) {
      return io == conn ? true : false;
    }
  };

  module.exports = PlayingCharacter;
}());
