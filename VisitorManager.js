import * as THREE from 'three';
import { CONFIG } from './config.js';
import { 
  createKidVisitor, 
  createSpeechBubble, 
  createCameraFlash,
  animateKidVisitor,
  waveAtPlayer,
  updateWaving,
  pointExcitedly,
  updatePointing,
  showSpeechBubble,
  updateSpeechBubble,
  triggerCameraFlash,
  updateCameraFlash
} from './KidVisitor.js';

/**
 * Manages kid visitors in the zoo
 */
export class VisitorManager {
  constructor(scene, enclosures) {
    this.scene = scene;
    this.enclosures = enclosures;
    this.visitors = [];
    
    // Create path points from CONFIG waypoints
    this.pathPoints = CONFIG.PATH_WAYPOINTS.map(wp => 
      new THREE.Vector3(wp.x, 0, wp.z)
    );
    
    this.createVisitors();
  }
  
  /**
   * Create the two kid visitors
   */
  createVisitors() {
    // Boy visitor with camera
    const boy = createKidVisitor({ type: 'boy' });
    boy.position.set(-5, 0.5, -15);
    this.scene.add(boy);
    
    // Boy's speech bubbles (multiple types)
    const boySpeechWow = createSpeechBubble('wow');
    boySpeechWow.position.y = 3;
    boy.add(boySpeechWow);
    
    const boySpeechCute = createSpeechBubble('cute');
    boySpeechCute.position.y = 3;
    boy.add(boySpeechCute);
    
    const boySpeechLook = createSpeechBubble('look');
    boySpeechLook.position.y = 3;
    boy.add(boySpeechLook);
    
    // Boy's camera flash
    const boyFlash = createCameraFlash();
    boyFlash.position.set(0.5, 1.2, 0.5);
    boy.add(boyFlash);
    
    // Girl visitor with balloon
    const girl = createKidVisitor({ type: 'girl' });
    girl.position.set(5, 0.5, -10);
    this.scene.add(girl);
    
    // Girl's speech bubbles
    const girlSpeechWow = createSpeechBubble('wow');
    girlSpeechWow.position.y = 3;
    girl.add(girlSpeechWow);
    
    const girlSpeechCute = createSpeechBubble('cute');
    girlSpeechCute.position.y = 3;
    girl.add(girlSpeechCute);
    
    const girlSpeechLook = createSpeechBubble('look');
    girlSpeechLook.position.y = 3;
    girl.add(girlSpeechLook);
    
    // Store visitor data
    this.visitors.push({
      character: boy,
      speechBubbles: [boySpeechWow, boySpeechCute, boySpeechLook],
      flash: boyFlash,
      currentPathIndex: 3,
      moveSpeed: 2.5, // Slow walking speed for kids
      pauseTime: 0,
      lastAnimalCheckTime: 0,
      lastPlayerCheckTime: 0,
      lastPhotoTime: 0,
      waveDistance: 6, // Distance to wave at player
      animalReactionDistance: 8, // Distance to react to animals
      direction: 1, // 1 for forward, -1 for backward along path
      hasWavedRecently: false,
      lastWaveTime: 0
    });
    
    this.visitors.push({
      character: girl,
      speechBubbles: [girlSpeechWow, girlSpeechCute, girlSpeechLook],
      flash: null, // Girl doesn't have camera
      currentPathIndex: 8,
      moveSpeed: 2.3,
      pauseTime: 0,
      lastAnimalCheckTime: 0,
      lastPlayerCheckTime: 0,
      lastPhotoTime: 0,
      waveDistance: 6,
      animalReactionDistance: 8,
      direction: 1,
      hasWavedRecently: false,
      lastWaveTime: 0
    });
  }
  
  /**
   * Update all visitors
   */
  update(deltaTime, playerPosition) {
    this.visitors.forEach(visitor => {
      this.updateVisitor(visitor, deltaTime, playerPosition);
    });
  }
  
  /**
   * Update a single visitor
   */
  updateVisitor(visitor, deltaTime, playerPosition) {
    const character = visitor.character;
    
    // Update speech bubbles
    visitor.speechBubbles.forEach(bubble => {
      updateSpeechBubble(bubble, deltaTime);
    });
    
    // Update camera flash (boy only)
    if (visitor.flash) {
      updateCameraFlash(visitor.flash, deltaTime);
    }
    
    // Update waving/pointing animations
    updateWaving(character, deltaTime);
    updatePointing(character, deltaTime);
    
    // Check if paused (looking at animals or stopped)
    if (visitor.pauseTime > 0) {
      visitor.pauseTime -= deltaTime;
      animateKidVisitor(character, deltaTime, false); // Idle animation
      return;
    }
    
    // Move along path
    this.moveAlongPath(visitor, deltaTime);
    
    // Animate walking
    animateKidVisitor(character, deltaTime, true);
    
    // Check for nearby animals (check every 0.5 seconds)
    visitor.lastAnimalCheckTime += deltaTime;
    if (visitor.lastAnimalCheckTime > 0.5) {
      this.checkNearbyAnimals(visitor);
      visitor.lastAnimalCheckTime = 0;
    }
    
    // Check for player proximity (check every 0.3 seconds)
    visitor.lastPlayerCheckTime += deltaTime;
    if (visitor.lastPlayerCheckTime > 0.3) {
      this.checkPlayerProximity(visitor, playerPosition, deltaTime);
      visitor.lastPlayerCheckTime = 0;
    }
    
    // Boy takes photos periodically (every 8-12 seconds)
    if (visitor.flash) {
      visitor.lastPhotoTime += deltaTime;
      const photoInterval = 8 + Math.random() * 4;
      if (visitor.lastPhotoTime > photoInterval) {
        this.takePhoto(visitor);
        visitor.lastPhotoTime = 0;
      }
    }
  }
  
  /**
   * Move visitor along the winding path
   */
  moveAlongPath(visitor, deltaTime) {
    const character = visitor.character;
    const currentPos = character.position;
    const targetPoint = this.pathPoints[visitor.currentPathIndex];
    
    // Calculate direction to target
    const direction = new THREE.Vector3()
      .subVectors(targetPoint, currentPos)
      .setY(0);
    
    const distance = direction.length();
    
    // If close to target, move to next waypoint
    if (distance < 1) {
      visitor.currentPathIndex += visitor.direction;
      
      // Reverse direction at path ends
      if (visitor.currentPathIndex >= this.pathPoints.length) {
        visitor.currentPathIndex = this.pathPoints.length - 2;
        visitor.direction = -1;
      } else if (visitor.currentPathIndex < 0) {
        visitor.currentPathIndex = 1;
        visitor.direction = 1;
      }
      
      // Random chance to pause at waypoints (20% chance)
      if (Math.random() < 0.2) {
        visitor.pauseTime = 1 + Math.random() * 2; // Pause 1-3 seconds
      }
    } else {
      // Move toward target
      direction.normalize();
      const moveDistance = visitor.moveSpeed * deltaTime;
      currentPos.add(direction.multiplyScalar(moveDistance));
      
      // Rotate to face movement direction
      const angle = Math.atan2(direction.x, direction.z);
      character.rotation.y = angle;
    }
  }
  
  /**
   * Check if visitor is near any animals
   */
  checkNearbyAnimals(visitor) {
    const visitorPos = visitor.character.position;
    
    this.enclosures.forEach(enclosure => {
      const animalPos = enclosure.position;
      const distance = visitorPos.distanceTo(animalPos);
      
      if (distance < visitor.animalReactionDistance) {
        // React to animal!
        this.reactToAnimal(visitor);
      }
    });
  }
  
  /**
   * Make visitor react to nearby animal
   */
  reactToAnimal(visitor) {
    // Don't react if already showing a speech bubble
    const hasActiveBubble = visitor.speechBubbles.some(b => b.visible);
    if (hasActiveBubble) return;
    
    // Random reaction
    const reactions = ['wow', 'cute', 'look'];
    const reaction = reactions[Math.floor(Math.random() * reactions.length)];
    
    // Find the right speech bubble
    const bubbleIndex = reactions.indexOf(reaction);
    const bubble = visitor.speechBubbles[bubbleIndex];
    
    // Show speech bubble
    showSpeechBubble(bubble, 2 + Math.random());
    
    // Point at animal
    pointExcitedly(visitor.character);
    
    // Pause to look
    visitor.pauseTime = 2 + Math.random() * 2; // Pause 2-4 seconds
    
    // Boy might take a photo
    if (visitor.flash && Math.random() < 0.6) {
      // Delay photo slightly
      setTimeout(() => {
        this.takePhoto(visitor);
      }, 500);
    }
  }
  
  /**
   * Check if player is nearby
   */
  checkPlayerProximity(visitor, playerPosition, deltaTime) {
    if (!playerPosition) return;
    
    const distance = visitor.character.position.distanceTo(playerPosition);
    
    // Update wave cooldown
    if (visitor.hasWavedRecently) {
      visitor.lastWaveTime += deltaTime;
      if (visitor.lastWaveTime > 10) { // 10 second cooldown
        visitor.hasWavedRecently = false;
        visitor.lastWaveTime = 0;
      }
    }
    
    // Wave at player if they get close
    if (distance < visitor.waveDistance && !visitor.hasWavedRecently) {
      waveAtPlayer(visitor.character);
      visitor.hasWavedRecently = true;
      visitor.lastWaveTime = 0;
      
      // Also show a friendly speech bubble
      if (!visitor.speechBubbles.some(b => b.visible)) {
        const bubble = visitor.speechBubbles[0]; // "Wow!" bubble
        showSpeechBubble(bubble, 1.5);
      }
    }
  }
  
  /**
   * Boy takes a photo with flash
   */
  takePhoto(visitor) {
    if (visitor.flash) {
      triggerCameraFlash(visitor.flash);
      
      // Pause for photo
      visitor.pauseTime = Math.max(visitor.pauseTime, 1);
    }
  }
}
