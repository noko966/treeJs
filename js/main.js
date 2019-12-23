window.addEventListener("load", init, false);

function init(event) {
  createScene();
  createBg();
  createGrass();
  createPlayers();
  document.addEventListener("mousemove", onMouseMove, false);
  loop();
}

var scene,
  camera,
  fieldOfView,
  aspectRatio,
  nearPlane,
  farPlane,
  HEIGHT,
  WIDTH,
  renderer,
  controls,
  container;

var center = new THREE.Vector3();

function createScene() {
  HEIGHT = window.innerHeight;
  WIDTH = window.innerWidth;

  // Create the scene
  scene = new THREE.Scene();

  // Create the camera
  aspectRatio = WIDTH / HEIGHT;
  fieldOfView = 45;
  nearPlane = 1;
  farPlane = 10000;
  camera = new THREE.PerspectiveCamera(
    fieldOfView,
    aspectRatio,
    nearPlane,
    farPlane
  );

  // Create the renderer
  renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true
  });

  var axesHelper = new THREE.AxesHelper(5);
  scene.add(axesHelper);

  camera.position.set(-100, 0, 0);
  camera.lookAt(center);

  renderer.setSize(WIDTH, HEIGHT);

  container = document.getElementById("world");
  container.appendChild(renderer.domElement);
  window.addEventListener("resize", handleWindowResize, false);
}

function handleWindowResize() {
  // update height and width of the renderer and the camera
  HEIGHT = window.innerHeight;
  WIDTH = window.innerWidth;
  renderer.setSize(WIDTH, HEIGHT);
  camera.aspect = WIDTH / HEIGHT;
  camera.updateProjectionMatrix();
}

var hemisphereLight, shadowLight, light, hlight;

function createLights() {
  // A hemisphere light is a gradient colored light;
  // the first parameter is the sky color, the second parameter is the ground color,
  // the third parameter is the intensity of the light
  // hemisphereLight = new THREE.HemisphereLight(0xaaaaaa, 0x000000, 0.9);

  // A directional light shines from a specific direction.
  // It acts like the sun, that means that all the rays produced are parallel.
  // shadowLight = new THREE.DirectionalLight(0xffffff, 0.9);

  // Set the direction of the light
  // shadowLight.position.set(150, 350, 350);

  // Allow shadow casting
  // shadowLight.castShadow = true;

  // define the visible area of the projected shadow
  // shadowLight.shadow.camera.left = -400;
  // shadowLight.shadow.camera.right = 400;
  // shadowLight.shadow.camera.top = 400;
  // shadowLight.shadow.camera.bottom = -400;
  // shadowLight.shadow.camera.near = 1;
  // shadowLight.shadow.camera.far = 1000;

  // define the resolution of the shadow; the higher the better,
  // but also the more expensive and less performant
  // shadowLight.shadow.mapSize.width = 2048;
  // shadowLight.shadow.mapSize.height = 2048;

  // to activate the lights, just add them to the scene
  // scene.add(hemisphereLight);
  // scene.add(shadowLight);

  // shadowLight = new THREE.DirectionalLight(0xffffff, 0.9);
  hlight = new THREE.AmbientLight(0x404040, 100);
  scene.add(hlight);

  light = new THREE.PointLight(0xc4c4c4, 10);
  light.position.set(0, 300, 500);
  scene.add(light);
}

//creating scene objects

var bg;
var bgW = 190;
var bgAspectRatio = 56.25;
var bgH = (bgW * bgAspectRatio) / 100;

function createBg() {
  var geometry = new THREE.PlaneGeometry(bgW, bgH, 1);
  var material = new THREE.MeshBasicMaterial({
    map: new THREE.TextureLoader().load("img/bg.jpg"),
    transparent: true
  });

  material.encoding = THREE.sRGBEncoding;

  material.anisotopy = 16;

  bg = new THREE.Mesh(geometry, material);
  bg.position.x = -10;
  bg.position.y = 0;
  bg.position.z = 0;

  bg.rotation.y = -Math.PI / 2;

  scene.add(bg);
}

var grass;
var grassW = 190;
var grassAspectRatio = 20.7;
var grassH = (grassW * grassAspectRatio) / 100;

function createGrass() {
  var geometry = new THREE.PlaneGeometry(grassW, grassH, 1);
  var material = new THREE.MeshBasicMaterial({
    map: new THREE.TextureLoader().load("img/grass.png"),
    transparent: true
  });

  material.encoding = THREE.sRGBEncoding;

  material.anisotopy = 16;

  grass = new THREE.Mesh(geometry, material);
  grass.position.x = -20;
  grass.position.y = -32;
  grass.position.z = 0;

  grass.rotation.y = -Math.PI / 2;

  scene.add(grass);
}

var players;
var playersW = 20;
var playersAspectRatio = 135.56;
var playersH = (playersW * playersAspectRatio) / 100;

function createPlayers() {
  var geometry = new THREE.PlaneGeometry(playersW, playersH, 1);
  var material = new THREE.MeshBasicMaterial({
    map: new THREE.TextureLoader().load("img/players.png"),
    transparent: true
  });

  material.encoding = THREE.sRGBEncoding;

  material.anisotopy = 16;

  players = new THREE.Mesh(geometry, material);
  players.position.x = -30;
  players.position.y = -20;
  players.position.z = 0;

  players.rotation.y = -Math.PI / 2;

  scene.add(players);
}

function loop() {
  renderer.render(scene, camera);
  drag(mouse.x, mouse.y);
  console.log(mouse.x, mouse.y);

  requestAnimationFrame(loop);
}

var frameId = 0;
function redraw() {
  cancelAnimationFrame(frameId);
  frameId = requestAnimationFrame(loop);
}

const mouse = new THREE.Vector2();

function onMouseMove(event) {
  mouse.x = -1 + event.clientX / (WIDTH / 2);
  mouse.y = 1 - event.clientY / (HEIGHT / 2);
}

function drag(deltaX, deltaY) {
  // console.log(deltaX, deltaY);

  var radPerPixel = Math.PI / 450,
    deltaPhi = radPerPixel * deltaY,
    deltaTheta = radPerPixel * deltaX,
    pos = camera.position.sub(center),
    radius = pos.length(),
    theta = Math.acos(pos.z / radius),
    phi = Math.atan2(pos.y, pos.x);

  // Subtract deltaTheta and deltaPhi
  theta = Math.min(Math.max(theta - deltaTheta, 0), Math.PI);
  phi -= deltaPhi;

  // Turn back into Cartesian coordinates
  pos.x = radius * Math.sin(theta) * Math.cos(phi);
  pos.y = radius * Math.sin(theta) * Math.sin(phi);
  pos.z = radius * Math.cos(theta);

  camera.position.add(center);
  camera.lookAt(center);
  redraw();
}
