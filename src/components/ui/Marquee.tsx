import { MARQUEE } from '../../content';

export function Marquee() {
  const items = [...MARQUEE, ...MARQUEE];
  return (
    <div className="border-y border-line bg-soft py-4">
      <div className="marquee-mask overflow-hidden">
        <div className="marquee-track">
          {items.map((t, i) => (
            <span key={i} className="mx-6 inline-flex items-center gap-6 text-[13px] font-medium text-subink">
              <span className="mono tracking-wide">{t}</span>
              <span className="text-vital">◆</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
