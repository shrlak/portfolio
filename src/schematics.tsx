/* ----------------------------------------------------------------------------
 * SVG SCHEMATICS — medical-device blueprint illustrations
 * Each schematic is purely decorative (aria-hidden) and is paired with
 * readable text elsewhere in the layout.
 *
 * Animation primitives used:
 *  – <animate>          attribute morphing (r, opacity, dashoffset)
 *  – <animateTransform> rotate, translate
 *  – <animateMotion>    particles following a path via <mpath href="#id"/>
 *  – tailwind animate-* CSS keyframes (pulse-slow, breathe, spin-slower)
 * -------------------------------------------------------------------------- */

/** Build a repeating ECG (P-QRS-T) waveform path string. */
function buildEcg(cycles: number, cycleW: number, baseY: number): string {
  // [dx-from-cycle-start, dy-from-baseline]
  const seg: Array<[number, number]> = [
    [0, 0], [76, 0],
    [84, -7], [93, -19], [102, -7], [112, 0],   // P wave
    [120, 0],
    [125, 8], [130, -48], [135, 11], [142, 0],   // QRS complex
    [162, 0],
    [178, -11], [196, -15], [214, -11], [226, 0], // T wave
    [cycleW, 0],
  ];
  const cmds: string[] = [];
  for (let i = 0; i < cycles; i++) {
    seg.forEach(([dx, dy], j) => {
      const x = dx + i * cycleW;
      const y = baseY + dy;
      cmds.push(i === 0 && j === 0 ? `M ${x} ${y}` : `L ${x} ${y}`);
    });
  }
  return cmds.join(' ');
}

/* ────────────────────────────────────────────────────────────────────────── */
/*  HERO — anatomical heart with scrolling ECG, telemetry, radar pings        */
/* ────────────────────────────────────────────────────────────────────────── */
export function HeroSchematic() {
  // 10 cycles × 288 = 2880 wide; clip shows 1440; animate -1440 = seamless loop
  const ecgPath = buildEcg(10, 288, 790);
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
        <pattern id="hero-grid-fine" width="12" height="12" patternUnits="userSpaceOnUse">
          <path d="M 12 0 L 0 0 0 12" fill="none" stroke="rgba(236,230,216,0.025)" strokeWidth="0.4" />
        </pattern>
        <radialGradient id="hero-glow" cx="75%" cy="50%" r="45%">
          <stop offset="0%" stopColor="rgba(230,48,70,0.20)" />
          <stop offset="60%" stopColor="rgba(230,48,70,0.04)" />
          <stop offset="100%" stopColor="rgba(10,11,16,0)" />
        </radialGradient>
        <linearGradient id="hero-vignette" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(10,11,16,0.30)" />
          <stop offset="55%" stopColor="rgba(10,11,16,0)" />
          <stop offset="100%" stopColor="rgba(10,11,16,0.95)" />
        </linearGradient>
        <clipPath id="hero-ecg-clip">
          <rect x="0" y="740" width="1440" height="100" />
        </clipPath>
      </defs>

      <rect width="100%" height="100%" fill="#0A0B10" />
      <rect width="100%" height="100%" fill="url(#hero-grid-fine)" />
      <rect width="100%" height="100%" fill="url(#hero-grid)" />
      <rect width="100%" height="100%" fill="url(#hero-glow)" />

      {/* Background circuit traces — top-left */}
      <g opacity="0.16">
        {[120, 240, 360, 480].map((y) => (
          <line key={y} x1="0" y1={y} x2="560" y2={y} stroke="#ECE6D8" strokeWidth="0.4" strokeDasharray="2 6" />
        ))}
        {[120, 220, 320, 420].map((x) => (
          <line key={x} x1={x} y1="80" x2={x} y2="540" stroke="#ECE6D8" strokeWidth="0.4" strokeDasharray="2 6" />
        ))}
        {[[120, 120], [220, 240], [320, 360], [420, 240], [120, 360]].map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r="2" fill="#ECE6D8" />
        ))}
      </g>

      {/* Heart assembly (right) */}
      <g transform="translate(1080 460)">
        <g className="animate-spin-slower" style={{ transformOrigin: '0 0' }}>
          <circle r="380" className="schematic-stroke-faint" strokeDasharray="2 7" />
          <circle r="320" className="schematic-stroke-faint" />
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => {
            const r = (deg * Math.PI) / 180;
            const x1 = Math.cos(r) * 314, y1 = Math.sin(r) * 314;
            const x2 = Math.cos(r) * 322, y2 = Math.sin(r) * 322;
            return (
              <line
                key={deg}
                x1={x1} y1={y1} x2={x2} y2={y2}
                className="schematic-stroke"
                strokeWidth={deg % 90 === 0 ? 1.5 : 0.6}
              />
            );
          })}
        </g>

        <circle r="260" className="schematic-stroke-faint" strokeDasharray="1 3" />
        <circle r="210" className="schematic-stroke-faint" />

        {/* Radar heartbeat pings */}
        {[0, 0.8, 1.6].map((delay, i) => (
          <circle key={i} cx="0" cy="0" r="0" fill="none" stroke="#E63046" strokeWidth={1.4 - i * 0.3}>
            <animate attributeName="r" from="0" to="180" dur="2.4s" begin={`${delay}s`} repeatCount="indefinite" />
            <animate attributeName="opacity" from="0.7" to="0" dur="2.4s" begin={`${delay}s`} repeatCount="indefinite" />
          </circle>
        ))}

        {/* Heart anatomy */}
        <g className="animate-pulse-slow" style={{ transformOrigin: '0 0' }}>
          {/* Heart outer wall — glowing fill */}
          <path
            d="M 0 120 C -130 80, -175 -30, -100 -80 C -55 -108, -18 -90, 0 -48 C 18 -90, 55 -108, 100 -80 C 175 -30, 130 80, 0 120 Z"
            className="schematic-accent"
            strokeWidth="1.8"
            fill="rgba(230,48,70,0.05)"
          >
            <animate attributeName="fill" values="rgba(230,48,70,0.03);rgba(230,48,70,0.10);rgba(230,48,70,0.03)" dur="1.4s" repeatCount="indefinite" />
          </path>
          {/* Inner septa */}
          <line x1="0" y1="-48" x2="0" y2="110" className="schematic-stroke-faint" strokeDasharray="3 4" />
          <path d="M -90 -10 Q 0 -30 90 -10" className="schematic-stroke-faint" strokeDasharray="2 3" />
          <path d="M -80 -10 Q -110 30 -95 70 Q -60 100 -8 110" className="schematic-stroke-faint" />
          <path d="M 80 -10 Q 110 30 95 70 Q 60 100 8 110" className="schematic-stroke-faint" />
          {/* Great vessels */}
          <path d="M -22 -75 Q -22 -145 -65 -175 Q -115 -195 -135 -165" className="schematic-stroke" strokeWidth="1.3" />
          <path d="M 22 -75 Q 32 -145 72 -165 Q 105 -180 134 -155" className="schematic-stroke" strokeWidth="1.3" />
          <path d="M 0 -48 Q -30 -20 -55 10 Q -80 40 -70 80" className="schematic-stroke-faint" strokeDasharray="2 4" />
          {/* Valve dots — pulsing */}
          <circle cx="-30" cy="-12" r="3.5" fill="#E63046">
            <animate attributeName="r" values="3;5;3" dur="1.4s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.6;1;0.6" dur="1.4s" repeatCount="indefinite" />
          </circle>
          <circle cx="30" cy="-12" r="3.5" fill="#E63046">
            <animate attributeName="r" values="3;5;3" dur="1.4s" begin="0.15s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.6;1;0.6" dur="1.4s" begin="0.15s" repeatCount="indefinite" />
          </circle>
          <circle cx="0" cy="50" r="2.5" fill="#E63046">
            <animate attributeName="r" values="2;4;2" dur="1.4s" begin="0.3s" repeatCount="indefinite" />
          </circle>
        </g>

        {/* Blood flow particles — circulating through aorta path */}
        {[0, 0.5, 1.0, 1.5, 2.0].map((delay, i) => (
          <circle key={`blood-${i}`} r="2.5" fill="#E63046" opacity="0">
            <animate attributeName="cx" values="-22,-22,-65,-135" dur="2.8s" begin={`${delay}s`} repeatCount="indefinite" />
            <animate attributeName="cy" values="-75,-145,-175,-165" dur="2.8s" begin={`${delay}s`} repeatCount="indefinite" />
            <animate attributeName="opacity" values="0;0.8;0.8;0" dur="2.8s" begin={`${delay}s`} repeatCount="indefinite" />
          </circle>
        ))}

        {/* Callout leaders */}
        <g>
          <line x1="-95" y1="-175" x2="-200" y2="-230" className="schematic-stroke-faint" />
          <line x1="-200" y1="-230" x2="-380" y2="-230" className="schematic-stroke-faint" />
          <text x="-388" y="-238" textAnchor="end" className="schematic-label">A-01 · AORTA</text>
          <circle cx="-200" cy="-230" r="2" fill="rgba(236,230,216,0.5)" />

          <line x1="95" y1="-160" x2="220" y2="-210" className="schematic-stroke-faint" />
          <line x1="220" y1="-210" x2="380" y2="-210" className="schematic-stroke-faint" />
          <text x="388" y="-218" className="schematic-label">A-02 · PULMONARY ARTERY</text>
          <circle cx="220" cy="-210" r="2" fill="rgba(236,230,216,0.5)" />

          <line x1="-155" y1="40" x2="-260" y2="100" className="schematic-stroke-faint" />
          <line x1="-260" y1="100" x2="-400" y2="100" className="schematic-stroke-faint" />
          <text x="-408" y="108" textAnchor="end" className="schematic-label">A-03 · VENA CAVA</text>
          <circle cx="-260" cy="100" r="2" fill="rgba(236,230,216,0.5)" />

          <line x1="115" y1="55" x2="240" y2="100" className="schematic-stroke-faint" />
          <line x1="240" y1="100" x2="400" y2="100" className="schematic-stroke-faint" />
          <text x="408" y="108" className="schematic-label">A-04 · VALVE ASSEMBLY</text>
          <circle cx="240" cy="100" r="2" fill="rgba(236,230,216,0.5)" />
        </g>
      </g>

      {/* Telemetry column (left) */}
      <g transform="translate(96 200)">
        <line x1="0" y1="-12" x2="0" y2="360" className="schematic-stroke-faint" />
        <text x="14" y="-18" className="schematic-label">TELEMETRY · LIVE</text>
        {[
          { y: 0, label: 'HR', value: '72 BPM', accent: true },
          { y: 80, label: 'SpO₂', value: '98 %', accent: false },
          { y: 160, label: 'BP', value: '120 / 80', accent: false },
          { y: 240, label: 'TEMP', value: '38.2 °C', accent: false },
          { y: 320, label: 'FLOW', value: '4.2 L/MIN', accent: true },
        ].map((row) => (
          <g key={row.label} transform={`translate(0 ${row.y})`}>
            <line x1="-4" y1="0" x2="4" y2="0" className="schematic-stroke" strokeWidth="0.8" />
            <text x="14" y="3" className="schematic-label" fill={row.accent ? '#E63046' : 'rgba(236,230,216,0.55)'}>
              {row.label}
            </text>
            <text x="170" y="3" textAnchor="end" className="schematic-label" fill={row.accent ? '#E63046' : 'rgba(236,230,216,0.85)'}>
              {row.value}
            </text>
            {row.accent && (
              <circle cx="-4" cy="0" r="1.5" fill="#E63046">
                <animate attributeName="opacity" values="0.2;1;0.2" dur="1.5s" repeatCount="indefinite" />
              </circle>
            )}
          </g>
        ))}
      </g>

      {/* Scrolling ECG */}
      <g clipPath="url(#hero-ecg-clip)">
        <line x1="0" y1="790" x2="1440" y2="790" stroke="rgba(236,230,216,0.08)" strokeWidth="0.5" />
        <g>
          <animateTransform
            attributeName="transform"
            type="translate"
            from="0,0"
            to="-1440,0"
            dur="4.8s"
            repeatCount="indefinite"
          />
          {/* Glow trail — faint wider copy behind main line */}
          <path d={ecgPath} stroke="#E63046" strokeWidth="6" fill="none" opacity="0.08" strokeLinejoin="round" strokeLinecap="round" />
          <path d={ecgPath} stroke="#E63046" strokeWidth="1.4" fill="none" opacity="0.92" strokeLinejoin="round" strokeLinecap="round" />
        </g>
      </g>

      <g opacity="0.55">
        <text x="80" y="772" className="schematic-label">ECG · LEAD II · 25 MM/S</text>
        <text x="1360" y="772" textAnchor="end" className="schematic-label" fill="#E63046">SINUS · 72 BPM</text>
      </g>

      {/* Animated scanning crosshair — sweeps slowly across viewport */}
      <g opacity="0.12">
        <line x1="0" y1="0" x2="0" y2="900" stroke="#E63046" strokeWidth="0.5">
          <animate attributeName="x1" values="0;1440;0" dur="18s" repeatCount="indefinite" />
          <animate attributeName="x2" values="0;1440;0" dur="18s" repeatCount="indefinite" />
        </line>
        <line x1="0" y1="0" x2="1440" y2="0" stroke="#E63046" strokeWidth="0.5">
          <animate attributeName="y1" values="0;900;0" dur="14s" repeatCount="indefinite" />
          <animate attributeName="y2" values="0;900;0" dur="14s" repeatCount="indefinite" />
        </line>
      </g>

      <rect width="100%" height="100%" fill="url(#hero-vignette)" />
    </svg>
  );
}

/* ────────────────────────────────────────────────────────────────────────── */
/*  ABOUT — bronchial tree with breathing animation, O₂ gauge with needle     */
/* ────────────────────────────────────────────────────────────────────────── */
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
          <stop offset="0%" stopColor="rgba(122,184,232,0.16)" />
          <stop offset="60%" stopColor="rgba(122,184,232,0.02)" />
          <stop offset="100%" stopColor="rgba(10,11,16,0)" />
        </radialGradient>
      </defs>

      <rect width="100%" height="100%" fill="#0A0B10" />
      <rect width="100%" height="100%" fill="url(#about-grid)" />
      <rect width="100%" height="100%" fill="url(#about-glow)" />

      {/* Bronchial tree with breathing scale */}
      <g transform="translate(1060 500)">
        <g>
          <animateTransform
            attributeName="transform"
            type="scale"
            values="1;1.04;1"
            dur="4.2s"
            repeatCount="indefinite"
          />
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

          {/* Alveolar sacs */}
          {[
            [-260, 240], [-190, 260], [-160, 290],
            [260, 240], [190, 260], [160, 290],
          ].map(([x, y], i) => (
            <g key={i} transform={`translate(${x} ${y})`}>
              <circle r="14" className="schematic-stroke-faint" />
              <circle r="8" className="schematic-stroke-faint" />
              <circle r="3" fill="#E63046" opacity="0.6">
                <animate
                  attributeName="r"
                  values="3;5;3"
                  dur="4.2s"
                  begin={`${i * 0.15}s`}
                  repeatCount="indefinite"
                />
              </circle>
            </g>
          ))}
        </g>

        {/* Trachea cuff */}
        <g transform="translate(0 -220)">
          <rect x="-24" y="-40" width="48" height="30" rx="2" className="schematic-accent" strokeWidth="1.3" />
          <line x1="0" y1="-40" x2="0" y2="-70" className="schematic-accent" strokeWidth="1.3" />
        </g>
      </g>

      {/* O₂ gauge with rotating needle */}
      <g transform="translate(240 640)">
        <circle r="78" className="schematic-stroke-faint" />
        <circle r="56" className="schematic-stroke-faint" />
        {/* Tick ring */}
        {[...Array(24)].map((_, i) => {
          const angle = (i * 15 * Math.PI) / 180;
          const x1 = Math.cos(angle) * 70, y1 = Math.sin(angle) * 70;
          const x2 = Math.cos(angle) * 78, y2 = Math.sin(angle) * 78;
          return (
            <line
              key={i}
              x1={x1} y1={y1} x2={x2} y2={y2}
              className="schematic-stroke"
              strokeWidth={i % 6 === 0 ? 1.3 : 0.5}
            />
          );
        })}
        {/* Animated needle */}
        <g>
          <animateTransform
            attributeName="transform"
            type="rotate"
            values="-110;-50;-110"
            dur="6s"
            keyTimes="0;0.5;1"
            calcMode="spline"
            keySplines="0.4 0 0.6 1; 0.4 0 0.6 1"
            repeatCount="indefinite"
          />
          <line x1="0" y1="0" x2="55" y2="0" className="schematic-accent" strokeWidth="1.6" />
          <circle cx="55" cy="0" r="3" fill="#E63046" />
        </g>
        <circle r="4" fill="#E63046" />
        <text x="-30" y="106" className="schematic-label">PO₂ · 98 %</text>
      </g>

      {/* Inhale/exhale label with animated breathing indicator */}
      <g transform="translate(700 320)" opacity="0.5">
        <text className="schematic-label">RESP · 14 / MIN</text>
        <text y="14" className="schematic-label">VT · 480 ML</text>
        <circle cx="140" cy="7" r="3" fill="#7AB8E8">
          <animate attributeName="r" values="2;5;2" dur="4.2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.3;1;0.3" dur="4.2s" repeatCount="indefinite" />
        </circle>
        <text x="150" y="10" className="schematic-label" fill="#7AB8E8">INHALE</text>
      </g>

      {/* O₂ particles flowing down the trachea */}
      {[0, 0.7, 1.4, 2.1, 2.8].map((delay, i) => (
        <circle key={`o2-${i}`} r="2" fill="rgba(122,184,232,0.7)" opacity="0">
          <animate attributeName="cx" values="1060;1060;1060" dur="4.2s" begin={`${delay}s`} repeatCount="indefinite" />
          <animate attributeName="cy" values="280;420;560" dur="4.2s" begin={`${delay}s`} repeatCount="indefinite" />
          <animate attributeName="opacity" values="0;0.8;0" dur="4.2s" begin={`${delay}s`} repeatCount="indefinite" />
          <animate attributeName="r" values="2;3;1" dur="4.2s" begin={`${delay}s`} repeatCount="indefinite" />
        </circle>
      ))}
    </svg>
  );
}

/* ────────────────────────────────────────────────────────────────────────── */
/*  CREDENTIALS — tartan / diploma motif with sweeping scan-line              */
/* ────────────────────────────────────────────────────────────────────────── */
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
        <linearGradient id="cred-scan" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="rgba(230,48,70,0)" />
          <stop offset="35%" stopColor="rgba(230,48,70,0.5)" />
          <stop offset="65%" stopColor="rgba(230,48,70,0.5)" />
          <stop offset="100%" stopColor="rgba(230,48,70,0)" />
        </linearGradient>
      </defs>

      <rect width="100%" height="100%" fill="#0A0B10" />
      <rect width="100%" height="100%" fill="url(#cred-grid)" />
      <rect width="100%" height="100%" fill="url(#cred-fade)" />

      <g transform="translate(80 80)">
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <line key={i} x1="0" y1={i * 60} x2="1280" y2={i * 60} className="schematic-stroke-faint" />
        ))}
        <line x1="200" y1="0" x2="200" y2="420" className="schematic-stroke-faint" strokeDasharray="3 6" />
        <line x1="520" y1="0" x2="520" y2="420" className="schematic-stroke-faint" strokeDasharray="3 6" />
        <line x1="920" y1="0" x2="920" y2="420" className="schematic-stroke-faint" strokeDasharray="3 6" />
        <rect x="0" y="180" width="1280" height="60" fill="rgba(230,48,70,0.05)" />
        <line x1="0" y1="180" x2="1280" y2="180" className="schematic-accent" strokeWidth="0.75" />
        <line x1="0" y1="240" x2="1280" y2="240" className="schematic-accent" strokeWidth="0.75" />

        {/* Sweeping scan-line on the accent band */}
        <rect x="-300" y="180" width="300" height="60" fill="url(#cred-scan)">
          <animate attributeName="x" from="-300" to="1280" dur="5s" repeatCount="indefinite" />
        </rect>

        {/* Annotation tick marks on top edge */}
        {[0, 200, 520, 920, 1280].map((x, i) => (
          <g key={i} transform={`translate(${x} -8)`}>
            <line x1="0" y1="0" x2="0" y2="-6" className="schematic-stroke" />
            <text x="0" y="-12" textAnchor="middle" className="schematic-label">{`B-${String(i + 1).padStart(2, '0')}`}</text>
          </g>
        ))}
      </g>

      {/* CMU watermark */}
      <g transform="translate(1180 380)" opacity="0.12">
        <text x="0" y="0" textAnchor="end" fontFamily="Anton, sans-serif" fontSize="220" fill="#ECE6D8">
          CMU
        </text>
      </g>
    </svg>
  );
}

/* ────────────────────────────────────────────────────────────────────────── */
/*  PAS CARD — sheep + extracorporeal circuit with animated blood particles   */
/* ────────────────────────────────────────────────────────────────────────── */
export function PASCardSchematic() {
  // Closed circuit loop in 400×400 viewBox
  const circuit =
    'M 30 95 C 100 78, 180 90, 252 110 ' +
    'L 318 110 ' +
    'C 358 150, 358 240, 200 308 ' +
    'C 80 348, 18 264, 18 178 ' +
    'C 18 130, 24 102, 30 95';

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
        <path id="pas-card-circuit" d={circuit} />
      </defs>

      <rect width="100%" height="100%" fill="#0A0B10" />
      <rect width="100%" height="100%" fill="url(#pas-card-grid)" />
      <rect width="100%" height="100%" fill="url(#pas-card-glow)" />

      {/* Faint reference circuit line */}
      <use href="#pas-card-circuit" fill="none" stroke="rgba(230,48,70,0.18)" strokeWidth="1" strokeDasharray="2 5" />

      {/* Sheep silhouette */}
      <g transform="translate(60 130)">
        <path
          d="M 0 50 Q -6 36 4 28 Q 12 22 26 28 L 40 26 Q 60 14 80 22 L 110 18 Q 145 18 170 34 Q 195 40 204 56 L 204 78 Q 196 98 180 104 Q 160 110 120 108 Q 60 112 28 106 Q 10 100 0 82 Z"
          className="schematic-stroke"
          strokeWidth="1.2"
        />
        <line x1="40" y1="106" x2="40" y2="140" className="schematic-stroke" strokeWidth="1" />
        <line x1="70" y1="108" x2="70" y2="140" className="schematic-stroke" strokeWidth="1" />
        <line x1="150" y1="108" x2="150" y2="140" className="schematic-stroke" strokeWidth="1" />
        <line x1="180" y1="106" x2="180" y2="140" className="schematic-stroke" strokeWidth="1" />
        <circle cx="14" cy="36" r="1.5" fill="#ECE6D8" opacity="0.6" />
        <path d="M 2 26 Q -4 14 6 10" className="schematic-stroke" strokeWidth="1" />
        {/* Cannulas */}
        <line x1="26" y1="50" x2="-40" y2="-40" className="schematic-accent" strokeWidth="1.4" />
        <line x1="34" y1="52" x2="-20" y2="-40" className="schematic-accent" strokeWidth="1.4" />
        <circle cx="-40" cy="-40" r="3" fill="#E63046" />
        <circle cx="-20" cy="-40" r="3" fill="#E63046" />
      </g>

      {/* PAS device housing */}
      <g transform="translate(280 110)">
        <rect x="-60" y="-40" width="120" height="80" rx="6" className="schematic-stroke" strokeWidth="1.3" />
        <rect x="-50" y="-30" width="48" height="60" className="schematic-stroke-faint" />
        <rect x="2" y="-30" width="56" height="60" className="schematic-stroke-faint" />

        {/* Centrifugal pump — static frame */}
        <circle cx="-26" cy="0" r="18" className="schematic-accent" strokeWidth="1.3" />
        <circle cx="-26" cy="0" r="14" className="schematic-stroke-faint" />

        {/* Rotating impeller */}
        <g transform="translate(-26 0)">
          <g>
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0"
              to="360"
              dur="1.4s"
              repeatCount="indefinite"
            />
            {[0, 60, 120, 180, 240, 300].map((d) => (
              <line key={d} x1="0" y1="0" x2="0" y2="-13" transform={`rotate(${d})`} className="schematic-accent" strokeWidth="1" strokeLinecap="round" />
            ))}
          </g>
          <circle r="3" fill="#E63046" />
        </g>

        {/* Hollow fiber oxygenator */}
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <line key={i} x1={10 + i * 7} y1="-26" x2={10 + i * 7} y2="26" className="schematic-stroke" strokeWidth="0.8" />
        ))}
        {/* O₂ in / out arrows */}
        <line x1="14" y1="-30" x2="46" y2="-30" className="schematic-stroke-faint" strokeWidth="0.7" />
        <line x1="14" y1="30" x2="46" y2="30" className="schematic-stroke-faint" strokeWidth="0.7" />
      </g>

      {/* Animated blood particles */}
      {[0, 1.2, 2.4, 3.6].map((delay, i) => (
        <circle key={i} r="3.5" fill="#E63046">
          <animateMotion dur="4.8s" begin={`${delay}s`} repeatCount="indefinite">
            <mpath href="#pas-card-circuit" />
          </animateMotion>
        </circle>
      ))}

      {/* Data strip */}
      <g transform="translate(16 350)" opacity="0.6">
        <line x1="0" y1="0" x2="200" y2="0" className="schematic-stroke-faint" />
        {[0, 25, 50, 75, 100].map((p, i) => (
          <line key={i} x1={(p / 100) * 200} y1="-4" x2={(p / 100) * 200} y2="4" className="schematic-stroke" strokeWidth="0.8" />
        ))}
      </g>
      <text x="384" y="390" textAnchor="end" className="schematic-label" opacity="0.55">R-01 · PAS CIRCUIT</text>
    </svg>
  );
}

/* ────────────────────────────────────────────────────────────────────────── */
/*  COAGULATION CARD — cascade with inhibitor block + PCB chain length bars   */
/* ────────────────────────────────────────────────────────────────────────── */
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
        {/* Cascade drop path — single column */}
        <path id="coag-card-drop" d="M 0 0 L 0 300" />
      </defs>

      <rect width="100%" height="100%" fill="#0A0B10" />
      <rect width="100%" height="100%" fill="url(#coag-card-grid)" />
      <rect width="100%" height="100%" fill="url(#coag-card-glow)" />

      {/* Cascade nodes */}
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
            <rect
              x="-50" y="-14" width="100" height="28" rx="2"
              className={i === 1 ? 'schematic-accent' : 'schematic-stroke'}
              strokeWidth="1.1"
              fill="rgba(10,11,16,0.65)"
            />
            <text
              x="0" y="4" textAnchor="middle"
              fontSize="10" letterSpacing="0.18em"
              fill={i === 1 ? '#E63046' : 'rgba(236,230,216,0.9)'}
            >
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

        {/* FXII900-PCB inhibitor — pulsing block over XIIa */}
        <g transform="translate(70 60)">
          <circle r="22" className="schematic-accent" strokeWidth="1.5">
            <animate attributeName="r" values="22;26;22" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle r="14" fill="#E63046" opacity="0.25">
            <animate attributeName="opacity" values="0.15;0.45;0.15" dur="2s" repeatCount="indefinite" />
          </circle>
          <line x1="-10" y1="0" x2="10" y2="0" stroke="#E63046" strokeWidth="2" />
          <line x1="0" y1="-10" x2="0" y2="10" stroke="#E63046" strokeWidth="2" />
        </g>

        {/* Cascade drops — particles falling that get blocked at XIIa */}
        {[0, 0.8, 1.6].map((delay, i) => (
          <circle key={i} cx="0" cy="0" r="2" fill="rgba(122,184,232,0.85)">
            <animate
              attributeName="cy"
              values="-10;50;55"
              keyTimes="0;0.85;1"
              dur="2.4s"
              begin={`${delay}s`}
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0;1;1;0"
              keyTimes="0;0.1;0.85;1"
              dur="2.4s"
              begin={`${delay}s`}
              repeatCount="indefinite"
            />
          </circle>
        ))}
      </g>

      {/* PCB chain length bars (right) */}
      <g transform="translate(260 80)" opacity="0.85">
        <text className="schematic-label">PCB · CHAIN LENGTH</text>
        {[
          { kDa: 20, w: 28, t: 100 },
          { kDa: 40, w: 56, t: 130 },
          { kDa: 60, w: 84, t: 160, accent: true },
        ].map((b, i) => (
          <g key={i} transform={`translate(0 ${20 + i * 36})`}>
            <text x="0" y="11" className="schematic-label">{`${b.kDa} kDa`}</text>
            <rect
              x="42" y="1" width={b.w} height="14" rx="1"
              fill={b.accent ? 'rgba(230,48,70,0.35)' : 'rgba(236,230,216,0.12)'}
              stroke={b.accent ? '#E63046' : 'rgba(236,230,216,0.4)'}
              strokeWidth="0.8"
            />
            {b.accent && (
              <text x="42" y="-2" className="schematic-label" fill="#E63046">★ 33×</text>
            )}
          </g>
        ))}
        {/* Half-life axis */}
        <line x1="42" y1="124" x2="130" y2="124" className="schematic-stroke-faint" />
        <text x="42" y="138" className="schematic-label" opacity="0.5">t½ →</text>
      </g>

      <text x="384" y="390" textAnchor="end" className="schematic-label" opacity="0.55">R-02 · FXIIa CASCADE</text>
    </svg>
  );
}

/* ────────────────────────────────────────────────────────────────────────── */
/*  CANE CARD — cane silhouette + animated sonar pings + brake assembly       */
/* ────────────────────────────────────────────────────────────────────────── */
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

      {/* Cane shaft */}
      <g transform="translate(220 60)">
        <path
          d="M -10 0 Q 0 -18 18 -14 L 30 -6 L 28 6 L 0 12 Z"
          className="schematic-stroke"
          strokeWidth="1.3"
          fill="rgba(10,11,16,0.6)"
        />
        <circle cx="12" cy="0" r="3" fill="#E63046" />

        <line x1="-4" y1="12" x2="-80" y2="260" className="schematic-stroke" strokeWidth="2.2" />
        <line x1="-2" y1="14" x2="-78" y2="262" className="schematic-stroke-faint" />

        {/* Sensor with sonar pings */}
        <g transform="translate(-40 130)">
          <rect x="-8" y="-6" width="16" height="12" rx="1" className="schematic-accent" strokeWidth="1.2" />
          {/* Detection cone */}
          <path d="M 0 6 L -40 60 L 40 60 Z" fill="rgba(230,48,70,0.10)" stroke="rgba(230,48,70,0.40)" strokeWidth="0.8" strokeDasharray="2 3" />
          <path d="M 0 6 L -30 46 L 30 46 Z" fill="none" stroke="rgba(230,48,70,0.25)" strokeWidth="0.6" strokeDasharray="2 3" />
          {/* Animated sonar pings inside the cone */}
          {[0, 0.7, 1.4].map((delay, i) => (
            <g key={i}>
              <ellipse cx="0" cy="6" rx="0" ry="0" fill="none" stroke="#E63046" strokeWidth="1">
                <animate attributeName="rx" from="2" to="40" dur="2.1s" begin={`${delay}s`} repeatCount="indefinite" />
                <animate attributeName="ry" from="2" to="18" dur="2.1s" begin={`${delay}s`} repeatCount="indefinite" />
                <animate attributeName="cy" from="6" to="40" dur="2.1s" begin={`${delay}s`} repeatCount="indefinite" />
                <animate attributeName="opacity" from="0.85" to="0" dur="2.1s" begin={`${delay}s`} repeatCount="indefinite" />
              </ellipse>
            </g>
          ))}
        </g>
      </g>

      {/* Brake assembly */}
      <g transform="translate(90 300)">
        <rect x="-40" y="-26" width="100" height="52" rx="3" className="schematic-stroke" strokeWidth="1.3" fill="rgba(10,11,16,0.6)" />
        <path d="M 60 -16 L 74 -16 L 74 16 L 60 16" className="schematic-accent" strokeWidth="1.3" fill="none" />
        <line x1="-30" y1="0" x2="58" y2="0" className="schematic-stroke" strokeWidth="1" />

        {/* Animated slider */}
        <rect x="0" y="-10" width="22" height="20" className="schematic-accent" strokeWidth="1.2" fill="rgba(230,48,70,0.12)">
          <animate attributeName="x" values="-20;30;-20" dur="3.4s" repeatCount="indefinite" />
        </rect>

        <line x1="-30" y1="14" x2="58" y2="14" className="schematic-stroke-faint" />

        {/* Motor with rotating internal */}
        <circle cx="-30" cy="0" r="10" className="schematic-stroke" strokeWidth="1" />
        <g transform="translate(-30 0)">
          <g>
            <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="1.2s" repeatCount="indefinite" />
            <line x1="-7" y1="0" x2="7" y2="0" stroke="rgba(236,230,216,0.7)" strokeWidth="0.8" />
          </g>
          <circle r="2" fill="rgba(236,230,216,0.7)" />
        </g>

        {/* Bumper extending */}
        <rect x="74" y="-8" width="24" height="16" rx="3" fill="rgba(230,48,70,0.25)" stroke="#E63046" strokeWidth="1.2">
          <animate attributeName="x" values="62;82;62" dur="3.4s" repeatCount="indefinite" />
        </rect>
        <text x="-40" y="40" className="schematic-label">C-07 BUMPER</text>
      </g>

      <text x="384" y="390" textAnchor="end" className="schematic-label" opacity="0.55">R-03 · SENSING CANE</text>
    </svg>
  );
}

/* ────────────────────────────────────────────────────────────────────────── */
/*  PAS DETAIL — full circuit loop with animated particles + N=6 panel        */
/* ────────────────────────────────────────────────────────────────────────── */
export function PASDetailSchematic() {
  // Closed circuit loop in 1600×700 viewBox
  const circuit =
    'M 240 400 ' +
    'C 380 360, 530 330, 690 300 ' +
    'C 720 295, 800 295, 870 295 ' +
    'C 940 295, 1010 295, 1080 300 ' +
    'C 1170 300, 1260 300, 1340 308 ' +
    'C 1390 314, 1420 340, 1420 400 ' +
    'L 1420 540 ' +
    'C 1420 560, 1380 570, 1320 570 ' +
    'L 320 570 ' +
    'C 240 570, 210 540, 210 480 ' +
    'L 210 420 ' +
    'C 210 405, 220 398, 240 400';

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
        <path id="pas-det-circuit" d={circuit} />
      </defs>
      <rect width="100%" height="100%" fill="#0A0B10" />
      <rect width="100%" height="100%" fill="url(#pas-det-grid)" />
      <rect width="100%" height="100%" fill="url(#pas-det-glow)" />

      {/* Faint reference loop */}
      <use href="#pas-det-circuit" fill="none" stroke="rgba(230,48,70,0.18)" strokeWidth="1.2" strokeDasharray="3 6" />

      {/* Sheep */}
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

        <line x1="44" y1="40" x2="-80" y2="-80" className="schematic-accent" strokeWidth="1.6" />
        <line x1="64" y1="42" x2="-30" y2="-80" className="schematic-accent" strokeWidth="1.6" />
        <text x="-110" y="-90" className="schematic-label" fill="#E63046">R-EJ · 20 Fr</text>
        <text x="-52" y="-90" className="schematic-label" fill="#E63046">L-EJ · 20 Fr</text>
      </g>

      {/* Centrifugal pump */}
      <g transform="translate(760 300)">
        <circle r="74" className="schematic-stroke-faint" />
        <circle r="62" className="schematic-stroke" strokeWidth="1.3" />
        <circle r="48" className="schematic-accent" strokeWidth="1.5" />

        {/* Rotating impeller */}
        <g>
          <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="1.6s" repeatCount="indefinite" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((d) => (
            <path
              key={d}
              d="M 0 0 Q 6 -20 0 -46 Q -6 -20 0 0 Z"
              transform={`rotate(${d})`}
              className="schematic-accent"
              strokeWidth="1"
              fill="rgba(230,48,70,0.18)"
            />
          ))}
        </g>
        <circle r="14" className="schematic-stroke" strokeWidth="1" fill="#0A0B10" />
        <circle r="4" fill="#E63046" />
        <text x="0" y="100" textAnchor="middle" className="schematic-label">CDX PUMP · 3–5 L/MIN</text>
      </g>

      {/* Hollow fiber oxygenator */}
      <g transform="translate(1180 300)">
        <rect x="-100" y="-80" width="200" height="160" rx="6" className="schematic-stroke" strokeWidth="1.3" />
        {[...Array(14)].map((_, i) => (
          <line key={i} x1={-90 + i * 14} y1="-70" x2={-90 + i * 14} y2="70" className="schematic-stroke" strokeWidth="0.8" />
        ))}
        <line x1="-100" y1="-30" x2="100" y2="-30" className="schematic-accent" strokeWidth="1" strokeDasharray="3 3" />
        <line x1="-100" y1="30" x2="100" y2="30" className="schematic-accent" strokeWidth="1" strokeDasharray="3 3" />
        {/* O₂ in / out chevrons */}
        <path d="M -100 -50 L -88 -56 L -100 -62" stroke="rgba(122,184,232,0.6)" strokeWidth="1" fill="none" />
        <path d="M  100  50 L  112  56 L  100  62" stroke="rgba(230,48,70,0.6)" strokeWidth="1" fill="none" />
        <text x="-90" y="-86" className="schematic-label" fill="rgba(122,184,232,0.7)">O₂ IN</text>
        <text x="78" y="86" className="schematic-label" fill="rgba(230,48,70,0.7)">CO₂ OUT</text>
        <text x="0" y="100" textAnchor="middle" className="schematic-label">HOLLOW-FIBER OXYGENATOR</text>
      </g>

      {/* Animated blood particles around full circuit */}
      {[0, 1, 2, 3, 4].map((i) => (
        <circle key={i} r="4.5" fill="#E63046">
          <animateMotion dur="5s" begin={`${i}s`} repeatCount="indefinite">
            <mpath href="#pas-det-circuit" />
          </animateMotion>
        </circle>
      ))}

      {/* N=6 cohort outcome panel — bottom-right */}
      <g transform="translate(80 612)">
        <text x="0" y="0" className="schematic-label">N=6 · D0 → D30 · 2/6 PRIMARY ENDPOINT</text>
        <line x1="0" y1="10" x2="1440" y2="10" className="schematic-stroke-faint" />
        {/* 6 subject markers along the timeline */}
        {[
          { name: 'AKIO', day: 15, ok: false },
          { name: 'BENTO', day: 4, ok: false },
          { name: 'CHIIKAWA', day: 30, ok: true },
          { name: 'EBISU', day: 30, ok: true },
          { name: 'DAIFUKU', day: 18, ok: false },
          { name: 'GOKU', day: 15, ok: false },
        ].map((s, i) => {
          const x = 80 + i * 220;
          return (
            <g key={i} transform={`translate(${x} 10)`}>
              {/* Survival bar */}
              <rect
                x="0" y="6" width={(s.day / 30) * 200} height="6" rx="1"
                fill={s.ok ? 'rgba(230,48,70,0.55)' : 'rgba(236,230,216,0.18)'}
                stroke={s.ok ? '#E63046' : 'rgba(236,230,216,0.4)'}
                strokeWidth="0.6"
              />
              <text x="0" y="-6" className="schematic-label" fill={s.ok ? '#E63046' : 'rgba(236,230,216,0.55)'}>
                {s.name}
              </text>
              <text x="200" y="22" textAnchor="end" className="schematic-label" opacity="0.6">{`D${s.day}`}</text>
            </g>
          );
        })}

        {/* Day axis */}
        {[0, 5, 10, 15, 20, 25, 30].map((d) => (
          <g key={d} transform={`translate(${(d / 30) * 1440} 32)`}>
            <line x1="0" y1="0" x2="0" y2="6" className="schematic-stroke" strokeWidth="0.6" />
          </g>
        ))}
      </g>
    </svg>
  );
}

/* ────────────────────────────────────────────────────────────────────────── */
/*  COAGULATION DETAIL — cascade + PCB chain comparison + half-life bars      */
/* ────────────────────────────────────────────────────────────────────────── */
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

      {/* Intrinsic cascade */}
      <g transform="translate(180 80)" fontFamily="JetBrains Mono, monospace">
        <text x="0" y="-20" className="schematic-label">INTRINSIC · CONTACT PATHWAY</text>
        {[
          { y: 0, label: 'FACTOR XII', accent: false },
          { y: 60, label: 'FXIIa', accent: true },
          { y: 130, label: 'FXI → FXIa', accent: false },
          { y: 200, label: 'FIX → FIXa', accent: false },
        ].map((n, i) => (
          <g key={i} transform={`translate(0 ${n.y})`}>
            <rect
              x="-90" y="-20" width="180" height="40" rx="3"
              className={n.accent ? 'schematic-accent' : 'schematic-stroke'}
              strokeWidth="1.3" fill="rgba(10,11,16,0.7)"
            />
            <text x="0" y="6" textAnchor="middle" fontSize="12" letterSpacing="0.18em"
              fill={n.accent ? '#E63046' : 'rgba(236,230,216,0.92)'}>
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

        {/* Animated blocked particles falling onto FXIIa */}
        {[0, 0.9, 1.8].map((delay, i) => (
          <circle key={i} cx="0" cy="-50" r="3" fill="rgba(122,184,232,0.85)">
            <animate
              attributeName="cy"
              values="-60;40;42"
              keyTimes="0;0.85;1"
              dur="2.7s"
              begin={`${delay}s`}
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0;1;0.85;0"
              keyTimes="0;0.1;0.85;1"
              dur="2.7s"
              begin={`${delay}s`}
              repeatCount="indefinite"
            />
          </circle>
        ))}

        {/* FXII900-PCB pulsing block */}
        <g transform="translate(140 60)">
          <circle r="26" className="schematic-accent" strokeWidth="1.6">
            <animate attributeName="r" values="26;32;26" dur="2.4s" repeatCount="indefinite" />
          </circle>
          <circle r="18" fill="rgba(230,48,70,0.25)">
            <animate attributeName="opacity" values="0.18;0.5;0.18" dur="2.4s" repeatCount="indefinite" />
          </circle>
          <line x1="-12" y1="0" x2="12" y2="0" stroke="#E63046" strokeWidth="2.2" />
          <line x1="0" y1="-12" x2="0" y2="12" stroke="#E63046" strokeWidth="2.2" />
          <text x="44" y="4" className="schematic-label" fill="#E63046">FXII900-PCB</text>
        </g>
      </g>

      {/* Extrinsic cascade */}
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

      {/* Convergence + fibrin */}
      <g transform="translate(480 400)" fontFamily="JetBrains Mono, monospace">
        <rect x="-120" y="-24" width="240" height="48" rx="4" className="schematic-accent" strokeWidth="1.5" fill="rgba(10,11,16,0.7)" />
        <text x="0" y="6" textAnchor="middle" fontSize="13" letterSpacing="0.18em" fill="#E63046">FACTOR Xa → THROMBIN</text>
      </g>
      <path d="M 180 360 C 280 380, 380 380, 480 392" className="schematic-stroke" strokeWidth="1.3" fill="none" />
      <path d="M 800 330 C 680 360, 560 380, 480 388" className="schematic-stroke" strokeWidth="1.3" fill="none" />
      <path d="M 480 424 L 480 500" className="schematic-accent" strokeWidth="1.5" />
      <g transform="translate(480 540)" fontFamily="JetBrains Mono, monospace">
        <rect x="-90" y="-18" width="180" height="36" rx="3" className="schematic-stroke" strokeWidth="1.2" fill="rgba(10,11,16,0.7)" />
        <text x="0" y="5" textAnchor="middle" fontSize="12" letterSpacing="0.18em" fill="rgba(236,230,216,0.9)">FIBRIN · CLOT</text>
      </g>

      {/* PCB chain length comparison panel — right side */}
      <g transform="translate(1180 100)">
        <text x="0" y="-12" className="schematic-label">PCB CHAIN LENGTH · t½ COMPARISON</text>
        <rect x="-12" y="0" width="320" height="240" rx="6" className="schematic-stroke-faint" fill="rgba(10,11,16,0.55)" />
        {[
          { kDa: 20, halflife: 1.0, w: 56, label: '0.20 h' },
          { kDa: 40, halflife: 2.5, w: 140, label: '0.50 h' },
          { kDa: 60, halflife: 33, w: 280, label: '6.60 h', accent: true },
        ].map((b, i) => (
          <g key={i} transform={`translate(0 ${24 + i * 64})`}>
            <text x="0" y="14" fontSize="11" letterSpacing="0.18em" fill="rgba(236,230,216,0.8)">
              {`${b.kDa} kDa`}
            </text>
            <rect
              x="0" y="22" width={b.w} height="22" rx="2"
              fill={b.accent ? 'rgba(230,48,70,0.40)' : 'rgba(236,230,216,0.10)'}
              stroke={b.accent ? '#E63046' : 'rgba(236,230,216,0.35)'}
              strokeWidth="0.9"
            >
              <animate
                attributeName="width"
                from="0"
                to={String(b.w)}
                dur="2s"
                begin={`${i * 0.4}s`}
                fill="freeze"
              />
            </rect>
            <text
              x={b.w + 8} y="38"
              fontSize="11" letterSpacing="0.18em"
              fill={b.accent ? '#E63046' : 'rgba(236,230,216,0.6)'}
            >
              {b.label}
              {b.accent ? '  ★ 33×' : ''}
            </text>
          </g>
        ))}
        <line x1="0" y1="220" x2="296" y2="220" className="schematic-stroke-faint" />
        <text x="0" y="236" className="schematic-label" opacity="0.55">PLASMA HALF-LIFE · NZ WHITE RABBITS · n=5/GROUP</text>
      </g>

      {/* Hollow fiber surface motif — bottom right */}
      <g transform="translate(1200 380)" opacity="0.55">
        <text x="0" y="-12" className="schematic-label">HOLLOW-FIBER SURFACE</text>
        {[...Array(28)].map((_, i) => (
          <line key={i} x1={i * 9} y1="0" x2={i * 9} y2="240" className="schematic-stroke" strokeWidth="0.7" />
        ))}
        <rect x="0" y="100" width="252" height="50" fill="rgba(230,48,70,0.08)" stroke="rgba(230,48,70,0.4)" strokeWidth="0.8" strokeDasharray="3 3" />
        <text x="0" y="262" className="schematic-label" fill="#E63046">FXII900-PCB COATING</text>
      </g>
    </svg>
  );
}

/* ────────────────────────────────────────────────────────────────────────── */
/*  CANE DETAIL — exploded brake assembly + multi-ring sonar                  */
/* ────────────────────────────────────────────────────────────────────────── */
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

      {/* Cane profile */}
      <g transform="translate(240 80)">
        <path
          d="M -20 0 Q -10 -28 20 -28 L 60 -28 Q 80 -28 80 -10 L 80 8 L 0 20 Z"
          className="schematic-stroke" strokeWidth="1.4"
          fill="rgba(10,11,16,0.6)"
        />
        <circle cx="28" cy="-4" r="4" fill="#E63046">
          <animate attributeName="opacity" values="0.4;1;0.4" dur="1.4s" repeatCount="indefinite" />
        </circle>
        <circle cx="28" cy="-4" r="10" className="schematic-accent" strokeWidth="1" />
        <text x="96" y="-4" className="schematic-label" fill="#E63046">C-03 · VIBRATION MOTOR</text>

        <rect x="-2" y="20" width="18" height="420" className="schematic-stroke" strokeWidth="1.4" fill="rgba(10,11,16,0.6)" />
        {[60, 140, 220, 300, 380].map((y) => (
          <circle key={y} cx="7" cy={y} r="2" className="schematic-stroke-faint" />
        ))}

        {/* Ultrasonic sensor with multi-ring sonar */}
        <g transform="translate(7 220)">
          <rect x="-16" y="-10" width="44" height="20" rx="2" className="schematic-accent" strokeWidth="1.3" />
          <circle cx="-4" cy="0" r="3" fill="#E63046" />
          <circle cx="8" cy="0" r="3" fill="#E63046" />
          <text x="38" y="4" className="schematic-label" fill="#E63046">C-02 · ULTRASONIC</text>

          {/* Detection cones */}
          <path d="M 28 -8 L 160 -60 L 160 -100 Z" fill="rgba(230,48,70,0.08)" stroke="rgba(230,48,70,0.4)" strokeWidth="0.8" strokeDasharray="3 3" />
          <path d="M 28 8 L 160 60 L 160 100 Z" fill="rgba(230,48,70,0.08)" stroke="rgba(230,48,70,0.4)" strokeWidth="0.8" strokeDasharray="3 3" />

          {/* Sonar rings — expanding outward in two directions */}
          {[0, 0.6, 1.2, 1.8].map((delay, i) => (
            <g key={i}>
              <ellipse cx="28" cy="-30" rx="0" ry="0" fill="none" stroke="#E63046" strokeWidth="1">
                <animate attributeName="rx" from="2" to="120" dur="2.4s" begin={`${delay}s`} repeatCount="indefinite" />
                <animate attributeName="ry" from="2" to="36" dur="2.4s" begin={`${delay}s`} repeatCount="indefinite" />
                <animate attributeName="cx" from="28" to="148" dur="2.4s" begin={`${delay}s`} repeatCount="indefinite" />
                <animate attributeName="cy" from="-30" to="-78" dur="2.4s" begin={`${delay}s`} repeatCount="indefinite" />
                <animate attributeName="opacity" from="0.85" to="0" dur="2.4s" begin={`${delay}s`} repeatCount="indefinite" />
              </ellipse>
              <ellipse cx="28" cy="30" rx="0" ry="0" fill="none" stroke="#E63046" strokeWidth="1">
                <animate attributeName="rx" from="2" to="120" dur="2.4s" begin={`${delay}s`} repeatCount="indefinite" />
                <animate attributeName="ry" from="2" to="36" dur="2.4s" begin={`${delay}s`} repeatCount="indefinite" />
                <animate attributeName="cx" from="28" to="148" dur="2.4s" begin={`${delay}s`} repeatCount="indefinite" />
                <animate attributeName="cy" from="30" to="78" dur="2.4s" begin={`${delay}s`} repeatCount="indefinite" />
                <animate attributeName="opacity" from="0.85" to="0" dur="2.4s" begin={`${delay}s`} repeatCount="indefinite" />
              </ellipse>
            </g>
          ))}

          <text x="170" y="0" className="schematic-label">DETECTION CONE</text>
        </g>

        {/* Brake housing */}
        <rect x="-14" y="430" width="44" height="56" rx="3" className="schematic-stroke" strokeWidth="1.4" fill="rgba(10,11,16,0.6)" />
        <path d="M 30 446 L 50 446 L 50 470 L 30 470" className="schematic-accent" strokeWidth="1.4" fill="none" />

        {/* Bumper extending in/out */}
        <rect x="50" y="450" width="24" height="16" rx="3" fill="rgba(230,48,70,0.25)" stroke="#E63046" strokeWidth="1.3">
          <animate attributeName="x" values="38;58;38" dur="3.6s" repeatCount="indefinite" />
        </rect>

        <path d="M -2 486 L 16 486 L 10 500 L 4 500 Z" fill="rgba(236,230,216,0.15)" stroke="rgba(236,230,216,0.5)" strokeWidth="1" />
        <text x="96" y="460" className="schematic-label" fill="#E63046">C-07 · RUBBER BUMPER</text>
        <text x="96" y="478" className="schematic-label">C-04 · HOUSING</text>
      </g>

      {/* Exploded brake assembly */}
      <g transform="translate(900 340)">
        <text x="0" y="-220" className="schematic-label">C-05 + C-06 · BRAKE ASSEMBLY · EXPLODED VIEW</text>
        <rect x="-280" y="-140" width="560" height="220" rx="6" className="schematic-stroke" strokeWidth="1.5" fill="rgba(10,11,16,0.5)" />
        <path d="M 280 -100 L 360 -100 L 360 60 L 280 60" className="schematic-accent" strokeWidth="1.5" fill="none" />

        {/* Motor — rotating */}
        <g transform="translate(-220 -20)">
          <circle r="32" className="schematic-stroke" strokeWidth="1.4" />
          <circle r="18" className="schematic-stroke" strokeWidth="1" />
          <g>
            <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="2s" repeatCount="indefinite" />
            {[0, 60, 120, 180, 240, 300].map((d) => (
              <line key={d} x1="0" y1="0" x2="14" y2="0" transform={`rotate(${d})`} className="schematic-stroke" strokeWidth="0.8" />
            ))}
          </g>
          <circle r="4" fill="#E63046" />
          <text x="0" y="58" textAnchor="middle" className="schematic-label">MOTOR</text>
        </g>

        {/* Gear — rotating opposite direction */}
        <g transform="translate(-120 -20)">
          <g>
            <animateTransform attributeName="transform" type="rotate" from="0" to="-360" dur="1.6s" repeatCount="indefinite" />
            <circle r="22" className="schematic-accent" strokeWidth="1.3" />
            {[...Array(16)].map((_, i) => {
              const a = (i * 22.5 * Math.PI) / 180;
              const x1 = Math.cos(a) * 22, y1 = Math.sin(a) * 22;
              const x2 = Math.cos(a) * 28, y2 = Math.sin(a) * 28;
              return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} className="schematic-accent" strokeWidth="1" />;
            })}
          </g>
          <circle r="4" fill="#E63046" />
          <text x="0" y="56" textAnchor="middle" className="schematic-label">GEAR</text>
        </g>

        <line x1="-100" y1="-20" x2="220" y2="-20" className="schematic-stroke" strokeWidth="2" />
        <line x1="-100" y1="-20" x2="220" y2="-20" stroke="#ECE6D8" strokeWidth="0.4" strokeDasharray="3 3" opacity="0.35" />
        <text x="50" y="-30" textAnchor="middle" className="schematic-label">THREADED SHAFT</text>

        {/* Slider — moving along shaft */}
        <rect x="40" y="-40" width="80" height="40" rx="2" className="schematic-accent" strokeWidth="1.4" fill="rgba(230,48,70,0.12)">
          <animate attributeName="x" values="-30;120;-30" dur="3.6s" repeatCount="indefinite" />
        </rect>

        <line x1="-100" y1="20" x2="220" y2="20" className="schematic-stroke" strokeWidth="1.4" />
        <text x="60" y="40" textAnchor="middle" className="schematic-label">GUIDE RAIL</text>

        {/* Bumper extending */}
        <rect x="260" y="-18" width="90" height="36" rx="4" fill="rgba(230,48,70,0.22)" stroke="#E63046" strokeWidth="1.4">
          <animate attributeName="x" values="246;284;246" dur="3.6s" repeatCount="indefinite" />
        </rect>
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

/* ────────────────────────────────────────────────────────────────────────── */
/*  CV — annotated ruler / data grid                                          */
/* ────────────────────────────────────────────────────────────────────────── */
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

      {/* Year ruler 2023 → 2027 */}
      <g transform="translate(80 60)">
        <line x1="0" y1="0" x2="1440" y2="0" className="schematic-stroke" strokeWidth="0.8" />
        {[2023, 2024, 2025, 2026, 2027].map((yr, i) => (
          <g key={yr} transform={`translate(${i * 360} 0)`}>
            <line x1="0" y1="0" x2="0" y2="14" className="schematic-stroke" />
            <text x="0" y="30" className="schematic-label" textAnchor="middle">{yr}</text>
          </g>
        ))}
        {[...Array(40)].map((_, i) => (
          i % 8 !== 0 && (
            <line key={i} x1={i * 36} y1="0" x2={i * 36} y2={i % 4 === 0 ? 6 : 3} className="schematic-stroke-faint" />
          )
        ))}
      </g>

      {/* Research span — Fall 2025 → present highlighted in red */}
      <g transform="translate(80 120)">
        <line x1="0" y1="0" x2="1440" y2="0" className="schematic-stroke-faint" strokeWidth="1" />
        {/* Research bar: from index 2.6 (Fall 2025) to index 3.5 (April 2026) */}
        <rect x={2.6 * 360 / (2027 - 2023) * (2027 - 2023)} y="-6" width="0" height="12" />
        <rect
          x="936" y="-6" width="350" height="12" rx="2"
          fill="rgba(230,48,70,0.18)" stroke="#E63046" strokeWidth="1"
        >
          <animate attributeName="width" from="0" to="350" dur="2.4s" fill="freeze" />
        </rect>
        <text x="960" y="-12" className="schematic-label" fill="#E63046">COOK LAB · PAS · ISTH</text>
      </g>

      {/* Cell grid */}
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

/* ────────────────────────────────────────────────────────────────────────── */
/*  CTA — blueprint motif with animated flow                                  */
/* ────────────────────────────────────────────────────────────────────────── */
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
        <path id="cta-flow" d="M -55 0 L 55 0" />
      </defs>

      <rect width="100%" height="100%" fill="#0A0B10" />
      <rect width="100%" height="100%" fill="url(#cta-dots)" />
      <rect width="100%" height="100%" fill="url(#cta-grid)" />
      <rect width="100%" height="100%" fill="url(#cta-pulse)" />

      <g transform="translate(800 460)">
        <rect x="-260" y="-160" width="520" height="320" rx="12" className="schematic-stroke" strokeWidth="1.5" />
        <rect x="-240" y="-140" width="480" height="280" rx="6" className="schematic-stroke-faint" />

        {/* Pump */}
        <g transform="translate(-130 0)">
          <circle r="80" className="schematic-stroke" strokeWidth="1.3" />
          <circle r="55" className="schematic-accent" strokeWidth="1.5" />
          <circle r="30" className="schematic-stroke" strokeWidth="1" />
          <g>
            <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="2s" repeatCount="indefinite" />
            {[0, 60, 120, 180, 240, 300].map((deg) => (
              <line key={deg} x1="0" y1="0" x2="55" y2="0" transform={`rotate(${deg})`} className="schematic-accent" strokeWidth="1" />
            ))}
          </g>
          <circle r="6" fill="#E63046" />
        </g>

        {/* Heart */}
        <g transform="translate(130 0)">
          <circle r="80" className="schematic-stroke" strokeWidth="1.3" />
          <path
            d="M -60 -30 Q -30 -50 0 -40 Q 30 -50 60 -30 Q 50 0 60 30 Q 30 50 0 40 Q -30 50 -60 30 Q -50 0 -60 -30 Z"
            className="schematic-accent" strokeWidth="1.4"
          >
            <animateTransform
              attributeName="transform"
              type="scale"
              values="1;1.06;1"
              dur="1.4s"
              repeatCount="indefinite"
            />
          </path>
          <circle cx="-20" cy="0" r="4" fill="#E63046" />
          <circle cx="20" cy="0" r="4" fill="#E63046" />
        </g>

        {/* Connector line + animated flow particles */}
        <line x1="-55" y1="0" x2="55" y2="0" className="schematic-accent" strokeWidth="2" />
        {[0, 0.8, 1.6].map((delay, i) => (
          <circle key={i} r="3" fill="#E63046">
            <animateMotion dur="2.4s" begin={`${delay}s`} repeatCount="indefinite">
              <mpath href="#cta-flow" />
            </animateMotion>
          </circle>
        ))}

        {/* Callouts */}
        {[
          { lx1: -130, ly1: -80, lx2: -200, ly2: -200, tx: -440, ty: -210, label: 'B-01 · ACTUATOR', sub: 'CENTRIFUGAL PUMP' },
          { lx1: 130, ly1: -80, lx2: 200, ly2: -200, tx: 220, ty: -210, label: 'B-02 · OXYGENATOR', sub: 'HOLLOW FIBER MEMBRANE' },
          { lx1: -130, ly1: 80, lx2: -200, ly2: 200, tx: -440, ty: 206, label: 'B-03 · BLOOD INLET', sub: 'ANTICOAGULATED' },
          { lx1: 130, ly1: 80, lx2: 200, ly2: 200, tx: 220, ty: 206, label: 'B-04 · OUTLET', sub: 'OXYGENATED FLOW' },
        ].map((c, i) => (
          <g key={i}>
            <line x1={c.lx1} y1={c.ly1} x2={c.lx2} y2={c.ly2} className="schematic-stroke-faint" />
            <line x1={c.lx2} y1={c.ly2} x2={c.tx + (c.tx < 0 ? 220 : -20)} y2={c.ly2} className="schematic-stroke-faint" />
            <text x={c.tx} y={c.ty} className="schematic-label">{c.label}</text>
            <text x={c.tx} y={c.ty + 16} className="schematic-label" fill="rgba(236,230,216,0.35)">{c.sub}</text>
            <circle cx={c.lx2} cy={c.ly2} r="2" fill="rgba(236,230,216,0.55)" />
          </g>
        ))}

        <line x1="-260" y1="200" x2="260" y2="200" className="schematic-stroke-faint" />
        {[-260, -130, 0, 130, 260].map((x) => (
          <line key={x} x1={x} y1={195} x2={x} y2={205} className="schematic-stroke-faint" />
        ))}
        <text x="-20" y="246" className="schematic-label">320 MM</text>
      </g>

      {/* Corner framing */}
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
