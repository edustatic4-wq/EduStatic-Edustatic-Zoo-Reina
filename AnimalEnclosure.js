import * as THREE from 'three';
import { CONFIG } from './config.js';

// Animal sprite URLs mapped by animal name - NEW CUTE VERSIONS!
const ANIMAL_SPRITES = {
  '🦁 Lion': 'https://play.rosebud.ai/assets/cute-lion-sprite.webp?pM4I',
  '🐘 Elephant': 'https://play.rosebud.ai/assets/cute-elephant-sprite.webp?rYLx',
  '🦒 Giraffe': 'https://play.rosebud.ai/assets/cute-giraffe-sprite.webp?LO08',
  '🐼 Panda': 'https://play.rosebud.ai/assets/cute-panda-sprite.webp?e3kE',
  '🦓 Zebra': 'https://play.rosebud.ai/assets/cute-zebra-sprite.webp?pnK0',
  '🦘 Kangaroo': 'https://play.rosebud.ai/assets/cute-kangaroo-sprite.webp?mXt0',
  '🐻 Bear': 'https://play.rosebud.ai/assets/cute-bear-sprite.webp?7dCO',
  '🦎 Lizard': 'https://play.rosebud.ai/assets/cute-lizard-sprite.webp?Kwnk',
  '🦩 Flamingo': 'https://play.rosebud.ai/assets/cute-flamingo-sprite.webp?5X6Y',
  '🐧 Penguin': 'https://play.rosebud.ai/assets/cute-penguin-sprite.webp?wPp2',
  '🦉 Owl': 'https://play.rosebud.ai/assets/cute-owl-sprite.webp?m9JL',
  '🐢 Turtle': 'https://play.rosebud.ai/assets/cute-turtle-sprite.webp?L6Dd',
  '🐰 Rabbit': 'https://play.rosebud.ai/assets/cute-rabbit-sprite.webp?eMe7',
  '🐻‍❄️ Polar Bear': 'https://play.rosebud.ai/assets/cute-polar-bear-sprite.webp?tBcS', // White polar bear sprite
  '🐧 Arctic Penguin': 'https://play.rosebud.ai/assets/cute-penguin-sprite.webp?wPp2' // Reusing penguin sprite
};

/**
 * Creates a single animal enclosure with a 2D animated cartoon sprite
 */
export function createAnimalEnclosure(animalData, position) {
  const enclosure = new THREE.Group();
  enclosure.position.copy(position);
  
  // Store animal data for interaction
  enclosure.userData.animalData = animalData;
  enclosure.userData.isPlayerNear = false;
  
  // Create fence posts around enclosure - larger enclosures
  const fenceRadius = 5;
  const fencePostCount = 16;
  const fenceHeight = 1.8;
  
  for (let i = 0; i < fencePostCount; i++) {
    const angle = (i / fencePostCount) * Math.PI * 2;
    const x = Math.cos(angle) * fenceRadius;
    const z = Math.sin(angle) * fenceRadius;
    
    // Fence post
    const postGeometry = new THREE.CylinderGeometry(0.08, 0.08, fenceHeight, 6);
    const postMaterial = new THREE.MeshStandardMaterial({ 
      color: CONFIG.COLORS.fenceDark,
      roughness: 0.9
    });
    const post = new THREE.Mesh(postGeometry, postMaterial);
    post.position.set(x, fenceHeight / 2, z);
    post.castShadow = true;
    enclosure.add(post);
    
    // Horizontal fence bars
    if (i < fencePostCount) {
      const nextAngle = ((i + 1) / fencePostCount) * Math.PI * 2;
      const nextX = Math.cos(nextAngle) * fenceRadius;
      const nextZ = Math.sin(nextAngle) * fenceRadius;
      
      const barLength = Math.sqrt((nextX - x) ** 2 + (nextZ - z) ** 2);
      const barGeometry = new THREE.CylinderGeometry(0.04, 0.04, barLength, 6);
      const barMaterial = new THREE.MeshStandardMaterial({ 
        color: CONFIG.COLORS.fenceLight,
        roughness: 0.9
      });
      
      // Top bar
      const topBar = new THREE.Mesh(barGeometry, barMaterial);
      topBar.position.set((x + nextX) / 2, fenceHeight * 0.8, (z + nextZ) / 2);
      topBar.rotation.z = Math.PI / 2;
      topBar.rotation.y = -angle - Math.PI / fencePostCount;
      topBar.castShadow = true;
      enclosure.add(topBar);
      
      // Middle bar
      const midBar = new THREE.Mesh(barGeometry, barMaterial);
      midBar.position.set((x + nextX) / 2, fenceHeight * 0.5, (z + nextZ) / 2);
      midBar.rotation.z = Math.PI / 2;
      midBar.rotation.y = -angle - Math.PI / fencePostCount;
      midBar.castShadow = true;
      enclosure.add(midBar);
    }
  }
  
  // Create 2D animated animal sprite
  const animal = createAnimalSprite(animalData);
  enclosure.add(animal);
  enclosure.userData.animal = animal;
  
  // Add ground patch inside enclosure
  const groundGeometry = new THREE.CircleGeometry(fenceRadius - 0.3, 32);
  const groundMaterial = new THREE.MeshStandardMaterial({ 
    color: 0xD2B48C, // Sandy color
    roughness: 0.95
  });
  const ground = new THREE.Mesh(groundGeometry, groundMaterial);
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = 0.01;
  ground.receiveShadow = true;
  enclosure.add(ground);
  
  // Add some decorative elements
  addEnclosureDecorations(enclosure, fenceRadius, animalData);
  
  return enclosure;
}

/**
 * Creates a 2D billboard sprite for the animal with animation data
 */
function createAnimalSprite(animalData) {
  const textureLoader = new THREE.TextureLoader();
  const spriteUrl = ANIMAL_SPRITES[animalData.name];
  
  if (!spriteUrl) {
    console.warn(`No sprite found for ${animalData.name}`);
    return new THREE.Group();
  }
  
  const texture = textureLoader.load(spriteUrl);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  
  const spriteMaterial = new THREE.SpriteMaterial({ 
    map: texture,
    transparent: true
  });
  
  const sprite = new THREE.Sprite(spriteMaterial);
  
  // Scale based on animal type
  let scale = getAnimalScale(animalData.name);
  sprite.scale.set(scale.x, scale.y, 1);
  sprite.position.y = scale.y / 2 + 0.2;
  
  // Animation data
  sprite.userData.animationTime = Math.random() * Math.PI * 2;
  sprite.userData.baseY = sprite.position.y;
  sprite.userData.baseScale = { x: scale.x, y: scale.y };
  sprite.userData.animalType = animalData.name;
  sprite.userData.excited = false;
  sprite.userData.excitementTime = 0;
  sprite.userData.isEating = false;
  sprite.userData.eatingTime = 0;
  sprite.userData.eatingDuration = 0;
  sprite.userData.isAnimal = true;
  
  return sprite;
}

/**
 * Get appropriate scale for each animal type - BIGGER for better visibility!
 */
function getAnimalScale(animalName) {
  const scales = {
    '🦁 Lion': { x: 5, y: 5 },
    '🐘 Elephant': { x: 5.5, y: 5.5 },
    '🦒 Giraffe': { x: 4.5, y: 6.5 },
    '🐼 Panda': { x: 5.5, y: 5.5 },
    '🦓 Zebra': { x: 4.5, y: 5.5 },
    '🦘 Kangaroo': { x: 5, y: 5.5 },
    '🐻 Bear': { x: 5, y: 5.5 },
    '🦎 Lizard': { x: 5, y: 5 },
    '🦩 Flamingo': { x: 3.5, y: 6 },
    '🐧 Penguin': { x: 4.5, y: 5 },
    '🦉 Owl': { x: 5, y: 5 },
    '🐢 Turtle': { x: 5, y: 5 },
    '🐰 Rabbit': { x: 4.5, y: 5 },
    '🐻‍❄️ Polar Bear': { x: 5.5, y: 5.5 }
  };
  
  return scales[animalName] || { x: 5, y: 5 };
}

/**
 * Add decorative elements to enclosure - THEMED BY AREA!
 */
function addEnclosureDecorations(enclosure, radius, animalData) {
  const textureLoader = new THREE.TextureLoader();
  
  // Determine area type based on animal
  const area = getAnimalArea(animalData.name);
  
  // Add colorful billboard sign with animal portrait and name
  addEnclosureBillboard(enclosure, animalData, textureLoader);
  
  // Add themed decorations based on area
  switch(area) {
    case 'safari':
      addSafariDecorations(enclosure, radius, textureLoader);
      break;
    case 'water':
      addWaterDecorations(enclosure, radius, textureLoader);
      break;
    case 'forest':
      addForestDecorations(enclosure, radius, textureLoader);
      break;
    case 'garden':
      addGardenDecorations(enclosure, radius, textureLoader, animalData);
      break;
  }
}

/**
 * Determine which themed area an animal belongs to
 */
function getAnimalArea(animalName) {
  const safariAnimals = ['🦁 Lion', '🐘 Elephant', '🦒 Giraffe', '🦓 Zebra'];
  const waterAnimals = ['🐧 Penguin', '🦩 Flamingo', '🐢 Turtle'];
  const forestAnimals = ['🐻 Bear', '🦉 Owl', '🦘 Kangaroo'];
  const gardenAnimals = ['🐼 Panda', '🦎 Lizard', '🐰 Rabbit'];
  
  if (safariAnimals.includes(animalName)) return 'safari';
  if (waterAnimals.includes(animalName)) return 'water';
  if (forestAnimals.includes(animalName)) return 'forest';
  if (gardenAnimals.includes(animalName)) return 'garden';
  return 'safari';
}

/**
 * Add large colorful billboard sign at enclosure entrance
 */
function addEnclosureBillboard(enclosure, animalData, textureLoader) {
  // Create canvas for billboard
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 768;
  const ctx = canvas.getContext('2d');
  
  // Colorful gradient background
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, '#FFD700'); // Gold
  gradient.addColorStop(0.5, '#FFA500'); // Orange
  gradient.addColorStop(1, '#FF6B9D'); // Pink
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // White rounded border
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 30;
  ctx.strokeRect(40, 40, canvas.width - 80, canvas.height - 80);
  
  // Draw animal name in large bold text
  ctx.font = 'bold 120px Arial';
  ctx.fillStyle = '#FFFFFF';
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 10;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  const name = animalData.name.split(' ').slice(1).join(' '); // Remove emoji
  ctx.strokeText(name, canvas.width / 2, canvas.height / 2 + 150);
  ctx.fillText(name, canvas.width / 2, canvas.height / 2 + 150);
  
  // Draw emoji at top
  ctx.font = 'bold 300px Arial';
  const emoji = animalData.name.split(' ')[0];
  ctx.fillText(emoji, canvas.width / 2, canvas.height / 2 - 100);
  
  // Create texture and sprite
  const billboardTexture = new THREE.CanvasTexture(canvas);
  const billboardMaterial = new THREE.SpriteMaterial({
    map: billboardTexture,
    transparent: true
  });
  const billboard = new THREE.Sprite(billboardMaterial);
  billboard.position.set(0, 6, -6); // Above and behind enclosure
  billboard.scale.set(8, 6, 1); // Large and visible from far away
  enclosure.add(billboard);
}

/**
 * Add African themed decorations
 */
function addSafariDecorations(enclosure, radius, textureLoader) {
  // Acacia trees
  const acaciaTexture = textureLoader.load('https://play.rosebud.ai/assets/acacia-tree-safari.webp?3l3k');
  for (let i = 0; i < 3; i++) {
    const angle = (i / 3) * Math.PI * 2;
    const x = Math.cos(angle) * (radius * 0.8);
    const z = Math.sin(angle) * (radius * 0.8);
    
    const spriteMaterial = new THREE.SpriteMaterial({ map: acaciaTexture, transparent: true });
    const tree = new THREE.Sprite(spriteMaterial);
    tree.position.set(x, 2.5, z);
    tree.scale.set(3, 3.5, 1);
    enclosure.add(tree);
  }
  
  // Safari rocks
  const rockTexture = textureLoader.load('https://play.rosebud.ai/assets/safari-rocks.webp?uX2l');
  for (let i = 0; i < 2; i++) {
    const angle = Math.random() * Math.PI * 2;
    const x = Math.cos(angle) * (radius * 0.6);
    const z = Math.sin(angle) * (radius * 0.6);
    
    const spriteMaterial = new THREE.SpriteMaterial({ map: rockTexture, transparent: true });
    const rocks = new THREE.Sprite(spriteMaterial);
    rocks.position.set(x, 0.8, z);
    rocks.scale.set(2, 1.5, 1);
    enclosure.add(rocks);
  }
}

/**
 * Add water themed decorations
 */
function addWaterDecorations(enclosure, radius, textureLoader) {
  // Reeds around edges
  const reedsTexture = textureLoader.load('https://play.rosebud.ai/assets/reeds-water-plants.webp?J88z');
  for (let i = 0; i < 4; i++) {
    const angle = (i / 4) * Math.PI * 2;
    const x = Math.cos(angle) * (radius * 0.75);
    const z = Math.sin(angle) * (radius * 0.75);
    
    const spriteMaterial = new THREE.SpriteMaterial({ map: reedsTexture, transparent: true });
    const reeds = new THREE.Sprite(spriteMaterial);
    reeds.position.set(x, 2, z);
    reeds.scale.set(2.5, 3, 1);
    enclosure.add(reeds);
  }
  
  // Lily pads
  const lilyTexture = textureLoader.load('https://play.rosebud.ai/assets/lily-pads-group.webp?VQtS');
  const spriteMaterial = new THREE.SpriteMaterial({ map: lilyTexture, transparent: true });
  const lilies = new THREE.Sprite(spriteMaterial);
  lilies.position.set(0, 0.15, 2);
  lilies.scale.set(3, 3, 1);
  lilies.rotation.x = -Math.PI / 4;
  enclosure.add(lilies);
}

/**
 * Add forest themed decorations
 */
function addForestDecorations(enclosure, radius, textureLoader) {
  // Pine trees
  const pineTexture = textureLoader.load('https://play.rosebud.ai/assets/pine-tree-forest.webp?Iovv');
  for (let i = 0; i < 3; i++) {
    const angle = (i / 3) * Math.PI * 2 + 0.5;
    const x = Math.cos(angle) * (radius * 0.8);
    const z = Math.sin(angle) * (radius * 0.8);
    
    const spriteMaterial = new THREE.SpriteMaterial({ map: pineTexture, transparent: true });
    const pine = new THREE.Sprite(spriteMaterial);
    pine.position.set(x, 3, z);
    pine.scale.set(3, 4, 1);
    enclosure.add(pine);
  }
  
  // Mushroom clusters
  const mushroomTexture = textureLoader.load('https://play.rosebud.ai/assets/mushroom-cluster-red.webp?HCkn');
  for (let i = 0; i < 2; i++) {
    const angle = Math.random() * Math.PI * 2;
    const x = Math.cos(angle) * (radius * 0.5);
    const z = Math.sin(angle) * (radius * 0.5);
    
    const spriteMaterial = new THREE.SpriteMaterial({ map: mushroomTexture, transparent: true });
    const mushrooms = new THREE.Sprite(spriteMaterial);
    mushrooms.position.set(x, 0.8, z);
    mushrooms.scale.set(2, 1.5, 1);
    enclosure.add(mushrooms);
  }
}

/**
 * Add garden themed decorations
 */
function addGardenDecorations(enclosure, radius, textureLoader, animalData) {
  // Colorful flowers
  const flowerTexture = textureLoader.load('https://play.rosebud.ai/assets/colorful-flowers-cluster.webp?T3sN');
  for (let i = 0; i < 4; i++) {
    const angle = (i / 4) * Math.PI * 2;
    const x = Math.cos(angle) * (radius * 0.7);
    const z = Math.sin(angle) * (radius * 0.7);
    
    const spriteMaterial = new THREE.SpriteMaterial({ map: flowerTexture, transparent: true });
    const flowers = new THREE.Sprite(spriteMaterial);
    flowers.position.set(x, 1, z);
    flowers.scale.set(2.5, 2.5, 1);
    enclosure.add(flowers);
  }
  
  // Bamboo for panda area
  if (animalData && animalData.name.includes('Panda')) {
    const bambooTexture = textureLoader.load('https://play.rosebud.ai/assets/bamboo-stalks.webp?L5ae');
    for (let i = 0; i < 3; i++) {
      const angle = (i / 3) * Math.PI * 2;
      const x = Math.cos(angle) * (radius * 0.6);
      const z = Math.sin(angle) * (radius * 0.6);
      
      const spriteMaterial = new THREE.SpriteMaterial({ map: bambooTexture, transparent: true });
      const bamboo = new THREE.Sprite(spriteMaterial);
      bamboo.position.set(x, 2.5, z);
      bamboo.scale.set(1.5, 3.5, 1);
      enclosure.add(bamboo);
    }
  }
}

/**
 * Animate all animals with unique animations per type
 */
export function animateAnimals(enclosures, deltaTime, playerPosition) {
  enclosures.forEach(enclosure => {
    const animal = enclosure.userData.animal;
    if (!animal || !animal.userData) return;
    
    animal.userData.animationTime += deltaTime * 2;
    
    // Check if player is near
    const distance = playerPosition.distanceTo(enclosure.position);
    const isNear = distance < CONFIG.INTERACTION_DISTANCE;
    
    if (isNear && !animal.userData.excited) {
      animal.userData.excited = true;
      animal.userData.excitementTime = 0;
      spawnHeartParticles(enclosure);
    } else if (!isNear && animal.userData.excited) {
      animal.userData.excited = false;
    }
    
    if (animal.userData.excited) {
      animal.userData.excitementTime += deltaTime;
    }
    
    // Apply specific animation based on animal type
    applyAnimalAnimation(animal, deltaTime);
  });
}

/**
 * Create food crumb particles while eating
 */
function createFoodCrumb(animal) {
  const crumb = new THREE.Sprite(
    new THREE.SpriteMaterial({
      color: 0xFFD700,
      transparent: true,
      opacity: 0.8
    })
  );
  
  crumb.scale.set(0.1, 0.1, 1);
  crumb.position.copy(animal.position);
  crumb.position.x += (Math.random() - 0.5) * 0.5;
  crumb.position.z += (Math.random() - 0.5) * 0.5;
  
  crumb.userData = {
    velocity: new THREE.Vector3(
      (Math.random() - 0.5) * 2,
      Math.random() * 2,
      (Math.random() - 0.5) * 2
    ),
    lifetime: 0.5,
    maxLifetime: 0.5
  };
  
  animal.parent.add(crumb);
  
  // Animate crumb
  const animateCrumb = () => {
    crumb.userData.lifetime -= 0.016;
    if (crumb.userData.lifetime <= 0) {
      animal.parent.remove(crumb);
      return;
    }
    
    crumb.position.add(crumb.userData.velocity.clone().multiplyScalar(0.016));
    crumb.userData.velocity.y -= 9.8 * 0.016; // Gravity
    crumb.material.opacity = crumb.userData.lifetime / crumb.userData.maxLifetime;
    
    requestAnimationFrame(animateCrumb);
  };
  animateCrumb();
}

/**
 * Apply unique animation to each animal type
 */
function applyAnimalAnimation(animal, deltaTime) {
  const type = animal.userData.animalType;
  const time = animal.userData.animationTime;
  const baseY = animal.userData.baseY;
  const baseScale = animal.userData.baseScale;
  const excited = animal.userData.excited;
  
  // Eating animation - highest priority
  if (animal.userData.isEating) {
    animal.userData.eatingTime += deltaTime;
    
    // Munching animation
    const munchSpeed = 8; // Fast munching
    const munchAmount = Math.abs(Math.sin(time * munchSpeed));
    
    // Head bob while eating
    animal.position.y = baseY + munchAmount * 0.3;
    
    // Scale changes (squash and stretch)
    const squash = 1 + Math.sin(time * munchSpeed) * 0.15;
    animal.scale.y = baseScale.y * squash;
    animal.scale.x = baseScale.x * (2 - squash); // Opposite squash on X
    
    // Happy wiggle side to side
    animal.rotation.z = Math.sin(time * 4) * 0.1;
    
    // Create food crumb particles
    if (Math.random() < 0.1) {
      createFoodCrumb(animal);
    }
    
    // End eating animation
    if (animal.userData.eatingTime >= animal.userData.eatingDuration) {
      animal.userData.isEating = false;
      animal.userData.eatingTime = 0;
      animal.rotation.z = 0;
      animal.scale.x = baseScale.x;
      animal.scale.y = baseScale.y;
    }
    return;
  }
  
  // Excited animation - more energetic
  if (excited) {
    const bounceAmount = Math.abs(Math.sin(time * 3)) * 0.5;
    animal.position.y = baseY + bounceAmount;
    
    // Slight scale pulse
    const scalePulse = 1 + Math.sin(time * 4) * 0.1;
    animal.scale.x = baseScale.x * scalePulse;
    animal.scale.y = baseScale.y * scalePulse;
    return;
  }
  
  // Normal idle animations
  switch (type) {
    case '🦁 Lion': // Breathing
      animal.scale.x = baseScale.x * (1 + Math.sin(time * 0.8) * 0.05);
      animal.scale.y = baseScale.y * (1 + Math.sin(time * 0.8) * 0.05);
      animal.position.y = baseY + Math.sin(time * 0.5) * 0.05;
      break;
      
    case '🐘 Elephant': // Trunk swaying
      animal.position.y = baseY + Math.sin(time) * 0.15;
      animal.scale.x = baseScale.x * (1 + Math.sin(time * 1.2) * 0.03);
      break;
      
    case '🦒 Giraffe': // Gentle sway
      animal.position.y = baseY + Math.sin(time * 0.7) * 0.2;
      break;
      
    case '🐼 Panda': // Eating bamboo
      animal.scale.y = baseScale.y * (1 + Math.sin(time * 2) * 0.04);
      animal.position.y = baseY + Math.sin(time * 0.6) * 0.1;
      break;
      
    case '🦓 Zebra': // Head bob
      animal.position.y = baseY + Math.abs(Math.sin(time)) * 0.12;
      break;
      
    case '🦘 Kangaroo': // Bouncing
      const bounce = Math.max(0, Math.sin(time * 1.5));
      animal.position.y = baseY + bounce * 0.4;
      break;
      
    case '🐻 Bear': // Waving
      animal.position.y = baseY + Math.sin(time * 0.8) * 0.1;
      break;
      
    case '🦎 Lizard': // Tongue flick
      animal.scale.x = baseScale.x * (1 + Math.sin(time * 3) * 0.02);
      animal.position.y = baseY + Math.sin(time * 0.5) * 0.05;
      break;
      
    case '🦩 Flamingo': // One leg balance
      animal.position.y = baseY + Math.sin(time * 1.2) * 0.08;
      break;
      
    case '🐧 Penguin': // Waddle
      animal.position.y = baseY + Math.abs(Math.sin(time * 1.5)) * 0.1;
      animal.scale.x = baseScale.x * (1 + Math.sin(time * 1.5) * 0.05);
      break;
      
    case '🦉 Owl': // Blinking/head rotation effect
      animal.position.y = baseY + Math.sin(time * 0.4) * 0.06;
      animal.scale.y = baseScale.y * (1 + Math.sin(time * 2) * 0.03);
      break;
      
    case '🐢 Turtle': // Head in and out
      animal.scale.y = baseScale.y * (1 + Math.sin(time * 0.6) * 0.08);
      animal.position.y = baseY + Math.sin(time * 0.5) * 0.05;
      break;
      
    case '🐰 Rabbit': // Ear wiggle and hop
      animal.position.y = baseY + Math.abs(Math.sin(time * 1.8)) * 0.15;
      break;
      
    case '🐻‍❄️ Polar Bear': // Gentle sway like on ice
      animal.position.y = baseY + Math.sin(time * 0.6) * 0.12;
      animal.scale.x = baseScale.x * (1 + Math.sin(time * 0.8) * 0.04);
      break;
      
    default:
      // Generic gentle bob
      animal.position.y = baseY + Math.sin(time) * 0.1;
  }
}

/**
 * Spawn heart particles when player approaches
 */
function spawnHeartParticles(enclosure) {
  const hearts = [];
  const textureLoader = new THREE.TextureLoader();
  const heartTexture = textureLoader.load('https://play.rosebud.ai/assets/heart-particle.webp?tzMT');
  
  for (let i = 0; i < 5; i++) {
    const heartMaterial = new THREE.SpriteMaterial({
      map: heartTexture,
      transparent: true,
      opacity: 1
    });
    
    const heart = new THREE.Sprite(heartMaterial);
    heart.scale.set(0.5, 0.5, 1);
    heart.position.set(
      enclosure.position.x + (Math.random() - 0.5) * 2,
      2 + Math.random(),
      enclosure.position.z + (Math.random() - 0.5) * 2
    );
    
    heart.userData.velocity = {
      x: (Math.random() - 0.5) * 0.5,
      y: 1 + Math.random() * 0.5,
      z: (Math.random() - 0.5) * 0.5
    };
    heart.userData.lifetime = 2;
    heart.userData.isHeartParticle = true;
    
    hearts.push(heart);
    enclosure.parent.add(heart);
  }
  
  // Store hearts for cleanup
  enclosure.userData.hearts = hearts;
}

/**
 * Update and cleanup heart particles
 */
export function updateHeartParticles(scene, deltaTime) {
  const hearts = [];
  
  scene.traverse((object) => {
    if (object.userData.isHeartParticle) {
      hearts.push(object);
    }
  });
  
  hearts.forEach(heart => {
    if (!heart.userData.lifetime) return;
    
    heart.userData.lifetime -= deltaTime;
    
    if (heart.userData.lifetime <= 0) {
      if (heart.parent) {
        heart.parent.remove(heart);
      }
      if (heart.material.map) {
        heart.material.map.dispose();
      }
      heart.material.dispose();
      return;
    }
    
    // Animate heart floating up
    heart.position.x += heart.userData.velocity.x * deltaTime;
    heart.position.y += heart.userData.velocity.y * deltaTime;
    heart.position.z += heart.userData.velocity.z * deltaTime;
    
    // Fade out
    heart.material.opacity = heart.userData.lifetime / 2;
    
    // Scale pulse
    const pulse = 1 + Math.sin(heart.userData.lifetime * 8) * 0.1;
    heart.scale.set(0.5 * pulse, 0.5 * pulse, 1);
  });
}
