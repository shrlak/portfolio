import { SKILLS } from '../../content';
import { SectionHead } from '../ui/SectionHead';

export function Skills() {
  return (
    <section id="skills" className="section bg-soft">
      <div className="shell">
        <SectionHead eyebrow="TOOLKIT" title="Software, shop & instrumentation" />
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {SKILLS.map((group, i) => (
            <div
              key={group.group}
              className="card p-7"
              data-reveal
              style={{ ['--reveal-delay' as string]: `${i * 90}ms` }}
            >
              <h3 className="text-[17px] font-semibold text-ink">{group.group}</h3>
              <p className="mono mt-1 text-[11px] tracking-wide text-faint">{group.note}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {group.items.map((it) => (
                  <span key={it} className="pill">
                    {it}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
