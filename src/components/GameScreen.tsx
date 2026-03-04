'use client';

import { useGame } from '@/lib/gameStore';
import { DialoguePanel } from './DialoguePanel';
import { EndingScreen } from './EndingScreen';
import { CharacterPortrait } from './CharacterPortrait';
import { FLOORS } from '@/lib/gameData';
import { audioManager } from '@/lib/audioManager';
import { useState, useEffect, useRef } from 'react';

export function GameScreen() {
  const { state, currentNode, currentFloor } = useGame();
  const [showVolume, setShowVolume] = useState(false);
  const [volume, setVolumeState] = useState(0.3);
  const hasStartedIngameMusic = useRef(false);

  // Start ingame music once when game screen loads
  useEffect(() => {
    if (!hasStartedIngameMusic.current && state.game_started) {
      audioManager.stopMusic(); // Stop menu music
      audioManager.startIngameMusic(); // Start ingame music
      hasStartedIngameMusic.current = true;
    }
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
    audioManager.setVolume(newVolume);
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000"
        style={{ 
          backgroundImage: `url(${currentFloor.background_path})`,
          filter: 'brightness(0.4) saturate(0.7)'
        }}
      />
      
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
          {/* Volume Control */}
          <div 
            className="relative"
            onMouseEnter={() => setShowVolume(true)}
            onMouseLeave={() => setShowVolume(false)}
          >
            <button 
              className="bg-gray-900/80 backdrop-blur-sm border border-gray-700 rounded-lg px-3 py-2 text-gray-400 hover:text-white transition-colors"
              onClick={() => setShowVolume(!showVolume)}
            >
              🔊
            </button>
            
            {showVolume && (
              <div className="absolute right-0 top-full mt-2 bg-gray-900/95 backdrop-blur-sm border border-gray-700 rounded-lg p-3 w-40">
                <div className="text-xs text-gray-400 mb-2">Volume</div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume * 100}
                  onChange={(e) => handleVolumeChange(Number(e.target.value) / 100)}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
                <div className="text-xs text-gray-500 mt-1 text-center">{Math.round(volume * 100)}%</div>
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

      {/* Character Portraits (Side) */}
      {state.game_phase !== 'INTRO' && (
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
      )}

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
                  transition-all duration-300
                  ${isCurrent ? 'bg-cyan-500 text-white scale-110' : isVisited ? 'bg-gray-600 text-gray-300' : 'bg-gray-800 text-gray-600'}
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
          <div className="text-gray-400 text-xs">Memory Integrity</div>
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
