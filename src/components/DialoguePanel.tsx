'use client';

import { useGame } from '@/lib/gameStore';
import { CharacterId, CHARACTERS, ChoiceType } from '@/lib/gameData';
import { CharacterPortrait } from './CharacterPortrait';
import { audioManager } from '@/lib/audioManager';
import { preRecordedTTS } from '@/lib/preRecordedTTS';
import { useEffect, useState, useRef } from 'react';

// Scene images for specific dialogue nodes
const SCENE_IMAGES: Record<string, { image: string; caption: string }> = {
  'F1_ROOM13': {
    image: '/assets/scenes/room_13.png',
    caption: 'Room 13 — The truth awaits'
  },
  'F5_MEMORY': {
    image: '/assets/scenes/street_crash.png',
    caption: 'The collision — Frozen in time'
  },
  'F9_REVELATION': {
    image: '/assets/scenes/office_files.png',
    caption: 'Project Fractured Loop — The files reveal all'
  }
};

export function DialoguePanel() {
  const { currentNode, state, nextNode, makeChoice, showEnding } = useGame();
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showChoices, setShowChoices] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const prevNodeIdRef = useRef<string>('');
  const typewriterIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Typewriter effect + Pre-recorded TTS
  useEffect(() => {
    if (!currentNode) return;
    
    // Stop any ongoing audio when changing nodes
    preRecordedTTS.stop();
    setIsSpeaking(false);
    
    // Clear any existing typewriter
    if (typewriterIntervalRef.current) {
      clearInterval(typewriterIntervalRef.current);
    }
    
    setDisplayedText('');
    setIsTyping(true);
    setShowChoices(false);
    
    const text = currentNode.text;
    let index = 0;
    
    // Start playing pre-recorded audio immediately (if available and not ending)
    const shouldPlayVoice = voiceEnabled && 
                           currentNode.speaker && 
                           !currentNode.is_ending && 
                           preRecordedTTS.hasAudio(currentNode.id);
    
    if (shouldPlayVoice) {
      setIsSpeaking(true);
      preRecordedTTS.play(currentNode.id).then(() => {
        setIsSpeaking(false);
      });
    }
    
    // Typewriter effect - skip typing sounds if voice is playing
    typewriterIntervalRef.current = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(text.slice(0, index + 1));
        // Only play typing sound if no voice is playing
        if (!isSpeaking && text[index] !== ' ' && Math.random() > 0.7) {
          audioManager.playTypeKey();
        }
        index++;
      } else {
        setIsTyping(false);
        setShowChoices(true);
        clearInterval(typewriterIntervalRef.current!);
      }
    }, 25);

    prevNodeIdRef.current = currentNode.id;

    return () => {
      if (typewriterIntervalRef.current) {
        clearInterval(typewriterIntervalRef.current);
      }
      preRecordedTTS.stop();
    };
  }, [currentNode?.id, voiceEnabled]);

  // Toggle voice
  const toggleVoice = () => {
    const newState = preRecordedTTS.toggle();
    setVoiceEnabled(newState);
    if (!newState) {
      setIsSpeaking(false);
    }
  };

  if (!currentNode) return null;

  const isCharacter = currentNode.speaker !== 'SYSTEM' && currentNode.speaker !== 'PLAYER';
  const speakerInfo = isCharacter ? CHARACTERS[currentNode.speaker as CharacterId] : null;
  const isEndingNode = currentNode.is_ending;

  const handleNext = () => {
    // Skip voice if speaking
    if (isSpeaking) {
      preRecordedTTS.skip();
      setIsSpeaking(false);
      return;
    }
    
    // Skip typewriter if typing
    if (isTyping) {
      setDisplayedText(currentNode.text);
      setIsTyping(false);
      setShowChoices(true);
      return;
    }
    
    // Navigate to next node if there is one
    if (currentNode.next_node_id && !currentNode.choices) {
      audioManager.playClick();
      preRecordedTTS.stop();
      setIsSpeaking(false);
      nextNode(currentNode.next_node_id);
    }
  };

  const handleChoice = (choiceId: string) => {
    audioManager.playChoiceSelect();
    preRecordedTTS.stop();
    setIsSpeaking(false);
    makeChoice(currentNode.id, choiceId);
  };

  // Handle reaching an ending - trigger the ending phase
  const handleViewEnding = () => {
    audioManager.playChoiceSelect();
    preRecordedTTS.stop();
    
    // Play ending sound
    if (currentNode.ending_type) {
      audioManager.stopAll();
      audioManager.playEnding(currentNode.ending_type);
    }
    
    // Show the ending screen
    showEnding();
  };

  // Check if current node has a scene image
  const sceneData = currentNode ? SCENE_IMAGES[currentNode.id] : null;

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Scene Image Display */}
      {sceneData && (
        <div className="mb-4 rounded-xl overflow-hidden border border-gray-700 animate-fadeIn">
          <div className="relative">
            <img 
              src={sceneData.image}
              alt={sceneData.caption}
              className="w-full h-48 object-cover"
              style={{ filter: 'brightness(0.8)' }}
            />
            <div 
              className="absolute bottom-0 left-0 right-0 px-4 py-2 bg-gradient-to-t from-black/80 to-transparent"
            >
              <span className="text-gray-300 text-sm font-mono italic">
                {sceneData.caption}
              </span>
            </div>
          </div>
        </div>
      )}
      
      {/* Voice Toggle Button */}
      <div className="flex justify-end mb-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleVoice();
          }}
          className={`
            px-3 py-1.5 rounded-lg text-xs font-mono transition-all duration-200
            ${voiceEnabled 
              ? 'bg-cyan-900/50 border border-cyan-500/50 text-cyan-400 hover:bg-cyan-800/50' 
              : 'bg-gray-800/50 border border-gray-600/50 text-gray-500 hover:bg-gray-700/50'}
          `}
          title={voiceEnabled ? 'Voice enabled - Click to disable' : 'Voice disabled - Click to enable'}
        >
          {voiceEnabled ? '🔊 VOICE ON' : '🔇 VOICE OFF'}
        </button>
      </div>
      
      {/* Main Dialogue Box */}
      <div 
        className="relative bg-gray-900/90 backdrop-blur-sm border border-gray-700 rounded-lg p-6 cursor-pointer"
        onClick={handleNext}
        style={{
          boxShadow: '0 0 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)'
        }}
      >
        {/* Speaker Name */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            {currentNode.speaker === 'SYSTEM' ? (
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full bg-cyan-400 ${isSpeaking ? 'animate-pulse' : ''}`} />
                <span className="text-cyan-400 font-mono text-sm uppercase tracking-wider">
                  ELEVATOR.OS
                </span>
              </div>
            ) : speakerInfo && (
              <div className="flex items-center gap-3">
                <CharacterPortrait 
                  character={currentNode.speaker as CharacterId} 
                  size="small"
                  isSpeaking={isSpeaking || !isTyping}
                />
                <span 
                  className="font-bold"
                  style={{ color: '#fff' }}
                >
                  {speakerInfo.name}
                </span>
                {isSpeaking && (
                  <span className="text-cyan-400 text-xs animate-pulse">Speaking...</span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Dialogue Text */}
        <div className="text-gray-100 text-lg leading-relaxed min-h-[80px]">
          {displayedText}
          {isTyping && (
            <span className="inline-block w-2 h-5 ml-1 bg-cyan-400 animate-pulse" />
          )}
        </div>

        {/* Continue Indicator */}
        {!isTyping && currentNode.next_node_id && !currentNode.choices && !isEndingNode && (
          <div className="absolute bottom-4 right-4 text-gray-400 text-sm animate-pulse">
            {isSpeaking ? 'Click to skip voice ▸' : 'Click to continue ▸'}
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

      {/* Ending Continue Button */}
      {showChoices && isEndingNode && !isTyping && (
        <div className="mt-6 animate-fadeIn">
          <button
            onClick={handleViewEnding}
            className="
              w-full py-4 px-8 rounded-lg
              bg-gradient-to-r from-purple-900/50 to-cyan-900/50
              border-2 border-cyan-500
              text-cyan-400 font-mono text-lg tracking-wider
              hover:from-purple-800/50 hover:to-cyan-800/50
              hover:text-cyan-300 hover:scale-[1.02]
              transition-all duration-300
              animate-pulse
            "
          >
            ✧ VIEW ENDING ✧
          </button>
          <div className="text-center text-gray-500 text-xs mt-2 font-mono">
            The loop reaches its conclusion...
          </div>
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
  const typeConfig: Record<ChoiceType, { bg: string; border: string; image: string; color: string }> = {
    SUPPORT: { 
      bg: 'bg-emerald-900/50 hover:bg-emerald-800/50', 
      border: 'border-emerald-500/50',
      image: '/assets/choices/support.png',
      color: '#10B981'
    },
    PRESSURE: { 
      bg: 'bg-red-900/50 hover:bg-red-800/50', 
      border: 'border-red-500/50',
      image: '/assets/choices/pressure.png',
      color: '#EF4444'
    },
    AVOID: { 
      bg: 'bg-gray-800/50 hover:bg-gray-700/50', 
      border: 'border-gray-500/50',
      image: '/assets/choices/avoid.png',
      color: '#6B7280'
    },
    REVEAL: { 
      bg: 'bg-purple-900/50 hover:bg-purple-800/50', 
      border: 'border-purple-500/50',
      image: '/assets/choices/reveal.png',
      color: '#8B5CF6'
    }
  };

  const config = typeConfig[choice.type];

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      className={`
        w-full text-left p-3 rounded-lg border transition-all duration-200
        ${config.bg} ${config.border}
        hover:scale-[1.02] hover:shadow-lg
        active:scale-[0.98]
        group
      `}
      style={{
        animationDelay: `${index * 100}ms`,
        boxShadow: `0 0 0 rgba(${config.color}, 0)`
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = `0 0 20px ${config.color}40`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 0 0 rgba(0,0,0,0)';
      }}
    >
      <div className="flex items-center gap-3">
        {/* Choice Type Icon */}
        <div 
          className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 border border-gray-600 group-hover:border-gray-500 transition-colors"
          style={{ borderColor: `${config.color}50` }}
        >
          <img 
            src={config.image} 
            alt={choice.type}
            className="w-full h-full object-cover"
            style={{ filter: 'brightness(0.9)' }}
          />
        </div>
        
        <div className="flex-1">
          <div 
            className="text-xs uppercase tracking-wider mb-1 font-mono"
            style={{ color: config.color }}
          >
            {choice.type}
          </div>
          <div className="text-gray-100 text-sm leading-snug">{choice.text}</div>
        </div>
        
        {/* Arrow indicator */}
        <div 
          className="text-2xl opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ color: config.color }}
        >
          →
        </div>
      </div>
    </button>
  );
}
