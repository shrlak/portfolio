import { FileText, FlaskConical } from 'lucide-react';
import { PUBLICATIONS } from '../../content';
import { SectionHead } from '../ui/SectionHead';

export function Publications() {
  return (
    <section id="publications" className="section">
      <div className="shell">
        <SectionHead
          eyebrow="PUBLICATIONS & PATENTS"
          title="Work on the record"
          kicker="Conference abstracts from the lab and a granted patent as sole inventor."
        />
        <div className="mt-12 divide-y divide-line border-y border-line">
          {PUBLICATIONS.map((p, i) => (
            <article
              key={p.title}
              className="group grid gap-4 py-7 md:grid-cols-[130px_1fr_auto] md:gap-8"
              data-reveal
              style={{ ['--reveal-delay' as string]: `${i * 70}ms` }}
            >
              <div className="flex items-center gap-3 md:flex-col md:items-start md:gap-2">
                <span
                  className={[
                    'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold tracking-wide',
                    p.kind === 'PATENT' ? 'bg-vital-soft text-vital' : 'bg-soft text-subink',
                  ].join(' ')}
                >
                  {p.kind === 'PATENT' ? <FileText size={12} /> : <FlaskConical size={12} />}
                  {p.kind}
                </span>
                <span className="mono text-[13px] text-faint">{p.year}</span>
              </div>

              <div>
                <h3 className="text-[17px] font-semibold leading-snug text-ink transition-colors group-hover:text-vital">
                  {p.title}
                </h3>
                <p className="mt-2 text-[13.5px] leading-relaxed text-subink">{p.authors}</p>
                <p className="mt-2 text-[13px] text-faint">{p.venue}</p>
              </div>

              <div className="md:self-center">
                <span className="mono whitespace-nowrap text-[11px] tracking-wide text-vital">
                  {p.status}
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
