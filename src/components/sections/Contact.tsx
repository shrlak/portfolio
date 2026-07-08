import { Mail, Linkedin, Github, Phone, ArrowUpRight } from 'lucide-react';
import { CONTACT } from '../../content';

export function Contact() {
  const iconFor = (label: string) => {
    switch (label) {
      case 'Email':
        return <Mail size={18} />;
      case 'LinkedIn':
        return <Linkedin size={18} />;
      case 'GitHub':
        return <Github size={18} />;
      case 'Phone':
        return <Phone size={18} />;
      default:
        return <ArrowUpRight size={18} />;
    }
  };
  return (
    <section id="contact" className="section">
      <div className="shell">
        <div className="overflow-hidden rounded-2xl2 border border-line bg-night px-7 py-14 text-white sm:px-14 md:py-20">
          <div className="grid gap-12 md:grid-cols-[1.1fr_1fr] md:items-center">
            <div>
              <span className="eyebrow" data-reveal>
                {CONTACT.eyebrow}
              </span>
              <h2
                className="display mt-5 text-[clamp(32px,5vw,58px)] text-white"
                data-reveal
                style={{ ['--reveal-delay' as string]: '60ms' }}
              >
                {CONTACT.heading}
              </h2>
              <p
                className="mt-5 max-w-md text-[16px] leading-relaxed text-white/60"
                data-reveal
                style={{ ['--reveal-delay' as string]: '120ms' }}
              >
                {CONTACT.body}
              </p>
            </div>

            <div className="grid gap-3" data-reveal style={{ ['--reveal-delay' as string]: '180ms' }}>
              {CONTACT.channels.map((c) => (
                <a
                  key={c.label}
                  href={c.href}
                  target={c.href.startsWith('http') ? '_blank' : undefined}
                  rel={c.href.startsWith('http') ? 'noreferrer' : undefined}
                  className="group flex items-center justify-between rounded-2xl border border-white/12 bg-white/[0.04] px-5 py-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-white/30 hover:bg-white/[0.08]"
                >
                  <span className="flex items-center gap-3.5">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white transition-colors group-hover:bg-vital">
                      {iconFor(c.label)}
                    </span>
                    <span>
                      <span className="mono block text-[10px] tracking-widest text-white/40">
                        {c.label.toUpperCase()}
                      </span>
                      <span className="text-[15px] font-medium text-white">{c.value}</span>
                    </span>
                  </span>
                  <ArrowUpRight
                    size={18}
                    className="text-white/40 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white"
                  />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
