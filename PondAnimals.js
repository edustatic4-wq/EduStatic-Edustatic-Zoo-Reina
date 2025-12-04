import * as THREE from 'three';

/**
 * Creates animated ducks and frogs for the pond
 */
export function createPondAnimals(scene) {
  const waterCenter = { x: 60, z: -40 };
  const pondRadius = 20;
  
  const ducks = [];
  const frogs = [];
  
  // Create 5 ducks swimming in the pond
  for (let i = 0; i < 5; i++) {
    const duck = createDuck(scene, waterCenter, pondRadius, i);
    ducks.push(duck);
  }
  
  // Create 8 frogs on lily pads
  for (let i = 0; i < 8; i++) {
    const frog = createFrog(scene, waterCenter, pondRadius, i);
    frogs.push(frog);
  }
  
  return { ducks, frogs };
}

/**
 * Create a 3D cartoon duck that swims in the pond
 */
function createDuck(scene, waterCenter, pondRadius, index) {
  const duckGroup = new THREE.Group();
  
  // Duck body (ellipsoid)
  const bodyGeometry = new THREE.SphereGeometry(0.5, 16, 16);
  bodyGeometry.scale(1, 0.8, 1.3); // Make it egg-shaped
  const bodyMaterial = new THREE.MeshStandardMaterial({ 
    color: 0xFFFFFF, // White duck body
    roughness: 0.7,
    metalness: 0.1
  });
  const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
  body.position.y = 0.3;
  body.castShadow = true;
  duckGroup.add(body);
  
  // Duck head
  const headGeometry = new THREE.SphereGeometry(0.3, 16, 16);
  const head = new THREE.Mesh(headGeometry, bodyMaterial);
  head.position.set(0, 0.6, 0.4);
  head.castShadow = true;
  duckGroup.add(head);
  
  // Duck beak (orange)
  const beakGeometry = new THREE.ConeGeometry(0.12, 0.25, 8);
  const beakMaterial = new THREE.MeshStandardMaterial({ 
    color: 0xFFA500,
    roughness: 0.8
  });
  const beak = new THREE.Mesh(beakGeometry, beakMaterial);
  beak.rotation.x = Math.PI / 2;
  beak.position.set(0, 0.6, 0.65);
  beak.castShadow = true;
  duckGroup.add(beak);
  
  // Eyes (black)
  const eyeMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x000000,
    roughness: 0.3
  });
  const eyeGeometry = new THREE.SphereGeometry(0.06, 8, 8);
  
  const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
  leftEye.position.set(-0.12, 0.65, 0.5);
  duckGroup.add(leftEye);
  
  const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
  rightEye.position.set(0.12, 0.65, 0.5);
  duckGroup.add(rightEye);
  
  // Wing bumps (simple spheres on sides)
  const wingGeometry = new THREE.SphereGeometry(0.25, 12, 12);
  wingGeometry.scale(0.6, 0.8, 1.2);
  
  const leftWing = new THREE.Mesh(wingGeometry, bodyMaterial);
  leftWing.position.set(-0.45, 0.25, 0);
  leftWing.castShadow = true;
  duckGroup.add(leftWing);
  
  const rightWing = new THREE.Mesh(wingGeometry, bodyMaterial);
  rightWing.position.set(0.45, 0.25, 0);
  rightWing.castShadow = true;
  duckGroup.add(rightWing);
  
  // Tail feathers (yellow accent)
  const tailGeometry = new THREE.ConeGeometry(0.15, 0.3, 6);
  const tailMaterial = new THREE.MeshStandardMaterial({ 
    color: 0xFFFF99,
    roughness: 0.8
  });
  const tail = new THREE.Mesh(tailGeometry, tailMaterial);
  tail.rotation.x = -Math.PI / 2;
  tail.position.set(0, 0.35, -0.6);
  tail.castShadow = true;
  duckGroup.add(tail);
  
  // Position in pond
  const angle = (index / 5) * Math.PI * 2;
  const radius = 8 + Math.random() * 8;
  duckGroup.position.set(
    waterCenter.x + Math.cos(angle) * radius,
    0,
    waterCenter.z + Math.sin(angle) * radius
  );
  
  // Store animation data
  duckGroup.userData = {
    waterCenter,
    pondRadius,
    angle: angle,
    radius: radius,
    speed: 0.15 + Math.random() * 0.1,
    bobPhase: Math.random() * Math.PI * 2,
    bobSpeed: 2 + Math.random()
  };
  
  scene.add(duckGroup);
  return duckGroup;
}

/**
 * Create a 3D cartoon frog on a lily pad
 */
function createFrog(scene, waterCenter, pondRadius, index) {
  const frogGroup = new THREE.Group();
  
  // Lily pad base (thicker, more 3D)
  const lilyPadGeometry = new THREE.CylinderGeometry(0.8, 0.85, 0.08, 16);
  const lilyPadMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x4CAF50,
    roughness: 0.8,
    metalness: 0.0
  });
  const lilyPad = new THREE.Mesh(lilyPadGeometry, lilyPadMaterial);
  lilyPad.position.y = 0.08;
  lilyPad.castShadow = true;
  frogGroup.add(lilyPad);
  
  // Lily pad notch (small cut-out)
  const notchGeometry = new THREE.BoxGeometry(0.3, 0.1, 0.1);
  const notch = new THREE.Mesh(notchGeometry, lilyPadMaterial);
  notch.position.set(0.7, 0.08, 0);
  frogGroup.add(notch);
  
  // Frog body (green ellipsoid)
  const bodyGeometry = new THREE.SphereGeometry(0.3, 16, 16);
  bodyGeometry.scale(1.2, 0.8, 1);
  const frogMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x66BB6A, // Bright green
    roughness: 0.6,
    metalness: 0.1
  });
  const body = new THREE.Mesh(bodyGeometry, frogMaterial);
  body.position.y = 0.3;
  body.castShadow = true;
  frogGroup.add(body);
  
  // Frog head (merged with body, just raised area)
  const headGeometry = new THREE.SphereGeometry(0.25, 16, 16);
  headGeometry.scale(1.1, 0.9, 0.8);
  const head = new THREE.Mesh(headGeometry, frogMaterial);
  head.position.set(0, 0.45, 0.1);
  head.castShadow = true;
  frogGroup.add(head);
  
  // Big cartoon eyes (white with black pupils)
  const eyeWhiteGeometry = new THREE.SphereGeometry(0.15, 12, 12);
  const eyeWhiteMaterial = new THREE.MeshStandardMaterial({ 
    color: 0xFFFFFF,
    roughness: 0.3
  });
  
  const leftEyeWhite = new THREE.Mesh(eyeWhiteGeometry, eyeWhiteMaterial);
  leftEyeWhite.position.set(-0.18, 0.6, 0.15);
  leftEyeWhite.scale.set(1, 1.2, 0.8);
  leftEyeWhite.castShadow = true;
  frogGroup.add(leftEyeWhite);
  
  const rightEyeWhite = new THREE.Mesh(eyeWhiteGeometry, eyeWhiteMaterial);
  rightEyeWhite.position.set(0.18, 0.6, 0.15);
  rightEyeWhite.scale.set(1, 1.2, 0.8);
  rightEyeWhite.castShadow = true;
  frogGroup.add(rightEyeWhite);
  
  // Black pupils
  const pupilGeometry = new THREE.SphereGeometry(0.08, 8, 8);
  const pupilMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x000000,
    roughness: 0.2
  });
  
  const leftPupil = new THREE.Mesh(pupilGeometry, pupilMaterial);
  leftPupil.position.set(-0.18, 0.62, 0.28);
  frogGroup.add(leftPupil);
  
  const rightPupil = new THREE.Mesh(pupilGeometry, pupilMaterial);
  rightPupil.position.set(0.18, 0.62, 0.28);
  frogGroup.add(rightPupil);
  
  // Front legs (small)
  const legGeometry = new THREE.SphereGeometry(0.1, 8, 8);
  legGeometry.scale(0.5, 1, 1.5);
  
  const frontLeftLeg = new THREE.Mesh(legGeometry, frogMaterial);
  frontLeftLeg.position.set(-0.25, 0.15, 0.25);
  frontLeftLeg.castShadow = true;
  frogGroup.add(frontLeftLeg);
  
  const frontRightLeg = new THREE.Mesh(legGeometry, frogMaterial);
  frontRightLeg.position.set(0.25, 0.15, 0.25);
  frontRightLeg.castShadow = true;
  frogGroup.add(frontRightLeg);
  
  // Back legs (folded, larger)
  const backLegGeometry = new THREE.SphereGeometry(0.15, 10, 10);
  backLegGeometry.scale(0.7, 1, 1.8);
  
  const backLeftLeg = new THREE.Mesh(backLegGeometry, frogMaterial);
  backLeftLeg.position.set(-0.35, 0.15, -0.15);
  backLeftLeg.rotation.y = -0.3;
  backLeftLeg.castShadow = true;
  frogGroup.add(backLeftLeg);
  
  const backRightLeg = new THREE.Mesh(backLegGeometry, frogMaterial);
  backRightLeg.position.set(0.35, 0.15, -0.15);
  backRightLeg.rotation.y = 0.3;
  backRightLeg.castShadow = true;
  frogGroup.add(backRightLeg);
  
  // Position in pond
  const angle = (index / 8) * Math.PI * 2 + Math.random() * 0.5;
  const radius = 6 + Math.random() * 10;
  frogGroup.position.set(
    waterCenter.x + Math.cos(angle) * radius,
    0,
    waterCenter.z + Math.sin(angle) * radius
  );
  
  // Store animation data
  frogGroup.userData = {
    bobPhase: Math.random() * Math.PI * 2,
    bobSpeed: 1.5 + Math.random() * 0.5,
    jumpTimer: Math.random() * 5,
    jumpCooldown: 3 + Math.random() * 3,
    isJumping: false,
    jumpProgress: 0
  };
  
  scene.add(frogGroup);
  return frogGroup;
}

/**
 * Animate ducks and frogs
 */
export function animatePondAnimals(ducks, frogs, deltaTime) {
  // Animate ducks swimming in circles
  ducks.forEach(duck => {
    const userData = duck.userData;
    
    // Update angle for circular swimming
    userData.angle += userData.speed * deltaTime;
    
    // Update position
    duck.position.x = userData.waterCenter.x + Math.cos(userData.angle) * userData.radius;
    duck.position.z = userData.waterCenter.z + Math.sin(userData.angle) * userData.radius;
    
    // Bob up and down
    userData.bobPhase += userData.bobSpeed * deltaTime;
    duck.position.y = Math.sin(userData.bobPhase) * 0.08;
    
    // Face direction of movement
    duck.rotation.y = -userData.angle + Math.PI / 2;
    
    // Subtle head bobbing animation
    if (duck.children[1]) { // Head is second child
      duck.children[1].position.y = 0.6 + Math.sin(userData.bobPhase * 2) * 0.02;
    }
    
    // Wing flutter (slight scale animation)
    if (duck.children[6] && duck.children[7]) { // Wings
      const flutter = Math.sin(userData.bobPhase * 4) * 0.1 + 1;
      duck.children[6].scale.y = flutter;
      duck.children[7].scale.y = flutter;
    }
  });
  
  // Animate frogs
  frogs.forEach(frog => {
    const userData = frog.userData;
    
    if (!userData.isJumping) {
      // Gentle bobbing on lily pad
      userData.bobPhase += userData.bobSpeed * deltaTime;
      frog.position.y = Math.sin(userData.bobPhase) * 0.03;
      
      // Breathing animation (body scale)
      if (frog.children[2]) { // Body
        const breathe = Math.sin(userData.bobPhase * 1.5) * 0.05 + 1;
        frog.children[2].scale.y = breathe;
      }
      
      // Eye blink (random)
      if (Math.random() < 0.01) {
        if (frog.children[4] && frog.children[5]) { // Eye whites
          frog.children[4].scale.y = 0.1;
          frog.children[5].scale.y = 0.1;
          setTimeout(() => {
            frog.children[4].scale.y = 1.2;
            frog.children[5].scale.y = 1.2;
          }, 100);
        }
      }
      
      // Check if time to jump
      userData.jumpTimer -= deltaTime;
      if (userData.jumpTimer <= 0) {
        userData.isJumping = true;
        userData.jumpProgress = 0;
        userData.jumpTimer = userData.jumpCooldown;
      }
    } else {
      // Jumping animation
      userData.jumpProgress += deltaTime * 3;
      
      if (userData.jumpProgress < 1) {
        // Arc jump - animate body (child index 2)
        const jumpHeight = Math.sin(userData.jumpProgress * Math.PI) * 0.8;
        
        // Move entire frog up
        frog.position.y = jumpHeight;
        
        // Slight forward tilt during jump
        frog.rotation.x = Math.sin(userData.jumpProgress * Math.PI) * 0.4 - 0.2;
        
        // Stretch body during jump
        if (frog.children[2]) {
          frog.children[2].scale.y = 0.8 + Math.sin(userData.jumpProgress * Math.PI) * 0.3;
        }
      } else {
        // Land
        userData.isJumping = false;
        frog.position.y = 0;
        frog.rotation.x = 0;
        if (frog.children[2]) {
          frog.children[2].scale.y = 1;
        }
      }
    }
  });
}

/**
 * Get pond center and radius for fence calculation
 */
export function getPondBounds() {
  return {
    center: { x: 60, z: -40 },
    radius: 20
  };
}
