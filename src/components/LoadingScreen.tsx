import { useEffect, useState } from 'react';
import { Cog } from 'lucide-react';

const FILL_MS = 1400;
const EXIT_MS = 550;

export function LoadingScreen({ onFinish }: { onFinish: () => void }) {
  const [filled, setFilled] = useState(false);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const fillMs = reduceMotion ? 200 : FILL_MS;
    const exitMs = reduceMotion ? 120 : EXIT_MS;

    document.body.style.overflow = 'hidden';

    const raf = requestAnimationFrame(() => setFilled(true));
    const toExit = window.setTimeout(() => setExiting(true), fillMs);
    const toDone = window.setTimeout(() => {
      document.body.style.overflow = '';
      onFinish();
    }, fillMs + exitMs);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(toExit);
      window.clearTimeout(toDone);
      document.body.style.overflow = '';
    };
  }, [onFinish]);

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading Spencer Kim's portfolio"
      className={[
        'fixed inset-0 z-[999] flex flex-col items-center justify-center bg-night text-white',
        'transition-opacity duration-[550ms] ease-[cubic-bezier(0.65,0,0.35,1)]',
        exiting ? 'pointer-events-none opacity-0' : 'opacity-100',
      ].join(' ')}
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-70" aria-hidden="true">
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="absolute bottom-[20%] left-0 h-24 w-full text-vital/50"
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

      <span
        className="relative flex h-14 w-14 animate-spinslow items-center justify-center rounded-2xl border border-white/15 bg-white/[0.06] text-white"
        aria-hidden="true"
      >
        <Cog size={26} strokeWidth={1.6} />
      </span>

      <p className="mono mt-6 text-[11px] tracking-widecaps text-white/50">MECHANICAL + BIOMEDICAL ENGINEERING</p>
      <h1 className="display mt-2 text-[22px] text-white">Spencer Kim</h1>

      <div className="mt-8 h-[2px] w-40 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-vital transition-[width] duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{ width: filled ? '100%' : '0%' }}
        />
      </div>
    </div>
  );
}
