# Portfolio Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the portfolio homepage with a split-column hero, live study indicators, and three new sections (Publications, Timeline, Skills) while preserving all existing detail pages and routing.

**Architecture:** All UI lives in `src/App.tsx` (existing pattern — follow it). New content arrays added to `src/content.ts`. CSS utilities appended to `src/index.css`. No new files, no new dependencies.

**Tech Stack:** React 18, TypeScript, Tailwind CSS v3, Vite, lucide-react

---

## File Map

| File | Action | What changes |
|---|---|---|
| `src/content.ts` | Modify | Add `PUBLICATIONS`, `SKILLS`, `TIMELINE` exports |
| `src/index.css` | Modify | Append status-dot, timeline, skill-bar CSS |
| `src/App.tsx` | Modify | New `StatusDot`, `OpenToCollab` primitives; rewrite `HeroSection`; update `ResearchSection`; add `PublicationsSection`, `TimelineStrip`, `SkillsSection`; update `HomePage` |

---

## Task 1: Add new content exports to content.ts

**Files:**
- Modify: `src/content.ts` (append after the `NAV_ITEMS` export at line 394)

- [ ] **Step 1: Open `src/content.ts` and append the following three exports at the very end of the file**

```typescript
/* ----------------------------------------------------------------------------
 * PUBLICATIONS
 * -------------------------------------------------------------------------- */

export const PUBLICATIONS: Array<{
  year: string;
  conference: string;
  title: string;
  authors: string;
  venue: string;
  status: 'SUBMITTED' | 'PUBLISHED';
}> = [
  {
    year: '2026',
    conference: 'ISTH',
    title:
      'Pharmacokinetic and Pharmacodynamic Profile Evaluation of Polycarboxybetaine-Conjugated FXIIa Inhibitor in Rabbits',
    authors:
      'Shin S, Liu D, Potchernikov A, Scala H, Bennett J, Nakamura R, Haggerty M, Kim S*, Jiang S, Cook KE',
    venue:
      'International Society on Thrombosis and Haemostasis · Abstract',
    status: 'SUBMITTED',
  },
];

/* ----------------------------------------------------------------------------
 * SKILLS
 * -------------------------------------------------------------------------- */

export const SKILLS: Array<{
  group: string;
  items: Array<{ name: string; pct: number }>;
}> = [
  {
    group: 'MEDICAL DEVICE R&D',
    items: [
      { name: 'Extracorporeal circuits', pct: 90 },
      { name: 'In-vivo large-animal studies', pct: 80 },
      { name: 'Blood sampling protocols', pct: 85 },
      { name: 'Hollow-fiber oxygenators', pct: 75 },
    ],
  },
  {
    group: 'ENGINEERING + COMPUTATION',
    items: [
      { name: 'SolidWorks / Fusion 360', pct: 85 },
      { name: 'Python · NumPy / Pandas', pct: 80 },
      { name: 'MATLAB', pct: 75 },
      { name: 'FEA / CFD', pct: 65 },
    ],
  },
];

/* ----------------------------------------------------------------------------
 * TIMELINE
 * -------------------------------------------------------------------------- */

export type TimelineState = 'done' | 'active' | 'pending';

export const TIMELINE: Array<{ label: string; sub: string; state: TimelineState }> = [
  { label: 'Protocol Design', sub: 'Complete', state: 'done' },
  { label: 'IACUC Approval', sub: 'Complete', state: 'done' },
  { label: 'Cohort 1', sub: '2/6 endpoint', state: 'done' },
  { label: 'Protocol Refinement', sub: 'In progress', state: 'active' },
  { label: 'Powered Trial', sub: 'n=10 planned', state: 'pending' },
  { label: 'Publication', sub: 'Pending', state: 'pending' },
];
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd "/Users/shrla/Library/Mobile Documents/com~apple~CloudDocs/private/spencer-portfolio" && npx tsc --noEmit
```

Expected: no errors

- [ ] **Step 3: Commit**

```bash
cd "/Users/shrla/Library/Mobile Documents/com~apple~CloudDocs/private/spencer-portfolio" && git add src/content.ts && git commit -m "feat: add PUBLICATIONS, SKILLS, TIMELINE content exports"
```

---

## Task 2: Add CSS for new components

**Files:**
- Modify: `src/index.css` (append before the closing brace of `@layer components`, then add utilities after)

- [ ] **Step 1: Open `src/index.css`. Find the closing `}` of the `@layer components { ... }` block (currently around line 279). Insert the following block just before that closing brace:**

```css
  /* ── Status dots ─────────────────────────────────────────────── */
  .status-dot-active {
    background-color: #22c55e;
    box-shadow: 0 0 6px rgba(34, 197, 94, 0.5);
    animation: status-pulse 2s ease-in-out infinite;
  }
  .status-dot-submitted { background-color: #eab308; }
  .status-dot-registered { background-color: #60a5fa; }
  @keyframes status-pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50%       { opacity: 0.6; transform: scale(1.35); }
  }

  /* ── Timeline ────────────────────────────────────────────────── */
  .timeline-track {
    position: relative;
    height: 2px;
    background: rgba(236, 230, 216, 0.05);
    border-radius: 1px;
  }
  .timeline-fill {
    position: absolute;
    left: 0; top: 0; bottom: 0;
    background: linear-gradient(90deg, #e63046, rgba(230, 48, 70, 0.3));
    border-radius: 1px;
    transition: width 1s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .tnode-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    border: 1.5px solid rgba(236, 230, 216, 0.14);
    background: #0a0b10;
    flex-shrink: 0;
  }
  .tnode-dot.done { background: #e63046; border-color: #e63046; }
  .tnode-dot.active {
    background: #0a0b10;
    border-color: #e63046;
    box-shadow: 0 0 0 4px rgba(230, 48, 70, 0.18);
    animation: vital-pulse 2.2s ease-in-out infinite;
  }

  /* ── Skill bars ──────────────────────────────────────────────── */
  .skill-bar {
    height: 2px;
    background: rgba(236, 230, 216, 0.05);
    border-radius: 1px;
    overflow: hidden;
  }
  .skill-fill {
    height: 100%;
    background: linear-gradient(90deg, #e63046, rgba(230, 48, 70, 0.35));
    border-radius: 1px;
  }
```

- [ ] **Step 2: Verify build**

```bash
cd "/Users/shrla/Library/Mobile Documents/com~apple~CloudDocs/private/spencer-portfolio" && npm run build 2>&1 | tail -20
```

Expected: `✓ built in` with no errors

- [ ] **Step 3: Commit**

```bash
cd "/Users/shrla/Library/Mobile Documents/com~apple~CloudDocs/private/spencer-portfolio" && git add src/index.css && git commit -m "feat: add status-dot, timeline, skill-bar CSS"
```

---

## Task 3: Add StatusDot and OpenToCollab primitives

**Files:**
- Modify: `src/App.tsx` — insert two new components in the "Design primitives" section (currently around line 173, after the `PillLink` component ends at ~line 259)

- [ ] **Step 1: Open `src/App.tsx`. Update the import from `./content` to include the new exports. Find the existing import block (lines 23–36) and add `PUBLICATIONS`, `SKILLS`, `TIMELINE`, `type TimelineState` to the named imports:**

```typescript
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
```

- [ ] **Step 2: In `src/App.tsx`, find the `SOCIAL` constant definition (around line 261). Insert the two new primitive components immediately after the `PillLink` function definition and before the `SOCIAL` constant:**

```typescript
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
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
cd "/Users/shrla/Library/Mobile Documents/com~apple~CloudDocs/private/spencer-portfolio" && npx tsc --noEmit
```

Expected: no errors

- [ ] **Step 4: Commit**

```bash
cd "/Users/shrla/Library/Mobile Documents/com~apple~CloudDocs/private/spencer-portfolio" && git add src/App.tsx && git commit -m "feat: add StatusDot and OpenToCollab primitives"
```

---

## Task 4: Rewrite HeroSection

**Files:**
- Modify: `src/App.tsx` — replace the entire `HeroSection` function (lines 413–489)

- [ ] **Step 1: In `src/App.tsx`, replace the entire `HeroSection` function with the following. The function starts at `function HeroSection()` and ends with its closing `}`:**

```typescript
function HeroSection() {
  return (
    <section id="home" className="relative min-h-[100svh] overflow-hidden bg-graphite flex flex-col">
      <HeroSchematic />

      {/* Navbar row — constrained to max-w-container */}
      <div className="relative mx-auto w-full max-w-container px-6 md:px-10 lg:px-14 xl:px-16">
        <Navbar onHome />
      </div>

      {/* Split layout — fills remaining height */}
      <div className="relative flex-1 mx-auto w-full max-w-container px-6 md:px-10 lg:px-14 xl:px-16 grid md:grid-cols-[55%_45%] min-h-0">

        {/* ── Left: big type (cinematic) ── */}
        <div className="flex flex-col justify-end pb-14 md:pb-20 pr-0 md:pr-10 pt-6">

          {/* Coordinate label — desktop only */}
          <div className="mb-10 hidden md:flex items-center gap-3 boot-in boot-d2">
            <span className="inline-block h-px w-10 bg-bone/15" />
            <span className="font-mono text-[10px] uppercase tracking-[0.26em] text-muted">
              40.4432° N · 79.9428° W · Pittsburgh, PA · CMU
            </span>
          </div>

          {/* Mobile social icons */}
          <div className="mb-6 flex gap-2 md:hidden boot-in boot-d2">
            {SOCIAL.map((s) => (
              <IconButton key={s.label} {...s} />
            ))}
          </div>

          {/* Accent phrase */}
          <span className="font-serif-italic block text-vital mb-3 text-3xl sm:text-4xl md:text-4xl lg:text-5xl boot-in boot-d3">
            {HERO.accent}
          </span>

          {/* Main heading */}
          <h1 className="font-grotesk uppercase text-bone leading-[0.88] tracking-tightest text-[14.5vw] md:text-[6.5vw] lg:text-[6vw] xl:text-[6.5rem] 2xl:text-[7.5rem] boot-in boot-d4">
            {HERO.heading.map((line, i) => (
              <span key={i} className="block">{line}</span>
            ))}
          </h1>

          {/* Bottom info bar */}
          <div className="mt-8 border-t border-bone/8 pt-6 boot-in boot-d6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
              <div className="flex items-start gap-2.5">
                <span className="vital-dot mt-1.5 shrink-0" />
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted leading-[1.8] max-w-[46ch]">
                  {HERO.footnote}
                </p>
              </div>
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
        </div>

        {/* ── Right: live bento data — desktop only ── */}
        <div className="hidden md:flex flex-col gap-3 py-8 pl-10 border-l border-bone/[0.05] boot-in boot-d3">

          {/* Live study tile */}
          <div className="liquid-glass rounded-2xl p-5 flex flex-col gap-3">
            <div className="relative z-10 flex items-center justify-between">
              <span className="inline-flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.18em] text-vital">
                <span className="inline-block h-1.5 w-1.5 rounded-full status-dot-active" />
                Active Study
              </span>
              <span className="font-mono text-[8px] uppercase tracking-[0.12em] text-steel border border-bone/10 rounded-full px-2.5 py-0.5">
                PAS · VV ECMO
              </span>
            </div>
            <div className="relative z-10 flex items-baseline gap-3">
              <p className="font-grotesk text-5xl tracking-tightest text-vital leading-none">2/6</p>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-bone">Endpoint</p>
                <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted">30-day ovine survival</p>
              </div>
            </div>
            <div className="relative z-10 h-px w-full bg-bone/[0.06] overflow-hidden rounded-full">
              <div className="h-full w-1/3 bg-gradient-to-r from-vital to-vital/40 rounded-full" />
            </div>
            <p className="relative z-10 font-mono text-[8px] uppercase tracking-[0.14em] text-steel">
              IV Rivaroxaban in PEG · Cook Cardiopulmonary Engineering Lab
            </p>
          </div>

          {/* Credential row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="liquid-glass rounded-xl p-4">
              <p className="relative z-10 font-mono text-[8px] uppercase tracking-[0.16em] text-vital/75">Institution</p>
              <p className="relative z-10 font-sans text-xs font-semibold tracking-ui text-bone uppercase mt-1 leading-snug">Carnegie Mellon University</p>
              <p className="relative z-10 font-mono text-[9px] text-muted mt-0.5">College of Engineering</p>
            </div>
            <div className="liquid-glass rounded-xl p-4">
              <p className="relative z-10 font-mono text-[8px] uppercase tracking-[0.16em] text-vital/75">Patent Granted</p>
              <p className="relative z-10 font-sans text-xs font-semibold tracking-ui text-bone uppercase mt-1 leading-snug">KR 10-2675388</p>
              <p className="relative z-10 font-mono text-[9px] text-muted mt-0.5">KIPO · Jun 2024</p>
            </div>
          </div>

          {/* Research mini-cards */}
          <div className="flex flex-col gap-2">
            {RESEARCH_CARDS.map((card) => (
              <a
                key={card.slug}
                href={`#/research/${card.slug}`}
                className="liquid-glass group rounded-xl px-4 py-3 flex items-center justify-between gap-3 hover:border-vital/30 transition-colors"
              >
                <div className="relative z-10 flex items-center gap-3 min-w-0">
                  <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-vital shrink-0">{card.index}</span>
                  <div className="min-w-0">
                    <p className="font-sans text-xs font-semibold tracking-ui text-bone uppercase truncate">
                      {card.title} {card.titleTwo}
                    </p>
                    <p className="font-mono text-[9px] text-muted truncate">
                      {card.subtitle.split('·')[0].trim()}
                    </p>
                  </div>
                </div>
                <div className="relative z-10 flex items-center gap-2 shrink-0">
                  <StatusDot status={card.status} />
                  <ArrowUpRight className="h-3 w-3 text-steel group-hover:text-vital transition-colors" strokeWidth={2} />
                </div>
              </a>
            ))}
          </div>

          {/* Social + collab strip */}
          <div className="mt-auto flex items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-2">
              {SOCIAL.map((s) => (
                <IconButton key={s.label} {...s} size="sm" />
              ))}
            </div>
            <OpenToCollab />
          </div>
        </div>

      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd "/Users/shrla/Library/Mobile Documents/com~apple~CloudDocs/private/spencer-portfolio" && npx tsc --noEmit
```

Expected: no errors

- [ ] **Step 3: Start dev server and verify hero visually**

```bash
cd "/Users/shrla/Library/Mobile Documents/com~apple~CloudDocs/private/spencer-portfolio" && npm run dev
```

Open `http://localhost:5173`. Check:
- Desktop: two columns visible — big type left, bento tiles right
- Mobile: single column, big type only (right col hidden)
- Pulsing green dot on "Active Study"
- Status dots on research mini-cards (green/amber/blue)
- "Open to collaboration" pill at bottom right

- [ ] **Step 4: Commit**

```bash
cd "/Users/shrla/Library/Mobile Documents/com~apple~CloudDocs/private/spencer-portfolio" && git add src/App.tsx && git commit -m "feat: rewrite HeroSection with split 2-col layout and live bento data"
```

---

## Task 5: Update ResearchSection

**Files:**
- Modify: `src/App.tsx` — inside `ResearchSection`, update the cards grid column template and card status display

- [ ] **Step 1: In `src/App.tsx`, find the `ResearchSection` function. Locate the cards grid `div` (currently `className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3"`). Change its className to use a featured first column:**

```typescript
// Replace this line:
className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3"
// With:
className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr]"
```

- [ ] **Step 2: In the same `ResearchSection`, find the status badge span in the card footer (the `<span>` containing the `statusColor` dot and status text, around line 743–749). Replace that entire inner `<span>` with `<StatusDot status={card.status} />`:**

```typescript
// Find this block (inside the card footer liquid-glass div):
<span className="inline-flex items-center gap-1.5 rounded-full border border-bone/10 bg-graphite/60 px-2.5 py-1 shrink-0">
  <span className={`inline-block h-1.5 w-1.5 rounded-full ${statusColor}`} />
  <span className="font-mono text-[8.5px] uppercase tracking-[0.16em] text-muted">
    {card.status}
  </span>
</span>

// Replace with:
<StatusDot status={card.status} />
```

- [ ] **Step 3: Remove the now-unused `statusColor` and `accentColor` variable declarations inside the `.map()` callback. Find these lines and delete them:**

```typescript
// Delete these two const declarations inside RESEARCH_CARDS.map():
const statusColor =
  card.status === 'ACTIVE' ? 'bg-emerald-500'
  : card.status === 'SUBMITTED' ? 'bg-amber-400'
  : 'bg-oxygen';
const accentColor =
  card.status === 'ACTIVE' ? 'bg-emerald-500/60'
  : card.status === 'SUBMITTED' ? 'bg-amber-400/50'
  : 'bg-oxygen/50';
```

- [ ] **Step 4: The `accentColor` is also used on the accent line above the card footer. Find this line and replace with a fixed subtle line:**

```typescript
// Find:
<div className={`w-full h-px rounded-full mb-3 ${accentColor}`} />
// Replace:
<div className="w-full h-px rounded-full mb-3 bg-vital/30" />
```

- [ ] **Step 5: Verify TypeScript compiles**

```bash
cd "/Users/shrla/Library/Mobile Documents/com~apple~CloudDocs/private/spencer-portfolio" && npx tsc --noEmit
```

Expected: no errors

- [ ] **Step 6: Commit**

```bash
cd "/Users/shrla/Library/Mobile Documents/com~apple~CloudDocs/private/spencer-portfolio" && git add src/App.tsx && git commit -m "feat: update ResearchSection with featured card and StatusDot"
```

---

## Task 6: Add PublicationsSection

**Files:**
- Modify: `src/App.tsx` — add new component before `ContactSection`

- [ ] **Step 1: In `src/App.tsx`, find the `/* ── Contact ──` comment that opens `ContactSection`. Insert the following new component immediately before it:**

```typescript
/* ── Publications ───────────────────────────────────────────────────── */

function PublicationsSection() {
  return (
    <section className="relative bg-graphite">
      <div className="mx-auto max-w-container px-6 md:px-10 lg:px-14 xl:px-16 py-16 md:py-20">
        <div className="mb-10" data-reveal>
          <SectionTag text="006 · PUBLICATIONS + ABSTRACTS" />
        </div>
        <div className="flex flex-col gap-4">
          {PUBLICATIONS.map((pub, i) => (
            <div
              key={i}
              data-reveal
              data-reveal-delay={String(i + 1)}
              className="liquid-glass rounded-2xl p-6 md:p-8 flex flex-col sm:flex-row gap-6 items-start"
            >
              {/* Year badge */}
              <div className="liquid-glass rounded-xl p-4 text-center shrink-0 min-w-[64px]">
                <p className="relative z-10 font-grotesk text-3xl tracking-tightest text-vital leading-none">{pub.year}</p>
                <p className="relative z-10 font-mono text-[8px] uppercase tracking-[0.18em] text-muted mt-1">{pub.conference}</p>
              </div>
              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="relative z-10 flex items-center gap-2 mb-3">
                  <StatusDot status={pub.status} />
                  <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-steel">{pub.venue}</span>
                </div>
                <p className="relative z-10 font-sans text-sm font-semibold tracking-ui text-bone uppercase leading-snug mb-3">
                  {pub.title}
                </p>
                <p className="relative z-10 font-mono text-[11px] leading-[1.75] text-muted">
                  {pub.authors}
                </p>
                <p className="relative z-10 font-mono text-[9px] text-steel mt-1">* Spencer Kim</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd "/Users/shrla/Library/Mobile Documents/com~apple~CloudDocs/private/spencer-portfolio" && npx tsc --noEmit
```

Expected: no errors

- [ ] **Step 3: Commit**

```bash
cd "/Users/shrla/Library/Mobile Documents/com~apple~CloudDocs/private/spencer-portfolio" && git add src/App.tsx && git commit -m "feat: add PublicationsSection"
```

---

## Task 7: Add TimelineStrip

**Files:**
- Modify: `src/App.tsx` — add new component after `PublicationsSection`

- [ ] **Step 1: In `src/App.tsx`, find the `/* ── Contact ──` comment. Insert the following new component between `PublicationsSection` and `ContactSection`:**

```typescript
/* ── Timeline ───────────────────────────────────────────────────────── */

function TimelineStrip() {
  const doneCount = TIMELINE.filter((n) => n.state === 'done').length;
  const fillPct = Math.round((doneCount / (TIMELINE.length - 1)) * 100);

  return (
    <section className="relative bg-surface">
      <div className="mx-auto max-w-container px-6 md:px-10 lg:px-14 xl:px-16 py-16 md:py-20">
        <div className="mb-10" data-reveal>
          <SectionTag text="PAS STUDY TIMELINE · N=6 OVINE COHORT" />
        </div>
        <div className="liquid-glass rounded-2xl px-8 md:px-14 py-8 md:py-10" data-reveal>
          {/* Track */}
          <div className="relative px-4 mb-0">
            <div className="timeline-track">
              <div className="timeline-fill" style={{ width: `${fillPct}%` }} />
            </div>
          </div>
          {/* Nodes */}
          <div
            className="grid mt-0"
            style={{ gridTemplateColumns: `repeat(${TIMELINE.length}, 1fr)` }}
          >
            {TIMELINE.map((node, i) => (
              <div key={i} className="flex flex-col items-center gap-3 -mt-[5px]">
                <div
                  className={`tnode-dot${node.state !== 'pending' ? ` ${node.state}` : ''}`}
                />
                <div className="text-center">
                  <p
                    className={`font-mono text-[8px] md:text-[9px] uppercase tracking-[0.14em] leading-[1.4] ${
                      node.state === 'done'
                        ? 'text-vital'
                        : node.state === 'active'
                        ? 'text-bone'
                        : 'text-steel'
                    }`}
                  >
                    {node.label}
                  </p>
                  <p className="font-mono text-[7.5px] uppercase tracking-[0.12em] text-steel/60 mt-0.5">
                    {node.sub}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd "/Users/shrla/Library/Mobile Documents/com~apple~CloudDocs/private/spencer-portfolio" && npx tsc --noEmit
```

Expected: no errors

- [ ] **Step 3: Commit**

```bash
cd "/Users/shrla/Library/Mobile Documents/com~apple~CloudDocs/private/spencer-portfolio" && git add src/App.tsx && git commit -m "feat: add TimelineStrip"
```

---

## Task 8: Add SkillsSection

**Files:**
- Modify: `src/App.tsx` — add new component before `ResearchSection`

- [ ] **Step 1: In `src/App.tsx`, find the `/* ── Research ──` comment that opens `ResearchSection`. Insert the following new component immediately before it:**

```typescript
/* ── Skills ─────────────────────────────────────────────────────────── */

function SkillsSection() {
  return (
    <section className="relative bg-graphite">
      <div className="mx-auto max-w-container px-6 md:px-10 lg:px-14 xl:px-16 py-16 md:py-20">
        <div className="mb-10" data-reveal>
          <SectionTag text="004 · TOOLS + METHODS" />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {SKILLS.map((group, gi) => (
            <div
              key={gi}
              data-reveal
              data-reveal-delay={String(gi + 1)}
              className="liquid-glass rounded-2xl p-6 md:p-8"
            >
              <p className="relative z-10 font-mono text-[9px] uppercase tracking-[0.2em] text-vital/75 mb-6">
                {group.group}
              </p>
              <div className="relative z-10 flex flex-col gap-5">
                {group.items.map((item, ii) => (
                  <div key={ii}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-[11px] text-bone/80">{item.name}</span>
                    </div>
                    <div className="skill-bar">
                      <div className="skill-fill" style={{ width: `${item.pct}%` }} />
                    </div>
                  </div>
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

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd "/Users/shrla/Library/Mobile Documents/com~apple~CloudDocs/private/spencer-portfolio" && npx tsc --noEmit
```

Expected: no errors

- [ ] **Step 3: Commit**

```bash
cd "/Users/shrla/Library/Mobile Documents/com~apple~CloudDocs/private/spencer-portfolio" && git add src/App.tsx && git commit -m "feat: add SkillsSection"
```

---

## Task 9: Wire up HomePage and final build

**Files:**
- Modify: `src/App.tsx` — update `HomePage` render order and update the Research section tag number

- [ ] **Step 1: In `src/App.tsx`, find the `HomePage` function. Replace its return body with the updated section order:**

```typescript
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
```

- [ ] **Step 2: In `content.ts`, update the Research section tag number since Skills is now 004. Find `RESEARCH` export and change its tag:**

```typescript
// Find:
tag: '004 · INSTRUMENTATION INDEX',
// Replace:
tag: '005 · INSTRUMENTATION INDEX',
```

And update the Contact tag:

```typescript
// Find:
tag: '006 · ESTABLISH LINE',
// Replace:
tag: '008 · ESTABLISH LINE',
```

- [ ] **Step 3: Run full TypeScript check**

```bash
cd "/Users/shrla/Library/Mobile Documents/com~apple~CloudDocs/private/spencer-portfolio" && npx tsc --noEmit
```

Expected: no errors

- [ ] **Step 4: Production build**

```bash
cd "/Users/shrla/Library/Mobile Documents/com~apple~CloudDocs/private/spencer-portfolio" && npm run build 2>&1 | tail -20
```

Expected: `✓ built in` with no errors

- [ ] **Step 5: Preview production build and verify all sections**

```bash
cd "/Users/shrla/Library/Mobile Documents/com~apple~CloudDocs/private/spencer-portfolio" && npm run preview
```

Open `http://localhost:4173`. Scroll through and verify:
- Hero: split columns on desktop, single col on mobile
- Credentials section (unchanged)
- About section with marquee (unchanged)
- Skills section: two skill group cards with red bar fills
- Research section: first card wider (`1.4fr`), all cards use `StatusDot`
- Publications section: ISTH 2026 citation card with year badge
- Timeline strip: 6 nodes, first 3 red/done, 4th active with glow, last 2 muted
- Contact section (unchanged)
- All hash routes still work: `#/research/pas`, `#/research/coagulation`, `#/research/cane`, `#/cv`

- [ ] **Step 6: Commit**

```bash
cd "/Users/shrla/Library/Mobile Documents/com~apple~CloudDocs/private/spencer-portfolio" && git add src/App.tsx src/content.ts && git commit -m "feat: wire up HomePage with all new sections — complete portfolio redesign"
```
