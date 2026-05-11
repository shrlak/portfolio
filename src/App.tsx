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

function GearTrain() {
  const svgRef = useRef<SVGSVGElement>(null);
  const anglesRef = useRef([0, 0, 0]); // 3 gears

  // Gear specs: [teeth, pitchRadius, cx, cy]
  const GEARS = [
    { teeth: 16, r1: 52, r2: 64, cx: 110, cy: 110, holeR: 14 },
    { teeth: 10, r1: 32, r2: 40, cx: 185, cy: 110, holeR: 9 },
    { teeth: 24, r1: 78, r2: 95, cx: 110, cy: 220, holeR: 20 },
  ];
  // Ratio of gear 0 to gear 1: teeth[0]/teeth[1] = 16/10 (counter-rotate)
  // Ratio of gear 0 to gear 2: teeth[0]/teeth[2] = 16/24 (counter-rotate)
  const RATIOS = [1, -16/10, -16/24];

  const gearPaths = GEARS.map(g => gearPath(g.cx, g.cy, g.r1, g.r2, g.teeth));

  useEffect(() => {
    const stop = startEngine();
    const gearEls = svgRef.current ? Array.from(svgRef.current.querySelectorAll<SVGGElement>('.gear-g')) : [];
    subscribe('geartrain', ({ velocity }) => {
      const rpm = Math.max(0.2, Math.min(80, 0.8 + Math.abs(velocity) * 2));
      const delta = rpm / 60 * 6; // degrees per frame at this RPM
      anglesRef.current = anglesRef.current.map((a, i) => (a + delta * RATIOS[i] + 360) % 360);
      gearEls.forEach((el, i) => {
        if (el) el.style.transform = `rotate(${anglesRef.current[i]}deg)`;
      });
    });
    return () => { unsubscribe('geartrain'); stop(); };
  }, []);

  return (
    <div className="gear-train-wrap" aria-hidden="true">
      <svg
        ref={svgRef}
        viewBox="0 0 320 330"
        className="gear-train-svg"
        style={{ width: 'clamp(280px,35vw,520px)', bottom: '5%', right: '3%', position: 'absolute' }}
      >
        {GEARS.map((g, i) => (
          <g key={i} className="gear-g" style={{ transformOrigin: `${g.cx}px ${g.cy}px` }}>
            <path d={gearPaths[i]} fill="currentColor" opacity="0.9" />
            <circle cx={g.cx} cy={g.cy} r={g.holeR} fill="#f4f2ee" />
            <circle cx={g.cx} cy={g.cy} r={g.holeR * 0.35} fill="currentColor" />
            {/* Spoke lines */}
            {[0, 60, 120, 180, 240, 300].map(a => {
              const rad = a * Math.PI / 180;
              return <line key={a}
                x1={(Math.cos(rad) * g.holeR + g.cx).toFixed(1)}
                y1={(Math.sin(rad) * g.holeR + g.cy).toFixed(1)}
                x2={(Math.cos(rad) * (g.r1 * 0.78) + g.cx).toFixed(1)}
                y2={(Math.sin(rad) * (g.r1 * 0.78) + g.cy).toFixed(1)}
                stroke="#f4f2ee" strokeWidth="2.5"
              />;
            })}
          </g>
        ))}
        {/* Axle dots */}
        {GEARS.map((g, i) => (
          <circle key={`axle-${i}`} cx={g.cx} cy={g.cy} r="2.5" fill="rgba(200,16,46,0.6)" />
        ))}
        {/* Mesh lines between gears */}
        <line x1="162" y1="110" x2="153" y2="110" stroke="rgba(200,16,46,0.2)" strokeWidth="1" strokeDasharray="2 2" />
      </svg>
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
  const posRef   = useRef({ x: 0, y: 0, vx: 0, vy: 0 });
  const targetRef = useRef({ x: 0, y: 0 });
  const [bursts, setBursts] = useState<Array<{x:number;y:number;id:number;color:string}>>([]);
  const [sparks, setSparks]  = useState<Array<{x:number;y:number;id:number}>>([]);
  const [shockwave, setShockwave] = useState(0);
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

      rafRef.current = requestAnimationFrame(loop);
    };

    // Subscribe to animation engine for shockwave on velocity spike
    subscribe('cursor-shock', ({ jerk }) => {
      if (Math.abs(jerk) > 8) setShockwave(Date.now());
    });

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mousedown', onDown);
    document.addEventListener('mouseover', onEnter);
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      document.body.classList.remove('has-custom-cursor');
      cancelAnimationFrame(rafRef.current);
      unsubscribe('cursor-shock');
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
      {shockwave > 0 && (
        <div key={shockwave} className="shockwave" aria-hidden="true"
          onAnimationEnd={() => setShockwave(0)}
        />
      )}
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
          <div className="comp-accent mb-6 md:mb-8">
            <span className="font-serif-italic text-bone text-2xl sm:text-3xl md:text-4xl leading-[1.15]">
              {HERO.accent}
            </span>
          </div>

          {/* Massive heading */}
          <h1 className="font-grotesk uppercase text-bone leading-[0.88] tracking-tightest" style={{ fontSize: 'clamp(64px, 11vw, 148px)' }}>
            {HERO.heading.map((line, i) => (
              <div key={i} className={`comp-hl-${i + 1}`}>
                <span>{line}</span>
              </div>
            ))}
          </h1>
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
                      <span className="tolerance-note">{`± 0.00${(i % 3) + 1} in`}</span>
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
  const arcRef  = useRef<SVGPathElement>(null);
  const started = useRef(false);
  const R = 34;
  const ARC = Math.PI * R;
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
        <path
          className="gauge-arc-bg"
          d={`M${40 - R},40 A${R},${R} 0 0,1 ${40 + R},40`}
          strokeDasharray={ARC} strokeDashoffset="0"
        />
        <path
          ref={arcRef}
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

/* ── Research ────────────────────────────────────────────────────── */

function CrankMechanism() {
  const svgRef = useRef<SVGSVGElement>(null);
  const cranks  = useRef<SVGLineElement | null>(null);
  const rod     = useRef<SVGLineElement | null>(null);
  const piston  = useRef<SVGRectElement | null>(null);
  const angleRef = useRef(0);

  useEffect(() => {
    subscribe('crank', ({ velocity }) => {
      const rpm = Math.max(0.5, Math.min(120, 2 + Math.abs(velocity) * 3));
      angleRef.current = (angleRef.current + rpm / 60 * 6) % 360;
      const a = angleRef.current * Math.PI / 180;
      // Crankshaft geometry
      const crankR = 12;
      const rodLen = 28;
      const cx = 22, cy = 22; // crank center
      const crankX = cx + Math.cos(a) * crankR;
      const crankY = cy + Math.sin(a) * crankR;
      // Piston constrained to vertical axis at cx
      const dy = crankY - cy;
      const pistonY = cy + Math.sqrt(rodLen * rodLen - (crankX - cx) * (crankX - cx)) * Math.sign(Math.cos(a)) + dy;

      if (cranks.current) {
        cranks.current.setAttribute('x1', String(cx));
        cranks.current.setAttribute('y1', String(cy));
        cranks.current.setAttribute('x2', String(crankX.toFixed(2)));
        cranks.current.setAttribute('y2', String(crankY.toFixed(2)));
      }
      if (rod.current) {
        rod.current.setAttribute('x1', String(crankX.toFixed(2)));
        rod.current.setAttribute('y1', String(crankY.toFixed(2)));
        rod.current.setAttribute('x2', String(cx));
        rod.current.setAttribute('y2', String(Math.max(2, Math.min(42, pistonY)).toFixed(2)));
      }
      if (piston.current) {
        const py = Math.max(2, Math.min(38, pistonY)) - 5;
        piston.current.setAttribute('y', String(py.toFixed(2)));
      }
    });
    return () => unsubscribe('crank');
  }, []);

  return (
    <div className="crank-wrap" aria-hidden="true">
      <svg ref={svgRef} className="crank-svg" width="44" height="52" viewBox="0 0 44 52" fill="none" stroke="currentColor" strokeWidth="1.5">
        {/* Cylinder walls */}
        <line x1="14" y1="0" x2="14" y2="40" strokeOpacity="0.4" />
        <line x1="30" y1="0" x2="30" y2="40" strokeOpacity="0.4" />
        {/* Cylinder cap */}
        <rect x="13" y="0" width="18" height="3" fill="currentColor" fillOpacity="0.3" />
        {/* Crankshaft circle */}
        <circle cx="22" cy="22" r="14" strokeOpacity="0.3" strokeDasharray="2 2" />
        <circle cx="22" cy="22" r="2" fill="currentColor" />
        {/* Crank arm */}
        <line ref={cranks} x1="22" y1="22" x2="34" y2="22" strokeWidth="2" />
        {/* Crank pin */}
        <circle cx="34" cy="22" r="2.5" fill="currentColor" />
        {/* Connecting rod */}
        <line ref={rod} x1="34" y1="22" x2="22" y2="8" strokeWidth="1.5" />
        {/* Piston */}
        <rect ref={piston} x="15" y="3" width="14" height="8" rx="1" fill="currentColor" fillOpacity="0.5" />
        {/* Crankshaft output */}
        <line x1="22" y1="36" x2="22" y2="52" strokeWidth="2" strokeOpacity="0.5" />
        <line x1="14" y1="44" x2="30" y2="44" strokeOpacity="0.4" />
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
        className="research-card-wrap ed-entry block px-0 py-10 md:py-14 relative"
        data-reveal
        data-reveal-delay={String(idx + 1)}
      >
        <CrankMechanism />
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
      <GearTrain />
      <BlueprintParallax />
      <SpringCursor />
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
