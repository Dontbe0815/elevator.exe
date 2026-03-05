// Pre-recorded dialogue audio service for ELEVATOR.EXE
// Uses pre-generated MP3 files - works everywhere without API calls

class PreRecordedTTS {
  private audio: HTMLAudioElement | null = null;
  private isEnabled: boolean = true;
  private volume: number = 0.8;
  private consecutiveErrors: number = 0;
  private readonly MAX_ERRORS = 5;

  constructor() {
    if (typeof window !== 'undefined') {
      console.log('🔊 Pre-recorded TTS initialized');
    }
  }

  // Check if audio exists for a node
  hasAudio(nodeId: string): boolean {
    // List of all nodes with pre-generated audio
    const nodesWithAudio = [
      'START', 'START_2', 'VIKTOR_INTRO', 'VIKTOR_INTRO_SUPPORT', 'VIKTOR_INTRO_PRESSURE',
      'VIKTOR_INTRO_AVOID', 'VIKTOR_RECOVER', 'VIKTOR_CRACK', 'KAIREN_INTERject',
      'LIVIA_INTRO', 'LIVIA_REVEAL', 'LIVIA_JOKE', 'LIVIA_DOUBT', 'KAIREN_INTRO',
      'KAIREN_LOOP', 'KAIREN_PHILOSOPHICAL', 'KAIREN_DEFENSIVE', 'FLOOR_SELECT',
      'F1_ENTRANCE', 'F1_VIKTOR_REACT', 'F1_VIKTOR_SUPPORT', 'F1_VIKTOR_PRESSURE',
      'F1_VIKTOR_AVOID', 'F1_VIKTOR_BREAKDOWN', 'F1_EXPLORE', 'F1_ROOM13',
      'F1_VIKTOR_TRUTH', 'F1_INTEGRATION_PATH', 'F1_COLLAPSE_PATH', 'F1_NURSE',
      'F5_ENTRANCE', 'F5_LIVIA_REACT', 'F5_LIVIA_REVEAL', 'F5_LIVIA_AVOID',
      'F5_LIVIA_PRESSURE', 'F5_MEMORY', 'F5_WRECKAGE', 'F5_SUPPORT',
      'F9_ENTRANCE', 'F9_EXPLORE', 'F9_FILES', 'F9_KAIREN_PRESSURE',
      'F9_TOGETHER', 'F9_REVELATION', 'CORE_ACCESS', 'F13_ENTRANCE',
      'F13_CHOICE', 'ENDING_INTEGRATION', 'ENDING_SOLIDIFICATION',
      'ENDING_COLLAPSE', 'ENDING_TRANSCENDENCE', 'FLOOR_SELECT_2'
    ];
    return nodesWithAudio.includes(nodeId);
  }

  // Play pre-recorded audio for a dialogue node
  async play(nodeId: string): Promise<void> {
    if (!this.isEnabled || !this.hasAudio(nodeId)) {
      return Promise.resolve();
    }

    // Stop any currently playing audio and clean up
    this.stop();

    // Create fresh audio element each time
    this.audio = new Audio();
    
    // Add cache-busting query parameter to avoid cached 404 responses
    const timestamp = Date.now();
    const audioPath = `/assets/audio/dialogue/${nodeId}.mp3?t=${timestamp}`;
    
    return new Promise((resolve) => {
      if (!this.audio) {
        resolve();
        return;
      }

      this.audio.onended = () => {
        this.consecutiveErrors = 0; // Reset on success
        resolve();
      };
      
      this.audio.onerror = (e) => {
        this.consecutiveErrors++;
        console.warn(`🔊 Audio error (${this.consecutiveErrors}): ${nodeId}`);
        
        // Disable after too many consecutive errors
        if (this.consecutiveErrors >= this.MAX_ERRORS) {
          console.warn('🔊 Too many audio errors, disabling voice');
          this.isEnabled = false;
        }
        resolve();
      };

      this.audio.oncanplaythrough = () => {
        if (this.audio && this.isEnabled) {
          this.audio.volume = this.volume;
          this.audio.play().then(() => {
            console.log(`🔊 Playing: ${nodeId}`);
          }).catch((e) => {
            console.warn(`🔊 Play blocked: ${e.message}`);
            resolve();
          });
        }
      };

      this.audio.src = audioPath;
      this.audio.load();
    });
  }

  // Stop current playback
  stop(): void {
    if (this.audio) {
      this.audio.pause();
      this.audio.src = '';
      this.audio.onended = null;
      this.audio.onerror = null;
      this.audio.oncanplaythrough = null;
      this.audio = null;
    }
  }

  // Skip current audio
  skip(): void {
    this.stop();
  }

  // Check if currently playing
  getIsPlaying(): boolean {
    return this.audio ? !this.audio.paused : false;
  }

  // Toggle enabled state
  toggle(): boolean {
    this.isEnabled = !this.isEnabled;
    if (!this.isEnabled) {
      this.stop();
      this.consecutiveErrors = 0; // Reset errors when toggling
    }
    console.log(`🔊 Pre-recorded TTS ${this.isEnabled ? 'enabled' : 'disabled'}`);
    return this.isEnabled;
  }
  
  // Set enabled state directly
  setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
    if (!enabled) {
      this.stop();
    }
    this.consecutiveErrors = 0;
  }

  // Check if enabled
  getIsEnabled(): boolean {
    return this.isEnabled;
  }

  // Set volume (0-1)
  setVolume(volume: number): void {
    this.volume = Math.max(0, Math.min(1, volume));
    if (this.audio) {
      this.audio.volume = this.volume;
    }
  }
}

// Singleton instance
export const preRecordedTTS = new PreRecordedTTS();
