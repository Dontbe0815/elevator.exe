'use client';

import { useCallback } from 'react';
import { audioManager, FloorTheme } from '@/lib/audioManager';
import { FloorId } from '@/lib/gameData';

// Map floor IDs to audio themes
const floorToTheme: Record<FloorId, FloorTheme> = {
  ELEVATOR: 'elevator',
  F1: 'hospital',
  F3: 'apartment',
  F5: 'street',
  F7: 'ward',
  F9: 'office',
  F11: 'school',
  F13: 'core'
};

// Simple hook - audio manager handles its own state
export function useGameAudio() {
  const startAudio = useCallback(async () => {
    try {
      await audioManager.initialize();
      await audioManager.resume();
      audioManager.startAmbientDrone('elevator');
    } catch (e) {
      console.error('Failed to start audio:', e);
    }
  }, []);

  return {
    startAudio,
    playClick: () => audioManager.playClick(),
    playTransition: () => audioManager.playTransition(),
    playTypeKey: () => audioManager.playTypeKey(),
    playChoiceSelect: () => audioManager.playChoiceSelect(),
    setVolume: (v: number) => audioManager.setVolume(v),
    changeFloor: (floor: FloorId) => audioManager.changeFloor(floorToTheme[floor])
  };
}
