window.addEventListener('keyup', function(event) { Key.onKeyup(event); }, false);
window.addEventListener('keydown', function(event) { Key.onKeydown(event); }, false);
window.addEventListener('mousedown', function(event) { Mouse.onMouseDown(event); }, false);
window.addEventListener('mouseup', function(event) { Mouse.onMouseUp(event) }, false);
window.addEventListener("contextmenu", function(e) { e.preventDefault(); }, false);
window.addEventListener("mousewheel", function(event) { Mouse.onMouseWheel(event); }, false);

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
