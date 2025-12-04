/**
 * Quiz Booth Sound System - Manages all audio for the Quiz Booth
 * Includes background music, sound effects, and voice encouragements
 */
export class QuizBoothSounds {
  constructor() {
    this.audioContext = null;
    this.backgroundMusicGain = null;
    this.isMuted = false;
    this.currentMusic = null;
    this.musicInterval = null;
  }
  
  /**
   * Initialize audio context
   */
  init() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      this.backgroundMusicGain = this.audioContext.createGain();
      this.backgroundMusicGain.connect(this.audioContext.destination);
      this.backgroundMusicGain.gain.value = 0.3; // Quiet background music
    }
  }
  
  /**
   * Play cheerful background music
   */
  playBackgroundMusic() {
    this.init();
    if (this.musicInterval) return; // Already playing
    
    // Simple cheerful melody
    const melody = [
      { note: 523.25, duration: 0.3 }, // C5
      { note: 587.33, duration: 0.3 }, // D5
      { note: 659.25, duration: 0.3 }, // E5
      { note: 698.46, duration: 0.3 }, // F5
      { note: 783.99, duration: 0.6 }, // G5
      { note: 698.46, duration: 0.3 }, // F5
      { note: 659.25, duration: 0.3 }, // E5
      { note: 587.33, duration: 0.6 }, // D5
      { note: 523.25, duration: 0.9 }  // C5
    ];
    
    let currentNote = 0;
    
    const playNote = () => {
      if (this.isMuted) return;
      
      const note = melody[currentNote];
      const oscillator = this.audioContext.createOscillator();
      const noteGain = this.audioContext.createGain();
      
      oscillator.type = 'sine';
      oscillator.frequency.value = note.note;
      
      oscillator.connect(noteGain);
      noteGain.connect(this.backgroundMusicGain);
      
      noteGain.gain.setValueAtTime(0.1, this.audioContext.currentTime);
      noteGain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + note.duration);
      
      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + note.duration);
      
      currentNote = (currentNote + 1) % melody.length;
    };
    
    // Play notes in sequence
    this.musicInterval = setInterval(playNote, 400);
  }
  
  /**
   * Stop background music
   */
  stopBackgroundMusic() {
    if (this.musicInterval) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
  }
  
  /**
   * Play card swoosh sound
   */
  playSwoosh() {
    this.init();
    if (this.isMuted) return;
    
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(200, this.audioContext.currentTime + 0.2);
    
    gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2);
    
    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.2);
  }
  
  /**
   * Play button click sound
   */
  playClick() {
    this.init();
    if (this.isMuted) return;
    
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    oscillator.type = 'sine';
    oscillator.frequency.value = 600;
    
    gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
    
    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.1);
  }
  
  /**
   * Play success celebration sound
   */
  playSuccess() {
    this.init();
    if (this.isMuted) return;
    
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    oscillator.type = 'square';
    oscillator.frequency.setValueAtTime(523, this.audioContext.currentTime);
    oscillator.frequency.setValueAtTime(659, this.audioContext.currentTime + 0.1);
    oscillator.frequency.setValueAtTime(784, this.audioContext.currentTime + 0.2);
    oscillator.frequency.setValueAtTime(1047, this.audioContext.currentTime + 0.3);
    
    gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5);
    
    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.5);
  }
  
  /**
   * Play encouraging sound
   */
  playEncouragement() {
    this.init();
    if (this.isMuted) return;
    
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(400, this.audioContext.currentTime);
    oscillator.frequency.setValueAtTime(500, this.audioContext.currentTime + 0.15);
    
    gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);
    
    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.3);
  }
  
  /**
   * Play timer tick sound
   */
  playTick() {
    this.init();
    if (this.isMuted) return;
    
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    oscillator.type = 'sine';
    oscillator.frequency.value = 800;
    
    gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.05);
    
    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.05);
  }
  
  /**
   * Play hint reveal sound
   */
  playHint() {
    this.init();
    if (this.isMuted) return;
    
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(700, this.audioContext.currentTime);
    oscillator.frequency.setValueAtTime(900, this.audioContext.currentTime + 0.2);
    
    gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.4);
    
    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.4);
  }
  
  /**
   * Mute/unmute all sounds
   */
  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.stopBackgroundMusic();
    }
    return this.isMuted;
  }
  
  /**
   * Set volume
   */
  setVolume(volume) {
    if (this.backgroundMusicGain) {
      this.backgroundMusicGain.gain.value = volume;
    }
  }
}

// Global instance
export const quizBoothSounds = new QuizBoothSounds();
