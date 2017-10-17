var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

var renderer = new THREE.WebGLRenderer();
// Set the size of the renderer to take up the entire window
renderer.setSize(window.innerWidth, window.innerHeight);
// Append the renderer canvas element to the body
document.body.appendChild(renderer.domElement);

var cubes = [];

for (var i = 0; i < 100; i++) {

  var material = new THREE.MeshNormalMaterial();
  var geometry = new THREE.BoxGeometry(50, 50, 50);
  var mesh = new THREE.Mesh(geometry, material);
  var controls = new THREE.VRControls( camera );


  // Give each cube a random position
  mesh.position.x = (Math.random() * 1000) - 500;
  mesh.position.y = (Math.random() * 1000) - 500;
  mesh.position.z = (Math.random() * 1000) - 500;

  mesh.rotation.x = Math.random() * 2 * Math.PI;
	mesh.rotation.y = Math.random() * 2 * Math.PI;

  scene.add(mesh);
  scene.background = new THREE.Color( 0x000000 );
  scene.fog = new THREE.Fog( 0xffffff, 1, 10000 );

  // Store each mesh in array
  cubes.push(mesh);

}

camera.position.z = 5;



function animate() {
  requestAnimationFrame(animate);

  for (var i = 0; i < cubes.length; i++) {
    cubes[i].rotation.x += 0.05;
    cubes[i].rotation.y += Math.random() * 0.2;
  }


  // Render the scene
  renderer.render(scene, camera);

  controls.update();
}
animate();
