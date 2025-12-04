import * as THREE from 'three';

/**
 * Creates the Animal Academy Quiz Booth - a colorful 2D sprite entrance
 * at the center of the zoo with an owl mascot guide
 */
export function createQuizBooth(scene) {
  const textureLoader = new THREE.TextureLoader();
  const boothGroup = new THREE.Group();
  const boothPosition = { x: 0, z: -15 }; // Center of zoo, slightly north
  
  // Main 2D building sprite
  create2DBuilding(boothGroup, textureLoader);
  
  // 2D Owl mascot guide
  create2DOwlMascot(boothGroup, textureLoader);
  
  // Glowing lights around building
  createGlowingLights(boothGroup, scene);
  
  // Balloons decoration
  createBalloons(boothGroup);
  
  // Decorative flags
  createFlags(boothGroup);
  
  // Position the entire booth
  boothGroup.position.set(boothPosition.x, 0, boothPosition.z);
  scene.add(boothGroup);
  
  // Create path from main zoo path to booth entrance
  createBoothPath(scene, boothPosition, textureLoader);
  
  // Return references for animation
  return {
    group: boothGroup,
    lights: boothGroup.userData.lights || [],
    owl: boothGroup.userData.owl,
    balloons: boothGroup.userData.balloons || [],
    flags: boothGroup.userData.flags || []
  };
}

/**
 * Create 2D sprite building entrance
 */
function create2DBuilding(group, textureLoader) {
  // Load the Animal Academy entrance sprite
  const buildingTexture = textureLoader.load('https://play.rosebud.ai/assets/animal-academy-entrance.webp?Y6Za');
  
  const spriteMaterial = new THREE.SpriteMaterial({
    map: buildingTexture,
    transparent: true,
    alphaTest: 0.1
  });
  
  const buildingSprite = new THREE.Sprite(spriteMaterial);
  buildingSprite.scale.set(16, 12, 1); // Large building
  buildingSprite.position.set(0, 6, 0); // Center, raised up
  
  group.add(buildingSprite);
  group.userData.building = buildingSprite;
  
  // Add a ground shadow
  const shadowGeometry = new THREE.CircleGeometry(8, 32);
  const shadowMaterial = new THREE.MeshBasicMaterial({
    color: 0x000000,
    transparent: true,
    opacity: 0.3
  });
  const shadow = new THREE.Mesh(shadowGeometry, shadowMaterial);
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = 0.01;
  group.add(shadow);
}

/**
 * Create 2D owl mascot guide sprite
 */
function create2DOwlMascot(group, textureLoader) {
  // Load the owl mascot sprite
  const owlTexture = textureLoader.load('https://play.rosebud.ai/assets/owl-mascot-guide.webp?b9wg');
  
  const spriteMaterial = new THREE.SpriteMaterial({
    map: owlTexture,
    transparent: true,
    alphaTest: 0.1
  });
  
  const owlSprite = new THREE.Sprite(spriteMaterial);
  owlSprite.scale.set(3, 3.2, 1); // Friendly guide size
  owlSprite.position.set(5, 1.6, 5); // Right side of entrance, welcoming position
  
  group.add(owlSprite);
  
  // Store for animation
  group.userData.owl = {
    sprite: owlSprite,
    initialScale: { x: 3, y: 3.2, z: 1 },
    initialY: 1.6
  };
}

/**
 * OLD 3D BUILDING CODE - KEPT FOR REFERENCE BUT NOT USED
 */
function createMainBuilding_OLD(group, textureLoader) {
  const buildingWidth = 12;
  const buildingDepth = 10;
  const buildingHeight = 6;
  
  // Main walls - cute cottage colors
  const wallGeometry = new THREE.BoxGeometry(buildingWidth, buildingHeight, buildingDepth);
  const wallMaterial = new THREE.MeshStandardMaterial({
    color: 0xFFE4B5, // Warm peachy cream
    roughness: 0.8
  });
  const walls = new THREE.Mesh(wallGeometry, wallMaterial);
  walls.position.y = buildingHeight / 2;
  walls.castShadow = true;
  walls.receiveShadow = true;
  group.add(walls);
  
  // Add colorful trim around base
  const trimGeometry = new THREE.BoxGeometry(buildingWidth + 0.2, 0.5, buildingDepth + 0.2);
  const trimMaterial = new THREE.MeshStandardMaterial({
    color: 0xFF69B4, // Hot pink trim
    roughness: 0.6
  });
  const trim = new THREE.Mesh(trimGeometry, trimMaterial);
  trim.position.y = 0.25;
  trim.castShadow = true;
  group.add(trim);
  
  // Add decorative corner posts
  const postGeometry = new THREE.BoxGeometry(0.4, buildingHeight + 1, 0.4);
  const postMaterial = new THREE.MeshStandardMaterial({
    color: 0x9370DB, // Purple posts
    roughness: 0.7
  });
  
  const cornerPositions = [
    { x: -buildingWidth/2, z: -buildingDepth/2 },
    { x: buildingWidth/2, z: -buildingDepth/2 },
    { x: -buildingWidth/2, z: buildingDepth/2 },
    { x: buildingWidth/2, z: buildingDepth/2 }
  ];
  
  cornerPositions.forEach(pos => {
    const post = new THREE.Mesh(postGeometry, postMaterial);
    post.position.set(pos.x, (buildingHeight + 1) / 2, pos.z);
    post.castShadow = true;
    group.add(post);
  });
}

/**
 * Create rainbow striped roof
 */
function createRainbowRoof(group) {
  const roofWidth = 14;
  const roofDepth = 11;
  const roofHeight = 3;
  
  // Create triangular roof shape
  const roofShape = new THREE.Shape();
  roofShape.moveTo(-roofWidth/2, 0);
  roofShape.lineTo(0, roofHeight);
  roofShape.lineTo(roofWidth/2, 0);
  roofShape.lineTo(-roofWidth/2, 0);
  
  const extrudeSettings = {
    depth: roofDepth,
    bevelEnabled: false
  };
  
  const roofGeometry = new THREE.ExtrudeGeometry(roofShape, extrudeSettings);
  
  // Rainbow gradient colors
  const rainbowColors = [
    0xFF0000, // Red
    0xFF7F00, // Orange
    0xFFFF00, // Yellow
    0x00FF00, // Green
    0x0000FF, // Blue
    0x4B0082, // Indigo
    0x9400D3  // Violet
  ];
  
  // Create multiple colored stripes
  rainbowColors.forEach((color, index) => {
    const stripeMaterial = new THREE.MeshStandardMaterial({
      color: color,
      roughness: 0.5,
      metalness: 0.2
    });
    
    const stripe = new THREE.Mesh(roofGeometry, stripeMaterial);
    stripe.rotation.x = Math.PI / 2;
    stripe.position.set(0, 6, -roofDepth/2 + (index * roofDepth / 7));
    stripe.scale.z = 1 / 7; // Make each stripe thin
    stripe.castShadow = true;
    group.add(stripe);
  });
}

/**
 * Create "Animal Academy" sign on top with stars
 */
function createTopSign(group, textureLoader) {
  // Sign board
  const signWidth = 10;
  const signHeight = 2;
  const signGeometry = new THREE.BoxGeometry(signWidth, signHeight, 0.3);
  const signMaterial = new THREE.MeshStandardMaterial({
    color: 0xFFD700, // Golden yellow
    roughness: 0.4,
    metalness: 0.3
  });
  const signBoard = new THREE.Mesh(signGeometry, signMaterial);
  signBoard.position.set(0, 10, 0);
  signBoard.castShadow = true;
  group.add(signBoard);
  
  // Sign border
  const borderGeometry = new THREE.BoxGeometry(signWidth + 0.3, signHeight + 0.3, 0.2);
  const borderMaterial = new THREE.MeshStandardMaterial({
    color: 0xFF1493, // Deep pink border
    roughness: 0.5
  });
  const border = new THREE.Mesh(borderGeometry, borderMaterial);
  border.position.set(0, 10, -0.15);
  border.castShadow = true;
  group.add(border);
  
  // Create text using canvas texture
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  
  // Background
  ctx.fillStyle = '#FFD700';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Text
  ctx.fillStyle = '#FF1493';
  ctx.font = 'bold 60px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('Animal Academy', canvas.width / 2, canvas.height / 2);
  
  const textTexture = new THREE.CanvasTexture(canvas);
  const textMaterial = new THREE.MeshBasicMaterial({
    map: textTexture,
    transparent: true
  });
  
  const textPlane = new THREE.Mesh(
    new THREE.PlaneGeometry(signWidth - 0.5, signHeight - 0.4),
    textMaterial
  );
  textPlane.position.set(0, 10, 0.16);
  group.add(textPlane);
  
  // Stars around the sign
  const starPositions = [
    { x: -6, y: 10.5, z: 0 },
    { x: -5, y: 11.5, z: 0 },
    { x: 6, y: 10.5, z: 0 },
    { x: 5, y: 11.5, z: 0 },
    { x: 0, y: 11.5, z: 0 }
  ];
  
  starPositions.forEach(pos => {
    const star = createStar();
    star.position.set(pos.x, pos.y, pos.z);
    star.scale.setScalar(0.5);
    group.add(star);
  });
}

/**
 * Create a star shape
 */
function createStar() {
  const starShape = new THREE.Shape();
  const outerRadius = 1;
  const innerRadius = 0.4;
  const points = 5;
  
  for (let i = 0; i < points * 2; i++) {
    const angle = (i * Math.PI) / points;
    const radius = i % 2 === 0 ? outerRadius : innerRadius;
    const x = Math.cos(angle - Math.PI / 2) * radius;
    const y = Math.sin(angle - Math.PI / 2) * radius;
    
    if (i === 0) {
      starShape.moveTo(x, y);
    } else {
      starShape.lineTo(x, y);
    }
  }
  starShape.closePath();
  
  const starGeometry = new THREE.ShapeGeometry(starShape);
  const starMaterial = new THREE.MeshStandardMaterial({
    color: 0xFFFF00, // Bright yellow
    roughness: 0.3,
    metalness: 0.5,
    emissive: 0xFFFF00,
    emissiveIntensity: 0.5
  });
  
  const star = new THREE.Mesh(starGeometry, starMaterial);
  return star;
}

/**
 * Create open entrance with welcoming doors
 */
function createEntrance(group) {
  const entranceWidth = 4;
  const entranceHeight = 4.5;
  
  // Door frame
  const frameGeometry = new THREE.BoxGeometry(entranceWidth + 0.6, entranceHeight + 0.4, 0.5);
  const frameMaterial = new THREE.MeshStandardMaterial({
    color: 0xFF6347, // Tomato red frame
    roughness: 0.7
  });
  const frame = new THREE.Mesh(frameGeometry, frameMaterial);
  frame.position.set(0, entranceHeight / 2, 5.1);
  frame.castShadow = true;
  group.add(frame);
  
  // Open doors (swung to sides)
  const doorWidth = entranceWidth / 2 - 0.2;
  const doorGeometry = new THREE.BoxGeometry(doorWidth, entranceHeight, 0.2);
  const doorMaterial = new THREE.MeshStandardMaterial({
    color: 0x4169E1, // Royal blue doors
    roughness: 0.6
  });
  
  // Left door (open to left)
  const leftDoor = new THREE.Mesh(doorGeometry, doorMaterial);
  leftDoor.position.set(-entranceWidth / 2, entranceHeight / 2, 5.5);
  leftDoor.rotation.y = Math.PI / 3; // Swung open
  leftDoor.castShadow = true;
  group.add(leftDoor);
  
  // Right door (open to right)
  const rightDoor = new THREE.Mesh(doorGeometry, doorMaterial);
  rightDoor.position.set(entranceWidth / 2, entranceHeight / 2, 5.5);
  rightDoor.rotation.y = -Math.PI / 3; // Swung open
  rightDoor.castShadow = true;
  group.add(rightDoor);
  
  // Welcome mat
  const matGeometry = new THREE.PlaneGeometry(entranceWidth + 1, 2);
  const matMaterial = new THREE.MeshStandardMaterial({
    color: 0xFF1493, // Hot pink mat
    roughness: 0.95
  });
  const mat = new THREE.Mesh(matGeometry, matMaterial);
  mat.rotation.x = -Math.PI / 2;
  mat.position.set(0, 0.02, 6.5);
  mat.receiveShadow = true;
  group.add(mat);
  
  // "WELCOME" on mat
  const matCanvas = document.createElement('canvas');
  matCanvas.width = 256;
  matCanvas.height = 128;
  const matCtx = matCanvas.getContext('2d');
  matCtx.fillStyle = '#FF1493';
  matCtx.fillRect(0, 0, matCanvas.width, matCanvas.height);
  matCtx.fillStyle = '#FFFFFF';
  matCtx.font = 'bold 50px Arial';
  matCtx.textAlign = 'center';
  matCtx.textBaseline = 'middle';
  matCtx.fillText('WELCOME!', matCanvas.width / 2, matCanvas.height / 2);
  
  const matTexture = new THREE.CanvasTexture(matCanvas);
  mat.material.map = matTexture;
  mat.material.needsUpdate = true;
}

/**
 * Create friendly owl mascot waving outside
 */
function createOwlMascot(group, textureLoader) {
  const owlGroup = new THREE.Group();
  
  // Owl body
  const bodyGeometry = new THREE.SphereGeometry(0.8, 16, 16);
  const bodyMaterial = new THREE.MeshStandardMaterial({
    color: 0x8B4513, // Brown
    roughness: 0.8
  });
  const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
  body.scale.set(1, 1.2, 1);
  body.position.y = 1.5;
  body.castShadow = true;
  owlGroup.add(body);
  
  // Owl head
  const headGeometry = new THREE.SphereGeometry(0.6, 16, 16);
  const headMaterial = new THREE.MeshStandardMaterial({
    color: 0xA0522D, // Lighter brown
    roughness: 0.7
  });
  const head = new THREE.Mesh(headGeometry, headMaterial);
  head.position.y = 2.5;
  head.castShadow = true;
  owlGroup.add(head);
  
  // Eyes (big and cute)
  const eyeGeometry = new THREE.SphereGeometry(0.25, 12, 12);
  const eyeWhiteMaterial = new THREE.MeshStandardMaterial({
    color: 0xFFFFFF,
    roughness: 0.3
  });
  
  const leftEye = new THREE.Mesh(eyeGeometry, eyeWhiteMaterial);
  leftEye.position.set(-0.25, 2.6, 0.5);
  leftEye.castShadow = true;
  owlGroup.add(leftEye);
  
  const rightEye = new THREE.Mesh(eyeGeometry, eyeWhiteMaterial);
  rightEye.position.set(0.25, 2.6, 0.5);
  rightEye.castShadow = true;
  owlGroup.add(rightEye);
  
  // Pupils
  const pupilGeometry = new THREE.SphereGeometry(0.12, 12, 12);
  const pupilMaterial = new THREE.MeshStandardMaterial({
    color: 0x000000,
    roughness: 0.3
  });
  
  const leftPupil = new THREE.Mesh(pupilGeometry, pupilMaterial);
  leftPupil.position.set(-0.25, 2.6, 0.7);
  owlGroup.add(leftPupil);
  
  const rightPupil = new THREE.Mesh(pupilGeometry, pupilMaterial);
  rightPupil.position.set(0.25, 2.6, 0.7);
  owlGroup.add(rightPupil);
  
  // Beak
  const beakGeometry = new THREE.ConeGeometry(0.15, 0.3, 8);
  const beakMaterial = new THREE.MeshStandardMaterial({
    color: 0xFFA500, // Orange
    roughness: 0.6
  });
  const beak = new THREE.Mesh(beakGeometry, beakMaterial);
  beak.rotation.x = Math.PI;
  beak.position.set(0, 2.3, 0.6);
  beak.castShadow = true;
  owlGroup.add(beak);
  
  // Wings (one waving)
  const wingGeometry = new THREE.SphereGeometry(0.4, 12, 12);
  const wingMaterial = new THREE.MeshStandardMaterial({
    color: 0x8B4513,
    roughness: 0.8
  });
  
  // Left wing (normal)
  const leftWing = new THREE.Mesh(wingGeometry, wingMaterial);
  leftWing.scale.set(0.6, 1.2, 0.4);
  leftWing.position.set(-0.9, 1.7, 0);
  leftWing.castShadow = true;
  owlGroup.add(leftWing);
  
  // Right wing (waving up)
  const rightWing = new THREE.Mesh(wingGeometry, wingMaterial);
  rightWing.scale.set(0.6, 1.2, 0.4);
  rightWing.position.set(1.2, 2.5, 0);
  rightWing.rotation.z = -Math.PI / 4; // Waving upward
  rightWing.castShadow = true;
  owlGroup.add(rightWing);
  
  // Feet
  const feetGeometry = new THREE.SphereGeometry(0.2, 12, 12);
  const feetMaterial = new THREE.MeshStandardMaterial({
    color: 0xFFA500,
    roughness: 0.8
  });
  
  const leftFoot = new THREE.Mesh(feetGeometry, feetMaterial);
  leftFoot.scale.set(1, 0.5, 1.2);
  leftFoot.position.set(-0.3, 0.5, 0);
  leftFoot.castShadow = true;
  owlGroup.add(leftFoot);
  
  const rightFoot = new THREE.Mesh(feetGeometry, feetMaterial);
  rightFoot.scale.set(1, 0.5, 1.2);
  rightFoot.position.set(0.3, 0.5, 0);
  rightFoot.castShadow = true;
  owlGroup.add(rightFoot);
  
  // Cute bowtie
  const bowtieGeometry = new THREE.BoxGeometry(0.6, 0.2, 0.2);
  const bowtieMaterial = new THREE.MeshStandardMaterial({
    color: 0xFF0000, // Red bowtie
    roughness: 0.4
  });
  const bowtie = new THREE.Mesh(bowtieGeometry, bowtieMaterial);
  bowtie.position.set(0, 1.2, 0.7);
  bowtie.castShadow = true;
  owlGroup.add(bowtie);
  
  // Position owl outside entrance
  owlGroup.position.set(3.5, 0, 7);
  owlGroup.rotation.y = -Math.PI / 6; // Facing slightly toward entrance
  group.add(owlGroup);
  
  // Store for animation
  group.userData.owl = {
    group: owlGroup,
    wing: rightWing,
    initialRotation: -Math.PI / 4
  };
}

/**
 * Create glowing lights around the building
 */
function createGlowingLights(group, scene) {
  const lights = [];
  
  // Light positions around building perimeter
  const lightPositions = [
    { x: -6.5, y: 3, z: 5 },
    { x: 6.5, y: 3, z: 5 },
    { x: -6.5, y: 3, z: -5 },
    { x: 6.5, y: 3, z: -5 },
    { x: 0, y: 3, z: -5.5 },
    { x: -4, y: 5, z: 5 },
    { x: 4, y: 5, z: 5 }
  ];
  
  const colors = [
    0xFF00FF, // Magenta
    0x00FFFF, // Cyan
    0xFFFF00, // Yellow
    0xFF0000, // Red
    0x00FF00, // Green
    0xFF00FF,
    0x00FFFF
  ];
  
  lightPositions.forEach((pos, index) => {
    // Light bulb
    const bulbGeometry = new THREE.SphereGeometry(0.2, 12, 12);
    const bulbMaterial = new THREE.MeshStandardMaterial({
      color: colors[index % colors.length],
      emissive: colors[index % colors.length],
      emissiveIntensity: 0.8,
      roughness: 0.2,
      metalness: 0.5
    });
    const bulb = new THREE.Mesh(bulbGeometry, bulbMaterial);
    bulb.position.set(pos.x, pos.y, pos.z);
    bulb.castShadow = true;
    group.add(bulb);
    
    // Point light for glow effect
    const pointLight = new THREE.PointLight(colors[index % colors.length], 1, 8);
    pointLight.position.set(pos.x, pos.y, pos.z);
    group.add(pointLight);
    
    lights.push({
      bulb: bulb,
      light: pointLight,
      color: colors[index % colors.length],
      phase: Math.random() * Math.PI * 2
    });
  });
  
  group.userData.lights = lights;
}

/**
 * Create decorative balloons
 */
function createBalloons(group) {
  const balloons = [];
  
  const balloonPositions = [
    { x: -7, y: 4, z: 4 },
    { x: 7, y: 4.5, z: 4 },
    { x: -5, y: 5, z: -5 },
    { x: 5, y: 4.8, z: -5 },
    { x: -3, y: 6, z: 5 },
    { x: 3, y: 6.2, z: 5 }
  ];
  
  const balloonColors = [
    0xFF0000, // Red
    0x0000FF, // Blue
    0xFFFF00, // Yellow
    0xFF00FF, // Magenta
    0x00FF00, // Green
    0xFF8800  // Orange
  ];
  
  balloonPositions.forEach((pos, index) => {
    const balloonGroup = new THREE.Group();
    
    // Balloon
    const balloonGeometry = new THREE.SphereGeometry(0.4, 12, 12);
    balloonGeometry.scale(1, 1.3, 1);
    const balloonMaterial = new THREE.MeshStandardMaterial({
      color: balloonColors[index],
      roughness: 0.3,
      metalness: 0.4
    });
    const balloon = new THREE.Mesh(balloonGeometry, balloonMaterial);
    balloon.castShadow = true;
    balloonGroup.add(balloon);
    
    // String
    const stringGeometry = new THREE.CylinderGeometry(0.02, 0.02, 2, 8);
    const stringMaterial = new THREE.MeshStandardMaterial({
      color: 0xFFFFFF,
      roughness: 0.8
    });
    const string = new THREE.Mesh(stringGeometry, stringMaterial);
    string.position.y = -1;
    balloonGroup.add(string);
    
    balloonGroup.position.set(pos.x, pos.y, pos.z);
    group.add(balloonGroup);
    
    balloons.push({
      group: balloonGroup,
      initialY: pos.y,
      phase: Math.random() * Math.PI * 2
    });
  });
  
  group.userData.balloons = balloons;
}

/**
 * Create decorative flags
 */
function createFlags(group) {
  const flags = [];
  const flagCount = 12;
  const radius = 8;
  
  for (let i = 0; i < flagCount; i++) {
    const angle = (i / flagCount) * Math.PI * 2;
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    
    // Flag pole
    const poleGeometry = new THREE.CylinderGeometry(0.05, 0.05, 4, 8);
    const poleMaterial = new THREE.MeshStandardMaterial({
      color: 0x8B4513,
      roughness: 0.8
    });
    const pole = new THREE.Mesh(poleGeometry, poleMaterial);
    pole.position.set(x, 2, z);
    pole.castShadow = true;
    group.add(pole);
    
    // Flag
    const flagColors = [0xFF0000, 0x00FF00, 0x0000FF, 0xFFFF00, 0xFF00FF, 0x00FFFF];
    const flagGeometry = new THREE.PlaneGeometry(0.8, 0.6);
    const flagMaterial = new THREE.MeshStandardMaterial({
      color: flagColors[i % flagColors.length],
      side: THREE.DoubleSide,
      roughness: 0.7
    });
    const flag = new THREE.Mesh(flagGeometry, flagMaterial);
    flag.position.set(x, 3.8, z);
    flag.rotation.y = -angle;
    flag.castShadow = true;
    group.add(flag);
    
    flags.push({
      flag: flag,
      angle: angle
    });
  }
  
  group.userData.flags = flags;
}

/**
 * Create windows with fun details
 */
function createWindows(group) {
  // Front windows (on either side of entrance)
  const windowPositions = [
    { x: -3.5, y: 3, z: 5.1 },
    { x: 3.5, y: 3, z: 5.1 }
  ];
  
  windowPositions.forEach(pos => {
    // Window frame
    const frameGeometry = new THREE.BoxGeometry(1.5, 1.8, 0.2);
    const frameMaterial = new THREE.MeshStandardMaterial({
      color: 0x4169E1, // Royal blue
      roughness: 0.6
    });
    const frame = new THREE.Mesh(frameGeometry, frameMaterial);
    frame.position.set(pos.x, pos.y, pos.z);
    frame.castShadow = true;
    group.add(frame);
    
    // Window pane (glass)
    const paneGeometry = new THREE.PlaneGeometry(1.3, 1.6);
    const paneMaterial = new THREE.MeshStandardMaterial({
      color: 0xADD8E6, // Light blue
      transparent: true,
      opacity: 0.6,
      roughness: 0.1,
      metalness: 0.5
    });
    const pane = new THREE.Mesh(paneGeometry, paneMaterial);
    pane.position.set(pos.x, pos.y, pos.z + 0.11);
    group.add(pane);
  });
}

/**
 * Create path from main zoo path to booth entrance
 */
function createBoothPath(scene, boothPosition, textureLoader) {
  // Path from center of zoo main path to booth entrance
  const pathTexture = textureLoader.load('https://play.rosebud.ai/assets/cartoon-path-animated.webp?sBsJ');
  pathTexture.wrapS = pathTexture.wrapT = THREE.RepeatWrapping;
  pathTexture.repeat.set(2, 4);
  
  const pathGeometry = new THREE.PlaneGeometry(4, 8);
  const pathMaterial = new THREE.MeshStandardMaterial({
    map: pathTexture,
    color: 0xFFB6C1, // Light pink tinted path
    roughness: 0.9,
    metalness: 0.0
  });
  
  const path = new THREE.Mesh(pathGeometry, pathMaterial);
  path.rotation.x = -Math.PI / 2;
  path.position.set(boothPosition.x, 0.02, boothPosition.z + 8);
  path.receiveShadow = true;
  scene.add(path);
}

/**
 * Animate the quiz booth - lights twinkling, owl bouncing, balloons bobbing, flags waving
 */
export function animateQuizBooth(boothData, deltaTime) {
  if (!boothData) return;
  
  const time = Date.now() * 0.001;
  
  // Animate twinkling lights
  if (boothData.lights) {
    boothData.lights.forEach(lightData => {
      const intensity = 0.5 + Math.sin(time * 2 + lightData.phase) * 0.5;
      lightData.light.intensity = intensity;
      lightData.bulb.material.emissiveIntensity = intensity;
    });
  }
  
  // Animate 2D owl sprite - gentle bounce and scale
  if (boothData.owl && boothData.owl.sprite) {
    const bounce = Math.sin(time * 2) * 0.15;
    boothData.owl.sprite.position.y = boothData.owl.initialY + bounce;
    
    // Gentle scale pulse (breathing effect)
    const scalePulse = Math.sin(time * 3) * 0.08;
    boothData.owl.sprite.scale.set(
      boothData.owl.initialScale.x + scalePulse,
      boothData.owl.initialScale.y + scalePulse,
      1
    );
  }
  
  // Animate balloons bobbing
  if (boothData.balloons) {
    boothData.balloons.forEach(balloonData => {
      const bob = Math.sin(time * 2 + balloonData.phase) * 0.3;
      balloonData.group.position.y = balloonData.initialY + bob;
    });
  }
  
  // Animate flags waving
  if (boothData.flags) {
    boothData.flags.forEach(flagData => {
      const wave = Math.sin(time * 4) * 0.1;
      flagData.flag.rotation.x = wave;
    });
  }
}
