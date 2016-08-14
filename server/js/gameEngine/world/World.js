(function() {
  var playingCharacter = require('../characters/PlayingCharacter');

  var World = function() {
    var self = this;
    var conn = null;
    var players = [];

    self.addPlayer = addPlayer;

    function addPlayer(io) {
      var char = new playingCharacter(io);
      players.push(char);
      return players.slice(players.indexOf(char), 1);
    }
  };

  module.exports.World = World();
}());
