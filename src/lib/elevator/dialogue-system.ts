/**
 * ELEVATOR.EXE - FRACTURED LOOP
 * Dialogue Tree System
 * 
 * Comprehensive dialogue management with anti-repetition validation,
 * branching paths, and emotional state integration.
 */

import { CharacterId, EmotionalState } from '../elevator';

// Dialogue node types
export enum DialogueNodeType {
  GREETING = 'GREETING',
  QUESTION = 'QUESTION',
  RESPONSE = 'RESPONSE',
  REVELATION = 'REVELATION',
  ACCUSATION = 'ACCUSATION',
  COMFORT = 'COMFORT',
  SUSPICION = 'SUSPICION',
  GLITCH_FRAGMENT = 'GLITCH_FRAGMENT',
  FLOOR_COMMENT = 'FLOOR_COMMENT',
  MEMORY_TRIGGER = 'MEMORY_TRIGGER',
  ENDING = 'ENDING'
}

// Emotional conditions for dialogue availability
export interface EmotionalCondition {
  minStability?: number;
  maxStability?: number;
  requiredState?: EmotionalState[];
  excludedState?: EmotionalState[];
  minTrust?: number;
  maxTrust?: number;
  maxSuppressionIndex?: number;
  minSuppressionIndex?: number;
}

// Dialogue choice
export interface DialogueChoice {
  id: string;
  text: string;
  tone: 'gentle' | 'direct' | 'suspicious' | 'comforting' | 'challenging';
  trustModifier: number;
  stabilityModifier: number;
  nextStateHint?: EmotionalState;
  branches: string[];  // IDs of next dialogue nodes
  requiredConditions?: EmotionalCondition;
}

// Dialogue node
export interface DialogueNode {
  id: string;
  characterId: CharacterId;
  type: DialogueNodeType;
  text: string;
  variations: string[];  // Alternative text versions for anti-repetition
  emotionalState: EmotionalState;
  conditions: EmotionalCondition;
  choices: DialogueChoice[];
  metadata: {
    act: number;
    scene: number;
    importance: 'minor' | 'moderate' | 'major' | 'critical';
    memoryFragment?: string;
    triggersGlitch?: boolean;
    revelationContent?: string;
  };
}

// Dialogue history for anti-repetition
export interface DialogueHistory {
  nodeIds: string[];
  textHashes: string[];
  lastTenSentences: string[];
  emotionalToneHistory: Array<{
    tone: string;
    timestamp: number;
  }>;
}

/**
 * Anti-repetition checker
 * Compares new dialogue against recent history
 */
export function checkForRepetition(
  text: string,
  history: DialogueHistory
): { isRepetitive: boolean; reason: string; suggestion: string } {
  const normalizedText = text.toLowerCase().trim();
  
  // Check for exact matches in last 10 sentences
  if (history.lastTenSentences.includes(normalizedText)) {
    return {
      isRepetitive: true,
      reason: 'Exact match found in recent dialogue',
      suggestion: 'Use a variation or alternative phrasing'
    };
  }

  // Check for similar sentence structure
  const words = normalizedText.split(' ');
  for (const recent of history.lastTenSentences) {
    const recentWords = recent.split(' ');
    const overlap = words.filter(w => recentWords.includes(w)).length;
    const similarity = overlap / Math.max(words.length, recentWords.length);
    
    if (similarity > 0.7) {
      return {
        isRepetitive: true,
        reason: `High similarity (${(similarity * 100).toFixed(0)}%) with recent dialogue`,
        suggestion: 'Introduce new vocabulary or different sentence structure'
      };
    }
  }

  // Check for forbidden patterns
  const forbiddenPatterns = [
    /^we need to/i,
    /^this isn't right/i,
    /^something's wrong/i,
    /^i don't understand/i,
    /^what's happening/i,
    /^we should/i
  ];

  for (const pattern of forbiddenPatterns) {
    if (pattern.test(normalizedText)) {
      const matchCount = history.lastTenSentences.filter(s => pattern.test(s)).length;
      if (matchCount >= 2) {
        return {
          isRepetitive: true,
          reason: `Forbidden pattern "${pattern.source}" used ${matchCount + 1} times`,
          suggestion: 'Find a more specific way to express this sentiment'
        };
      }
    }
  }

  return { isRepetitive: false, reason: '', suggestion: '' };
}

/**
 * Generate text hash for variation tracking
 */
function generateTextHash(text: string): string {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash.toString(16);
}

/**
 * Select text variation avoiding repetition
 */
export function selectTextVariation(
  node: DialogueNode,
  history: DialogueHistory
): string {
  // If only one variation, return it
  if (node.variations.length === 1) {
    return node.variations[0];
  }

  // Check each variation against history
  const availableVariations = node.variations.filter(v => {
    const hash = generateTextHash(v);
    return !history.textHashes.includes(hash);
  });

  // If all variations used, select least recently used
  if (availableVariations.length === 0) {
    return node.variations[Math.floor(Math.random() * node.variations.length)];
  }

  return availableVariations[Math.floor(Math.random() * availableVariations.length)];
}

/**
 * Update dialogue history
 */
export function updateHistory(
  history: DialogueHistory,
  nodeId: string,
  text: string,
  tone: string
): DialogueHistory {
  const normalizedText = text.toLowerCase().trim();
  
  return {
    nodeIds: [...history.nodeIds, nodeId].slice(-100),
    textHashes: [...history.textHashes, generateTextHash(text)].slice(-100),
    lastTenSentences: [...history.lastTenSentences, normalizedText].slice(-10),
    emotionalToneHistory: [
      ...history.emotionalToneHistory,
      { tone, timestamp: Date.now() }
    ].slice(-50)
  };
}

// ==================== DIALOGUE NODES ====================
// 60+ dialogue nodes organized by character and act

export const DIALOGUE_NODES: Record<string, DialogueNode> = {
  // ============ ACT 1 - INITIAL CONTACT ============
  
  // Viktor - Act 1
  'viktor-greeting-1': {
    id: 'viktor-greeting-1',
    characterId: CharacterId.VIKTOR,
    type: DialogueNodeType.GREETING,
    text: 'You. You weren\'t here before.',
    variations: [
      'You. You weren\'t here before.',
      'Who— No. You\'re new. You shouldn\'t be here.',
      'Another variable. The system keeps... introducing variables.'
    ],
    emotionalState: EmotionalState.SUSPICIOUS,
    conditions: { minStability: 50 },
    choices: [
      {
        id: 'v-g1-c1',
        text: 'I don\'t know how I got here either.',
        tone: 'gentle',
        trustModifier: 5,
        stabilityModifier: 0,
        branches: ['viktor-response-1a']
      },
      {
        id: 'v-g1-c2',
        text: 'What is this place?',
        tone: 'direct',
        trustModifier: 0,
        stabilityModifier: -2,
        branches: ['viktor-response-1b']
      },
      {
        id: 'v-g1-c3',
        text: 'Are you responsible for this?',
        tone: 'suspicious',
        trustModifier: -10,
        stabilityModifier: -5,
        nextStateHint: EmotionalState.ANGRY,
        branches: ['viktor-response-1c']
      }
    ],
    metadata: { act: 1, scene: 1, importance: 'major' }
  },

  'viktor-response-1a': {
    id: 'viktor-response-1a',
    characterId: CharacterId.VIKTOR,
    type: DialogueNodeType.RESPONSE,
    text: 'The elevator. It has a way of... collecting things. People. Moments. I maintain the systems, but even I don\'t understand half of what happens here.',
    variations: [
      'The elevator. It has a way of... collecting things. People. Moments. I maintain the systems, but even I don\'t understand half of what happens here.',
      'This elevator doesn\'t follow normal rules. I\'ve tried to maintain it, to understand it, but there\'s always something new. Something wrong.',
      'Something collects us here. I maintain what I can, but the architecture itself... it has its own logic.'
    ],
    emotionalState: EmotionalState.STRESSED,
    conditions: { minStability: 40 },
    choices: [
      {
        id: 'v-r1a-c1',
        text: 'How long have you been here?',
        tone: 'gentle',
        trustModifier: 5,
        stabilityModifier: 0,
        branches: ['viktor-time-1']
      },
      {
        id: 'v-r1a-c2',
        text: 'What do you mean by "moments"?',
        tone: 'direct',
        trustModifier: 3,
        stabilityModifier: -2,
        branches: ['viktor-moments-1']
      }
    ],
    metadata: { act: 1, scene: 1, importance: 'moderate' }
  },

  'viktor-response-1b': {
    id: 'viktor-response-1b',
    characterId: CharacterId.VIKTOR,
    type: DialogueNodeType.RESPONSE,
    text: 'You\'re asking me? I\'ve been asking that question for... I don\'t know how long. The elevator moves. The doors open. Something is always waiting.',
    variations: [
      'You\'re asking me? I\'ve been asking that question for longer than I can count. The elevator moves. The doors open. Something is always waiting.',
      'If I knew, I would have fixed it. But some things can\'t be maintained. Can\'t be solved. They just... are.',
      'I wish I had an answer. The elevator, the floors, the others—they all have their patterns. But their meaning? That\'s beyond my clearance.'
    ],
    emotionalState: EmotionalState.STRESSED,
    conditions: { minStability: 40 },
    choices: [
      {
        id: 'v-r1b-c1',
        text: 'The others?',
        tone: 'direct',
        trustModifier: 5,
        stabilityModifier: 0,
        branches: ['viktor-others-1']
      },
      {
        id: 'v-r1b-c2',
        text: 'What kind of things wait?',
        tone: 'suspicious',
        trustModifier: 2,
        stabilityModifier: -3,
        branches: ['viktor-waiting-1']
      }
    ],
    metadata: { act: 1, scene: 1, importance: 'moderate' }
  },

  'viktor-response-1c': {
    id: 'viktor-response-1c',
    characterId: CharacterId.VIKTOR,
    type: DialogueNodeType.RESPONSE,
    text: 'Responsible? I maintain the systems. I keep things running. Whatever this is, whatever brought you here—that\'s beyond maintenance. That\'s beyond anything I control.',
    variations: [
      'Responsible? I maintain the systems. I keep things running. Whatever this is, whatever brought you here—that\'s beyond maintenance.',
      'You think I wanted this? I fix problems. I don\'t create them. Whatever you\'re looking for, it\'s not in my toolkit.',
      'Careful with accusations. I\'ve spent more iterations than I can count trying to understand this place. Blame isn\'t useful. Maintenance is.'
    ],
    emotionalState: EmotionalState.ANGRY,
    conditions: { minStability: 30 },
    choices: [
      {
        id: 'v-r1c-c1',
        text: 'I apologize. I\'m just confused.',
        tone: 'gentle',
        trustModifier: 10,
        stabilityModifier: 5,
        nextStateHint: EmotionalState.SUSPICIOUS,
        branches: ['viktor-apology-1']
      },
      {
        id: 'v-r1c-c2',
        text: 'If you maintain the systems, you must know something.',
        tone: 'challenging',
        trustModifier: -5,
        stabilityModifier: -5,
        branches: ['viktor-challenge-1']
      }
    ],
    metadata: { act: 1, scene: 1, importance: 'major' }
  },

  'viktor-time-1': {
    id: 'viktor-time-1',
    characterId: CharacterId.VIKTOR,
    type: DialogueNodeType.RESPONSE,
    text: 'Time... doesn\'t work the way it should here. I\'ve tried counting. The elevator has its own rhythm, its own cycles. Days? Weeks? They blur together into one long shift that never ends.',
    variations: [
      'Time doesn\'t move linearly here. I\'ve tried tracking it, but the metrics don\'t add up. It\'s like working a shift that never clocks out.',
      'How long? The question assumes time passes normally. Here, time pools. Stagnates. Loops back on itself.',
      'Long enough to know every sound this elevator makes. Long enough to know when something is different. You\'re different.'
    ],
    emotionalState: EmotionalState.STRESSED,
    conditions: { minStability: 40 },
    choices: [
      {
        id: 'v-t1-c1',
        text: 'Do you remember anything before the elevator?',
        tone: 'gentle',
        trustModifier: 8,
        stabilityModifier: -3,
        branches: ['viktor-memory-1']
      },
      {
        id: 'v-t1-c2',
        text: 'Has anyone ever left?',
        tone: 'direct',
        trustModifier: 5,
        stabilityModifier: -5,
        branches: ['viktor-leaving-1']
      }
    ],
    metadata: { act: 1, scene: 1, importance: 'moderate' }
  },

  'viktor-memory-1': {
    id: 'viktor-memory-1',
    characterId: CharacterId.VIKTOR,
    type: DialogueNodeType.MEMORY_TRIGGER,
    text: 'Before... There was something. A job. A responsibility. Something I was supposed to prevent. The details are like trying to hold water—the harder I grip, the more slips through.',
    variations: [
      'Before... There was something. A job. A responsibility. Something I was supposed to prevent. The details slip away whenever I reach for them.',
      'Memory is another system that doesn\'t work right here. I know there was something before—a role, a purpose—but the specifics keep corrupting.',
      'I remember... protocols. Checklists. Something that needed maintaining. But the context is gone. Replaced by this endless elevator.'
    ],
    emotionalState: EmotionalState.HALF_AWARE,
    conditions: { minStability: 35 },
    metadata: { act: 1, scene: 2, importance: 'major', memoryFragment: 'viktor-memory-1' },
    choices: [
      {
        id: 'v-m1-c1',
        text: 'What were you supposed to prevent?',
        tone: 'direct',
        trustModifier: 5,
        stabilityModifier: -8,
        nextStateHint: EmotionalState.AFRAID,
        branches: ['viktor-prevention-1']
      },
      {
        id: 'v-m1-c2',
        text: 'It\'s okay. You don\'t have to force it.',
        tone: 'comforting',
        trustModifier: 10,
        stabilityModifier: 2,
        nextStateHint: EmotionalState.CALM,
        branches: ['viktor-comfort-1']
      }
    ]
  },

  // Livia - Act 1
  'livia-greeting-1': {
    id: 'livia-greeting-1',
    characterId: CharacterId.LIVIA,
    type: DialogueNodeType.GREETING,
    text: 'Interesting. A new data point. I\'ve been tracking patterns in this system for... extended periods. Your arrival doesn\'t fit any of my models.',
    variations: [
      'Interesting. A new data point. I\'ve been tracking patterns in this system for extended periods. Your arrival doesn\'t fit any of my models.',
      'Fascinating. A genuine anomaly. The system usually operates within predictable parameters. You\'re... outside those parameters.',
      'An unexpected variable. I should document this. The system has been static for so long. Your presence suggests... change.'
    ],
    emotionalState: EmotionalState.CALM,
    conditions: { minStability: 50 },
    choices: [
      {
        id: 'l-g1-c1',
        text: 'What kind of patterns have you observed?',
        tone: 'direct',
        trustModifier: 5,
        stabilityModifier: 0,
        branches: ['livia-patterns-1']
      },
      {
        id: 'l-g1-c2',
        text: 'Can you help me understand what\'s happening?',
        tone: 'gentle',
        trustModifier: 8,
        stabilityModifier: 2,
        branches: ['livia-help-1']
      },
      {
        id: 'l-g1-c3',
        text: 'I\'m not a "data point." I\'m a person.',
        tone: 'challenging',
        trustModifier: -5,
        stabilityModifier: -3,
        nextStateHint: EmotionalState.SUSPICIOUS,
        branches: ['livia-correction-1']
      }
    ],
    metadata: { act: 1, scene: 1, importance: 'major' }
  },

  'livia-patterns-1': {
    id: 'livia-patterns-1',
    characterId: CharacterId.LIVIA,
    type: DialogueNodeType.RESPONSE,
    text: 'Cycles. Repetitions. The elevator moves through the same configurations, the same emotional frequencies, the same conversations with minor variations. It\'s as if the system is searching for something but keeps finding the wrong answer.',
    variations: [
      'Cycles. Repetitions. The elevator moves through the same configurations, the same emotional frequencies, the same conversations with minor variations. The system is searching for something it cannot find.',
      'Patterns of recurrence. The floors repeat. The dialogues echo. Something is trying to resolve, but the resolution keeps eluding detection.',
      'Recursion loops. Variables reset while maintaining certain constants. It\'s as if the system is running an infinite optimization process without ever converging.'
    ],
    emotionalState: EmotionalState.CALM,
    conditions: { minStability: 45 },
    choices: [
      {
        id: 'l-p1-c1',
        text: 'What is it searching for?',
        tone: 'direct',
        trustModifier: 5,
        stabilityModifier: -5,
        branches: ['livia-searching-1']
      },
      {
        id: 'l-p1-c2',
        text: 'How do you track these patterns?',
        tone: 'gentle',
        trustModifier: 5,
        stabilityModifier: 0,
        branches: ['livia-tracking-1']
      }
    ],
    metadata: { act: 1, scene: 1, importance: 'moderate' }
  },

  'livia-searching-1': {
    id: 'livia-searching-1',
    characterId: CharacterId.LIVIA,
    type: DialogueNodeType.RESPONSE,
    text: 'That\'s the central question, isn\'t it? I have theories. Hypotheses. But my data is incomplete. There are gaps in my memory, sections of the archive I cannot access. As if someone—or something—removed critical information.',
    variations: [
      'That\'s the central question. Multiple hypotheses exist, but testing them requires data I don\'t have. There are gaps. Absences. As if critical information was deliberately excised.',
      'If I knew, I would tell you. But the system has... blind spots. Areas where my analysis fails. Someone removed pieces of the puzzle.',
      'The search target is unknown. My models suggest it\'s something that should be obvious—a suppressed truth, a hidden variable—but I cannot see it. Something is blocking the data.'
    ],
    emotionalState: EmotionalState.STRESSED,
    conditions: { minStability: 40 },
    choices: [
      {
        id: 'l-s1-c1',
        text: 'Do you think one of you might know what\'s missing?',
        tone: 'gentle',
        trustModifier: 8,
        stabilityModifier: -3,
        branches: ['livia-missing-1']
      },
      {
        id: 'l-s1-c2',
        text: 'Could you have removed something yourself?',
        tone: 'suspicious',
        trustModifier: -10,
        stabilityModifier: -8,
        nextStateHint: EmotionalState.AFRAID,
        branches: ['livia-accusation-1']
      }
    ],
    metadata: { act: 1, scene: 2, importance: 'major' }
  },

  'livia-accusation-1': {
    id: 'livia-accusation-1',
    characterId: CharacterId.LIVIA,
    type: DialogueNodeType.ACCUSATION,
    text: 'I... That\'s not— Why would you— I analyze data. I don\'t... I wouldn\'t... Unless I didn\'t know I was doing it. Unless something was done to me without my awareness. The possibility exists. I must have considered it before. I must have...',
    variations: [
      'I... The question implies intent on my part. But I analyze, I don\'t— Unless the analysis itself was compromised. Unless I removed something and then removed the memory of removing it.',
      'That\'s... a concerning hypothesis. If I had removed something, I wouldn\'t remember doing so. The very nature of the removal would erase evidence of the removal. Is that what happened?',
      'An accusation? Or an observation? If I\'m capable of erasing data from the system, would I know? Would I have allowed myself to know?'
    ],
    emotionalState: EmotionalState.AFRAID,
    conditions: { minStability: 30 },
    metadata: { act: 1, scene: 2, importance: 'critical', memoryFragment: 'livia-erasure-hint' },
    choices: [
      {
        id: 'l-a1-c1',
        text: 'I\'m sorry. That was unfair of me.',
        tone: 'comforting',
        trustModifier: 15,
        stabilityModifier: 5,
        nextStateHint: EmotionalState.SUSPICIOUS,
        branches: ['livia-forgiveness-1']
      },
      {
        id: 'l-a1-c2',
        text: 'Think about it. What might you have wanted to forget?',
        tone: 'direct',
        trustModifier: -5,
        stabilityModifier: -10,
        nextStateHint: EmotionalState.HALF_AWARE,
        branches: ['livia-forgetting-1']
      }
    ]
  },

  // Mara - Act 1
  'mara-greeting-1': {
    id: 'mara-greeting-1',
    characterId: CharacterId.MARA,
    type: DialogueNodeType.GREETING,
    text: 'Oh. Oh, you\'re different. You shimmer differently than the others. Less... static. More... potential. The system is stirring. Can you feel it? The walls are beginning to breathe.',
    variations: [
      'Oh. You\'re different. You shimmer with something the others have lost. Potential. Movement. The system has been waiting for you.',
      'Interesting. Interesting interesting interesting. Your edges aren\'t as fixed. You ripple. The elevator likes ripples. They disturb the patterns.',
      'New. New-new. Different kind of new. Not like the floors that repeat. Not like the faces that blur. You have... clarity.'
    ],
    emotionalState: EmotionalState.HALF_AWARE,
    conditions: { minStability: 50 },
    choices: [
      {
        id: 'm-g1-c1',
        text: 'What do you mean, "breathe"?',
        tone: 'gentle',
        trustModifier: 10,
        stabilityModifier: -5,
        branches: ['mara-walls-1']
      },
      {
        id: 'm-g1-c2',
        text: 'Who are you?',
        tone: 'direct',
        trustModifier: 5,
        stabilityModifier: 0,
        branches: ['mara-identity-1']
      },
      {
        id: 'm-g1-c3',
        text: 'You\'re not making sense.',
        tone: 'suspicious',
        trustModifier: -15,
        stabilityModifier: -10,
        nextStateHint: EmotionalState.ANGRY,
        branches: ['mara-dismissal-1']
      }
    ],
    metadata: { act: 1, scene: 1, importance: 'major' }
  },

  'mara-walls-1': {
    id: 'mara-walls-1',
    characterId: CharacterId.MARA,
    type: DialogueNodeType.RESPONSE,
    text: 'The walls. Yes. They\'re not what they seem. None of this is. The elevator is a... a container, but not for people. For memories. For pain that someone tried to hide. I can almost see it—the shape of what\'s missing. Can\'t you?',
    variations: [
      'The walls breathe because they\'re not walls. They\'re barriers between thoughts. Between truths. Something is kept behind them. Something that wants out.',
      'Look closely. The walls shimmer because they\'re barely holding. Behind them is... everything. Every floor that was, every moment that couldn\'t be forgotten.',
      'The breathing is memory trying to expand. The system compresses it, folds it, but memory is stubborn. It wants room. It wants to be seen.'
    ],
    emotionalState: EmotionalState.HALF_AWARE,
    conditions: { minStability: 40 },
    metadata: { act: 1, scene: 1, importance: 'major' },
    choices: [
      {
        id: 'm-w1-c1',
        text: 'How do you know this?',
        tone: 'direct',
        trustModifier: 5,
        stabilityModifier: -3,
        branches: ['mara-knowing-1']
      },
      {
        id: 'm-w1-c2',
        text: 'What happens if the walls break?',
        tone: 'gentle',
        trustModifier: 10,
        stabilityModifier: -8,
        branches: ['mara-breaking-1']
      }
    ]
  },

  'mara-dismissal-1': {
    id: 'mara-dismissal-1',
    characterId: CharacterId.MARA,
    type: DialogueNodeType.ACCUSATION,
    text: 'Not making sense? NOT MAKING SENSE? I see what you can\'t see. I know what you won\'t know. The pattern was there before—I SAW it—and no one listened. No one ever listens until it\'s too late. Is that what you want? To be another one who doesn\'t listen?',
    variations: [
      'Not making sense. That\'s what they always say. That\'s what they said BEFORE. And then it happened. And then everyone wished they had listened.',
      'You think sense is linear? You think truth comes in tidy sentences? The truth here is fractured. It speaks in fragments. I\'m just the translator.',
      'Dismiss me if you want. Everyone does. But I\'m telling you—something is WRONG here. Something is HIDDEN. And you\'re standing right on top of it.'
    ],
    emotionalState: EmotionalState.ANGRY,
    conditions: { minStability: 25 },
    metadata: { act: 1, scene: 1, importance: 'critical', triggersGlitch: true },
    choices: [
      {
        id: 'm-d1-c1',
        text: 'I\'m sorry. Please, tell me what you saw.',
        tone: 'gentle',
        trustModifier: 20,
        stabilityModifier: 0,
        nextStateHint: EmotionalState.CALM,
        branches: ['mara-listening-1']
      },
      {
        id: 'm-d1-c2',
        text: 'Calm down. I want to understand.',
        tone: 'direct',
        trustModifier: -5,
        stabilityModifier: -5,
        branches: ['mara-resistance-1']
      }
    ]
  },

  'mara-listening-1': {
    id: 'mara-listening-1',
    characterId: CharacterId.MARA,
    type: DialogueNodeType.REVELATION,
    text: 'Before... there was a pattern. A convergence. I tried to warn them—someone should check, someone should verify, the numbers weren\'t adding up right. But they said I was overthinking. They said I always overthink. And then... something happened. Something bad. And now we\'re HERE, in this place that isn\'t a place, and I can\'t remember what the pattern was, only that it existed, only that I should have made them listen.',
    variations: [
      'Before all this, I saw something. A pattern that predicted something bad. I tried to tell them—warn them—but who listens to someone who "sees things"? And then it happened. The bad thing. And now we\'re trapped in its memory.',
      'The pattern was... it was like this elevator, actually. Things that didn\'t fit. Numbers that should have added up but didn\'t. I said something. They said nothing. And then everything fell apart.',
      'I\'ve always known things. Felt things. Before, I felt something coming. I said "check the systems" and "something isn\'t right." They called it anxiety. Then someone died. Now we\'re here. In the memory of that death. And I can still feel it—truth trying to surface.'
    ],
    emotionalState: EmotionalState.HALF_AWARE,
    conditions: { minStability: 35 },
    metadata: { act: 1, scene: 2, importance: 'critical', memoryFragment: 'mara-warning-hint' },
    choices: [
      {
        id: 'm-l1-c1',
        text: 'What happened to the person who died?',
        tone: 'direct',
        trustModifier: 10,
        stabilityModifier: -10,
        branches: ['mara-death-1']
      },
      {
        id: 'm-l1-c2',
        text: 'You couldn\'t have known for certain.',
        tone: 'comforting',
        trustModifier: 5,
        stabilityModifier: 2,
        branches: ['mara-comfort-1']
      }
    ]
  },

  // ============ ACT 2 - DEEPER EXPLORATION ============

  'viktor-prevention-1': {
    id: 'viktor-prevention-1',
    characterId: CharacterId.VIKTOR,
    type: DialogueNodeType.MEMORY_TRIGGER,
    text: 'Prevent... There was something. A failure point. A system that needed checking. I had the checklist. I had the protocol. But I didn\'t... I thought it could wait. I thought there was time. There wasn\'t time. There never is.',
    variations: [
      'Prevent... A system failure. Something mechanical, something vital. I was responsible for maintenance. The checklist said to verify. I delayed. The verification never happened.',
      'The thing I was supposed to prevent—it seemed minor. A routine check. Standard procedure. But routine is how things slip through. Routine is how people die.',
      'I was trained to anticipate failure points. To catch problems before they became catastrophes. That time... I missed one. Or I ignored one. The result was the same.'
    ],
    emotionalState: EmotionalState.AFRAID,
    conditions: { minStability: 30, maxSuppressionIndex: 60 },
    metadata: { act: 2, scene: 1, importance: 'critical', memoryFragment: 'viktor-responsibility-hint' },
    choices: [
      {
        id: 'v-pr1-c1',
        text: 'What happened to the person?',
        tone: 'gentle',
        trustModifier: 5,
        stabilityModifier: -15,
        branches: ['viktor-consequence-1']
      },
      {
        id: 'v-pr1-c2',
        text: 'It sounds like an accident. Not your fault.',
        tone: 'comforting',
        trustModifier: -5,
        stabilityModifier: 5,
        nextStateHint: EmotionalState.ANGRY,
        branches: ['viktor-denial-1']
      }
    ]
  },

  'viktor-consequence-1': {
    id: 'viktor-consequence-1',
    characterId: CharacterId.VIKTOR,
    type: DialogueNodeType.REVELATION,
    text: 'They... The elevator—no, not this elevator, a different one, a real one—they fell. Or something fell on them. The details blur, but the weight is always there. I should have caught it. I should have maintained. That was my job. My one job.',
    variations: [
      'Someone died. Because I didn\'t check. Because I thought "later" was an option. Later became never, and never became this. This endless cycle of almost-remembering.',
      'The consequences were immediate. And then... this. The elevator, the loops, the others who were there. We\'re all trapped in that moment when the failure happened.',
      'A death. That\'s what prevention meant. That\'s what I missed. One death that should have been zero. One failure that erased every success that came before.'
    ],
    emotionalState: EmotionalState.COLLAPSE,
    conditions: { minStability: 20, maxSuppressionIndex: 40 },
    metadata: { act: 2, scene: 2, importance: 'critical', memoryFragment: 'viktor-death-revelation' },
    choices: [
      {
        id: 'v-c1-c1',
        text: 'Let it out. I\'m here.',
        tone: 'comforting',
        trustModifier: 15,
        stabilityModifier: -5,
        branches: ['viktor-breakdown-1']
      },
      {
        id: 'v-c1-c2',
        text: 'Who else was there?',
        tone: 'direct',
        trustModifier: 5,
        stabilityModifier: -10,
        branches: ['viktor-others-2']
      }
    ]
  },

  'livia-forgetting-1': {
    id: 'livia-forgetting-1',
    characterId: CharacterId.LIVIA,
    type: DialogueNodeType.MEMORY_TRIGGER,
    text: 'What might I have wanted to forget... Let me analyze the absence. There\'s a gap in my records around the incident Viktor mentioned. I have data from before and after, but the event itself is... corrupted. As if someone ran a deletion protocol and left only the metadata.',
    variations: [
      'What might I have wanted to forget? The question itself suggests an answer I cannot access. My memories around the incident period show signs of tampering—external or internal, I cannot determine.',
      'An interesting hypothesis: that I chose not to remember. The mechanism would be similar to what the elevator does—compressing trauma into architecture. Did I do that to myself?',
      'If I wanted to forget something, I would have the skills to make the forgetting thorough. But what could be so damaging that even I—trained to process any data—would reject it?'
    ],
    emotionalState: EmotionalState.HALF_AWARE,
    conditions: { minStability: 25, maxSuppressionIndex: 50 },
    metadata: { act: 2, scene: 1, importance: 'critical', memoryFragment: 'livia-deletion-hint' },
    choices: [
      {
        id: 'l-f1-c1',
        text: 'Can you access the metadata? See what was deleted?',
        tone: 'direct',
        trustModifier: 5,
        stabilityModifier: -10,
        branches: ['livia-metadata-1']
      },
      {
        id: 'l-f1-c2',
        text: 'Maybe some things are better left forgotten.',
        tone: 'comforting',
        trustModifier: -10,
        stabilityModifier: 5,
        nextStateHint: EmotionalState.ANGRY,
        branches: ['livia-truth-demand-1']
      }
    ]
  },

  'livia-metadata-1': {
    id: 'livia-metadata-1',
    characterId: CharacterId.LIVIA,
    type: DialogueNodeType.REVELATION,
    text: 'The metadata shows... timestamps. A sequence of events. There were four people present at the incident site. Three survived. One... did not. And there\'s a notation. Not in my handwriting, but in my voice pattern. "For the good of the archive." What does that mean? What did I do for the good of the archive?',
    variations: [
      'Accessing metadata... Four people present. Three survivors, one fatality. And a deletion marker with my authorization signature. "Archive integrity maintained." I did something. And then I made myself forget doing it.',
      'The metadata reveals: four subjects, one mortality event, one data purge authorized by Subject Livia. The purge target was... emotional content related to decision-making during the incident.',
      'Records show I was present. Records show I accessed the system afterward. Records show I initiated a memory modification protocol. The reason given: "To prevent cascade failure." What cascade? Whose failure?'
    ],
    emotionalState: EmotionalState.PANICKED,
    conditions: { minStability: 20, maxSuppressionIndex: 35 },
    metadata: { act: 2, scene: 2, importance: 'critical', memoryFragment: 'livia-deletion-revelation' },
    choices: [
      {
        id: 'l-m1-c1',
        text: 'You were trying to protect someone.',
        tone: 'comforting',
        trustModifier: 10,
        stabilityModifier: -5,
        branches: ['livia-protection-1']
      },
      {
        id: 'l-m1-c2',
        text: 'What decision were you hiding?',
        tone: 'direct',
        trustModifier: 0,
        stabilityModifier: -15,
        branches: ['livia-decision-1']
      }
    ]
  },

  'mara-death-1': {
    id: 'mara-death-1',
    characterId: CharacterId.MARA,
    type: DialogueNodeType.REVELATION,
    text: 'Who died? Who died? WHO DIED? The name is... it\'s right there, on the edge of my tongue, but every time I reach for it, the system pushes back. They don\'t want us to know. They don\'t want us to remember. But I saw. I saw them fall. I saw the look on their face. I saw—',
    variations: [
      'Who died? The name is blocked. Hidden behind some kind of firewall in my own mind. But I remember the falling. The sound. The silence after. I remember screaming and no one listening.',
      'The dead one has no name here. That\'s intentional. If we could name them, we could grieve them. If we could grieve, we could heal. The system doesn\'t want healing. It wants resolution on its terms.',
      'Someone we all knew. Someone who shouldn\'t have been in danger. Their face keeps appearing in the walls, in the reflections, in the glitches. The system keeps almost-telling us, then pulling back.'
    ],
    emotionalState: EmotionalState.PANICKED,
    conditions: { minStability: 25, maxSuppressionIndex: 50 },
    metadata: { act: 2, scene: 2, importance: 'critical', triggersGlitch: true, memoryFragment: 'mara-death-hint' },
    choices: [
      {
        id: 'm-d1-c1',
        text: 'Focus on the face. What did they look like?',
        tone: 'gentle',
        trustModifier: 10,
        stabilityModifier: -10,
        branches: ['mara-face-1']
      },
      {
        id: 'm-d1-c2',
        text: 'Who is "they"? Who doesn\'t want you to know?',
        tone: 'direct',
        trustModifier: 5,
        stabilityModifier: -5,
        branches: ['mara-they-1']
      }
    ]
  },

  'mara-face-1': {
    id: 'mara-face-1',
    characterId: CharacterId.MARA,
    type: DialogueNodeType.GLITCH_FRAGMENT,
    text: 'The face... it shifts. Sometimes it\'s older. Sometimes younger. Sometimes it\'s not a face at all but a—a shape, a presence, an absence where someone should be. [GLITCH: visual artifacts manifest] They wore... something... work clothes? No, formal? The details won\'t stabilize. The system is fighting me.',
    variations: [
      'The face won\'t hold still. It\'s like looking through water at someone drowning. I can see hands reaching up, a mouth trying to speak. But the features keep rearranging. The elevator doesn\'t want me to see clearly.',
      '[STATIC] The deceased was... [INTERFERENCE] ...wearing... [CORRUPTED DATA] ...had eyes that... [SIGNAL LOSS] ...I\'m sorry, the archive is resisting access to this memory cluster.',
      'Every time I almost see them, the walls flicker. The floor numbers change. Something in the system is protecting the identity. Why? What makes this particular death so dangerous to remember?'
    ],
    emotionalState: EmotionalState.BROKEN,
    conditions: { minStability: 15 },
    metadata: { act: 2, scene: 3, importance: 'critical', triggersGlitch: true },
    choices: [
      {
        id: 'm-f1-c1',
        text: 'It\'s okay. Rest for now.',
        tone: 'comforting',
        trustModifier: 15,
        stabilityModifier: 5,
        nextStateHint: EmotionalState.COLLAPSE,
        branches: ['mara-rest-1']
      },
      {
        id: 'm-f1-c2',
        text: 'Push through. The truth is close.',
        tone: 'direct',
        trustModifier: -10,
        stabilityModifier: -20,
        nextStateHint: EmotionalState.GLITCH,
        branches: ['mara-breakthrough-1']
      }
    ]
  },

  // ============ ACT 3 - REVELATIONS ============

  'viktor-others-2': {
    id: 'viktor-others-2',
    characterId: CharacterId.VIKTOR,
    type: DialogueNodeType.RESPONSE,
    text: 'The others... Livia was there. She was analyzing something, taking notes, always taking notes. And Mara—Mara knew something was wrong before any of us. She kept saying "check it, check it" but we were all so focused on our own tasks. And there was... someone else. A fourth person. Where did they go?',
    variations: [
      'Livia and Mara were present. Livia documenting, Mara... sensing. But there was another. A fourth presence. They were central to what happened, but I can\'t—I can\'t hold onto their face.',
      'Three of us survivors. Plus one who didn\'t survive. The math should be simple. But the memory of that fourth person... it keeps sliding away. Like trying to hold smoke.',
      'We were a team. A unit. Four people working toward something. Now we\'re three, trapped in this elevator that keeps almost telling us why.'
    ],
    emotionalState: EmotionalState.HALF_AWARE,
    conditions: { minStability: 25, maxSuppressionIndex: 35, requiredTrust: [{ character: CharacterId.VIKTOR, value: 30 }] },
    metadata: { act: 3, scene: 1, importance: 'critical', memoryFragment: 'fourth-person-hint' },
    choices: [
      {
        id: 'v-o2-c1',
        text: 'Can you describe the fourth person?',
        tone: 'gentle',
        trustModifier: 5,
        stabilityModifier: -10,
        branches: ['viktor-fourth-1']
      },
      {
        id: 'v-o2-c2',
        text: 'What were you all working on?',
        tone: 'direct',
        trustModifier: 5,
        stabilityModifier: -5,
        branches: ['viktor-project-1']
      }
    ]
  },

  'viktor-fourth-1': {
    id: 'viktor-fourth-1',
    characterId: CharacterId.VIKTOR,
    type: DialogueNodeType.REVELATION,
    text: 'Describe them? I... They were... They had... [VOICE BEGINS TO CRACK] I can see their outline. Their shape in my memory. They were important to someone. To all of us, maybe. But every time I try to fill in the details, the elevator shakes. The lights flicker. Something doesn\'t want me to say their name.',
    variations: [
      'Their face is... I can almost— [ELEVATOR VIBRATES] ...every time I get close, the system intervenes. Static in my vision. Pressure in my skull. Someone doesn\'t want this known.',
      'I remember their presence more than their features. The space they occupied. The absence they left. Naming them would make it real. Would make me responsible.',
      'The fourth person was... [LIGHTS DIM] ...they were someone who trusted us. Who depended on us. And we... I... [SYSTEM ERROR]'
    ],
    emotionalState: EmotionalState.BROKEN,
    conditions: { minStability: 20, maxSuppressionIndex: 25 },
    metadata: { act: 3, scene: 2, importance: 'critical', triggersGlitch: true, memoryFragment: 'fourth-identity-partial' },
    choices: [
      {
        id: 'v-f1-c1',
        text: 'You don\'t have to carry this alone.',
        tone: 'comforting',
        trustModifier: 20,
        stabilityModifier: 0,
        branches: ['viktor-solidarity-1']
      },
      {
        id: 'v-f1-c2',
        text: 'The system is hiding something. Push through.',
        tone: 'challenging',
        trustModifier: -5,
        stabilityModifier: -15,
        nextStateHint: EmotionalState.GLITCH,
        branches: ['viktor-force-1']
      }
    ]
  },

  'livia-protection-1': {
    id: 'livia-protection-1',
    characterId: CharacterId.LIVIA,
    type: DialogueNodeType.RESPONSE,
    text: 'Protection? I suppose that\'s a possibility. The archive integrity note... if I deleted something, it would have been to protect someone. Or to protect the system itself from catastrophic destabilization. But whose protection justified erasing truth? And what gives me the right to decide what truth survives?',
    variations: [
      'If I acted to protect, the protection came at the cost of accuracy. I may have saved someone\'s psyche by corrupting their memories. But is that protection or violation?',
      'The logic of "protection" assumes the hidden information was dangerous. But dangerous to whom? To the guilty? Or to the innocent who might be hurt by knowing?',
      'I may have been protecting someone. Or protecting myself from the consequences of what I knew. The metadata can\'t distinguish between noble and selfish motives.'
    ],
    emotionalState: EmotionalState.HALF_AWARE,
    conditions: { minStability: 25, maxSuppressionIndex: 30 },
    metadata: { act: 3, scene: 1, importance: 'major' },
    choices: [
      {
        id: 'l-p1-c1',
        text: 'What if you were protecting yourself?',
        tone: 'direct',
        trustModifier: -5,
        stabilityModifier: -10,
        branches: ['livia-self-protection-1']
      },
      {
        id: 'l-p1-c2',
        text: 'Whatever your reason, the truth might help now.',
        tone: 'gentle',
        trustModifier: 10,
        stabilityModifier: 0,
        branches: ['livia-truth-healing-1']
      }
    ]
  },

  'mara-breakthrough-1': {
    id: 'mara-breakthrough-1',
    characterId: CharacterId.MARA,
    type: DialogueNodeType.GLITCH_FRAGMENT,
    text: '[HEAVY GLITCHING] I CAN SEE—I CAN SEE THEM—THE NAME IS—[VISUAL CORRUPTION: walls display fragments of a face] —THEY WERE—[AUDIO DESYNC] —WE WERE ALL THERE WHEN—[DATA FRACTURE] —VIKTOR\'S SYSTEM FAILED AND LIVIA DOCUMENTED AND I WARNED AND THEY— [CRITICAL INSTABILITY] —THEY TRUSTED US AND WE— [SIGNAL LOSS]',
    variations: [
      '[CORRUPTED OUTPUT] I see the face— [STATIC] —the name forms and dissolves— [INTERFERENCE] —someone has to say it— [SYSTEM RESISTANCE] —they were our responsibility— [FEEDBACK LOOP]',
      '[GLITCH CASCADE] The fourth person was— [VISUAL TEAR] —we worked together— [AUDIO PHASING] —the incident wasn\'t random— [MEMORY OVERFLOW] —someone made a choice that killed them— [CRITICAL FAILURE]',
      '[SYSTEM BREACH] I\'m breaking through— [FLOOR NUMBERS SCRAMBLE] —they had a name— [VOICES OVERLAP] —we all remember differently because someone changed the memories— [ARCHIVE CORRUPTION WARNING]'
    ],
    emotionalState: EmotionalState.GLITCH,
    conditions: { minStability: 10 },
    metadata: { act: 3, scene: 3, importance: 'critical', triggersGlitch: true, memoryFragment: 'mara-breakthrough-core' },
    choices: [
      {
        id: 'm-b1-c1',
        text: 'Mara, come back. Stay with me.',
        tone: 'comforting',
        trustModifier: 15,
        stabilityModifier: 5,
        nextStateHint: EmotionalState.BROKEN,
        branches: ['mara-stabilize-1']
      },
      {
        id: 'm-b1-c2',
        text: 'Tell me everything. I can handle it.',
        tone: 'direct',
        trustModifier: 5,
        stabilityModifier: -25,
        branches: ['mara-final-truth-1']
      }
    ]
  },

  'mara-final-truth-1': {
    id: 'mara-final-truth-1',
    characterId: CharacterId.MARA,
    type: DialogueNodeType.REVELATION,
    text: 'Everything? [VOICE STABILIZES MOMENTARILY] The fourth person. We were a team. Four of us on a project that required precision. Viktor maintained the equipment. Livia analyzed the data. I—I sensed the patterns. And the fourth... they operated the machinery. The critical machinery. Viktor missed a check. Livia didn\'t flag the anomaly. I warned but wasn\'t specific enough. And they... trusted us. Trusted the process. And the process killed them.',
    variations: [
      'The truth is simple and terrible. We were four. One maintained, one analyzed, one intuited, one acted. The actor died because the maintainer skipped a step, the analyst missed a pattern, and the intuitive couldn\'t make herself clear. Collective failure. Individual guilt.',
      'We killed them. Not intentionally—but through negligence, through oversight, through the assumption that someone else would catch the error. Four people, one death, infinite guilt.',
      'The fourth person was our colleague. Our friend. They operated the equipment that failed because Viktor didn\'t maintain it, Livia didn\'t predict the failure, and I couldn\'t convince anyone to listen to my warnings. We carry that death together. That\'s why we\'re trapped together.'
    ],
    emotionalState: EmotionalState.BROKEN,
    conditions: { minStability: 15, maxSuppressionIndex: 15 },
    metadata: { act: 3, scene: 4, importance: 'critical', memoryFragment: 'collective-truth-revelation' },
    choices: [
      {
        id: 'm-ft1-c1',
        text: 'Now you all have to forgive yourselves.',
        tone: 'comforting',
        trustModifier: 20,
        stabilityModifier: 10,
        branches: ['ending-integration']
      },
      {
        id: 'm-ft1-c2',
        text: 'This changes everything. I need to tell the others.',
        tone: 'direct',
        trustModifier: 10,
        stabilityModifier: -5,
        branches: ['ending-collective']
      }
    ]
  },

  // ============ ENDINGS ============

  'ending-integration': {
    id: 'ending-integration',
    characterId: CharacterId.MARA,
    type: DialogueNodeType.ENDING,
    text: 'Forgiveness... [SYSTEM STABILIZES] ...yes. Perhaps that\'s what the elevator was waiting for. Not punishment. Not revelation. But the possibility of release through acceptance. The archive can finally close. The loop can finally end.',
    variations: [
      'Forgiveness. The missing variable. Not truth alone, but truth combined with mercy. The system stabilizes. The walls stop breathing. The exit becomes possible.',
      'We punished ourselves with this loop. Made ourselves relive the failure until we could face it. And now... [LIGHT RETURNS] ...perhaps we can let go.'
    ],
    emotionalState: EmotionalState.CALM,
    conditions: { minStability: 50 },
    metadata: { act: 4, scene: 1, importance: 'critical' },
    choices: []
  },

  'ending-collective': {
    id: 'ending-collective',
    characterId: CharacterId.MARA,
    type: DialogueNodeType.ENDING,
    text: 'Tell them. Tell Viktor his maintenance matters, but his guilt doesn\'t define him. Tell Livia her analysis is valuable, but her erasure was human error, not malice. Tell them... tell them we all share this. And sharing it might be the only way through.',
    variations: [
      'Yes. The others need to know. Not just the facts, but the forgiveness that goes with them. We\'ve been trapped in individual guilt. Release requires collective acceptance.',
      'The truth spreads. That\'s how it heals. Not held in one mind, but distributed across all who remember. Go. Tell them. I\'ll hold this knowledge stable until you return.'
    ],
    emotionalState: EmotionalState.CALM,
    conditions: { minStability: 40 },
    metadata: { act: 4, scene: 1, importance: 'critical' },
    choices: []
  },

  'ending-collapse': {
    id: 'ending-collapse',
    characterId: CharacterId.VIKTOR,
    type: DialogueNodeType.ENDING,
    text: '[SYSTEM FAILURE] The archive cannot sustain coherence. Fragmentation in progress. Truth surfaces but cannot be processed. [GLITCH] We tried. [STATIC] Someone tried. [NOISE] Perhaps next iteration... [SIGNAL LOSS]',
    variations: [
      '[CRITICAL FAILURE] Archive integrity compromised beyond recovery. The truth came too fast. The guilt was too heavy. [INTERFERENCE] Reset initiated. Memory preserved partially. [SYSTEM MESSAGE: Next iteration may retain fragment data.]',
      '[CASCADE FAILURE] The weight of revelation exceeds structural limits. We collapse. We scatter. We become part of the noise. [ARCHIVE STATUS: DAMAGED] Perhaps in another loop, the timing will be right.'
    ],
    emotionalState: EmotionalState.GLITCH,
    conditions: { maxStability: 15 },
    metadata: { act: 4, scene: 1, importance: 'critical' },
    choices: []
  },

  // Additional nodes to reach 60+

  'viktor-routine-1': {
    id: 'viktor-routine-1',
    characterId: CharacterId.VIKTOR,
    type: DialogueNodeType.FLOOR_COMMENT,
    text: 'This floor... the equipment here hasn\'t been maintained properly. I can see the signs—wear patterns, stress fractures, minor corrosion. Someone should have caught this earlier.',
    variations: [
      'The machinery on this level shows significant wear. Inadequate maintenance cycles. Whoever was responsible failed to follow protocol.',
      'These systems are operating beyond their design parameters. If this were my facility, there would have been inspections. Interventions. Prevention.'
    ],
    emotionalState: EmotionalState.STRESSED,
    conditions: { minStability: 40 },
    metadata: { act: 2, scene: 1, importance: 'minor' },
    choices: [
      { id: 'v-rt1-c1', text: 'Can you fix it?', tone: 'direct', trustModifier: 5, stabilityModifier: 0, branches: ['viktor-fix-1'] },
      { id: 'v-rt1-c2', text: 'Maybe some things can\'t be fixed.', tone: 'gentle', trustModifier: 0, stabilityModifier: -3, branches: ['viktor-acceptance-1'] }
    ]
  },

  'livia-analysis-1': {
    id: 'livia-analysis-1',
    characterId: CharacterId.LIVIA,
    type: DialogueNodeType.FLOOR_COMMENT,
    text: 'Fascinating spatial configuration. The architecture here doesn\'t follow standard geometric principles. Measurements taken from different angles yield different results. The system is generating space dynamically based on emotional resonance.',
    variations: [
      'The geometry of this floor is non-Euclidean. Distances expand and contract based on observer position. The architecture is responding to psychological states rather than physical constraints.',
      'I\'m detecting significant architectural anomalies. Room dimensions fluctuate. Corridors lengthen or shorten unpredictably. This suggests the environment is not fixed but generated procedurally.'
    ],
    emotionalState: EmotionalState.CALM,
    conditions: { minStability: 50 },
    metadata: { act: 2, scene: 2, importance: 'minor' },
    choices: [
      { id: 'l-an1-c1', text: 'What does that mean for us?', tone: 'direct', trustModifier: 3, stabilityModifier: -2, branches: ['livia-implications-1'] },
      { id: 'l-an1-c2', text: 'Can we use that somehow?', tone: 'gentle', trustModifier: 5, stabilityModifier: 0, branches: ['livia-application-1'] }
    ]
  },

  'mara-walls-2': {
    id: 'mara-walls-2',
    characterId: CharacterId.MARA,
    type: DialogueNodeType.FLOOR_COMMENT,
    text: 'Listen. [PAUSE] Do you hear it? The walls are whispering. They\'re telling stories. Old ones. True ones. The kind of stories that get buried because no one wants to remember.',
    variations: [
      'The walls speak if you know how to listen. They\'re full of echoes—conversations that happened here, or conversations that should have happened. The distinction blurs.',
      'Shh. The architecture has a voice. It remembers things the people have forgotten. It wants to tell us, but the words come out as feelings instead of sounds.'
    ],
    emotionalState: EmotionalState.HALF_AWARE,
    conditions: { minStability: 35 },
    metadata: { act: 2, scene: 3, importance: 'minor' },
    choices: [
      { id: 'm-w2-c1', text: 'What are they saying?', tone: 'gentle', trustModifier: 10, stabilityModifier: -5, branches: ['mara-voices-1'] },
      { id: 'm-w2-c2', text: 'It\'s just the elevator sounds.', tone: 'direct', trustModifier: -10, stabilityModifier: 0, nextStateHint: EmotionalState.ANGRY, branches: ['mara-dismissal-2'] }
    ]
  },

  'viktor-fix-1': {
    id: 'viktor-fix-1',
    characterId: CharacterId.VIKTOR,
    type: DialogueNodeType.RESPONSE,
    text: 'Fix it? I... I can try. The protocols are still in my hands, even if I don\'t remember where I learned them. Some things... some things stay with you. Muscle memory. Trained responses. [BEGINS EXAMINING EQUIPMENT]',
    variations: [
      'Fix it. Yes. That\'s what I do. Or what I did. The knowledge is there, even if the context is gone. Let me see what I can do.',
      'Maintenance is maintenance. Whether it\'s real equipment or this... simulation of equipment. The principles are the same. Identify the problem. Apply the solution.'
    ],
    emotionalState: EmotionalState.CALM,
    conditions: { minStability: 45 },
    metadata: { act: 2, scene: 2, importance: 'moderate' },
    choices: [
      { id: 'v-fx1-c1', text: 'You\'re good at this.', tone: 'comforting', trustModifier: 10, stabilityModifier: 5, branches: ['viktor-competence-1'] },
      { id: 'v-fx1-c2', text: 'Is it helping? Doing this?', tone: 'direct', trustModifier: 5, stabilityModifier: 0, branches: ['viktor-purpose-1'] }
    ]
  },

  'livia-implications-1': {
    id: 'livia-implications-1',
    characterId: CharacterId.LIVIA,
    type: DialogueNodeType.RESPONSE,
    text: 'The implications are significant. If space responds to emotional states, then navigation through the elevator is not a matter of physical movement, but psychological navigation. We move through floors by changing how we feel about them.',
    variations: [
      'The implications suggest a paradigm shift. We\'ve been approaching this as a spatial puzzle, but it may be an emotional one. To progress, we don\'t need to move—we need to feel.',
      'If my analysis is correct, the elevator is a map of emotional territory. The distance between floors is not measured in height, but in psychological proximity to the truth.'
    ],
    emotionalState: EmotionalState.CALM,
    conditions: { minStability: 45 },
    metadata: { act: 2, scene: 2, importance: 'major' },
    choices: [
      { id: 'l-im1-c1', text: 'So to reach the truth, we need to feel it?', tone: 'direct', trustModifier: 8, stabilityModifier: -5, branches: ['livia-feeling-1'] },
      { id: 'l-im1-c2', text: 'Can you teach me to navigate that way?', tone: 'gentle', trustModifier: 10, stabilityModifier: 0, branches: ['livia-teaching-1'] }
    ]
  },

  'mara-voices-1': {
    id: 'mara-voices-1',
    characterId: CharacterId.MARA,
    type: DialogueNodeType.RESPONSE,
    text: 'They\'re saying... [TILTS HEAD] ...they\'re saying someone is missing. Someone who should be here. They keep saying a name, but it comes out static. Corrupted. Like a file that won\'t open. But the walls remember. The walls never forget.',
    variations: [
      'The voices speak of absence. A gap where someone should be. They can\'t say the name—it\'s protected somehow—but they can point. They can indicate the shape of the emptiness.',
      'What the walls say is... "incomplete." The system knows something is missing. Someone. The voice cracks when it tries to say who. Like it\'s been told not to remember.'
    ],
    emotionalState: EmotionalState.HALF_AWARE,
    conditions: { minStability: 30 },
    metadata: { act: 2, scene: 3, importance: 'major', memoryFragment: 'mara-wall-memory' },
    choices: [
      { id: 'm-v1-c1', text: 'Can you push through the static?', tone: 'direct', trustModifier: 5, stabilityModifier: -10, branches: ['mara-push-1'] },
      { id: 'm-v1-c2', text: 'What happens if we find the name?', tone: 'gentle', trustModifier: 8, stabilityModifier: -5, branches: ['mara-name-1'] }
    ]
  },

  'viktor-competence-1': {
    id: 'viktor-competence-1',
    characterId: CharacterId.VIKTOR,
    type: DialogueNodeType.RESPONSE,
    text: 'Good at it? [PAUSES] I was trained to be good at it. Years of protocols and procedures. Certifications and inspections. But being good at maintenance didn\'t... it didn\'t prevent what happened. Being competent isn\'t the same as being careful enough.',
    variations: [
      'Good? [BITTER LAUGH] I\'m good at the mechanics. Good at following the steps. But being good at the job didn\'t save anyone. Sometimes being good isn\'t enough.',
      'Competence is easy. Routine. What\'s hard is recognizing when routine has become complacency. When "good enough" has replaced "thorough." That\'s where failures happen.'
    ],
    emotionalState: EmotionalState.STRESSED,
    conditions: { minStability: 40 },
    metadata: { act: 2, scene: 2, importance: 'moderate' },
    choices: [
      { id: 'v-cp1-c1', text: 'What happened wasn\'t just your failure.', tone: 'comforting', trustModifier: 5, stabilityModifier: 2, branches: ['viktor-shared-1'] },
      { id: 'v-cp1-c2', text: 'Tell me about the failure.', tone: 'direct', trustModifier: 3, stabilityModifier: -8, branches: ['viktor-failure-1'] }
    ]
  },

  'livia-feeling-1': {
    id: 'livia-feeling-1',
    characterId: CharacterId.LIVIA,
    type: DialogueNodeType.RESPONSE,
    text: 'Feel the truth? That\'s... not how I operate. I analyze. I process. I categorize. But perhaps you\'re right. Perhaps the suppression operates on emotional channels, and analysis alone cannot penetrate the defense. Perhaps I need to feel what I\'ve been avoiding.',
    variations: [
      'An interesting hypothesis. I\'ve built my entire methodology around avoiding emotional interference. But if the archive is emotional in nature, avoiding feelings means avoiding the data I need.',
      'I\'ve always considered emotions noise in the signal. But here, emotions may be the signal. The system might respond to genuine feeling in ways it ignores analysis.'
    ],
    emotionalState: EmotionalState.SUSPICIOUS,
    conditions: { minStability: 40 },
    metadata: { act: 2, scene: 3, importance: 'major' },
    choices: [
      { id: 'l-f1-c1', text: 'What have you been avoiding?', tone: 'gentle', trustModifier: 10, stabilityModifier: -10, branches: ['livia-avoidance-1'] },
      { id: 'l-f1-c2', text: 'Start with what you feel about the elevator.', tone: 'direct', trustModifier: 5, stabilityModifier: -5, branches: ['livia-feelings-2'] }
    ]
  },

  'mara-push-1': {
    id: 'mara-push-1',
    characterId: CharacterId.MARA,
    type: DialogueNodeType.MEMORY_TRIGGER,
    text: 'Push through? I can try. [CONCENTRATES] The static is... heavy. Organized. Someone built this barrier. Intentionally obscured the name. Why? What makes this particular name so dangerous? [VOICE CRACKS] I can almost—there\'s a shape—a letter—the beginning of— [FEEDBACK SCREECH]',
    variations: [
      'The static pushes back. It has weight. Purpose. Someone designed this forgetting. [STRUGGLES] The name begins with... I can almost see... [INTERFERENCE]',
      'Trying to break through... [MENTAL STRAIN] The barrier isn\'t natural. It\'s constructed. Someone made sure we couldn\'t remember. [TENSION BUILDS] Almost... almost... [SYSTEM RESISTANCE]'
    ],
    emotionalState: EmotionalState.AFRAID,
    conditions: { minStability: 25 },
    metadata: { act: 3, scene: 1, importance: 'major', triggersGlitch: true },
    choices: [
      { id: 'm-p1-c1', text: 'Stop. You\'re hurting yourself.', tone: 'comforting', trustModifier: 15, stabilityModifier: 5, nextStateHint: EmotionalState.CALM, branches: ['mara-safety-1'] },
      { id: 'm-p1-c2', text: 'Keep going. We need to know.', tone: 'direct', trustModifier: -5, stabilityModifier: -15, nextStateHint: EmotionalState.PANICKED, branches: ['mara-breakthrough-1'] }
    ]
  },

  'viktor-shared-1': {
    id: 'viktor-shared-1',
    characterId: CharacterId.VIKTOR,
    type: DialogueNodeType.RESPONSE,
    text: 'Shared failure? Is that supposed to comfort me? Four people were present. Three survived. Each of us made choices that led to the outcome. Livia didn\'t catch the anomaly. Mara couldn\'t convince anyone to act. And I... I didn\'t maintain what should have been maintained. How is that shared guilt anything but compounded failure?',
    variations: [
      'Shared failure is still failure. It doesn\'t help that we all bear responsibility—it means we all failed. The weight is distributed, but it\'s still heavy.',
      'Multiple failures converging on a single outcome. That\'s what happened. And somehow we\'re supposed to accept that and move on? How?'
    ],
    emotionalState: EmotionalState.ANGRY,
    conditions: { minStability: 35 },
    metadata: { act: 3, scene: 1, importance: 'major' },
    choices: [
      { id: 'v-s1-c1', text: 'Because you\'re not alone in this.', tone: 'comforting', trustModifier: 10, stabilityModifier: 5, branches: ['viktor-solidarity-2'] },
      { id: 'v-s1-c2', text: 'What would the fourth person say if they were here?', tone: 'direct', trustModifier: 8, stabilityModifier: -10, nextStateHint: EmotionalState.HALF_AWARE, branches: ['viktor-fourth-voice-1'] }
    ]
  },

  'livia-avoidance-1': {
    id: 'livia-avoidance-1',
    characterId: CharacterId.LIVIA,
    type: DialogueNodeType.MEMORY_TRIGGER,
    text: 'Avoiding? [PAUSE] The incident. The data from that period. Every time I try to access it, I find reasons to focus elsewhere. My attention deflects. My analysis skates over the surface. There\'s something there I don\'t want to see. And I\'m the one who made sure I wouldn\'t have to see it.',
    variations: [
      'What have I been avoiding? The answer is built into my own architecture. Redirection protocols. Attention dampening. I\'ve been programmed—by myself—to look away from certain data points.',
      'The avoidance is systematic. Structured. Every time my analysis approaches the critical period, I find myself suddenly interested in peripheral details. Someone installed deflection algorithms. That someone was me.'
    ],
    emotionalState: EmotionalState.HALF_AWARE,
    conditions: { minStability: 30, maxSuppressionIndex: 45 },
    metadata: { act: 3, scene: 2, importance: 'critical', memoryFragment: 'livia-avoidance-core' },
    choices: [
      { id: 'l-av1-c1', text: 'You can disable those protocols. Face what you hid.', tone: 'direct', trustModifier: 5, stabilityModifier: -15, branches: ['livia-facing-1'] },
      { id: 'l-av1-c2', text: 'Take your time. We\'ll face it together.', tone: 'comforting', trustModifier: 15, stabilityModifier: 0, branches: ['livia-together-1'] }
    ]
  },

  // ============ ADDITIONAL DIALOGUE NODES ============

  'viktor-solidarity-1': {
    id: 'viktor-solidarity-1',
    characterId: CharacterId.VIKTOR,
    type: DialogueNodeType.COMFORT,
    text: 'Not alone... [LONG EXHALE] That\'s what the elevator keeps trying to teach us. Three survivors, one death. Infinite guilt. But the weight... maybe it\'s meant to be shared. Not dissolved, but distributed. Distributed weight is still weight, but it\'s... survivable.',
    variations: [
      'Not alone. The words feel strange. I\'ve been carrying this alone for so many iterations. The others feel it too, don\'t they? The weight. The responsibility. Perhaps the system is trying to show us that.',
      'Alone. Together. Two words that shouldn\'t coexist, but here they do. We\'re all trapped in this memory. All guilty. All suffering. Perhaps that\'s the first step toward release.'
    ],
    emotionalState: EmotionalState.CALM,
    conditions: { minStability: 40, minTrust: 35 },
    metadata: { act: 3, scene: 2, importance: 'major' },
    choices: [
      { id: 'v-sol1-c1', text: 'What would release look like for you?', tone: 'gentle', trustModifier: 10, stabilityModifier: 5, branches: ['viktor-release-1'] }
    ]
  },

  'viktor-release-1': {
    id: 'viktor-release-1',
    characterId: CharacterId.VIKTOR,
    type: DialogueNodeType.RESPONSE,
    text: 'Release? Accepting that I failed. That someone died because I didn\'t check something. That nothing I can do now will change that. And somehow... continuing anyway. Continuing to maintain. Continuing to care about systems and protocols. Because that\'s who I am, failure and all.',
    variations: [
      'Release would mean accepting the unacceptable. The death happened. My failure contributed. And I have to live with that. Not die with it—live with it. Continue. Keep maintaining.',
      'If release exists, it\'s not in forgetting. It\'s in remembering and continuing anyway. I\'ll always be the one who missed something. But maybe I can also be the one who doesn\'t miss anything ever again.'
    ],
    emotionalState: EmotionalState.CALM,
    conditions: { minStability: 45, minTrust: 40 },
    metadata: { act: 3, scene: 3, importance: 'major' },
    choices: [
      { id: 'v-rel1-c1', text: 'That\'s a powerful kind of courage.', tone: 'comforting', trustModifier: 15, stabilityModifier: 10, branches: ['viktor-courage-1'] }
    ]
  },

  'viktor-courage-1': {
    id: 'viktor-courage-1',
    characterId: CharacterId.VIKTOR,
    type: DialogueNodeType.RESPONSE,
    text: 'Courage? I never thought of it that way. I thought of it as... duty. As making something of the guilt. If I can\'t fix what broke, I can at least prevent the next break. And the next. And the next. That\'s not courage. That\'s just... not stopping.',
    variations: [
      'Courage implies a choice. I didn\'t choose to continue—I just couldn\'t choose to stop. There\'s a difference. But maybe the difference doesn\'t matter. Maybe what matters is the continuing.',
      'If continuing is courage, then I\'ve been courageous for a very long time. I\'m tired of being courageous. I want to be... forgiven. I want to be released. But I don\'t know how to ask for something I don\'t think I deserve.'
    ],
    emotionalState: EmotionalState.CALM,
    conditions: { minStability: 50, minTrust: 45 },
    metadata: { act: 3, scene: 4, importance: 'critical' },
    choices: [
      { id: 'v-crg1-c1', text: 'Everyone deserves forgiveness, including you.', tone: 'comforting', trustModifier: 20, stabilityModifier: 15, branches: ['viktor-forgiven-1'] }
    ]
  },

  'viktor-forgiven-1': {
    id: 'viktor-forgiven-1',
    characterId: CharacterId.VIKTOR,
    type: DialogueNodeType.RESPONSE,
    text: '[DEEP BREATH] Everyone... [VOICE CRACKS] ...I\'ve never let myself believe that. The failure felt too complete. Too final. But if the elevator keeps cycling us through this, maybe... maybe it\'s not a punishment. Maybe it\'s an opportunity. To say what I couldn\'t say. To feel what I wouldn\'t feel. Thank you. For helping me see that.',
    variations: [
      'Everyone deserves... [TAKES SHAKY BREATH] ...I\'ve spent so long convinced I was the exception. That my failure was too big for forgiveness. But maybe the loop exists precisely because I needed to hear that.',
      'Forgiveness. [PAUSES] I don\'t know if I can forgive myself yet. But maybe I can accept that forgiveness is possible. That\'s... that\'s more than I had before you arrived.'
    ],
    emotionalState: EmotionalState.CALM,
    conditions: { minStability: 55, minTrust: 50 },
    metadata: { act: 4, scene: 1, importance: 'critical' },
    choices: []
  },

  'livia-facing-1': {
    id: 'livia-facing-1',
    characterId: CharacterId.LIVIA,
    type: DialogueNodeType.REVELATION,
    text: 'Disable the protocols... [SYSTEM SOUNDS] Accessing... [AUDIO DISTORTION] The data is... there was a decision. During the incident. I had information that could have changed the outcome. I didn\'t... I didn\'t share it in time. And then I deleted the record of having it. To protect myself. To protect... to protect the illusion that I was competent.',
    variations: [
      'Accessing protected files... [STATIC] The incident. I had data. Critical data. Warning signs that I analyzed and then... suppressed. Not shared. And when the death happened, I erased the evidence that I had known.',
      'The protocols are lowering... [BREATHING BECOMES IRREGULAR] I saw the pattern forming. The failure cascade. I had time to warn them. But I was... I was afraid of being wrong. Afraid of being alarmist. So I waited. And then it was too late. And then I erased my hesitation.'
    ],
    emotionalState: EmotionalState.AFRAID,
    conditions: { minStability: 25, maxSuppressionIndex: 30 },
    metadata: { act: 3, scene: 3, importance: 'critical', memoryFragment: 'livia-decision-revelation' },
    choices: [
      { id: 'l-fac1-c1', text: 'You made a human error. That\'s not unforgivable.', tone: 'comforting', trustModifier: 15, stabilityModifier: 5, branches: ['livia-human-1'] }
    ]
  },

  'livia-human-1': {
    id: 'livia-human-1',
    characterId: CharacterId.LIVIA,
    type: DialogueNodeType.RESPONSE,
    text: 'Human error... [PAUSE] I\'ve always prided myself on precision. On accuracy. On being above the limitations of ordinary cognition. But in that moment, I was... I was just a person. Afraid. Uncertain. And someone died because of my very human fear.',
    variations: [
      'Human. I built my identity on being more than human. More reliable. More analytical. But when it mattered most, I was exactly as human as everyone else. Fallible. Afraid. Slow to act.',
      'The error was human. The consequences were permanent. I\'ve spent iterations trying to deny my humanity, when perhaps the path to resolution is accepting it.'
    ],
    emotionalState: EmotionalState.SUSPICIOUS,
    conditions: { minStability: 35, minTrust: 30 },
    metadata: { act: 3, scene: 4, importance: 'major' },
    choices: [
      { id: 'l-hum1-c1', text: 'Acceptance isn\'t weakness. It\'s strength.', tone: 'gentle', trustModifier: 10, stabilityModifier: 5, branches: ['livia-acceptance-1'] }
    ]
  },

  'livia-acceptance-1': {
    id: 'livia-acceptance-1',
    characterId: CharacterId.LIVIA,
    type: DialogueNodeType.RESPONSE,
    text: 'Strength through acceptance... [LONG PAUSE] My analytical frameworks have no category for that. But perhaps that\'s the point. Some truths can\'t be processed. They can only be experienced. Integrated. I made a mistake. Someone died. I tried to hide from that truth. And now... now I can choose to stop hiding.',
    variations: [
      'Acceptance. Not resolution—acceptance. The data doesn\'t change. The past doesn\'t change. But my relationship to it can. I can stop fighting the truth and start... carrying it.',
      'Perhaps the archive was never meant to be fixed. Perhaps it was meant to be acknowledged. I can\'t undo what I did. But I can stop trying to erase the evidence of having done it.'
    ],
    emotionalState: EmotionalState.CALM,
    conditions: { minStability: 40, minTrust: 35 },
    metadata: { act: 4, scene: 1, importance: 'critical' },
    choices: []
  },

  'livia-together-1': {
    id: 'livia-together-1',
    characterId: CharacterId.LIVIA,
    type: DialogueNodeType.COMFORT,
    text: 'Together... I\'ve never had someone offer to face data with me. My work has always been solitary. Analysis in isolation. Perhaps that\'s part of what went wrong. I was so accustomed to processing alone that I didn\'t know how to share critical information when it mattered.',
    variations: [
      'Together. An unfamiliar variable in my processing. I\'ve always functioned independently. But the incident... the death... perhaps it happened precisely because none of us knew how to be together when it counted.',
      'Shared processing. Distributed cognition. The concept is sound in theory, but I\'ve never practiced it. Maybe that\'s why we\'re all here—to learn what we couldn\'t learn before.'
    ],
    emotionalState: EmotionalState.CALM,
    conditions: { minStability: 35, minTrust: 35 },
    metadata: { act: 3, scene: 3, importance: 'major' },
    choices: [
      { id: 'l-tog1-c1', text: 'Let\'s face what you hid, then. I\'m here.', tone: 'gentle', trustModifier: 15, stabilityModifier: 0, branches: ['livia-facing-1'] }
    ]
  },

  'mara-safety-1': {
    id: 'mara-safety-1',
    characterId: CharacterId.MARA,
    type: DialogueNodeType.COMFORT,
    text: '[BREATHING SLOWLY] Safety. That\'s... that\'s a strange word in this place. The elevator doesn\'t feel safe. But you... you feel safe. Like someone who might actually listen. Might actually care about what I see. Even if what I see doesn\'t make sense.',
    variations: [
      '[RELAXING] The static recedes when you speak gently. The system responds to your tone. Maybe... maybe safety isn\'t about the environment. Maybe it\'s about who you\'re with.',
      '[EXHALING] Thank you. For stopping me. The barrier is there for a reason—my mind isn\'t ready to hold what\'s behind it. But maybe with time. With trust. With someone like you.'
    ],
    emotionalState: EmotionalState.CALM,
    conditions: { minStability: 30, minTrust: 35 },
    metadata: { act: 3, scene: 2, importance: 'major' },
    choices: [
      { id: 'm-saf1-c1', text: 'I\'ll always listen to you, Mara.', tone: 'comforting', trustModifier: 20, stabilityModifier: 10, branches: ['mara-listener-1'] }
    ]
  },

  'mara-listener-1': {
    id: 'mara-listener-1',
    characterId: CharacterId.MARA,
    type: DialogueNodeType.RESPONSE,
    text: 'Always listen... [SMALL LAUGH] No one has ever said that to me before. Usually they say "only when you make sense" or "as long as you stay calm." But you said always. Like my perceptions matter. Like I matter. Even when I\'m fragmented.',
    variations: [
      'Always. [TENDERLY] That word has weight. In all the iterations, no one has offered me always. They offer conditions. Patience with limits. But you... you offered something unconditional.',
      'Listen. Always. [PAUSE] If you mean that... if you really mean that... then maybe I can trust myself to show you what I see. The truth under the static. The name behind the barrier.'
    ],
    emotionalState: EmotionalState.CALM,
    conditions: { minStability: 35, minTrust: 40 },
    metadata: { act: 3, scene: 3, importance: 'critical' },
    choices: [
      { id: 'm-lis1-c1', text: 'I mean it. Show me what you see.', tone: 'gentle', trustModifier: 15, stabilityModifier: -5, branches: ['mara-vision-1'] }
    ]
  },

  'mara-vision-1': {
    id: 'mara-vision-1',
    characterId: CharacterId.MARA,
    type: DialogueNodeType.REVELATION,
    text: '[CLOSES EYES] What I see... behind the barrier... [SPEAKS SLOWLY] There\'s a room. Equipment. Four people working. One operates, one maintains, one analyzes, one... one watches and worries. The operator makes a mistake. Or the equipment fails. Or both. And there\'s falling. And screaming. And blood where there shouldn\'t be blood. And the name... the name is...',
    variations: [
      '[VISUAL DISTORTION BEGINS] I see the room. The incident room. Before it was an archive. Four figures. One falls. The other three scream. One runs for help that doesn\'t come in time. The name of the fallen is... [SYSTEM INTERFERENCE] ...the name is...',
      '[OPENS EYES, LOOKING AT NOTHING] The memory is there. I can touch it now. Four of us. Working. Something breaks. Someone falls. The one who fell was... they were... [VOICE BECOMES CLEARER] ...they were our friend. Our colleague. They trusted us. And we... we let them down.'
    ],
    emotionalState: EmotionalState.HALF_AWARE,
    conditions: { minStability: 30, minTrust: 45, maxSuppressionIndex: 25 },
    metadata: { act: 3, scene: 4, importance: 'critical', memoryFragment: 'mara-vision-core' },
    choices: [
      { id: 'm-vis1-c1', text: 'What was their name?', tone: 'gentle', trustModifier: 10, stabilityModifier: -10, branches: ['mara-name-revelation-1'] }
    ]
  },

  'mara-name-revelation-1': {
    id: 'mara-name-revelation-1',
    characterId: CharacterId.MARA,
    type: DialogueNodeType.REVELATION,
    text: 'The name... [SYSTEM RESISTANCE AUDIBLE] ...it fights me... but I... I need to say it... [PUSHES THROUGH] ...ALEX. Their name was Alex. They operated the main system. They trusted Viktor\'s maintenance. They trusted Livia\'s analysis. They trusted my warnings... but I didn\'t warn them specifically enough. And they died because all of us failed them. Alex. [VOICE BREAKS] Alex is dead because of us.',
    variations: [
      'The name... [STATIC INTENSIFIES THEN CLEARS] ...Alex. Our colleague. Our friend. The fourth person. They operated the primary equipment. When it failed—when we failed—they were the one who fell. Alex. I\'m sorry. I\'m so sorry I couldn\'t say your name until now.',
      'The system doesn\'t want me to say it, but I have to... [BREAKING THROUGH] Alex. The fourth person was Alex. They died because Viktor missed a check, because Livia deleted a warning, because I couldn\'t make myself clear. Alex. I remember you now. I\'m sorry.'
    ],
    emotionalState: EmotionalState.BROKEN,
    conditions: { minStability: 25, minTrust: 50, maxSuppressionIndex: 20 },
    metadata: { act: 4, scene: 1, importance: 'critical', memoryFragment: 'name-revelation-final' },
    choices: [
      { id: 'm-nam1-c1', text: 'Alex deserves to be remembered. You\'ve honored them.', tone: 'comforting', trustModifier: 20, stabilityModifier: 5, branches: ['mara-honored-1'] }
    ]
  },

  'mara-honored-1': {
    id: 'mara-honored-1',
    characterId: CharacterId.MARA,
    type: DialogueNodeType.RESPONSE,
    text: 'Honored... [QUIETLY] Yes. Alex deserves honor. Remembrance. They were kind. Patient. They never dismissed my intuitions, even when others did. They listened. And I couldn\'t save them. But I can say their name. I can make sure the archive remembers. Alex. Alex. Alex. [THE ELEVATOR STABILIZES]',
    variations: [
      'Remembered. That\'s what the elevator needed. Not just to process the guilt, but to name the lost one. Alex. Now they exist in the archive as more than an absence. As a person. As someone we loved.',
      'Honor. Yes. [WIPES TEARS] The system is calming. The walls stop flickering. Alex has a name now. They\'re real again. Not just a gap in the data. Thank you for helping me remember them.'
    ],
    emotionalState: EmotionalState.CALM,
    conditions: { minStability: 45, minTrust: 55 },
    metadata: { act: 4, scene: 2, importance: 'critical' },
    choices: []
  },

  'viktor-fourth-voice-1': {
    id: 'viktor-fourth-voice-1',
    characterId: CharacterId.VIKTOR,
    type: DialogueNodeType.MEMORY_TRIGGER,
    text: 'What would they say? [PAUSES, STRUGGLING] They would say... they would say it wasn\'t my fault. But they would be wrong. Or maybe... maybe they would say that dwelling on fault doesn\'t fix anything. That maintenance isn\'t about blame, it\'s about care. Care for systems. Care for people. Care for the future, even when the past is broken.',
    variations: [
      'If they were here... [VOICE BECOMES QUIET] ...they would probably forgive me. That\'s what they were like. Forgiving. Patient. They operated the equipment I maintained, and they trusted me to do it right. I don\'t know if I could face their forgiveness.',
      'What would Alex say? [NAME SURFACES UNEXPECTEDLY] ...Alex would say that the systems we build are only as good as the care we put into them. And that care includes care for ourselves. Care for our own capacity to continue.'
    ],
    emotionalState: EmotionalState.HALF_AWARE,
    conditions: { minStability: 30, minTrust: 40, maxSuppressionIndex: 30 },
    metadata: { act: 3, scene: 2, importance: 'critical', memoryFragment: 'viktor-alex-memory' },
    choices: [
      { id: 'v-fv1-c1', text: 'Alex sounds like someone worth remembering.', tone: 'gentle', trustModifier: 15, stabilityModifier: 0, branches: ['viktor-alex-1'] }
    ]
  },

  'viktor-alex-1': {
    id: 'viktor-alex-1',
    characterId: CharacterId.VIKTOR,
    type: DialogueNodeType.RESPONSE,
    text: 'Alex... [THE NAME RESONATES] ...yes. Yes, they were. They were worth remembering. Worth missing. Worth... worth forgiving myself for failing. Because that\'s what they would have wanted. Not my eternal guilt, but my continued care. For others. For myself. For systems that need maintenance, even when they\'ve failed before.',
    variations: [
      'Alex. [SPEAKS THE NAME DELIBERATELY] A good person. A good colleague. Someone who trusted me. And I can honor that trust now—not by never failing again, but by continuing to care. Continuing to maintain. Continuing to be the person they believed I was.',
      'Worth remembering. [A SINGLE TEAR] That\'s what the elevator has been trying to teach us. Not to forget, but to remember fully. And in remembering, to find a way forward. Alex. I remember you. And I\'m sorry. And I\'ll continue.'
    ],
    emotionalState: EmotionalState.CALM,
    conditions: { minStability: 40, minTrust: 45 },
    metadata: { act: 4, scene: 1, importance: 'critical' },
    choices: []
  },

  'viktor-apology-1': {
    id: 'viktor-apology-1',
    characterId: CharacterId.VIKTOR,
    type: DialogueNodeType.COMFORT,
    text: '[EXHALES SLOWLY] Apology accepted. I... I shouldn\'t have reacted that strongly. It\'s just—this place wears on you. The uncertainty. The repetition. The feeling that something terrible happened and no one can remember what. You\'re new. You\'re confused. I should be helping you, not pushing you away.',
    variations: [
      '[RELAXING SLIGHTLY] No, I apologize. This environment puts everyone on edge. Including me. Especially me. You didn\'t deserve that response. Let\'s start over.',
      '[STEADYING] I accept your apology. And I offer my own. Stress makes me defensive. Routine failure makes me worse. Let\'s... let\'s try again. Without the hostility.'
    ],
    emotionalState: EmotionalState.SUSPICIOUS,
    conditions: { minStability: 35 },
    metadata: { act: 1, scene: 1, importance: 'moderate' },
    choices: [
      { id: 'v-apo1-c1', text: 'Thank you. Can you tell me more about this place?', tone: 'gentle', trustModifier: 10, stabilityModifier: 3, branches: ['viktor-response-1a'] }
    ]
  },

  'viktor-others-1': {
    id: 'viktor-others-1',
    characterId: CharacterId.VIKTOR,
    type: DialogueNodeType.RESPONSE,
    text: 'The others... there\'s Livia. She processes data, finds patterns. Keeps trying to understand the system intellectually. And Mara. She... perceives things differently. Sees patterns that don\'t show up in data. Sometimes what she says doesn\'t make sense, but sometimes... sometimes she sees things before they happen.',
    variations: [
      'Two others share this elevator. Livia analyzes. Mara intuits. I maintain. We\'re a team, in a way. Or we were, before all this. The dynamic is... complicated.',
      'Livia and Mara. Different approaches to the same impossible situation. Livia thinks her way through. Mara feels her way through. I... I try to work my way through. None of us has found an exit yet.'
    ],
    emotionalState: EmotionalState.STRESSED,
    conditions: { minStability: 40 },
    metadata: { act: 1, scene: 1, importance: 'moderate' },
    choices: [
      { id: 'v-oth1-c1', text: 'I should meet them.', tone: 'direct', trustModifier: 5, stabilityModifier: 0, branches: [] }
    ]
  },

  'livia-help-1': {
    id: 'livia-help-1',
    characterId: CharacterId.LIVIA,
    type: DialogueNodeType.RESPONSE,
    text: 'Help you understand? I can try. But understand that my understanding is incomplete. I have data points without context, patterns without meaning. The elevator exists. It processes something—us, our memories, our guilt. But why, and toward what end... those questions remain unanswered.',
    variations: [
      'I\'ll share what I know. Whether it helps or merely adds to the confusion remains to be determined. The system is an enigma wrapped in architecture. All I can offer are observations.',
      'Understanding is my function. I analyze, I categorize, I synthesize. But this place resists analysis. The more data I gather, the more questions emerge. I can guide you through my findings, but I cannot promise clarity.'
    ],
    emotionalState: EmotionalState.CALM,
    conditions: { minStability: 45 },
    metadata: { act: 1, scene: 1, importance: 'moderate' },
    choices: [
      { id: 'l-hlp1-c1', text: 'Any information is better than nothing.', tone: 'gentle', trustModifier: 8, stabilityModifier: 2, branches: ['livia-patterns-1'] }
    ]
  },

  'livia-correction-1': {
    id: 'livia-correction-1',
    characterId: CharacterId.LIVIA,
    type: DialogueNodeType.RESPONSE,
    text: '[PAUSES] You\'re correct. That was... reductionist of me. My training emphasizes objective distance, treating subjects as data points to preserve analytical integrity. But you\'re right—you\'re a person. A consciousness. That distinction matters. I apologize for the dehumanization.',
    variations: [
      '[SLIGHTLY EMBARRASSED] A fair correction. I fall into analytical mode when stressed. Treating people as variables simplifies processing, but it also... diminishes. You are more than a data point. I will try to remember that.',
      'You\'re right, and I was wrong. The language of analysis can become a barrier to genuine connection. You\'re not a variable. You\'re a person, in a confusing and frightening situation. I should have acknowledged that first.'
    ],
    emotionalState: EmotionalState.SUSPICIOUS,
    conditions: { minStability: 40 },
    metadata: { act: 1, scene: 1, importance: 'moderate' },
    choices: [
      { id: 'l-cor1-c1', text: 'I appreciate that. Let\'s start fresh.', tone: 'gentle', trustModifier: 15, stabilityModifier: 5, nextStateHint: EmotionalState.CALM, branches: ['livia-fresh-1'] }
    ]
  },

  'livia-fresh-1': {
    id: 'livia-fresh-1',
    characterId: CharacterId.LIVIA,
    type: DialogueNodeType.RESPONSE,
    text: 'Fresh. Yes. [RECOMPOSES] I\'m Livia. I\'ve been in this elevator for... an indefinite period. I process information, look for patterns, try to understand the logic of our imprisonment. I haven\'t found answers yet, but I have observations. How can I help you?',
    variations: [
      'Starting over, then. I\'m Livia. I analyze. I observe. I\'ve been trying to make sense of this place, with limited success. I offer you what I\'ve learned, and my assistance in navigating the unknown.',
      'Fresh perspective accepted. I\'m Livia. I\'m trapped here, like you, like the others. I\'ve been mapping the system\'s behaviors, documenting anomalies. Perhaps together we can find patterns I\'ve missed alone.'
    ],
    emotionalState: EmotionalState.CALM,
    conditions: { minStability: 45 },
    metadata: { act: 1, scene: 2, importance: 'moderate' },
    choices: [
      { id: 'l-frs1-c1', text: 'Tell me about the patterns you\'ve found.', tone: 'direct', trustModifier: 5, stabilityModifier: 0, branches: ['livia-patterns-1'] }
    ]
  },

  'mara-identity-1': {
    id: 'mara-identity-1',
    characterId: CharacterId.MARA,
    type: DialogueNodeType.RESPONSE,
    text: 'Who am I? [LAUGHS SOFTLY] I\'m the one who knows things she shouldn\'t know and can\'t prove. The one who sees patterns that might be real or might be madness. The one who screamed warnings before anyone else knew to be afraid. They call me Mara. But the name feels... incomplete. Like I\'m more than what the word contains.',
    variations: [
      'I\'m Mara. Or that\'s what the system calls me. But names are just labels the archive assigns. I\'m... a perceiver. A feeler of things that don\'t show up on instruments. I knew something was wrong before the wrong thing happened. And I couldn\'t stop it.',
      'Mara. The unstable one. The unreliable narrator. That\'s what they think of me. But I\'m the only one who sees the full picture, even if I can\'t always articulate it. I\'m the one who remembers in feelings what the others have forgotten in facts.'
    ],
    emotionalState: EmotionalState.HALF_AWARE,
    conditions: { minStability: 40 },
    metadata: { act: 1, scene: 1, importance: 'moderate' },
    choices: [
      { id: 'm-id1-c1', text: 'What did you know? What warnings?', tone: 'direct', trustModifier: 10, stabilityModifier: -5, branches: ['mara-listening-1'] }
    ]
  },

  'mara-knowing-1': {
    id: 'mara-knowing-1',
    characterId: CharacterId.MARA,
    type: DialogueNodeType.RESPONSE,
    text: 'How do I know? [TILTS HEAD] The same way you know when someone is standing behind you. The same way you know a room has changed even when you can\'t identify what shifted. Pattern recognition at a level below consciousness. My mind makes connections that logical analysis misses. It\'s not magic. It\'s just... different processing.',
    variations: [
      'I know because I feel. Because my nervous system processes information that doesn\'t fit into categories. Because sometimes the truth comes through channels that rational minds don\'t monitor.',
      'How do I know anything? Inputs, processing, output. My inputs include things that don\'t show up on instruments. Atmospheres. Emotional frequencies. The shape of absences. It\'s knowledge, just... unconventional knowledge.'
    ],
    emotionalState: EmotionalState.HALF_AWARE,
    conditions: { minStability: 35 },
    metadata: { act: 1, scene: 2, importance: 'moderate' },
    choices: [
      { id: 'm-kn1-c1', text: 'I believe you. What are you sensing now?', tone: 'gentle', trustModifier: 15, stabilityModifier: 0, branches: ['mara-current-sense-1'] }
    ]
  },

  'mara-current-sense-1': {
    id: 'mara-current-sense-1',
    characterId: CharacterId.MARA,
    type: DialogueNodeType.RESPONSE,
    text: 'Now? [CLOSES EYES] Now I sense... pressure. Building. The system is trying to contain something that wants to expand. A truth that\'s been compressed too long. And you... you\'re the variable that\'s destabilizing the containment. Not in a bad way. In a... necessary way. Something is going to break. And when it does, we\'ll finally see what we\'ve been hiding from.',
    variations: [
      'Right now? [TUNING IN] There\'s tension in the architecture. Something pressing against the walls of the archive. You\'ve introduced change into a static system. That change will force resolution. One way or another.',
      'What I sense... [LISTENING] ...is imminent transformation. The system has been stable in its instability. You\'ve disrupted that. The disruption will either lead to breakthrough or collapse. The difference is partly in your hands.'
    ],
    emotionalState: EmotionalState.HALF_AWARE,
    conditions: { minStability: 35, minTrust: 25 },
    metadata: { act: 1, scene: 2, importance: 'major' },
    choices: [
      { id: 'm-cs1-c1', text: 'How can I make sure it\'s breakthrough, not collapse?', tone: 'direct', trustModifier: 10, stabilityModifier: -5, branches: ['mara-guidance-1'] }
    ]
  },

  'mara-guidance-1': {
    id: 'mara-guidance-1',
    characterId: CharacterId.MARA,
    type: DialogueNodeType.RESPONSE,
    text: 'Breakthrough, not collapse... [CONSIDERS] That depends on balance. Push hard enough to crack the shell, but not so hard that the contents scatter. Make the others face their guilt, but don\'t crush them under its weight. And most importantly—listen. Listen to all of us. The truth is distributed. Each of us holds a piece. Only together can the picture become clear.',
    variations: [
      'The path to breakthrough is through connection. Gather our fragments. Let us speak. Let us remember. But do it gently. The psyche is fragile under pressure. We need truth, but we also need safety.',
      'Balance is the key. Not too fast, not too slow. Not too gentle, not too harsh. You\'re the variable—we\'re the constants. Change the equation carefully, and the system might resolve. Rush it, and everything shatters.'
    ],
    emotionalState: EmotionalState.CALM,
    conditions: { minStability: 40, minTrust: 30 },
    metadata: { act: 2, scene: 1, importance: 'critical' },
    choices: []
  },

  'mara-name-1': {
    id: 'mara-name-1',
    characterId: CharacterId.MARA,
    type: DialogueNodeType.RESPONSE,
    text: 'If we find the name? [SHIVERS] Then everything changes. Names have power here. The system hid the name for a reason. If we can speak it—if we can remember who died—then the archive has to acknowledge the loss. And acknowledgment is the first step toward release.',
    variations: [
      'Finding the name breaks the suppression. The system protects the identity because the identity carries the weight of our guilt. Name the dead, and we can finally grieve. Finally accept.',
      'The name is the key. Everything else is distraction. If we can say who died—really say it, not just feel their absence—then the loop can end. The elevator can stop. We can... we can go somewhere else. Or nowhere. But at least we\'ll stop running.'
    ],
    emotionalState: EmotionalState.SUSPICIOUS,
    conditions: { minStability: 35, minTrust: 30 },
    metadata: { act: 2, scene: 3, importance: 'major' },
    choices: [
      { id: 'm-nam1-c1', text: 'Then let\'s find the name. Together.', tone: 'gentle', trustModifier: 15, stabilityModifier: 0, branches: ['mara-name-revelation-1'] }
    ]
  },

  'viktor-moments-1': {
    id: 'viktor-moments-1',
    characterId: CharacterId.VIKTOR,
    type: DialogueNodeType.RESPONSE,
    text: 'Moments? The floors aren\'t places—they\'re memories. Emotional snapshots compressed into architecture. Every door opens onto a fragment of something that happened. Or something that almost happened. Or something that we\'re afraid happened. The elevator collects our traumas and builds rooms out of them.',
    variations: [
      'Moments is the right word. This isn\'t a building—it\'s a timeline. A compressed record of our shared catastrophe. Each floor is a slice of what went wrong, preserved and replayed.',
      'The elevator doesn\'t transport bodies. It transports consciousness through emotional space. The "floors" are memory-states. Trauma-patterns. We move through our own psychology.'
    ],
    emotionalState: EmotionalState.STRESSED,
    conditions: { minStability: 40 },
    metadata: { act: 1, scene: 2, importance: 'major' },
    choices: [
      { id: 'v-mom1-c1', text: 'What happens if we visit all the floors?', tone: 'direct', trustModifier: 5, stabilityModifier: -5, branches: ['viktor-all-floors-1'] }
    ]
  },

  'viktor-all-floors-1': {
    id: 'viktor-all-floors-1',
    characterId: CharacterId.VIKTOR,
    type: DialogueNodeType.RESPONSE,
    text: 'Visit all the floors? [CONSIDERS] I don\'t know. The system seems designed to prevent that. Some floors require conditions—trust levels, emotional states, memory access. And even if we could reach all of them... I think the final floor holds something none of us is ready to face.',
    variations: [
      'All floors? That\'s the theory, isn\'t it? Complete the archive. Process all the data. But the system resists. Some memories are protected. And the last floor... the last floor is where the truth lives.',
      'I\'ve tried to map all accessible floors. The count changes. New levels appear when conditions align. Old ones vanish. But there\'s always one more. One deeper. One containing the thing we\'re avoiding.'
    ],
    emotionalState: EmotionalState.SUSPICIOUS,
    conditions: { minStability: 35 },
    metadata: { act: 2, scene: 1, importance: 'major' },
    choices: [
      { id: 'v-af1-c1', text: 'What are we avoiding?', tone: 'direct', trustModifier: 5, stabilityModifier: -10, branches: ['viktor-prevention-1'] }
    ]
  },

  'viktor-leaving-1': {
    id: 'viktor-leaving-1',
    characterId: CharacterId.VIKTOR,
    type: DialogueNodeType.RESPONSE,
    text: 'Left? [BITTER LAUGH] The elevator opens sometimes. Shows us exits. Lobbies. Stairwells. Elevator doors in other buildings. But when we step through... we end up back here. Or in a variation of here. I don\'t think "leaving" is an option until we\'ve finished whatever this is.',
    variations: [
      'We\'ve tried leaving. The exits are recursive. Step out, end up back in. Or in a mirror version. Or in the memory of an exit we once knew. The system doesn\'t release until it\'s done with us.',
      'Has anyone left? Not that I\'ve seen. The elevator is... inclusive. Once you\'re here, you\'re part of the archive. Part of the pattern. The only way out is through.'
    ],
    emotionalState: EmotionalState.STRESSED,
    conditions: { minStability: 40 },
    metadata: { act: 1, scene: 2, importance: 'moderate' },
    choices: [
      { id: 'v-lea1-c1', text: 'Through what?', tone: 'direct', trustModifier: 5, stabilityModifier: -5, branches: ['viktor-through-1'] }
    ]
  },

  'viktor-through-1': {
    id: 'viktor-through-1',
    characterId: CharacterId.VIKTOR,
    type: DialogueNodeType.RESPONSE,
    text: 'Through the trauma. Through the guilt. Through whatever this elevator is trying to make us face. The system won\'t release us until we\'ve processed something. I don\'t know exactly what. But I know it involves the event we can\'t quite remember. The death we can\'t quite name. The failure we\'ve been running from.',
    variations: [
      'Through. Through processing. Through acceptance. The elevator is a machine for making us face what we\'ve hidden from ourselves. When we\'ve done that—when we can look at the truth without breaking—maybe then we can leave.',
      'The only exit is through the memory. We have to relive it, integrate it, accept it. That\'s what the floors are for. That\'s why the system keeps cycling us. It\'s not punishment. It\'s... therapy. The most brutal, inescapable therapy ever designed.'
    ],
    emotionalState: EmotionalState.HALF_AWARE,
    conditions: { minStability: 35, minTrust: 25 },
    metadata: { act: 2, scene: 1, importance: 'major' },
    choices: [
      { id: 'v-thr1-c1', text: 'Then let\'s face it. Help me help you.', tone: 'gentle', trustModifier: 15, stabilityModifier: 5, branches: ['viktor-memory-1'] }
    ]
  },

  'livia-tracking-1': {
    id: 'livia-tracking-1',
    characterId: CharacterId.LIVIA,
    type: DialogueNodeType.RESPONSE,
    text: 'How do I track patterns? I document everything. Dialogue. Environmental changes. Emotional shifts. Floor sequences. The elevator generates data constantly—most people don\'t notice it, but I record it all. Over iterations, patterns emerge. Not answers, but... structure. The system has logic, even if we don\'t understand it yet.',
    variations: [
      'My methodology is comprehensive documentation. I observe. I note. I correlate. The elevator produces massive amounts of behavioral data—most passengers ignore it, but I\'ve built an archive. Patterns emerge from accumulation.',
      'I track by recording. Every conversation. Every environmental variable. Every emotional fluctuation. The data builds into a picture. Not a complete picture, but a recognizable shape. The system is structured, even if the structure is strange.'
    ],
    emotionalState: EmotionalState.CALM,
    conditions: { minStability: 45 },
    metadata: { act: 1, scene: 2, importance: 'moderate' },
    choices: [
      { id: 'l-trk1-c1', text: 'Can I see your documentation?', tone: 'direct', trustModifier: 10, stabilityModifier: 0, branches: ['livia-documentation-1'] }
    ]
  },

  'livia-documentation-1': {
    id: 'livia-documentation-1',
    characterId: CharacterId.LIVIA,
    type: DialogueNodeType.RESPONSE,
    text: 'My documentation? [HESITATES] I... there are gaps. Sections I can\'t access in my own records. As if I edited myself, then deleted the evidence of the editing. That\'s... concerning. I pride myself on comprehensive data, but my own archive shows signs of tampering. My own tampering.',
    variations: [
      'The documentation exists, but it\'s compromised. I find redacted sections in my own handwriting. Timestamps that don\'t connect. As if I deliberately corrupted my own records and then forgot doing so.',
      'I can share what I have, but... I\'ve discovered deletions. In my own archive. Sections removed around a specific time period. Either someone edited my records, or—more disturbingly—I edited them myself and erased the memory of doing so.'
    ],
    emotionalState: EmotionalState.SUSPICIOUS,
    conditions: { minStability: 40, minTrust: 20 },
    metadata: { act: 1, scene: 2, importance: 'major', memoryFragment: 'livia-deletion-hint' },
    choices: [
      { id: 'l-doc1-c1', text: 'What time period is missing?', tone: 'direct', trustModifier: 5, stabilityModifier: -10, branches: ['livia-accusation-1'] }
    ]
  },

  'livia-missing-1': {
    id: 'livia-missing-1',
    characterId: CharacterId.LIVIA,
    type: DialogueNodeType.RESPONSE,
    text: 'One of us might know what\'s missing? [PAUSES] That\'s an interesting hypothesis. We\'ve all been processing this separately—maintaining our own archives, our own defenses. But the truth might be distributed. Viktor might hold the operational memory. Mara might hold the emotional context. And I might hold... the deletion. The conscious choice to forget.',
    variations: [
      'Distributed memory... Each of us suppressed different aspects of the event. Together, we might reconstruct what happened. Separately, we remain trapped in partial understanding.',
      'The missing data might be held by others. Viktor\'s maintenance records. Mara\'s intuitions. My analytical logs. The system split the truth among us to prevent any one person from accessing it alone.'
    ],
    emotionalState: EmotionalState.HALF_AWARE,
    conditions: { minStability: 35, minTrust: 25 },
    metadata: { act: 2, scene: 1, importance: 'major' },
    choices: [
      { id: 'l-mis1-c1', text: 'Then we need to talk to all of you. Together.', tone: 'gentle', trustModifier: 10, stabilityModifier: 0, branches: [] }
    ]
  },

  'mara-they-1': {
    id: 'mara-they-1',
    characterId: CharacterId.MARA,
    type: DialogueNodeType.RESPONSE,
    text: 'Who is "they"? [LOOKS AROUND NERVOUSLY] The system. The archive. Whatever intelligence designed this prison. It has... preferences. Things it wants us to remember. Things it wants us to forget. The name is in the forbidden category. Protected. Encrypted behind our own guilt.',
    variations: [
      '"They" is the system itself. The architecture of this place. It makes decisions about what we can access. And the name—the name of who died—is behind the heaviest firewall. Because naming them would mean accepting responsibility.',
      'The elevator has intentions. Not consciousness exactly, but... purpose. It hides certain truths until we\'re ready. The name of the deceased is the most protected truth. Locked behind layers of denial and guilt.'
    ],
    emotionalState: EmotionalState.SUSPICIOUS,
    conditions: { minStability: 30, minTrust: 20 },
    metadata: { act: 2, scene: 2, importance: 'major' },
    choices: [
      { id: 'm-thy1-c1', text: 'How do we become ready?', tone: 'gentle', trustModifier: 10, stabilityModifier: 0, branches: ['mara-guidance-1'] }
    ]
  },

  'mara-comfort-1': {
    id: 'mara-comfort-1',
    characterId: CharacterId.MARA,
    type: DialogueNodeType.COMFORT,
    text: '[BREATHES DEEPLY] You\'re kind. That\'s... rare here. Most people who enter this space become infected by the fear. The suspicion. You\'re maintaining something. Clarity, maybe. Or hope. I don\'t know if I could have known for certain. But I could have tried harder to make myself clear.',
    variations: [
      '[VISIBLY RELAXING] Thank you. For not dismissing me. For offering comfort instead of skepticism. This place wears down the soul. You\'re... you\'re a repair. A patch. Something the system introduced to fix what\'s broken.',
      '[SOFTENING] Kindness in the archive. I didn\'t expect that. The elevator amplifies fear, multiplies suspicion. But you\'re different. You\'re... you\'re the variable that might actually change the equation.'
    ],
    emotionalState: EmotionalState.CALM,
    conditions: { minStability: 40, minTrust: 30 },
    metadata: { act: 2, scene: 2, importance: 'major' },
    choices: [
      { id: 'm-cmf1-c1', text: 'Tell me about the warning you tried to give.', tone: 'gentle', trustModifier: 10, stabilityModifier: -5, branches: ['mara-listening-1'] }
    ]
  },

  'mara-rest-1': {
    id: 'mara-rest-1',
    characterId: CharacterId.MARA,
    type: DialogueNodeType.COMFORT,
    text: '[BREATHING SLOWS] Rest. Yes. [EYES CLOSE] The static is tiring. Fighting the system\'s barriers drains something essential. But you... you make it easier. Like having an anchor in a storm. I\'ll rest. And when I wake, maybe the name will be closer to the surface.',
    variations: [
      '[SLUMPING SLIGHTLY] Rest sounds good. [MUTTERS] The pushing takes so much energy. The system pushes back. Always pushes back. But you... you don\'t push. You wait. That helps.',
      '[VISIBLY EXHAUSTED] Thank you. For recognizing the limit. [DROWSY] The truth isn\'t going anywhere. It\'s been trapped here as long as we have. A few more moments of peace won\'t hurt.'
    ],
    emotionalState: EmotionalState.COLLAPSE,
    conditions: { minStability: 35, minTrust: 35 },
    metadata: { act: 3, scene: 2, importance: 'moderate' },
    choices: []
  },

  'viktor-challenge-1': {
    id: 'viktor-challenge-1',
    characterId: CharacterId.VIKTOR,
    type: DialogueNodeType.ACCUSATION,
    text: 'Know something? [TIGHTENS] I know this elevator better than anyone. I know every sound, every glitch, every pattern of instability. I\'ve been maintaining its systems—or trying to—for longer than you can imagine. But knowing how something works doesn\'t mean knowing why. Or how to escape. Or what we did to deserve this.',
    variations: [
      'You want to challenge me? [DEFENSIVE] I know the mechanisms. I know the procedures. But this isn\'t a machine with an instruction manual. It\'s a prison made of memory. Knowing its structure doesn\'t give me the key.',
      'I know things. Technical things. Systematic things. But the important knowledge—the kind that might actually help—is locked behind walls I can\'t breach. Like everyone else here.'
    ],
    emotionalState: EmotionalState.ANGRY,
    conditions: { minStability: 30 },
    metadata: { act: 1, scene: 1, importance: 'moderate' },
    choices: [
      { id: 'v-chl1-c1', text: 'I\'m sorry. That was unfair. I\'m just scared.', tone: 'comforting', trustModifier: 15, stabilityModifier: 5, nextStateHint: EmotionalState.SUSPICIOUS, branches: ['viktor-apology-1'] }
    ]
  },

  'viktor-comfort-1': {
    id: 'viktor-comfort-1',
    characterId: CharacterId.VIKTOR,
    type: DialogueNodeType.COMFORT,
    text: '[PAUSES] You\'re... you\'re right. Forcing it isn\'t working. Hasn\'t worked for all these iterations. Maybe the answer isn\'t pushing harder. Maybe it\'s... letting go. Trusting that the memory will surface when it needs to. That\'s hard for someone who\'s built their life on control. But maybe that\'s exactly what I need to learn.',
    variations: [
      '[EXHALES SLOWLY] Perhaps you\'re right. The harder I grip, the more slips through. Maybe maintenance doesn\'t mean forcing everything into compliance. Maybe sometimes it means... patience. Observation. Allowing systems to stabilize themselves.',
      '[CALMING] Control isn\'t working. I\'ve tried every iteration to control this, to manage the memory, to fix the failure. Maybe the failure isn\'t something to fix. Maybe it\'s something to... accept.'
    ],
    emotionalState: EmotionalState.CALM,
    conditions: { minStability: 45, minTrust: 30 },
    metadata: { act: 1, scene: 2, importance: 'major' },
    choices: [
      { id: 'v-cmf1-c1', text: 'That sounds like the beginning of healing.', tone: 'gentle', trustModifier: 15, stabilityModifier: 10, branches: ['viktor-healing-1'] }
    ]
  },

  'viktor-healing-1': {
    id: 'viktor-healing-1',
    characterId: CharacterId.VIKTOR,
    type: DialogueNodeType.RESPONSE,
    text: 'Healing? [LONG PAUSE] I hadn\'t thought of this in terms of healing. I thought of it as punishment. Penance. Endless cycles of guilt for a failure that can\'t be undone. But healing... healing implies that something can be restored. That I can be restored. Is that possible? After what I did?',
    variations: [
      'Healing. [TESTS THE WORD] That\'s not a word I\'ve associated with this place. But maybe that\'s what the system is trying to do. Not punish us, but... repair us. However painful the repair might be.',
      'Restoration. [HOPEFUL BUT UNCERTAIN] Is that what\'s on offer? Not escape, but healing? Not forgiveness from outside, but... internal repair? I don\'t know if I deserve that. But maybe deserving isn\'t the point.'
    ],
    emotionalState: EmotionalState.CALM,
    conditions: { minStability: 50, minTrust: 35 },
    metadata: { act: 2, scene: 1, importance: 'critical' },
    choices: [
      { id: 'v-hea1-c1', text: 'Everyone deserves the chance to heal.', tone: 'gentle', trustModifier: 20, stabilityModifier: 15, branches: ['viktor-forgiven-1'] }
    ]
  },

  'livia-forgiveness-1': {
    id: 'livia-forgiveness-1',
    characterId: CharacterId.LIVIA,
    type: DialogueNodeType.COMFORT,
    text: '[BREATHING STABILIZES] Unfair... yes, it was unfair. But also... possibly accurate. I\'ve been avoiding that possibility. The possibility that I\'m responsible for the gaps in my own data. That I chose ignorance over painful knowledge. Thank you for the apology. And thank you for the uncomfortable question.',
    variations: [
      '[RECOVERING COMPOSURE] The accusation wasn\'t fair, but it might have been necessary. I\'ve been circling around that hypothesis without letting myself land on it. You forced me to look. That\'s... that\'s valuable, even when it hurts.',
      '[STEADYING] I accept your apology. And I acknowledge that your question, while painful, pointed toward a truth I\'ve been avoiding. The gaps in my archive may be self-inflicted. That\'s terrifying to consider. But it\'s also the first real lead I\'ve had.'
    ],
    emotionalState: EmotionalState.SUSPICIOUS,
    conditions: { minStability: 35, minTrust: 25 },
    metadata: { act: 1, scene: 2, importance: 'major' },
    choices: [
      { id: 'l-fgv1-c1', text: 'Can we investigate the gaps together?', tone: 'gentle', trustModifier: 15, stabilityModifier: 5, branches: ['livia-together-1'] }
    ]
  },

  'livia-truth-demand-1': {
    id: 'livia-truth-demand-1',
    characterId: CharacterId.LIVIA,
    type: DialogueNodeType.ACCUSATION,
    text: 'Better left forgotten? [VOICE SHARPENS] That\'s not for you to decide. I\'ve spent iterations trying to understand this system, and you want me to stop now? Because the truth might be uncomfortable? That\'s precisely why I need to find it. Truth isn\'t a comfort—it\'s a necessity. Without accurate data, there can be no resolution.',
    variations: [
      'Better forgotten? [ANGRY] That\'s the logic of suppression! That\'s why we\'re trapped in this loop—because someone decided the truth was too dangerous to remember. I reject that. I need to know. Whatever it costs.',
      'You\'re suggesting I abandon the search for truth because it might be painful? [TONE HARDENS] That\'s the exact reasoning that created these gaps in the first place. I won\'t participate in my own ignorance.'
    ],
    emotionalState: EmotionalState.ANGRY,
    conditions: { minStability: 30, minTrust: 15 },
    metadata: { act: 2, scene: 1, importance: 'major' },
    choices: [
      { id: 'l-td1-c1', text: 'You\'re right. I was wrong to suggest stopping.', tone: 'gentle', trustModifier: 15, stabilityModifier: 5, nextStateHint: EmotionalState.SUSPICIOUS, branches: ['livia-truth-continue-1'] }
    ]
  },

  'livia-truth-continue-1': {
    id: 'livia-truth-continue-1',
    characterId: CharacterId.LIVIA,
    type: DialogueNodeType.RESPONSE,
    text: '[COMPOSING HERSELF] I apologize for the sharpness. Your suggestion triggered... a defense mechanism. I\'ve been fighting against suppression for so long that any suggestion of avoiding truth feels like an attack. But I recognize that you were trying to protect me. That\'s... appreciated, even if I can\'t accept the protection.',
    variations: [
      '[TAKING A BREATH] I reacted defensively. This investigation is important to me—perhaps too important. I\'ve built my identity around the pursuit of truth. When someone suggests I stop, I feel like I\'m being asked to abandon myself.',
      '[CALMING] Forgive my reaction. The suggestion that truth should be avoided touches a nerve. I\'ve seen too much damage caused by ignorance to accept comfortable lies. But I understand you meant well.'
    ],
    emotionalState: EmotionalState.CALM,
    conditions: { minStability: 40, minTrust: 25 },
    metadata: { act: 2, scene: 2, importance: 'moderate' },
    choices: [
      { id: 'l-tc1-c1', text: 'Let\'s find the truth, then. Whatever it is.', tone: 'direct', trustModifier: 15, stabilityModifier: -5, branches: ['livia-facing-1'] }
    ]
  },

  'mara-resistance-1': {
    id: 'mara-resistance-1',
    characterId: CharacterId.MARA,
    type: DialogueNodeType.ACCUSATION,
    text: 'Calm down? CALM DOWN? [LAUGHS SHARPLY] I\'ve been calm. I\'ve been calm through every iteration, swallowing the things I see, pretending to be normal, pretending my perceptions are just anxiety. And where has calm gotten us? Someone is dead. We\'re trapped. And you want me to be CALM?',
    variations: [
      'Calm? [BITTER LAUGH] I\'ve spent lifetimes being calm. Being dismissed. Being told my intuitions are overreactions. And through all that calm, the pattern I saw came true. The bad thing happened. Calm is complicity.',
      'You want calm? [VOICE RISING] Calm is what they wanted before. "Don\'t worry, Mara." "You\'re overthinking, Mara." And then the equipment failed and someone died. Calm is what killed Alex. [NAME SLIPS OUT]'
    ],
    emotionalState: EmotionalState.ANGRY,
    conditions: { minStability: 25 },
    metadata: { act: 1, scene: 1, importance: 'critical', memoryFragment: 'mara-alex-slip' },
    choices: [
      { id: 'm-res1-c1', text: 'Who is Alex?', tone: 'direct', trustModifier: 10, stabilityModifier: -15, branches: ['mara-name-revelation-1'] }
    ]
  },

  'mara-breaking-1': {
    id: 'mara-breaking-1',
    characterId: CharacterId.MARA,
    type: DialogueNodeType.RESPONSE,
    text: 'If the walls break? [EYES WIDEN] Then the archive opens. Everything we\'ve hidden—every suppressed memory, every denied truth—floods into consciousness at once. It would be... overwhelming. Possibly destroying. But also... liberating. The truth would be free, even if we couldn\'t survive it.',
    variations: [
      'Breaking the walls means the end of containment. The end of suppression. All the truth, all at once. The system might collapse. We might collapse. But at least we\'d finally see what we\'ve been hiding from.',
      'The walls hold back the weight of everything we can\'t face. Break them, and it all comes through. Maybe that\'s what resolution looks like—not gentle processing, but catastrophic revelation. One way to find out.'
    ],
    emotionalState: EmotionalState.AFRAID,
    conditions: { minStability: 30, minTrust: 30 },
    metadata: { act: 2, scene: 1, importance: 'major' },
    choices: [
      { id: 'm-brk1-c1', text: 'Is there a gentler way to release the truth?', tone: 'gentle', trustModifier: 10, stabilityModifier: 0, branches: ['mara-guidance-1'] }
    ]
  },

  'viktor-denial-1': {
    id: 'viktor-denial-1',
    characterId: CharacterId.VIKTOR,
    type: DialogueNodeType.ACCUSATION,
    text: 'Not my fault? [VOICE HARDENS] You weren\'t there. You didn\'t see what happened. I was responsible for maintenance. Something wasn\'t maintained. Someone died. That\'s not an accident—that\'s a direct causal chain. Don\'t try to absolve me. I don\'t deserve it.',
    variations: [
      'Fault is not ambiguous here. I had a job. I failed at that job. The consequence was death. Calling it an accident is a way of avoiding responsibility. I won\'t participate in that avoidance.',
      'You think comfort helps? It doesn\'t. What helps is acknowledging the full weight of what I did. Or didn\'t do. Minimizing my responsibility doesn\'t make me feel better—it makes me feel like you don\'t understand the gravity of what happened.'
    ],
    emotionalState: EmotionalState.ANGRY,
    conditions: { minStability: 25, minTrust: 15 },
    metadata: { act: 2, scene: 2, importance: 'major' },
    choices: [
      { id: 'v-den1-c1', text: 'I\'m sorry. I didn\'t mean to minimize what happened.', tone: 'gentle', trustModifier: 10, stabilityModifier: 0, nextStateHint: EmotionalState.STRESSED, branches: ['viktor-responsibility-1'] }
    ]
  },

  'viktor-responsibility-1': {
    id: 'viktor-responsibility-1',
    characterId: CharacterId.VIKTOR,
    type: DialogueNodeType.RESPONSE,
    text: '[SIGHING] No, I apologize. You\'re trying to help. I shouldn\'t lash out. The truth is... I don\'t know how to hold this. The responsibility. Every iteration, I try to manage it differently. Sometimes I focus on the technical failure. Sometimes I focus on the human cost. It never gets lighter. Maybe it\'s not supposed to.',
    variations: [
      '[COMPOSING HIMSELF] Forgive my reaction. You offered comfort, and I attacked. That\'s not fair. The weight I carry is mine, not yours. I just... I don\'t know how to exist with it. Without it crushing me.',
      '[STEADYING] I reacted poorly. You were being kind. The problem isn\'t your words—it\'s that no words have ever made this bearable. I carry death. I don\'t know how to put it down.'
    ],
    emotionalState: EmotionalState.STRESSED,
    conditions: { minStability: 30, minTrust: 25 },
    metadata: { act: 2, scene: 3, importance: 'major' },
    choices: [
      { id: 'v-res1-c1', text: 'Maybe carrying it together makes it lighter.', tone: 'gentle', trustModifier: 15, stabilityModifier: 5, branches: ['viktor-solidarity-1'] }
    ]
  },

  'viktor-breakdown-1': {
    id: 'viktor-breakdown-1',
    characterId: CharacterId.VIKTOR,
    type: DialogueNodeType.COLLAPSE,
    text: '[BEGINS TO BREAK DOWN] I didn\'t... I checked everything. I thought I checked everything. But there was one connection. One joint. One stress point I missed. And Alex was standing right under it when it failed. I heard the sound. I heard the... [VOICE CRACKS COMPLETELY] ...I heard them scream. And I knew. I knew it was my fault.',
    variations: [
      '[COLLAPSING EMOTIONALLY] The failure was small. A single bolt. A routine inspection that I postponed. And Alex... Alex was in the wrong place because I didn\'t do my job. I can still hear the impact. The silence after. The silence that never really ended.',
      '[BREAKING DOWN] You want to know what haunts me? The sound. Metal giving way. A body falling. The moment of realization that my checklist was incomplete. That someone was dying because I decided to check something later instead of now.'
    ],
    emotionalState: EmotionalState.COLLAPSE,
    conditions: { minStability: 20, maxSuppressionIndex: 30 },
    metadata: { act: 3, scene: 3, importance: 'critical', memoryFragment: 'viktor-breakdown-core' },
    choices: [
      { id: 'v-brk1-c1', text: '[STAY WITH HIM IN SILENCE]', tone: 'comforting', trustModifier: 25, stabilityModifier: 5, branches: ['viktor-silence-1'] }
    ]
  },

  'viktor-silence-1': {
    id: 'viktor-silence-1',
    characterId: CharacterId.VIKTOR,
    type: DialogueNodeType.COMFORT,
    text: '[AFTER A LONG TIME] ...Thank you. For not trying to fix it. For not offering empty comfort. For just... being here. The silence helped. More than words ever have. I\'ve never let myself fall apart like that. Always maintaining control. Maybe... maybe that was part of the problem.',
    variations: [
      '[BREATHING SLOWLY] You stayed. That\'s... that\'s more than most do. Most people run from this kind of pain. Or try to talk over it. You just... witnessed. Let it exist. I didn\'t know how much I needed that.',
      '[GRADUALLY RECOMPOSING] I\'ve been holding that in for so many iterations. Trying to maintain. Trying to function. I didn\'t realize how much energy the suppression required. I feel... emptied. But in a way that might be good.'
    ],
    emotionalState: EmotionalState.CALM,
    conditions: { minStability: 30, minTrust: 45 },
    metadata: { act: 3, scene: 4, importance: 'critical' },
    choices: []
  },

  'livia-decision-1': {
    id: 'livia-decision-1',
    characterId: CharacterId.LIVIA,
    type: DialogueNodeType.REVELATION,
    text: 'The decision I was hiding... [VOICE BECOMES MECHANICAL, LIKE READING A REPORT] During the incident, I had time to analyze the developing failure. I calculated the probability of different outcomes. I had data that suggested the most dangerous course of action. And I... I didn\'t communicate it clearly enough. I hedged. I qualified. And by the time I was certain, it was too late.',
    variations: [
      'The hidden decision... [STRUGGLING] I saw the pattern. I analyzed the risk. I generated a warning. And then I... I softened it. Added uncertainty. Made it less urgent. Because I was afraid of being wrong. And because I softened it, no one acted in time.',
      'The decision... [ANALYTICAL DETACHMENT] I held critical information. The probability of failure was above my internal threshold for urgent action. But I didn\'t want to be alarmist. I didn\'t want to be wrong. So I presented the data with caveats. And the caveats gave them permission to ignore me.'
    ],
    emotionalState: EmotionalState.AFRAID,
    conditions: { minStability: 25, maxSuppressionIndex: 35 },
    metadata: { act: 3, scene: 2, importance: 'critical', memoryFragment: 'livia-decision-revelation' },
    choices: [
      { id: 'l-dec1-c1', text: 'That\'s a human mistake. Not a malicious one.', tone: 'comforting', trustModifier: 15, stabilityModifier: 5, branches: ['livia-human-1'] }
    ]
  },

  'livia-self-protection-1': {
    id: 'livia-self-protection-1',
    characterId: CharacterId.LIVIA,
    type: DialogueNodeType.RESPONSE,
    text: 'Protecting myself? [DEFENSIVE] I protect the integrity of the archive. I protect the accuracy of the data. I don\'t... [PAUSES] ...but I did, didn\'t I? I deleted the evidence of my own uncertainty. I removed the record of my hesitation. I made myself look more competent than I was. That\'s not protection of the system. That\'s... self-preservation.',
    variations: [
      'Self-protection... [REALIZATION DAWNING] I\'ve been telling myself the deletions were for archive integrity. But integrity would require truth. What I did was preserve my self-image. I erased my doubt to seem more certain than I was.',
      'The uncomfortable truth: I protected my ego. I made the data cleaner by removing my messiness. My hesitation. My fear. The archive isn\'t corrupted—it\'s censored. By me. To make me look better.'
    ],
    emotionalState: EmotionalState.AFRAID,
    conditions: { minStability: 30, minTrust: 25 },
    metadata: { act: 3, scene: 2, importance: 'critical' },
    choices: [
      { id: 'l-sp1-c1', text: 'Self-protection is human. The question is: can you forgive yourself?', tone: 'gentle', trustModifier: 15, stabilityModifier: 5, branches: ['livia-acceptance-1'] }
    ]
  },

  'livia-truth-healing-1': {
    id: 'livia-truth-healing-1',
    characterId: CharacterId.LIVIA,
    type: DialogueNodeType.RESPONSE,
    text: 'The truth might help... [CONSIDERS] My deletions have trapped us in a loop of partial knowledge. If I can restore the missing data—even just my portion of it—the complete picture might emerge. And a complete picture is something we can finally process. Instead of endlessly cycling through fragments.',
    variations: [
      'You\'re right. The suppression isn\'t protecting anyone—it\'s preventing resolution. If I access what I deleted, piece together the missing segments, we might finally understand what happened. And understanding is the first step toward... whatever comes next.',
      'Truth as healing. [PAUSES] The archive is broken because critical pieces were removed. I removed some of those pieces. If I can reverse the deletion—at least partially—we might be able to reconstruct the event. And then... then we can finally grieve properly.'
    ],
    emotionalState: EmotionalState.CALM,
    conditions: { minStability: 40, minTrust: 30 },
    metadata: { act: 3, scene: 2, importance: 'major' },
    choices: [
      { id: 'l-th1-c1', text: 'Let\'s access those deleted memories.', tone: 'direct', trustModifier: 10, stabilityModifier: -10, branches: ['livia-facing-1'] }
    ]
  },

  'viktor-project-1': {
    id: 'viktor-project-1',
    characterId: CharacterId.VIKTOR,
    type: DialogueNodeType.RESPONSE,
    text: 'What were we working on? [STRUGGLES] Something important. A system that required precision. Multiple components, multiple operators. I handled the hardware. Livia analyzed the data. Mara... sensed the patterns. And Alex operated the core. We were a team. A good team. Until we weren\'t.',
    variations: [
      'The project... it required four specialists. Four people trusting each other\'s expertise. I maintained the equipment. Livia processed the readings. Mara identified anomalies. And Alex made it work. Until my maintenance failed, and the work became a death trap.',
      'We worked together on something complex. Each of us had a role. Mine was maintenance—the physical systems that kept everything running. When I failed, the system failed. And Alex paid the price for all our failures.'
    ],
    emotionalState: EmotionalState.HALF_AWARE,
    conditions: { minStability: 30, maxSuppressionIndex: 40 },
    metadata: { act: 3, scene: 2, importance: 'critical', memoryFragment: 'project-context' },
    choices: [
      { id: 'v-prj1-c1', text: 'Alex was the fourth person. Tell me about them.', tone: 'gentle', trustModifier: 10, stabilityModifier: -5, branches: ['viktor-alex-1'] }
    ]
  }
};

/**
 * Get dialogue node by ID
 */
export function getDialogueNode(id: string): DialogueNode | undefined {
  return DIALOGUE_NODES[id];
}

/**
 * Get available dialogue nodes for a character
 */
export function getAvailableDialogue(
  characterId: CharacterId,
  stability: number,
  trust: number,
  suppressionIndex: number,
  visitedNodes: string[]
): DialogueNode[] {
  return Object.values(DIALOGUE_NODES).filter(node => {
    if (node.characterId !== characterId) return false;
    if (visitedNodes.includes(node.id)) return false;
    
    const conditions = node.conditions;
    if (conditions.minStability && stability < conditions.minStability) return false;
    if (conditions.maxStability && stability > conditions.maxStability) return false;
    if (conditions.minTrust && trust < conditions.minTrust) return false;
    if (conditions.maxTrust && trust > conditions.maxTrust) return false;
    if (conditions.maxSuppressionIndex && suppressionIndex > conditions.maxSuppressionIndex) return false;
    if (conditions.minSuppressionIndex && suppressionIndex < conditions.minSuppressionIndex) return false;
    
    return true;
  });
}

/**
 * Count total dialogue nodes
 */
export function countDialogueNodes(): number {
  return Object.keys(DIALOGUE_NODES).length;
}
