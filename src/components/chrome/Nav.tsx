import { useEffect, useState } from 'react';
import { ArrowUpRight, ArrowRight, Menu, X, Cog } from 'lucide-react';
import { CONTACT, NAV_ITEMS, PERSON } from '../../content';
import { useScrolled } from '../../hooks/useScrolled';

export function Nav({ active }: { active: string }) {
  const scrolled = useScrolled(20);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <header
      className={[
        'fixed inset-x-0 top-0 z-50 transition-all duration-300',
        scrolled
          ? 'border-b border-line bg-white/80 backdrop-blur-xl'
          : 'border-b border-transparent bg-transparent',
      ].join(' ')}
    >
      <div className="shell flex h-16 items-center justify-between">
        <a href="#top" className="group flex items-center gap-2.5" aria-label="Spencer Kim — home">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-ink text-white transition-transform duration-300 group-hover:rotate-12">
            <Cog size={17} strokeWidth={2} />
          </span>
          <span className="text-[15px] font-semibold tracking-tight">Spencer Kim</span>
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="navlink"
              data-active={active && item.href === `#${active}` ? 'true' : undefined}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <a href={PERSON.cvHref} download="Spencer Kim - CV.pdf" className="btn btn-ghost !px-4 !py-2 !text-[13px]">
            Download CV
          </a>
          <a href={CONTACT.channels[0].href} className="btn btn-primary !px-4 !py-2 !text-[13px]">
            Get in touch <ArrowRight size={15} />
          </a>
        </div>

        <button
          className="flex h-10 w-10 items-center justify-center rounded-lg text-ink md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile sheet */}
      <div
        className={[
          'md:hidden overflow-hidden border-t border-line bg-white transition-[max-height,opacity] duration-300',
          open ? 'max-h-[80vh] opacity-100' : 'max-h-0 opacity-0',
        ].join(' ')}
      >
        <nav className="shell flex flex-col gap-1 py-4">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="flex items-center justify-between rounded-xl px-3 py-3 text-[17px] font-medium text-ink hover:bg-soft"
            >
              {item.label}
              <ArrowUpRight size={17} className="text-faint" />
            </a>
          ))}
          <a
            href={PERSON.cvHref}
            download="Spencer Kim - CV.pdf"
            onClick={() => setOpen(false)}
            className="btn btn-ghost mt-2 justify-center"
          >
            Download CV
          </a>
          <a
            href={CONTACT.channels[0].href}
            onClick={() => setOpen(false)}
            className="btn btn-primary justify-center"
          >
            Get in touch <ArrowRight size={16} />
          </a>
        </nav>
      </div>
    </header>
  );
}
