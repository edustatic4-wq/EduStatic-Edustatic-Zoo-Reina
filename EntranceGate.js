import * as THREE from 'three';

/**
 * Creates the grand zoo entrance gate area at the south (starting area)
 */
export function createEntranceGate(scene) {
  const textureLoader = new THREE.TextureLoader();
  const entranceZ = 55; // South entrance of rectangular zoo
  
  createCobblePlaza(scene, textureLoader, entranceZ);
  createWoodenArchway(scene, textureLoader, 0, entranceZ - 5);
  createZooSign(scene, textureLoader, 0, entranceZ - 5);
  createStonePillarWithStatue(scene, textureLoader, -8, entranceZ - 5, 'lion');
  createStonePillarWithStatue(scene, textureLoader, 8, entranceZ - 5, 'elephant');
  createBuntingFlags(scene, textureLoader, entranceZ);
  createTicketBooth(scene, textureLoader, -15, entranceZ + 5);
  createEntranceGardens(scene, textureLoader, entranceZ);
  createWelcomeBanner(scene, 0, entranceZ + 2);
  createFountain(scene, textureLoader, 0, entranceZ + 15);
  createZooMapBoard(scene, textureLoader, 12, entranceZ + 8);
  createFloatingBalloons(scene, textureLoader, entranceZ);
}

function createCobblePlaza(scene, textureLoader, entranceZ) {
  const plazaTexture = textureLoader.load('https://play.rosebud.ai/assets/cobblestone-plaza-texture.webp?udLM');
  plazaTexture.wrapS = plazaTexture.wrapT = THREE.RepeatWrapping;
  plazaTexture.repeat.set(4, 4);
  
  const plazaGeometry = new THREE.CircleGeometry(25, 64);
  const plazaMaterial = new THREE.MeshStandardMaterial({ 
    map: plazaTexture,
    roughness: 0.9,
    metalness: 0.0
  });
  
  const plaza = new THREE.Mesh(plazaGeometry, plazaMaterial);
  plaza.rotation.x = -Math.PI / 2;
  plaza.position.set(0, 0.04, entranceZ);
  plaza.receiveShadow = true;
  scene.add(plaza);
}

function createWoodenArchway(scene, textureLoader, x, z) {
  const archwayTexture = textureLoader.load('https://play.rosebud.ai/assets/wooden-archway-gate.webp?NWjd');
  
  const spriteMaterial = new THREE.SpriteMaterial({ 
    map: archwayTexture,
    transparent: true
  });
  
  const archway = new THREE.Sprite(spriteMaterial);
  archway.position.set(x, 6, z);
  archway.scale.set(12, 14, 1);
  scene.add(archway);
  
  const lightPositions = [
    { x: -4, y: 9, z: z + 1 },
    { x: -2, y: 9.5, z: z + 1 },
    { x: 0, y: 10, z: z + 1 },
    { x: 2, y: 9.5, z: z + 1 },
    { x: 4, y: 9, z: z + 1 }
  ];
  
  lightPositions.forEach(pos => {
    const light = new THREE.PointLight(0xFFE87C, 0.5, 8);
    light.position.set(pos.x, pos.y, pos.z);
    scene.add(light);
  });
}

function createZooSign(scene, textureLoader, x, z) {
  const signTexture = textureLoader.load('https://play.rosebud.ai/assets/zoo-sign-edustatic.webp.webp?ZDv9');
  
  const spriteMaterial = new THREE.SpriteMaterial({ 
    map: signTexture,
    transparent: true
  });
  
  const sign = new THREE.Sprite(spriteMaterial);
  sign.position.set(x, 11, z);
  sign.scale.set(14, 6, 1);
  scene.add(sign);
}

function createStonePillarWithStatue(scene, textureLoader, x, z, animalType) {
  const pillarGeometry = new THREE.CylinderGeometry(1.2, 1.5, 8, 16);
  const pillarMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x9E9E9E,
    roughness: 0.95,
    metalness: 0.0
  });
  
  const pillar = new THREE.Mesh(pillarGeometry, pillarMaterial);
  pillar.position.set(x, 4, z);
  pillar.castShadow = true;
  scene.add(pillar);
  
  const capGeometry = new THREE.CylinderGeometry(1.8, 1.5, 0.6, 16);
  const capMaterial = new THREE.MeshStandardMaterial({ 
    color: 0xB0B0B0,
    roughness: 0.9
  });
  
  const cap = new THREE.Mesh(capGeometry, capMaterial);
  cap.position.set(x, 8.3, z);
  cap.castShadow = true;
  scene.add(cap);
  
  const statueUrl = animalType === 'lion' 
    ? 'https://play.rosebud.ai/assets/lion-statue.webp.webp?2TKE'
    : 'https://play.rosebud.ai/assets/elephant-statue.webp.webp?1aH1';
  
  const statueTexture = textureLoader.load(statueUrl);
  const statueMaterial = new THREE.SpriteMaterial({ 
    map: statueTexture,
    transparent: true
  });
  
  const statue = new THREE.Sprite(statueMaterial);
  statue.position.set(x, 10.5, z);
  statue.scale.set(3, 5, 1);
  scene.add(statue);
}

function createBuntingFlags(scene, textureLoader, entranceZ) {
  const buntingTexture = textureLoader.load('https://play.rosebud.ai/assets/bunting-flags.webp.webp?2Fq7');
  
  const positions = [
    { x: 0, y: 10, z: entranceZ - 10, scaleX: 20 },
    { x: -10, y: 8, z: entranceZ, scaleX: 12, rotation: Math.PI / 6 },
    { x: 10, y: 8, z: entranceZ, scaleX: 12, rotation: -Math.PI / 6 }
  ];
  
  positions.forEach(pos => {
    const spriteMaterial = new THREE.SpriteMaterial({ 
      map: buntingTexture.clone(),
      transparent: true
    });
    
    const bunting = new THREE.Sprite(spriteMaterial);
    bunting.position.set(pos.x, pos.y, pos.z);
    bunting.scale.set(pos.scaleX, 3, 1);
    if (pos.rotation) bunting.rotation.z = pos.rotation;
    scene.add(bunting);
  });
}

function createTicketBooth(scene, textureLoader, x, z) {
  const boothTexture = textureLoader.load('https://play.rosebud.ai/assets/ticket-booth.webp.webp?CniW');
  
  const spriteMaterial = new THREE.SpriteMaterial({ 
    map: boothTexture,
    transparent: true
  });
  
  const booth = new THREE.Sprite(spriteMaterial);
  booth.position.set(x, 3, z);
  booth.scale.set(6, 6, 1);
  scene.add(booth);
  
  const attendantTexture = textureLoader.load('https://play.rosebud.ai/assets/attendant-sprite.webp.webp?4ntt');
  
  const attendantMaterial = new THREE.SpriteMaterial({ 
    map: attendantTexture,
    transparent: true
  });
  
  const attendant = new THREE.Sprite(attendantMaterial);
  attendant.position.set(x + 2, 2, z + 2);
  attendant.scale.set(2, 3, 1);
  scene.add(attendant);
}

function createEntranceGardens(scene, textureLoader, entranceZ) {
  const tulipTexture = textureLoader.load('https://play.rosebud.ai/assets/tulip-flower.webp.webp?cSix');
  const roseTexture = textureLoader.load('https://play.rosebud.ai/assets/rose-flower.webp.webp?dIoC');
  const sunflowerTexture = textureLoader.load('https://play.rosebud.ai/assets/sunflower-sprite.webp.webp?QEIZ');
  
  const textures = [tulipTexture, roseTexture, sunflowerTexture];
  
  createGardenBed(scene, textureLoader, -20, entranceZ - 2, textures);
  createGardenBed(scene, textureLoader, 20, entranceZ - 2, textures);
  
  const elephantHedge = textureLoader.load('https://play.rosebud.ai/assets/animal-hedge-elephant.webp?U1F1');
  const lionHedge = textureLoader.load('https://play.rosebud.ai/assets/animal-hedge-lion.webp?93P8');
  
  const elephantMaterial = new THREE.SpriteMaterial({ 
    map: elephantHedge,
    transparent: true
  });
  const elephantTopiary = new THREE.Sprite(elephantMaterial);
  elephantTopiary.position.set(-18, 2, entranceZ + 5);
  elephantTopiary.scale.set(4, 4, 1);
  scene.add(elephantTopiary);
  
  const lionMaterial = new THREE.SpriteMaterial({ 
    map: lionHedge,
    transparent: true
  });
  const lionTopiary = new THREE.Sprite(lionMaterial);
  lionTopiary.position.set(18, 2, entranceZ + 5);
  lionTopiary.scale.set(3.5, 4, 1);
  scene.add(lionTopiary);
}

function createGardenBed(scene, textureLoader, centerX, centerZ, flowerTextures) {
  const bedGeometry = new THREE.BoxGeometry(8, 0.3, 10);
  const bedMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x8B6F47,
    roughness: 0.95
  });
  
  const bed = new THREE.Mesh(bedGeometry, bedMaterial);
  bed.position.set(centerX, 0.15, centerZ);
  bed.receiveShadow = true;
  scene.add(bed);
  
  for (let i = 0; i < 20; i++) {
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * 4;
    const x = centerX + Math.cos(angle) * distance;
    const z = centerZ + Math.sin(angle) * distance;
    
    const randomTexture = flowerTextures[Math.floor(Math.random() * flowerTextures.length)];
    const flowerMaterial = new THREE.SpriteMaterial({ 
      map: randomTexture,
      transparent: true
    });
    
    const flower = new THREE.Sprite(flowerMaterial);
    flower.position.set(x, 0.6, z);
    flower.scale.set(0.8, 0.8, 1);
    scene.add(flower);
  }
}

function createWelcomeBanner(scene, x, z) {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  
  ctx.fillStyle = '#FFE5B4';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  ctx.strokeStyle = '#FF6B9D';
  ctx.lineWidth = 10;
  ctx.strokeRect(5, 5, canvas.width - 10, canvas.height - 10);
  
  ctx.font = 'bold 80px Comic Sans MS, cursive';
  ctx.fillStyle = '#FF6B9D';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('Welcome Little Explorers!', canvas.width / 2, canvas.height / 2);
  
  ctx.fillStyle = '#FFD700';
  ctx.font = '60px Arial';
  ctx.fillText('✨', 100, 128);
  ctx.fillText('✨', canvas.width - 100, 128);
  
  const texture = new THREE.CanvasTexture(canvas);
  const bannerMaterial = new THREE.SpriteMaterial({ 
    map: texture,
    transparent: true
  });
  
  const banner = new THREE.Sprite(bannerMaterial);
  banner.position.set(x, 12, z);
  banner.scale.set(16, 4, 1);
  scene.add(banner);
}

function createFountain(scene, textureLoader, x, z) {
  const fountainTexture = textureLoader.load('https://play.rosebud.ai/assets/decorative-fountain.webp?1a7O');
  
  const spriteMaterial = new THREE.SpriteMaterial({ 
    map: fountainTexture,
    transparent: true
  });
  
  const fountain = new THREE.Sprite(spriteMaterial);
  fountain.position.set(x, 3, z);
  fountain.scale.set(6, 7, 1);
  scene.add(fountain);
  
  const waterLight = new THREE.PointLight(0x87CEEB, 0.3, 10);
  waterLight.position.set(x, 3, z);
  scene.add(waterLight);
}

function createZooMapBoard(scene, textureLoader, x, z) {
  const frameGeometry = new THREE.BoxGeometry(8, 6, 0.3);
  const frameMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x8B4513,
    roughness: 0.9
  });
  
  const frame = new THREE.Mesh(frameGeometry, frameMaterial);
  frame.position.set(x, 3, z);
  frame.castShadow = true;
  scene.add(frame);
  
  const mapTexture = textureLoader.load('https://play.rosebud.ai/assets/zoo-map-board.webp.webp?cVTj');
  
  const mapMaterial = new THREE.SpriteMaterial({ 
    map: mapTexture,
    transparent: true
  });
  
  const mapBoard = new THREE.Sprite(mapMaterial);
  mapBoard.position.set(x, 3, z + 0.2);
  mapBoard.scale.set(7, 5.5, 1);
  scene.add(mapBoard);
  
  const postGeometry = new THREE.CylinderGeometry(0.2, 0.2, 4, 8);
  const postMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x8B4513,
    roughness: 0.9
  });
  
  const post = new THREE.Mesh(postGeometry, postMaterial);
  post.position.set(x, 1, z);
  post.castShadow = true;
  scene.add(post);
}

function createFloatingBalloons(scene, textureLoader, entranceZ) {
  const balloonTextures = [
    textureLoader.load('https://play.rosebud.ai/assets/balloon-sprite-red.webp?7uvI'),
    textureLoader.load('https://play.rosebud.ai/assets/balloon-sprite-blue.webp?D8BG'),
    textureLoader.load('https://play.rosebud.ai/assets/balloon-sprite-yellow.webp?R0h0')
  ];
  
  const balloonPositions = [
    { x: -12, z: entranceZ - 8 },
    { x: 12, z: entranceZ - 8 },
    { x: -20, z: entranceZ + 10 },
    { x: 20, z: entranceZ + 10 },
    { x: 0, z: entranceZ + 18 }
  ];
  
  const balloons = [];
  
  balloonPositions.forEach((pos, index) => {
    const texture = balloonTextures[index % balloonTextures.length];
    const balloonMaterial = new THREE.SpriteMaterial({ 
      map: texture,
      transparent: true
    });
    
    const balloon = new THREE.Sprite(balloonMaterial);
    balloon.position.set(pos.x, 5 + Math.random() * 2, pos.z);
    balloon.scale.set(1.5, 2, 1);
    
    balloon.userData = {
      initialY: balloon.position.y,
      floatSpeed: 0.3 + Math.random() * 0.2,
      floatOffset: Math.random() * Math.PI * 2,
      swaySpeed: 0.5 + Math.random() * 0.3,
      swayAmount: 0.3 + Math.random() * 0.2
    };
    
    balloons.push(balloon);
    scene.add(balloon);
  });
  
  scene.userData.entranceBalloons = balloons;
}

export function animateEntranceBalloons(scene, deltaTime) {
  if (!scene.userData.entranceBalloons) return;
  
  const time = performance.now() * 0.001;
  
  scene.userData.entranceBalloons.forEach(balloon => {
    const data = balloon.userData;
    
    balloon.position.y = data.initialY + Math.sin(time * data.floatSpeed + data.floatOffset) * 0.5;
    balloon.position.x += Math.sin(time * data.swaySpeed) * data.swayAmount * deltaTime;
  });
}
