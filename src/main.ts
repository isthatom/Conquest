import './style.css';
import config from './config/map.json';
import { cellAt, chooseStart, createGame } from './engine/game';
import { screenToWorld, zoomAt, type Camera } from './render/camera';
import { renderMap } from './render/map';

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
<header><div class="brand"><span class="crest">E</span><div>EMPIRE<span>FRONT</span><small>THE AGE OF NEW EMPIRES</small></div></div><div class="stage"><i></i> MAP PROTOTYPE <span>01 / 07</span></div><button id="reset">New expedition ↗</button></header>
<main><canvas id="map" tabindex="0" aria-label="Empire map. Use arrow keys to move selection, Enter to found your empire, plus and minus to zoom."></canvas>
<section class="intro"><div class="eyebrow">A WORLD WAITING TO BE CLAIMED</div><h1>Every empire<br>starts somewhere.</h1><p id="status" role="status">Choose a land territory to found your empire.</p><div class="tip">Click land to settle <span>•</span> Drag to explore <span>•</span> Scroll to zoom</div></section>
<aside id="territory"><div class="eyebrow">TERRITORY INTELLIGENCE</div><h2 id="terrain">Uncharted territory</h2><p id="detail">Explore the map to inspect the terrain.</p><button id="settle" disabled>Found empire here →</button></aside>
<div class="legend"><span><i class="land"></i> Unclaimed land</span><span><i class="own"></i> Your empire</span><span><i class="sea"></i> Open water</span></div>
<nav class="camera" aria-label="Map camera"><button id="plus" aria-label="Zoom in">+</button><output id="zoom">100%</output><button id="minus" aria-label="Zoom out">−</button><button id="fit">Fit map</button></nav>
</main><footer><span>EMPIREFRONT <b> / </b> EXPEDITION ${config.seed}</span><span>96 × 64 territories <b> / </b> Original procedural world</span><span>Single-player prototype</span></footer>`;
let state = createGame(config.width,config.height,config.seed);
const canvas=document.querySelector<HTMLCanvasElement>('#map')!;
const ctx=canvas.getContext('2d')!;
const camera:Camera={x:0,y:0,zoom:1};
let hovered:number|null=null, viewport={width:0,height:0}, dpr=1;
const status=document.querySelector<HTMLElement>('#status')!;
const settle=document.querySelector<HTMLButtonElement>('#settle')!;
function draw(){ renderMap(ctx,state,camera,config.cellSize,hovered,viewport,dpr); document.querySelector('#zoom')!.textContent=`${Math.round(camera.zoom*100)}%`; }
function fitScale(){return Math.min(viewport.width/(state.width*config.cellSize),viewport.height/(state.height*config.cellSize))*0.91;}
function fit(){ camera.zoom=fitScale();camera.x=(viewport.width-state.width*config.cellSize*camera.zoom)/2;camera.y=(viewport.height-state.height*config.cellSize*camera.zoom)/2;draw(); }
function resize(){viewport={width:canvas.clientWidth,height:canvas.clientHeight};dpr=window.devicePixelRatio||1;canvas.width=Math.round(viewport.width*dpr);canvas.height=Math.round(viewport.height*dpr);fit();}
function inspect(){ const cell=hovered===null?undefined:state.cells[hovered]; document.querySelector('#terrain')!.textContent=cell ? `${cell.terrain[0].toUpperCase()+cell.terrain.slice(1)} · ${cell.x}, ${cell.y}`:'Uncharted territory'; document.querySelector('#detail')!.textContent=cell ? `${cell.ownerId===null?'Unclaimed':'Your empire'} · ${cell.terrain==='water'?'Cannot settle on water':'Land territory'}`:'Explore the map to inspect the terrain.';settle.disabled=!cell||cell.terrain==='water'||cell.ownerId!==null||state.phase!=='choosing';draw(); }
function found(){if(hovered===null)return;const result=chooseStart(state,hovered);status.textContent=result.message;if(result.ok)document.querySelector('h1')!.innerHTML='An empire<br>takes root.';inspect();}
function point(event:PointerEvent|WheelEvent){const rect=canvas.getBoundingClientRect();return {x:event.clientX-rect.left,y:event.clientY-rect.top};}
let drag:{id:number;x:number;y:number;startX:number;startY:number;moved:boolean}|null=null;
canvas.addEventListener('pointerdown',e=>{if(e.button!==0)return;const p=point(e);drag={id:e.pointerId,x:p.x,y:p.y,startX:p.x,startY:p.y,moved:false};canvas.setPointerCapture(e.pointerId);canvas.focus();});
canvas.addEventListener('pointermove',e=>{const p=point(e);if(drag&&drag.id===e.pointerId){if(Math.hypot(p.x-drag.startX,p.y-drag.startY)>5)drag.moved=true;if(drag.moved){camera.x+=p.x-drag.x;camera.y+=p.y-drag.y;}drag.x=p.x;drag.y=p.y;}const w=screenToWorld(camera,p.x,p.y);hovered=cellAt(state,w.x/config.cellSize,w.y/config.cellSize)?.id??null;inspect();});
canvas.addEventListener('pointerup',e=>{if(!drag||drag.id!==e.pointerId)return;const click=!drag.moved;drag=null;canvas.releasePointerCapture(e.pointerId);if(click){const p=point(e),w=screenToWorld(camera,p.x,p.y);hovered=cellAt(state,w.x/config.cellSize,w.y/config.cellSize)?.id??null;found();}});
canvas.addEventListener('pointercancel',()=>{drag=null;});
canvas.addEventListener('wheel',e=>{e.preventDefault();const p=point(e);zoomAt(camera,p.x,p.y,Math.exp(-e.deltaY*0.001),Math.min(config.minZoom,fitScale()),config.maxZoom);draw();},{passive:false});
function zoom(factor:number){zoomAt(camera,viewport.width/2,viewport.height/2,factor,Math.min(config.minZoom,fitScale()),config.maxZoom);draw();}
canvas.addEventListener('keydown',e=>{if(e.key==='+'||e.key==='='){e.preventDefault();zoom(1.25);}else if(e.key==='-'){e.preventDefault();zoom(0.8);}else if(e.key==='Enter'){e.preventDefault();found();}else if(e.key.startsWith('Arrow')){e.preventDefault();const current=state.cells[hovered??Math.floor(state.cells.length/2)+Math.floor(state.width/2)];const dx=e.key==='ArrowRight'?1:e.key==='ArrowLeft'?-1:0,dy=e.key==='ArrowDown'?1:e.key==='ArrowUp'?-1:0;const next=cellAt(state,current.x+dx,current.y+dy);if(next){hovered=next.id;const sx=(next.x+0.5)*config.cellSize*camera.zoom+camera.x,sy=(next.y+0.5)*config.cellSize*camera.zoom+camera.y;if(sx<0||sx>viewport.width||sy<0||sy>viewport.height){camera.x=viewport.width/2-(next.x+0.5)*config.cellSize*camera.zoom;camera.y=viewport.height/2-(next.y+0.5)*config.cellSize*camera.zoom;}inspect();}}});
settle.addEventListener('click',found);document.querySelector('#plus')!.addEventListener('click',()=>zoom(1.25));document.querySelector('#minus')!.addEventListener('click',()=>zoom(0.8));document.querySelector('#fit')!.addEventListener('click',fit);
document.querySelector('#reset')!.addEventListener('click',()=>{state=createGame(config.width,config.height,config.seed);hovered=null;status.textContent='Choose a land territory to found your empire.';document.querySelector('h1')!.innerHTML='Every empire<br>starts somewhere.';fit();inspect();});
new ResizeObserver(resize).observe(canvas);
