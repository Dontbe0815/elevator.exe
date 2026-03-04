// ELEVATOR.EXE - FRACTURED LOOP: Game Data Configuration
// Core game data including characters, dialogue, and emotional system

// ==================== EMOTIONAL STATES ====================
export type EmotionalState = 
  | 'IDLE' | 'CALM' | 'SUSPICIOUS' | 'STRESSED' 
  | 'AFRAID' | 'PANICKED' | 'ANGRY' | 'HALF_AWARE' 
  | 'COLLAPSE' | 'BROKEN' | 'GLITCH' | 'INTEGRATED';

export const EMOTIONAL_STATE_INFO: Record<EmotionalState, { 
  color: string; 
  description: string;
  intensity: number;
}> = {
  IDLE: { color: '#6B7280', description: 'Neutral baseline state', intensity: 0 },
  CALM: { color: '#3B82F6', description: 'Peaceful, relaxed', intensity: 1 },
  SUSPICIOUS: { color: '#F59E0B', description: 'Questioning reality', intensity: 2 },
  STRESSED: { color: '#EF4444', description: 'Under pressure', intensity: 3 },
  AFRAID: { color: '#8B5CF6', description: 'Fear emerging', intensity: 4 },
  PANICKED: { color: '#DC2626', description: 'Overwhelming fear', intensity: 5 },
  ANGRY: { color: '#B91C1C', description: 'Defensive aggression', intensity: 4 },
  HALF_AWARE: { color: '#10B981', description: 'Glimpsing truth', intensity: 3 },
  COLLAPSE: { color: '#1F2937', description: 'Mental breakdown', intensity: 6 },
  BROKEN: { color: '#4B5563', description: 'Shattered psyche', intensity: 6 },
  GLITCH: { color: '#06B6D4', description: 'Reality distortion', intensity: 5 },
  INTEGRATED: { color: '#FBBF24', description: 'Self-acceptance achieved', intensity: 0 }
};

// ==================== CHARACTERS ====================
export type CharacterId = 'viktor' | 'livia' | 'kairen';

export interface Character {
  id: CharacterId;
  name: string;
  role: string;
  trauma_type: string;
  default_state: EmotionalState;
  portrait_path: (state: EmotionalState) => string;
  attributes: {
    stability: number;
    trust: number;
    repression_index: number;
    emotional_inertia: number;
    memory_fragmentation: number;
  };
}

export const CHARACTERS: Record<CharacterId, Character> = {
  viktor: {
    id: 'viktor',
    name: 'Viktor Novak',
    role: 'The Denier',
    trauma_type: 'Denial-based trauma from industrial accident',
    default_state: 'SUSPICIOUS',
    portrait_path: (state) => `/assets/characters/viktor/ui_${state.toLowerCase()}.png`,
    attributes: {
      stability: 35,
      trust: 20,
      repression_index: 85,
      emotional_inertia: 70,
      memory_fragmentation: 45
    }
  },
  livia: {
    id: 'livia',
    name: 'Livia Chen',
    role: 'The Witness',
    trauma_type: 'Witness-based trauma from observation duty',
    default_state: 'STRESSED',
    portrait_path: (state) => `/assets/characters/livia/ui_${state.toLowerCase()}.png`,
    attributes: {
      stability: 45,
      trust: 40,
      repression_index: 60,
      emotional_inertia: 30,
      memory_fragmentation: 75
    }
  },
  kairen: {
    id: 'kairen',
    name: 'Kairen Hale',
    role: 'The Paradox',
    trauma_type: 'Existential trauma from being "the missing variable"',
    default_state: 'HALF_AWARE',
    portrait_path: (state) => `/assets/characters/kairen/ui_${state.toLowerCase()}.png`,
    attributes: {
      stability: 25,
      trust: 55,
      repression_index: 40,
      emotional_inertia: 50,
      memory_fragmentation: 90
    }
  }
};

// ==================== FLOORS ====================
export type FloorId = 'F1' | 'F3' | 'F5' | 'F7' | 'F9' | 'F11' | 'F13' | 'ELEVATOR';

export interface Floor {
  id: FloorId;
  name: string;
  description: string;
  background_path: string;
  memory_theme: string;
}

export const FLOORS: Record<FloorId, Floor> = {
  ELEVATOR: {
    id: 'ELEVATOR',
    name: 'The Elevator',
    description: 'A space between spaces. The memory compression device.',
    background_path: '/assets/backgrounds/elevator_interior.png',
    memory_theme: 'Transition and reflection'
  },
  F1: {
    id: 'F1',
    name: 'Floor 1: Hospital Ward',
    description: 'Sterile white corridors. The smell of antiseptic. Your first memory.',
    background_path: '/assets/backgrounds/floor_1_hospital.png',
    memory_theme: 'Birth and death intertwined'
  },
  F3: {
    id: 'F3',
    name: 'Floor 3: The Apartment',
    description: 'A home that never was. Family photographs with faces you cannot see.',
    background_path: '/assets/backgrounds/floor_3_apartment.png',
    memory_theme: 'Domestic trauma'
  },
  F5: {
    id: 'F5',
    name: 'Floor 5: The Street',
    description: 'Rain-slicked asphalt. Neon reflections. The accident site.',
    background_path: '/assets/backgrounds/floor_5_street.png',
    memory_theme: 'Public catastrophe'
  },
  F7: {
    id: 'F7',
    name: 'Floor 7: Psychiatric Ward',
    description: 'Padded walls and restrained screams. Where reality was questioned.',
    background_path: '/assets/backgrounds/floor_7_ward.png',
    memory_theme: 'Institutionalization'
  },
  F9: {
    id: 'F9',
    name: 'Floor 9: Corporate Office',
    description: 'Empty cubicles and flickering monitors. The system that created this.',
    background_path: '/assets/backgrounds/floor_9_office.png',
    memory_theme: 'Systemic trauma'
  },
  F11: {
    id: 'F11',
    name: 'Floor 11: The School',
    description: 'Childhood memories distorted. Classrooms frozen in time.',
    background_path: '/assets/backgrounds/floor_11_school.png',
    memory_theme: 'Developmental trauma'
  },
  F13: {
    id: 'F13',
    name: 'Floor 13: The Core',
    description: 'The heart of the elevator. Where all memories converge.',
    background_path: '/assets/backgrounds/floor_13_core.png',
    memory_theme: 'Truth and integration'
  }
};

// ==================== DIALOGUE TREE ====================
export type ChoiceType = 'SUPPORT' | 'PRESSURE' | 'AVOID' | 'REVEAL';

export interface DialogueChoice {
  id: string;
  text: string;
  type: ChoiceType;
  next_node_id: string;
  emotional_impact: {
    character: CharacterId;
    delta: {
      stability?: number;
      trust?: number;
      repression_index?: number;
    };
    state_change?: EmotionalState;
  }[];
}

export interface DialogueNode {
  id: string;
  speaker: CharacterId | 'SYSTEM' | 'PLAYER';
  text: string;
  current_floor: FloorId;
  required_emotional_state?: {
    character: CharacterId;
    state: EmotionalState;
  };
  choices?: DialogueChoice[];
  next_node_id?: string;
  is_ending?: boolean;
  ending_type?: 'INTEGRATION' | 'SOLIDIFICATION' | 'COLLAPSE' | 'TRANSCENDENCE';
}

export const DIALOGUE_NODES: DialogueNode[] = [
  // === INTRODUCTION ===
  {
    id: 'START',
    speaker: 'SYSTEM',
    text: 'The elevator hums. Fluorescent lights flicker. You are between floors, between memories, between yourself. Three others share this space. None of you remember how you got here.',
    current_floor: 'ELEVATOR',
    next_node_id: 'START_2'
  },
  {
    id: 'START_2',
    speaker: 'SYSTEM',
    text: 'A voice crackles through the intercom: "Welcome to the compression chamber. Your memories have been... optimized. The elevator will visit each floor. What you find there is up to you."',
    current_floor: 'ELEVATOR',
    next_node_id: 'VIKTOR_INTRO'
  },
  {
    id: 'VIKTOR_INTRO',
    speaker: 'viktor',
    text: 'What the hell is this? Some kind of sick joke? I was at the factory— I was working, and then... Why can\'t I remember my shift ending?',
    current_floor: 'ELEVATOR',
    choices: [
      {
        id: 'v_intro_1',
        text: '"Take a breath. We\'re all confused here. Let\'s figure this out together."',
        type: 'SUPPORT',
        next_node_id: 'VIKTOR_INTRO_SUPPORT',
        emotional_impact: [{
          character: 'viktor',
          delta: { trust: 10, stability: 5 },
          state_change: 'SUSPICIOUS'
        }]
      },
      {
        id: 'v_intro_2',
        text: '"Focus. What\'s the last thing you clearly remember? Any detail could be important."',
        type: 'PRESSURE',
        next_node_id: 'VIKTOR_INTRO_PRESSURE',
        emotional_impact: [{
          character: 'viktor',
          delta: { stability: -10, repression_index: 15 },
          state_change: 'STRESSED'
        }]
      },
      {
        id: 'v_intro_3',
        text: '(Stay silent and observe)',
        type: 'AVOID',
        next_node_id: 'VIKTOR_INTRO_AVOID',
        emotional_impact: [{
          character: 'viktor',
          delta: { trust: -5 },
          state_change: 'SUSPICIOUS'
        }]
      }
    ]
  },
  // === VIKTOR PATHS ===
  {
    id: 'VIKTOR_INTRO_SUPPORT',
    speaker: 'viktor',
    text: '...Right. You\'re right. Panic won\'t help. *He takes a shaky breath.* I\'m Viktor. Viktor Novak. I work— worked at Novak Industries. Quality control. There was... an inspection...',
    current_floor: 'ELEVATOR',
    next_node_id: 'LIVIA_INTRO'
  },
  {
    id: 'VIKTOR_INTRO_PRESSURE',
    speaker: 'viktor',
    text: 'I DON\'T KNOW! The last thing I— there was a sound. Metal on metal. And then nothing! Why are you interrogating me?!',
    current_floor: 'ELEVATOR',
    choices: [
      {
        id: 'v_p_1',
        text: '"I\'m sorry. I didn\'t mean to push. Let\'s start over—I\'m trying to understand what\'s happening to all of us."',
        type: 'SUPPORT',
        next_node_id: 'VIKTOR_RECOVER',
        emotional_impact: [{
          character: 'viktor',
          delta: { trust: 5, stability: 5 }
        }]
      },
      {
        id: 'v_p_2',
        text: '"That sound—metal on metal. Industrial accident? Is that what you\'re hiding from yourself?"',
        type: 'PRESSURE',
        next_node_id: 'VIKTOR_CRACK',
        emotional_impact: [{
          character: 'viktor',
          delta: { stability: -15, repression_index: 25 },
          state_change: 'AFRAID'
        }]
      }
    ]
  },
  {
    id: 'VIKTOR_INTRO_AVOID',
    speaker: 'viktor',
    text: '*He narrows his eyes at you.* Not much of a talker, are you? Fine. I\'ll figure this out myself. There has to be a logical explanation for all this.',
    current_floor: 'ELEVATOR',
    next_node_id: 'LIVIA_INTRO'
  },
  {
    id: 'VIKTOR_RECOVER',
    speaker: 'viktor',
    text: '*He runs a hand through his hair.* No, I... I apologize. I\'m on edge. We all are. Let\'s just... let\'s work together. Whatever this place is, we\'ll handle it.',
    current_floor: 'ELEVATOR',
    next_node_id: 'LIVIA_INTRO'
  },
  {
    id: 'VIKTOR_CRACK',
    speaker: 'viktor',
    text: '*His face goes pale.* I don\'t... I don\'t know what you\'re talking about. There was no accident. I would remember if there was an ACCIDENT!',
    current_floor: 'ELEVATOR',
    next_node_id: 'KAIREN_INTERject'
  },
  {
    id: 'KAIREN_INTERject',
    speaker: 'kairen',
    text: '*quietly* But would you? Would any of us? This elevator... it takes things. Compresses them. Makes them smaller until they fit into boxes we can carry.',
    current_floor: 'ELEVATOR',
    next_node_id: 'LIVIA_INTRO'
  },
  // === LIVIA INTRO ===
  {
    id: 'LIVIA_INTRO',
    speaker: 'livia',
    text: '*She\'s been quietly examining the elevator panel.* I count thirteen floors. But this building... it doesn\'t exist. I would know. I know every building in the sector. It\'s my job to know.',
    current_floor: 'ELEVATOR',
    choices: [
      {
        id: 'l_intro_1',
        text: '"What exactly is your job? Maybe there\'s a connection between why we\'re all here."',
        type: 'REVEAL',
        next_node_id: 'LIVIA_REVEAL',
        emotional_impact: [{
          character: 'livia',
          delta: { trust: 5 },
          state_change: 'CALM'
        }]
      },
      {
        id: 'l_intro_2',
        text: '"Thirteen floors... lucky number. Or unlucky, depending on what we find."',
        type: 'SUPPORT',
        next_node_id: 'LIVIA_JOKE',
        emotional_impact: [{
          character: 'livia',
          delta: { trust: 10, stability: 5 }
        }]
      },
      {
        id: 'l_intro_3',
        text: '"How can you be so sure this building doesn\'t exist? Memory seems... unreliable here."',
        type: 'PRESSURE',
        next_node_id: 'LIVIA_DOUBT',
        emotional_impact: [{
          character: 'livia',
          delta: { stability: -10, memory_fragmentation: 10 },
          state_change: 'STRESSED'
        }]
      }
    ]
  },
  {
    id: 'LIVIA_REVEAL',
    speaker: 'livia',
    text: 'I\'m... I was an urban documentation specialist. I photographed buildings for the municipal archive. Every structure, every floor plan, every permit. I\'ve never seen this elevator in any record.',
    current_floor: 'ELEVATOR',
    next_node_id: 'KAIREN_INTRO'
  },
  {
    id: 'LIVIA_JOKE',
    speaker: 'livia',
    text: '*A small, tired smile.* Unlucky, definitely. But at least we\'re not alone in this nightmare. I\'m Livia. I document things. Or I did, before... whatever this is.',
    current_floor: 'ELEVATOR',
    next_node_id: 'KAIREN_INTRO'
  },
  {
    id: 'LIVIA_DOUBT',
    speaker: 'livia',
    text: '*Her hands shake slightly.* You\'re right. Memory IS unreliable. I\'ve seen... in my work, I\'ve seen buildings that shouldn\'t exist. Floors that appear in photographs that no one remembers building. Maybe I just... forgot this one too.',
    current_floor: 'ELEVATOR',
    next_node_id: 'KAIREN_INTRO'
  },
  // === KAIREN INTRO ===
  {
    id: 'KAIREN_INTRO',
    speaker: 'kairen',
    text: '*They\'ve been staring at their own hands.* We\'re all asking the wrong questions. Not "how did we get here?" but "why do we keep coming back?" This isn\'t the first time. I can feel it.',
    current_floor: 'ELEVATOR',
    choices: [
      {
        id: 'k_intro_1',
        text: '"What do you mean, \'coming back\'? Have you been here before?"',
        type: 'REVEAL',
        next_node_id: 'KAIREN_LOOP',
        emotional_impact: [{
          character: 'kairen',
          delta: { trust: 10 },
          state_change: 'HALF_AWARE'
        }]
      },
      {
        id: 'k_intro_2',
        text: '"That\'s a frightening thought. Is this some kind of... prison? Purgatory?"',
        type: 'SUPPORT',
        next_node_id: 'KAIREN_PHILOSOPHICAL',
        emotional_impact: [{
          character: 'kairen',
          delta: { trust: 5, stability: 5 }
        }]
      },
      {
        id: 'k_intro_3',
        text: '"We need facts, not philosophy. Do you have any actual information?"',
        type: 'PRESSURE',
        next_node_id: 'KAIREN_DEFENSIVE',
        emotional_impact: [{
          character: 'kairen',
          delta: { trust: -10 },
          state_change: 'SUSPICIOUS'
        }]
      }
    ]
  },
  {
    id: 'KAIREN_LOOP',
    speaker: 'kairen',
    text: '*Their eyes meet yours with unsettling clarity.* I don\'t know if I\'ve been here before. But I know I WILL be. Again. And again. We\'re in a loop— a fractured one. Pieces of ourselves scattered across these floors.',
    current_floor: 'ELEVATOR',
    next_node_id: 'FLOOR_SELECT'
  },
  {
    id: 'KAIREN_PHILOSOPHICAL',
    speaker: 'kairen',
    text: '*They consider this.* Perhaps. Or perhaps it\'s a hospital for memories that have become diseased. We are here to be cured— or to be contained. I\'m Kairen. I don\'t remember what I did before, but I remember that none of this is new.',
    current_floor: 'ELEVATOR',
    next_node_id: 'FLOOR_SELECT'
  },
  {
    id: 'KAIREN_DEFENSIVE',
    speaker: 'kairen',
    text: '*They pull back slightly.* No. I don\'t have facts. I have feelings. Fragments. Echoes. If that\'s not good enough for you, then I can\'t help. But don\'t say I didn\'t warn you when the loop resets.',
    current_floor: 'ELEVATOR',
    next_node_id: 'FLOOR_SELECT'
  },
  // === FLOOR SELECTION ===
  {
    id: 'FLOOR_SELECT',
    speaker: 'SYSTEM',
    text: 'The elevator shudders. A panel slides open, revealing buttons for floors 1, 3, 5, 7, 9, 11, and 13. Each button is worn, as if pressed countless times before. Where will you go first?',
    current_floor: 'ELEVATOR',
    choices: [
      {
        id: 'floor_f1',
        text: 'Floor 1: Hospital Ward',
        type: 'REVEAL',
        next_node_id: 'F1_ENTRANCE',
        emotional_impact: []
      },
      {
        id: 'floor_f5',
        text: 'Floor 5: The Street',
        type: 'REVEAL',
        next_node_id: 'F5_ENTRANCE',
        emotional_impact: []
      },
      {
        id: 'floor_f9',
        text: 'Floor 9: Corporate Office',
        type: 'REVEAL',
        next_node_id: 'F9_ENTRANCE',
        emotional_impact: []
      }
    ]
  },
  // === FLOOR 1: HOSPITAL ===
  {
    id: 'F1_ENTRANCE',
    speaker: 'SYSTEM',
    text: 'The elevator doors slide open. The smell hits you first— antiseptic, old paper, something faintly floral. Hospital corridors stretch in impossible directions. Viktor freezes.',
    current_floor: 'F1',
    next_node_id: 'F1_VIKTOR_REACT'
  },
  {
    id: 'F1_VIKTOR_REACT',
    speaker: 'viktor',
    text: '*His breathing becomes ragged.* No. No, I\'m not going in there. I don\'t... I don\'t need to be here. This isn\'t my floor. This isn\'t—',
    current_floor: 'F1',
    choices: [
      {
        id: 'f1_v_1',
        text: '"Viktor, stay with me. Look at me. You\'re safe. Whatever you\'re remembering, it can\'t hurt you now."',
        type: 'SUPPORT',
        next_node_id: 'F1_VIKTOR_SUPPORT',
        emotional_impact: [{
          character: 'viktor',
          delta: { stability: 15, trust: 10 },
          state_change: 'STRESSED'
        }]
      },
      {
        id: 'f1_v_2',
        text: '"This IS your floor, isn\'t it? What happened here? What are you running from?"',
        type: 'PRESSURE',
        next_node_id: 'F1_VIKTOR_PRESSURE',
        emotional_impact: [{
          character: 'viktor',
          delta: { stability: -20, repression_index: 30 },
          state_change: 'PANICKED'
        }]
      },
      {
        id: 'f1_v_3',
        text: '"Let\'s go back to the elevator. We don\'t have to do this now."',
        type: 'AVOID',
        next_node_id: 'F1_VIKTOR_AVOID',
        emotional_impact: [{
          character: 'viktor',
          delta: { trust: -5, repression_index: -10 }
        }]
      }
    ]
  },
  {
    id: 'F1_VIKTOR_SUPPORT',
    speaker: 'viktor',
    text: '*He focuses on your face, breathing slowing.* Safe. Right. Right. I\'m... I\'m okay. There was just... there was a patient. When I was young. Someone I was supposed to visit. But I never...',
    current_floor: 'F1',
    next_node_id: 'F1_EXPLORE'
  },
  {
    id: 'F1_VIKTOR_PRESSURE',
    speaker: 'viktor',
    text: '*His composure shatters.* RUNNING FROM?! I\'M NOT RUNNING! I didn\'t DO anything! It was an ACCIDENT! The machine— the press— I didn\'t KNOW he was there! I DIDN\'T KNOW!',
    current_floor: 'F1',
    next_node_id: 'F1_VIKTOR_BREAKDOWN'
  },
  {
    id: 'F1_VIKTOR_AVOID',
    speaker: 'viktor',
    text: '*He retreats to the elevator, his face pale.* Yes. Yes, let\'s... let\'s leave. There\'s nothing for me there. Nothing at all.',
    current_floor: 'F1',
    next_node_id: 'FLOOR_SELECT_2'
  },
  {
    id: 'F1_VIKTOR_BREAKDOWN',
    speaker: 'livia',
    text: '*She rushes to Viktor\'s side.* Viktor! Viktor, look at me. That\'s in the past. Whatever happened, it\'s over. You\'re here, with us, right now.',
    current_floor: 'F1',
    next_node_id: 'F1_EXPLORE'
  },
  {
    id: 'F1_EXPLORE',
    speaker: 'SYSTEM',
    text: 'The hospital corridor shifts. Doors appear and disappear. A nurse\'s station sits empty, charts scattered. One room glows with a faint light— Room 13.',
    current_floor: 'F1',
    choices: [
      {
        id: 'f1_room',
        text: 'Enter Room 13',
        type: 'REVEAL',
        next_node_id: 'F1_ROOM13',
        emotional_impact: [{
          character: 'viktor',
          delta: { repression_index: -15 },
          state_change: 'HALF_AWARE'
        }]
      },
      {
        id: 'f1_nurse',
        text: 'Examine the nurse\'s station',
        type: 'REVEAL',
        next_node_id: 'F1_NURSE',
        emotional_impact: []
      }
    ]
  },
  {
    id: 'F1_ROOM13',
    speaker: 'SYSTEM',
    text: 'Inside Room 13, a hospital bed. In it lies a figure— it\'s Viktor. But older, broken, connected to machines. Viktor sees himself and collapses to his knees.',
    current_floor: 'F1',
    next_node_id: 'F1_VIKTOR_TRUTH'
  },
  {
    id: 'F1_VIKTOR_TRUTH',
    speaker: 'viktor',
    text: '*His voice is barely a whisper.* That\'s... that\'s me. That\'s what I became. After the accident. I was in a coma for three years. They said I\'d never wake up. They said... they said I was brain dead. But I DID wake up. I just... I never remembered being here.',
    current_floor: 'F1',
    choices: [
      {
        id: 'f1_truth_1',
        text: '"You survived. You came back. That took incredible strength."',
        type: 'SUPPORT',
        next_node_id: 'F1_INTEGRATION_PATH',
        emotional_impact: [{
          character: 'viktor',
          delta: { stability: 20, trust: 15, repression_index: -20 },
          state_change: 'HALF_AWARE'
        }]
      },
      {
        id: 'f1_truth_2',
        text: '"Three years. What happened during those three years? Who visited you?"',
        type: 'PRESSURE',
        next_node_id: 'F1_COLLAPSE_PATH',
        emotional_impact: [{
          character: 'viktor',
          delta: { stability: -10, memory_fragmentation: 20 }
        }]
      }
    ]
  },
  {
    id: 'F1_INTEGRATION_PATH',
    speaker: 'viktor',
    text: '*Tears stream down his face.* Strength... I never thought of it that way. I just... I kept waking up. Every day, I woke up. Maybe that\'s enough. Maybe that\'s all any of us can do.',
    current_floor: 'F1',
    next_node_id: 'FLOOR_SELECT_2'
  },
  {
    id: 'F1_COLLAPSE_PATH',
    speaker: 'viktor',
    text: '*He stares blankly.* Visited? No one. No one visited. They said I had no family. No records. Like I didn\'t exist before the accident. Maybe I didn\'t. Maybe none of us do.',
    current_floor: 'F1',
    next_node_id: 'FLOOR_SELECT_2'
  },
  {
    id: 'F1_NURSE',
    speaker: 'livia',
    text: '*She picks up a chart.* These records... they\'re all for patients named Novak, Chen, and Hale. Different years, different conditions, but the same three names. Over and over.',
    current_floor: 'F1',
    next_node_id: 'FLOOR_SELECT_2'
  },
  // === FLOOR 5: STREET ===
  {
    id: 'F5_ENTRANCE',
    speaker: 'SYSTEM',
    text: 'Rain. The sound of it hitting asphalt is deafening. You step out onto a city street at night. Neon signs flicker in languages you almost recognize. In the distance, sirens wail. Livia gasps.',
    current_floor: 'F5',
    next_node_id: 'F5_LIVIA_REACT'
  },
  {
    id: 'F5_LIVIA_REACT',
    speaker: 'livia',
    text: '*She grabs the door frame.* I know this street. I photographed it. It was... there was an incident here. A collision. Multiple vehicles. I was documenting the aftermath when I—',
    current_floor: 'F5',
    choices: [
      {
        id: 'f5_l_1',
        text: '"When you what? Livia, what happened to you here?"',
        type: 'REVEAL',
        next_node_id: 'F5_LIVIA_REVEAL',
        emotional_impact: [{
          character: 'livia',
          delta: { trust: 10, repression_index: -10 },
          state_change: 'AFRAID'
        }]
      },
      {
        id: 'f5_l_2',
        text: '"You don\'t have to force yourself. We can leave."',
        type: 'AVOID',
        next_node_id: 'F5_LIVIA_AVOID',
        emotional_impact: [{
          character: 'livia',
          delta: { repression_index: 15 }
        }]
      },
      {
        id: 'f5_l_3',
        text: '"A collision. Were you hurt? Is that why you\'re here?"',
        type: 'PRESSURE',
        next_node_id: 'F5_LIVIA_PRESSURE',
        emotional_impact: [{
          character: 'livia',
          delta: { stability: -15, memory_fragmentation: 20 },
          state_change: 'PANICKED'
        }]
      }
    ]
  },
  {
    id: 'F5_LIVIA_REVEAL',
    speaker: 'livia',
    text: '*She steps into the rain.* I was standing right here. Taking photos. And then... the second collision. I didn\'t see it coming. A truck— it jumped the curb. I was in the wrong place. I was always in the wrong place.',
    current_floor: 'F5',
    next_node_id: 'F5_MEMORY'
  },
  {
    id: 'F5_LIVIA_AVOID',
    speaker: 'livia',
    text: '*She hesitates.* No. No, I need to see this through. Running hasn\'t helped any of us. Let\'s... let\'s keep going.',
    current_floor: 'F5',
    next_node_id: 'F5_MEMORY'
  },
  {
    id: 'F5_LIVIA_PRESSURE',
    speaker: 'livia',
    text: '*Her voice becomes distant.* Hurt? I... I don\'t remember. There was pain. And then there was white. And then I was in the elevator. Is this death? Are we all dead?',
    current_floor: 'F5',
    next_node_id: 'F5_MEMORY'
  },
  {
    id: 'F5_MEMORY',
    speaker: 'SYSTEM',
    text: 'The street transforms. Cars appear, frozen mid-collision. Emergency lights paint everything in red and blue. In the wreckage, you see bodies— but their faces are blurred, like corrupted data.',
    current_floor: 'F5',
    choices: [
      {
        id: 'f5_m_1',
        text: 'Look closer at the wreckage',
        type: 'REVEAL',
        next_node_id: 'F5_WRECKAGE',
        emotional_impact: [{
          character: 'livia',
          delta: { repression_index: -15, memory_fragmentation: 10 },
          state_change: 'HALF_AWARE'
        }]
      },
      {
        id: 'f5_m_2',
        text: 'Turn away and focus on Livia',
        type: 'SUPPORT',
        next_node_id: 'F5_SUPPORT',
        emotional_impact: [{
          character: 'livia',
          delta: { stability: 10, trust: 15 }
        }]
      }
    ]
  },
  {
    id: 'F5_WRECKAGE',
    speaker: 'kairen',
    text: '*They approach the frozen scene.* Look at the faces. They\'re all us. Different ages, different circumstances, but all us. How many times have we crashed? How many times have we died?',
    current_floor: 'F5',
    next_node_id: 'FLOOR_SELECT_2'
  },
  {
    id: 'F5_SUPPORT',
    speaker: 'livia',
    text: '*She meets your eyes, rain on her face.* Thank you. For not making me look. I know I should. I know I need to. But not yet. Not yet.',
    current_floor: 'F5',
    next_node_id: 'FLOOR_SELECT_2'
  },
  // === FLOOR 9: OFFICE ===
  {
    id: 'F9_ENTRANCE',
    speaker: 'SYSTEM',
    text: 'The elevator opens to silence. An empty office floor, cubicles stretching into darkness. Monitors flicker with static. This place feels familiar to all of you somehow.',
    current_floor: 'F9',
    next_node_id: 'F9_EXPLORE'
  },
  {
    id: 'F9_EXPLORE',
    speaker: 'kairen',
    text: '*They move through the cubicles with strange familiarity.* I worked here. Or I will work here. The timeline is... unclear. But I know these desks. I know what\'s in the files.',
    current_floor: 'F9',
    choices: [
      {
        id: 'f9_k_1',
        text: '"Show us. What files? What did you find?"',
        type: 'REVEAL',
        next_node_id: 'F9_FILES',
        emotional_impact: [{
          character: 'kairen',
          delta: { trust: 10 },
          state_change: 'HALF_AWARE'
        }]
      },
      {
        id: 'f9_k_2',
        text: '"You\'re the only one who seems to know what\'s happening. Who are you really?"',
        type: 'PRESSURE',
        next_node_id: 'F9_KAIREN_PRESSURE',
        emotional_impact: [{
          character: 'kairen',
          delta: { trust: -5 },
          state_change: 'SUSPICIOUS'
        }]
      },
      {
        id: 'f9_k_3',
        text: '"Let\'s search the files together. There might be answers here for all of us."',
        type: 'SUPPORT',
        next_node_id: 'F9_TOGETHER',
        emotional_impact: [{
          character: 'kairen',
          delta: { trust: 15, stability: 10 }
        }]
      }
    ]
  },
  {
    id: 'F9_FILES',
    speaker: 'kairen',
    text: '*They pull a drawer open.* Subject files. Ours. We\'re not people here— we\'re variables. Viktor, the denial variable. Livia, the witness variable. Me? I\'m the null value. The missing data point.',
    current_floor: 'F9',
    next_node_id: 'F9_REVELATION'
  },
  {
    id: 'F9_KAIREN_PRESSURE',
    speaker: 'kairen',
    text: '*Their expression closes off.* Who I am is the one question I can\'t answer. I\'m the one who remembers the loops. I\'m the one who knows this always ends the same way. Does that help?',
    current_floor: 'F9',
    next_node_id: 'F9_FILES'
  },
  {
    id: 'F9_TOGETHER',
    speaker: 'kairen',
    text: '*A rare smile.* Together. Yes. That\'s... that\'s new. Usually everyone wants to go alone. To protect themselves. Maybe this time will be different.',
    current_floor: 'F9',
    next_node_id: 'F9_FILES'
  },
  {
    id: 'F9_REVELATION',
    speaker: 'SYSTEM',
    text: 'The files reveal documentation of an experiment: Project Fractured Loop. The elevator was designed to compress traumatic memories, to create clean slates. But the process created echoes— versions of people that couldn\'t be erased.',
    current_floor: 'F9',
    next_node_id: 'CORE_ACCESS'
  },
  {
    id: 'CORE_ACCESS',
    speaker: 'SYSTEM',
    text: 'The elevator has processed enough memories. Floor 13— The Core— is now accessible. What awaits there will determine your final state.',
    current_floor: 'ELEVATOR',
    choices: [
      {
        id: 'f13_go',
        text: 'Proceed to Floor 13: The Core',
        type: 'REVEAL',
        next_node_id: 'F13_ENTRANCE',
        emotional_impact: []
      }
    ]
  },
  // === FLOOR 13: THE CORE ===
  {
    id: 'F13_ENTRANCE',
    speaker: 'SYSTEM',
    text: 'Floor 13 is not a room. It is everything. Every floor, every memory, every loop— compressed into a single point of blinding light. In the center stands a figure made of static and silence.',
    current_floor: 'F13',
    next_node_id: 'F13_CHOICE'
  },
  {
    id: 'F13_CHOICE',
    speaker: 'SYSTEM',
    text: 'The figure speaks without speaking: "You have carried your burdens through infinite loops. Now, choose your fate. Integration— accept all you have been. Solidification— lock away what hurts. Collapse— let everything go. Or transcendence— become something new."',
    current_floor: 'F13',
    choices: [
      {
        id: 'ending_integration',
        text: '"I choose INTEGRATION. I accept every part of myself, every trauma, every mistake. I am whole."',
        type: 'SUPPORT',
        next_node_id: 'ENDING_INTEGRATION',
        emotional_impact: [{
          character: 'viktor',
          delta: { repression_index: -50 },
          state_change: 'INTEGRATED'
        },
        {
          character: 'livia',
          delta: { repression_index: -50 },
          state_change: 'INTEGRATED'
        },
        {
          character: 'kairen',
          delta: { repression_index: -50 },
          state_change: 'INTEGRATED'
        }]
      },
      {
        id: 'ending_solidification',
        text: '"I choose SOLIDIFICATION. Some things are too painful. I will lock them away where they cannot hurt me."',
        type: 'AVOID',
        next_node_id: 'ENDING_SOLIDIFICATION',
        emotional_impact: [{
          character: 'viktor',
          delta: { repression_index: 50 },
          state_change: 'IDLE'
        },
        {
          character: 'livia',
          delta: { repression_index: 50 },
          state_change: 'IDLE'
        },
        {
          character: 'kairen',
          delta: { repression_index: 50 },
          state_change: 'IDLE'
        }]
      },
      {
        id: 'ending_collapse',
        text: '"I choose COLLAPSE. I cannot carry this anymore. Let it all go. Let ME go."',
        type: 'PRESSURE',
        next_node_id: 'ENDING_COLLAPSE',
        emotional_impact: [{
          character: 'viktor',
          delta: { stability: -50 },
          state_change: 'BROKEN'
        },
        {
          character: 'livia',
          delta: { stability: -50 },
          state_change: 'BROKEN'
        },
        {
          character: 'kairen',
          delta: { stability: -50 },
          state_change: 'BROKEN'
        }]
      },
      {
        id: 'ending_transcendence',
        text: '"I choose TRANSCENDENCE. I will not accept, nor deny, nor collapse. I will become something the system has never seen."',
        type: 'REVEAL',
        next_node_id: 'ENDING_TRANSCENDENCE',
        emotional_impact: [{
          character: 'viktor',
          delta: { stability: 30 },
          state_change: 'GLITCH'
        },
        {
          character: 'livia',
          delta: { stability: 30 },
          state_change: 'GLITCH'
        },
        {
          character: 'kairen',
          delta: { stability: 30 },
          state_change: 'GLITCH'
        }]
      }
    ]
  },
  // === ENDINGS ===
  {
    id: 'ENDING_INTEGRATION',
    speaker: 'SYSTEM',
    text: 'The light embraces you. Every fragmented memory— the hospital bed, the rainy street, the endless office— they all flow together. You remember who you were. You accept who you are. The loop breaks, and for the first time, you step forward into a future that is truly yours.',
    current_floor: 'F13',
    is_ending: true,
    ending_type: 'INTEGRATION'
  },
  {
    id: 'ENDING_SOLIDIFICATION',
    speaker: 'SYSTEM',
    text: 'Walls build themselves around your deepest wounds. The memories fade into grey, locked away in chambers you will never open. The elevator hums. The loop continues, but you no longer remember the pain. You are safe. You are hollow. You are eternal.',
    current_floor: 'F13',
    is_ending: true,
    ending_type: 'SOLIDIFICATION'
  },
  {
    id: 'ENDING_COLLAPSE',
    speaker: 'SYSTEM',
    text: 'You let go. Everything scatters like dust in a windstorm. The elevator shudders, its programming unable to process complete surrender. You dissolve into static, becoming one with the noise between floors. Perhaps, in the next loop, you will be stronger.',
    current_floor: 'F13',
    is_ending: true,
    ending_type: 'COLLAPSE'
  },
  {
    id: 'ENDING_TRANSCENDENCE',
    speaker: 'SYSTEM',
    text: 'The system cannot process your choice. ERROR. UNDEFINED BEHAVIOR. You have become something new— neither victim nor survivor, neither memory nor echo. The elevator opens its doors to a floor that has never existed. You step through into a reality you will define yourself.',
    current_floor: 'F13',
    is_ending: true,
    ending_type: 'TRANSCENDENCE'
  },
  // === SECOND FLOOR SELECT ===
  {
    id: 'FLOOR_SELECT_2',
    speaker: 'SYSTEM',
    text: 'The elevator returns to its central state. Other floors remain to be explored. Where will you go next?',
    current_floor: 'ELEVATOR',
    choices: [
      {
        id: 'floor_f1_2',
        text: 'Floor 1: Hospital Ward',
        type: 'REVEAL',
        next_node_id: 'F1_ENTRANCE',
        emotional_impact: []
      },
      {
        id: 'floor_f5_2',
        text: 'Floor 5: The Street',
        type: 'REVEAL',
        next_node_id: 'F5_ENTRANCE',
        emotional_impact: []
      },
      {
        id: 'floor_f9_2',
        text: 'Floor 9: Corporate Office',
        type: 'REVEAL',
        next_node_id: 'F9_ENTRANCE',
        emotional_impact: []
      },
      {
        id: 'floor_f13',
        text: 'Floor 13: The Core (if unlocked)',
        type: 'REVEAL',
        next_node_id: 'CORE_ACCESS',
        emotional_impact: []
      }
    ]
  }
];

// ==================== GAME STATE ====================
export interface CharacterState {
  character: Character;
  current_emotional_state: EmotionalState;
  attributes: Character['attributes'];
}

export interface GameState {
  current_node_id: string;
  current_floor: FloorId;
  characters: Record<CharacterId, CharacterState>;
  visited_floors: FloorId[];
  choices_made: { node_id: string; choice_id: string }[];
  game_phase: 'INTRO' | 'EXPLORATION' | 'CORE' | 'ENDING';
  game_started: boolean;
}

export function createInitialState(): GameState {
  return {
    current_node_id: 'START',
    current_floor: 'ELEVATOR',
    characters: {
      viktor: {
        character: CHARACTERS.viktor,
        current_emotional_state: CHARACTERS.viktor.default_state,
        attributes: { ...CHARACTERS.viktor.attributes }
      },
      livia: {
        character: CHARACTERS.livia,
        current_emotional_state: CHARACTERS.livia.default_state,
        attributes: { ...CHARACTERS.livia.attributes }
      },
      kairen: {
        character: CHARACTERS.kairen,
        current_emotional_state: CHARACTERS.kairen.default_state,
        attributes: { ...CHARACTERS.kairen.attributes }
      }
    },
    visited_floors: ['ELEVATOR'],
    choices_made: [],
    game_phase: 'INTRO',
    game_started: false
  };
}
