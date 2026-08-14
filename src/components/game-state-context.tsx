import { createContext, PropsWithChildren, useContext } from "react";
import { GameState } from "../app-state/game-state";

const GameStateContext = createContext<GameState | null>(null);

export function GameStateProvider({
  children,
  value,
}: PropsWithChildren<{ value: GameState }>) {
  return (
    <GameStateContext.Provider value={value}>
      {children}
    </GameStateContext.Provider>
  );
}

export function useGameState() {
  const gameState = useContext(GameStateContext);

  if (!gameState) {
    throw new Error("useGameState must be used within a GameStateProvider");
  }

  return gameState;
}