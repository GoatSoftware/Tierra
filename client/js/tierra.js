// --------------------------------------------- //
// ------- 3D PONG built with Three.JS --------- //
// -------- Created by Nikhil Suresh ----------- //
// -------- Three.JS is by Mr. doob  ----------- //
// --------------------------------------------- //

// ------------------------------------- //
// ------- GLOBAL VARIABLES ------------ //
// ------------------------------------- //

// scene object variables
var renderer, scene, camera, pointLight, spotLight;

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
var paddle1DirY = 0,
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
  // update the board to reflect the max score for match win
  document.getElementById("winnerBoard").innerHTML = "First to " + maxScore + " wins!";

  // now reset player and opponent scores
  score1 = 0;
  score2 = 0;

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
  renderer = new THREE.WebGLRenderer();
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
  camera.position.x = 0;
  camera.position.y = 0;
  camera.position.z = 0;

  // start the renderer
  renderer.setSize(WIDTH, HEIGHT);

  // attach the render-supplied DOM element
  c.appendChild(renderer.domElement);

  // set up the playing surface plane
  var planeWidth = fieldWidth,
    planeHeight = fieldHeight,
    planeQuality = 10;

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
  // create the plane's material
  var planeMaterial =
    new THREE.MeshLambertMaterial({
      color: 0x4BD121
    });
  // create the ground's material
  var groundMaterial =
    new THREE.MeshLambertMaterial({
      color: 0x888888
    });


  // create the playing surface plane
  var plane = new THREE.Mesh(

    new THREE.PlaneGeometry(
      planeWidth * 0.95, // 95% of table width, since we want to show where the ball goes out-of-bounds
      planeHeight,
      planeQuality,
      planeQuality),

    planeMaterial);

  scene.add(plane);
  plane.receiveShadow = true;


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
  ball = new THREE.Mesh(

    new THREE.SphereGeometry(
      radius,
      segments,
      rings),

    sphereMaterial);

  // // add the sphere to the scene
  scene.add(ball);

  ball.position.x = 0;
  ball.position.y = 0;
  // set ball above the table surface
  ball.position.z = radius;
  ball.receiveShadow = true;
  ball.castShadow = true;



  /**
   * PADDLE1
   */
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
  /*paddle1 = new THREE.Mesh(

    new THREE.CubeGeometry(
      paddleWidth,
      paddleHeight,
      paddleDepth,
      paddleQuality,
      paddleQuality,
      paddleQuality),

    paddle1Material);*/

  // // add the sphere to the scene
  scene.add(paddle1);
  paddle1.receiveShadow = true;
  paddle1.castShadow = true;

  /**
   * END PADDLE1
   */

   /**
    * TEST PADDLE1
    */
    // prepare loader and load the model
  THREE.ImageUtils.crossOrigin = "anonymous";
  var oLoader = new THREE.OBJMTLLoader();
  oLoader.load('/resources/models/Female Base Model/woman_model1938.obj', '/resources/models/Female Base Model/woman_model1938.mtl', function(object, materials) {

  // var material = new THREE.MeshFaceMaterial(materials);
  var material2 = new THREE.MeshLambertMaterial({ color: 0xa65e00 });

  object.traverse( function(child) {
    if (child instanceof THREE.Mesh) {

      // apply custom material
      child.material = material2;

      // enable casting shadows
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });

    object.position.x = 0;
    object.position.y = 0;
    object.position.z = 0;
    object.scale.set(1, 1, 1);
    scene.add(object);
  });

  /**
   * END TEST PADDLE1
   */
  paddle2 = new THREE.Mesh(

    new THREE.CubeGeometry(
      paddleWidth,
      paddleHeight,
      paddleDepth,
      paddleQuality,
      paddleQuality,
      paddleQuality),

    paddle2Material);

  // // add the sphere to the scene
  scene.add(paddle2);
  paddle2.receiveShadow = true;
  paddle2.castShadow = true;

  // set paddles on each side of the table
  paddle1.position.x = -fieldWidth / 2 + paddleWidth;
  paddle2.position.x = fieldWidth / 2 - paddleWidth;

  // lift paddles over playing surface
  paddle1.position.z = paddleDepth;
  paddle2.position.z = paddleDepth;

  // finally we finish by adding a ground plane
  // to show off pretty shadows
  var ground = new THREE.Mesh(

    new THREE.CubeGeometry(
      1000,
      1000,
      3,
      1,
      1,
      1),

    groundMaterial);
  // set ground to arbitrary z position to best show off shadowing
  ground.position.z = -132;
  ground.receiveShadow = true;
  scene.add(ground);

  // // create a point light
  pointLight =
    new THREE.PointLight(0xF8D898);

  // set its position
  pointLight.position.x = -1000;
  pointLight.position.y = 0;
  pointLight.position.z = 1000;
  pointLight.intensity = 2.9;
  pointLight.distance = 10000;
  // add to the scene
  scene.add(pointLight);

  // add a spot light
  // this is important for casting shadows
  spotLight = new THREE.SpotLight(0xF8D898);
  spotLight.position.set(0, 0, 460);
  spotLight.intensity = 1.5;
  spotLight.castShadow = true;
  scene.add(spotLight);

  // MAGIC SHADOW CREATOR DELUXE EDITION with Lights PackTM DLC
  renderer.shadowMapEnabled = true;
}

function draw() {
  // draw THREE.JS scene
  renderer.render(scene, camera);
  // loop draw function call
  requestAnimationFrame(draw);

  ballPhysics();
  paddlePhysics();
  cameraPhysics();
  playerPaddleMovement();
  opponentPaddleMovement();
}

function ballPhysics() {
  // if ball goes off the 'left' side (Player's side)
  /*if (ball.position.x <= -fieldWidth / 2) {
    // CPU scores
    score2++;
    // update scoreboard HTML
    document.getElementById("scores").innerHTML = score1 + "-" + score2;
    // reset ball to center
    resetBall(2);
    matchScoreCheck();
  }

  // if ball goes off the 'right' side (CPU's side)
  if (ball.position.x >= fieldWidth / 2) {
    // Player scores
    score1++;
    // update scoreboard HTML
    document.getElementById("scores").innerHTML = score1 + "-" + score2;
    // reset ball to center
    resetBall(1);
    matchScoreCheck();
  }

  // if ball goes off the top side (side of table)
  if (ball.position.y <= -fieldHeight / 2) {
    ballDirY = -ballDirY;
  }
  // if ball goes off the bottom side (side of table)
  if (ball.position.y >= fieldHeight / 2) {
    ballDirY = -ballDirY;
  }

  // update ball position over time
  ball.position.x += ballDirX * ballSpeed;
  ball.position.y += ballDirY * ballSpeed;

  // limit ball's y-speed to 2x the x-speed
  // this is so the ball doesn't speed from left to right super fast
  // keeps game playable for humans
  if (ballDirY > ballSpeed * 2) {
    ballDirY = ballSpeed * 2;
  } else if (ballDirY < -ballSpeed * 2) {
    ballDirY = -ballSpeed * 2;
  }*/
}

// Handles CPU paddle movement and logic
function opponentPaddleMovement() {
  // Lerp towards the ball on the y plane
  paddle2DirY = (ball.position.y - paddle2.position.y) * difficulty;

  // in case the Lerp function produces a value above max paddle speed, we clamp it
  if (Math.abs(paddle2DirY) <= paddleSpeed) {
    paddle2.position.y += paddle2DirY;
  }
  // if the lerp value is too high, we have to limit speed to paddleSpeed
  else {
    // if paddle is lerping in +ve direction
    if (paddle2DirY > paddleSpeed) {
      paddle2.position.y += paddleSpeed;
    }
    // if paddle is lerping in -ve direction
    else if (paddle2DirY < -paddleSpeed) {
      paddle2.position.y -= paddleSpeed;
    }
  }
  // We lerp the scale back to 1
  // this is done because we stretch the paddle at some points
  // stretching is done when paddle touches side of table and when paddle hits ball
  // by doing this here, we ensure paddle always comes back to default size
  paddle2.scale.y += (1 - paddle2.scale.y) * 0.2;
}


// Handles player's paddle movement
function playerPaddleMovement() {
  // move left
  if (Key.isDown(Key.A)) {
    // if paddle is not touching the side of table
    // we move
    if (paddle1.position.y < fieldHeight * 0.45) {
      paddle1DirY = paddleSpeed * 0.5;
    }
    // else we don't move and stretch the paddle
    // to indicate we can't move
    else {
      paddle1DirY = 0;
      paddle1.scale.z += (10 - paddle1.scale.z) * 0.2;
    }
  }
  // move right
  else if (Key.isDown(Key.D)) {
    // if paddle is not touching the side of table
    // we move
    if (paddle1.position.y > -fieldHeight * 0.45) {
      paddle1DirY = -paddleSpeed * 0.5;
    }
    // else we don't move and stretch the paddle
    // to indicate we can't move
    else {
      paddle1DirY = 0;
      paddle1.scale.z += (10 - paddle1.scale.z) * 0.2;
    }
  }
  // move front
  else if (Key.isDown(Key.W)) {
    // we move
    paddle1DirX = paddleSpeed * 0.5;
    // else we don't move and stretch the paddle
    // to indicate we can't move
  }
  // move back
  else if (Key.isDown(Key.S)) {
    // we move
    paddle1DirX = -paddleSpeed * 0.5;
    // else we don't move and stretch the paddle
    // to indicate we can't move
  }
  // else don't move paddle
  else {
    // stop the paddle
    paddle1DirY = 0;
    paddle1DirX = 0;
  }

  paddle1.scale.y += (1 - paddle1.scale.y) * 0.2;
  paddle1.scale.z += (1 - paddle1.scale.z) * 0.2;
  paddle1.position.y += paddle1DirY;
  paddle1.position.x += paddle1DirX;
}

// Handles camera and lighting logic
function cameraPhysics() {
  var mouseMove = {};
  var mouseWheel = 0;
  var newX = 0;
  var newY = 0;

  mouseMove = Mouse.movement();
  var x = camera.position.x,
    y = camera.position.y,
    z = camera.position.z;
  var radius = 100;
  if (Mouse.isPressed(Mouse.rightClick)) {
    var preCam = {};

    preCam.x = cameraVector.x * Math.cos((mouseMove.x * -1) / 100) - cameraVector.y * Math.sin((mouseMove.x * -1) / 100);
    preCam.y = cameraVector.y * Math.cos((mouseMove.x * -1) / 100) + cameraVector.x * Math.sin((mouseMove.x * -1) / 100);
    preCam.z = cameraVector.z * Math.cos((mouseMove.y * -1) / 100) + cameraVector.x * Math.sin((mouseMove.y * -1) / 100);

    cameraVector.x = preCam.x;
    cameraVector.y = preCam.y;
    cameraVector.z = preCam.z;
  }

  // we can easily notice shadows if we dynamically move lights during the game
  spotLight.position.x = paddle1.position.x * 2;
  spotLight.position.y = paddle1.position.y * 2;

  mouseWheel = Mouse.scrolled();
  if (mouseWheel !== 0) {
    cameraVector.x = cameraVector.x * (1+mouseWheel / 400);
    cameraVector.y = cameraVector.y * (1+mouseWheel / 400);
    cameraVector.z = cameraVector.z * (1+mouseWheel / 400);
  }

  // x alante atras
  // y izq dcha
  // z arriba abajo
  // move to behind the player's paddle
  camera.position.x = paddle1.position.x + cameraVector.x;
  camera.position.y = paddle1.position.y + cameraVector.y;
  camera.position.z = paddle1.position.z + cameraVector.z;

  camera.up = new THREE.Vector3(0, 0, 1);
  camera.lookAt(new THREE.Vector3(paddle1.position.x, paddle1.position.y, paddle1.position.z));

  direction = camera.rotation.x;
  direction = camera.rotation.y;
  // rotate to face towards the opponent
  //camera.rotation.x = cameraVector.angle.x * Math.PI / 180;
  //camera.rotation.y = cameraVector.angle.y * Math.PI / 180;
  //camera.rotation.z = cameraVector.angle.z * Math.PI / 180;


}

// Handles paddle collision logic
function paddlePhysics() {
  // PLAYER PADDLE LOGIC

  // if ball is aligned with paddle1 on x plane
  // remember the position is the CENTER of the object
  // we only check between the front and the middle of the paddle (one-way collision)
  if (ball.position.x <= paddle1.position.x + paddleWidth && ball.position.x >= paddle1.position.x) {
    // and if ball is aligned with paddle1 on y plane
    if (ball.position.y <= paddle1.position.y + paddleHeight / 2 && ball.position.y >= paddle1.position.y - paddleHeight / 2) {
      // and if ball is travelling towards player (-ve direction)
      if (ballDirX < 0) {
        // stretch the paddle to indicate a hit
        paddle1.scale.y = 15;
        // switch direction of ball travel to create bounce
        ballDirX = -ballDirX;
        // we impact ball angle when hitting it
        // this is not realistic physics, just spices up the gameplay
        // allows you to 'slice' the ball to beat the opponent
        ballDirY -= paddle1DirY * 0.7;
      }
    }
  }

  // OPPONENT PADDLE LOGIC

  // if ball is aligned with paddle2 on x plane
  // remember the position is the CENTER of the object
  // we only check between the front and the middle of the paddle (one-way collision)
  if (ball.position.x <= paddle2.position.x + paddleWidth && ball.position.x >= paddle2.position.x) {
    // and if ball is aligned with paddle2 on y plane
    if (ball.position.y <= paddle2.position.y + paddleHeight / 2 && ball.position.y >= paddle2.position.y - paddleHeight / 2) {
      // and if ball is travelling towards opponent (+ve direction)
      if (ballDirX > 0) {
        // stretch the paddle to indicate a hit
        paddle2.scale.y = 15;
        // switch direction of ball travel to create bounce
        ballDirX = -ballDirX;
        // we impact ball angle when hitting it
        // this is not realistic physics, just spices up the gameplay
        // allows you to 'slice' the ball to beat the opponent
        ballDirY -= paddle2DirY * 0.7;
      }
    }
  }
}

function resetBall(loser) {
  // position the ball in the center of the table
  ball.position.x = 0;
  ball.position.y = 0;

  // if player lost the last point, we send the ball to opponent
  if (loser == 1) {
    ballDirX = -1;
  }
  // else if opponent lost, we send ball to player
  else {
    ballDirX = 1;
  }

  // set the ball to move +ve in y plane (towards left from the camera)
  ballDirY = 1;
}

var bounceTime = 0;
// checks if either player or opponent has reached 7 points
function matchScoreCheck() {
  // if player has 7 points
  if (score1 >= maxScore) {
    // stop the ball
    ballSpeed = 0;
    // write to the banner
    document.getElementById("scores").innerHTML = "Player wins!";
    document.getElementById("winnerBoard").innerHTML = "Refresh to play again";
    // make paddle bounce up and down
    bounceTime++;
    paddle1.position.z = Math.sin(bounceTime * 0.1) * 10;
    // enlarge and squish paddle to emulate joy
    paddle1.scale.z = 2 + Math.abs(Math.sin(bounceTime * 0.1)) * 10;
    paddle1.scale.y = 2 + Math.abs(Math.sin(bounceTime * 0.05)) * 10;
  }
  // else if opponent has 7 points
  else if (score2 >= maxScore) {
    // stop the ball
    ballSpeed = 0;
    // write to the banner
    document.getElementById("scores").innerHTML = "CPU wins!";
    document.getElementById("winnerBoard").innerHTML = "Refresh to play again";
    // make paddle bounce up and down
    bounceTime++;
    paddle2.position.z = Math.sin(bounceTime * 0.1) * 10;
    // enlarge and squish paddle to emulate joy
    paddle2.scale.z = 2 + Math.abs(Math.sin(bounceTime * 0.1)) * 10;
    paddle2.scale.y = 2 + Math.abs(Math.sin(bounceTime * 0.05)) * 10;
  }
}
