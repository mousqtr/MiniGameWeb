import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r122/build/three.module.js';
import {OrbitControls} from "https://threejs.org/examples/jsm/controls/OrbitControls.js";
import Stats from 'https://threejs.org/examples/jsm/libs/stats.module.js';


// Canvas
const canvas = document.querySelector('#c');

// Clock
const clock = new THREE.Clock();

// Scene
let scene = new THREE.Scene();
scene.background = new THREE.Color( 0xdcdcdc );

// Axis - The X axis is red. The Y axis is green. The Z axis is blue.
const axesHelper = new THREE.AxesHelper(20);
scene.add( axesHelper ); 

// Camera
const fov = 55; // field of view
const aspect = window.innerWidth/window.innerHeight; 
const near = 45;
const far = 30000;
let camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.set(0, -100, 100);
camera.lookAt( 0, 0, 0 );

// Renderer
let renderer = new THREE.WebGLRenderer({antialias:true, canvas});
renderer.setSize(window.innerWidth,window.innerHeight);
document.body.appendChild(renderer.domElement);

// Mouse position
const mouse = new THREE.Vector2();

// Raycaster (used for mouse picking)
const raycaster = new THREE.Raycaster();

// Events
window.addEventListener( 'resize', onWindowResize, false );
window.addEventListener( 'click', onClick, false );
window.addEventListener( 'mousemove', onMouseMove, false );


// When user click somewhere
function onClick(event) {
    raycaster.setFromCamera( mouse, camera );
    const intersects = raycaster.intersectObjects( scene.children, true );
    for ( let i = 0; i < intersects.length; i ++ ) {
        console.log(intersects[0].object.name);
        if (intersects[0].object.name = 'floor'){
            console.log('floor');
        }
    }
}

// Get the mouse position
function onMouseMove( event ) {
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}

// Show FPS
var stats = new Stats();
stats.setMode(0);
document.body.appendChild( stats.domElement );
stats.domElement.style.position = 'absolute';
stats.domElement.style.right = '0';
stats.domElement.style.top = '0';

// Control the camera manually
let controls = new OrbitControls(camera, renderer.domElement );
controls.addEventListener('change', renderer);
// controls.minDistance = 500;
controls.maxDistance = 4000;
controls.enablePan = false;
controls.enableDamping = false;
controls.enableRotate = true;
controls.enableZoom = true;

// Hemisphere Light
const hemiLight = new THREE.HemisphereLight( 0xffffff, 0x555555 );
hemiLight.position.set(0, -10, 0);
scene.add( hemiLight );

// Directional Light
const dirLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
dirLight.position.set(0, -20, 0);
dirLight.castShadow = true;
dirLight.shadow.camera.top = 180;
dirLight.shadow.camera.bottom = - 100;
dirLight.shadow.camera.left = - 120;
dirLight.shadow.camera.right = 120;
scene.add( dirLight );



// Floor
let floorGeo = new THREE.PlaneGeometry(100, 100);
let floorMat = new THREE.MeshPhongMaterial({color: 0x00ff00, opacity: 0.5, transparent: true} );
let floor = new THREE.Mesh( floorGeo, floorMat );
floor.name = 'floor'
floor.traverse(child => {
    child.name = "floor"
} );
floor.position.set(0, 0, 0)
scene.add(floor);

const edges = new THREE.EdgesGeometry( floorGeo );
const lineMat = new THREE.LineBasicMaterial( { color: 0x000000, side:THREE.DoubleSide, linewidth: 0.1 } )
const line = new THREE.LineSegments( edges, lineMat );
scene.add( line );

// Cube
var cubeGeo = new THREE.CubeGeometry(10, 10, 10);
var cubeMat = new THREE.MeshPhongMaterial({color: 0xffff00} );
var cube = new THREE.Mesh( cubeGeo, cubeMat );
cube.name = 'cube'
cube.traverse(child => {
    child.name = "cube"
} );
cube.position.set(0, 0, 5)
scene.add(cube);

// var outlineMaterial2 = new THREE.MeshBasicMaterial( { color: 0xff0000, side: THREE.BackSide } );
// var outlineMesh2 = new THREE.Mesh( cubeGeo, outlineMaterial2 );
// outlineMesh2.position.set(cube.position.x, cube.position.y, cube.position.z);
// outlineMesh2.scale.multiplyScalar(1.05);
// scene.add( outlineMesh2 );

// Cube
var cubeGeo2 = new THREE.CubeGeometry(10, 10, 10);
var cubeMat2 = new THREE.MeshPhongMaterial({color: 0x0000ff} );
var cube2 = new THREE.Mesh( cubeGeo2, cubeMat2 );
cube2.name = 'cube2'
cube2.traverse(child => {
    child.name = "cube2"
} );
cube2.position.set(10, 0, 5)
scene.add(cube2);


// Keyboard input
document.addEventListener("keydown", onDocumentKeyDown, false);
function onDocumentKeyDown(event) {
    var keyCode = event.which;
    if (keyCode == 90) {
        console.log("z");
    }
};

// When the window is resized
function onWindowResize(){
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}


animate();



// Loop
function animate() {


    requestAnimationFrame(animate);

    stats.update();

    

    renderer.render(scene,camera);
    
}
