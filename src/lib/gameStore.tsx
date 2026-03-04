'use client';

import React, { createContext, useContext, useReducer, useCallback, ReactNode } from 'react';
import {
  GameState,
  createInitialState,
  EmotionalState,
  CharacterId,
  DialogueNode,
  DIALOGUE_NODES,
  EMOTIONAL_STATE_INFO,
  FloorId,
  FLOORS
} from './gameData';

// ==================== ACTIONS ====================
type GameAction =
  | { type: 'START_GAME' }
  | { type: 'NEXT_NODE'; nodeId: string }
  | { type: 'MAKE_CHOICE'; nodeId: string; choiceId: string }
  | { type: 'UPDATE_EMOTIONAL_STATE'; character: CharacterId; state: EmotionalState }
  | { type: 'UPDATE_ATTRIBUTES'; character: CharacterId; delta: Record<string, number> }
  | { type: 'VISIT_FLOOR'; floor: FloorId }
  | { type: 'SET_PHASE'; phase: GameState['game_phase'] }
  | { type: 'SHOW_ENDING' }
  | { type: 'RESTART' };

// ==================== REDUCER ====================
function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'START_GAME':
      return {
        ...state,
        game_started: true
      };

    case 'NEXT_NODE':
      const node = DIALOGUE_NODES.find(n => n.id === action.nodeId);
      if (!node) return state;
      
      let newPhase = state.game_phase;
      if (node.is_ending) {
        newPhase = 'ENDING';
      } else if (node.current_floor === 'F13') {
        newPhase = 'CORE';
      } else if (state.game_phase === 'INTRO' && !node.next_node_id?.startsWith('START') && !node.next_node_id?.includes('INTRO')) {
        newPhase = 'EXPLORATION';
      }
      
      return {
        ...state,
        current_node_id: action.nodeId,
        current_floor: node.current_floor,
        game_phase: newPhase,
        visited_floors: state.visited_floors.includes(node.current_floor) 
          ? state.visited_floors 
          : [...state.visited_floors, node.current_floor]
      };

    case 'MAKE_CHOICE':
      const choiceNode = DIALOGUE_NODES.find(n => n.id === action.nodeId);
      const choice = choiceNode?.choices?.find(c => c.id === action.choiceId);
      
      if (!choice) return state;

      // Find the next node to check if it's an ending
      const nextNode = DIALOGUE_NODES.find(n => n.id === choice.next_node_id);
      
      // Determine new phase
      let newPhaseFromChoice = state.game_phase;
      if (nextNode?.is_ending) {
        newPhaseFromChoice = 'ENDING';
      } else if (nextNode?.current_floor === 'F13') {
        newPhaseFromChoice = 'CORE';
      } else if (state.game_phase === 'INTRO') {
        newPhaseFromChoice = 'EXPLORATION';
      }

      // Apply emotional impacts
      let updatedCharacters = { ...state.characters };
      choice.emotional_impact.forEach(impact => {
        const charState = updatedCharacters[impact.character];
        if (charState) {
          const newAttributes = { ...charState.attributes };
          if (impact.delta.stability !== undefined) {
            newAttributes.stability = Math.max(0, Math.min(100, newAttributes.stability + impact.delta.stability));
          }
          if (impact.delta.trust !== undefined) {
            newAttributes.trust = Math.max(0, Math.min(100, newAttributes.trust + impact.delta.trust));
          }
          if (impact.delta.repression_index !== undefined) {
            newAttributes.repression_index = Math.max(0, Math.min(100, newAttributes.repression_index + impact.delta.repression_index));
          }
          
          updatedCharacters[impact.character] = {
            ...charState,
            attributes: newAttributes,
            current_emotional_state: impact.state_change || charState.current_emotional_state
          };
        }
      });

      // Update visited floors
      const newFloor = nextNode?.current_floor;
      const newVisitedFloors = newFloor && !state.visited_floors.includes(newFloor)
        ? [...state.visited_floors, newFloor]
        : state.visited_floors;

      return {
        ...state,
        current_node_id: choice.next_node_id,
        current_floor: nextNode?.current_floor || state.current_floor,
        game_phase: newPhaseFromChoice,
        choices_made: [...state.choices_made, { node_id: action.nodeId, choice_id: action.choiceId }],
        characters: updatedCharacters,
        visited_floors: newVisitedFloors
      };

    case 'UPDATE_EMOTIONAL_STATE':
      return {
        ...state,
        characters: {
          ...state.characters,
          [action.character]: {
            ...state.characters[action.character],
            current_emotional_state: action.state
          }
        }
      };

    case 'UPDATE_ATTRIBUTES':
      const charToUpdate = state.characters[action.character];
      const newAttrs = { ...charToUpdate.attributes };
      Object.entries(action.delta).forEach(([key, value]) => {
        if (key in newAttrs) {
          newAttrs[key as keyof typeof newAttrs] = Math.max(0, Math.min(100, newAttrs[key as keyof typeof newAttrs] + value));
        }
      });
      return {
        ...state,
        characters: {
          ...state.characters,
          [action.character]: {
            ...charToUpdate,
            attributes: newAttrs
          }
        }
      };

    case 'VISIT_FLOOR':
      return {
        ...state,
        current_floor: action.floor,
        visited_floors: state.visited_floors.includes(action.floor) 
          ? state.visited_floors 
          : [...state.visited_floors, action.floor]
      };

    case 'SET_PHASE':
      return {
        ...state,
        game_phase: action.phase
      };

    case 'SHOW_ENDING':
      return {
        ...state,
        game_phase: 'ENDING'
      };

    case 'RESTART':
      return createInitialState();

    default:
      return state;
  }
}

// ==================== CONTEXT ====================
interface GameContextType {
  state: GameState;
  currentNode: DialogueNode | undefined;
  currentFloor: typeof FLOORS[FloorId];
  dispatch: React.Dispatch<GameAction>;
  startGame: () => void;
  nextNode: (nodeId: string) => void;
  makeChoice: (nodeId: string, choiceId: string) => void;
  showEnding: () => void;
  restart: () => void;
  getPortraitPath: (character: CharacterId) => string;
  getStateColor: (state: EmotionalState) => string;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

// ==================== PROVIDER ====================
export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, null, createInitialState);

  const currentNode = DIALOGUE_NODES.find(n => n.id === state.current_node_id);
  const currentFloor = FLOORS[state.current_floor];

  const startGame = useCallback(() => {
    dispatch({ type: 'START_GAME' });
  }, []);

  const nextNode = useCallback((nodeId: string) => {
    dispatch({ type: 'NEXT_NODE', nodeId });
  }, []);

  const makeChoice = useCallback((nodeId: string, choiceId: string) => {
    dispatch({ type: 'MAKE_CHOICE', nodeId, choiceId });
  }, []);

  const showEnding = useCallback(() => {
    dispatch({ type: 'SHOW_ENDING' });
  }, []);

  const restart = useCallback(() => {
    dispatch({ type: 'RESTART' });
  }, []);

  const getPortraitPath = useCallback((character: CharacterId) => {
    const charState = state.characters[character];
    return `/assets/characters/${character}/ui_${charState.current_emotional_state.toLowerCase()}.png`;
  }, [state.characters]);

  const getStateColor = useCallback((emotionalState: EmotionalState) => {
    return EMOTIONAL_STATE_INFO[emotionalState].color;
  }, []);

  return (
    <GameContext.Provider value={{
      state,
      currentNode,
      currentFloor,
      dispatch,
      startGame,
      nextNode,
      makeChoice,
      showEnding,
      restart,
      getPortraitPath,
      getStateColor
    }}>
      {children}
    </GameContext.Provider>
  );
}

// ==================== HOOK ====================
export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
