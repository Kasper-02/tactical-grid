import { useState, useEffect } from 'react';
import CanvasGrid from './components/CanvasGrid';
import HeroPanel from './components/HeroPanel';
import HeroStats from './components/HeroStats';
import { generateDungeon, type GameMap } from './utils/mapGenerator';
import type { Hero, HeroTemplate } from './types';
import './App.css';

const STORAGE_KEY = 'tactical-grid-state';

function App() {
  const [gameMap, setGameMap] = useState<GameMap | null>(null);
  const [heroes, setHeroes] = useState<Hero[]>([]);
  const [selectedHeroId, setSelectedHeroId] = useState<string | null>(null);
  const [draggedHero, setDraggedHero] = useState<HeroTemplate | null>(null);
  const [visibleCells, setVisibleCells] = useState<Set<string>>(new Set());
  const [turn, setTurn] = useState(1);

  // Загрузка из localStorage при старте
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setGameMap(data.gameMap);
        setHeroes(data.heroes || []);
        setVisibleCells(new Set(data.visibleCells || []));
        setTurn(data.turn || 1);
      } catch (e) {
        console.error('Ошибка загрузки:', e);
      }
    }
  }, []);

  // Сохранение в localStorage
  useEffect(() => {
    if (!gameMap) return;
    const data = {
      gameMap,
      heroes,
      visibleCells: Array.from(visibleCells),
      turn,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [gameMap, heroes, visibleCells, turn]);

  const handleGenerate = () => {
    const newMap = generateDungeon(20, 20, 6);
    setGameMap(newMap);
    setHeroes([]);
    setSelectedHeroId(null);
    setVisibleCells(new Set());
    setTurn(1);
  };

  const revealAround = (x: number, y: number, radius: number = 2) => {
    const newCells = new Set(visibleCells);
    for (let dy = -radius; dy <= radius; dy++) {
      for (let dx = -radius; dx <= radius; dx++) {
        const nx = x + dx;
        const ny = y + dy;
        if (nx >= 0 && ny >= 0 && nx < 20 && ny < 20) {
          newCells.add(`${nx},${ny}`);
        }
      }
    }
    setVisibleCells(newCells);
  };

  const handleDropHero = (x: number, y: number) => {
    if (!draggedHero || !gameMap) return;
    if (gameMap.grid[y][x] !== 1) return;

    const alreadyThere = heroes.some((h) => h.x === x && h.y === y);
    if (alreadyThere) return;

    const newHero: Hero = {
      id: `${Date.now()}-${Math.random()}`,
      name: draggedHero.name,
      type: draggedHero.type,
      x,
      y,
      color: draggedHero.color,
      hp: draggedHero.hp,
      maxHp: draggedHero.hp,
      attack: draggedHero.attack,
      defense: draggedHero.defense,
    };

    setHeroes([...heroes, newHero]);
    setDraggedHero(null);
    revealAround(x, y);
  };

  const handleSelectHero = (id: string) => {
    setSelectedHeroId(id);
  };

  const handleCellClick = (x: number, y: number) => {
    if (!selectedHeroId || !gameMap) return;

    const hero = heroes.find((h) => h.id === selectedHeroId);
    if (!hero) return;

    const dx = Math.abs(hero.x - x);
    const dy = Math.abs(hero.y - y);

    if (dx > 1 || dy > 1 || (dx === 0 && dy === 0)) return;
    if (gameMap.grid[y][x] !== 1) return;

    const alreadyThere = heroes.some((h) => h.x === x && h.y === y && h.id !== hero.id);
    if (alreadyThere) return;

    setHeroes(heroes.map((h) => (h.id === hero.id ? { ...h, x, y } : h)));
    revealAround(x, y);
  };

  const handleUpdateHero = (updated: Hero) => {
    setHeroes(heroes.map((h) => (h.id === updated.id ? updated : h)));
  };

  const handleDeleteHero = (id: string) => {
    setHeroes(heroes.filter((h) => h.id !== id));
    setSelectedHeroId(null);
  };

  const handleNextTurn = () => {
    setTurn((prev) => prev + 1);
  };

  const selectedHero = heroes.find((h) => h.id === selectedHeroId) || null;

  return (
    <div className="app">
      <aside className="sidebar-left">
        <h1 className="logo">Tactical Grid</h1>
        <nav className="tools">
          <button className="tool-btn" onClick={handleGenerate}>
            🗺️ Сгенерировать карту
          </button>
          <button className="tool-btn" onClick={handleNextTurn}>
            ⏭️ Конец хода (ход {turn})
          </button>
          <button className="tool-btn">👥 Игроки</button>
          <button className="tool-btn">⚙️ Настройки</button>
        </nav>
      </aside>

      <main className="canvas-area">
        <CanvasGrid
          gameMap={gameMap}
          heroes={heroes}
          selectedHeroId={selectedHeroId}
          visibleCells={visibleCells}
          onSelectHero={handleSelectHero}
          onCellClick={handleCellClick}
          onDropHero={handleDropHero}
        />
      </main>

      <aside className="sidebar-right">
        <h2 className="panel-title">Свойства</h2>
        <div className="panel-content">
          <HeroPanel onDragStart={setDraggedHero} />
          {selectedHero && (
            <HeroStats
              hero={selectedHero}
              onUpdate={handleUpdateHero}
              onDelete={handleDeleteHero}
            />
          )}
        </div>
      </aside>
    </div>
  );
}

export default App;