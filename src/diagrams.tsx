/* Animated clinical diagrams — PAS ovine study */

export function PASCircuitDiagram() {
  const blades = [0, 72, 144, 216, 288].map((deg) => {
    const a1 = (deg * Math.PI) / 180;
    const a2 = ((deg + 22) * Math.PI) / 180;
    const ix = (58 + 8 * Math.cos(a1)).toFixed(2);
    const iy = (272 + 8 * Math.sin(a1)).toFixed(2);
    const cx = (58 + 18 * Math.cos(a1)).toFixed(2);
    const cy = (272 + 18 * Math.sin(a1)).toFixed(2);
    const ox = (58 + 26 * Math.cos(a2)).toFixed(2);
    const oy = (272 + 26 * Math.sin(a2)).toFixed(2);
    return `M${ix},${iy} Q${cx},${cy} ${ox},${oy}`;
  });

  return (
    <svg viewBox="0 0 560 330" aria-hidden="true" className="w-full h-auto" style={{ background: '#0A0B10' }}>
      <defs>
        <pattern id="pad-grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M20 0L0 0 0 20" fill="none" stroke="rgba(236,230,216,0.04)" strokeWidth="0.5" />
        </pattern>
        <filter id="pad-glow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="2.5" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <linearGradient id="pad-oxy-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(122,184,232,0.22)" />
          <stop offset="100%" stopColor="rgba(122,184,232,0.06)" />
        </linearGradient>
        {/* Motion paths */}
        <path id="pad-drain" d="M268,165 L200,165 C175,165 150,182 118,202 C90,220 68,242 58,263" />
        <path id="pad-return" d="M58,248 L58,138 C58,103 72,78 104,74 L188,74 C218,74 248,92 268,148" />
      </defs>

      <rect width="560" height="330" fill="#0A0B10" />
      <rect width="560" height="330" fill="url(#pad-grid)" />

      {/* ── SHEEP SILHOUETTE ── */}
      <ellipse cx="392" cy="183" rx="105" ry="61" fill="none" stroke="rgba(236,230,216,0.18)" strokeWidth="1.5" />
      {([
        [350,147,14],[384,137,13],[416,134,14],[448,140,12],[474,152,11],
        [490,170,10],[486,196,11],[464,212,12],[434,218,11],[402,219,12],
        [368,214,11],[347,197,10],[338,177,10],[344,157,11],
      ] as [number,number,number][]).map(([cx,cy,r],i) => (
        <circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke="rgba(236,230,216,0.09)" strokeWidth="1" />
      ))}
      <ellipse cx="317" cy="152" rx="46" ry="34" fill="none" stroke="rgba(236,230,216,0.22)" strokeWidth="1.5" />
      <ellipse cx="299" cy="121" rx="9" ry="16" fill="none" stroke="rgba(236,230,216,0.16)" strokeWidth="1" />
      <circle cx="305" cy="147" r="3.5" fill="none" stroke="rgba(236,230,216,0.35)" strokeWidth="1" />
      <circle cx="305" cy="147" r="1.5" fill="rgba(236,230,216,0.35)" />
      <path d="M284,162 Q277,160 279,165 Q282,171 290,171 Q298,171 298,165 Q297,159 290,159"
        fill="none" stroke="rgba(236,230,216,0.20)" strokeWidth="1" />
      {[366, 404, 438, 472].map((x, i) => (
        <g key={i}>
          <rect x={x - 5} y={240} width="10" height="38" rx="5" fill="none" stroke="rgba(236,230,216,0.18)" strokeWidth="1.5" />
          <ellipse cx={x} cy={281} rx="7" ry="4" fill="none" stroke="rgba(236,230,216,0.24)" strokeWidth="1.5" />
        </g>
      ))}
      <path d="M496,177 Q518,167 513,188 Q508,205 496,200" fill="none" stroke="rgba(236,230,216,0.16)" strokeWidth="1.5" />

      {/* ── CANNULA ACCESS POINTS (jugular) ── */}
      <line x1="272" y1="144" x2="272" y2="174" stroke="rgba(236,230,216,0.18)" strokeWidth="0.5" strokeDasharray="2 3" />
      <text x="264" y="140" fontFamily="JetBrains Mono, monospace" fontSize="7" fill="rgba(230,48,70,0.72)" textAnchor="end" letterSpacing="0.08em">RETURN</text>
      <text x="264" y="178" fontFamily="JetBrains Mono, monospace" fontSize="7" fill="rgba(110,18,30,0.80)" textAnchor="end" letterSpacing="0.08em">DRAIN</text>
      <text x="276" y="158" fontFamily="JetBrains Mono, monospace" fontSize="6" fill="rgba(236,230,216,0.22)" letterSpacing="0.05em">JVA</text>
      <circle cx="268" cy="148" r="5" fill="#E63046" filter="url(#pad-glow)">
        <animate attributeName="opacity" values="1;0.4;1" dur="1.4s" repeatCount="indefinite" />
      </circle>
      <circle cx="268" cy="165" r="5" fill="#7B1828">
        <animate attributeName="opacity" values="0.8;0.3;0.8" dur="1.4s" begin="0.6s" repeatCount="indefinite" />
      </circle>

      {/* ── CIRCUIT TUBING ── */}
      <path d="M268,165 L200,165 C175,165 150,182 118,202 C90,220 68,242 58,263"
        fill="none" stroke="rgba(70,10,18,0.55)" strokeWidth="10" strokeLinecap="round" />
      <path d="M268,165 L200,165 C175,165 150,182 118,202 C90,220 68,242 58,263"
        fill="none" stroke="rgba(110,18,30,0.85)" strokeWidth="7" strokeLinecap="round" />
      <path d="M58,248 L58,138 C58,103 72,78 104,74 L188,74 C218,74 248,92 268,148"
        fill="none" stroke="rgba(150,25,42,0.50)" strokeWidth="10" strokeLinecap="round" />
      <path d="M58,248 L58,138 C58,103 72,78 104,74 L188,74 C218,74 248,92 268,148"
        fill="none" stroke="rgba(230,48,70,0.88)" strokeWidth="7" strokeLinecap="round" />

      {/* ── CENTRIFUGAL PUMP ── */}
      <circle cx="58" cy="272" r="40" fill="rgba(13,15,23,0.95)" stroke="rgba(236,230,216,0.18)" strokeWidth="1.5" />
      <circle cx="58" cy="272" r="32" fill="rgba(10,11,16,0.5)" stroke="rgba(236,230,216,0.07)" strokeWidth="0.5" />
      <g>
        <animateTransform attributeName="transform" type="rotate" from="0 58 272" to="360 58 272" dur="0.9s" repeatCount="indefinite" />
        {blades.map((d, i) => (
          <path key={i} d={d} fill="rgba(110,18,30,0.5)" stroke="rgba(200,40,60,0.45)" strokeWidth="1.2" />
        ))}
      </g>
      <circle cx="58" cy="272" r="6" fill="rgba(236,230,216,0.10)" stroke="rgba(236,230,216,0.28)" strokeWidth="1" />
      <text x="58" y="320" fontFamily="JetBrains Mono, monospace" fontSize="7.5" fill="rgba(236,230,216,0.42)" textAnchor="middle" letterSpacing="0.10em">CENTRIFUGAL PUMP</text>
      <text x="58" y="330" fontFamily="JetBrains Mono, monospace" fontSize="6.5" fill="rgba(236,230,216,0.26)" textAnchor="middle" letterSpacing="0.08em">ROTAFLOW · 4,200 RPM</text>

      {/* ── MEMBRANE OXYGENATOR ── */}
      <rect x="46" y="56" width="150" height="74" rx="8" fill="url(#pad-oxy-bg)" stroke="rgba(122,184,232,0.28)" strokeWidth="1.5" />
      {Array.from({ length: 9 }, (_, i) => (
        <line key={i} x1="54" y1={66 + i * 7} x2="188" y2={66 + i * 7} stroke="rgba(122,184,232,0.09)" strokeWidth="0.8" />
      ))}
      <text x="121" y="106" fontFamily="JetBrains Mono, monospace" fontSize="8" fill="rgba(122,184,232,0.80)" textAnchor="middle" letterSpacing="0.10em" fontWeight="500">OXYGENATOR</text>
      <text x="121" y="118" fontFamily="JetBrains Mono, monospace" fontSize="6.5" fill="rgba(122,184,232,0.44)" textAnchor="middle" letterSpacing="0.06em">QUADROX-i · MAQUET</text>
      {/* Gas sweep port */}
      <rect x="86" y="130" width="70" height="11" rx="3" fill="rgba(122,184,232,0.07)" stroke="rgba(122,184,232,0.22)" strokeWidth="0.8" />
      <text x="121" y="139" fontFamily="JetBrains Mono, monospace" fontSize="6" fill="rgba(122,184,232,0.52)" textAnchor="middle">O₂ SWEEP</text>
      {/* Gas arrows */}
      {[78, 104, 130, 156].map((x) => (
        <g key={x}>
          <line x1={x} y1={56} x2={x} y2={38} stroke="rgba(122,184,232,0.30)" strokeWidth="0.8" strokeDasharray="3 2" />
          <polygon points={`${x},36 ${x - 3},43 ${x + 3},43`} fill="rgba(122,184,232,0.30)" />
        </g>
      ))}
      <text x="117" y="31" fontFamily="JetBrains Mono, monospace" fontSize="6" fill="rgba(122,184,232,0.50)" textAnchor="middle" letterSpacing="0.07em">CO₂ EXHAUST</text>

      {/* ── ANIMATED BLOOD CELLS ── */}
      {[0, 0.56, 1.12, 1.68, 2.24].map((t, i) => (
        <circle key={`d${i}`} r="4.5" fill="#7B1828">
          <animateMotion dur="2.8s" begin={`${t}s`} repeatCount="indefinite">
            <mpath href="#pad-drain" />
          </animateMotion>
          <animate attributeName="opacity" values="0;0.9;0.9;0" keyTimes="0;0.08;0.88;1" dur="2.8s" begin={`${t}s`} repeatCount="indefinite" />
        </circle>
      ))}
      {[0, 0.44, 0.88, 1.32, 1.76].map((t, i) => (
        <circle key={`r${i}`} r="4.5" fill="#E63046" filter="url(#pad-glow)">
          <animateMotion dur="2.2s" begin={`${t}s`} repeatCount="indefinite">
            <mpath href="#pad-return" />
          </animateMotion>
          <animate attributeName="opacity" values="0;0.85;0.85;0" keyTimes="0;0.08;0.88;1" dur="2.2s" begin={`${t}s`} repeatCount="indefinite" />
        </circle>
      ))}

      {/* ── VITALS READOUT ── */}
      <rect x="306" y="264" width="238" height="52" rx="6" fill="rgba(12,14,22,0.88)" stroke="rgba(236,230,216,0.07)" strokeWidth="1" />
      {([
        { label: 'FLOW', val: '1.5 L/min', color: '#E63046', x: 328 },
        { label: 'SpO₂', val: '98%', color: '#7AB8E8', x: 415 },
        { label: 'FiO₂', val: '100%', color: '#7AB8E8', x: 498 },
      ] as { label: string; val: string; color: string; x: number }[]).map(({ label, val, color, x }) => (
        <g key={label}>
          <text x={x} y={282} fontFamily="JetBrains Mono, monospace" fontSize="7" fill="rgba(236,230,216,0.32)" textAnchor="middle" letterSpacing="0.1em">{label}</text>
          <text x={x} y={302} fontFamily="JetBrains Mono, monospace" fontSize="12" fill={color} textAnchor="middle" fontWeight="700">{val}</text>
        </g>
      ))}

      {/* Title */}
      <text x="20" y="20" fontFamily="JetBrains Mono, monospace" fontSize="8" fill="rgba(230,48,70,0.72)" letterSpacing="0.14em" fontWeight="600">
        VV ECMO · EXTRACORPOREAL CIRCUIT · PAS OVINE MODEL
      </text>
    </svg>
  );
}

export function KaplanMeierDiagram() {
  const px = 68, py = 24, pw = 428, ph = 198;
  const xS = pw / 30;
  const yS = ph / 100;
  const tx = (d: number) => px + d * xS;
  const ty = (p: number) => py + (100 - p) * yS;

  // K-M steps: day 7 first death (100→83.3%), day 14 second death (83.3→66.7%)
  const kmPts: [number, number][] = [[0,100],[7,100],[7,83.3],[14,83.3],[14,66.7],[30,66.7]];
  const kmD = kmPts.map(([d,s],i) => `${i?'L':'M'}${tx(d).toFixed(1)},${ty(s).toFixed(1)}`).join(' ');

  // CI lower boundary (Greenwood; upper always capped at 100%)
  const ciLo: [number,number][] = [[0,100],[7,100],[7,53.5],[14,53.5],[14,24.9],[30,24.9]];
  const ciLoPath = ciLo.map(([d,s],i) => `${i?'L':'M'}${tx(d).toFixed(1)},${ty(s).toFixed(1)}`).join(' ');
  // Full CI band (closed shape)
  const ciBand = [
    `M${tx(0).toFixed(1)},${ty(100).toFixed(1)}`,
    `L${tx(30).toFixed(1)},${ty(100).toFixed(1)}`,
    ...ciLo.slice().reverse().map(([d,s]) => `L${tx(d).toFixed(1)},${ty(s).toFixed(1)}`),
    'Z',
  ].join(' ');

  return (
    <svg viewBox="0 0 560 290" aria-hidden="true" className="w-full h-auto" style={{ background: '#0A0B10' }}>
      <defs>
        <linearGradient id="km-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(230,48,70,0.14)" />
          <stop offset="100%" stopColor="rgba(230,48,70,0.02)" />
        </linearGradient>
      </defs>

      <rect width="560" height="290" fill="#0A0B10" />

      {/* Grid */}
      {[0,25,50,75,100].map(p => (
        <line key={p} x1={px} y1={ty(p)} x2={px+pw} y2={ty(p)} stroke="rgba(236,230,216,0.05)" strokeWidth="0.5" strokeDasharray="3 4" />
      ))}
      {[0,5,10,15,20,25,30].map(d => (
        <line key={d} x1={tx(d)} y1={py} x2={tx(d)} y2={py+ph} stroke="rgba(236,230,216,0.05)" strokeWidth="0.5" strokeDasharray="3 4" />
      ))}

      {/* Axes */}
      <line x1={px} y1={py} x2={px} y2={py+ph} stroke="rgba(236,230,216,0.28)" strokeWidth="1" />
      <line x1={px} y1={py+ph} x2={px+pw} y2={py+ph} stroke="rgba(236,230,216,0.28)" strokeWidth="1" />

      {/* X ticks + labels */}
      {[0,5,10,15,20,25,30].map(d => (
        <g key={d}>
          <line x1={tx(d)} y1={py+ph} x2={tx(d)} y2={py+ph+5} stroke="rgba(236,230,216,0.28)" strokeWidth="1" />
          <text x={tx(d)} y={py+ph+16} fontFamily="JetBrains Mono, monospace" fontSize="8" fill="rgba(236,230,216,0.42)" textAnchor="middle">{d}</text>
        </g>
      ))}

      {/* Y ticks + labels */}
      {[0,25,50,75,100].map(p => (
        <g key={p}>
          <line x1={px-5} y1={ty(p)} x2={px} y2={ty(p)} stroke="rgba(236,230,216,0.28)" strokeWidth="1" />
          <text x={px-8} y={ty(p)+3} fontFamily="JetBrains Mono, monospace" fontSize="8" fill="rgba(236,230,216,0.42)" textAnchor="end">{p}%</text>
        </g>
      ))}

      {/* Axis labels */}
      <text x={px+pw/2} y={py+ph+32} fontFamily="JetBrains Mono, monospace" fontSize="8.5" fill="rgba(236,230,216,0.44)" textAnchor="middle" letterSpacing="0.12em">TIME (DAYS)</text>
      <text x="14" y={py+ph/2} fontFamily="JetBrains Mono, monospace" fontSize="8.5" fill="rgba(236,230,216,0.44)" textAnchor="middle" letterSpacing="0.12em" transform={`rotate(-90 14 ${py+ph/2})`}>SURVIVAL (%)</text>

      {/* CI band */}
      <path d={ciBand} fill="rgba(230,48,70,0.06)" stroke="none" />
      <path d={ciLoPath} fill="none" stroke="rgba(230,48,70,0.18)" strokeWidth="0.8" strokeDasharray="4 3" />
      <line x1={tx(0)} y1={ty(100)} x2={tx(30)} y2={ty(100)} stroke="rgba(230,48,70,0.18)" strokeWidth="0.8" strokeDasharray="4 3" />

      {/* Area under curve */}
      <path d={`${kmD} L${tx(30).toFixed(1)},${ty(0).toFixed(1)} L${tx(0).toFixed(1)},${ty(0).toFixed(1)} Z`} fill="url(#km-fill)" stroke="none" />

      {/* K-M curve — animated draw */}
      <path d={kmD} fill="none" stroke="#E63046" strokeWidth="2.5" strokeLinecap="square"
        strokeDasharray="600" strokeDashoffset="600">
        <animate attributeName="stroke-dashoffset" from="600" to="0" dur="2.4s" begin="0.4s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1" keyTimes="0;1" />
      </path>

      {/* Event markers — deaths at day 7 and 14 */}
      {([[7, 83.3], [14, 66.7]] as [number,number][]).map(([d, s]) => (
        <g key={d}>
          <line x1={tx(d)} y1={py} x2={tx(d)} y2={ty(0)} stroke="rgba(230,48,70,0.10)" strokeWidth="1" strokeDasharray="3 3" />
          <circle cx={tx(d)} cy={ty(s)} r="5.5" fill="#0A0B10" stroke="#E63046" strokeWidth="2" />
          <line x1={tx(d)-3} y1={ty(s)-3} x2={tx(d)+3} y2={ty(s)+3} stroke="#E63046" strokeWidth="1.6" />
          <line x1={tx(d)+3} y1={ty(s)-3} x2={tx(d)-3} y2={ty(s)+3} stroke="#E63046" strokeWidth="1.6" />
          <text x={tx(d)} y={py-7} fontFamily="JetBrains Mono, monospace" fontSize="7" fill="rgba(230,48,70,0.62)" textAnchor="middle">d{d}</text>
        </g>
      ))}

      {/* Survival % annotations */}
      <text x={tx(18)} y={ty(83.3)-7} fontFamily="JetBrains Mono, monospace" fontSize="7.5" fill="rgba(236,230,216,0.30)" textAnchor="middle">83.3%</text>
      <text x={tx(22)} y={ty(66.7)-7} fontFamily="JetBrains Mono, monospace" fontSize="7.5" fill="rgba(236,230,216,0.30)" textAnchor="middle">66.7%</text>

      {/* Censoring marks at day 30 (n=4 survivors) */}
      <line x1={tx(30)} y1={ty(66.7)-6} x2={tx(30)} y2={ty(66.7)+6} stroke="rgba(122,184,232,0.75)" strokeWidth="2" />
      <text x={tx(30)+7} y={ty(66.7)+5} fontFamily="JetBrains Mono, monospace" fontSize="10" fill="rgba(122,184,232,0.75)">+</text>
      <text x={tx(30)+14} y={ty(66.7)-4} fontFamily="JetBrains Mono, monospace" fontSize="7" fill="rgba(122,184,232,0.55)" letterSpacing="0.06em">n=4</text>

      {/* Legend */}
      <g transform={`translate(${px+10},${py+ph-38})`}>
        <line x1="0" y1="6" x2="18" y2="6" stroke="#E63046" strokeWidth="2.5" />
        <text x="24" y="10" fontFamily="JetBrains Mono, monospace" fontSize="8" fill="rgba(236,230,216,0.55)" letterSpacing="0.08em">PAS · OVINE COHORT (N=6)</text>
      </g>
      <g transform={`translate(${px+10},${py+ph-20})`}>
        <line x1="0" y1="6" x2="18" y2="6" stroke="rgba(230,48,70,0.40)" strokeWidth="0.8" strokeDasharray="4 3" />
        <text x="24" y="10" fontFamily="JetBrains Mono, monospace" fontSize="8" fill="rgba(236,230,216,0.38)" letterSpacing="0.08em">95% CI (GREENWOOD)</text>
      </g>

      {/* Risk table */}
      <text x={px} y={py+ph+46} fontFamily="JetBrains Mono, monospace" fontSize="7" fill="rgba(236,230,216,0.26)" letterSpacing="0.08em">AT RISK</text>
      {([[0,6],[7,5],[14,4],[30,4]] as [number,number][]).map(([d,n]) => (
        <text key={d} x={tx(d)} y={py+ph+46} fontFamily="JetBrains Mono, monospace" fontSize="7" fill="rgba(236,230,216,0.40)" textAnchor="middle">{n}</text>
      ))}

      {/* Title */}
      <text x={px+pw} y={py-8} fontFamily="JetBrains Mono, monospace" fontSize="8" fill="rgba(230,48,70,0.72)" letterSpacing="0.14em" fontWeight="600" textAnchor="end">
        KAPLAN-MEIER · 30-DAY SURVIVAL ANALYSIS
      </text>
    </svg>
  );
}
