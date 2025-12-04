import { quizBoothSounds } from './QuizBoothSounds.js';
import { OwlMascot } from './OwlMascot.js';

/**
 * Animal Quiz Game - Interactive multiple choice quiz for each animal
 * Shows 3 questions with visual and audio feedback
 */
export class AnimalQuizGame {
  constructor(onComplete, onNextAnimal) {
    this.container = null;
    this.currentAnimal = null;
    this.currentQuestionIndex = 0;
    this.score = 0;
    this.totalQuestions = 3;
    this.onComplete = onComplete;
    this.onNextAnimal = onNextAnimal;
    
    // Quiz questions for each animal
    this.quizData = this.getQuizData();
    
    // Audio context for sounds
    this.audioContext = null;
    
    // Timer
    this.timer = null;
    this.timeLeft = 30; // 30 seconds per question - generous for kids
    this.timerInterval = null;
    
    // Hint system
    this.hintUsed = false;
    
    // Owl mascot
    this.owlMascot = null;
    
    this.createUI();
    this.createOwlMascot();
  }
  
  /**
   * Create owl mascot for quiz
   */
  createOwlMascot() {
    this.owlMascot = new OwlMascot('animal-quiz-game');
  }
  
  /**
   * Get quiz questions for all animals
   */
  getQuizData() {
    return {
      '🦁 Lion': [
        {
          question: 'What does the lion eat?',
          answers: [
            { text: 'Grass and Plants', icon: '🌱', correct: false },
            { text: 'Meat (zebras, antelopes)', icon: '🥩', correct: true },
            { text: 'Fruits and Berries', icon: '🍓', correct: false }
          ]
        },
        {
          question: 'Where do lions live?',
          answers: [
            { text: 'African Grasslands', icon: '🌾', correct: true },
            { text: 'Arctic Ice', icon: '🧊', correct: false },
            { text: 'Ocean Waters', icon: '🌊', correct: false }
          ]
        },
        {
          question: 'What is the lion\'s special power?',
          answers: [
            { text: 'Flying High', icon: '🦅', correct: false },
            { text: 'Mighty Roar', icon: '📢', correct: true },
            { text: 'Swimming Fast', icon: '🏊', correct: false }
          ]
        }
      ],
      '🐘 Elephant': [
        {
          question: 'What does the elephant eat?',
          answers: [
            { text: 'Plants, fruits, bark', icon: '🌿', correct: true },
            { text: 'Fish and Squid', icon: '🐟', correct: false },
            { text: 'Meat and Bones', icon: '🍖', correct: false }
          ]
        },
        {
          question: 'What is special about an elephant\'s trunk?',
          answers: [
            { text: 'It can fly', icon: '✈️', correct: false },
            { text: 'Over 40,000 muscles!', icon: '💪', correct: true },
            { text: 'It glows in dark', icon: '✨', correct: false }
          ]
        },
        {
          question: 'How long can elephants remember?',
          answers: [
            { text: 'Only one day', icon: '📅', correct: false },
            { text: 'One week', icon: '📆', correct: false },
            { text: 'Decades - they never forget!', icon: '🧠', correct: true }
          ]
        }
      ],
      '🦒 Giraffe': [
        {
          question: 'What does the giraffe eat?',
          answers: [
            { text: 'Leaves from tall trees', icon: '🍃', correct: true },
            { text: 'Fish from rivers', icon: '🐟', correct: false },
            { text: 'Small animals', icon: '🐭', correct: false }
          ]
        },
        {
          question: 'How long is a giraffe\'s tongue?',
          answers: [
            { text: '2 inches', icon: '📏', correct: false },
            { text: '20 inches', icon: '📐', correct: true },
            { text: '200 inches', icon: '📊', correct: false }
          ]
        },
        {
          question: 'What color is a giraffe\'s tongue?',
          answers: [
            { text: 'Pink', icon: '💖', correct: false },
            { text: 'Purple-black', icon: '💜', correct: true },
            { text: 'Green', icon: '💚', correct: false }
          ]
        }
      ],
      '🐼 Panda': [
        {
          question: 'What is a panda\'s favorite food?',
          answers: [
            { text: 'Bamboo!', icon: '🎋', correct: true },
            { text: 'Pizza', icon: '🍕', correct: false },
            { text: 'Fish', icon: '🐟', correct: false }
          ]
        },
        {
          question: 'How many hours do pandas eat per day?',
          answers: [
            { text: '2-4 hours', icon: '⏰', correct: false },
            { text: '12-16 hours', icon: '⏱️', correct: true },
            { text: '24 hours', icon: '🕐', correct: false }
          ]
        },
        {
          question: 'Where do pandas live?',
          answers: [
            { text: 'African Desert', icon: '🏜️', correct: false },
            { text: 'Chinese Bamboo Forests', icon: '🎋', correct: true },
            { text: 'Arctic Ice', icon: '🧊', correct: false }
          ]
        }
      ],
      '🦓 Zebra': [
        {
          question: 'What do zebras eat?',
          answers: [
            { text: 'Grass and plants', icon: '🌱', correct: true },
            { text: 'Meat', icon: '🥩', correct: false },
            { text: 'Candy', icon: '🍬', correct: false }
          ]
        },
        {
          question: 'Are all zebra stripes the same?',
          answers: [
            { text: 'Yes, all identical', icon: '👥', correct: false },
            { text: 'No, each is unique!', icon: '🎨', correct: true },
            { text: 'Only twins match', icon: '👯', correct: false }
          ]
        },
        {
          question: 'How fast can zebras run?',
          answers: [
            { text: '5 mph', icon: '🐌', correct: false },
            { text: '40 mph', icon: '⚡', correct: true },
            { text: '100 mph', icon: '🚀', correct: false }
          ]
        }
      ],
      '🦘 Kangaroo': [
        {
          question: 'What do kangaroos eat?',
          answers: [
            { text: 'Grass and shrubs', icon: '🌱', correct: true },
            { text: 'Pizza', icon: '🍕', correct: false },
            { text: 'Ice cream', icon: '🍦', correct: false }
          ]
        },
        {
          question: 'How far can a kangaroo jump?',
          answers: [
            { text: '3 feet', icon: '📏', correct: false },
            { text: '30 feet', icon: '📐', correct: true },
            { text: '300 feet', icon: '🚀', correct: false }
          ]
        },
        {
          question: 'What is a baby kangaroo called?',
          answers: [
            { text: 'A Puppy', icon: '🐕', correct: false },
            { text: 'A Kitten', icon: '🐱', correct: false },
            { text: 'A Joey', icon: '👶', correct: true }
          ]
        }
      ],
      '🐻 Bear': [
        {
          question: 'What do bears love to eat?',
          answers: [
            { text: 'Fish, berries, honey', icon: '🐟', correct: true },
            { text: 'Only vegetables', icon: '🥕', correct: false },
            { text: 'Rocks', icon: '🪨', correct: false }
          ]
        },
        {
          question: 'How far can bears smell food?',
          answers: [
            { text: '1 mile away', icon: '📍', correct: false },
            { text: '20 miles away', icon: '👃', correct: true },
            { text: '100 feet away', icon: '📏', correct: false }
          ]
        },
        {
          question: 'Can bears swim?',
          answers: [
            { text: 'Yes, they\'re excellent swimmers!', icon: '🏊', correct: true },
            { text: 'No, they sink', icon: '⚓', correct: false },
            { text: 'Only in pools', icon: '🏊‍♂️', correct: false }
          ]
        }
      ],
      '🦎 Lizard': [
        {
          question: 'What do lizards eat?',
          answers: [
            { text: 'Insects and plants', icon: '🐛', correct: true },
            { text: 'Ice cream', icon: '🍦', correct: false },
            { text: 'Cars', icon: '🚗', correct: false }
          ]
        },
        {
          question: 'What can lizards do to escape danger?',
          answers: [
            { text: 'Fly away', icon: '🦅', correct: false },
            { text: 'Drop their tail!', icon: '🦎', correct: true },
            { text: 'Turn invisible', icon: '👻', correct: false }
          ]
        },
        {
          question: 'Where do lizards love to live?',
          answers: [
            { text: 'Underwater', icon: '🌊', correct: false },
            { text: 'Deserts and rocks', icon: '🏜️', correct: true },
            { text: 'In freezers', icon: '🧊', correct: false }
          ]
        }
      ],
      '🦩 Flamingo': [
        {
          question: 'What makes flamingos pink?',
          answers: [
            { text: 'Paint', icon: '🎨', correct: false },
            { text: 'Eating shrimp!', icon: '🦐', correct: true },
            { text: 'Magic', icon: '✨', correct: false }
          ]
        },
        {
          question: 'What color are baby flamingos?',
          answers: [
            { text: 'Gray', icon: '🪶', correct: true },
            { text: 'Pink', icon: '💖', correct: false },
            { text: 'Rainbow', icon: '🌈', correct: false }
          ]
        },
        {
          question: 'How do flamingos sleep?',
          answers: [
            { text: 'On one leg!', icon: '🦩', correct: true },
            { text: 'Flying', icon: '🦅', correct: false },
            { text: 'Upside down', icon: '🙃', correct: false }
          ]
        }
      ],
      '🐧 Penguin': [
        {
          question: 'What do penguins eat?',
          answers: [
            { text: 'Fish and krill', icon: '🐟', correct: true },
            { text: 'Ice cubes', icon: '🧊', correct: false },
            { text: 'Burgers', icon: '🍔', correct: false }
          ]
        },
        {
          question: 'Can penguins fly?',
          answers: [
            { text: 'No, but they swim great!', icon: '🏊', correct: true },
            { text: 'Yes, high in sky', icon: '✈️', correct: false },
            { text: 'Only on Tuesdays', icon: '📅', correct: false }
          ]
        },
        {
          question: 'How fast can penguins swim?',
          answers: [
            { text: '2 mph', icon: '🐌', correct: false },
            { text: '22 mph', icon: '⚡', correct: true },
            { text: '200 mph', icon: '🚀', correct: false }
          ]
        }
      ],
      '🦉 Owl': [
        {
          question: 'What do owls eat?',
          answers: [
            { text: 'Mice and small animals', icon: '🐭', correct: true },
            { text: 'Candy', icon: '🍬', correct: false },
            { text: 'Leaves', icon: '🍃', correct: false }
          ]
        },
        {
          question: 'How far can owls turn their heads?',
          answers: [
            { text: '90 degrees', icon: '↩️', correct: false },
            { text: '270 degrees', icon: '🔄', correct: true },
            { text: 'Full circle 360', icon: '⭕', correct: false }
          ]
        },
        {
          question: 'What is special about owl flight?',
          answers: [
            { text: 'Very loud', icon: '📢', correct: false },
            { text: 'Completely silent!', icon: '🤫', correct: true },
            { text: 'Rainbow trail', icon: '🌈', correct: false }
          ]
        }
      ],
      '🐢 Turtle': [
        {
          question: 'What do sea turtles eat?',
          answers: [
            { text: 'Jellyfish and seagrass', icon: '🪼', correct: true },
            { text: 'Pizza', icon: '🍕', correct: false },
            { text: 'Rocks', icon: '🪨', correct: false }
          ]
        },
        {
          question: 'How long can turtles live?',
          answers: [
            { text: '10 years', icon: '📅', correct: false },
            { text: 'Over 100 years!', icon: '💯', correct: true },
            { text: '1 year', icon: '📆', correct: false }
          ]
        },
        {
          question: 'What protects a turtle?',
          answers: [
            { text: 'Its shell!', icon: '🐢', correct: true },
            { text: 'A hat', icon: '🎩', correct: false },
            { text: 'Magic powers', icon: '✨', correct: false }
          ]
        }
      ],
      '🐰 Rabbit': [
        {
          question: 'What do rabbits love to eat?',
          answers: [
            { text: 'Carrots and lettuce', icon: '🥕', correct: true },
            { text: 'Meat', icon: '🥩', correct: false },
            { text: 'Metal', icon: '🔩', correct: false }
          ]
        },
        {
          question: 'How fast can rabbits hop?',
          answers: [
            { text: '5 mph', icon: '🐌', correct: false },
            { text: '35 mph', icon: '⚡', correct: true },
            { text: '100 mph', icon: '🚀', correct: false }
          ]
        },
        {
          question: 'What never stops growing on a rabbit?',
          answers: [
            { text: 'Their ears', icon: '👂', correct: false },
            { text: 'Their teeth', icon: '🦷', correct: true },
            { text: 'Their tail', icon: '🐇', correct: false }
          ]
        }
      ],
      '🐻‍❄️ Polar Bear': [
        {
          question: 'What do polar bears eat?',
          answers: [
            { text: 'Seals and fish', icon: '🦭', correct: true },
            { text: 'Ice cream', icon: '🍦', correct: false },
            { text: 'Snow', icon: '❄️', correct: false }
          ]
        },
        {
          question: 'What color is polar bear skin?',
          answers: [
            { text: 'White', icon: '⚪', correct: false },
            { text: 'Black!', icon: '⚫', correct: true },
            { text: 'Pink', icon: '🟣', correct: false }
          ]
        },
        {
          question: 'Where do polar bears live?',
          answers: [
            { text: 'Desert', icon: '🏜️', correct: false },
            { text: 'Arctic Ice', icon: '🧊', correct: true },
            { text: 'Jungle', icon: '🌴', correct: false }
          ]
        }
      ],
      '🐧 Arctic Penguin': [
        {
          question: 'What do arctic penguins eat?',
          answers: [
            { text: 'Fish and squid', icon: '🐟', correct: true },
            { text: 'Grass', icon: '🌱', correct: false },
            { text: 'Candy', icon: '🍬', correct: false }
          ]
        },
        {
          question: 'How do penguins move on ice?',
          answers: [
            { text: 'They drive cars', icon: '🚗', correct: false },
            { text: 'They toboggan on bellies!', icon: '🛷', correct: true },
            { text: 'They fly', icon: '✈️', correct: false }
          ]
        },
        {
          question: 'Can penguins drink saltwater?',
          answers: [
            { text: 'Yes, special glands help!', icon: '💧', correct: true },
            { text: 'No, never', icon: '🚫', correct: false },
            { text: 'Only on Sundays', icon: '📅', correct: false }
          ]
        }
      ]
    };
  }
  
  /**
   * Create the quiz UI
   */
  createUI() {
    this.container = document.createElement('div');
    this.container.id = 'animal-quiz-game';
    this.container.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: none;
      z-index: 3000;
      overflow-y: auto;
      padding: 20px;
      box-sizing: border-box;
    `;
    
    // Main quiz container
    const quizContainer = document.createElement('div');
    quizContainer.id = 'quiz-container';
    quizContainer.style.cssText = `
      max-width: 800px;
      margin: 40px auto;
      background: white;
      border-radius: 30px;
      padding: 40px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
      position: relative;
    `;
    
    // Animal emoji at top
    this.animalEmoji = document.createElement('div');
    this.animalEmoji.style.cssText = `
      font-size: 120px;
      text-align: center;
      margin-bottom: 20px;
      animation: bounce 1s ease-in-out infinite;
    `;
    quizContainer.appendChild(this.animalEmoji);
    
    // Header with counter, timer, and hint
    const headerContainer = document.createElement('div');
    headerContainer.style.cssText = `
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      gap: 15px;
    `;
    
    // Question counter
    this.questionCounter = document.createElement('div');
    this.questionCounter.style.cssText = `
      font-size: 20px;
      color: #667eea;
      font-weight: bold;
      font-family: 'Comic Sans MS', cursive, sans-serif;
    `;
    headerContainer.appendChild(this.questionCounter);
    
    // Timer
    this.timerDisplay = document.createElement('div');
    this.timerDisplay.style.cssText = `
      font-size: 24px;
      color: #4CAF50;
      font-weight: bold;
      font-family: 'Comic Sans MS', cursive, sans-serif;
      padding: 10px 20px;
      background: rgba(76, 175, 80, 0.1);
      border-radius: 10px;
      border: 2px solid #4CAF50;
    `;
    headerContainer.appendChild(this.timerDisplay);
    
    // Hint button
    this.hintButton = document.createElement('button');
    this.hintButton.innerHTML = '💡 Hint';
    this.hintButton.style.cssText = `
      padding: 10px 20px;
      font-size: 18px;
      font-weight: bold;
      color: white;
      background: linear-gradient(135deg, #FFD700, #FFA500);
      border: none;
      border-radius: 10px;
      cursor: pointer;
      box-shadow: 0 4px 8px rgba(0,0,0,0.2);
      font-family: 'Comic Sans MS', cursive, sans-serif;
      transition: transform 0.2s;
    `;
    this.hintButton.onmouseover = () => this.hintButton.style.transform = 'scale(1.05)';
    this.hintButton.onmouseout = () => this.hintButton.style.transform = 'scale(1)';
    this.hintButton.onclick = () => this.showHint();
    headerContainer.appendChild(this.hintButton);
    
    quizContainer.appendChild(headerContainer);
    
    // Question text
    this.questionText = document.createElement('div');
    this.questionText.style.cssText = `
      font-size: 32px;
      font-weight: bold;
      color: #333;
      text-align: center;
      margin-bottom: 40px;
      font-family: 'Comic Sans MS', cursive, sans-serif;
      line-height: 1.4;
    `;
    quizContainer.appendChild(this.questionText);
    
    // Answer buttons container
    this.answersContainer = document.createElement('div');
    this.answersContainer.style.cssText = `
      display: flex;
      flex-direction: column;
      gap: 20px;
      margin-bottom: 20px;
    `;
    quizContainer.appendChild(this.answersContainer);
    
    // Feedback message
    this.feedbackMessage = document.createElement('div');
    this.feedbackMessage.style.cssText = `
      text-align: center;
      font-size: 24px;
      font-weight: bold;
      margin-top: 20px;
      min-height: 40px;
      font-family: 'Comic Sans MS', cursive, sans-serif;
    `;
    quizContainer.appendChild(this.feedbackMessage);
    
    // Next button (hidden initially)
    this.nextButton = document.createElement('button');
    this.nextButton.textContent = 'Next Question →';
    this.nextButton.style.cssText = `
      display: none;
      margin: 20px auto 0;
      padding: 15px 40px;
      font-size: 20px;
      font-weight: bold;
      color: white;
      background: #667eea;
      border: none;
      border-radius: 15px;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      font-family: 'Comic Sans MS', cursive, sans-serif;
      transition: transform 0.2s;
    `;
    this.nextButton.onmouseover = () => this.nextButton.style.transform = 'scale(1.05)';
    this.nextButton.onmouseout = () => this.nextButton.style.transform = 'scale(1)';
    this.nextButton.onclick = () => this.nextQuestion();
    quizContainer.appendChild(this.nextButton);
    
    this.container.appendChild(quizContainer);
    
    // Results screen (hidden initially)
    this.createResultsScreen();
    
    // Confetti canvas
    this.createConfettiCanvas();
    
    // Add animations
    this.addAnimations();
    
    document.body.appendChild(this.container);
  }
  
  /**
   * Create results screen
   */
  createResultsScreen() {
    this.resultsContainer = document.createElement('div');
    this.resultsContainer.id = 'quiz-results';
    this.resultsContainer.style.cssText = `
      max-width: 800px;
      margin: 40px auto;
      background: white;
      border-radius: 30px;
      padding: 40px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
      display: none;
      text-align: center;
    `;
    
    // Results title
    const resultsTitle = document.createElement('h1');
    resultsTitle.textContent = '🎉 Quiz Complete! 🎉';
    resultsTitle.style.cssText = `
      font-size: 48px;
      color: #667eea;
      margin-bottom: 30px;
      font-family: 'Comic Sans MS', cursive, sans-serif;
    `;
    this.resultsContainer.appendChild(resultsTitle);
    
    // Animal emoji
    this.resultsAnimalEmoji = document.createElement('div');
    this.resultsAnimalEmoji.style.cssText = `
      font-size: 100px;
      margin-bottom: 20px;
    `;
    this.resultsContainer.appendChild(this.resultsAnimalEmoji);
    
    // Score display
    this.scoreDisplay = document.createElement('div');
    this.scoreDisplay.style.cssText = `
      font-size: 36px;
      color: #333;
      margin-bottom: 20px;
      font-family: 'Comic Sans MS', cursive, sans-serif;
      font-weight: bold;
    `;
    this.resultsContainer.appendChild(this.scoreDisplay);
    
    // Stars display
    this.starsDisplay = document.createElement('div');
    this.starsDisplay.style.cssText = `
      font-size: 80px;
      margin: 30px 0;
    `;
    this.resultsContainer.appendChild(this.starsDisplay);
    
    // Encouragement message
    this.encouragementMessage = document.createElement('div');
    this.encouragementMessage.style.cssText = `
      font-size: 24px;
      color: #555;
      margin-bottom: 40px;
      font-family: 'Comic Sans MS', cursive, sans-serif;
    `;
    this.resultsContainer.appendChild(this.encouragementMessage);
    
    // Buttons container
    const buttonsContainer = document.createElement('div');
    buttonsContainer.style.cssText = `
      display: flex;
      gap: 20px;
      justify-content: center;
      flex-wrap: wrap;
    `;
    
    // Try Again button
    const tryAgainButton = document.createElement('button');
    tryAgainButton.innerHTML = '🔄 Try Again';
    tryAgainButton.style.cssText = `
      padding: 20px 40px;
      font-size: 24px;
      font-weight: bold;
      color: white;
      background: #FF6B9D;
      border: none;
      border-radius: 15px;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      font-family: 'Comic Sans MS', cursive, sans-serif;
      transition: transform 0.2s;
    `;
    tryAgainButton.onmouseover = () => tryAgainButton.style.transform = 'scale(1.05)';
    tryAgainButton.onmouseout = () => tryAgainButton.style.transform = 'scale(1)';
    tryAgainButton.onclick = () => this.restartQuiz();
    buttonsContainer.appendChild(tryAgainButton);
    
    // Next Animal button
    const nextAnimalButton = document.createElement('button');
    nextAnimalButton.innerHTML = '➡️ Next Animal';
    nextAnimalButton.style.cssText = `
      padding: 20px 40px;
      font-size: 24px;
      font-weight: bold;
      color: white;
      background: #4CAF50;
      border: none;
      border-radius: 15px;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      font-family: 'Comic Sans MS', cursive, sans-serif;
      transition: transform 0.2s;
    `;
    nextAnimalButton.onmouseover = () => nextAnimalButton.style.transform = 'scale(1.05)';
    nextAnimalButton.onmouseout = () => nextAnimalButton.style.transform = 'scale(1)';
    nextAnimalButton.onclick = () => {
      if (this.onNextAnimal) {
        this.onNextAnimal();
      }
    };
    buttonsContainer.appendChild(nextAnimalButton);
    
    // Back to Cards button
    const backButton = document.createElement('button');
    backButton.innerHTML = '← Back to Cards';
    backButton.style.cssText = `
      padding: 20px 40px;
      font-size: 24px;
      font-weight: bold;
      color: white;
      background: #667eea;
      border: none;
      border-radius: 15px;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      font-family: 'Comic Sans MS', cursive, sans-serif;
      transition: transform 0.2s;
    `;
    backButton.onmouseover = () => backButton.style.transform = 'scale(1.05)';
    backButton.onmouseout = () => backButton.style.transform = 'scale(1)';
    backButton.onclick = () => {
      if (this.onComplete) {
        this.onComplete();
      }
    };
    buttonsContainer.appendChild(backButton);
    
    this.resultsContainer.appendChild(buttonsContainer);
    this.container.appendChild(this.resultsContainer);
  }
  
  /**
   * Create confetti canvas for celebrations
   */
  createConfettiCanvas() {
    this.confettiCanvas = document.createElement('canvas');
    this.confettiCanvas.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 3001;
      display: none;
    `;
    this.confettiCanvas.width = window.innerWidth;
    this.confettiCanvas.height = window.innerHeight;
    document.body.appendChild(this.confettiCanvas);
    this.confettiCtx = this.confettiCanvas.getContext('2d');
    this.confettiParticles = [];
  }
  
  /**
   * Add CSS animations
   */
  addAnimations() {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes bounce {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-20px); }
      }
      
      @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-10px); }
        75% { transform: translateX(10px); }
      }
      
      @keyframes correctPulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.1); }
      }
    `;
    document.head.appendChild(style);
  }
  
  /**
   * Start quiz for an animal
   */
  startQuiz(animalName) {
    this.currentAnimal = animalName;
    this.currentQuestionIndex = 0;
    this.score = 0;
    
    const questions = this.quizData[animalName];
    if (!questions) {
      console.error('No quiz data for:', animalName);
      return;
    }
    
    // Get emoji from animal name
    const emojiMatch = animalName.match(/[\u{1F300}-\u{1F9FF}]/u);
    const emoji = emojiMatch ? emojiMatch[0] : '🐾';
    this.animalEmoji.textContent = emoji;
    this.resultsAnimalEmoji.textContent = emoji;
    
    // Show quiz, hide results
    document.getElementById('quiz-container').style.display = 'block';
    this.resultsContainer.style.display = 'none';
    this.container.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    this.showQuestion();
  }
  
  /**
   * Show current question
   */
  showQuestion() {
    const questions = this.quizData[this.currentAnimal];
    const question = questions[this.currentQuestionIndex];
    
    // Reset hint and timer
    this.hintUsed = false;
    this.hintButton.style.display = 'block';
    this.hintButton.disabled = false;
    this.hintButton.style.opacity = '1';
    this.startTimer();
    
    // Show owl
    if (this.owlMascot) {
      this.owlMascot.show();
      this.owlMascot.idle();
    }
    
    // Update UI
    this.questionCounter.textContent = `Question ${this.currentQuestionIndex + 1} of ${this.totalQuestions}`;
    this.questionText.textContent = question.question;
    this.feedbackMessage.textContent = '';
    this.nextButton.style.display = 'none';
    
    // Clear and create answer buttons
    this.answersContainer.innerHTML = '';
    
    question.answers.forEach((answer, index) => {
      const button = document.createElement('button');
      button.className = 'answer-button';
      button.innerHTML = `
        <span style="font-size: 40px; margin-right: 15px;">${answer.icon}</span>
        <span style="font-size: 22px;">${answer.text}</span>
      `;
      button.style.cssText = `
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 25px;
        font-weight: bold;
        color: #333;
        background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        border: 3px solid #667eea;
        border-radius: 15px;
        cursor: pointer;
        transition: all 0.3s;
        font-family: 'Comic Sans MS', cursive, sans-serif;
      `;
      
      button.onmouseover = () => {
        button.style.transform = 'scale(1.05)';
        button.style.boxShadow = '0 8px 20px rgba(0,0,0,0.2)';
      };
      button.onmouseout = () => {
        button.style.transform = 'scale(1)';
        button.style.boxShadow = 'none';
      };
      
      button.onclick = () => {
        this.checkAnswer(answer.correct, button, question.answers);
      };
      
      this.answersContainer.appendChild(button);
    });
  }
  
  /**
   * Check if answer is correct
   */
  checkAnswer(isCorrect, clickedButton, allAnswers) {
    // Stop timer
    this.stopTimer();
    
    // Play click sound
    quizBoothSounds.playClick();
    
    // Disable all buttons
    const buttons = this.answersContainer.querySelectorAll('.answer-button');
    buttons.forEach(btn => {
      btn.style.cursor = 'not-allowed';
      btn.onclick = null;
    });
    
    if (isCorrect) {
      // Correct answer
      this.score++;
      clickedButton.style.background = 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)';
      clickedButton.style.color = 'white';
      clickedButton.style.borderColor = '#4CAF50';
      clickedButton.innerHTML += ' <span style="font-size: 40px; margin-left: 10px;">✅</span>';
      clickedButton.style.animation = 'correctPulse 0.5s ease-in-out 3';
      
      this.feedbackMessage.textContent = '🎉 Correct! Great job! 🎉';
      this.feedbackMessage.style.color = '#4CAF50';
      
      // Play success sound
      quizBoothSounds.playSuccess();
      
      // Owl celebrates
      if (this.owlMascot) {
        this.owlMascot.celebrate();
      }
      
      // Show confetti
      this.showConfetti();
    } else {
      // Wrong answer
      clickedButton.style.background = 'linear-gradient(135deg, #f44336 0%, #da190b 100%)';
      clickedButton.style.color = 'white';
      clickedButton.style.borderColor = '#f44336';
      clickedButton.innerHTML += ' <span style="font-size: 40px; margin-left: 10px;">❌</span>';
      clickedButton.style.animation = 'shake 0.5s ease-in-out';
      
      // Highlight correct answer
      buttons.forEach((btn, index) => {
        if (allAnswers[index].correct) {
          btn.style.background = 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)';
          btn.style.color = 'white';
          btn.style.borderColor = '#4CAF50';
          btn.innerHTML += ' <span style="font-size: 40px; margin-left: 10px;">✅</span>';
        }
      });
      
      this.feedbackMessage.textContent = '❌ Not quite! The correct answer is highlighted.';
      this.feedbackMessage.style.color = '#f44336';
      
      // Play encouragement sound
      quizBoothSounds.playEncouragement();
      
      // Owl encourages
      if (this.owlMascot) {
        this.owlMascot.encourage();
      }
    }
    
    // Show next button
    setTimeout(() => {
      this.nextButton.style.display = 'block';
    }, 1500);
  }
  
  /**
   * Go to next question or show results
   */
  nextQuestion() {
    this.currentQuestionIndex++;
    
    if (this.currentQuestionIndex < this.totalQuestions) {
      this.showQuestion();
    } else {
      this.showResults();
    }
  }
  
  /**
   * Show final results
   */
  showResults() {
    document.getElementById('quiz-container').style.display = 'none';
    this.resultsContainer.style.display = 'block';
    
    this.scoreDisplay.textContent = `You got ${this.score} out of ${this.totalQuestions} correct!`;
    
    // Show stars based on score
    let stars = '';
    let message = '';
    
    if (this.score === 3) {
      stars = '⭐⭐⭐';
      message = 'Perfect! You\'re an animal expert! 🏆';
      this.playSuccessSound();
      this.showConfetti();
    } else if (this.score === 2) {
      stars = '⭐⭐';
      message = 'Great job! You know a lot! 👍';
    } else if (this.score === 1) {
      stars = '⭐';
      message = 'Good try! Keep learning! 📚';
    } else {
      stars = '💪';
      message = 'Nice effort! Try again to learn more! 🌟';
    }
    
    this.starsDisplay.textContent = stars;
    this.encouragementMessage.textContent = message;
  }
  
  /**
   * Restart the same quiz
   */
  restartQuiz() {
    this.startQuiz(this.currentAnimal);
  }
  
  /**
   * Close quiz
   */
  close() {
    this.container.style.display = 'none';
    document.body.style.overflow = 'auto';
    this.confettiCanvas.style.display = 'none';
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
    
    oscillator.frequency.setValueAtTime(523, this.audioContext.currentTime); // C5
    oscillator.frequency.setValueAtTime(659, this.audioContext.currentTime + 0.1); // E5
    oscillator.frequency.setValueAtTime(784, this.audioContext.currentTime + 0.2); // G5
    
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
   * Start timer
   */
  startTimer() {
    this.timeLeft = 30;
    this.updateTimerDisplay();
    
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
    
    this.timerInterval = setInterval(() => {
      this.timeLeft--;
      this.updateTimerDisplay();
      
      // Play tick sound when time is running low
      if (this.timeLeft <= 10 && this.timeLeft > 0) {
        quizBoothSounds.playTick();
        this.timerDisplay.style.color = '#FF4757';
        this.timerDisplay.style.borderColor = '#FF4757';
      }
      
      if (this.timeLeft <= 0) {
        this.stopTimer();
        this.handleTimeout();
      }
    }, 1000);
  }
  
  /**
   * Stop timer
   */
  stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }
  
  /**
   * Update timer display
   */
  updateTimerDisplay() {
    this.timerDisplay.textContent = `⏱️ ${this.timeLeft}s`;
    
    if (this.timeLeft > 10) {
      this.timerDisplay.style.color = '#4CAF50';
      this.timerDisplay.style.borderColor = '#4CAF50';
    } else if (this.timeLeft > 5) {
      this.timerDisplay.style.color = '#FFA500';
      this.timerDisplay.style.borderColor = '#FFA500';
    }
  }
  
  /**
   * Handle timeout
   */
  handleTimeout() {
    // Disable all buttons
    const buttons = this.answersContainer.querySelectorAll('.answer-button');
    buttons.forEach(btn => {
      btn.onclick = null;
      btn.style.cursor = 'not-allowed';
      btn.style.opacity = '0.5';
    });
    
    this.feedbackMessage.textContent = "⏰ Time's up!";
    this.feedbackMessage.style.color = '#FFA500';
    
    if (this.owlMascot) {
      this.owlMascot.timesUp();
    }
    
    setTimeout(() => {
      this.nextButton.style.display = 'block';
    }, 1500);
  }
  
  /**
   * Show hint
   */
  showHint() {
    if (this.hintUsed) return;
    
    quizBoothSounds.playHint();
    this.hintUsed = true;
    
    if (this.owlMascot) {
      this.owlMascot.think();
    }
    
    // Find correct answer and highlight it subtly
    const buttons = this.answersContainer.querySelectorAll('.answer-button');
    const questions = this.quizData[this.currentAnimal];
    const question = questions[this.currentQuestionIndex];
    
    buttons.forEach((btn, index) => {
      if (question.answers[index].correct) {
        btn.style.border = '5px solid #FFD700';
        btn.style.animation = 'correctPulse 1s ease-in-out 2';
      }
    });
    
    // Disable hint button
    this.hintButton.disabled = true;
    this.hintButton.style.opacity = '0.5';
    this.hintButton.style.cursor = 'not-allowed';
  }
  
  /**
   * Show confetti animation
   */
  showConfetti() {
    this.confettiCanvas.style.display = 'block';
    this.confettiParticles = [];
    
    // Create confetti particles
    const colors = ['#FF6B9D', '#4CAF50', '#FFD700', '#667eea', '#FF69B4', '#00FFFF'];
    
    for (let i = 0; i < 100; i++) {
      this.confettiParticles.push({
        x: Math.random() * this.confettiCanvas.width,
        y: -10,
        vx: (Math.random() - 0.5) * 4,
        vy: Math.random() * 3 + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 8 + 4,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10
      });
    }
    
    this.animateConfetti();
  }
  
  /**
   * Animate confetti particles
   */
  animateConfetti() {
    this.confettiCtx.clearRect(0, 0, this.confettiCanvas.width, this.confettiCanvas.height);
    
    let activeParticles = 0;
    
    this.confettiParticles.forEach(particle => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.vy += 0.1; // Gravity
      particle.rotation += particle.rotationSpeed;
      
      if (particle.y < this.confettiCanvas.height) {
        activeParticles++;
        
        this.confettiCtx.save();
        this.confettiCtx.translate(particle.x, particle.y);
        this.confettiCtx.rotate((particle.rotation * Math.PI) / 180);
        this.confettiCtx.fillStyle = particle.color;
        this.confettiCtx.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size);
        this.confettiCtx.restore();
      }
    });
    
    if (activeParticles > 0) {
      requestAnimationFrame(() => this.animateConfetti());
    } else {
      this.confettiCanvas.style.display = 'none';
    }
  }
}
