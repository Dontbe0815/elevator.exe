'use client';

import { GameProvider, useGame } from '@/lib/gameStore';
import { TitleScreen } from '@/components/TitleScreen';
import { GameScreen } from '@/components/GameScreen';

function Game() {
  const { state } = useGame();
  
  // Show title screen until game is started
  if (!state.game_started) {
    return <TitleScreen />;
  }
  
  return <GameScreen />;
}

export default function Home() {
  return (
    <GameProvider>
      <Game />
    </GameProvider>
  );
}
