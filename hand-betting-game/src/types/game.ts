import type { Tile } from "./tile";

export type Phase = "landing" | "playing" | "gameOver";

export type BetChoice = "higher" | "lower";

export interface HistoryEntry {
  hand: Tile[];
  total: number;
  result: "win" | "loss" | "draw";
}

export interface GameState {
  phase: Phase;
  currentHand: Tile[];
  previousHand: Tile[] | null;
  history: HistoryEntry[];
  drawPile: Tile[];
  discardPile: Tile[];
  drawPileResets: number;
  score: number;
  gameOverReason?: string;
}