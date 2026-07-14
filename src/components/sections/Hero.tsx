import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { HERO } from '../../content';
import { HeroMotif } from '../ui/HeroMotif';
import { HeroStat } from '../ui/HeroStat';

export function Hero() {
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
          <Link to="/research" className="btn btn-primary">
            View research <ArrowRight size={16} />
          </Link>
          <Link to="/projects" className="btn btn-ghost">
            See projects
          </Link>
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
