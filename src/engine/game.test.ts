import { describe, expect, it } from 'vitest';
import { cellAt, chooseStart, createGame, neighbors } from './game';
import { screenToWorld, zoomAt } from '../render/camera';
describe('map and starting ownership',()=>{
 it('creates repeatable terrain with all land initially unclaimed',()=>{const a=createGame(96,64,48172);expect(a).toEqual(createGame(96,64,48172));expect(a.cells).toHaveLength(6144);expect(a.cells.every(c=>c.ownerId===null)).toBe(true);expect(new Set(a.cells.map(c=>c.terrain)).size).toBe(4);expect(a.cells).not.toEqual(createGame(96,64,123).cells);});
 it('rejects water and invalid cells without changing phase',()=>{const g=createGame(20,20,1);expect(chooseStart(g,g.cells.find(c=>c.terrain==='water')!.id).ok).toBe(false);expect(chooseStart(g,-1).ok).toBe(false);expect(g.phase).toBe('choosing');});
 it('claims exactly one land cell and rejects a second start',()=>{const g=createGame(20,20,1);const land=g.cells.filter(c=>c.terrain!=='water');expect(chooseStart(g,land[0].id).ok).toBe(true);expect(g.selectedStart).toBe(land[0].id);expect(g.phase).toBe('started');expect(chooseStart(g,land[1].id).ok).toBe(false);expect(g.cells.filter(c=>c.ownerId===1)).toHaveLength(1);expect(createGame(20,20,1).phase).toBe('choosing');});
 it('hit tests fractional coordinates and rejects map edges',()=>{const g=createGame(3,3,1);expect(cellAt(g,1.5,2.9)?.id).toBe(7);expect(cellAt(g,-.01,1)).toBeUndefined();expect(cellAt(g,3,0)).toBeUndefined();expect(cellAt(g,NaN,0)).toBeUndefined();expect(neighbors(g,0).map(c=>c.id)).toEqual([1,3]);expect(neighbors(g,4)).toHaveLength(4);});
});
describe('camera',()=>{
 it('keeps the world point under the cursor fixed during zoom',()=>{const c={x:70,y:-20,zoom:1.3};const before=screenToWorld(c,200,150);zoomAt(c,200,150,2,.35,5);expect(screenToWorld(c,200,150).x).toBeCloseTo(before.x);expect(screenToWorld(c,200,150).y).toBeCloseTo(before.y);});
 it('clamps zoom and translates screen positions after panning',()=>{const c={x:0,y:0,zoom:1};zoomAt(c,0,0,100,.35,5);expect(c.zoom).toBe(5);zoomAt(c,0,0,.001,.35,5);expect(c.zoom).toBe(.35);c.x=35;c.y=70;expect(screenToWorld(c,35,70)).toEqual({x:0,y:0});});
});
