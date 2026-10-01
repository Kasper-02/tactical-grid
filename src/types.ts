export interface Hero {
  id: string;
  name: string;
  type: 'warrior' | 'archer' | 'mage' | 'monster';
  x: number;
  y: number;
  color: string;
  hp: number;
  maxHp: number;
  attack: number;
  defense: number;
}

export interface HeroTemplate {
  type: Hero['type'];
  name: string;
  color: string;
  hp: number;
  attack: number;
  defense: number;
}