import type { Tile } from "../types/tile";

export function calculateHandTotal(hand: Tile[]): number {
  return hand.reduce((sum, tile) => sum + tile.value, 0);
}

export function adjustHandValues(hand: Tile[], delta: number): Tile[] {
  return hand.map((tile) => {
    if (!tile.mutable) return tile;

    const nextValue = Math.max(0, Math.min(10, tile.value + delta));

    return {
      ...tile,
      value: nextValue,
    };
  });
}

export function hasBoundaryTile(hand: Tile[]): boolean {
  return hand.some((tile) => tile.value === 0 || tile.value === 10);
}