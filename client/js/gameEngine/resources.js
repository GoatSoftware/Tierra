TIERRA.resources = {};

TIERRA.resources.Resource = function(object, position) {
  var self = this;
  var model;
  var texture;
  var material;
  var error;
  var receiveShadow;
  var castShadow;
  var type;
  //TODO TEMP
  var radius;
  var segments = 6;
  var rings = 6;

  self.getModel = getModel;

  init();

  function init() {
    type = object;
    switch (object) {
      case 'playingCharacter':
        try {
          material = new THREE.MeshLambertMaterial({
            color: 0x1B32C0
          });
          radius = 5;
          segments = 50;
          rings = 50;
          model = new THREE.Mesh(
            new THREE.SphereGeometry(
              radius,
              segments,
              rings),
            material);
          model.receiveShadow = true;
          model.castShadow = true;
          model.position.x = position.x;
          model.position.y = position.y;
          model.position.z = position.z;
        } catch (err) {
          console.error('Error loading object ' + object + ': ' + err);
          var error = err;
        }
        break;
      default:
        break;
    }
  }

  function getModel() {
    return model;
  }

  return model;
};

var inputManager = function() {
  var self = this;

  self.getInput = getInput;

  init();

  //Private
  function init() {
    window.addEventListener('keyup', function(event) {
      Key.onKeyup(event);
    }, false);
    window.addEventListener('keydown', function(event) {
      Key.onKeydown(event);
    }, false);
    // window.addEventListener('mousedown', function(event) {
    //   Mouse.onMouseDown(event);
    // }, false);
    // window.addEventListener('mouseup', function(event) {
    //   Mouse.onMouseUp(event);
    // }, false);
    // window.addEventListener("mousewheel", function(event) {
    //   Mouse.onMouseWheel(event);
    // }, false);
    window.addEventListener("contextmenu", function(e) {
      e.preventDefault();
    }, false);
  }

  function getInput() {
    var direction = new THREE.Vector3(0, 0, 0);
    if (Key.isDown(Key.A)) {
      // move left
      direction.z += -1;
    }
    if (Key.isDown(Key.D)) {
      // move right
      direction.z += 1;
    }
    if (Key.isDown(Key.W)) {
      // move front
      direction.x += 1;
    }
    if (Key.isDown(Key.S)) {
      // move back
      direction.x += -1;
    }
    if (Key.isDown(Key.SPACE)) {
      direction.y = 1;
    }
    return direction;
  }

  var Key = {
    _pressed: {},
    A: 65,
    W: 87,
    D: 68,
    S: 83,
    F: 70,
    SPACE: 32,

    isDown: function(keyCode) {
      return this._pressed[keyCode];
    },

    onKeydown: function(event) {
      this._pressed[event.keyCode] = true;
    },

    onKeyup: function(event) {
      delete this._pressed[event.keyCode];
    }
  };
  var Mouse = {
    _clicked: {},
    _wheel: 0,
    _moved: {
      x: 0,
      y: 0
    },

    leftClick: 1,
    rightClick: 3,
    middleClick: 2,
    wheelUp: 3,
    wheelDown: 4,

    isPressed: function(button) {
      return this._clicked[button];
    },

    scrolled: function() {
      var wheel = this._wheel;
      this._wheel = 0;
      return wheel;
    },

    movement: function() {
      var deltaMove = {
        x: this._moved.x,
        y: this._moved.y
      };
      this._moved = {
        x: 0,
        y: 0
      };
      return deltaMove;
    },

    onMouseDown: function(event) {
      this._clicked[event.which] = true;
      window.addEventListener('mousemove', Mouse.onMouseMove, false);
    },

    onMouseUp: function(event) {
      delete this._clicked[event.which];
      this._moved = {
        x: 0,
        y: 0
      };
      window.removeEventListener('mousemove', Mouse.onMouseMove);
    },

    onMouseMove: function(event) {
      Mouse._moved.x += event.movementX;
      Mouse._moved.y += event.movementY;
    },

    onMouseWheel: function(event) {
      this._wheel += event.wheelDelta;
    }
  };
};

TIERRA.resources.Input = new inputManager();
