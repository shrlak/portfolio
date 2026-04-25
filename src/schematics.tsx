/* ----------------------------------------------------------------------------
 * SVG SCHEMATICS — medical-device blueprint illustrations
 * Every schematic is purely decorative (aria-hidden) and is paired with
 * readable text elsewhere in the layout.
 * -------------------------------------------------------------------------- */

/** Anatomical heart — hero centerpiece */
export function HeroSchematic() {
  return (
    <svg
      className="absolute inset-0 h-full w-full"
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <pattern id="hero-grid" width="48" height="48" patternUnits="userSpaceOnUse">
          <path d="M 48 0 L 0 0 0 48" fill="none" stroke="rgba(236,230,216,0.06)" strokeWidth="0.5" />
        </pattern>
        <radialGradient id="hero-glow" cx="75%" cy="50%" r="45%">
          <stop offset="0%" stopColor="rgba(230,48,70,0.18)" />
          <stop offset="60%" stopColor="rgba(230,48,70,0.03)" />
          <stop offset="100%" stopColor="rgba(10,11,16,0)" />
        </radialGradient>
        <linearGradient id="hero-vignette" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(10,11,16,0.25)" />
          <stop offset="60%" stopColor="rgba(10,11,16,0)" />
          <stop offset="100%" stopColor="rgba(10,11,16,0.9)" />
        </linearGradient>
      </defs>

      <rect width="100%" height="100%" fill="#0A0B10" />
      <rect width="100%" height="100%" fill="url(#hero-grid)" />
      <rect width="100%" height="100%" fill="url(#hero-glow)" />

      <g transform="translate(1080 460)">
        <g className="animate-spin-slower" style={{ transformOrigin: '0 0' }}>
          <circle r="380" className="schematic-stroke-faint" strokeDasharray="2 6" />
          <circle r="320" className="schematic-stroke-faint" />
          <circle r="260" className="schematic-stroke-faint" strokeDasharray="1 3" />
        </g>
        <circle r="200" className="schematic-stroke-faint" />

        <g>
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => {
            const rad = (deg * Math.PI) / 180;
            const x1 = Math.cos(rad) * 310;
            const y1 = Math.sin(rad) * 310;
            const x2 = Math.cos(rad) * 330;
            const y2 = Math.sin(rad) * 330;
            return (
              <line
                key={deg}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                className="schematic-stroke"
                strokeWidth={deg % 90 === 0 ? 1.5 : 0.6}
              />
            );
          })}
        </g>

        <g className="animate-pulse-slow" style={{ transformOrigin: '0 0' }}>
          <path
            d="
              M 0 110
              C -120 70, -160 -40, -90 -80
              C -50 -100, -15 -85, 0 -45
              C 15 -85, 50 -100, 90 -80
              C 160 -40, 120 70, 0 110
              Z"
            className="schematic-accent"
            strokeWidth="1.5"
          />
          <path d="M -20 -75 Q -20 -140 -60 -170 Q -110 -190 -130 -160" className="schematic-stroke" strokeWidth="1.2" />
          <path d="M 20 -75 Q 30 -140 70 -160 Q 100 -175 130 -150" className="schematic-stroke" strokeWidth="1.2" />
          <path d="M -55 -40 Q -120 -20 -160 0" className="schematic-stroke" strokeWidth="1" />
          <path d="M 0 -45 L 0 100" className="schematic-stroke-faint" strokeDasharray="2 3" />
          <circle cx="-28" cy="-10" r="3" fill="#E63046" />
          <circle cx="28" cy="-10" r="3" fill="#E63046" />
          <circle cx="0" cy="40" r="2" fill="#E63046" />
        </g>

        <g>
          <line x1="-90" y1="-170" x2="-180" y2="-220" className="schematic-stroke-faint" />
          <text x="-360" y="-228" className="schematic-label">A-01 · AORTA</text>
          <circle cx="-180" cy="-220" r="2" fill="rgba(236,230,216,0.45)" />
          <line x1="90" y1="-160" x2="220" y2="-200" className="schematic-stroke-faint" />
          <text x="230" y="-208" className="schematic-label">A-02 · PULMONARY ARTERY</text>
          <circle cx="220" cy="-200" r="2" fill="rgba(236,230,216,0.45)" />
          <line x1="-150" y1="40" x2="-260" y2="90" className="schematic-stroke-faint" />
          <text x="-420" y="96" className="schematic-label">A-03 · VENA CAVA</text>
          <circle cx="-260" cy="90" r="2" fill="rgba(236,230,216,0.45)" />
          <line x1="110" y1="50" x2="230" y2="90" className="schematic-stroke-faint" />
          <text x="240" y="96" className="schematic-label">A-04 · VALVE ASSEMBLY</text>
          <circle cx="230" cy="90" r="2" fill="rgba(236,230,216,0.45)" />
        </g>
      </g>

      <g transform="translate(80 200)">
        <line x1="0" y1="0" x2="0" y2="320" className="schematic-stroke-faint" />
        {[0, 60, 120, 180, 240, 300].map((y) => (
          <g key={y}>
            <line x1="-6" y1={y} x2="6" y2={y} className="schematic-stroke-faint" />
            <text x="14" y={y + 3} className="schematic-label">
              {(100 - y * 0.2).toFixed(1)}
            </text>
          </g>
        ))}
      </g>

      <g transform="translate(0 780)">
        <line x1="0" y1="0" x2="1440" y2="0" className="schematic-stroke-faint" strokeDasharray="1 4" />
        <path
          d="M 0 0 L 200 0 L 230 0 L 240 -20 L 250 30 L 260 -40 L 270 0 L 420 0 L 430 -5 L 440 -25 L 450 40 L 460 -50 L 470 0 L 620 0 L 630 0 L 640 -20 L 650 30 L 660 -40 L 670 0 L 820 0 L 830 -5 L 840 -25 L 850 40 L 860 -50 L 870 0 L 1020 0 L 1030 -5 L 1040 -25 L 1050 40 L 1060 -50 L 1070 0 L 1220 0 L 1230 -20 L 1240 30 L 1250 -40 L 1260 0 L 1440 0"
          className="schematic-accent"
          strokeWidth="1.25"
          opacity="0.85"
        />
      </g>

      <rect width="100%" height="100%" fill="url(#hero-vignette)" />
    </svg>
  );
}

/** Bronchial / pulmonary tree — about section backdrop */
export function AboutSchematic() {
  return (
    <svg
      className="absolute inset-0 h-full w-full"
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <pattern id="about-grid" width="64" height="64" patternUnits="userSpaceOnUse">
          <path d="M 64 0 L 0 0 0 64" fill="none" stroke="rgba(236,230,216,0.05)" strokeWidth="0.5" />
        </pattern>
        <radialGradient id="about-glow" cx="30%" cy="80%" r="60%">
          <stop offset="0%" stopColor="rgba(122,184,232,0.14)" />
          <stop offset="60%" stopColor="rgba(122,184,232,0.02)" />
          <stop offset="100%" stopColor="rgba(10,11,16,0)" />
        </radialGradient>
      </defs>

      <rect width="100%" height="100%" fill="#0A0B10" />
      <rect width="100%" height="100%" fill="url(#about-grid)" />
      <rect width="100%" height="100%" fill="url(#about-glow)" />

      <g transform="translate(1060 500)" className="animate-breathe">
        <path d="M 0 -220 L 0 -20" className="schematic-stroke" strokeWidth="2" />
        <path d="M 0 -20 Q -40 10 -120 80" className="schematic-stroke" strokeWidth="1.5" />
        <path d="M 0 -20 Q 40 10 120 80" className="schematic-stroke" strokeWidth="1.5" />
        <path d="M -120 80 Q -160 100 -200 160" className="schematic-stroke" strokeWidth="1.1" />
        <path d="M -120 80 Q -100 130 -140 200" className="schematic-stroke" strokeWidth="1.1" />
        <path d="M 120 80 Q 160 100 200 160" className="schematic-stroke" strokeWidth="1.1" />
        <path d="M 120 80 Q 100 130 140 200" className="schematic-stroke" strokeWidth="1.1" />
        <path d="M -200 160 Q -240 180 -260 220" className="schematic-stroke-faint" />
        <path d="M -200 160 Q -210 200 -190 240" className="schematic-stroke-faint" />
        <path d="M -140 200 Q -170 230 -160 270" className="schematic-stroke-faint" />
        <path d="M 200 160 Q 240 180 260 220" className="schematic-stroke-faint" />
        <path d="M 200 160 Q 210 200 190 240" className="schematic-stroke-faint" />
        <path d="M 140 200 Q 170 230 160 270" className="schematic-stroke-faint" />

        {[[-260, 240], [-190, 260], [-160, 290], [260, 240], [190, 260], [160, 290]].map(([x, y], i) => (
          <g key={i} transform={`translate(${x} ${y})`}>
            <circle r="14" className="schematic-stroke-faint" />
            <circle r="8" className="schematic-stroke-faint" />
            <circle r="3" fill="#E63046" opacity="0.6" />
          </g>
        ))}

        <g transform="translate(0 -220)">
          <rect x="-24" y="-40" width="48" height="30" rx="2" className="schematic-accent" strokeWidth="1.3" />
          <line x1="0" y1="-40" x2="0" y2="-70" className="schematic-accent" strokeWidth="1.3" />
        </g>
      </g>

      <g transform="translate(240 640)">
        <circle r="70" className="schematic-stroke-faint" />
        <circle r="50" className="schematic-stroke-faint" />
        {[...Array(24)].map((_, i) => {
          const angle = (i * 15 * Math.PI) / 180;
          const x1 = Math.cos(angle) * 62;
          const y1 = Math.sin(angle) * 62;
          const x2 = Math.cos(angle) * 70;
          const y2 = Math.sin(angle) * 70;
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              className="schematic-stroke"
              strokeWidth={i % 6 === 0 ? 1.2 : 0.5}
            />
          );
        })}
        <line x1="0" y1="0" x2="35" y2="-35" className="schematic-accent" strokeWidth="1.5" />
        <circle r="3" fill="#E63046" />
        <text x="-28" y="96" className="schematic-label">PO₂ · 98%</text>
      </g>
    </svg>
  );
}

/** Tartan / CMU College-of-Engineering motif for credentials section */
export function CredentialsSchematic() {
  return (
    <svg
      className="absolute inset-0 h-full w-full"
      viewBox="0 0 1440 600"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <pattern id="cred-grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(236,230,216,0.05)" strokeWidth="0.5" />
        </pattern>
        <linearGradient id="cred-fade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(10,11,16,0.3)" />
          <stop offset="100%" stopColor="rgba(10,11,16,0)" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="#0A0B10" />
      <rect width="100%" height="100%" fill="url(#cred-grid)" />
      <rect width="100%" height="100%" fill="url(#cred-fade)" />

      {/* Tartan / diploma motif — stacked horizontal bands with technical annotations */}
      <g transform="translate(80 80)">
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <line key={i} x1="0" y1={i * 60} x2="1280" y2={i * 60} className="schematic-stroke-faint" />
        ))}
        <line x1="200" y1="0" x2="200" y2="420" className="schematic-stroke-faint" strokeDasharray="3 6" />
        <line x1="520" y1="0" x2="520" y2="420" className="schematic-stroke-faint" strokeDasharray="3 6" />
        <line x1="920" y1="0" x2="920" y2="420" className="schematic-stroke-faint" strokeDasharray="3 6" />
        {/* Accent band */}
        <rect x="0" y="180" width="1280" height="60" fill="rgba(230,48,70,0.05)" />
        <line x1="0" y1="180" x2="1280" y2="180" className="schematic-accent" strokeWidth="0.75" />
        <line x1="0" y1="240" x2="1280" y2="240" className="schematic-accent" strokeWidth="0.75" />
      </g>

      {/* Big mark: CMU */}
      <g transform="translate(1180 380)" opacity="0.12">
        <text x="0" y="0" textAnchor="end" fontFamily="Anton, sans-serif" fontSize="220" fill="#ECE6D8">
          CMU
        </text>
      </g>
    </svg>
  );
}

/** Card schematic — PAS artificial lung circuit */
export function PASCardSchematic() {
  return (
    <svg
      className="absolute inset-0 h-full w-full"
      viewBox="0 0 400 400"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <pattern id="pas-card-grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(236,230,216,0.05)" strokeWidth="0.4" />
        </pattern>
        <radialGradient id="pas-card-glow" cx="65%" cy="35%" r="60%">
          <stop offset="0%" stopColor="rgba(230,48,70,0.20)" />
          <stop offset="100%" stopColor="rgba(10,11,16,0)" />
        </radialGradient>
      </defs>
      <rect width="100%" height="100%" fill="#0A0B10" />
      <rect width="100%" height="100%" fill="url(#pas-card-grid)" />
      <rect width="100%" height="100%" fill="url(#pas-card-glow)" />

      {/* Ovine silhouette (simplified side view) */}
      <g transform="translate(60 130)">
        <path
          d="M 0 50 Q -6 36 4 28 Q 12 22 26 28 L 40 26 Q 60 14 80 22 L 110 18 Q 145 18 170 34 Q 195 40 204 56 L 204 78 Q 196 98 180 104 Q 160 110 120 108 Q 60 112 28 106 Q 10 100 0 82 Z"
          className="schematic-stroke"
          strokeWidth="1.2"
        />
        {/* Legs */}
        <line x1="40" y1="106" x2="40" y2="140" className="schematic-stroke" strokeWidth="1" />
        <line x1="70" y1="108" x2="70" y2="140" className="schematic-stroke" strokeWidth="1" />
        <line x1="150" y1="108" x2="150" y2="140" className="schematic-stroke" strokeWidth="1" />
        <line x1="180" y1="106" x2="180" y2="140" className="schematic-stroke" strokeWidth="1" />
        {/* Eye + ear */}
        <circle cx="14" cy="36" r="1.5" fill="#ECE6D8" opacity="0.6" />
        <path d="M 2 26 Q -4 14 6 10" className="schematic-stroke" strokeWidth="1" />
        {/* Jugular cannulas */}
        <line x1="26" y1="50" x2="-40" y2="-40" className="schematic-accent" strokeWidth="1.4" />
        <line x1="34" y1="52" x2="-20" y2="-40" className="schematic-accent" strokeWidth="1.4" />
        <circle cx="-40" cy="-40" r="3" fill="#E63046" />
        <circle cx="-20" cy="-40" r="3" fill="#E63046" />
      </g>

      {/* Device (PAS) housing top right */}
      <g transform="translate(280 110)">
        <rect x="-60" y="-40" width="120" height="80" rx="6" className="schematic-stroke" strokeWidth="1.3" />
        <rect x="-50" y="-30" width="48" height="60" className="schematic-stroke-faint" />
        <rect x="2" y="-30" width="56" height="60" className="schematic-stroke-faint" />
        {/* Centrifugal pump */}
        <circle cx="-26" cy="0" r="18" className="schematic-accent" strokeWidth="1.3" />
        {[0, 60, 120, 180, 240, 300].map((d) => (
          <line key={d} x1="-26" y1="0" x2="-26" y2="-16" transform={`rotate(${d} -26 0)`} className="schematic-accent" strokeWidth="0.9" />
        ))}
        <circle cx="-26" cy="0" r="3" fill="#E63046" />
        {/* Hollow fiber oxygenator */}
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <line key={i} x1={10 + i * 7} y1="-26" x2={10 + i * 7} y2="26" className="schematic-stroke" strokeWidth="0.8" />
        ))}
      </g>

      {/* Flow lines between sheep and device */}
      <path d="M 170 130 C 210 95, 230 100, 240 110" className="schematic-accent" strokeWidth="1.4" fill="none" />
      <path d="M 170 145 C 210 125, 230 128, 240 130" className="schematic-accent" strokeWidth="1.4" fill="none" />
      {[0, 1, 2].map((i) => (
        <circle key={i} cx={190 + i * 18} cy={118 + i * 1} r="2.5" fill="#E63046" className="flow-dot" style={{ animationDelay: `${i * 0.35}s` }} />
      ))}

      {/* Data strip bottom */}
      <g transform="translate(16 350)" opacity="0.6">
        <line x1="0" y1="0" x2="200" y2="0" className="schematic-stroke-faint" />
        {[0, 25, 50, 75, 100].map((p, i) => (
          <g key={i}>
            <line x1={(p / 100) * 200} y1="-4" x2={(p / 100) * 200} y2="4" className="schematic-stroke" strokeWidth="0.8" />
          </g>
        ))}
      </g>
      <text x="384" y="390" textAnchor="end" className="schematic-label" opacity="0.55">R-01 · PAS CIRCUIT</text>
    </svg>
  );
}

/** Card schematic — coagulation cascade with FXII900 inhibition */
export function CoagCardSchematic() {
  return (
    <svg
      className="absolute inset-0 h-full w-full"
      viewBox="0 0 400 400"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <pattern id="coag-card-grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(236,230,216,0.05)" strokeWidth="0.4" />
        </pattern>
        <radialGradient id="coag-card-glow" cx="50%" cy="50%" r="55%">
          <stop offset="0%" stopColor="rgba(122,184,232,0.18)" />
          <stop offset="100%" stopColor="rgba(10,11,16,0)" />
        </radialGradient>
      </defs>
      <rect width="100%" height="100%" fill="#0A0B10" />
      <rect width="100%" height="100%" fill="url(#coag-card-grid)" />
      <rect width="100%" height="100%" fill="url(#coag-card-glow)" />

      {/* Cascade: vertical node chain */}
      <g transform="translate(120 50)" fontFamily="JetBrains Mono, monospace">
        {[
          { y: 0, label: 'XII' },
          { y: 60, label: 'XIIa' },
          { y: 120, label: 'XI → XIa' },
          { y: 180, label: 'IX → IXa' },
          { y: 240, label: 'X → Xa' },
          { y: 300, label: 'THROMBIN' },
        ].map((n, i) => (
          <g key={i} transform={`translate(0 ${n.y})`}>
            <rect x="-50" y="-14" width="100" height="28" rx="2" className={i === 1 ? 'schematic-accent' : 'schematic-stroke'} strokeWidth="1.1" fill="rgba(10,11,16,0.65)" />
            <text x="0" y="4" textAnchor="middle" fontSize="10" letterSpacing="0.18em" fill={i === 1 ? '#E63046' : 'rgba(236,230,216,0.9)'}>
              {n.label}
            </text>
            {i < 5 && (
              <>
                <line x1="0" y1="14" x2="0" y2="46" className="schematic-stroke" strokeWidth="1" />
                <path d="M -4 42 L 0 50 L 4 42" className="schematic-stroke" fill="none" strokeWidth="1" />
              </>
            )}
          </g>
        ))}

        {/* FXII900 block at XII → XIIa */}
        <g transform="translate(70 30)">
          <circle r="22" className="schematic-accent" strokeWidth="1.5" />
          <circle r="14" fill="#E63046" opacity="0.25" />
          <line x1="-10" y1="0" x2="10" y2="0" stroke="#E63046" strokeWidth="2" />
          <line x1="0" y1="-10" x2="0" y2="10" stroke="#E63046" strokeWidth="2" />
        </g>
      </g>

      {/* Hollow-fiber surface indicator on right */}
      <g transform="translate(320 120)">
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <line key={i} x1="0" y1={i * 32} x2="0" y2={i * 32 + 24} className="schematic-stroke" strokeWidth="1.2" />
        ))}
        <line x1="-14" y1="0" x2="-14" y2="220" className="schematic-stroke-faint" />
        <text x="6" y="120" className="schematic-label" opacity="0.55">PCB</text>
      </g>

      <text x="384" y="390" textAnchor="end" className="schematic-label" opacity="0.55">R-02 · FXIIa CASCADE</text>
    </svg>
  );
}

/** Card schematic — cane with brake mechanism + obstacle cone */
export function CaneCardSchematic() {
  return (
    <svg
      className="absolute inset-0 h-full w-full"
      viewBox="0 0 400 400"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <pattern id="cane-card-grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(236,230,216,0.05)" strokeWidth="0.4" />
        </pattern>
        <radialGradient id="cane-card-glow" cx="40%" cy="30%" r="55%">
          <stop offset="0%" stopColor="rgba(230,48,70,0.18)" />
          <stop offset="100%" stopColor="rgba(10,11,16,0)" />
        </radialGradient>
      </defs>
      <rect width="100%" height="100%" fill="#0A0B10" />
      <rect width="100%" height="100%" fill="url(#cane-card-grid)" />
      <rect width="100%" height="100%" fill="url(#cane-card-glow)" />

      {/* Cane shaft at angle */}
      <g transform="translate(220 60)">
        {/* Handle */}
        <path
          d="M -10 0 Q 0 -18 18 -14 L 30 -6 L 28 6 L 0 12 Z"
          className="schematic-stroke"
          strokeWidth="1.3"
          fill="rgba(10,11,16,0.6)"
        />
        <circle cx="12" cy="0" r="3" fill="#E63046" />

        {/* Shaft */}
        <line x1="-4" y1="12" x2="-80" y2="260" className="schematic-stroke" strokeWidth="2.2" />
        <line x1="-2" y1="14" x2="-78" y2="262" className="schematic-stroke-faint" />

        {/* Sensor */}
        <g transform="translate(-40 130)">
          <rect x="-8" y="-6" width="16" height="12" rx="1" className="schematic-accent" strokeWidth="1.2" />
          {/* Sensor cone */}
          <path d="M 0 6 L -40 60 L 40 60 Z" fill="rgba(230,48,70,0.10)" stroke="rgba(230,48,70,0.40)" strokeWidth="0.8" strokeDasharray="2 3" />
          <path d="M 0 6 L -30 46 L 30 46 Z" fill="none" stroke="rgba(230,48,70,0.25)" strokeWidth="0.6" strokeDasharray="2 3" />
        </g>
      </g>

      {/* Brake assembly close-up bottom */}
      <g transform="translate(90 300)">
        <rect x="-40" y="-26" width="100" height="52" rx="3" className="schematic-stroke" strokeWidth="1.3" fill="rgba(10,11,16,0.6)" />
        {/* opening */}
        <path d="M 60 -16 L 74 -16 L 74 16 L 60 16" className="schematic-accent" strokeWidth="1.3" fill="none" />
        {/* Shaft inside */}
        <line x1="-30" y1="0" x2="58" y2="0" className="schematic-stroke" strokeWidth="1" />
        {/* Slider */}
        <rect x="18" y="-10" width="22" height="20" className="schematic-accent" strokeWidth="1.2" fill="rgba(230,48,70,0.12)" />
        {/* Guide rail */}
        <line x1="-30" y1="14" x2="58" y2="14" className="schematic-stroke-faint" />
        {/* Motor */}
        <circle cx="-30" cy="0" r="10" className="schematic-stroke" strokeWidth="1" />
        <circle cx="-30" cy="0" r="4" className="schematic-stroke" strokeWidth="0.8" />
        {/* Bumper protruding */}
        <rect x="74" y="-8" width="24" height="16" rx="3" fill="rgba(230,48,70,0.25)" stroke="#E63046" strokeWidth="1.2" />
        <text x="-40" y="40" className="schematic-label">C-07 BUMPER</text>
      </g>

      <text x="384" y="390" textAnchor="end" className="schematic-label" opacity="0.55">R-03 · SENSING CANE</text>
    </svg>
  );
}

/** Large PAS detail schematic — shown on detail page */
export function PASDetailSchematic() {
  return (
    <svg
      className="block h-auto w-full"
      viewBox="0 0 1600 700"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
    >
      <defs>
        <pattern id="pas-det-grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(236,230,216,0.06)" strokeWidth="0.5" />
        </pattern>
        <radialGradient id="pas-det-glow" cx="50%" cy="50%" r="55%">
          <stop offset="0%" stopColor="rgba(230,48,70,0.15)" />
          <stop offset="100%" stopColor="rgba(10,11,16,0)" />
        </radialGradient>
      </defs>
      <rect width="100%" height="100%" fill="#0A0B10" />
      <rect width="100%" height="100%" fill="url(#pas-det-grid)" />
      <rect width="100%" height="100%" fill="url(#pas-det-glow)" />

      {/* Ovine silhouette left */}
      <g transform="translate(160 360)">
        <path
          d="M 0 50 Q -10 30 8 18 Q 22 10 44 18 L 66 14 Q 96 -4 132 10 L 184 4 Q 238 6 282 30 Q 322 40 338 62 L 338 96 Q 320 126 290 134 Q 260 142 200 140 Q 100 146 48 134 Q 18 128 0 106 Z"
          className="schematic-stroke"
          strokeWidth="1.4"
          fill="rgba(10,11,16,0.5)"
        />
        {[60, 100, 240, 290].map((x, i) => (
          <line key={i} x1={x} y1="138" x2={x} y2="190" className="schematic-stroke" strokeWidth="1.1" />
        ))}
        <circle cx="24" cy="28" r="2" fill="#ECE6D8" />
        <path d="M 6 16 Q -6 0 10 -6" className="schematic-stroke" strokeWidth="1" />
        <text x="160" y="208" className="schematic-label">OVINE · 60 KG · VV CONFIG</text>

        {/* Cannulas from neck */}
        <line x1="44" y1="40" x2="-80" y2="-80" className="schematic-accent" strokeWidth="1.6" />
        <line x1="64" y1="42" x2="-30" y2="-80" className="schematic-accent" strokeWidth="1.6" />
        <text x="-110" y="-90" className="schematic-label" fill="#E63046">R-EJ · 20 Fr</text>
        <text x="-52" y="-90" className="schematic-label" fill="#E63046">L-EJ · 20 Fr</text>
      </g>

      {/* Centrifugal pump */}
      <g transform="translate(760 300)">
        <circle r="70" className="schematic-stroke" strokeWidth="1.3" />
        <circle r="50" className="schematic-accent" strokeWidth="1.5" />
        <circle r="20" className="schematic-stroke" strokeWidth="1" />
        {[0, 45, 90, 135, 180, 225, 270, 315].map((d) => (
          <line key={d} x1="0" y1="0" x2="0" y2="-50" transform={`rotate(${d})`} className="schematic-accent" strokeWidth="1" />
        ))}
        <circle r="4" fill="#E63046" />
        <text x="0" y="100" textAnchor="middle" className="schematic-label">CDX PUMP · 3–5 L/MIN</text>
      </g>

      {/* Oxygenator — hollow fiber */}
      <g transform="translate(1180 300)">
        <rect x="-100" y="-80" width="200" height="160" rx="6" className="schematic-stroke" strokeWidth="1.3" />
        {[...Array(14)].map((_, i) => (
          <line key={i} x1={-90 + i * 14} y1="-70" x2={-90 + i * 14} y2="70" className="schematic-stroke" strokeWidth="0.8" />
        ))}
        <line x1="-100" y1="-30" x2="100" y2="-30" className="schematic-accent" strokeWidth="1" strokeDasharray="3 3" />
        <line x1="-100" y1="30" x2="100" y2="30" className="schematic-accent" strokeWidth="1" strokeDasharray="3 3" />
        <text x="0" y="100" textAnchor="middle" className="schematic-label">HOLLOW-FIBER OXYGENATOR</text>
      </g>

      {/* Flow tubing */}
      <path d="M 260 320 C 400 280, 520 260, 680 300" className="schematic-accent" strokeWidth="2.2" fill="none" />
      <path d="M 830 300 C 940 290, 1010 290, 1080 300" className="schematic-accent" strokeWidth="2.2" fill="none" />
      <path d="M 1280 300 C 1380 300, 1420 330, 1420 400 L 1420 540 C 1420 560, 1380 570, 1320 570 L 320 570 C 240 570, 220 540, 240 500" className="schematic-accent" strokeWidth="2.2" fill="none" />

      {/* Flow dots */}
      {[0, 1, 2, 3, 4].map((i) => (
        <circle key={i} cx={380 + i * 80} cy={290 - i * 2} r="3" fill="#E63046" className="flow-dot" style={{ animationDelay: `${i * 0.3}s` }} />
      ))}

      {/* Annotations and timeline strip */}
      <g transform="translate(80 620)">
        <text x="0" y="0" className="schematic-label">STUDY · D0 → D30 · RESISTANCE q2h · ABG / ACT / PT / CBC / pfHb</text>
        <line x1="0" y1="10" x2="1440" y2="10" className="schematic-stroke-faint" />
        {[0, 5, 10, 15, 20, 25, 30].map((d) => (
          <g key={d} transform={`translate(${(d / 30) * 1440} 0)`}>
            <line x1="0" y1="6" x2="0" y2="14" className="schematic-stroke" strokeWidth="0.8" />
            <text x="-6" y="26" className="schematic-label">{`D${d}`}</text>
          </g>
        ))}
      </g>
    </svg>
  );
}

/** Large coagulation detail schematic */
export function CoagDetailSchematic() {
  return (
    <svg
      className="block h-auto w-full"
      viewBox="0 0 1600 700"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
    >
      <defs>
        <pattern id="coag-det-grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(236,230,216,0.06)" strokeWidth="0.5" />
        </pattern>
        <radialGradient id="coag-det-glow" cx="50%" cy="50%" r="55%">
          <stop offset="0%" stopColor="rgba(122,184,232,0.15)" />
          <stop offset="100%" stopColor="rgba(10,11,16,0)" />
        </radialGradient>
      </defs>
      <rect width="100%" height="100%" fill="#0A0B10" />
      <rect width="100%" height="100%" fill="url(#coag-det-grid)" />
      <rect width="100%" height="100%" fill="url(#coag-det-glow)" />

      {/* Intrinsic cascade - left column */}
      <g transform="translate(180 80)" fontFamily="JetBrains Mono, monospace">
        <text x="0" y="-20" className="schematic-label">INTRINSIC · CONTACT PATHWAY</text>
        {[
          { y: 0, label: 'FACTOR XII', accent: false },
          { y: 60, label: 'FXIIa', accent: true },
          { y: 130, label: 'FXI → FXIa', accent: false },
          { y: 200, label: 'FIX → FIXa', accent: false },
        ].map((n, i) => (
          <g key={i} transform={`translate(0 ${n.y})`}>
            <rect x="-90" y="-20" width="180" height="40" rx="3" className={n.accent ? 'schematic-accent' : 'schematic-stroke'} strokeWidth="1.3" fill="rgba(10,11,16,0.7)" />
            <text x="0" y="6" textAnchor="middle" fontSize="12" letterSpacing="0.18em" fill={n.accent ? '#E63046' : 'rgba(236,230,216,0.92)'}>
              {n.label}
            </text>
            {i < 3 && (
              <>
                <line x1="0" y1="20" x2="0" y2="50" className="schematic-stroke" strokeWidth="1.1" />
                <path d="M -5 46 L 0 56 L 5 46" className="schematic-stroke" strokeWidth="1.1" fill="none" />
              </>
            )}
          </g>
        ))}

        {/* FXII900 block symbol on FXIIa */}
        <g transform="translate(140 60)">
          <circle r="26" className="schematic-accent" strokeWidth="1.6" />
          <circle r="18" fill="rgba(230,48,70,0.25)" />
          <line x1="-12" y1="0" x2="12" y2="0" stroke="#E63046" strokeWidth="2.2" />
          <line x1="0" y1="-12" x2="0" y2="12" stroke="#E63046" strokeWidth="2.2" />
          <text x="44" y="4" className="schematic-label" fill="#E63046">FXII900-PCB</text>
        </g>
      </g>

      {/* Extrinsic - right column */}
      <g transform="translate(800 80)" fontFamily="JetBrains Mono, monospace">
        <text x="0" y="-20" className="schematic-label">EXTRINSIC · TISSUE FACTOR</text>
        {[
          { y: 0, label: 'TISSUE FACTOR' },
          { y: 60, label: 'FVII → FVIIa' },
          { y: 130, label: 'COMMON PATH' },
        ].map((n, i) => (
          <g key={i} transform={`translate(0 ${n.y})`}>
            <rect x="-90" y="-20" width="180" height="40" rx="3" className="schematic-stroke" strokeWidth="1.2" fill="rgba(10,11,16,0.7)" />
            <text x="0" y="6" textAnchor="middle" fontSize="12" letterSpacing="0.18em" fill="rgba(236,230,216,0.9)">
              {n.label}
            </text>
            {i < 2 && (
              <>
                <line x1="0" y1="20" x2="0" y2="50" className="schematic-stroke" strokeWidth="1.1" />
                <path d="M -5 46 L 0 56 L 5 46" className="schematic-stroke" strokeWidth="1.1" fill="none" />
              </>
            )}
          </g>
        ))}
      </g>

      {/* Shared convergence */}
      <g transform="translate(480 400)" fontFamily="JetBrains Mono, monospace">
        <rect x="-120" y="-24" width="240" height="48" rx="4" className="schematic-accent" strokeWidth="1.5" fill="rgba(10,11,16,0.7)" />
        <text x="0" y="6" textAnchor="middle" fontSize="13" letterSpacing="0.18em" fill="#E63046">FACTOR Xa → THROMBIN</text>
      </g>

      <path d="M 180 360 C 280 380, 380 380, 480 392" className="schematic-stroke" strokeWidth="1.3" fill="none" />
      <path d="M 800 330 C 680 360, 560 380, 480 388" className="schematic-stroke" strokeWidth="1.3" fill="none" />
      <path d="M 480 424 L 480 500" className="schematic-accent" strokeWidth="1.5" />

      {/* Fibrin result */}
      <g transform="translate(480 540)" fontFamily="JetBrains Mono, monospace">
        <rect x="-90" y="-18" width="180" height="36" rx="3" className="schematic-stroke" strokeWidth="1.2" fill="rgba(10,11,16,0.7)" />
        <text x="0" y="5" textAnchor="middle" fontSize="12" letterSpacing="0.18em" fill="rgba(236,230,216,0.9)">FIBRIN · CLOT</text>
      </g>

      {/* Hollow fiber surface — background motif on right */}
      <g transform="translate(1300 120)" opacity="0.6">
        <text x="0" y="-16" className="schematic-label">HOLLOW-FIBER SURFACE</text>
        {[...Array(24)].map((_, i) => (
          <line key={i} x1={i * 8} y1="0" x2={i * 8} y2="360" className="schematic-stroke" strokeWidth="0.7" />
        ))}
        <rect x="0" y="150" width="200" height="60" fill="rgba(230,48,70,0.08)" stroke="rgba(230,48,70,0.4)" strokeWidth="0.8" strokeDasharray="3 3" />
        <text x="0" y="380" className="schematic-label" fill="#E63046">FXII900-PCB COATING</text>
      </g>
    </svg>
  );
}

/** Large cane detail schematic — exploded view */
export function CaneDetailSchematic() {
  return (
    <svg
      className="block h-auto w-full"
      viewBox="0 0 1600 720"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
    >
      <defs>
        <pattern id="cane-det-grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(236,230,216,0.06)" strokeWidth="0.5" />
        </pattern>
        <radialGradient id="cane-det-glow" cx="50%" cy="50%" r="55%">
          <stop offset="0%" stopColor="rgba(230,48,70,0.14)" />
          <stop offset="100%" stopColor="rgba(10,11,16,0)" />
        </radialGradient>
      </defs>
      <rect width="100%" height="100%" fill="#0A0B10" />
      <rect width="100%" height="100%" fill="url(#cane-det-grid)" />
      <rect width="100%" height="100%" fill="url(#cane-det-glow)" />

      {/* Full cane profile left */}
      <g transform="translate(240 80)">
        {/* Handle */}
        <path
          d="M -20 0 Q -10 -28 20 -28 L 60 -28 Q 80 -28 80 -10 L 80 8 L 0 20 Z"
          className="schematic-stroke"
          strokeWidth="1.4"
          fill="rgba(10,11,16,0.6)"
        />
        <circle cx="28" cy="-4" r="4" fill="#E63046" />
        <circle cx="28" cy="-4" r="10" className="schematic-accent" strokeWidth="1" />
        <text x="96" y="-4" className="schematic-label" fill="#E63046">C-03 · VIBRATION MOTOR</text>
        {/* Shaft */}
        <rect x="-2" y="20" width="18" height="420" className="schematic-stroke" strokeWidth="1.4" fill="rgba(10,11,16,0.6)" />
        {/* Shaft bolts */}
        {[60, 140, 220, 300, 380].map((y) => (
          <circle key={y} cx="7" cy={y} r="2" className="schematic-stroke-faint" />
        ))}
        {/* Ultrasonic sensor */}
        <g transform="translate(7 220)">
          <rect x="-16" y="-10" width="44" height="20" rx="2" className="schematic-accent" strokeWidth="1.3" />
          <circle cx="-4" cy="0" r="3" fill="#E63046" />
          <circle cx="8" cy="0" r="3" fill="#E63046" />
          <text x="38" y="4" className="schematic-label" fill="#E63046">C-02 · ULTRASONIC</text>
          {/* cone */}
          <path d="M 28 -8 L 160 -60 L 160 -100 Z" fill="rgba(230,48,70,0.08)" stroke="rgba(230,48,70,0.4)" strokeWidth="0.8" strokeDasharray="3 3" />
          <path d="M 28 8 L 160 60 L 160 100 Z" fill="rgba(230,48,70,0.08)" stroke="rgba(230,48,70,0.4)" strokeWidth="0.8" strokeDasharray="3 3" />
          <text x="170" y="0" className="schematic-label">DETECTION CONE</text>
        </g>

        {/* Brake housing at base */}
        <rect x="-14" y="430" width="44" height="56" rx="3" className="schematic-stroke" strokeWidth="1.4" fill="rgba(10,11,16,0.6)" />
        <path d="M 30 446 L 50 446 L 50 470 L 30 470" className="schematic-accent" strokeWidth="1.4" fill="none" />
        <rect x="50" y="450" width="24" height="16" rx="3" fill="rgba(230,48,70,0.25)" stroke="#E63046" strokeWidth="1.3" />

        {/* Rubber tip */}
        <path d="M -2 486 L 16 486 L 10 500 L 4 500 Z" fill="rgba(236,230,216,0.15)" stroke="rgba(236,230,216,0.5)" strokeWidth="1" />
        <text x="96" y="460" className="schematic-label" fill="#E63046">C-07 · RUBBER BUMPER</text>
        <text x="96" y="478" className="schematic-label">C-04 · HOUSING</text>
      </g>

      {/* Brake assembly exploded — right */}
      <g transform="translate(900 340)">
        <text x="0" y="-220" className="schematic-label">C-05 + C-06 · BRAKE ASSEMBLY · EXPLODED VIEW</text>

        {/* Housing box */}
        <rect x="-280" y="-140" width="560" height="220" rx="6" className="schematic-stroke" strokeWidth="1.5" fill="rgba(10,11,16,0.5)" />
        <path d="M 280 -100 L 360 -100 L 360 60 L 280 60" className="schematic-accent" strokeWidth="1.5" fill="none" />

        {/* Motor */}
        <g transform="translate(-220 -20)">
          <circle r="32" className="schematic-stroke" strokeWidth="1.4" />
          <circle r="18" className="schematic-stroke" strokeWidth="1" />
          <circle r="4" fill="#E63046" />
          {[0, 60, 120, 180, 240, 300].map((d) => (
            <line key={d} x1="0" y1="0" x2="16" y2="0" transform={`rotate(${d})`} className="schematic-stroke" strokeWidth="0.8" />
          ))}
          <text x="0" y="58" textAnchor="middle" className="schematic-label">MOTOR</text>
        </g>

        {/* Gear */}
        <g transform="translate(-120 -20)">
          <circle r="22" className="schematic-accent" strokeWidth="1.3" />
          {[...Array(16)].map((_, i) => {
            const a = (i * 22.5 * Math.PI) / 180;
            const x1 = Math.cos(a) * 22;
            const y1 = Math.sin(a) * 22;
            const x2 = Math.cos(a) * 28;
            const y2 = Math.sin(a) * 28;
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} className="schematic-accent" strokeWidth="1" />;
          })}
          <circle r="4" fill="#E63046" />
          <text x="0" y="56" textAnchor="middle" className="schematic-label">GEAR</text>
        </g>

        {/* Shaft */}
        <line x1="-100" y1="-20" x2="220" y2="-20" className="schematic-stroke" strokeWidth="2" />
        <line x1="-100" y1="-20" x2="220" y2="-20" stroke="#ECE6D8" strokeWidth="0.4" strokeDasharray="3 3" opacity="0.35" />
        <text x="50" y="-30" textAnchor="middle" className="schematic-label">THREADED SHAFT</text>

        {/* Slider */}
        <rect x="40" y="-40" width="80" height="40" rx="2" className="schematic-accent" strokeWidth="1.4" fill="rgba(230,48,70,0.12)" />
        <text x="80" y="22" textAnchor="middle" className="schematic-label" fill="#E63046">SLIDER CARRIER</text>

        {/* Guide rail */}
        <line x1="-100" y1="20" x2="220" y2="20" className="schematic-stroke" strokeWidth="1.4" />
        <text x="60" y="40" textAnchor="middle" className="schematic-label">GUIDE RAIL</text>

        {/* Bumper extending through opening */}
        <rect x="260" y="-18" width="90" height="36" rx="4" fill="rgba(230,48,70,0.22)" stroke="#E63046" strokeWidth="1.4" />
        <text x="310" y="50" textAnchor="middle" className="schematic-label" fill="#E63046">BUMPER · EXT</text>
      </g>

      {/* Corner framing */}
      <g stroke="rgba(236,230,216,0.3)" fill="none" strokeWidth="1">
        <path d="M 40 40 L 80 40 M 40 40 L 40 80" />
        <path d="M 1560 40 L 1520 40 M 1560 40 L 1560 80" />
        <path d="M 40 680 L 80 680 M 40 680 L 40 640" />
        <path d="M 1560 680 L 1520 680 M 1560 680 L 1560 640" />
      </g>
    </svg>
  );
}

/** CV detail schematic — simple ruler + data grid */
export function CVSchematic() {
  return (
    <svg
      className="block h-auto w-full"
      viewBox="0 0 1600 400"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
    >
      <defs>
        <pattern id="cv-grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(236,230,216,0.05)" strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="#0A0B10" />
      <rect width="100%" height="100%" fill="url(#cv-grid)" />

      <g transform="translate(80 60)">
        <line x1="0" y1="0" x2="1440" y2="0" className="schematic-stroke" strokeWidth="0.8" />
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
          <g key={i}>
            <line x1={i * 144} y1="0" x2={i * 144} y2={i % 2 === 0 ? 10 : 5} className="schematic-stroke-faint" />
            <text x={i * 144} y="24" className="schematic-label">{(i * 0.1).toFixed(1)}</text>
          </g>
        ))}
      </g>

      <g transform="translate(80 120)">
        <line x1="0" y1="0" x2="1440" y2="0" className="schematic-accent" strokeWidth="1.2" />
      </g>

      <g transform="translate(80 200)">
        {[...Array(12)].map((_, i) => (
          <rect key={i} x={i * 120} y="0" width="100" height="20" className="schematic-stroke-faint" />
        ))}
      </g>

      <g transform="translate(1440 340)" opacity="0.14">
        <text x="0" y="0" textAnchor="end" fontFamily="Anton, sans-serif" fontSize="160" fill="#ECE6D8">
          CV
        </text>
      </g>
    </svg>
  );
}

/** Large contact/CTA schematic — kept blueprint motif */
export function CTASchematic() {
  return (
    <svg
      className="block h-auto w-full"
      viewBox="0 0 1600 900"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
    >
      <defs>
        <pattern id="cta-grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(236,230,216,0.08)" strokeWidth="0.5" />
        </pattern>
        <pattern id="cta-dots" width="8" height="8" patternUnits="userSpaceOnUse">
          <circle cx="0.5" cy="0.5" r="0.5" fill="rgba(236,230,216,0.1)" />
        </pattern>
        <radialGradient id="cta-pulse" cx="50%" cy="50%" r="45%">
          <stop offset="0%" stopColor="rgba(230,48,70,0.18)" />
          <stop offset="100%" stopColor="rgba(10,11,16,0)" />
        </radialGradient>
      </defs>

      <rect width="100%" height="100%" fill="#0A0B10" />
      <rect width="100%" height="100%" fill="url(#cta-dots)" />
      <rect width="100%" height="100%" fill="url(#cta-grid)" />
      <rect width="100%" height="100%" fill="url(#cta-pulse)" />

      <g transform="translate(800 460)">
        <rect x="-260" y="-160" width="520" height="320" rx="12" className="schematic-stroke" strokeWidth="1.5" />
        <rect x="-240" y="-140" width="480" height="280" rx="6" className="schematic-stroke-faint" />

        <g transform="translate(-130 0)">
          <circle r="80" className="schematic-stroke" strokeWidth="1.3" />
          <circle r="55" className="schematic-accent" strokeWidth="1.5" />
          <circle r="30" className="schematic-stroke" strokeWidth="1" />
          {[0, 60, 120, 180, 240, 300].map((deg) => (
            <line key={deg} x1="0" y1="0" x2="55" y2="0" transform={`rotate(${deg})`} className="schematic-accent" strokeWidth="1" />
          ))}
          <circle r="6" fill="#E63046" />
        </g>

        <g transform="translate(130 0)">
          <circle r="80" className="schematic-stroke" strokeWidth="1.3" />
          <path d="M -60 -30 Q -30 -50 0 -40 Q 30 -50 60 -30 Q 50 0 60 30 Q 30 50 0 40 Q -30 50 -60 30 Q -50 0 -60 -30 Z" className="schematic-accent" strokeWidth="1.4" />
          <circle cx="-20" cy="0" r="4" fill="#E63046" />
          <circle cx="20" cy="0" r="4" fill="#E63046" />
        </g>

        <line x1="-55" y1="0" x2="55" y2="0" className="schematic-accent" strokeWidth="2" />
        {[0, 1, 2].map((i) => (
          <circle key={i} cx={-40 + i * 40} cy={0} r="3" fill="#E63046" className="flow-dot" style={{ animationDelay: `${i * 0.4}s` }} />
        ))}

        <g>
          <line x1="-130" y1="-80" x2="-200" y2="-200" className="schematic-stroke-faint" />
          <line x1="-200" y1="-200" x2="-380" y2="-200" className="schematic-stroke-faint" />
          <text x="-440" y="-210" className="schematic-label">B-01 · ACTUATOR</text>
          <text x="-440" y="-194" className="schematic-label" fill="rgba(236,230,216,0.35)">CENTRIFUGAL PUMP</text>
          <circle cx="-200" cy="-200" r="2" fill="rgba(236,230,216,0.55)" />
        </g>

        <g>
          <line x1="130" y1="-80" x2="200" y2="-200" className="schematic-stroke-faint" />
          <line x1="200" y1="-200" x2="380" y2="-200" className="schematic-stroke-faint" />
          <text x="220" y="-210" className="schematic-label">B-02 · OXYGENATOR</text>
          <text x="220" y="-194" className="schematic-label" fill="rgba(236,230,216,0.35)">HOLLOW FIBER MEMBRANE</text>
          <circle cx="200" cy="-200" r="2" fill="rgba(236,230,216,0.55)" />
        </g>

        <g>
          <line x1="-130" y1="80" x2="-200" y2="200" className="schematic-stroke-faint" />
          <line x1="-200" y1="200" x2="-380" y2="200" className="schematic-stroke-faint" />
          <text x="-440" y="206" className="schematic-label">B-03 · BLOOD INLET</text>
          <text x="-440" y="222" className="schematic-label" fill="rgba(236,230,216,0.35)">ANTICOAGULATED</text>
          <circle cx="-200" cy="200" r="2" fill="rgba(236,230,216,0.55)" />
        </g>

        <g>
          <line x1="130" y1="80" x2="200" y2="200" className="schematic-stroke-faint" />
          <line x1="200" y1="200" x2="380" y2="200" className="schematic-stroke-faint" />
          <text x="220" y="206" className="schematic-label">B-04 · OUTLET</text>
          <text x="220" y="222" className="schematic-label" fill="rgba(236,230,216,0.35)">OXYGENATED FLOW</text>
          <circle cx="200" cy="200" r="2" fill="rgba(236,230,216,0.55)" />
        </g>

        <line x1="-260" y1="200" x2="260" y2="200" className="schematic-stroke-faint" />
        {[-260, -130, 0, 130, 260].map((x) => (
          <g key={x}>
            <line x1={x} y1={195} x2={x} y2={205} className="schematic-stroke-faint" />
          </g>
        ))}
        <text x="-20" y="246" className="schematic-label">320 MM</text>
      </g>

      <g stroke="rgba(236,230,216,0.3)" fill="none" strokeWidth="1">
        <path d="M 40 40 L 80 40 M 40 40 L 40 80" />
        <path d="M 1560 40 L 1520 40 M 1560 40 L 1560 80" />
        <path d="M 40 860 L 80 860 M 40 860 L 40 820" />
        <path d="M 1560 860 L 1520 860 M 1560 860 L 1560 820" />
      </g>

      <g transform="translate(40 30)">
        {[...Array(20)].map((_, i) => (
          <line key={i} x1={i * 80} y1="0" x2={i * 80} y2={i % 5 === 0 ? 10 : 5} className="schematic-stroke-faint" />
        ))}
      </g>
    </svg>
  );
}
