import type { Tile } from "../types/tile";

let id = 0;

const nextId = () => {
  id++;
  return `tile-${id}`;
};

export function createDeck(): Tile[] {
  const deck: Tile[] = [];

  // Number tiles 1-9
  for (let number = 1; number <= 9; number++) {
    for (let copy = 0; copy < 4; copy++) {
      deck.push({
        id: nextId(),
        type: "number",
        number,
        name: `${number}`,
        value: number,
        mutable: false,
      });
    }
  }

  const dragons = ["Red Dragon", "Green Dragon", "White Dragon"];

  dragons.forEach((dragon) => {
    for (let i = 0; i < 4; i++) {
      deck.push({
        id: nextId(),
        type: "dragon",
        name: dragon,
        value: 5,
        mutable: true,
      });
    }
  });

  const winds = [
    "East Wind",
    "South Wind",
    "West Wind",
    "North Wind",
  ];

  winds.forEach((wind) => {
    for (let i = 0; i < 4; i++) {
      deck.push({
        id: nextId(),
        type: "wind",
        name: wind,
        value: 5,
        mutable: true,
      });
    }
  });

  return deck;
}