'use client';

import { useGame } from '@/lib/gameStore';
import { ttsService } from '@/lib/ttsService';

// All possible endings
const ALL_ENDINGS = [
  {
    id: 'INTEGRATION',
    title: 'INTEGRATION',
    subtitle: 'Wholeness Achieved',
    description: 'Accept every fragment of yourself. Break the loop.',
    color: '#FBBF24',
    difficulty: 'Moderate',
    hint: 'Choose supportive options and face the truth'
  },
  {
    id: 'SOLIDIFICATION',
    title: 'SOLIDIFICATION',
    subtitle: 'Eternal Denial',
    description: 'Lock away the pain. The loop continues.',
    color: '#6B7280',
    difficulty: 'Easy',
    hint: 'Choose avoidant options to protect yourself'
  },
  {
    id: 'COLLAPSE',
    title: 'COLLAPSE',
    subtitle: 'Total Dissolution',
    description: 'Let go of everything. Become nothing.',
    color: '#DC2626',
    difficulty: 'Hard',
    hint: 'Push characters past their breaking points'
  },
  {
    id: 'TRANSCENDENCE',
    title: 'TRANSCENDENCE',
    subtitle: 'Beyond the Loop',
    description: 'Become something undefined. Break the system.',
    color: '#06B6D4',
    difficulty: 'Secret',
    hint: 'Find the path that defies all categories'
  }
];

export function EndingScreen() {
  const { state, currentNode, restart } = useGame();

  if (!currentNode?.is_ending || !currentNode.ending_type) return null;

  const currentEnding = ALL_ENDINGS.find(e => e.id === currentNode.ending_type);
  const otherEndings = ALL_ENDINGS.filter(e => e.id !== currentNode.ending_type);

  // Handle restart with TTS cleanup
  const handleRestart = () => {
    ttsService.stop();
    restart();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black overflow-auto">
      {/* Background Image */}
      <div 
        className="fixed inset-0 bg-cover bg-center"
        style={{ 
          backgroundImage: `url(/assets/endings/${currentEnding?.id.toLowerCase()}.png)`,
          filter: 'blur(8px) brightness(0.2)'
        }}
      />
      
      {/* Gradient Overlay */}
      <div 
        className="fixed inset-0"
        style={{
          background: `radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.9) 100%)`
        }}
      />

      {/* Content Container */}
      <div className="relative z-10 max-w-4xl w-full mx-4 py-8">
        
        {/* Game Complete Header */}
        <div className="text-center mb-8">
          <div className="text-gray-500 font-mono text-sm tracking-widest mb-2">
            ELEVATOR.EXE — FRACTURED LOOP
          </div>
          <h1 
            className="text-5xl md:text-6xl font-bold mb-3"
            style={{ 
              color: currentEnding?.color,
              textShadow: `0 0 60px ${currentEnding?.color}80, 0 0 120px ${currentEnding?.color}40`
            }}
          >
            GAME COMPLETE
          </h1>
          <div className="flex items-center justify-center gap-2">
            <div 
              className="h-px w-16"
              style={{ background: `linear-gradient(to right, transparent, ${currentEnding?.color})` }}
            />
            <span 
              className="font-mono text-lg tracking-widest"
              style={{ color: currentEnding?.color }}
            >
              ENDING {state.choices_made.length > 15 ? 'A' : state.choices_made.length > 10 ? 'B' : 'C'}: {currentEnding?.title}
            </span>
            <div 
              className="h-px w-16"
              style={{ background: `linear-gradient(to left, transparent, ${currentEnding?.color})` }}
            />
          </div>
        </div>

        {/* Current Ending Display */}
        <div 
          className="bg-gray-900/80 backdrop-blur-sm border rounded-xl p-6 mb-8 max-w-2xl mx-auto"
          style={{ borderColor: `${currentEnding?.color}50` }}
        >
          {/* Ending Illustration */}
          <div 
            className="w-full max-w-md mx-auto mb-6 rounded-lg overflow-hidden border-2"
            style={{ 
              borderColor: currentEnding?.color,
              boxShadow: `0 0 40px ${currentEnding?.color}30`
            }}
          >
            <img 
              src={`/assets/endings/${currentEnding?.id.toLowerCase()}.png`}
              alt={currentEnding?.title}
              className="w-full h-auto"
              style={{ filter: 'brightness(0.9)' }}
            />
          </div>

          <div className="text-center mb-4">
            <div 
              className="text-2xl font-bold mb-1"
              style={{ color: currentEnding?.color }}
            >
              {currentEnding?.subtitle}
            </div>
            <div className="text-gray-400 text-sm italic">
              "{currentEnding?.description}"
            </div>
          </div>

          {/* Ending Text */}
          <div className="bg-black/40 rounded-lg p-4 mb-4">
            <p className="text-gray-200 leading-relaxed text-center">
              {currentNode.text}
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div 
              className="rounded-lg p-3 border text-center"
              style={{ 
                backgroundColor: 'rgba(0,0,0,0.4)',
                borderColor: `${currentEnding?.color}30`
              }}
            >
              <div className="text-gray-400 text-xs uppercase tracking-wider">Floors</div>
              <div className="text-xl font-bold" style={{ color: currentEnding?.color }}>
                {state.visited_floors.length}
              </div>
            </div>
            <div 
              className="rounded-lg p-3 border text-center"
              style={{ 
                backgroundColor: 'rgba(0,0,0,0.4)',
                borderColor: `${currentEnding?.color}30`
              }}
            >
              <div className="text-gray-400 text-xs uppercase tracking-wider">Choices</div>
              <div className="text-xl font-bold" style={{ color: currentEnding?.color }}>
                {state.choices_made.length}
              </div>
            </div>
            <div 
              className="rounded-lg p-3 border text-center"
              style={{ 
                backgroundColor: 'rgba(0,0,0,0.4)',
                borderColor: `${currentEnding?.color}30`
              }}
            >
              <div className="text-gray-400 text-xs uppercase tracking-wider">Loop</div>
              <div className="text-xl font-bold" style={{ color: currentEnding?.color }}>
                #74
              </div>
            </div>
          </div>
        </div>

        {/* Other Endings to Discover */}
        <div className="mb-8">
          <div className="text-center mb-4">
            <h2 className="text-white text-xl font-bold mb-1">Endings to Discover</h2>
            <p className="text-gray-400 text-sm">
              You have unlocked 1 of 4 possible endings
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto">
            {ALL_ENDINGS.map(ending => {
              const isUnlocked = ending.id === currentNode.ending_type;
              return (
                <div
                  key={ending.id}
                  className={`
                    rounded-lg border p-3 transition-all duration-300
                    ${isUnlocked 
                      ? 'bg-gray-900/80' 
                      : 'bg-gray-900/40 opacity-60 hover:opacity-100'}
                  `}
                  style={{ 
                    borderColor: isUnlocked ? ending.color : `${ending.color}30`,
                    boxShadow: isUnlocked ? `0 0 20px ${ending.color}20` : 'none'
                  }}
                >
                  <div className="text-center">
                    {isUnlocked ? (
                      <>
                        <div className="text-lg font-bold mb-1" style={{ color: ending.color }}>
                          {ending.title}
                        </div>
                        <div className="text-xs text-gray-400 mb-2">{ending.subtitle}</div>
                        <div 
                          className="inline-block px-2 py-0.5 rounded text-xs font-mono"
                          style={{ 
                            backgroundColor: `${ending.color}20`,
                            color: ending.color 
                          }}
                        >
                          UNLOCKED
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="text-lg font-bold mb-1 text-gray-500">
                          ???
                        </div>
                        <div className="text-xs text-gray-500 mb-2">Not yet discovered</div>
                        <div 
                          className="inline-block px-2 py-0.5 rounded text-xs font-mono bg-gray-800 text-gray-500"
                        >
                          LOCKED
                        </div>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Ending Hints */}
        <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-700 rounded-lg p-4 mb-8 max-w-2xl mx-auto">
          <h3 className="text-white font-mono text-sm mb-3 flex items-center gap-2">
            <span>💡</span> HOW TO FIND OTHER ENDINGS
          </h3>
          <ul className="text-gray-400 text-sm space-y-2">
            <li className="flex items-start gap-2">
              <span style={{ color: '#FBBF24' }}>●</span>
              <span><strong>INTEGRATION:</strong> Choose supportive options and help characters face their truths</span>
            </li>
            <li className="flex items-start gap-2">
              <span style={{ color: '#6B7280' }}>●</span>
              <span><strong>SOLIDIFICATION:</strong> Avoid painful memories and protect yourself from the truth</span>
            </li>
            <li className="flex items-start gap-2">
              <span style={{ color: '#DC2626' }}>●</span>
              <span><strong>COLLAPSE:</strong> Push characters past their breaking points with pressure</span>
            </li>
            <li className="flex items-start gap-2">
              <span style={{ color: '#06B6D4' }}>●</span>
              <span><strong>TRANSCENDENCE:</strong> Find the hidden path that defies all expectations</span>
            </li>
          </ul>
        </div>

        {/* Replay Button */}
        <div className="text-center">
          <button
            onClick={handleRestart}
            className="
              px-12 py-4 font-bold text-xl rounded-xl
              transition-all duration-300
              hover:scale-105 active:scale-95
              border-2
              animate-pulse
            "
            style={{
              backgroundColor: `${currentEnding?.color}20`,
              borderColor: currentEnding?.color,
              color: currentEnding?.color,
              boxShadow: `0 0 40px ${currentEnding?.color}40`
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = `${currentEnding?.color}40`;
              e.currentTarget.style.boxShadow = `0 0 60px ${currentEnding?.color}60`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = `${currentEnding?.color}20`;
              e.currentTarget.style.boxShadow = `0 0 40px ${currentEnding?.color}40`;
            }}
          >
            ↺ BEGIN NEW LOOP
          </button>
          <div className="text-gray-500 text-sm mt-3">
            Different choices lead to different endings...
          </div>
        </div>

        {/* Final Character States */}
        <div className="mt-8 pt-6 border-t border-gray-800">
          <div className="text-center text-gray-500 text-sm mb-4">Final Character States</div>
          <div className="flex justify-center gap-6">
            {(['viktor', 'livia', 'kairen'] as const).map(charId => {
              const char = state.characters[charId];
              const portraitPath = `/assets/characters/${charId}/ui_${char.current_emotional_state.toLowerCase()}.png`;
              return (
                <div key={charId} className="text-center">
                  <div 
                    className="w-16 h-16 rounded-lg overflow-hidden border-2 mb-2 mx-auto"
                    style={{ borderColor: currentEnding?.color }}
                  >
                    <img 
                      src={portraitPath}
                      alt={char.character.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-sm text-white font-medium">{char.character.name.split(' ')[0]}</div>
                  <div className="text-xs" style={{ color: currentEnding?.color }}>
                    {char.current_emotional_state}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Glitch Effect Overlay */}
      <div 
        className="fixed inset-0 pointer-events-none z-50 opacity-10"
        style={{
          background: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            ${currentEnding?.color}10 2px,
            ${currentEnding?.color}10 4px
          )`
        }}
      />
    </div>
  );
}
