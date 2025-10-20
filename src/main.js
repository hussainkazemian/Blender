import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

let container, camera, scene, renderer, cube;
let controls;

init();

function init() {
  container = document.createElement('div');
  document.body.appendChild(container);

  // Scene
  scene = new THREE.Scene();

  // Camera
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.x = 5;

  // Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio || 1);
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);

  // Cube
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
  cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  // Add sample geometries (grid)
  createGeometries();

  // Light and helpers
  const light = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
  scene.add(light);

  const axesHelper = new THREE.AxesHelper(5);
  scene.add(axesHelper);

  // Start render loop
  renderer.setAnimationLoop(animate);

  // Orbit controls
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true; // smoothes camera movement
  controls.dampingFactor = 0.05;

  // Handle resize
  window.addEventListener('resize', onWindowResize, false);
}

function createGeometries() {
  const materials = [
    new THREE.MeshPhongMaterial({ color: 0xff4444 }),
    new THREE.MeshPhongMaterial({ color: 0x44ff44 }),
    new THREE.MeshPhongMaterial({ color: 0x4444ff }),
    new THREE.MeshPhongMaterial({ color: 0xffff44 })
  ];

  const geometries = [
    new THREE.SphereGeometry(0.9, 20, 12),
    new THREE.IcosahedronGeometry(0.9),
    new THREE.OctahedronGeometry(0.9),
    new THREE.TetrahedronGeometry(0.9),
    new THREE.PlaneGeometry(1.6, 1.6, 4, 4),
    new THREE.BoxGeometry(1.2, 1.2, 1.2, 2, 2, 2),
    new THREE.CircleGeometry(0.8, 32),
    new THREE.RingGeometry(0.2, 0.8, 32),
    new THREE.CylinderGeometry(0.4, 0.9, 1.2, 16, 1),
    new THREE.TorusGeometry(0.8, 0.25, 16, 32),
    new THREE.TorusKnotGeometry(0.6, 0.18, 64, 8),
    new THREE.CapsuleGeometry(0.3, 0.8, 4, 8)
  ];

  const rows = 4;
  const cols = 4;
  const spacing = 3.0;
  let index = 0;

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const geo = geometries[index % geometries.length];
      const mat = materials[(i + j) % materials.length];
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.x = (i - (rows - 1) / 2) * spacing + 8; // offset so camera starts near
      mesh.position.z = (j - (cols - 1) / 2) * spacing;
      mesh.position.y = 0.6;
      mesh.rotation.y = Math.PI * 0.1 * (i + j);
      scene.add(mesh);
      index++;
    }
  }

  // Additional parametric shapes
  // simple klein / mobius could be added if needed via ParametricGeometry import
}

function animate() {
  // rotate the main cube a bit
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  // rotate all other meshes in the scene
  scene.traverse(function (object) {
    if (object.isMesh && object !== cube) {
      object.rotation.x += 0.005;
      object.rotation.y += 0.01;
    }
  });

  // update controls for damping
  if (controls) controls.update();

  renderer.render(scene, camera);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
