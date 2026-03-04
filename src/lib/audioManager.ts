// ELEVATOR.EXE Audio Manager
// Hybrid system: MP3 music + procedural sound effects

export type AudioLayer = 'ambient' | 'tension' | 'heartbeat' | 'glitch' | 'transition';
export type MusicTrack = 'menu' | 'ingame' | 'ending_integration' | 'ending_solidification' | 'ending_collapse' | 'ending_transcendence';

class AudioManager {
  private audioContext: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private layers: Map<AudioLayer, { gain: GainNode; oscillators: OscillatorNode[] }> = new Map();
  private musicElements: Map<string, HTMLAudioElement> = new Map();
  private isInitialized = false;
  private currentTrack: string | null = null;

  async initialize() {
    if (this.isInitialized) return;
    
    try {
      this.audioContext = new AudioContext();
      this.masterGain = this.audioContext.createGain();
      this.masterGain.gain.value = 0.3;
      this.masterGain.connect(this.audioContext.destination);
      
      // Create procedural audio layers
      ['ambient', 'tension', 'heartbeat', 'glitch'].forEach(layer => {
        const gain = this.audioContext!.createGain();
        gain.gain.value = 0;
        gain.connect(this.masterGain!);
        this.layers.set(layer as AudioLayer, { gain, oscillators: [] });
      });
      
      // Preload music tracks
      this.preloadMusic('menu', '/assets/audio/menu_music.mp3');
      this.preloadMusic('ingame', '/assets/audio/ingame_music.mp3');
      
      this.isInitialized = true;
      console.log('🔊 Audio system initialized with MP3 music support');
    } catch (e) {
      console.error('Failed to initialize audio:', e);
    }
  }

  // Preload MP3 music
  private preloadMusic(id: string, src: string) {
    const audio = new Audio(src);
    audio.loop = true;
    audio.volume = 0.5;
    audio.preload = 'auto';
    this.musicElements.set(id, audio);
  }

  // Play MP3 music track
  playMusic(trackId: string, fadeIn: boolean = true) {
    const audio = this.musicElements.get(trackId);
    if (!audio) {
      console.warn(`Music track not found: ${trackId}`);
      return;
    }

    // Stop current track if different
    if (this.currentTrack && this.currentTrack !== trackId) {
      this.stopMusic();
    }

    if (this.currentTrack === trackId) return; // Already playing

    // Play new track
    audio.currentTime = 0;
    if (fadeIn) {
      audio.volume = 0;
      audio.play().catch(e => console.log('Audio autoplay blocked:', e));
      this.fadeMusicIn(audio, 0.5, 2000);
    } else {
      audio.volume = 0.5;
      audio.play().catch(e => console.log('Audio autoplay blocked:', e));
    }
    
    this.currentTrack = trackId;
    console.log(`🎵 Playing: ${trackId}`);
  }

  // Fade in music
  private fadeMusicIn(audio: HTMLAudioElement, targetVolume: number, duration: number) {
    const steps = 20;
    const stepTime = duration / steps;
    const volumeStep = targetVolume / steps;
    let currentStep = 0;
    
    const fadeInterval = setInterval(() => {
      currentStep++;
      audio.volume = Math.min(volumeStep * currentStep, targetVolume);
      if (currentStep >= steps) {
        clearInterval(fadeInterval);
      }
    }, stepTime);
  }

  // Stop music
  stopMusic(fadeOut: boolean = true) {
    if (!this.currentTrack) return;
    
    const audio = this.musicElements.get(this.currentTrack);
    if (audio) {
      if (fadeOut) {
        const fadeInterval = setInterval(() => {
          audio.volume = Math.max(0, audio.volume - 0.05);
          if (audio.volume <= 0) {
            audio.pause();
            audio.currentTime = 0;
            clearInterval(fadeInterval);
          }
        }, 50);
      } else {
        audio.pause();
        audio.currentTime = 0;
      }
    }
    this.currentTrack = null;
  }

  // Start menu music
  startMenuMusic() {
    this.playMusic('menu');
  }

  // Start ingame music
  startIngameMusic() {
    this.playMusic('ingame');
  }

  // Create a procedural ambient drone (fallback/enhancement)
  startAmbientDrone(floor: string) {
    if (!this.audioContext || !this.isInitialized) return;
    
    const layer = this.layers.get('ambient');
    if (!layer) return;

    // Clear existing oscillators
    layer.oscillators.forEach(osc => {
      try { osc.stop(); } catch (e) {}
    });
    layer.oscillators = [];

    // Floor-specific frequencies
    const floorConfigs: Record<string, { baseFreq: number; detune: number }> = {
      elevator: { baseFreq: 55, detune: 5 },
      hospital: { baseFreq: 65, detune: 3 },
      apartment: { baseFreq: 49, detune: 7 },
      street: { baseFreq: 73, detune: 10 },
      ward: { baseFreq: 58, detune: 4 },
      office: { baseFreq: 82, detune: 6 },
      school: { baseFreq: 52, detune: 8 },
      core: { baseFreq: 40, detune: 15 }
    };

    const config = floorConfigs[floor] || floorConfigs.elevator;
    
    // Create subtle ambient layer
    const osc = this.audioContext.createOscillator();
    const oscGain = this.audioContext.createGain();
    
    osc.type = 'sine';
    osc.frequency.value = config.baseFreq;
    osc.detune.value = (Math.random() - 0.5) * config.detune * 10;
    oscGain.gain.value = 0.05;
    
    osc.connect(oscGain);
    oscGain.connect(layer.gain);
    osc.start();
    
    layer.oscillators.push(osc);
    layer.gain.gain.setTargetAtTime(0.3, this.audioContext.currentTime, 2);
  }

  // UI Click sound
  playClick() {
    if (!this.audioContext || !this.isInitialized) return;
    
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
  }

  // Transition/whoosh sound
  playTransition() {
    if (!this.audioContext || !this.isInitialized) return;
    
    const noise = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    const filter = this.audioContext.createBiquadFilter();
    
    noise.type = 'sawtooth';
    noise.frequency.value = 100;
    filter.type = 'bandpass';
    filter.frequency.value = 500;
    filter.Q.value = 2;
    
    gain.gain.value = 0.1;
    
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain!);
    
    noise.start();
    filter.frequency.exponentialRampToValueAtTime(2000, this.audioContext.currentTime + 0.5);
    gain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.5);
    noise.stop(this.audioContext.currentTime + 0.5);
  }

  // Typewriter key sound
  playTypeKey() {
    if (!this.audioContext || !this.isInitialized) return;
    
    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    
    osc.type = 'square';
    osc.frequency.value = 200 + Math.random() * 100;
    gain.gain.value = 0.03;
    
    osc.connect(gain);
    gain.connect(this.masterGain!);
    
    osc.start();
    osc.stop(this.audioContext.currentTime + 0.02);
  }

  // Choice select sound
  playChoiceSelect() {
    if (!this.audioContext || !this.isInitialized) return;
    
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
  }

  // Floor change sound
  playFloorChange() {
    if (!this.audioContext || !this.isInitialized) return;
    
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
  }

  // Glitch effect
  playGlitch() {
    if (!this.audioContext || !this.isInitialized) return;
    
    const bufferSize = this.audioContext.sampleRate * 0.1;
    const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
    const data = buffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * (Math.random() > 0.7 ? 1 : 0);
    }

    const noise = this.audioContext.createBufferSource();
    const noiseGain = this.audioContext.createGain();
    const filter = this.audioContext.createBiquadFilter();
    
    noise.buffer = buffer;
    filter.type = 'highpass';
    filter.frequency.value = 1000 + Math.random() * 3000;
    
    noiseGain.gain.value = 0.2;
    
    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.masterGain!);
    
    noise.start();
  }

  // Ending sound
  playEnding(type: 'INTEGRATION' | 'SOLIDIFICATION' | 'COLLAPSE' | 'TRANSCENDENCE') {
    // Stop background music
    this.stopMusic();
    
    const configs = {
      INTEGRATION: { freq: 523, notes: [523, 659, 784], duration: 2 },
      SOLIDIFICATION: { freq: 200, notes: [200, 180, 160], duration: 2 },
      COLLAPSE: { freq: 150, notes: [150, 100, 50], duration: 3 },
      TRANSCENDENCE: { freq: 440, notes: [440, 550, 660, 880], duration: 2.5 }
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
    // Also adjust music volume
    this.musicElements.forEach(audio => {
      audio.volume = v * 0.5;
    });
  }

  // Stop all audio
  stopAll() {
    this.stopMusic();
    if (!this.audioContext) return;
    
    this.layers.forEach((layer) => {
      layer.gain.gain.setTargetAtTime(0, this.audioContext!.currentTime, 0.5);
      layer.oscillators.forEach(osc => {
        try { osc.stop(this.audioContext!.currentTime + 1); } catch (e) {}
      });
    });
  }

  // Resume audio context (needed for browsers that block autoplay)
  async resume() {
    if (this.audioContext && this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }
  }

  // Change floor (keep music, just play transition sound)
  changeFloor(floor: string) {
    this.playFloorChange();
    // Could also adjust ambient drone layer here if wanted
  }
}

// Singleton instance
export const audioManager = new AudioManager();
