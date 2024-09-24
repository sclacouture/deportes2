// Create the scene
const scene = new THREE.Scene();

// Set up the camera with a perspective view
const camera = new THREE.PerspectiveCamera(
  75, // Field of view
  window.innerWidth / window.innerHeight, // Aspect ratio
  0.1, // Near clipping plane
  1000 // Far clipping plane
);

// Position the camera
camera.position.set(0, 10, 20);
camera.lookAt(0, 0, 0);

// Create the renderer and add it to the document
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Add ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

// Add directional light to simulate sunlight
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(0, 50, 50);
scene.add(directionalLight);

// Define grid size
const gridSize = 20;
const gridDivisions = 20;

// Create the grid helper
const gridHelper = new THREE.GridHelper(gridSize, gridDivisions);
scene.add(gridHelper);

// Snake parameters
let snake = [];
const snakeLength = 3;
const snakeSize = 1;
const snakeSegments = [];

// Create initial snake segments
for (let i = 0; i < snakeLength; i++) {
  const geometry = new THREE.BoxGeometry(snakeSize, snakeSize, snakeSize);
  const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
  const segment = new THREE.Mesh(geometry, material);
  segment.position.set(0, snakeSize / 2, -i * snakeSize);
  scene.add(segment);
  snakeSegments.push(segment);
}
// Food parameters
let food;
const foodSize = 0.8;

function createFood() {
  const geometry = new THREE.SphereGeometry(foodSize / 2, 16, 16);
  const material = new THREE.MeshStandardMaterial({ color: 0xff0000 });
  food = new THREE.Mesh(geometry, material);

  // Random position within the grid boundaries
  food.position.set(
    Math.floor(Math.random() * gridSize) - gridSize / 2,
    foodSize / 2,
    Math.floor(Math.random() * gridSize) - gridSize / 2
  );
  scene.add(food);
}

createFood();
let direction = new THREE.Vector3(0, 0, -1); // Initially moving forward

document.addEventListener("keydown", (event) => {
  if (event.code === "ArrowUp") {
    direction.set(0, 0, -1);
  } else if (event.code === "ArrowDown") {
    direction.set(0, 0, 1);
  } else if (event.code === "ArrowLeft") {
    direction.set(-1, 0, 0);
  } else if (event.code === "ArrowRight") {
    direction.set(1, 0, 0);
  }
});
// Movement speed
const speed = 0.1;
let delta = 0;
let moveInterval = 200; // Snake moves every 200ms
let lastMoveTime = Date.now();

function animate() {
  requestAnimationFrame(animate);

  const currentTime = Date.now();
  if (currentTime - lastMoveTime > moveInterval) {
    moveSnake();
    lastMoveTime = currentTime;
  }

  renderer.render(scene, camera);
}

animate();
function moveSnake() {
  // Get the current head position
  const head = snakeSegments[0];
  const nextPosition = head.position
    .clone()
    .addScaledVector(direction, snakeSize);

  // Check for collisions with the food
  if (nextPosition.distanceTo(food.position) < snakeSize) {
    // Eat the food and grow
    growSnake();
    scene.remove(food);
    createFood();
  } else {
    // Move the tail segment to the new head position
    const tail = snakeSegments.pop();
    tail.position.copy(nextPosition);
    snakeSegments.unshift(tail);
  }

  // Update camera position to follow the snake
  updateCamera();
}
function growSnake() {
  const geometry = new THREE.BoxGeometry(snakeSize, snakeSize, snakeSize);
  const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
  const segment = new THREE.Mesh(geometry, material);

  // Position the new segment
  const lastSegment = snakeSegments[snakeSegments.length - 1];
  segment.position.copy(lastSegment.position);
  scene.add(segment);
  snakeSegments.push(segment);
}
function updateCamera() {
  const head = snakeSegments[0];
  camera.position.set(
    head.position.x - direction.x * 5,
    head.position.y + 5,
    head.position.z - direction.z * 5
  );
  camera.lookAt(head.position);
}
function checkCollisions() {
  const head = snakeSegments[0];

  // Check collision with walls
  if (
    Math.abs(head.position.x) > gridSize / 2 ||
    Math.abs(head.position.z) > gridSize / 2
  ) {
    alert("Game Over! You hit the wall.");
    resetGame();
  }

  // Check collision with self
  for (let i = 1; i < snakeSegments.length; i++) {
    if (head.position.distanceTo(snakeSegments[i].position) < snakeSize / 2) {
      alert("Game Over! You ran into yourself.");
      resetGame();
      break;
    }
  }
}
function moveSnake() {
  // (Previous code)

  // After moving the snake, check for collisions
  checkCollisions();

  // Update camera position
  updateCamera();
}
function resetGame() {
  // Remove all snake segments
  snakeSegments.forEach((segment) => scene.remove(segment));
  snakeSegments.length = 0;

  // Create initial snake segments again
  for (let i = 0; i < snakeLength; i++) {
    const geometry = new THREE.BoxGeometry(snakeSize, snakeSize, snakeSize);
    const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
    const segment = new THREE.Mesh(geometry, material);
    segment.position.set(0, snakeSize / 2, -i * snakeSize);
    scene.add(segment);
    snakeSegments.push(segment);
  }

  // Remove and recreate food
  scene.remove(food);
  createFood();

  // Reset direction
  direction.set(0, 0, -1);
}
window.addEventListener("resize", onWindowResize, false);

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
