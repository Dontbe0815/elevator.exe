/**
 * ELEVATOR.EXE - FRACTURED LOOP
 * System Index
 * 
 * Main export file for the elevator psychological simulation system.
 */

// Emotional States
export {
  EmotionalState,
  STATE_INTENSITY,
  STATE_MOMENTUM,
  VALID_TRANSITIONS,
  VISUAL_SYMPTOMS,
  AUDIO_SYMPTOMS,
  isValidTransition,
  calculateTransitionProbability,
  getTransitionPath,
  type VisualSymptoms,
  type AudioSymptoms
} from './emotional-states';

// Character State
export {
  CharacterId,
  CHARACTER_PROFILES,
  createInitialCharacterState,
  attemptStateTransition,
  modifyTrust,
  processTick,
  accessMemoryFragment,
  getVisualSymptoms,
  getAudioSymptoms,
  canProcessRevelation,
  calculateStabilityContribution,
  type CharacterProfile,
  type TrustMatrix,
  type CharacterState
} from './character-state';

// Simulation Manager
export {
  SimulationStatus,
  FloorType,
  createInitialSimulationState,
  processSimulationTick,
  attemptFloorTravel,
  performReset,
  type Floor,
  type EnvironmentState,
  type SimulationState,
  type SimulationEvent,
  type GlitchEffect
} from './simulation-manager';
