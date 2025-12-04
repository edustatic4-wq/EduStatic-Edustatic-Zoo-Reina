import { CONFIG } from './config.js';
import { AnimalLearningScreen } from './AnimalLearningScreen.js';
import { AnimalMiniGames } from './AnimalMiniGames.js';
import { quizBoothSounds } from './QuizBoothSounds.js';
import { OwlMascot } from './OwlMascot.js';

/**
 * Animal Card UI System - Interactive 2D card collection menu
 * Shows all animals in a grid with flip animations
 */
export class AnimalCardUI {
  constructor() {
    this.container = null;
    this.isOpen = false;
    this.cards = [];
    this.visitedAnimals = new Set(); // Track which animals have been visited
    this.learningScreen = null;
    this.miniGames = null;
    this.owlMascot = null;
    
    this.createUI();
    this.setupEventListeners();
    this.createLearningScreen();
    this.createMiniGames();
    this.createOwlMascot();
  }
  
  /**
   * Create owl mascot
   */
  createOwlMascot() {
    this.owlMascot = new OwlMascot('animal-card-ui');
  }
  
  /**
   * Create mini-games
   */
  createMiniGames() {
    this.miniGames = new AnimalMiniGames(() => {
      // On back - return to card menu
      this.open();
    });
  }
  
  /**
   * Create the learning screen
   */
  createLearningScreen() {
    this.learningScreen = new AnimalLearningScreen(
      () => {
        // On back - return to card menu
        this.open();
      }
    );
  }
  
  /**
   * Create the fullscreen card UI container
   */
  createUI() {
    // Main container
    this.container = document.createElement('div');
    this.container.id = 'animal-card-ui';
    this.container.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: none;
      z-index: 1000;
      overflow-y: auto;
      padding: 40px 20px;
      box-sizing: border-box;
    `;
    
    // Title
    const title = document.createElement('h1');
    title.textContent = '🎓 Animal Academy Collection 🎓';
    title.style.cssText = `
      text-align: center;
      color: white;
      font-size: 48px;
      margin: 0 0 20px 0;
      text-shadow: 3px 3px 6px rgba(0,0,0,0.3);
      font-family: 'Comic Sans MS', cursive, sans-serif;
    `;
    this.container.appendChild(title);
    
    // Subtitle
    const subtitle = document.createElement('p');
    subtitle.textContent = 'Collect all animals by visiting their enclosures!';
    subtitle.style.cssText = `
      text-align: center;
      color: #FFD700;
      font-size: 24px;
      margin: 0 0 40px 0;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
      font-family: 'Comic Sans MS', cursive, sans-serif;
    `;
    this.container.appendChild(subtitle);
    
    // Cards grid container
    const gridContainer = document.createElement('div');
    gridContainer.id = 'cards-grid';
    gridContainer.style.cssText = `
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 30px;
      max-width: 1400px;
      margin: 0 auto;
      padding: 20px;
    `;
    this.container.appendChild(gridContainer);
    
    // Create cards for all animals
    this.createAnimalCards(gridContainer);
    
    // Play Games button
    const playGamesBtn = document.createElement('button');
    playGamesBtn.innerHTML = '🎮 Play Games';
    playGamesBtn.style.cssText = `
      position: fixed;
      top: 20px;
      left: 20px;
      padding: 15px 30px;
      font-size: 20px;
      font-weight: bold;
      color: white;
      background: linear-gradient(135deg, #4CAF50, #45a049);
      border: none;
      border-radius: 10px;
      cursor: pointer;
      box-shadow: 0 4px 6px rgba(0,0,0,0.3);
      transition: transform 0.2s;
      font-family: 'Comic Sans MS', cursive, sans-serif;
      z-index: 1001;
      animation: gameBtnPulse 2s ease-in-out infinite;
    `;
    playGamesBtn.onmouseover = () => playGamesBtn.style.transform = 'scale(1.1)';
    playGamesBtn.onmouseout = () => playGamesBtn.style.transform = 'scale(1)';
    playGamesBtn.onclick = () => {
      quizBoothSounds.playClick();
      this.close();
      this.miniGames.open();
    };
    this.container.appendChild(playGamesBtn);
    
    // Close button
    const closeBtn = document.createElement('button');
    closeBtn.textContent = '✖ Close';
    closeBtn.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 15px 30px;
      font-size: 20px;
      font-weight: bold;
      color: white;
      background: #ff4757;
      border: none;
      border-radius: 10px;
      cursor: pointer;
      box-shadow: 0 4px 6px rgba(0,0,0,0.3);
      transition: transform 0.2s;
      font-family: 'Comic Sans MS', cursive, sans-serif;
      z-index: 1001;
    `;
    closeBtn.onmouseover = () => closeBtn.style.transform = 'scale(1.1)';
    closeBtn.onmouseout = () => closeBtn.style.transform = 'scale(1)';
    closeBtn.onclick = () => {
      quizBoothSounds.playClick();
      this.close();
    };
    this.container.appendChild(closeBtn);
    
    // Progress counter
    const progressCounter = document.createElement('div');
    progressCounter.id = 'progress-counter';
    progressCounter.style.cssText = `
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      padding: 15px 40px;
      background: rgba(0,0,0,0.8);
      color: white;
      font-size: 24px;
      font-weight: bold;
      border-radius: 20px;
      box-shadow: 0 4px 10px rgba(0,0,0,0.5);
      font-family: 'Comic Sans MS', cursive, sans-serif;
      z-index: 1001;
    `;
    this.container.appendChild(progressCounter);
    this.progressCounter = progressCounter;
    
    document.body.appendChild(this.container);
    this.updateProgress();
  }
  
  /**
   * Create cards for all animals
   */
  createAnimalCards(gridContainer) {
    // Define zone colors and organize animals
    const zoneConfig = {
      safari: { color: '#FFD700', name: 'Safari Zone' },
      water: { color: '#4A90E2', name: 'Water Zone' },
      forest: { color: '#7CB342', name: 'Forest Zone' },
      garden: { color: '#FF69B4', name: 'Garden Zone' },
      smallAnimals: { color: '#FFA500', name: 'Small Animals' },
      iceCave: { color: '#87CEEB', name: 'Ice Cave' }
    };
    
    // Collect all animals with their zones
    const allAnimals = [];
    Object.entries(CONFIG.ANIMALS).forEach(([zone, animals]) => {
      animals.forEach(animal => {
        allAnimals.push({
          ...animal,
          zone: zone,
          zoneColor: zoneConfig[zone]?.color || '#999',
          zoneName: zoneConfig[zone]?.name || zone
        });
      });
    });
    
    // Create a card for each animal
    allAnimals.forEach((animal, index) => {
      const card = this.createCard(animal, index);
      gridContainer.appendChild(card);
      this.cards.push({ element: card, animal: animal, flipped: false });
    });
  }
  
  /**
   * Create a single animal card
   */
  createCard(animal, index) {
    // Card container with 3D flip capability
    const cardContainer = document.createElement('div');
    cardContainer.className = 'animal-card-container';
    cardContainer.style.cssText = `
      perspective: 1000px;
      width: 100%;
      height: 280px;
      cursor: pointer;
    `;
    
    // Card flipper
    const cardFlipper = document.createElement('div');
    cardFlipper.className = 'card-flipper';
    cardFlipper.style.cssText = `
      position: relative;
      width: 100%;
      height: 100%;
      transition: transform 0.6s;
      transform-style: preserve-3d;
    `;
    
    // Card front (what you see initially)
    const cardFront = document.createElement('div');
    cardFront.className = 'card-front';
    cardFront.style.cssText = `
      position: absolute;
      width: 100%;
      height: 100%;
      backface-visibility: hidden;
      background: white;
      border: 5px solid ${animal.zoneColor};
      border-radius: 15px;
      box-shadow: 0 8px 16px rgba(0,0,0,0.2);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      padding: 15px;
      box-sizing: border-box;
      overflow: hidden;
    `;
    
    // Add glow and wobble animation for unvisited cards
    cardFront.style.animation = 'cardGlow 2s ease-in-out infinite, cardWobble 4s ease-in-out infinite';
    
    // Zone label
    const zoneLabel = document.createElement('div');
    zoneLabel.textContent = animal.zoneName;
    zoneLabel.style.cssText = `
      background: ${animal.zoneColor};
      color: white;
      padding: 5px 15px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: bold;
      text-transform: uppercase;
      font-family: Arial, sans-serif;
    `;
    cardFront.appendChild(zoneLabel);
    
    // Animal emoji (large)
    const animalEmoji = document.createElement('div');
    const emojiMatch = animal.name.match(/[\u{1F300}-\u{1F9FF}]/u);
    animalEmoji.textContent = emojiMatch ? emojiMatch[0] : '🐾';
    animalEmoji.style.cssText = `
      font-size: 80px;
      margin: 10px 0;
      filter: grayscale(100%);
      opacity: 0.3;
    `;
    cardFront.appendChild(animalEmoji);
    
    // Animal name
    const animalName = document.createElement('div');
    const nameWithoutEmoji = animal.name.replace(/[\u{1F300}-\u{1F9FF}]/gu, '').trim();
    animalName.textContent = nameWithoutEmoji;
    animalName.style.cssText = `
      font-size: 20px;
      font-weight: bold;
      color: #333;
      text-align: center;
      font-family: 'Comic Sans MS', cursive, sans-serif;
    `;
    cardFront.appendChild(animalName);
    
    // Lock icon
    const lockIcon = document.createElement('div');
    lockIcon.textContent = '🔒';
    lockIcon.style.cssText = `
      font-size: 30px;
      margin-top: 5px;
    `;
    cardFront.appendChild(lockIcon);
    
    // Mystery text
    const mysteryText = document.createElement('div');
    mysteryText.textContent = 'Visit to unlock!';
    mysteryText.style.cssText = `
      font-size: 14px;
      color: #999;
      font-style: italic;
      font-family: Arial, sans-serif;
    `;
    cardFront.appendChild(mysteryText);
    
    // Card back (revealed after visiting)
    const cardBack = document.createElement('div');
    cardBack.className = 'card-back';
    cardBack.style.cssText = `
      position: absolute;
      width: 100%;
      height: 100%;
      backface-visibility: hidden;
      background: linear-gradient(135deg, ${animal.zoneColor}22, ${animal.zoneColor}44);
      border: 5px solid ${animal.zoneColor};
      border-radius: 15px;
      box-shadow: 0 8px 16px rgba(0,0,0,0.2);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      padding: 15px;
      box-sizing: border-box;
      transform: rotateY(180deg);
    `;
    
    // Star icon on back (for completed)
    const starIcon = document.createElement('div');
    starIcon.textContent = '⭐';
    starIcon.style.cssText = `
      font-size: 40px;
      position: absolute;
      top: 10px;
      right: 10px;
    `;
    cardBack.appendChild(starIcon);
    
    // Animal emoji (colored) on back
    const animalEmojiBack = document.createElement('div');
    animalEmojiBack.textContent = emojiMatch ? emojiMatch[0] : '🐾';
    animalEmojiBack.style.cssText = `
      font-size: 80px;
      margin: 10px 0;
    `;
    cardBack.appendChild(animalEmojiBack);
    
    // Animal name on back
    const animalNameBack = document.createElement('div');
    animalNameBack.textContent = nameWithoutEmoji;
    animalNameBack.style.cssText = `
      font-size: 20px;
      font-weight: bold;
      color: #333;
      text-align: center;
      font-family: 'Comic Sans MS', cursive, sans-serif;
      margin-bottom: 10px;
    `;
    cardBack.appendChild(animalNameBack);
    
    // Description on back
    const description = document.createElement('div');
    description.textContent = animal.description;
    description.style.cssText = `
      font-size: 14px;
      color: #555;
      text-align: center;
      line-height: 1.4;
      font-family: Arial, sans-serif;
    `;
    cardBack.appendChild(description);
    
    // Assemble card
    cardFlipper.appendChild(cardFront);
    cardFlipper.appendChild(cardBack);
    cardContainer.appendChild(cardFlipper);
    
    // Store references
    cardContainer.dataset.animalName = animal.name;
    cardContainer.dataset.flipper = 'flipper';
    
    // Click to open learning screen (if unlocked)
    cardContainer.onclick = () => {
      quizBoothSounds.playSwoosh();
      if (this.visitedAnimals.has(animal.name)) {
        this.openLearningScreen(animal.name);
      }
    };
    
    return cardContainer;
  }
  
  /**
   * Setup event listeners
   */
  setupEventListeners() {
    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
      @keyframes cardGlow {
        0%, 100% {
          box-shadow: 0 8px 16px rgba(0,0,0,0.2);
        }
        50% {
          box-shadow: 0 8px 30px rgba(255,215,0,0.6);
        }
      }
      
      @keyframes cardUnlock {
        0% { transform: scale(1) rotate(0deg); }
        25% { transform: scale(1.1) rotate(5deg); }
        50% { transform: scale(1.15) rotate(-5deg); }
        75% { transform: scale(1.1) rotate(3deg); }
        100% { transform: scale(1) rotate(0deg); }
      }
      
      @keyframes gameBtnPulse {
        0%, 100% {
          box-shadow: 0 4px 6px rgba(0,0,0,0.3);
        }
        50% {
          box-shadow: 0 4px 20px rgba(76, 175, 80, 0.6);
        }
      }
      
      @keyframes cardWobble {
        0%, 100% { transform: rotate(0deg); }
        25% { transform: rotate(-2deg); }
        50% { transform: rotate(0deg); }
        75% { transform: rotate(2deg); }
      }
    `;
    document.head.appendChild(style);
  }
  
  /**
   * Mark an animal as visited and unlock its card
   */
  unlockAnimal(animalName) {
    if (this.visitedAnimals.has(animalName)) return;
    
    this.visitedAnimals.add(animalName);
    
    // Find and update the card
    const cardData = this.cards.find(c => c.animal.name === animalName);
    if (cardData) {
      const card = cardData.element;
      const front = card.querySelector('.card-front');
      const flipper = card.querySelector('.card-flipper');
      
      // Remove glow animation
      front.style.animation = 'none';
      
      // Play unlock animation
      card.style.animation = 'cardUnlock 0.8s ease-out';
      
      setTimeout(() => {
        card.style.animation = 'none';
        
        // Update front card to show unlocked state
        const emoji = front.children[1]; // Animal emoji
        const lockIcon = front.children[3]; // Lock icon
        const mysteryText = front.children[4]; // Mystery text
        
        emoji.style.filter = 'none';
        emoji.style.opacity = '1';
        lockIcon.textContent = '✅';
        mysteryText.textContent = 'Click to learn!';
        mysteryText.style.color = '#4CAF50';
      }, 800);
    }
    
    this.updateProgress();
    
    // Save progress to localStorage
    this.saveProgress();
  }
  
  /**
   * Update progress counter
   */
  updateProgress() {
    const total = this.cards.length;
    const visited = this.visitedAnimals.size;
    this.progressCounter.textContent = `🏆 Collected: ${visited}/${total} Animals`;
    
    // Change color based on progress
    const percentage = (visited / total) * 100;
    if (percentage === 100) {
      this.progressCounter.style.background = 'linear-gradient(90deg, #FFD700, #FFA500)';
      this.progressCounter.textContent = `🎉 COMPLETE! ${visited}/${total} Animals 🎉`;
    } else if (percentage >= 50) {
      this.progressCounter.style.background = 'rgba(0,150,0,0.8)';
    }
  }
  
  /**
   * Open the card UI
   */
  open() {
    this.container.style.display = 'block';
    this.isOpen = true;
    document.body.style.overflow = 'hidden';
    
    // Start background music and show owl
    quizBoothSounds.playBackgroundMusic();
    if (this.owlMascot) {
      this.owlMascot.show();
      this.owlMascot.welcome();
    }
  }
  
  /**
   * Close the card UI
   */
  close() {
    this.container.style.display = 'none';
    this.isOpen = false;
    document.body.style.overflow = 'auto';
    
    // Stop background music and hide owl
    quizBoothSounds.stopBackgroundMusic();
    if (this.owlMascot) {
      this.owlMascot.hide();
    }
  }
  
  /**
   * Toggle card UI
   */
  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }
  
  /**
   * Open learning screen for an animal
   */
  openLearningScreen(animalName) {
    this.close(); // Close card menu
    this.learningScreen.show(animalName);
  }
  
  /**
   * Check if player is near the Quiz Booth
   */
  checkProximityToQuizBooth(playerPosition, boothPosition = { x: 0, z: -15 }) {
    const dx = playerPosition.x - boothPosition.x;
    const dz = playerPosition.z - boothPosition.z;
    const distance = Math.sqrt(dx * dx + dz * dz);
    return distance < 8; // Within 8 units of booth
  }
  
  /**
   * Save progress to localStorage
   */
  saveProgress() {
    const progress = Array.from(this.visitedAnimals);
    localStorage.setItem('animalAcademyProgress', JSON.stringify(progress));
  }
  
  /**
   * Load progress from localStorage
   */
  loadProgress() {
    const saved = localStorage.getItem('animalAcademyProgress');
    if (saved) {
      try {
        const progress = JSON.parse(saved);
        progress.forEach(animalName => {
          this.visitedAnimals.add(animalName);
        });
        
        // Update all cards to reflect loaded progress
        this.cards.forEach(cardData => {
          if (this.visitedAnimals.has(cardData.animal.name)) {
            const card = cardData.element;
            const front = card.querySelector('.card-front');
            const emoji = front.children[1];
            const lockIcon = front.children[3];
            const mysteryText = front.children[4];
            
            front.style.animation = 'none';
            emoji.style.filter = 'none';
            emoji.style.opacity = '1';
            lockIcon.textContent = '✅';
            mysteryText.textContent = 'Click to learn!';
            mysteryText.style.color = '#4CAF50';
          }
        });
        
        this.updateProgress();
      } catch (e) {
        console.error('Failed to load progress:', e);
      }
    }
  }
}
