// src/animations.ts

export interface AnimState {
  scrollY: number;
  velocity: number; // px/frame, clamped [-60,60]
  timestamp: number;
  mouseX: number;
  mouseY: number;
}

type Handler = (state: AnimState) => void;
const handlers = new Map<string, Handler>();
let _scrollY = 0;
let _lastScrollY = 0;
let _lastTime = 0;
let _velocity = 0;
let _mouseX = 0;
let _mouseY = 0;
let _rafId = 0;
let _running = false;

function tick(now: number) {
  const dt = Math.max(now - _lastTime, 1);
  _velocity = Math.max(-60, Math.min(60, ((_scrollY - _lastScrollY) / dt) * 16));
  _lastScrollY = _scrollY;
  _lastTime = now;
  const state: AnimState = { scrollY: _scrollY, velocity: _velocity, timestamp: now, mouseX: _mouseX, mouseY: _mouseY };
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
