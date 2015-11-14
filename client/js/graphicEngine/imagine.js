var IMAGINE = IMAGINE || {};

IMAGINE.init = function() {

  // ball variables
  var paddle1, paddle2, obstacle1, obstacle2;
  // scene object variables
  var pointLight, spotLight;
  // set the scene size
  var WIDTH = 1366,
    HEIGHT = 663;

  // set some camera attributes
  var VIEW_ANGLE = 50,
    ASPECT = WIDTH / HEIGHT,
    NEAR = 0.1,
    FAR = 10000;

  var c = document.getElementById("gameCanvas");

  // create a WebGL renderer, camera
  // and a scene
  IMAGINE._renderer = new THREE.WebGLRenderer({
    antialias: true
  });
  IMAGINE._camera =
    new THREE.PerspectiveCamera(
      VIEW_ANGLE,
      ASPECT,
      NEAR,
      FAR);

  IMAGINE._cameraDefaultPosition = {
    x: -100,
    y: 25,
    z: 0
  };

  IMAGINE._scene = new THREE.Scene();

  // add the camera to the scene
  IMAGINE._scene.add(IMAGINE._camera);

  // set a default position for the camera
  // not doing this somehow messes up shadow rendering
  IMAGINE._camera.up = new THREE.Vector3(0, 1, 0);

  IMAGINE._control = new THREE.OrbitControls(IMAGINE._camera, c);

  IMAGINE._control.enablePan = false;
  IMAGINE._control.maxDistance = 250;

  IMAGINE._control.mouseButtons = {
    PAN: THREE.MOUSE.LEFT,
    ZOOM: THREE.MOUSE.MIDDLE,
    ORBIT: THREE.MOUSE.RIGHT
  };

  // start the renderer
  IMAGINE._renderer.setSize(WIDTH, HEIGHT);

  // attach the render-supplied DOM element
  c.appendChild(IMAGINE._renderer.domElement);

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
  IMAGINE._scene.add(paddle1);
  paddle1.receiveShadow = true;
  paddle1.castShadow = true;


  obstacle1 = new THREE.Mesh(

    new THREE.CubeGeometry(
      100,
      100,
      100,
      1),

    obstacleMaterial);

  // // add the sphere to the scene
  IMAGINE._scene.add(obstacle1);
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
  IMAGINE._scene.add(obstacle2);
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
  IMAGINE._scene.add(paddle2);

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
  IMAGINE._scene.add(ground);

  // // create a point light
  pointLight =
    new THREE.PointLight(0xF8D898);

  // set its position
  pointLight.position.x = 0;
  pointLight.position.y = 2500;
  pointLight.position.z = 0;
  pointLight.intensity = 2.9;
  pointLight.distance = 10000;
  // add to the scene
  IMAGINE._scene.add(pointLight);

  // add a spot light
  // this is important for casting shadows
  spotLight = new THREE.SpotLight(0xF8D898);
  spotLight.position.set(0, 460, 0);
  spotLight.intensity = 1.5;
  spotLight.castShadow = true;
  IMAGINE._scene.add(spotLight);

  IMAGINE._clock = new THREE.Clock();

  // MAGIC SHADOW CREATOR DELUXE EDITION with Lights PackTM DLC
  IMAGINE._renderer.shadowMap = true;
};

IMAGINE.setActivePlayer = function(activePlayer) {
  IMAGINE._activePlayer = activePlayer;
  IMAGINE._scene.add(IMAGINE._activePlayer.getModel());
};

IMAGINE.updateCameraPosition = function() {
  IMAGINE._camera.position.set(IMAGINE._activePlayer.getPosition().x + IMAGINE._cameraDefaultPosition.x, IMAGINE._activePlayer.getPosition().y + IMAGINE._cameraDefaultPosition.y, IMAGINE._activePlayer.getPosition().z + IMAGINE._cameraDefaultPosition.z);
};

IMAGINE.getDeltaTime = function() {
  return IMAGINE._clock.getDelta();
};

IMAGINE.getHeading = function() {
  return {
    x: IMAGINE._activePlayer.getPosition().x - IMAGINE._camera.position.x,
    y: IMAGINE._activePlayer.getPosition().y - IMAGINE._camera.position.y,
    z: IMAGINE._activePlayer.getPosition().z - IMAGINE._camera.position.z
  };
};

IMAGINE.update = function(deltaMove) {
  IMAGINE._control.target.set(IMAGINE._activePlayer.getPosition().x, IMAGINE._activePlayer.getPosition().y, IMAGINE._activePlayer.getPosition().z);
  IMAGINE._camera.position.x += deltaMove.x;
  IMAGINE._camera.position.y += deltaMove.y;
  IMAGINE._camera.position.z += deltaMove.z;
  IMAGINE._control.update();
};

IMAGINE.render = function() {
  IMAGINE._renderer.render(IMAGINE._scene, IMAGINE._camera);
};
