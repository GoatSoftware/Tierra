// scene object variables
var renderer, scene, camera, pointLight, spotLight, control;

var cameraVector = {
  x: -100,
  y: 0,
  z: 50,
  angle: {
    x: 0,
    y: -60,
    z: -90
  }
};

// field variables
var fieldWidth = 1000,
  fieldHeight = 1000;

// paddle variables
var paddleWidth, paddleHeight, paddleDepth, paddleQuality;
var paddle1DirZ = 0,
  paddle2DirY = 0,
  paddleSpeed = 3;

// ball variables
var ball, paddle1, paddle2;
var ballDirX = 1,
  ballDirY = 1,
  ballSpeed = 2;

// game-related variables
var score1 = 0,
  score2 = 0;
// you can change this to any positive whole number
var maxScore = 7;

// set opponent reflexes (0 - easiest, 1 - hardest)
var difficulty = 0.2;

// ------------------------------------- //
// ------- GAME FUNCTIONS -------------- //
// ------------------------------------- //

function setup() {
  // set up all the 3D objects in the scene
  createScene();

  // and let's get cracking!
  draw();
}

function createScene() {
  // set the scene size
  var WIDTH = 640,
    HEIGHT = 360;

  // set some camera attributes
  var VIEW_ANGLE = 50,
    ASPECT = WIDTH / HEIGHT,
    NEAR = 0.1,
    FAR = 10000;

  var c = document.getElementById("gameCanvas");

  // create a WebGL renderer, camera
  // and a scene
  renderer = new THREE.WebGLRenderer({antialias: true});
  camera =
    new THREE.PerspectiveCamera(
      VIEW_ANGLE,
      ASPECT,
      NEAR,
      FAR);

  scene = new THREE.Scene();

  // add the camera to the scene
  scene.add(camera);

  // set a default position for the camera
  // not doing this somehow messes up shadow rendering
  camera.up = new THREE.Vector3(0, 1, 0);

  control = new THREE.OrbitControls(camera, c);

  control.enablePan = false;
  control.maxDistance = 250;

  control.mouseButtons = {
    PAN: THREE.MOUSE.LEFT,
    ZOOM: THREE.MOUSE.MIDDLE,
    ORBIT: THREE.MOUSE.RIGHT
  };

  // start the renderer
  renderer.setSize(1366, 663);

  // attach the render-supplied DOM element
  c.appendChild(renderer.domElement);

  // create the paddle1's material
  var paddle1Material =
    new THREE.MeshLambertMaterial({
      color: 0x1B32C0
    });
  // create the paddle2's material
  var paddle2Material =
    new THREE.MeshLambertMaterial({
      color: 0xFF4045
    });
  // create the ground's material
  var groundMaterial =
    new THREE.MeshLambertMaterial({
      color: 0x888888
    });


  // // set up the sphere vars
  // lower 'segment' and 'ring' values will increase performance
  var radius = 5,
    segments = 6,
    rings = 6;

  // // create the sphere's material
  var sphereMaterial = new THREE.MeshLambertMaterial({
    color: 0xD43001
  });

  // Create a ball with sphere geometry

  // // set up the paddle vars
  paddleWidth = 10;
  paddleHeight = 30;
  paddleDepth = 10;
  paddleQuality = 1;

  paddle1 = new THREE.Mesh(

    new THREE.SphereGeometry(
      radius,
      segments,
      rings),

    paddle1Material);

  // // add the sphere to the scene
  scene.add(paddle1);
  paddle1.receiveShadow = true;
  paddle1.castShadow = true;

  /**
   * TEST MODEL OBJ
   */
  // prepare loader and load the model
  // THREE.ImageUtils.crossOrigin = "anonymous";
  // var oLoader = new THREE.OBJLoader();
  // oLoader.load('/resources/models/scarab.obj', function(object, materials) {
  //
  //   // var material = new THREE.MeshFaceMaterial(materials);
  //   var material2 = new THREE.MeshLambertMaterial({
  //     color: 0xa65e00
  //   });
  //
  //   object.traverse(function(child) {
  //     if (child instanceof THREE.Mesh) {
  //
  //       // apply custom material
  //       child.material = material2;
  //
  //       // enable casting shadows
  //       child.castShadow = true;
  //       child.receiveShadow = true;
  //     }
  //   });
  //
  //   object.position.x = 0;
  //   object.position.y = 0;
  //   object.position.z = 0;
  //   object.scale.set(1, 1, 1);
  //   scene.add(object);
  // });

  paddle2 = new THREE.Mesh(

    new THREE.SphereGeometry(
      radius,
      segments,
      rings),

    sphereMaterial);

  // // add the sphere to the scene
  scene.add(paddle2);

  paddle2.position.x = 0;
  paddle2.position.y = 0;
  paddle2.receiveShadow = true;
  paddle2.castShadow = true;

  // set paddles on each side of the table
  paddle1.position.x = -fieldWidth / 2 + paddleWidth;
  paddle2.position.x = fieldWidth / 2 - paddleWidth;

  // lift paddles over playing surface
  paddle1.position.y = paddleDepth;
  paddle2.position.y = paddleDepth;


  // finally we finish by adding a ground plane
  // to show off pretty shadows
  var ground = new THREE.Mesh(

    new THREE.CubeGeometry(
      1000,
      3,
      1000,
      1,
      1,
      1),

    groundMaterial);
  // set ground to arbitrary z position to best show off shadowing
  ground.receiveShadow = true;
  scene.add(ground);

  // // create a point light
  pointLight =
    new THREE.PointLight(0xF8D898);

  // set its position
  pointLight.position.x = 1000;
  pointLight.position.y = 2500;
  pointLight.position.z = 500;
  pointLight.intensity = 2.9;
  pointLight.distance = 10000;
  // add to the scene
  scene.add(pointLight);

  // add a spot light
  // this is important for casting shadows
  spotLight = new THREE.SpotLight(0xF8D898);
  spotLight.position.set(460, 0, 0);
  spotLight.intensity = 1.5;
  spotLight.castShadow = true;
  scene.add(spotLight);

  clock = new THREE.Clock();
  camera.position.set(paddle1.position.x - 100, paddle1.position.y + 25, paddle1.position.z);

  // MAGIC SHADOW CREATOR DELUXE EDITION with Lights PackTM DLC
  renderer.shadowMap = true;
}

function draw() {
  var deltaMove = {};
  //var dt = clock.getDelta();
  //control.update(dt);
  // draw THREE.JS scene
  renderer.render(scene, camera);
  // loop draw function call
  requestAnimationFrame(draw);

  ballPhysics();
  paddlePhysics();
  deltaMove = playerPaddleMovement();
  cameraPhysics(deltaMove);
  opponentPaddleMovement();
}

// Handles camera and lighting logic
function cameraPhysics(deltaMove) {
  camera.position.x += deltaMove.x;
  camera.position.y += deltaMove.y;
  camera.position.z += deltaMove.z;
  control.target.set(paddle1.position.x, paddle1.position.y, paddle1.position.z);
  control.update();
  if(Key.isDown(Key.F)) {
    camera.rotation.z += Math.PI / 4;
  }
}

function ballPhysics() {

}

// Handles CPU paddle movement and logic
function opponentPaddleMovement() {

}


// Handles player's paddle movement
function playerPaddleMovement() {

  var direction = new THREE.Vector2(paddle1.position.x - camera.position.x, paddle1.position.z - camera.position.z);
  direction.normalize();
  var xMove = 0;
  var yMove = 0;
  var zMove = 0;

  var delta = new THREE.Vector3(0, 0, 0);

  if (Key.isDown(Key.A)) {
    // move left
    zMove += -1;
  }
  if (Key.isDown(Key.D)) {
    // move right
    zMove += 1;
  }
  if (Key.isDown(Key.W)) {
    // move front
    xMove += 1;
  }
  if (Key.isDown(Key.S)) {
    // move back
    xMove += -1;
  }
  var angle = 0;
  if(xMove !== 0 || yMove !== 0 || zMove !== 0) {
    if(xMove == 1) {
      if(zMove == 1) {
        angle = 45;
      } else if(zMove == -1) {
        angle = 415;
      } else {
        angle = 0;
      }
    } else if (xMove == -1) {
        if(zMove == 1) {
          angle = 135;
        } else if(zMove == -1) {
          angle = 225;
        } else {
          angle = 180;
        }
    } else {
        if(zMove == 1) {
          angle = 90;
        } else if(zMove == -1) {
          angle = 270;
        } else {
          angle = -1;
        }
    }
    if(angle != -1) {
      direction.rotateAround({x:0,y:0}, angle * Math.PI / 180);
      delta.x = direction.x;
      delta.y = yMove;
      delta.z = direction.y;
    }
  }


  paddle1.position.x += delta.x;
  paddle1.position.y += delta.y;
  paddle1.position.z += delta.z;

  return delta;
}

// Handles paddle collision logic
function paddlePhysics() {

}

function resetBall(loser) {

}
