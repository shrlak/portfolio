// src/animations.ts

export interface AnimState {
  scrollY: number;
  velocity: number;       // px/frame, clamped [-60,60]
  velocitySmooth: number; // exponentially smoothed velocity
  jerk: number;           // rate of change of velocity
  timestamp: number;
  mouseX: number;
  mouseY: number;
  mouseDX: number;        // mouse delta X per frame
  mouseDY: number;        // mouse delta Y per frame
  mouseSpeed: number;     // mouse movement speed (px/frame)
}

type Handler = (state: AnimState) => void;
const handlers = new Map<string, Handler>();

let _scrollY = 0;
let _lastScrollY = 0;
let _lastTime = 0;
let _velocity = 0;
let _velocitySmooth = 0;
let _lastVelocity = 0;
let _mouseX = 0;
let _mouseY = 0;
let _lastMouseX = 0;
let _lastMouseY = 0;
let _rafId = 0;
let _running = false;

function tick(now: number) {
  const dt = Math.max(now - _lastTime, 1);
  const rawV = ((_scrollY - _lastScrollY) / dt) * 16;
  _velocity = Math.max(-60, Math.min(60, rawV));
  _velocitySmooth = _velocitySmooth * 0.85 + _velocity * 0.15;
  const jerk = _velocity - _lastVelocity;
  _lastVelocity = _velocity;
  _lastScrollY = _scrollY;
  _lastTime = now;

  const mouseDX = _mouseX - _lastMouseX;
  const mouseDY = _mouseY - _lastMouseY;
  const mouseSpeed = Math.sqrt(mouseDX * mouseDX + mouseDY * mouseDY);
  _lastMouseX = _mouseX;
  _lastMouseY = _mouseY;

  const state: AnimState = {
    scrollY: _scrollY,
    velocity: _velocity,
    velocitySmooth: _velocitySmooth,
    jerk,
    timestamp: now,
    mouseX: _mouseX,
    mouseY: _mouseY,
    mouseDX,
    mouseDY,
    mouseSpeed,
  };
  handlers.forEach(fn => fn(state));
  _rafId = requestAnimationFrame(tick);
}

export function startEngine(): () => void {
  if (_running) return () => {};
  _running = true;
  const onScroll = () => { _scrollY = window.scrollY; };
  const onMouse = (e: MouseEvent) => { _mouseX = e.clientX; _mouseY = e.clientY; };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('mousemove', onMouse, { passive: true });
  _scrollY = window.scrollY;
  _rafId = requestAnimationFrame(tick);
  return () => {
    _running = false;
    cancelAnimationFrame(_rafId);
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('mousemove', onMouse);
  };
}

export function subscribe(id: string, fn: Handler) { handlers.set(id, fn); }
export function unsubscribe(id: string) { handlers.delete(id); }

// Gear utility: generate SVG path for a gear
export function gearPath(cx: number, cy: number, r1: number, r2: number, teeth: number): string {
  const pts: string[] = [];
  for (let i = 0; i < teeth; i++) {
    const a0 = (i / teeth) * Math.PI * 2;
    const a1 = a0 + Math.PI / teeth * 0.35;
    const a2 = a0 + Math.PI / teeth * 0.65;
    const a3 = a0 + Math.PI / teeth;
    pts.push(
      `L${(Math.cos(a0) * r1 + cx).toFixed(2)},${(Math.sin(a0) * r1 + cy).toFixed(2)}`,
      `L${(Math.cos(a1) * r2 + cx).toFixed(2)},${(Math.sin(a1) * r2 + cy).toFixed(2)}`,
      `L${(Math.cos(a2) * r2 + cx).toFixed(2)},${(Math.sin(a2) * r2 + cy).toFixed(2)}`,
      `L${(Math.cos(a3) * r1 + cx).toFixed(2)},${(Math.sin(a3) * r1 + cy).toFixed(2)}`,
    );
  }
  const startA = 0;
  return `M${(Math.cos(startA) * r1 + cx).toFixed(2)},${(Math.sin(startA) * r1 + cy).toFixed(2)} ${pts.join(' ')} Z`;
}

// Spring physics utility
export function springStep(current: number, target: number, velocity: number, stiffness = 0.12, damping = 0.75): [number, number] {
  const force = (target - current) * stiffness;
  const newVel = (velocity + force) * damping;
  const newPos = current + newVel;
  return [newPos, newVel];
}
