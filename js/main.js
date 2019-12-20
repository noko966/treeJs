window.addEventListener("load", init, false);

function creatParalaxScene() {
  var loader = new THREE.GLTFLoader();

  // Optional: Provide a DRACOLoader instance to decode compressed mesh data
  var dracoLoader = new THREE.DRACOLoader();
  dracoLoader.setDecoderPath("/examples/js/libs/draco/");
  loader.setDRACOLoader(dracoLoader);

  // Load a glTF resource
  loader.load(
    // resource URL
    "../scene.glb",
    // called when the resource is loaded
    function(gltf) {
      scene.add(gltf.scene);

      gltf.animations; // Array<THREE.AnimationClip>
      gltf.scene; // THREE.Scene
      gltf.scenes; // Array<THREE.Scene>
      gltf.cameras; // Array<THREE.Camera>
      gltf.asset; // Object
    },
    // called while loading is progressing
    function(xhr) {
      console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
    },
    // called when loading has errors
    function(error) {
      console.log("An error happened");
    }
  );
}

function init(event) {
  // set up the scene, the camera and the renderer
  createScene();
  createOrbitControls();

  creatParalaxScene();

  // add the lights
  // createLights();

  // add the objects

  // createBg();
  // createSky();
  // createPlayer();

  // createPlayerFront();
  mouse();
  // start a loop tha will update the objects' positions
  // and render the scene on each frame
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

function createScene() {
  // Get the width and the height of the screen,
  // use them to set up the aspect ratio of the camera
  // and the size of the renderer.
  HEIGHT = window.innerHeight;
  WIDTH = window.innerWidth;

  // Create the scene
  scene = new THREE.Scene();

  // Add a fog effect to the scene; same color as the
  // background color used in the style sheet
  // scene.fog = new THREE.Fog(0xf7d9aa, 100, 950);

  // Create the camera
  aspectRatio = WIDTH / HEIGHT;
  fieldOfView = 75;
  nearPlane = 1;
  farPlane = 10000;
  camera = new THREE.PerspectiveCamera(
    fieldOfView,
    aspectRatio,
    nearPlane,
    farPlane
  );

  // Set the position of the camera
  camera.position.x = 0;
  camera.position.z = 10;
  camera.position.y = 0;

  // Create the renderer
  renderer = new THREE.WebGLRenderer({
    // Allow transparency to show the gradient background
    // we defined in the CSS
    alpha: true,

    // Activate the anti-aliasing; this is less performant,
    // but, as our project is low-poly based, it should be fine :)
    antialias: true
  });

  // Define the size of the renderer; in this case,
  // it will fill the entire screen
  renderer.setSize(WIDTH, HEIGHT);

  // Enable shadow rendering
  renderer.shadowMap.enabled = true;

  renderer.gammaOutput = true;
  renderer.gammaFactor = 2.2;

  // Add the DOM element of the renderer to the
  // container we created in the HTML
  container = document.getElementById("world");
  container.appendChild(renderer.domElement);

  // Listen to the screen: if the user resizes it
  // we have to update the camera and the renderer size
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

var hemisphereLight, shadowLight;

function createLights() {
  // A hemisphere light is a gradient colored light;
  // the first parameter is the sky color, the second parameter is the ground color,
  // the third parameter is the intensity of the light
  hemisphereLight = new THREE.HemisphereLight(0xaaaaaa, 0x000000, 0.9);

  // A directional light shines from a specific direction.
  // It acts like the sun, that means that all the rays produced are parallel.
  shadowLight = new THREE.DirectionalLight(0xffffff, 0.9);

  // Set the direction of the light
  shadowLight.position.set(150, 350, 350);

  // Allow shadow casting
  shadowLight.castShadow = true;

  // define the visible area of the projected shadow
  shadowLight.shadow.camera.left = -400;
  shadowLight.shadow.camera.right = 400;
  shadowLight.shadow.camera.top = 400;
  shadowLight.shadow.camera.bottom = -400;
  shadowLight.shadow.camera.near = 1;
  shadowLight.shadow.camera.far = 1000;

  // define the resolution of the shadow; the higher the better,
  // but also the more expensive and less performant
  shadowLight.shadow.mapSize.width = 2048;
  shadowLight.shadow.mapSize.height = 2048;

  // to activate the lights, just add them to the scene
  scene.add(hemisphereLight);
  scene.add(shadowLight);
}

//creating scene objects

var floor;
var floorWidth = 5120 / 2;
var floorHeight = 1808 / 2;
var aspectH = 1080;

function createSky() {
  var geometry = new THREE.PlaneGeometry(floorWidth, floorHeight, 1);
  var material = new THREE.MeshBasicMaterial({
    map: new THREE.TextureLoader().load("img/sky.jpg")
  });
  floor = new THREE.Mesh(geometry, material);
  // plane.rotation.x = -Math.PI / 2;
  floor.position.z = -300;
  scene.add(floor);
}

var bg;
var bgWidth = 5120 / 2;
var bgHeight = 2880 / 2;

function createBg() {
  var geometry = new THREE.PlaneGeometry(bgWidth, bgHeight, 1);
  var material = new THREE.MeshBasicMaterial({
    map: new THREE.TextureLoader().load("img/bg.png"),
    transparent: true
  });
  bg = new THREE.Mesh(geometry, material);
  bg.position.z = -200;

  scene.add(bg);
}

var player;
var playerWidth = 1344 / 2;
var playerHeight = 1822 / 2;

function createPlayer() {
  var geometry = new THREE.PlaneGeometry(playerWidth, playerHeight, 1);
  var material = new THREE.MeshBasicMaterial({
    map: new THREE.TextureLoader().load("img/players.png"),
    transparent: true
  });
  player = new THREE.Mesh(geometry, material);
  player.position.z = -100;
  player.position.y = -playerHeight / 2;

  scene.add(player);
}
function createOrbitControls() {
  controls = new THREE.OrbitControls(camera, renderer.domElement);
}

function loop() {
  // Rotate the propeller, the sea and the sky

  // update the plane on each frame

  // bg.position.y = this.currentY * 10;
  // floor.position.y = this.currentY * 50;
  // player.position.y = this.currentY * 100;

  // render the scene
  renderer.render(scene, camera);
  controls.update();

  // camera.position.x = this.currentX * 10;
  // camera.position.y = -this.currentY * 10;

  // floor.rotation.x = -this.currentY / 50;
  // floor.rotation.y = this.currentX / 50;

  // player.rotation.y = this.currentX / 20;
  // player.rotation.x = -this.currentY / 20;

  // console.log(camera.position.x);

  // camera.position.y = this.currentX;

  // call the loop function again
  requestAnimationFrame(loop);
}

this.currentX = 0;
this.currentY = 0;

function mouse() {
  let w = window.innerWidth / 2;
  let h = window.innerHeight / 2;

  let that = this;

  document.addEventListener("mousemove", function(e) {
    that.mouseX = (e.clientX - w) / w;
    that.mouseY = (e.clientY - h) / h;
    // console.log(that.mouseX, that.mouseY);
    that.currentX = that.mouseX;
    that.currentY = that.mouseY;
  });
}

// function rotateCamera(ev) {
//   camera.rotation.x = 0.09;
//   camera.rotation.y = 0.09;
// }
