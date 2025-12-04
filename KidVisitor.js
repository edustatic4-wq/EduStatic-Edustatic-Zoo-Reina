import * as THREE from 'three';
import { CONFIG } from './config.js';

/**
 * Creates a cute 3D cartoon kid character
 * @param {Object} options - Kid configuration options
 * @param {string} options.type - 'boy' or 'girl'
 * @returns {THREE.Group} Kid character group
 */
export function createKidVisitor(options = {}) {
  const kid = new THREE.Group();
  const isBoy = options.type === 'boy';
  
  // Colors
  const skinColor = 0xFFDBB5; // Peachy skin
  const shirtColor = isBoy ? 0x4A90E2 : 0xFFB6D9; // Blue for boy, pink for girl
  const pantsColor = isBoy ? 0x8B6F47 : 0xFFB6D9; // Brown shorts for boy, pink dress for girl
  const hatColor = 0xFF0000; // Red baseball cap for boy
  const hairColor = 0x654321; // Brown hair
  const ribbonColor = 0xFFD700; // Yellow ribbons for girl
  
  // Head (slightly bigger for cute proportions)
  const headGeometry = new THREE.SphereGeometry(0.4, 16, 16);
  const headMaterial = new THREE.MeshStandardMaterial({ 
    color: skinColor,
    roughness: 0.7
  });
  const head = new THREE.Mesh(headGeometry, headMaterial);
  head.position.y = 1.4;
  head.castShadow = true;
  kid.add(head);
  
  // Boy: Baseball cap
  if (isBoy) {
    // Cap brim
    const brimGeometry = new THREE.CylinderGeometry(0.5, 0.5, 0.05, 16);
    const capMaterial = new THREE.MeshStandardMaterial({ 
      color: hatColor,
      roughness: 0.9
    });
    const brim = new THREE.Mesh(brimGeometry, capMaterial);
    brim.position.y = 1.75;
    brim.castShadow = true;
    kid.add(brim);
    
    // Cap top
    const capTopGeometry = new THREE.SphereGeometry(0.35, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const capTop = new THREE.Mesh(capTopGeometry, capMaterial);
    capTop.position.y = 1.75;
    capTop.castShadow = true;
    kid.add(capTop);
  }
  
  // Girl: Pigtails with ribbons
  if (!isBoy) {
    // Hair base
    const hairGeometry = new THREE.SphereGeometry(0.42, 16, 16);
    const hairMaterial = new THREE.MeshStandardMaterial({ 
      color: hairColor,
      roughness: 0.9
    });
    const hair = new THREE.Mesh(hairGeometry, hairMaterial);
    hair.position.y = 1.45;
    hair.scale.set(1, 0.8, 1);
    hair.castShadow = true;
    kid.add(hair);
    
    // Pigtails
    const pigtailGeometry = new THREE.SphereGeometry(0.2, 12, 12);
    const leftPigtail = new THREE.Mesh(pigtailGeometry, hairMaterial);
    leftPigtail.position.set(-0.45, 1.5, 0);
    leftPigtail.castShadow = true;
    kid.add(leftPigtail);
    
    const rightPigtail = new THREE.Mesh(pigtailGeometry, hairMaterial);
    rightPigtail.position.set(0.45, 1.5, 0);
    rightPigtail.castShadow = true;
    kid.add(rightPigtail);
    
    // Ribbons
    const ribbonGeometry = new THREE.BoxGeometry(0.15, 0.08, 0.02);
    const ribbonMaterial = new THREE.MeshStandardMaterial({ 
      color: ribbonColor,
      roughness: 0.5
    });
    const leftRibbon = new THREE.Mesh(ribbonGeometry, ribbonMaterial);
    leftRibbon.position.set(-0.45, 1.6, 0);
    leftRibbon.castShadow = true;
    kid.add(leftRibbon);
    
    const rightRibbon = new THREE.Mesh(ribbonGeometry, ribbonMaterial);
    rightRibbon.position.set(0.45, 1.6, 0);
    rightRibbon.castShadow = true;
    kid.add(rightRibbon);
    
    kid.userData.pigtails = [leftPigtail, rightPigtail];
  }
  
  // Eyes (big cute eyes)
  const eyeGeometry = new THREE.SphereGeometry(0.08, 8, 8);
  const eyeWhiteMaterial = new THREE.MeshStandardMaterial({ 
    color: 0xFFFFFF,
    roughness: 0.3
  });
  const eyePupilMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x000000,
    roughness: 0.2
  });
  
  // Left eye
  const leftEyeWhite = new THREE.Mesh(eyeGeometry, eyeWhiteMaterial);
  leftEyeWhite.position.set(-0.15, 1.45, 0.3);
  leftEyeWhite.scale.set(1, 1, 0.5);
  kid.add(leftEyeWhite);
  
  const leftPupil = new THREE.Mesh(new THREE.SphereGeometry(0.04, 8, 8), eyePupilMaterial);
  leftPupil.position.set(-0.15, 1.45, 0.36);
  kid.add(leftPupil);
  
  // Right eye
  const rightEyeWhite = new THREE.Mesh(eyeGeometry, eyeWhiteMaterial);
  rightEyeWhite.position.set(0.15, 1.45, 0.3);
  rightEyeWhite.scale.set(1, 1, 0.5);
  kid.add(rightEyeWhite);
  
  const rightPupil = new THREE.Mesh(new THREE.SphereGeometry(0.04, 8, 8), eyePupilMaterial);
  rightPupil.position.set(0.15, 1.45, 0.36);
  kid.add(rightPupil);
  
  // Smile
  const smileGeometry = new THREE.TorusGeometry(0.15, 0.02, 8, 16, Math.PI);
  const smileMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x8B4513,
    roughness: 0.8
  });
  const smile = new THREE.Mesh(smileGeometry, smileMaterial);
  smile.position.set(0, 1.3, 0.35);
  smile.rotation.x = Math.PI;
  kid.add(smile);
  
  // Body
  const bodyGeometry = isBoy 
    ? new THREE.CapsuleGeometry(0.3, 0.5, 4, 8) // Shorter for boy with shorts
    : new THREE.CapsuleGeometry(0.32, 0.7, 4, 8); // Dress shape for girl
  const bodyMaterial = new THREE.MeshStandardMaterial({ 
    color: shirtColor,
    roughness: 0.8
  });
  const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
  body.position.y = 0.8;
  body.castShadow = true;
  kid.add(body);
  
  // Boy: Shorts (separate from shirt)
  if (isBoy) {
    const shortsGeometry = new THREE.CapsuleGeometry(0.31, 0.25, 4, 8);
    const shortsMaterial = new THREE.MeshStandardMaterial({ 
      color: pantsColor,
      roughness: 0.9
    });
    const shorts = new THREE.Mesh(shortsGeometry, shortsMaterial);
    shorts.position.y = 0.45;
    shorts.castShadow = true;
    kid.add(shorts);
  }
  
  // Arms
  const armGeometry = new THREE.CapsuleGeometry(0.1, 0.4, 4, 8);
  const armMaterial = new THREE.MeshStandardMaterial({ 
    color: skinColor,
    roughness: 0.7
  });
  
  // Left arm
  const leftArm = new THREE.Mesh(armGeometry, armMaterial);
  leftArm.position.set(-0.38, 0.85, 0);
  leftArm.rotation.z = 0.3;
  leftArm.castShadow = true;
  kid.add(leftArm);
  
  // Right arm
  const rightArm = new THREE.Mesh(armGeometry, armMaterial);
  rightArm.position.set(0.38, 0.85, 0);
  rightArm.rotation.z = -0.3;
  rightArm.castShadow = true;
  kid.add(rightArm);
  
  // Legs
  const legGeometry = new THREE.CapsuleGeometry(0.12, 0.45, 4, 8);
  const legMaterial = new THREE.MeshStandardMaterial({ 
    color: skinColor,
    roughness: 0.7
  });
  
  // Left leg
  const leftLeg = new THREE.Mesh(legGeometry, legMaterial);
  leftLeg.position.set(-0.15, 0.25, 0);
  leftLeg.castShadow = true;
  kid.add(leftLeg);
  
  // Right leg
  const rightLeg = new THREE.Mesh(legGeometry, legMaterial);
  rightLeg.position.set(0.15, 0.25, 0);
  rightLeg.castShadow = true;
  kid.add(rightLeg);
  
  // Boy: Camera (held in hand)
  if (isBoy) {
    const cameraGroup = new THREE.Group();
    
    // Camera body
    const cameraBodyGeometry = new THREE.BoxGeometry(0.15, 0.12, 0.08);
    const cameraMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x333333,
      roughness: 0.4,
      metalness: 0.5
    });
    const cameraBody = new THREE.Mesh(cameraBodyGeometry, cameraMaterial);
    cameraGroup.add(cameraBody);
    
    // Lens
    const lensGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.04, 16);
    const lensMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x111111,
      roughness: 0.2,
      metalness: 0.8
    });
    const lens = new THREE.Mesh(lensGeometry, lensMaterial);
    lens.rotation.x = Math.PI / 2;
    lens.position.z = 0.06;
    cameraGroup.add(lens);
    
    cameraGroup.position.set(0.4, 0.7, 0.2);
    cameraGroup.rotation.y = -0.3;
    kid.add(cameraGroup);
    
    kid.userData.camera = cameraGroup;
  }
  
  // Girl: Balloon on string
  if (!isBoy) {
    const balloonGroup = new THREE.Group();
    
    // Balloon
    const balloonGeometry = new THREE.SphereGeometry(0.25, 16, 16);
    const balloonMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xFF0000, // Red balloon
      roughness: 0.3,
      metalness: 0.1
    });
    const balloon = new THREE.Mesh(balloonGeometry, balloonMaterial);
    balloon.position.y = 1.5;
    balloon.scale.set(1, 1.2, 1); // Slightly elongated
    balloon.castShadow = true;
    balloonGroup.add(balloon);
    
    // String
    const stringGeometry = new THREE.CylinderGeometry(0.01, 0.01, 1.5, 8);
    const stringMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xFFFFFF,
      roughness: 0.9
    });
    const string = new THREE.Mesh(stringGeometry, stringMaterial);
    string.position.y = 0.75;
    balloonGroup.add(string);
    
    // Balloon knot
    const knotGeometry = new THREE.SphereGeometry(0.03, 8, 8);
    const knot = new THREE.Mesh(knotGeometry, balloonMaterial);
    knot.position.y = 1.2;
    balloonGroup.add(knot);
    
    balloonGroup.position.set(-0.35, 0.5, 0);
    kid.add(balloonGroup);
    
    kid.userData.balloon = balloon;
    kid.userData.balloonGroup = balloonGroup;
  }
  
  // Animation data
  kid.userData.animationTime = 0;
  kid.userData.leftArm = leftArm;
  kid.userData.rightArm = rightArm;
  kid.userData.leftLeg = leftLeg;
  kid.userData.rightLeg = rightLeg;
  kid.userData.isBoy = isBoy;
  kid.userData.body = body;
  kid.userData.head = head;
  
  return kid;
}

/**
 * Creates speech bubble sprite
 */
export function createSpeechBubble(type = 'wow') {
  const textureLoader = new THREE.TextureLoader();
  
  let url;
  switch(type) {
    case 'wow':
      url = 'https://play.rosebud.ai/assets/speech-bubble-wow.webp.webp?PIY6';
      break;
    case 'cute':
      url = 'https://play.rosebud.ai/assets/speech-bubble-cute.webp.webp?zpld';
      break;
    case 'look':
      url = 'https://play.rosebud.ai/assets/speech-bubble-look.webp.webp?DIsi';
      break;
    default:
      url = 'https://play.rosebud.ai/assets/speech-bubble-wow.webp.webp?PIY6';
  }
  
  const texture = textureLoader.load(url);
  texture.colorSpace = THREE.SRGBColorSpace;
  
  const material = new THREE.SpriteMaterial({ 
    map: texture,
    transparent: true,
    depthTest: false, // Always show on top
    depthWrite: false
  });
  
  const sprite = new THREE.Sprite(material);
  sprite.scale.set(2, 1.5, 1);
  sprite.visible = false;
  
  return sprite;
}

/**
 * Creates camera flash effect
 */
export function createCameraFlash() {
  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load('https://play.rosebud.ai/assets/camera-flash.webp.webp?Ixfq');
  texture.colorSpace = THREE.SRGBColorSpace;
  
  const material = new THREE.SpriteMaterial({ 
    map: texture,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  
  const sprite = new THREE.Sprite(material);
  sprite.scale.set(3, 3, 1);
  
  return sprite;
}

/**
 * Animate a kid visitor
 */
export function animateKidVisitor(kid, deltaTime, isMoving) {
  kid.userData.animationTime += deltaTime * 6; // Slower, childlike animation
  
  if (isMoving) {
    // Bouncy walk animation
    const swingAmount = Math.sin(kid.userData.animationTime) * 0.5;
    const bounceAmount = Math.abs(Math.sin(kid.userData.animationTime * 2)) * 0.12;
    
    // Arms swing
    kid.userData.leftArm.rotation.x = swingAmount;
    kid.userData.rightArm.rotation.x = -swingAmount;
    
    // Legs swing
    kid.userData.leftLeg.rotation.x = -swingAmount * 0.7;
    kid.userData.rightLeg.rotation.x = swingAmount * 0.7;
    
    // Bouncy body movement
    kid.userData.body.position.y = 0.8 + bounceAmount;
    kid.userData.head.position.y = 1.4 + bounceAmount;
    
    // Girl: Pigtails bounce
    if (!kid.userData.isBoy && kid.userData.pigtails) {
      kid.userData.pigtails.forEach((pigtail, i) => {
        const offset = i * Math.PI;
        pigtail.position.y = 1.5 + Math.sin(kid.userData.animationTime * 2 + offset) * 0.08;
      });
    }
    
    // Girl: Balloon sway and bob
    if (kid.userData.balloon) {
      const sway = Math.sin(kid.userData.animationTime * 0.8) * 0.15;
      const bob = Math.sin(kid.userData.animationTime * 1.2) * 0.1;
      kid.userData.balloonGroup.rotation.z = sway;
      kid.userData.balloon.position.y = 1.5 + bob;
    }
  } else {
    // Idle animation
    kid.userData.leftArm.rotation.z = 0.3;
    kid.userData.leftArm.rotation.x = 0;
    kid.userData.rightArm.rotation.z = -0.3;
    kid.userData.rightArm.rotation.x = 0;
    kid.userData.leftLeg.rotation.x = 0;
    kid.userData.rightLeg.rotation.x = 0;
    
    // Gentle breathing
    const breathe = Math.sin(kid.userData.animationTime * 2) * 0.02;
    kid.userData.body.position.y = 0.8 + breathe;
    kid.userData.head.position.y = 1.4 + breathe;
    
    // Girl: Balloon gentle sway even when idle
    if (kid.userData.balloon) {
      const sway = Math.sin(kid.userData.animationTime * 0.5) * 0.1;
      const bob = Math.sin(kid.userData.animationTime * 0.7) * 0.08;
      kid.userData.balloonGroup.rotation.z = sway;
      kid.userData.balloon.position.y = 1.5 + bob;
    }
  }
}

/**
 * Makes a kid wave at the player
 */
export function waveAtPlayer(kid) {
  if (!kid.userData.isWaving) {
    kid.userData.isWaving = true;
    kid.userData.waveTime = 0;
  }
}

/**
 * Update kid waving animation
 */
export function updateWaving(kid, deltaTime) {
  if (kid.userData.isWaving) {
    kid.userData.waveTime += deltaTime * 10;
    
    const waveAmount = Math.sin(kid.userData.waveTime) * 0.8;
    kid.userData.rightArm.rotation.z = -1.2 + waveAmount * 0.3;
    kid.userData.rightArm.rotation.x = waveAmount * 0.5;
    
    // Stop waving after ~2 seconds
    if (kid.userData.waveTime > Math.PI * 4) {
      kid.userData.isWaving = false;
      kid.userData.waveTime = 0;
    }
  }
}

/**
 * Makes a kid point excitedly
 */
export function pointExcitedly(kid) {
  if (!kid.userData.isPointing) {
    kid.userData.isPointing = true;
    kid.userData.pointTime = 0;
  }
}

/**
 * Update kid pointing animation
 */
export function updatePointing(kid, deltaTime) {
  if (kid.userData.isPointing) {
    kid.userData.pointTime += deltaTime;
    
    // Point forward with one arm
    const armAngle = Math.sin(kid.userData.pointTime * 8) * 0.1;
    kid.userData.leftArm.rotation.x = -1.3 + armAngle;
    kid.userData.leftArm.rotation.z = 0.5;
    
    // Stop pointing after ~3 seconds
    if (kid.userData.pointTime > 3) {
      kid.userData.isPointing = false;
      kid.userData.pointTime = 0;
    }
  }
}

/**
 * Show speech bubble above kid
 */
export function showSpeechBubble(speechBubble, duration = 2) {
  speechBubble.visible = true;
  speechBubble.userData.showTime = duration;
}

/**
 * Update speech bubble visibility
 */
export function updateSpeechBubble(speechBubble, deltaTime) {
  if (speechBubble.visible && speechBubble.userData.showTime !== undefined) {
    speechBubble.userData.showTime -= deltaTime;
    
    // Gentle bobbing animation
    const time = Date.now() * 0.003;
    speechBubble.position.y = 3 + Math.sin(time) * 0.1;
    
    if (speechBubble.userData.showTime <= 0) {
      speechBubble.visible = false;
    }
  }
}

/**
 * Trigger camera flash effect
 */
export function triggerCameraFlash(flashSprite) {
  flashSprite.material.opacity = 1;
  flashSprite.userData.flashTime = 0.3; // Flash duration
}

/**
 * Update camera flash effect
 */
export function updateCameraFlash(flashSprite, deltaTime) {
  if (flashSprite.material.opacity > 0) {
    flashSprite.userData.flashTime -= deltaTime;
    flashSprite.material.opacity = Math.max(0, flashSprite.userData.flashTime / 0.3);
  }
}