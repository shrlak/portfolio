import { Mail, Linkedin, Github, Cog } from 'lucide-react';
import { PERSON } from '../../content';

export function Footer() {
  return (
    <footer className="border-t border-line py-10">
      <div className="shell flex flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-ink text-white">
            <Cog size={14} />
          </span>
          <span className="text-[14px] font-semibold">{PERSON.fullName}</span>
        </div>
        <p className="mono text-[11px] tracking-wide text-faint">
          {PERSON.primaryMajor} + {PERSON.additionalMajor} · {PERSON.institution} · {PERSON.classYear}
        </p>
        <div className="flex items-center gap-4">
          <a
            href={PERSON.linkedin}
            target="_blank"
            rel="noreferrer"
            className="text-faint transition-colors hover:text-ink"
            aria-label="LinkedIn"
          >
            <Linkedin size={18} />
          </a>
          <a
            href={PERSON.github}
            target="_blank"
            rel="noreferrer"
            className="text-faint transition-colors hover:text-ink"
            aria-label="GitHub"
          >
            <Github size={18} />
          </a>
          <a
            href={`mailto:${PERSON.email}`}
            className="text-faint transition-colors hover:text-ink"
            aria-label="Email"
          >
            <Mail size={18} />
          </a>
        </div>
      </div>
    </footer>
  );
}
