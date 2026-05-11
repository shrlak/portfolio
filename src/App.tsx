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

function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const update = () => {
      const pct = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
      if (ref.current) ref.current.style.height = `${Math.min(pct, 100)}%`;
    };
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);
  return <div ref={ref} className="scroll-progress-ed" aria-hidden="true" />;
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

function PlanetaryGearSystem() {
  const svgRef = useRef<SVGSVGElement>(null);
  const anglesRef = useRef({ sun: 0, planets: [0, 0, 0], ring: 0 });

  // Epicyclic gear: N_sun=14, N_planet=9, N_ring=32
  const N_SUN = 14, N_PLANET = 9, N_RING = 32;
  const CARRIER = N_SUN / (N_SUN + N_RING);
  const PLANET_ABS = CARRIER - (N_SUN / N_PLANET) * (1 - CARRIER);
  const RING_RATIO = -N_SUN / N_RING;

  const CX = 130, CY = 130; // center of system
  const R_SUN_PITCH = 42;   // sun gear pitch radius
  const R_PLANET_PITCH = 27; // planet pitch radius
  const R_RING_PITCH = 96;  // ring gear pitch radius
  const CARRIER_RADIUS = R_SUN_PITCH + R_PLANET_PITCH; // planet orbit radius

  // Gear visual radii
  const R_SUN_INNER = R_SUN_PITCH - 6;
  const R_SUN_OUTER = R_SUN_PITCH + 6;
  const R_PL_INNER  = R_PLANET_PITCH - 5;
  const R_PL_OUTER  = R_PLANET_PITCH + 5;

  // Pre-compute planet positions (120° apart)
  const PLANET_BASE_ANGLES = [0, 120, 240];

  const sunPath = gearPath(CX, CY, R_SUN_INNER, R_SUN_OUTER, N_SUN);
  const planetPaths = PLANET_BASE_ANGLES.map(ba => {
    const a = ba * Math.PI / 180;
    return gearPath(
      CX + Math.cos(a) * CARRIER_RADIUS,
      CY + Math.sin(a) * CARRIER_RADIUS,
      R_PL_INNER, R_PL_OUTER, N_PLANET
    );
  });

  useEffect(() => {
    const stop = startEngine();
    subscribe('planetary', ({ velocity }) => {
      const rpm = Math.max(0.3, Math.min(90, 1 + Math.abs(velocity) * 2.2));
      const delta = rpm / 60 * 6; // degrees per frame

      anglesRef.current.sun = (anglesRef.current.sun + delta) % 360;
      anglesRef.current.ring = (anglesRef.current.ring + delta * RING_RATIO + 360) % 360;

      anglesRef.current.planets = anglesRef.current.planets.map(
        (a) => (a + delta * PLANET_ABS) % 360
      );

      const svg = svgRef.current;
      if (!svg) return;

      // Sun gear
      const sunEl = svg.querySelector<SVGGElement>('.pg-sun');
      if (sunEl) sunEl.style.transform = `rotate(${anglesRef.current.sun}deg)`;

      // Ring gear (rotate the whole ring group)
      const ringEl = svg.querySelector<SVGGElement>('.pg-ring');
      if (ringEl) ringEl.style.transform = `rotate(${anglesRef.current.ring}deg)`;

      // Planets: each planet orbits + rotates
      const carrierAngle = (anglesRef.current.sun * CARRIER + 360 * 100) % 360;
      PLANET_BASE_ANGLES.forEach((ba, i) => {
        const el = svg.querySelector<SVGGElement>(`.pg-planet-${i}`);
        if (!el) return;
        const orbitAngle = (ba + carrierAngle) * Math.PI / 180;
        const px = CX + Math.cos(orbitAngle) * CARRIER_RADIUS;
        const py = CY + Math.sin(orbitAngle) * CARRIER_RADIUS;
        el.style.transform = `translate(${(px - (CX + Math.cos(ba * Math.PI / 180) * CARRIER_RADIUS)).toFixed(2)}px, ${(py - (CY + Math.sin(ba * Math.PI / 180) * CARRIER_RADIUS)).toFixed(2)}px) rotate(${anglesRef.current.planets[i]}deg)`;
      });
    });
    return () => { unsubscribe('planetary'); stop(); };
  }, []);

  // Ring gear internal teeth path (drawn as a circle with notches)
  const ringD = (() => {
    const pts: string[] = [];
    for (let i = 0; i < N_RING; i++) {
      const a0 = (i / N_RING) * Math.PI * 2;
      const a1 = a0 + Math.PI / N_RING * 0.35;
      const a2 = a0 + Math.PI / N_RING * 0.65;
      const a3 = a0 + Math.PI / N_RING;
      const ro = R_RING_PITCH + 8;
      const ri = R_RING_PITCH - 6;
      pts.push(
        `L${(Math.cos(a0) * ro + CX).toFixed(2)},${(Math.sin(a0) * ro + CY).toFixed(2)}`,
        `L${(Math.cos(a1) * ri + CX).toFixed(2)},${(Math.sin(a1) * ri + CY).toFixed(2)}`,
        `L${(Math.cos(a2) * ri + CX).toFixed(2)},${(Math.sin(a2) * ri + CY).toFixed(2)}`,
        `L${(Math.cos(a3) * ro + CX).toFixed(2)},${(Math.sin(a3) * ro + CY).toFixed(2)}`,
      );
    }
    return `M${(Math.cos(0) * (R_RING_PITCH + 8) + CX).toFixed(2)},${(Math.sin(0) * (R_RING_PITCH + 8) + CY).toFixed(2)} ${pts.join(' ')} Z`;
  })();

  return (
    <div className="gear-train-wrap" aria-hidden="true">
      <svg
        ref={svgRef}
        viewBox="0 0 260 260"
        className="gear-train-svg"
        style={{ width: 'clamp(240px, 32vw, 480px)', bottom: '2%', right: '1%', position: 'absolute' }}
      >
        {/* Ring gear (outermost) */}
        <g className="pg-ring" style={{ transformOrigin: `${CX}px ${CY}px` }}>
          <path d={ringD} fill="currentColor" opacity="0.18" />
          <circle cx={CX} cy={CY} r={R_RING_PITCH + 10} fill="none" stroke="currentColor" strokeWidth="1" opacity="0.12" />
        </g>

        {/* Carrier arms */}
        {PLANET_BASE_ANGLES.map((ba, i) => {
          const a = ba * Math.PI / 180;
          const px = CX + Math.cos(a) * CARRIER_RADIUS;
          const py = CY + Math.sin(a) * CARRIER_RADIUS;
          return (
            <line key={`arm-${i}`} className="pg-carrier-arm"
              x1={CX} y1={CY} x2={px.toFixed(1)} y2={py.toFixed(1)}
              stroke="currentColor" strokeWidth="1.5" opacity="0.2"
            />
          );
        })}

        {/* Planet gears */}
        {PLANET_BASE_ANGLES.map((ba, i) => {
          const a = ba * Math.PI / 180;
          const px = CX + Math.cos(a) * CARRIER_RADIUS;
          const py = CY + Math.sin(a) * CARRIER_RADIUS;
          return (
            <g key={`planet-${i}`} className={`pg-planet-${i}`}
              style={{ transformOrigin: `${px}px ${py}px` }}
            >
              <path d={planetPaths[i]} fill="currentColor" opacity="0.85" />
              <circle cx={px} cy={py} r={R_PL_INNER * 0.4} fill="#f4f2ee" />
              <circle cx={px} cy={py} r="2" fill="currentColor" opacity="0.7" />
              {/* Spokes */}
              {[0, 120, 240].map(sa => {
                const sr = sa * Math.PI / 180;
                return <line key={sa}
                  x1={(Math.cos(sr) * R_PL_INNER * 0.4 + px).toFixed(1)}
                  y1={(Math.sin(sr) * R_PL_INNER * 0.4 + py).toFixed(1)}
                  x2={(Math.cos(sr) * (R_PL_INNER * 0.82) + px).toFixed(1)}
                  y2={(Math.sin(sr) * (R_PL_INNER * 0.82) + py).toFixed(1)}
                  stroke="#f4f2ee" strokeWidth="1.5" />;
              })}
            </g>
          );
        })}

        {/* Sun gear */}
        <g className="pg-sun" style={{ transformOrigin: `${CX}px ${CY}px` }}>
          <path d={sunPath} fill="currentColor" opacity="0.95" />
          <circle cx={CX} cy={CY} r={R_SUN_INNER * 0.45} fill="#f4f2ee" />
          <circle cx={CX} cy={CY} r={R_SUN_INNER * 0.15} fill="currentColor" />
          {[0, 60, 120, 180, 240, 300].map(a => {
            const rad = a * Math.PI / 180;
            return <line key={a}
              x1={(Math.cos(rad) * R_SUN_INNER * 0.45 + CX).toFixed(1)}
              y1={(Math.sin(rad) * R_SUN_INNER * 0.45 + CY).toFixed(1)}
              x2={(Math.cos(rad) * (R_SUN_INNER * 0.82) + CX).toFixed(1)}
              y2={(Math.sin(rad) * (R_SUN_INNER * 0.82) + CY).toFixed(1)}
              stroke="#f4f2ee" strokeWidth="2" />;
          })}
        </g>

        {/* Center axle dot */}
        <circle cx={CX} cy={CY} r="4" fill="rgba(200,16,46,0.7)" />

        {/* Planet axle dots */}
        {PLANET_BASE_ANGLES.map((ba, i) => {
          const a = ba * Math.PI / 180;
          return <circle key={`axle-${i}`}
            cx={(CX + Math.cos(a) * CARRIER_RADIUS).toFixed(1)}
            cy={(CY + Math.sin(a) * CARRIER_RADIUS).toFixed(1)}
            r="2.5" fill="rgba(200,16,46,0.5)" />;
        })}

        {/* Pitch circle (reference) */}
        <circle cx={CX} cy={CY} r={R_RING_PITCH} fill="none" stroke="rgba(200,16,46,0.08)" strokeWidth="0.5" strokeDasharray="3 4" />
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

function Navbar({ onHome = false }: { onHome?: boolean }) {
  const active  = useActiveSection(onHome ? SECTION_IDS : []);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 bg-graphite">
        <div className="ed-rule-thick" />
        <div className="mx-auto max-w-container px-6 md:px-10 lg:px-14 xl:px-16 py-3 flex items-center justify-between gap-6">
          {/* Logo */}
          <EdLink href="#home" className="font-grotesk text-bone text-sm tracking-[0.12em] uppercase">
            SK.
          </EdLink>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-0">
            {NAV_ITEMS.map((item) => {
              const isActive = onHome && active === item.href.replace('#', '');
              return (
                <a
                  key={item.label}
                  href={item.href}
                  className={`font-mono text-[10px] uppercase tracking-[0.2em] px-4 py-2 transition-colors ${
                    isActive ? 'nav-active-ed text-bone' : 'text-muted hover:text-bone'
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
          </nav>

          {/* Mobile toggle */}
          <button
            className="md:hidden font-mono text-[9px] uppercase tracking-[0.2em] text-bone"
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Menu"
          >
            {menuOpen ? 'CLOSE' : 'MENU'}
          </button>
        </div>
        <div className="ed-rule" />

        {/* Mobile drawer */}
        {menuOpen && (
          <nav className="md:hidden bg-graphite border-b border-bone">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="block font-mono text-[10px] uppercase tracking-[0.2em] text-bone px-6 py-4 border-b border-bone/10 hover:text-vital transition-colors"
              >
                {item.label}
              </a>
            ))}
            <div className="flex items-center gap-4 px-6 py-4">
              {SOCIAL.map((s) => (
                <a key={s.label} href={s.href} target={s.external ? '_blank' : undefined} rel={s.external ? 'noreferrer' : undefined} className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted hover:text-vital transition-colors">
                  {s.label}
                </a>
              ))}
            </div>
          </nav>
        )}
      </header>
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
      <PlanetaryGearSystem />
      <BloodFlowParticles />
      {/* Folio line */}
      <div className="mx-auto max-w-container px-6 md:px-10 lg:px-14 xl:px-16 pt-10 md:pt-14">
        <p className="comp-folio font-mono text-[8.5px] uppercase tracking-[0.28em] text-muted leading-none">
          {PERSON.fullName} &nbsp;·&nbsp; Cook Cardiopulmonary Engineering Lab &nbsp;·&nbsp; Carnegie Mellon &nbsp;·&nbsp; Pittsburgh PA &nbsp;·&nbsp; 40°N 79°W &nbsp;·&nbsp; 2026
        </p>
        <div className="mt-4 comp-rule-1 ed-rule-thick" />
      </div>

      {/* Main split */}
      <div className="mx-auto max-w-container px-6 md:px-10 lg:px-14 xl:px-16 py-10 md:py-16 grid md:grid-cols-[60%_40%] gap-10 md:gap-0">

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
      </div>

      {/* Bottom rule + stats */}
      <div className="comp-rule-2 mx-auto max-w-container px-6 md:px-10 lg:px-14 xl:px-16 ed-rule" />
      <div className="comp-stats mx-auto max-w-container px-6 md:px-10 lg:px-14 xl:px-16 py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
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

const ECG_PATH = 'M0,60 L20,60 L25,55 L30,60 L45,60 L60,30 L65,110 L70,40 L80,60 L95,65 L110,60 L200,60 L220,60 L225,55 L230,60 L245,60 L260,30 L265,110 L270,40 L280,60 L295,65 L310,60 L800,60';

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
      className="relative bg-graphite overflow-hidden"
      onMouseEnter={() => { setFast(true); setBpm(95 + Math.floor(Math.random() * 30)); }}
      onMouseLeave={() => { setFast(false); setBpm(68 + Math.floor(Math.random() * 10)); }}
      onClick={handleClick}
    >
      <EcgBackground fast={fast} flat={flat} />
      <div className="bpm-display" aria-hidden="true">{bpm} BPM</div>
      <div className="relative z-10 mx-auto max-w-container px-6 md:px-10 lg:px-14 xl:px-16 py-20 md:py-28">

        <div className="mb-14" data-reveal>
          <FolioLabel text={ABOUT.tag} />
        </div>

        <div className="grid md:grid-cols-[45%_55%] gap-10 md:gap-16 mb-16">
          <div data-ink data-ink-delay="1">
            <p className="font-serif-italic text-bone text-3xl sm:text-4xl md:text-5xl leading-[1.18]">
              "{ABOUT.accent}"
            </p>
          </div>
          <div data-reveal data-reveal-delay="2">
            <div className="ed-rule-red mb-6" style={{ width: '2.5rem' }} />
            {ABOUT.body.map((para, i) => (
              <p key={i} className="font-mono text-[13px] md:text-[14px] leading-[1.85] text-muted mb-4 last:mb-0">
                {para}
              </p>
            ))}
          </div>
        </div>

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

        <LaminarFlowViz />

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

/* ── Skills ───────────────────────────────────────────────────────── */

function SkillGauge({ name, pct }: { name: string; pct: number }) {
  const arcRef   = useRef<SVGPathElement>(null);
  const needleRef = useRef<SVGLineElement>(null);
  const posRef   = useRef({ val: 0, vel: 0 });
  const started  = useRef(false);
  const rafRef   = useRef(0);

  const R   = 34;
  const ARC = Math.PI * R; // ~106.8

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

      // Spring animate toward target
      const target = pct / 100;
      const loop = () => {
        const [nv, nvl] = springStep(posRef.current.val, target, posRef.current.vel, 0.07, 0.78);
        posRef.current = { val: nv, vel: nvl };

        // Update arc strokeDashoffset
        if (arcRef.current) {
          arcRef.current.style.strokeDashoffset = String(ARC - nv * ARC);
        }
        // Update needle angle: -90deg = 0%, +90deg = 100%
        if (needleRef.current) {
          const deg = -90 + nv * 180;
          needleRef.current.style.transform = `rotate(${deg}deg)`;
        }

        if (Math.abs(target - nv) > 0.001 || Math.abs(nvl) > 0.001) {
          rafRef.current = requestAnimationFrame(loop);
        }
      };
      rafRef.current = requestAnimationFrame(loop);
    }, { threshold: 0.4 });
    obs.observe(el);
    return () => { obs.disconnect(); cancelAnimationFrame(rafRef.current); };
  }, [pct, ARC]);

  // Needle geometry: pivot at (40, 40), points upward at rest
  const needleCX = 40; // arc center x in viewBox
  const needleCY = 40; // arc center y in viewBox

  return (
    <div className="gauge-wrap flex flex-col items-center gap-1">
      <div className="gauge-tooltip">Rated: {rated}</div>
      <svg width="80" height="50" viewBox="0 0 80 50">
        {/* Background arc */}
        <path
          className="gauge-arc-bg"
          d={`M${needleCX - R},${needleCY} A${R},${R} 0 0,1 ${needleCX + R},${needleCY}`}
          strokeDasharray={ARC}
          strokeDashoffset="0"
        />
        {/* Animated arc */}
        <path
          ref={arcRef}
          className="gauge-arc"
          d={`M${needleCX - R},${needleCY} A${R},${R} 0 0,1 ${needleCX + R},${needleCY}`}
          strokeDasharray={ARC}
          strokeDashoffset={ARC}
        />
        {/* Needle */}
        <line
          ref={needleRef}
          x1={needleCX}
          y1={needleCY}
          x2={needleCX}
          y2={needleCY - R + 4}
          stroke="#c8102e"
          strokeWidth="1.5"
          strokeLinecap="round"
          style={{ transformOrigin: `${needleCX}px ${needleCY}px`, transform: 'rotate(-90deg)' }}
        />
        {/* Pivot dot */}
        <circle cx={needleCX} cy={needleCY} r="3" fill="#0d0d0d" />
        {/* Tick marks */}
        {[0, 25, 50, 75, 100].map(pctTick => {
          const angle = (-90 + pctTick * 1.8) * Math.PI / 180;
          const x1 = (needleCX + Math.cos(angle) * (R - 5)).toFixed(1);
          const y1 = (needleCY + Math.sin(angle) * (R - 5)).toFixed(1);
          const x2 = (needleCX + Math.cos(angle) * R).toFixed(1);
          const y2 = (needleCY + Math.sin(angle) * R).toFixed(1);
          return <line key={pctTick} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(13,13,13,0.3)" strokeWidth="1" />;
        })}
      </svg>
      <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-bone text-center leading-tight">{name}</p>
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
          <FolioLabel text="005 · TECHNICAL SKILLS" />
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
        <div className="mb-12" data-reveal>
          <FolioLabel text="006 · Publications + Abstracts" />
        </div>

        <div className="flex flex-col gap-0 divide-y divide-white/10">
          {PUBLICATIONS.map((pub, i) => (
            <div
              key={i}
              data-reveal
              data-reveal-delay={String(i + 1)}
              className="py-10 md:py-12 grid md:grid-cols-[120px_1fr] gap-6 md:gap-10"
            >
              {/* Hanging year */}
              <div>
                <p className="font-grotesk text-vital leading-none tracking-tightest" style={{ fontSize: 'clamp(48px, 8vw, 100px)' }}>
                  {pub.year}
                </p>
                <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-steel mt-2">{pub.conference}</p>
              </div>

              {/* Content */}
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <StatusBadge status={pub.status} />
                  <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-steel">{pub.venue}</span>
                </div>
                <p className="font-serif-italic text-graphite text-xl md:text-2xl leading-[1.35] mb-4">
                  {pub.title}
                </p>
                <p className="font-mono text-[11px] leading-[1.75] text-steel">
                  {pub.authors}
                </p>
                <p className="font-mono text-[9px] text-steel/50 mt-1">* Spencer Kim</p>
              </div>
            </div>
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
    </>
  );
}

/* ── Detail shell ────────────────────────────────────────────────── */

function DetailShell({
  index, category, shortTitle, fullTitle, subtitle, meta, schematic, children, accent,
}: {
  index: string; category: string; shortTitle: string; fullTitle: string;
  subtitle: string; meta: Array<{ label: string; value: string }>;
  schematic: JSX.Element; children: React.ReactNode; accent: string;
}) {
  return (
    <div className="relative min-h-screen bg-graphite text-bone page-enter">
      <PaperGrain />
      <div className="mx-auto max-w-container px-6 md:px-10 lg:px-14 xl:px-16">
        <Navbar />

        {/* Header */}
        <section className="pt-10 md:pt-14 pb-12 md:pb-16">
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

        {/* Footer CTA */}
        <section className="border-t border-bone/12 py-10 md:py-14">
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
      <PaperGrain />
      <div className="mx-auto max-w-container px-6 md:px-10 lg:px-14 xl:px-16">
        <Navbar />

        <section className="pt-10 md:pt-14 pb-10 md:pb-14">
          <div className="grid gap-8 md:grid-cols-12">
            <div className="md:col-span-8">
              <FolioLabel text={CV.tag} />
              <h1 className="mt-5 font-grotesk uppercase text-bone leading-[0.88] tracking-tightest text-5xl sm:text-6xl md:text-7xl lg:text-8xl">
                {CV.heading}
              </h1>
              <p className="mt-4 font-mono text-[13px] md:text-[14px] leading-[1.75] text-muted">{CV.subheading}</p>
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

        <section className="mt-14 border-t border-bone/10 py-10 flex flex-col sm:flex-row justify-between gap-3">
          <EdLink href="#home" className="font-mono text-[9px] uppercase tracking-[0.22em] text-muted hover:text-bone">← Back to Portfolio</EdLink>
          <EdLink href="#contact" className="font-mono text-[9px] uppercase tracking-[0.22em] text-muted hover:text-bone">Get in Touch →</EdLink>
        </section>
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
      <PlanetaryGearSystem />
      <BlueprintParallax />
      <SpringCursor />
      <ScrollRPMGauge />
      <PaperGrain />
      <ScrollProgress />
      <BackToTop />
      <Navbar onHome />
      <main>
        <HomePage />
      </main>
    </div>
  );
}
