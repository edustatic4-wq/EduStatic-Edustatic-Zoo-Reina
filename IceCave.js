import * as THREE from 'three';

/**
 * Create Ice Cave Zone with Arctic theme
 */
export function createIceCaveZone(scene) {
  const caveCenter = { x: 43, z: -73 };
  const caveWidth = 18;
  const caveDepth = 16;
  
  // Snowy white ground
  createSnowyGround(scene, caveCenter, caveWidth, caveDepth);
  
  // Ice cave structure
  createIceCaveStructure(scene, caveCenter);
  
  // Icicles at entrance
  createIcicles(scene, caveCenter);
  
  // Frozen pool
  createFrozenPool(scene, { x: 45, z: -65 });
  
  // Ice rocks scattered around
  createIceRocks(scene, caveCenter, caveWidth, caveDepth);
  
  // Cold blue lighting
  createColdLighting(scene, caveCenter);
  
  // Add zone sign
  addIceCaveSign(scene, caveCenter.x, caveCenter.z + caveDepth/2 + 3);
}

/**
 * Create snowy white ground
 */
function createSnowyGround(scene, center, width, depth) {
  const groundGeometry = new THREE.PlaneGeometry(width, depth);
  const groundMaterial = new THREE.MeshStandardMaterial({
    color: 0xF0F8FF, // Alice blue (snowy white)
    roughness: 0.9,
    metalness: 0.1
  });
  const ground = new THREE.Mesh(groundGeometry, groundMaterial);
  ground.rotation.x = -Math.PI / 2;
  ground.position.set(center.x, 0.02, center.z);
  ground.receiveShadow = true;
  scene.add(ground);
  
  // Add sparkly snow texture with small white dots
  for (let i = 0; i < 30; i++) {
    const x = center.x + (Math.random() - 0.5) * width;
    const z = center.z + (Math.random() - 0.5) * depth;
    
    const sparkleGeometry = new THREE.CircleGeometry(0.1, 6);
    const sparkleMaterial = new THREE.MeshBasicMaterial({
      color: 0xFFFFFF,
      transparent: true,
      opacity: 0.6
    });
    const sparkle = new THREE.Mesh(sparkleGeometry, sparkleMaterial);
    sparkle.rotation.x = -Math.PI / 2;
    sparkle.position.set(x, 0.03, z);
    scene.add(sparkle);
  }
}

/**
 * Create ice cave structure with 2D backdrop (fixed, non-rotating)
 */
function createIceCaveStructure(scene, center) {
  const caveX = center.x - 3;
  const caveZ = center.z - 8;
  
  // Beautiful 2D ice cave backdrop - using Mesh instead of Sprite to prevent rotation
  const textureLoader = new THREE.TextureLoader();
  const caveTexture = textureLoader.load('https://play.rosebud.ai/assets/ice-cave-backdrop.webp?Wbfd');
  caveTexture.minFilter = THREE.LinearFilter;
  caveTexture.magFilter = THREE.LinearFilter;
  
  const caveGeometry = new THREE.PlaneGeometry(20, 11.25);
  const caveMaterial = new THREE.MeshBasicMaterial({
    map: caveTexture,
    transparent: true,
    side: THREE.DoubleSide
  });
  
  const cavePlane = new THREE.Mesh(caveGeometry, caveMaterial);
  cavePlane.position.set(caveX + 3, 5, caveZ);
  cavePlane.rotation.y = 0; // Face forward (towards positive z)
  scene.add(cavePlane);
}

/**
 * Create icicles at cave entrance
 */
function createIcicles(scene, center) {
  const entranceZ = center.z + 2;
  const iciclePositions = [
    { x: center.x - 4, z: entranceZ },
    { x: center.x - 2, z: entranceZ },
    { x: center.x, z: entranceZ },
    { x: center.x + 2, z: entranceZ },
    { x: center.x + 4, z: entranceZ }
  ];
  
  iciclePositions.forEach(pos => {
    const height = 0.8 + Math.random() * 0.6;
    const icicleGeometry = new THREE.ConeGeometry(0.1, height, 6);
    const icicleMaterial = new THREE.MeshStandardMaterial({
      color: 0xE0FFFF, // Light cyan
      transparent: true,
      opacity: 0.8,
      roughness: 0.2,
      metalness: 0.3
    });
    const icicle = new THREE.Mesh(icicleGeometry, icicleMaterial);
    icicle.position.set(pos.x, 3.5 - height / 2, pos.z);
    icicle.castShadow = true;
    scene.add(icicle);
  });
}

/**
 * Create frozen pool
 */
function createFrozenPool(scene, center) {
  const poolGeometry = new THREE.CircleGeometry(3, 32);
  const iceMaterial = new THREE.MeshStandardMaterial({
    color: 0xAFEEEE, // Pale turquoise
    transparent: true,
    opacity: 0.6,
    roughness: 0.1,
    metalness: 0.4
  });
  const pool = new THREE.Mesh(poolGeometry, iceMaterial);
  pool.rotation.x = -Math.PI / 2;
  pool.position.set(center.x, 0.05, center.z);
  pool.receiveShadow = true;
  scene.add(pool);
  
  // Add ice cracks texture
  for (let i = 0; i < 5; i++) {
    const angle = (Math.random() * Math.PI * 2);
    const length = 1 + Math.random() * 2;
    
    const crackGeometry = new THREE.PlaneGeometry(0.05, length);
    const crackMaterial = new THREE.MeshBasicMaterial({
      color: 0x87CEEB,
      transparent: true,
      opacity: 0.4
    });
    const crack = new THREE.Mesh(crackGeometry, crackMaterial);
    crack.rotation.x = -Math.PI / 2;
    crack.rotation.z = angle;
    crack.position.set(center.x, 0.06, center.z);
    scene.add(crack);
  }
}

/**
 * Create ice rocks
 */
function createIceRocks(scene, center, width, depth) {
  for (let i = 0; i < 8; i++) {
    const x = center.x + (Math.random() - 0.5) * width * 0.8;
    const z = center.z + (Math.random() - 0.5) * depth * 0.8;
    const size = 0.4 + Math.random() * 0.6;
    
    const rockGeometry = new THREE.DodecahedronGeometry(size, 0);
    const rockMaterial = new THREE.MeshStandardMaterial({
      color: 0xD0E7F9, // Light ice blue
      roughness: 0.7,
      metalness: 0.2
    });
    const rock = new THREE.Mesh(rockGeometry, rockMaterial);
    rock.position.set(x, size * 0.6, z);
    rock.rotation.set(
      Math.random() * Math.PI,
      Math.random() * Math.PI,
      Math.random() * Math.PI
    );
    rock.castShadow = true;
    scene.add(rock);
  }
}

/**
 * Create cold blue lighting for ice cave
 */
function createColdLighting(scene, center) {
  // Main cold blue light
  const blueLight = new THREE.PointLight(0x87CEEB, 0.6, 20);
  blueLight.position.set(center.x, 5, center.z);
  scene.add(blueLight);
  
  // Secondary cyan light
  const cyanLight = new THREE.PointLight(0x00FFFF, 0.4, 15);
  cyanLight.position.set(center.x + 5, 3, center.z - 5);
  scene.add(cyanLight);
  
  // Ambient cold glow
  const ambientLight = new THREE.PointLight(0xB0E0E6, 0.3, 25);
  ambientLight.position.set(center.x, 2, center.z);
  scene.add(ambientLight);
}

/**
 * Add Ice Cave zone sign
 */
function addIceCaveSign(scene, x, z) {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  
  // Gradient background (icy blue)
  const gradient = ctx.createLinearGradient(0, 0, 512, 256);
  gradient.addColorStop(0, '#B0E0E6');
  gradient.addColorStop(0.5, '#87CEEB');
  gradient.addColorStop(1, '#ADD8E6');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 512, 256);
  
  // Border
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 8;
  ctx.strokeRect(4, 4, 504, 248);
  
  // Text
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 56px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.shadowColor = '#000000';
  ctx.shadowBlur = 4;
  ctx.fillText('❄️ Ice Cave ❄️', 256, 128);
  
  const texture = new THREE.CanvasTexture(canvas);
  const signMaterial = new THREE.SpriteMaterial({
    map: texture,
    transparent: true
  });
  const sign = new THREE.Sprite(signMaterial);
  sign.position.set(x, 2.5, z);
  sign.scale.set(4, 2, 1);
  scene.add(sign);
}

/**
 * Create falling snow particles for ice cave zone
 */
export function createSnowParticles(scene) {
  const particleCount = 200;
  const particles = [];
  
  // Snow zone boundaries
  const snowZone = {
    minX: 34,
    maxX: 52,
    minZ: -85,
    maxZ: -60
  };
  
  for (let i = 0; i < particleCount; i++) {
    const geometry = new THREE.SphereGeometry(0.05, 4, 4);
    const material = new THREE.MeshBasicMaterial({
      color: 0xFFFFFF,
      transparent: true,
      opacity: 0.8
    });
    const particle = new THREE.Mesh(geometry, material);
    
    particle.position.set(
      snowZone.minX + Math.random() * (snowZone.maxX - snowZone.minX),
      Math.random() * 15 + 5,
      snowZone.minZ + Math.random() * (snowZone.maxZ - snowZone.minZ)
    );
    
    particle.userData.velocity = Math.random() * 0.5 + 0.3;
    particle.userData.drift = (Math.random() - 0.5) * 0.2;
    particle.userData.zone = snowZone;
    particle.userData.isSnowParticle = true;
    
    particles.push(particle);
    scene.add(particle);
  }
  
  return particles;
}

/**
 * Update snow particles
 */
export function updateSnowParticles(particles, deltaTime) {
  particles.forEach(particle => {
    // Fall down
    particle.position.y -= particle.userData.velocity * deltaTime * 5;
    
    // Drift sideways
    particle.position.x += particle.userData.drift * deltaTime;
    
    // Reset when hitting ground
    if (particle.position.y < 0.5) {
      particle.position.y = 20;
      particle.position.x = particle.userData.zone.minX + 
        Math.random() * (particle.userData.zone.maxX - particle.userData.zone.minX);
      particle.position.z = particle.userData.zone.minZ + 
        Math.random() * (particle.userData.zone.maxZ - particle.userData.zone.minZ);
    }
  });
}
