export type TileType = "number" | "wind" | "dragon";

export interface Tile {
  id: string;
  type: TileType;

  // Only used for number tiles (1-9)
  number?: number;

  // Display name
  name: string;

  // Current game value
  value: number;

  // Can this tile's value change?
  mutable: boolean;
}