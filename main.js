import * as THREE from 'three';
import { PlayerController, ThirdPersonCameraController } from './rosie/controls/rosieControls.js';
import { CONFIG } from './config.js';
import { createZooKeeper, animateZooKeeper } from './ZooKeeper.js';
import { createAnimalEnclosure, animateAnimals, updateHeartParticles } from './AnimalEnclosure.js';
import { createEnvironment, setupLighting, animateCartoonGrass } from './Environment.js';
import { createWalkingTrack, animateWalkingTrack } from './WalkingTrack.js';
import { createPondAnimals, animatePondAnimals } from './PondAnimals.js';
import { FeedingSystem } from './FeedingSystem.js';
import { UIManager } from './UIManager.js';
import { createFootprintTrails, createSignposts } from './PathDecorations.js';
import { VisitorManager } from './VisitorManager.js';
import { createEntranceGate, animateEntranceBalloons } from './EntranceGate.js';
import { addPathFurniture, createButterflies, createBirds, createFireflies, animateParticles } from './PathFurniture.js';
import { AmbientSoundManager } from './AmbientSounds.js';
import { createIceCaveZone, createSnowParticles, updateSnowParticles } from './IceCave.js';
import { createAquarium, animateSharks, animateTropicalFish, animateBubbles } from './Aquarium.js';
import { createQuizBooth, animateQuizBooth } from './QuizBooth.js';
import { AnimalCardUI } from './AnimalCardUI.js';

/**
 * Zoo Adventure Game - Main Entry Point
 */
class ZooGame {
  constructor() {
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.player = null;
    this.playerController = null;
    this.cameraController = null;
    this.enclosures = [];
    this.uiManager = null;
    this.visitorManager = null;
    this.clock = new THREE.Clock();
    
    // New features
    this.butterflies = [];
    this.birds = [];
    this.fireflies = [];
    this.snowParticles = [];
    this.aquariumAnimations = null; // { sharks, tropicalFish, bubbles }
    this.alligatorPond = null;
    this.ground = null; // Store ground for grass animation
    this.quizBooth = null; // Quiz booth with animations
    this.animalCardUI = null; // Animal card collection UI
    this.walkingTrackArrows = []; // Arrows on walking track
    this.pondDucks = []; // Ducks in pond
    this.pondFrogs = []; // Frogs on lily pads
    this.feedingSystem = null; // Feeding system for animals
    this.currentCameraRotation = 0; // Store current camera rotation
    this.ambientSoundManager = new AmbientSoundManager();
    
    this.init();
  }
  
  /**
   * Initialize the game
   */
  async init() {
    // Create scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(CONFIG.COLORS.sky);
    
    // Create camera
    this.camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      200
    );
    
    // Create renderer with high DPI support
    this.renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // High DPI support
    this.renderer.shadowMap.enabled = CONFIG.ENABLE_SHADOWS;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    
    const container = document.getElementById('canvas-container');
    container.appendChild(this.renderer.domElement);
    
    // Setup lighting
    setupLighting(this.scene);
    
    // Create environment
    const environment = createEnvironment(this.scene);
    this.ground = environment.ground;
    
    // Create walking track with arrows
    const trackData = createWalkingTrack(this.scene);
    this.walkingTrackArrows = trackData.arrows;
    
    // Create pond animals (ducks and frogs)
    const pondAnimals = createPondAnimals(this.scene);
    this.pondDucks = pondAnimals.ducks;
    this.pondFrogs = pondAnimals.frogs;
    
    // Create Ice Cave Zone (top right corner)
    createIceCaveZone(this.scene);
    
    // Create Aquarium (top left corner)
    this.aquariumAnimations = createAquarium(this.scene);
    
    // Create Quiz Booth at center
    this.quizBooth = createQuizBooth(this.scene);
    
    // Create grand entrance gate at the south
    createEntranceGate(this.scene);
    
    // Create player (zoo keeper) - start at entrance (south edge of rectangular zoo)
    this.player = createZooKeeper();
    this.player.position.set(
      0,
      CONFIG.PLAYER_GROUND_LEVEL,
      65 // Start at entrance looking north into rectangular zoo
    );
    this.scene.add(this.player);
    
    // Setup player controller
    this.playerController = new PlayerController(this.player, {
      moveSpeed: CONFIG.PLAYER_MOVE_SPEED,
      jumpForce: 0, // No jumping in zoo
      gravity: 0, // No gravity needed
      groundLevel: CONFIG.PLAYER_GROUND_LEVEL
    });
    
    // Setup camera controller - start facing north to view entire zoo
    this.cameraController = new ThirdPersonCameraController(
      this.camera,
      this.player,
      this.renderer.domElement,
      {
        distance: CONFIG.CAMERA_DISTANCE,
        height: CONFIG.CAMERA_HEIGHT,
        rotationSpeed: 0.003,
        initialRotation: Math.PI // Face north (towards negative z)
      }
    );
    
    // Create animal enclosures
    this.createEnclosures();
    
    // Initialize feeding system
    this.feedingSystem = new FeedingSystem(this.scene, this.player);
    this.feedingSystem.createBaskets(this.enclosures);
    
    // Add footprint trails leading to each enclosure
    createFootprintTrails(this.scene, this.enclosures);
    
    // Add directional signposts
    createSignposts(this.scene, this.enclosures);
    
    // Initialize UI manager
    this.uiManager = new UIManager();
    
    // Initialize Animal Card UI
    this.animalCardUI = new AnimalCardUI();
    this.animalCardUI.loadProgress();
    
    // Initialize visitor manager with kid NPCs
    this.visitorManager = new VisitorManager(this.scene, this.enclosures);
    
    // Add path furniture (benches, lamp posts, trash bins)
    addPathFurniture(this.scene);
    
    // Create animated particle effects
    this.butterflies = createButterflies(this.scene);
    this.birds = createBirds(this.scene);
    this.fireflies = createFireflies(this.scene);
    this.snowParticles = createSnowParticles(this.scene);
    
    // Initialize ambient sound (will activate on first user interaction)
    document.addEventListener('click', () => {
      if (!this.ambientSoundManager.isInitialized) {
        this.ambientSoundManager.initialize();
      }
    }, { once: true });
    
    // Setup sound toggle button
    const soundToggle = document.getElementById('sound-toggle');
    if (soundToggle) {
      soundToggle.addEventListener('click', () => {
        // Initialize if not already
        if (!this.ambientSoundManager.isInitialized) {
          this.ambientSoundManager.initialize();
        }
        
        const isMuted = this.ambientSoundManager.toggleMute();
        soundToggle.textContent = isMuted ? '🔇' : '🔊';
        soundToggle.classList.toggle('muted', isMuted);
      });
    }
    
    // Handle window resize
    window.addEventListener('resize', () => this.onWindowResize());
    
    // Setup F key to open Card UI at Quiz Booth OR grab food at basket
    window.addEventListener('keydown', (e) => {
      if (e.key === 'f' || e.key === 'F') {
        const isNearBooth = this.animalCardUI.checkProximityToQuizBooth(this.player.position);
        if (isNearBooth) {
          this.animalCardUI.toggle();
        } else {
          // Try to grab food from basket
          this.feedingSystem.grabFood();
        }
      }
      
      // T key to throw food
      if (e.key === 't' || e.key === 'T') {
        // Use current camera rotation as the throw direction
        this.feedingSystem.throwFood(this.currentCameraRotation);
      }
    });
    
    // Hide loading screen
    this.uiManager.hideLoadingScreen();
    
    // Start game loop
    this.animate();
  }
  
  /**
   * Create all 12 animal enclosures spread across themed areas
   */
  createEnclosures() {
    const animals = CONFIG.ANIMALS;
    
    // Create enclosures for each themed area
    Object.keys(animals).forEach(areaName => {
      animals[areaName].forEach(animalData => {
        const position = new THREE.Vector3(
          animalData.position.x,
          0,
          animalData.position.z
        );
        const enclosure = createAnimalEnclosure(animalData, position);
        enclosure.userData.area = areaName; // Store area info
        this.enclosures.push(enclosure);
        this.scene.add(enclosure);
      });
    });
  }
  
  /**
   * Handle window resize
   */
  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
  
  /**
   * Main game loop
   */
  animate() {
    requestAnimationFrame(() => this.animate());
    
    const deltaTime = this.clock.getDelta();
    
    // Update camera
    const cameraRotation = this.cameraController.update();
    this.currentCameraRotation = cameraRotation; // Store for throwing food
    
    // Update player
    this.playerController.update(deltaTime, cameraRotation);
    
    // Check if player is moving
    const isMoving = 
      this.playerController.keys['KeyW'] ||
      this.playerController.keys['KeyS'] ||
      this.playerController.keys['KeyA'] ||
      this.playerController.keys['KeyD'] ||
      (this.playerController.mobileControls && 
       this.playerController.mobileControls.joystickActive);
    
    // Animate zoo keeper
    animateZooKeeper(this.player, deltaTime, isMoving);
    
    // Animate animals (now with player position for interaction)
    animateAnimals(this.enclosures, deltaTime, this.player.position);
    
    // Update heart particles
    updateHeartParticles(this.scene, deltaTime);
    
    // Check proximity to enclosures
    this.uiManager.checkPlayerNearEnclosure(
      this.player.position,
      this.enclosures
    );
    
    // Check proximity to enclosures and unlock cards
    this.enclosures.forEach(enclosure => {
      const dx = this.player.position.x - enclosure.position.x;
      const dz = this.player.position.z - enclosure.position.z;
      const distance = Math.sqrt(dx * dx + dz * dz);
      
      if (distance < CONFIG.INTERACTION_DISTANCE && enclosure.userData.animalData) {
        this.animalCardUI.unlockAnimal(enclosure.userData.animalData.name);
      }
    });
    
    // Check proximity to Quiz Booth and show prompt
    const isNearBooth = this.animalCardUI.checkProximityToQuizBooth(this.player.position);
    if (isNearBooth) {
      this.uiManager.showQuizBoothPrompt();
      this.uiManager.hideGrabFoodPrompt();
    } else {
      this.uiManager.hideQuizBoothPrompt();
      
      // Check if near food basket
      const nearBasket = this.feedingSystem.getNearestBasket();
      if (nearBasket && !this.feedingSystem.isHoldingFood()) {
        this.uiManager.showGrabFoodPrompt();
      } else {
        this.uiManager.hideGrabFoodPrompt();
      }
    }
    
    // Show throw prompt when holding food
    if (this.feedingSystem.isHoldingFood()) {
      this.uiManager.showThrowFoodPrompt();
    } else {
      this.uiManager.hideThrowFoodPrompt();
    }
    
    // Update feeding system
    this.feedingSystem.update(deltaTime, this.enclosures);
    
    // Update kid visitors
    this.visitorManager.update(deltaTime, this.player.position);
    
    // Animate entrance balloons
    animateEntranceBalloons(this.scene, deltaTime);
    
    // Animate particle effects (butterflies, birds, fireflies)
    animateParticles(this.butterflies, this.birds, this.fireflies, deltaTime);
    
    // Update snow particles in ice cave zone
    updateSnowParticles(this.snowParticles, deltaTime);
    
    // Update aquarium animations
    if (this.aquariumAnimations) {
      animateSharks(this.aquariumAnimations.sharks, deltaTime);
      animateTropicalFish(this.aquariumAnimations.tropicalFish, deltaTime);
      animateBubbles(this.aquariumAnimations.bubbles, deltaTime);
    }
    
    // Animate cartoon grass (subtle swaying)
    if (this.ground) {
      animateCartoonGrass(this.ground, deltaTime);
    }
    
    // Animate quiz booth
    if (this.quizBooth) {
      animateQuizBooth(this.quizBooth, deltaTime);
    }
    
    // Animate walking track arrows
    if (this.walkingTrackArrows.length > 0) {
      animateWalkingTrack(this.walkingTrackArrows, deltaTime);
    }
    
    // Animate pond animals
    if (this.pondDucks.length > 0 || this.pondFrogs.length > 0) {
      animatePondAnimals(this.pondDucks, this.pondFrogs, deltaTime);
    }
    
    // Update ambient sounds based on player location
    this.ambientSoundManager.update(this.player.position);
    
    // Render scene
    this.renderer.render(this.scene, this.camera);
  }
}

// Start the game when the page loads
window.addEventListener('load', () => {
  new ZooGame();
});
