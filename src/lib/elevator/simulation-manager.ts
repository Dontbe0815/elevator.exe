/**
 * ELEVATOR.EXE - FRACTURED LOOP
 * Simulation Manager
 * 
 * Manages overall simulation state, stability, and the elevator environment.
 * Coordinates between characters and handles system-wide events.
 */

import {
  CharacterState,
  CharacterId,
  createInitialCharacterState,
  processTick,
  calculateStabilityContribution,
  attemptStateTransition,
  EmotionalState
} from './character-state';

// Simulation status
export enum SimulationStatus {
  INITIALIZING = 'INITIALIZING',
  RUNNING = 'RUNNING',
  UNSTABLE = 'UNSTABLE',
  CRITICAL = 'CRITICAL',
  RESETTING = 'RESETTING',
  COMPLETED = 'COMPLETED'
}

// Floor types
export enum FloorType {
  LOBBY = 'LOBBY',
  MEMORY = 'MEMORY',
  PROJECTION = 'PROJECTION',
  COMPOSITE = 'COMPOSITE',
  VOID = 'VOID',
  REVELATION = 'REVELATION',
  GLITCH = 'GLITCH'
}

// Floor definition
export interface Floor {
  id: string;
  number: number | string;  // Can be non-numeric for glitch floors
  name: string;
  type: FloorType;
  associatedCharacter: CharacterId | null;
  stabilityCost: number;
  memoryFragmentId: string | null;
  isAccessible: boolean;
  accessConditions: {
    minStability: number;
    requiredTrust?: { character: CharacterId; value: number }[];
    requiredFragments?: string[];
    maxSuppressionIndex?: number;
  };
  environmentState: EnvironmentState;
}

// Environment state for a floor
export interface EnvironmentState {
  lighting: {
    brightness: number;      // 0 to 1
    flickerRate: number;     // 0 to 1
    color: string;
    sourceVisible: boolean;
  };
  audio: {
    ambientLevel: number;    // 0 to 1
    distortionLevel: number; // 0 to 1
    layerCount: number;
    reversePlayback: boolean;
  };
  architecture: {
    wallsVisible: boolean;
    geometryStable: boolean;
    glitchIntensity: number; // 0 to 1
    phantomElements: string[];
  };
  atmosphere: {
    temperature: 'cold' | 'neutral' | 'warm';
    pressure: 'heavy' | 'normal' | 'light';
    temporalAnomalies: boolean;
  };
}

// Complete simulation state
export interface SimulationState {
  status: SimulationStatus;
  iteration: number;
  tick: number;
  overallStability: number;
  characters: Record<CharacterId, CharacterState>;
  currentFloor: Floor | null;
  visitedFloors: string[];
  availableFloors: Floor[];
  suppressedMemoryProgress: number;  // 0 to 100
  eventLog: SimulationEvent[];
  activeGlitches: GlitchEffect[];
  resetThreshold: number;
  completionThreshold: number;
}

// Simulation event
export interface SimulationEvent {
  id: string;
  timestamp: number;
  type: 'dialogue' | 'transition' | 'glitch' | 'revelation' | 'reset' | 'completion';
  description: string;
  affectedCharacters: CharacterId[];
  stabilityImpact: number;
}

// Glitch effect
export interface GlitchEffect {
  id: string;
  type: 'visual' | 'audio' | 'architectural' | 'dialogue' | 'memory';
  intensity: number;
  duration: number;
  source: string;
  affectedCharacters: CharacterId[];
}

/**
 * Create initial simulation state
 */
export function createInitialSimulationState(): SimulationState {
  return {
    status: SimulationStatus.INITIALIZING,
    iteration: 1,
    tick: 0,
    overallStability: 100,
    characters: {
      [CharacterId.VIKTOR]: createInitialCharacterState(CharacterId.VIKTOR),
      [CharacterId.LIVIA]: createInitialCharacterState(CharacterId.LIVIA),
      [CharacterId.MARA]: createInitialCharacterState(CharacterId.MARA)
    },
    currentFloor: null,
    visitedFloors: [],
    availableFloors: generateInitialFloors(),
    suppressedMemoryProgress: 0,
    eventLog: [],
    activeGlitches: [],
    resetThreshold: 15,
    completionThreshold: 90
  };
}

/**
 * Generate initial floor set
 */
function generateInitialFloors(): Floor[] {
  const lobbyFloor: Floor = {
    id: 'floor-lobby',
    number: 'L',
    name: 'The Lobby',
    type: FloorType.LOBBY,
    associatedCharacter: null,
    stabilityCost: 0,
    memoryFragmentId: null,
    isAccessible: true,
    accessConditions: {
      minStability: 0
    },
    environmentState: createDefaultEnvironment()
  };

  const floors: Floor[] = [lobbyFloor];

  // Memory floors
  const memoryFloorConfigs = [
    { num: 1, char: CharacterId.VIKTOR, name: 'Maintenance Bay', fragment: 'viktor-memory-1' },
    { num: 2, char: CharacterId.LIVIA, name: 'Analysis Room', fragment: 'livia-memory-1' },
    { num: 3, char: CharacterId.MARA, name: 'The Void Space', fragment: 'mara-memory-1' },
    { num: 7, char: CharacterId.VIKTOR, name: 'The Incident Site', fragment: 'viktor-memory-2' },
    { num: 13, char: null, name: 'The In-Between', fragment: 'shared-memory-1' },
    { num: -1, char: CharacterId.LIVIA, name: 'Sublevel Archive', fragment: 'livia-memory-3' },
    { num: -7, char: CharacterId.MARA, name: 'The Forgotten Place', fragment: 'mara-memory-2' }
  ];

  memoryFloorConfigs.forEach(config => {
    floors.push({
      id: `floor-${config.num}`,
      number: config.num,
      name: config.name,
      type: FloorType.MEMORY,
      associatedCharacter: config.char,
      stabilityCost: 5 + Math.abs(config.num) * 0.5,
      memoryFragmentId: config.fragment,
      isAccessible: false,
      accessConditions: {
        minStability: 30,
        requiredTrust: config.char ? [{ character: config.char, value: 20 }] : undefined
      },
      environmentState: createDefaultEnvironment()
    });
  });

  // Revelation floors
  floors.push({
    id: 'floor-revelation-1',
    number: 'X',
    name: 'The First Truth',
    type: FloorType.REVELATION,
    associatedCharacter: null,
    stabilityCost: 25,
    memoryFragmentId: 'revelation-core-1',
    isAccessible: false,
    accessConditions: {
      minStability: 40,
      requiredFragments: ['viktor-memory-2', 'livia-memory-3'],
      maxSuppressionIndex: 50
    },
    environmentState: createRevelationEnvironment()
  });

  floors.push({
    id: 'floor-revelation-2',
    number: '\u03A9',
    name: 'The Final Memory',
    type: FloorType.REVELATION,
    associatedCharacter: null,
    stabilityCost: 40,
    memoryFragmentId: 'revelation-core-2',
    isAccessible: false,
    accessConditions: {
      minStability: 50,
      requiredFragments: ['revelation-core-1'],
      maxSuppressionIndex: 30
    },
    environmentState: createRevelationEnvironment()
  });

  // Glitch floors (become accessible at low stability)
  floors.push({
    id: 'floor-glitch-1',
    number: '\u2205',
    name: 'Non-Space',
    type: FloorType.GLITCH,
    associatedCharacter: null,
    stabilityCost: 50,
    memoryFragmentId: 'glitch-fragment-1',
    isAccessible: false,
    accessConditions: {
      minStability: 0
    },
    environmentState: createGlitchEnvironment()
  });

  return floors;
}

/**
 * Create default environment state
 */
function createDefaultEnvironment(): EnvironmentState {
  return {
    lighting: {
      brightness: 0.7,
      flickerRate: 0,
      color: '#FFFFFF',
      sourceVisible: false
    },
    audio: {
      ambientLevel: 0.3,
      distortionLevel: 0,
      layerCount: 1,
      reversePlayback: false
    },
    architecture: {
      wallsVisible: true,
      geometryStable: true,
      glitchIntensity: 0,
      phantomElements: []
    },
    atmosphere: {
      temperature: 'neutral',
      pressure: 'normal',
      temporalAnomalies: false
    }
  };
}

/**
 * Create revelation environment state
 */
function createRevelationEnvironment(): EnvironmentState {
  return {
    lighting: {
      brightness: 0.5,
      flickerRate: 0.3,
      color: '#E8E8E8',
      sourceVisible: true
    },
    audio: {
      ambientLevel: 0.5,
      distortionLevel: 0.2,
      layerCount: 3,
      reversePlayback: false
    },
    architecture: {
      wallsVisible: true,
      geometryStable: false,
      glitchIntensity: 0.2,
      phantomElements: ['echo_footsteps', 'distant_voices']
    },
    atmosphere: {
      temperature: 'cold',
      pressure: 'heavy',
      temporalAnomalies: true
    }
  };
}

/**
 * Create glitch environment state
 */
function createGlitchEnvironment(): EnvironmentState {
  return {
    lighting: {
      brightness: 0.3,
      flickerRate: 0.8,
      color: '#FF0066',
      sourceVisible: false
    },
    audio: {
      ambientLevel: 0.7,
      distortionLevel: 0.9,
      layerCount: 5,
      reversePlayback: true
    },
    architecture: {
      wallsVisible: false,
      geometryStable: false,
      glitchIntensity: 0.9,
      phantomElements: ['all_previous_visitors', 'future_echoes', 'other_iterations']
    },
    atmosphere: {
      temperature: 'cold',
      pressure: 'heavy',
      temporalAnomalies: true
    }
  };
}

/**
 * Process simulation tick
 */
export function processSimulationTick(state: SimulationState): SimulationState {
  let newState = { ...state };
  newState.tick += 1;

  // Process each character
  for (const charId of Object.keys(state.characters) as CharacterId[]) {
    newState.characters[charId] = processTick(state.characters[charId]);
  }

  // Calculate overall stability
  const stabilityContributions = Object.values(newState.characters)
    .map(char => calculateStabilityContribution(char));
  newState.overallStability = stabilityContributions.reduce((a, b) => a + b, 0) / stabilityContributions.length;

  // Update environment based on stability
  newState = updateEnvironmentForStability(newState);

  // Check for glitch generation
  if (newState.overallStability < 50) {
    newState = generateGlitchEffects(newState);
  }

  // Check for status changes
  newState = checkStatusTransitions(newState);

  // Update floor accessibility
  newState = updateFloorAccessibility(newState);

  return newState;
}

/**
 * Update environment based on current stability
 */
function updateEnvironmentForStability(state: SimulationState): SimulationState {
  if (!state.currentFloor) return state;

  const stability = state.overallStability;
  const env = { ...state.currentFloor.environmentState };

  // Lighting effects
  env.lighting.brightness = Math.max(0.2, stability / 100);
  env.lighting.flickerRate = stability < 50 ? (50 - stability) / 50 : 0;

  // Audio effects
  env.audio.distortionLevel = stability < 60 ? (60 - stability) / 60 : 0;
  env.audio.layerCount = stability < 70 ? Math.ceil((70 - stability) / 15) + 1 : 1;

  // Architecture
  env.architecture.geometryStable = stability > 40;
  env.architecture.glitchIntensity = stability < 50 ? (50 - stability) / 50 : 0;

  // Atmosphere
  if (stability < 30) {
    env.atmosphere.temporalAnomalies = true;
    env.atmosphere.pressure = 'heavy';
  }

  return {
    ...state,
    currentFloor: {
      ...state.currentFloor,
      environmentState: env
    }
  };
}

/**
 * Generate glitch effects based on instability
 */
function generateGlitchEffects(state: SimulationState): SimulationState {
  const glitchProbability = (50 - state.overallStability) / 100;
  
  if (Math.random() > glitchProbability) {
    return state;
  }

  const glitchTypes: Array<'visual' | 'audio' | 'architectural' | 'dialogue' | 'memory'> = 
    ['visual', 'audio', 'architectural', 'dialogue', 'memory'];
  
  const newGlitch: GlitchEffect = {
    id: `glitch-${state.tick}-${Math.random().toString(36).substr(2, 9)}`,
    type: glitchTypes[Math.floor(Math.random() * glitchTypes.length)],
    intensity: (50 - state.overallStability) / 50,
    duration: Math.ceil(Math.random() * 10) + 5,
    source: 'instability',
    affectedCharacters: Object.keys(state.characters) as CharacterId[]
  };

  // Glitches affect character states
  const updatedCharacters = { ...state.characters };
  for (const charId of newGlitch.affectedCharacters) {
    const char = updatedCharacters[charId];
    if (char.currentEmotionalState !== EmotionalState.GLITCH) {
      const transition = attemptStateTransition(
        char,
        EmotionalState.HALF_AWARE,
        newGlitch.intensity,
        `Glitch effect: ${newGlitch.type}`
      );
      updatedCharacters[charId] = transition.newState;
    }
  }

  return {
    ...state,
    characters: updatedCharacters,
    activeGlitches: [...state.activeGlitches, newGlitch],
    eventLog: [
      ...state.eventLog,
      {
        id: `event-${state.tick}`,
        timestamp: state.tick,
        type: 'glitch',
        description: `${newGlitch.type} glitch manifested (intensity: ${newGlitch.intensity.toFixed(2)})`,
        affectedCharacters: newGlitch.affectedCharacters,
        stabilityImpact: -newGlitch.intensity * 5
      }
    ]
  };
}

/**
 * Check for simulation status transitions
 */
function checkStatusTransitions(state: SimulationState): SimulationState {
  let newStatus = state.status;

  // Check for reset condition
  if (state.overallStability < state.resetThreshold) {
    return {
      ...state,
      status: SimulationStatus.RESETTING,
      eventLog: [
        ...state.eventLog,
        {
          id: `event-${state.tick}-reset`,
          timestamp: state.tick,
          type: 'reset',
          description: 'Stability below threshold - initiating reset',
          affectedCharacters: Object.keys(state.characters) as CharacterId[],
          stabilityImpact: -state.overallStability
        }
      ]
    };
  }

  // Check for completion condition
  if (state.suppressedMemoryProgress >= state.completionThreshold) {
    return {
      ...state,
      status: SimulationStatus.COMPLETED,
      eventLog: [
        ...state.eventLog,
        {
          id: `event-${state.tick}-complete`,
          timestamp: state.tick,
          type: 'completion',
          description: 'Archive processing complete',
          affectedCharacters: Object.keys(state.characters) as CharacterId[],
          stabilityImpact: 0
        }
      ]
    };
  }

  // Check for critical status
  if (state.overallStability < 30) {
    newStatus = SimulationStatus.CRITICAL;
  } else if (state.overallStability < 50) {
    newStatus = SimulationStatus.UNSTABLE;
  } else if (state.status === SimulationStatus.INITIALIZING) {
    newStatus = SimulationStatus.RUNNING;
  }

  return { ...state, status: newStatus };
}

/**
 * Update floor accessibility based on current conditions
 */
function updateFloorAccessibility(state: SimulationState): SimulationState {
  const updatedFloors = state.availableFloors.map(floor => {
    const conditions = floor.accessConditions;
    let isAccessible = true;
    const reasons: string[] = [];

    // Check minimum stability
    if (state.overallStability < conditions.minStability) {
      isAccessible = false;
      reasons.push(`Requires stability >= ${conditions.minStability}`);
    }

    // Check required trust
    if (conditions.requiredTrust) {
      for (const req of conditions.requiredTrust) {
        const charState = state.characters[req.character];
        if (charState.trust.towardPlayer < req.value) {
          isAccessible = false;
          reasons.push(`Requires ${req.character} trust >= ${req.value}`);
        }
      }
    }

    // Check required fragments
    if (conditions.requiredFragments) {
      for (const fragId of conditions.requiredFragments) {
        const hasFragment = Object.values(state.characters).some(
          char => char.memoryFragmentsAccessed.includes(fragId)
        );
        if (!hasFragment) {
          isAccessible = false;
          reasons.push(`Requires memory fragment: ${fragId}`);
        }
      }
    }

    // Check suppression index
    if (conditions.maxSuppressionIndex !== undefined) {
      const hasLowSuppression = Object.values(state.characters).some(
        char => char.suppressionIndex <= conditions.maxSuppressionIndex!
      );
      if (!hasLowSuppression) {
        isAccessible = false;
        reasons.push(`Requires character with suppression <= ${conditions.maxSuppressionIndex}`);
      }
    }

    // Glitch floors are accessible at low stability
    if (floor.type === FloorType.GLITCH && state.overallStability < 25) {
      isAccessible = true;
    }

    return { ...floor, isAccessible };
  });

  return { ...state, availableFloors: updatedFloors };
}

/**
 * Attempt to travel to a floor
 */
export function attemptFloorTravel(
  state: SimulationState,
  floorId: string
): {
  success: boolean;
  newState: SimulationState;
  message: string;
} {
  const floor = state.availableFloors.find(f => f.id === floorId);
  
  if (!floor) {
    return {
      success: false,
      newState: state,
      message: `Floor ${floorId} does not exist in the simulation.`
    };
  }

  if (!floor.isAccessible) {
    return {
      success: false,
      newState: state,
      message: `Floor ${floor.number} is not accessible. Conditions not met.`
    };
  }

  // Apply stability cost
  const newStability = Math.max(0, state.overallStability - floor.stabilityCost);
  
  // Add to visited floors
  const visitedFloors = state.visitedFloors.includes(floorId)
    ? state.visitedFloors
    : [...state.visitedFloors, floorId];

  // Create event
  const event: SimulationEvent = {
    id: `event-${state.tick}-travel`,
    timestamp: state.tick,
    type: 'transition',
    description: `Traveled to ${floor.name} (${floor.number})`,
    affectedCharacters: Object.keys(state.characters) as CharacterId[],
    stabilityImpact: -floor.stabilityCost
  };

  const newState: SimulationState = {
    ...state,
    currentFloor: floor,
    visitedFloors,
    overallStability: newStability,
    eventLog: [...state.eventLog, event]
  };

  return {
    success: true,
    newState,
    message: `The elevator groans as it moves to ${floor.name}. The air feels different here.`
  };
}

/**
 * Perform simulation reset
 */
export function performReset(state: SimulationState): SimulationState {
  // Preserve some data across reset
  const preservedFragments = Object.values(state.characters)
    .flatMap(char => char.memoryFragmentsAccessed);

  const newState = createInitialSimulationState();
  
  // Increment iteration
  newState.iteration = state.iteration + 1;
  
  // Preserve fragment progress (reduces suppression on subsequent iterations)
  for (const charId of Object.keys(newState.characters) as CharacterId[]) {
    const relevantFragments = preservedFragments.filter(
      f => f.includes(charId) || f.includes('shared') || f.includes('revelation')
    );
    
    // Each previously accessed fragment reduces suppression by 5
    newState.characters[charId].suppressionIndex = Math.max(
      0,
      newState.characters[charId].suppressionIndex - (relevantFragments.length * 5)
    );
    
    // Track iterations experienced
    newState.characters[charId].totalIterationsExperienced = state.iteration;
  }

  // Track previously visited floors
  newState.visitedFloors = [];

  return newState;
}
