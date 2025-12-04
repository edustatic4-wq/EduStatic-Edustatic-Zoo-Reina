import * as THREE from 'three';
import { CONFIG } from './config.js';

/**
 * Feeding System - Baskets with food for each animal
 */
export class FeedingSystem {
  constructor(scene, player) {
    this.scene = scene;
    this.player = player;
    this.baskets = [];
    this.heldFood = null;
    this.foodInAir = [];
    
    // Food types for different animals
    this.foodTypes = {
      'Lion': { type: 'meat', color: 0xD32F2F, emoji: '🥩' },
      'Elephant': { type: 'hay', color: 0xF9A825, emoji: '🌾' },
      'Giraffe': { type: 'leaves', color: 0x7CB342, emoji: '🌿' },
      'Panda': { type: 'bamboo', color: 0x66BB6A, emoji: '🎋' },
      'Zebra': { type: 'grass', color: 0x9CCC65, emoji: '🌱' },
      'Kangaroo': { type: 'carrots', color: 0xFF6F00, emoji: '🥕' },
      'Bear': { type: 'fish', color: 0x0288D1, emoji: '🐟' },
      'Lizard': { type: 'bugs', color: 0x8D6E63, emoji: '🦗' },
      'Flamingo': { type: 'shrimp', color: 0xFF80AB, emoji: '🦐' },
      'Penguin': { type: 'fish', color: 0x0288D1, emoji: '🐟' },
      'Owl': { type: 'mice', color: 0x9E9E9E, emoji: '🐭' },
      'Turtle': { type: 'lettuce', color: 0xAED581, emoji: '🥬' },
      'Rabbit': { type: 'carrots', color: 0xFF6F00, emoji: '🥕' },
      'Polar Bear': { type: 'fish', color: 0x0288D1, emoji: '🐟' },
      'Arctic Penguin': { type: 'fish', color: 0x0288D1, emoji: '🐟' },
      'Alligator': { type: 'meat', color: 0xD32F2F, emoji: '🥩' },
      'Shark': { type: 'fish', color: 0x0288D1, emoji: '🐟' }
    };
  }
  
  /**
   * Create food baskets for all enclosures
   */
  createBaskets(enclosures) {
    enclosures.forEach(enclosure => {
      if (enclosure.userData.animalData) {
        const animalName = enclosure.userData.animalData.name;
        const basket = this.createBasket(enclosure.position, animalName);
        this.baskets.push(basket);
      }
    });
  }
  
  /**
   * Create a single food basket
   */
  createBasket(enclosurePosition, animalName) {
    const basketGroup = new THREE.Group();
    
    // Position basket outside enclosure (towards center of zoo)
    const directionToCenter = new THREE.Vector3(0, 0, -15).sub(enclosurePosition).normalize();
    const basketPosition = new THREE.Vector3()
      .copy(enclosurePosition)
      .add(directionToCenter.multiplyScalar(8));
    
    // Basket base (brown woven basket)
    const basketGeometry = new THREE.CylinderGeometry(0.8, 0.6, 0.8, 8);
    const basketMaterial = new THREE.MeshStandardMaterial({
      color: 0x8D6E63,
      roughness: 0.9,
      metalness: 0.0
    });
    const basket = new THREE.Mesh(basketGeometry, basketMaterial);
    basket.position.y = 0.4;
    basket.castShadow = true;
    basketGroup.add(basket);
    
    // Basket rim
    const rimGeometry = new THREE.TorusGeometry(0.8, 0.08, 8, 8);
    const rim = new THREE.Mesh(rimGeometry, basketMaterial);
    rim.rotation.x = Math.PI / 2;
    rim.position.y = 0.8;
    basketGroup.add(rim);
    
    // Sign post
    const postGeometry = new THREE.CylinderGeometry(0.08, 0.08, 1.5, 8);
    const postMaterial = new THREE.MeshStandardMaterial({
      color: 0x6D4C41,
      roughness: 0.9
    });
    const post = new THREE.Mesh(postGeometry, postMaterial);
    post.position.set(1.2, 0.75, 0);
    post.castShadow = true;
    basketGroup.add(post);
    
    // Sign board with food emoji
    const signGeometry = new THREE.BoxGeometry(1, 0.6, 0.1);
    const signMaterial = new THREE.MeshStandardMaterial({
      color: 0xFFF8DC,
      roughness: 0.8
    });
    const sign = new THREE.Mesh(signGeometry, signMaterial);
    sign.position.set(1.2, 1.5, 0);
    sign.castShadow = true;
    basketGroup.add(sign);
    
    // Add emoji text to sign using canvas texture
    const foodData = this.foodTypes[animalName] || { type: 'food', color: 0xFFFFFF, emoji: '🍎' };
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#FFF8DC';
    ctx.fillRect(0, 0, 128, 128);
    ctx.font = 'bold 80px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(foodData.emoji, 64, 64);
    
    const signTexture = new THREE.CanvasTexture(canvas);
    const signFrontMaterial = new THREE.MeshStandardMaterial({
      map: signTexture,
      roughness: 0.8
    });
    sign.material = [
      signMaterial, signMaterial, signMaterial, signMaterial,
      signFrontMaterial, signMaterial
    ];
    
    // Food items in basket (3D cartoon food)
    for (let i = 0; i < 5; i++) {
      const food = this.createFood(foodData, i);
      food.position.set(
        (Math.random() - 0.5) * 0.6,
        0.5 + i * 0.15,
        (Math.random() - 0.5) * 0.6
      );
      basketGroup.add(food);
    }
    
    basketGroup.position.copy(basketPosition);
    basketGroup.userData = {
      animalName,
      foodData,
      enclosurePosition: enclosurePosition.clone()
    };
    
    this.scene.add(basketGroup);
    return basketGroup;
  }
  
  /**
   * Create 3D cartoon food item
   */
  createFood(foodData, index) {
    const foodGroup = new THREE.Group();
    
    // Different shapes for different food types
    let foodMesh;
    const foodMaterial = new THREE.MeshStandardMaterial({
      color: foodData.color,
      roughness: 0.7,
      metalness: 0.1
    });
    
    switch(foodData.type) {
      case 'meat':
        // Meat chunk (irregular shape)
        const meatGeometry = new THREE.DodecahedronGeometry(0.2, 0);
        foodMesh = new THREE.Mesh(meatGeometry, foodMaterial);
        break;
      
      case 'fish':
        // Fish shape (stretched sphere with tail)
        const fishGeometry = new THREE.SphereGeometry(0.15, 8, 8);
        fishGeometry.scale(1.5, 0.8, 0.6);
        foodMesh = new THREE.Mesh(fishGeometry, foodMaterial);
        
        // Fish tail
        const tailGeometry = new THREE.ConeGeometry(0.12, 0.15, 6);
        const tail = new THREE.Mesh(tailGeometry, foodMaterial);
        tail.rotation.x = Math.PI / 2;
        tail.position.z = -0.15;
        foodMesh.add(tail);
        break;
      
      case 'carrots':
        // Carrot (cone with green top)
        const carrotGeometry = new THREE.ConeGeometry(0.08, 0.3, 8);
        foodMesh = new THREE.Mesh(carrotGeometry, foodMaterial);
        
        // Green leaves on top
        const leavesGeometry = new THREE.ConeGeometry(0.1, 0.12, 6);
        const leavesMaterial = new THREE.MeshStandardMaterial({ color: 0x4CAF50 });
        const leaves = new THREE.Mesh(leavesGeometry, leavesMaterial);
        leaves.rotation.x = Math.PI;
        leaves.position.y = 0.18;
        foodMesh.add(leaves);
        break;
      
      case 'bamboo':
        // Bamboo stick (cylinder with segments)
        const bambooGeometry = new THREE.CylinderGeometry(0.06, 0.06, 0.4, 8);
        foodMesh = new THREE.Mesh(bambooGeometry, foodMaterial);
        break;
      
      case 'leaves':
      case 'grass':
      case 'lettuce':
        // Leafy greens (flat oval)
        const leafGeometry = new THREE.SphereGeometry(0.15, 8, 8);
        leafGeometry.scale(1.2, 0.3, 0.8);
        foodMesh = new THREE.Mesh(leafGeometry, foodMaterial);
        break;
      
      case 'hay':
        // Hay bundle (stretched box)
        const hayGeometry = new THREE.BoxGeometry(0.2, 0.15, 0.25);
        foodMesh = new THREE.Mesh(hayGeometry, foodMaterial);
        break;
      
      case 'shrimp':
        // Shrimp (curved cylinder)
        const shrimpGeometry = new THREE.CylinderGeometry(0.06, 0.04, 0.25, 8);
        foodMesh = new THREE.Mesh(shrimpGeometry, foodMaterial);
        foodMesh.rotation.z = 0.5;
        break;
      
      case 'bugs':
      case 'mice':
        // Small critter (sphere with ears)
        const critterGeometry = new THREE.SphereGeometry(0.12, 8, 8);
        foodMesh = new THREE.Mesh(critterGeometry, foodMaterial);
        break;
      
      default:
        // Generic food (sphere)
        const genericGeometry = new THREE.SphereGeometry(0.15, 8, 8);
        foodMesh = new THREE.Mesh(genericGeometry, foodMaterial);
    }
    
    foodMesh.castShadow = true;
    foodMesh.userData.foodType = foodData.type;
    foodMesh.userData.isFood = true;
    foodGroup.add(foodMesh);
    
    // Slight random rotation
    foodGroup.rotation.set(
      Math.random() * 0.5,
      Math.random() * Math.PI * 2,
      Math.random() * 0.5
    );
    
    return foodGroup;
  }
  
  /**
   * Check if player is near a basket and can grab food
   */
  checkNearBasket() {
    const pickupDistance = 3;
    
    for (let basket of this.baskets) {
      const distance = this.player.position.distanceTo(basket.position);
      if (distance < pickupDistance) {
        return basket;
      }
    }
    return null;
  }
  
  /**
   * Grab food from basket (F key)
   */
  grabFood() {
    if (this.heldFood) return; // Already holding food
    
    const nearBasket = this.checkNearBasket();
    if (!nearBasket) return;
    
    // Create a group to hold multiple food items
    this.heldFood = new THREE.Group();
    this.heldFood.userData.animalName = nearBasket.userData.animalName;
    this.heldFood.userData.enclosurePosition = nearBasket.userData.enclosurePosition;
    this.heldFood.userData.foodData = nearBasket.userData.foodData;
    this.heldFood.userData.foodItems = []; // Track individual food items
    
    // Create a bunch of food items (5-7 items)
    const foodCount = 5 + Math.floor(Math.random() * 3);
    for (let i = 0; i < foodCount; i++) {
      const foodItem = this.createFood(nearBasket.userData.foodData, i);
      foodItem.scale.setScalar(1.2);
      
      // Arrange in a cluster
      const angle = (i / foodCount) * Math.PI * 2;
      const radius = 0.3;
      foodItem.position.set(
        Math.cos(angle) * radius,
        i * 0.15,
        Math.sin(angle) * radius
      );
      
      this.heldFood.add(foodItem);
      this.heldFood.userData.foodItems.push(foodItem);
    }
    
    // Position food bunch in front of player
    this.updateHeldFoodPosition();
    this.scene.add(this.heldFood);
    
    // Show message about what this animal eats
    this.showFoodMessage(nearBasket.userData.animalName, nearBasket.userData.foodData);
    
    return true;
  }
  
  /**
   * Show message about what the animal eats
   */
  showFoodMessage(animalName, foodData) {
    // Create or update message element
    let messageEl = document.getElementById('food-message');
    if (!messageEl) {
      messageEl = document.createElement('div');
      messageEl.id = 'food-message';
      messageEl.style.cssText = `
        position: fixed;
        top: 160px;
        left: 50%;
        transform: translateX(-50%);
        padding: 20px 40px;
        background: rgba(33, 150, 243, 0.95);
        color: white;
        font-size: 22px;
        font-weight: bold;
        border-radius: 15px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.5);
        z-index: 150;
        font-family: 'Comic Sans MS', cursive, sans-serif;
        border: 3px solid #FFD700;
        text-align: center;
        animation: foodMessageSlide 0.3s ease-out;
      `;
      
      const style = document.createElement('style');
      style.textContent = `
        @keyframes foodMessageSlide {
          from { transform: translateX(-50%) translateY(-20px); opacity: 0; }
          to { transform: translateX(-50%) translateY(0); opacity: 1; }
        }
      `;
      document.head.appendChild(style);
      
      document.body.appendChild(messageEl);
    }
    
    // Get food description
    const foodDescriptions = {
      'meat': 'loves meat! 🥩',
      'fish': 'loves fish! 🐟',
      'carrots': 'loves carrots! 🥕',
      'bamboo': 'loves bamboo! 🎋',
      'leaves': 'loves leaves! 🌿',
      'grass': 'loves grass! 🌱',
      'hay': 'loves hay! 🌾',
      'lettuce': 'loves lettuce! 🥬',
      'shrimp': 'loves shrimp! 🦐',
      'bugs': 'loves bugs! 🦗',
      'mice': 'loves mice! 🐭'
    };
    
    const description = foodDescriptions[foodData.type] || 'loves this food!';
    messageEl.innerHTML = `${foodData.emoji} <strong>${animalName}</strong> ${description}`;
    messageEl.style.display = 'block';
    
    // Hide after 3 seconds
    setTimeout(() => {
      messageEl.style.opacity = '0';
      messageEl.style.transition = 'opacity 0.3s';
      setTimeout(() => {
        messageEl.style.display = 'none';
        messageEl.style.opacity = '1';
      }, 300);
    }, 3000);
  }
  
  /**
   * Update position of held food to follow player
   */
  updateHeldFoodPosition() {
    if (!this.heldFood) return;
    
    // Position food in front of player at chest height
    const offset = new THREE.Vector3(0, 1.5, 1.5);
    offset.applyQuaternion(this.player.quaternion);
    this.heldFood.position.copy(this.player.position).add(offset);
    
    // Rotate food to face forward
    this.heldFood.rotation.y = this.player.rotation.y;
    
    // Gentle bobbing animation
    this.heldFood.position.y += Math.sin(Date.now() * 0.003) * 0.1;
  }
  
  /**
   * Throw food (T key)
   */
  throwFood(cameraRotation) {
    if (!this.heldFood) return;
    
    // Calculate throw direction based on camera
    const throwDirection = new THREE.Vector3(0, 0, -1);
    throwDirection.applyAxisAngle(new THREE.Vector3(0, 1, 0), cameraRotation);
    throwDirection.y = 0.3; // Arc upward
    throwDirection.normalize();
    
    // Throw each food item in the bunch with slight variation
    const foodItems = this.heldFood.userData.foodItems || [];
    const animalName = this.heldFood.userData.animalName;
    const enclosurePosition = this.heldFood.userData.enclosurePosition;
    const foodData = this.heldFood.userData.foodData;
    
    foodItems.forEach((foodItem, index) => {
      // Remove from group and add to scene
      this.heldFood.remove(foodItem);
      
      // Set world position
      const worldPos = new THREE.Vector3();
      this.heldFood.getWorldPosition(worldPos);
      foodItem.position.copy(worldPos);
      foodItem.position.x += (Math.random() - 0.5) * 0.5;
      foodItem.position.y += index * 0.2;
      foodItem.position.z += (Math.random() - 0.5) * 0.5;
      
      this.scene.add(foodItem);
      
      // Add slight variation to throw direction for spread
      const variedDirection = throwDirection.clone();
      variedDirection.x += (Math.random() - 0.5) * 0.3;
      variedDirection.z += (Math.random() - 0.5) * 0.3;
      variedDirection.normalize();
      
      // Store throw data
      foodItem.userData.velocity = variedDirection.multiplyScalar(14 + Math.random() * 2);
      foodItem.userData.gravity = -20;
      foodItem.userData.isThrown = true;
      foodItem.userData.throwTime = 0;
      foodItem.userData.animalName = animalName;
      foodItem.userData.enclosurePosition = enclosurePosition;
      foodItem.userData.foodData = foodData;
      
      // Add to flying food array with slight delay
      setTimeout(() => {
        this.foodInAir.push(foodItem);
      }, index * 50);
    });
    
    // Remove the empty group
    this.scene.remove(this.heldFood);
    this.heldFood = null;
    
    return true;
  }
  
  /**
   * Update food physics and check if animal catches it
   */
  update(deltaTime, enclosures) {
    // Update held food position
    this.updateHeldFoodPosition();
    
    // Update thrown food
    for (let i = this.foodInAir.length - 1; i >= 0; i--) {
      const food = this.foodInAir[i];
      const userData = food.userData;
      
      userData.throwTime += deltaTime;
      
      // Apply velocity
      food.position.x += userData.velocity.x * deltaTime;
      food.position.y += userData.velocity.y * deltaTime;
      food.position.z += userData.velocity.z * deltaTime;
      
      // Apply gravity
      userData.velocity.y += userData.gravity * deltaTime;
      
      // Rotate food while flying
      food.rotation.x += deltaTime * 5;
      food.rotation.y += deltaTime * 3;
      
      // Check if food hit the ground
      if (food.position.y < 0.5) {
        this.scene.remove(food);
        this.foodInAir.splice(i, 1);
        continue;
      }
      
      // Check if food is near target animal
      let caught = false;
      for (let enclosure of enclosures) {
        if (enclosure.userData.animalData && 
            enclosure.userData.animalData.name === userData.animalName) {
          const distance = food.position.distanceTo(enclosure.position);
          if (distance < 8) {
            // Animal catches food!
            this.feedAnimal(enclosure);
            this.scene.remove(food);
            this.foodInAir.splice(i, 1);
            caught = true;
            break;
          }
        }
      }
    }
  }
  
  /**
   * Animal catches and eats food - trigger happy animation
   */
  feedAnimal(enclosure) {
    const animalSprite = enclosure.userData.animal;
    
    if (animalSprite) {
      // Trigger eating animation
      animalSprite.userData.isEating = true;
      animalSprite.userData.eatingTime = 0;
      animalSprite.userData.eatingDuration = 2.5; // 2.5 seconds of eating
      
      // Also trigger excitement
      animalSprite.userData.excited = true;
      animalSprite.userData.excitementTime = 0;
      
      // Create heart particles
      this.createFeedingHearts(enclosure.position);
      
      // Play eating sound
      this.playEatingSound();
    }
  }
  
  /**
   * Play eating sound effect
   */
  playEatingSound() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Munching sound (quick alternating tones)
    oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
    oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
    oscillator.frequency.setValueAtTime(400, audioContext.currentTime + 0.2);
    oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.3);
    
    oscillator.type = 'sine';
    gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.4);
  }
  
  /**
   * Create heart particles when animal is fed
   */
  createFeedingHearts(position) {
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        const heartGeometry = new THREE.SphereGeometry(0.3, 8, 8);
        const heartMaterial = new THREE.MeshBasicMaterial({
          color: 0xFF69B4,
          transparent: true,
          opacity: 1
        });
        const heart = new THREE.Mesh(heartGeometry, heartMaterial);
        heart.position.copy(position);
        heart.position.y = 2;
        heart.position.x += (Math.random() - 0.5) * 2;
        heart.position.z += (Math.random() - 0.5) * 2;
        
        heart.userData = {
          velocity: new THREE.Vector3(
            (Math.random() - 0.5) * 2,
            3 + Math.random() * 2,
            (Math.random() - 0.5) * 2
          ),
          lifetime: 1.5
        };
        
        this.scene.add(heart);
        
        // Animate heart
        const animateHeart = () => {
          heart.userData.lifetime -= 0.016;
          if (heart.userData.lifetime <= 0) {
            this.scene.remove(heart);
            return;
          }
          
          heart.position.add(heart.userData.velocity.clone().multiplyScalar(0.016));
          heart.userData.velocity.y -= 5 * 0.016; // Gravity
          heart.material.opacity = heart.userData.lifetime / 1.5;
          heart.scale.setScalar(1 + (1 - heart.userData.lifetime / 1.5) * 0.5);
          
          requestAnimationFrame(animateHeart);
        };
        animateHeart();
      }, i * 200);
    }
  }
  
  /**
   * Get nearest basket for UI prompt
   */
  getNearestBasket() {
    return this.checkNearBasket();
  }
  
  /**
   * Check if player is holding food
   */
  isHoldingFood() {
    return this.heldFood !== null;
  }
}
