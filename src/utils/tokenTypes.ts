export interface Token {
  id: string;
  name: string;
  x: number;
  y: number;
  color: string;
  icon?: string;
  isHero?: boolean; // true = герой, false = враг
}

export const createToken = (
  x: number,
  y: number,
  name: string,
  color: string,
  icon?: string,
  isHero: boolean = true
): Token => ({
  id: `token-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
  name,
  x,
  y,
  color,
  icon,
  isHero,
});

export const DEFAULT_TOKENS: Omit<Token, 'id'>[] = [
  { name: 'Герой', x: 2, y: 2, color: '#00d4ff', icon: '🧙', isHero: true },
  { name: 'Воин', x: 3, y: 2, color: '#ff6b6b', icon: '⚔️', isHero: true },
  { name: 'Лучник', x: 4, y: 2, color: '#4ecdc4', icon: '🏹', isHero: true },
  { name: 'Маг', x: 5, y: 2, color: '#a855f7', icon: '✨', isHero: true },
  { name: 'Монстр', x: 10, y: 10, color: '#ef4444', icon: '👹', isHero: false },
];