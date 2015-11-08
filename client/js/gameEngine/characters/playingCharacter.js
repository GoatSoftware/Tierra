TIERRA.PlayingCharacter = function() {
  var self = this;

  //Expose attributes

  //Expose methods
  self.getModel = getModel;
  self.onlineTime = onlineTime;
  self.move = move;

  //Init
  constructor();

  //Private attributes
  var position;
  var jumping;
  var speed;
  var health;
  var mana;
  var resource;

  //Private methods
  function constructor() {
    jumping = false;
    position = {
      x: 0,
      y: 0,
      z: 0
    };
    resource = TIERRA.resources.getResource('playingCharacter');
  }

  function getModel() {
    return resource.getModel();
  }

  function onlineTime() {

  }

  function move() {

  }

  function jump() {

  }
}
