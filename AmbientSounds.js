/**
 * Ambient sound manager for zone-based audio
 * Gentle sounds change as player walks through different areas
 */

export class AmbientSoundManager {
  constructor() {
    this.currentZone = null;
    this.audioContext = null;
    this.gainNode = null;
    this.oscillators = [];
    this.isInitialized = false;
    this.isMuted = false;
  }
  
  /**
   * Initialize Web Audio API (call after user interaction)
   */
  initialize() {
    if (this.isInitialized) return;
    
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      this.gainNode = this.audioContext.createGain();
      this.gainNode.connect(this.audioContext.destination);
      this.gainNode.gain.value = 0.15; // Gentle volume
      this.isInitialized = true;
    } catch (e) {
      console.warn('Web Audio API not supported', e);
    }
  }
  
  /**
   * Determine which zone the player is in based on position
   */
  getZone(playerPosition) {
    const x = playerPosition.x;
    const z = playerPosition.z;
    
    // Safari area (TOP ROW - back)
    if (z < -60) return 'safari';
    
    // Water area (MIDDLE RIGHT)
    if (x > 15 && z > -60 && z < 0) return 'water';
    
    // Forest area (MIDDLE LEFT)
    if (x < -15 && z > -60 && z < 0) return 'forest';
    
    // Garden area (BOTTOM LEFT)
    if (x < -15 && z > 0 && z < 50) return 'garden';
    
    // Small animals (BOTTOM RIGHT) - use garden sounds
    if (x > 15 && z > 0 && z < 50) return 'garden';
    
    // Entrance plaza (south entrance)
    if (z > 50) return 'plaza';
    
    // Central paths
    return 'plaza';
  }
  
  /**
   * Update ambient sounds based on player position
   */
  update(playerPosition) {
    if (!this.isInitialized || this.isMuted) return;
    
    const newZone = this.getZone(playerPosition);
    
    if (newZone !== this.currentZone) {
      this.transitionToZone(newZone);
      this.currentZone = newZone;
    }
  }
  
  /**
   * Transition to new zone's ambient sounds
   */
  transitionToZone(zone) {
    // Fade out current sounds
    this.stopAllOscillators();
    
    // Start new zone sounds
    switch(zone) {
      case 'safari':
        this.playSafariAmbience();
        break;
      case 'water':
        this.playWaterAmbience();
        break;
      case 'forest':
        this.playForestAmbience();
        break;
      case 'garden':
        this.playGardenAmbience();
        break;
      case 'plaza':
        this.playPlazaAmbience();
        break;
    }
  }
  
  /**
   * Safari ambience - warm, open savanna feel
   */
  playSafariAmbience() {
    // Warm wind sound (low frequency)
    this.createTone(120, 'sine', 0.03, 0.5);
    // Distant animal calls (varied tones)
    this.createPulseTone(240, 'sine', 0.02, 3, 0.6);
    // Gentle breeze
    this.createNoise(0.01, 'pink');
  }
  
  /**
   * Water ambience - flowing, splashing sounds
   */
  playWaterAmbience() {
    // Gentle water flow
    this.createNoise(0.02, 'pink', 800, 2000);
    // Splashing rhythm
    this.createPulseTone(180, 'sine', 0.015, 2, 0.7);
    // Bird calls near water
    this.createPulseTone(800, 'sine', 0.01, 4, 0.3);
  }
  
  /**
   * Forest ambience - rustling leaves, bird songs
   */
  playForestAmbience() {
    // Rustling leaves (filtered noise)
    this.createNoise(0.015, 'brown', 400, 1200);
    // Bird chirps
    this.createPulseTone(1200, 'sine', 0.012, 2.5, 0.4);
    this.createPulseTone(1800, 'sine', 0.008, 3.5, 0.5);
    // Gentle wind through trees
    this.createTone(150, 'sine', 0.02, 0.6);
  }
  
  /**
   * Garden ambience - buzzing bees, fluttering butterflies
   */
  playGardenAmbience() {
    // Bee buzzing
    this.createTone(220, 'sawtooth', 0.008, 0.5);
    this.createTone(225, 'sawtooth', 0.007, 0.5);
    // Gentle breeze
    this.createNoise(0.012, 'pink', 600, 1800);
    // Cheerful bird songs
    this.createPulseTone(1400, 'sine', 0.01, 2, 0.4);
  }
  
  /**
   * Plaza ambience - general zoo atmosphere
   */
  playPlazaAmbience() {
    // Gentle ambient hum
    this.createTone(100, 'sine', 0.015, 0.6);
    // Mixed distant sounds
    this.createNoise(0.008, 'pink', 300, 1500);
    // Cheerful atmosphere
    this.createPulseTone(400, 'sine', 0.01, 4, 0.5);
  }
  
  /**
   * Create a continuous tone
   */
  createTone(frequency, type, volume, detune = 0) {
    if (!this.audioContext) return;
    
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    oscillator.type = type;
    oscillator.frequency.value = frequency;
    oscillator.detune.value = detune * 100;
    
    gainNode.gain.value = volume;
    
    oscillator.connect(gainNode);
    gainNode.connect(this.gainNode);
    
    oscillator.start();
    this.oscillators.push({ osc: oscillator, gain: gainNode });
  }
  
  /**
   * Create a pulsing tone
   */
  createPulseTone(frequency, type, volume, pulseRate, dutyCycle = 0.5) {
    if (!this.audioContext) return;
    
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    const lfo = this.audioContext.createOscillator();
    const lfoGain = this.audioContext.createGain();
    
    oscillator.type = type;
    oscillator.frequency.value = frequency;
    
    lfo.type = 'square';
    lfo.frequency.value = pulseRate;
    
    lfoGain.gain.value = volume;
    gainNode.gain.value = 0;
    
    lfo.connect(lfoGain);
    lfoGain.connect(gainNode.gain);
    
    oscillator.connect(gainNode);
    gainNode.connect(this.gainNode);
    
    oscillator.start();
    lfo.start();
    
    this.oscillators.push({ osc: oscillator, gain: gainNode, lfo: lfo });
  }
  
  /**
   * Create filtered noise
   */
  createNoise(volume, color = 'white', lowFreq = 20, highFreq = 20000) {
    if (!this.audioContext) return;
    
    const bufferSize = 4096;
    const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
    const data = buffer.getChannelData(0);
    
    // Generate noise based on color
    if (color === 'white') {
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
    } else if (color === 'pink') {
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        data[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
        data[i] *= 0.11;
        b6 = white * 0.115926;
      }
    } else if (color === 'brown') {
      let lastOut = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        data[i] = (lastOut + (0.02 * white)) / 1.02;
        lastOut = data[i];
        data[i] *= 3.5;
      }
    }
    
    const source = this.audioContext.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    
    const gainNode = this.audioContext.createGain();
    gainNode.gain.value = volume;
    
    const filter = this.audioContext.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = (lowFreq + highFreq) / 2;
    filter.Q.value = 0.5;
    
    source.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.gainNode);
    
    source.start();
    this.oscillators.push({ osc: source, gain: gainNode });
  }
  
  /**
   * Stop all current oscillators with fade out
   */
  stopAllOscillators() {
    if (!this.audioContext) return;
    
    const currentTime = this.audioContext.currentTime;
    
    this.oscillators.forEach(item => {
      try {
        item.gain.gain.exponentialRampToValueAtTime(0.001, currentTime + 0.5);
        setTimeout(() => {
          try {
            if (item.osc) item.osc.stop();
            if (item.lfo) item.lfo.stop();
          } catch (e) {
            // Already stopped
          }
        }, 600);
      } catch (e) {
        // Ignore errors
      }
    });
    
    this.oscillators = [];
  }
  
  /**
   * Toggle mute
   */
  toggleMute() {
    this.isMuted = !this.isMuted;
    
    if (this.isMuted) {
      this.stopAllOscillators();
    } else if (this.currentZone) {
      this.transitionToZone(this.currentZone);
    }
    
    return this.isMuted;
  }
  
  /**
   * Cleanup
   */
  dispose() {
    this.stopAllOscillators();
    if (this.audioContext) {
      this.audioContext.close();
    }
  }
}
