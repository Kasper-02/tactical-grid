import type { HeroTemplate } from '../types';

const HERO_TEMPLATES: HeroTemplate[] = [
  { type: 'warrior', name: 'Мечник', color: '#3498db', hp: 100, attack: 15, defense: 10 },
  { type: 'archer',  name: 'Лучник', color: '#2ecc71', hp: 70,  attack: 20, defense: 5  },
  { type: 'mage',    name: 'Маг',    color: '#9b59b6', hp: 60,  attack: 25, defense: 3  },
  { type: 'monster', name: 'Монстр', color: '#e74c3c', hp: 120, attack: 18, defense: 12 },
];

interface HeroPanelProps {
  onDragStart: (hero: HeroTemplate) => void;
}

function HeroPanel({ onDragStart }: HeroPanelProps) {
  return (
    <div className="hero-panel">
      <h3 className="panel-subtitle">Герои</h3>
      <div className="hero-list">
        {HERO_TEMPLATES.map((hero) => (
          <div
            key={hero.type}
            className="hero-item"
            draggable
            onDragStart={() => onDragStart(hero)}
            style={{ borderColor: hero.color }}
          >
            <div className="hero-color" style={{ background: hero.color }} />
            <span>{hero.name}</span>
          </div>
        ))}
      </div>
      <p className="hero-hint">Перетащи героя на карту</p>
    </div>
  );
}

export default HeroPanel;