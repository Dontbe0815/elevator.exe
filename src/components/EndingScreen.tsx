'use client';

import { useGame } from '@/lib/gameStore';
import { CharacterPortrait } from './CharacterPortrait';

export function EndingScreen() {
  const { state, currentNode, restart } = useGame();

  if (!currentNode?.is_ending || !currentNode.ending_type) return null;

  const endingInfo: Record<string, { 
    title: string; 
    color: string; 
    description: string;
    icon: string;
  }> = {
    INTEGRATION: {
      title: 'ENDING: INTEGRATION',
      color: '#FBBF24',
      description: 'You have accepted every fragment of yourself. The loop is broken.',
      icon: '🌟'
    },
    SOLIDIFICATION: {
      title: 'ENDING: SOLIDIFICATION',
      color: '#6B7280',
      description: 'Your walls stand strong. The pain is locked away. The loop continues.',
      icon: '🧱'
    },
    COLLAPSE: {
      title: 'ENDING: COLLAPSE',
      color: '#DC2626',
      description: 'You have let go of everything. The system cannot process your absence.',
      icon: '💔'
    },
    TRANSCENDENCE: {
      title: 'ENDING: TRANSCENDENCE',
      color: '#06B6D4',
      description: 'You have become something new. Undefined. Unbound. Free.',
      icon: '✨'
    }
  };

  const ending = endingInfo[currentNode.ending_type];

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black">
      <div className="max-w-2xl w-full mx-4 text-center">
        {/* Ending Title */}
        <div 
          className="text-4xl font-bold mb-8 animate-pulse"
          style={{ color: ending.color }}
        >
          {ending.icon} {ending.title}
        </div>

        {/* Final Character States */}
        <div className="flex justify-center gap-8 mb-8">
          {(['viktor', 'livia', 'kairen'] as const).map(charId => (
            <CharacterPortrait 
              key={charId}
              character={charId} 
              size="medium"
            />
          ))}
        </div>

        {/* Ending Text */}
        <div 
          className="bg-gray-900/80 backdrop-blur-sm border rounded-lg p-8 mb-8"
          style={{ borderColor: ending.color }}
        >
          <p className="text-xl text-gray-100 leading-relaxed">
            {currentNode.text}
          </p>
        </div>

        {/* Ending Description */}
        <div className="text-gray-400 mb-8 italic">
          {ending.description}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <StatCard label="Floors Visited" value={state.visited_floors.length} />
          <StatCard label="Choices Made" value={state.choices_made.length} />
          <StatCard 
            label="Final Phase" 
            value={state.game_phase} 
          />
        </div>

        {/* Restart Button */}
        <button
          onClick={restart}
          className="
            px-8 py-4 bg-cyan-600 hover:bg-cyan-500 
            text-white font-bold rounded-lg
            transition-all duration-200
            hover:scale-105 active:scale-95
            border border-cyan-400
          "
        >
          ↺ Begin New Loop
        </button>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-gray-800/50 rounded-lg p-4">
      <div className="text-gray-400 text-sm mb-1">{label}</div>
      <div className="text-white text-xl font-bold">{value}</div>
    </div>
  );
}
