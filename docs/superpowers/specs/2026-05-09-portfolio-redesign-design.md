# Portfolio Redesign — Design Spec
**Date:** 2026-05-09  
**Project:** Spencer Kim · Research Portfolio (React + Vite + Tailwind + TypeScript)  
**Deployed at:** https://shrlak.github.io/portfolio/

---

## 1. Design Direction

### Visual Identity (unchanged)
- **Palette:** Graphite base (`#080a10` / `#111420`), bone text (`#ece6d8`), vital red accent (`#E63046`), muted steel (`#888`)
- **Typography stack:** Grotesk (display headings), monospace (labels/captions/code), serif-italic (accent phrases) — preserve existing font imports and CSS custom properties
- **Glassmorphism:** `liquid-glass` and `glass-panel` primitives — keep as-is
- **Circuit SVG backgrounds:** Keep animated schematic overlays per section

### Design Mix
The redesign combines three directions:
- **Bento grid structure** (editorial, magazine mosaic) — information-dense, scannable
- **Dashboard data feel** (live indicators, status dots, metrics as first-class UI) — research as "live system"
- **Journal typography credibility** (clean label/value hierarchy, citation-format publications block)

---

## 2. New Hero Layout

### Structure
Two-column split layout, both columns visible above the fold simultaneously. No scroll required to see key information.

**Left column (≈55% width):**
- Coordinate tag (existing)
- Italic accent phrase (existing)
- Massive uppercase heading: ARTIFICIAL / ORGANS. / ASSISTIVE / INSTRUMENTS. (existing, font size preserved)
- Bottom bar: footnote text + three stat callouts (30 Day · 01 Patent · ISTH)

**Right column (≈45% width):**
- **Live study tile** — pulsing red dot, "ACTIVE STUDY" label, large `2/6` metric, "30-day ovine survival" sub-label, progress bar, `PAS · VV ECMO · IV RIVAROXABAN` detail
- **Credential row** — two tiles side by side: Carnegie Mellon / College of Engineering + KR Patent 10-2675388 / KIPO Jun 2024
- **Research mini-cards** — compact clickable rows for R-01, R-02, R-03, each with title, subtitle, colored status dot (green/amber/blue), and `→` arrow linking to detail page
- **Social + collaboration strip** — icon buttons (email, LinkedIn, GitHub) + "Open to collaboration · Summer 2026" pill with pulsing green dot

### Responsive behavior
On mobile (`< md`): columns stack vertically; right column appears below the heading with reduced padding. Mini-cards collapse to a simpler list.

---

## 3. New Features (not in current site)

### 3.1 Research Progress Timeline
**Location:** Between the research cards section and the contact section.  
**Content:** Horizontal track with six labeled nodes for the PAS study:
1. Protocol Design ✓
2. IACUC Approval ✓
3. Cohort 1 (2/6 endpoint) ✓
4. Protocol Refinement ← active (pulsing border)
5. Powered Trial n=10 (upcoming)
6. Publication Pending

**Implementation:** Pure CSS/SVG — no library dependency. The track fill width (≈55%) is hardcoded to match current study progress.

### 3.2 Publications & Abstracts Section
**Location:** After the research cards, before the timeline.  
**Format:** Citation-style card(s) with:
- Year badge (large red numeral) + conference acronym
- Full abstract/paper title
- Author list with Spencer Kim bolded
- Status badge (Submitted / Published)

**Initial content:** One entry — ISTH 2026 FXIIa inhibitor abstract.

### 3.3 Skills Visualization
**Location:** New `SkillsSection` rendered between the About section and the Research section (inserted into `HomePage` render order).  
**Format:** Two-column grid of skill groups, each with labeled horizontal bar fills:
- Medical Device R&D: extracorporeal circuits, in-vivo large-animal, blood sampling, hollow-fiber oxygenators
- Engineering + Computation: SolidWorks/Fusion 360, Python, MATLAB, FEA/CFD

**Bar widths:** Qualitative (not percentages shown to user). Subtle — 2px tall, red gradient fill.

### 3.4 Colored Status Dots on Research Cards
Replace generic status strings with colored dot + label:
- `ACTIVE` → pulsing green dot (`#22c55e`)
- `SUBMITTED` → amber dot (`#eab308`)
- `REGISTERED` → blue dot (`#60a5fa`)

Applied on both the hero mini-cards and the main research section cards.

### 3.5 "Open to Collaboration" Pill
Small pill component in hero right column and/or About section:  
Pulsing green dot + "Open to collaboration · Summer 2026". Links to `#contact`.

---

## 4. Sections Below Hero — Changes

### Credentials Section
Keep existing layout. Minor update: make the credential grid cells use the new colored status system where relevant.

### About Section
Keep existing content and marquee. Add the skills visualization block below the stats grid (or replace the stats grid with a combined stats + skills layout).

### Research Section
- Keep existing three-card grid
- Apply colored status dots (3.4)
- Featured card (R-01, PAS) gets a slightly larger visual treatment — `1.4fr` column vs `1fr` for others
- Add publications block and timeline strip below the cards

### Contact Section
No structural changes. Keep existing form + channels layout.

### CV Page
No structural changes.

### Detail Pages (PAS, Coag, Cane)
No structural changes — these are already dense and well-designed.

---

## 5. Components to Add/Modify

| Component | File | Change |
|---|---|---|
| `HeroSection` | `App.tsx` | Full rewrite — split 2-col layout |
| `ResearchSection` | `App.tsx` | Add featured card sizing, status dots |
| `PublicationsSection` | `App.tsx` (new) | Citation-format block |
| `TimelineStrip` | `App.tsx` (new) | Horizontal progress track |
| `SkillsSection` | `App.tsx` (new) | Two-column bar chart layout |
| `StatusDot` | `App.tsx` (new primitive) | Colored dot + label by status string |
| `OpenToCollab` | `App.tsx` (new primitive) | Pulsing green pill |
| `index.css` | CSS | Hero split layout vars, timeline CSS, skill bar CSS |

### Content changes (`content.ts`)
- Add `PUBLICATIONS` export: array of `{ year, conference, title, authors, status }`
- Add `SKILLS` export: array of `{ group, items: { name, width }[] }`
- Add `TIMELINE` export: array of `{ label, state: 'done' | 'active' | 'pending' }`
- No changes to existing exports

---

## 6. What Is NOT Changing

- Hash router logic
- All existing content exports unchanged (PERSON, HERO, CREDENTIALS, ABOUT, RESEARCH_CARDS, PAS_DETAIL, COAG_DETAIL, CANE_DETAIL, CV, CONTACT, NAV_ITEMS) — three new exports are additions, not modifications
- Scroll reveal (`useScrollReveal`)
- Active section tracking (`useActiveSection`)
- Cursor glow, scroll progress bar, back-to-top button
- `TextureOverlay`, `SectionTag`, `SectionDivider`, `IconButton`, `PillLink` primitives
- `Navbar` component (minor tweak: active pill color to match new system)
- All schematic SVG components (`schematics.tsx`)
- All diagram components (`diagrams.tsx`)
- All detail pages
- CV page
- Build setup (Vite, Tailwind, TypeScript)

---

## 7. CSS Additions (index.css)

```css
/* Hero split */
.hero-split { display: grid; grid-template-columns: 1.15fr 1fr; min-height: 100svh; }
@media (max-width: 768px) { .hero-split { grid-template-columns: 1fr; } }

/* Status dots */
.sdot-active  { background: #22c55e; box-shadow: 0 0 6px rgba(34,197,94,0.5); animation: pulse 2s infinite; }
.sdot-submitted { background: #eab308; }
.sdot-registered { background: #60a5fa; }

/* Timeline */
.timeline-track { height: 2px; background: rgba(255,255,255,0.05); border-radius: 1px; }
.timeline-fill  { height: 100%; background: linear-gradient(90deg, #E63046, rgba(230,48,70,0.3)); border-radius: 1px; }
.tnode-done   { background: #E63046; border-color: #E63046; }
.tnode-active { background: #080a10; border-color: #E63046; box-shadow: 0 0 10px rgba(230,48,70,0.5); }

/* Skill bars */
.skill-bar { height: 2px; background: rgba(255,255,255,0.05); border-radius: 1px; overflow: hidden; }
.skill-fill { height: 100%; background: linear-gradient(90deg, #E63046, rgba(230,48,70,0.35)); border-radius: 1px; }
```

---

## 8. Out of Scope

- Dark/light mode toggle
- Animations beyond existing scroll-reveal and CSS keyframes
- Any new routing beyond current hash router
- Backend / form submission (contact form stays mailto)
- Analytics
- i18n
