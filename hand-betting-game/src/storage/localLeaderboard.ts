import type { LeaderboardEntry } from "../types/leaderboard";

const KEY = "hand-betting-game-leaderboard";

export function getLeaderboard(): LeaderboardEntry[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw) as LeaderboardEntry[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveScore(name: string, score: number): LeaderboardEntry[] {
  if (typeof window === "undefined") return [];

  const current = getLeaderboard();
  const next: LeaderboardEntry[] = [
    ...current,
    {
      name,
      score,
      date: new Date().toISOString(),
    },
  ]
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  window.localStorage.setItem(KEY, JSON.stringify(next));
  return next;
}