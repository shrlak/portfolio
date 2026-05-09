import { useEffect, useState, useRef } from 'react';
import {
  Mail,
  Linkedin,
  Github,
  ArrowUpRight,
  ArrowRight,
  ArrowLeft,
  ArrowUp,
  FileText,
  Activity,
  ExternalLink,
  GraduationCap,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Send,
  Menu,
  X,
  type LucideIcon,
} from 'lucide-react';
import {
  PERSON,
  HERO,
  CREDENTIALS,
  ABOUT,
  RESEARCH,
  RESEARCH_CARDS,
  PAS_DETAIL,
  COAG_DETAIL,
  CANE_DETAIL,
  CV,
  CONTACT,
  NAV_ITEMS,
  PUBLICATIONS,
  SKILLS,
  TIMELINE,
  type CardSlug,
  type TimelineState,
} from './content';
import {
  HeroSchematic,
  AboutSchematic,
  CredentialsSchematic,
  PASCardSchematic,
  CoagCardSchematic,
  CaneCardSchematic,
  PASDetailSchematic,
  CoagDetailSchematic,
  CaneDetailSchematic,
  CVSchematic,
  CTASchematic,
} from './schematics';
import { PASCircuitDiagram, KaplanMeierDiagram } from './diagrams';

/* ── Router ────────────────────────────────────────────────────────── */

type Route =
  | { kind: 'home'; anchor: string }
  | { kind: 'detail'; slug: CardSlug }
  | { kind: 'cv' };

function parseHash(hash: string): Route {
  if (hash.startsWith('#/')) {
    const parts = hash.slice(2).split('/').filter(Boolean);
    if (parts[0] === 'research' && parts[1]) {
      const slug = parts[1] as CardSlug;
      if (slug === 'pas' || slug === 'coagulation' || slug === 'cane') {
        return { kind: 'detail', slug };
      }
    }
    if (parts[0] === 'cv') return { kind: 'cv' };
  }
  return { kind: 'home', anchor: hash || '#home' };
}

function useHashRoute(): Route {
  const [hash, setHash] = useState(typeof window !== 'undefined' ? window.location.hash : '');
  useEffect(() => {
    const handler = () => setHash(window.location.hash);
    window.addEventListener('hashchange', handler);
    return () => window.removeEventListener('hashchange', handler);
  }, []);
  return parseHash(hash);
}

function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('[data-reveal]');
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('is-revealed');
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.06, rootMargin: '0px 0px -48px 0px' }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

function useActiveSection(ids: string[]): string {
  const [active, setActive] = useState(ids[0] ?? '');
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { threshold: 0.35 }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return active;
}

/* ── Global chrome ─────────────────────────────────────────────────── */

function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const update = () => {
      const scrolled = window.scrollY;
      const total = document.body.scrollHeight - window.innerHeight;
      const pct = total > 0 ? (scrolled / total) * 100 : 0;
      if (ref.current) ref.current.style.width = `${pct}%`;
    };
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);
  return <div ref={ref} className="scroll-progress" style={{ width: '0%' }} aria-hidden="true" />;
}

function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current) {
        ref.current.style.left = `${e.clientX}px`;
        ref.current.style.top = `${e.clientY}px`;
      }
    };
    window.addEventListener('mousemove', handler, { passive: true });
    return () => window.removeEventListener('mousemove', handler);
  }, []);
  return <div ref={ref} className="cursor-glow" aria-hidden="true" />;
}

function BackToTop() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const handler = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className={`back-to-top text-bone${visible ? '' : ' hidden'}`}
      aria-label="Back to top"
    >
      <ArrowUp className="h-4 w-4" strokeWidth={2} />
    </button>
  );
}

/* ── Design primitives ─────────────────────────────────────────────── */

function TextureOverlay() {
  return <div className="texture-overlay" aria-hidden="true" />;
}

/** Section tag — vital dot + monospaced label */
function SectionTag({ text }: { text: string }) {
  return (
    <div className="inline-flex items-center gap-2.5">
      <span className="vital-dot shrink-0" />
      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">{text}</span>
    </div>
  );
}

/** Full-width section divider — faint line with centered pulse dot */
function SectionDivider() {
  return (
    <div className="flex items-center justify-center py-4 px-6 md:px-10 lg:px-14" aria-hidden="true">
      <div className="section-separator-wrap max-w-container w-full mx-auto">
        <div className="section-separator-line" />
        <div className="section-separator-dot mx-4" />
        <div className="section-separator-line right" />
      </div>
    </div>
  );
}

function IconButton({
  icon: Icon,
  href,
  label,
  size = 'md',
  external = false,
}: {
  icon: LucideIcon;
  href: string;
  label: string;
  size?: 'sm' | 'md' | 'lg';
  external?: boolean;
}) {
  const dim = size === 'lg' ? 'h-14 w-14' : size === 'sm' ? 'h-9 w-9' : 'h-11 w-11';
  return (
    <a
      href={href}
      aria-label={label}
      target={external ? '_blank' : undefined}
      rel={external ? 'noreferrer' : undefined}
      className={`liquid-glass ${dim} inline-flex items-center justify-center rounded-full text-muted transition-colors hover:text-vital`}
    >
      <Icon className="h-4 w-4 relative z-10" strokeWidth={1.5} />
    </a>
  );
}

function PillLink({
  href,
  label,
  external = false,
}: {
  href: string;
  label: string;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noreferrer' : undefined}
      className="group inline-flex items-center gap-3"
    >
      <span className="liquid-glass inline-flex items-center gap-3 rounded-full px-5 py-3">
        <span className="relative z-10 font-sans text-sm font-medium tracking-ui text-bone/80 group-hover:text-bone transition-colors uppercase">
          {label}
        </span>
        <span className="relative z-10 inline-flex h-7 w-7 items-center justify-center rounded-full bg-vital text-bone transition-colors group-hover:bg-bone group-hover:text-vital">
          {external ? (
            <ExternalLink className="h-3.5 w-3.5" strokeWidth={2} />
          ) : (
            <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2} />
          )}
        </span>
      </span>
    </a>
  );
}

function StatusDot({ status }: { status: string }) {
  const dotClass =
    status === 'ACTIVE'
      ? 'status-dot-active'
      : status === 'SUBMITTED'
      ? 'status-dot-submitted'
      : 'status-dot-registered';
  const textColor =
    status === 'ACTIVE'
      ? 'text-emerald-400'
      : status === 'SUBMITTED'
      ? 'text-amber-400'
      : 'text-blue-400';
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={`inline-block h-1.5 w-1.5 rounded-full ${dotClass}`} />
      <span className={`font-mono text-[8.5px] uppercase tracking-[0.16em] ${textColor}`}>
        {status}
      </span>
    </span>
  );
}

function OpenToCollab() {
  return (
    <a
      href="#contact"
      className="liquid-glass inline-flex w-fit items-center gap-2 rounded-full px-4 py-2 font-mono text-[9px] uppercase tracking-[0.14em] text-bone/70 hover:text-vital transition-colors"
    >
      <span className="relative z-10 inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
      <span className="relative z-10">Open to collaboration · Summer 2026</span>
    </a>
  );
}

const SOCIAL = [
  { icon: Mail, href: `mailto:${PERSON.email}`, label: 'Email', external: false },
  { icon: Linkedin, href: PERSON.linkedin, label: 'LinkedIn', external: true },
  { icon: Github, href: PERSON.github, label: 'GitHub', external: true },
];

/* ── Navbar ─────────────────────────────────────────────────────────── */

const SECTION_IDS = ['home', 'credentials', 'about', 'research', 'contact'];

function Navbar({ onHome = false }: { onHome?: boolean }) {
  const active = useActiveSection(onHome ? SECTION_IDS : []);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <>
      <header
        className={`sticky top-0 z-30 transition-all duration-500 ${
          scrolled
            ? 'py-3 backdrop-blur-xl bg-graphite/85 border-b border-bone/[0.06] -mx-6 md:-mx-10 lg:-mx-14 px-6 md:px-10 lg:px-14 shadow-2xl'
            : 'py-6 md:py-8'
        }`}
      >
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <a href="#home" className="font-sans font-semibold text-bone text-base md:text-lg leading-none tracking-ui">
            <span className="inline-flex items-center gap-2">
              <Activity className="h-4 w-4 text-vital" strokeWidth={1.75} />
              {PERSON.shortName}
            </span>
          </a>

          {/* Desktop nav */}
          <nav className="liquid-glass hidden md:flex items-center gap-0.5 rounded-full px-2 py-1.5">
            {NAV_ITEMS.map((item) => {
              const isActive = onHome && active === item.href.replace('#', '');
              return (
                <a
                  key={item.label}
                  href={item.href}
                  className={`relative z-10 rounded-full px-4 py-2 font-sans text-[13px] font-medium tracking-ui transition-all duration-200 ${
                    isActive ? 'nav-active-link' : 'text-muted hover:text-bone'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-vital" />
                  )}
                </a>
              );
            })}
            <a
              href="#/cv"
              className="relative z-10 ml-1 rounded-full bg-vital px-4 py-2 font-sans text-[13px] font-medium tracking-ui text-bone transition-colors hover:bg-bone hover:text-graphite"
            >
              CV
            </a>
          </nav>

          {/* Desktop social */}
          <div className="hidden md:flex items-center gap-2">
            {SOCIAL.map((s) => (
              <IconButton key={s.label} {...s} size="sm" />
            ))}
          </div>

          {/* Mobile */}
          <div className="flex md:hidden items-center gap-2">
            <a
              href="#/cv"
              className="liquid-glass inline-flex h-9 items-center rounded-full px-4 font-sans text-[12px] font-medium tracking-ui text-bone"
            >
              <span className="relative z-10">CV</span>
            </a>
            <button
              onClick={() => setMenuOpen(true)}
              className="liquid-glass inline-flex h-9 w-9 items-center justify-center rounded-full text-muted"
              aria-label="Open menu"
            >
              <Menu className="relative z-10 h-4 w-4" strokeWidth={1.5} />
            </button>
          </div>
        </div>

        {!onHome && (
          <div className="mt-5">
            <a
              href="#home"
              className="group inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-muted hover:text-vital transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" strokeWidth={1.5} />
              Return to Dossier
            </a>
          </div>
        )}
      </header>

      {/* Mobile overlay */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 bg-graphite/98 backdrop-blur-xl flex flex-col">
          <div className="flex items-center justify-between px-6 py-6">
            <span className="font-sans font-semibold text-bone text-base inline-flex items-center gap-2">
              <Activity className="h-4 w-4 text-vital" strokeWidth={1.75} />
              {PERSON.shortName}
            </span>
            <button
              onClick={() => setMenuOpen(false)}
              className="liquid-glass inline-flex h-9 w-9 items-center justify-center rounded-full text-muted"
              aria-label="Close menu"
            >
              <X className="relative z-10 h-4 w-4" strokeWidth={1.5} />
            </button>
          </div>
          <nav className="flex flex-col px-6 pt-6 gap-1 flex-1">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="font-grotesk uppercase text-bone text-4xl tracking-tightest leading-tight hover:text-vital transition-colors py-2.5 border-b border-bone/8"
              >
                {item.label}
              </a>
            ))}
            <a
              href="#/cv"
              onClick={() => setMenuOpen(false)}
              className="mt-8 inline-flex w-fit rounded-full bg-vital px-6 py-3 font-sans text-sm font-medium tracking-ui text-bone uppercase"
            >
              View CV
            </a>
          </nav>
          <div className="flex items-center gap-3 px-6 pb-10">
            {SOCIAL.map((s) => (
              <IconButton key={s.label} {...s} />
            ))}
          </div>
        </div>
      )}
    </>
  );
}

/* ── Hero ───────────────────────────────────────────────────────────── */

function HeroSection() {
  return (
    <section id="home" className="relative min-h-[100svh] overflow-hidden bg-graphite">
      <HeroSchematic />
      <div className="relative mx-auto flex min-h-[100svh] max-w-container flex-col px-6 md:px-10 lg:px-14 xl:px-16">
        <Navbar onHome />

        <div className="relative flex flex-1 flex-col justify-end pb-14 md:pb-24 lg:pb-28">

          {/* Coordinate label */}
          <div className="mb-10 hidden md:flex items-center gap-3 boot-in boot-d2">
            <span className="inline-block h-px w-10 bg-bone/15" />
            <span className="font-mono text-[10px] uppercase tracking-[0.26em] text-muted">
              40.4432° N · 79.9428° W · Pittsburgh, PA · CMU
            </span>
          </div>

          {/* Mobile social */}
          <div className="mb-6 flex gap-2 md:hidden boot-in boot-d2">
            {SOCIAL.map((s) => (
              <IconButton key={s.label} {...s} />
            ))}
          </div>

          {/* Accent phrase */}
          <span className="font-serif-italic block text-vital mb-3 text-3xl sm:text-4xl md:text-5xl lg:text-6xl boot-in boot-d3">
            {HERO.accent}
          </span>

          {/* Main heading */}
          <h1 className="font-grotesk uppercase text-bone leading-[0.88] tracking-tightest text-[14.5vw] md:text-[10.5vw] lg:text-[10vw] xl:text-[10.5rem] 2xl:text-[12rem] boot-in boot-d4">
            {HERO.heading.map((line, i) => (
              <span key={i} className="block">{line}</span>
            ))}
          </h1>

          {/* Bottom info bar */}
          <div className="mt-8 border-t border-bone/8 pt-6 boot-in boot-d6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
              {/* Footnote */}
              <div className="flex items-start gap-2.5">
                <span className="vital-dot mt-1.5 shrink-0" />
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted leading-[1.8] max-w-[46ch]">
                  {HERO.footnote}
                </p>
              </div>

              {/* Key stats */}
              <div className="flex items-center gap-8 sm:gap-10">
                {[
                  { v: '30', u: 'Day', sub: 'Ovine endpoint' },
                  { v: '01', u: 'Patent', sub: 'KR granted' },
                  { v: 'ISTH', u: '2026', sub: 'Abstract' },
                ].map((s) => (
                  <div key={s.u} className="text-left">
                    <p className="font-grotesk text-2xl md:text-3xl tracking-tightest text-vital leading-none">{s.v}</p>
                    <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted mt-1">{s.u} · {s.sub}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-[-2.5rem] left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-1.5 boot-in boot-d6">
            <span className="font-mono text-[8px] uppercase tracking-[0.32em] text-steel">Scroll</span>
            <div className="scroll-bounce text-steel">
              <svg width="9" height="13" viewBox="0 0 10 14" fill="none">
                <path d="M5 0v10M1 7l4 4 4-4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Credentials ────────────────────────────────────────────────────── */

function CredentialsSection() {
  return (
    <section id="credentials" className="relative overflow-hidden bg-surface">
      <CredentialsSchematic />
      <div className="relative mx-auto max-w-container px-6 md:px-10 lg:px-14 xl:px-16 py-20 md:py-28 lg:py-32">
        <div className="grid gap-12 md:grid-cols-12 md:gap-14">
          {/* Left: heading */}
          <div className="md:col-span-5" data-reveal>
            <SectionTag text={CREDENTIALS.tag} />
            <span className="mt-7 font-serif-italic block text-vital text-4xl sm:text-5xl md:text-6xl">
              {CREDENTIALS.accent}
            </span>
            <h2 className="mt-2 font-grotesk uppercase text-bone leading-[0.88] tracking-tightest text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
              {CREDENTIALS.heading.map((line, i) => (
                <span key={i} className="block">{line}</span>
              ))}
            </h2>
            <p className="mt-8 font-mono text-sm md:text-[15px] leading-[1.75] text-muted tracking-[0.01em] max-w-[40ch]">
              {CREDENTIALS.statement}
            </p>
            <div className="mt-8 inline-flex items-center gap-2.5">
              <GraduationCap className="h-4 w-4 text-vital" strokeWidth={1.5} />
              <span className="font-sans text-sm font-medium tracking-ui text-bone/80 uppercase">
                Class of 2027 · In residence
              </span>
            </div>
          </div>

          {/* Right: credential grid */}
          <div className="md:col-span-7" data-reveal data-reveal-delay="2">
            <div className="liquid-glass rounded-2xl overflow-hidden">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-px bg-bone/[0.06]">
                {CREDENTIALS.items.map((item, i) => (
                  <div key={i} className="cred-cell bg-surface p-5 md:p-6 relative">
                    <span className="absolute top-3 right-4 font-mono text-[10px] tracking-[0.18em] text-steel">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-vital/75 mb-2">
                      {item.label}
                    </p>
                    <p className="font-sans text-sm font-medium tracking-ui text-bone uppercase leading-snug">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── About ──────────────────────────────────────────────────────────── */

function AboutSection() {
  return (
    <section id="about" className="relative min-h-[90svh] overflow-hidden bg-graphite">
      <AboutSchematic />
      <div className="relative mx-auto flex min-h-[90svh] max-w-container flex-col justify-between px-6 md:px-10 lg:px-14 xl:px-16 py-20 md:py-28 lg:py-32">

        {/* Heading + body */}
        <div className="grid gap-12 md:grid-cols-12 md:gap-10">
          <div className="md:col-span-7" data-reveal>
            <SectionTag text={ABOUT.tag} />
            <span className="mt-7 font-serif-italic block text-vital text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
              {ABOUT.accent}
            </span>
            <h2 className="mt-2 font-grotesk uppercase text-bone leading-[0.88] tracking-tightest text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-[8.5rem]">
              {ABOUT.heading.map((line, i) => (
                <span key={i} className="block">{line}</span>
              ))}
            </h2>
          </div>

          <div className="md:col-span-5 flex flex-col gap-6 md:pt-4" data-reveal data-reveal-delay="2">
            {ABOUT.body.map((p, i) => (
              <p
                key={i}
                className={`font-mono text-[13px] md:text-[14px] leading-[1.8] text-bone/85 tracking-[0.01em] ${
                  i === 0 ? 'pl-4 border-l border-vital/50' : ''
                }`}
              >
                {p}
              </p>
            ))}
            <a
              href="#contact"
              className="liquid-glass inline-flex w-fit items-center gap-2 rounded-full px-5 py-2.5 font-sans text-xs font-medium tracking-ui text-bone/70 hover:text-vital transition-colors mt-1"
            >
              <span className="relative z-10">Open to collaboration · Summer 2026</span>
              <ArrowRight className="relative z-10 h-3.5 w-3.5 shrink-0" strokeWidth={1.75} />
            </a>
          </div>
        </div>

        {/* Stats grid */}
        <div className="relative mt-16 md:mt-20 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4" data-reveal data-reveal-delay="3">
          {[
            { value: '30', unit: 'Day', label: 'Ovine survival endpoint', color: 'vital' },
            { value: '1', unit: 'Patent', label: 'KR 10-2675388 · Granted', color: 'oxygen' },
            { value: '6', unit: 'Sheep', label: 'Cohort size · VV ECMO', color: 'vital' },
            { value: '1', unit: 'Abstract', label: 'ISTH 2026 · Submitted', color: 'oxygen' },
          ].map((stat, i) => (
            <div
              key={i}
              className="liquid-glass rounded-2xl pt-5 md:pt-6 pb-0 px-5 md:px-6 text-center stat-item overflow-hidden"
              style={{ animationDelay: `${0.7 + i * 0.1}s` }}
            >
              <p className={`relative z-10 font-grotesk text-5xl md:text-6xl lg:text-7xl tracking-tightest leading-none ${stat.color === 'vital' ? 'text-vital' : 'text-oxygen'}`}>
                {stat.value}
              </p>
              <p className="relative z-10 mt-1.5 font-sans text-[10px] font-semibold tracking-[0.18em] text-bone uppercase">
                {stat.unit}
              </p>
              <p className="relative z-10 mt-1.5 mb-5 font-mono text-[9px] uppercase tracking-[0.16em] text-muted">
                {stat.label}
              </p>
              <div className={`h-[1.5px] w-full ${stat.color === 'vital' ? 'bg-vital/50' : 'bg-oxygen/40'}`} />
            </div>
          ))}
        </div>

        {/* Marquee keywords */}
        <div className="relative mt-14 md:mt-20 overflow-hidden marquee-outer">
          <div className="flex flex-col gap-3 md:gap-4">
            {ABOUT.keywordRows.map((row, i) => (
              <div key={i} className="overflow-hidden whitespace-nowrap">
                <div
                  className="marquee-track inline-block font-grotesk uppercase text-bone/[0.07] leading-none tracking-[0.03em] text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl hover:text-bone/[0.14] transition-colors duration-700"
                  style={{
                    '--marquee-speed': `${36 + i * 8}s`,
                    animationDirection: i % 2 === 0 ? 'normal' : 'reverse',
                  } as React.CSSProperties}
                >
                  {row}&nbsp;&nbsp;·&nbsp;&nbsp;{row}&nbsp;&nbsp;·&nbsp;&nbsp;{row}&nbsp;&nbsp;·&nbsp;&nbsp;{row}&nbsp;&nbsp;·&nbsp;&nbsp;
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Research ───────────────────────────────────────────────────────── */

function ResearchSection() {
  const cardBg: Record<CardSlug, JSX.Element> = {
    pas: <PASCardSchematic />,
    coagulation: <CoagCardSchematic />,
    cane: <CaneCardSchematic />,
  };
  return (
    <section id="research" className="relative bg-surface">
      <div className="mx-auto max-w-container px-6 md:px-10 lg:px-14 xl:px-16 py-20 md:py-28 lg:py-32">
        {/* Header */}
        <div className="mb-14 md:mb-20 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div className="relative" data-reveal>
            <SectionTag text={RESEARCH.tag} />
            <h3 className="mt-5 font-grotesk uppercase text-bone leading-[0.88] tracking-tightest text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-[8.5rem]">
              <span className="block">{RESEARCH.headingTop}</span>
              <span className="font-serif-italic block text-vital normal-case leading-none mt-1">
                {RESEARCH.headingAccent}
              </span>
            </h3>
          </div>
          <div data-reveal data-reveal-delay="2">
            <PillLink href="#/cv" label={RESEARCH.cta} />
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {RESEARCH_CARDS.map((card, cardIdx) => {
            const statusColor =
              card.status === 'ACTIVE' ? 'bg-emerald-500'
              : card.status === 'SUBMITTED' ? 'bg-amber-400'
              : 'bg-oxygen';
            const accentColor =
              card.status === 'ACTIVE' ? 'bg-emerald-500/60'
              : card.status === 'SUBMITTED' ? 'bg-amber-400/50'
              : 'bg-oxygen/50';
            return (
              <a
                key={card.slug}
                data-reveal
                data-reveal-delay={String(cardIdx + 1)}
                href={`#/research/${card.slug}`}
                className="scan-card glow-border tilt-card liquid-glass group relative aspect-[4/5] overflow-hidden rounded-2xl transition-all duration-400 hover:shadow-[0_0_60px_rgba(230,48,70,0.1)]"
              >
                {cardBg[card.slug]}

                {/* Scrim */}
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      'linear-gradient(180deg, rgba(10,11,16,0.88) 0%, rgba(10,11,16,0.6) 25%, rgba(10,11,16,0.1) 48%, rgba(10,11,16,0.2) 68%, rgba(10,11,16,0.93) 100%)',
                  }}
                />

                {/* Watermark index */}
                <div className="absolute top-0 right-0 z-10 overflow-hidden h-full w-16 pointer-events-none">
                  <span
                    className="absolute -right-5 top-10 font-grotesk text-[4.5rem] tracking-tightest text-bone/[0.05] leading-none select-none"
                    style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
                  >
                    {card.index}
                  </span>
                </div>

                <div className="relative z-10 flex h-full flex-col justify-between p-5 md:p-6">
                  {/* Card header */}
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="mb-3 flex items-center gap-2">
                        <span className="inline-block h-px w-4 bg-vital" />
                        <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-vital/80">
                          {card.index} · {card.category}
                        </span>
                      </div>
                      <h4 className="font-grotesk uppercase text-bone leading-[0.9] tracking-tightest text-3xl sm:text-4xl lg:text-5xl">
                        <span className="block">{card.title}</span>
                        <span className="block">{card.titleTwo}</span>
                      </h4>
                      <p className="mt-3 font-mono text-[11px] leading-[1.6] text-bone/75 max-w-[26ch]">
                        {card.subtitle}
                      </p>
                    </div>
                    <span className="liquid-glass shrink-0 inline-flex h-9 w-9 items-center justify-center rounded-full text-muted group-hover:text-vital transition-colors">
                      <ArrowUpRight className="relative z-10 h-3.5 w-3.5" strokeWidth={2} />
                    </span>
                  </div>

                  {/* Card footer */}
                  <div>
                    <div className={`w-full h-px rounded-full mb-3 ${accentColor}`} />
                    <div className="liquid-glass rounded-xl px-4 py-3">
                      <div className="relative z-10 flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted">
                            {card.metaLabel}
                          </p>
                          <p className="truncate font-sans text-sm font-medium tracking-ui text-bone uppercase mt-0.5">
                            {card.metaValue}
                          </p>
                        </div>
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-bone/10 bg-graphite/60 px-2.5 py-1 shrink-0">
                          <span className={`inline-block h-1.5 w-1.5 rounded-full ${statusColor}`} />
                          <span className="font-mono text-[8.5px] uppercase tracking-[0.16em] text-muted">
                            {card.status}
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ── Contact ─────────────────────────────────────────────────────────── */

function ContactSection() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const mailto = `mailto:${PERSON.email}?subject=${encodeURIComponent(
    subject || 'Portfolio inquiry'
  )}&body=${encodeURIComponent(
    `From: ${name || 'Unsigned'}\nReply-to: ${email || 'n/a'}\n\n${message || ''}`
  )}`;

  return (
    <section id="contact" className="relative bg-graphite">
      {/* Subtle grid */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(236,230,216,0.04) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />
      <div className="relative mx-auto max-w-container px-6 md:px-10 lg:px-14 xl:px-16 py-20 md:py-28 lg:py-32">

        {/* Header */}
        <div className="grid gap-8 md:grid-cols-12 mb-14 md:mb-18">
          <div className="md:col-span-7" data-reveal>
            <SectionTag text={CONTACT.tag} />
            <span className="mt-7 font-serif-italic block text-vital text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
              {CONTACT.accent}
            </span>
            <h3 className="mt-2 font-grotesk uppercase text-bone leading-[0.88] tracking-tightest text-5xl sm:text-6xl md:text-7xl lg:text-8xl">
              {CONTACT.heading.map((line, i) => (
                <span key={i} className="block">{line}</span>
              ))}
            </h3>
          </div>
          <div className="md:col-span-5 md:pt-8" data-reveal data-reveal-delay="2">
            <p className="font-mono text-[13px] md:text-[14px] leading-[1.8] text-muted">
              {CONTACT.body}
            </p>
          </div>
        </div>

        {/* Form + channels */}
        <div className="grid gap-5 md:grid-cols-12">
          {/* Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              window.location.href = mailto;
            }}
            className="md:col-span-7 liquid-glass relative rounded-2xl p-6 md:p-10"
          >
            <div className="relative z-10 mb-7 flex items-center justify-between">
              <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-vital/75">
                Direct dispatch
              </p>
              <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-steel">
                Opens mail client
              </p>
            </div>

            <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-5">
              {[
                { label: 'Name', type: 'text', value: name, setter: setName, placeholder: 'Your name', span: 1 },
                { label: 'Email', type: 'email', value: email, setter: setEmail, placeholder: 'you@domain.com', span: 1 },
                { label: 'Subject', type: 'text', value: subject, setter: setSubject, placeholder: 'Collaboration · opportunity · inquiry', span: 2 },
              ].map((field) => (
                <label key={field.label} className={`field-wrap block ${field.span === 2 ? 'sm:col-span-2' : ''}`}>
                  <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted">{field.label}</span>
                  <input
                    type={field.type}
                    value={field.value}
                    onChange={(e) => field.setter(e.target.value)}
                    placeholder={field.placeholder}
                    className="mt-2 w-full border-0 border-b border-bone/10 bg-transparent px-0 py-2 font-mono text-sm text-bone placeholder:text-steel focus:outline-none focus:ring-0"
                  />
                </label>
              ))}
              <label className="field-wrap block sm:col-span-2">
                <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted">Message</span>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={5}
                  placeholder="Write as much or as little as you like."
                  className="mt-2 w-full resize-none border-0 border-b border-bone/10 bg-transparent px-0 py-2 font-mono text-sm leading-relaxed text-bone placeholder:text-steel focus:outline-none focus:ring-0"
                />
              </label>
            </div>

            <div className="relative z-10 mt-8">
              <button
                type="submit"
                className="group flex w-full items-center justify-between gap-3 rounded-full bg-vital px-6 py-3.5 font-sans text-sm font-medium tracking-ui text-bone transition-colors hover:bg-bone hover:text-graphite"
              >
                <span>Send dispatch</span>
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-bone/20 group-hover:bg-vital/20 transition-colors">
                  <Send className="h-3 w-3" strokeWidth={2} />
                </span>
              </button>
              <p className="mt-3 font-mono text-[9px] uppercase tracking-[0.18em] text-steel text-center">
                Routed via your default mail client
              </p>
            </div>
          </form>

          {/* Channels */}
          <div className="md:col-span-5 flex flex-col gap-4">
            <div className="liquid-glass rounded-2xl p-6 md:p-8">
              <p className="relative z-10 font-mono text-[9px] uppercase tracking-[0.2em] text-vital/75 mb-6">
                Direct lines
              </p>
              <ul className="relative z-10 divide-y divide-bone/[0.07]">
                {CONTACT.channels.map((c, i) => (
                  <li key={i}>
                    <a
                      href={c.href}
                      target={c.href.startsWith('http') ? '_blank' : undefined}
                      rel={c.href.startsWith('http') ? 'noreferrer' : undefined}
                      className="group flex items-center justify-between gap-4 py-4 transition-colors"
                    >
                      <div className="min-w-0">
                        <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted group-hover:text-vital transition-colors">
                          {c.label}
                        </p>
                        <p className="font-mono text-[13px] text-bone/80 group-hover:text-bone truncate mt-0.5 transition-colors">
                          {c.value}
                        </p>
                      </div>
                      <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-bone/10 text-muted group-hover:border-vital group-hover:text-vital transition-colors">
                        <ArrowUpRight className="h-3 w-3" strokeWidth={2} />
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <a
              href="#/cv"
              className="liquid-glass group flex items-center justify-between gap-4 rounded-2xl p-6 md:p-8 transition-colors"
            >
              <div className="relative z-10">
                <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-vital/75">
                  Curriculum Vitae
                </p>
                <p className="mt-2 font-sans text-xl font-medium tracking-ui text-bone group-hover:text-vital uppercase transition-colors">
                  View full CV
                </p>
                <p className="mt-1 font-mono text-[11px] text-muted">
                  Education · research · patents · skills
                </p>
              </div>
              <span className="relative z-10 inline-flex h-11 w-11 items-center justify-center rounded-full bg-vital text-bone group-hover:bg-bone group-hover:text-vital transition-colors">
                <FileText className="h-4 w-4" strokeWidth={1.75} />
              </span>
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-bone/[0.07] pt-6 md:flex-row md:items-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-steel">
            © {new Date().getFullYear()} · {PERSON.fullName} · Research Dossier
          </p>
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-steel">
            <MapPin className="h-3.5 w-3.5 text-vital/60" strokeWidth={1.5} />
            {PERSON.location}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Home page ───────────────────────────────────────────────────────── */

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
      <ResearchSection />
      <SectionDivider />
      <ContactSection />
    </>
  );
}

/* ── Detail page shell ───────────────────────────────────────────────── */

function DetailShell({
  index,
  category,
  shortTitle,
  fullTitle,
  subtitle,
  meta,
  schematic,
  children,
  accent,
}: {
  index: string;
  category: string;
  shortTitle: string;
  fullTitle: string;
  subtitle: string;
  meta: Array<{ label: string; value: string }>;
  schematic: JSX.Element;
  children: React.ReactNode;
  accent: string;
}) {
  return (
    <div className="relative min-h-screen bg-graphite text-bone">
      <TextureOverlay />
      <div className="mx-auto max-w-container px-6 md:px-10 lg:px-14 xl:px-16">
        <Navbar />

        {/* Header */}
        <section className="pt-10 md:pt-14 pb-12 md:pb-16">
          <div className="grid gap-10 md:grid-cols-12">
            <div className="md:col-span-8">
              <SectionTag text={`${index} · ${category}`} />
              <span className="mt-5 font-serif-italic block text-vital text-3xl sm:text-4xl md:text-5xl">
                {accent}
              </span>
              <h1 className="mt-2 font-grotesk uppercase text-bone leading-[0.9] tracking-tightest text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
                {shortTitle}
              </h1>
              <p className="mt-6 max-w-[56ch] font-mono text-[13px] md:text-[15px] leading-[1.75] text-bone/85">
                {fullTitle}
              </p>
              <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
                {subtitle}
              </p>
            </div>

            <div className="md:col-span-4">
              <div className="glass-panel rounded-2xl overflow-hidden">
                <div className="divide-y divide-bone/[0.07]">
                  {meta.map((m, i) => (
                    <div key={i} className="px-5 py-4">
                      <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-vital/75">
                        {m.label}
                      </p>
                      <p className="mt-1 font-sans text-sm font-medium tracking-ui text-bone uppercase leading-snug">
                        {m.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Schematic banner */}
        <section className="relative overflow-hidden rounded-2xl border border-bone/[0.07]">
          {schematic}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-graphite/60 via-transparent to-graphite/10" />
        </section>

        {/* Body */}
        <section className="py-14 md:py-20">{children}</section>

        {/* Footer CTA */}
        <section className="border-t border-bone/[0.07] py-10 md:py-14">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-2.5">
              <span className="vital-dot shrink-0" />
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
                Continue the dossier
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <PillLink href="#contact" label="Get in touch" />
              <PillLink href="#/cv" label="View CV" />
              <PillLink href="#research" label="Back to index" />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

/* ── PAS Detail ──────────────────────────────────────────────────────── */

function PASDetailPage() {
  const d = PAS_DETAIL;
  return (
    <DetailShell
      index={d.index}
      category={d.category}
      shortTitle={d.shortTitle}
      fullTitle={d.fullTitle}
      subtitle={d.subtitle}
      accent="Ambulatory respiratory support."
      meta={[
        { label: 'Lab', value: d.lab },
        { label: 'Principal investigator', value: d.pi },
        { label: 'Co-investigators', value: d.studyLead.join(' · ') },
        { label: 'My role', value: d.role },
      ]}
      schematic={<PASDetailSchematic />}
    >
      <div className="grid gap-12 md:grid-cols-12">
        {/* Abstract + objectives */}
        <div className="md:col-span-7">
          <SectionTag text="01 · Abstract" />
          <p className="mt-6 font-mono text-[13px] md:text-[15px] leading-[1.8] text-bone/85">
            {d.abstract}
          </p>

          <div className="mt-12">
            <SectionTag text="02 · Objectives" />
            <ul className="mt-6 space-y-4">
              {d.objectives.map((o, i) => (
                <li key={i} className="flex gap-3">
                  <span className="mt-[7px] inline-block h-px w-5 bg-vital shrink-0" />
                  <p className="font-mono text-[13px] md:text-[14px] leading-[1.75] text-bone/85">{o}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Methods */}
        <div className="md:col-span-5">
          <div className="glass-panel rounded-2xl p-6 md:p-8">
            <p className="relative z-10 font-mono text-[9px] uppercase tracking-[0.2em] text-vital/75 mb-6">Methods</p>
            <dl className="relative z-10 space-y-5">
              {d.methods.map((m, i) => (
                <div key={i}>
                  <dt className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted">{m.label}</dt>
                  <dd className="mt-1 font-mono text-[12px] md:text-[13px] leading-[1.65] text-bone/85">{m.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        {/* Diagrams */}
        <div className="md:col-span-12">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="relative overflow-hidden rounded-2xl border border-bone/[0.07]">
              <PASCircuitDiagram />
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-vital/75">VV ECMO · Circuit schematic</span>
                <span className="vital-dot" />
              </div>
            </div>
            <div className="relative overflow-hidden rounded-2xl border border-bone/[0.07]">
              <KaplanMeierDiagram />
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-vital/75">Kaplan-Meier · Cohort outcomes</span>
                <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted">2/6 endpoint</span>
              </div>
            </div>
          </div>
        </div>

        {/* Cohort */}
        <div className="md:col-span-12">
          <SectionTag text="03 · Cohort · N=6" />
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            {d.subjects.map((s, i) => (
              <div
                key={i}
                className={`glow-border liquid-glass rounded-2xl p-5 md:p-6 transition-all duration-400 hover:-translate-y-1 ${
                  s.tone === 'ok' ? 'border border-vital/25' : ''
                }`}
              >
                <div className="relative z-10 flex items-center justify-between">
                  <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted">
                    {s.id} · {s.start}
                  </p>
                  {s.tone === 'ok' ? (
                    <CheckCircle2 className="h-4 w-4 text-vital" strokeWidth={1.75} />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-steel" strokeWidth={1.5} />
                  )}
                </div>
                <p className="relative z-10 mt-3 font-grotesk text-3xl tracking-tightest text-bone uppercase">
                  {s.name}
                </p>
                <p className={`relative z-10 mt-1.5 font-mono text-[11px] uppercase tracking-[0.16em] ${s.tone === 'ok' ? 'text-vital' : 'text-muted'}`}>
                  {s.outcome}
                </p>
                <div className="relative z-10 mt-3 h-1 w-full rounded-full bg-bone/8 overflow-hidden">
                  <div
                    className="h-full rounded-full draw-line"
                    style={{
                      background: s.tone === 'ok'
                        ? 'linear-gradient(90deg, #E63046, #E63046)'
                        : 'linear-gradient(90deg, rgba(236,230,216,0.25), rgba(236,230,216,0.1))',
                      maxWidth: `${(parseInt(s.outcome.match(/\d+/)?.[0] || '30') / 30) * 100}%`,
                      animationDelay: `${i * 0.15}s`,
                    }}
                  />
                </div>
                <p className="relative z-10 mt-3 font-mono text-[11px] leading-[1.65] text-muted">
                  {s.detail}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Findings */}
        <div className="md:col-span-12">
          <SectionTag text="04 · Key findings" />
          <div className="mt-6 rounded-2xl overflow-hidden border border-bone/[0.07] divide-y divide-bone/[0.07]">
            {d.findings.map((f, i) => (
              <div key={i} className="bg-surface p-6 md:p-8 grid md:grid-cols-12 gap-4">
                <p className="md:col-span-3 font-mono text-[10px] uppercase tracking-[0.18em] text-vital/75">{f.label}</p>
                <p className="md:col-span-9 font-mono text-[13px] md:text-[14px] leading-[1.75] text-bone/85">{f.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Optimizations + outcome */}
        <div className="md:col-span-7">
          <SectionTag text="05 · Protocol optimizations" />
          <ul className="mt-6 space-y-3">
            {d.optimizations.map((o, i) => (
              <li key={i} className="flex gap-3 font-mono text-[13px] md:text-[14px] leading-[1.75] text-bone/85">
                <span className="font-grotesk text-vital text-sm tracking-wider shrink-0">{`0${i + 1}`}</span>
                <span>{o}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-5">
          <div className="glass-panel rounded-2xl p-6 md:p-8 h-full">
            <p className="relative z-10 font-mono text-[9px] uppercase tracking-[0.2em] text-vital/75 mb-4">06 · Outcome</p>
            <p className="relative z-10 font-serif-italic text-vital text-2xl md:text-3xl leading-tight">Proof of concept.</p>
            <p className="relative z-10 mt-4 font-mono text-[13px] md:text-[14px] leading-[1.75] text-bone/85">{d.outcome}</p>
          </div>
        </div>
      </div>
    </DetailShell>
  );
}

/* ── Coag Detail ─────────────────────────────────────────────────────── */

function CoagDetailPage() {
  const d = COAG_DETAIL;
  return (
    <DetailShell
      index={d.index}
      category={d.category}
      shortTitle={d.shortTitle}
      fullTitle={d.fullTitle}
      subtitle={d.subtitle}
      accent="Block surface clot. Spare hemostasis."
      meta={[
        { label: 'Lab', value: d.lab },
        { label: 'Principal investigator', value: d.pi },
        { label: 'Conference', value: 'ISTH 2026 · Abstract submitted' },
        { label: 'My role', value: d.role },
      ]}
      schematic={<CoagDetailSchematic />}
    >
      <div className="grid gap-12 md:grid-cols-12">
        <div className="md:col-span-7">
          <SectionTag text="01 · Abstract" />
          <p className="mt-6 font-sans text-base md:text-lg font-medium tracking-ui text-bone uppercase leading-snug max-w-[56ch]">
            {d.abstractTitle}
          </p>
          <p className="mt-3 font-mono text-[11px] leading-[1.75] text-muted">
            {d.authors.map((a, i) => (
              <span key={i}>
                {a.name}<sup className="text-vital ml-0.5">{a.affil}</sup>{i < d.authors.length - 1 ? ', ' : ''}
              </span>
            ))}
          </p>
          <div className="mt-2 space-y-1">
            {d.affiliations.map((aff) => (
              <p key={aff.id} className="font-mono text-[10px] text-steel">
                <sup className="text-vital">{aff.id}</sup>{' '}{aff.name}
              </p>
            ))}
          </div>
          <p className="mt-8 font-mono text-[13px] md:text-[15px] leading-[1.8] text-bone/85">{d.abstract}</p>

          <div className="mt-12">
            <SectionTag text="02 · The problem" />
            <ul className="mt-6 space-y-4">
              {d.problem.map((p, i) => (
                <li key={i} className="flex gap-3">
                  <span className="mt-[7px] inline-block h-px w-5 bg-vital shrink-0" />
                  <p className="font-mono text-[13px] md:text-[14px] leading-[1.75] text-bone/85">{p}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="md:col-span-5">
          <div className="glass-panel rounded-2xl p-6 md:p-8">
            <p className="relative z-10 font-mono text-[9px] uppercase tracking-[0.2em] text-vital/75 mb-6">Approach</p>
            <dl className="relative z-10 space-y-5">
              {d.approach.map((m, i) => (
                <div key={i}>
                  <dt className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted">{m.label}</dt>
                  <dd className="mt-1 font-mono text-[12px] md:text-[13px] leading-[1.65] text-bone/85">{m.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <div className="md:col-span-7">
          <SectionTag text="03 · My contributions" />
          <ul className="mt-6 space-y-4">
            {d.contributions.map((c, i) => (
              <li key={i} className="flex gap-3 font-mono text-[13px] md:text-[14px] leading-[1.75] text-bone/85">
                <span className="font-grotesk text-vital text-sm tracking-wider shrink-0">{`C-${String(i + 1).padStart(2, '0')}`}</span>
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-5">
          <div className="glass-panel rounded-2xl p-6 md:p-8">
            <p className="relative z-10 font-mono text-[9px] uppercase tracking-[0.2em] text-vital/75 mb-4">Selected references</p>
            <ul className="relative z-10 space-y-3">
              {d.references.map((r, i) => (
                <li key={i} className="font-mono text-[11px] md:text-[12px] leading-[1.65] text-muted border-l border-bone/10 pl-3">{r}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </DetailShell>
  );
}

/* ── Cane Detail ─────────────────────────────────────────────────────── */

function CaneDetailPage() {
  const d = CANE_DETAIL;
  return (
    <DetailShell
      index={d.index}
      category={d.category}
      shortTitle={d.shortTitle}
      fullTitle={d.fullTitle}
      subtitle={d.subtitle}
      accent="Active assistive mobility."
      meta={[
        { label: 'Patent', value: d.patentNumber },
        { label: 'Office', value: d.office },
        { label: 'Filed · Granted', value: `${d.filed} → ${d.registered}` },
        { label: 'Inventor · Status', value: `${d.inventor} · ${d.status}` },
      ]}
      schematic={<CaneDetailSchematic />}
    >
      <div className="grid gap-12 md:grid-cols-12">
        <div className="md:col-span-7">
          <SectionTag text="01 · Abstract" />
          <p className="mt-6 font-mono text-[13px] md:text-[15px] leading-[1.8] text-bone/85">{d.abstract}</p>

          <div className="mt-12">
            <SectionTag text="02 · Problem statement" />
            <ul className="mt-6 space-y-4">
              {d.problem.map((p, i) => (
                <li key={i} className="flex gap-3">
                  <span className="mt-[7px] inline-block h-px w-5 bg-vital shrink-0" />
                  <p className="font-mono text-[13px] md:text-[14px] leading-[1.75] text-bone/85">{p}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-12">
            <SectionTag text="03 · Solution" />
            <ol className="mt-6 space-y-4">
              {d.solution.map((s, i) => (
                <li key={i} className="flex gap-3">
                  <span className="font-grotesk text-vital text-sm tracking-wider shrink-0">{`0${i + 1}`}</span>
                  <p className="font-mono text-[13px] md:text-[14px] leading-[1.75] text-bone/85">{s}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="md:col-span-5">
          <div className="glass-panel rounded-2xl p-6 md:p-8 sticky top-8">
            <p className="relative z-10 font-mono text-[9px] uppercase tracking-[0.2em] text-vital/75 mb-6">Parts list · BOM</p>
            <ul className="relative z-10 space-y-4">
              {d.components.map((c) => (
                <li key={c.id} className="grid grid-cols-[36px_1fr] gap-3 border-b border-bone/[0.07] pb-3 last:border-0">
                  <span className="font-grotesk text-vital text-sm tracking-wider">{c.id}</span>
                  <div>
                    <p className="font-sans text-sm font-medium tracking-ui text-bone uppercase">{c.label}</p>
                    <p className="mt-0.5 font-mono text-[11px] leading-[1.6] text-muted">{c.detail}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="md:col-span-12">
          <SectionTag text="04 · Representative claims" />
          <div className="mt-6 rounded-2xl overflow-hidden border border-bone/[0.07] divide-y divide-bone/[0.07]">
            {d.claims.map((c, i) => (
              <div key={i} className="bg-surface p-6 md:p-8 grid md:grid-cols-12 gap-4">
                <p className="md:col-span-2 font-mono text-[10px] uppercase tracking-[0.18em] text-vital/75">Claim {i + 1}</p>
                <p className="md:col-span-10 font-mono text-[13px] md:text-[14px] leading-[1.75] text-bone/85">{c}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="md:col-span-12">
          <div className="glass-panel rounded-2xl p-8 md:p-12">
            <p className="relative z-10 font-mono text-[9px] uppercase tracking-[0.2em] text-vital/75 mb-4">05 · Impact</p>
            <p className="relative z-10 font-serif-italic text-vital text-3xl md:text-5xl leading-tight">
              Mechanical feedback, not just sensory alert.
            </p>
            <p className="relative z-10 mt-6 max-w-[72ch] font-mono text-[13px] md:text-[15px] leading-[1.8] text-bone/85">
              {d.impact}
            </p>
          </div>
        </div>
      </div>
    </DetailShell>
  );
}

/* ── CV Page ─────────────────────────────────────────────────────────── */

function CVPage() {
  return (
    <div className="relative min-h-screen bg-graphite text-bone">
      <TextureOverlay />
      <div className="mx-auto max-w-container px-6 md:px-10 lg:px-14 xl:px-16">
        <Navbar />

        <section className="pt-10 md:pt-14 pb-10 md:pb-14">
          <div className="grid gap-8 md:grid-cols-12">
            <div className="md:col-span-8">
              <SectionTag text={CV.tag} />
              <h1 className="mt-5 font-grotesk uppercase text-bone leading-[0.88] tracking-tightest text-5xl sm:text-6xl md:text-7xl lg:text-8xl">
                {CV.heading}
              </h1>
              <p className="mt-4 font-mono text-[13px] md:text-[14px] leading-[1.75] text-muted">
                {CV.subheading}
              </p>
            </div>

            <div className="md:col-span-4 md:pt-6">
              <div className="glass-panel rounded-2xl p-5 md:p-6">
                <p className="relative z-10 font-mono text-[9px] uppercase tracking-[0.2em] text-vital/75">Contact</p>
                <p className="relative z-10 mt-2 font-mono text-[13px] text-bone">{PERSON.email}</p>
                <p className="relative z-10 font-mono text-[12px] text-muted">{PERSON.personalEmail}</p>
                <p className="relative z-10 mt-3 font-mono text-[11px] text-steel">
                  {PERSON.linkedinHandle} · {PERSON.location}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden rounded-2xl border border-bone/[0.07]">
          <CVSchematic />
        </section>

        <section className="py-14 md:py-20 grid gap-12 md:grid-cols-12">
          {/* Education */}
          <div className="md:col-span-12">
            <SectionTag text="01 · Education" />
            <div className="mt-6 grid gap-4">
              {CV.education.map((e, i) => (
                <div key={i} className="glass-panel rounded-2xl p-6 md:p-8 grid gap-6 md:grid-cols-12">
                  <div className="relative z-10 md:col-span-4">
                    <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-vital/75">{e.dates}</p>
                    <p className="mt-3 font-grotesk text-2xl md:text-3xl tracking-tightest text-bone uppercase">{e.inst}</p>
                    <p className="mt-1 font-mono text-[11px] text-muted">{e.loc}</p>
                  </div>
                  <div className="relative z-10 md:col-span-8">
                    <p className="font-sans text-lg font-semibold tracking-ui text-bone uppercase">{e.degree}</p>
                    <p className="mt-2 font-mono text-[13px] md:text-[14px] leading-[1.75] text-bone/85">{e.program}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Research */}
          <div className="md:col-span-12">
            <SectionTag text="02 · Research" />
            <div className="mt-6 grid gap-4">
              {CV.research.map((r, i) => (
                <div key={i} className="glass-panel rounded-2xl p-6 md:p-8 grid gap-6 md:grid-cols-12">
                  <div className="relative z-10 md:col-span-4">
                    <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-vital/75">{r.dates}</p>
                    <p className="mt-3 font-grotesk text-xl md:text-2xl tracking-tightest text-bone uppercase">{r.lab}</p>
                    <p className="mt-1 font-mono text-[11px] text-muted">{r.inst}</p>
                    <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.16em] text-vital/75">{r.role}</p>
                    <p className="mt-1 font-mono text-[11px] text-muted">{r.pi}</p>
                  </div>
                  <div className="relative z-10 md:col-span-8">
                    <ul className="space-y-3">
                      {r.bullets.map((b, j) => (
                        <li key={j} className="flex gap-3 font-mono text-[13px] md:text-[14px] leading-[1.75] text-bone/85">
                          <span className="mt-[7px] inline-block h-px w-5 bg-vital shrink-0" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Patents */}
          <div className="md:col-span-12">
            <SectionTag text="03 · Patents" />
            <div className="mt-6 grid gap-4">
              {CV.patents.map((p, i) => (
                <a key={i} href="#/research/cane" className="glass-panel group rounded-2xl p-6 md:p-8 grid gap-6 md:grid-cols-12">
                  <div className="relative z-10 md:col-span-4">
                    <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-vital/75">{p.filed} → {p.granted}</p>
                    <p className="mt-3 font-grotesk text-2xl md:text-3xl tracking-tightest text-bone uppercase group-hover:text-vital transition-colors">{p.number}</p>
                    <p className="mt-1 font-mono text-[11px] text-muted">{p.office}</p>
                  </div>
                  <div className="relative z-10 md:col-span-7 flex items-center">
                    <p className="font-mono text-[13px] md:text-[14px] leading-[1.75] text-bone/85">
                      {p.title} — <span className="text-muted">{p.inventor}</span>
                    </p>
                  </div>
                  <div className="relative z-10 md:col-span-1 flex items-center justify-end">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-vital text-bone group-hover:bg-bone group-hover:text-vital transition-colors">
                      <ArrowUpRight className="h-4 w-4" strokeWidth={1.75} />
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Skills */}
          <div className="md:col-span-12">
            <SectionTag text="04 · Skills + Certifications" />
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {CV.skills.map((s, i) => (
                <div key={i} className="glass-panel rounded-2xl p-5 md:p-6">
                  <p className="relative z-10 font-mono text-[9px] uppercase tracking-[0.2em] text-vital/75">{s.group}</p>
                  <ul className="relative z-10 mt-4 space-y-2">
                    {s.items.map((it, j) => (
                      <li key={j} className="font-mono text-[12px] leading-[1.6] text-bone/85">{it}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Languages */}
          <div className="md:col-span-12">
            <div className="glass-panel rounded-2xl p-6 md:p-8 flex flex-wrap items-center gap-6">
              <p className="relative z-10 font-mono text-[9px] uppercase tracking-[0.2em] text-vital/75">Languages</p>
              {CV.languages.map((l, i) => (
                <p key={i} className="relative z-10 font-sans text-lg font-semibold tracking-ui text-bone uppercase">{l}</p>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-bone/[0.07] py-10 md:py-14">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-steel">
              Curriculum Vitae · {PERSON.fullName}
            </p>
            <div className="flex flex-wrap gap-3">
              <PillLink href="#contact" label="Get in touch" />
              <PillLink href="#research" label="Research index" />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

/* ── Root ────────────────────────────────────────────────────────────── */

function ScrollOnRouteChange({ route }: { route: Route }) {
  useEffect(() => {
    if (route.kind === 'home') {
      if (route.anchor && route.anchor !== '#home') {
        const el = document.querySelector(route.anchor);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          return;
        }
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
  }, [route]);
  return null;
}

export default function App() {
  const route = useHashRoute();

  let body: JSX.Element;
  if (route.kind === 'detail' && route.slug === 'pas') body = <PASDetailPage />;
  else if (route.kind === 'detail' && route.slug === 'coagulation') body = <CoagDetailPage />;
  else if (route.kind === 'detail' && route.slug === 'cane') body = <CaneDetailPage />;
  else if (route.kind === 'cv') body = <CVPage />;
  else
    body = (
      <div className="relative min-h-screen bg-graphite text-bone">
        <TextureOverlay />
        <main className="relative z-0">
          <HomePage />
        </main>
      </div>
    );

  return (
    <>
      <ScrollProgress />
      <CursorGlow />
      <BackToTop />
      <ScrollOnRouteChange route={route} />
      {body}
    </>
  );
}
