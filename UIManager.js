import { CONFIG } from './config.js';

/**
 * Manages UI elements and interactions
 */
export class UIManager {
  constructor() {
    this.animalInfo = document.getElementById('animal-info');
    this.animalName = document.getElementById('animal-name');
    this.animalDescription = document.getElementById('animal-description');
    this.welcomeMessage = document.getElementById('welcome-message');
    this.loadingScreen = document.getElementById('loading-screen');
    
    this.currentAnimal = null;
    this.hideWelcomeTimer = null;
    
    // Create Quiz Booth prompt
    this.createQuizBoothPrompt();
    
    // Create feeding prompts
    this.createFeedingPrompts();
    
    // Hide welcome message after 5 seconds
    this.scheduleWelcomeHide();
  }
  
  /**
   * Schedule welcome message to hide
   */
  scheduleWelcomeHide() {
    this.hideWelcomeTimer = setTimeout(() => {
      if (this.welcomeMessage) {
        this.welcomeMessage.style.transition = 'opacity 0.5s ease';
        this.welcomeMessage.style.opacity = '0';
        setTimeout(() => {
          this.welcomeMessage.style.display = 'none';
        }, 500);
      }
    }, 5000);
  }
  
  /**
   * Show animal information
   */
  showAnimalInfo(animalData) {
    if (this.currentAnimal === animalData) return;
    
    this.currentAnimal = animalData;
    this.animalName.textContent = animalData.name;
    this.animalDescription.textContent = animalData.description;
    this.animalInfo.classList.add('visible');
  }
  
  /**
   * Hide animal information
   */
  hideAnimalInfo() {
    this.currentAnimal = null;
    this.animalInfo.classList.remove('visible');
  }
  
  /**
   * Hide loading screen
   */
  hideLoadingScreen() {
    if (this.loadingScreen) {
      this.loadingScreen.classList.add('hidden');
      setTimeout(() => {
        this.loadingScreen.remove();
      }, 500);
    }
  }
  
  /**
   * Check if player is near any enclosure
   */
  checkPlayerNearEnclosure(playerPosition, enclosures) {
    let nearestEnclosure = null;
    let nearestDistance = CONFIG.INTERACTION_DISTANCE;
    
    enclosures.forEach(enclosure => {
      const distance = playerPosition.distanceTo(enclosure.position);
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestEnclosure = enclosure;
      }
    });
    
    if (nearestEnclosure && nearestEnclosure.userData.animalData) {
      this.showAnimalInfo(nearestEnclosure.userData.animalData);
    } else {
      this.hideAnimalInfo();
    }
  }
  
  /**
   * Create Quiz Booth prompt overlay
   */
  createQuizBoothPrompt() {
    this.quizBoothPrompt = document.createElement('div');
    this.quizBoothPrompt.style.cssText = `
      position: fixed;
      bottom: 150px;
      left: 50%;
      transform: translateX(-50%);
      padding: 20px 40px;
      background: rgba(102, 126, 234, 0.95);
      color: white;
      font-size: 24px;
      font-weight: bold;
      border-radius: 15px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.5);
      display: none;
      z-index: 100;
      font-family: 'Comic Sans MS', cursive, sans-serif;
      border: 3px solid #FFD700;
      animation: boothPromptBounce 1s ease-in-out infinite;
    `;
    this.quizBoothPrompt.innerHTML = '🎓 Press <span style="color: #FFD700;">F</span> to view Animal Academy 🎓';
    
    // Add bounce animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes boothPromptBounce {
        0%, 100% { transform: translateX(-50%) translateY(0px); }
        50% { transform: translateX(-50%) translateY(-10px); }
      }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(this.quizBoothPrompt);
  }
  
  /**
   * Show Quiz Booth prompt
   */
  showQuizBoothPrompt() {
    if (this.quizBoothPrompt) {
      this.quizBoothPrompt.style.display = 'block';
    }
  }
  
  /**
   * Hide Quiz Booth prompt
   */
  hideQuizBoothPrompt() {
    if (this.quizBoothPrompt) {
      this.quizBoothPrompt.style.display = 'none';
    }
  }
  
  /**
   * Create feeding prompts
   */
  createFeedingPrompts() {
    // Grab food prompt
    this.grabFoodPrompt = document.createElement('div');
    this.grabFoodPrompt.style.cssText = `
      position: fixed;
      bottom: 150px;
      left: 50%;
      transform: translateX(-50%);
      padding: 15px 30px;
      background: rgba(76, 175, 80, 0.95);
      color: white;
      font-size: 20px;
      font-weight: bold;
      border-radius: 12px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.5);
      display: none;
      z-index: 100;
      font-family: 'Comic Sans MS', cursive, sans-serif;
      border: 3px solid #FFD700;
    `;
    this.grabFoodPrompt.innerHTML = '🍎 Press <span style="color: #FFD700;">F</span> to grab food 🍎';
    document.body.appendChild(this.grabFoodPrompt);
    
    // Throw food prompt
    this.throwFoodPrompt = document.createElement('div');
    this.throwFoodPrompt.style.cssText = `
      position: fixed;
      top: 100px;
      left: 50%;
      transform: translateX(-50%);
      padding: 15px 30px;
      background: rgba(255, 152, 0, 0.95);
      color: white;
      font-size: 20px;
      font-weight: bold;
      border-radius: 12px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.5);
      display: none;
      z-index: 100;
      font-family: 'Comic Sans MS', cursive, sans-serif;
      border: 3px solid #FFD700;
      animation: throwPromptPulse 1s ease-in-out infinite;
    `;
    this.throwFoodPrompt.innerHTML = '🎯 Press <span style="color: #FFD700;">T</span> to throw food to animal 🎯';
    
    // Add pulse animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes throwPromptPulse {
        0%, 100% { transform: translateX(-50%) scale(1); }
        50% { transform: translateX(-50%) scale(1.05); }
      }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(this.throwFoodPrompt);
  }
  
  /**
   * Show grab food prompt
   */
  showGrabFoodPrompt() {
    if (this.grabFoodPrompt) {
      this.grabFoodPrompt.style.display = 'block';
    }
  }
  
  /**
   * Hide grab food prompt
   */
  hideGrabFoodPrompt() {
    if (this.grabFoodPrompt) {
      this.grabFoodPrompt.style.display = 'none';
    }
  }
  
  /**
   * Show throw food prompt
   */
  showThrowFoodPrompt() {
    if (this.throwFoodPrompt) {
      this.throwFoodPrompt.style.display = 'block';
    }
  }
  
  /**
   * Hide throw food prompt
   */
  hideThrowFoodPrompt() {
    if (this.throwFoodPrompt) {
      this.throwFoodPrompt.style.display = 'none';
    }
  }
}
