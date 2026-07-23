import type { GameState, BetChoice, HistoryEntry } from "../types/game";
import type { Tile } from "../types/tile";
import { createDeck } from "../domain/tiles";
import { buildShuffledDeck, drawTiles, shuffleDeck } from "./deck";
import {
  adjustHandValues,
  calculateHandTotal,
  hasBoundaryTile,
} from "./hand";

type GameAction =
  | { type: "START_GAME" }
  | { type: "BET_HIGHER" }
  | { type: "BET_LOWER" }
  | { type: "EXIT_GAME" }
  | { type: "RESTART_GAME" };

const HAND_SIZE = 5;

function createInitialState(): GameState {
  return {
    phase: "landing",
    currentHand: [],
    previousHand: null,
    history: [],
    drawPile: [],
    discardPile: [],
    drawPileResets: 0,
    score: 0,
    gameOverReason: undefined,
  };
}

function dealHand(drawPile: Tile[]): {
  drawn: Tile[];
  remaining: Tile[];
} {
  return drawTiles(drawPile, HAND_SIZE);
}

function compareHands(
  choice: BetChoice,
  prevTotal: number,
  nextTotal: number
): "win" | "loss" | "draw" {
  if (nextTotal === prevTotal) return "draw";
  if (choice === "higher") return nextTotal > prevTotal ? "win" : "loss";
  return nextTotal < prevTotal ? "win" : "loss";
}

function replenishDrawPile(state: GameState): {
  drawPile: Tile[];
  discardPile: Tile[];
  drawPileResets: number;
  gameOver: boolean;
} {
  const nextResetCount = state.drawPileResets + 1;

  if (nextResetCount >= 3) {
    return {
      drawPile: [],
      discardPile: state.discardPile,
      drawPileResets: nextResetCount,
      gameOver: true,
    };
  }

  const freshDeck = createDeck();
  const combined = [...freshDeck, ...state.discardPile, ...state.drawPile];
  const shuffled = shuffleDeck(combined);

  return {
    drawPile: shuffled,
    discardPile: [],
    drawPileResets: nextResetCount,
    gameOver: false,
  };
}

export function gameReducer(
  state: GameState = createInitialState(),
  action: GameAction
): GameState {
  switch (action.type) {
    case "START_GAME": {
      const shuffled = buildShuffledDeck();
      const { drawn, remaining } = dealHand(shuffled);

      return {
        ...state,
        phase: "playing",
        currentHand: drawn,
        previousHand: null,
        history: [],
        drawPile: remaining,
        discardPile: [],
        drawPileResets: 0,
        score: 0,
        gameOverReason: undefined,
      };
    }

    case "BET_HIGHER":
    case "BET_LOWER": {
      if (state.phase !== "playing") return state;
      if (state.currentHand.length === 0) return state;

      let workingState = state;

      if (workingState.drawPile.length < HAND_SIZE) {
        const refill = replenishDrawPile(workingState);

        if (refill.gameOver) {
          return {
            ...workingState,
            phase: "gameOver",
            drawPileResets: refill.drawPileResets,
            gameOverReason: "The draw pile ran out for the 3rd time.",
          };
        }

        workingState = {
          ...workingState,
          drawPile: refill.drawPile,
          discardPile: refill.discardPile,
          drawPileResets: refill.drawPileResets,
        };
      }

      const { drawn: nextHand, remaining } = dealHand(workingState.drawPile);

      const prevHand = workingState.currentHand;
      const prevTotal = calculateHandTotal(prevHand);
      const nextTotal = calculateHandTotal(nextHand);

      const choice: BetChoice =
        action.type === "BET_HIGHER" ? "higher" : "lower";

      const result = compareHands(choice, prevTotal, nextTotal);

      let adjustedPrevHand = prevHand;
      let score = workingState.score;

      if (result === "win") {
        adjustedPrevHand = adjustHandValues(prevHand, 1);
        score += 1;
      } else if (result === "loss") {
        adjustedPrevHand = adjustHandValues(prevHand, -1);
      }

      const updatedHistoryEntry: HistoryEntry = {
        hand: adjustedPrevHand,
        total: calculateHandTotal(adjustedPrevHand),
        result,
      };

      const updatedDiscardPile = [
        ...workingState.discardPile,
        adjustedPrevHand,
      ].flat();

      if (hasBoundaryTile(adjustedPrevHand)) {
        return {
          ...workingState,
          phase: "gameOver",
          previousHand: prevHand,
          currentHand: nextHand,
          drawPile: remaining,
          discardPile: updatedDiscardPile,
          history: [updatedHistoryEntry, ...workingState.history],
          score,
          gameOverReason: "A tile reached 0 or 10.",
        };
      }

      return {
        ...workingState,
        previousHand: prevHand,
        currentHand: nextHand,
        drawPile: remaining,
        discardPile: updatedDiscardPile,
        history: [updatedHistoryEntry, ...workingState.history],
        score,
      };
    }

    case "EXIT_GAME":
    case "RESTART_GAME":
      return createInitialState();

    default:
      return state;
  }
}