export function SectionHead({
  eyebrow,
  title,
  kicker,
}: {
  eyebrow: string;
  title: React.ReactNode;
  kicker?: string;
}) {
  return (
    <div className="max-w-2xl" data-reveal>
      <span className="eyebrow">{eyebrow}</span>
      <h2 className="display mt-5 text-[clamp(30px,4.6vw,52px)]">{title}</h2>
      {kicker && <p className="mt-4 text-[17px] leading-relaxed text-subink">{kicker}</p>}
    </div>
  );
}
