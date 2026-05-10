# Portfolio Animation Design — Spencer Kim
Date: 2026-05-10

## Overview

Enhance Spencer Kim's portfolio with a layered, multi-aesthetic animation system that reflects his dual identity as a Mechanical Engineering + Biomedical Engineering student. All animations use a custom `requestAnimationFrame` coordinator + CSS keyframes — no new runtime dependencies.

## Color Palette

| Token | Hex | Use |
|---|---|---|
| paper | `#f4f2ee` | Background base |
| ink | `#0d0d0d` | Primary text/lines |
| editorial-red | `#c8102e` | Accent, selection |
| bio-green | `#00c8a0` | ECG/vitals/biomedical |
| blueprint-navy | `#1a3a5c` | Blueprint grid, schematic lines |

## Architecture

### Animation Engine (`src/animations.ts`)
- Central `rAF` loop that dispatches scroll velocity, mouse position, and timestamp to registered handlers
- Scroll velocity computed as `ΔscrollY / Δtime` — fed to gear RPM
- All handlers are registered/unregistered via `subscribe(id, fn)` / `unsubscribe(id)`
- IntersectionObserver wrappers for section-enter triggers (reuses existing pattern)

### File changes
- `src/animations.ts` — new animation engine + all animation logic
- `src/App.tsx` — wire up engine, replace/augment existing hooks, add new components
- `src/index.css` — add keyframes and new utility classes
- `tailwind.config.js` — add `bio-green` and `blueprint-navy` color tokens

## Global Layer (always running)

### Gear watermark
- Single SVG gear rendered behind every section at `opacity: 0.03`
- Rotates continuously; `transform: rotate(${angle}deg)` driven by rAF loop
- RPM = `baseRPM + scrollVelocity * multiplier` — clamps to [1, 60] RPM
- Pauses (eases to 0) when scroll velocity = 0 for >500ms

### Blueprint dot-grid
- Fixed CSS `radial-gradient` dot pattern at `opacity: 0.04`
- `background-position` offset by `scrollY * 0.3` for parallax (CSS custom property set by rAF)

### Paper grain
- Existing implementation retained as-is

### Custom cursor
- Replaces default cursor with a crosshair reticle (12px SVG, ink color)
- On `mouseenter` of interactive elements: cursor ring expands (scale 1→2.5, opacity 1→0 over 400ms)
- On `mousedown`: 8 short tick marks burst radially outward then fade (CSS keyframe, 300ms)
- Cursor hidden on touch devices

## Section Animations

### Hero — Mechanical boot sequence
**On load:**
1. Corner bracket pairs draw in via `stroke-dashoffset` (top-left, bottom-right simultaneously, 600ms)
2. After brackets complete: heading text types character-by-character, 40ms/char, like G-code readout
3. Subtitle fade-in after heading completes
4. Faint rotating crosshair reticle behind hero (continuous, slow — 30s/revolution)

**On scroll-out:**
- Heading letters translate `Y: 0 → -20px` with stagger, opacity 1→0 ("milled away")

### Credentials — Blueprint unfold
**On scroll-into-view:**
1. Blueprint grid SVG draws from top-left to bottom-right via `stroke-dashoffset`, 900ms
2. Each credential row enters with a "stamp" — `translateX(-8px) → 0` + brief `scale(1.02) → 1`, staggered 60ms between rows

**On row hover:**
- Dimensional tolerance annotation appears to the right: `± 0.002 in` (styled as technical annotation, fade in 200ms)
- Row background tints to `blueprint-navy` at `opacity: 0.06`

### About — Heartbeat pulse
**On scroll-into-view:**
- ECG waveform SVG traces across the section background (P-QRS-T pattern), `stroke-dashoffset` animation, 1200ms, color `bio-green` at `opacity: 0.12`
- Text paragraphs fade in timed to QRS peak moments in the trace

**On section hover:**
- `animation-duration` of ECG loop shortens from 2s → 1.2s (pulse rate increases)

**On click anywhere in section:**
- ECG flatlines (straight line replaces waveform, 300ms transition)
- Pauses 600ms
- Restarts with faster first beat then normalizes

### Research Cards — Dual-mode interaction
**At rest:**
- Each card has a small piston/crank SVG in the corner, animating at 1 cycle/3s (continuous, low opacity)

**On card hover:**
- Card border switches to `bio-green` with a pulse glow (`box-shadow` keyframe, 1.5s loop)
- Vitals readout appears at card bottom: `SpO₂  98%  |  Flow  4.2 L/min  |  ΔP  12 mmHg` (monospace, bio-green, fade in)
- Piston animation speeds up to 1 cycle/1s

**On card click (open detail):**
- Scan line sweeps top-to-bottom (white line, 300ms) before route transition
- Detail view enters with `opacity: 0 → 1` + `translateY(12px) → 0`

**On scroll-past:**
- Cards enter with `scale(0.95) → 1.02 → 1` spring overshoot (CSS cubic-bezier approximation, 500ms)

### Skills — Gauge readouts
**Rendering:**
- Each skill renders as a semicircular pressure gauge (SVG arc) with a needle
- Needle starts at 0° (empty), sweeps to proficiency angle on scroll-into-view (700ms, ease-out)

**On hover:**
- Gauge face ring highlights to `bio-green`
- Tooltip appears: proficiency reframed as `Rated Load: Expert / Advanced / Proficient`

### Timeline — Mechanical tick stamps
**Existing behavior retained** (scroll-driven rule height growth)

**Enhancements:**
- Each event tick mark "stamps" in as scroll reaches it: brief `scale(1.4) → 1` + ink-color flash (150ms)
- Hover a timeline event: schematic thumbnail fades in below the event node (uses existing schematic SVGs from `schematics.tsx`)

### Contact — Biomedical monitor
**Background:**
- Faint oscilloscope grid (CSS `linear-gradient` crosshatch, `opacity: 0.05`)

**Input fields:**
- On focus: border transitions to `bio-green`, subtle pulse glow (box-shadow keyframe)
- On blur: returns to ink border

**Send button:**
- On click: button depresses 2px (`translateY(2px)`), a small gear icon spins 360° (300ms), then button text transitions to `TRANSMITTED` for 1.5s before resetting

## Interaction Summary

| Trigger | Target | Effect |
|---|---|---|
| Page load | Hero | Boot sequence: brackets → typewriter heading |
| Scroll down | All sections | IntersectionObserver triggers section-specific reveal |
| Scroll velocity | Global gear | RPM proportional to scroll speed |
| Scroll position | Dot grid | Parallax offset |
| Hover | Research card | ECG border + vitals readout |
| Hover | About section | Pulse rate increases |
| Hover | Skill gauge | Highlight + rated-load tooltip |
| Hover | Timeline event | Schematic thumbnail |
| Hover | Credentials row | Tolerance annotation |
| Click | About section | ECG flatline + restart |
| Click | Research card | Scan-line transition |
| Click | Send button | Depress + gear spin + TRANSMITTED |
| Mousedown | Anywhere | Cursor tick-mark burst |

## CSS Additions

- `@keyframes gear-spin` — continuous rotation
- `@keyframes ecg-trace` — stroke-dashoffset path draw
- `@keyframes cursor-burst` — radial tick marks
- `@keyframes scan-line` — top-to-bottom sweep
- `@keyframes gauge-sweep` — needle rotation
- `@keyframes vitals-pulse` — bio-green box-shadow loop
- `@keyframes stamp-in` — scale punch for timeline ticks
- `@keyframes flatline` — ECG to straight line

## Non-goals

- No external animation libraries (no GSAP, no Framer Motion)
- No audio effects
- No WebGL / canvas rendering
- No changes to content, routing, or data structures
