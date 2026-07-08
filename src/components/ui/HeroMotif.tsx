import { GearGlyph } from './GearGlyph';

export function HeroMotif() {
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
