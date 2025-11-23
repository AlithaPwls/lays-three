import './style.css';
import * as THREE from 'three';

// =========================
// SCENE
// =========================
const scene = new THREE.Scene();

// CAMERA — BETERE FRAMING
const camera = new THREE.PerspectiveCamera(
  50,                                         // iets smallere FOV → mooier object
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camera.position.set(0, 0.4, 2.5);              // verder weg + beter uitzicht
camera.lookAt(0, 0.4, 0);

// RENDERER
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

// =========================
// LICHT
// =========================
scene.add(new THREE.AmbientLight(0xffffff, 0.55));

const dir = new THREE.DirectionalLight(0xffffff, 1.3);
dir.position.set(2, 2, 3);
scene.add(dir);

const dir2 = new THREE.DirectionalLight(0xffffff, 0.6);
dir2.position.set(-2, -1, -1);
scene.add(dir2);

// =========================
// CHIPZAK GEOMETRIE
// =========================

const width = 1;
const height = 1.4;
const plane = new THREE.PlaneGeometry(width, height, 40, 60);

const pos = plane.attributes.position;

for (let i = 0; i < pos.count; i++) {
  let x = pos.getX(i);
  let y = pos.getY(i);
  let z = pos.getZ(i);

  // Buik
  const bulge =
    Math.cos((x / (width / 2)) * 1.2) *
    Math.cos((y / (height / 2)) * 1.2);
  z += bulge * 0.25;

  // Zijvouwen
  if (Math.abs(x) > width * 0.35) {
    z -= 0.08;
  }

  // Kreuken
  z += (Math.random() - 0.5) * 0.015;

  // Plat boven + onder
  if (y > height * 0.45 || y < -height * 0.45) {
    z *= 0.35;
  }

  pos.setXYZ(i, x, y, z);
}

pos.needsUpdate = true;

// =========================
// MATERIAAL
// =========================
const material = new THREE.MeshStandardMaterial({
  color: 0xd52323,
  metalness: 0.45,
  roughness: 0.22,
  side: THREE.DoubleSide,
});

// =========================
// MESH — schaal gecorrigeerd
// =========================
const bagFront = new THREE.Mesh(plane, material);
const bagBack = new THREE.Mesh(plane.clone(), material);

bagBack.rotation.y = Math.PI;

// ↓ belangijk: kleiner maken zodat het mooi in frame staat
bagFront.scale.set(0.8, 0.8, 0.8);
bagBack.scale.set(0.8, 0.8, 0.8);

// iets omhoog zetten zodat het mooi in beeld hangt
bagFront.position.y = 0.3;
bagBack.position.y = 0.3;

scene.add(bagFront);
scene.add(bagBack);

// =========================
// ANIMATIE
// =========================
function animate() {
  requestAnimationFrame(animate);

  bagFront.rotation.y += 0.006;
  bagBack.rotation.y += 0.006;

  renderer.render(scene, camera);
}
animate();

// =========================
// RESPONSIVE
// =========================
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
