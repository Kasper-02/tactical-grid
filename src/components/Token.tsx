import type { Hero } from '../types';

interface TokenProps {
  hero: Hero;
  cellSize: number;
  isSelected: boolean;
  onClick: () => void;
}

function Token({ hero, cellSize, isSelected, onClick }: TokenProps) {
  return (
    <div
      className={`token ${isSelected ? 'selected' : ''}`}
      style={{
        left: hero.x * cellSize + cellSize / 2,
        top: hero.y * cellSize + cellSize / 2,
        background: hero.color,
      }}
      onClick={onClick}
    >
      {hero.name.charAt(0)}
    </div>
  );
}

export default Token;