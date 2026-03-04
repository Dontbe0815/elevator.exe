'use client';

import { useState, useEffect } from 'react';
import { useGame } from '@/lib/gameStore';
import { audioManager } from '@/lib/audioManager';

export function TitleScreen() {
  const { startGame } = useGame();
  const [showContent, setShowContent] = useState(false);
  const [glitchText, setGlitchText] = useState('ELEVATOR.EXE');
  const [volume, setVolume] = useState(50);
  const [showSettings, setShowSettings] = useState(false);
  const [audioReady, setAudioReady] = useState(false);
  const [audioStarted, setAudioStarted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 500);
    return () => clearTimeout(timer);
  }, []);

  // Initialize audio (but don't play yet - browser policy requires user interaction)
  useEffect(() => {
    const initAudio = async () => {
      try {
        await audioManager.initialize();
        setAudioReady(true);
        console.log('🔊 Audio initialized, ready for user interaction');
      } catch (e) {
        console.error('Audio initialization failed:', e);
      }
    };
    initAudio();
  }, []);

  // Glitch effect for title
  useEffect(() => {
    const glitchChars = '!@#$%^&*()_+-=[]{}|;:,.<>?░▒▓';
    const originalText = 'ELEVATOR.EXE';
    
    const interval = setInterval(() => {
      if (Math.random() > 0.92) {
        const pos = Math.floor(Math.random() * originalText.length);
        const char = glitchChars[Math.floor(Math.random() * glitchChars.length)];
        setGlitchText(originalText.slice(0, pos) + char + originalText.slice(pos + 1));
        setTimeout(() => setGlitchText(originalText), 80 + Math.random() * 120);
      }
    }, 80);

    return () => clearInterval(interval);
  }, []);

  // Start music on any click (browser policy)
  const startMusic = async () => {
    if (audioStarted) return;
    
    try {
      setAudioStarted(true);
      console.log('🔊 User clicked - starting audio...');
      await audioManager.resume();
      audioManager.setVolume(volume / 100);
      // Small delay to ensure audio context is ready
      await new Promise(resolve => setTimeout(resolve, 100));
      await audioManager.startMenuMusic();
      console.log('🔊 Music started from user interaction');
    } catch (e) {
      console.error('Failed to start music:', e);
    }
  };

  const handleStart = async () => {
    // Start music if not already started
    await startMusic();
    
    // Play click sound
    audioManager.playClick();
    
    // Transition to ingame music after a short delay
    setTimeout(() => {
      audioManager.stopMusic();
      audioManager.startIngameMusic();
    }, 500);
    
    startGame();
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    audioManager.setVolume(newVolume / 100);
  };

  return (
    <div 
      className="min-h-screen bg-black flex flex-col items-center justify-center relative overflow-hidden"
      onClick={startMusic} // Start music on any click
    >
      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Grid lines */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(rgba(6, 182, 212, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(6, 182, 212, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}
        />
        
        {/* Radial gradient */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(6, 182, 212, 0.15) 0%, transparent 70%)'
          }}
        />

        {/* Animated scan line */}
        <div 
          className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent animate-scanMove"
        />
      </div>

      {/* Floating elevator buttons background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5 pointer-events-none">
        <div className="grid grid-cols-2 gap-2">
          {[1, 3, 5, 7, 9, 11, 13].map(floor => (
            <div 
              key={floor}
              className="w-20 h-20 rounded-full border border-cyan-500 flex items-center justify-center text-cyan-500 text-2xl font-mono"
            >
              {floor}
            </div>
          ))}
        </div>
      </div>

      {/* Settings Button - TOP RIGHT */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setShowSettings(!showSettings);
        }}
        className="absolute top-4 right-4 z-20 p-3 rounded-lg bg-gray-900/80 border border-gray-700 hover:border-cyan-500 transition-colors"
        title="Settings"
      >
        <svg className="w-6 h-6 text-gray-400 hover:text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>

      {/* Settings Panel */}
      {showSettings && (
        <div className="absolute top-16 right-4 z-20 bg-gray-900/95 border border-gray-700 rounded-lg p-4 w-64 backdrop-blur-sm">
          <h3 className="text-white font-mono text-sm mb-4 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.536a5 5 0 001.414 1.414m2.828-9.9a9 9 0 012.728-2.728" />
            </svg>
            AUDIO SETTINGS
          </h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-sm">Master Volume</span>
              <span className="text-cyan-400 font-mono text-sm">{volume}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={(e) => handleVolumeChange(Number(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #06B6D4 ${volume}%, #374151 ${volume}%)`
              }}
            />
            
            {/* Quick volume buttons */}
            <div className="flex gap-2 mt-3">
              <button 
                onClick={() => handleVolumeChange(0)}
                className="flex-1 py-1 text-xs font-mono bg-gray-800 hover:bg-gray-700 rounded border border-gray-700 text-gray-400"
              >
                MUTE
              </button>
              <button 
                onClick={() => handleVolumeChange(50)}
                className="flex-1 py-1 text-xs font-mono bg-gray-800 hover:bg-gray-700 rounded border border-gray-700 text-gray-400"
              >
                50%
              </button>
              <button 
                onClick={() => handleVolumeChange(100)}
                className="flex-1 py-1 text-xs font-mono bg-gray-800 hover:bg-gray-700 rounded border border-gray-700 text-gray-400"
              >
                MAX
              </button>
            </div>
            
            {/* Audio status */}
            <div className="text-xs text-gray-500 mt-2 flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${audioReady ? 'bg-green-500' : 'bg-gray-500'}`} />
              {audioReady ? 'Audio ready' : 'Initializing audio...'}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className={`relative z-10 text-center transition-all duration-1000 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        {/* Title */}
        <div className="mb-4">
          <h1 
            className="text-6xl md:text-8xl font-mono font-bold tracking-wider animate-textGlow"
            style={{
              color: '#06B6D4',
              textShadow: '0 0 30px rgba(6, 182, 212, 0.5), 0 0 60px rgba(6, 182, 212, 0.3)'
            }}
          >
            {glitchText}
          </h1>
          <div 
            className="text-2xl md:text-3xl font-mono tracking-widest mt-2"
            style={{ color: '#8B5CF6' }}
          >
            — FRACTURED LOOP —
          </div>
        </div>

        {/* Subtitle */}
        <div className="text-gray-400 max-w-md mx-auto mb-12 px-4">
          <p className="text-lg mb-4">
            The elevator remembers what you cannot.
          </p>
          <p className="text-sm opacity-70">
            A narrative-driven psychological horror experience.
            <br />
            Navigate memories. Confront trauma. Break the loop.
          </p>
        </div>

        {/* Start Button */}
        <button
          onClick={handleStart}
          className="
            group relative px-12 py-4 
            bg-transparent border-2 border-cyan-500 
            text-cyan-400 font-mono text-xl tracking-wider
            hover:bg-cyan-500/20 hover:text-cyan-300
            transition-all duration-300
            hover:scale-105 active:scale-95
          "
          style={{
            clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)'
          }}
        >
          <span className="relative z-10">[ ENTER THE ELEVATOR ]</span>
          <div 
            className="absolute inset-0 bg-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)'
            }}
          />
        </button>

        {/* Hint text */}
        <div className="mt-8 text-gray-500 text-xs font-mono">
          {audioStarted ? '🔊 Audio enabled' : '🔊 Click anywhere to enable audio'}
        </div>
      </div>

      {/* Credits */}
      <div className="absolute bottom-8 left-0 right-0 text-center z-10">
        <div className="text-gray-600 text-xs font-mono">
          v1.0 | Memory Compression System Active
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
    </div>
  );
}
