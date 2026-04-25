import { useEffect, useState } from 'react';
import {
  Mail,
  Linkedin,
  Github,
  ArrowUpRight,
  ArrowRight,
  ArrowLeft,
  FileText,
  Activity,
  ExternalLink,
  GraduationCap,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Send,
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
  type CardSlug,
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

/* ----------------------------------------------------------------------------
 * Router
 * -------------------------------------------------------------------------- */

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

/* Scroll-triggered section reveals */
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

/* Active section tracker for nav highlighting */
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

/* ----------------------------------------------------------------------------
 * Primitives
 * -------------------------------------------------------------------------- */

function TextureOverlay() {
  return <div className="texture-overlay" aria-hidden="true" />;
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
  const dim = size === 'lg' ? 'h-14 w-14' : size === 'sm' ? 'h-10 w-10' : 'h-12 w-12';
  return (
    <a
      href={href}
      aria-label={label}
      target={external ? '_blank' : undefined}
      rel={external ? 'noreferrer' : undefined}
      className={`liquid-glass ${dim} inline-flex items-center justify-center rounded-full text-bone transition-colors hover:text-vital`}
    >
      <Icon className="h-4 w-4 relative z-10" strokeWidth={1.5} />
    </a>
  );
}

function SectionTag({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="inline-block h-[2px] w-6 bg-vital" />
      <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-vital">{text}</span>
    </div>
  );
}

function PillLink({
  href,
  label,
  external = false,
  tone = 'default',
}: {
  href: string;
  label: string;
  external?: boolean;
  tone?: 'default' | 'accent';
}) {
  const bg = tone === 'accent' ? 'bg-vital text-bone hover:bg-bone hover:text-vital' : 'bg-bone text-graphite hover:bg-vital hover:text-bone';
  return (
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noreferrer' : undefined}
      className="group inline-flex items-center gap-3"
    >
      <span className="liquid-glass inline-flex items-center gap-3 rounded-full px-6 py-4">
        <span className="relative z-10 font-grotesk text-sm tracking-[0.2em] text-bone group-hover:text-vital transition-colors uppercase">
          {label}
        </span>
        <span className={`relative z-10 inline-flex h-8 w-8 items-center justify-center rounded-full ${bg} transition-colors`}>
          {external ? (
            <ExternalLink className="h-4 w-4" strokeWidth={2} />
          ) : (
            <ArrowUpRight className="h-4 w-4" strokeWidth={2} />
          )}
        </span>
      </span>
    </a>
  );
}

const SOCIAL = [
  { icon: Mail, href: `mailto:${PERSON.email}`, label: 'Email', external: false },
  { icon: Linkedin, href: PERSON.linkedin, label: 'LinkedIn', external: true },
  { icon: Github, href: PERSON.github, label: 'GitHub', external: true },
];

/* ----------------------------------------------------------------------------
 * NAVBAR — used on every page
 * -------------------------------------------------------------------------- */

const SECTION_IDS = ['home', 'credentials', 'about', 'research', 'contact'];

function Navbar({ onHome = false }: { onHome?: boolean }) {
  const active = useActiveSection(onHome ? SECTION_IDS : []);
  return (
    <header className="relative z-20 pt-6 md:pt-8">
      <div className="flex items-center justify-between gap-4">
        <a href="#home" className="font-grotesk tracking-tightest text-bone text-lg md:text-xl leading-none">
          <span className="inline-flex items-center gap-2">
            <Activity className="h-5 w-5 text-vital" strokeWidth={1.5} />
            {PERSON.shortName}
          </span>
        </a>

        <nav className="liquid-glass hidden md:flex items-center gap-1 rounded-full px-2 py-2">
          {NAV_ITEMS.map((item) => {
            const isActive = onHome && active === item.href.replace('#', '');
            return (
              <a
                key={item.label}
                href={item.href}
                className={`relative z-10 rounded-full px-4 py-2 font-grotesk text-[13px] tracking-wide transition-colors hover:text-vital ${
                  isActive ? 'nav-active-link' : 'text-bone/90'
                }`}
              >
                {item.label}
              </a>
            );
          })}
          <a
            href="#/cv"
            className="relative z-10 rounded-full bg-vital px-4 py-2 font-grotesk text-[13px] tracking-wide text-bone transition-colors hover:bg-bone hover:text-graphite"
          >
            CV
          </a>
        </nav>

        <div className="hidden md:flex items-center gap-2">
          {SOCIAL.map((s) => (
            <IconButton key={s.label} {...s} />
          ))}
        </div>

        <div className="flex md:hidden items-center gap-2">
          <a
            href="#/cv"
            className="liquid-glass inline-flex h-10 items-center gap-2 rounded-full px-4 font-grotesk text-[12px] tracking-wide text-bone"
          >
            <span className="relative z-10">CV</span>
          </a>
          <a
            href={`mailto:${PERSON.email}`}
            aria-label="Email"
            className="liquid-glass inline-flex h-10 w-10 items-center justify-center rounded-full text-bone"
          >
            <Mail className="relative z-10 h-4 w-4" strokeWidth={1.5} />
          </a>
        </div>
      </div>
      {!onHome && (
        <div className="mt-6">
          <a
            href="#home"
            className="group inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.24em] text-bone/70 hover:text-vital transition-colors"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
            RETURN TO DOSSIER
          </a>
        </div>
      )}
    </header>
  );
}

/* ----------------------------------------------------------------------------
 * HOME PAGE
 * -------------------------------------------------------------------------- */

function HeroSection() {
  return (
    <section id="home" className="relative min-h-[100svh] overflow-hidden rounded-b-[28px] md:rounded-b-[44px] bg-graphite">
      <HeroSchematic />
      <div className="relative mx-auto flex min-h-[100svh] max-w-container flex-col px-6 md:px-10 lg:px-14">
        <Navbar onHome />

        <div className="relative flex flex-1 flex-col justify-end pb-14 md:pb-24">
          <div className="mb-6 flex gap-2 md:hidden boot-in boot-d2">
            {SOCIAL.map((s) => (
              <IconButton key={s.label} {...s} />
            ))}
          </div>

          <span className="font-serif-italic relative mb-3 block text-vital text-4xl sm:text-5xl md:text-6xl lg:text-7xl md:mb-4 boot-in boot-d3">
            {HERO.accent}
          </span>

          <h1 className="relative font-grotesk uppercase text-bone leading-[0.88] tracking-tightest text-[15vw] md:text-[11vw] lg:text-[10.5vw] xl:text-[11rem] 2xl:text-[12.5rem] boot-in boot-d4">
            {HERO.heading.map((line, i) => (
              <span key={i} className="block">
                {line}
              </span>
            ))}
          </h1>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-bone/10 pt-6 boot-in boot-d6">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-bone/75">
              {HERO.footnote}
            </p>
            <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-bone/60">
              {HERO.tag}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

function CredentialsSection() {
  return (
    <section id="credentials" className="relative overflow-hidden bg-graphite">
      <CredentialsSchematic />
      <div className="relative mx-auto max-w-container px-6 md:px-10 lg:px-14 py-20 md:py-28">
        <div className="grid gap-10 md:grid-cols-12 md:gap-12">
          <div className="md:col-span-5" data-reveal>
            <SectionTag text={CREDENTIALS.tag} />
            <span className="mt-6 font-serif-italic block text-vital text-4xl sm:text-5xl md:text-6xl">
              {CREDENTIALS.accent}
            </span>
            <h2 className="mt-2 font-grotesk uppercase text-bone leading-[0.88] tracking-tightest text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
              {CREDENTIALS.heading.map((line, i) => (
                <span key={i} className="block">
                  {line}
                </span>
              ))}
            </h2>
            <p className="mt-8 font-mono text-sm md:text-[15px] leading-[1.7] text-bone/85 tracking-[0.02em]">
              {CREDENTIALS.statement}
            </p>
            <div className="mt-10 flex items-center gap-3">
              <GraduationCap className="h-5 w-5 text-vital" strokeWidth={1.5} />
              <span className="font-grotesk text-sm tracking-[0.22em] text-bone uppercase">
                Class of 2027 · In residence
              </span>
            </div>
          </div>

          <div className="md:col-span-7" data-reveal data-reveal-delay="2">
            <div className="liquid-glass relative overflow-hidden rounded-3xl">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-bone/10">
                {CREDENTIALS.items.map((item, i) => (
                  <div key={i} className="bg-graphite p-5 md:p-6">
                    <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-vital">
                      {item.label}
                    </p>
                    <p className="mt-2 font-grotesk text-lg md:text-xl tracking-wide text-bone uppercase leading-tight">
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

function AboutSection() {
  return (
    <section id="about" className="relative min-h-[90svh] overflow-hidden bg-graphite">
      <AboutSchematic />
      <div className="relative mx-auto flex min-h-[90svh] max-w-container flex-col justify-between px-6 md:px-10 lg:px-14 py-20 md:py-28">
        <div className="grid gap-12 md:grid-cols-12 md:gap-10">
          <div className="md:col-span-7" data-reveal>
            <SectionTag text={ABOUT.tag} />
            <span className="mt-6 font-serif-italic block text-vital text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
              {ABOUT.accent}
            </span>
            <h2 className="mt-2 font-grotesk uppercase text-bone leading-[0.88] tracking-tightest text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-[9rem]">
              {ABOUT.heading.map((line, i) => (
                <span key={i} className="block">
                  {line}
                </span>
              ))}
            </h2>
          </div>

          <div className="md:col-span-5 flex flex-col gap-6 md:pt-6" data-reveal data-reveal-delay="2">
            {ABOUT.body.map((p, i) => (
              <p
                key={i}
                className="font-mono text-[13px] md:text-[15px] leading-[1.75] text-bone/90 tracking-[0.02em]"
              >
                {p}
              </p>
            ))}
            <a
              href="#contact"
              className="liquid-glass inline-flex w-fit items-center gap-2 rounded-full px-5 py-2 font-grotesk text-xs tracking-[0.22em] text-bone hover:text-vital transition-colors"
            >
              <span className="relative z-10">OPEN TO COLLABORATION · SUMMER 2026</span>
              <ArrowRight className="relative z-10 h-3.5 w-3.5" strokeWidth={1.75} />
            </a>
          </div>
        </div>

        <div className="relative mt-14 md:mt-20 overflow-hidden">
          <div className="flex flex-col gap-3 md:gap-5">
            {ABOUT.keywordRows.map((row, i) => (
              <div
                key={i}
                className="font-grotesk whitespace-nowrap uppercase text-bone/10 leading-none tracking-[0.04em] text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl"
                style={{ transform: `translateX(${i % 2 === 0 ? '0' : '-4%'})` }}
              >
                {row}&nbsp;&nbsp;·&nbsp;&nbsp;{row}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ResearchSection() {
  const cardBg: Record<CardSlug, JSX.Element> = {
    pas: <PASCardSchematic />,
    coagulation: <CoagCardSchematic />,
    cane: <CaneCardSchematic />,
  };
  return (
    <section id="research" className="relative bg-graphite">
      <div className="mx-auto max-w-container px-6 md:px-10 lg:px-14 py-20 md:py-28">
        <div className="mb-12 md:mb-20 flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <div className="relative" data-reveal>
            <SectionTag text={RESEARCH.tag} />
            <h3 className="mt-4 font-grotesk uppercase text-bone leading-[0.88] tracking-tightest text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-[9rem]">
              <span className="block">{RESEARCH.headingTop}</span>
              <span className="font-serif-italic block text-vital normal-case leading-none">
                {RESEARCH.headingAccent}
              </span>
            </h3>
          </div>

          <PillLink href="#/cv" label={RESEARCH.cta} />
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {RESEARCH_CARDS.map((card, cardIdx) => (
            <a
              key={card.slug}
              data-reveal
              data-reveal-delay={String(cardIdx + 1)}
              href={`#/research/${card.slug}`}
              className="scan-card liquid-glass group relative aspect-[4/5] overflow-hidden rounded-3xl transition-transform hover:-translate-y-2 hover:shadow-[0_0_40px_rgba(230,48,70,0.15)]"
            >
              {cardBg[card.slug]}

              {/* Legibility scrim — darkens backdrop behind card copy */}
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    'linear-gradient(180deg, rgba(10,11,16,0.92) 0%, rgba(10,11,16,0.72) 20%, rgba(10,11,16,0.15) 45%, rgba(10,11,16,0.25) 70%, rgba(10,11,16,0.94) 100%)',
                }}
              />

              <div className="relative z-10 flex h-full flex-col justify-between p-5 md:p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="mb-2 flex items-center gap-2">
                      <span className="inline-block h-[2px] w-4 bg-vital" />
                      <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-vital">
                        {card.index} · {card.category}
                      </span>
                    </div>
                    <h4 className="font-grotesk uppercase text-bone leading-[0.9] tracking-tightest text-3xl sm:text-4xl md:text-4xl lg:text-5xl">
                      <span className="block">{card.title}</span>
                      <span className="block">{card.titleTwo}</span>
                    </h4>
                    <p className="mt-3 font-mono text-[12px] leading-[1.55] text-bone/80 max-w-[28ch]">
                      {card.subtitle}
                    </p>
                  </div>
                  <span className="liquid-glass inline-flex h-10 w-10 items-center justify-center rounded-full text-bone group-hover:text-vital transition-colors">
                    <ArrowUpRight className="relative z-10 h-4 w-4" strokeWidth={1.75} />
                  </span>
                </div>

                <div className="liquid-glass rounded-2xl px-4 py-3">
                  <div className="relative z-10 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-bone/60">
                        {card.metaLabel} · {card.status}
                      </p>
                      <p className="truncate font-grotesk text-sm tracking-wide text-bone uppercase">
                        {card.metaValue}
                      </p>
                    </div>
                    <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-vital text-bone">
                      <ArrowUpRight className="h-4 w-4" strokeWidth={2.25} />
                    </span>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------------------
 * CONTACT — form + info grid
 * -------------------------------------------------------------------------- */

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
      <div className="mx-auto max-w-container px-6 md:px-10 lg:px-14 py-20 md:py-28">
        {/* Header */}
        <div className="grid gap-8 md:grid-cols-12 mb-12 md:mb-16">
          <div className="md:col-span-7">
            <SectionTag text={CONTACT.tag} />
            <span className="mt-6 font-serif-italic block text-vital text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
              {CONTACT.accent}
            </span>
            <h3 className="mt-2 font-grotesk uppercase text-bone leading-[0.88] tracking-tightest text-5xl sm:text-6xl md:text-7xl lg:text-8xl">
              {CONTACT.heading.map((line, i) => (
                <span key={i} className="block">
                  {line}
                </span>
              ))}
            </h3>
          </div>
          <div className="md:col-span-5 md:pt-8">
            <p className="font-mono text-[13px] md:text-[15px] leading-[1.75] text-bone/90">
              {CONTACT.body}
            </p>
          </div>
        </div>

        {/* Form + Channels grid */}
        <div className="grid gap-6 md:grid-cols-12">
          {/* FORM */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              window.location.href = mailto;
            }}
            className="md:col-span-7 liquid-glass relative rounded-3xl p-6 md:p-10"
          >
            <div className="relative z-10 mb-6 flex items-center justify-between">
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-vital">
                FORM · DIRECT DISPATCH
              </p>
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-bone/50">
                OPENS MAIL CLIENT
              </p>
            </div>

            <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="field-wrap block">
                <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-bone/60">
                  NAME
                </span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="mt-2 w-full border-0 border-b border-bone/15 bg-transparent px-0 py-2 font-mono text-sm text-bone placeholder:text-bone/25 focus:outline-none focus:ring-0"
                />
              </label>
              <label className="field-wrap block">
                <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-bone/60">
                  EMAIL
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@domain"
                  className="mt-2 w-full border-0 border-b border-bone/15 bg-transparent px-0 py-2 font-mono text-sm text-bone placeholder:text-bone/25 focus:outline-none focus:ring-0"
                />
              </label>
              <label className="field-wrap block sm:col-span-2">
                <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-bone/60">
                  SUBJECT
                </span>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Collaboration · opportunity · general"
                  className="mt-2 w-full border-0 border-b border-bone/15 bg-transparent px-0 py-2 font-mono text-sm text-bone placeholder:text-bone/25 focus:outline-none focus:ring-0"
                />
              </label>
              <label className="field-wrap block sm:col-span-2">
                <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-bone/60">
                  MESSAGE
                </span>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={5}
                  placeholder="Write as much or as little as you like."
                  className="mt-2 w-full resize-none border-0 border-b border-bone/15 bg-transparent px-0 py-2 font-mono text-sm leading-relaxed text-bone placeholder:text-bone/25 focus:outline-none focus:ring-0"
                />
              </label>
            </div>

            <div className="relative z-10 mt-8 flex flex-wrap items-center justify-between gap-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-bone/50">
                ENCRYPTED VIA YOUR DEFAULT MAIL CLIENT
              </p>
              <button
                type="submit"
                className="group inline-flex items-center gap-3 rounded-full bg-vital px-6 py-3 font-grotesk text-sm tracking-[0.22em] text-bone transition-colors hover:bg-bone hover:text-graphite"
              >
                SEND DISPATCH
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-bone text-vital group-hover:bg-vital group-hover:text-bone transition-colors">
                  <Send className="h-3 w-3" strokeWidth={2.25} />
                </span>
              </button>
            </div>
          </form>

          {/* CHANNELS */}
          <div className="md:col-span-5 flex flex-col gap-4">
            <div className="liquid-glass rounded-3xl p-6 md:p-8">
              <p className="relative z-10 font-mono text-[10px] uppercase tracking-[0.22em] text-vital mb-6">
                CHANNELS · DIRECT LINES
              </p>
              <ul className="relative z-10 divide-y divide-bone/10">
                {CONTACT.channels.map((c, i) => (
                  <li key={i}>
                    <a
                      href={c.href}
                      target={c.href.startsWith('http') ? '_blank' : undefined}
                      rel={c.href.startsWith('http') ? 'noreferrer' : undefined}
                      className="group flex items-center justify-between gap-4 py-4 transition-colors hover:text-vital"
                    >
                      <div className="min-w-0">
                        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-bone/50 group-hover:text-vital">
                          {c.label}
                        </p>
                        <p className="font-mono text-[13px] text-bone group-hover:text-vital truncate">
                          {c.value}
                        </p>
                      </div>
                      <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-bone/20 text-bone group-hover:border-vital group-hover:text-vital">
                        <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.75} />
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <a
              href="#/cv"
              className="liquid-glass group flex items-center justify-between gap-4 rounded-3xl p-6 md:p-8 transition-colors"
            >
              <div className="relative z-10">
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-vital">
                  CURRICULUM VITAE
                </p>
                <p className="mt-2 font-grotesk text-xl tracking-wide text-bone group-hover:text-vital uppercase transition-colors">
                  View full CV
                </p>
                <p className="mt-1 font-mono text-[11px] text-bone/60">
                  Education · research · patents · skills
                </p>
              </div>
              <span className="relative z-10 inline-flex h-12 w-12 items-center justify-center rounded-full bg-vital text-bone group-hover:bg-bone group-hover:text-vital transition-colors">
                <FileText className="h-4 w-4" strokeWidth={1.75} />
              </span>
            </a>
          </div>
        </div>

        {/* Footer bar */}
        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-bone/10 pt-6 md:flex-row md:items-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-bone/55">
            © {new Date().getFullYear()} · {PERSON.fullName} · RESEARCH DOSSIER
          </p>
          <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-bone/60">
            <MapPin className="h-3.5 w-3.5 text-vital" strokeWidth={1.5} />
            {PERSON.location}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------------------
 * HOME PAGE WRAPPER
 * -------------------------------------------------------------------------- */

function HomePage() {
  useScrollReveal();
  return (
    <>
      <HeroSection />
      <CredentialsSection />
      <AboutSection />
      <ResearchSection />
      <ContactSection />
    </>
  );
}

/* ----------------------------------------------------------------------------
 * DETAIL PAGE SHELL
 * -------------------------------------------------------------------------- */

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
      <div className="mx-auto max-w-container px-6 md:px-10 lg:px-14">
        <Navbar />

        {/* Header block */}
        <section className="pt-10 md:pt-14 pb-12 md:pb-16">
          <div className="grid gap-10 md:grid-cols-12">
            <div className="md:col-span-8">
              <SectionTag text={`${index} · ${category}`} />
              <span className="mt-4 font-serif-italic block text-vital text-3xl sm:text-4xl md:text-5xl">
                {accent}
              </span>
              <h1 className="mt-2 font-grotesk uppercase text-bone leading-[0.9] tracking-tightest text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
                {shortTitle}
              </h1>
              <p className="mt-6 max-w-[56ch] font-mono text-[13px] md:text-[15px] leading-[1.7] text-bone/90">
                {fullTitle}
              </p>
              <p className="mt-2 font-mono text-[12px] uppercase tracking-[0.22em] text-bone/55">
                {subtitle}
              </p>
            </div>

            <div className="md:col-span-4">
              <div className="liquid-glass relative overflow-hidden rounded-3xl">
                <div className="relative z-10 grid grid-cols-1 divide-y divide-bone/10">
                  {meta.map((m, i) => (
                    <div key={i} className="px-5 py-4">
                      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-vital">
                        {m.label}
                      </p>
                      <p className="mt-1 font-grotesk text-sm md:text-base tracking-wide text-bone uppercase leading-tight">
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
        <section className="relative overflow-hidden rounded-3xl border border-bone/10">
          {schematic}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-graphite/70 via-transparent to-graphite/10" />
        </section>

        {/* Body */}
        <section className="py-14 md:py-20">{children}</section>

        {/* Footer CTA */}
        <section className="border-t border-bone/10 py-10 md:py-14">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <span className="inline-block h-[2px] w-6 bg-vital" />
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-bone/60">
                CONTINUE THE DOSSIER
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <PillLink href="#contact" label="GET IN TOUCH" />
              <PillLink href="#/cv" label="VIEW CV" />
              <PillLink href="#research" label="BACK TO INDEX" />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------------------
 * DETAIL — PAS
 * -------------------------------------------------------------------------- */

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
        { label: 'LAB', value: d.lab },
        { label: 'PRINCIPAL INVESTIGATOR', value: d.pi },
        { label: 'CO-INVESTIGATORS', value: d.studyLead.join(' · ') },
        { label: 'MY ROLE', value: d.role },
      ]}
      schematic={<PASDetailSchematic />}
    >
      <div className="grid gap-12 md:grid-cols-12">
        {/* Abstract */}
        <div className="md:col-span-7">
          <SectionTag text="01 · ABSTRACT" />
          <p className="mt-6 font-mono text-[14px] md:text-[16px] leading-[1.75] text-bone/90">
            {d.abstract}
          </p>

          <div className="mt-12">
            <SectionTag text="02 · OBJECTIVES" />
            <ul className="mt-6 space-y-4">
              {d.objectives.map((o, i) => (
                <li key={i} className="flex gap-3">
                  <span className="mt-[6px] inline-block h-[2px] w-5 bg-vital shrink-0" />
                  <p className="font-mono text-[13px] md:text-[15px] leading-[1.7] text-bone/88">{o}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="md:col-span-5">
          <div className="liquid-glass rounded-3xl p-6 md:p-8">
            <p className="relative z-10 font-mono text-[10px] uppercase tracking-[0.22em] text-vital mb-6">
              METHODS
            </p>
            <dl className="relative z-10 space-y-5">
              {d.methods.map((m, i) => (
                <div key={i}>
                  <dt className="font-mono text-[10px] uppercase tracking-[0.22em] text-bone/55">
                    {m.label}
                  </dt>
                  <dd className="mt-1 font-mono text-[13px] md:text-[14px] leading-[1.6] text-bone/90">
                    {m.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        {/* Subjects */}
        <div className="md:col-span-12">
          <SectionTag text="03 · COHORT · N=6" />
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            {d.subjects.map((s, i) => (
              <div
                key={i}
                className={`liquid-glass rounded-2xl p-5 md:p-6 ${
                  s.tone === 'ok' ? 'border border-vital/40' : ''
                }`}
              >
                <div className="relative z-10 flex items-center justify-between">
                  <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-bone/55">
                    {s.id} · {s.start}
                  </p>
                  {s.tone === 'ok' ? (
                    <CheckCircle2 className="h-4 w-4 text-vital" strokeWidth={1.8} />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-bone/40" strokeWidth={1.5} />
                  )}
                </div>
                <p className="relative z-10 mt-3 font-grotesk text-3xl tracking-wide text-bone uppercase">
                  {s.name}
                </p>
                <p
                  className={`relative z-10 mt-2 font-mono text-[12px] uppercase tracking-[0.18em] ${
                    s.tone === 'ok' ? 'text-vital' : 'text-bone/60'
                  }`}
                >
                  {s.outcome}
                </p>
                <p className="relative z-10 mt-3 font-mono text-[13px] leading-[1.6] text-bone/80">
                  {s.detail}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Findings */}
        <div className="md:col-span-12">
          <SectionTag text="04 · KEY FINDINGS" />
          <div className="mt-6 grid gap-px bg-bone/10 rounded-3xl overflow-hidden">
            {d.findings.map((f, i) => (
              <div key={i} className="bg-graphite p-6 md:p-8 grid md:grid-cols-12 gap-4">
                <p className="md:col-span-3 font-mono text-[11px] uppercase tracking-[0.22em] text-vital">
                  {f.label}
                </p>
                <p className="md:col-span-9 font-mono text-[13px] md:text-[15px] leading-[1.7] text-bone/90">
                  {f.value}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Optimizations + outcome */}
        <div className="md:col-span-7">
          <SectionTag text="05 · PROTOCOL OPTIMIZATIONS" />
          <ul className="mt-6 space-y-3">
            {d.optimizations.map((o, i) => (
              <li key={i} className="flex gap-3 font-mono text-[13px] md:text-[14px] leading-[1.7] text-bone/90">
                <span className="font-grotesk text-vital text-sm tracking-wider shrink-0">{`0${i + 1}`}</span>
                <span>{o}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-5">
          <div className="liquid-glass rounded-3xl p-6 md:p-8 h-full">
            <p className="relative z-10 font-mono text-[10px] uppercase tracking-[0.22em] text-vital mb-4">
              06 · OUTCOME
            </p>
            <p className="relative z-10 font-serif-italic text-vital text-2xl md:text-3xl leading-tight">
              Proof of concept.
            </p>
            <p className="relative z-10 mt-4 font-mono text-[13px] md:text-[14px] leading-[1.7] text-bone/90">
              {d.outcome}
            </p>
          </div>
        </div>
      </div>
    </DetailShell>
  );
}

/* ----------------------------------------------------------------------------
 * DETAIL — Coagulation
 * -------------------------------------------------------------------------- */

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
        { label: 'LAB', value: d.lab },
        { label: 'PRINCIPAL INVESTIGATOR', value: d.pi },
        { label: 'CONFERENCE', value: 'ISTH 2026 · Abstract submitted' },
        { label: 'MY ROLE', value: d.role },
      ]}
      schematic={<CoagDetailSchematic />}
    >
      <div className="grid gap-12 md:grid-cols-12">
        <div className="md:col-span-7">
          <SectionTag text="01 · ABSTRACT" />
          <p className="mt-6 font-grotesk text-base md:text-lg tracking-wide text-bone uppercase leading-snug max-w-[56ch]">
            {d.abstractTitle}
          </p>
          <p className="mt-3 font-mono text-[12px] leading-[1.75] text-bone/70">
            {d.authors.map((a, i) => (
              <span key={i}>
                {a.name}
                <sup className="text-vital ml-0.5">{a.affil}</sup>
                {i < d.authors.length - 1 ? ', ' : ''}
              </span>
            ))}
          </p>
          <div className="mt-2 space-y-1">
            {d.affiliations.map((aff) => (
              <p key={aff.id} className="font-mono text-[11px] text-bone/50">
                <sup className="text-vital">{aff.id}</sup>{' '}{aff.name}
              </p>
            ))}
          </div>
          <p className="mt-8 font-mono text-[14px] md:text-[16px] leading-[1.75] text-bone/90">
            {d.abstract}
          </p>

          <div className="mt-12">
            <SectionTag text="02 · THE PROBLEM" />
            <ul className="mt-6 space-y-4">
              {d.problem.map((p, i) => (
                <li key={i} className="flex gap-3">
                  <span className="mt-[6px] inline-block h-[2px] w-5 bg-vital shrink-0" />
                  <p className="font-mono text-[13px] md:text-[15px] leading-[1.7] text-bone/88">{p}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="md:col-span-5">
          <div className="liquid-glass rounded-3xl p-6 md:p-8">
            <p className="relative z-10 font-mono text-[10px] uppercase tracking-[0.22em] text-vital mb-6">
              APPROACH
            </p>
            <dl className="relative z-10 space-y-5">
              {d.approach.map((m, i) => (
                <div key={i}>
                  <dt className="font-mono text-[10px] uppercase tracking-[0.22em] text-bone/55">
                    {m.label}
                  </dt>
                  <dd className="mt-1 font-mono text-[13px] md:text-[14px] leading-[1.6] text-bone/90">
                    {m.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <div className="md:col-span-7">
          <SectionTag text="03 · MY CONTRIBUTIONS" />
          <ul className="mt-6 space-y-4">
            {d.contributions.map((c, i) => (
              <li key={i} className="flex gap-3 font-mono text-[13px] md:text-[15px] leading-[1.7] text-bone/88">
                <span className="font-grotesk text-vital text-sm tracking-wider shrink-0">{`C-${String(
                  i + 1
                ).padStart(2, '0')}`}</span>
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-5">
          <div className="liquid-glass rounded-3xl p-6 md:p-8">
            <p className="relative z-10 font-mono text-[10px] uppercase tracking-[0.22em] text-vital mb-4">
              SELECTED REFERENCES
            </p>
            <ul className="relative z-10 space-y-3">
              {d.references.map((r, i) => (
                <li
                  key={i}
                  className="font-mono text-[12px] md:text-[13px] leading-[1.6] text-bone/75 border-l border-bone/15 pl-3"
                >
                  {r}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </DetailShell>
  );
}

/* ----------------------------------------------------------------------------
 * DETAIL — Cane / Patent
 * -------------------------------------------------------------------------- */

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
        { label: 'PATENT', value: d.patentNumber },
        { label: 'OFFICE', value: d.office },
        { label: 'FILED · GRANTED', value: `${d.filed} → ${d.registered}` },
        { label: 'INVENTOR · STATUS', value: `${d.inventor} · ${d.status}` },
      ]}
      schematic={<CaneDetailSchematic />}
    >
      <div className="grid gap-12 md:grid-cols-12">
        <div className="md:col-span-7">
          <SectionTag text="01 · ABSTRACT" />
          <p className="mt-6 font-mono text-[14px] md:text-[16px] leading-[1.75] text-bone/90">
            {d.abstract}
          </p>

          <div className="mt-12">
            <SectionTag text="02 · PROBLEM STATEMENT" />
            <ul className="mt-6 space-y-4">
              {d.problem.map((p, i) => (
                <li key={i} className="flex gap-3">
                  <span className="mt-[6px] inline-block h-[2px] w-5 bg-vital shrink-0" />
                  <p className="font-mono text-[13px] md:text-[15px] leading-[1.7] text-bone/88">{p}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-12">
            <SectionTag text="03 · SOLUTION" />
            <ol className="mt-6 space-y-4">
              {d.solution.map((s, i) => (
                <li key={i} className="flex gap-3">
                  <span className="font-grotesk text-vital text-sm tracking-wider shrink-0">{`0${i + 1}`}</span>
                  <p className="font-mono text-[13px] md:text-[15px] leading-[1.7] text-bone/88">{s}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="md:col-span-5">
          <div className="liquid-glass rounded-3xl p-6 md:p-8 sticky top-8">
            <p className="relative z-10 font-mono text-[10px] uppercase tracking-[0.22em] text-vital mb-6">
              PARTS LIST · BILL OF MATERIALS
            </p>
            <ul className="relative z-10 space-y-4">
              {d.components.map((c) => (
                <li key={c.id} className="grid grid-cols-[40px_1fr] gap-3 border-b border-bone/10 pb-3 last:border-0">
                  <span className="font-grotesk text-vital text-sm tracking-wider">{c.id}</span>
                  <div>
                    <p className="font-grotesk text-sm tracking-wide text-bone uppercase">{c.label}</p>
                    <p className="mt-1 font-mono text-[12px] leading-[1.6] text-bone/75">{c.detail}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="md:col-span-12">
          <SectionTag text="04 · REPRESENTATIVE CLAIMS" />
          <div className="mt-6 grid gap-px bg-bone/10 rounded-3xl overflow-hidden">
            {d.claims.map((c, i) => (
              <div key={i} className="bg-graphite p-6 md:p-8 grid md:grid-cols-12 gap-4">
                <p className="md:col-span-2 font-mono text-[11px] uppercase tracking-[0.22em] text-vital">
                  CLAIM {i + 1}
                </p>
                <p className="md:col-span-10 font-mono text-[13px] md:text-[15px] leading-[1.7] text-bone/90">
                  {c}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="md:col-span-12">
          <div className="liquid-glass rounded-3xl p-8 md:p-12">
            <p className="relative z-10 font-mono text-[10px] uppercase tracking-[0.22em] text-vital mb-4">
              05 · IMPACT
            </p>
            <p className="relative z-10 font-serif-italic text-vital text-3xl md:text-5xl leading-tight">
              Mechanical feedback, not just sensory alert.
            </p>
            <p className="relative z-10 mt-6 max-w-[72ch] font-mono text-[14px] md:text-[16px] leading-[1.75] text-bone/90">
              {d.impact}
            </p>
          </div>
        </div>
      </div>
    </DetailShell>
  );
}

/* ----------------------------------------------------------------------------
 * CV PAGE
 * -------------------------------------------------------------------------- */

function CVPage() {
  return (
    <div className="relative min-h-screen bg-graphite text-bone">
      <TextureOverlay />
      <div className="mx-auto max-w-container px-6 md:px-10 lg:px-14">
        <Navbar />

        <section className="pt-10 md:pt-14 pb-10 md:pb-14">
          <div className="grid gap-8 md:grid-cols-12">
            <div className="md:col-span-8">
              <SectionTag text={CV.tag} />
              <h1 className="mt-4 font-grotesk uppercase text-bone leading-[0.88] tracking-tightest text-5xl sm:text-6xl md:text-7xl lg:text-8xl">
                {CV.heading}
              </h1>
              <p className="mt-4 font-mono text-[13px] md:text-[15px] leading-[1.7] text-bone/85">
                {CV.subheading}
              </p>
            </div>

            <div className="md:col-span-4 md:pt-6">
              <div className="liquid-glass rounded-3xl p-5 md:p-6">
                <p className="relative z-10 font-mono text-[10px] uppercase tracking-[0.22em] text-vital">
                  CONTACT
                </p>
                <p className="relative z-10 mt-2 font-mono text-[13px] text-bone">{PERSON.email}</p>
                <p className="relative z-10 font-mono text-[13px] text-bone/75">{PERSON.personalEmail}</p>
                <p className="relative z-10 mt-3 font-mono text-[12px] text-bone/60">
                  {PERSON.linkedinHandle} · {PERSON.location}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden rounded-3xl border border-bone/10">
          <CVSchematic />
        </section>

        <section className="py-14 md:py-20 grid gap-12 md:grid-cols-12">
          {/* Education */}
          <div className="md:col-span-12">
            <SectionTag text="01 · EDUCATION" />
            <div className="mt-6 grid gap-4">
              {CV.education.map((e, i) => (
                <div
                  key={i}
                  className="liquid-glass rounded-3xl p-6 md:p-8 grid gap-6 md:grid-cols-12"
                >
                  <div className="relative z-10 md:col-span-4">
                    <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-vital">
                      {e.dates}
                    </p>
                    <p className="mt-3 font-grotesk text-2xl md:text-3xl tracking-wide text-bone uppercase">
                      {e.inst}
                    </p>
                    <p className="mt-1 font-mono text-[12px] text-bone/60">{e.loc}</p>
                  </div>
                  <div className="relative z-10 md:col-span-8">
                    <p className="font-grotesk text-xl tracking-wide text-bone uppercase">
                      {e.degree}
                    </p>
                    <p className="mt-2 font-mono text-[13px] md:text-[15px] leading-[1.7] text-bone/90">
                      {e.program}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Research */}
          <div className="md:col-span-12">
            <SectionTag text="02 · RESEARCH" />
            <div className="mt-6 grid gap-4">
              {CV.research.map((r, i) => (
                <div key={i} className="liquid-glass rounded-3xl p-6 md:p-8 grid gap-6 md:grid-cols-12">
                  <div className="relative z-10 md:col-span-4">
                    <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-vital">
                      {r.dates}
                    </p>
                    <p className="mt-3 font-grotesk text-xl md:text-2xl tracking-wide text-bone uppercase">
                      {r.lab}
                    </p>
                    <p className="mt-1 font-mono text-[12px] text-bone/60">{r.inst}</p>
                    <p className="mt-3 font-mono text-[12px] uppercase tracking-[0.18em] text-vital">
                      {r.role}
                    </p>
                    <p className="mt-1 font-mono text-[12px] text-bone/70">{r.pi}</p>
                  </div>
                  <div className="relative z-10 md:col-span-8">
                    <ul className="space-y-3">
                      {r.bullets.map((b, j) => (
                        <li key={j} className="flex gap-3 font-mono text-[13px] md:text-[15px] leading-[1.7] text-bone/90">
                          <span className="mt-[6px] inline-block h-[2px] w-5 bg-vital shrink-0" />
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
            <SectionTag text="03 · PATENTS" />
            <div className="mt-6 grid gap-4">
              {CV.patents.map((p, i) => (
                <a
                  key={i}
                  href="#/research/cane"
                  className="liquid-glass group rounded-3xl p-6 md:p-8 grid gap-6 md:grid-cols-12"
                >
                  <div className="relative z-10 md:col-span-4">
                    <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-vital">
                      {p.filed} → {p.granted}
                    </p>
                    <p className="mt-3 font-grotesk text-2xl md:text-3xl tracking-wide text-bone uppercase group-hover:text-vital transition-colors">
                      {p.number}
                    </p>
                    <p className="mt-1 font-mono text-[12px] text-bone/60">{p.office}</p>
                  </div>
                  <div className="relative z-10 md:col-span-7 flex items-center">
                    <p className="font-mono text-[13px] md:text-[15px] leading-[1.7] text-bone/90">
                      {p.title} — <span className="text-bone/60">{p.inventor}</span>
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
            <SectionTag text="04 · SKILLS + CERTIFICATIONS" />
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {CV.skills.map((s, i) => (
                <div key={i} className="liquid-glass rounded-3xl p-5 md:p-6">
                  <p className="relative z-10 font-mono text-[10px] uppercase tracking-[0.22em] text-vital">
                    {s.group}
                  </p>
                  <ul className="relative z-10 mt-4 space-y-2">
                    {s.items.map((it, j) => (
                      <li key={j} className="font-mono text-[13px] leading-[1.55] text-bone/90">
                        {it}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Languages */}
          <div className="md:col-span-12">
            <div className="liquid-glass rounded-3xl p-6 md:p-8 flex flex-wrap items-center gap-6">
              <p className="relative z-10 font-mono text-[10px] uppercase tracking-[0.22em] text-vital">
                LANGUAGES
              </p>
              {CV.languages.map((l, i) => (
                <p key={i} className="relative z-10 font-grotesk text-lg tracking-wide text-bone uppercase">
                  {l}
                </p>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-bone/10 py-10 md:py-14">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-bone/55">
              CURRICULUM VITAE · {PERSON.fullName}
            </p>
            <div className="flex flex-wrap gap-3">
              <PillLink href="#contact" label="GET IN TOUCH" />
              <PillLink href="#research" label="RESEARCH INDEX" />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------------------
 * ROOT
 * -------------------------------------------------------------------------- */

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
      <ScrollOnRouteChange route={route} />
      {body}
    </>
  );
}
