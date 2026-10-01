import { useEffect, useRef, useState } from 'react';
import type { GameMap } from '../utils/mapGenerator';
import type { Hero } from '../types';

interface CanvasGridProps {
  cellSize?: number;
  gameMap: GameMap | null;
  heroes: Hero[];
  selectedHeroId: string | null;
  visibleCells: Set<string>;
  onSelectHero: (id: string) => void;
  onCellClick: (x: number, y: number) => void;
  onDropHero: (x: number, y: number) => void;
}

function CanvasGrid({
  cellSize = 64,
  gameMap,
  heroes,
  selectedHeroId,
  visibleCells,
  onSelectHero,
  onCellClick,
  onDropHero,
}: CanvasGridProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    ctx.fillStyle = '#0a0e1a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.translate(offset.x, offset.y);
    ctx.scale(zoom, zoom);

    const gridWidth = gameMap?.width ?? 20;
    const gridHeight = gameMap?.height ?? 20;

    // Пол
    if (gameMap) {
      for (let y = 0; y < gameMap.height; y++) {
        for (let x = 0; x < gameMap.width; x++) {
          if (gameMap.grid[y][x] === 1) {
            ctx.fillStyle = '#2a3a4a';
            ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
          }
        }
      }
    }

    // Сетка
    ctx.strokeStyle = '#1e2a3a';
    ctx.lineWidth = 1 / zoom;

    for (let x = 0; x <= gridWidth; x++) {
      ctx.beginPath();
      ctx.moveTo(x * cellSize, 0);
      ctx.lineTo(x * cellSize, gridHeight * cellSize);
      ctx.stroke();
    }
    for (let y = 0; y <= gridHeight; y++) {
      ctx.beginPath();
      ctx.moveTo(0, y * cellSize);
      ctx.lineTo(gridWidth * cellSize, y * cellSize);
      ctx.stroke();
    }

    // ТУМАН ВОЙНЫ
    ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
    for (let y = 0; y < gridHeight; y++) {
      for (let x = 0; x < gridWidth; x++) {
        const key = `${x},${y}`;
        if (!visibleCells.has(key)) {
          ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
        }
      }
    }

    ctx.restore();
  }, [gameMap, heroes, offset, zoom, cellSize, visibleCells]);

  const screenToCell = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const x = (clientX - rect.left - offset.x) / zoom;
    const y = (clientY - rect.top - offset.y) / zoom;
    return {
      x: Math.floor(x / cellSize),
      y: Math.floor(y / cellSize),
    };
  };

  const handleClick = (e: React.MouseEvent) => {
    const cell = screenToCell(e.clientX, e.clientY);
    if (!cell) return;

    const heroHere = heroes.find((h) => h.x === cell.x && h.y === cell.y);
    if (heroHere) {
      onSelectHero(heroHere.id);
    } else {
      onCellClick(cell.x, cell.y);
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setZoom((prev) => Math.min(Math.max(prev * delta, 0.3), 3));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 1 || e.button === 0) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setOffset({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const cell = screenToCell(e.clientX, e.clientY);
    if (cell) onDropHero(cell.x, cell.y);
  };

  return (
    <div
      className="canvas-wrapper"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <canvas
        ref={canvasRef}
        className="canvas-grid"
        onClick={handleClick}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />
      <div className="tokens-layer">
        {heroes.map((hero) => {
          const key = `${hero.x},${hero.y}`;
          if (!visibleCells.has(key)) return null;

          return (
            <div
              key={hero.id}
              className={`token ${selectedHeroId === hero.id ? 'selected' : ''}`}
              style={{
                left: hero.x * cellSize * zoom + offset.x + (cellSize * zoom) / 2,
                top: hero.y * cellSize * zoom + offset.y + (cellSize * zoom) / 2,
                background: hero.color,
                width: 40 * zoom,
                height: 40 * zoom,
                fontSize: 16 * zoom,
              }}
              onClick={() => onSelectHero(hero.id)}
            >
              {hero.name.charAt(0)}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default CanvasGrid;