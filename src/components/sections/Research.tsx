import { FlaskConical, MapPin, HeartPulse } from 'lucide-react';
import { RESEARCH } from '../../content';
import { SectionHead } from '../ui/SectionHead';

export function Research() {
  return (
    <section id="research" className="section bg-soft">
      <div className="shell">
        <SectionHead
          eyebrow={RESEARCH.eyebrow}
          title={
            <>
              Cook Cardiopulmonary <span className="text-vital">Engineering Lab</span>
            </>
          }
          kicker={RESEARCH.intro}
        />

        {/* Lab meta strip */}
        <div
          className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 rounded-2xl border border-line bg-white px-6 py-5"
          data-reveal
        >
          {[
            { icon: <FlaskConical size={16} />, label: RESEARCH.role },
            { icon: <MapPin size={16} />, label: RESEARCH.inst },
            { icon: <HeartPulse size={16} />, label: RESEARCH.pi },
          ].map((m, i) => (
            <div key={i} className="flex items-center gap-2.5 text-[13.5px] text-subink">
              <span className="text-vital">{m.icon}</span>
              {m.label}
            </div>
          ))}
          <span className="mono ml-auto text-[12px] tracking-wide text-faint">{RESEARCH.dates}</span>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          {RESEARCH.studies.map((s, i) => (
            <article
              key={s.title}
              className="card card-hover group flex flex-col p-7"
              data-reveal
              style={{ ['--reveal-delay' as string]: `${i * 80}ms` }}
            >
              <div className="flex items-center justify-between">
                <span className="pill">{s.tag}</span>
                <span className="mono text-[11px] text-faint">0{i + 1}</span>
              </div>
              <h3 className="mt-5 text-[19px] font-semibold leading-snug text-ink">{s.title}</h3>
              <p className="mt-3 text-[14.5px] leading-relaxed text-subink">{s.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
