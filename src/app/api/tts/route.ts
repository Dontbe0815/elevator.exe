import { NextRequest, NextResponse } from 'next/server';

// Character to voice mapping - using different voices for variety
const CHARACTER_VOICES: Record<string, string> = {
  viktor: 'jam',      // English gentleman voice - for the male worker
  livia: 'tongtong',  // Warm and kind voice - for the female witness  
  kairen: 'xiaochen', // Calm professional voice - for the paradox
  SYSTEM: 'kazi',     // Clear standard voice - for system messages
  PLAYER: 'jam'       // Default to jam for player
};

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

    // Dynamic import for z-ai-web-dev-sdk
    const ZAI = (await import('z-ai-web-dev-sdk')).default;
    const zai = await ZAI.create();

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
