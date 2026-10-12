export interface Camera { x: number; y: number; zoom: number }
export function screenToWorld(camera: Camera, x: number, y: number) { return { x: (x-camera.x)/camera.zoom, y: (y-camera.y)/camera.zoom }; }
export function zoomAt(camera: Camera, x: number, y: number, factor: number, min: number, max: number) {
  const world = screenToWorld(camera,x,y);
  camera.zoom = Math.max(min,Math.min(max,camera.zoom*factor));
  camera.x = x-world.x*camera.zoom; camera.y = y-world.y*camera.zoom;
}
