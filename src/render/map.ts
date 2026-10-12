import type { GameState } from '../engine/game';
import type { Camera } from './camera';
export function renderMap(ctx: CanvasRenderingContext2D, state: GameState, camera: Camera, size: number, hovered: number | null, viewport: {width:number;height:number}, dpr: number) {
  ctx.setTransform(dpr,0,0,dpr,0,0); ctx.fillStyle='#102c3a'; ctx.fillRect(0,0,viewport.width,viewport.height);
  ctx.translate(camera.x,camera.y); ctx.scale(camera.zoom,camera.zoom);
  const colors = {water:'#143847', plains:'#526f54', forest:'#334f43', mountain:'#738078'};
  for (const cell of state.cells) {
    const x=cell.x*size,y=cell.y*size;
    if (x*camera.zoom+camera.x > viewport.width || y*camera.zoom+camera.y > viewport.height || (x+size)*camera.zoom+camera.x < 0 || (y+size)*camera.zoom+camera.y < 0) continue;
    ctx.fillStyle = cell.ownerId === null ? colors[cell.terrain] : state.empires.find(e=>e.id===cell.ownerId)?.color ?? '#edc878';
    ctx.fillRect(x,y,size+0.3,size+0.3);
    if(cell.terrain==='forest') { ctx.fillStyle='#203d3244'; ctx.fillRect(x+5,y+4,5,8); }
    if(cell.terrain==='mountain') { ctx.fillStyle='#aab7a055'; ctx.beginPath(); ctx.moveTo(x+3,y+12); ctx.lineTo(x+8,y+3); ctx.lineTo(x+13,y+12); ctx.fill(); }
    if(cell.terrain==='water') continue;
    ctx.strokeStyle=cell.ownerId===null ? '#9db49745':'#ffe5a7'; ctx.lineWidth=cell.ownerId===null ? 0.7 : 2/camera.zoom;
    const different = (nx:number,ny:number) => nx<0||ny<0||nx>=state.width||ny>=state.height||state.cells[ny*state.width+nx].terrain==='water'||state.cells[ny*state.width+nx].ownerId!==cell.ownerId;
    ctx.beginPath();
    if(different(cell.x,cell.y-1)){ctx.moveTo(x,y);ctx.lineTo(x+size,y);}
    if(different(cell.x+1,cell.y)){ctx.moveTo(x+size,y);ctx.lineTo(x+size,y+size);}
    if(different(cell.x,cell.y+1)){ctx.moveTo(x,y+size);ctx.lineTo(x+size,y+size);}
    if(different(cell.x-1,cell.y)){ctx.moveTo(x,y);ctx.lineTo(x,y+size);}
    ctx.stroke();
  }
  const highlighted=hovered===null ? undefined : state.cells[hovered];
  if(highlighted){ctx.strokeStyle='#ffffff';ctx.lineWidth=1.5/camera.zoom;ctx.strokeRect(highlighted.x*size,highlighted.y*size,size,size);}
  const capital=state.selectedStart===null ? undefined : state.cells[state.selectedStart];
  if(capital){ const x=(capital.x+0.5)*size,y=(capital.y+0.5)*size;ctx.fillStyle='#162e30';ctx.beginPath();ctx.arc(x,y,4,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#ffe4a4';ctx.lineWidth=2/camera.zoom;ctx.beginPath();ctx.arc(x,y,10,0,Math.PI*2);ctx.stroke(); }
}
