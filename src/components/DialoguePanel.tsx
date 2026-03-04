'use client';

import { useGame } from '@/lib/gameStore';
import { CharacterId, CHARACTERS, ChoiceType } from '@/lib/gameData';
import { CharacterPortrait } from './CharacterPortrait';
import { audioManager } from '@/lib/audioManager';
import { useEffect, useState } from 'react';

export function DialoguePanel() {
  const { currentNode, state, nextNode, makeChoice } = useGame();
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showChoices, setShowChoices] = useState(false);

  // Typewriter effect
  useEffect(() => {
    if (!currentNode) return;
    
    setDisplayedText('');
    setIsTyping(true);
    setShowChoices(false);
    
    let index = 0;
    const text = currentNode.text;
    const interval = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(text.slice(0, index + 1));
        // Play typing sound on some characters (not spaces)
        if (text[index] !== ' ' && Math.random() > 0.7) {
          audioManager.playTypeKey();
        }
        index++;
      } else {
        setIsTyping(false);
        setShowChoices(true);
        clearInterval(interval);
      }
    }, 25);

    return () => clearInterval(interval);
  }, [currentNode?.id]);

  if (!currentNode) return null;

  const isCharacter = currentNode.speaker !== 'SYSTEM' && currentNode.speaker !== 'PLAYER';
  const speakerInfo = isCharacter ? CHARACTERS[currentNode.speaker as CharacterId] : null;

  const handleNext = () => {
    if (isTyping) {
      setDisplayedText(currentNode.text);
      setIsTyping(false);
      setShowChoices(true);
      return;
    }
    
    if (currentNode.next_node_id && !currentNode.choices) {
      audioManager.playClick();
      nextNode(currentNode.next_node_id);
    }
  };

  const handleChoice = (choiceId: string) => {
    audioManager.playChoiceSelect();
    makeChoice(currentNode.id, choiceId);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Main Dialogue Box */}
      <div 
        className="relative bg-gray-900/90 backdrop-blur-sm border border-gray-700 rounded-lg p-6 cursor-pointer"
        onClick={handleNext}
        style={{
          boxShadow: '0 0 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)'
        }}
      >
        {/* Speaker Name */}
        <div className="flex items-center gap-4 mb-4">
          {currentNode.speaker === 'SYSTEM' ? (
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-cyan-400 font-mono text-sm uppercase tracking-wider">
                ELEVATOR.OS
              </span>
            </div>
          ) : speakerInfo && (
            <div className="flex items-center gap-3">
              <CharacterPortrait 
                character={currentNode.speaker as CharacterId} 
                size="small"
                isSpeaking={!isTyping}
              />
              <span 
                className="font-bold"
                style={{ color: '#fff' }}
              >
                {speakerInfo.name}
              </span>
            </div>
          )}
        </div>

        {/* Dialogue Text */}
        <div className="text-gray-100 text-lg leading-relaxed min-h-[80px]">
          {displayedText}
          {isTyping && (
            <span className="inline-block w-2 h-5 ml-1 bg-cyan-400 animate-pulse" />
          )}
        </div>

        {/* Continue Indicator */}
        {!isTyping && currentNode.next_node_id && !currentNode.choices && (
          <div className="absolute bottom-4 right-4 text-gray-400 text-sm animate-pulse">
            Click to continue ▸
          </div>
        )}
      </div>

      {/* Choice Buttons */}
      {showChoices && currentNode.choices && currentNode.choices.length > 0 && (
        <div className="mt-6 space-y-3 animate-fadeIn">
          <div className="text-gray-400 text-sm mb-2">Choose your response:</div>
          {currentNode.choices.map((choice, index) => (
            <ChoiceButton 
              key={choice.id} 
              choice={choice} 
              index={index}
              onSelect={() => handleChoice(choice.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface ChoiceButtonProps {
  choice: {
    id: string;
    text: string;
    type: ChoiceType;
  };
  index: number;
  onSelect: () => void;
}

function ChoiceButton({ choice, index, onSelect }: ChoiceButtonProps) {
  const typeStyles: Record<ChoiceType, { bg: string; border: string; icon: string }> = {
    SUPPORT: { 
      bg: 'bg-emerald-900/50 hover:bg-emerald-800/50', 
      border: 'border-emerald-500/50',
      icon: '💚' 
    },
    PRESSURE: { 
      bg: 'bg-red-900/50 hover:bg-red-800/50', 
      border: 'border-red-500/50',
      icon: '⚡' 
    },
    AVOID: { 
      bg: 'bg-gray-800/50 hover:bg-gray-700/50', 
      border: 'border-gray-500/50',
      icon: '🚪' 
    },
    REVEAL: { 
      bg: 'bg-purple-900/50 hover:bg-purple-800/50', 
      border: 'border-purple-500/50',
      icon: '👁' 
    }
  };

  const style = typeStyles[choice.type];

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      className={`
        w-full text-left p-4 rounded-lg border transition-all duration-200
        ${style.bg} ${style.border}
        hover:scale-[1.02] hover:shadow-lg
        active:scale-[0.98]
      `}
      style={{
        animationDelay: `${index * 100}ms`
      }}
    >
      <div className="flex items-start gap-3">
        <span className="text-lg">{style.icon}</span>
        <div>
          <div className="text-xs uppercase tracking-wider text-gray-400 mb-1">
            {choice.type}
          </div>
          <div className="text-gray-100">{choice.text}</div>
        </div>
      </div>
    </button>
  );
}
