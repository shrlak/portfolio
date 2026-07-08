export function GearGlyph({ teeth, r }: { teeth: number; r: number }) {
  const ri = r * 0.62;
  const rh = r * 0.3;
  const tooth = r * 0.16;
  const path: string[] = [];
  const seg = (Math.PI * 2) / teeth;
  const pt = (ang: number, rad: number) =>
    `${(Math.cos(ang) * rad + 50).toFixed(2)},${(Math.sin(ang) * rad + 50).toFixed(2)}`;
  for (let i = 0; i < teeth; i++) {
    const a0 = i * seg;
    const a1 = a0 + seg * 0.32;
    const a2 = a0 + seg * 0.5;
    const a3 = a0 + seg * 0.82;
    path.push(
      `${i === 0 ? 'M' : 'L'}${pt(a0, r - tooth)}`,
      `L${pt(a1, r)}`,
      `L${pt(a2, r)}`,
      `L${pt(a3, r - tooth)}`
    );
  }
  return (
    <>
      <path d={`${path.join(' ')} Z`} fill="none" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="50" cy="50" r={ri} fill="none" stroke="currentColor" strokeWidth="1" opacity="0.5" />
      <circle cx="50" cy="50" r={rh} fill="none" stroke="currentColor" strokeWidth="1.4" />
      {[0, 60, 120, 180, 240, 300].map((deg) => {
        const a = (deg * Math.PI) / 180;
        return (
          <line
            key={deg}
            x1={(Math.cos(a) * rh + 50).toFixed(2)}
            y1={(Math.sin(a) * rh + 50).toFixed(2)}
            x2={(Math.cos(a) * ri + 50).toFixed(2)}
            y2={(Math.sin(a) * ri + 50).toFixed(2)}
            stroke="currentColor"
            strokeWidth="0.8"
            opacity="0.4"
          />
        );
      })}
    </>
  );
}
