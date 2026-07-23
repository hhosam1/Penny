import type { Tile } from "../types/tile";

type Props = {
  tile: Tile;
  compact?: boolean;
};

export function TileCard({ tile, compact = false }: Props) {
  const className = [
    "tile-card",
    `tile-card--${tile.type}`,
    compact ? "tile-card--compact" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={className}>
      <div className="tile-card__top">
        <span className="tile-card__suit">{tile.type}</span>
        <span className="tile-card__chip">{tile.mutable ? "★" : "•"}</span>
      </div>

      <div className="tile-card__name">{tile.name}</div>
      <div className="tile-card__value">{tile.value}</div>
    </div>
  );
}