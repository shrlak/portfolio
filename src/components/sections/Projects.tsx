import { PROJECTS } from '../../content';

export function Projects() {
  return (
    <section id="projects" className="section bg-night text-white">
      <div className="shell">
        <div className="max-w-2xl" data-reveal>
          <span className="eyebrow">SELECTED PROJECTS</span>
          <h2 className="display mt-5 text-[clamp(30px,4.6vw,52px)] text-white">
            Things I’ve designed, <span className="text-vital">built, and broken on purpose.</span>
          </h2>
          <p className="mt-4 text-[17px] leading-relaxed text-white/60">
            Assistive devices, structural design, and energy systems — from patented hardware to
            simulation-driven coursework.
          </p>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-2">
          {PROJECTS.map((p, i) => (
            <article
              key={p.title}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-7 transition-all duration-500 hover:-translate-y-1.5 hover:border-white/25 hover:bg-white/[0.06]"
              data-reveal
              style={{ ['--reveal-delay' as string]: `${(i % 2) * 80}ms` }}
            >
              <div className="flex items-center justify-between">
                <span className="mono text-[11px] tracking-widest text-vital">{p.domain}</span>
                <span className="mono text-[11px] text-white/30">{p.index}</span>
              </div>

              <h3 className="mt-4 text-[22px] font-semibold leading-tight text-white">{p.title}</h3>
              <p className="mt-1.5 text-[12.5px] text-white/45">
                {p.context} · {p.dates}
              </p>

              <ul className="mt-5 space-y-2.5">
                {p.bullets.slice(0, 3).map((b, bi) => (
                  <li key={bi} className="flex gap-2.5 text-[14px] leading-relaxed text-white/70">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-vital" />
                    {b}
                  </li>
                ))}
              </ul>

              <div className="mt-6 flex flex-wrap gap-2 border-t border-white/10 pt-5">
                {p.tags.map((t) => (
                  <span
                    key={t}
                    className="mono rounded-full border border-white/10 px-2.5 py-1 text-[10.5px] text-white/55"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
