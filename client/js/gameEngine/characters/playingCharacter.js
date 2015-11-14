TIERRA.PlayingCharacter = function(initPos) {
  var self = this;

  //Expose attributes

  //Expose methods
  self.getModel = getModel;
  self.onlineTime = onlineTime;
  self.getPosition = getPosition;
  self.setPosition = setPosition;
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
    speed = 1;
    position = {
      x: initPos.x || 0,
      y: initPos.y || 0,
      z: initPos.z || 0
    };
    resource = new TIERRA.resources.Resource('playingCharacter', position);
  }

  function getModel() {
    return resource;
  }

  function onlineTime() {

  }

  function move(deltaTime, heading) {
    heading = new THREE.Vector2(heading.x, heading.z);
    var direction = TIERRA.resources.Input.getInput();
    var deltaMove = {
      x: 0,
      y: 0,
      z: 0
    };
    var angle = Math.atan2(direction.z, direction.x); //atan z and x instead of x and z to rotate over the y axis
    if (angle < Math.PI) {
      angle += Math.PI * 2;
    }
    if (direction.x !== 0 || direction.z !== 0) {
      movement = deltaTime * speed * 100;
      heading.rotateAround({
        x: 0,
        y: 0
      }, angle);
      heading.normalize();
      deltaMove.x = heading.x;
      deltaMove.z = heading.y;
      deltaMove.x *= movement;
      deltaMove.z *= movement;
      deltaMove = {
        x: deltaMove.x,
        y: 0,
        z: deltaMove.z
      };
      setPosition({
        x: position.x + deltaMove.x,
        y: 0,
        z: position.z + deltaMove.z
      });
    }
    if (jumping === false) {
      if (direction.y !== 0) {
        //TODO Start jump
      }
    } else {
      //TODO Calculate next y position
    }
    return deltaMove;
  }

  function getPosition() {
    return position;
  }

  function setPosition(pos) {
    position.x = pos.x;
    position.y = pos.y;
    position.z = pos.z;

    resource.position.x = pos.x;
    resource.position.y = pos.y;
    resource.position.z = pos.z;
  }

  function jump() {

  }
};
