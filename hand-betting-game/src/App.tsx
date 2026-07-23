import { useEffect, useMemo, useState } from "react";
import { useGame } from "./hooks/useGame";
import { TileCard } from "./components/TileCard";
import { EndScreen } from "./components/EndScreen";
import { getLeaderboard, saveScore } from "./storage/localLeaderboard";
import type { LeaderboardEntry } from "./types/leaderboard";

export default function App() {
  const [state, dispatch] = useGame();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(() =>
    getLeaderboard()
  );
  const [savedGameOverScore, setSavedGameOverScore] = useState<number | null>(
    null
  );

  useEffect(() => {
    if (state.phase === "gameOver" && savedGameOverScore !== state.score) {
      const next = saveScore("Player", state.score);
      setLeaderboard(next);
      setSavedGameOverScore(state.score);
    }

    if (state.phase !== "gameOver") {
      setSavedGameOverScore(null);
    }
  }, [state.phase, state.score, savedGameOverScore]);

  const currentTotal = useMemo(
    () => state.currentHand.reduce((sum, tile) => sum + tile.value, 0),
    [state.currentHand]
  );

  if (state.phase === "landing") {
    return (
      <main className="app-shell landing">
        <section className="hero-card">
          <p className="eyebrow">Mahjong Hand Betting Game</p>
          <h1>New Game</h1>
          <p className="muted">
            Bet higher or lower against the next hand. Non-number tiles grow or
            shrink as the game progresses.
          </p>

          <div style={{ marginTop: 24 }}>
            <h3>Leaderboard</h3>
            {leaderboard.length === 0 ? (
              <p className="muted">No scores yet.</p>
            ) : (
              <div className="leaderboard-list">
                {leaderboard.map((entry, index) => (
                  <div key={`${entry.name}-${entry.date}`} className="leaderboard-item">
                    <span>{index + 1}. {entry.name}</span>
                    <strong>{entry.score}</strong>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            className="primary-btn"
            onClick={() => dispatch({ type: "START_GAME" })}
            style={{ marginTop: 24 }}
          >
            Start Game
          </button>
        </section>
      </main>
    );
  }

  if (state.phase === "gameOver") {
    return (
      <EndScreen
        score={state.score}
        reason={state.gameOverReason}
        onRestart={() => dispatch({ type: "START_GAME" })}
        onExit={() => dispatch({ type: "EXIT_GAME" })}
      />
    );
  }

  return (
    <main className="app-shell game-layout">
      <header className="topbar">
        <div>
          <p className="eyebrow">Hand Betting Game</p>
          <h2>Score: {state.score}</h2>
        </div>

        <div className="topbar__actions">
          <button
            className="ghost-btn"
            onClick={() => dispatch({ type: "EXIT_GAME" })}
          >
            Exit
          </button>
        </div>
      </header>

      <section className="status-row">
        <div className="status-pill">Draw Pile: {state.drawPile.length}</div>
        <div className="status-pill">Discard Pile: {state.discardPile.length}</div>
        <div className="status-pill">History: {state.history.length}</div>
      </section>

      <section className="table-panel">
        <div className="panel-header">
          <h3>Current Hand</h3>
          <div className="hand-total">Total: {currentTotal}</div>
        </div>

        <div className="tile-row">
          {state.currentHand.map((tile) => (
            <TileCard key={tile.id} tile={tile} />
          ))}
        </div>

        <div className="action-row">
          <button
            className="bet-btn bet-btn--up"
            onClick={() => dispatch({ type: "BET_HIGHER" })}
          >
            Bet Higher
          </button>

          <button
            className="bet-btn bet-btn--down"
            onClick={() => dispatch({ type: "BET_LOWER" })}
          >
            Bet Lower
          </button>
        </div>
      </section>

      <aside className="history-panel">
        <h3>History</h3>

        <div className="history-list">
          {state.history.length === 0 ? (
            <p className="muted">No previous hands yet.</p>
          ) : (
            state.history.map((entry, index) => (
              <div key={`${entry.total}-${index}`} className="history-item">
                <div className={`history-badge history-badge--${entry.result}`}>
                  {entry.result}
                </div>
                <div className="history-total">Total: {entry.total}</div>
                <div className="history-tiles">
                  {entry.hand.map((tile) => (
                    <TileCard key={tile.id} tile={tile} compact />
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </aside>
    </main>
  );
}