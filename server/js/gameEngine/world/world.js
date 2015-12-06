(function() {
  var playingCharacter = require('../characters/playingCharacter');

  var World = function() {
    var self = this;
    var conn = null;
    var players = [];

    self.addPlayer = addPlayer;
    self.removePlayer = removePlayer;

    function addPlayer(io) {
      var retPlayers = [players.length-1];
      for (var i; i < players.length; i++) {
        retPlayers[i] = players[i];
      }

      var char = new playingCharacter(io);
      players.push(char);
      return retPlayers;
    }

    function removePlayer(io) {
      for (var i = 0; i < players.length; i++) {
        if (players[i].hasConnection(io)) {
          players = players.splice(i, 1);
        }
      }
    }
  };

  module.exports = World;
}());
