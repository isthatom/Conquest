export type Terrain = 'water' | 'plains' | 'forest' | 'mountain';
export interface Cell { id: number; x: number; y: number; terrain: Terrain; ownerId: number | null }
export interface Empire { id: number; name: string; color: string }
export interface GameState { seed: number; width: number; height: number; cells: Cell[]; empires: Empire[]; phase: 'choosing' | 'started'; selectedStart: number | null }

export function createGame(width: number, height: number, seed: number): GameState {
  if (!Number.isInteger(width) || !Number.isInteger(height) || width < 1 || height < 1) throw new Error('Invalid map dimensions');
  let value = seed >>> 0;
  const random = () => { value = (Math.imul(value, 1664525) + 1013904223) >>> 0; return value / 4294967296; };
  const cells: Cell[] = [];
  for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
    const nx = x / width, ny = y / height;
    const coast = Math.sin(nx * 16 + Math.sin(ny * 8) * 2) * 0.16 + Math.cos(ny * 13 - nx * 5) * 0.13;
    const edge = Math.min(nx, ny, 1 - nx, 1 - ny);
    const water = edge < 0.055 + coast * 0.3 || (Math.sin(nx * 13 + ny * 5) + Math.cos(ny * 17 - nx * 4) > 1.35);
    const r = random();
    cells.push({ id: y * width + x, x, y, terrain: water ? 'water' : r < 0.08 ? 'mountain' : r < 0.35 ? 'forest' : 'plains', ownerId: null });
  }
  return { seed, width, height, cells, empires: [{ id: 1, name: 'Your empire', color: '#edc878' }], phase: 'choosing', selectedStart: null };
}
export function cellAt(state: GameState, x: number, y: number): Cell | undefined {
  if (!Number.isFinite(x) || !Number.isFinite(y) || x < 0 || y < 0 || x >= state.width || y >= state.height) return undefined;
  return state.cells[Math.floor(y) * state.width + Math.floor(x)];
}
export function neighbors(state: GameState, id: number): Cell[] {
  const cell = state.cells[id];
  if (!cell) return [];
  return [[cell.x-1,cell.y],[cell.x+1,cell.y],[cell.x,cell.y-1],[cell.x,cell.y+1]].flatMap(([x,y]) => { const c = cellAt(state,x,y); return c ? [c] : []; });
}
export function chooseStart(state: GameState, id: number): { ok: boolean; message: string } {
  const cell = state.cells[id];
  if (state.phase !== 'choosing') return { ok: false, message: 'Reset the map to choose a new starting territory.' };
  if (!cell || cell.terrain === 'water' || cell.ownerId !== null) return { ok: false, message: 'Choose an unclaimed land territory.' };
  cell.ownerId = 1; state.selectedStart = id; state.phase = 'started';
  return { ok: true, message: 'Empire founded. Expansion arrives in Milestone 2.' };
}
