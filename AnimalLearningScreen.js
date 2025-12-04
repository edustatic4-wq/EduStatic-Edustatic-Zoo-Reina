import { AnimalQuizGame } from './AnimalQuizGame.js';

/**
 * Animal Learning Screen - Detailed educational view for each animal
 * Shows when clicking on an animal card
 */
export class AnimalLearningScreen {
  constructor(onBack, onTakeQuiz) {
    this.container = null;
    this.currentAnimal = null;
    this.onBack = onBack;
    this.onTakeQuiz = onTakeQuiz;
    this.quizGame = null;
    
    // Animal educational data
    this.animalData = this.getAnimalEducationalData();
    
    this.createUI();
    this.createQuizGame();
  }
  
  /**
   * Create quiz game instance
   */
  createQuizGame() {
    this.quizGame = new AnimalQuizGame(
      () => {
        // On complete - return to learning screen
        this.container.style.display = 'block';
      },
      () => {
        // On next animal - go back to cards
        this.quizGame.close();
        if (this.onBack) {
          this.onBack();
        }
      }
    );
  }
  
  /**
   * Get comprehensive educational data for all animals
   */
  getAnimalEducationalData() {
    return {
      '🦁 Lion': {
        emoji: '🦁',
        name: 'Lion',
        home: 'African Grasslands',
        homeIcon: '🌾',
        food: 'Meat (zebras, antelopes)',
        foodIcons: '🥩🦓',
        specialPower: 'Mighty Roar',
        powerDescription: 'Can roar so loud it can be heard 5 miles away!',
        funFact: 'Male lions sleep up to 20 hours a day while lionesses do most of the hunting!',
        didYouKnow: 'Lions are the only cats that live in groups called prides!',
        color: '#FFA500'
      },
      '🐘 Elephant': {
        emoji: '🐘',
        name: 'Elephant',
        home: 'African Savanna & Asian Forests',
        homeIcon: '🌳',
        food: 'Plants, fruits, bark',
        foodIcons: '🌿🍌',
        specialPower: 'Super Memory',
        powerDescription: 'Never forgets faces, places, and can remember water sources from decades ago!',
        funFact: 'Elephants can use their trunks like a snorkel when swimming!',
        didYouKnow: 'An elephant\'s trunk has over 40,000 muscles and can lift 770 pounds!',
        color: '#808080'
      },
      '🦒 Giraffe': {
        emoji: '🦒',
        name: 'Giraffe',
        home: 'African Savannas',
        homeIcon: '🌾',
        food: 'Leaves from tall trees',
        foodIcons: '🍃🌳',
        specialPower: 'Sky-High Vision',
        powerDescription: 'Can see predators from miles away with their height and excellent eyesight!',
        funFact: 'A giraffe\'s tongue is purple-black and 20 inches long!',
        didYouKnow: 'Giraffes only need to drink water once every few days!',
        color: '#FFD700'
      },
      '🐼 Panda': {
        emoji: '🐼',
        name: 'Panda',
        home: 'Chinese Bamboo Forests',
        homeIcon: '🎋',
        food: 'Bamboo, bamboo, bamboo!',
        foodIcons: '🎋🎋',
        specialPower: 'Master Climber',
        powerDescription: 'Can climb trees and swim despite their chubby appearance!',
        funFact: 'Pandas eat for 12-16 hours a day and munch on 26-84 pounds of bamboo daily!',
        didYouKnow: 'Baby pandas are smaller than a stick of butter when born!',
        color: '#000000'
      },
      '🦓 Zebra': {
        emoji: '🦓',
        name: 'Zebra',
        home: 'African Plains',
        homeIcon: '🌾',
        food: 'Grass and plants',
        foodIcons: '🌱🌾',
        specialPower: 'Unique Stripes',
        powerDescription: 'Every zebra has a unique stripe pattern, like a fingerprint!',
        funFact: 'Zebras can run up to 40 mph to escape predators!',
        didYouKnow: 'Scientists think stripes confuse predators and help keep flies away!',
        color: '#333333'
      },
      '🦘 Kangaroo': {
        emoji: '🦘',
        name: 'Kangaroo',
        home: 'Australian Outback',
        homeIcon: '🏜️',
        food: 'Grass and shrubs',
        foodIcons: '🌱🌿',
        specialPower: 'Super Jump',
        powerDescription: 'Can jump 30 feet forward and 10 feet high in a single bound!',
        funFact: 'Kangaroos can\'t walk backwards!',
        didYouKnow: 'Baby kangaroos are called joeys and are only 1 inch long at birth!',
        color: '#D2691E'
      },
      '🐻 Bear': {
        emoji: '🐻',
        name: 'Bear',
        home: 'Forests and Mountains',
        homeIcon: '🏔️',
        food: 'Fish, berries, honey',
        foodIcons: '🐟🍯',
        specialPower: 'Incredible Nose',
        powerDescription: 'Can smell food from 20 miles away!',
        funFact: 'Bears can run as fast as horses!',
        didYouKnow: 'Bears are excellent swimmers and tree climbers!',
        color: '#8B4513'
      },
      '🦎 Lizard': {
        emoji: '🦎',
        name: 'Lizard',
        home: 'Deserts and Rocks',
        homeIcon: '🏜️',
        food: 'Insects and plants',
        foodIcons: '🐛🌿',
        specialPower: 'Tail Escape',
        powerDescription: 'Can drop their tail to escape and grow a new one!',
        funFact: 'Some lizards can run on their hind legs!',
        didYouKnow: 'Lizards can see colors better than humans!',
        color: '#32CD32'
      },
      '🦩 Flamingo': {
        emoji: '🦩',
        name: 'Flamingo',
        home: 'Tropical Lagoons',
        homeIcon: '🏖️',
        food: 'Shrimp and algae',
        foodIcons: '🦐🌊',
        specialPower: 'Color Change',
        powerDescription: 'Turn pink from eating shrimp! They\'re born gray!',
        funFact: 'Flamingos can stand on one leg for hours!',
        didYouKnow: 'They can sleep while standing on one leg!',
        color: '#FF69B4'
      },
      '🐧 Penguin': {
        emoji: '🐧',
        name: 'Penguin',
        home: 'Antarctica & Cold Coasts',
        homeIcon: '🧊',
        food: 'Fish and krill',
        foodIcons: '🐟🦐',
        specialPower: 'Underwater Rocket',
        powerDescription: 'Can swim up to 22 mph underwater!',
        funFact: 'Penguins waddle but they\'re amazing swimmers!',
        didYouKnow: 'Emperor penguins can hold their breath for 20 minutes!',
        color: '#000000'
      },
      '🦉 Owl': {
        emoji: '🦉',
        name: 'Owl',
        home: 'Forests and Trees',
        homeIcon: '🌲',
        food: 'Mice and small animals',
        foodIcons: '🐭🐇',
        specialPower: 'Silent Flight',
        powerDescription: 'Special feathers let them fly completely silently!',
        funFact: 'Owls can turn their heads 270 degrees!',
        didYouKnow: 'Owls can\'t move their eyes, so they turn their whole head!',
        color: '#8B7355'
      },
      '🐢 Turtle': {
        emoji: '🐢',
        name: 'Turtle',
        home: 'Oceans and Beaches',
        homeIcon: '🏖️',
        food: 'Jellyfish and seagrass',
        foodIcons: '🪼🌿',
        specialPower: 'Shell Shield',
        powerDescription: 'Carries its home everywhere for protection!',
        funFact: 'Sea turtles can live over 100 years!',
        didYouKnow: 'Turtles can breathe through their butts underwater!',
        color: '#228B22'
      },
      '🐰 Rabbit': {
        emoji: '🐰',
        name: 'Rabbit',
        home: 'Meadows and Burrows',
        homeIcon: '🌼',
        food: 'Carrots and lettuce',
        foodIcons: '🥕🥬',
        specialPower: 'Speed Hopper',
        powerDescription: 'Can hop at 35 mph and leap 10 feet!',
        funFact: 'Rabbit teeth never stop growing!',
        didYouKnow: 'Rabbits can see nearly 360 degrees around them!',
        color: '#F5DEB3'
      },
      '🐻‍❄️ Polar Bear': {
        emoji: '🐻‍❄️',
        name: 'Polar Bear',
        home: 'Arctic Ice',
        homeIcon: '🧊',
        food: 'Seals and fish',
        foodIcons: '🦭🐟',
        specialPower: 'Ice Master',
        powerDescription: 'Fur and blubber keep them warm in -50°F weather!',
        funFact: 'Polar bear skin is actually black under white fur!',
        didYouKnow: 'They can swim for days without stopping!',
        color: '#FFFFFF'
      },
      '🐧 Arctic Penguin': {
        emoji: '🐧',
        name: 'Arctic Penguin',
        home: 'Icy Waters',
        homeIcon: '🧊',
        food: 'Fish and squid',
        foodIcons: '🐟🦑',
        specialPower: 'Dive Deep',
        powerDescription: 'Can dive over 500 feet deep!',
        funFact: 'Penguins toboggan on their bellies across ice!',
        didYouKnow: 'They drink saltwater because they have special glands!',
        color: '#87CEEB'
      }
    };
  }
  
  /**
   * Create the learning screen UI
   */
  createUI() {
    this.container = document.createElement('div');
    this.container.id = 'animal-learning-screen';
    this.container.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: none;
      z-index: 2000;
      overflow-y: auto;
      padding: 20px;
      box-sizing: border-box;
    `;
    
    // Main content container
    const contentContainer = document.createElement('div');
    contentContainer.style.cssText = `
      max-width: 1200px;
      margin: 0 auto;
      background: white;
      border-radius: 30px;
      padding: 40px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
      position: relative;
    `;
    
    // Back arrow button
    const backButton = document.createElement('button');
    backButton.innerHTML = '← Back';
    backButton.style.cssText = `
      position: absolute;
      top: 20px;
      left: 20px;
      padding: 12px 24px;
      font-size: 18px;
      font-weight: bold;
      color: white;
      background: #667eea;
      border: none;
      border-radius: 10px;
      cursor: pointer;
      box-shadow: 0 4px 8px rgba(0,0,0,0.2);
      transition: transform 0.2s;
      font-family: 'Comic Sans MS', cursive, sans-serif;
      z-index: 10;
    `;
    backButton.onmouseover = () => backButton.style.transform = 'scale(1.05)';
    backButton.onmouseout = () => backButton.style.transform = 'scale(1)';
    backButton.onclick = () => this.close();
    contentContainer.appendChild(backButton);
    
    // Two-column layout
    const layoutContainer = document.createElement('div');
    layoutContainer.style.cssText = `
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 40px;
      margin-top: 40px;
    `;
    
    // Left column - Animal illustration
    const leftColumn = document.createElement('div');
    leftColumn.id = 'animal-illustration-column';
    leftColumn.style.cssText = `
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    `;
    
    // Animal emoji (large)
    this.animalIllustration = document.createElement('div');
    this.animalIllustration.style.cssText = `
      font-size: 200px;
      margin-bottom: 20px;
      animation: floatAnimation 3s ease-in-out infinite;
    `;
    leftColumn.appendChild(this.animalIllustration);
    
    // "Did You Know?" speech bubble
    this.didYouKnowBubble = document.createElement('div');
    this.didYouKnowBubble.style.cssText = `
      background: #FFD700;
      padding: 20px 30px;
      border-radius: 20px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      position: relative;
      max-width: 400px;
      margin-top: 20px;
    `;
    
    const bubbleTitle = document.createElement('div');
    bubbleTitle.textContent = '💡 Did You Know?';
    bubbleTitle.style.cssText = `
      font-size: 20px;
      font-weight: bold;
      color: #333;
      margin-bottom: 10px;
      font-family: 'Comic Sans MS', cursive, sans-serif;
    `;
    this.didYouKnowBubble.appendChild(bubbleTitle);
    
    this.didYouKnowText = document.createElement('div');
    this.didYouKnowText.style.cssText = `
      font-size: 16px;
      color: #333;
      line-height: 1.5;
      font-family: Arial, sans-serif;
    `;
    this.didYouKnowBubble.appendChild(this.didYouKnowText);
    
    // Speech bubble pointer
    const bubblePointer = document.createElement('div');
    bubblePointer.style.cssText = `
      position: absolute;
      top: -20px;
      left: 50%;
      transform: translateX(-50%);
      width: 0;
      height: 0;
      border-left: 20px solid transparent;
      border-right: 20px solid transparent;
      border-bottom: 20px solid #FFD700;
    `;
    this.didYouKnowBubble.appendChild(bubblePointer);
    
    leftColumn.appendChild(this.didYouKnowBubble);
    
    // Right column - Information panels
    const rightColumn = document.createElement('div');
    rightColumn.id = 'animal-info-column';
    rightColumn.style.cssText = `
      display: flex;
      flex-direction: column;
      gap: 20px;
    `;
    
    // Animal name in bubble letters
    this.animalNameTitle = document.createElement('h1');
    this.animalNameTitle.style.cssText = `
      font-size: 56px;
      color: #667eea;
      text-align: center;
      margin: 0 0 20px 0;
      font-family: 'Comic Sans MS', cursive, sans-serif;
      text-shadow: 4px 4px 0px #FFD700,
                   8px 8px 0px rgba(0,0,0,0.1);
      letter-spacing: 2px;
    `;
    rightColumn.appendChild(this.animalNameTitle);
    
    // Info panels
    this.homePanelContent = this.createInfoPanel('🏠 Home', '', '');
    this.foodPanelContent = this.createInfoPanel('🍽️ Food', '', '');
    this.powerPanelContent = this.createInfoPanel('⚡ Special Power', '', '');
    this.funFactPanelContent = this.createInfoPanel('🎈 Fun Fact', '', '');
    
    rightColumn.appendChild(this.homePanelContent.panel);
    rightColumn.appendChild(this.foodPanelContent.panel);
    rightColumn.appendChild(this.powerPanelContent.panel);
    rightColumn.appendChild(this.funFactPanelContent.panel);
    
    // Take Quiz button
    this.quizButton = document.createElement('button');
    this.quizButton.innerHTML = '📝 Take Quiz! ✨';
    this.quizButton.style.cssText = `
      padding: 20px 50px;
      font-size: 28px;
      font-weight: bold;
      color: white;
      background: linear-gradient(135deg, #FF6B9D, #C44569);
      border: none;
      border-radius: 20px;
      cursor: pointer;
      box-shadow: 0 8px 20px rgba(255, 107, 157, 0.4);
      margin-top: 20px;
      font-family: 'Comic Sans MS', cursive, sans-serif;
      transition: transform 0.2s;
      animation: glowPulse 2s ease-in-out infinite;
      align-self: center;
    `;
    this.quizButton.onmouseover = () => this.quizButton.style.transform = 'scale(1.1)';
    this.quizButton.onmouseout = () => this.quizButton.style.transform = 'scale(1)';
    this.quizButton.onclick = () => {
      this.startQuiz();
    };
    rightColumn.appendChild(this.quizButton);
    
    // Assemble layout
    layoutContainer.appendChild(leftColumn);
    layoutContainer.appendChild(rightColumn);
    contentContainer.appendChild(layoutContainer);
    this.container.appendChild(contentContainer);
    
    // Add animations
    this.addAnimations();
    
    document.body.appendChild(this.container);
  }
  
  /**
   * Create an info panel
   */
  createInfoPanel(title, content, icons) {
    const panel = document.createElement('div');
    panel.style.cssText = `
      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
      padding: 20px;
      border-radius: 15px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      border-left: 5px solid #667eea;
    `;
    
    const titleEl = document.createElement('div');
    titleEl.textContent = title;
    titleEl.style.cssText = `
      font-size: 22px;
      font-weight: bold;
      color: #333;
      margin-bottom: 10px;
      font-family: 'Comic Sans MS', cursive, sans-serif;
    `;
    panel.appendChild(titleEl);
    
    const contentEl = document.createElement('div');
    contentEl.style.cssText = `
      font-size: 18px;
      color: #555;
      line-height: 1.6;
      font-family: Arial, sans-serif;
    `;
    panel.appendChild(contentEl);
    
    const iconsEl = document.createElement('div');
    iconsEl.style.cssText = `
      font-size: 32px;
      margin-top: 10px;
    `;
    panel.appendChild(iconsEl);
    
    return { panel, titleEl, contentEl, iconsEl };
  }
  
  /**
   * Add CSS animations
   */
  addAnimations() {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes floatAnimation {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-20px); }
      }
      
      @keyframes glowPulse {
        0%, 100% { 
          box-shadow: 0 8px 20px rgba(255, 107, 157, 0.4);
        }
        50% { 
          box-shadow: 0 8px 40px rgba(255, 107, 157, 0.8),
                      0 0 60px rgba(255, 107, 157, 0.6);
        }
      }
      
      @media (max-width: 768px) {
        #animal-learning-screen > div > div {
          grid-template-columns: 1fr !important;
        }
      }
    `;
    document.head.appendChild(style);
  }
  
  /**
   * Show learning screen for an animal
   */
  show(animalName) {
    const data = this.animalData[animalName];
    if (!data) {
      console.warn('No educational data for:', animalName);
      return;
    }
    
    this.currentAnimal = animalName;
    
    // Update all content
    this.animalIllustration.textContent = data.emoji;
    this.animalNameTitle.textContent = data.name;
    this.animalNameTitle.style.color = data.color;
    
    this.homePanelContent.contentEl.innerHTML = `
      <strong>${data.homeIcon} ${data.home}</strong>
    `;
    
    this.foodPanelContent.contentEl.innerHTML = `
      <strong>${data.food}</strong>
    `;
    this.foodPanelContent.iconsEl.textContent = data.foodIcons;
    
    this.powerPanelContent.contentEl.innerHTML = `
      <strong>${data.specialPower}:</strong><br>
      ${data.powerDescription}
    `;
    
    this.funFactPanelContent.contentEl.textContent = data.funFact;
    
    this.didYouKnowText.textContent = data.didYouKnow;
    
    // Show the screen
    this.container.style.display = 'block';
    document.body.style.overflow = 'hidden';
  }
  
  /**
   * Close learning screen
   */
  close() {
    this.container.style.display = 'none';
    document.body.style.overflow = 'auto';
    
    if (this.onBack) {
      this.onBack();
    }
  }
  
  /**
   * Start quiz for current animal
   */
  startQuiz() {
    if (!this.currentAnimal) return;
    
    // Hide learning screen
    this.container.style.display = 'none';
    
    // Start quiz
    this.quizGame.startQuiz(this.currentAnimal);
  }
  
  /**
   * Check if screen is open
   */
  isOpen() {
    return this.container.style.display === 'block';
  }
}
