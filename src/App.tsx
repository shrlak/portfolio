import { useEffect, useState, useRef } from 'react';
import {
  Mail, Linkedin, Github, ArrowUpRight, ArrowRight, ArrowLeft,
  FileText, ExternalLink, MapPin, Send, Menu, X,
  type LucideIcon,
} from 'lucide-react';
import {
  PERSON, HERO, CREDENTIALS, ABOUT, RESEARCH, RESEARCH_CARDS,
  PAS_DETAIL, COAG_DETAIL, CANE_DETAIL, CV, CONTACT, NAV_ITEMS,
  PUBLICATIONS, SKILLS, TIMELINE,
  type CardSlug,
} from './content';
import {
  PASDetailSchematic, CoagDetailSchematic, CaneDetailSchematic, CVSchematic,
} from './schematics';
import { PASCircuitDiagram, KaplanMeierDiagram } from './diagrams';
import { startEngine, subscribe, unsubscribe, gearPath, springStep } from './animations';

/* ── Router ───────────────────────────────────────────────────────── */

type Route =
  | { kind: 'home'; anchor: string }
  | { kind: 'detail'; slug: CardSlug }
  | { kind: 'cv' };

function parseHash(hash: string): Route {
  if (hash.startsWith('#/')) {
    const parts = hash.slice(2).split('/').filter(Boolean);
    if (parts[0] === 'research' && parts[1]) {
      const slug = parts[1] as CardSlug;
      if (slug === 'pas' || slug === 'coagulation' || slug === 'cane')
        return { kind: 'detail', slug };
    }
    if (parts[0] === 'cv') return { kind: 'cv' };
  }
  return { kind: 'home', anchor: hash || '#home' };
}

function useHashRoute(): Route {
  const [hash, setHash] = useState(
    typeof window !== 'undefined' ? window.location.hash : ''
  );
  useEffect(() => {
    const h = () => setHash(window.location.hash);
    window.addEventListener('hashchange', h);
    return () => window.removeEventListener('hashchange', h);
  }, []);
  return parseHash(hash);
}

/* ── Scroll / intersection hooks ──────────────────────────────────── */

function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('[data-reveal], [data-ink]');
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('is-revealed'); obs.unobserve(e.target); }
      }),
      { threshold: 0.06, rootMargin: '0px 0px -40px 0px' }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

function useActiveSection(ids: string[]): string {
  const [active, setActive] = useState(ids[0] ?? '');
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); }),
      { threshold: 0.35 }
    );
    ids.forEach((id) => { const el = document.getElementById(id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, [ids]);
  return active;
}

/* ── Animation hooks ──────────────────────────────────────────────── */

function useSplitFlap(target: number, digits = 2, duration = 1300) {
  const [value, setValue] = useState(0);
  const [gen, setGen] = useState(0);
  const elRef = useRef<HTMLDivElement>(null);
  const started = useRef(false);
  useEffect(() => {
    const el = elRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || started.current) return;
      started.current = true;
      obs.disconnect();
      const t0 = performance.now();
      const tick = (now: number) => {
        const t = Math.min((now - t0) / duration, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        const next = Math.round(eased * target);
        setValue(prev => { if (prev !== next) setGen(g => g + 1); return next; });
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, { threshold: 0.5 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [target, duration]);
  return { elRef, value, gen };
}

function useRowReveal(parentRef: React.RefObject<HTMLElement>, count: number, stagger = 70) {
  useEffect(() => {
    const parent = parentRef.current;
    if (!parent) return;
    const rows = Array.from(parent.querySelectorAll<HTMLElement>('.row-reveal'));
    const obs = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      obs.disconnect();
      rows.forEach((row, i) => setTimeout(() => row.classList.add('is-vis'), i * stagger));
    }, { threshold: 0.1 });
    obs.observe(parent);
    return () => obs.disconnect();
  }, [parentRef, count, stagger]);
}

function useTimelineScroll(containerRef: React.RefObject<HTMLDivElement>) {
  const lineRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const update = () => {
      const c = containerRef.current;
      const l = lineRef.current;
      if (!c || !l) return;
      const rect = c.getBoundingClientRect();
      const progress = Math.max(0, Math.min(1,
        (window.innerHeight - rect.top) / (window.innerHeight * 0.6 + rect.height * 0.4)
      ));
      l.style.height = `${progress * 100}%`;
    };
    window.addEventListener('scroll', update, { passive: true });
    update();
    return () => window.removeEventListener('scroll', update);
  }, [containerRef]);
  return lineRef;
}

/* ── Global chrome ────────────────────────────────────────────────── */

// Elevator shaft — absolutely positioned so it spans the full document height.
// Placed inside the page's position:relative wrapper so bottom:0 = page bottom.
function ElevatorShaft() {
  const FLOORS = ['G', '4', '3', '2', '1', 'B'];
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute', right: 0, top: 0, bottom: 0,
        width: 38, zIndex: 15, pointerEvents: 'none',
      }}
    >
      {/* Left guide rail — full document height */}
      <div style={{
        position: 'absolute', left: 9, top: 0, bottom: 0, width: 1,
        background: 'repeating-linear-gradient(to bottom, rgba(100,100,100,0.26) 0px, rgba(100,100,100,0.26) 3px, transparent 3px, transparent 12px)',
      }} />
      {/* Right guide rail */}
      <div style={{
        position: 'absolute', right: 9, top: 0, bottom: 0, width: 1,
        background: 'repeating-linear-gradient(to bottom, rgba(100,100,100,0.26) 0px, rgba(100,100,100,0.26) 3px, transparent 3px, transparent 12px)',
      }} />
      {/* Floor markers spread across full document height */}
      {FLOORS.map((lbl, i) => {
        const pct = (i / (FLOORS.length - 1)) * 100;
        return (
          <div key={i} style={{
            position: 'absolute', left: 0, right: 0, top: `${pct}%`,
            display: 'flex', alignItems: 'center',
            transform: 'translateY(-50%)',
          }}>
            <div style={{ flex: 1, height: 1, background: 'rgba(100,100,100,0.18)' }} />
            <span style={{
              fontFamily: 'monospace', fontSize: 6, lineHeight: 1,
              width: 10, textAlign: 'center', color: 'rgba(100,100,100,0.35)',
            }}>{lbl}</span>
          </div>
        );
      })}
    </div>
  );
}

// Elevator cabin — fixed so it stays in viewport, spring-animates with scroll.
function ElevatorScrollbar() {
  const cabinRef = useRef<HTMLDivElement>(null);
  const pctRef   = useRef<HTMLSpanElement>(null);
  const rafRef   = useRef(0);
  const posRef   = useRef({ y: 8, vy: 0 });

  useEffect(() => {
    const CAB_H  = 120;
    const MARGIN = 10;

    const tick = () => {
      const maxScroll = Math.max(1, document.body.scrollHeight - window.innerHeight);
      const frac      = Math.min(1, window.scrollY / maxScroll);
      const travel    = window.innerHeight - CAB_H - MARGIN * 2;
      const target    = MARGIN + frac * travel;

      const [ny, nv]  = springStep(posRef.current.y, target, posRef.current.vy, 0.10, 0.74);
      posRef.current  = { y: ny, vy: nv };

      if (cabinRef.current) cabinRef.current.style.transform = `translateY(${ny.toFixed(2)}px)`;
      if (pctRef.current)   pctRef.current.textContent = String(Math.round(frac * 100));
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed', right: 0, top: 0,
        width: 38, height: '100vh', zIndex: 20, pointerEvents: 'none',
      }}
    >
      {/* Cabin */}
      <div ref={cabinRef} style={{
        position: 'absolute', top: 0, left: 4, right: 4, height: 120,
        border: '1px solid rgba(200,16,46,0.48)',
        background: 'rgba(200,16,46,0.05)',
        borderRadius: 2,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        gap: 2,
      }}>
        {/* Cable attachment sheaves */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
          {[0, 1].map(j => (
            <div key={j} style={{
              width: 8, height: 8, borderRadius: '50%',
              border: '1px solid rgba(200,16,46,0.55)',
            }} />
          ))}
        </div>
        {/* Top divider */}
        <div style={{ width: '70%', height: 1, background: 'rgba(200,16,46,0.20)' }} />
        {/* Scroll % */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 1, marginTop: 6, marginBottom: 6 }}>
          <span ref={pctRef} style={{
            fontFamily: 'monospace', fontSize: 11, fontWeight: 700, lineHeight: 1,
            color: 'rgba(200,16,46,0.80)',
          }}>0</span>
          <span style={{ fontFamily: 'monospace', fontSize: 7, lineHeight: 1, color: 'rgba(200,16,46,0.45)' }}>%</span>
        </div>
        {/* Mid divider */}
        <div style={{ width: '70%', height: 1, background: 'rgba(200,16,46,0.20)' }} />
        {/* ELEV label */}
        <div style={{
          marginTop: 6,
          fontFamily: 'monospace', fontSize: 6, letterSpacing: '0.18em',
          color: 'rgba(200,16,46,0.38)', lineHeight: 1,
        }}>ELEV</div>
        {/* Bottom decorative lines */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3, marginTop: 6 }}>
          {[0.35, 0.20].map((op, i) => (
            <div key={i} style={{ width: 18, height: 1, background: `rgba(200,16,46,${op})` }} />
          ))}
        </div>
      </div>
    </div>
  );
}

function BackToTop() {
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const h = () => setVis(window.scrollY > 500);
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, []);
  if (!vis) return null;
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="back-to-top-ed"
      aria-label="Back to top"
    >
      ↑ TOP
    </button>
  );
}

function PaperGrain() {
  return <div className="paper-grain" aria-hidden="true" />;
}

function ringGearPath(cx: number, cy: number, ro: number, ri: number, teeth: number): string {
  const pts: string[] = [];
  for (let i = 0; i < teeth; i++) {
    const a0 = (i / teeth) * Math.PI * 2;
    const a1 = a0 + Math.PI / teeth * 0.35;
    const a2 = a0 + Math.PI / teeth * 0.65;
    const a3 = a0 + Math.PI / teeth;
    pts.push(
      `L${(Math.cos(a0) * ro + cx).toFixed(2)},${(Math.sin(a0) * ro + cy).toFixed(2)}`,
      `L${(Math.cos(a1) * ri + cx).toFixed(2)},${(Math.sin(a1) * ri + cy).toFixed(2)}`,
      `L${(Math.cos(a2) * ri + cx).toFixed(2)},${(Math.sin(a2) * ri + cy).toFixed(2)}`,
      `L${(Math.cos(a3) * ro + cx).toFixed(2)},${(Math.sin(a3) * ro + cy).toFixed(2)}`,
    );
  }
  return `M${(Math.cos(0) * ro + cx).toFixed(2)},${(Math.sin(0) * ro + cy).toFixed(2)} ${pts.join(' ')} Z`;
}

// ─── Unified Gearbox + Pulley Drive ─────────────────────────────────────────
// Layout: [4-gear zigzag spur cascade] → [5-planet epicyclic] → [chain+drum] → [rope] → [block-and-tackle + load]
function GearboxPulleyDrive() {
  const svgRef = useRef<SVGSVGElement>(null);

  // ── Spur cascade geometry (verified mesh distances) ──
  // G1 (input, large): cx=48, cy=148, R=19, N=20
  // G2 (small, above): cx=74, cy=131, R=11, N=10  dist=sqrt(26²+17²)≈31≈30 ✓
  // G2b compound (larger, same shaft): R=15, N=14
  // G3 (mid, below): cx=107, cy=143, R=20, N=18  dist from G2b=sqrt(33²+12²)≈35=15+20 ✓
  // G3b compound (small, same shaft): R=11, N=10
  // G4 (medium, above): cx=131, cy=131, R=15, N=13  dist from G3b=sqrt(24²+12²)≈27=11+15 ✓
  const GEARS = [
    { cx: 48,  cy: 148, r: 19, n: 20, cls: 'gpd-g1',  omega:  1.000 },  // input
    { cx: 74,  cy: 131, r: 11, n: 10, cls: 'gpd-g2',  omega: -2.000 },  // small idler
    { cx: 74,  cy: 131, r: 15, n: 14, cls: 'gpd-g2b', omega: -2.000 },  // compound on G2
    { cx: 107, cy: 143, r: 20, n: 18, cls: 'gpd-g3',  omega:  1.556 },  // driven by G2b
    { cx: 107, cy: 143, r: 11, n: 10, cls: 'gpd-g3b', omega:  1.556 },  // compound on G3
    { cx: 131, cy: 131, r: 15, n: 13, cls: 'gpd-g4',  omega: -1.040 },  // driven by G3b
  ] as const;

  // ── 5-planet epicyclic ──
  const EPI = { cx: 218, cy: 145, RS: 18, RP: 9, NR: 32, NS: 16, NP: 8, planets: 5 };
  const EPI_CARRIER_R = EPI.RS + EPI.RP; // planet orbit radius = 27
  const EPI_RING_RO = EPI.RS + 2 * EPI.RP + 8; // ring outer = 44
  const EPI_RING_RI = EPI.RS + 2 * EPI.RP - 3; // ring inner tooth tip = 33
  // ω_sun = G4.omega = -1.040; ω_carrier = ω_sun × NS/(NS+NR) = -1.04 × 16/48 = -0.347
  // ω_planet_abs = ω_carrier - (NS/NP)*(ω_sun-ω_carrier) = -0.347 - 2*(-1.04+0.347) = +1.039
  const EPI_OMEGA_SUN     = -1.040;
  const EPI_OMEGA_CARRIER = -0.347;
  const EPI_OMEGA_PL_ABS  =  1.039;

  const planetAngles5 = [0, 72, 144, 216, 288];

  const epiRingPath = ringGearPath(EPI.cx, EPI.cy, EPI_RING_RO, EPI_RING_RI, EPI.NR);
  const sunPath5    = gearPath(EPI.cx, EPI.cy, EPI.RS - 4, EPI.RS + 4, EPI.NS);
  const plPaths5    = planetAngles5.map(ba => {
    const a = ba * Math.PI / 180;
    return gearPath(EPI.cx + Math.cos(a) * EPI_CARRIER_R, EPI.cy + Math.sin(a) * EPI_CARRIER_R,
      EPI.RP - 3, EPI.RP + 3, EPI.NP);
  });
  const spurPaths = GEARS.map(g => gearPath(g.cx, g.cy, g.r - 3.5, g.r + 3.5, g.n));

  // ── Chain sprocket + drum ──
  const SPROCKET = { cx: 305, cy: 145, r: 12 };  // driven by epicyclic carrier shaft
  const DRUM     = { cx: 356, cy: 145, r: 16 };  // winch drum, ω = -0.347×12/16 = -0.260

  // ── Elevator shaft geometry (scroll indicator) ──
  const PULLEY_X    = 460;
  const GUIDE_Y     = 80;   // guide sheave fixed top
  const FIXED_Y     = 32;   // fixed pulley block top
  const INIT_LOAD_Y = 62;   // cabin start Y (scroll = 0 → top of shaft)
  const SHAFT_BOT   = 195;  // cabin end Y   (scroll = max → bottom of shaft)

  const angRef = useRef({
    g: [0, 0, 0, 0, 0, 0] as number[],
    sun: 0, carrier: 0, pl: [0, 0, 0, 0, 0] as number[],
    drum: 0,
  });
  const loadRef = useRef({ y: INIT_LOAD_Y, vy: 0 });

  useEffect(() => {
    const stop = startEngine();
    subscribe('gpd', ({ velocity, scrollY }) => {
      const rpm = Math.max(0.4, Math.min(90, 1.1 + Math.abs(velocity) * 2.3));
      const d   = rpm / 60 * 5.2;
      const ag  = angRef.current;

      // Spur cascade
      GEARS.forEach((g, i) => { ag.g[i] = (ag.g[i] + d * g.omega + 360) % 360; });

      // Epicyclic
      ag.sun     = (ag.sun     + d * EPI_OMEGA_SUN     + 360) % 360;
      ag.carrier = (ag.carrier + d * EPI_OMEGA_CARRIER + 360) % 360;
      ag.pl      = ag.pl.map(a => (a + d * EPI_OMEGA_PL_ABS + 360) % 360);

      // Drum
      ag.drum = (ag.drum + d * 0.260 + 360) % 360;

      // Elevator: true page scroll fraction → cabin position (acts as scroll bar)
      const maxScroll  = Math.max(1, document.body.scrollHeight - window.innerHeight);
      const scrollFrac = Math.min(1, scrollY / maxScroll);
      const targetY    = INIT_LOAD_Y + scrollFrac * (SHAFT_BOT - INIT_LOAD_Y);
      const [ny, nv]   = springStep(loadRef.current.y, targetY, loadRef.current.vy, 0.06, 0.78);
      loadRef.current  = { y: ny, vy: nv };
      const mY = loadRef.current.y;

      const svg = svgRef.current;
      if (!svg) return;

      // Apply spur rotations
      GEARS.forEach((g, i) => {
        const el = svg.querySelector<SVGGElement>(`.${g.cls}`);
        if (el) el.style.transform = `rotate(${ag.g[i]}deg)`;
      });

      // Epicyclic sun
      const sunEl = svg.querySelector<SVGGElement>('.gpd-epi-sun');
      if (sunEl) sunEl.style.transform = `rotate(${ag.sun}deg)`;

      // Epicyclic planets (orbit + self-spin)
      planetAngles5.forEach((ba, i) => {
        const el = svg.querySelector<SVGGElement>(`.gpd-epi-pl-${i}`);
        if (!el) return;
        const a      = ba * Math.PI / 180;
        const orbitA = (ba + ag.carrier) * Math.PI / 180;
        const px0    = EPI.cx + Math.cos(a) * EPI_CARRIER_R;
        const py0    = EPI.cy + Math.sin(a) * EPI_CARRIER_R;
        const px     = EPI.cx + Math.cos(orbitA) * EPI_CARRIER_R;
        const py     = EPI.cy + Math.sin(orbitA) * EPI_CARRIER_R;
        el.style.transform = `translate(${(px - px0).toFixed(2)}px,${(py - py0).toFixed(2)}px) rotate(${ag.pl[i]}deg)`;
      });

      // Drum rotation
      const drumEl = svg.querySelector<SVGGElement>('.gpd-drum');
      if (drumEl) drumEl.style.transform = `rotate(${ag.drum}deg)`;

      // Elevator cabin
      const movEl = svg.querySelector<SVGGElement>('.gpd-mov-block');
      if (movEl) movEl.style.transform = `translateY(${(mY - INIT_LOAD_Y).toFixed(1)}px)`;
      const pctEl = svg.querySelector<SVGTextElement>('.gpd-scroll-pct');
      if (pctEl) pctEl.textContent = `${Math.round(scrollFrac * 100)}%`;

      // Update rope strands
      const ropes = svg.querySelectorAll<SVGLineElement>('.gpd-rope');
      // Rope exits drum at top, goes left to guide, then up to fixed block, weaves between blocks
      const ropeSegs = [
        // drum top → guide sheave top
        [DRUM.cx, DRUM.cy - DRUM.r, PULLEY_X - 30, GUIDE_Y],
        // guide → fixed block left sheave
        [PULLEY_X - 30, GUIDE_Y - 10, PULLEY_X - 10, FIXED_Y + 9],
        // fixed block left → movable left
        [PULLEY_X - 10, FIXED_Y + 9, PULLEY_X - 10, mY - 9],
        // movable left → fixed block right
        [PULLEY_X - 10, mY - 9, PULLEY_X + 10, FIXED_Y + 9],
        // fixed block right → movable right → anchor bottom
        [PULLEY_X + 10, FIXED_Y + 9, PULLEY_X + 10, mY - 9],
        // anchor: movable right bottom → dead end
        [PULLEY_X + 10, mY - 9, PULLEY_X + 10, mY + 14],
      ];
      ropes.forEach((r, i) => {
        const s = ropeSegs[i];
        if (!s) return;
        r.setAttribute('x1', s[0].toFixed(1)); r.setAttribute('y1', s[1].toFixed(1));
        r.setAttribute('x2', s[2].toFixed(1)); r.setAttribute('y2', s[3].toFixed(1));
      });
    });
    return () => { unsubscribe('gpd'); stop(); };
  }, []);

  const SHEAVE_R = 9;

  return (
    <div className="gear-train-wrap" aria-hidden="true">
      <svg
        ref={svgRef}
        viewBox="0 0 560 232"
        className="gear-train-svg"
        style={{ width: 'clamp(440px, 56vw, 840px)', bottom: '0%', right: '0%', position: 'absolute' }}
      >
        {/* ══ SPUR CASCADE ══ */}
        {/* Shaft lines (compound gears share a shaft) */}
        <line x1={GEARS[1].cx} y1={GEARS[1].cy - GEARS[1].r + 1} x2={GEARS[1].cx} y2={GEARS[1].cy + GEARS[1].r - 1}
          stroke="currentColor" strokeWidth="2" opacity="0.15" />
        <line x1={GEARS[3].cx} y1={GEARS[3].cy - GEARS[3].r + 1} x2={GEARS[3].cx} y2={GEARS[3].cy + GEARS[3].r - 1}
          stroke="currentColor" strokeWidth="2" opacity="0.15" />

        {/* Spur gears: draw G2/G3 compound (inner smaller) then outer, then G1 G4 */}
        {/* G2b (compound inner) */}
        <g className="gpd-g2b" style={{ transformOrigin: `${GEARS[2].cx}px ${GEARS[2].cy}px` }}>
          <path d={spurPaths[2]} fill="currentColor" opacity="0.70" />
        </g>
        {/* G3b (compound inner) */}
        <g className="gpd-g3b" style={{ transformOrigin: `${GEARS[4].cx}px ${GEARS[4].cy}px` }}>
          <path d={spurPaths[4]} fill="currentColor" opacity="0.70" />
        </g>
        {/* G2 (outer) */}
        <g className="gpd-g2" style={{ transformOrigin: `${GEARS[1].cx}px ${GEARS[1].cy}px` }}>
          <path d={spurPaths[1]} fill="currentColor" opacity="0.88" />
          <circle cx={GEARS[1].cx} cy={GEARS[1].cy} r={GEARS[1].r * 0.35} fill="#f4f2ee" />
          <circle cx={GEARS[1].cx} cy={GEARS[1].cy} r="1.8" fill="rgba(200,16,46,0.7)" />
        </g>
        {/* G3 (outer) */}
        <g className="gpd-g3" style={{ transformOrigin: `${GEARS[3].cx}px ${GEARS[3].cy}px` }}>
          <path d={spurPaths[3]} fill="currentColor" opacity="0.88" />
          <circle cx={GEARS[3].cx} cy={GEARS[3].cy} r={GEARS[3].r * 0.30} fill="#f4f2ee" />
          <circle cx={GEARS[3].cx} cy={GEARS[3].cy} r="1.8" fill="rgba(200,16,46,0.7)" />
        </g>
        {/* G1 input */}
        <g className="gpd-g1" style={{ transformOrigin: `${GEARS[0].cx}px ${GEARS[0].cy}px` }}>
          <path d={spurPaths[0]} fill="currentColor" opacity="0.95" />
          <circle cx={GEARS[0].cx} cy={GEARS[0].cy} r={GEARS[0].r * 0.38} fill="#f4f2ee" />
          <circle cx={GEARS[0].cx} cy={GEARS[0].cy} r="3" fill="rgba(200,16,46,0.85)" />
          {[0,60,120,180,240,300].map(a => {
            const rad = a * Math.PI / 180;
            return <line key={a}
              x1={(Math.cos(rad)*GEARS[0].r*0.38+GEARS[0].cx).toFixed(1)} y1={(Math.sin(rad)*GEARS[0].r*0.38+GEARS[0].cy).toFixed(1)}
              x2={(Math.cos(rad)*GEARS[0].r*0.80+GEARS[0].cx).toFixed(1)} y2={(Math.sin(rad)*GEARS[0].r*0.80+GEARS[0].cy).toFixed(1)}
              stroke="#f4f2ee" strokeWidth="1.8" />;
          })}
        </g>
        {/* G4 output of cascade */}
        <g className="gpd-g4" style={{ transformOrigin: `${GEARS[5].cx}px ${GEARS[5].cy}px` }}>
          <path d={spurPaths[5]} fill="currentColor" opacity="0.88" />
          <circle cx={GEARS[5].cx} cy={GEARS[5].cy} r={GEARS[5].r * 0.35} fill="#f4f2ee" />
          <circle cx={GEARS[5].cx} cy={GEARS[5].cy} r="1.8" fill="rgba(200,16,46,0.7)" />
        </g>
        {/* Shaft from G4 to epicyclic input */}
        <line x1={GEARS[5].cx + GEARS[5].r} y1={GEARS[5].cy}
          x2={EPI.cx - EPI.RS - 5} y2={EPI.cy}
          stroke="currentColor" strokeWidth="2" opacity="0.15" strokeDasharray="4 3" />

        {/* ══ EPICYCLIC (5 planets) ══ */}
        {/* Housing circle */}
        <circle cx={EPI.cx} cy={EPI.cy} r={EPI_RING_RO + 6} fill="none" stroke="currentColor" strokeWidth="1" opacity="0.12" />
        <path d={epiRingPath} fill="currentColor" opacity="0.14" />

        {/* Carrier arms */}
        {planetAngles5.map((ba, i) => {
          const a = ba * Math.PI / 180;
          return <line key={`ecar-${i}`}
            x1={EPI.cx} y1={EPI.cy}
            x2={(EPI.cx + Math.cos(a) * EPI_CARRIER_R).toFixed(1)}
            y2={(EPI.cy + Math.sin(a) * EPI_CARRIER_R).toFixed(1)}
            stroke="currentColor" strokeWidth="1" opacity="0.16" />;
        })}

        {/* 5 planets */}
        {planetAngles5.map((ba, i) => {
          const a = ba * Math.PI / 180;
          const px = EPI.cx + Math.cos(a) * EPI_CARRIER_R;
          const py = EPI.cy + Math.sin(a) * EPI_CARRIER_R;
          return (
            <g key={`epl-${i}`} className={`gpd-epi-pl-${i}`} style={{ transformOrigin: `${px.toFixed(1)}px ${py.toFixed(1)}px` }}>
              <path d={plPaths5[i]} fill="currentColor" opacity="0.82" />
              <circle cx={px} cy={py} r={EPI.RP * 0.4} fill="#f4f2ee" />
              <circle cx={px} cy={py} r="1.5" fill="rgba(200,16,46,0.6)" />
            </g>
          );
        })}

        {/* Sun gear */}
        <g className="gpd-epi-sun" style={{ transformOrigin: `${EPI.cx}px ${EPI.cy}px` }}>
          <path d={sunPath5} fill="currentColor" opacity="0.96" />
          <circle cx={EPI.cx} cy={EPI.cy} r={EPI.RS * 0.40} fill="#f4f2ee" />
          <circle cx={EPI.cx} cy={EPI.cy} r="2.8" fill="rgba(200,16,46,0.85)" />
          {[0,72,144,216,288].map(a => {
            const rad = a * Math.PI / 180;
            return <line key={a}
              x1={(Math.cos(rad)*EPI.RS*0.40+EPI.cx).toFixed(1)} y1={(Math.sin(rad)*EPI.RS*0.40+EPI.cy).toFixed(1)}
              x2={(Math.cos(rad)*EPI.RS*0.82+EPI.cx).toFixed(1)} y2={(Math.sin(rad)*EPI.RS*0.82+EPI.cy).toFixed(1)}
              stroke="#f4f2ee" strokeWidth="1.5" />;
          })}
        </g>
        {planetAngles5.map((ba, i) => {
          const a = ba * Math.PI / 180;
          return <circle key={`eax-${i}`}
            cx={(EPI.cx + Math.cos(a) * EPI_CARRIER_R).toFixed(1)}
            cy={(EPI.cy + Math.sin(a) * EPI_CARRIER_R).toFixed(1)}
            r="1.8" fill="rgba(200,16,46,0.40)" />;
        })}

        {/* ══ CHAIN + DRUM ══ */}
        {/* Shaft from epicyclic output to drive sprocket */}
        <line x1={EPI.cx + EPI_RING_RO + 7} y1={EPI.cy}
          x2={SPROCKET.cx - SPROCKET.r} y2={SPROCKET.cy}
          stroke="currentColor" strokeWidth="2" opacity="0.15" strokeDasharray="4 3" />

        {/* Drive sprocket */}
        <g className="gpd-g4" style={{ transformOrigin: `${SPROCKET.cx}px ${SPROCKET.cy}px` }}>
          <path d={gearPath(SPROCKET.cx, SPROCKET.cy, SPROCKET.r - 3, SPROCKET.r + 3, 12)} fill="currentColor" opacity="0.80" />
          <circle cx={SPROCKET.cx} cy={SPROCKET.cy} r={SPROCKET.r * 0.38} fill="#f4f2ee" />
          <circle cx={SPROCKET.cx} cy={SPROCKET.cy} r="2" fill="rgba(200,16,46,0.7)" />
        </g>

        {/* Chain belt (dashed rect between sprocket and drum) */}
        <rect x={SPROCKET.cx} y={SPROCKET.cy - 6}
          width={DRUM.cx - SPROCKET.cx} height="12"
          fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.14"
          strokeDasharray="5 3" rx="1" />

        {/* Winch drum */}
        <g className="gpd-drum" style={{ transformOrigin: `${DRUM.cx}px ${DRUM.cy}px` }}>
          <circle cx={DRUM.cx} cy={DRUM.cy} r={DRUM.r} fill="none" stroke="currentColor" strokeWidth="2.5" opacity="0.80" />
          <circle cx={DRUM.cx} cy={DRUM.cy} r={DRUM.r * 0.55} fill="none" stroke="currentColor" strokeWidth="1" opacity="0.35" />
          {[0,45,90,135,180,225,270,315].map(a => {
            const rad = a * Math.PI / 180;
            return <line key={a}
              x1={(Math.cos(rad)*DRUM.r*0.55+DRUM.cx).toFixed(1)} y1={(Math.sin(rad)*DRUM.r*0.55+DRUM.cy).toFixed(1)}
              x2={(Math.cos(rad)*DRUM.r*0.88+DRUM.cx).toFixed(1)} y2={(Math.sin(rad)*DRUM.r*0.88+DRUM.cy).toFixed(1)}
              stroke="currentColor" strokeWidth="1" opacity="0.40" />;
          })}
          <circle cx={DRUM.cx} cy={DRUM.cy} r="3" fill="rgba(200,16,46,0.8)" />
        </g>

        {/* ══ ELEVATOR SHAFT + SCROLL INDICATOR ══ */}
        {/* Shaft pit background */}
        <rect x={PULLEY_X - 32} y={FIXED_Y - 6} width="64" height={SHAFT_BOT - FIXED_Y + 28}
          rx="3" fill="currentColor" opacity="0.03" />
        {/* Guide rails */}
        <line x1={PULLEY_X - 28} y1={FIXED_Y + SHEAVE_R + 4} x2={PULLEY_X - 28} y2={SHAFT_BOT + 6}
          stroke="currentColor" strokeWidth="0.5" opacity="0.18" strokeDasharray="2 6" />
        <line x1={PULLEY_X + 28} y1={FIXED_Y + SHEAVE_R + 4} x2={PULLEY_X + 28} y2={SHAFT_BOT + 6}
          stroke="currentColor" strokeWidth="0.5" opacity="0.18" strokeDasharray="2 6" />

        {/* Overhead anchor bar */}
        <rect x={PULLEY_X - 22} y="18" width="44" height="5" rx="1.5" fill="currentColor" opacity="0.40" />
        <line x1={PULLEY_X} y1="23" x2={PULLEY_X} y2={FIXED_Y - SHEAVE_R}
          stroke="currentColor" strokeWidth="1.5" opacity="0.30" />

        {/* Floor markers at 0% 25% 50% 75% 100% scroll */}
        {([0, 0.25, 0.5, 0.75, 1] as const).map((f, fi) => {
          const fy = INIT_LOAD_Y + f * (SHAFT_BOT - INIT_LOAD_Y);
          return (
            <g key={`fl-${fi}`}>
              <line x1={PULLEY_X + 30} y1={fy} x2={PULLEY_X + 40} y2={fy}
                stroke="currentColor" strokeWidth="0.6" opacity="0.22" />
              <text x={PULLEY_X + 43} y={fy + 2} fontFamily="monospace" fontSize="4"
                fill="currentColor" opacity="0.28">
                {['G', '3', '2', '1', 'B'][fi]}
              </text>
            </g>
          );
        })}

        {/* Rope strands (updated in RAF) */}
        {[0, 1, 2, 3, 4, 5].map(i => (
          <line key={i} className="gpd-rope"
            x1={DRUM.cx} y1={DRUM.cy - DRUM.r}
            x2={PULLEY_X} y2={FIXED_Y}
            stroke="currentColor" strokeWidth="1.1" opacity="0.50" />
        ))}

        {/* Guide sheave (fixed) */}
        <circle cx={PULLEY_X - 30} cy={GUIDE_Y} r="8" fill="none" stroke="currentColor" strokeWidth="1.2" opacity="0.55" />
        <circle cx={PULLEY_X - 30} cy={GUIDE_Y} r="3" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.35" />
        <line x1={PULLEY_X - 30} y1={GUIDE_Y - 3} x2={PULLEY_X - 30} y2={GUIDE_Y + 3}
          stroke="currentColor" strokeWidth="0.8" opacity="0.35" />

        {/* Fixed sheave block (top of shaft, permanently fixed) */}
        {[-10, 10].map((ox, i) => (
          <g key={`fps-${i}`}>
            <circle cx={PULLEY_X + ox} cy={FIXED_Y} r={SHEAVE_R} fill="none" stroke="currentColor" strokeWidth="1.2" opacity="0.60" />
            <circle cx={PULLEY_X + ox} cy={FIXED_Y} r={SHEAVE_R * 0.38} fill="none" stroke="currentColor" strokeWidth="0.7" opacity="0.35" />
          </g>
        ))}
        <rect x={PULLEY_X - 20} y={FIXED_Y - 3} width="40" height="6" rx="2" fill="currentColor" opacity="0.22" />

        {/* Elevator cabin (spring-animated, tracks true scroll position) */}
        <g className="gpd-mov-block">
          {/* Upper sheaves (cable attachment) */}
          {[-10, 10].map((ox, i) => (
            <g key={`mbs-${i}`}>
              <circle cx={PULLEY_X + ox} cy={INIT_LOAD_Y} r={SHEAVE_R} fill="none" stroke="currentColor" strokeWidth="1.2" opacity="0.60" />
              <circle cx={PULLEY_X + ox} cy={INIT_LOAD_Y} r={SHEAVE_R * 0.38} fill="none" stroke="currentColor" strokeWidth="0.7" opacity="0.35" />
            </g>
          ))}
          {/* Mounting bar */}
          <rect x={PULLEY_X - 20} y={INIT_LOAD_Y - 3} width="40" height="6" rx="2" fill="currentColor" opacity="0.22" />
          {/* Cabin body */}
          <rect x={PULLEY_X - 20} y={INIT_LOAD_Y + SHEAVE_R + 1} width="40" height="26" rx="2"
            fill="currentColor" opacity="0.15" stroke="currentColor" strokeWidth="0.7" strokeOpacity="0.40" />
          {/* Cabin interior dividers */}
          <line x1={PULLEY_X - 18} y1={INIT_LOAD_Y + SHEAVE_R + 9}
            x2={PULLEY_X + 18} y2={INIT_LOAD_Y + SHEAVE_R + 9}
            stroke="currentColor" strokeWidth="0.4" opacity="0.20" />
          <line x1={PULLEY_X - 18} y1={INIT_LOAD_Y + SHEAVE_R + 18}
            x2={PULLEY_X + 18} y2={INIT_LOAD_Y + SHEAVE_R + 18}
            stroke="currentColor" strokeWidth="0.4" opacity="0.20" />
          {/* Scroll % readout */}
          <text className="gpd-scroll-pct" x={PULLEY_X} y={INIT_LOAD_Y + SHEAVE_R + 15}
            textAnchor="middle" fontFamily="monospace" fontSize="5.5" fill="currentColor" opacity="0.60">0%</text>
          {/* ↕ indicator */}
          <text x={PULLEY_X - 15} y={INIT_LOAD_Y + SHEAVE_R + 23}
            fontFamily="monospace" fontSize="5" fill="currentColor" opacity="0.28">↕</text>
        </g>

      </svg>
    </div>
  );
}

// kept for reference from global app root usage — now replaced by GearboxPulleyDrive
function CompoundGearSystem() {
  const svgRef = useRef<SVGSVGElement>(null);

  // Stage 1: 4-planet epicyclic, ring fixed. Ratio = 1 + N_R1/N_S1 = 3×
  const N_S1 = 16, N_P1 = 8, N_R1 = 32;
  const R_S1 = 26, R_P1 = 13; // pitch radii (R_R1 = R_S1 + 2*R_P1 = 52)
  const CAR_R1 = R_S1 + R_P1; // planet orbit radius = 39
  const CX1 = 108, CY1 = 112;
  const PLANET_ANGLES_1 = [0, 90, 180, 270]; // 4 planets

  // Stage 2: 3-planet epicyclic, ring fixed. Ratio = 1 + N_R2/N_S2 ≈ 3.33×
  const N_S2 = 18, N_P2 = 12, N_R2 = 42; // R_R2 check: 18+2*12=42 ✓ (using R_S2=21,R_P2=14 → pitch)
  const R_S2 = 18, R_P2 = 12;
  const CAR_R2 = R_S2 + R_P2; // = 30
  const CX2 = 318, CY2 = 112;
  const PLANET_ANGLES_2 = [0, 120, 240]; // 3 planets

  // Angular velocity relationships (per frame delta d):
  // Stage 1: sun1=+d, carrier1=+d/3, planet1_self=-d (ring fixed)
  // Stage 2 input=carrier1 → sun2=+d/3, carrier2=+d/10, planet2_self=-d/4
  const angRef = useRef({
    sun1: 0, carrier1: 0, pl1: [0, 0, 0, 0],
    sun2: 0, carrier2: 0, pl2: [0, 0, 0],
  });

  // Pre-compute static gear paths
  const sun1Path = gearPath(CX1, CY1, R_S1 - 5, R_S1 + 5, N_S1);
  const pl1Paths = PLANET_ANGLES_1.map(ba => {
    const a = ba * Math.PI / 180;
    return gearPath(CX1 + Math.cos(a) * CAR_R1, CY1 + Math.sin(a) * CAR_R1, R_P1 - 4, R_P1 + 4, N_P1);
  });
  const ring1D = ringGearPath(CX1, CY1, R_S1 + 2 * R_P1 + 8, R_S1 + 2 * R_P1 - 4, N_R1);

  const sun2Path = gearPath(CX2, CY2, R_S2 - 4, R_S2 + 4, N_S2);
  const pl2Paths = PLANET_ANGLES_2.map(ba => {
    const a = ba * Math.PI / 180;
    return gearPath(CX2 + Math.cos(a) * CAR_R2, CY2 + Math.sin(a) * CAR_R2, R_P2 - 4, R_P2 + 4, N_P2);
  });
  const ring2D = ringGearPath(CX2, CY2, R_S2 + 2 * R_P2 + 7, R_S2 + 2 * R_P2 - 3, N_R2);

  useEffect(() => {
    const stop = startEngine();
    subscribe('compound-gear', ({ velocity }) => {
      const rpm = Math.max(0.4, Math.min(100, 1.2 + Math.abs(velocity) * 2.5));
      const d = rpm / 60 * 5.5;

      const ag = angRef.current;
      ag.sun1    = (ag.sun1    + d)      % 360;
      ag.carrier1 = (ag.carrier1 + d / 3)  % 360;
      ag.pl1      = ag.pl1.map(a => (a - d + 360) % 360);
      ag.sun2    = (ag.sun2    + d / 3)  % 360;
      ag.carrier2 = (ag.carrier2 + d / 10) % 360;
      ag.pl2      = ag.pl2.map(a => (a - d / 4 + 360) % 360);

      const svg = svgRef.current;
      if (!svg) return;

      const set = (cls: string, tx: string) => {
        const el = svg.querySelector<SVGGElement>(cls);
        if (el) el.style.transform = tx;
      };

      set('.cg-sun1',  `rotate(${ag.sun1}deg)`);
      set('.cg-sun2',  `rotate(${ag.sun2}deg)`);

      PLANET_ANGLES_1.forEach((ba, i) => {
        const a = ba * Math.PI / 180;
        const orbitA = (ba + ag.carrier1) * Math.PI / 180;
        const px0 = CX1 + Math.cos(a) * CAR_R1;
        const py0 = CY1 + Math.sin(a) * CAR_R1;
        const px  = CX1 + Math.cos(orbitA) * CAR_R1;
        const py  = CY1 + Math.sin(orbitA) * CAR_R1;
        const el = svg.querySelector<SVGGElement>(`.cg-pl1-${i}`);
        if (el) el.style.transform = `translate(${(px - px0).toFixed(2)}px,${(py - py0).toFixed(2)}px) rotate(${ag.pl1[i]}deg)`;
      });

      PLANET_ANGLES_2.forEach((ba, i) => {
        const a = ba * Math.PI / 180;
        const orbitA = (ba + ag.carrier2) * Math.PI / 180;
        const px0 = CX2 + Math.cos(a) * CAR_R2;
        const py0 = CY2 + Math.sin(a) * CAR_R2;
        const px  = CX2 + Math.cos(orbitA) * CAR_R2;
        const py  = CY2 + Math.sin(orbitA) * CAR_R2;
        const el = svg.querySelector<SVGGElement>(`.cg-pl2-${i}`);
        if (el) el.style.transform = `translate(${(px - px0).toFixed(2)}px,${(py - py0).toFixed(2)}px) rotate(${ag.pl2[i]}deg)`;
      });
    });
    return () => { unsubscribe('compound-gear'); stop(); };
  }, []);

  const beltY1 = CY1 - 2; // belt attach Y on stage1 output shaft
  const beltY2 = CY2 - 2;
  const beltX1 = CX1 + R_S1 + 2 * R_P1 + 12;
  const beltX2 = CX2 - R_S2 - 2 * R_P2 - 12;
  const shaftMidX = (beltX1 + beltX2) / 2;

  return (
    <div className="gear-train-wrap" aria-hidden="true">
      <svg
        ref={svgRef}
        viewBox="0 0 440 224"
        className="gear-train-svg"
        style={{ width: 'clamp(280px, 38vw, 560px)', bottom: '2%', right: '0.5%', position: 'absolute' }}
      >
        {/* ── Coupling shaft between stages ── */}
        <line x1={beltX1} y1={beltY1} x2={shaftMidX} y2={beltY1} stroke="currentColor" strokeWidth="2.5" opacity="0.18" strokeDasharray="5 3" />
        <line x1={shaftMidX} y1={beltY2} x2={beltX2} y2={beltY2} stroke="currentColor" strokeWidth="2.5" opacity="0.18" strokeDasharray="5 3" />
        <line x1={shaftMidX} y1={Math.min(beltY1,beltY2)-4} x2={shaftMidX} y2={Math.max(beltY1,beltY2)+4} stroke="currentColor" strokeWidth="1.5" opacity="0.15" />
        <circle cx={shaftMidX} cy={CY1} r="5" fill="none" stroke="currentColor" strokeWidth="1.2" opacity="0.22" />

        {/* ══ STAGE 1 ══ */}
        {/* Ring gear housing */}
        <circle cx={CX1} cy={CY1} r={R_S1 + 2 * R_P1 + 14} fill="none" stroke="currentColor" strokeWidth="1.2" opacity="0.14" />
        <path d={ring1D} fill="currentColor" opacity="0.16" />

        {/* Carrier arms */}
        {PLANET_ANGLES_1.map((ba, i) => {
          const a = ba * Math.PI / 180;
          return <line key={`ca1-${i}`}
            x1={CX1} y1={CY1}
            x2={(CX1 + Math.cos(a) * CAR_R1).toFixed(1)}
            y2={(CY1 + Math.sin(a) * CAR_R1).toFixed(1)}
            stroke="currentColor" strokeWidth="1.2" opacity="0.18"
          />;
        })}

        {/* Planet gears stage 1 */}
        {PLANET_ANGLES_1.map((ba, i) => {
          const a = ba * Math.PI / 180;
          const px = CX1 + Math.cos(a) * CAR_R1;
          const py = CY1 + Math.sin(a) * CAR_R1;
          return (
            <g key={`pl1-${i}`} className={`cg-pl1-${i}`} style={{ transformOrigin: `${px.toFixed(1)}px ${py.toFixed(1)}px` }}>
              <path d={pl1Paths[i]} fill="currentColor" opacity="0.80" />
              <circle cx={px} cy={py} r={R_P1 * 0.38} fill="#f4f2ee" />
              <circle cx={px} cy={py} r="1.8" fill="currentColor" opacity="0.7" />
            </g>
          );
        })}

        {/* Sun gear stage 1 */}
        <g className="cg-sun1" style={{ transformOrigin: `${CX1}px ${CY1}px` }}>
          <path d={sun1Path} fill="currentColor" opacity="0.95" />
          <circle cx={CX1} cy={CY1} r={R_S1 * 0.42} fill="#f4f2ee" />
          <circle cx={CX1} cy={CY1} r="3" fill="rgba(200,16,46,0.8)" />
          {[0,72,144,216,288].map(a => {
            const r = a * Math.PI / 180;
            return <line key={a}
              x1={(Math.cos(r)*R_S1*0.42+CX1).toFixed(1)} y1={(Math.sin(r)*R_S1*0.42+CY1).toFixed(1)}
              x2={(Math.cos(r)*R_S1*0.80+CX1).toFixed(1)} y2={(Math.sin(r)*R_S1*0.80+CY1).toFixed(1)}
              stroke="#f4f2ee" strokeWidth="1.8" />;
          })}
        </g>

        {/* Stage 1 axle dots */}
        {PLANET_ANGLES_1.map((ba, i) => {
          const a = ba * Math.PI / 180;
          return <circle key={`ax1-${i}`}
            cx={(CX1+Math.cos(a)*CAR_R1).toFixed(1)} cy={(CY1+Math.sin(a)*CAR_R1).toFixed(1)}
            r="2" fill="rgba(200,16,46,0.45)" />;
        })}
        <text x={CX1} y={CY1 + R_S1 + 2*R_P1 + 22} textAnchor="middle" fontFamily="monospace" fontSize="6.5" fill="currentColor" opacity="0.22">STAGE I</text>

        {/* ══ STAGE 2 ══ */}
        <circle cx={CX2} cy={CY2} r={R_S2 + 2 * R_P2 + 13} fill="none" stroke="currentColor" strokeWidth="1.2" opacity="0.14" />
        <path d={ring2D} fill="currentColor" opacity="0.16" />

        {PLANET_ANGLES_2.map((ba, i) => {
          const a = ba * Math.PI / 180;
          return <line key={`ca2-${i}`}
            x1={CX2} y1={CY2}
            x2={(CX2 + Math.cos(a) * CAR_R2).toFixed(1)}
            y2={(CY2 + Math.sin(a) * CAR_R2).toFixed(1)}
            stroke="currentColor" strokeWidth="1.2" opacity="0.18"
          />;
        })}

        {PLANET_ANGLES_2.map((ba, i) => {
          const a = ba * Math.PI / 180;
          const px = CX2 + Math.cos(a) * CAR_R2;
          const py = CY2 + Math.sin(a) * CAR_R2;
          return (
            <g key={`pl2-${i}`} className={`cg-pl2-${i}`} style={{ transformOrigin: `${px.toFixed(1)}px ${py.toFixed(1)}px` }}>
              <path d={pl2Paths[i]} fill="currentColor" opacity="0.80" />
              <circle cx={px} cy={py} r={R_P2 * 0.38} fill="#f4f2ee" />
              <circle cx={px} cy={py} r="1.8" fill="currentColor" opacity="0.7" />
            </g>
          );
        })}

        <g className="cg-sun2" style={{ transformOrigin: `${CX2}px ${CY2}px` }}>
          <path d={sun2Path} fill="currentColor" opacity="0.95" />
          <circle cx={CX2} cy={CY2} r={R_S2 * 0.42} fill="#f4f2ee" />
          <circle cx={CX2} cy={CY2} r="3" fill="rgba(200,16,46,0.8)" />
          {[0,60,120,180,240,300].map(a => {
            const r = a * Math.PI / 180;
            return <line key={a}
              x1={(Math.cos(r)*R_S2*0.42+CX2).toFixed(1)} y1={(Math.sin(r)*R_S2*0.42+CY2).toFixed(1)}
              x2={(Math.cos(r)*R_S2*0.80+CX2).toFixed(1)} y2={(Math.sin(r)*R_S2*0.80+CY2).toFixed(1)}
              stroke="#f4f2ee" strokeWidth="1.5" />;
          })}
        </g>

        {PLANET_ANGLES_2.map((ba, i) => {
          const a = ba * Math.PI / 180;
          return <circle key={`ax2-${i}`}
            cx={(CX2+Math.cos(a)*CAR_R2).toFixed(1)} cy={(CY2+Math.sin(a)*CAR_R2).toFixed(1)}
            r="2" fill="rgba(200,16,46,0.45)" />;
        })}
        <text x={CX2} y={CY2 + R_S2 + 2*R_P2 + 21} textAnchor="middle" fontFamily="monospace" fontSize="6.5" fill="currentColor" opacity="0.22">STAGE II</text>
        <text x={CX2 + R_S2 + 2*R_P2 + 6} y={CY2 + 2} fontFamily="monospace" fontSize="6" fill="currentColor" opacity="0.18">10×</text>
      </svg>
    </div>
  );
}

function PulleySystem() {
  const svgRef = useRef<SVGSVGElement>(null);
  const loadRef = useRef({ y: 52, vy: 0 });

  // Block-and-tackle: 2 sheaves per block, 4:1 mechanical advantage
  const CX_A = 22, CX_B = 50; // sheave X positions
  const FIXED_Y = 20;           // fixed block Y
  const SHEAVE_R = 9;
  const LOAD_TRAVEL = 76;       // how far movable block can descend

  useEffect(() => {
    const stop = startEngine();
    subscribe('pulley-sys', ({ velocity, scrollY }) => {
      const target = 52 + (scrollY % 300) / 300 * LOAD_TRAVEL * 0.6;
      const [ny, nv] = springStep(loadRef.current.y, target, loadRef.current.vy, 0.04, 0.82);
      loadRef.current = { y: ny, vy: nv };
      const mY = loadRef.current.y;

      const svg = svgRef.current;
      if (!svg) return;

      const movBlock = svg.querySelector<SVGGElement>('.pb-mov');
      if (movBlock) movBlock.style.transform = `translateY(${(mY - 52).toFixed(1)}px)`;

      // Update rope segments
      const ropes = svg.querySelectorAll<SVGLineElement>('.pb-rope');
      const yM = mY;
      // 5 rope strands for 4:1 MA
      const positions = [
        [CX_A, FIXED_Y + SHEAVE_R, CX_A, yM - SHEAVE_R],    // strand 0
        [CX_A, yM - SHEAVE_R, CX_B, FIXED_Y + SHEAVE_R],    // strand 1 (diagonal)
        [CX_B, FIXED_Y + SHEAVE_R, CX_B, yM - SHEAVE_R],    // strand 2
        [CX_B, yM - SHEAVE_R, CX_A + 6, FIXED_Y + SHEAVE_R],// strand 3 (diagonal)
        [CX_A + 6, FIXED_Y + SHEAVE_R, CX_A + 6, yM + 22],  // effort strand going down
      ];
      ropes.forEach((r, i) => {
        const p = positions[i];
        if (!p) return;
        r.setAttribute('x1', p[0].toFixed(1));
        r.setAttribute('y1', p[1].toFixed(1));
        r.setAttribute('x2', p[2].toFixed(1));
        r.setAttribute('y2', p[3].toFixed(1));
      });

      // Rotate sheaves
      const sheaves = svg.querySelectorAll<SVGGElement>('.pb-sheave');
      sheaves.forEach((s, i) => {
        const rot = (mY / 10) * (i % 2 === 0 ? 1 : -1) * 30;
        const cx = s.getAttribute('data-cx') || '0';
        const cy = s.getAttribute('data-cy') || '0';
        s.style.transform = `rotate(${rot % 360}deg)`;
        s.style.transformOrigin = `${cx}px ${cy}px`;
      });
    });
    return () => { unsubscribe('pulley-sys'); stop(); };
  }, []);

  const initY = 52;

  return (
    <div aria-hidden="true" style={{
      position: 'absolute', top: '10%', left: '1%',
      width: 'clamp(64px, 5.5vw, 100px)', opacity: 0.20,
      pointerEvents: 'none',
    }}>
      <svg ref={svgRef} viewBox="0 0 72 230" style={{ width: '100%', height: 'auto' }}>
        {/* Fixed overhead bar */}
        <rect x="8" y="8" width="56" height="5" rx="1.5" fill="currentColor" opacity="0.5" />
        <line x1="36" y1="13" x2="36" y2="18" stroke="currentColor" strokeWidth="2" opacity="0.4" />

        {/* Rope strands (updated in RAF) */}
        {[0,1,2,3,4].map(i => (
          <line key={i} className="pb-rope"
            x1={CX_A} y1={FIXED_Y + SHEAVE_R}
            x2={CX_A} y2={initY - SHEAVE_R}
            stroke="currentColor" strokeWidth="1" opacity="0.55"
          />
        ))}

        {/* Fixed block sheaves */}
        {[CX_A, CX_B].map((cx, i) => (
          <g key={`fs-${i}`} className="pb-sheave" data-cx={cx} data-cy={FIXED_Y}>
            <circle cx={cx} cy={FIXED_Y} r={SHEAVE_R} fill="none" stroke="currentColor" strokeWidth="1.2" />
            <circle cx={cx} cy={FIXED_Y} r={SHEAVE_R * 0.35} fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
            <line x1={cx} y1={FIXED_Y - SHEAVE_R * 0.35} x2={cx} y2={FIXED_Y + SHEAVE_R * 0.35} stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
            <line x1={cx - SHEAVE_R * 0.35} y1={FIXED_Y} x2={cx + SHEAVE_R * 0.35} y2={FIXED_Y} stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
          </g>
        ))}

        {/* Movable block (translated in RAF) */}
        <g className="pb-mov">
          {[CX_A, CX_B].map((cx, i) => (
            <g key={`ms-${i}`} className="pb-sheave" data-cx={cx} data-cy={initY}>
              <circle cx={cx} cy={initY} r={SHEAVE_R} fill="none" stroke="currentColor" strokeWidth="1.2" />
              <circle cx={cx} cy={initY} r={SHEAVE_R * 0.35} fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
              <line x1={cx} y1={initY - SHEAVE_R*0.35} x2={cx} y2={initY + SHEAVE_R*0.35} stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
              <line x1={cx-SHEAVE_R*0.35} y1={initY} x2={cx+SHEAVE_R*0.35} y2={initY} stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
            </g>
          ))}
          {/* Load block body */}
          <rect x="13" y={initY + SHEAVE_R} width="46" height="14" rx="2" fill="currentColor" opacity="0.22" />
          <line x1="36" y1={initY + SHEAVE_R} x2="36" y2={initY + SHEAVE_R + 14} stroke="currentColor" strokeWidth="0.8" opacity="0.3" />
          {/* MA label */}
          <text x="36" y={initY + SHEAVE_R + 22} textAnchor="middle" fontFamily="monospace" fontSize="5" fill="currentColor" opacity="0.5">4:1 MA</text>
        </g>

        {/* Ground label */}
        <text x="36" y="226" textAnchor="middle" fontFamily="monospace" fontSize="5" fill="currentColor" opacity="0.3">PULLEY</text>
      </svg>
    </div>
  );
}

function FourBarLinkage() {
  const svgRef = useRef<SVGSVGElement>(null);
  const angleRef = useRef(0);
  const traceRef = useRef<Array<[number, number]>>([]);
  const rafRef = useRef(0);

  // 4-bar Grashof crank-rocker linkage
  const L_CRANK = 30, L_COUPLER = 70, L_ROCKER = 55, L_GROUND = 80;
  const A_X = 20, A_Y = 100; // fixed pivot A
  const D_X = A_X + L_GROUND, D_Y = A_Y; // fixed pivot D

  useEffect(() => {
    const animate = () => {
      angleRef.current = (angleRef.current + 1.2) % 360;
      const theta = angleRef.current * Math.PI / 180;

      // B = tip of crank
      const BX = A_X + L_CRANK * Math.cos(theta);
      const BY = A_Y - L_CRANK * Math.sin(theta);

      // Solve for C: intersection of circle(B, L_COUPLER) and circle(D, L_ROCKER)
      const dx = D_X - BX, dy = D_Y - BY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < Math.abs(L_COUPLER - L_ROCKER) || dist > L_COUPLER + L_ROCKER) {
        rafRef.current = requestAnimationFrame(animate);
        return;
      }
      const a = (L_COUPLER * L_COUPLER - L_ROCKER * L_ROCKER + dist * dist) / (2 * dist);
      const h = Math.sqrt(Math.max(0, L_COUPLER * L_COUPLER - a * a));
      const mx = BX + a * dx / dist;
      const my = BY + a * dy / dist;
      const CX_val = mx + h * dy / dist;
      const CY_val = my - h * dx / dist;

      // Coupler point P (midpoint of coupler + perpendicular offset)
      const cpx = (BX + CX_val) / 2 + (CY_val - BY) * 0.4;
      const cpy = (BY + CY_val) / 2 - (CX_val - BX) * 0.4;

      // Accumulate trace
      traceRef.current.push([cpx, cpy]);
      if (traceRef.current.length > 120) traceRef.current.shift();

      const svg = svgRef.current;
      if (!svg) { rafRef.current = requestAnimationFrame(animate); return; }

      // Coupler trace path
      const traceEl = svg.querySelector<SVGPathElement>('.fb-trace');
      if (traceEl && traceRef.current.length > 2) {
        const pts = traceRef.current.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
        traceEl.setAttribute('d', pts);
      }

      // Links
      const crank = svg.querySelector<SVGLineElement>('.fb-crank');
      const coupler = svg.querySelector<SVGLineElement>('.fb-coupler');
      const rocker = svg.querySelector<SVGLineElement>('.fb-rocker');
      const couplePoint = svg.querySelector<SVGCircleElement>('.fb-cp');

      crank?.setAttribute('x2', BX.toFixed(1));
      crank?.setAttribute('y2', BY.toFixed(1));
      coupler?.setAttribute('x1', BX.toFixed(1));
      coupler?.setAttribute('y1', BY.toFixed(1));
      coupler?.setAttribute('x2', CX_val.toFixed(1));
      coupler?.setAttribute('y2', CY_val.toFixed(1));
      rocker?.setAttribute('x1', CX_val.toFixed(1));
      rocker?.setAttribute('y1', CY_val.toFixed(1));
      couplePoint?.setAttribute('cx', cpx.toFixed(1));
      couplePoint?.setAttribute('cy', cpy.toFixed(1));

      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute', top: '8%', right: '2%',
        width: 'clamp(140px, 18vw, 240px)',
        opacity: 0.22,
        pointerEvents: 'none',
        display: 'none',
      }}
      className="md:block"
    >
      <svg ref={svgRef} viewBox="0 10 200 130" width="100%" fill="none" stroke="#e8e4dd" strokeWidth="1.5">
        {/* Ground link */}
        <line x1={A_X} y1={A_Y} x2={D_X} y2={D_Y} stroke="#e8e4dd" strokeWidth="1" opacity="0.4" />
        {/* Fixed pivot markers */}
        <polygon points={`${A_X},${A_Y} ${A_X - 5},${A_Y + 8} ${A_X + 5},${A_Y + 8}`} fill="#e8e4dd" opacity="0.5" />
        <polygon points={`${D_X},${D_Y} ${D_X - 5},${D_Y + 8} ${D_X + 5},${D_Y + 8}`} fill="#e8e4dd" opacity="0.5" />
        {/* Crank circle reference */}
        <circle cx={A_X} cy={A_Y} r={L_CRANK} stroke="#e8e4dd" strokeWidth="0.4" strokeDasharray="3 4" opacity="0.3" />
        {/* Coupler trace */}
        <path className="fb-trace" stroke="#00c8a0" strokeWidth="0.8" opacity="0.7" />
        {/* Crank link */}
        <line className="fb-crank" x1={A_X} y1={A_Y} x2={A_X + L_CRANK} y2={A_Y} strokeWidth="2" />
        {/* Coupler */}
        <line className="fb-coupler" x1={A_X + L_CRANK} y1={A_Y} x2={D_X} y2={A_Y} strokeWidth="1.5" />
        {/* Rocker */}
        <line className="fb-rocker" x1={D_X} y1={A_Y} x2={D_X} y2={A_Y - L_ROCKER} strokeWidth="2" />
        {/* Joint circles */}
        <circle cx={A_X} cy={A_Y} r="3" fill="#e8e4dd" />
        <circle cx={D_X} cy={D_Y} r="3" fill="#e8e4dd" />
        {/* Moving joints */}
        <circle className="fb-b" cx={A_X + L_CRANK} cy={A_Y} r="2.5" fill="#c8102e" />
        <circle className="fb-c" cx={D_X} cy={A_Y} r="2.5" fill="#c8102e" />
        {/* Coupler point */}
        <circle className="fb-cp" cx={A_X + L_CRANK} cy={A_Y} r="3" fill="#00c8a0" opacity="0.9" />
      </svg>
    </div>
  );
}

function ScrollRPMGauge() {
  const needleRef = useRef<SVGLineElement>(null);
  const readoutRef = useRef<HTMLSpanElement>(null);
  const rpmRef = useRef(0);

  useEffect(() => {
    subscribe('rpm-gauge', ({ velocitySmooth }) => {
      const target = Math.max(0, Math.min(100, Math.abs(velocitySmooth) * 2.5));
      rpmRef.current = rpmRef.current * 0.88 + target * 0.12;
      const angle = -90 + rpmRef.current * 1.8; // -90° to +90°
      if (needleRef.current) {
        needleRef.current.style.transform = `rotate(${angle}deg)`;
      }
      if (readoutRef.current) {
        readoutRef.current.textContent = String(Math.round(rpmRef.current)).padStart(3, '0');
      }
    });
    return () => unsubscribe('rpm-gauge');
  }, []);

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed', bottom: '20px', left: '16px',
        zIndex: 100, pointerEvents: 'none',
        opacity: 0.72,
      }}
      className="hidden md:block"
    >
      <svg width="72" height="46" viewBox="0 0 72 46" fill="none" stroke="rgba(232,228,221,0.5)" strokeWidth="0.8">
        {/* Gauge arc background */}
        <path d="M6,40 A30,30 0 0,1 66,40" strokeWidth="2" opacity="0.2" />
        {/* Tick marks */}
        {[0, 25, 50, 75, 100].map(p => {
          const a = (-90 + p * 1.8) * Math.PI / 180;
          const cx = 36, cy = 40, r1 = 26, r2 = 30;
          return (
            <line key={p}
              x1={(cx + Math.cos(a) * r1).toFixed(1)} y1={(cy + Math.sin(a) * r1).toFixed(1)}
              x2={(cx + Math.cos(a) * r2).toFixed(1)} y2={(cy + Math.sin(a) * r2).toFixed(1)}
              stroke="rgba(232,228,221,0.4)" strokeWidth="1"
            />
          );
        })}
        {/* Needle */}
        <line
          ref={needleRef}
          x1="36" y1="40" x2="36" y2="14"
          stroke="#c8102e" strokeWidth="1.5" strokeLinecap="round"
          style={{ transformOrigin: '36px 40px', transform: 'rotate(-90deg)' }}
        />
        {/* Pivot */}
        <circle cx="36" cy="40" r="3" fill="rgba(232,228,221,0.6)" />
      </svg>
      <div style={{ textAlign: 'center', marginTop: '-4px' }}>
        <span ref={readoutRef} style={{ fontFamily: 'monospace', fontSize: '8px', color: 'rgba(232,228,221,0.5)', letterSpacing: '0.15em' }}>000</span>
        <span style={{ fontFamily: 'monospace', fontSize: '7px', color: 'rgba(232,228,221,0.3)', letterSpacing: '0.12em', display: 'block' }}>RPM</span>
      </div>
    </div>
  );
}

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

function SpringCursor() {
  const ringRef  = useRef<HTMLDivElement>(null);
  const dotRef   = useRef<HTMLDivElement>(null);
  const fieldRef = useRef<SVGSVGElement>(null);
  const posRef   = useRef({ x: 0, y: 0, vx: 0, vy: 0 });
  const targetRef = useRef({ x: 0, y: 0 });
  const [bursts, setBursts] = useState<Array<{x:number;y:number;id:number;color:string}>>([]);
  const [sparks, setSparks]  = useState<Array<{x:number;y:number;id:number}>>([]);
  const rafRef = useRef(0);
  const isActiveRef = useRef(false);

  useEffect(() => {
    document.body.classList.add('has-custom-cursor');

    const onMove = (e: MouseEvent) => {
      targetRef.current = { x: e.clientX, y: e.clientY };
      if (dotRef.current) {
        dotRef.current.style.left = `${e.clientX}px`;
        dotRef.current.style.top  = `${e.clientY}px`;
      }
    };

    const onDown = (e: MouseEvent) => {
      setBursts(prev => [...prev.slice(-4), { x: e.clientX, y: e.clientY, id: Date.now(), color: '#c8102e' }]);
    };

    const onEnter = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      isActiveRef.current = !!t.closest('a,button,input,textarea,select,[role=button]');
      if (ringRef.current) {
        ringRef.current.classList.toggle('is-active', isActiveRef.current);
      }
    };

    // Spring animation loop for cursor ring
    const loop = () => {
      const { x, y, vx, vy } = posRef.current;
      const { x: tx, y: ty } = targetRef.current;
      const [nx, nvx] = springStep(x, tx, vx, 0.18, 0.72);
      const [ny, nvy] = springStep(y, ty, vy, 0.18, 0.72);
      posRef.current = { x: nx, y: ny, vx: nvx, vy: nvy };

      if (ringRef.current) {
        ringRef.current.style.left = `${nx}px`;
        ringRef.current.style.top  = `${ny}px`;
      }

      // Emit sparks when ring lags behind dot significantly
      const dist = Math.sqrt((tx - nx) ** 2 + (ty - ny) ** 2);
      if (dist > 20 && Math.random() < 0.3) {
        setSparks(prev => [...prev.slice(-12), { x: nx, y: ny, id: Date.now() + Math.random() }]);
      }

      // Update field lines
      if (fieldRef.current && dist > 2) {
        const svg = fieldRef.current;
        const lines = Array.from({ length: 8 }).map((_, k) => {
          const angle = (k / 8) * Math.PI * 2;
          const strength = Math.min(1, dist / 60);
          const len = 14 + strength * 22;
          const x1 = nx + Math.cos(angle) * 5;
          const y1 = ny + Math.sin(angle) * 5;
          const x2 = nx + Math.cos(angle) * (5 + len);
          const y2 = ny + Math.sin(angle) * (5 + len);
          return `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="#1a3a5c" stroke-width="0.8" stroke-opacity="${(0.06 + strength * 0.12).toFixed(2)}" />`;
        }).join('');
        svg.innerHTML = lines;
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mousedown', onDown);
    document.addEventListener('mouseover', onEnter);
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      document.body.classList.remove('has-custom-cursor');
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mousedown', onDown);
      document.removeEventListener('mouseover', onEnter);
    };
  }, []);

  return (
    <>
      <div ref={ringRef} className="cursor-ring-spring" aria-hidden="true" />
      <div ref={dotRef}  className="cursor-dot"  aria-hidden="true" />
      {sparks.map(s => (
        <div key={s.id} className="spark-particle" aria-hidden="true"
          style={{ left: s.x + (Math.random()-0.5)*16, top: s.y + (Math.random()-0.5)*16 }}
          onAnimationEnd={() => setSparks(prev => prev.filter(p => p.id !== s.id))}
        />
      ))}
      {bursts.map(b => (
        <div key={b.id} className="cursor-burst" aria-hidden="true"
          style={{ left: b.x, top: b.y }}
          onAnimationEnd={() => setBursts(prev => prev.filter(p => p.id !== b.id))}
        >
          <svg width="48" height="48" viewBox="0 0 48 48">
            {[0,30,60,90,120,150,180,210,240,270,300,330].map(deg => {
              const rad = deg * Math.PI / 180;
              const len = 8 + Math.random() * 10;
              return <line key={deg}
                x1={(24 + Math.cos(rad)*6).toFixed(1)} y1={(24 + Math.sin(rad)*6).toFixed(1)}
                x2={(24 + Math.cos(rad)*len).toFixed(1)} y2={(24 + Math.sin(rad)*len).toFixed(1)}
                stroke={b.color} strokeWidth="1.5" strokeOpacity={(0.4+Math.random()*0.6).toFixed(2)}
              />;
            })}
          </svg>
        </div>
      ))}
      {/* Magnetic field lines radiating from cursor dot */}
      <svg
        ref={fieldRef}
        className="cursor-field-svg"
        aria-hidden="true"
        style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', pointerEvents: 'none', zIndex: 9997 }}
      />
    </>
  );
}

/* ── Split-flap stat display ──────────────────────────────────────── */

function SplitFlapStat({
  target, digits = 2, label, sub,
}: {
  target: number; digits?: number; label: string; sub: string;
}) {
  const { elRef, value, gen } = useSplitFlap(target, digits, 1400);
  return (
    <div ref={elRef} className="text-left">
      <div className="inline-flex tabular-nums" aria-label={String(target)}>
        {String(value).padStart(digits, '0').split('').map((d, i) => (
          <span
            key={`${i}-${d}-${gen}`}
            className="flap-d font-grotesk text-vital leading-none"
            style={{
              fontSize: 'clamp(28px, 5vw, 48px)',
              letterSpacing: '-0.04em',
              animationDelay: `${i * 0.04}s`,
            }}
          >{d}</span>
        ))}
      </div>
      <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-muted mt-1">
        {label} · {sub}
      </p>
    </div>
  );
}

/* ── Status badge (stamp style) ───────────────────────────────────── */

function StatusBadge({ status }: { status: string }) {
  const color =
    status === 'ACTIVE'    ? 'text-emerald-700 border-emerald-700' :
    status === 'SUBMITTED' ? 'text-vital border-vital' :
                             'text-oxygen border-oxygen';
  return <span className={`ed-stamp ${color}`}>{status}</span>;
}

/* ── Editorial link ───────────────────────────────────────────────── */

function EdLink({
  href, children, external = false, className = '',
}: {
  href: string; children: React.ReactNode; external?: boolean; className?: string;
}) {
  return (
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noreferrer' : undefined}
      className={`ed-link ${className}`}
    >
      {children}
    </a>
  );
}

/* ── Folio label ──────────────────────────────────────────────────── */

function FolioLabel({ text }: { text: string }) {
  return (
    <span className="font-mono text-[9px] uppercase tracking-[0.26em] text-muted inline-flex items-center gap-2">
      <span className="inline-block w-3 h-px bg-vital" />
      {text}
    </span>
  );
}

/* ── Section divider ──────────────────────────────────────────────── */

function SectionDivider() {
  return <div className="ed-rule" aria-hidden="true" />;
}

/* ── Socials ──────────────────────────────────────────────────────── */

const SOCIAL = [
  { icon: Mail,     href: `mailto:${PERSON.email}`,  label: 'Email',    external: false },
  { icon: Linkedin, href: PERSON.linkedin,            label: 'LinkedIn', external: true  },
  { icon: Github,   href: PERSON.github,              label: 'GitHub',   external: true  },
];

/* ── Navbar ───────────────────────────────────────────────────────── */

const SECTION_IDS = ['home', 'credentials', 'about', 'research', 'contact'];

// True page-scroll fraction (0..1) — drives the header progress rule.
function useScrollProgress(): number {
  const [p, setP] = useState(0);
  useEffect(() => {
    const update = () => {
      const max = Math.max(1, document.body.scrollHeight - window.innerHeight);
      setP(Math.min(1, Math.max(0, window.scrollY / max)));
    };
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);
  return p;
}

function Navbar({ onHome = false }: { onHome?: boolean }) {
  const active   = useActiveSection(onHome ? SECTION_IDS : []);
  const progress = useScrollProgress();
  const [menuOpen, setMenuOpen] = useState(false);

  // Sliding active indicator — measures the active link's box within the nav.
  const navRef   = useRef<HTMLDivElement>(null);
  const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const [ind, setInd] = useState({ left: 0, width: 0, visible: false });

  useEffect(() => {
    if (!onHome) { setInd((s) => ({ ...s, visible: false })); return; }
    const measure = () => {
      const el = linkRefs.current[active];
      if (el) setInd({ left: el.offsetLeft, width: el.offsetWidth, visible: true });
      else setInd((s) => ({ ...s, visible: false }));
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [active, onHome]);

  // Lock body scroll while the mobile overlay is open.
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  // Close the overlay when navigating to a hash.
  useEffect(() => {
    const close = () => setMenuOpen(false);
    window.addEventListener('hashchange', close);
    return () => window.removeEventListener('hashchange', close);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-40 bg-graphite/95 backdrop-blur-sm supports-[backdrop-filter]:bg-graphite/80">
        {/* Scroll-progress rule */}
        <div className="nav-progress-track">
          <div className="nav-progress-fill" style={{ transform: `scaleX(${progress})` }} />
        </div>

        <div className="mx-auto max-w-container px-6 md:px-10 lg:px-14 xl:px-16 py-3 flex items-center justify-between gap-6">
          {/* Logo */}
          <a href="#home" className="nav-logo group flex items-center gap-2" aria-label="Home">
            <span className="vital-dot-ed" aria-hidden="true" />
            <span className="font-grotesk text-bone text-sm tracking-[0.12em] uppercase group-hover:text-vital transition-colors">
              SK.
            </span>
          </a>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center" aria-label="Primary">
            <div ref={navRef} className="relative flex items-center">
              {NAV_ITEMS.map((item) => {
                const id = item.href.replace('#', '');
                const isActive = onHome && active === id;
                return (
                  <a
                    key={item.label}
                    ref={(el) => { linkRefs.current[id] = el; }}
                    href={item.href}
                    aria-current={isActive ? 'true' : undefined}
                    className={`nav-link font-mono text-[10px] uppercase tracking-[0.2em] px-4 py-2 transition-colors ${
                      isActive ? 'text-bone' : 'text-muted hover:text-bone'
                    }`}
                  >
                    {item.label}
                  </a>
                );
              })}
              {/* Sliding indicator */}
              <span
                aria-hidden="true"
                className="nav-indicator"
                style={{
                  left: ind.left, width: ind.width,
                  opacity: ind.visible ? 1 : 0,
                }}
              />
            </div>

            {/* CV — separated route link */}
            <span className="mx-3 h-3 w-px bg-bone/20" aria-hidden="true" />
            <a
              href="#/cv"
              className="font-mono text-[10px] uppercase tracking-[0.2em] px-3 py-1.5 border border-bone/25 text-bone hover:bg-vital hover:border-vital hover:text-graphite transition-colors"
            >
              CV
            </a>
          </nav>

          {/* Mobile toggle */}
          <button
            className="md:hidden nav-burger"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            <span className={`nav-burger-bar ${menuOpen ? 'is-x1' : ''}`} />
            <span className={`nav-burger-bar ${menuOpen ? 'is-hidden' : ''}`} />
            <span className={`nav-burger-bar ${menuOpen ? 'is-x2' : ''}`} />
          </button>
        </div>
        <div className="ed-rule" />
      </header>

      {/* Mobile full-screen overlay */}
      <div
        className={`mobile-menu md:hidden ${menuOpen ? 'is-open' : ''}`}
        aria-hidden={!menuOpen}
      >
        <div className="mobile-menu-inner">
          <p className="font-mono text-[8.5px] uppercase tracking-[0.28em] text-steel mb-8">
            {PERSON.fullName} · Navigation
          </p>
          <nav className="flex flex-col" aria-label="Mobile">
            {NAV_ITEMS.map((item, i) => {
              const id = item.href.replace('#', '');
              const isActive = onHome && active === id;
              return (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className={`mobile-menu-link ${isActive ? 'is-active' : ''}`}
                  style={{ transitionDelay: menuOpen ? `${0.06 + i * 0.05}s` : '0s' }}
                >
                  <span className="mobile-menu-num">{String(i + 1).padStart(2, '0')}</span>
                  <span>{item.label}</span>
                </a>
              );
            })}
            <a
              href="#/cv"
              onClick={() => setMenuOpen(false)}
              className="mobile-menu-link"
              style={{ transitionDelay: menuOpen ? `${0.06 + NAV_ITEMS.length * 0.05}s` : '0s' }}
            >
              <span className="mobile-menu-num">06</span>
              <span>CV</span>
            </a>
          </nav>

          <div className="mt-auto pt-10 flex items-center gap-6">
            {SOCIAL.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target={s.external ? '_blank' : undefined}
                rel={s.external ? 'noreferrer' : undefined}
                className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted hover:text-vital transition-colors"
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

/* ── Hero ─────────────────────────────────────────────────────────── */

function LiveOscilloscope() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const phaseRef  = useRef(0);
  const artPhaseRef = useRef(0);
  const rafRef    = useRef(0);
  const bpmRef    = useRef(72);
  const tRef      = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width  = canvas.offsetWidth  * dpr;
    canvas.height = canvas.offsetHeight * dpr;
    const W = canvas.width;
    const H = canvas.height;
    const MID = H / 2; // dividing line between channels

    function ecgSample(x: number): number {
      const p   = 0.15 * Math.exp(-((x - 0.2) ** 2) / 0.004);
      const qrs = x > 0.45 && x < 0.55
        ? -0.05 + 2.2 * Math.exp(-((x - 0.5) ** 2) / 0.0004) - 0.5 * Math.exp(-((x - 0.47) ** 2) / 0.0006)
        : 0;
      const twave = 0.3 * Math.exp(-((x - 0.72) ** 2) / 0.012);
      return p + qrs + twave;
    }

    // Arterial pressure waveform: rapid systolic rise, dicrotic notch at ~0.35, gradual diastolic decay
    function artSample(x: number): number {
      if (x < 0.05) return x / 0.05 * 0.9; // rapid upstroke
      if (x < 0.25) return 0.9 - (x - 0.05) / 0.2 * 0.35; // systolic decay
      if (x < 0.30) return 0.55 + ((x - 0.25) / 0.05 * 0.12 - 0.06); // dicrotic notch bump
      return 0.55 * Math.exp(-((x - 0.30) / 0.7)); // diastolic runoff
    }

    const loop = () => {
      ctx.clearRect(0, 0, W, H);

      const period = 60 / bpmRef.current;
      const speed  = 1 / period;
      phaseRef.current    = (phaseRef.current    + 0.008 * speed * 60) % 1;
      artPhaseRef.current = (artPhaseRef.current + 0.008 * speed * 60) % 1;

      // ── Channel divider ──
      ctx.strokeStyle = 'rgba(232,228,221,0.06)';
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(0, MID);
      ctx.lineTo(W, MID);
      ctx.stroke();

      // ── Channel labels ──
      ctx.fillStyle = 'rgba(0,200,160,0.35)';
      ctx.font = `${Math.round(8 * dpr)}px monospace`;
      ctx.fillText('ECG  II', 4 * dpr, 9 * dpr);
      ctx.fillStyle = 'rgba(0,200,160,0.25)';
      ctx.fillText('ART  mmHg', 4 * dpr, MID + 9 * dpr);

      // ── ECG trace (top half) ──
      ctx.strokeStyle = 'rgba(0,200,160,0.75)';
      ctx.lineWidth = 1.4 * dpr;
      ctx.shadowColor = '#00c8a0';
      ctx.shadowBlur = 3;
      ctx.beginPath();
      for (let px = 0; px < W; px++) {
        const frac = (px / W + phaseRef.current) % 1;
        const amp  = ecgSample(frac);
        const y    = MID * 0.5 - amp * MID * 0.38;
        px === 0 ? ctx.moveTo(px, y) : ctx.lineTo(px, y);
      }
      ctx.stroke();

      // ── Arterial pressure trace (bottom half) ──
      ctx.strokeStyle = 'rgba(0,200,160,0.45)';
      ctx.lineWidth = 1.2 * dpr;
      ctx.shadowColor = '#00c8a0';
      ctx.shadowBlur = 2;
      ctx.beginPath();
      for (let px = 0; px < W; px++) {
        const frac = (px / W + artPhaseRef.current) % 1;
        const amp  = artSample(frac);
        const y    = MID + MID * 0.15 + (1 - amp) * MID * 0.55;
        px === 0 ? ctx.moveTo(px, y) : ctx.lineTo(px, y);
      }
      ctx.stroke();
      ctx.shadowBlur = 0;

      // ── ECG scanline cursor ──
      const cursorX = ((1 - phaseRef.current) * W + W * 0.05) % W;
      ctx.strokeStyle = 'rgba(0,200,160,0.15)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(cursorX, 0);
      ctx.lineTo(cursorX, H);
      ctx.stroke();

      tRef.current++;
      if (tRef.current % 180 === 0) bpmRef.current = 60 + Math.floor(Math.random() * 40);

      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <div className="osc-canvas-wrap" style={{ height: '64px' }}>
      <canvas ref={canvasRef} className="osc-canvas" style={{ height: '64px', width: '100%' }} />
    </div>
  );
}

function BloodFlowParticles() {
  const containerRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<Array<{ el: HTMLDivElement; x: number; y: number; vx: number; vy: number; life: number; maxLife: number }>>([]);
  const rafRef = useRef(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    function spawn() {
      if (!container) return;
      const el = document.createElement('div');
      el.className = 'blood-particle';
      const startX = Math.random() * 100; // percentage
      el.style.left = `${startX}%`;
      el.style.top = '0%';
      container.appendChild(el);
      const maxLife = 80 + Math.random() * 60;
      particlesRef.current.push({
        el, x: startX, y: 0,
        vx: (Math.random() - 0.5) * 0.3,
        vy: 0.8 + Math.random() * 0.6,
        life: 0, maxLife,
      });
    }

    let frame = 0;
    const loop = () => {
      frame++;
      if (frame % 12 === 0 && particlesRef.current.length < 18) spawn();

      particlesRef.current = particlesRef.current.filter(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.life++;
        const fade = 1 - p.life / p.maxLife;
        p.el.style.left = `${p.x}%`;
        p.el.style.top  = `${p.y}%`;
        p.el.style.opacity = String(Math.max(0, fade * 0.7));
        if (p.life >= p.maxLife || p.y > 105) {
          container.removeChild(p.el);
          return false;
        }
        return true;
      });

      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(rafRef.current);
      particlesRef.current.forEach(p => { try { container.removeChild(p.el); } catch {} });
      particlesRef.current = [];
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      style={{
        position: 'absolute', inset: 0, overflow: 'hidden',
        pointerEvents: 'none', zIndex: 0,
      }}
    />
  );
}

function MouseParallaxHero({ children, depth = 1 }: { children: React.ReactNode; depth?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    subscribe(`parallax-hero-${depth}`, ({ mouseX, mouseY }: { mouseX: number; mouseY: number }) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const dx = (mouseX - cx) / cx;
      const dy = (mouseY - cy) / cy;
      el.style.transform = `translate(${dx * depth * 6}px, ${dy * depth * 4}px)`;
    });
    return () => unsubscribe(`parallax-hero-${depth}`);
  }, [depth]);
  return <div ref={ref} className="parallax-layer">{children}</div>;
}

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

function HeroSection() {
  return (
    <section id="home" className="relative bg-graphite overflow-hidden">
      <HeroCrosshair />
      <CornerBrackets />
      <FourBarLinkage />
      <GearboxPulleyDrive />
      <BloodFlowParticles />
      {/* Folio line */}
      <div className="relative z-[2] mx-auto max-w-container px-6 md:px-10 lg:px-14 xl:px-16 pt-10 md:pt-14">
        <p className="comp-folio font-mono text-[8.5px] uppercase tracking-[0.28em] text-muted leading-none">
          {PERSON.fullName} &nbsp;·&nbsp; Cook Cardiopulmonary Engineering Lab &nbsp;·&nbsp; Carnegie Mellon &nbsp;·&nbsp; Pittsburgh PA &nbsp;·&nbsp; 40°N 79°W &nbsp;·&nbsp; 2026
        </p>
        <div className="mt-4 comp-rule-1 ed-rule-thick" />
      </div>

      {/* Main split */}
      <div className="relative z-[2] mx-auto max-w-container px-6 md:px-10 lg:px-14 xl:px-16 py-10 md:py-16 grid md:grid-cols-[60%_40%] gap-10 md:gap-0">

        {/* Left: type */}
        <div className="pr-0 md:pr-14">
          {/* Accent phrase */}
          <MouseParallaxHero depth={1}>
            <div className="comp-accent mb-6 md:mb-8">
              <span className="font-serif-italic text-bone text-2xl sm:text-3xl md:text-4xl leading-[1.15]">
                {HERO.accent}
              </span>
            </div>
          </MouseParallaxHero>

          {/* Massive heading */}
          <MouseParallaxHero depth={2}>
            <h1 className="font-grotesk uppercase text-bone leading-[0.88] tracking-tightest" style={{ fontSize: 'clamp(64px, 11vw, 148px)' }}>
              {HERO.heading.map((line, i) => (
                <div key={i} className={`comp-hl-${i + 1}`}>
                  <span>{line}</span>
                </div>
              ))}
            </h1>
          </MouseParallaxHero>
        </div>

        {/* Right: printed data panel — desktop only */}
        <div className="hidden md:block pl-10 comp-panel border-l border-bone/20">
          <div className="ed-panel">
            {/* Header */}
            <div className="px-4 py-3 border-b border-bone flex items-center gap-2">
              <span className="vital-dot-ed shrink-0" />
              <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-vital">
                Active Study
              </span>
            </div>
            {/* Data rows */}
            {[
              { k: 'PAS · VV ECMO',        v: 'STUDY ID' },
              { k: '2 / 6',               v: 'SUBJECTS' },
              { k: '30 DAY OVINE',         v: 'ENDPOINT' },
              { k: 'VV ECMO CIRCUIT',      v: 'CIRCUIT' },
              { k: 'IV RIVAROXABAN',       v: 'ANTICOAG' },
              { k: 'COOK CPE LAB · CMU',   v: 'INSTITUTION' },
              { k: 'KR 10-2675388',        v: 'PATENT' },
              { k: 'KIPO · JUN 2024',      v: 'GRANTED' },
            ].map(({ k, v }) => (
              <div key={v} className="grid grid-cols-[40%_60%] border-b border-bone/15 last:border-0">
                <div className="px-3 py-2.5 border-r border-bone/15">
                  <p className="font-mono text-[8px] uppercase tracking-[0.14em] text-muted">{v}</p>
                </div>
                <div className="px-3 py-2.5">
                  <p className="font-mono text-[9.5px] uppercase tracking-[0.06em] text-bone">{k}</p>
                </div>
              </div>
            ))}
            <LiveOscilloscope />
          </div>

          {/* Research index mini-list */}
          <div className="mt-4 ed-panel">
            {RESEARCH_CARDS.map((card) => (
              <a
                key={card.slug}
                href={`#/research/${card.slug}`}
                className="grid grid-cols-[auto_1fr_auto] gap-3 items-center px-3 py-2.5 border-b border-bone/12 last:border-0 hover:bg-bone/[0.04] transition-colors group"
              >
                <span className="font-mono text-[8px] text-vital tracking-[0.14em]">{card.index}</span>
                <span className="font-mono text-[9px] uppercase tracking-[0.06em] text-bone truncate">
                  {card.title} {card.titleTwo}
                </span>
                <ArrowUpRight className="h-3 w-3 text-steel group-hover:text-vital transition-colors" strokeWidth={2} />
              </a>
            ))}
          </div>
        </div>

        {/* Condensed data panel — mobile only */}
        <div className="md:hidden">
          <div className="ed-panel">
            <div className="px-4 py-3 border-b border-bone flex items-center gap-2">
              <span className="vital-dot-ed shrink-0" />
              <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-vital">Active Study</span>
            </div>
            {[
              { k: 'PAS · VV ECMO', v: 'STUDY' },
              { k: '2 / 6',         v: 'SUBJECTS' },
              { k: '30 DAY OVINE',  v: 'ENDPOINT' },
              { k: 'KR 10-2675388', v: 'PATENT' },
            ].map(({ k, v }) => (
              <div key={v} className="grid grid-cols-[40%_60%] border-b border-bone/15 last:border-0">
                <div className="px-3 py-2.5 border-r border-bone/15">
                  <p className="font-mono text-[8px] uppercase tracking-[0.14em] text-muted">{v}</p>
                </div>
                <div className="px-3 py-2.5">
                  <p className="font-mono text-[9.5px] uppercase tracking-[0.06em] text-bone">{k}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 ed-panel">
            <div className="px-3 py-2 border-b border-bone/15">
              <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-muted">Instrumentation index</p>
            </div>
            {RESEARCH_CARDS.map((card) => (
              <a
                key={card.slug}
                href={`#/research/${card.slug}`}
                className="grid grid-cols-[auto_1fr_auto] gap-3 items-center px-3 py-3 border-b border-bone/12 last:border-0 active:bg-bone/[0.06] transition-colors group"
              >
                <span className="font-mono text-[8px] text-vital tracking-[0.14em]">{card.index}</span>
                <span className="font-mono text-[10px] uppercase tracking-[0.06em] text-bone truncate">
                  {card.title} {card.titleTwo}
                </span>
                <ArrowUpRight className="h-3.5 w-3.5 text-steel group-hover:text-vital transition-colors" strokeWidth={2} />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom rule + stats */}
      <div className="relative z-[2] comp-rule-2 mx-auto max-w-container px-6 md:px-10 lg:px-14 xl:px-16 ed-rule" />
      <div className="relative z-[2] comp-stats mx-auto max-w-container px-6 md:px-10 lg:px-14 xl:px-16 py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-8 sm:gap-12">
          <SplitFlapStat target={30} digits={2} label="Day" sub="Ovine endpoint" />
          <SplitFlapStat target={1}  digits={2} label="Patent" sub="KR granted" />
          <div className="text-left">
            <p className="font-grotesk text-vital leading-none" style={{ fontSize: 'clamp(28px, 5vw, 48px)', letterSpacing: '-0.04em' }}>
              ISTH
            </p>
            <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-muted mt-1">2026 · Abstract</p>
          </div>
        </div>
        <div className="flex items-center gap-5">
          {SOCIAL.map((s) => (
            <EdLink key={s.label} href={s.href} external={s.external} className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted hover:text-bone">
              {s.label}
            </EdLink>
          ))}
          <a href="#contact" className="font-mono text-[9px] uppercase tracking-[0.2em] text-vital border-b border-vital pb-px hover:text-bone hover:border-bone transition-colors">
            Open to collaboration →
          </a>
        </div>
      </div>
    </section>
  );
}

/* ── Credentials ─────────────────────────────────────────────────── */

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

function CredentialsSection() {
  const tableRef = useRef<HTMLTableSectionElement>(null);
  useRowReveal(tableRef as React.RefObject<HTMLElement>, CREDENTIALS.items.length, 80);

  return (
    <section id="credentials" className="relative ed-dark overflow-hidden">
      <BlueprintGridReveal />
      <div className="mx-auto max-w-container px-6 md:px-10 lg:px-14 xl:px-16 py-20 md:py-28">
        <div className="grid md:grid-cols-[40%_60%] gap-10 md:gap-14 items-start">

          {/* Left: folio + heading */}
          <div>
            <div className="overflow-hidden relative" data-reveal>
              <p className="folio-num absolute -top-6 -left-4 select-none pointer-events-none">02</p>
              <FolioLabel text={CREDENTIALS.tag} />
              <span className="mt-5 font-serif-italic block text-vital text-3xl sm:text-4xl md:text-5xl leading-[1.1]">
                {CREDENTIALS.accent}
              </span>
              <h2 className="mt-2 font-grotesk uppercase text-graphite leading-[0.88] tracking-tightest text-4xl sm:text-5xl md:text-6xl">
                {CREDENTIALS.heading.map((line, i) => (
                  <span key={i} className="block">{line}</span>
                ))}
              </h2>
              <p className="mt-7 font-mono text-[13px] leading-[1.8] text-steel max-w-[40ch]">
                {CREDENTIALS.statement}
              </p>
            </div>
          </div>

          {/* Right: ruled credential table */}
          <div data-reveal data-reveal-delay="2">
            <table className="w-full border-collapse">
              <tbody ref={tableRef}>
                {CREDENTIALS.items.map((item, i) => (
                  <tr key={i} className="row-reveal border-b border-white/10 group relative">
                    <td className="py-5 pr-6 align-top w-20 relative">
                      <span className="font-mono text-[8.5px] uppercase tracking-[0.18em] text-steel">{String(i + 1).padStart(2, '0')}</span>
                      <span className="tolerance-note">
                        <svg width="80" height="14" viewBox="0 0 80 14" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '4px' }}>
                          <line x1="0" y1="7" x2="70" y2="7" stroke="#1a3a5c" strokeWidth="0.5" />
                          <line x1="0" y1="3" x2="0" y2="11" stroke="#1a3a5c" strokeWidth="0.5" />
                          <line x1="70" y1="3" x2="70" y2="11" stroke="#1a3a5c" strokeWidth="0.5" />
                        </svg>
                        {`± 0.00${(i % 3) + 1}" · REF`}
                      </span>
                    </td>
                    <td className="py-5 align-top">
                      <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-steel mt-1.5">
                        {item.label}
                      </p>
                      <p className="font-grotesk text-graphite text-lg md:text-xl tracking-tightest uppercase leading-none mt-1">
                        {item.value}
                      </p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Key stats row */}
            <div className="mt-10 pt-6 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-6">
              {[
                { v: '30', u: 'Day', s: 'Survival endpoint' },
                { v: '1',  u: 'Patent', s: 'KR granted' },
                { v: '6',  u: 'Ovine', s: 'Cohort size' },
                { v: '1',  u: 'Abstract', s: 'ISTH 2026' },
              ].map((stat) => (
                <div key={stat.u}>
                  <p className="font-grotesk text-vital text-4xl md:text-5xl tracking-tightest leading-none">{stat.v}</p>
                  <p className="font-mono text-[8.5px] uppercase tracking-[0.18em] text-graphite mt-1.5">{stat.u}</p>
                  <p className="font-mono text-[8px] text-steel mt-0.5">{stat.s}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── About ───────────────────────────────────────────────────────── */

function ECGMonitor({ fast, flat }: { fast: boolean; flat: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef(0);
  const phaseRef  = useRef(0);
  const flatRef2  = useRef(flat);
  const fastRef2  = useRef(fast);

  useEffect(() => { fastRef2.current = fast; }, [fast]);
  useEffect(() => { flatRef2.current = flat; }, [flat]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const resize = () => {
      canvas.width  = canvas.offsetWidth  * dpr;
      canvas.height = canvas.offsetHeight * dpr;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // Realistic ECG Lead II: P-QRS-T at clinical proportions
    const ecgSample = (t: number): number => {
      const ph = ((t % 1) + 1) % 1;
      const p  = 0.14 * Math.exp(-Math.pow((ph - 0.12) / 0.030, 2));
      const q  = ph > 0.23 && ph < 0.27 ? -0.08 : 0;
      const r  = 0.92 * Math.exp(-Math.pow((ph - 0.28) / 0.015, 2));
      const s  = ph > 0.30 && ph < 0.34 ? -0.22 : 0;
      const tw = 0.18 * Math.exp(-Math.pow((ph - 0.50) / 0.055, 2));
      return p + q + r + s + tw;
    };

    // SpO2 plethysmography
    const spo2Sample = (t: number): number => {
      const ph = ((t % 1) + 1) % 1;
      return 0.5 + 0.44 * Math.sin(ph * Math.PI * 2) * (1 - 0.10 * Math.sin(ph * Math.PI * 4));
    };

    // Arterial pressure waveform with dicrotic notch
    const artSample = (t: number): number => {
      const ph = ((t % 1) + 1) % 1;
      const sys = 0.82 * Math.exp(-Math.pow((ph - 0.15) / 0.055, 2));
      const dic = 0.14 * Math.exp(-Math.pow((ph - 0.35) / 0.025, 2));
      const dia = 0.26 * Math.exp(-ph * 2.8);
      return sys + dic + dia;
    };

    // Real ICU monitors sweep in ~8–12 s for a standard trace
    const SWEEP_SEC = 12;

    const draw = () => {
      const W = canvas.width, H = canvas.height;
      const isFast = fastRef2.current;
      const isFlat = flatRef2.current;
      // Normal HR ~72bpm; elevated ~110bpm on hover
      const speed = isFast ? 1.52 : 1.0;
      phaseRef.current += (speed / SWEEP_SEC) * (1 / 60);

      ctx.clearRect(0, 0, W, H);

      // Deep black ICU monitor background
      ctx.fillStyle = '#050c07';
      ctx.fillRect(0, 0, W, H);

      // Outer bezel feel — very dark border
      ctx.strokeStyle = 'rgba(0,180,70,0.12)';
      ctx.lineWidth = 1 * dpr;
      ctx.strokeRect(0.5, 0.5, W - 1, H - 1);

      const PANEL_W = 120 * dpr;
      const CHART_W = W - PANEL_W;

      // ECG paper grid (classic green-on-black, 5mm squares at 25mm/s)
      const MINOR = 10 * dpr; // ~1mm
      const MAJOR = 50 * dpr; // ~5mm (major square)

      ctx.lineWidth = 0.5;
      ctx.strokeStyle = 'rgba(0,180,60,0.07)';
      for (let x = 0; x < CHART_W; x += MINOR) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
      }
      for (let y = 0; y < H; y += MINOR) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(CHART_W, y); ctx.stroke();
      }
      ctx.strokeStyle = 'rgba(0,200,80,0.13)';
      ctx.lineWidth = 0.8;
      for (let x = 0; x < CHART_W; x += MAJOR) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
      }
      for (let y = 0; y < H; y += MAJOR) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(CHART_W, y); ctx.stroke();
      }

      // Three channels: ECG 50%, SpO2 25%, ART 25%
      const CH_TOPS = [0,           H * 0.50,   H * 0.75  ];
      const CH_HTS  = [H * 0.50,    H * 0.25,   H * 0.25  ];
      const CH_CLRS = [
        { glow: 'rgba(0,255,130,0.55)',  core: 'rgba(180,255,210,0.95)' },
        { glow: 'rgba(0,210,255,0.50)',  core: 'rgba(160,240,255,0.92)' },
        { glow: 'rgba(255,210,30,0.45)', core: 'rgba(255,238,140,0.92)' },
      ];

      ctx.strokeStyle = 'rgba(0,180,60,0.18)';
      ctx.lineWidth = 1;
      CH_TOPS.slice(1).forEach(y => {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(CHART_W, y); ctx.stroke();
      });

      // Channel labels
      ['ECG II', 'SpO₂', 'ART'].forEach((lbl, i) => {
        ctx.font = `${Math.floor(7 * dpr)}px monospace`;
        ctx.fillStyle = CH_CLRS[i].glow;
        ctx.fillText(lbl, 5 * dpr, CH_TOPS[i] + 12 * dpr);
      });

      const cursorX = (phaseRef.current % 1) * CHART_W;

      const drawCh = (
        sampleFn: (t: number) => number,
        idx: number,
        amp: number,
        beatFreq: number,
      ) => {
        const top = CH_TOPS[idx], ht = CH_HTS[idx];
        const baseline = top + ht * 0.58;
        const { glow, core } = CH_CLRS[idx];
        const N = Math.floor(CHART_W);

        for (let pass = 0; pass < 2; pass++) {
          ctx.beginPath();
          ctx.shadowBlur = pass === 0 ? 11 * dpr : 2.5 * dpr;
          ctx.shadowColor = pass === 0 ? glow : core;
          ctx.strokeStyle  = pass === 0 ? glow : core;
          ctx.lineWidth    = pass === 0 ? 2.8 : 1.2;
          ctx.lineJoin = 'round';
          ctx.lineCap  = 'round';

          let pen = false;
          for (let px = 0; px < N; px++) {
            const frac = px / CHART_W;
            const dist = (frac - phaseRef.current % 1 + 1) % 1;
            if (dist < 0.025) continue; // erase band at cursor

            const t   = phaseRef.current + frac / beatFreq;
            const raw = isFlat ? 0 : sampleFn(t);
            const y   = baseline - raw * ht * amp;

            if (!pen) { ctx.moveTo(px, y); pen = true; }
            else ctx.lineTo(px, y);
          }
          ctx.stroke();
          ctx.shadowBlur = 0;
        }

        // Erase gradient ahead of cursor
        const g = ctx.createLinearGradient(cursorX - 20 * dpr, 0, cursorX + 8 * dpr, 0);
        g.addColorStop(0, 'rgba(5,12,7,0)');
        g.addColorStop(1, 'rgba(5,12,7,1)');
        ctx.fillStyle = g;
        ctx.fillRect(cursorX - 20 * dpr, top, 28 * dpr, ht);

        // Bright cursor tick
        ctx.strokeStyle = 'rgba(0,255,110,0.18)';
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(cursorX, top); ctx.lineTo(cursorX, top + ht); ctx.stroke();
      };

      const bfreq = isFast ? 1.52 : 1.0;
      drawCh(ecgSample,  0, 0.82, bfreq);
      drawCh(spo2Sample, 1, 0.60, bfreq * 0.98);
      drawCh(artSample,  2, 0.68, bfreq);

      // ── Right numeric panel ──
      const PX = CHART_W + 7 * dpr;
      ctx.fillStyle = 'rgba(3,9,5,0.97)';
      ctx.fillRect(CHART_W, 0, PANEL_W, H);
      ctx.strokeStyle = 'rgba(0,160,60,0.22)';
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(CHART_W, 0); ctx.lineTo(CHART_W, H); ctx.stroke();

      const HR  = isFast
        ? 110 + Math.round(Math.sin(Date.now() / 700) * 8)
        : 68  + Math.round(Math.sin(Date.now() / 1400) * 3);
      const SPO = isFlat ? 87 : 98 + (Math.sin(Date.now() / 3000) > 0 ? 1 : 0);
      const SYS = isFlat ? 72  : 118 + Math.round(Math.sin(Date.now() / 1100) * 4);
      const DIA = isFlat ? 38  : 76  + Math.round(Math.sin(Date.now() / 1300) * 3);

      // HR (green)
      ctx.shadowBlur = 12; ctx.shadowColor = 'rgba(0,255,130,0.6)';
      ctx.fillStyle  = isFlat ? 'rgba(255,55,55,0.95)' : 'rgba(0,255,130,0.96)';
      ctx.font = `bold ${Math.floor(32 * dpr)}px monospace`;
      ctx.fillText(`${HR}`, PX, H * 0.16);
      ctx.shadowBlur = 0;
      ctx.font = `${Math.floor(7.5 * dpr)}px monospace`;
      ctx.fillStyle = 'rgba(0,200,100,0.50)';
      ctx.fillText('HR  bpm', PX, H * 0.16 + 14 * dpr);

      // Divider
      ctx.strokeStyle = 'rgba(0,150,60,0.18)';
      ctx.lineWidth = 0.8;
      ctx.beginPath(); ctx.moveTo(PX, H * 0.35); ctx.lineTo(W - 4 * dpr, H * 0.35); ctx.stroke();

      // SpO2 (cyan)
      ctx.shadowBlur = 10; ctx.shadowColor = 'rgba(0,220,255,0.55)';
      ctx.fillStyle  = 'rgba(0,230,255,0.92)';
      ctx.font = `${Math.floor(22 * dpr)}px monospace`;
      ctx.fillText(`${SPO}%`, PX, H * 0.52);
      ctx.shadowBlur = 0;
      ctx.font = `${Math.floor(7.5 * dpr)}px monospace`;
      ctx.fillStyle = 'rgba(0,190,220,0.48)';
      ctx.fillText('SpO₂', PX, H * 0.52 + 13 * dpr);

      ctx.strokeStyle = 'rgba(0,150,60,0.18)';
      ctx.lineWidth = 0.8;
      ctx.beginPath(); ctx.moveTo(PX, H * 0.65); ctx.lineTo(W - 4 * dpr, H * 0.65); ctx.stroke();

      // ART (amber)
      ctx.shadowBlur = 10; ctx.shadowColor = 'rgba(255,210,30,0.55)';
      ctx.fillStyle  = isFlat ? 'rgba(255,80,50,0.9)' : 'rgba(255,222,60,0.92)';
      ctx.font = `${Math.floor(18 * dpr)}px monospace`;
      ctx.fillText(`${SYS}/${DIA}`, PX, H * 0.79);
      ctx.shadowBlur = 0;
      ctx.font = `${Math.floor(7.5 * dpr)}px monospace`;
      ctx.fillStyle = 'rgba(200,175,50,0.48)';
      ctx.fillText('ART mmHg', PX, H * 0.79 + 13 * dpr);

      // Pulsing alarm dot top-right of panel
      const now = Date.now();
      if (isFlat) {
        const pulse = (Math.sin(now / 160) + 1) / 2;
        ctx.beginPath();
        ctx.arc(W - 10 * dpr, 10 * dpr, 5 * dpr, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,45,45,${0.5 + pulse * 0.5})`;
        ctx.shadowBlur = 12 * pulse; ctx.shadowColor = 'rgba(255,45,45,0.9)';
        ctx.fill(); ctx.shadowBlur = 0;
        // ALARM text
        ctx.font = `bold ${Math.floor(7 * dpr)}px monospace`;
        ctx.fillStyle = `rgba(255,45,45,${0.6 + pulse * 0.4})`;
        ctx.fillText('ALARM', PX, H * 0.93);
      } else {
        const pulse = (Math.sin(now / 600) + 1) / 2;
        ctx.beginPath();
        ctx.arc(W - 10 * dpr, 10 * dpr, 3.5 * dpr, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,255,100,${0.3 + pulse * 0.55})`;
        ctx.shadowBlur = 6 * pulse; ctx.shadowColor = 'rgba(0,255,100,0.7)';
        ctx.fill(); ctx.shadowBlur = 0;
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(rafRef.current); ro.disconnect(); };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{ display: 'block', width: '100%', height: '100%', borderRadius: '4px' }}
    />
  );
}

function LaminarFlowViz() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseYRef = useRef(0.5); // 0..1 normalized (0=top, 1=bottom)
  const rafRef = useRef(0);
  const phaseRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width  = canvas.offsetWidth  * dpr;
    canvas.height = canvas.offsetHeight * dpr;
    const W = canvas.width;
    const H = canvas.height;

    // Mouse Y within the canvas controls flow rate
    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseYRef.current = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
    };
    canvas.addEventListener('mousemove', onMouseMove);

    // Hook into animation engine for scroll-driven fallback
    subscribe('laminar-flow', (_data: unknown) => {
      // Also react to global mouse Y position
    });

    const NUM_LAYERS = 6;
    const R = H / 2; // tube radius in px

    const loop = () => {
      ctx.clearRect(0, 0, W, H);

      // Flow rate: mouse Y position inverted (top = fast, bottom = slow)
      const flowRate = 0.3 + (1 - mouseYRef.current) * 0.7;
      phaseRef.current += 0.012 * flowRate;

      // Draw streamlines for each layer
      for (let i = 0; i < NUM_LAYERS; i++) {
        const r = ((i + 0.5) / NUM_LAYERS) * R; // radial position
        // Parabolic velocity: v(r) = vmax * (1 - (r/R)^2)
        const vNorm = 1 - (r / R) ** 2;
        const v = flowRate * vNorm;
        const alpha = 0.08 + vNorm * 0.2;
        const lineY_top = H / 2 - r;
        const lineY_bot = H / 2 + r;

        // Bio-green to teal gradient by layer
        const g = Math.floor(200 + vNorm * 55);
        ctx.strokeStyle = `rgba(0, ${g}, 160, ${alpha.toFixed(2)})`;
        ctx.lineWidth = (0.7 + vNorm * 1.0) * dpr;
        ctx.shadowBlur = 0;

        // Draw undulating streamline (top)
        ctx.beginPath();
        for (let px = 0; px < W; px++) {
          const phase = phaseRef.current - px / W * 4;
          const y = lineY_top + Math.sin(phase + i * 0.8) * (2 * dpr);
          px === 0 ? ctx.moveTo(px, y) : ctx.lineTo(px, y);
        }
        ctx.stroke();

        // Draw undulating streamline (bottom, mirrored)
        ctx.beginPath();
        for (let px = 0; px < W; px++) {
          const phase = phaseRef.current - px / W * 4;
          const y = lineY_bot - Math.sin(phase + i * 0.8) * (2 * dpr);
          px === 0 ? ctx.moveTo(px, y) : ctx.lineTo(px, y);
        }
        ctx.stroke();

        // Suppress unused variable warning
        void v;
      }

      // Tube wall
      ctx.strokeStyle = 'rgba(232,228,221,0.12)';
      ctx.lineWidth = 1 * dpr;
      ctx.beginPath();
      ctx.moveTo(0, 0); ctx.lineTo(W, 0);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, H); ctx.lineTo(W, H);
      ctx.stroke();

      // Labels
      ctx.fillStyle = 'rgba(0,200,160,0.3)';
      ctx.font = `${Math.round(7 * dpr)}px monospace`;
      ctx.fillText('LAMINAR  Re<2100', 4 * dpr, H - 4 * dpr);
      const rpmPct = Math.round(flowRate * 100);
      ctx.fillStyle = 'rgba(0,200,160,0.25)';
      ctx.fillText(`Q  ${rpmPct}%`, W - 28 * dpr, H - 4 * dpr);

      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafRef.current);
      canvas.removeEventListener('mousemove', onMouseMove);
      unsubscribe('laminar-flow');
    };
  }, []);

  return (
    <div style={{ position: 'relative', width: '100%', marginTop: '24px', marginBottom: '8px' }} data-reveal>
      <p style={{ fontFamily: 'monospace', fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(232,228,221,0.3)', marginBottom: '6px' }}>
        POISEUILLE FLOW · HOVER TO ADJUST Re
      </p>
      <canvas
        ref={canvasRef}
        style={{ display: 'block', width: '100%', height: '52px', cursor: 'crosshair' }}
      />
    </div>
  );
}

function AboutSection() {
  const [fast, setFast] = useState(false);
  const [flat, setFlat] = useState(false);
  const flatRef = useRef(false);
  const [bpm, setBpm] = useState(72);

  const handleClick = () => {
    if (flatRef.current) return;
    flatRef.current = true;
    setFlat(true);
    setTimeout(() => { setFlat(false); flatRef.current = false; }, 1000);
  };

  return (
    <section
      id="about"
      className="relative overflow-hidden"
      style={{ background: '#0a0f0b' }}
      onMouseEnter={() => { setFast(true); setBpm(95 + Math.floor(Math.random() * 30)); }}
      onMouseLeave={() => { setFast(false); setBpm(68 + Math.floor(Math.random() * 10)); }}
      onClick={handleClick}
    >
      <div className="mx-auto max-w-container px-6 md:px-10 lg:px-14 xl:px-16 py-20 md:py-28">

        <div className="mb-12" data-reveal>
          <p className="font-mono text-[8.5px] uppercase tracking-[0.28em] text-[#4a8a5a]">{ABOUT.tag}</p>
        </div>

        <div className="grid md:grid-cols-[45%_55%] gap-10 md:gap-16 mb-14">
          <div data-ink data-ink-delay="1">
            <p className="font-serif-italic text-[#e8e4dc] text-3xl sm:text-4xl md:text-5xl leading-[1.18]">
              "{ABOUT.accent}"
            </p>
          </div>
          <div data-reveal data-reveal-delay="2">
            <div className="ed-rule-red mb-6" style={{ width: '2.5rem' }} />
            {ABOUT.body.map((para, i) => (
              <p key={i} className="font-mono text-[13px] md:text-[14px] leading-[1.85] text-[#7a9a80] mb-4 last:mb-0">
                {para}
              </p>
            ))}
          </div>
        </div>

        {/* ECG Monitor — contained panel like a real bedside monitor */}
        <div
          className="mb-14 rounded-sm overflow-hidden"
          style={{
            height: 'clamp(200px, 28vw, 340px)',
            border: '1px solid rgba(0,180,70,0.22)',
            boxShadow: '0 0 32px rgba(0,200,80,0.06), inset 0 0 60px rgba(0,0,0,0.4)',
            cursor: 'pointer',
          }}
          data-reveal
        >
          <ECGMonitor fast={fast} flat={flat} />
        </div>

        <div className="mb-14 py-3 overflow-hidden border-t border-[rgba(0,180,70,0.12)]" data-reveal>
          <div className="marquee-outer overflow-hidden">
            <div className="marquee-track inline-flex gap-0 whitespace-nowrap" style={{ '--marquee-speed': '40s' } as React.CSSProperties}>
              {[...ABOUT.keywordRows, ...ABOUT.keywordRows].map((item, i) => (
                <span key={i} className="font-mono text-[9px] uppercase tracking-[0.22em] text-[#4a7a56] px-6">
                  {item} <span className="text-vital mx-1">·</span>
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mb-14">
          <LaminarFlowViz />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-0 md:divide-x md:divide-[rgba(0,180,70,0.15)]" data-reveal data-reveal-delay="2">
          {[
            { value: '2',   label: 'Degrees',    sub: 'ME + BME' },
            { value: '6',   label: 'Ovine',      sub: 'Cohort animals' },
            { value: '33×', label: 'Half-life',  sub: 'FXII900-PCB vs. unconjugated' },
            { value: '1',   label: 'Patent',     sub: 'KR 10-2675388 granted' },
          ].map((stat) => (
            <div key={stat.label} className="md:px-8 first:pl-0">
              <p className="font-grotesk text-vital leading-none text-5xl md:text-6xl tracking-tightest">{stat.value}</p>
              <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#c8d4c8] mt-2">{stat.label}</p>
              <p className="font-mono text-[8.5px] text-[#4a7a56] mt-0.5">{stat.sub}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-[rgba(0,180,70,0.12)] flex items-center gap-3" aria-hidden="true">
          <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-[#4a7a56]">{bpm} BPM</span>
          <span className="w-1.5 h-1.5 rounded-full bg-vital animate-pulse" />
          <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-[#4a7a56]">Click to simulate cardiac event</span>
        </div>
      </div>
    </section>
  );
}

/* ── Skills ───────────────────────────────────────────────────────── */

function SkillBar({ name, pct }: { name: string; pct: number }) {
  const barRef   = useRef<HTMLDivElement>(null);
  const pctRef   = useRef<HTMLSpanElement>(null);
  const posRef   = useRef({ val: 0, vel: 0 });
  const started  = useRef(false);
  const rafRef   = useRef(0);

  const rated =
    pct >= 80 ? 'Expert' :
    pct >= 60 ? 'Advanced' :
    pct >= 40 ? 'Proficient' :
    'Developing';

  useEffect(() => {
    const trigger = barRef.current;
    if (!trigger) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || started.current) return;
      started.current = true;
      obs.disconnect();

      const target = pct / 100;
      const loop = () => {
        const [nv, nvl] = springStep(posRef.current.val, target, posRef.current.vel, 0.06, 0.80);
        posRef.current = { val: nv, vel: nvl };

        if (barRef.current) barRef.current.style.width = `${(nv * 100).toFixed(1)}%`;
        if (pctRef.current) pctRef.current.textContent = `${Math.round(nv * 100)}%`;

        if (Math.abs(target - nv) > 0.002 || Math.abs(nvl) > 0.001)
          rafRef.current = requestAnimationFrame(loop);
      };
      rafRef.current = requestAnimationFrame(loop);
    }, { threshold: 0.3 });
    obs.observe(trigger);
    return () => { obs.disconnect(); cancelAnimationFrame(rafRef.current); };
  }, [pct]);

  return (
    <div className="skill-bar-item">
      <div className="flex items-baseline justify-between mb-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-bone leading-none">{name}</p>
        <span ref={pctRef} className="font-grotesk text-vital text-base leading-none tracking-tightest tabular-nums">0%</span>
      </div>
      <div className="skill-track">
        <div ref={barRef} className="skill-fill" style={{ width: '0%' }} />
        <div className="skill-ticks" aria-hidden="true" />
      </div>
      <div className="mt-1.5 flex items-center justify-between">
        <p className="font-mono text-[7.5px] uppercase tracking-[0.18em] text-muted">{rated}</p>
        <p className="font-mono text-[7.5px] uppercase tracking-[0.18em] text-steel">0—100</p>
      </div>
    </div>
  );
}

function SkillsSection() {
  const tableRef = useRef<HTMLDivElement>(null);
  useRowReveal(tableRef as React.RefObject<HTMLElement>, SKILLS.reduce((a, g) => a + g.items.length, 0), 50);

  return (
    <section className="relative bg-surface">
      <div className="mx-auto max-w-container px-6 md:px-10 lg:px-14 xl:px-16 py-16 md:py-20">
        <div className="mb-10" data-reveal>
          <FolioLabel text="004 · TECHNICAL SKILLS" />
          <div className="mt-4 overflow-hidden" style={{ height: '18px' }} aria-hidden="true">
            <svg viewBox="0 0 200 18" width="200" height="18" style={{ display: 'block' }}>
              {/* Worm gear thread */}
              <g className="worm-thread">
                {Array.from({ length: 14 }).map((_, i) => (
                  <ellipse key={i} cx={i * 14 + 7} cy="9" rx="5" ry="7"
                    fill="none" stroke="rgba(13,13,13,0.18)" strokeWidth="1"
                  />
                ))}
              </g>
              {/* Shaft line */}
              <line x1="0" y1="9" x2="200" y2="9" stroke="rgba(13,13,13,0.12)" strokeWidth="1.5" />
            </svg>
          </div>
        </div>

        <div ref={tableRef} className="grid md:grid-cols-2 gap-0 md:gap-px">
          {SKILLS.map((group, gi) => (
            <div key={gi} className="border-t border-bone/10 md:px-8 first:pl-0 last:pr-0">
              <div className="py-4 border-b border-bone/10">
                <p className="font-mono text-[9px] uppercase tracking-[0.24em] text-muted">{group.group}</p>
              </div>
              <div className="flex flex-col gap-5 py-6">
                {group.items.map((item) => (
                  <SkillBar key={item.name} name={item.name} pct={item.pct} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Research ────────────────────────────────────────────────────── */

function HydraulicActuator() {
  const svgRef = useRef<SVGSVGElement>(null);
  const extRef = useRef(0);          // extension 0..1
  const velRef = useRef(0);
  const particlesRef = useRef<Array<{ x: number; y: number; vy: number; life: number; maxLife: number }>>([]);
  const frameRef = useRef(0);

  useEffect(() => {
    let targetExt = 0.4;
    subscribe('hydraulic', ({ velocity }) => {
      targetExt = 0.2 + Math.min(0.8, Math.abs(velocity) * 0.06);
    });

    const loop = () => {
      // Spring toward target extension
      const [newExt, newVel] = springStep(extRef.current, targetExt, velRef.current, 0.08, 0.80);
      extRef.current = Math.max(0, Math.min(1, newExt));
      velRef.current = newVel;

      const svg = svgRef.current;
      if (svg) {
        const ext = extRef.current;

        // Rod: extends from y=36 down to y=36+ext*22
        const rodBottom = 36 + ext * 22;
        const rod = svg.querySelector<SVGRectElement>('.hyd-rod');
        if (rod) rod.setAttribute('height', String((ext * 22 + 4).toFixed(1)));

        // Piston cap moves with rod
        const cap = svg.querySelector<SVGRectElement>('.hyd-cap');
        if (cap) cap.setAttribute('y', String((rodBottom - 3).toFixed(1)));

        // Fluid fill inside cylinder: inversely proportional to extension
        const fluidH = 26 - ext * 20;
        const fluid = svg.querySelector<SVGRectElement>('.hyd-fluid');
        if (fluid) {
          fluid.setAttribute('y', String((10 + ext * 20).toFixed(1)));
          fluid.setAttribute('height', String(Math.max(0, fluidH).toFixed(1)));
        }

        // Pressure indicator: opacity proportional to extension
        const pressEl = svg.querySelector<SVGCircleElement>('.hyd-pressure');
        if (pressEl) pressEl.style.opacity = String((0.3 + ext * 0.6).toFixed(2));

        // Spawn fluid particles when extending fast
        if (Math.abs(velRef.current) > 0.015 && frameRef.current % 4 === 0) {
          particlesRef.current.push({
            x: 16 + (Math.random() - 0.5) * 8,
            y: 36 + ext * 22,
            vy: 0.4 + Math.random() * 0.6,
            life: 0, maxLife: 20 + Math.floor(Math.random() * 15),
          });
        }
        particlesRef.current = particlesRef.current.filter(p => {
          p.y += p.vy;
          p.life++;
          return p.life < p.maxLife && p.y < 65;
        });

        // Draw particles as small dots
        const pGroup = svg.querySelector<SVGGElement>('.hyd-particles');
        if (pGroup) {
          pGroup.innerHTML = particlesRef.current.map(p => {
            const fade = 1 - p.life / p.maxLife;
            return `<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="1" fill="#00c8a0" opacity="${(fade * 0.6).toFixed(2)}" />`;
          }).join('');
        }
      }

      frameRef.current++;
      requestAnimationFrame(loop);
    };
    const rid = requestAnimationFrame(loop);

    return () => {
      unsubscribe('hydraulic');
      cancelAnimationFrame(rid);
    };
  }, []);

  return (
    <div className="crank-wrap" aria-hidden="true">
      <svg ref={svgRef} className="crank-svg" width="44" height="68" viewBox="0 0 44 68" fill="none" stroke="currentColor" strokeWidth="1.2">
        {/* Cylinder body */}
        <rect x="8" y="8" width="16" height="30" rx="1" strokeOpacity="0.5" />
        {/* Cylinder cap (top) */}
        <rect x="7" y="6" width="18" height="4" rx="1" fill="currentColor" fillOpacity="0.35" />
        {/* Fluid fill */}
        <rect className="hyd-fluid" x="9" y="10" width="14" height="16" fill="#00c8a0" opacity="0.22" />
        {/* Piston seals (2 rings) */}
        <line x1="9" y1="26" x2="23" y2="26" stroke="currentColor" strokeOpacity="0.5" />
        <line x1="9" y1="29" x2="23" y2="29" stroke="currentColor" strokeOpacity="0.5" />
        {/* Rod (extends down) */}
        <rect className="hyd-rod" x="14" y="36" width="4" height="12" fill="currentColor" fillOpacity="0.6" />
        {/* Piston cap (bottom of rod) */}
        <rect className="hyd-cap" x="11" y="44" width="10" height="4" rx="1" fill="currentColor" fillOpacity="0.5" />
        {/* Pressure indicator dot */}
        <circle className="hyd-pressure" cx="32" cy="16" r="3" fill="#00c8a0" opacity="0.4" />
        <line x1="24" y1="16" x2="29" y2="16" stroke="#00c8a0" strokeWidth="0.8" opacity="0.4" />
        {/* Particles group */}
        <g className="hyd-particles" />
        {/* Mounting bracket (top) */}
        <line x1="4" y1="8" x2="8" y2="8" strokeOpacity="0.4" />
        <line x1="24" y1="8" x2="28" y2="8" strokeOpacity="0.4" />
        {/* Port lines */}
        <line x1="0" y1="14" x2="8" y2="14" strokeWidth="0.8" strokeOpacity="0.3" strokeDasharray="2 1" />
        <line x1="0" y1="24" x2="8" y2="24" strokeWidth="0.8" strokeOpacity="0.3" strokeDasharray="2 1" />
      </svg>
    </div>
  );
}

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
        className="research-card-wrap ed-entry tilt-card block px-0 py-10 md:py-14 relative"
        data-reveal
        data-reveal-delay={String(idx + 1)}
        onMouseMove={(e) => {
          const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
          const x = (e.clientX - rect.left) / rect.width - 0.5;
          const y = (e.clientY - rect.top) / rect.height - 0.5;
          (e.currentTarget as HTMLElement).style.transform = `perspective(800px) rotateY(${x * 4}deg) rotateX(${-y * 2}deg) translateZ(4px)`;
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.transform = '';
        }}
      >
        <HydraulicActuator />
        <div className="grid md:grid-cols-[auto_1fr_auto] gap-4 md:gap-10 items-start">
          <div className="shrink-0 pt-1">
            <p className="font-mono text-[9px] uppercase tracking-[0.22em] e-vital text-vital">{card.index}</p>
            <p className="font-mono text-[8.5px] uppercase tracking-[0.14em] e-muted text-muted mt-1">{card.category}</p>
          </div>

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

        <div className="vitals-readout">
          SpO₂ 98% &nbsp;|&nbsp; Flow 4.2 L/min &nbsp;|&nbsp; ΔP 12 mmHg
        </div>
      </a>
    </>
  );
}

function ResearchSection() {
  return (
    <section id="research" className="relative bg-graphite eng-grid">
      <div className="mx-auto max-w-container px-6 md:px-10 lg:px-14 xl:px-16 py-14 md:py-20">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-0" data-reveal>
          <div>
            <FolioLabel text={RESEARCH.tag} />
            <h2 className="mt-5 font-grotesk uppercase text-bone leading-[0.88] tracking-tightest text-5xl sm:text-6xl md:text-7xl lg:text-8xl">
              <span className="block">{RESEARCH.headingTop}</span>
              <span className="font-serif-italic block text-vital normal-case leading-none mt-1">
                {RESEARCH.headingAccent}
              </span>
            </h2>
          </div>
          <EdLink href="#/cv" className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted hover:text-bone shrink-0">
            {RESEARCH.cta} →
          </EdLink>
        </div>

        {/* Entries */}
        <div className="divide-y-2 divide-bone">
          {RESEARCH_CARDS.map((card, i) => (
            <ResearchEntry key={card.slug} card={card} idx={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Publications ────────────────────────────────────────────────── */

function PublicationsSection() {
  return (
    <section className="relative ed-dark">
      <div className="mx-auto max-w-container px-6 md:px-10 lg:px-14 xl:px-16 py-20 md:py-28">
        <div className="mb-14" data-reveal>
          <FolioLabel text="006 · Publications + Abstracts" />
        </div>

        <div className="flex flex-col gap-8">
          {PUBLICATIONS.map((pub, i) => (
            <article
              key={i}
              data-reveal
              data-reveal-delay={String(i + 1)}
              className="rounded-sm p-8 md:p-10"
              style={{ border: '1px solid rgba(244,242,238,0.12)' }}
            >
              {/* Header row: status · conference · year */}
              <div className="flex flex-wrap items-center gap-3 mb-7">
                <StatusBadge status={pub.status} />
                <span className="font-mono text-[10px] uppercase tracking-[0.18em]"
                  style={{ color: 'rgba(244,242,238,0.50)' }}>
                  {pub.conference}
                </span>
                <span className="ml-auto font-grotesk text-vital leading-none tracking-tightest"
                  style={{ fontSize: 'clamp(26px, 3.5vw, 40px)' }}>
                  {pub.year}
                </span>
              </div>

              {/* Title */}
              <p className="font-serif-italic text-graphite leading-[1.45] mb-7"
                style={{ fontSize: 'clamp(17px, 2.2vw, 24px)' }}>
                {pub.title}
              </p>

              {/* Divider */}
              <div className="mb-6" style={{ height: '1px', background: 'rgba(244,242,238,0.09)' }} />

              {/* Authors */}
              <div className="mb-5">
                <p className="font-mono text-[9px] uppercase tracking-[0.22em] mb-2"
                  style={{ color: 'rgba(244,242,238,0.38)' }}>Authors</p>
                <p className="font-mono leading-[1.95]" style={{ fontSize: '13px', color: 'rgba(244,242,238,0.76)' }}>
                  {pub.authors.split('Kim S*').map((part, pi, arr) =>
                    pi < arr.length - 1
                      ? <span key={pi}>{part}<span style={{ color: '#c8102e' }}>Kim S*</span></span>
                      : <span key={pi}>{part}</span>
                  )}
                </p>
                <p className="font-mono text-[9px] mt-2" style={{ color: 'rgba(244,242,238,0.35)' }}>
                  * Spencer Kim
                </p>
              </div>

              {/* Venue */}
              <p className="font-mono text-[11px] leading-[1.65]"
                style={{ color: 'rgba(244,242,238,0.48)' }}>
                {pub.venue}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Timeline ────────────────────────────────────────────────────── */

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
          <div className="absolute left-0 top-0 w-px bg-bone/10 h-full" />
          <div ref={lineRef} className="timeline-vr" />

          {TIMELINE.map((node, i) => (
            <div
              key={i}
              data-reveal
              data-reveal-delay={String((i % 4) + 1)}
              className="relative pb-8 md:pb-10 last:pb-0"
            >
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

/* ── Contact ─────────────────────────────────────────────────────── */

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

        <div className="grid md:grid-cols-12 gap-6 md:gap-10">
          <form onSubmit={handleSubmit} className="md:col-span-7">
            <div className="mb-6 flex items-center justify-between border-b border-bone/10 pb-4">
              <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-vital">Direct dispatch</p>
              <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-steel">Opens mail client</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: 'Name',    type: 'text',  value: name,    setter: setName,    placeholder: 'Your name',              span: 1, autoComplete: 'name',    required: true  },
                { label: 'Email',   type: 'email', value: email,   setter: setEmail,   placeholder: 'you@domain.com',         span: 1, autoComplete: 'email',   required: true  },
                { label: 'Subject', type: 'text',  value: subject, setter: setSubject, placeholder: 'Collaboration · inquiry', span: 2, autoComplete: 'off',     required: false },
              ].map((f) => (
                <label key={f.label} className={`block ${f.span === 2 ? 'sm:col-span-2' : ''}`}>
                  <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted block mb-1.5">
                    {f.label}{f.required && <span className="text-vital ml-1">*</span>}
                  </span>
                  <input
                    type={f.type} value={f.value}
                    onChange={(e) => f.setter(e.target.value)}
                    placeholder={f.placeholder}
                    autoComplete={f.autoComplete}
                    required={f.required}
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

          <div className="md:col-span-5 flex flex-col gap-6">
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

      </div>
    </section>
  );
}

/* ── Footer ──────────────────────────────────────────────────────── */

function Footer() {
  return (
    <footer className="ed-dark relative">
      <div className="ed-rule" />
      <div className="mx-auto max-w-container px-6 md:px-10 lg:px-14 xl:px-16 py-14 md:py-16">
        <div className="grid gap-10 md:grid-cols-12">
          {/* Brand */}
          <div className="md:col-span-5">
            <a href="#home" className="inline-flex items-center gap-2 group">
              <span className="vital-dot-ed" aria-hidden="true" />
              <span className="font-grotesk text-graphite text-base tracking-[0.12em] uppercase group-hover:text-vital transition-colors">SK.</span>
            </a>
            <p className="mt-5 font-serif-italic text-graphite text-2xl md:text-3xl leading-[1.15] max-w-[24ch]">
              Engineering at the body–device interface.
            </p>
            <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.2em] text-steel">
              {PERSON.institution} · {PERSON.classYear}
            </p>
          </div>

          {/* Navigate */}
          <div className="md:col-span-3">
            <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-vital mb-4">Navigate</p>
            <ul className="space-y-2.5">
              {NAV_ITEMS.map((n) => (
                <li key={n.label}>
                  <a href={n.href} className="ed-link font-mono text-[11px] uppercase tracking-[0.14em] text-steel hover:text-graphite transition-colors">{n.label}</a>
                </li>
              ))}
              <li>
                <a href="#/cv" className="ed-link font-mono text-[11px] uppercase tracking-[0.14em] text-steel hover:text-graphite transition-colors">CV</a>
              </li>
            </ul>
          </div>

          {/* Research */}
          <div className="md:col-span-2">
            <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-vital mb-4">Research</p>
            <ul className="space-y-2.5">
              {RESEARCH_CARDS.map((c) => (
                <li key={c.slug}>
                  <a href={`#/research/${c.slug}`} className="ed-link font-mono text-[11px] uppercase tracking-[0.14em] text-steel hover:text-graphite transition-colors">{c.title} {c.titleTwo}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div className="md:col-span-2">
            <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-vital mb-4">Connect</p>
            <ul className="space-y-2.5">
              {SOCIAL.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target={s.external ? '_blank' : undefined}
                    rel={s.external ? 'noreferrer' : undefined}
                    className="ed-link font-mono text-[11px] uppercase tracking-[0.14em] text-steel hover:text-graphite transition-colors"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-steel">
            © {new Date().getFullYear()} · {PERSON.fullName} · Research Dossier
          </p>
          <div className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.2em] text-steel">
            <MapPin className="h-3 w-3 text-vital/60" strokeWidth={1.5} /> {PERSON.location}
          </div>
          <a href="#home" className="font-mono text-[9px] uppercase tracking-[0.2em] text-steel hover:text-graphite transition-colors inline-flex items-center gap-1.5">
            Back to top <span aria-hidden="true">↑</span>
          </a>
        </div>
      </div>
    </footer>
  );
}

/* ── Home page ───────────────────────────────────────────────────── */

function HomePage() {
  useScrollReveal();
  return (
    <>
      <HeroSection />
      <SectionDivider />
      <CredentialsSection />
      <SectionDivider />
      <AboutSection />
      <SectionDivider />
      <SkillsSection />
      <SectionDivider />
      <ResearchSection />
      <SectionDivider />
      <PublicationsSection />
      <SectionDivider />
      <TimelineStrip />
      <SectionDivider />
      <ContactSection />
      <Footer />
    </>
  );
}

/* ── Detail shell ────────────────────────────────────────────────── */

function ProjectPager({ slug }: { slug: CardSlug }) {
  const others = RESEARCH_CARDS.filter((c) => c.slug !== slug);
  return (
    <section className="border-t border-bone/12 pt-12 md:pt-16">
      <div className="flex items-center justify-between mb-8" data-reveal>
        <FolioLabel text="More research" />
        <EdLink href="#research" className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted hover:text-bone">
          All instruments →
        </EdLink>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {others.map((c, i) => (
          <a
            key={c.slug}
            href={`#/research/${c.slug}`}
            data-reveal
            data-reveal-delay={String(i + 1)}
            className="panel-lift ed-panel block p-6 md:p-8 group hover:border-vital"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-vital">{c.index}</span>
              <span className="font-mono text-[8px] uppercase tracking-[0.18em] text-steel">{c.status}</span>
            </div>
            <h3 className="mt-4 font-grotesk uppercase text-bone leading-[0.9] tracking-tightest text-3xl md:text-4xl group-hover:text-vital transition-colors">
              {c.title} {c.titleTwo}
            </h3>
            <p className="mt-3 font-serif-italic text-muted text-lg leading-snug">{c.subtitle}</p>
            <div className="mt-5 flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.2em] text-muted group-hover:text-bone transition-colors">
              Open dossier <ArrowRight className="h-3 w-3" strokeWidth={2} />
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

function DetailShell({
  slug, index, category, shortTitle, fullTitle, subtitle, meta, schematic, children, accent,
}: {
  slug: CardSlug;
  index: string; category: string; shortTitle: string; fullTitle: string;
  subtitle: string; meta: Array<{ label: string; value: string }>;
  schematic: JSX.Element; children: React.ReactNode; accent: string;
}) {
  useScrollReveal();
  return (
    <div className="relative min-h-screen bg-graphite text-bone page-enter">
      <a href="#main-content" className="skip-link">Skip to content</a>
      <PaperGrain />
      <Navbar />
      <div className="mx-auto max-w-container px-6 md:px-10 lg:px-14 xl:px-16">
        {/* Breadcrumb */}
        <nav className="pt-6 md:pt-8 flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.2em] text-steel" aria-label="Breadcrumb">
          <EdLink href="#research" className="hover:text-bone inline-flex items-center gap-1.5">
            <ArrowLeft className="h-3 w-3" strokeWidth={2} /> Research index
          </EdLink>
          <span className="text-bone/20">/</span>
          <span className="text-muted">{index}</span>
        </nav>

        <main id="main-content">
          {/* Header */}
          <section className="pt-6 md:pt-8 pb-12 md:pb-16">
            <div className="grid gap-10 md:grid-cols-12">
              <div className="md:col-span-8">
                <FolioLabel text={`${index} · ${category}`} />
                <span className="mt-5 font-serif-italic block text-vital text-3xl sm:text-4xl md:text-5xl leading-[1.1]">
                  {accent}
                </span>
                <h1 className="mt-2 font-grotesk uppercase text-bone leading-[0.9] tracking-tightest text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
                  {shortTitle}
                </h1>
                <p className="mt-6 max-w-[56ch] font-mono text-[13px] md:text-[15px] leading-[1.75] text-muted">
                  {fullTitle}
                </p>
                <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-steel">{subtitle}</p>
              </div>

              <div className="md:col-span-4">
                <div className="ed-panel">
                  {meta.map((m, i) => (
                    <div key={i} className="px-4 py-3.5 border-b border-bone/12 last:border-0">
                      <p className="font-mono text-[8.5px] uppercase tracking-[0.2em] text-vital">{m.label}</p>
                      <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.08em] text-bone">{m.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Schematic banner — now as ink drawing on paper */}
          <section className="relative overflow-hidden border border-bone/12 bg-surface">
            {schematic}
          </section>

          {/* Body */}
          <section className="py-14 md:py-20">{children}</section>

          {/* Cross-project pager */}
          <ProjectPager slug={slug} />
        </main>

        {/* Footer CTA */}
        <section className="mt-12 border-t border-bone/12 py-10 md:py-14">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-muted">Continue the dossier</p>
            <div className="flex flex-wrap gap-5">
              {[
                { href: '#contact', label: 'Get in touch' },
                { href: '#/cv',     label: 'View CV' },
                { href: '#research',label: 'Back to index' },
              ].map((l) => (
                <EdLink key={l.label} href={l.href} className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted hover:text-bone">
                  {l.label} →
                </EdLink>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

/* ── Detail inline sections ──────────────────────────────────────── */

function DetailFolio({ text }: { text: string }) {
  return <FolioLabel text={text} />;
}

function DetailPanel({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="ed-panel p-6 md:p-8">
      <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-vital mb-5">{label}</p>
      {children}
    </div>
  );
}

/* ── PAS Detail ──────────────────────────────────────────────────── */

function PASDetailPage() {
  const d = PAS_DETAIL;
  return (
    <DetailShell
      slug={d.slug}
      index={d.index} category={d.category} shortTitle={d.shortTitle}
      fullTitle={d.fullTitle} subtitle={d.subtitle}
      accent="Ambulatory respiratory support."
      meta={[
        { label: 'Lab',                value: d.lab },
        { label: 'Principal investigator', value: d.pi },
        { label: 'Co-investigators',   value: d.studyLead.join(' · ') },
        { label: 'My role',            value: d.role },
      ]}
      schematic={<PASDetailSchematic />}
    >
      <div className="grid gap-12 md:grid-cols-12">
        <div className="md:col-span-7">
          <DetailFolio text="01 · Abstract" />
          <p className="mt-6 font-mono text-[13px] md:text-[15px] leading-[1.8] text-muted">{d.abstract}</p>

          <div className="mt-12">
            <DetailFolio text="02 · Objectives" />
            <ul className="mt-6 space-y-4">
              {d.objectives.map((o, i) => (
                <li key={i} className="flex gap-3">
                  <span className="font-grotesk text-vital text-sm tracking-tightest shrink-0 mt-0.5">{String(i + 1).padStart(2, '0')}</span>
                  <p className="font-mono text-[13px] md:text-[14px] leading-[1.75] text-muted">{o}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="md:col-span-5">
          <DetailPanel label="Methods">
            <dl className="space-y-5">
              {d.methods.map((m, i) => (
                <div key={i}>
                  <dt className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted">{m.label}</dt>
                  <dd className="mt-1 font-mono text-[12px] md:text-[13px] leading-[1.65] text-bone">{m.value}</dd>
                </div>
              ))}
            </dl>
          </DetailPanel>
        </div>

        <div className="md:col-span-12">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="relative overflow-hidden border border-bone/12 bg-surface">
              <PASCircuitDiagram />
              <div className="absolute bottom-4 left-4 right-4 flex justify-between pointer-events-none">
                <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-vital">VV ECMO · Circuit schematic</span>
              </div>
            </div>
            <div className="relative overflow-hidden border border-bone/12 bg-surface">
              <KaplanMeierDiagram />
              <div className="absolute bottom-4 left-4 right-4 flex justify-between pointer-events-none">
                <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-vital">Kaplan–Meier · Survival curve</span>
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-7">
          <DetailFolio text="03 · Key Findings" />
          <ul className="mt-6 space-y-4">
            {d.findings.map((f, i) => (
              <li key={i} className="flex gap-3">
                <span className="font-grotesk text-vital text-sm tracking-tightest shrink-0 mt-0.5">{`F-${String(i + 1).padStart(2, '0')}`}</span>
                <div className="font-mono text-[13px] md:text-[14px] leading-[1.75] text-muted">
                  <span className="text-bone uppercase tracking-[0.08em] text-[11px]">{f.label} — </span>{f.value}
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-5">
          <DetailPanel label="Monitoring parameters">
            <dl className="space-y-5">
              {d.monitoringParams.map((p, i) => (
                <div key={i}>
                  <dt className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted">{p.label}</dt>
                  <dd className="mt-1 font-mono text-[12px] md:text-[13px] leading-[1.65] text-bone">{p.value}</dd>
                </div>
              ))}
            </dl>
          </DetailPanel>
        </div>
      </div>
    </DetailShell>
  );
}

/* ── Coagulation Detail ──────────────────────────────────────────── */

function CoagDetailPage() {
  const d = COAG_DETAIL;
  return (
    <DetailShell
      slug={d.slug}
      index={d.index} category={d.category} shortTitle={d.shortTitle}
      fullTitle={d.fullTitle} subtitle={d.subtitle}
      accent="Targeting contact pathway coagulation."
      meta={[
        { label: 'Role',        value: d.role },
        { label: 'PI',          value: d.pi },
        { label: 'Lab',         value: d.lab },
        { label: 'Status',      value: d.subtitle },
      ]}
      schematic={<CoagDetailSchematic />}
    >
      <div className="grid gap-12 md:grid-cols-12">
        <div className="md:col-span-7">
          <DetailFolio text="01 · Abstract" />
          <p className="mt-6 font-mono text-[13px] md:text-[15px] leading-[1.8] text-muted">{d.abstract}</p>

          <div className="mt-12">
            <DetailFolio text="02 · Problem" />
            <ul className="mt-6 space-y-4">
              {d.problem.map((o, i) => (
                <li key={i} className="flex gap-3">
                  <span className="font-grotesk text-vital text-sm tracking-tightest shrink-0 mt-0.5">{String(i + 1).padStart(2, '0')}</span>
                  <p className="font-mono text-[13px] md:text-[14px] leading-[1.75] text-muted">{o}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="md:col-span-5">
          <DetailPanel label="Approach">
            <dl className="space-y-5">
              {d.approach.map((m, i) => (
                <div key={i}>
                  <dt className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted">{m.label}</dt>
                  <dd className="mt-1 font-mono text-[12px] md:text-[13px] leading-[1.65] text-bone">{m.value}</dd>
                </div>
              ))}
            </dl>
          </DetailPanel>
        </div>

        <div className="md:col-span-7">
          <DetailFolio text="03 · My contributions" />
          <ul className="mt-6 space-y-4">
            {d.contributions.map((c, i) => (
              <li key={i} className="flex gap-3 font-mono text-[13px] md:text-[14px] leading-[1.75] text-muted">
                <span className="font-grotesk text-vital text-sm tracking-tightest shrink-0">{`C-${String(i + 1).padStart(2, '0')}`}</span>
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-5">
          <DetailPanel label="Selected references">
            <ul className="space-y-3">
              {d.references.map((r, i) => (
                <li key={i} className="font-mono text-[11px] md:text-[12px] leading-[1.65] text-muted border-l-2 border-vital/30 pl-3">{r}</li>
              ))}
            </ul>
          </DetailPanel>
        </div>
      </div>
    </DetailShell>
  );
}

/* ── Cane Detail ─────────────────────────────────────────────────── */

function CaneDetailPage() {
  const d = CANE_DETAIL;
  return (
    <DetailShell
      slug={d.slug}
      index={d.index} category={d.category} shortTitle={d.shortTitle}
      fullTitle={d.fullTitle} subtitle={d.subtitle}
      accent="Active assistive mobility."
      meta={[
        { label: 'Patent',         value: d.patentNumber },
        { label: 'Office',         value: d.office },
        { label: 'Filed · Granted', value: `${d.filed} → ${d.registered}` },
        { label: 'Inventor · Status', value: `${d.inventor} · ${d.status}` },
      ]}
      schematic={<CaneDetailSchematic />}
    >
      <div className="grid gap-12 md:grid-cols-12">
        <div className="md:col-span-7">
          <DetailFolio text="01 · Abstract" />
          <p className="mt-6 font-mono text-[13px] md:text-[15px] leading-[1.8] text-muted">{d.abstract}</p>

          <div className="mt-12">
            <DetailFolio text="02 · Problem statement" />
            <ul className="mt-6 space-y-4">
              {d.problem.map((p, i) => (
                <li key={i} className="flex gap-3">
                  <span className="font-grotesk text-vital text-sm tracking-tightest shrink-0 mt-0.5">{String(i + 1).padStart(2, '0')}</span>
                  <p className="font-mono text-[13px] md:text-[14px] leading-[1.75] text-muted">{p}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-12">
            <DetailFolio text="03 · Solution" />
            <ol className="mt-6 space-y-4">
              {d.solution.map((s, i) => (
                <li key={i} className="flex gap-3">
                  <span className="font-grotesk text-vital text-sm tracking-tightest shrink-0">{String(i + 1).padStart(2, '0')}</span>
                  <p className="font-mono text-[13px] md:text-[14px] leading-[1.75] text-muted">{s}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="md:col-span-5">
          <DetailPanel label="Parts List · BOM">
            <ul className="space-y-4">
              {d.components.map((c) => (
                <li key={c.id} className="grid grid-cols-[36px_1fr] gap-3 border-b border-bone/10 pb-3 last:border-0">
                  <span className="font-mono text-[9px] text-vital">{c.id}</span>
                  <div>
                    <p className="font-mono text-[11px] text-bone">{c.label}</p>
                    <p className="font-mono text-[10px] text-muted mt-0.5">{c.detail}</p>
                  </div>
                </li>
              ))}
            </ul>
          </DetailPanel>
        </div>

        <div className="md:col-span-12">
          <DetailFolio text="04 · Representative claims" />
          <div className="mt-6 divide-y divide-bone/10 border border-bone/12">
            {d.claims.map((c, i) => (
              <div key={i} className="p-6 md:p-8 grid md:grid-cols-12 gap-4">
                <p className="md:col-span-2 font-mono text-[10px] uppercase tracking-[0.18em] text-vital">Claim {i + 1}</p>
                <p className="md:col-span-10 font-mono text-[13px] md:text-[14px] leading-[1.75] text-muted">{c}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="md:col-span-12 border border-bone/12 p-8 md:p-12">
          <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-vital mb-4">05 · Impact</p>
          <p className="font-serif-italic text-vital text-3xl md:text-5xl leading-tight">
            Mechanical feedback, not just sensory alert.
          </p>
          <p className="mt-6 max-w-[72ch] font-mono text-[13px] md:text-[15px] leading-[1.8] text-muted">{d.impact}</p>
        </div>
      </div>
    </DetailShell>
  );
}

/* ── CV Page ─────────────────────────────────────────────────────── */

function CVPage() {
  return (
    <div className="relative min-h-screen bg-graphite text-bone page-enter">
      <a href="#main-content" className="skip-link">Skip to content</a>
      <PaperGrain />
      <Navbar />
      <div className="mx-auto max-w-container px-6 md:px-10 lg:px-14 xl:px-16">
        <nav className="pt-6 md:pt-8 print-hide flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.2em] text-steel" aria-label="Breadcrumb">
          <EdLink href="#home" className="hover:text-bone inline-flex items-center gap-1.5">
            <ArrowLeft className="h-3 w-3" strokeWidth={2} /> Portfolio
          </EdLink>
          <span className="text-bone/20">/</span>
          <span className="text-muted">Curriculum Vitae</span>
        </nav>

        <main id="main-content">
        <section className="pt-6 md:pt-8 pb-10 md:pb-14">
          <div className="grid gap-8 md:grid-cols-12">
            <div className="md:col-span-8">
              <FolioLabel text={CV.tag} />
              <h1 className="mt-5 font-grotesk uppercase text-bone leading-[0.88] tracking-tightest text-5xl sm:text-6xl md:text-7xl lg:text-8xl">
                {CV.heading}
              </h1>
              <p className="mt-4 font-mono text-[13px] md:text-[14px] leading-[1.75] text-muted">{CV.subheading}</p>
              <button
                onClick={() => window.print()}
                className="print-hide mt-6 inline-flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.2em] px-4 py-2 border border-bone/25 text-bone hover:bg-vital hover:border-vital hover:text-graphite transition-colors"
              >
                <FileText className="h-3.5 w-3.5" strokeWidth={1.75} /> Print / Save PDF
              </button>
            </div>

            <div className="md:col-span-4 md:pt-6">
              <div className="ed-panel p-5 md:p-6">
                <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-vital mb-3">Contact</p>
                <p className="font-mono text-[12px] text-bone">{PERSON.email}</p>
                <p className="font-mono text-[11px] text-muted">{PERSON.personalEmail}</p>
                <p className="font-mono text-[10px] text-steel mt-2">
                  {PERSON.linkedinHandle} · {PERSON.location}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden border border-bone/12 bg-surface mb-14">
          <CVSchematic />
        </section>

        <section className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-12">
            <FolioLabel text="01 · Education" />
            <div className="mt-6 divide-y divide-bone/10 border border-bone/12">
              {CV.education.map((e, i) => (
                <div key={i} className="p-6 md:p-8 grid md:grid-cols-12 gap-6">
                  <div className="md:col-span-4">
                    <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-vital">{e.dates}</p>
                    <p className="mt-3 font-grotesk text-2xl md:text-3xl tracking-tightest text-bone uppercase">{e.inst}</p>
                    <p className="mt-1 font-mono text-[10px] text-muted">{e.loc}</p>
                  </div>
                  <div className="md:col-span-8">
                    <p className="font-mono text-[11px] md:text-[12px] leading-[1.7] text-muted">{e.degree}</p>
                    <p className="font-mono text-[10px] text-steel mt-2">{e.program}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="md:col-span-12">
            <FolioLabel text="02 · Research Experience" />
            <div className="mt-6 divide-y divide-bone/10 border border-bone/12">
              {CV.research.map((ex, i) => (
                <div key={i} className="p-6 md:p-8 grid md:grid-cols-12 gap-6">
                  <div className="md:col-span-4">
                    <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-vital">{ex.dates}</p>
                    <p className="mt-3 font-grotesk text-xl tracking-tightest text-bone uppercase">{ex.lab}</p>
                    <p className="mt-1 font-mono text-[10px] text-muted">{ex.inst}</p>
                  </div>
                  <div className="md:col-span-8">
                    <p className="font-mono text-[11px] font-medium text-bone uppercase tracking-[0.08em]">{ex.role}</p>
                    <p className="font-mono text-[10px] text-muted mt-1">{ex.pi}</p>
                    <ul className="mt-3 space-y-1.5">
                      {ex.bullets.map((b, j) => (
                        <li key={j} className="font-mono text-[10px] md:text-[11px] text-muted flex gap-2">
                          <span className="text-vital shrink-0">—</span> {b}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="md:col-span-12">
            <FolioLabel text="03 · Patents" />
            <div className="mt-6 divide-y divide-bone/10 border border-bone/12">
              {CV.patents.map((p, i) => (
                <div key={i} className="p-6 md:p-8 grid md:grid-cols-12 gap-4">
                  <p className="md:col-span-3 font-mono text-[9px] uppercase tracking-[0.18em] text-vital">{p.granted}</p>
                  <div className="md:col-span-9">
                    <p className="font-mono text-[12px] text-bone">{p.number} — {p.title}</p>
                    <p className="font-mono text-[10px] text-muted mt-1">{p.office} · {p.inventor}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-14 border-t border-bone/10 py-10 print-hide flex flex-col sm:flex-row justify-between gap-3">
          <EdLink href="#home" className="font-mono text-[9px] uppercase tracking-[0.22em] text-muted hover:text-bone">← Back to Portfolio</EdLink>
          <EdLink href="#contact" className="font-mono text-[9px] uppercase tracking-[0.22em] text-muted hover:text-bone">Get in Touch →</EdLink>
        </section>
        </main>
      </div>
    </div>
  );
}

/* ── Root ─────────────────────────────────────────────────────────── */

export default function App() {
  const route = useHashRoute();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [route.kind]);

  if (route.kind === 'detail') {
    if (route.slug === 'pas')         return <PASDetailPage />;
    if (route.slug === 'coagulation') return <CoagDetailPage />;
    if (route.slug === 'cane')        return <CaneDetailPage />;
  }
  if (route.kind === 'cv') return <CVPage />;

  return (
    <div className="relative">
      <a href="#main-content" className="skip-link">Skip to content</a>
      <ElevatorShaft />
      <GearboxPulleyDrive />
      <BlueprintParallax />
      <SpringCursor />
      <ScrollRPMGauge />
      <PaperGrain />
      <ElevatorScrollbar />
      <BackToTop />
      <Navbar onHome />
      <main id="main-content">
        <HomePage />
      </main>
    </div>
  );
}
