import { ABOUT, EDUCATION } from '../../content';

export function About() {
  return (
    <section id="about" className="section">
      <div className="shell grid gap-14 md:grid-cols-[1.3fr_1fr] md:gap-20">
        <div>
          <span className="eyebrow" data-reveal>
            {ABOUT.eyebrow}
          </span>
          <h2
            className="display mt-5 text-[clamp(26px,3.8vw,42px)]"
            data-reveal
            style={{ ['--reveal-delay' as string]: '60ms' }}
          >
            {ABOUT.heading}
          </h2>
          <div className="mt-7 space-y-5 text-[17px] leading-relaxed text-subink">
            {ABOUT.body.map((p, i) => (
              <p key={i} data-reveal style={{ ['--reveal-delay' as string]: `${120 + i * 80}ms` }}>
                {p}
              </p>
            ))}
          </div>
        </div>

        <div className="md:pt-12">
          <div
            className="card overflow-hidden"
            data-reveal
            style={{ ['--reveal-delay' as string]: '160ms' }}
          >
            {ABOUT.facts.map((f, i) => (
              <div
                key={f.label}
                className={['flex flex-col gap-1 px-6 py-5', i !== 0 ? 'border-t border-line' : ''].join(' ')}
              >
                <span className="mono text-[10px] tracking-widest text-vital">{f.label}</span>
                <span className="text-[15px] font-medium text-ink">{f.value}</span>
              </div>
            ))}
          </div>

          <div
            className="mt-6 grid grid-cols-2 gap-4"
            data-reveal
            style={{ ['--reveal-delay' as string]: '240ms' }}
          >
            {EDUCATION.map((e) => (
              <div key={e.inst} className="card card-hover p-5">
                <div className="mono text-[10px] tracking-widest text-faint">{e.dates}</div>
                <div className="mt-2 text-[15px] font-semibold leading-tight text-ink">{e.inst}</div>
                <div className="mt-1 text-[12.5px] leading-snug text-subink">{e.credential}</div>
                <div className="mt-3 inline-flex rounded-md bg-vital-soft px-2 py-1 text-[11px] font-semibold text-vital">
                  {e.gpa}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
