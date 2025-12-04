import * as THREE from 'three';
import { CONFIG } from './config.js';

/**
 * Add benches, lamp posts, and trash bins along zoo paths
 */
export function addPathFurniture(scene) {
  const textureLoader = new THREE.TextureLoader();
  
  // Strategic locations along grid paths
  const furnitureLocations = [
    { x: 0, z: 40, rotation: 0 },           // Near entrance
    { x: -35, z: 10, rotation: Math.PI / 2 },  // Garden zone
    { x: 35, z: 10, rotation: -Math.PI / 2 },  // Small animals zone
    { x: -35, z: -20, rotation: Math.PI / 2 }, // Forest zone
    { x: 35, z: -20, rotation: -Math.PI / 2 }, // Water zone
    { x: 0, z: -40, rotation: 0 },          // Middle path
    { x: -15, z: -65, rotation: Math.PI / 4 }, // Safari left
    { x: 15, z: -65, rotation: -Math.PI / 4 } // Safari right
  ];
  
  furnitureLocations.forEach((loc, index) => {
    // Alternate between benches and lamp posts, add trash bins
    if (index % 3 === 0) {
      addBench(scene, loc.x, loc.z, loc.rotation, textureLoader);
    } else if (index % 3 === 1) {
      addLampPost(scene, loc.x, loc.z, textureLoader);
    }
    
    // Add trash bins near benches and lamp posts
    if (Math.random() > 0.3) {
      const offsetX = Math.cos(loc.rotation) * 2;
      const offsetZ = Math.sin(loc.rotation) * 2;
      addTrashBin(scene, loc.x + offsetX, loc.z + offsetZ, textureLoader);
    }
  });
}

/**
 * Add a wooden park bench
 */
function addBench(scene, x, z, rotation, textureLoader) {
  const benchTexture = textureLoader.load('https://play.rosebud.ai/assets/park-bench-wooden.webp?sK6Y');
  
  const spriteMaterial = new THREE.SpriteMaterial({
    map: benchTexture,
    transparent: true
  });
  
  const bench = new THREE.Sprite(spriteMaterial);
  bench.position.set(x, 0.8, z);
  bench.scale.set(2.5, 1.8, 1);
  bench.userData.isBench = true;
  
  scene.add(bench);
  
  // Add shadow circle
  const shadowGeometry = new THREE.CircleGeometry(1.5, 16);
  const shadowMaterial = new THREE.MeshBasicMaterial({
    color: 0x000000,
    transparent: true,
    opacity: 0.3
  });
  const shadow = new THREE.Mesh(shadowGeometry, shadowMaterial);
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.set(x, 0.06, z);
  scene.add(shadow);
}

/**
 * Add a vintage lamp post
 */
function addLampPost(scene, x, z, textureLoader) {
  const lampTexture = textureLoader.load('https://play.rosebud.ai/assets/lamp-post-vintage.webp?s24F');
  
  const spriteMaterial = new THREE.SpriteMaterial({
    map: lampTexture,
    transparent: true
  });
  
  const lampPost = new THREE.Sprite(spriteMaterial);
  lampPost.position.set(x, 2.5, z);
  lampPost.scale.set(1.2, 4, 1);
  lampPost.userData.isLampPost = true;
  
  scene.add(lampPost);
  
  // Add glowing light effect
  const light = new THREE.PointLight(0xFFE87C, 0.5, 15);
  light.position.set(x, 4, z);
  scene.add(light);
  
  // Add shadow
  const shadowGeometry = new THREE.CircleGeometry(0.5, 16);
  const shadowMaterial = new THREE.MeshBasicMaterial({
    color: 0x000000,
    transparent: true,
    opacity: 0.4
  });
  const shadow = new THREE.Mesh(shadowGeometry, shadowMaterial);
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.set(x, 0.06, z);
  scene.add(shadow);
}

/**
 * Add a colorful trash bin
 */
function addTrashBin(scene, x, z, textureLoader) {
  const binTexture = textureLoader.load('https://play.rosebud.ai/assets/trash-bin-colorful.webp?2dIR');
  
  const spriteMaterial = new THREE.SpriteMaterial({
    map: binTexture,
    transparent: true
  });
  
  const bin = new THREE.Sprite(spriteMaterial);
  bin.position.set(x, 0.8, z);
  bin.scale.set(1.2, 1.5, 1);
  bin.userData.isTrashBin = true;
  
  scene.add(bin);
  
  // Add shadow
  const shadowGeometry = new THREE.CircleGeometry(0.6, 16);
  const shadowMaterial = new THREE.MeshBasicMaterial({
    color: 0x000000,
    transparent: true,
    opacity: 0.3
  });
  const shadow = new THREE.Mesh(shadowGeometry, shadowMaterial);
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.set(x, 0.06, z);
  scene.add(shadow);
}

/**
 * Create animated butterflies for garden areas
 */
export function createButterflies(scene) {
  const textureLoader = new THREE.TextureLoader();
  const butterflyTexture = textureLoader.load('https://play.rosebud.ai/assets/butterfly-sprite-colorful.webp?U19U');
  
  const butterflies = [];
  const gardenPositions = [
    { x: -35, z: 40 },
    { x: -35, z: 20 },
    { x: -30, z: 30 }
  ];
  
  gardenPositions.forEach(pos => {
    for (let i = 0; i < 3; i++) {
      const spriteMaterial = new THREE.SpriteMaterial({
        map: butterflyTexture,
        transparent: true
      });
      
      const butterfly = new THREE.Sprite(spriteMaterial);
      butterfly.position.set(
        pos.x + (Math.random() - 0.5) * 10,
        1.5 + Math.random() * 2,
        pos.z + (Math.random() - 0.5) * 10
      );
      butterfly.scale.set(0.8, 0.8, 1);
      
      butterfly.userData.isButterfly = true;
      butterfly.userData.basePos = { x: butterfly.position.x, z: butterfly.position.z };
      butterfly.userData.time = Math.random() * Math.PI * 2;
      butterfly.userData.speed = 0.5 + Math.random() * 0.5;
      butterfly.userData.radius = 5 + Math.random() * 3;
      
      butterflies.push(butterfly);
      scene.add(butterfly);
    }
  });
  
  return butterflies;
}

/**
 * Create animated birds for forest/tree areas
 */
export function createBirds(scene) {
  const textureLoader = new THREE.TextureLoader();
  const birdTexture = textureLoader.load('https://play.rosebud.ai/assets/bird-sprite-small.webp?Nitu');
  
  const birds = [];
  const treePositions = [
    { x: -35, z: -10 },
    { x: -35, z: -30 },
    { x: -35, z: -50 }
  ];
  
  treePositions.forEach(pos => {
    for (let i = 0; i < 2; i++) {
      const spriteMaterial = new THREE.SpriteMaterial({
        map: birdTexture,
        transparent: true
      });
      
      const bird = new THREE.Sprite(spriteMaterial);
      bird.position.set(
        pos.x + (Math.random() - 0.5) * 15,
        4 + Math.random() * 3,
        pos.z + (Math.random() - 0.5) * 15
      );
      bird.scale.set(0.7, 0.7, 1);
      
      bird.userData.isBird = true;
      bird.userData.basePos = { x: bird.position.x, z: bird.position.z };
      bird.userData.time = Math.random() * Math.PI * 2;
      bird.userData.speed = 1 + Math.random() * 0.8;
      bird.userData.radius = 8 + Math.random() * 4;
      
      birds.push(bird);
      scene.add(bird);
    }
  });
  
  return birds;
}

/**
 * Create animated fireflies near pond
 */
export function createFireflies(scene) {
  const textureLoader = new THREE.TextureLoader();
  const fireflyTexture = textureLoader.load('https://play.rosebud.ai/assets/firefly-glow-sprite.webp?WwZh');
  
  const fireflies = [];
  const pondCenter = { x: 35, z: -30 };
  
  for (let i = 0; i < 12; i++) {
    const spriteMaterial = new THREE.SpriteMaterial({
      map: fireflyTexture,
      transparent: true,
      opacity: 0.8
    });
    
    const firefly = new THREE.Sprite(spriteMaterial);
    firefly.position.set(
      pondCenter.x + (Math.random() - 0.5) * 30,
      0.5 + Math.random() * 2.5,
      pondCenter.z + (Math.random() - 0.5) * 30
    );
    firefly.scale.set(0.6, 0.6, 1);
    
    firefly.userData.isFirefly = true;
    firefly.userData.basePos = { 
      x: firefly.position.x, 
      y: firefly.position.y,
      z: firefly.position.z 
    };
    firefly.userData.time = Math.random() * Math.PI * 2;
    firefly.userData.speed = 0.3 + Math.random() * 0.3;
    firefly.userData.flickerSpeed = 2 + Math.random() * 3;
    
    fireflies.push(firefly);
    scene.add(firefly);
  }
  
  return fireflies;
}

/**
 * Animate all particle effects
 */
export function animateParticles(butterflies, birds, fireflies, deltaTime) {
  // Animate butterflies in figure-8 patterns
  butterflies.forEach(butterfly => {
    butterfly.userData.time += deltaTime * butterfly.userData.speed;
    const t = butterfly.userData.time;
    
    butterfly.position.x = butterfly.userData.basePos.x + 
      Math.sin(t) * butterfly.userData.radius;
    butterfly.position.z = butterfly.userData.basePos.z + 
      Math.sin(t * 2) * butterfly.userData.radius * 0.5;
    butterfly.position.y = 1.5 + Math.sin(t * 3) * 0.5;
    
    // Flutter rotation
    butterfly.rotation.z = Math.sin(t * 10) * 0.2;
  });
  
  // Animate birds in circular patterns
  birds.forEach(bird => {
    bird.userData.time += deltaTime * bird.userData.speed;
    const t = bird.userData.time;
    
    bird.position.x = bird.userData.basePos.x + 
      Math.cos(t) * bird.userData.radius;
    bird.position.z = bird.userData.basePos.z + 
      Math.sin(t) * bird.userData.radius;
    bird.position.y = 4 + Math.sin(t * 2) * 1;
    
    // Face direction of movement
    bird.rotation.z = Math.sin(t) * 0.1;
  });
  
  // Animate fireflies with glowing flicker
  fireflies.forEach(firefly => {
    firefly.userData.time += deltaTime * firefly.userData.speed;
    const t = firefly.userData.time;
    
    firefly.position.x = firefly.userData.basePos.x + 
      Math.sin(t * 1.3) * 2;
    firefly.position.y = firefly.userData.basePos.y + 
      Math.sin(t * 1.7) * 0.8;
    firefly.position.z = firefly.userData.basePos.z + 
      Math.cos(t * 1.5) * 2;
    
    // Flicker effect
    const flicker = Math.abs(Math.sin(t * firefly.userData.flickerSpeed));
    firefly.material.opacity = 0.5 + flicker * 0.5;
    firefly.scale.set(
      0.6 + flicker * 0.2,
      0.6 + flicker * 0.2,
      1
    );
  });
}
