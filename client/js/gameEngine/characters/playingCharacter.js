TIERRA.PlayingCharacter = function() {
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
      x: 0,
      y: 0,
      z: 0
    };
    resource = new TIERRA.resources.Resource('playingCharacter');
  }

  function getModel() {
    return resource;
  }

  function onlineTime() {

  }

  function move(deltaTime, heading) {
    heading = new THREE.Vector2(heading.x, heading.z);
    var direction = TIERRA.resources.Input.getInput();
    var deltaMove = {x: 0, y: 0, z: 0};
    var angle = 0;
    var code = direction.x.toString() + direction.z.toString();
    switch (code) {
      case "00":
        angle = 0;
        break;
      case "10":
        angle = 0;
        break;
      case "11":
        angle = 45;
        break;
      case "01":
        angle = 90;
        break;
      case "-11":
        angle = 135;
        break;
      case "-10":
        angle = 180;
        break;
      case "-1-1":
        angle = 225;
        break;
      case "0-1":
        angle = 270;
        break;
      case "1-1":
        angle = 315;
        break;
    }
    if(code != "00") {
      movement = deltaTime * speed * 100;
      heading.rotateAround({
        x: 0,
        y: 0
      }, angle * Math.PI / 180);
      heading.normalize();
      deltaMove.x = heading.x;
      deltaMove.z = heading.y;
      deltaMove.x *= movement;
      deltaMove.z *= movement;
      deltaMove = {x: deltaMove.x, y: 0, z:deltaMove.z};
      setPosition({x: position.x + deltaMove.x, y: 0, z: position.z + deltaMove.z});
    }
    return deltaMove;
    // return new THREE.Vector3(x, y, z);
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
