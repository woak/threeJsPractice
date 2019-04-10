
// var scene, camera, renderer, analyser, uniforms;
// var startButton = document.getElementById('startButton');
// // startButton.addEventListener('click', init);
// function init() {
//   var fftSize = 128;
//   //
//   // var overlay = document.getElementById('overlay');
//   // overlay.remove();
//   //
//   var container = document.getElementById('container');

//   renderer = new THREE.WebGLRenderer({ antialias: true });
//   renderer.setSize(window.innerWidth, window.innerHeight);
//   renderer.setClearColor(0x000000);
//   renderer.setPixelRatio(window.devicePixelRatio);

//   container.appendChild(renderer.domElement);
//   scene = new THREE.Scene();
//   camera = new THREE.Camera();
//   ambiLight = new THREE.AmbientLight(0x777777);
//   //
//   // var listener = new THREE.AudioListener();
//   // // var audio = new THREE.Audio(listener);
//   // var mediaElement = new Audio('sounds/376737_Skullbeatz___Bad_Cat_Maste.mp3');
//   // mediaElement.loop = true;
//   // mediaElement.play();
//   // audio.setMediaElementSource(mediaElement);
//   // analyser = new THREE.AudioAnalyser(audio, fftSize);
//   //
//   // uniforms = {
//   //   tAudioData: { value: new THREE.DataTexture(analyser.data, fftSize / 2, 1, THREE.LuminanceFormat) }
//   // };
//   // TODO
//   var material = new THREE.MeshBasicMaterial({
//     // uniforms: uniforms,
//     // vertexShader: document.getElementById('vertexShader').textContent,
//     // fragmentShader: document.getElementById('fragmentShader').textContent

//   });
//   var geometry = new THREE.IcosahedronBufferGeometry(8.0, 2);
//   var mesh = new THREE.Mesh(geometry, material);
//   scene.add(mesh);
//   scene.add(ambiLight);
//   //
//   window.addEventListener('resize', onResize, false);
//   animate();
// }
// function onResize() {
//   renderer.setSize(window.innerWidth, window.innerHeight);
// }
// function animate() {
//   requestAnimationFrame(animate);
//   render();
// }
// function render() {
//   // analyser.getFrequencyData();
//   // uniforms.tAudioData.value.needsUpdate = true;
//   renderer.render(scene, camera);
// }

// window.onload = () => {
//   init();
// }


document.addEventListener('mousemove', onDocumentMouseMove, false);

// SETUP MOUSE MOVEMENT \\
var mouseX = null;
var mouseY = null;
var mouse = new THREE.Vector2();
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;
function onDocumentMouseMove(event) {

  mouseX = (event.clientX - windowHalfX) / 2;
  mouseY = (event.clientY - windowHalfY) / 2;

  event.preventDefault();

  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
}

let init = () => {
  var overlay = document.getElementById( 'overlay' );
  overlay.remove();
  // CREATE SCENE \\
  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

  var light = new THREE.PointLight(0x404040, 3, 2000);
  var ambientLight = new THREE.AmbientLight(0xcccccc, 0.4);
  light.position.set(5, 8, 8);
  var sphereSize = 1;
  light.castShadow = true;

  // RENDERER \\
  var renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  document.body.appendChild(renderer.domElement);

  // AUDIO \\
  let fftSize = 128;
  let listener = new THREE.AudioListener();
  let audio = new THREE.Audio(listener);
  let mediaElement = new Audio('sounds/376737_Skullbeatz___Bad_Cat_Maste.mp3');
  mediaElement.loop = true;
  mediaElement.play();
  audio.setMediaElementSource(mediaElement);

  let analyser = new THREE.AudioAnalyser(audio, fftSize);

  uniforms = {
    tAudioData: {
      value: new THREE.DataTexture(
        analyser.data,
        fftSize / 2, 1,
        THREE.LuminanceFormat)
    }
  };

  // ICOSAHEDRON \\
  var hedron = new THREE.IcosahedronBufferGeometry(1, 1);
  var map = new THREE.TextureLoader().load('textures/UV_Grid_Sm.jpg');
  map.wrapS = map.wrapT = THREE.RepeatWrapping;
  map.anisotropy = 16;
  var hedronMaterial = new THREE.MeshPhongMaterial({ map: map, side: THREE.DoubleSide });
  var hedronMesh = new THREE.Mesh(hedron, hedronMaterial);
  hedronMesh.castShadow = true;

  // FLOOR PLANE \\
  var floor = new THREE.PlaneBufferGeometry(20, 20);
  var floorMaterial = new THREE.MeshPhongMaterial({ color: 0xffff00, 
                                                    side: THREE.DoubleSide });
  var floorMesh = new THREE.Mesh(floor, floorMaterial);
  floorMesh.rotation.x = 90;
  floorMesh.translateZ(10);
  floorMesh.receiveShadow = true;

  // VISUALIZATION \\

  // ADD TO SCENE \\
  scene.add(hedronMesh);
  scene.add(floorMesh);
  scene.add(light);
  scene.add(ambientLight);

  camera.position.z = 5;

  // ANIMATE \\
  var animate = function () {
    requestAnimationFrame(animate);

    camera.position.x += (mouseX - camera.position.x) * .1;
    camera.position.y += (-mouseY - camera.position.y) * .1;

    camera.lookAt(scene.position);

    hedronMesh.rotation.x += 0.01;
    hedronMesh.rotation.y += 0.01;

    render();
  };

  let render = () => {
    renderer.clear();
    renderer.render(scene, camera);

  }

  animate();
}

var startButton = document.getElementById( 'startButton' );
startButton.addEventListener( 'click', init );
