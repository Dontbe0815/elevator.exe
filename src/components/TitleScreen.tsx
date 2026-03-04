'use client';

import { useState, useEffect } from 'react';
import { useGame } from '@/lib/gameStore';
import { audioManager } from '@/lib/audioManager';

export function TitleScreen() {
  const { startGame } = useGame();
  const [showContent, setShowContent] = useState(false);
  const [glitchText, setGlitchText] = useState('ELEVATOR.EXE');

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 500);
    return () => clearTimeout(timer);
  }, []);

  // Glitch effect for title
  useEffect(() => {
    const glitchChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    const originalText = 'ELEVATOR.EXE';
    
    const interval = setInterval(() => {
      if (Math.random() > 0.95) {
        const pos = Math.floor(Math.random() * originalText.length);
        const char = glitchChars[Math.floor(Math.random() * glitchChars.length)];
        setGlitchText(originalText.slice(0, pos) + char + originalText.slice(pos + 1));
        setTimeout(() => setGlitchText(originalText), 100);
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const handleStart = async () => {
    try {
      await audioManager.initialize();
      await audioManager.resume();
      audioManager.startMenuMusic(); // Start menu MP3 music
    } catch (e) {
      console.error('Audio failed to start:', e);
    }
    startGame();
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center relative overflow-hidden">
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
      </div>

      {/* Floating elevator buttons */}
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

      {/* Main Content */}
      <div className={`relative z-10 text-center transition-all duration-1000 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        {/* Title */}
        <div className="mb-4">
          <h1 
            className="text-6xl md:text-8xl font-mono font-bold tracking-wider"
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

        {/* Credits */}
        <div className="absolute bottom-8 left-0 right-0 text-center">
          <div className="text-gray-600 text-xs font-mono">
            v1.0 | Memory Compression System Active
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
    </div>
  );
}
