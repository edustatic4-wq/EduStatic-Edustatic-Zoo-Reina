import * as THREE from 'three';
import { CONFIG } from './config.js';

/**
 * Creates a 2D sprite zoo keeper using the uploaded character image
 * Billboard sprite that always faces the camera
 */
export function createZooKeeper() {
  const keeper = new THREE.Group();
  
  // Load the zoo keeper sprite texture
  const textureLoader = new THREE.TextureLoader();
  const keeperTexture = textureLoader.load('https://play.rosebud.ai/assets/Gemini_Generated_Image_qpoh78qpoh78qpoh-removebg-preview.png?DgZT');
  
  // Create sprite material with transparency
  const spriteMaterial = new THREE.SpriteMaterial({ 
    map: keeperTexture,
    transparent: true,
    alphaTest: 0.1,
    depthWrite: true
  });
  
  // Create the sprite
  const sprite = new THREE.Sprite(spriteMaterial);
  
  // Scale the sprite to appropriate size (height of about 3 units)
  sprite.scale.set(2, 3.5, 1); // Good size for visibility
  sprite.position.y = 1.75; // Center vertically at player height
  
  keeper.add(sprite);
  keeper.userData.sprite = sprite;
  
  // Add a circular shadow at the feet
  const shadowGeometry = new THREE.CircleGeometry(0.6, 16);
  const shadowMaterial = new THREE.MeshBasicMaterial({ 
    color: 0x000000,
    transparent: true,
    opacity: 0.3
  });
  const shadow = new THREE.Mesh(shadowGeometry, shadowMaterial);
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = 0.01;
  keeper.add(shadow);
  
  // Store animation data
  keeper.userData.animationTime = 0;
  
  return keeper;
}

/**
 * Animate the zoo keeper sprite - bounce and squash/stretch animation
 */
export function animateZooKeeper(keeper, deltaTime, isMoving) {
  if (!isMoving) {
    // Reset to idle pose
    keeper.position.y = CONFIG.PLAYER_GROUND_LEVEL;
    
    // Gentle idle animation - slight scale pulse
    keeper.userData.animationTime += deltaTime * 2;
    const idlePulse = Math.sin(keeper.userData.animationTime) * 0.02;
    if (keeper.userData.sprite) {
      keeper.userData.sprite.scale.set(2 + idlePulse, 3.5 + idlePulse * 1.5, 1);
    }
    return;
  }
  
  // Walking animation with bounce
  keeper.userData.animationTime += deltaTime * 8;
  
  // Bounce up and down while walking
  const bounce = Math.abs(Math.sin(keeper.userData.animationTime)) * 0.1;
  keeper.position.y = CONFIG.PLAYER_GROUND_LEVEL + bounce;
  
  // Add slight squash and stretch effect while walking
  if (keeper.userData.sprite) {
    const squash = Math.sin(keeper.userData.animationTime * 2) * 0.06;
    keeper.userData.sprite.scale.set(
      2 - squash * 0.5,      // Width squashes when stretching
      3.5 + squash,          // Height stretches
      1
    );
  }
}
