// Scene setup
const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Camera setup for interactive view
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 25, 40);

// Plate system configuration
const plates = [];
const PLATE_CONFIG = {
  radii: [8, 7, 6.2, 5.4, 4.6, 3.8], // 6 concentric plates
  colors: [0x4a4a4a, 0x5a5a5a, 0x6a6a6a, 0x7a7a7a, 0x8a8a8a, 0x9a9a9a],
  rotationRules: {
    1: { direction: 'cw', step: 120 },   // Hours Tens
    2: { direction: 'cw', step: 36 },    // Hours Ones
    4: { direction: 'ccw', step: 60 },   // Minutes Tens
    5: { direction: 'ccw', step: 36 }    // Minutes Ones
  }
};

// Initialize plates
function initPlates() {
  for (let i = 0; i < 6; i++) {
    const geometry = new THREE.CylinderGeometry(
      PLATE_CONFIG.radii[i],
      PLATE_CONFIG.radii[i],
      0.2,
      64
    );
    const material = new THREE.MeshPhongMaterial({ 
      color: PLATE_CONFIG.colors[i],
      specular: 0x111111 
    });
    const plate = new THREE.Mesh(geometry, material);
    plate.rotation.order = 'YXZ';
    plates.push(plate);
    scene.add(plate);
  }
}

// Animation system
let isManualMode = false;
let timeMultiplier = 1;

function animate() {
  requestAnimationFrame(animate);
  
  if (!isManualMode) {
    const now = new Date();
    updatePlateRotations(
      now.getHours(),
      now.getMinutes(),
      now.getSeconds()
    );
  }

  renderer.render(scene, camera);
  TWEEN.update();
}

// Initialize and start
initPlates();
animate();

// Add event listeners for interactive controls
document.getElementById('timeLapseBtn').addEventListener('click', () => {
  timeMultiplier = timeMultiplier === 1 ? 60 : 1;
});

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
