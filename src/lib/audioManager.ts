// ELEVATOR.EXE Audio Manager
// MP3 music + procedural sound effects with fallback

export type AudioLayer = 'ambient' | 'tension' | 'heartbeat' | 'glitch' | 'transition';

class AudioManager {
  private audioContext: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private layers: Map<AudioLayer, { gain: GainNode; oscillators: OscillatorNode[] }> = new Map();
  private musicAudio: HTMLAudioElement | null = null;
  private isInitialized = false;
  private currentTrack: string | null = null;
  private userHasInteracted = false;
  private musicLoaded = false;
  private ambientOscillator: OscillatorNode | null = null;

  async initialize() {
    if (this.isInitialized) return;
    
    try {
      this.audioContext = new AudioContext();
      this.masterGain = this.audioContext.createGain();
      this.masterGain.gain.value = 0.5;
      this.masterGain.connect(this.audioContext.destination);
      
      // Create procedural audio layers
      ['ambient', 'tension', 'heartbeat', 'glitch'].forEach(layer => {
        const gain = this.audioContext!.createGain();
        gain.gain.value = 0;
        gain.connect(this.masterGain!);
        this.layers.set(layer as AudioLayer, { gain, oscillators: [] });
      });
      
      this.isInitialized = true;
      console.log('🔊 Audio system initialized');
    } catch (e) {
      console.error('Failed to initialize audio:', e);
    }
  }

  // Play music track with fallback to procedural ambient
  playMusic(trackId: string) {
    console.log(`🎵 playMusic: ${trackId}`);
    
    // Stop any current music
    this.stopMusic();
    
    // Map track IDs to file paths
    const trackPaths: Record<string, string> = {
      'menu': '/assets/audio/menu_music.mp3',
      'ingame': '/assets/audio/ingame_music.mp3'
    };
    
    const src = trackPaths[trackId];
    
    if (src) {
      // Try to load MP3
      this.musicAudio = new Audio();
      this.musicAudio.loop = true;
      this.musicAudio.volume = 0.3;
      this.musicAudio.preload = 'auto';
      
      this.musicAudio.addEventListener('canplaythrough', () => {
        console.log(`🎵 Music loaded: ${trackId}`);
        this.musicLoaded = true;
        if (this.musicAudio) {
          this.musicAudio.play().catch(e => {
            console.warn('🎵 MP3 play failed, using ambient:', e);
            this.startProceduralAmbient();
          });
        }
      }, { once: true });
      
      this.musicAudio.addEventListener('error', (e) => {
        console.warn('🎵 MP3 load failed, using ambient:', e);
        this.startProceduralAmbient();
      }, { once: true });
      
      this.musicAudio.src = src;
      this.musicAudio.load();
      this.currentTrack = trackId;
    } else {
      // No track path, use procedural
      this.startProceduralAmbient();
    }
  }

  // Procedural ambient sound as fallback
  private startProceduralAmbient() {
    if (!this.audioContext || !this.masterGain) return;
    
    // Stop any existing ambient
    if (this.ambientOscillator) {
      try { this.ambientOscillator.stop(); } catch (e) {}
    }
    
    // Create ambient drone
    this.ambientOscillator = this.audioContext.createOscillator();
    const ambientGain = this.audioContext.createGain();
    const filter = this.audioContext.createBiquadFilter();
    
    this.ambientOscillator.type = 'sine';
    this.ambientOscillator.frequency.value = 80;
    
    filter.type = 'lowpass';
    filter.frequency.value = 200;
    filter.Q.value = 1;
    
    ambientGain.gain.value = 0.05;
    
    this.ambientOscillator.connect(filter);
    filter.connect(ambientGain);
    ambientGain.connect(this.masterGain);
    
    this.ambientOscillator.start();
    
    // Add LFO for movement
    const lfo = this.audioContext.createOscillator();
    const lfoGain = this.audioContext.createGain();
    lfo.frequency.value = 0.1;
    lfoGain.gain.value = 10;
    lfo.connect(lfoGain);
    lfoGain.connect(this.ambientOscillator.frequency);
    lfo.start();
    
    console.log('🎵 Procedural ambient started');
  }

  // Stop music
  stopMusic() {
    console.log('🎵 Stopping music');
    
    if (this.musicAudio) {
      this.musicAudio.pause();
      this.musicAudio.src = '';
      this.musicAudio = null;
    }
    
    if (this.ambientOscillator) {
      try { this.ambientOscillator.stop(); } catch (e) {}
      this.ambientOscillator = null;
    }
    
    this.currentTrack = null;
    this.musicLoaded = false;
  }

  // Start menu music
  async startMenuMusic() {
    if (!this.userHasInteracted) {
      console.log('🎵 Need user interaction for menu music');
      return;
    }
    await this.resume();
    this.playMusic('menu');
  }

  // Start ingame music
  async startIngameMusic() {
    if (!this.userHasInteracted) {
      console.log('🎵 Need user interaction for ingame music');
      return;
    }
    await this.resume();
    this.playMusic('ingame');
  }

  // UI Click sound
  playClick() {
    if (!this.audioContext || !this.isInitialized) return;
    
    try {
      const osc = this.audioContext.createOscillator();
      const gain = this.audioContext.createGain();
      
      osc.type = 'sine';
      osc.frequency.value = 800;
      gain.gain.value = 0.15;
      
      osc.connect(gain);
      gain.connect(this.masterGain!);
      
      osc.start();
      osc.frequency.exponentialRampToValueAtTime(400, this.audioContext.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.1);
      osc.stop(this.audioContext.currentTime + 0.1);
    } catch (e) {}
  }

  // Typewriter key sound
  playTypeKey() {
    if (!this.audioContext || !this.isInitialized) return;
    
    try {
      const osc = this.audioContext.createOscillator();
      const gain = this.audioContext.createGain();
      
      osc.type = 'square';
      osc.frequency.value = 200 + Math.random() * 100;
      gain.gain.value = 0.03;
      
      osc.connect(gain);
      gain.connect(this.masterGain!);
      
      osc.start();
      osc.stop(this.audioContext.currentTime + 0.02);
    } catch (e) {}
  }

  // Choice select sound
  playChoiceSelect() {
    if (!this.audioContext || !this.isInitialized) return;
    
    try {
      const osc = this.audioContext.createOscillator();
      const gain = this.audioContext.createGain();
      
      osc.type = 'triangle';
      osc.frequency.value = 440;
      gain.gain.value = 0.12;
      
      osc.connect(gain);
      gain.connect(this.masterGain!);
      
      osc.start();
      osc.frequency.setValueAtTime(440, this.audioContext.currentTime);
      osc.frequency.setValueAtTime(550, this.audioContext.currentTime + 0.05);
      osc.frequency.setValueAtTime(660, this.audioContext.currentTime + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.2);
      osc.stop(this.audioContext.currentTime + 0.2);
    } catch (e) {}
  }

  // Floor change sound
  playFloorChange() {
    if (!this.audioContext || !this.isInitialized) return;
    
    try {
      const osc1 = this.audioContext.createOscillator();
      const osc2 = this.audioContext.createOscillator();
      const gain = this.audioContext.createGain();
      
      osc1.type = 'sine';
      osc2.type = 'triangle';
      osc1.frequency.value = 200;
      osc2.frequency.value = 300;
      gain.gain.value = 0.15;
      
      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.masterGain!);
      
      osc1.start();
      osc2.start();
      
      osc1.frequency.exponentialRampToValueAtTime(100, this.audioContext.currentTime + 0.3);
      osc2.frequency.exponentialRampToValueAtTime(150, this.audioContext.currentTime + 0.3);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.4);
      
      osc1.stop(this.audioContext.currentTime + 0.4);
      osc2.stop(this.audioContext.currentTime + 0.4);
    } catch (e) {}
  }

  // Ending sound
  playEnding(type: 'INTEGRATION' | 'SOLIDIFICATION' | 'COLLAPSE' | 'TRANSCENDENCE') {
    this.stopMusic();
    
    if (!this.audioContext || !this.isInitialized) return;
    
    const configs = {
      INTEGRATION: { notes: [523, 659, 784], duration: 2 },
      SOLIDIFICATION: { notes: [200, 180, 160], duration: 2 },
      COLLAPSE: { notes: [150, 100, 50], duration: 3 },
      TRANSCENDENCE: { notes: [440, 550, 660, 880], duration: 2.5 }
    };
    
    const config = configs[type];
    
    config.notes.forEach((freq, i) => {
      const osc = this.audioContext!.createOscillator();
      const gain = this.audioContext!.createGain();
      
      osc.type = type === 'TRANSCENDENCE' ? 'sine' : type === 'COLLAPSE' ? 'sawtooth' : 'triangle';
      osc.frequency.value = freq;
      gain.gain.value = 0;
      
      osc.connect(gain);
      gain.connect(this.masterGain!);
      
      const startTime = this.audioContext!.currentTime + i * 0.3;
      osc.start(startTime);
      gain.gain.setTargetAtTime(0.12, startTime, 0.1);
      gain.gain.setTargetAtTime(0, startTime + config.duration - 0.3, 0.5);
      osc.stop(startTime + config.duration);
    });
  }

  // Set master volume
  setVolume(volume: number) {
    const v = Math.max(0, Math.min(1, volume));
    if (this.masterGain) {
      this.masterGain.gain.value = v;
    }
    if (this.musicAudio) {
      this.musicAudio.volume = v * 0.6;
    }
  }

  // Stop all audio
  stopAll() {
    this.stopMusic();
  }

  // Resume audio context
  async resume() {
    console.log('🔊 Resume - AudioContext state:', this.audioContext?.state);
    if (this.audioContext && this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
      console.log('🔊 AudioContext resumed:', this.audioContext.state);
    }
    this.userHasInteracted = true;
  }

  // Change floor
  changeFloor(floor: string) {
    this.playFloorChange();
  }
}

// Singleton instance
export const audioManager = new AudioManager();
