// TTS Service for ELEVATOR.EXE
// Manages character voice playback with caching and queueing

export type CharacterSpeaker = 'viktor' | 'livia' | 'kairen' | 'SYSTEM' | 'PLAYER';

interface TTSQueueItem {
  text: string;
  character: CharacterSpeaker;
  resolve: () => void;
}

class TTSService {
  private audio: HTMLAudioElement | null = null;
  private isPlaying: boolean = false;
  private queue: TTSQueueItem[] = [];
  private cache: Map<string, string> = new Map();
  private isEnabled: boolean = true;
  private volume: number = 0.8;
  private initialized: boolean = false;

  constructor() {
    // Audio will be created on first use
    if (typeof window !== 'undefined') {
      this.initAudio();
    }
  }

  private initAudio() {
    if (this.initialized) return;
    
    this.audio = new Audio();
    this.audio.onended = () => this.playNext();
    this.audio.onerror = (e) => {
      console.error('TTS audio error:', e);
      this.isPlaying = false;
      this.playNext();
    };
    this.initialized = true;
    console.log('🔊 TTS Service initialized');
  }

  // Generate cache key
  private getCacheKey(text: string, character: CharacterSpeaker): string {
    return `${character}:${text.slice(0, 50)}`;
  }

  // Check if TTS is enabled
  getIsEnabled(): boolean {
    return this.isEnabled;
  }

  // Toggle TTS on/off
  toggle(): boolean {
    this.isEnabled = !this.isEnabled;
    if (!this.isEnabled) {
      this.stop();
    }
    console.log(`🔊 TTS ${this.isEnabled ? 'enabled' : 'disabled'}`);
    return this.isEnabled;
  }

  // Set volume (0-1)
  setVolume(volume: number): void {
    this.volume = Math.max(0, Math.min(1, volume));
    if (this.audio) {
      this.audio.volume = this.volume;
    }
  }

  // Speak text for a character
  async speak(text: string, character: CharacterSpeaker): Promise<void> {
    if (!this.isEnabled || !text) {
      console.log('🔊 TTS disabled or no text');
      return Promise.resolve();
    }

    // Clean text for TTS (remove stage directions)
    const cleanText = this.cleanTextForTTS(text);
    
    if (!cleanText) {
      console.log('🔊 No text after cleaning');
      return Promise.resolve();
    }

    console.log(`🔊 TTS: Speaking as ${character}: "${cleanText.slice(0, 50)}..."`);

    return new Promise((resolve) => {
      this.queue.push({ text: cleanText, character, resolve });
      
      if (!this.isPlaying) {
        this.playNext();
      }
    });
  }

  // Clean text for TTS - remove stage directions and formatting
  private cleanTextForTTS(text: string): string {
    // Remove text between asterisks (stage directions)
    let cleaned = text.replace(/\*[^*]+\*/g, '');
    
    // Remove quotes at start/end
    cleaned = cleaned.replace(/^[""]|[""]$/g, '');
    
    // Clean up whitespace
    cleaned = cleaned.replace(/\s+/g, ' ').trim();
    
    return cleaned;
  }

  // Play next item in queue
  private async playNext(): Promise<void> {
    if (this.queue.length === 0) {
      this.isPlaying = false;
      return;
    }

    this.isPlaying = true;
    const item = this.queue.shift()!;

    try {
      // Ensure audio is initialized
      if (!this.audio) {
        this.initAudio();
      }

      // Check cache first
      const cacheKey = this.getCacheKey(item.text, item.character);
      let audioUrl = this.cache.get(cacheKey);

      if (!audioUrl) {
        console.log(`🔊 TTS: Fetching from API for ${item.character}...`);
        
        // Fetch from API
        const response = await fetch('/api/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: item.text,
            character: item.character,
            speed: 0.9
          })
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error('TTS API failed:', response.status, errorData);
          throw new Error(`TTS API failed: ${response.status}`);
        }

        // Create blob URL
        const blob = await response.blob();
        audioUrl = URL.createObjectURL(blob);
        
        // Cache the URL (limit cache size)
        if (this.cache.size > 50) {
          const firstKey = this.cache.keys().next().value;
          if (firstKey) {
            URL.revokeObjectURL(this.cache.get(firstKey)!);
            this.cache.delete(firstKey);
          }
        }
        this.cache.set(cacheKey, audioUrl);
        console.log(`🔊 TTS: Cached audio for ${item.character}`);
      } else {
        console.log(`🔊 TTS: Using cached audio for ${item.character}`);
      }

      // Play audio
      if (this.audio && this.isEnabled) {
        this.audio.src = audioUrl;
        this.audio.volume = this.volume;
        await this.audio.play();
        console.log(`🔊 TTS: Playing audio for ${item.character}`);
      } else {
        // TTS was disabled while fetching
        item.resolve();
        this.playNext();
      }
    } catch (error) {
      console.error('TTS playback error:', error);
      item.resolve();
      this.playNext();
    }
  }

  // Stop current playback and clear queue
  stop(): void {
    console.log('🔊 TTS: Stopping');
    this.queue = [];
    if (this.audio) {
      this.audio.pause();
      this.audio.src = '';
    }
    this.isPlaying = false;
  }

  // Skip current speech
  skip(): void {
    console.log('🔊 TTS: Skipping');
    if (this.audio && this.isPlaying) {
      this.audio.pause();
      this.audio.src = '';
      this.isPlaying = false;
      this.playNext();
    }
  }

  // Clear cache
  clearCache(): void {
    this.cache.forEach(url => URL.revokeObjectURL(url));
    this.cache.clear();
  }
}

// Singleton instance
export const ttsService = new TTSService();
