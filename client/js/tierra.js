function setup() {
  IMAGINE.init();
  createScene();
  draw();
}

function createScene() {
  TIERRA.mainCharacter = new TIERRA.PlayingCharacter({
    x: (Math.random() * 1000) - 500,
    y: 0,
    z: (Math.random() * 1000) - 500
  });
  IMAGINE.setActivePlayer(TIERRA.mainCharacter);
  IMAGINE.updateCameraPosition();
}

function draw() {
  var deltaMove = {};
  deltaMove = TIERRA.mainCharacter.move(IMAGINE.getDeltaTime(), IMAGINE.getHeading());
  IMAGINE.update(deltaMove);
  IMAGINE.render();
  requestAnimationFrame(draw);
}
