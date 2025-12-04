import * as THREE from 'three';

/**
 * Create Ocean World Aquarium Building
 */
export function createAquarium(scene) {
  const aquariumCenter = { x: -50, z: -70 };
  const width = 16;
  const depth = 12;
  const height = 8;
  
  // Create the aquarium structure
  const aquariumGroup = new THREE.Group();
  aquariumGroup.position.set(aquariumCenter.x, 0, aquariumCenter.z);
  
  // Floor (underwater effect)
  createAquariumFloor(aquariumGroup, width, depth);
  
  // Glass tank walls
  createGlassWalls(aquariumGroup, width, depth, height);
  
  // Back wall (solid blue)
  createBackWall(aquariumGroup, width, height);
  
  // Create swimming sharks (2D animated)
  const sharks = createSharks(aquariumGroup, width, depth, height);
  
  // Create tropical fish (2D animated)
  const tropicalFish = createTropicalFish(aquariumGroup, width, depth, height);
  
  // Create bubble particle effects
  const bubbles = createBubbles(aquariumGroup, width, depth, height);
  
  // Blue underwater lighting
  createUnderwaterLighting(scene, aquariumCenter);
  
  // "Ocean World" sign
  addOceanWorldSign(aquariumGroup);
  
  scene.add(aquariumGroup);
  
  // Return animated objects for updates
  return { sharks, tropicalFish, bubbles };
}

/**
 * Create aquarium floor with sandy/coral texture
 */
function createAquariumFloor(group, width, depth) {
  const floorGeometry = new THREE.PlaneGeometry(width, depth);
  const floorMaterial = new THREE.MeshStandardMaterial({
    color: 0x87CEEB, // Sky blue
    roughness: 0.8,
    transparent: true,
    opacity: 0.3
  });
  const floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = 0.01;
  floor.receiveShadow = true;
  group.add(floor);
  
  // Add some coral decorations on floor
  for (let i = 0; i < 5; i++) {
    const coralGeometry = new THREE.ConeGeometry(0.3, 0.8, 6);
    const coralMaterial = new THREE.MeshStandardMaterial({
      color: i % 2 === 0 ? 0xFF6B9D : 0xFFA500,
      roughness: 0.7
    });
    const coral = new THREE.Mesh(coralGeometry, coralMaterial);
    coral.position.set(
      (Math.random() - 0.5) * width * 0.8,
      0.4,
      (Math.random() - 0.5) * depth * 0.8
    );
    coral.rotation.z = (Math.random() - 0.5) * 0.3;
    group.add(coral);
  }
}

/**
 * Create transparent glass walls
 */
function createGlassWalls(group, width, depth, height) {
  const glassMaterial = new THREE.MeshStandardMaterial({
    color: 0x88CCFF,
    transparent: true,
    opacity: 0.25,
    roughness: 0.1,
    metalness: 0.1,
    side: THREE.DoubleSide
  });
  
  // Front wall
  const frontWall = new THREE.Mesh(
    new THREE.PlaneGeometry(width, height),
    glassMaterial
  );
  frontWall.position.set(0, height / 2, depth / 2);
  group.add(frontWall);
  
  // Left wall
  const leftWall = new THREE.Mesh(
    new THREE.PlaneGeometry(depth, height),
    glassMaterial
  );
  leftWall.position.set(-width / 2, height / 2, 0);
  leftWall.rotation.y = Math.PI / 2;
  group.add(leftWall);
  
  // Right wall
  const rightWall = new THREE.Mesh(
    new THREE.PlaneGeometry(depth, height),
    glassMaterial
  );
  rightWall.position.set(width / 2, height / 2, 0);
  rightWall.rotation.y = -Math.PI / 2;
  group.add(rightWall);
  
  // Top (water surface effect)
  const topWall = new THREE.Mesh(
    new THREE.PlaneGeometry(width, depth),
    new THREE.MeshStandardMaterial({
      color: 0x0077BE,
      transparent: true,
      opacity: 0.3,
      roughness: 0.2
    })
  );
  topWall.position.set(0, height, 0);
  topWall.rotation.x = -Math.PI / 2;
  group.add(topWall);
}

/**
 * Create solid back wall with blue water effect
 */
function createBackWall(group, width, height) {
  const backWallGeometry = new THREE.PlaneGeometry(width, height);
  const backWallMaterial = new THREE.MeshStandardMaterial({
    color: 0x0066AA, // Deep ocean blue
    roughness: 0.5
  });
  const backWall = new THREE.Mesh(backWallGeometry, backWallMaterial);
  backWall.position.set(0, height / 2, -6);
  backWall.rotation.y = 0;
  backWall.receiveShadow = true;
  group.add(backWall);
}

/**
 * Create 2D animated sharks
 */
function createSharks(group, width, depth, height) {
  const sharks = [];
  const textureLoader = new THREE.TextureLoader();
  const sharkTexture = textureLoader.load('https://play.rosebud.ai/assets/cute-shark-sprite.webp?OzlE');
  sharkTexture.minFilter = THREE.LinearFilter;
  sharkTexture.magFilter = THREE.LinearFilter;
  
  // Create 2 sharks
  for (let i = 0; i < 2; i++) {
    const sharkMaterial = new THREE.SpriteMaterial({
      map: sharkTexture,
      transparent: true
    });
    
    const shark = new THREE.Sprite(sharkMaterial);
    shark.scale.set(3, 2.5, 1);
    
    // Random starting position
    shark.position.set(
      (Math.random() - 0.5) * width * 0.8,
      2 + Math.random() * (height - 4),
      (Math.random() - 0.5) * depth * 0.6
    );
    
    // Swimming animation data
    shark.userData = {
      swimSpeed: 0.5 + Math.random() * 0.3,
      swimDirection: Math.random() * Math.PI * 2,
      swimHeight: shark.position.y,
      bobAmount: 0.3,
      animationTime: Math.random() * Math.PI * 2,
      bounds: { width, depth, height }
    };
    
    sharks.push(shark);
    group.add(shark);
  }
  
  return sharks;
}

/**
 * Create colorful tropical fish
 */
function createTropicalFish(group, width, depth, height) {
  const fish = [];
  const textureLoader = new THREE.TextureLoader();
  
  const fishTextures = [
    textureLoader.load('https://play.rosebud.ai/assets/tropical-fish-orange.webp?E1mt'),
    textureLoader.load('https://play.rosebud.ai/assets/tropical-fish-blue.webp?uPnJ'),
    textureLoader.load('https://play.rosebud.ai/assets/tropical-fish-yellow.webp?OnJ5')
  ];
  
  fishTextures.forEach(texture => {
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
  });
  
  // Create 8 tropical fish
  for (let i = 0; i < 8; i++) {
    const texture = fishTextures[i % fishTextures.length];
    const fishMaterial = new THREE.SpriteMaterial({
      map: texture,
      transparent: true
    });
    
    const fishSprite = new THREE.Sprite(fishMaterial);
    fishSprite.scale.set(1.2, 1.2, 1);
    
    // Random starting position
    fishSprite.position.set(
      (Math.random() - 0.5) * width * 0.8,
      1 + Math.random() * (height - 2),
      (Math.random() - 0.5) * depth * 0.6
    );
    
    // Swimming animation data
    fishSprite.userData = {
      swimSpeed: 1 + Math.random() * 0.5,
      swimDirection: Math.random() * Math.PI * 2,
      swimHeight: fishSprite.position.y,
      bobAmount: 0.2,
      animationTime: Math.random() * Math.PI * 2,
      bounds: { width, depth, height },
      isTropicalFish: true
    };
    
    fish.push(fishSprite);
    group.add(fishSprite);
  }
  
  return fish;
}

/**
 * Create bubble particle effects
 */
function createBubbles(group, width, depth, height) {
  const bubbles = [];
  
  for (let i = 0; i < 30; i++) {
    const bubbleGeometry = new THREE.SphereGeometry(0.1 + Math.random() * 0.15, 8, 8);
    const bubbleMaterial = new THREE.MeshBasicMaterial({
      color: 0xFFFFFF,
      transparent: true,
      opacity: 0.4
    });
    const bubble = new THREE.Mesh(bubbleGeometry, bubbleMaterial);
    
    bubble.position.set(
      (Math.random() - 0.5) * width * 0.8,
      Math.random() * height,
      (Math.random() - 0.5) * depth * 0.6
    );
    
    bubble.userData = {
      riseSpeed: 0.3 + Math.random() * 0.4,
      drift: (Math.random() - 0.5) * 0.1,
      bounds: { width, depth, height },
      isBubble: true
    };
    
    bubbles.push(bubble);
    group.add(bubble);
  }
  
  return bubbles;
}

/**
 * Create blue underwater lighting
 */
function createUnderwaterLighting(scene, center) {
  // Main blue light
  const blueLight = new THREE.PointLight(0x0088FF, 0.8, 25);
  blueLight.position.set(center.x, 5, center.z);
  scene.add(blueLight);
  
  // Secondary cyan light
  const cyanLight = new THREE.PointLight(0x00DDFF, 0.6, 20);
  cyanLight.position.set(center.x + 5, 4, center.z + 3);
  scene.add(cyanLight);
  
  // Ambient underwater glow
  const ambientLight = new THREE.PointLight(0x0066CC, 0.4, 30);
  ambientLight.position.set(center.x, 3, center.z);
  scene.add(ambientLight);
}

/**
 * Add "Ocean World" sign
 */
function addOceanWorldSign(group) {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  
  // Gradient background (ocean blue)
  const gradient = ctx.createLinearGradient(0, 0, 512, 256);
  gradient.addColorStop(0, '#0077BE');
  gradient.addColorStop(0.5, '#0099DD');
  gradient.addColorStop(1, '#00BBFF');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 512, 256);
  
  // Border
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 8;
  ctx.strokeRect(4, 4, 504, 248);
  
  // Text
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 48px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.shadowColor = '#000000';
  ctx.shadowBlur = 4;
  ctx.fillText('🌊 Ocean World 🦈', 256, 128);
  
  const texture = new THREE.CanvasTexture(canvas);
  const signMaterial = new THREE.SpriteMaterial({
    map: texture,
    transparent: true
  });
  const sign = new THREE.Sprite(signMaterial);
  sign.position.set(0, 10, 8);
  sign.scale.set(6, 3, 1);
  group.add(sign);
}

/**
 * Animate sharks swimming
 */
export function animateSharks(sharks, deltaTime) {
  sharks.forEach(shark => {
    const data = shark.userData;
    data.animationTime += deltaTime;
    
    // Move in swimming direction
    shark.position.x += Math.cos(data.swimDirection) * data.swimSpeed * deltaTime;
    shark.position.z += Math.sin(data.swimDirection) * data.swimSpeed * deltaTime;
    
    // Gentle bobbing motion
    shark.position.y = data.swimHeight + Math.sin(data.animationTime * 2) * data.bobAmount;
    
    // Bounce off walls
    const halfWidth = data.bounds.width / 2 - 1;
    const halfDepth = data.bounds.depth / 2 - 1;
    
    if (shark.position.x > halfWidth || shark.position.x < -halfWidth) {
      data.swimDirection = Math.PI - data.swimDirection;
      shark.position.x = Math.max(-halfWidth, Math.min(halfWidth, shark.position.x));
    }
    if (shark.position.z > halfDepth || shark.position.z < -halfDepth) {
      data.swimDirection = -data.swimDirection;
      shark.position.z = Math.max(-halfDepth, Math.min(halfDepth, shark.position.z));
    }
    
    // Scale pulse (breathing effect)
    const pulse = 1 + Math.sin(data.animationTime * 3) * 0.05;
    shark.scale.set(3 * pulse, 2.5 * pulse, 1);
  });
}

/**
 * Animate tropical fish swimming
 */
export function animateTropicalFish(fish, deltaTime) {
  fish.forEach(fishSprite => {
    const data = fishSprite.userData;
    data.animationTime += deltaTime;
    
    // Move in swimming direction (faster than sharks)
    fishSprite.position.x += Math.cos(data.swimDirection) * data.swimSpeed * deltaTime;
    fishSprite.position.z += Math.sin(data.swimDirection) * data.swimSpeed * deltaTime;
    
    // Gentle bobbing motion
    fishSprite.position.y = data.swimHeight + Math.sin(data.animationTime * 3) * data.bobAmount;
    
    // Bounce off walls
    const halfWidth = data.bounds.width / 2 - 1;
    const halfDepth = data.bounds.depth / 2 - 1;
    
    if (fishSprite.position.x > halfWidth || fishSprite.position.x < -halfWidth) {
      data.swimDirection = Math.PI - data.swimDirection;
      fishSprite.position.x = Math.max(-halfWidth, Math.min(halfWidth, fishSprite.position.x));
    }
    if (fishSprite.position.z > halfDepth || fishSprite.position.z < -halfDepth) {
      data.swimDirection = -data.swimDirection;
      fishSprite.position.z = Math.max(-halfDepth, Math.min(halfDepth, fishSprite.position.z));
    }
    
    // Quick wiggle animation
    const wiggle = 1 + Math.sin(data.animationTime * 5) * 0.08;
    fishSprite.scale.set(1.2 * wiggle, 1.2, 1);
  });
}

/**
 * Animate bubbles rising
 */
export function animateBubbles(bubbles, deltaTime) {
  bubbles.forEach(bubble => {
    const data = bubble.userData;
    
    // Rise up
    bubble.position.y += data.riseSpeed * deltaTime;
    
    // Drift sideways
    bubble.position.x += data.drift * deltaTime * 2;
    
    // Reset when reaching top
    if (bubble.position.y > data.bounds.height) {
      bubble.position.y = 0.5;
      bubble.position.x = (Math.random() - 0.5) * data.bounds.width * 0.8;
      bubble.position.z = (Math.random() - 0.5) * data.bounds.depth * 0.6;
    }
    
    // Gentle scale pulse
    const pulse = 1 + Math.sin(bubble.position.y * 5) * 0.1;
    bubble.scale.setScalar(pulse);
  });
}
