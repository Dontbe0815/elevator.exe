'use client';

import { useGame } from '@/lib/gameStore';
import { DialoguePanel } from './DialoguePanel';
import { EndingScreen } from './EndingScreen';
import { CharacterPortrait } from './CharacterPortrait';
import { FLOORS } from '@/lib/gameData';
import { audioManager } from '@/lib/audioManager';
import { preRecordedTTS } from '@/lib/preRecordedTTS';
import { useState, useEffect, useRef } from 'react';

export function GameScreen() {
  const { state, currentNode, currentFloor } = useGame();
  const [showSettings, setShowSettings] = useState(false);
  const [volume, setVolumeState] = useState(50);
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const hasStartedIngameMusic = useRef(false);

  // Start ingame music once when game screen loads
  useEffect(() => {
    const startIngameAudio = async () => {
      if (!hasStartedIngameMusic.current && state.game_started) {
        console.log('🔊 Starting ingame music...');
        audioManager.stopMusic(); // Stop menu music
        await audioManager.resume();
        await audioManager.startIngameMusic();
        hasStartedIngameMusic.current = true;
      }
    };
    startIngameAudio();
  }, [state.game_started]);

  // Handle floor changes
  useEffect(() => {
    if (state.game_started) {
      audioManager.changeFloor(state.current_floor);
    }
  }, [state.current_floor, state.game_started]);

  // Handle endings
  useEffect(() => {
    if (currentNode?.is_ending && currentNode.ending_type) {
      audioManager.stopAll();
      audioManager.playEnding(currentNode.ending_type);
    }
  }, [currentNode?.is_ending, currentNode?.ending_type]);

  // Show ending screen if game is in ending phase
  if (state.game_phase === 'ENDING' && currentNode?.is_ending) {
    return <EndingScreen />;
  }

  const handleVolumeChange = (newVolume: number) => {
    setVolumeState(newVolume);
    audioManager.setVolume(newVolume / 100);
    preRecordedTTS.setVolume(newVolume / 100);
  };

  const handleToggleTTS = () => {
    const newState = preRecordedTTS.toggle();
    setTtsEnabled(newState);
  };

  // Calculate average character stability for visual effects
  const avgStability = (
    state.characters.viktor.attributes.stability +
    state.characters.livia.attributes.stability +
    state.characters.kairen.attributes.stability
  ) / 3;

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000"
        style={{ 
          backgroundImage: `url(${currentFloor.background_path})`,
          filter: `brightness(0.4) saturate(0.7) ${avgStability < 40 ? 'hue-rotate(10deg)' : ''}`
        }}
      />
      
      {/* Dynamic instability effect */}
      {avgStability < 30 && (
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(circle at 50% 50%, transparent 30%, rgba(139, 0, 0, 0.3) 100%)',
            animation: 'pulse 2s ease-in-out infinite'
          }}
        />
      )}
      
      {/* Scanlines Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)'
        }}
      />

      {/* Vignette */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.8) 100%)'
        }}
      />

      {/* Top UI Bar */}
      <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-start z-10">
        {/* Floor Info */}
        <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-700 rounded-lg px-4 py-2">
          <div className="text-cyan-400 font-mono text-xs uppercase tracking-wider">
            {currentFloor.id === 'ELEVATOR' ? 'CENTRAL HUB' : `MEMORY SECTOR ${currentFloor.id}`}
          </div>
          <div className="text-white font-bold">{currentFloor.name}</div>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-3">
          {/* Settings Button */}
          <div className="relative">
            <button 
              className="bg-gray-900/80 backdrop-blur-sm border border-gray-700 rounded-lg px-3 py-2 text-gray-400 hover:text-white hover:border-cyan-500 transition-colors flex items-center gap-2"
              onClick={() => setShowSettings(!showSettings)}
            >
              <span className="text-lg">⚙️</span>
              <span className="text-xs font-mono hidden sm:inline">SETTINGS</span>
            </button>
            
            {showSettings && (
              <div className="absolute right-0 top-full mt-2 bg-gray-900/95 backdrop-blur-sm border border-gray-700 rounded-lg p-4 w-72 z-50">
                <h3 className="text-white font-mono text-sm mb-4 flex items-center gap-2">
                  <span>🔊</span> AUDIO SETTINGS
                </h3>
                
                <div className="space-y-4">
                  {/* Master Volume */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-400 text-sm">Master Volume</span>
                      <span className="text-cyan-400 font-mono text-sm">{volume}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={volume}
                      onChange={(e) => handleVolumeChange(Number(e.target.value))}
                      className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, #06B6D4 ${volume}%, #374151 ${volume}%)`
                      }}
                    />
                    
                    {/* Quick volume buttons */}
                    <div className="flex gap-2 mt-2">
                      <button 
                        onClick={() => handleVolumeChange(0)}
                        className="flex-1 py-1.5 text-xs font-mono bg-gray-800 hover:bg-gray-700 rounded border border-gray-700 text-gray-400 hover:text-white"
                      >
                        🔇 MUTE
                      </button>
                      <button 
                        onClick={() => handleVolumeChange(50)}
                        className="flex-1 py-1.5 text-xs font-mono bg-gray-800 hover:bg-gray-700 rounded border border-gray-700 text-gray-400 hover:text-white"
                      >
                        50%
                      </button>
                      <button 
                        onClick={() => handleVolumeChange(100)}
                        className="flex-1 py-1.5 text-xs font-mono bg-gray-800 hover:bg-gray-700 rounded border border-gray-700 text-gray-400 hover:text-white"
                      >
                        🔊 MAX
                      </button>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-gray-700" />

                  {/* Voice Toggle */}
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-gray-400 text-sm">Character Voices</span>
                      <p className="text-gray-600 text-xs">Pre-recorded dialogue</p>
                    </div>
                    <button
                      onClick={handleToggleTTS}
                      className={`
                        relative w-12 h-6 rounded-full transition-colors duration-200
                        ${ttsEnabled ? 'bg-cyan-600' : 'bg-gray-700'}
                      `}
                    >
                      <div 
                        className={`
                          absolute top-1 w-4 h-4 rounded-full bg-white transition-transform duration-200
                          ${ttsEnabled ? 'translate-x-7' : 'translate-x-1'}
                        `}
                      />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Phase Indicator */}
          <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-700 rounded-lg px-4 py-2">
            <div className="text-gray-400 text-xs uppercase">Phase</div>
            <div className="text-white font-mono">{state.game_phase}</div>
          </div>
        </div>
      </div>

      {/* Character Portraits (Left Side) */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 space-y-4 z-10 hidden lg:block">
        {(['viktor', 'livia', 'kairen'] as const).map(charId => (
          <CharacterPortrait 
            key={charId}
            character={charId} 
            size="small"
            isSpeaking={currentNode?.speaker === charId}
          />
        ))}
      </div>

      {/* Character Status Bar (Mobile - Bottom) */}
      <div className="lg:hidden absolute bottom-32 left-4 right-4 z-10">
        <div className="flex justify-center gap-2">
          {(['viktor', 'livia', 'kairen'] as const).map(charId => {
            const char = state.characters[charId];
            const isSpeaking = currentNode?.speaker === charId;
            return (
              <div 
                key={charId}
                className={`bg-gray-900/80 backdrop-blur-sm border rounded-lg px-3 py-1.5 flex items-center gap-2 ${isSpeaking ? 'border-cyan-500' : 'border-gray-700'}`}
              >
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: getEmotionColor(char.current_emotional_state) }}
                />
                <span className="text-xs text-gray-300 font-mono">{char.character.name.split(' ')[0]}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <div className="absolute bottom-0 left-0 right-0 p-4 pb-8 z-10">
        {/* Visited Floors Indicator */}
        <div className="flex justify-center gap-2 mb-4">
          {Object.keys(FLOORS).map(floorId => {
            const isVisited = state.visited_floors.includes(floorId as keyof typeof FLOORS);
            const isCurrent = state.current_floor === floorId;
            return (
              <div 
                key={floorId}
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono
                  transition-all duration-300 cursor-pointer
                  ${isCurrent ? 'bg-cyan-500 text-white scale-110 shadow-lg shadow-cyan-500/50' : isVisited ? 'bg-gray-600 text-gray-300 hover:bg-gray-500' : 'bg-gray-800 text-gray-600'}
                `}
                title={FLOORS[floorId as keyof typeof FLOORS].name}
              >
                {floorId === 'ELEVATOR' ? 'E' : floorId.replace('F', '')}
              </div>
            );
          })}
        </div>

        {/* Dialogue Panel */}
        <DialoguePanel />
      </div>

      {/* Memory Fragment Indicator */}
      <div className="absolute bottom-4 right-4 z-10 hidden md:block">
        <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-700 rounded-lg px-3 py-2">
          <div className="text-gray-400 text-xs mb-1">Memory Integrity</div>
          <div className="w-32 h-2 bg-gray-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 transition-all duration-500"
              style={{ 
                width: `${100 - (state.characters.viktor.attributes.memory_fragmentation + 
                              state.characters.livia.attributes.memory_fragmentation + 
                              state.characters.kairen.attributes.memory_fragmentation) / 3}%` 
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function getEmotionColor(state: string): string {
  const colors: Record<string, string> = {
    IDLE: '#6B7280',
    CALM: '#3B82F6',
    SUSPICIOUS: '#F59E0B',
    STRESSED: '#EF4444',
    AFRAID: '#8B5CF6',
    PANICKED: '#DC2626',
    ANGRY: '#B91C1C',
    HALF_AWARE: '#10B981',
    COLLAPSE: '#1F2937',
    BROKEN: '#4B5563',
    GLITCH: '#06B6D4',
    INTEGRATED: '#FBBF24'
  };
  return colors[state] || '#6B7280';
}
