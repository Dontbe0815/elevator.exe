import { NextRequest, NextResponse } from 'next/server';
import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';

// Character to voice mapping - using different voices for variety
const CHARACTER_VOICES: Record<string, string> = {
  viktor: 'jam',      // English gentleman voice - for the male worker
  livia: 'tongtong',  // Warm and kind voice - for the female witness  
  kairen: 'xiaochen', // Calm professional voice - for the paradox
  SYSTEM: 'kazi',     // Clear standard voice - for system messages
  PLAYER: 'jam'       // Default to jam for player
};

// Cache the ZAI instance
let zaiInstance: Awaited<ReturnType<typeof import('z-ai-web-dev-sdk').default.create>> | null = null;
let configInitialized = false;

// Initialize config from environment variables (for Vercel/production)
function initConfigFromEnv() {
  if (configInitialized) return;
  
  const baseUrl = process.env.ZAI_BASE_URL;
  const apiKey = process.env.ZAI_API_KEY;
  const token = process.env.ZAI_TOKEN;
  const userId = process.env.ZAI_USER_ID;
  const chatId = process.env.ZAI_CHAT_ID;
  
  // If all env vars are set, create config file
  if (baseUrl && apiKey && token && userId && chatId) {
    try {
      const configDir = tmpdir();
      const configPath = join(configDir, '.z-ai-config');
      
      const config = {
        baseUrl,
        apiKey,
        token,
        userId,
        chatId
      };
      
      writeFileSync(configPath, JSON.stringify(config, null, 2));
      console.log('🔊 TTS: Created config from environment variables at', configPath);
      
      // Also try to set HOME to tmpdir so SDK finds the config
      process.env.HOME = configDir;
    } catch (error) {
      console.error('🔊 TTS: Failed to create config file:', error);
    }
  }
  
  configInitialized = true;
}

async function getZAI() {
  if (zaiInstance) return zaiInstance;
  
  // Initialize config from env vars first
  initConfigFromEnv();
  
  const ZAI = (await import('z-ai-web-dev-sdk')).default;
  
  try {
    zaiInstance = await ZAI.create();
    console.log('🔊 TTS: Initialized successfully');
    return zaiInstance;
  } catch (error) {
    console.error('🔊 TTS: Failed to initialize:', error);
    throw error;
  }
}

export async function POST(req: NextRequest) {
  try {
    const { text, character, speed = 0.9 } = await req.json();

    // Validate input
    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      );
    }

    // Truncate text if too long (API limit is 1024 chars)
    const truncatedText = text.slice(0, 900);

    // Determine voice based on character
    const voice = CHARACTER_VOICES[character] || 'jam';
    
    // Ensure speed is within valid range (0.5 - 2.0)
    const validSpeed = Math.max(0.5, Math.min(2.0, speed || 0.9));

    console.log(`🔊 TTS API: Generating speech for ${character} (${voice}) at speed ${validSpeed}: "${truncatedText.slice(0, 50)}..."`);

    // Get or create ZAI instance
    const zai = await getZAI();

    // Generate TTS audio
    const response = await zai.audio.tts.create({
      input: truncatedText,
      voice: voice,
      speed: validSpeed,
      response_format: 'mp3',
      stream: false,
    });

    // Get array buffer from Response object
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(new Uint8Array(arrayBuffer));

    console.log(`🔊 TTS API: Generated ${buffer.length} bytes of audio`);

    // Return audio as response
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': buffer.length.toString(),
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      },
    });
  } catch (error) {
    console.error('TTS API Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate speech' },
      { status: 500 }
    );
  }
}
