/**
 * ELEVATOR.EXE - FRACTURED LOOP
 * Emotional State System Architecture
 * 
 * This module defines the core emotional state types and transitions
 * for the psychological simulation system.
 */

// Emotional State Enum - All possible states for characters
export enum EmotionalState {
  IDLE = 'IDLE',
  CALM = 'CALM',
  SUSPICIOUS = 'SUSPICIOUS',
  STRESSED = 'STRESSED',
  AFRAID = 'AFRAID',
  PANICKED = 'PANICKED',
  ANGRY = 'ANGRY',
  HALF_AWARE = 'HALF_AWARE',
  COLLAPSE = 'COLLAPSE',
  BROKEN = 'BROKEN',
  GLITCH = 'GLITCH'
}

// State intensity mapping for stability calculations
export const STATE_INTENSITY: Record<EmotionalState, number> = {
  [EmotionalState.IDLE]: 0,
  [EmotionalState.CALM]: -5,
  [EmotionalState.SUSPICIOUS]: 5,
  [EmotionalState.STRESSED]: 15,
  [EmotionalState.AFRAID]: 25,
  [EmotionalState.PANICKED]: 40,
  [EmotionalState.ANGRY]: 30,
  [EmotionalState.HALF_AWARE]: 35,
  [EmotionalState.COLLAPSE]: 50,
  [EmotionalState.BROKEN]: 60,
  [EmotionalState.GLITCH]: 80
};

// State momentum values - resistance to transition
export const STATE_MOMENTUM: Record<EmotionalState, number> = {
  [EmotionalState.IDLE]: 0.1,
  [EmotionalState.CALM]: 0.15,
  [EmotionalState.SUSPICIOUS]: 0.3,
  [EmotionalState.STRESSED]: 0.5,
  [EmotionalState.AFRAID]: 0.7,
  [EmotionalState.PANICKED]: 0.85,
  [EmotionalState.ANGRY]: 0.75,
  [EmotionalState.HALF_AWARE]: 0.6,
  [EmotionalState.COLLAPSE]: 0.9,
  [EmotionalState.BROKEN]: 0.95,
  [EmotionalState.GLITCH]: 1.0
};

// Valid state transitions - organic progression enforcement
export const VALID_TRANSITIONS: Record<EmotionalState, EmotionalState[]> = {
  [EmotionalState.IDLE]: [EmotionalState.CALM, EmotionalState.SUSPICIOUS, EmotionalState.STRESSED],
  [EmotionalState.CALM]: [EmotionalState.IDLE, EmotionalState.SUSPICIOUS, EmotionalState.STRESSED],
  [EmotionalState.SUSPICIOUS]: [EmotionalState.CALM, EmotionalState.STRESSED, EmotionalState.AFRAID, EmotionalState.ANGRY],
  [EmotionalState.STRESSED]: [EmotionalState.CALM, EmotionalState.SUSPICIOUS, EmotionalState.AFRAID, EmotionalState.ANGRY, EmotionalState.PANICKED],
  [EmotionalState.AFRAID]: [EmotionalState.STRESSED, EmotionalState.PANICKED, EmotionalState.HALF_AWARE, EmotionalState.COLLAPSE],
  [EmotionalState.PANICKED]: [EmotionalState.AFRAID, EmotionalState.COLLAPSE, EmotionalState.BROKEN],
  [EmotionalState.ANGRY]: [EmotionalState.STRESSED, EmotionalState.AFRAID, EmotionalState.HALF_AWARE, EmotionalState.COLLAPSE],
  [EmotionalState.HALF_AWARE]: [EmotionalState.AFRAID, EmotionalState.PANICKED, EmotionalState.ANGRY, EmotionalState.BROKEN, EmotionalState.GLITCH],
  [EmotionalState.COLLAPSE]: [EmotionalState.IDLE, EmotionalState.BROKEN, EmotionalState.GLITCH],
  [EmotionalState.BROKEN]: [EmotionalState.COLLAPSE, EmotionalState.GLITCH],
  [EmotionalState.GLITCH]: [EmotionalState.BROKEN] // Glitch is essentially terminal
};

// Visual symptoms for each state
export interface VisualSymptoms {
  facialExpression: string;
  muscleTension: string;
  eyeBehavior: string;
  postureChange: string;
  microMovements: string;
  glitchEffects?: string[];
}

export const VISUAL_SYMPTOMS: Record<EmotionalState, VisualSymptoms> = {
  [EmotionalState.IDLE]: {
    facialExpression: 'Neutral, baseline composure',
    muscleTension: 'Relaxed, no visible tension',
    eyeBehavior: 'Standard scanning pattern',
    postureChange: 'Neutral stance',
    microMovements: 'Minimal, rest state'
  },
  [EmotionalState.CALM]: {
    facialExpression: 'Slight softening, openness',
    muscleTension: 'Relaxed, possibly lower than baseline',
    eyeBehavior: 'Steady focus, receptive',
    postureChange: 'Slight relaxation of defensive posture',
    microMovements: 'Slow, deliberate movements'
  },
  [EmotionalState.SUSPICIOUS]: {
    facialExpression: 'Narrowed eyes, tightened jaw',
    muscleTension: 'Increased neck and shoulder tension',
    eyeBehavior: 'Rapid scanning, threat assessment',
    postureChange: 'Slight lean back, defensive',
    microMovements: 'Restless, weight shifting'
  },
  [EmotionalState.STRESSED]: {
    facialExpression: 'Visible jaw clench, brow furrow',
    muscleTension: 'Prominent neck cords, shoulder raise',
    eyeBehavior: 'Intense focus, narrowed',
    postureChange: 'Rigid, bracing stance',
    microMovements: 'Hand fidgeting, self-touching'
  },
  [EmotionalState.AFRAID]: {
    facialExpression: 'Wide eyes, pale complexion, tight lips',
    muscleTension: 'Full body tension, trembling',
    eyeBehavior: 'Rapid darting, hypervigilance',
    postureChange: 'Shrinking, protective stance',
    microMovements: 'Shaking, flinching at stimuli'
  },
  [EmotionalState.PANICKED]: {
    facialExpression: 'Contorted, mouth open, eyes wild',
    muscleTension: 'Spasmodic, loss of control',
    eyeBehavior: 'Unfocused, cycling rapidly',
    postureChange: 'Erratic, uncontrolled movement',
    microMovements: 'Full body tremors, gasping'
  },
  [EmotionalState.ANGRY]: {
    facialExpression: 'Teeth bared, flushed, hard stare',
    muscleTension: 'Coiled spring, ready for action',
    eyeBehavior: 'Locked on target, intense focus',
    postureChange: 'Forward lean, aggressive',
    microMovements: 'Fists clenching, jaw grinding'
  },
  [EmotionalState.HALF_AWARE]: {
    facialExpression: 'Dreamlike, distant recognition',
    muscleTension: 'Variable, responding to internal stimuli',
    eyeBehavior: 'Unfocused, seeing internal visions',
    postureChange: 'Unstable, dream-walking',
    microMovements: 'Responding to invisible stimuli',
    glitchEffects: ['occasional_transparency', 'echo_trails']
  },
  [EmotionalState.COLLAPSE]: {
    facialExpression: 'Blank, slack, non-responsive',
    muscleTension: 'Loss of muscle tone, drooping',
    eyeBehavior: 'Empty stare, no focus',
    postureChange: 'Folding inward, fetal tendencies',
    microMovements: 'Minimal to none, exhaustion'
  },
  [EmotionalState.BROKEN]: {
    facialExpression: 'Fragmented, attempting multiple expressions',
    muscleTension: 'Spasmodic, incoherent',
    eyeBehavior: 'Showing other iterations/floors',
    postureChange: 'Puppet-like, strings cut',
    microMovements: 'Echoes of previous patterns',
    glitchEffects: ['visual_artifacts', 'color_bleeding', 'after_images']
  },
  [EmotionalState.GLITCH]: {
    facialExpression: 'Phase-shifting, multiple faces',
    muscleTension: 'Non-physical, corrupted',
    eyeBehavior: 'Displaying other entities',
    postureChange: 'Phasing through positions',
    microMovements: 'Non-linear, teleporting',
    glitchEffects: [
      'full_visual_corruption',
      'audio_desync',
      'feature_displacement',
      'multiple_versions',
      'reversed_movement'
    ]
  }
};

// Audio symptoms for each state
export interface AudioSymptoms {
  voiceQuality: string;
  speechPattern: string;
  breathingPattern: string;
  glitchAudio?: string[];
}

export const AUDIO_SYMPTOMS: Record<EmotionalState, AudioSymptoms> = {
  [EmotionalState.IDLE]: {
    voiceQuality: 'Neutral tone, measured pace',
    speechPattern: 'Standard sentence structure',
    breathingPattern: 'Regular, unremarkable'
  },
  [EmotionalState.CALM]: {
    voiceQuality: 'Warm, slightly lower pitch',
    speechPattern: 'Relaxed, more pauses',
    breathingPattern: 'Slow, deep, relaxed'
  },
  [EmotionalState.SUSPICIOUS]: {
    voiceQuality: 'Tighter, higher pitch on questions',
    speechPattern: 'Shorter sentences, more questions',
    breathingPattern: 'Slightly elevated, controlled'
  },
  [EmotionalState.STRESSED]: {
    voiceQuality: 'Tension audible, clipped words',
    speechPattern: 'Rushed, run-on sentences',
    breathingPattern: 'Audible effort, controlled hyperventilation'
  },
  [EmotionalState.AFRAID]: {
    voiceQuality: 'Thin, trembling, higher pitch',
    speechPattern: 'Fragmented, incomplete thoughts',
    breathingPattern: 'Shallow, rapid, audible'
  },
  [EmotionalState.PANICKED]: {
    voiceQuality: 'Cracking, barely controlled',
    speechPattern: 'Incoherent, words tumbling',
    breathingPattern: 'Gasping, hyperventilation',
    glitchAudio: ['voice_echo', 'pitch_wobble']
  },
  [EmotionalState.ANGRY]: {
    voiceQuality: 'Low, controlled intensity, edges sharp',
    speechPattern: 'Clipped, emphatic, accusations',
    breathingPattern: 'Forced control, explosive exhales'
  },
  [EmotionalState.HALF_AWARE]: {
    voiceQuality: 'Distant, echo-like quality',
    speechPattern: 'Fragmentary truths, non-sequiturs',
    breathingPattern: 'Irregular, matching internal vision',
    glitchAudio: ['whisper_overlap', 'reversed_words']
  },
  [EmotionalState.COLLAPSE]: {
    voiceQuality: 'Barely audible, exhausted',
    speechPattern: 'Single words, trailing off',
    breathingPattern: 'Shallow, barely visible'
  },
  [EmotionalState.BROKEN]: {
    voiceQuality: 'Multiple registers, discordant',
    speechPattern: 'Mixed with other iteration dialogue',
    breathingPattern: 'Inconsistent, artifacted',
    glitchAudio: ['layered_voices', 'static_intrusion', 'temporal_echo']
  },
  [EmotionalState.GLITCH]: {
    voiceQuality: 'Corrupted, multiple voices',
    speechPattern: 'Non-linear, reversed phrases',
    breathingPattern: 'Audio artifacts, not human',
    glitchAudio: [
      'full_audio_corruption',
      'reverse_speech',
      'frequency_shifts',
      'other_character_bleed',
      'deceased_voice_fragments'
    ]
  }
};

/**
 * Check if a state transition is valid
 */
export function isValidTransition(
  currentState: EmotionalState,
  targetState: EmotionalState,
  triggerStrength: number = 1.0
): { valid: boolean; reason: string } {
  // Check if transition is in valid list
  if (!VALID_TRANSITIONS[currentState].includes(targetState)) {
    // Allow emergency transitions for strong triggers
    if (triggerStrength >= 2.0) {
      return {
        valid: true,
        reason: `Emergency transition forced by high-strength trigger (${triggerStrength.toFixed(1)})`
      };
    }
    return {
      valid: false,
      reason: `Invalid transition: ${currentState} -> ${targetState}. Requires trigger strength >= 2.0`
    };
  }

  // Check momentum resistance
  const momentum = STATE_MOMENTUM[currentState];
  if (triggerStrength < momentum) {
    return {
      valid: false,
      reason: `Insufficient trigger strength (${triggerStrength.toFixed(1)}) to overcome momentum (${momentum.toFixed(1)})`
    };
  }

  return { valid: true, reason: 'Transition valid' };
}

/**
 * Calculate state transition probability
 */
export function calculateTransitionProbability(
  currentState: EmotionalState,
  targetState: EmotionalState,
  triggerStrength: number,
  emotionalMomentum: number
): number {
  const baseProbability = 0.7;
  
  const validCheck = isValidTransition(currentState, targetState, triggerStrength);
  if (!validCheck.valid) return 0;

  const momentumPenalty = STATE_MOMENTUM[currentState] * emotionalMomentum * 0.3;
  const triggerBonus = Math.min(triggerStrength * 0.2, 0.3);
  
  return Math.max(0, Math.min(1, baseProbability - momentumPenalty + triggerBonus));
}

/**
 * Get suggested intermediate states for complex transitions
 */
export function getTransitionPath(
  fromState: EmotionalState,
  toState: EmotionalState
): EmotionalState[] {
  if (VALID_TRANSITIONS[fromState].includes(toState)) {
    return [toState];
  }

  // Simple BFS to find shortest path
  const visited = new Set<EmotionalState>([fromState]);
  const queue: { state: EmotionalState; path: EmotionalState[] }[] = [
    { state: fromState, path: [] }
  ];

  while (queue.length > 0) {
    const current = queue.shift()!;
    
    for (const next of VALID_TRANSITIONS[current.state]) {
      if (next === toState) {
        return [...current.path, next];
      }
      
      if (!visited.has(next)) {
        visited.add(next);
        queue.push({
          state: next,
          path: [...current.path, next]
        });
      }
    }
  }

  return []; // No valid path found
}
