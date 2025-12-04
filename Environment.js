import * as THREE from 'three';
import { CONFIG } from './config.js';

/**
 * Creates the expansive zoo environment with themed areas
 */
export function createEnvironment(scene) {
  const textureLoader = new THREE.TextureLoader();
  
  // Large ground plane with 2D cartoon grass - STATIC
  const groundSize = 250;
  const groundGeometry = new THREE.PlaneGeometry(groundSize, groundSize);
  const groundTexture = textureLoader.load('https://play.rosebud.ai/assets/cartoon-grass-animated.webp?zjx9');
  groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
  groundTexture.repeat.set(20, 20); // Reduced from 30 to reduce moiré effect
  
  // Enable mipmaps and set better filtering to reduce visual artifacts
  groundTexture.generateMipmaps = true;
  groundTexture.minFilter = THREE.LinearMipmapLinearFilter;
  groundTexture.magFilter = THREE.LinearFilter;
  groundTexture.anisotropy = 16; // Maximum anisotropic filtering
  
  const groundMaterial = new THREE.MeshStandardMaterial({ 
    map: groundTexture,
    roughness: 0.9,
    metalness: 0.0
  });
  const ground = new THREE.Mesh(groundGeometry, groundMaterial);
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);
  
  // Skybox
  createSkybox(scene, textureLoader);
  
  // Create themed area decorations
  createSafariArea(scene, textureLoader);
  createWaterArea(scene, textureLoader);
  createForestArea(scene, textureLoader);
  createGardenArea(scene, textureLoader);
  
  // Add open meadows with scattered flowers
  createMeadows(scene, textureLoader);
  
  // Add rest areas with benches
  createRestAreas(scene);
  
  // Add boundary trees
  createBoundaryTrees(scene, textureLoader);
  
  // Add rectangular perimeter fence around entire zoo
  createRectangularPerimeterFence(scene);
  
  // Create Ice Cave Zone (import from IceCave.js)
  // This will be called from main.js after import
  
  return { ground };
}

/**
 * Animate the cartoon grass - DISABLED to prevent texture movement
 */
export function animateCartoonGrass(ground, deltaTime) {
  // Animation disabled - grass is now static
  return;
}



/**
 * Safari Area (North) - Open savanna feel with sandy ground
 */
function createSafariArea(scene, textureLoader) {
  const safariCenter = { x: -10, z: -90 };
  const safariRadius = 35;
  
  // Sandy ground patch
  const sandGeometry = new THREE.CircleGeometry(safariRadius, 32);
  const sandMaterial = new THREE.MeshStandardMaterial({ 
    color: 0xF5DEB3,
    roughness: 0.95
  });
  const sand = new THREE.Mesh(sandGeometry, sandMaterial);
  sand.rotation.x = -Math.PI / 2;
  sand.position.set(safariCenter.x, 0.01, safariCenter.z);
  sand.receiveShadow = true;
  scene.add(sand);
  
  // Scattered acacia-like trees
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2 + Math.random() * 0.5;
    const distance = 25 + Math.random() * 10;
    const x = safariCenter.x + Math.cos(angle) * distance;
    const z = safariCenter.z + Math.sin(angle) * distance;
    
    addTree(scene, textureLoader, x, z, 3.5);
  }
  
  // Add safari sign
  addAreaSign(scene, 'Safari Area', safariCenter.x, safariCenter.z + 35);
}

/**
 * Water Area (East) - Large pond with aquatic plants
 */
function createWaterArea(scene, textureLoader) {
  const waterCenter = { x: 60, z: -40 };
  
  // Large pond
  const pondGeometry = new THREE.CircleGeometry(20, 32);
  const pondMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x4A90E2,
    roughness: 0.1,
    metalness: 0.5,
    transparent: true,
    opacity: 0.85
  });
  const pond = new THREE.Mesh(pondGeometry, pondMaterial);
  pond.rotation.x = -Math.PI / 2;
  pond.position.set(waterCenter.x, 0.05, waterCenter.z);
  pond.receiveShadow = true;
  scene.add(pond);
  
  // Pond border with rocks
  for (let i = 0; i < 24; i++) {
    const angle = (i / 24) * Math.PI * 2;
    const x = waterCenter.x + Math.cos(angle) * 20.5;
    const z = waterCenter.z + Math.sin(angle) * 20.5;
    
    const rockGeometry = new THREE.SphereGeometry(0.6 + Math.random() * 0.4, 8, 8);
    const rockMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x808080,
      roughness: 0.95
    });
    const rock = new THREE.Mesh(rockGeometry, rockMaterial);
    rock.position.set(x, 0.3, z);
    rock.scale.y = 0.6;
    rock.castShadow = true;
    scene.add(rock);
  }
  
  // Trees around water area
  for (let i = 0; i < 12; i++) {
    const angle = (i / 12) * Math.PI * 2;
    const distance = 28 + Math.random() * 5;
    const x = waterCenter.x + Math.cos(angle) * distance;
    const z = waterCenter.z + Math.sin(angle) * distance;
    
    addTree(scene, textureLoader, x, z, 4);
  }
  
  // Add water area sign
  addAreaSign(scene, 'Water Area', waterCenter.x - 25, waterCenter.z);
}

/**
 * Forest Area (West) - Dense trees and woodland feel
 */
function createForestArea(scene, textureLoader) {
  const forestCenter = { x: -60, z: -25 };
  const forestRadius = 40;
  
  // Darker grass patch
  const forestGroundGeometry = new THREE.CircleGeometry(forestRadius, 32);
  const forestGroundMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x5A7D3A,
    roughness: 0.95
  });
  const forestGround = new THREE.Mesh(forestGroundGeometry, forestGroundMaterial);
  forestGround.rotation.x = -Math.PI / 2;
  forestGround.position.set(forestCenter.x, 0.01, forestCenter.z);
  forestGround.receiveShadow = true;
  scene.add(forestGround);
  
  // Dense tree coverage
  for (let i = 0; i < 35; i++) {
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * forestRadius;
    const x = forestCenter.x + Math.cos(angle) * distance;
    const z = forestCenter.z + Math.sin(angle) * distance;
    
    // Avoid placing trees too close to enclosure positions
    const tooClose = CONFIG.ANIMALS.forest.some(animal => {
      const dx = x - animal.position.x;
      const dz = z - animal.position.z;
      return Math.sqrt(dx * dx + dz * dz) < 12;
    });
    
    if (!tooClose) {
      addTree(scene, textureLoader, x, z, 3 + Math.random() * 2);
    }
  }
  
  // Add forest sign
  addAreaSign(scene, 'Forest Area', forestCenter.x + 20, forestCenter.z - 30);
}

/**
 * Garden Area (South) - Colorful flower gardens
 */
function createGardenArea(scene, textureLoader) {
  const gardenCenter = { x: 0, z: 27 };
  const gardenRadius = 35;
  
  // Vibrant grass
  const gardenGroundGeometry = new THREE.CircleGeometry(gardenRadius, 32);
  const gardenGroundMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x7FD67F,
    roughness: 0.95
  });
  const gardenGround = new THREE.Mesh(gardenGroundGeometry, gardenGroundMaterial);
  gardenGround.rotation.x = -Math.PI / 2;
  gardenGround.position.set(gardenCenter.x, 0.01, gardenCenter.z);
  gardenGround.receiveShadow = true;
  scene.add(gardenGround);
  
  // Flower beds in geometric patterns
  const flowerBedPositions = [
    { x: -15, z: 15 },
    { x: 15, z: 15 },
    { x: -20, z: 30 },
    { x: 20, z: 30 },
    { x: 0, z: 40 }
  ];
  
  flowerBedPositions.forEach(pos => {
    createFlowerBed(scene, textureLoader, pos.x, pos.z);
  });
  
  // Small ornamental trees
  for (let i = 0; i < 10; i++) {
    const angle = (i / 10) * Math.PI * 2;
    const distance = 28 + Math.random() * 3;
    const x = gardenCenter.x + Math.cos(angle) * distance;
    const z = gardenCenter.z + Math.sin(angle) * distance;
    
    addTree(scene, textureLoader, x, z, 3);
  }
  
  // Add garden sign
  addAreaSign(scene, 'Garden Area', gardenCenter.x, gardenCenter.z + 25);
}

/**
 * Create flower bed
 */
function createFlowerBed(scene, textureLoader, centerX, centerZ) {
  const flowerTexture = textureLoader.load('https://play.rosebud.ai/assets/flower-sprite.webp?y07m');
  
  // Flower bed ground
  const bedGeometry = new THREE.CircleGeometry(4, 16);
  const bedMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x8B6F47,
    roughness: 0.95
  });
  const bed = new THREE.Mesh(bedGeometry, bedMaterial);
  bed.rotation.x = -Math.PI / 2;
  bed.position.set(centerX, 0.02, centerZ);
  bed.receiveShadow = true;
  scene.add(bed);
  
  // Flowers scattered in bed
  for (let i = 0; i < 15; i++) {
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * 3.5;
    const x = centerX + Math.cos(angle) * distance;
    const z = centerZ + Math.sin(angle) * distance;
    
    const spriteMaterial = new THREE.SpriteMaterial({ 
      map: flowerTexture,
      transparent: true
    });
    const flower = new THREE.Sprite(spriteMaterial);
    flower.position.set(x, 0.5, z);
    flower.scale.set(1, 1, 1);
    scene.add(flower);
  }
}

/**
 * Create open meadows between areas
 */
function createMeadows(scene, textureLoader) {
  const flowerTexture = textureLoader.load('https://play.rosebud.ai/assets/flower-sprite.webp?y07m');
  
  // Scatter flowers across open areas
  const meadowPositions = [
    { x: 20, z: -55, count: 20 },
    { x: -20, z: -15, count: 20 },
    { x: 30, z: -5, count: 15 },
    { x: -30, z: -45, count: 15 }
  ];
  
  meadowPositions.forEach(meadow => {
    for (let i = 0; i < meadow.count; i++) {
      const x = meadow.x + (Math.random() - 0.5) * 25;
      const z = meadow.z + (Math.random() - 0.5) * 25;
      
      const spriteMaterial = new THREE.SpriteMaterial({ 
        map: flowerTexture,
        transparent: true
      });
      const flower = new THREE.Sprite(spriteMaterial);
      flower.position.set(x, 0.4, z);
      flower.scale.set(0.8, 0.8, 1);
      scene.add(flower);
    }
  });
}

/**
 * Create rest areas with benches
 */
function createRestAreas(scene) {
  const restAreaPositions = [
    { x: 10, z: -45 },
    { x: -35, z: -35 },
    { x: 35, z: -10 },
    { x: -10, z: 0 }
  ];
  
  restAreaPositions.forEach(pos => {
    createBench(scene, pos.x, pos.z, Math.random() * Math.PI * 2);
  });
}

/**
 * Create a simple bench
 */
function createBench(scene, x, z, rotation) {
  const bench = new THREE.Group();
  
  // Bench seat
  const seatGeometry = new THREE.BoxGeometry(2, 0.1, 0.6);
  const benchMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x8B4513,
    roughness: 0.9
  });
  const seat = new THREE.Mesh(seatGeometry, benchMaterial);
  seat.position.y = 0.5;
  seat.castShadow = true;
  bench.add(seat);
  
  // Bench back
  const backGeometry = new THREE.BoxGeometry(2, 0.6, 0.1);
  const back = new THREE.Mesh(backGeometry, benchMaterial);
  back.position.set(0, 0.8, -0.25);
  back.castShadow = true;
  bench.add(back);
  
  // Legs
  const legGeometry = new THREE.BoxGeometry(0.1, 0.5, 0.1);
  const positions = [
    [-0.8, 0.25, -0.2],
    [0.8, 0.25, -0.2],
    [-0.8, 0.25, 0.2],
    [0.8, 0.25, 0.2]
  ];
  
  positions.forEach(pos => {
    const leg = new THREE.Mesh(legGeometry, benchMaterial);
    leg.position.set(...pos);
    leg.castShadow = true;
    bench.add(leg);
  });
  
  bench.position.set(x, 0, z);
  bench.rotation.y = rotation;
  scene.add(bench);
}

/**
 * Add a tree at specified position
 */
function addTree(scene, textureLoader, x, z, scale = 4) {
  const treeTexture = textureLoader.load('https://play.rosebud.ai/assets/tree-sprite.webp?2FAs');
  
  const spriteMaterial = new THREE.SpriteMaterial({ 
    map: treeTexture,
    transparent: true
  });
  const tree = new THREE.Sprite(spriteMaterial);
  tree.position.set(x, 3 * (scale / 4), z);
  tree.scale.set(scale, scale * 1.25, 1);
  scene.add(tree);
  
  // Shadow
  const shadowGeometry = new THREE.CircleGeometry(scale * 0.3, 16);
  const shadowMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x000000,
    transparent: true,
    opacity: 0.3,
    roughness: 1.0
  });
  const shadow = new THREE.Mesh(shadowGeometry, shadowMaterial);
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.set(x, 0.05, z);
  shadow.receiveShadow = true;
  scene.add(shadow);
}

/**
 * Add boundary trees to frame the zoo
 */
function createBoundaryTrees(scene, textureLoader) {
  const boundary = 95;
  const treeCount = 40;
  
  for (let i = 0; i < treeCount; i++) {
    const angle = (i / treeCount) * Math.PI * 2;
    const x = Math.cos(angle) * boundary;
    const z = Math.sin(angle) * boundary;
    
    addTree(scene, textureLoader, x, z, 4.5);
  }
}

/**
 * Add area sign
 */
function addAreaSign(scene, text, x, z) {
  const textureLoader = new THREE.TextureLoader();
  const signTexture = textureLoader.load('https://play.rosebud.ai/assets/sign-board.webp?Va7i');
  
  const spriteMaterial = new THREE.SpriteMaterial({ 
    map: signTexture,
    transparent: true
  });
  const sign = new THREE.Sprite(spriteMaterial);
  sign.position.set(x, 2, z);
  sign.scale.set(3, 2.8, 1);
  scene.add(sign);
  
  // We'll render text on these signs using canvas (simplified version)
  // In production, you'd use a proper text rendering solution
}

/**
 * Create skybox
 */
function createSkybox(scene, textureLoader) {
  const skyGeometry = new THREE.SphereGeometry(120, 32, 32);
  const skyTexture = textureLoader.load('https://play.rosebud.ai/assets/sky-gradient.webp?HygE');
  
  const skyMaterial = new THREE.MeshBasicMaterial({ 
    map: skyTexture,
    side: THREE.BackSide
  });
  const sky = new THREE.Mesh(skyGeometry, skyMaterial);
  scene.add(sky);
}

/**
 * Create rectangular perimeter fence around the zoo
 */
function createRectangularPerimeterFence(scene) {
  // Rectangular zoo dimensions - expanded to go around pond
  const zooWidth = 120;  // East-West (expanded to fit pond)
  const zooDepth = 160;  // North-South
  const fenceHeight = 1.5;
  const postSpacing = 4;
  const entranceZ = 55; // South entrance position
  const entranceWidth = 16;
  
  // Pond bounds (for fence to avoid)
  const pondCenter = { x: 60, z: -40 };
  const pondRadius = 22; // Slightly larger than pond to give space
  
  const woodColor = 0x8B6F47;
  const darkWoodColor = 0x654321;
  
  // Define the four sides of the rectangular fence
  const sides = [
    // North side (top/back)
    { startX: -zooWidth/2, startZ: -zooDepth/2, endX: zooWidth/2, endZ: -zooDepth/2 },
    // East side (right)
    { startX: zooWidth/2, startZ: -zooDepth/2, endX: zooWidth/2, endZ: zooDepth/2 },
    // South side (bottom/entrance) - will have gap
    { startX: zooWidth/2, startZ: zooDepth/2, endX: -zooWidth/2, endZ: zooDepth/2 },
    // West side (left)
    { startX: -zooWidth/2, startZ: zooDepth/2, endX: -zooWidth/2, endZ: -zooDepth/2 }
  ];
  
  sides.forEach((side, sideIndex) => {
    const dx = side.endX - side.startX;
    const dz = side.endZ - side.startZ;
    const sideLength = Math.sqrt(dx * dx + dz * dz);
    const numPosts = Math.ceil(sideLength / postSpacing);
    
    for (let i = 0; i <= numPosts; i++) {
      const t = i / numPosts;
      const x = side.startX + dx * t;
      const z = side.startZ + dz * t;
      
      // Skip fence posts at entrance (south side)
      if (sideIndex === 2 && z > entranceZ - 3 && Math.abs(x) < entranceWidth / 2) {
        continue;
      }
      
      // Skip fence posts that overlap with pond
      const distToPond = Math.sqrt((x - pondCenter.x) ** 2 + (z - pondCenter.z) ** 2);
      if (distToPond < pondRadius) {
        continue;
      }
      
      // Create fence post
      const postGeometry = new THREE.BoxGeometry(0.15, fenceHeight, 0.15);
      const postMaterial = new THREE.MeshStandardMaterial({
        color: woodColor,
        roughness: 0.9
      });
      const post = new THREE.Mesh(postGeometry, postMaterial);
      post.position.set(x, fenceHeight / 2, z);
      post.castShadow = true;
      scene.add(post);
      
      // Add horizontal planks between this post and next
      if (i < numPosts) {
        const nextT = (i + 1) / numPosts;
        const nextX = side.startX + dx * nextT;
        const nextZ = side.startZ + dz * nextT;
        
        // Skip planks at entrance
        if (sideIndex === 2) {
          const midX = (x + nextX) / 2;
          const midZ = (z + nextZ) / 2;
          if (midZ > entranceZ - 3 && Math.abs(midX) < entranceWidth / 2) {
            continue;
          }
        }
        
        // Skip planks that overlap with pond
        const midX = (x + nextX) / 2;
        const midZ = (z + nextZ) / 2;
        const distToPond = Math.sqrt((midX - pondCenter.x) ** 2 + (midZ - pondCenter.z) ** 2);
        if (distToPond < pondRadius) {
          continue;
        }
        
        const plankLength = Math.sqrt((nextX - x) ** 2 + (nextZ - z) ** 2);
        const plankAngle = Math.atan2(nextX - x, nextZ - z);
        
        // Create 3 horizontal planks
        const plankHeights = [0.4, 0.8, 1.2];
        plankHeights.forEach(height => {
          const plankGeometry = new THREE.BoxGeometry(plankLength, 0.1, 0.06);
          const plankMaterial = new THREE.MeshStandardMaterial({
            color: darkWoodColor,
            roughness: 0.95
          });
          const plank = new THREE.Mesh(plankGeometry, plankMaterial);
          plank.position.set((x + nextX) / 2, height, (z + nextZ) / 2);
          plank.rotation.y = plankAngle;
          plank.castShadow = true;
          scene.add(plank);
        });
      }
      
      // Add bushes along inside of fence (every 3rd post)
      if (i % 3 === 0) {
        // Calculate inward direction
        let bushX, bushZ;
        const bushOffset = 3;
        
        if (sideIndex === 0) { // North side - bushes go south (positive z)
          bushX = x;
          bushZ = z + bushOffset;
        } else if (sideIndex === 1) { // East side - bushes go west (negative x)
          bushX = x - bushOffset;
          bushZ = z;
        } else if (sideIndex === 2) { // South side - bushes go north (negative z)
          bushX = x;
          bushZ = z - bushOffset;
        } else { // West side - bushes go east (positive x)
          bushX = x + bushOffset;
          bushZ = z;
        }
        
        // Skip bushes at entrance
        if (sideIndex === 2 && bushZ > entranceZ - 8 && Math.abs(bushX) < entranceWidth + 5) {
          continue;
        }
        
        // Skip bushes that overlap with pond
        const distToPond = Math.sqrt((bushX - pondCenter.x) ** 2 + (bushZ - pondCenter.z) ** 2);
        if (distToPond < pondRadius + 3) {
          continue;
        }
        
        createFenceBush(scene, bushX, bushZ);
      }
    }
  });
}

/**
 * Create a decorative bush along the fence
 */
function createFenceBush(scene, x, z) {
  // Main bush body
  const bushGeometry = new THREE.SphereGeometry(0.7, 8, 8);
  const bushMaterial = new THREE.MeshStandardMaterial({
    color: 0x4A7C3B,
    roughness: 0.95
  });
  const bush = new THREE.Mesh(bushGeometry, bushMaterial);
  bush.position.set(x, 0.5, z);
  bush.scale.set(1, 0.8, 1);
  bush.castShadow = true;
  scene.add(bush);
  
  // Add smaller bush clusters for fuller look
  const clusterOffsets = [
    { x: 0.4, y: 0.3, z: 0.3, scale: 0.5 },
    { x: -0.3, y: 0.3, z: 0.4, scale: 0.5 },
    { x: 0.2, y: 0.6, z: -0.3, scale: 0.4 }
  ];
  
  clusterOffsets.forEach(offset => {
    const smallBushGeometry = new THREE.SphereGeometry(0.4, 6, 6);
    const smallBushMaterial = new THREE.MeshStandardMaterial({
      color: 0x568F47,
      roughness: 0.95
    });
    const smallBush = new THREE.Mesh(smallBushGeometry, smallBushMaterial);
    smallBush.position.set(x + offset.x, offset.y, z + offset.z);
    smallBush.scale.setScalar(offset.scale);
    smallBush.castShadow = true;
    scene.add(smallBush);
  });
}

/**
 * Setup lighting for the scene
 */
export function setupLighting(scene) {
  // Ambient light for overall illumination
  const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.6);
  scene.add(ambientLight);
  
  // Directional light (sun) with shadows
  const directionalLight = new THREE.DirectionalLight(0xFFF8DC, 0.8);
  directionalLight.position.set(80, 80, 80);
  directionalLight.castShadow = CONFIG.ENABLE_SHADOWS;
  
  if (CONFIG.ENABLE_SHADOWS) {
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 300;
    directionalLight.shadow.camera.left = -100;
    directionalLight.shadow.camera.right = 100;
    directionalLight.shadow.camera.top = 100;
    directionalLight.shadow.camera.bottom = -100;
    directionalLight.shadow.bias = -0.001;
  }
  
  scene.add(directionalLight);
  
  // Hemisphere light for sky color
  const hemisphereLight = new THREE.HemisphereLight(0x87CEEB, 0x90EE90, 0.3);
  scene.add(hemisphereLight);
  
  // Fog for depth - extended range for larger zoo
  if (CONFIG.ENABLE_FOG) {
    scene.fog = new THREE.Fog(CONFIG.COLORS.fog, 80, 200);
  }
}
