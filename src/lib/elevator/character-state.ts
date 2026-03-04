/**
 * ELEVATOR.EXE - FRACTURED LOOP
 * Character State Management System
 * 
 * Manages individual character psychological states, trust metrics,
 * and emotional progression through the simulation.
 */

import {
  EmotionalState,
  STATE_INTENSITY,
  STATE_MOMENTUM,
  isValidTransition,
  calculateTransitionProbability,
  getTransitionPath,
  VISUAL_SYMPTOMS,
  AUDIO_SYMPTOMS
} from './emotional-states';

// Character identifiers
export enum CharacterId {
  VIKTOR = 'viktor',
  LIVIA = 'livia',
  MARA = 'mara'
}

// Character psychological profiles
export interface CharacterProfile {
  id: CharacterId;
  name: string;
  role: string;
  hiddenTruth: string;
  breakTrigger: string;
  baseStability: number;
  baseSuppressionIndex: number;
  trustDecayRate: number;
  emotionalRecoveryRate: number;
  glitchResistance: number;
}

export const CHARACTER_PROFILES: Record<CharacterId, CharacterProfile> = {
  [CharacterId.VIKTOR]: {
    id: CharacterId.VIKTOR,
    name: 'Viktor',
    role: 'Maintenance',
    hiddenTruth: 'Made a decision during the original event that contributed to death',
    breakTrigger: 'Routine failure - when procedures cannot resolve the situation',
    baseStability: 75,
    baseSuppressionIndex: 70,
    trustDecayRate: 0.8,
    emotionalRecoveryRate: 1.2,
    glitchResistance: 0.6
  },
  [CharacterId.LIVIA]: {
    id: CharacterId.LIVIA,
    name: 'Livia',
    role: 'Analyst',
    hiddenTruth: 'Erased or suppressed part of the original event from memory',
    breakTrigger: 'Silence - loss of external validation and feedback',
    baseStability: 80,
    baseSuppressionIndex: 75,
    trustDecayRate: 1.0,
    emotionalRecoveryRate: 0.9,
    glitchResistance: 0.5
  },
  [CharacterId.MARA]: {
    id: CharacterId.MARA,
    name: 'Mara',
    role: 'The Unstable Element',
    hiddenTruth: 'Knew something before the event - predicted or warned about it',
    breakTrigger: 'Dismissal - having perceptions categorically rejected',
    baseStability: 50,
    baseSuppressionIndex: 40,
    trustDecayRate: 1.5,
    emotionalRecoveryRate: 0.5,
    glitchResistance: 0.2
  }
};

// Trust values for a character
export interface TrustMatrix {
  towardPlayer: number;       // -100 to 100
  towardViktor: number;       // -100 to 100
  towardLivia: number;        // -100 to 100
  towardMara: number;         // -100 to 100
  towardSystem: number;       // -100 to 100
}

// Complete character state
export interface CharacterState {
  characterId: CharacterId;
  profile: CharacterProfile;
  currentEmotionalState: EmotionalState;
  previousEmotionalState: EmotionalState | null;
  stateHistory: Array<{
    state: EmotionalState;
    timestamp: number;
    trigger: string;
  }>;
  emotionalMomentum: number;      // 0 to 1 - resistance to state change
  stability: number;              // 0 to 100
  suppressionIndex: number;       // 0 to 100 - strength of denial
  trust: TrustMatrix;
  memoryFragmentsAccessed: string[];
  dialogueHistory: string[];
  timeInCurrentState: number;     // Simulation ticks
  totalIterationsExperienced: number;
}

/**
 * Create initial character state
 */
export function createInitialCharacterState(characterId: CharacterId): CharacterState {
  const profile = CHARACTER_PROFILES[characterId];
  
  return {
    characterId,
    profile,
    currentEmotionalState: EmotionalState.IDLE,
    previousEmotionalState: null,
    stateHistory: [{
      state: EmotionalState.IDLE,
      timestamp: 0,
      trigger: 'Simulation initialization'
    }],
    emotionalMomentum: STATE_MOMENTUM[EmotionalState.IDLE],
    stability: profile.baseStability,
    suppressionIndex: profile.baseSuppressionIndex,
    trust: {
      towardPlayer: 0,          // Unknown entity
      towardViktor: characterId === CharacterId.VIKTOR ? 0 : 25,  // Slight familiarity
      towardLivia: characterId === CharacterId.LIVIA ? 0 : 25,
      towardMara: characterId === CharacterId.MARA ? 0 : 15,      // Mara is less trusted
      towardSystem: -10         // Inherent distrust of the simulation
    },
    memoryFragmentsAccessed: [],
    dialogueHistory: [],
    timeInCurrentState: 0,
    totalIterationsExperienced: 0
  };
}

/**
 * Attempt to transition character to new emotional state
 */
export function attemptStateTransition(
  state: CharacterState,
  targetState: EmotionalState,
  triggerStrength: number,
  triggerSource: string
): {
  success: boolean;
  newState: CharacterState;
  transitionProbability: number;
  reason: string;
} {
  const currentState = state.currentEmotionalState;
  
  // Check if already in target state
  if (currentState === targetState) {
    return {
      success: false,
      newState: state,
      transitionProbability: 0,
      reason: 'Already in target state'
    };
  }

  // Validate transition
  const validation = isValidTransition(currentState, targetState, triggerStrength);
  if (!validation.valid) {
    // Check for path through intermediate states
    const path = getTransitionPath(currentState, targetState);
    if (path.length > 0 && path.length <= 3) {
      // Can transition through intermediate states
      targetState = path[0];
    } else {
      return {
        success: false,
        newState: state,
        transitionProbability: 0,
        reason: validation.reason
      };
    }
  }

  // Calculate probability
  const probability = calculateTransitionProbability(
    currentState,
    targetState,
    triggerStrength,
    state.emotionalMomentum
  );

  // Determine if transition occurs
  const roll = Math.random();
  const success = roll < probability;

  if (success) {
    const newState: CharacterState = {
      ...state,
      currentEmotionalState: targetState,
      previousEmotionalState: currentState,
      stateHistory: [
        ...state.stateHistory,
        {
          state: targetState,
          timestamp: Date.now(),
          trigger: triggerSource
        }
      ],
      emotionalMomentum: STATE_MOMENTUM[targetState],
      timeInCurrentState: 0,
      stability: Math.max(0, state.stability - STATE_INTENSITY[targetState])
    };

    return {
      success: true,
      newState,
      transitionProbability: probability,
      reason: `Transition successful: ${currentState} -> ${targetState}`
    };
  }

  // Failed transition - increase momentum
  return {
    success: false,
    newState: {
      ...state,
      emotionalMomentum: Math.min(1, state.emotionalMomentum + 0.1)
    },
    transitionProbability: probability,
    reason: `Transition failed: momentum resistance (roll: ${roll.toFixed(2)} vs prob: ${probability.toFixed(2)})`
  };
}

/**
 * Modify trust value
 */
export function modifyTrust(
  state: CharacterState,
  target: keyof TrustMatrix,
  delta: number,
  reason: string
): CharacterState {
  const currentTrust = state.trust[target];
  const newTrust = Math.max(-100, Math.min(100, currentTrust + delta));
  
  // Check if trust change should trigger emotional response
  let emotionalTrigger: EmotionalState | null = null;
  
  if (delta < -20 && state.trust.towardPlayer > 50) {
    // Major betrayal
    emotionalTrigger = EmotionalState.ANGRY;
  } else if (delta > 20 && state.trust.towardPlayer < -20) {
    // Unexpected redemption
    emotionalTrigger = EmotionalState.SUSPICIOUS;
  } else if (newTrust >= 80 && currentTrust < 80) {
    // High trust threshold
    emotionalTrigger = EmotionalState.CALM;
  } else if (newTrust <= -50 && currentTrust > -50) {
    // Deep distrust threshold
    emotionalTrigger = EmotionalState.AFRAID;
  }

  const newState: CharacterState = {
    ...state,
    trust: {
      ...state.trust,
      [target]: newTrust
    }
  };

  // Apply emotional trigger if present
  if (emotionalTrigger) {
    const transition = attemptStateTransition(
      newState,
      emotionalTrigger,
      1.5,
      `Trust change: ${reason}`
    );
    return transition.newState;
  }

  return newState;
}

/**
 * Process time tick for character state
 */
export function processTick(state: CharacterState): CharacterState {
  let newState = { ...state };
  
  // Increment time in current state
  newState.timeInCurrentState += 1;
  
  // Natural emotional momentum decay
  const momentumDecay = state.profile.emotionalRecoveryRate * 0.01;
  newState.emotionalMomentum = Math.max(
    STATE_MOMENTUM[state.currentEmotionalState],
    state.emotionalMomentum - momentumDecay
  );

  // Natural stability recovery (if not in crisis state)
  if (
    state.currentEmotionalState !== EmotionalState.PANICKED &&
    state.currentEmotionalState !== EmotionalState.COLLAPSE &&
    state.currentEmotionalState !== EmotionalState.BROKEN &&
    state.currentEmotionalState !== EmotionalState.GLITCH
  ) {
    const recoveryRate = state.profile.emotionalRecoveryRate * 0.05;
    newState.stability = Math.min(100, state.stability + recoveryRate);
  }

  // Check for automatic state transitions based on time
  if (state.timeInCurrentState > 100) {
    // Prolonged stress causes escalation
    if (state.currentEmotionalState === EmotionalState.STRESSED) {
      const transition = attemptStateTransition(
        newState,
        EmotionalState.AFRAID,
        0.5,
        'Prolonged stress escalation'
      );
      if (transition.success) return transition.newState;
    }
    
    // Prolonged fear causes panic
    if (state.currentEmotionalState === EmotionalState.AFRAID) {
      const transition = attemptStateTransition(
        newState,
        EmotionalState.PANICKED,
        0.5,
        'Prolonged fear escalation'
      );
      if (transition.success) return transition.newState;
    }
    
    // Prolonged panic causes collapse
    if (state.currentEmotionalState === EmotionalState.PANICKED) {
      const transition = attemptStateTransition(
        newState,
        EmotionalState.COLLAPSE,
        0.5,
        'Prolonged panic collapse'
      );
      if (transition.success) return transition.newState;
    }
  }

  // Check for natural recovery from negative states
  if (
    state.timeInCurrentState > 200 &&
    state.stability > 60 &&
    (state.currentEmotionalState === EmotionalState.STRESSED ||
     state.currentEmotionalState === EmotionalState.SUSPICIOUS ||
     state.currentEmotionalState === EmotionalState.AFRAID)
  ) {
    const transition = attemptStateTransition(
      newState,
      EmotionalState.CALM,
      0.3,
      'Natural recovery'
    );
    if (transition.success) return transition.newState;
  }

  return newState;
}

/**
 * Access memory fragment - affects suppression index
 */
export function accessMemoryFragment(
  state: CharacterState,
  fragmentId: string,
  intensity: number
): CharacterState {
  // Check if fragment already accessed
  if (state.memoryFragmentsAccessed.includes(fragmentId)) {
    return state;
  }

  // Reduce suppression index based on intensity
  const suppressionReduction = intensity * 5;
  const newSuppressionIndex = Math.max(0, state.suppressionIndex - suppressionReduction);

  // Determine emotional response to memory access
  let emotionalTrigger = EmotionalState.SUSPICIOUS;
  
  if (intensity > 0.7) {
    emotionalTrigger = EmotionalState.HALF_AWARE;
  } else if (intensity > 0.5) {
    emotionalTrigger = EmotionalState.AFRAID;
  } else if (intensity > 0.3) {
    emotionalTrigger = EmotionalState.STRESSED;
  }

  const newState: CharacterState = {
    ...state,
    memoryFragmentsAccessed: [...state.memoryFragmentsAccessed, fragmentId],
    suppressionIndex: newSuppressionIndex
  };

  // Apply emotional trigger
  const transition = attemptStateTransition(
    newState,
    emotionalTrigger,
    intensity,
    `Memory fragment access: ${fragmentId}`
  );

  return transition.newState;
}

/**
 * Get visual symptoms for current state
 */
export function getVisualSymptoms(state: CharacterState) {
  return VISUAL_SYMPTOMS[state.currentEmotionalState];
}

/**
 * Get audio symptoms for current state
 */
export function getAudioSymptoms(state: CharacterState) {
  return AUDIO_SYMPTOMS[state.currentEmotionalState];
}

/**
 * Check if character can process revelation
 */
export function canProcessRevelation(state: CharacterState): boolean {
  return (
    state.suppressionIndex < 50 &&
    state.stability > 30 &&
    state.trust.towardPlayer > 30 &&
    state.currentEmotionalState !== EmotionalState.GLITCH &&
    state.currentEmotionalState !== EmotionalState.BROKEN
  );
}

/**
 * Calculate character's contribution to overall simulation stability
 */
export function calculateStabilityContribution(state: CharacterState): number {
  const stateImpact = STATE_INTENSITY[state.currentEmotionalState];
  const trustModifier = (state.trust.towardSystem + 100) / 200; // 0 to 1
  const suppressionModifier = state.suppressionIndex / 100; // 0 to 1
  
  // Higher trust in system and higher suppression = more stable
  // Higher emotional intensity = less stable
  const contribution = state.stability - (stateImpact * (1 - suppressionModifier) * (1 - trustModifier));
  
  return Math.max(0, Math.min(100, contribution));
}
