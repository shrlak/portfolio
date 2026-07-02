import { useEffect, useRef, useState } from 'react';
import {
  ArrowUpRight,
  ArrowRight,
  Mail,
  Linkedin,
  Github,
  Phone,
  MapPin,
  Menu,
  X,
  FlaskConical,
  FileText,
  Cog,
  HeartPulse,
} from 'lucide-react';
import {
  PERSON,
  HERO,
  MARQUEE,
  ABOUT,
  EDUCATION,
  RESEARCH,
  PUBLICATIONS,
  PROJECTS,
  EXPERIENCE,
  EXP_FILTERS,
  SKILLS,
  CONTACT,
  NAV_ITEMS,
  type ExpKind,
} from './content';

/* ============================================================================
 * Hooks
 * ========================================================================== */

// Reveal-on-scroll: adds .is-in to any [data-reveal] as it enters the viewport.
function useScrollReveal() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
    if (!('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('is-in'));
      return;
    }
    const obs = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('is-in');
            obs.unobserve(e.target);
          }
        }),
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  });
}

// Which section is currently in view (for nav highlighting).
function useActiveSection(ids: string[]): string {
  const [active, setActive] = useState('');
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        }),
      { rootMargin: '-45% 0px -50% 0px' }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, [ids]);
  return active;
}

// Count-up when the element scrolls into view.
function useCountUp(target: number, duration = 1400) {
  const ref = useRef<HTMLSpanElement>(null);
  const [val, setVal] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      setVal(target);
      return;
    }
    let done = false;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || done) return;
        done = true;
        obs.disconnect();
        const t0 = performance.now();
        const tick = (now: number) => {
          const t = Math.min((now - t0) / duration, 1);
          const eased = 1 - Math.pow(1 - t, 3);
          setVal(Math.round(eased * target));
          if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.5 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [target, duration]);
  return { ref, val };
}

function useScrolled(threshold = 24) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > threshold);
    h();
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, [threshold]);
  return scrolled;
}

/* ============================================================================
 * Decorative — mechanical + biomedical hero motif
 * ========================================================================== */

function GearGlyph({ teeth, r }: { teeth: number; r: number }) {
  const ri = r * 0.62;
  const rh = r * 0.3;
  const tooth = r * 0.16;
  const path: string[] = [];
  const seg = (Math.PI * 2) / teeth;
  const pt = (ang: number, rad: number) =>
    `${(Math.cos(ang) * rad + 50).toFixed(2)},${(Math.sin(ang) * rad + 50).toFixed(2)}`;
  for (let i = 0; i < teeth; i++) {
    const a0 = i * seg;
    const a1 = a0 + seg * 0.32;
    const a2 = a0 + seg * 0.5;
    const a3 = a0 + seg * 0.82;
    path.push(
      `${i === 0 ? 'M' : 'L'}${pt(a0, r - tooth)}`,
      `L${pt(a1, r)}`,
      `L${pt(a2, r)}`,
      `L${pt(a3, r - tooth)}`
    );
  }
  return (
    <>
      <path d={`${path.join(' ')} Z`} fill="none" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="50" cy="50" r={ri} fill="none" stroke="currentColor" strokeWidth="1" opacity="0.5" />
      <circle cx="50" cy="50" r={rh} fill="none" stroke="currentColor" strokeWidth="1.4" />
      {[0, 60, 120, 180, 240, 300].map((deg) => {
        const a = (deg * Math.PI) / 180;
        return (
          <line
            key={deg}
            x1={(Math.cos(a) * rh + 50).toFixed(2)}
            y1={(Math.sin(a) * rh + 50).toFixed(2)}
            x2={(Math.cos(a) * ri + 50).toFixed(2)}
            y2={(Math.sin(a) * ri + 50).toFixed(2)}
            stroke="currentColor"
            strokeWidth="0.8"
            opacity="0.4"
          />
        );
      })}
    </>
  );
}

function HeroMotif() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {/* Large slow gear, top-right */}
      <svg
        viewBox="0 0 100 100"
        className="absolute -right-16 -top-10 h-[420px] w-[420px] text-ink/[0.06] sm:h-[540px] sm:w-[540px]"
      >
        <g className="animate-spinslow" style={{ transformOrigin: '50px 50px' }}>
          <GearGlyph teeth={18} r={44} />
        </g>
      </svg>
      {/* Smaller counter-rotating gear */}
      <svg
        viewBox="0 0 100 100"
        className="absolute right-[38%] top-[46%] hidden h-[190px] w-[190px] text-vital/[0.10] md:block"
      >
        <g className="animate-spinrev" style={{ transformOrigin: '50px 50px' }}>
          <GearGlyph teeth={12} r={42} />
        </g>
      </svg>
      {/* ECG / pulse line sweeping the base of the hero */}
      <svg
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        className="absolute bottom-[8%] left-0 h-24 w-full text-vital/40"
      >
        <path
          d="M0 60 H240 l22 -44 20 88 24 -70 18 26 H540 l22 -52 20 96 24 -74 18 30 H900 l22 -40 20 80 22 -40 H1200"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="ecg-line"
        />
      </svg>
    </div>
  );
}

/* ============================================================================
 * Chrome
 * ========================================================================== */

function Nav({ active }: { active: string }) {
  const scrolled = useScrolled(20);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <header
      className={[
        'fixed inset-x-0 top-0 z-50 transition-all duration-300',
        scrolled
          ? 'border-b border-line bg-white/80 backdrop-blur-xl'
          : 'border-b border-transparent bg-transparent',
      ].join(' ')}
    >
      <div className="shell flex h-16 items-center justify-between">
        <a href="#top" className="group flex items-center gap-2.5" aria-label="Spencer Kim — home">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-ink text-white transition-transform duration-300 group-hover:rotate-12">
            <Cog size={17} strokeWidth={2} />
          </span>
          <span className="text-[15px] font-semibold tracking-tight">Spencer Kim</span>
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="navlink"
              data-active={active && item.href === `#${active}` ? 'true' : undefined}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <a href={CONTACT.channels[0].href} className="btn btn-primary !px-4 !py-2 !text-[13px]">
            Get in touch <ArrowRight size={15} />
          </a>
        </div>

        <button
          className="flex h-10 w-10 items-center justify-center rounded-lg text-ink md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile sheet */}
      <div
        className={[
          'md:hidden overflow-hidden border-t border-line bg-white transition-[max-height,opacity] duration-300',
          open ? 'max-h-[80vh] opacity-100' : 'max-h-0 opacity-0',
        ].join(' ')}
      >
        <nav className="shell flex flex-col gap-1 py-4">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="flex items-center justify-between rounded-xl px-3 py-3 text-[17px] font-medium text-ink hover:bg-soft"
            >
              {item.label}
              <ArrowUpRight size={17} className="text-faint" />
            </a>
          ))}
          <a
            href={CONTACT.channels[0].href}
            onClick={() => setOpen(false)}
            className="btn btn-primary mt-2 justify-center"
          >
            Get in touch <ArrowRight size={16} />
          </a>
        </nav>
      </div>
    </header>
  );
}

function SectionHead({
  eyebrow,
  title,
  kicker,
}: {
  eyebrow: string;
  title: React.ReactNode;
  kicker?: string;
}) {
  return (
    <div className="max-w-2xl" data-reveal>
      <span className="eyebrow">{eyebrow}</span>
      <h2 className="display mt-5 text-[clamp(30px,4.6vw,52px)]">{title}</h2>
      {kicker && <p className="mt-4 text-[17px] leading-relaxed text-subink">{kicker}</p>}
    </div>
  );
}

/* ============================================================================
 * Sections
 * ========================================================================== */

function Hero() {
  return (
    <section id="top" className="relative overflow-hidden grid-bg">
      <HeroMotif />
      <div className="shell relative pb-16 pt-32 sm:pt-40 md:pb-28 md:pt-44">
        <div
          className="inline-flex animate-fade-up items-center gap-2 rounded-full border border-line bg-white/70 px-3.5 py-1.5 text-[11px] font-medium tracking-caps text-subink backdrop-blur"
          style={{ animationDelay: '40ms' }}
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-vital opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-vital" />
          </span>
          <span className="mono">{HERO.eyebrow}</span>
        </div>

        <h1 className="display mt-7 max-w-[15ch] text-[clamp(40px,8.2vw,92px)]">
          {HERO.headline.map((line, i) => (
            <span
              key={i}
              className="block animate-fade-up"
              style={{ animationDelay: `${140 + i * 110}ms` }}
            >
              {i === HERO.headline.length - 1 ? (
                <span className="text-gradient">{line}</span>
              ) : (
                line
              )}
            </span>
          ))}
        </h1>

        <p
          className="mt-8 max-w-xl animate-fade-up text-[18px] leading-relaxed text-subink sm:text-[20px]"
          style={{ animationDelay: '520ms' }}
        >
          {HERO.subhead}
        </p>

        <div
          className="mt-9 flex animate-fade-up flex-wrap items-center gap-3"
          style={{ animationDelay: '620ms' }}
        >
          <a href="#research" className="btn btn-primary">
            View research <ArrowRight size={16} />
          </a>
          <a href="#projects" className="btn btn-ghost">
            See projects
          </a>
        </div>

        {/* Stat row */}
        <div
          className="mt-16 grid max-w-2xl animate-fade-up grid-cols-3 gap-px overflow-hidden rounded-2xl border border-line bg-line"
          style={{ animationDelay: '720ms' }}
        >
          {HERO.stats.map((s) => (
            <HeroStat key={s.label} value={s.value} label={s.label} mono={s.mono} />
          ))}
        </div>
      </div>
    </section>
  );
}

function HeroStat({ value, label, mono }: { value: number; label: string; mono: string }) {
  const { ref, val } = useCountUp(value);
  return (
    <div className="bg-white px-4 py-5 sm:px-6">
      <div className="mono text-[10px] tracking-widest text-faint">{mono}</div>
      <div className="mt-1.5 text-[clamp(26px,4vw,40px)] font-bold tracking-tightest">
        <span ref={ref}>{val}</span>
      </div>
      <div className="mt-0.5 text-[12px] leading-tight text-subink sm:text-[13px]">{label}</div>
    </div>
  );
}

function Marquee() {
  const items = [...MARQUEE, ...MARQUEE];
  return (
    <div className="border-y border-line bg-soft py-4">
      <div className="marquee-mask overflow-hidden">
        <div className="marquee-track">
          {items.map((t, i) => (
            <span key={i} className="mx-6 inline-flex items-center gap-6 text-[13px] font-medium text-subink">
              <span className="mono tracking-wide">{t}</span>
              <span className="text-vital">◆</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function About() {
  return (
    <section id="about" className="section">
      <div className="shell grid gap-14 md:grid-cols-[1.3fr_1fr] md:gap-20">
        <div>
          <span className="eyebrow" data-reveal>
            {ABOUT.eyebrow}
          </span>
          <h2
            className="display mt-5 text-[clamp(26px,3.8vw,42px)]"
            data-reveal
            style={{ ['--reveal-delay' as string]: '60ms' }}
          >
            {ABOUT.heading}
          </h2>
          <div className="mt-7 space-y-5 text-[17px] leading-relaxed text-subink">
            {ABOUT.body.map((p, i) => (
              <p key={i} data-reveal style={{ ['--reveal-delay' as string]: `${120 + i * 80}ms` }}>
                {p}
              </p>
            ))}
          </div>
        </div>

        <div className="md:pt-12">
          <div
            className="card overflow-hidden"
            data-reveal
            style={{ ['--reveal-delay' as string]: '160ms' }}
          >
            {ABOUT.facts.map((f, i) => (
              <div
                key={f.label}
                className={['flex flex-col gap-1 px-6 py-5', i !== 0 ? 'border-t border-line' : ''].join(' ')}
              >
                <span className="mono text-[10px] tracking-widest text-vital">{f.label}</span>
                <span className="text-[15px] font-medium text-ink">{f.value}</span>
              </div>
            ))}
          </div>

          <div
            className="mt-6 grid grid-cols-2 gap-4"
            data-reveal
            style={{ ['--reveal-delay' as string]: '240ms' }}
          >
            {EDUCATION.map((e) => (
              <div key={e.inst} className="card card-hover p-5">
                <div className="mono text-[10px] tracking-widest text-faint">{e.dates}</div>
                <div className="mt-2 text-[15px] font-semibold leading-tight text-ink">{e.inst}</div>
                <div className="mt-1 text-[12.5px] leading-snug text-subink">{e.credential}</div>
                <div className="mt-3 inline-flex rounded-md bg-vital-soft px-2 py-1 text-[11px] font-semibold text-vital">
                  {e.gpa}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Research() {
  return (
    <section id="research" className="section bg-soft">
      <div className="shell">
        <SectionHead
          eyebrow={RESEARCH.eyebrow}
          title={
            <>
              Cook Cardiopulmonary <span className="text-vital">Engineering Lab</span>
            </>
          }
          kicker={RESEARCH.intro}
        />

        {/* Lab meta strip */}
        <div
          className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 rounded-2xl border border-line bg-white px-6 py-5"
          data-reveal
        >
          {[
            { icon: <FlaskConical size={16} />, label: RESEARCH.role },
            { icon: <MapPin size={16} />, label: RESEARCH.inst },
            { icon: <HeartPulse size={16} />, label: RESEARCH.pi },
          ].map((m, i) => (
            <div key={i} className="flex items-center gap-2.5 text-[13.5px] text-subink">
              <span className="text-vital">{m.icon}</span>
              {m.label}
            </div>
          ))}
          <span className="mono ml-auto text-[12px] tracking-wide text-faint">{RESEARCH.dates}</span>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          {RESEARCH.studies.map((s, i) => (
            <article
              key={s.title}
              className="card card-hover group flex flex-col p-7"
              data-reveal
              style={{ ['--reveal-delay' as string]: `${i * 80}ms` }}
            >
              <div className="flex items-center justify-between">
                <span className="pill">{s.tag}</span>
                <span className="mono text-[11px] text-faint">0{i + 1}</span>
              </div>
              <h3 className="mt-5 text-[19px] font-semibold leading-snug text-ink">{s.title}</h3>
              <p className="mt-3 text-[14.5px] leading-relaxed text-subink">{s.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Publications() {
  return (
    <section id="publications" className="section">
      <div className="shell">
        <SectionHead
          eyebrow="PUBLICATIONS & PATENTS"
          title="Work on the record"
          kicker="Conference abstracts from the lab and a granted patent as sole inventor."
        />
        <div className="mt-12 divide-y divide-line border-y border-line">
          {PUBLICATIONS.map((p, i) => (
            <article
              key={p.title}
              className="group grid gap-4 py-7 md:grid-cols-[130px_1fr_auto] md:gap-8"
              data-reveal
              style={{ ['--reveal-delay' as string]: `${i * 70}ms` }}
            >
              <div className="flex items-center gap-3 md:flex-col md:items-start md:gap-2">
                <span
                  className={[
                    'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold tracking-wide',
                    p.kind === 'PATENT' ? 'bg-vital-soft text-vital' : 'bg-soft text-subink',
                  ].join(' ')}
                >
                  {p.kind === 'PATENT' ? <FileText size={12} /> : <FlaskConical size={12} />}
                  {p.kind}
                </span>
                <span className="mono text-[13px] text-faint">{p.year}</span>
              </div>

              <div>
                <h3 className="text-[17px] font-semibold leading-snug text-ink transition-colors group-hover:text-vital">
                  {p.title}
                </h3>
                <p className="mt-2 text-[13.5px] leading-relaxed text-subink">{p.authors}</p>
                <p className="mt-2 text-[13px] text-faint">{p.venue}</p>
              </div>

              <div className="md:self-center">
                <span className="mono whitespace-nowrap text-[11px] tracking-wide text-vital">
                  {p.status}
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Projects() {
  return (
    <section id="projects" className="section bg-night text-white">
      <div className="shell">
        <div className="max-w-2xl" data-reveal>
          <span className="eyebrow">SELECTED PROJECTS</span>
          <h2 className="display mt-5 text-[clamp(30px,4.6vw,52px)] text-white">
            Things I’ve designed, <span className="text-vital">built, and broken on purpose.</span>
          </h2>
          <p className="mt-4 text-[17px] leading-relaxed text-white/60">
            Assistive devices, structural design, and energy systems — from patented hardware to
            simulation-driven coursework.
          </p>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-2">
          {PROJECTS.map((p, i) => (
            <article
              key={p.title}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-7 transition-all duration-500 hover:-translate-y-1.5 hover:border-white/25 hover:bg-white/[0.06]"
              data-reveal
              style={{ ['--reveal-delay' as string]: `${(i % 2) * 80}ms` }}
            >
              <div className="flex items-center justify-between">
                <span className="mono text-[11px] tracking-widest text-vital">{p.domain}</span>
                <span className="mono text-[11px] text-white/30">{p.index}</span>
              </div>

              <h3 className="mt-4 text-[22px] font-semibold leading-tight text-white">{p.title}</h3>
              <p className="mt-1.5 text-[12.5px] text-white/45">
                {p.context} · {p.dates}
              </p>

              <ul className="mt-5 space-y-2.5">
                {p.bullets.slice(0, 3).map((b, bi) => (
                  <li key={bi} className="flex gap-2.5 text-[14px] leading-relaxed text-white/70">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-vital" />
                    {b}
                  </li>
                ))}
              </ul>

              <div className="mt-6 flex flex-wrap gap-2 border-t border-white/10 pt-5">
                {p.tags.map((t) => (
                  <span
                    key={t}
                    className="mono rounded-full border border-white/10 px-2.5 py-1 text-[10.5px] text-white/55"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

const EXP_ICON: Record<ExpKind, React.ReactNode> = {
  RESEARCH: <FlaskConical size={13} />,
  WORK: <Cog size={13} />,
  TEACHING: <FileText size={13} />,
  LEADERSHIP: <HeartPulse size={13} />,
};

function Experience() {
  const [filter, setFilter] = useState<ExpKind | 'ALL'>('ALL');
  const shown = EXPERIENCE.filter((e) => filter === 'ALL' || e.kind === filter);

  return (
    <section id="experience" className="section">
      <div className="shell">
        <SectionHead
          eyebrow="EXPERIENCE"
          title="Research, leadership & work"
          kicker="A running record of where I’ve been building, teaching, and leading."
        />

        {/* Filter chips */}
        <div className="mt-9 flex flex-wrap gap-2" data-reveal>
          {EXP_FILTERS.map((f) => {
            const activeChip = filter === f.key;
            return (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={[
                  'rounded-full border px-4 py-2 text-[13px] font-medium transition-all duration-200',
                  activeChip
                    ? 'border-ink bg-ink text-white'
                    : 'border-line bg-white text-subink hover:border-ink/30 hover:text-ink',
                ].join(' ')}
              >
                {f.label}
              </button>
            );
          })}
        </div>

        {/* Timeline */}
        <div className="relative mt-10 pl-8">
          <div className="rail" />
          <div className="space-y-8">
            {shown.map((e, i) => (
              <div
                key={`${e.org}-${e.role}`}
                className="relative"
                data-reveal
                style={{ ['--reveal-delay' as string]: `${i * 60}ms` }}
              >
                <span className={['rail-dot', e.kind === 'RESEARCH' ? 'is-vital' : ''].join(' ')} />
                <div className="card card-hover -ml-1 p-6">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-soft px-2.5 py-1 text-[10px] font-semibold tracking-wide text-subink">
                      <span className="text-vital">{EXP_ICON[e.kind]}</span>
                      {e.kind}
                    </span>
                    <span className="mono ml-auto text-[12px] text-faint">{e.dates}</span>
                  </div>
                  <h3 className="mt-3.5 text-[18px] font-semibold text-ink">{e.role}</h3>
                  <p className="mt-0.5 text-[14px] text-subink">
                    {e.org} · {e.loc}
                  </p>
                  <ul className="mt-4 space-y-2">
                    {e.bullets.map((b, bi) => (
                      <li key={bi} className="flex gap-2.5 text-[14px] leading-relaxed text-subink">
                        <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-ink/30" />
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Skills() {
  return (
    <section className="section bg-soft">
      <div className="shell">
        <SectionHead eyebrow="TOOLKIT" title="Software, shop & instrumentation" />
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {SKILLS.map((group, i) => (
            <div
              key={group.group}
              className="card p-7"
              data-reveal
              style={{ ['--reveal-delay' as string]: `${i * 90}ms` }}
            >
              <h3 className="text-[17px] font-semibold text-ink">{group.group}</h3>
              <p className="mono mt-1 text-[11px] tracking-wide text-faint">{group.note}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {group.items.map((it) => (
                  <span key={it} className="pill">
                    {it}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact() {
  const iconFor = (label: string) => {
    switch (label) {
      case 'Email':
        return <Mail size={18} />;
      case 'LinkedIn':
        return <Linkedin size={18} />;
      case 'GitHub':
        return <Github size={18} />;
      case 'Phone':
        return <Phone size={18} />;
      default:
        return <ArrowUpRight size={18} />;
    }
  };
  return (
    <section id="contact" className="section">
      <div className="shell">
        <div className="overflow-hidden rounded-2xl2 border border-line bg-night px-7 py-14 text-white sm:px-14 md:py-20">
          <div className="grid gap-12 md:grid-cols-[1.1fr_1fr] md:items-center">
            <div>
              <span className="eyebrow" data-reveal>
                {CONTACT.eyebrow}
              </span>
              <h2
                className="display mt-5 text-[clamp(32px,5vw,58px)] text-white"
                data-reveal
                style={{ ['--reveal-delay' as string]: '60ms' }}
              >
                {CONTACT.heading}
              </h2>
              <p
                className="mt-5 max-w-md text-[16px] leading-relaxed text-white/60"
                data-reveal
                style={{ ['--reveal-delay' as string]: '120ms' }}
              >
                {CONTACT.body}
              </p>
            </div>

            <div className="grid gap-3" data-reveal style={{ ['--reveal-delay' as string]: '180ms' }}>
              {CONTACT.channels.map((c) => (
                <a
                  key={c.label}
                  href={c.href}
                  target={c.href.startsWith('http') ? '_blank' : undefined}
                  rel={c.href.startsWith('http') ? 'noreferrer' : undefined}
                  className="group flex items-center justify-between rounded-2xl border border-white/12 bg-white/[0.04] px-5 py-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-white/30 hover:bg-white/[0.08]"
                >
                  <span className="flex items-center gap-3.5">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white transition-colors group-hover:bg-vital">
                      {iconFor(c.label)}
                    </span>
                    <span>
                      <span className="mono block text-[10px] tracking-widest text-white/40">
                        {c.label.toUpperCase()}
                      </span>
                      <span className="text-[15px] font-medium text-white">{c.value}</span>
                    </span>
                  </span>
                  <ArrowUpRight
                    size={18}
                    className="text-white/40 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white"
                  />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-line py-10">
      <div className="shell flex flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-ink text-white">
            <Cog size={14} />
          </span>
          <span className="text-[14px] font-semibold">{PERSON.fullName}</span>
        </div>
        <p className="mono text-[11px] tracking-wide text-faint">
          {PERSON.primaryMajor} + {PERSON.additionalMajor} · {PERSON.institution} · {PERSON.classYear}
        </p>
        <div className="flex items-center gap-4">
          <a
            href={PERSON.linkedin}
            target="_blank"
            rel="noreferrer"
            className="text-faint transition-colors hover:text-ink"
            aria-label="LinkedIn"
          >
            <Linkedin size={18} />
          </a>
          <a
            href={PERSON.github}
            target="_blank"
            rel="noreferrer"
            className="text-faint transition-colors hover:text-ink"
            aria-label="GitHub"
          >
            <Github size={18} />
          </a>
          <a
            href={`mailto:${PERSON.email}`}
            className="text-faint transition-colors hover:text-ink"
            aria-label="Email"
          >
            <Mail size={18} />
          </a>
        </div>
      </div>
    </footer>
  );
}

/* ============================================================================
 * Root
 * ========================================================================== */

const SECTION_IDS = ['about', 'research', 'publications', 'projects', 'experience', 'contact'];

export default function App() {
  useScrollReveal();
  const active = useActiveSection(SECTION_IDS);

  return (
    <div className="min-h-screen bg-white">
      <Nav active={active} />
      <main>
        <Hero />
        <Marquee />
        <About />
        <Research />
        <Publications />
        <Projects />
        <Experience />
        <Skills />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
