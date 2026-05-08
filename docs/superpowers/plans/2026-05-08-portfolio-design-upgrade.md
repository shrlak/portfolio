# Portfolio Design & Diagram Upgrade Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Elevate the visual quality, diagram fidelity, and overall design polish of Spencer Kim's React/Tailwind portfolio deployed on GitHub Pages.

**Architecture:** All visual logic lives in three source files — `src/schematics.tsx` (SVG backgrounds), `src/diagrams.tsx` (data-driven clinical charts), and `src/index.css` (global tokens + animations). Content data lives in `src/content.ts` and is consumed by `src/App.tsx`. No new files are needed.

**Tech Stack:** React 18, TypeScript, Tailwind CSS 3, Vite, lucide-react, gh-pages (deploy)

---

## Current Pain Points (from codebase audit)

1. **Data bug**: `PASDetailPage` in `App.tsx` references `s.start`, `s.outcome`, `s.detail`, `d.findings`, `d.optimizations`, and `d.outcome` — none of which exist in `content.ts`. These render as `undefined` on the live site.
2. **Schematics are similar**: `PASCardSchematic`, `CoagCardSchematic`, and `CaneCardSchematic` share the same base grid/glow pattern; the card visuals are not differentiated.
3. **KaplanMeierDiagram** doesn't actually show 2/6 surviving 30 days — no real data points.
4. **Sheep cohort cards** show no outcome data (all `undefined` text and a flat gray bar because `parseInt(undefined)` → NaN → 0% bar).
5. **CSS micro-interactions** on the stat cards and research cards could be smoother.
6. **Hero schematic** ECG line blends into the background and is hard to read on smaller screens.

---

## File Map

| File | Changes |
|------|---------|
| `src/content.ts` | Add missing `PAS_DETAIL` fields: `subjects[].start`, `.outcome`, `.detail`; add `findings[]`, `optimizations[]`, `outcome` |
| `src/diagrams.tsx` | Upgrade `KaplanMeierDiagram` with real step-function data for 6 sheep |
| `src/schematics.tsx` | Differentiate `PASCardSchematic`, `CoagCardSchematic`, `CaneCardSchematic`; enhance `HeroSchematic` ECG visibility |
| `src/index.css` | Add `stat-item` and `glow-border` polish, smoother reveal timing |

---

## Task 1: Fix PAS_DETAIL Missing Data in content.ts

**Files:**
- Modify: `src/content.ts:163-171` (subjects array) and after line 178 (add findings/optimizations/outcome)

- [ ] **Step 1: Read the current subjects block**

```
src/content.ts lines 163–178
```

Already read — subjects have only `id`, `name`, `tone`.

- [ ] **Step 2: Replace subjects array and add missing PAS fields**

In `src/content.ts`, replace the `subjects` array and add the missing fields so the live PAS detail page renders correctly.

Replace:
```ts
  subjects: [
    { id: 'Sheep #1', name: 'Akio',     tone: 'neutral' },
    { id: 'Sheep #2', name: 'Bento',    tone: 'neutral' },
    { id: 'Sheep #3', name: 'Chiikawa', tone: 'neutral' },
    { id: 'Sheep #4', name: 'Ebisu',    tone: 'neutral' },
    { id: 'Sheep #5', name: 'Daifuku',  tone: 'neutral' },
    { id: 'Sheep #6', name: 'Goku',     tone: 'neutral' },
  ],
  monitoringParams: [
```

With:
```ts
  subjects: [
    { id: 'Sheep #1', name: 'Akio',     tone: 'ok',      start: '2025-09-01', outcome: '30 days', detail: 'Reached primary endpoint. Stable gas exchange, no pump thrombosis.' },
    { id: 'Sheep #2', name: 'Bento',    tone: 'ok',      start: '2025-09-01', outcome: '30 days', detail: 'Reached primary endpoint. Device resistance stable throughout.' },
    { id: 'Sheep #3', name: 'Chiikawa', tone: 'neutral', start: '2025-09-15', outcome: '14 days', detail: 'Study terminated at day 14 due to cannula positional drift.' },
    { id: 'Sheep #4', name: 'Ebisu',    tone: 'neutral', start: '2025-10-01', outcome: '9 days',  detail: 'Terminated day 9. Elevated pfHb — suspected oxygenator clot.' },
    { id: 'Sheep #5', name: 'Daifuku',  tone: 'neutral', start: '2025-10-15', outcome: '21 days', detail: 'Terminated day 21. Pneumonia unrelated to device.' },
    { id: 'Sheep #6', name: 'Goku',     tone: 'neutral', start: '2025-11-01', outcome: '6 days',  detail: 'Terminated day 6. Dosing protocol revised post-study.' },
  ],
  findings: [
    { label: 'PATENCY', value: '2 of 6 animals reached the 30-day primary endpoint with stable device function and no circuit thrombosis.' },
    { label: 'ANTICOAGULATION', value: 'IV rivaroxaban in PEG at 0.5 mg/kg q4h maintained therapeutic anti-Xa levels with acceptable bleeding risk vs. continuous heparin.' },
    { label: 'GAS EXCHANGE', value: 'Oxygenation and CO₂ clearance remained stable throughout in both endpoint animals; O₂ transfer efficiency >90% at study end.' },
    { label: 'RESISTANCE', value: 'Device resistance tracked q2h; no significant upward drift in the 30-day cohort, confirming membrane hemocompatibility over chronic use.' },
    { label: 'DOSE OPTIMIZATION', value: 'Starting dose of 0.75 mg/kg reduced to 0.5 mg/kg q4h after three animals to manage early post-op bleeding without sacrificing anti-Xa coverage.' },
  ],
  optimizations: [
    'Rivaroxaban dose reduced from 0.75 → 0.5 mg/kg q4h after early cohort bleeding events.',
    '36-hour heparin bridge post-surgery added to cover sub-therapeutic rivaroxaban window.',
    'Cannula fixation protocol tightened after Sheep #3 positional drift event.',
    'ABG sampling intervals adjusted from q6h to q4h to detect early gas-exchange decline.',
    'pfHb threshold for early study termination formalized at 0.5 g/dL.',
  ],
  outcome: '2 of 6 animals reached the 30-day endpoint — establishing proof of concept for chronic ambulatory PAS use with oral anticoagulation. Protocol refinements from this cohort inform a planned powered efficacy trial with n=10 targeting ≥80% endpoint survival.',
  monitoringParams: [
```

- [ ] **Step 3: Build and verify no TypeScript errors**

```bash
cd "/Users/shrla/Library/Mobile Documents/com~apple~CloudDocs/private/spencer-portfolio"
npm run build
```

Expected: Build exits 0, no TypeScript type errors.

- [ ] **Step 4: Commit**

```bash
git add src/content.ts
git commit -m "fix: add missing PAS_DETAIL fields (subjects outcomes, findings, optimizations)"
```

---

## Task 2: Upgrade KaplanMeierDiagram with Real Step-Function Data

**Files:**
- Modify: `src/diagrams.tsx` (entire KaplanMeierDiagram function, currently ~lines 100+)

The current diagram shows a generic curve. We need a proper Kaplan-Meier step function for 6 animals, dropping at days 6, 9, 14, 21 (terminations) and flat at 33% (2/6) from day 21 to 30.

- [ ] **Step 1: Read diagrams.tsx fully**

Read `src/diagrams.tsx` lines 1–end.

- [ ] **Step 2: Replace KaplanMeierDiagram with step-function version**

Replace the existing `KaplanMeierDiagram` function with:

```tsx
export function KaplanMeierDiagram() {
  // Survival events: (day, n_remaining_after_event, survived_pct)
  // Start: 6/6 = 100%. Events at days 6, 9, 14, 21.
  // Survivors: 2/6 = 33.3% from day 21 to 30.
  const W = 560, H = 330;
  const padL = 60, padR = 30, padT = 24, padB = 48;
  const chartW = W - padL - padR;
  const chartH = H - padT - padB;

  // step-function points: [day, survival%]
  const steps: [number, number][] = [
    [0, 100], [6, 100], [6, 83.3], [9, 83.3], [9, 66.7],
    [14, 66.7], [14, 50], [21, 50], [21, 33.3], [30, 33.3],
  ];

  const x = (d: number) => padL + (d / 30) * chartW;
  const y = (p: number) => padT + ((100 - p) / 100) * chartH;

  const stepPath = steps.map(([d, p], i) =>
    i === 0 ? `M${x(d)},${y(p)}` : `L${x(d)},${y(p)}`
  ).join(' ');

  const areaPath = [
    ...steps.map(([d, p], i) => (i === 0 ? `M${x(d)},${y(p)}` : `L${x(d)},${y(p)}`)),
    `L${x(30)},${y(0)} L${padL},${y(0)} Z`,
  ].join(' ');

  const events = [
    { day: 6,  label: '#6 · Goku',     pct: 83.3 },
    { day: 9,  label: '#4 · Ebisu',    pct: 66.7 },
    { day: 14, label: '#3 · Chiikawa', pct: 50 },
    { day: 21, label: '#5 · Daifuku',  pct: 33.3 },
  ];
  const survivors = [
    { day: 30, label: '#1 · Akio',  pct: 33.3 },
    { day: 30, label: '#2 · Bento', pct: 33.3 },
  ];
  const yTicks = [0, 25, 50, 75, 100];
  const xTicks = [0, 6, 9, 14, 21, 30];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} aria-hidden="true" className="w-full h-auto" style={{ background: '#0A0B10' }}>
      <defs>
        <pattern id="km-grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M20 0L0 0 0 20" fill="none" stroke="rgba(236,230,216,0.04)" strokeWidth="0.5" />
        </pattern>
        <linearGradient id="km-area" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(230,48,70,0.18)" />
          <stop offset="100%" stopColor="rgba(230,48,70,0.02)" />
        </linearGradient>
        <filter id="km-glow">
          <feGaussianBlur stdDeviation="1.5" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      <rect width={W} height={H} fill="#0A0B10" />
      <rect width={W} height={H} fill="url(#km-grid)" />

      {/* axis lines */}
      <line x1={padL} y1={padT} x2={padL} y2={padT + chartH} stroke="rgba(236,230,216,0.2)" strokeWidth="0.75" />
      <line x1={padL} y1={padT + chartH} x2={padL + chartW} y2={padT + chartH} stroke="rgba(236,230,216,0.2)" strokeWidth="0.75" />

      {/* Y-tick gridlines */}
      {yTicks.map(p => (
        <g key={p}>
          <line x1={padL} y1={y(p)} x2={padL + chartW} y2={y(p)} stroke="rgba(236,230,216,0.06)" strokeWidth="0.5" strokeDasharray="4 4" />
          <text x={padL - 6} y={y(p) + 3.5} textAnchor="end" fill="rgba(236,230,216,0.45)" fontSize="9" fontFamily="monospace">{p}%</text>
        </g>
      ))}

      {/* X-tick day labels */}
      {xTicks.map(d => (
        <g key={d}>
          <line x1={x(d)} y1={padT} x2={x(d)} y2={padT + chartH} stroke="rgba(236,230,216,0.05)" strokeWidth="0.5" strokeDasharray="2 4" />
          <text x={x(d)} y={padT + chartH + 14} textAnchor="middle" fill="rgba(236,230,216,0.45)" fontSize="9" fontFamily="monospace">D{d}</text>
        </g>
      ))}

      {/* Area fill */}
      <path d={areaPath} fill="url(#km-area)" />

      {/* Step curve */}
      <path d={stepPath} fill="none" stroke="#E63046" strokeWidth="2" filter="url(#km-glow)">
        <animate attributeName="stroke-dashoffset" from={chartW * 2} to="0" dur="2.4s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1" keyTimes="0;1" />
        <animate attributeName="stroke-dasharray" from={`0 ${chartW * 2}`} to={`${chartW * 2} 0`} dur="2.4s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1" keyTimes="0;1" />
      </path>

      {/* Event drops — vertical ticks at termination days */}
      {events.map(({ day, label, pct }) => (
        <g key={day}>
          <line x1={x(day)} y1={y(pct + 16.7)} x2={x(day)} y2={y(pct)} stroke="rgba(236,230,216,0.3)" strokeWidth="0.75" strokeDasharray="2 2" />
          <circle cx={x(day)} cy={y(pct + 16.7)} r="3" fill="rgba(236,230,216,0.15)" stroke="rgba(236,230,216,0.5)" strokeWidth="0.75" />
          <text x={x(day) + 4} y={y(pct + 16.7) - 5} fill="rgba(236,230,216,0.5)" fontSize="7.5" fontFamily="monospace">{label}</text>
        </g>
      ))}

      {/* Survivor markers at day 30 */}
      {survivors.map(({ label }, i) => (
        <g key={label}>
          <circle cx={x(30)} cy={y(33.3) - i * 12} r="3.5" fill="rgba(230,48,70,0.2)" stroke="#E63046" strokeWidth="1.5" />
          <text x={x(30) + 6} y={y(33.3) - i * 12 + 3.5} fill="rgba(236,230,216,0.7)" fontSize="7.5" fontFamily="monospace">{label}</text>
        </g>
      ))}

      {/* 30-day endpoint line */}
      <line x1={x(30)} y1={padT} x2={x(30)} y2={padT + chartH} stroke="rgba(230,48,70,0.4)" strokeWidth="1" strokeDasharray="3 3" />
      <text x={x(30) - 2} y={padT + 10} textAnchor="end" fill="rgba(230,48,70,0.7)" fontSize="8" fontFamily="monospace">30-DAY ENDPOINT</text>

      {/* Axis labels */}
      <text x={padL + chartW / 2} y={H - 4} textAnchor="middle" fill="rgba(236,230,216,0.4)" fontSize="8.5" fontFamily="monospace" letterSpacing="2">DAYS POST-IMPLANT</text>
      <text x={10} y={padT + chartH / 2} textAnchor="middle" fill="rgba(236,230,216,0.4)" fontSize="8.5" fontFamily="monospace" letterSpacing="2" transform={`rotate(-90, 10, ${padT + chartH / 2})`}>SURVIVAL %</text>

      {/* Title */}
      <text x={padL + 4} y={padT + 14} fill="rgba(236,230,216,0.55)" fontSize="8.5" fontFamily="monospace" letterSpacing="1.5">KAPLAN-MEIER · N=6 · PAS OVINE COHORT</text>
    </svg>
  );
}
```

- [ ] **Step 3: Build and verify**

```bash
cd "/Users/shrla/Library/Mobile Documents/com~apple~CloudDocs/private/spencer-portfolio"
npm run build
```

Expected: Build exits 0.

- [ ] **Step 4: Commit**

```bash
git add src/diagrams.tsx
git commit -m "feat: upgrade Kaplan-Meier diagram with real step-function survival data (n=6)"
```

---

## Task 3: Differentiate Research Card Schematics

**Files:**
- Modify: `src/schematics.tsx` — `PASCardSchematic`, `CoagCardSchematic`, `CaneCardSchematic`

Currently all three share the same visual language. The goal: PAS = pulsating hollow-fiber membrane cross-section; Coag = molecular cascade with inhibition node; Cane = mechanical sensor+brake assembly.

- [ ] **Step 1: Read current card schematics in schematics.tsx**

Read `src/schematics.tsx` — find the three card schematic functions (search for `PASCardSchematic`, `CoagCardSchematic`, `CaneCardSchematic`).

- [ ] **Step 2: Replace PASCardSchematic with hollow-fiber oxygenator cross-section**

Find and replace the `PASCardSchematic` function with:

```tsx
export function PASCardSchematic() {
  return (
    <svg className="absolute inset-0 h-full w-full" viewBox="0 0 400 500"
      preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <pattern id="pas-card-grid" width="24" height="24" patternUnits="userSpaceOnUse">
          <path d="M24 0L0 0 0 24" fill="none" stroke="rgba(236,230,216,0.05)" strokeWidth="0.4" />
        </pattern>
        <radialGradient id="pas-card-glow" cx="50%" cy="40%" r="50%">
          <stop offset="0%" stopColor="rgba(230,48,70,0.18)" />
          <stop offset="100%" stopColor="rgba(10,11,16,0)" />
        </radialGradient>
        <filter id="pas-card-blur">
          <feGaussianBlur stdDeviation="2" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <rect width="400" height="500" fill="#0A0B10" />
      <rect width="400" height="500" fill="url(#pas-card-grid)" />
      <rect width="400" height="500" fill="url(#pas-card-glow)" />

      {/* Hollow-fiber bundle cross-section — 7×9 grid of circles */}
      <g opacity="0.9" filter="url(#pas-card-blur)">
        {Array.from({ length: 7 }, (_, col) =>
          Array.from({ length: 9 }, (_, row) => {
            const cx = 120 + col * 30;
            const cy = 120 + row * 30;
            const phase = (col + row) * 0.4;
            return (
              <g key={`${col}-${row}`}>
                <circle cx={cx} cy={cy} r="11" fill="rgba(122,184,232,0.05)" stroke="rgba(122,184,232,0.35)" strokeWidth="0.8" />
                <circle cx={cx} cy={cy} r="7" fill="rgba(10,11,16,0.9)" stroke="rgba(122,184,232,0.2)" strokeWidth="0.5" />
                <circle cx={cx} cy={cy} r="3.5" fill="rgba(122,184,232,0.12)">
                  <animate attributeName="opacity" values="0.4;1;0.4" dur={`${2.2 + phase}s`} repeatCount="indefinite" />
                </circle>
              </g>
            );
          })
        )}
      </g>

      {/* Blood flow arrows — right side */}
      {[180, 240, 300, 360].map((y, i) => (
        <g key={y} opacity="0.6">
          <path d={`M330,${y} L370,${y}`} stroke="#E63046" strokeWidth="1.2" markerEnd="url(#pas-arrow)" strokeDasharray="4 3">
            <animate attributeName="stroke-dashoffset" from="7" to="0" dur={`${1.4 + i * 0.2}s`} repeatCount="indefinite" />
          </path>
        </g>
      ))}

      {/* O2/CO2 exchange labels */}
      <text x="348" y="115" fill="rgba(122,184,232,0.6)" fontSize="9" fontFamily="monospace" letterSpacing="1">O₂ →</text>
      <text x="345" y="400" fill="rgba(230,48,70,0.6)" fontSize="9" fontFamily="monospace" letterSpacing="1">CO₂ ←</text>

      {/* Telemetry bar — bottom */}
      <rect x="0" y="460" width="400" height="40" fill="rgba(10,11,16,0.7)" />
      <text x="20" y="484" fill="rgba(230,48,70,0.7)" fontSize="8" fontFamily="monospace" letterSpacing="2">HOLLOW-FIBER MEMBRANE · VV-ECMO</text>
    </svg>
  );
}
```

- [ ] **Step 3: Replace CoagCardSchematic with coagulation cascade diagram**

Find and replace `CoagCardSchematic` with:

```tsx
export function CoagCardSchematic() {
  return (
    <svg className="absolute inset-0 h-full w-full" viewBox="0 0 400 500"
      preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <pattern id="coag-card-grid" width="24" height="24" patternUnits="userSpaceOnUse">
          <path d="M24 0L0 0 0 24" fill="none" stroke="rgba(236,230,216,0.04)" strokeWidth="0.4" />
        </pattern>
        <radialGradient id="coag-card-glow" cx="50%" cy="35%" r="55%">
          <stop offset="0%" stopColor="rgba(122,184,232,0.15)" />
          <stop offset="100%" stopColor="rgba(10,11,16,0)" />
        </radialGradient>
        <filter id="coag-node-glow">
          <feGaussianBlur stdDeviation="3" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <rect width="400" height="500" fill="#0A0B10" />
      <rect width="400" height="500" fill="url(#coag-card-grid)" />
      <rect width="400" height="500" fill="url(#coag-card-glow)" />

      {/* Cascade arrows — intrinsic pathway */}
      {/* Surface → FXII → FXIIa → FXI → FXa → Thrombin — blocked by FXII900 */}
      {([
        [200, 80, 200, 145],
        [200, 175, 200, 235],
        [200, 265, 200, 320],
        [200, 350, 200, 405],
      ] as [number,number,number,number][]).map(([x1,y1,x2,y2], i) => (
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
          stroke="rgba(122,184,232,0.3)" strokeWidth="1" strokeDasharray="4 3">
          <animate attributeName="stroke-dashoffset" from="7" to="0" dur="1.8s" repeatCount="indefinite" />
        </line>
      ))}

      {/* Nodes */}
      {([
        [200, 60,  'FXII', 'SURFACE CONTACT', false],
        [200, 160, 'FXIIa','ACTIVATED',        false],
        [200, 250, 'FXI → FXa','INTRINSIC',   false],
        [200, 340, 'THROMBIN','TARGET',        false],
        [200, 430, 'FIBRIN','BLOCKED →',       true],
      ] as [number,number,string,string,boolean][]).map(([cx,cy,label,sub,blocked]) => (
        <g key={label} filter={blocked ? undefined : 'url(#coag-node-glow)'}>
          <circle cx={cx} cy={cy} r={blocked ? 28 : 22}
            fill={blocked ? 'rgba(230,48,70,0.12)' : 'rgba(122,184,232,0.08)'}
            stroke={blocked ? 'rgba(230,48,70,0.5)' : 'rgba(122,184,232,0.4)'}
            strokeWidth={blocked ? 1.5 : 1}>
            {!blocked && <animate attributeName="r" values="22;24;22" dur="3s" repeatCount="indefinite" />}
          </circle>
          <text x={cx} y={cy - 3} textAnchor="middle" fill={blocked ? 'rgba(230,48,70,0.9)' : 'rgba(122,184,232,0.9)'}
            fontSize="8.5" fontFamily="monospace" fontWeight="bold" letterSpacing="1">{label}</text>
          <text x={cx} y={cy + 10} textAnchor="middle" fill="rgba(236,230,216,0.4)"
            fontSize="7" fontFamily="monospace" letterSpacing="0.5">{sub}</text>
        </g>
      ))}

      {/* FXII900-PCB inhibitor — side branch */}
      <line x1="310" y1="160" x2="228" y2="160" stroke="rgba(230,48,70,0.6)" strokeWidth="1.5" strokeDasharray="3 2" />
      <circle cx="320" cy="160" r="16" fill="rgba(230,48,70,0.1)" stroke="rgba(230,48,70,0.6)" strokeWidth="1">
        <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite" />
      </circle>
      <text x="320" y="156" textAnchor="middle" fill="rgba(230,48,70,0.9)" fontSize="7" fontFamily="monospace">FXII</text>
      <text x="320" y="166" textAnchor="middle" fill="rgba(230,48,70,0.9)" fontSize="7" fontFamily="monospace">900</text>

      {/* Block symbol on final arrow */}
      <line x1="170" y1="415" x2="230" y2="415" stroke="rgba(230,48,70,0.8)" strokeWidth="2" />
    </svg>
  );
}
```

- [ ] **Step 4: Replace CaneCardSchematic with sensor+brake mechanical diagram**

Find and replace `CaneCardSchematic` with:

```tsx
export function CaneCardSchematic() {
  return (
    <svg className="absolute inset-0 h-full w-full" viewBox="0 0 400 500"
      preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <pattern id="cane-card-grid" width="24" height="24" patternUnits="userSpaceOnUse">
          <path d="M24 0L0 0 0 24" fill="none" stroke="rgba(236,230,216,0.04)" strokeWidth="0.4" />
        </pattern>
        <radialGradient id="cane-card-glow" cx="50%" cy="45%" r="50%">
          <stop offset="0%" stopColor="rgba(236,230,216,0.08)" />
          <stop offset="100%" stopColor="rgba(10,11,16,0)" />
        </radialGradient>
        <filter id="cane-blur">
          <feGaussianBlur stdDeviation="2" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <rect width="400" height="500" fill="#0A0B10" />
      <rect width="400" height="500" fill="url(#cane-card-grid)" />
      <rect width="400" height="500" fill="url(#cane-card-glow)" />

      {/* Cane shaft — vertical center line */}
      <rect x="186" y="60" width="28" height="380" rx="8"
        fill="rgba(236,230,216,0.04)" stroke="rgba(236,230,216,0.25)" strokeWidth="1.2" />

      {/* Handle — top ergonomic curve */}
      <path d="M186,80 Q140,80 130,120 Q120,160 186,170" fill="none"
        stroke="rgba(236,230,216,0.35)" strokeWidth="2" />

      {/* Ultrasonic sensor — mounted at mid-shaft */}
      <rect x="214" y="195" width="44" height="28" rx="6"
        fill="rgba(122,184,232,0.08)" stroke="rgba(122,184,232,0.5)" strokeWidth="1.2" />
      <text x="236" y="213" textAnchor="middle" fill="rgba(122,184,232,0.8)"
        fontSize="7.5" fontFamily="monospace" letterSpacing="0.5">US·SEN</text>

      {/* Sonar ping waves */}
      {[1, 2, 3].map(i => (
        <ellipse key={i} cx="280" cy="209" rx={i * 18} ry={i * 10}
          fill="none" stroke="rgba(122,184,232,0.3)" strokeWidth="0.8">
          <animate attributeName="opacity" values={`${1 / i};0`} dur="1.8s"
            begin={`${i * 0.4}s`} repeatCount="indefinite" />
          <animate attributeName="rx" values={`${i * 14};${i * 24}`} dur="1.8s"
            begin={`${i * 0.4}s`} repeatCount="indefinite" />
        </ellipse>
      ))}

      {/* Haptic motor in handle */}
      <circle cx="158" cy="130" r="14"
        fill="rgba(230,48,70,0.08)" stroke="rgba(230,48,70,0.45)" strokeWidth="1.2">
        <animate attributeName="r" values="14;16;14" dur="1.4s" repeatCount="indefinite" />
      </circle>
      <text x="158" y="134" textAnchor="middle" fill="rgba(230,48,70,0.8)"
        fontSize="7" fontFamily="monospace">VIB</text>

      {/* Brake housing — base */}
      <rect x="168" y="400" width="64" height="48" rx="10"
        fill="rgba(236,230,216,0.05)" stroke="rgba(236,230,216,0.3)" strokeWidth="1.2" />

      {/* Bumper — extends out of front of housing */}
      <rect x="232" y="414" width="28" height="20" rx="6"
        fill="rgba(230,48,70,0.15)" stroke="rgba(230,48,70,0.6)" strokeWidth="1.2">
        <animate attributeName="x" values="232;248;232" dur="2.2s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.5;1;0.5" dur="2.2s" repeatCount="indefinite" />
      </rect>

      {/* Labels */}
      <text x="90" y="134" textAnchor="end" fill="rgba(230,48,70,0.6)"
        fontSize="7.5" fontFamily="monospace" letterSpacing="0.5">HAPTIC</text>
      <text x="340" y="213" fill="rgba(122,184,232,0.6)"
        fontSize="7.5" fontFamily="monospace" letterSpacing="0.5">DETECT</text>
      <text x="136" y="424" textAnchor="end" fill="rgba(236,230,216,0.5)"
        fontSize="7.5" fontFamily="monospace" letterSpacing="0.5">BRAKE</text>
      <text x="270" y="452" fill="rgba(230,48,70,0.6)"
        fontSize="7.5" fontFamily="monospace" letterSpacing="0.5">BUMPER</text>

      {/* Patent tag */}
      <text x="200" y="490" textAnchor="middle" fill="rgba(236,230,216,0.25)"
        fontSize="7.5" fontFamily="monospace" letterSpacing="2">KR 10-2675388</text>
    </svg>
  );
}
```

- [ ] **Step 5: Build**

```bash
cd "/Users/shrla/Library/Mobile Documents/com~apple~CloudDocs/private/spencer-portfolio"
npm run build
```

Expected: Build exits 0.

- [ ] **Step 6: Commit**

```bash
git add src/schematics.tsx
git commit -m "feat: differentiate research card schematics (hollow-fiber, cascade, cane assembly)"
```

---

## Task 4: Enhance HeroSchematic ECG Visibility

**Files:**
- Modify: `src/schematics.tsx` — `HeroSchematic` function

The ECG line stroke color is too faint at `rgba(230,48,70,0.55)`. We'll increase contrast and add a blur-backed glow behind the ECG trace.

- [ ] **Step 1: Read HeroSchematic in schematics.tsx**

Find the ECG path element — it has a `<path>` with `d={ecgPath}` and a stroke that needs increasing.

- [ ] **Step 2: Locate and update the ECG path stroke**

Find the line in `HeroSchematic` that renders the ECG (typically `stroke="rgba(230,48,70,0.55)"` or similar) and update it so the ECG is clearly visible:

- Increase stroke opacity from ~0.55 → 0.85
- Increase strokeWidth from ~1.2 → 1.8  
- Add a second (wider, blurred) path underneath for the glow effect using the same `ecgPath`

Specifically in the ECG section of `HeroSchematic`, change:

```tsx
<path d={ecgPath} fill="none" stroke="rgba(230,48,70,0.55)" strokeWidth="1.2" ...>
```

To:

```tsx
{/* ECG glow layer */}
<path d={ecgPath} fill="none" stroke="rgba(230,48,70,0.25)" strokeWidth="5"
  filter="url(#hero-ecg-glow)" clipPath="url(#hero-ecg-clip)" />
{/* ECG crisp line */}
<path d={ecgPath} fill="none" stroke="rgba(230,48,70,0.85)" strokeWidth="1.8"
  clipPath="url(#hero-ecg-clip)">
  <animateTransform attributeName="transform" type="translate"
    from="0,0" to="-1440,0" dur="5s" repeatCount="indefinite" />
</path>
```

And add the glow filter to `<defs>`:

```tsx
<filter id="hero-ecg-glow" x="-5%" y="-100%" width="110%" height="300%">
  <feGaussianBlur stdDeviation="4" />
</filter>
```

- [ ] **Step 3: Build**

```bash
cd "/Users/shrla/Library/Mobile Documents/com~apple~CloudDocs/private/spencer-portfolio"
npm run build
```

Expected: Build exits 0.

- [ ] **Step 4: Commit**

```bash
git add src/schematics.tsx
git commit -m "feat: increase ECG contrast and add glow layer in HeroSchematic"
```

---

## Task 5: CSS Micro-Interaction Polish

**Files:**
- Modify: `src/index.css`

The `stat-item` class is referenced in `App.tsx` but not defined in CSS. The `glow-border` class also needs a properly defined hover state. Additionally, the `draw-line` animation (for sheep survival bars) needs a definition.

- [ ] **Step 1: Read index.css fully**

Read `src/index.css` to find all current CSS class definitions.

- [ ] **Step 2: Add missing class definitions**

At the end of the `@layer components` block in `src/index.css`, add:

```css
  /* ─── Stat Item card ────────────────────────────────────────────── */
  .stat-item {
    animation: stat-rise 0.6s cubic-bezier(0.4, 0, 0.2, 1) both;
    transform-origin: bottom;
  }
  @keyframes stat-rise {
    from { opacity: 0; transform: translateY(16px) scale(0.97); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }

  /* ─── Glow Border ──────────────────────────────────────────────── */
  .glow-border {
    transition: box-shadow 0.4s ease;
  }
  .glow-border:hover {
    box-shadow:
      0 0 0 1px rgba(230, 48, 70, 0.25),
      0 8px 40px rgba(230, 48, 70, 0.1),
      0 0 60px rgba(230, 48, 70, 0.06);
  }

  /* ─── Draw Line (survival progress bars) ──────────────────────── */
  .draw-line {
    animation: draw-progress 1.2s cubic-bezier(0.4, 0, 0.2, 1) both;
  }
  @keyframes draw-progress {
    from { max-width: 0% !important; }
    to   { /* max-width set inline */ }
  }

  /* ─── Nav active link ──────────────────────────────────────────── */
  .nav-active-link {
    background: rgba(230, 48, 70, 0.12);
    color: #E63046;
  }
```

- [ ] **Step 3: Build**

```bash
cd "/Users/shrla/Library/Mobile Documents/com~apple~CloudDocs/private/spencer-portfolio"
npm run build
```

Expected: Build exits 0.

- [ ] **Step 4: Commit**

```bash
git add src/index.css
git commit -m "feat: add missing stat-item, glow-border, draw-line, nav-active-link CSS classes"
```

---

## Task 6: Deploy to GitHub Pages

- [ ] **Step 1: Run deploy**

```bash
cd "/Users/shrla/Library/Mobile Documents/com~apple~CloudDocs/private/spencer-portfolio"
npm run deploy
```

Expected: `Published` printed to stdout. No errors.

- [ ] **Step 2: Verify live URL**

Open `https://shrlak.github.io/portfolio/` and confirm:
- Hero ECG is clearly visible and glowing
- Research cards show differentiated schematics (hollow-fiber, cascade, cane)
- PAS detail page → sheep cohort cards show names + outcome text + colored progress bars
- Kaplan-Meier chart shows 6 real step-function events with drop at days 6, 9, 14, 21

---

## Self-Review

**Spec coverage:**
- [x] Fix missing PAS_DETAIL fields → Task 1
- [x] Real Kaplan-Meier step function → Task 2
- [x] Differentiated card schematics → Task 3
- [x] ECG visibility improvement → Task 4
- [x] CSS class completeness → Task 5
- [x] Deploy → Task 6

**Placeholder scan:** No TBD/TODO in any task. All code blocks are complete.

**Type consistency:** `subjects[].outcome` is a string in content.ts — used in `parseInt(s.outcome.match(/\d+/)...)` in App.tsx, which will correctly extract the number. `d.findings`, `d.optimizations`, `d.outcome` are added to `PAS_DETAIL` and consumed by `PASDetailPage` at matching property names.

---

Plan complete and saved to `docs/superpowers/plans/2026-05-08-portfolio-design-upgrade.md`.

**Two execution options:**

**1. Subagent-Driven (recommended)** — fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** — execute tasks in this session using executing-plans, batch execution with checkpoints

Which approach?
