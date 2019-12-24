window.addEventListener("load", init, false);

function init(event) {
  createScene();
  // createSky();
  // createGrass();
  // createSeats();

  // createPlayer2();
  // createPlayers();
  // createBg();

  createShader();
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

  camera.position.set(-120, 0, 0);
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

//creating scene objects
var bg;
var bgW = 190;
var bgAspectRatio = 56.25;
var bgH = (bgW * bgAspectRatio) / 100;

var sky;
function createSky() {
  var geometry = new THREE.PlaneGeometry(bgW, bgH, 1);
  var material = new THREE.MeshBasicMaterial({
    map: new THREE.TextureLoader().load("img/Sky.png"),
    alphaMap: new THREE.TextureLoader().load("img/Sky_alpha.jpg"),
    // alphaTest: 0.5,
    transparent: true
    // blending: THREE.AdditiveBlending
  });

  material.encoding = THREE.sRGBEncoding;

  material.anisotopy = 16;

  sky = new THREE.Mesh(geometry, material);
  sky.position.x = -10;
  sky.position.y = 0;
  sky.position.z = 0;

  sky.rotation.y = -Math.PI / 2;

  scene.add(sky);
}

function createBg() {
  var geometry = new THREE.PlaneGeometry(bgW, bgH, 1);
  var material = new THREE.MeshBasicMaterial({
    map: new THREE.TextureLoader().load("img/bg.jpg")
    // blending: THREE.AdditiveBlending
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

var shader, shaderMaterial;
function createShader() {
  var texture1 = new THREE.TextureLoader().load("../img/bg.jpg");
  var texture2 = new THREE.TextureLoader().load("../img/seats.png");

  var geometry = new THREE.PlaneBufferGeometry(bgW, bgH, 30, 30);
  shaderMaterial = new THREE.ShaderMaterial({
    uniforms: {
      texture1: {
        value: texture1
      },
      texture2: {
        value: texture2
      },
      progress: {
        type: "f",
        value: 0
      }
    },
    vertexShader: document.getElementById("vertexshader").textContent,
    fragmentShader: document.getElementById("fragmentshader").textContent,
    wireframe: false
  });
  shader = new THREE.Mesh(geometry, shaderMaterial);
  shader.position.x = -5;
  shader.position.y = 0;
  shader.position.z = 0;

  shader.rotation.y = -Math.PI / 2;

  scene.add(shader);
}

var grass, seats;

function createSeats() {
  var geometry = new THREE.PlaneGeometry(bgW, bgH, 1);
  var material = new THREE.MeshBasicMaterial({
    map: new THREE.TextureLoader().load("img/seats.png"),
    alphaMap: new THREE.TextureLoader().load("img/seats_alpha.jpg"),
    // alphaTest: 0.5,
    transparent: true
  });

  material.encoding = THREE.sRGBEncoding;

  material.anisotopy = 16;

  seats = new THREE.Mesh(geometry, material);
  seats.position.x = -20;
  seats.position.z = 0;

  seats.rotation.y = -Math.PI / 2;

  scene.add(seats);
}

function createGrass() {
  var geometry = new THREE.PlaneGeometry(bgW, bgH, 1);
  var material = new THREE.MeshBasicMaterial({
    map: new THREE.TextureLoader().load("img/bg.jpg"),
    alphaMap: new THREE.TextureLoader().load("img/grass_alpha.jpg"),
    // alphaTest: 0.5,
    transparent: true
  });

  material.encoding = THREE.sRGBEncoding;

  material.anisotopy = 16;

  grass = new THREE.Mesh(geometry, material);
  grass.position.x = -15;
  // grass.position.y = -32;
  grass.position.z = 0;

  grass.rotation.y = -Math.PI / 2;

  scene.add(grass);
}

var players, player2;

function createPlayer2() {
  var geometry = new THREE.PlaneGeometry(bgW, bgH, 1);
  var material = new THREE.MeshBasicMaterial({
    map: new THREE.TextureLoader().load("img/player_2.png"),
    alphaMap: new THREE.TextureLoader().load("img/player_2_alpha.jpg"),
    transparent: true
    // alphaTest: 0.5
  });

  material.encoding = THREE.sRGBEncoding;

  material.anisotopy = 16;

  player2 = new THREE.Mesh(geometry, material);
  player2.position.x = -22;
  // players.position.y = -20;
  player2.position.z = 0;

  player2.rotation.y = -Math.PI / 2;

  scene.add(player2);
}

function createPlayers() {
  var geometry = new THREE.PlaneGeometry(bgW, bgH, 1);
  var material = new THREE.MeshBasicMaterial({
    map: new THREE.TextureLoader().load("img/players.png"),
    alphaMap: new THREE.TextureLoader().load("img/players_alpha.jpg"),
    transparent: true
    // alphaTest: 0.5
  });

  material.encoding = THREE.sRGBEncoding;

  material.anisotopy = 16;

  players = new THREE.Mesh(geometry, material);
  players.position.x = -21;
  // players.position.y = -20;
  players.position.z = 0;

  players.rotation.y = -Math.PI / 2;

  scene.add(players);
}

function loop() {
  renderer.render(scene, camera);
  // drag(mouse.x, mouse.y);

  // var x = camera.position.x;
  // var z = camera.position.z;

  // mouse.x -= (mouse.x - mouse2.x) * 0.02;
  // mouse.y -= (mouse.y - mouse2.y) * 0.02;

  camera.position.z = mouse.x * 5;
  camera.position.y = -mouse.y * 5;
  camera.lookAt(center);

  shaderMaterial.uniforms.progress.value = mouse.x;

  console.log(shaderMaterial.uniforms.progress.value);

  // camera.position.y = z * Math.cos(mouse.y) - x * Math.sin(mouse.y);
  // camera.position.z = z * Math.cos(mouse.y) - x * Math.sin(mouse.y);

  // console.log(mouse.x, mouse.y);

  requestAnimationFrame(loop);
}

var frameId = 0;
function redraw() {
  cancelAnimationFrame(frameId);
  frameId = requestAnimationFrame(loop);
}

const mouse = new THREE.Vector2();
const mouse2 = new THREE.Vector2();

function onMouseMove(event) {
  mouse.x = (event.clientX - WIDTH / 2) / (WIDTH / 2);
  mouse.y = (event.clientY - HEIGHT / 2) / (HEIGHT / 2);
  mouse2.x = mouse.x / 10;
  mouse2.y = mouse.y / 10;
}

// function drag(deltaX, deltaY) {
//   console.log(deltaX, deltaY);

//   var radPerPixel = Math.PI / 450,
//     deltaPhi = radPerPixel * deltaY,
//     deltaTheta = radPerPixel * deltaX,
//     pos = camera.position.sub(center),
//     radius = pos.length(),
//     theta = Math.acos(pos.z / radius),
//     phi = Math.atan2(pos.y, pos.x);

//   // console.log(pos);

//   // Subtract deltaTheta and deltaPhi
//   // theta = Math.min(Math.max(theta - deltaTheta, 0), Math.PI);
//   // phi -= deltaPhi;

//   // Turn back into Cartesian coordinates
//   pos.x = radius * Math.sin(theta) * Math.cos(phi);
//   pos.y = radius * Math.sin(theta) * Math.sin(phi);
//   pos.z = radius * Math.cos(theta);

//   camera.position.add(center);
//   camera.lookAt(center);
//   redraw();
// }
