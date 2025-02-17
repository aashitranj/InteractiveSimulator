// ========== SCENE SETUP ==========
const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer({ antialias: true });
const camera = new THREE.PerspectiveCamera(45, window.innerWidth/innerHeight, 1, 1000);
const clock = new THREE.Clock();

// Initialize renderer
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xF0F0F0); // Light gray background
document.body.appendChild(renderer.domElement);

// ========== LIGHTING SYSTEM ==========
const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.8);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 0.5);
directionalLight.position.set(10, 20, 15);
scene.add(directionalLight);

// ========== CAMERA CONTROLS ==========
camera.position.set(0, 15, 30);
camera.lookAt(0, 0, 0);
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// ========== PLATE SYSTEM ==========
const plates = [];
const PLATE_CONFIG = {
    radii: [8, 7, 6, 5, 4, 3], // 6 concentric plates
    colors: [0x4A4A4A, 0x5A5A5A, 0x6A6A6A, 0x7A7A7A, 0x8A8A8A, 0x9A9A9A],
    thickness: 0.3
};

function createPlates() {
    PLATE_CONFIG.radii.forEach((radius, index) => {
        const geometry = new THREE.CylinderGeometry(radius, radius, PLATE_CONFIG.thickness, 64);
        const material = new THREE.MeshPhongMaterial({
            color: PLATE_CONFIG.colors[index],
            specular: 0x111111,
            shininess: 100
        });
        const plate = new THREE.Mesh(geometry, material);
        
        // Rotate plates to horizontal orientation
        plate.rotation.x = Math.PI / 2;
        plate.position.y = index * 0.3; // Stack vertically
        
        scene.add(plate);
        plates.push(plate);
    });
}

// ========== ANIMATION SYSTEM ==========
let timeMultiplier = 1;

function updatePlates() {
    const time = new Date();
    
    // Minutes Ones (Plate 4 - index 4)
    plates[4].rotation.z = -((time.getMinutes() % 10) * (Math.PI/5)); // 36° steps
    
    // Minutes Tens (Plate 3 - index 3)
    plates[3].rotation.z = -(Math.floor(time.getMinutes()/10) * (Math.PI/3)); // 60° steps
    
    // Hours Ones (Plate 1 - index 1)
    plates[1].rotation.z = (time.getHours() % 10) * (Math.PI/5);
    
    // Hours Tens (Plate 0 - index 0)
    plates[0].rotation.z = Math.floor(time.getHours()/10) * (2*Math.PI/3); // 120° steps
}

// ========== EVENT HANDLERS ==========
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

document.getElementById('timeLapse').addEventListener('click', () => {
    timeMultiplier = timeMultiplier === 1 ? 60 : 1;
});

document.getElementById('resetView').addEventListener('click', () => {
    controls.reset();
});

// ========== INITIALIZATION ==========
createPlates();

// Add debug grid
const gridHelper = new THREE.GridHelper(20, 20);
scene.add(gridHelper);

// ========== MAIN LOOP ==========
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    
    if(timeMultiplier === 1) {
        updatePlates();
    } else {
        // Simulated time for time-lapse
        const delta = clock.getDelta() * timeMultiplier;
        // Add your time simulation logic here
    }
    
    renderer.render(scene, camera);
}

animate();
