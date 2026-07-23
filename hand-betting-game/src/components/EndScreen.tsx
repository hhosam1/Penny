type Props = {
  score: number;
  reason?: string;
  onRestart: () => void;
  onExit: () => void;
};

export function EndScreen({ score, reason, onRestart, onExit }: Props) {
  return (
    <main className="app-shell landing">
      <section className="hero-card">
        <p className="eyebrow">Game Over</p>
        <h1>Final Score: {score}</h1>
        <p className="muted">{reason ?? "The round has ended."}</p>

        <div className="action-row">
          <button className="primary-btn" onClick={onRestart}>
            Play Again
          </button>
          <button className="ghost-btn" onClick={onExit}>
            Return Home
          </button>
        </div>
      </section>
    </main>
  );
}