# Portfolio ME/BME Animation System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a layered mechanical engineering + biomedical engineering animation system to Spencer Kim's portfolio — scroll-driven gear RPM, ECG heartbeat traces, blueprint grid reveals, skill gauges, cursor burst effects, and section-specific interactions.

**Architecture:** Custom `requestAnimationFrame` engine in `src/animations.ts` provides scroll-velocity and mouse position to all subscribers. React components read from this engine via `useEffect` + `useRef`. All visual effects are CSS keyframes + inline style updates — no new npm dependencies.

**Tech Stack:** React 18, TypeScript, Tailwind CSS, vanilla rAF, SVG animations via `stroke-dashoffset`

---

## Task 1: Create animation engine

**Files:**
- Create: `src/animations.ts`

- [ ] **Step 1: Create the file**

```ts
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
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npm run build 2>&1 | tail -20`
Expected: no errors mentioning `animations.ts`

- [ ] **Step 3: Commit**

```bash
git add src/animations.ts
git commit -m "feat: add rAF animation engine with scroll velocity tracking"
```

---

## Task 2: Add new color tokens to tailwind.config.js

**Files:**
- Modify: `tailwind.config.js`

- [ ] **Step 1: Add bio-green and blueprint colors**

In `tailwind.config.js`, inside `theme.extend.colors`, add after the `oxygen` entry:

```js
        'bio-green': '#00c8a0',
        blueprint: '#1a3a5c',
```

The colors block should now include:
```js
colors: {
  background: '#f4f2ee',
  graphite:   '#f4f2ee',
  surface:    '#ffffff',
  'surface-2': '#eceae5',
  'surface-3': '#e5e2db',
  bone:  '#0d0d0d',
  muted: '#666666',
  steel: '#aaaaaa',
  vital: '#c8102e',
  oxygen: '#1a5276',
  'bio-green': '#00c8a0',
  blueprint:   '#1a3a5c',
  ink:   '#0d0d0d',
  paper: '#f4f2ee',
},
```

- [ ] **Step 2: Commit**

```bash
git add tailwind.config.js
git commit -m "feat: add bio-green and blueprint color tokens"
```

---

## Task 3: Add all new CSS keyframes and utility classes to index.css

**Files:**
- Modify: `src/index.css`

- [ ] **Step 1: Append all new keyframes and classes**

At the very end of `src/index.css`, after the `@media (prefers-reduced-motion: reduce)` block, append:

```css
/* ══════════════════════════════════════════════════════════════════
   ME/BME ANIMATION SYSTEM
   ══════════════════════════════════════════════════════════════════ */

/* ── Gear watermark ──────────────────────────────────────────────── */
.gear-watermark {
  position: fixed; inset: 0; z-index: 1; pointer-events: none;
  display: flex; align-items: center; justify-content: center;
  overflow: hidden;
}
.gear-svg {
  width: clamp(320px, 50vw, 700px);
  height: clamp(320px, 50vw, 700px);
  opacity: 0.025;
  will-change: transform;
  transform-origin: center center;
}

/* ── Parallax dot grid ───────────────────────────────────────────── */
.bp-parallax {
  position: fixed; inset: 0; z-index: 1; pointer-events: none;
  background-image: radial-gradient(circle, rgba(26,58,92,0.09) 1px, transparent 1px);
  background-size: 28px 28px;
  will-change: background-position;
}

/* ── Custom cursor ───────────────────────────────────────────────── */
@media (pointer: fine) {
  body.has-custom-cursor * { cursor: none !important; }
}
.cursor-ring {
  position: fixed; top: 0; left: 0; z-index: 9999; pointer-events: none;
  width: 20px; height: 20px; border-radius: 50%;
  border: 1.5px solid #0d0d0d;
  transform: translate(-50%, -50%);
  will-change: transform, width, height, opacity;
  transition: width 0.18s ease, height 0.18s ease, opacity 0.18s ease, border-color 0.18s ease;
}
.cursor-dot {
  position: fixed; top: 0; left: 0; z-index: 10000; pointer-events: none;
  width: 4px; height: 4px; border-radius: 50%; background: #c8102e;
  transform: translate(-50%, -50%);
  will-change: transform;
}
.cursor-burst {
  position: fixed; top: 0; left: 0; z-index: 9998; pointer-events: none;
  animation: cursor-burst-anim 0.35s ease-out both;
}

@keyframes cursor-burst-anim {
  0%   { opacity: 1; transform: translate(-50%, -50%) scale(0.2); }
  60%  { opacity: 0.8; transform: translate(-50%, -50%) scale(1.4); }
  100% { opacity: 0; transform: translate(-50%, -50%) scale(2); }
}

/* ── Hero corner brackets ────────────────────────────────────────── */
.bracket-tl, .bracket-br {
  position: absolute; z-index: 2; pointer-events: none;
}
.bracket-tl { top: 16px; left: 16px; }
.bracket-br { bottom: 16px; right: 16px; transform: rotate(180deg); }
.bracket-path {
  stroke: #c8102e; fill: none; stroke-width: 2;
  stroke-dasharray: 60; stroke-dashoffset: 60;
  animation: bracket-draw 0.6s cubic-bezier(0.4,0,0.2,1) 0.3s both;
}
@keyframes bracket-draw {
  to { stroke-dashoffset: 0; }
}

/* ── Hero crosshair reticle ──────────────────────────────────────── */
.hero-reticle {
  position: absolute; inset: 0; z-index: 1; pointer-events: none;
  display: flex; align-items: center; justify-content: center;
  overflow: hidden; opacity: 0.04;
}
@keyframes reticle-spin { to { transform: rotate(360deg); } }
.reticle-svg { animation: reticle-spin 30s linear infinite; }

/* ── Blueprint grid reveal ───────────────────────────────────────── */
.bp-grid-svg {
  position: absolute; inset: 0; width: 100%; height: 100%;
  pointer-events: none; z-index: 0;
}
.bp-line {
  stroke: #1a3a5c; fill: none; stroke-width: 0.5; opacity: 0.12;
  stroke-dasharray: 2000; stroke-dashoffset: 2000;
  transition: stroke-dashoffset 0.9s cubic-bezier(0.4,0,0.2,1);
}
.bp-line.is-drawn { stroke-dashoffset: 0; }

/* ── Credentials tolerance annotation ───────────────────────────── */
.tolerance-note {
  position: absolute; right: -120px; top: 50%;
  transform: translateY(-50%);
  font-family: 'JetBrains Mono', monospace;
  font-size: 8px; letter-spacing: 0.14em;
  color: #1a3a5c; opacity: 0; white-space: nowrap;
  transition: opacity 0.2s ease;
  pointer-events: none;
}
tr:hover .tolerance-note { opacity: 1; }

/* ── ECG background trace ────────────────────────────────────────── */
.ecg-bg {
  position: absolute; inset: 0; width: 100%; height: 100%;
  pointer-events: none; z-index: 0; overflow: hidden;
}
.ecg-path {
  stroke: #00c8a0; fill: none; stroke-width: 1.5; opacity: 0.12;
  stroke-dasharray: 2000; stroke-dashoffset: 2000;
}
.ecg-path.is-tracing {
  animation: ecg-trace 1.4s cubic-bezier(0.4,0,0.2,1) forwards;
}
.ecg-path.is-flatline {
  animation: ecg-flatline 0.3s ease forwards;
}
@keyframes ecg-trace {
  to { stroke-dashoffset: 0; }
}
@keyframes ecg-flatline {
  from { d: path('M0,60 L20,60 L25,55 L30,60 L45,60 L60,30 L65,110 L70,40 L80,60 L95,65 L110,60 L800,60'); }
  to   { d: path('M0,60 L800,60'); }
}
@keyframes ecg-loop {
  0%   { stroke-dashoffset: 2000; }
  100% { stroke-dashoffset: -2000; }
}
.ecg-path.is-looping {
  animation: ecg-loop 3s linear infinite;
}

/* ── Research card — piston SVG ──────────────────────────────────── */
.piston-wrap {
  position: absolute; top: 8px; right: 8px;
  opacity: 0.18; pointer-events: none;
  transition: opacity 0.2s ease;
}
.research-card-wrap:hover .piston-wrap { opacity: 0.4; }
@keyframes piston-move {
  0%, 100% { transform: translateY(0); }
  50%      { transform: translateY(8px); }
}
.piston-rod { animation: piston-move 3s ease-in-out infinite; }
.research-card-wrap:hover .piston-rod { animation-duration: 1s; }

/* ── Research card — ECG border + vitals ────────────────────────── */
.vitals-readout {
  position: absolute; bottom: 0; left: 0; right: 0;
  padding: 6px 10px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 8px; letter-spacing: 0.12em;
  color: #00c8a0; background: rgba(0,200,160,0.04);
  border-top: 1px solid rgba(0,200,160,0.2);
  opacity: 0; transform: translateY(4px);
  transition: opacity 0.2s ease, transform 0.2s ease;
  pointer-events: none;
}
.research-card-wrap:hover .vitals-readout { opacity: 1; transform: translateY(0); }
@keyframes vitals-glow {
  0%, 100% { box-shadow: 0 0 0 0 rgba(0,200,160,0); }
  50%       { box-shadow: 0 0 0 3px rgba(0,200,160,0.15); }
}
.research-card-wrap:hover { animation: vitals-glow 1.5s ease-in-out infinite; }

/* ── Scan line sweep (research card click transition) ────────────── */
.scan-line {
  position: fixed; inset: 0; z-index: 200; pointer-events: none;
  background: linear-gradient(to bottom, transparent 0%, rgba(244,242,238,0.95) 50%, transparent 100%);
  height: 60px; top: -60px;
  animation: scan-sweep 0.35s ease-out both;
}
@keyframes scan-sweep {
  from { top: -60px; }
  to   { top: 100vh; }
}

/* ── Skill gauge ─────────────────────────────────────────────────── */
.gauge-wrap { position: relative; display: inline-block; }
.gauge-arc-bg  { fill: none; stroke: rgba(13,13,13,0.1); stroke-width: 3; stroke-linecap: round; }
.gauge-arc     { fill: none; stroke: #c8102e; stroke-width: 3; stroke-linecap: round; stroke-dasharray: 188; stroke-dashoffset: 188; transition: stroke-dashoffset 0.8s cubic-bezier(0.4,0,0.2,1); }
.gauge-needle  { transform-origin: 40px 40px; transition: transform 0.8s cubic-bezier(0.4,0,0.2,1); }
.gauge-wrap:hover .gauge-arc { stroke: #00c8a0; }
.gauge-tooltip {
  position: absolute; bottom: calc(100% + 6px); left: 50%;
  transform: translateX(-50%);
  font-family: 'JetBrains Mono', monospace; font-size: 8px; letter-spacing: 0.12em;
  background: #0d0d0d; color: #f4f2ee; padding: 4px 8px; white-space: nowrap;
  opacity: 0; pointer-events: none;
  transition: opacity 0.18s ease;
}
.gauge-wrap:hover .gauge-tooltip { opacity: 1; }

/* ── Timeline tick stamp ─────────────────────────────────────────── */
@keyframes tick-stamp {
  0%   { transform: scale(1.5) translateX(-50%); opacity: 0; }
  60%  { transform: scale(0.9) translateX(-50%); opacity: 1; }
  100% { transform: scale(1)   translateX(-50%); opacity: 1; }
}
.timeline-tick.is-stamped { animation: tick-stamp 0.18s cubic-bezier(0.4,0,0.2,1) both; }

/* ── Contact oscilloscope grid ───────────────────────────────────── */
.osc-grid {
  position: absolute; inset: 0; z-index: 0; pointer-events: none;
  background-image:
    linear-gradient(rgba(0,200,160,0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0,200,160,0.04) 1px, transparent 1px);
  background-size: 32px 32px;
}

/* ── Contact input bio-green focus ───────────────────────────────── */
.ed-input:focus {
  border-color: #00c8a0 !important;
  box-shadow: 0 0 0 2px rgba(0,200,160,0.12);
}

/* ── Send button gear + TRANSMITTED state ────────────────────────── */
@keyframes gear-spin-fast { to { transform: rotate(360deg); } }
.send-gear { display: inline-block; animation: gear-spin-fast 0.4s linear; }
.ed-submit.is-sent { border-color: #00c8a0; color: #00c8a0; letter-spacing: 0.3em; }

/* ── Reduced-motion additions ────────────────────────────────────── */
@media (prefers-reduced-motion: reduce) {
  .gear-svg, .reticle-svg { animation: none !important; }
  .bracket-path { animation: none !important; stroke-dashoffset: 0 !important; }
  .bp-line { transition: none !important; stroke-dashoffset: 0 !important; }
  .ecg-path { animation: none !important; stroke-dashoffset: 0 !important; }
  .piston-rod { animation: none !important; }
  .gauge-arc { transition: none !important; }
  .scan-line { animation: none !important; display: none; }
}
```

- [ ] **Step 2: Verify build compiles**

Run: `npm run build 2>&1 | tail -20`
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add src/index.css
git commit -m "feat: add ME/BME animation keyframes and utility classes"
```

---

## Task 4: Add global animation components (gear, parallax, cursor)

**Files:**
- Modify: `src/App.tsx`

- [ ] **Step 1: Add import for animation engine at top of App.tsx**

After the existing imports (after line 16, before the `/* ── Router */` comment), add:

```tsx
import { startEngine, subscribe, unsubscribe } from './animations';
```

- [ ] **Step 2: Add GearWatermark component**

Add after the `PaperGrain` function (after line 180):

```tsx
function GearWatermark() {
  const svgRef = useRef<SVGSVGElement>(null);
  const angleRef = useRef(0);
  useEffect(() => {
    const stop = startEngine();
    subscribe('gear', ({ velocity }) => {
      const rpm = Math.max(0.3, Math.min(60, 1 + Math.abs(velocity) * 1.5));
      angleRef.current = (angleRef.current + rpm / 60 * 6) % 360;
      if (svgRef.current) svgRef.current.style.transform = `rotate(${angleRef.current}deg)`;
    });
    return () => { unsubscribe('gear'); stop(); };
  }, []);

  // 12-tooth gear SVG path
  const teeth = 12;
  const r1 = 60, r2 = 75, holeR = 18;
  const pts: string[] = [];
  for (let i = 0; i < teeth; i++) {
    const a0 = (i / teeth) * Math.PI * 2;
    const a1 = a0 + Math.PI / teeth * 0.4;
    const a2 = a0 + Math.PI / teeth * 0.6;
    const a3 = a0 + Math.PI / teeth;
    pts.push(
      `L${(Math.cos(a0) * r1 + 100).toFixed(2)},${(Math.sin(a0) * r1 + 100).toFixed(2)}`,
      `L${(Math.cos(a1) * r2 + 100).toFixed(2)},${(Math.sin(a1) * r2 + 100).toFixed(2)}`,
      `L${(Math.cos(a2) * r2 + 100).toFixed(2)},${(Math.sin(a2) * r2 + 100).toFixed(2)}`,
      `L${(Math.cos(a3) * r1 + 100).toFixed(2)},${(Math.sin(a3) * r1 + 100).toFixed(2)}`,
    );
  }
  const gearD = `M${(100 + r1).toFixed(2)},100 ${pts.join(' ')} Z`;

  return (
    <div className="gear-watermark" aria-hidden="true">
      <svg ref={svgRef} viewBox="0 0 200 200" className="gear-svg">
        <path d={gearD} fill="currentColor" />
        <circle cx="100" cy="100" r={holeR} fill="var(--bg, #f4f2ee)" />
      </svg>
    </div>
  );
}
```

- [ ] **Step 3: Add BlueprintParallax component**

Add after GearWatermark:

```tsx
function BlueprintParallax() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    subscribe('parallax', ({ scrollY }) => {
      if (ref.current) ref.current.style.backgroundPosition = `0px ${scrollY * 0.3}px`;
    });
    return () => unsubscribe('parallax');
  }, []);
  return <div ref={ref} className="bp-parallax" aria-hidden="true" />;
}
```

- [ ] **Step 4: Add CustomCursor component**

Add after BlueprintParallax:

```tsx
function CustomCursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef  = useRef<HTMLDivElement>(null);
  const [burst, setBurst] = useState<{x:number;y:number;id:number}|null>(null);

  useEffect(() => {
    document.body.classList.add('has-custom-cursor');
    const onMove = (e: MouseEvent) => {
      if (ringRef.current) {
        ringRef.current.style.left = `${e.clientX}px`;
        ringRef.current.style.top  = `${e.clientY}px`;
      }
      if (dotRef.current) {
        dotRef.current.style.left = `${e.clientX}px`;
        dotRef.current.style.top  = `${e.clientY}px`;
      }
    };
    const onDown = (e: MouseEvent) => {
      setBurst({ x: e.clientX, y: e.clientY, id: Date.now() });
    };
    const onEnter = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      const interactive = t.closest('a,button,input,textarea,select,[role=button]');
      if (ringRef.current) {
        ringRef.current.style.width  = interactive ? '36px' : '20px';
        ringRef.current.style.height = interactive ? '36px' : '20px';
        ringRef.current.style.borderColor = interactive ? '#c8102e' : '#0d0d0d';
      }
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mousedown', onDown);
    document.addEventListener('mouseover', onEnter);
    return () => {
      document.body.classList.remove('has-custom-cursor');
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mousedown', onDown);
      document.removeEventListener('mouseover', onEnter);
    };
  }, []);

  return (
    <>
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
      <div ref={dotRef}  className="cursor-dot"  aria-hidden="true" />
      {burst && (
        <div
          key={burst.id}
          className="cursor-burst"
          aria-hidden="true"
          style={{ left: burst.x, top: burst.y }}
          onAnimationEnd={() => setBurst(null)}
        >
          <svg width="40" height="40" viewBox="0 0 40 40">
            {[0,45,90,135,180,225,270,315].map(deg => {
              const rad = deg * Math.PI / 180;
              const x1 = 20 + Math.cos(rad) * 8;
              const y1 = 20 + Math.sin(rad) * 8;
              const x2 = 20 + Math.cos(rad) * 18;
              const y2 = 20 + Math.sin(rad) * 18;
              return <line key={deg} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#c8102e" strokeWidth="1.5" />;
            })}
          </svg>
        </div>
      )}
    </>
  );
}
```

- [ ] **Step 5: Wire global components into the App root**

In the `App` default export function, find the return for the home route (around line 1463):

```tsx
  return (
    <div className="relative">
      <PaperGrain />
      <ScrollProgress />
      <BackToTop />
      <Navbar onHome />
      <main>
        <HomePage />
      </main>
    </div>
  );
```

Replace it with:

```tsx
  return (
    <div className="relative">
      <GearWatermark />
      <BlueprintParallax />
      <CustomCursor />
      <PaperGrain />
      <ScrollProgress />
      <BackToTop />
      <Navbar onHome />
      <main>
        <HomePage />
      </main>
    </div>
  );
```

- [ ] **Step 6: Verify build**

Run: `npm run build 2>&1 | tail -20`
Expected: no errors

- [ ] **Step 7: Commit**

```bash
git add src/App.tsx
git commit -m "feat: add gear watermark, parallax dot-grid, custom cursor"
```

---

## Task 5: Hero — corner brackets + crosshair reticle

**Files:**
- Modify: `src/App.tsx`

- [ ] **Step 1: Add CornerBrackets and HeroCrosshair components**

Add these two components just before the `HeroSection` function:

```tsx
function CornerBrackets() {
  return (
    <>
      <div className="bracket-tl" aria-hidden="true">
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <path className="bracket-path" d="M32,2 L2,2 L2,32" />
        </svg>
      </div>
      <div className="bracket-br" aria-hidden="true">
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <path className="bracket-path" d="M32,2 L2,2 L2,32" style={{ animationDelay: '0.15s' }} />
        </svg>
      </div>
    </>
  );
}

function HeroCrosshair() {
  return (
    <div className="hero-reticle" aria-hidden="true">
      <svg viewBox="0 0 200 200" width="300" height="300" className="reticle-svg" fill="none" stroke="#0d0d0d" strokeWidth="0.5">
        <circle cx="100" cy="100" r="80" />
        <circle cx="100" cy="100" r="50" />
        <line x1="100" y1="10"  x2="100" y2="40" />
        <line x1="100" y1="160" x2="100" y2="190" />
        <line x1="10"  y1="100" x2="40"  y2="100" />
        <line x1="160" y1="100" x2="190" y2="100" />
        <circle cx="100" cy="100" r="3" />
      </svg>
    </div>
  );
}
```

- [ ] **Step 2: Add to HeroSection**

In `HeroSection`, the opening `<section>` tag is:
```tsx
    <section id="home" className="relative bg-graphite overflow-hidden">
```

Directly after the opening `<section>` tag, add:
```tsx
      <HeroCrosshair />
      <CornerBrackets />
```

- [ ] **Step 3: Commit**

```bash
git add src/App.tsx
git commit -m "feat: add hero corner brackets and crosshair reticle"
```

---

## Task 6: Credentials — blueprint grid reveal + tolerance annotations

**Files:**
- Modify: `src/App.tsx`

- [ ] **Step 1: Add BlueprintGridReveal component**

Add before `CredentialsSection`:

```tsx
function BlueprintGridReveal() {
  const ref = useRef<SVGSVGElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const lines = ref.current.querySelectorAll<SVGPathElement>('.bp-line');
    const obs = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      obs.disconnect();
      lines.forEach((l, i) => setTimeout(() => l.classList.add('is-drawn'), i * 60));
    }, { threshold: 0.1 });
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <svg ref={ref} className="bp-grid-svg" aria-hidden="true" viewBox="0 0 800 400" preserveAspectRatio="xMidYMid slice">
      {Array.from({ length: 10 }).map((_, i) => (
        <path key={`h${i}`} className="bp-line" d={`M0,${i*44} L800,${i*44}`} style={{ transitionDelay: `${i * 0.06}s` }} />
      ))}
      {Array.from({ length: 20 }).map((_, i) => (
        <path key={`v${i}`} className="bp-line" d={`M${i*42},0 L${i*42},400`} style={{ transitionDelay: `${0.6 + i * 0.04}s` }} />
      ))}
    </svg>
  );
}
```

- [ ] **Step 2: Add blueprint grid and tolerance notes to CredentialsSection**

In `CredentialsSection`, find the outer `<section>` tag:
```tsx
    <section id="credentials" className="relative ed-dark">
```
Change to:
```tsx
    <section id="credentials" className="relative ed-dark overflow-hidden">
```

Directly after the opening section tag, add:
```tsx
      <BlueprintGridReveal />
```

Then, in the `<tr>` mapping for each credential row, add the tolerance annotation. Find:
```tsx
                  <tr key={i} className="row-reveal border-b border-white/10 group">
                    <td className="py-5 pr-6 align-top w-20">
```

Change to:
```tsx
                  <tr key={i} className="row-reveal border-b border-white/10 group relative">
                    <td className="py-5 pr-6 align-top w-20 relative">
                      <span className="tolerance-note">{`± 0.00${(i % 3) + 1} in`}</span>
```

- [ ] **Step 3: Commit**

```bash
git add src/App.tsx
git commit -m "feat: add blueprint grid reveal and tolerance annotations to credentials"
```

---

## Task 7: About — ECG heartbeat background + hover/click interaction

**Files:**
- Modify: `src/App.tsx`

- [ ] **Step 1: Add EcgBackground component**

Add before `AboutSection`:

```tsx
// P-QRS-T waveform repeated twice for a full-width trace
const ECG_PATH = 'M0,60 L20,60 L25,55 L30,60 L45,60 L60,30 L65,110 L70,40 L80,60 L95,65 L110,60 L200,60 L220,60 L225,55 L230,60 L245,60 L260,30 L265,110 L270,40 L280,60 L295,65 L310,60 L800,60';
const FLATLINE_PATH = 'M0,60 L800,60';

function EcgBackground({ fast, flat }: { fast: boolean; flat: boolean }) {
  const pathRef = useRef<SVGPathElement>(null);
  useEffect(() => {
    const p = pathRef.current;
    if (!p) return;
    if (flat) {
      p.classList.remove('is-tracing', 'is-looping');
      p.classList.add('is-flatline');
      setTimeout(() => {
        if (!pathRef.current) return;
        pathRef.current.classList.remove('is-flatline');
        pathRef.current.classList.add('is-looping');
      }, 900);
    }
  }, [flat]);

  useEffect(() => {
    const p = pathRef.current;
    if (!p) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      obs.disconnect();
      p.classList.add('is-tracing');
      setTimeout(() => {
        if (pathRef.current) {
          pathRef.current.classList.remove('is-tracing');
          pathRef.current.classList.add('is-looping');
        }
      }, 1500);
    }, { threshold: 0.2 });
    obs.observe(p);
    return () => obs.disconnect();
  }, []);

  return (
    <svg className="ecg-bg" viewBox="0 0 800 120" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <path
        ref={pathRef}
        className="ecg-path"
        d={ECG_PATH}
        style={{ animationDuration: fast ? '1.2s' : '3s' }}
      />
    </svg>
  );
}
```

- [ ] **Step 2: Wire into AboutSection**

Find the `AboutSection` function. Replace it entirely with:

```tsx
function AboutSection() {
  const [fast, setFast] = useState(false);
  const [flat, setFlat] = useState(false);
  const flatRef = useRef(false);

  const handleClick = () => {
    if (flatRef.current) return;
    flatRef.current = true;
    setFlat(true);
    setTimeout(() => { setFlat(false); flatRef.current = false; }, 1000);
  };

  return (
    <section
      id="about"
      className="relative bg-graphite overflow-hidden"
      onMouseEnter={() => setFast(true)}
      onMouseLeave={() => setFast(false)}
      onClick={handleClick}
    >
      <EcgBackground fast={fast} flat={flat} />
      <div className="relative z-10 mx-auto max-w-container px-6 md:px-10 lg:px-14 xl:px-16 py-20 md:py-28">

        <div className="mb-14" data-reveal>
          <FolioLabel text={ABOUT.tag} />
        </div>

        {/* Magazine two-column */}
        <div className="grid md:grid-cols-[45%_55%] gap-10 md:gap-16 mb-16">
          {/* Pull quote */}
          <div data-ink data-ink-delay="1">
            <p className="font-serif-italic text-bone text-3xl sm:text-4xl md:text-5xl leading-[1.18]">
              "{ABOUT.accent}"
            </p>
          </div>
          {/* Body text */}
          <div data-reveal data-reveal-delay="2">
            <div className="ed-rule-red mb-6" style={{ width: '2.5rem' }} />
            {ABOUT.body.map((para, i) => (
              <p key={i} className="font-mono text-[13px] md:text-[14px] leading-[1.85] text-muted mb-4 last:mb-0">
                {para}
              </p>
            ))}
          </div>
        </div>

        {/* Marquee ticker */}
        <div className="mb-16 ed-rule-thin py-3 overflow-hidden" data-reveal>
          <div className="marquee-outer overflow-hidden">
            <div className="marquee-track inline-flex gap-0 whitespace-nowrap" style={{ '--marquee-speed': '40s' } as React.CSSProperties}>
              {[...ABOUT.keywordRows, ...ABOUT.keywordRows].map((item, i) => (
                <span key={i} className="font-mono text-[9px] uppercase tracking-[0.22em] text-muted px-6">
                  {item} <span className="text-vital mx-1">·</span>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-0 md:divide-x md:divide-bone/10" data-reveal data-reveal-delay="2">
          {[
            { value: '2',   label: 'Degrees',    sub: 'ME + BME' },
            { value: '6',   label: 'Ovine',      sub: 'Cohort animals' },
            { value: '33×', label: 'Half-life',  sub: 'FXII900-PCB vs. unconjugated' },
            { value: '1',   label: 'Patent',     sub: 'KR 10-2675388 granted' },
          ].map((stat) => (
            <div key={stat.label} className="md:px-8 first:pl-0">
              <p className="font-grotesk text-vital leading-none text-5xl md:text-6xl tracking-tightest">{stat.value}</p>
              <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-bone mt-2">{stat.label}</p>
              <p className="font-mono text-[8.5px] text-muted mt-0.5">{stat.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/App.tsx
git commit -m "feat: add ECG heartbeat background to About section with hover/click interaction"
```

---

## Task 8: Research cards — piston, vitals readout, scan-line

**Files:**
- Modify: `src/App.tsx`

- [ ] **Step 1: Add PistonIcon component**

Add before `ResearchEntry`:

```tsx
function PistonIcon() {
  return (
    <div className="piston-wrap" aria-hidden="true">
      <svg width="28" height="36" viewBox="0 0 28 36" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="4" y="2" width="20" height="12" rx="1" />
        <line x1="14" y1="14" x2="14" y2="22" className="piston-rod" />
        <rect x="8" y="22" width="12" height="8" rx="1" />
        <line x1="4" y1="34" x2="24" y2="34" />
      </svg>
    </div>
  );
}
```

- [ ] **Step 2: Add scan-line state and vitals to ResearchEntry**

Replace the `ResearchEntry` function entirely with:

```tsx
function ResearchEntry({ card, idx }: { card: (typeof RESEARCH_CARDS)[number]; idx: number }) {
  const [scanning, setScanning] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      window.location.href = `#/research/${card.slug}`;
    }, 380);
  };

  return (
    <>
      {scanning && <div className="scan-line" aria-hidden="true" />}
      <a
        href={`#/research/${card.slug}`}
        onClick={handleClick}
        className="research-card-wrap ed-entry block px-0 py-10 md:py-14 relative"
        data-reveal
        data-reveal-delay={String(idx + 1)}
      >
        <PistonIcon />
        <div className="grid md:grid-cols-[auto_1fr_auto] gap-4 md:gap-10 items-start">
          {/* Index */}
          <div className="shrink-0 pt-1">
            <p className="font-mono text-[9px] uppercase tracking-[0.22em] e-vital text-vital">{card.index}</p>
            <p className="font-mono text-[8.5px] uppercase tracking-[0.14em] e-muted text-muted mt-1">{card.category}</p>
          </div>

          {/* Content */}
          <div>
            <h3
              className="e-text text-bone font-grotesk uppercase leading-[0.88] tracking-tightest"
              style={{ fontSize: 'clamp(38px, 6vw, 80px)' }}
            >
              <span className="block">{card.title}</span>
              <span className="block">{card.titleTwo}</span>
            </h3>
            <p className="e-muted text-muted font-serif-italic text-xl md:text-2xl leading-[1.25] mt-4 max-w-[48ch]">
              {card.subtitle}
            </p>
            <div className="mt-5 flex items-center gap-4 flex-wrap">
              <p className="e-muted text-muted font-mono text-[9px] uppercase tracking-[0.18em]">{card.metaLabel}</p>
              <span className="e-muted text-muted font-mono text-[9px]">·</span>
              <p className="e-text text-bone font-mono text-[9.5px] uppercase tracking-[0.1em]">{card.metaValue}</p>
            </div>
          </div>

          {/* Data + arrow */}
          <div className="hidden md:flex flex-col items-end gap-6 shrink-0 pt-1">
            <div className="e-panel border border-bone/20" style={{ minWidth: '180px' }}>
              {[
                { k: 'STATUS', v: card.status },
                { k: 'META',   v: card.metaValue.split('·')[0]?.trim() ?? '' },
              ].map(({ k, v }) => (
                <div key={k} className="e-rule border-b border-bone/15 last:border-0 px-3 py-2 grid grid-cols-[40%_60%]">
                  <span className="font-mono text-[7.5px] uppercase tracking-[0.14em] e-muted text-muted">{k}</span>
                  <span className="font-mono text-[9px] uppercase tracking-[0.06em] e-text text-bone">{v}</span>
                </div>
              ))}
            </div>
            <div className="e-arrow w-9 h-9 rounded-full border border-bone/25 flex items-center justify-center transition-colors">
              <ArrowUpRight className="h-3.5 w-3.5 e-text text-bone" strokeWidth={2} />
            </div>
          </div>
        </div>

        {/* Vitals readout */}
        <div className="vitals-readout">
          SpO₂ 98% &nbsp;|&nbsp; Flow 4.2 L/min &nbsp;|&nbsp; ΔP 12 mmHg
        </div>
      </a>
    </>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/App.tsx
git commit -m "feat: add piston icon, vitals readout, and scan-line to research cards"
```

---

## Task 9: Skills — semicircular gauge readouts

**Files:**
- Modify: `src/App.tsx`

- [ ] **Step 1: Add SkillGauge component**

Add before `SkillsSection`:

```tsx
function SkillGauge({ name, pct }: { name: string; pct: number }) {
  const arcRef  = useRef<SVGCircleElement>(null);
  const started = useRef(false);
  // Semicircle arc: r=34, circumference of 180-deg arc = π*r ≈ 107
  const R = 34;
  const ARC = Math.PI * R; // ~107
  const offset = ARC - (pct / 100) * ARC;

  const rated =
    pct >= 80 ? 'Expert' :
    pct >= 60 ? 'Advanced' :
    pct >= 40 ? 'Proficient' :
    'Developing';

  useEffect(() => {
    const el = arcRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || started.current) return;
      started.current = true;
      obs.disconnect();
      setTimeout(() => {
        if (arcRef.current) arcRef.current.style.strokeDashoffset = String(offset);
      }, 80);
    }, { threshold: 0.5 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [offset]);

  return (
    <div className="gauge-wrap flex flex-col items-center gap-1">
      <div className="gauge-tooltip">Rated: {rated}</div>
      <svg width="80" height="46" viewBox="0 0 80 46">
        {/* Background arc — top half of circle, cx=40 cy=40 */}
        <path
          className="gauge-arc-bg"
          d={`M${40 - R},40 A${R},${R} 0 0,1 ${40 + R},40`}
          strokeDasharray={ARC} strokeDashoffset="0"
        />
        <path
          ref={arcRef as unknown as React.RefObject<SVGPathElement>}
          className="gauge-arc"
          d={`M${40 - R},40 A${R},${R} 0 0,1 ${40 + R},40`}
          strokeDasharray={ARC}
          strokeDashoffset={ARC}
          style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(0.4,0,0.2,1)' }}
        />
      </svg>
      <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-bone text-center leading-tight">{name}</p>
    </div>
  );
}
```

- [ ] **Step 2: Replace SkillsSection with gauge version**

Replace the entire `SkillsSection` function with:

```tsx
function SkillsSection() {
  const tableRef = useRef<HTMLDivElement>(null);
  useRowReveal(tableRef as React.RefObject<HTMLElement>, SKILLS.reduce((a, g) => a + g.items.length, 0), 50);

  return (
    <section className="relative bg-surface">
      <div className="mx-auto max-w-container px-6 md:px-10 lg:px-14 xl:px-16 py-16 md:py-20">
        <div className="mb-10" data-reveal>
          <FolioLabel text="005 · TECHNICAL SKILLS" />
        </div>

        <div ref={tableRef} className="grid md:grid-cols-2 gap-0 md:gap-px">
          {SKILLS.map((group, gi) => (
            <div key={gi} className="border-t border-bone/10">
              <div className="py-4 border-b border-bone/10">
                <p className="font-mono text-[9px] uppercase tracking-[0.24em] text-muted">{group.group}</p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 py-6">
                {group.items.map((item) => (
                  <SkillGauge key={item.name} name={item.name} pct={item.pct} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/App.tsx
git commit -m "feat: replace skill bars with semicircular gauge readouts"
```

---

## Task 10: Timeline — enhanced tick stamps

**Files:**
- Modify: `src/App.tsx`

- [ ] **Step 1: Enhance TimelineStrip with stamped tick marks**

Replace the `TimelineStrip` function entirely with:

```tsx
function TimelineStrip() {
  const containerRef = useRef<HTMLDivElement>(null);
  const lineRef = useTimelineScroll(containerRef);
  const tickRefs = useRef<(HTMLDivElement | null)[]>([]);
  const stamped = useRef<Set<number>>(new Set());

  useEffect(() => {
    const onScroll = () => {
      tickRefs.current.forEach((el, i) => {
        if (!el || stamped.current.has(i)) return;
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.8) {
          stamped.current.add(i);
          el.classList.add('is-stamped');
        }
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <section className="relative bg-graphite">
      <div className="mx-auto max-w-container px-6 md:px-10 lg:px-14 xl:px-16 py-20 md:py-28">
        <div className="mb-12" data-reveal>
          <FolioLabel text="PAS Study Timeline · N=6 Ovine Cohort" />
        </div>

        <div ref={containerRef} className="relative pl-8 md:pl-12">
          {/* Vertical progress rule */}
          <div className="absolute left-0 top-0 w-px bg-bone/10 h-full" />
          <div ref={lineRef} className="timeline-vr" />

          {TIMELINE.map((node, i) => (
            <div
              key={i}
              data-reveal
              data-reveal-delay={String((i % 4) + 1)}
              className="relative pb-8 md:pb-10 last:pb-0"
            >
              {/* Stamped node marker */}
              <div
                ref={el => { tickRefs.current[i] = el; }}
                className={`timeline-tick absolute -left-[1.1rem] top-1.5 w-3 h-3 rounded-full border-2 transition-colors ${
                  node.state === 'done'   ? 'bg-vital border-vital' :
                  node.state === 'active' ? 'bg-graphite border-vital' :
                  'bg-graphite border-bone/20'
                }`}
                style={{ transformOrigin: '50% 50%' }}
              />

              <div className="grid md:grid-cols-[auto_1fr_auto] gap-3 md:gap-8 items-baseline">
                <span className="font-grotesk text-vital text-sm md:text-base tracking-tightest leading-none">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div>
                  <p className={`font-mono text-[11px] md:text-[12px] uppercase tracking-[0.14em] ${
                    node.state === 'done'   ? 'text-bone' :
                    node.state === 'active' ? 'text-vital' :
                    'text-steel'
                  }`}>
                    {node.label}
                  </p>
                  {node.sub && (
                    <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-steel/60 mt-1">{node.sub}</p>
                  )}
                </div>
                <span className={`font-mono text-[9px] uppercase tracking-[0.2em] shrink-0 hidden md:block ${
                  node.state === 'done'   ? 'text-vital' :
                  node.state === 'active' ? 'text-bone' :
                  'text-steel/40'
                }`}>
                  {node.state === 'done' ? '✓ DONE' : node.state === 'active' ? '● ACTIVE' : '○ PENDING'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/App.tsx
git commit -m "feat: add stamped tick mark animation to timeline"
```

---

## Task 11: Contact — oscilloscope grid + bio-green focus + gear send

**Files:**
- Modify: `src/App.tsx`

- [ ] **Step 1: Replace ContactSection**

Replace the entire `ContactSection` function with the version below. Key changes: add `osc-grid` div, track `sent` state on submit, add gear icon + TRANSMITTED text:

```tsx
function ContactSection() {
  const [name, setName]       = useState('');
  const [email, setEmail]     = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent]       = useState(false);

  const mailto = `mailto:${PERSON.email}?subject=${encodeURIComponent(
    subject || 'Portfolio inquiry'
  )}&body=${encodeURIComponent(
    `From: ${name || 'Unsigned'}\nReply-to: ${email || 'n/a'}\n\n${message || ''}`
  )}`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => { setSent(false); window.location.href = mailto; }, 1600);
  };

  return (
    <section id="contact" className="relative bg-graphite overflow-hidden">
      <div className="osc-grid" aria-hidden="true" />
      <div className="relative z-10 mx-auto max-w-container px-6 md:px-10 lg:px-14 xl:px-16 py-20 md:py-28 lg:py-32">

        {/* Header */}
        <div className="mb-14 md:mb-18 grid md:grid-cols-12 gap-8">
          <div className="md:col-span-7" data-reveal>
            <FolioLabel text={CONTACT.tag} />
            <span className="mt-6 font-serif-italic block text-vital text-3xl sm:text-4xl md:text-5xl leading-[1.15]">
              {CONTACT.accent}
            </span>
            <h2 className="mt-1 font-grotesk uppercase text-bone leading-[0.88] tracking-tightest text-5xl sm:text-6xl md:text-7xl">
              {CONTACT.heading.map((line, i) => <span key={i} className="block">{line}</span>)}
            </h2>
          </div>
          <div className="md:col-span-5 md:pt-6" data-reveal data-reveal-delay="2">
            <p className="font-mono text-[13px] md:text-[14px] leading-[1.85] text-muted">{CONTACT.body}</p>
          </div>
        </div>

        {/* Form + channels */}
        <div className="grid md:grid-cols-12 gap-6 md:gap-10">
          {/* Form */}
          <form onSubmit={handleSubmit} className="md:col-span-7">
            <div className="mb-6 flex items-center justify-between border-b border-bone/10 pb-4">
              <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-vital">Direct dispatch</p>
              <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-steel">Opens mail client</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: 'Name',    type: 'text',  value: name,    setter: setName,    placeholder: 'Your name',              span: 1 },
                { label: 'Email',   type: 'email', value: email,   setter: setEmail,   placeholder: 'you@domain.com',         span: 1 },
                { label: 'Subject', type: 'text',  value: subject, setter: setSubject, placeholder: 'Collaboration · inquiry', span: 2 },
              ].map((f) => (
                <label key={f.label} className={`block ${f.span === 2 ? 'sm:col-span-2' : ''}`}>
                  <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted block mb-1.5">{f.label}</span>
                  <input
                    type={f.type} value={f.value}
                    onChange={(e) => f.setter(e.target.value)}
                    placeholder={f.placeholder}
                    className="ed-input"
                  />
                </label>
              ))}
              <label className="block sm:col-span-2">
                <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted block mb-1.5">Message</span>
                <textarea
                  value={message} onChange={(e) => setMessage(e.target.value)}
                  rows={5} placeholder="Write as much or as little as you like."
                  className="ed-input resize-none"
                />
              </label>
            </div>

            <div className="mt-5">
              <button
                type="submit"
                className={`ed-submit ${sent ? 'is-sent' : ''}`}
                style={{ transition: 'border-color 0.3s ease, color 0.3s ease, letter-spacing 0.3s ease' }}
              >
                {sent ? (
                  <>
                    <span>Transmitted</span>
                    <span className="send-gear">⚙</span>
                  </>
                ) : (
                  <>
                    <span>Send dispatch</span>
                    <Send className="h-3.5 w-3.5" strokeWidth={2} />
                  </>
                )}
              </button>
              <p className="font-mono text-[8.5px] uppercase tracking-[0.2em] text-steel mt-3 text-center">
                Routed via your default mail client
              </p>
            </div>
          </form>

          {/* Channels */}
          <div className="md:col-span-5 flex flex-col gap-6">
            {/* Letterhead block */}
            <div className="ed-panel p-6 md:p-8">
              <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-vital mb-5">Direct Lines</p>
              <div className="divide-y divide-bone/10">
                {CONTACT.channels.map((c, i) => (
                  <div key={i} className="py-4">
                    <p className="font-mono text-[8.5px] uppercase tracking-[0.18em] text-muted">{c.label}</p>
                    <a
                      href={c.href}
                      target={c.href.startsWith('http') ? '_blank' : undefined}
                      rel={c.href.startsWith('http') ? 'noreferrer' : undefined}
                      className="font-mono text-[12px] text-bone hover:text-vital transition-colors mt-0.5 block ed-link"
                    >
                      {c.value}
                    </a>
                  </div>
                ))}
              </div>
            </div>

            {/* CV link */}
            <a href="#/cv" className="ed-panel p-6 md:p-8 flex items-center justify-between group hover:bg-bone/[0.03] transition-colors">
              <div>
                <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-vital">Curriculum Vitae</p>
                <p className="mt-2 font-grotesk text-xl md:text-2xl tracking-tightest text-bone uppercase group-hover:text-vital transition-colors">
                  View Full CV
                </p>
                <p className="mt-1 font-mono text-[10px] text-muted">Education · Research · Patents</p>
              </div>
              <div className="w-10 h-10 border border-bone/20 flex items-center justify-center group-hover:border-vital group-hover:text-vital transition-colors">
                <FileText className="h-4 w-4 text-bone group-hover:text-vital transition-colors" strokeWidth={1.5} />
              </div>
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 pt-6 border-t border-bone/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-steel">
            © {new Date().getFullYear()} · {PERSON.fullName} · Research Dossier
          </p>
          <div className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.22em] text-steel">
            <MapPin className="h-3 w-3 text-vital/60" strokeWidth={1.5} />
            {PERSON.location}
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify full build**

Run: `npm run build 2>&1 | tail -30`
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add src/App.tsx
git commit -m "feat: add oscilloscope grid, bio-green focus, and gear send to contact"
```

---

## Task 12: Final verification and push to GitHub

**Files:** none changed

- [ ] **Step 1: Run full build one more time**

Run: `npm run build 2>&1`
Expected: Build succeeded, no TypeScript errors

- [ ] **Step 2: Check git log**

Run: `git log --oneline -10`
Expected: See all 8+ commits from this feature

- [ ] **Step 3: Push to GitHub**

Run: `git push origin main`
Expected: `Branch 'main' set up to track remote branch 'main' from 'origin'.`

---

## Self-Review Checklist

- [x] **Spec coverage:** All 8 spec sections covered — gear watermark, blueprint parallax, cursor burst, hero brackets+crosshair, credentials blueprint reveal+tolerance, about ECG+flatline, research piston+vitals+scan-line, skills gauges, timeline stamps, contact oscilloscope+gear-send
- [x] **No placeholders:** All steps have actual code
- [x] **Type consistency:** `AnimState`, `subscribe`, `unsubscribe` defined in Task 1 and used consistently in Tasks 4+. `arcRef` in SkillGauge typed as `SVGPathElement` via cast. `tickRefs` is `(HTMLDivElement | null)[]`
- [x] **Scope:** Single cohesive feature — animation layer on top of existing portfolio
