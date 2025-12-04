import * as THREE from 'three';
import { CONFIG } from './config.js';

// Footprint textures
const FOOTPRINT_TEXTURES = {
  paw: 'https://play.rosebud.ai/assets/paw-print.webp?3Oyr',
  elephant: 'https://play.rosebud.ai/assets/elephant-footprint.webp?z6uk',
  bird: 'https://play.rosebud.ai/assets/bird-footprint.webp?uFZb',
  hoof: 'https://play.rosebud.ai/assets/hoof-print.webp?WBoA'
};

// Animal-specific footprint configurations
const ANIMAL_FOOTPRINTS = {
  '🦁 Lion': { type: 'paw', color: 0xFFA500, size: 0.6 }, // Orange
  '🐘 Elephant': { type: 'elephant', color: 0x808080, size: 0.8 }, // Gray
  '🦒 Giraffe': { type: 'hoof', color: 0xFFD700, size: 0.5 }, // Yellow
  '🐼 Panda': { type: 'paw', color: 0x000000, size: 0.6 }, // Black (will add white outline)
  '🦓 Zebra': { type: 'hoof', color: 0x000000, size: 0.5 }, // Black
  '🦘 Kangaroo': { type: 'paw', color: 0xD2691E, size: 0.6 }, // Tan
  '🐻 Bear': { type: 'paw', color: 0x8B4513, size: 0.7 }, // Brown
  '🦎 Lizard': { type: 'paw', color: 0x32CD32, size: 0.4 }, // Lime green
  '🦩 Flamingo': { type: 'bird', color: 0xFF69B4, size: 0.5 }, // Pink
  '🐧 Penguin': { type: 'bird', color: 0x4A90E2, size: 0.5 }, // Blue
  '🦉 Owl': { type: 'bird', color: 0x8B7355, size: 0.5 }, // Brown
  '🐢 Turtle': { type: 'paw', color: 0x228B22, size: 0.5 }, // Green
  '🐰 Rabbit': { type: 'paw', color: 0xFFB6C1, size: 0.4 } // Light pink
};

/**
 * Create footprint trails from paths to each enclosure
 */
export function createFootprintTrails(scene, enclosures) {
  const textureLoader = new THREE.TextureLoader();
  
  // Preload textures
  const textures = {};
  Object.keys(FOOTPRINT_TEXTURES).forEach(key => {
    textures[key] = textureLoader.load(FOOTPRINT_TEXTURES[key]);
  });
  
  enclosures.forEach(enclosure => {
    const animalData = enclosure.userData.animalData;
    if (!animalData) return;
    
    const footprintConfig = ANIMAL_FOOTPRINTS[animalData.name];
    if (!footprintConfig) return;
    
    // Find nearest path waypoint to this enclosure
    const enclosurePos = enclosure.position;
    const nearestWaypoint = findNearestWaypoint(enclosurePos);
    
    // Create trail from waypoint to enclosure
    createFootprintPath(
      scene,
      nearestWaypoint,
      enclosurePos,
      footprintConfig,
      textures[footprintConfig.type]
    );
  });
}

/**
 * Find the nearest path waypoint to a position
 */
function findNearestWaypoint(position) {
  const waypoints = CONFIG.PATH_WAYPOINTS;
  let nearest = waypoints[0];
  let minDist = Infinity;
  
  waypoints.forEach(wp => {
    const dist = Math.sqrt(
      (position.x - wp.x) ** 2 + 
      (position.z - wp.z) ** 2
    );
    if (dist < minDist) {
      minDist = dist;
      nearest = wp;
    }
  });
  
  return nearest;
}

/**
 * Create a trail of footprints between two points
 */
function createFootprintPath(scene, start, end, config, texture) {
  const dx = end.x - start.x;
  const dz = end.z - start.z;
  const distance = Math.sqrt(dx * dx + dz * dz);
  const angle = Math.atan2(dx, dz);
  
  // Number of footprints based on distance
  const stepSize = 1.5; // Distance between prints
  const numSteps = Math.floor(distance / stepSize);
  
  // Alternate left and right for realistic walking
  for (let i = 1; i < numSteps; i++) {
    const t = i / numSteps;
    const x = start.x + dx * t;
    const z = start.z + dz * t;
    
    // Offset alternating left/right for realistic walking
    const side = (i % 2 === 0) ? 1 : -1;
    const offsetAmount = 0.2;
    const offsetX = Math.cos(angle + Math.PI / 2) * offsetAmount * side;
    const offsetZ = Math.sin(angle + Math.PI / 2) * offsetAmount * side;
    
    createFootprint(
      scene,
      x + offsetX,
      z + offsetZ,
      angle + (Math.random() - 0.5) * 0.3, // Slight rotation variation
      config,
      texture,
      0.9 + Math.random() * 0.2 // Size variation
    );
  }
}

/**
 * Create a single footprint decal on the ground
 */
function createFootprint(scene, x, z, rotation, config, texture, sizeVariation = 1) {
  const finalSize = config.size * sizeVariation;
  
  const material = new THREE.SpriteMaterial({
    map: texture,
    color: config.color,
    transparent: true,
    opacity: 0.7 + Math.random() * 0.15
  });
  
  const sprite = new THREE.Sprite(material);
  sprite.position.set(x, 0.05, z);
  sprite.scale.set(finalSize, finalSize, 1);
  sprite.userData.footprint = true;
  
  scene.add(sprite);
  
  // Add white outline for dark prints (panda and zebra)
  if (config.color === 0x000000) {
    const outlineMaterial = new THREE.SpriteMaterial({
      map: texture,
      color: 0xFFFFFF,
      transparent: true,
      opacity: 0.6
    });
    
    const outlineSprite = new THREE.Sprite(outlineMaterial);
    outlineSprite.position.set(x, 0.04, z);
    outlineSprite.scale.set(finalSize * 1.15, finalSize * 1.15, 1);
    outlineSprite.userData.footprint = true;
    
    scene.add(outlineSprite);
  }
}

/**
 * Create directional signposts at path junctions
 */
export function createSignposts(scene, enclosures) {
  const textureLoader = new THREE.TextureLoader();
  const signTexture = textureLoader.load('https://play.rosebud.ai/assets/wooden-signpost.webp?Nx18');
  
  // Group enclosures by area for better signpost placement
  const areaGroups = {};
  enclosures.forEach(enclosure => {
    const area = enclosure.userData.area;
    if (!areaGroups[area]) {
      areaGroups[area] = [];
    }
    areaGroups[area].push(enclosure);
  });
  
  // Create signposts near key waypoints pointing to animals
  const signpostLocations = [
    { waypoint: { x: 0, z: -15 }, direction: 'north', area: 'safari' },
    { waypoint: { x: 45, z: 20 }, direction: 'east', area: 'water' },
    { waypoint: { x: -50, z: 0 }, direction: 'west', area: 'forest' },
    { waypoint: { x: 0, z: 50 }, direction: 'south', area: 'garden' }
  ];
  
  signpostLocations.forEach(location => {
    const animals = areaGroups[location.area];
    if (!animals) return;
    
    animals.forEach((enclosure, index) => {
      createSignpost(
        scene,
        location.waypoint.x + (index - animals.length / 2) * 3,
        location.waypoint.z,
        enclosure.userData.animalData,
        enclosure.position,
        signTexture
      );
    });
  });
}

/**
 * Create a single signpost pointing to an animal
 */
function createSignpost(scene, x, z, animalData, targetPos, texture) {
  const signpost = new THREE.Group();
  
  // Wooden post
  const postGeometry = new THREE.CylinderGeometry(0.08, 0.08, 2, 8);
  const postMaterial = new THREE.MeshStandardMaterial({
    color: 0x8B4513,
    roughness: 0.9
  });
  const post = new THREE.Mesh(postGeometry, postMaterial);
  post.position.y = 1;
  post.castShadow = true;
  signpost.add(post);
  
  // Sign board sprite
  const signMaterial = new THREE.SpriteMaterial({
    map: texture,
    transparent: true
  });
  const sign = new THREE.Sprite(signMaterial);
  sign.position.y = 1.8;
  sign.scale.set(2, 1.8, 1);
  signpost.add(sign);
  
  // Calculate rotation to point toward target
  const dx = targetPos.x - x;
  const dz = targetPos.z - z;
  const angle = Math.atan2(dx, dz);
  signpost.rotation.y = angle;
  
  signpost.position.set(x, 0, z);
  scene.add(signpost);
  
  // Create text label using canvas texture
  createSignText(sign, animalData);
}

/**
 * Create text overlay on signpost using canvas
 */
function createSignText(sprite, animalData) {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Draw emoji
  ctx.font = 'bold 80px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const emoji = animalData.name.split(' ')[0]; // Get emoji part
  ctx.fillText(emoji, canvas.width / 2, canvas.height / 2 - 20);
  
  // Draw name (without emoji)
  ctx.font = 'bold 40px Arial';
  const name = animalData.name.split(' ').slice(1).join(' ');
  ctx.fillStyle = '#000000';
  ctx.fillText(name, canvas.width / 2, canvas.height / 2 + 50);
  
  // Create texture from canvas
  const textTexture = new THREE.CanvasTexture(canvas);
  textTexture.needsUpdate = true;
  
  // Create sprite for text overlay
  const textMaterial = new THREE.SpriteMaterial({
    map: textTexture,
    transparent: true
  });
  const textSprite = new THREE.Sprite(textMaterial);
  textSprite.position.set(0, 0.1, 0.01);
  textSprite.scale.set(1.6, 0.8, 1);
  sprite.add(textSprite);
}

/**
 * Get themed path color based on area
 */
export function getPathColorForArea(animals, enclosures) {
  // This will be used in Environment.js to color paths by zone
  return {
    safari: 0xF5DEB3,    // Sandy beige
    water: 0xB3E5FC,     // Light blue
    forest: 0x7CB342,    // Mossy green  
    garden: 0xE8927C     // Warm terracotta
  };
}
