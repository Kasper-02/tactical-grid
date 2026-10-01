export type CellType = 0 | 1;

export interface GameMap {
  width: number;
  height: number;
  grid: CellType[][];
}

export function generateDungeon(
  width: number = 20,
  height: number = 20,
  roomCount: number = 6
): GameMap {
  const grid: CellType[][] = Array.from({ length: height }, () =>
    Array(width).fill(0)
  );

  const rooms: { x: number; y: number; w: number; h: number }[] = [];

  let attempts = 0;
  while (rooms.length < roomCount && attempts < 200) {
    attempts++;
    const w = Math.floor(Math.random() * 4) + 3;
    const h = Math.floor(Math.random() * 4) + 3;
    const x = Math.floor(Math.random() * (width - w - 1)) + 1;
    const y = Math.floor(Math.random() * (height - h - 1)) + 1;

    const newRoom = { x, y, w, h };

    const overlaps = rooms.some(
      (r) =>
        x <= r.x + r.w &&
        x + w >= r.x &&
        y <= r.y + r.h &&
        y + h >= r.y
    );

    if (!overlaps) {
      rooms.push(newRoom);
      for (let ry = y; ry < y + h; ry++) {
        for (let rx = x; rx < x + w; rx++) {
          if (ry < height && rx < width) {
            grid[ry][rx] = 1;
          }
        }
      }
    }
  }

  for (let i = 1; i < rooms.length; i++) {
    const prev = rooms[i - 1];
    const curr = rooms[i];

    const prevCX = Math.floor(prev.x + prev.w / 2);
    const prevCY = Math.floor(prev.y + prev.h / 2);
    const currCX = Math.floor(curr.x + curr.w / 2);
    const currCY = Math.floor(curr.y + curr.h / 2);

    for (let x = Math.min(prevCX, currCX); x <= Math.max(prevCX, currCX); x++) {
      grid[prevCY][x] = 1;
    }
    for (let y = Math.min(prevCY, currCY); y <= Math.max(prevCY, currCY); y++) {
      grid[y][currCX] = 1;
    }
  }

  return { width, height, grid };
}