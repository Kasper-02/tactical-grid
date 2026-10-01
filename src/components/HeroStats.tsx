import { useState, useEffect } from 'react';
import type { Hero } from '../types';

interface HeroStatsProps {
  hero: Hero;
  onUpdate: (hero: Hero) => void;
  onDelete: (id: string) => void;
}

function HeroStats({ hero, onUpdate, onDelete }: HeroStatsProps) {
  const [name, setName] = useState(hero.name);
  const [hp, setHp] = useState(hero.hp);
  const [attack, setAttack] = useState(hero.attack);
  const [defense, setDefense] = useState(hero.defense);

  useEffect(() => {
    setName(hero.name);
    setHp(hero.hp);
    setAttack(hero.attack);
    setDefense(hero.defense);
  }, [hero.id]);

  const handleApply = () => {
    onUpdate({
      ...hero,
      name,
      hp: Math.min(hp, hero.maxHp),
      attack,
      defense,
    });
  };

  return (
    <div className="hero-stats">
      <h3 className="panel-subtitle">Свойства героя</h3>

      <div className="stat-field">
        <label>Имя</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={handleApply}
        />
      </div>

      <div className="stat-field">
        <label>HP ({hp} / {hero.maxHp})</label>
        <input
          type="range"
          min="0"
          max={hero.maxHp}
          value={hp}
          onChange={(e) => setHp(Number(e.target.value))}
          onMouseUp={handleApply}
        />
      </div>

      <div className="stat-field">
        <label>Атака</label>
        <input
          type="number"
          value={attack}
          onChange={(e) => setAttack(Number(e.target.value))}
          onBlur={handleApply}
        />
      </div>

      <div className="stat-field">
        <label>Защита</label>
        <input
          type="number"
          value={defense}
          onChange={(e) => setDefense(Number(e.target.value))}
          onBlur={handleApply}
        />
      </div>

      <button className="delete-btn" onClick={() => onDelete(hero.id)}>
        🗑️ Удалить героя
      </button>
    </div>
  );
}

export default HeroStats;