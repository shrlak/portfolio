import { useCountUp } from '../../hooks/useCountUp';

export function HeroStat({ value, label, mono }: { value: number; label: string; mono: string }) {
  const { ref, val } = useCountUp(value);
  return (
    <div className="bg-white px-4 py-5 sm:px-6">
      <div className="mono text-[10px] tracking-widest text-faint">{mono}</div>
      <div className="mt-1.5 text-[clamp(26px,4vw,40px)] font-bold tracking-tightest">
        <span ref={ref}>{val}</span>
      </div>
      <div className="mt-0.5 text-[12px] leading-tight text-subink sm:text-[13px]">{label}</div>
    </div>
  );
}
