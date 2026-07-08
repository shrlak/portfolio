import { useState } from 'react';
import { FlaskConical, Cog, FileText, HeartPulse } from 'lucide-react';
import { EXPERIENCE, EXP_FILTERS, type ExpKind } from '../../content';
import { SectionHead } from '../ui/SectionHead';

const EXP_ICON: Record<ExpKind, React.ReactNode> = {
  RESEARCH: <FlaskConical size={13} />,
  WORK: <Cog size={13} />,
  TEACHING: <FileText size={13} />,
  LEADERSHIP: <HeartPulse size={13} />,
};

export function Experience() {
  const [filter, setFilter] = useState<ExpKind | 'ALL'>('ALL');
  const shown = EXPERIENCE.filter((e) => filter === 'ALL' || e.kind === filter);

  return (
    <section id="experience" className="section">
      <div className="shell">
        <SectionHead
          eyebrow="EXPERIENCE"
          title="Research, leadership & work"
          kicker="A running record of where I’ve been building, teaching, and leading."
        />

        {/* Filter chips */}
        <div className="mt-9 flex flex-wrap gap-2" data-reveal>
          {EXP_FILTERS.map((f) => {
            const activeChip = filter === f.key;
            return (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={[
                  'rounded-full border px-4 py-2 text-[13px] font-medium transition-all duration-200',
                  activeChip
                    ? 'border-ink bg-ink text-white'
                    : 'border-line bg-white text-subink hover:border-ink/30 hover:text-ink',
                ].join(' ')}
              >
                {f.label}
              </button>
            );
          })}
        </div>

        {/* Timeline */}
        <div className="relative mt-10 pl-8">
          <div className="rail" />
          <div className="space-y-8">
            {shown.map((e, i) => (
              <div
                key={`${e.org}-${e.role}`}
                className="relative"
                data-reveal
                style={{ ['--reveal-delay' as string]: `${i * 60}ms` }}
              >
                <span className={['rail-dot', e.kind === 'RESEARCH' ? 'is-vital' : ''].join(' ')} />
                <div className="card card-hover -ml-1 p-6">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-soft px-2.5 py-1 text-[10px] font-semibold tracking-wide text-subink">
                      <span className="text-vital">{EXP_ICON[e.kind]}</span>
                      {e.kind}
                    </span>
                    <span className="mono ml-auto text-[12px] text-faint">{e.dates}</span>
                  </div>
                  <h3 className="mt-3.5 text-[18px] font-semibold text-ink">{e.role}</h3>
                  <p className="mt-0.5 text-[14px] text-subink">
                    {e.org} · {e.loc}
                  </p>
                  <ul className="mt-4 space-y-2">
                    {e.bullets.map((b, bi) => (
                      <li key={bi} className="flex gap-2.5 text-[14px] leading-relaxed text-subink">
                        <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-ink/30" />
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
