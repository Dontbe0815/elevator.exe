'use client';

import { useGame } from '@/lib/gameStore';
import { CharacterId, EMOTIONAL_STATE_INFO, EmotionalState } from '@/lib/gameData';

interface CharacterPortraitProps {
  character: CharacterId;
  isSpeaking?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export function CharacterPortrait({ character, isSpeaking = false, size = 'medium' }: CharacterPortraitProps) {
  const { state, getPortraitPath, getStateColor } = useGame();
  const charState = state.characters[character];
  const emotionalInfo = EMOTIONAL_STATE_INFO[charState.current_emotional_state];
  
  const sizeClasses = {
    small: 'w-24 h-24',
    medium: 'w-32 h-32',
    large: 'w-48 h-48'
  };

  return (
    <div className="relative flex flex-col items-center">
      {/* Portrait Container */}
      <div 
        className={`
          ${sizeClasses[size]} 
          relative 
          rounded-lg 
          overflow-hidden
          border-2
          transition-all
          duration-300
          ${isSpeaking ? 'ring-4 ring-white/50 scale-105' : ''}
        `}
        style={{ 
          borderColor: emotionalInfo.color,
          boxShadow: `0 0 20px ${emotionalInfo.color}40`
        }}
      >
        <img 
          src={getPortraitPath(character)}
          alt={`${charState.character.name} - ${charState.current_emotional_state}`}
          className="w-full h-full object-cover"
          style={{
            filter: emotionalInfo.intensity >= 5 ? 'saturate(1.3)' : 'none'
          }}
        />
        
        {/* Glitch Effect Overlay */}
        {charState.current_emotional_state === 'GLITCH' && (
          <div 
            className="absolute inset-0 pointer-events-none animate-pulse"
            style={{
              background: `repeating-linear-gradient(
                0deg,
                transparent,
                transparent 2px,
                ${emotionalInfo.color}20 2px,
                ${emotionalInfo.color}20 4px
              )`
            }}
          />
        )}
      </div>

      {/* Name & State */}
      <div className="mt-2 text-center">
        <div className="text-sm font-bold text-white" style={{ textShadow: '0 0 10px rgba(0,0,0,0.8)' }}>
          {charState.character.name}
        </div>
        <div 
          className="text-xs uppercase tracking-wider"
          style={{ color: emotionalInfo.color }}
        >
          {charState.current_emotional_state.replace('_', ' ')}
        </div>
      </div>

      {/* Attribute Bars */}
      {size === 'medium' && (
        <div className="mt-2 w-full space-y-1">
          <AttributeBar label="STB" value={charState.attributes.stability} color="#3B82F6" />
          <AttributeBar label="TRU" value={charState.attributes.trust} color="#10B981" />
          <AttributeBar label="REP" value={charState.attributes.repression_index} color="#EF4444" />
        </div>
      )}
    </div>
  );
}

function AttributeBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="flex items-center gap-1">
      <span className="text-[10px] text-gray-400 w-6">{label}</span>
      <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
        <div 
          className="h-full transition-all duration-500"
          style={{ width: `${value}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}
