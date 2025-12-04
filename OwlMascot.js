/**
 * Owl Mascot - Interactive animated owl character that reacts to gameplay
 */
export class OwlMascot {
  constructor(containerId) {
    this.container = document.getElementById(containerId) || document.body;
    this.owlElement = null;
    this.speechBubble = null;
    this.currentAnimation = null;
    
    this.createOwl();
  }
  
  /**
   * Create the owl mascot
   */
  createOwl() {
    // Owl container
    this.owlElement = document.createElement('div');
    this.owlElement.id = 'owl-mascot';
    this.owlElement.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 120px;
      height: 120px;
      z-index: 5000;
      pointer-events: none;
    `;
    
    // Owl body
    const owlBody = document.createElement('div');
    owlBody.style.cssText = `
      position: relative;
      width: 100%;
      height: 100%;
      animation: owlFloat 3s ease-in-out infinite;
    `;
    
    // Owl emoji
    const owlEmoji = document.createElement('div');
    owlEmoji.textContent = '🦉';
    owlEmoji.style.cssText = `
      font-size: 100px;
      text-align: center;
      filter: drop-shadow(0 4px 8px rgba(0,0,0,0.3));
      transform-origin: center;
    `;
    owlBody.appendChild(owlEmoji);
    
    this.owlEmoji = owlEmoji;
    this.owlElement.appendChild(owlBody);
    
    // Speech bubble
    this.speechBubble = document.createElement('div');
    this.speechBubble.style.cssText = `
      position: absolute;
      bottom: 130px;
      right: 0;
      background: white;
      padding: 15px 20px;
      border-radius: 20px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      font-family: 'Comic Sans MS', cursive, sans-serif;
      font-size: 16px;
      font-weight: bold;
      color: #333;
      white-space: nowrap;
      display: none;
      animation: bubblePop 0.3s ease-out;
      border: 3px solid #FFD700;
    `;
    
    // Speech bubble pointer
    const pointer = document.createElement('div');
    pointer.style.cssText = `
      position: absolute;
      bottom: -15px;
      right: 40px;
      width: 0;
      height: 0;
      border-left: 15px solid transparent;
      border-right: 15px solid transparent;
      border-top: 15px solid white;
    `;
    this.speechBubble.appendChild(pointer);
    
    this.owlElement.appendChild(this.speechBubble);
    
    // Add animations
    this.addAnimations();
    
    this.container.appendChild(this.owlElement);
  }
  
  /**
   * Add CSS animations
   */
  addAnimations() {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes owlFloat {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
      }
      
      @keyframes owlCelebrate {
        0%, 100% { transform: rotate(0deg) scale(1); }
        25% { transform: rotate(-15deg) scale(1.1); }
        50% { transform: rotate(15deg) scale(1.2); }
        75% { transform: rotate(-10deg) scale(1.1); }
      }
      
      @keyframes owlEncourage {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.15); }
      }
      
      @keyframes owlThink {
        0%, 100% { transform: rotate(0deg); }
        50% { transform: rotate(-10deg); }
      }
      
      @keyframes bubblePop {
        0% { transform: scale(0); opacity: 0; }
        50% { transform: scale(1.1); }
        100% { transform: scale(1); opacity: 1; }
      }
      
      @keyframes owlBounce {
        0%, 100% { transform: translateY(0); }
        25% { transform: translateY(-20px); }
        50% { transform: translateY(-10px); }
        75% { transform: translateY(-15px); }
      }
    `;
    document.head.appendChild(style);
  }
  
  /**
   * Show the owl
   */
  show() {
    this.owlElement.style.display = 'block';
    this.idle();
  }
  
  /**
   * Hide the owl
   */
  hide() {
    this.owlElement.style.display = 'none';
    this.speechBubble.style.display = 'none';
  }
  
  /**
   * Idle state
   */
  idle() {
    this.owlEmoji.style.animation = 'none';
    setTimeout(() => {
      this.owlEmoji.style.animation = '';
    }, 10);
    this.hideSpeech();
  }
  
  /**
   * Celebrate correct answer
   */
  celebrate() {
    this.owlEmoji.style.animation = 'owlCelebrate 0.6s ease-in-out 3';
    
    const messages = [
      '🎉 Amazing!',
      '⭐ Perfect!',
      '🌟 Brilliant!',
      '👏 Great job!',
      '💫 Fantastic!',
      '🏆 Excellent!'
    ];
    
    this.showSpeech(messages[Math.floor(Math.random() * messages.length)]);
    
    setTimeout(() => this.idle(), 2000);
  }
  
  /**
   * Encourage after wrong answer
   */
  encourage() {
    this.owlEmoji.style.animation = 'owlEncourage 0.5s ease-in-out 2';
    
    const messages = [
      "💪 You've got this!",
      "🌈 Keep trying!",
      "✨ Don't give up!",
      "🎯 Try again!",
      "🌟 You can do it!",
      "💝 Almost there!"
    ];
    
    this.showSpeech(messages[Math.floor(Math.random() * messages.length)]);
    
    setTimeout(() => this.idle(), 2500);
  }
  
  /**
   * Think animation (for hints)
   */
  think() {
    this.owlEmoji.style.animation = 'owlThink 0.8s ease-in-out 2';
    this.showSpeech('🤔 Hmm... Let me help!');
    
    setTimeout(() => this.idle(), 2000);
  }
  
  /**
   * Welcome animation
   */
  welcome() {
    this.owlEmoji.style.animation = 'owlBounce 0.6s ease-out 2';
    this.showSpeech('👋 Welcome! Have fun learning!');
    
    setTimeout(() => this.idle(), 3000);
  }
  
  /**
   * Time's up animation
   */
  timesUp() {
    this.owlEmoji.style.animation = 'owlEncourage 0.4s ease-in-out 4';
    this.showSpeech("⏰ Time's up! But that's okay!");
    
    setTimeout(() => this.idle(), 2500);
  }
  
  /**
   * Show speech bubble
   */
  showSpeech(message) {
    this.speechBubble.textContent = message;
    this.speechBubble.style.display = 'block';
    this.speechBubble.style.animation = 'bubblePop 0.3s ease-out';
  }
  
  /**
   * Hide speech bubble
   */
  hideSpeech() {
    setTimeout(() => {
      this.speechBubble.style.display = 'none';
    }, 2000);
  }
  
  /**
   * Custom message
   */
  say(message) {
    this.showSpeech(message);
    setTimeout(() => this.hideSpeech(), 2500);
  }
}
