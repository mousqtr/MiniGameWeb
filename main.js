import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r122/build/three.module.js';
import {OrbitControls} from "https://threejs.org/examples/jsm/controls/OrbitControls.js";
import Stats from 'https://threejs.org/examples/jsm/libs/stats.module.js';
import {GLTFLoader} from 'https://threejs.org/examples/jsm/loaders/GLTFLoader.js';
import {FBXLoader} from 'https://cdn.jsdelivr.net/npm/three@0.118.1/examples/jsm/loaders/FBXLoader.js';



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

// Variables
let walking = false;
let a;
let b;

// When user click somewhere
function onClick(event) {
    raycaster.setFromCamera( mouse, camera );
    const intersects = raycaster.intersectObjects( scene.children, true );
    for ( let i = 0; i < intersects.length; i ++ ) {
        console.log(intersects[0].object.name);
        if (intersects[0].object.name = 'floor'){
            // console.log(intersects[i].point);

            // Move the character
            circle.position.set(intersects[i].point.x, intersects[i].point.y, intersects[i].point.z + 1)
            let x1 = models["character"].position.x;
            let x2 = circle.position.x
            let y1 = models["character"].position.y
            let y2 = circle.position.y
            let angle = Math.atan2(y2 - y1, x2 - x1);
            models["character"].rotation.set(Math.PI/2, Math.PI, 0)
            models["character"].rotateY(angle - Math.PI/2)
            walking = true;
            a = x2 - x1;
            b = y2 - y1;
            circle.material.opacity = 1;
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
// let controls = new OrbitControls(camera, renderer.domElement );
// controls.addEventListener('change', renderer);
// controls.minDistance = 500;
// controls.maxDistance = 4000;

// Hemisphere Light
const hemiLight = new THREE.HemisphereLight( 0xffffff, 0x555555 );
hemiLight.position.set(0, -200, 0);
scene.add( hemiLight );

// Directional Light
const dirLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
dirLight.position.set(0, 0, 0);
dirLight.castShadow = true;
dirLight.shadow.camera.top = 180;
dirLight.shadow.camera.bottom = - 100;
dirLight.shadow.camera.left = - 120;
dirLight.shadow.camera.right = 120;
scene.add( dirLight );

// // First sphere
// let r1 = 12
// let sphereGeo1 = new THREE.SphereGeometry(r1, 16, 16);
// let sphereMat1 = new THREE.MeshPhongMaterial({color: 0xffff00, opacity: 0.5, transparent: true} );
// let sphere1 = new THREE.Mesh( sphereGeo1, sphereMat1 );
// sphere1.traverse(child => {
//     child.name = "sphere1"
// } );
// sphere1.position.set(0, 0, 0)
// scene.add(sphere1);

// // Second sphere
// let r2 = 6
// let sphereGeo2 = new THREE.SphereGeometry(r2, 16, 16);
// let sphereMat2 = new THREE.MeshPhongMaterial({color: 0x0000ff, opacity: 0.5, transparent: true} );
// let sphere2 = new THREE.Mesh( sphereGeo2, sphereMat2 );
// sphere2.traverse(child => {
//     child.name = "sphere2"
// } );
// sphere2.position.set(50, 0, 0)
// scene.add(sphere2);

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
const lineMat = new THREE.LineBasicMaterial( { color: 0x000000, linewidth: 0.1 } )
const line = new THREE.LineSegments( edges, lineMat );

scene.add( line );

// Character
var models = {};
var mixers = {};
var actions = {};
const loaderCharacter = new FBXLoader();
loaderCharacter.load('models/malcolm.fbx', (character) => {

    // Load the model
    character.scale.setScalar(0.1);
    character.position.set(0, 0, 0)
    character.rotation.set(Math.PI/2, Math.PI, 0)
    character.traverse(child => {
        child.castShadow = true;
        child.receiveShadow = true;
    });

    // Load the idle animation
    const loaderWalk = new FBXLoader();
    loaderWalk.load('models/idle.fbx', (walk) => {
        const mixer = new THREE.AnimationMixer(character);     
        const action = mixer.clipAction( walk.animations[0] );
        mixers["idle"] = mixer
        actions["idle"] = action;
        actions["idle"].play();
    });

    // Load the walk animation
    const loaderIdle = new FBXLoader();
    loaderIdle.load('models/walk.fbx', (idle) => {
        const mixer = new THREE.AnimationMixer(character);     
        const action = mixer.clipAction( idle.animations[0] );
        mixers["walk"] = mixer
        actions["walk"] = action;
    });

    scene.add(character);
    models["character"] = character;
    
});

// Yellow circle
const circleGeo = new THREE.CircleBufferGeometry( 3, 32 );
const circleMat = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
const circle = new THREE.Mesh( circleGeo, circleMat );
circle.position.set(0, 0, 1)
circle.rotation.set(0, 0, 0)
circle.material.transparent = true;
scene.add( circle );

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


// function walk(){
//     models["character"].position.set()
// }

animate();



// Loop
function animate() {


    requestAnimationFrame(animate);

    stats.update();


    // Update mixers
    const delta = clock.getDelta();
    if ( mixers["idle"] ) mixers["idle"].update( delta );
    if ( mixers["walk"] ) mixers["walk"].update( delta );


    // Move the character
    if (models["character"] != undefined){

        if (walking){
            let x1 = models["character"].position.x;
            let x2 = circle.position.x
            let y1 = models["character"].position.y
            let y2 = circle.position.y
            let c = x2 - x1;
            let d = y2 - y1;

            if ((Math.abs(c) > 0.3) || (Math.abs(d) > 0.3)){
                models["character"].position.set(
                    models["character"].position.x + a * 0.01, 
                    models["character"].position.y + b * 0.01, 
                    0)
                    camera.position.set(models["character"].position.x, models["character"].position.y - 100, 100);
                if ( actions["walk"] ) actions["walk"].play();
                circle.material.opacity -= 0.01;
            }else{
                walking = false;
                circle.position.set(circle.position.x, circle.position.y, -10000)
            }
        }else{
            if ( actions["walk"] ) actions["walk"].stop();
        }
        
    }

    // let x1 = sphere1.position.x;
    // let y1 = sphere1.position.y;
    // let z1 = sphere1.position.z;

    // let x2 = sphere2.position.x;
    // let y2 = sphere2.position.y;
    // let z2 = sphere2.position.z;

    // if ((Math.abs(x1 - x2) < (r1 + r2)) && (Math.abs(y1 - y2) < (r1 + r2)) && (Math.abs(z1 - z2) < (r1 + r2))) {
    //     console.log("collision")       
    // }else{
    //     sphere2.position.set(sphere2.position.x - 0.5, sphere2.position.y, sphere2.position.z)
    // }



    renderer.render(scene,camera);
    
}
