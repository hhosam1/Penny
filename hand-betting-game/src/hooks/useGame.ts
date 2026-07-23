import { useReducer } from "react";
import { gameReducer } from "../domain/gameReducer";
import type { GameState } from "../types/game";

const initialState: GameState = {
  phase: "landing",
  currentHand: [],
  previousHand: null,
  history: [],
  drawPile: [],
  discardPile: [],
  drawPileResets: 0,
  score: 0,
};

export function useGame() {
  return useReducer(gameReducer, initialState);
}