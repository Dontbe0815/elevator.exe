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

  constructor() {
    // Create audio element once
    if (typeof window !== 'undefined') {
      this.audio = new Audio();
      this.audio.onended = () => this.playNext();
      this.audio.onerror = () => {
        console.error('TTS audio error');
        this.playNext();
      };
    }
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
      return Promise.resolve();
    }

    // Clean text for TTS (remove stage directions)
    const cleanText = this.cleanTextForTTS(text);
    
    if (!cleanText) {
      return Promise.resolve();
    }

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
      // Check cache first
      const cacheKey = this.getCacheKey(item.text, item.character);
      let audioUrl = this.cache.get(cacheKey);

      if (!audioUrl) {
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
          throw new Error('TTS API failed');
        }

        // Create blob URL
        const blob = await response.blob();
        audioUrl = URL.createObjectURL(blob);
        
        // Cache the URL
        this.cache.set(cacheKey, audioUrl);
      }

      // Play audio
      if (this.audio && this.isEnabled) {
        this.audio.src = audioUrl;
        this.audio.volume = this.volume;
        await this.audio.play();
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
    this.queue = [];
    if (this.audio) {
      this.audio.pause();
      this.audio.src = '';
    }
    this.isPlaying = false;
  }

  // Skip current speech
  skip(): void {
    if (this.audio && this.isPlaying) {
      this.audio.pause();
      this.audio.src = '';
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
