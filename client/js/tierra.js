// scene object variables
var renderer, scene, camera, pointLight, spotLight, control;

// ball variables
var paddle1, paddle2, obstacle1, obstacle2;
var mainCharacter;

// game-related variables
var ySpeed = 0;
var jumping = false;

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
  renderer = new THREE.WebGLRenderer({
    antialias: true
  });
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
  var obstacleMaterial =
    new THREE.MeshLambertMaterial({
      color: 0x00FF00
    });


  // // set up the sphere vars
  // lower 'segment' and 'ring' values will increase performance
  var radius = 5,
    segments = 50,
    rings = 50;

  // // create the sphere's material
  var sphereMaterial = new THREE.MeshLambertMaterial({
    color: 0xD43001
  });

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

  mainCharacter = new TIERRA.PlayingCharacter();
  scene.add(mainCharacter.getModel());

  obstacle1 = new THREE.Mesh(

    new THREE.CubeGeometry(
      100,
      100,
      100,
      1),

    obstacleMaterial);

  // // add the sphere to the scene
  scene.add(obstacle1);
  obstacle1.position.x = -200;
  obstacle1.position.y = 0;
  obstacle1.position.z = -100;
  obstacle1.receiveShadow = true;
  obstacle1.castShadow = true;

  obstacle2 = new THREE.Mesh(

    new THREE.CubeGeometry(
      100,
      100,
      100,
      1),

    obstacleMaterial);

  // // add the sphere to the scene
  scene.add(obstacle2);
  obstacle2.position.x = 200;
  obstacle2.position.y = 0;
  obstacle2.position.z = 100;
  obstacle2.receiveShadow = true;
  obstacle2.castShadow = true;

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
  paddle1.position.x = -500;
  paddle1.position.y = 0;

  // lift paddles over playing surface
  paddle2.position.x = 500;
  paddle2.position.y = 0;


  // finally we finish by adding a ground plane
  // to show off pretty shadows
  var ground = new THREE.Mesh(

    new THREE.CubeGeometry(
      1000,
      3,
      1000,
      1),

    groundMaterial);
  // set ground to arbitrary z position to best show off shadowing
  ground.receiveShadow = true;
  ground.position.y = -7;
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
  camera.position.set(mainCharacter.getPosition().x - 100, mainCharacter.getPosition().y + 25, mainCharacter.getPosition().z);

  // MAGIC SHADOW CREATOR DELUXE EDITION with Lights PackTM DLC
  renderer.shadowMap = true;
}

function draw() {
  var deltaMove = {};
  var dt = clock.getDelta();
  var heading = {
    x: mainCharacter.getPosition().x - camera.position.x,
    y: mainCharacter.getPosition().y - camera.position.y,
    z: mainCharacter.getPosition().z - camera.position.z
  };
  deltaMove = mainCharacter.move(dt, heading);
  cameraPhysics(deltaMove);

  //control.update(dt);
  // draw THREE.JS scene
  // loop draw function call
  // deltaMove = playerPaddleMovement(dt);
  renderer.render(scene, camera);

  requestAnimationFrame(draw);
}

// Handles camera and lighting logic
function cameraPhysics(deltaMove) {
  control.target.set(mainCharacter.getPosition().x, mainCharacter.getPosition().y, mainCharacter.getPosition().z);
  camera.position.x += deltaMove.x;
  camera.position.y += deltaMove.y;
  camera.position.z += deltaMove.z;
  control.update();
}

// Handles player's paddle movement
function playerPaddleMovement(time) {

  var heading = new THREE.Vector2(mainCharacter.getPosition().x, mainCharacter.getPosition().y, mainCharacter.getPosition().z);
  heading.normalize();
  var xMove = 0;
  var yMove = 0;
  var zMove = 0;

  var delta = new THREE.Vector3(0, 0, 0);


    if (!jumping) {
      jumping = true;
      ySpeed = 40;
    }
  var angle = 0;
  if (xMove !== 0 || yMove !== 0 || zMove !== 0) {
    if (xMove == 1) {
      if (zMove == 1) {
        angle = 45;
      } else if (zMove == -1) {
        angle = 315;
      } else {
        angle = 0;
      }
    } else if (xMove == -1) {
      if (zMove == 1) {
        angle = 135;
      } else if (zMove == -1) {
        angle = 225;
      } else {
        angle = 180;
      }
    } else {
      if (zMove == 1) {
        angle = 90;
      } else if (zMove == -1) {
        angle = 270;
      } else {
        angle = -1;
      }
    }
    if (angle != -1) {
      heading.rotateAround({
        x: 0,
        y: 0
      }, angle * Math.PI / 180);
      delta.x = heading.x;
      delta.z = heading.y;
    }
  }

  if (!jumping) {
    delta.x = delta.x * 2;
    delta.z = delta.z * 2;
  } else {
    //delta.y = ySpeed + 1/2 * gravity * time * time;
    //ySpeed = gravity * time;
    delta.y = ySpeed/10;
    ySpeed--;
  }

  //Collision y
  if(paddle1.position.y + delta.y < 5) {
    jumping = false;
    delta.y = 0;
  }
  //mainCharacter.setPosition({x: delta.x, y: delta.y, z: delta.z});

  return delta;
}
