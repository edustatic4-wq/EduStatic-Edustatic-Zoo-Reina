/**
 * Animal Mini-Games - Fun interactive games for kids
 * Includes: Memory Match, Animal Sounds Match, Habitat Match
 */
export class AnimalMiniGames {
  constructor(onBack) {
    this.container = null;
    this.onBack = onBack;
    this.currentGame = null;
    this.audioContext = null;
    
    // Game data
    this.animals = this.getAnimalData();
    
    this.createUI();
  }
  
  /**
   * Get animal data for games
   */
  getAnimalData() {
    return [
      { emoji: '🦁', name: 'Lion', habitat: 'Grassland', sound: 'Roar!', color: '#FFA500' },
      { emoji: '🐘', name: 'Elephant', habitat: 'Savanna', sound: 'Trumpet!', color: '#808080' },
      { emoji: '🦒', name: 'Giraffe', habitat: 'Grassland', sound: 'Hum!', color: '#FFD700' },
      { emoji: '🐼', name: 'Panda', habitat: 'Forest', sound: 'Bleat!', color: '#000000' },
      { emoji: '🦓', name: 'Zebra', habitat: 'Grassland', sound: 'Whinny!', color: '#333333' },
      { emoji: '🦘', name: 'Kangaroo', habitat: 'Outback', sound: 'Chatter!', color: '#D2691E' },
      { emoji: '🐻', name: 'Bear', habitat: 'Forest', sound: 'Growl!', color: '#8B4513' },
      { emoji: '🦎', name: 'Lizard', habitat: 'Desert', sound: 'Hiss!', color: '#32CD32' },
      { emoji: '🦩', name: 'Flamingo', habitat: 'Lagoon', sound: 'Honk!', color: '#FF69B4' },
      { emoji: '🐧', name: 'Penguin', habitat: 'Antarctica', sound: 'Squawk!', color: '#000000' },
      { emoji: '🦉', name: 'Owl', habitat: 'Forest', sound: 'Hoot!', color: '#8B7355' },
      { emoji: '🐢', name: 'Turtle', habitat: 'Ocean', sound: 'Silent', color: '#228B22' },
      { emoji: '🐰', name: 'Rabbit', habitat: 'Meadow', sound: 'Thump!', color: '#F5DEB3' },
      { emoji: '🐻‍❄️', name: 'Polar Bear', habitat: 'Arctic', sound: 'Roar!', color: '#FFFFFF' }
    ];
  }
  
  /**
   * Create main menu UI
   */
  createUI() {
    this.container = document.createElement('div');
    this.container.id = 'mini-games-container';
    this.container.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: none;
      z-index: 2500;
      overflow-y: auto;
      padding: 20px;
      box-sizing: border-box;
    `;
    
    // Menu screen
    this.createMenuScreen();
    
    // Memory game screen
    this.createMemoryGameScreen();
    
    // Sound match game screen
    this.createSoundMatchScreen();
    
    // Habitat match game screen
    this.createHabitatMatchScreen();
    
    document.body.appendChild(this.container);
  }
  
  /**
   * Create main menu
   */
  createMenuScreen() {
    this.menuScreen = document.createElement('div');
    this.menuScreen.id = 'mini-games-menu';
    this.menuScreen.style.cssText = `
      max-width: 1000px;
      margin: 40px auto;
      text-align: center;
    `;
    
    // Title
    const title = document.createElement('h1');
    title.textContent = '🎮 Fun Animal Games! 🎮';
    title.style.cssText = `
      font-size: 56px;
      color: white;
      margin-bottom: 20px;
      text-shadow: 4px 4px 8px rgba(0,0,0,0.3);
      font-family: 'Comic Sans MS', cursive, sans-serif;
    `;
    this.menuScreen.appendChild(title);
    
    // Subtitle
    const subtitle = document.createElement('p');
    subtitle.textContent = 'Choose a game to play!';
    subtitle.style.cssText = `
      font-size: 28px;
      color: #FFD700;
      margin-bottom: 40px;
      font-family: 'Comic Sans MS', cursive, sans-serif;
    `;
    this.menuScreen.appendChild(subtitle);
    
    // Games grid
    const gamesGrid = document.createElement('div');
    gamesGrid.style.cssText = `
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 30px;
      margin-bottom: 40px;
    `;
    
    // Game cards
    const games = [
      {
        title: 'Memory Match',
        emoji: '🧠',
        description: 'Find matching animal pairs!',
        color: '#FF6B9D',
        onClick: () => this.startMemoryGame()
      },
      {
        title: 'Sound Match',
        emoji: '🔊',
        description: 'Match animals to their sounds!',
        color: '#4CAF50',
        onClick: () => this.startSoundMatch()
      },
      {
        title: 'Habitat Match',
        emoji: '🏠',
        description: 'Match animals to their homes!',
        color: '#FFD700',
        onClick: () => this.startHabitatMatch()
      }
    ];
    
    games.forEach(game => {
      const card = document.createElement('div');
      card.style.cssText = `
        background: white;
        padding: 40px;
        border-radius: 20px;
        box-shadow: 0 8px 20px rgba(0,0,0,0.3);
        cursor: pointer;
        transition: transform 0.3s;
        border: 4px solid ${game.color};
      `;
      
      card.onmouseover = () => card.style.transform = 'scale(1.05)';
      card.onmouseout = () => card.style.transform = 'scale(1)';
      card.onclick = game.onClick;
      
      const emoji = document.createElement('div');
      emoji.textContent = game.emoji;
      emoji.style.cssText = `
        font-size: 80px;
        margin-bottom: 15px;
      `;
      card.appendChild(emoji);
      
      const gameTitle = document.createElement('h2');
      gameTitle.textContent = game.title;
      gameTitle.style.cssText = `
        font-size: 32px;
        color: ${game.color};
        margin-bottom: 10px;
        font-family: 'Comic Sans MS', cursive, sans-serif;
      `;
      card.appendChild(gameTitle);
      
      const desc = document.createElement('p');
      desc.textContent = game.description;
      desc.style.cssText = `
        font-size: 18px;
        color: #555;
        font-family: Arial, sans-serif;
      `;
      card.appendChild(desc);
      
      gamesGrid.appendChild(card);
    });
    
    this.menuScreen.appendChild(gamesGrid);
    
    // Back button
    const backButton = document.createElement('button');
    backButton.innerHTML = '← Back to Quiz Booth';
    backButton.style.cssText = `
      padding: 15px 40px;
      font-size: 24px;
      font-weight: bold;
      color: white;
      background: #667eea;
      border: none;
      border-radius: 15px;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      font-family: 'Comic Sans MS', cursive, sans-serif;
      transition: transform 0.2s;
    `;
    backButton.onmouseover = () => backButton.style.transform = 'scale(1.05)';
    backButton.onmouseout = () => backButton.style.transform = 'scale(1)';
    backButton.onclick = () => this.close();
    this.menuScreen.appendChild(backButton);
    
    this.container.appendChild(this.menuScreen);
  }
  
  /**
   * Create memory game screen
   */
  createMemoryGameScreen() {
    this.memoryScreen = document.createElement('div');
    this.memoryScreen.id = 'memory-game-screen';
    this.memoryScreen.style.cssText = `
      max-width: 900px;
      margin: 20px auto;
      background: white;
      border-radius: 30px;
      padding: 40px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
      display: none;
    `;
    
    // Header
    const header = document.createElement('div');
    header.style.cssText = `
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
    `;
    
    const backBtn = document.createElement('button');
    backBtn.textContent = '← Menu';
    backBtn.style.cssText = `
      padding: 10px 20px;
      font-size: 18px;
      font-weight: bold;
      color: white;
      background: #667eea;
      border: none;
      border-radius: 10px;
      cursor: pointer;
      font-family: 'Comic Sans MS', cursive, sans-serif;
    `;
    backBtn.onclick = () => this.showMenu();
    header.appendChild(backBtn);
    
    const gameTitle = document.createElement('h2');
    gameTitle.textContent = '🧠 Memory Match';
    gameTitle.style.cssText = `
      font-size: 36px;
      color: #FF6B9D;
      margin: 0;
      font-family: 'Comic Sans MS', cursive, sans-serif;
    `;
    header.appendChild(gameTitle);
    
    this.memoryMoves = document.createElement('div');
    this.memoryMoves.textContent = 'Moves: 0';
    this.memoryMoves.style.cssText = `
      font-size: 24px;
      color: #333;
      font-weight: bold;
      font-family: 'Comic Sans MS', cursive, sans-serif;
    `;
    header.appendChild(this.memoryMoves);
    
    this.memoryScreen.appendChild(header);
    
    // Game grid
    this.memoryGrid = document.createElement('div');
    this.memoryGrid.style.cssText = `
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 15px;
      margin-bottom: 30px;
    `;
    this.memoryScreen.appendChild(this.memoryGrid);
    
    // Reset button
    const resetBtn = document.createElement('button');
    resetBtn.innerHTML = '🔄 New Game';
    resetBtn.style.cssText = `
      display: block;
      margin: 0 auto;
      padding: 15px 40px;
      font-size: 24px;
      font-weight: bold;
      color: white;
      background: #4CAF50;
      border: none;
      border-radius: 15px;
      cursor: pointer;
      font-family: 'Comic Sans MS', cursive, sans-serif;
      transition: transform 0.2s;
    `;
    resetBtn.onmouseover = () => resetBtn.style.transform = 'scale(1.05)';
    resetBtn.onmouseout = () => resetBtn.style.transform = 'scale(1)';
    resetBtn.onclick = () => this.startMemoryGame();
    this.memoryScreen.appendChild(resetBtn);
    
    this.container.appendChild(this.memoryScreen);
  }
  
  /**
   * Create sound match screen
   */
  createSoundMatchScreen() {
    this.soundMatchScreen = document.createElement('div');
    this.soundMatchScreen.id = 'sound-match-screen';
    this.soundMatchScreen.style.cssText = `
      max-width: 900px;
      margin: 20px auto;
      background: white;
      border-radius: 30px;
      padding: 40px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
      display: none;
    `;
    
    // Header
    const header = document.createElement('div');
    header.style.cssText = `
      text-align: center;
      margin-bottom: 30px;
    `;
    
    const backBtn = document.createElement('button');
    backBtn.textContent = '← Menu';
    backBtn.style.cssText = `
      padding: 10px 20px;
      font-size: 18px;
      font-weight: bold;
      color: white;
      background: #667eea;
      border: none;
      border-radius: 10px;
      cursor: pointer;
      font-family: 'Comic Sans MS', cursive, sans-serif;
      position: absolute;
      left: 40px;
    `;
    backBtn.onclick = () => this.showMenu();
    header.appendChild(backBtn);
    
    const gameTitle = document.createElement('h2');
    gameTitle.textContent = '🔊 Sound Match';
    gameTitle.style.cssText = `
      font-size: 36px;
      color: #4CAF50;
      margin-bottom: 10px;
      font-family: 'Comic Sans MS', cursive, sans-serif;
    `;
    header.appendChild(gameTitle);
    
    const instructions = document.createElement('p');
    instructions.textContent = 'Match the animal to its sound!';
    instructions.style.cssText = `
      font-size: 20px;
      color: #555;
      font-family: Arial, sans-serif;
    `;
    header.appendChild(instructions);
    
    this.soundMatchScreen.appendChild(header);
    
    // Score
    this.soundScore = document.createElement('div');
    this.soundScore.textContent = 'Score: 0 / 5';
    this.soundScore.style.cssText = `
      text-align: center;
      font-size: 28px;
      color: #333;
      font-weight: bold;
      margin-bottom: 30px;
      font-family: 'Comic Sans MS', cursive, sans-serif;
    `;
    this.soundMatchScreen.appendChild(this.soundScore);
    
    // Current animal
    this.soundAnimalDisplay = document.createElement('div');
    this.soundAnimalDisplay.style.cssText = `
      text-align: center;
      font-size: 120px;
      margin-bottom: 30px;
    `;
    this.soundMatchScreen.appendChild(this.soundAnimalDisplay);
    
    // Sound buttons
    this.soundButtonsContainer = document.createElement('div');
    this.soundButtonsContainer.style.cssText = `
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
      margin-bottom: 30px;
    `;
    this.soundMatchScreen.appendChild(this.soundButtonsContainer);
    
    // Feedback
    this.soundFeedback = document.createElement('div');
    this.soundFeedback.style.cssText = `
      text-align: center;
      font-size: 28px;
      font-weight: bold;
      min-height: 40px;
      font-family: 'Comic Sans MS', cursive, sans-serif;
    `;
    this.soundMatchScreen.appendChild(this.soundFeedback);
    
    this.container.appendChild(this.soundMatchScreen);
  }
  
  /**
   * Create habitat match screen
   */
  createHabitatMatchScreen() {
    this.habitatScreen = document.createElement('div');
    this.habitatScreen.id = 'habitat-match-screen';
    this.habitatScreen.style.cssText = `
      max-width: 900px;
      margin: 20px auto;
      background: white;
      border-radius: 30px;
      padding: 40px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
      display: none;
    `;
    
    // Header
    const header = document.createElement('div');
    header.style.cssText = `
      text-align: center;
      margin-bottom: 30px;
    `;
    
    const backBtn = document.createElement('button');
    backBtn.textContent = '← Menu';
    backBtn.style.cssText = `
      padding: 10px 20px;
      font-size: 18px;
      font-weight: bold;
      color: white;
      background: #667eea;
      border: none;
      border-radius: 10px;
      cursor: pointer;
      font-family: 'Comic Sans MS', cursive, sans-serif;
      position: absolute;
      left: 40px;
    `;
    backBtn.onclick = () => this.showMenu();
    header.appendChild(backBtn);
    
    const gameTitle = document.createElement('h2');
    gameTitle.textContent = '🏠 Habitat Match';
    gameTitle.style.cssText = `
      font-size: 36px;
      color: #FFD700;
      margin-bottom: 10px;
      font-family: 'Comic Sans MS', cursive, sans-serif;
    `;
    header.appendChild(gameTitle);
    
    const instructions = document.createElement('p');
    instructions.textContent = 'Match animals to their homes!';
    instructions.style.cssText = `
      font-size: 20px;
      color: #555;
      font-family: Arial, sans-serif;
    `;
    header.appendChild(instructions);
    
    this.habitatScreen.appendChild(header);
    
    // Score
    this.habitatScore = document.createElement('div');
    this.habitatScore.textContent = 'Score: 0 / 5';
    this.habitatScore.style.cssText = `
      text-align: center;
      font-size: 28px;
      color: #333;
      font-weight: bold;
      margin-bottom: 30px;
      font-family: 'Comic Sans MS', cursive, sans-serif;
    `;
    this.habitatScreen.appendChild(this.habitatScore);
    
    // Drag and drop area
    this.habitatGameArea = document.createElement('div');
    this.habitatGameArea.style.cssText = `
      display: flex;
      gap: 30px;
      justify-content: center;
      margin-bottom: 30px;
    `;
    this.habitatScreen.appendChild(this.habitatGameArea);
    
    // Feedback
    this.habitatFeedback = document.createElement('div');
    this.habitatFeedback.style.cssText = `
      text-align: center;
      font-size: 28px;
      font-weight: bold;
      min-height: 40px;
      font-family: 'Comic Sans MS', cursive, sans-serif;
    `;
    this.habitatScreen.appendChild(this.habitatFeedback);
    
    this.container.appendChild(this.habitatScreen);
  }
  
  /**
   * Start Memory Match game
   */
  startMemoryGame() {
    this.menuScreen.style.display = 'none';
    this.memoryScreen.style.display = 'block';
    
    // Select 6 random animals for 12 cards
    const selectedAnimals = this.shuffleArray([...this.animals]).slice(0, 6);
    const cards = [...selectedAnimals, ...selectedAnimals]; // Create pairs
    this.shuffleArray(cards);
    
    this.memoryGrid.innerHTML = '';
    this.memoryGameState = {
      moves: 0,
      flipped: [],
      matched: [],
      cards: cards
    };
    
    this.memoryMoves.textContent = 'Moves: 0';
    
    // Create cards
    cards.forEach((animal, index) => {
      const card = document.createElement('div');
      card.className = 'memory-card';
      card.dataset.index = index;
      card.style.cssText = `
        aspect-ratio: 1;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 15px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 60px;
        cursor: pointer;
        transition: transform 0.3s;
        position: relative;
        box-shadow: 0 4px 8px rgba(0,0,0,0.2);
      `;
      
      // Question mark (back)
      const back = document.createElement('div');
      back.textContent = '❓';
      back.style.cssText = `
        position: absolute;
        font-size: 60px;
      `;
      card.appendChild(back);
      
      // Animal (front, hidden initially)
      const front = document.createElement('div');
      front.textContent = animal.emoji;
      front.style.cssText = `
        position: absolute;
        font-size: 60px;
        display: none;
      `;
      card.appendChild(front);
      
      card.onclick = () => this.flipMemoryCard(index, card, animal);
      
      card.onmouseover = () => {
        if (!this.memoryGameState.matched.includes(index)) {
          card.style.transform = 'scale(1.05)';
        }
      };
      card.onmouseout = () => card.style.transform = 'scale(1)';
      
      this.memoryGrid.appendChild(card);
    });
  }
  
  /**
   * Flip memory card
   */
  flipMemoryCard(index, cardElement, animal) {
    const state = this.memoryGameState;
    
    // Can't flip if already flipped or matched
    if (state.flipped.includes(index) || state.matched.includes(index)) {
      return;
    }
    
    // Can't flip more than 2 cards
    if (state.flipped.length >= 2) {
      return;
    }
    
    // Flip card
    state.flipped.push(index);
    const front = cardElement.children[1];
    const back = cardElement.children[0];
    back.style.display = 'none';
    front.style.display = 'block';
    cardElement.style.background = `linear-gradient(135deg, ${animal.color}88, ${animal.color}cc)`;
    
    this.playFlipSound();
    
    // Check for match
    if (state.flipped.length === 2) {
      state.moves++;
      this.memoryMoves.textContent = `Moves: ${state.moves}`;
      
      const [index1, index2] = state.flipped;
      const animal1 = state.cards[index1];
      const animal2 = state.cards[index2];
      
      if (animal1.emoji === animal2.emoji) {
        // Match!
        setTimeout(() => {
          state.matched.push(index1, index2);
          state.flipped = [];
          this.playSuccessSound();
          
          // Check if game complete
          if (state.matched.length === state.cards.length) {
            setTimeout(() => {
              this.showMemoryVictory();
            }, 500);
          }
        }, 500);
      } else {
        // No match
        setTimeout(() => {
          // Flip back
          const card1 = this.memoryGrid.children[index1];
          const card2 = this.memoryGrid.children[index2];
          
          card1.children[0].style.display = 'block';
          card1.children[1].style.display = 'none';
          card1.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
          
          card2.children[0].style.display = 'block';
          card2.children[1].style.display = 'none';
          card2.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
          
          state.flipped = [];
        }, 1000);
      }
    }
  }
  
  /**
   * Show memory game victory
   */
  showMemoryVictory() {
    alert(`🎉 You won in ${this.memoryGameState.moves} moves! 🎉\n\nGreat memory!`);
    this.showConfetti();
  }
  
  /**
   * Start Sound Match game
   */
  startSoundMatch() {
    this.menuScreen.style.display = 'none';
    this.soundMatchScreen.style.display = 'block';
    
    this.soundGameState = {
      score: 0,
      total: 5,
      currentIndex: 0,
      animals: this.shuffleArray([...this.animals]).slice(0, 5)
    };
    
    this.showSoundQuestion();
  }
  
  /**
   * Show sound match question
   */
  showSoundQuestion() {
    const state = this.soundGameState;
    
    if (state.currentIndex >= state.total) {
      this.showSoundMatchVictory();
      return;
    }
    
    this.soundScore.textContent = `Score: ${state.score} / ${state.total}`;
    this.soundFeedback.textContent = '';
    
    const currentAnimal = state.animals[state.currentIndex];
    this.soundAnimalDisplay.textContent = currentAnimal.emoji;
    
    // Create 4 sound options (1 correct + 3 random)
    const options = [currentAnimal];
    const otherAnimals = this.animals.filter(a => a.emoji !== currentAnimal.emoji);
    this.shuffleArray(otherAnimals);
    options.push(...otherAnimals.slice(0, 3));
    this.shuffleArray(options);
    
    this.soundButtonsContainer.innerHTML = '';
    
    options.forEach(animal => {
      const button = document.createElement('button');
      button.innerHTML = `🔊 ${animal.sound}`;
      button.style.cssText = `
        padding: 25px;
        font-size: 24px;
        font-weight: bold;
        color: white;
        background: linear-gradient(135deg, #4CAF50, #45a049);
        border: none;
        border-radius: 15px;
        cursor: pointer;
        transition: transform 0.2s;
        font-family: 'Comic Sans MS', cursive, sans-serif;
      `;
      
      button.onmouseover = () => button.style.transform = 'scale(1.05)';
      button.onmouseout = () => button.style.transform = 'scale(1)';
      button.onclick = () => this.checkSoundAnswer(animal.emoji === currentAnimal.emoji, button);
      
      this.soundButtonsContainer.appendChild(button);
    });
  }
  
  /**
   * Check sound match answer
   */
  checkSoundAnswer(isCorrect, button) {
    // Disable all buttons
    const buttons = this.soundButtonsContainer.querySelectorAll('button');
    buttons.forEach(btn => btn.onclick = null);
    
    if (isCorrect) {
      this.soundGameState.score++;
      button.style.background = 'linear-gradient(135deg, #4CAF50, #45a049)';
      this.soundFeedback.textContent = '✅ Correct!';
      this.soundFeedback.style.color = '#4CAF50';
      this.playSuccessSound();
    } else {
      button.style.background = 'linear-gradient(135deg, #f44336, #da190b)';
      this.soundFeedback.textContent = '❌ Try again!';
      this.soundFeedback.style.color = '#f44336';
      this.playErrorSound();
    }
    
    setTimeout(() => {
      this.soundGameState.currentIndex++;
      this.showSoundQuestion();
    }, 1500);
  }
  
  /**
   * Show sound match victory
   */
  showSoundMatchVictory() {
    const score = this.soundGameState.score;
    const total = this.soundGameState.total;
    const percentage = (score / total) * 100;
    
    let message = '';
    if (percentage === 100) {
      message = `🎉 Perfect! ${score}/${total} correct! 🎉`;
      this.showConfetti();
    } else if (percentage >= 60) {
      message = `👍 Great job! ${score}/${total} correct!`;
    } else {
      message = `💪 Good try! ${score}/${total} correct!`;
    }
    
    alert(message);
    this.showMenu();
  }
  
  /**
   * Start Habitat Match game
   */
  startHabitatMatch() {
    this.menuScreen.style.display = 'none';
    this.habitatScreen.style.display = 'block';
    
    this.habitatGameState = {
      score: 0,
      total: 5,
      currentIndex: 0,
      animals: this.shuffleArray([...this.animals]).slice(0, 5)
    };
    
    this.showHabitatQuestion();
  }
  
  /**
   * Show habitat match question
   */
  showHabitatQuestion() {
    const state = this.habitatGameState;
    
    if (state.currentIndex >= state.total) {
      this.showHabitatVictory();
      return;
    }
    
    this.habitatScore.textContent = `Score: ${state.score} / ${state.total}`;
    this.habitatFeedback.textContent = '';
    
    const currentAnimal = state.animals[state.currentIndex];
    
    // Create habitat options (1 correct + 3 random)
    const habitats = ['Grassland', 'Forest', 'Desert', 'Ocean', 'Arctic', 'Savanna', 'Lagoon', 'Outback', 'Meadow', 'Antarctica'];
    const uniqueHabitats = Array.from(new Set(habitats));
    const options = [currentAnimal.habitat];
    
    // Add 3 random wrong habitats
    const wrongHabitats = uniqueHabitats.filter(h => h !== currentAnimal.habitat);
    this.shuffleArray(wrongHabitats);
    options.push(...wrongHabitats.slice(0, 3));
    this.shuffleArray(options);
    
    this.habitatGameArea.innerHTML = '';
    
    // Animal display
    const animalDisplay = document.createElement('div');
    animalDisplay.style.cssText = `
      flex: 1;
      text-align: center;
    `;
    
    const animalEmoji = document.createElement('div');
    animalEmoji.textContent = currentAnimal.emoji;
    animalEmoji.style.cssText = `
      font-size: 100px;
      margin-bottom: 15px;
    `;
    animalDisplay.appendChild(animalEmoji);
    
    const animalName = document.createElement('div');
    animalName.textContent = currentAnimal.name;
    animalName.style.cssText = `
      font-size: 28px;
      font-weight: bold;
      color: #333;
      font-family: 'Comic Sans MS', cursive, sans-serif;
    `;
    animalDisplay.appendChild(animalName);
    
    this.habitatGameArea.appendChild(animalDisplay);
    
    // Habitat options
    const habitatOptions = document.createElement('div');
    habitatOptions.style.cssText = `
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 15px;
    `;
    
    options.forEach(habitat => {
      const button = document.createElement('button');
      button.innerHTML = `🏠 ${habitat}`;
      button.style.cssText = `
        padding: 20px;
        font-size: 20px;
        font-weight: bold;
        color: white;
        background: linear-gradient(135deg, #FFD700, #FFA500);
        border: none;
        border-radius: 15px;
        cursor: pointer;
        transition: transform 0.2s;
        font-family: 'Comic Sans MS', cursive, sans-serif;
      `;
      
      button.onmouseover = () => button.style.transform = 'scale(1.05)';
      button.onmouseout = () => button.style.transform = 'scale(1)';
      button.onclick = () => this.checkHabitatAnswer(habitat === currentAnimal.habitat, button);
      
      habitatOptions.appendChild(button);
    });
    
    this.habitatGameArea.appendChild(habitatOptions);
  }
  
  /**
   * Check habitat answer
   */
  checkHabitatAnswer(isCorrect, button) {
    // Disable all buttons
    const buttons = this.habitatGameArea.querySelectorAll('button');
    buttons.forEach(btn => btn.onclick = null);
    
    if (isCorrect) {
      this.habitatGameState.score++;
      button.style.background = 'linear-gradient(135deg, #4CAF50, #45a049)';
      this.habitatFeedback.textContent = '✅ Correct!';
      this.habitatFeedback.style.color = '#4CAF50';
      this.playSuccessSound();
    } else {
      button.style.background = 'linear-gradient(135deg, #f44336, #da190b)';
      this.habitatFeedback.textContent = '❌ Not quite!';
      this.habitatFeedback.style.color = '#f44336';
      this.playErrorSound();
    }
    
    setTimeout(() => {
      this.habitatGameState.currentIndex++;
      this.showHabitatQuestion();
    }, 1500);
  }
  
  /**
   * Show habitat match victory
   */
  showHabitatVictory() {
    const score = this.habitatGameState.score;
    const total = this.habitatGameState.total;
    const percentage = (score / total) * 100;
    
    let message = '';
    if (percentage === 100) {
      message = `🎉 Perfect! ${score}/${total} correct! 🎉`;
      this.showConfetti();
    } else if (percentage >= 60) {
      message = `👍 Great job! ${score}/${total} correct!`;
    } else {
      message = `💪 Good try! ${score}/${total} correct!`;
    }
    
    alert(message);
    this.showMenu();
  }
  
  /**
   * Show main menu
   */
  showMenu() {
    this.menuScreen.style.display = 'block';
    this.memoryScreen.style.display = 'none';
    this.soundMatchScreen.style.display = 'none';
    this.habitatScreen.style.display = 'none';
  }
  
  /**
   * Open mini-games menu
   */
  open() {
    this.container.style.display = 'block';
    this.showMenu();
    document.body.style.overflow = 'hidden';
  }
  
  /**
   * Close mini-games
   */
  close() {
    this.container.style.display = 'none';
    document.body.style.overflow = 'auto';
    
    if (this.onBack) {
      this.onBack();
    }
  }
  
  /**
   * Utility: Shuffle array
   */
  shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
  
  /**
   * Play flip sound
   */
  playFlipSound() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    oscillator.frequency.setValueAtTime(400, this.audioContext.currentTime);
    gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
    
    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.1);
  }
  
  /**
   * Play success sound
   */
  playSuccessSound() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    oscillator.frequency.setValueAtTime(523, this.audioContext.currentTime);
    oscillator.frequency.setValueAtTime(659, this.audioContext.currentTime + 0.1);
    oscillator.frequency.setValueAtTime(784, this.audioContext.currentTime + 0.2);
    
    gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5);
    
    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.5);
  }
  
  /**
   * Play error sound
   */
  playErrorSound() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    oscillator.frequency.setValueAtTime(200, this.audioContext.currentTime);
    oscillator.frequency.setValueAtTime(150, this.audioContext.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);
    
    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.3);
  }
  
  /**
   * Show confetti
   */
  showConfetti() {
    // Create temporary confetti canvas
    const canvas = document.createElement('canvas');
    canvas.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 9999;
    `;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    const particles = [];
    const colors = ['#FF6B9D', '#4CAF50', '#FFD700', '#667eea', '#FF69B4', '#00FFFF'];
    
    for (let i = 0; i < 100; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: -10,
        vx: (Math.random() - 0.5) * 4,
        vy: Math.random() * 3 + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 8 + 4,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10
      });
    }
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      let activeParticles = 0;
      
      particles.forEach(particle => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vy += 0.1;
        particle.rotation += particle.rotationSpeed;
        
        if (particle.y < canvas.height) {
          activeParticles++;
          
          ctx.save();
          ctx.translate(particle.x, particle.y);
          ctx.rotate((particle.rotation * Math.PI) / 180);
          ctx.fillStyle = particle.color;
          ctx.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size);
          ctx.restore();
        }
      });
      
      if (activeParticles > 0) {
        requestAnimationFrame(animate);
      } else {
        canvas.remove();
      }
    };
    
    animate();
  }
}
