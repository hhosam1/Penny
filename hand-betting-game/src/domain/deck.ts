import type { Tile } from "../types/tile";
import { createDeck } from "./tiles";

export function shuffleDeck(deck: Tile[]): Tile[] {
  const copy = [...deck];

  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }

  return copy;
}

export function buildShuffledDeck(): Tile[] {
  return shuffleDeck(createDeck());
}

export function drawTiles(deck: Tile[], count: number): {
  drawn: Tile[];
  remaining: Tile[];
} {
  return {
    drawn: deck.slice(0, count),
    remaining: deck.slice(count),
  };
}