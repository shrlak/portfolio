import { useEffect, useRef, useState } from 'react';
import { Film, Play, X } from 'lucide-react';
import {
  SIMULATIONS,
  SIM_FILTERS,
  SIM_INTRO,
  SIM_TOOLS,
  type SimProject,
  type SimTag,
} from '../../simulations';
import { SectionHead } from '../ui/SectionHead';

const media = (file: string) => `${import.meta.env.BASE_URL}sim/${file}`;

/* Placeholder for a clip or still that isn't in public/sim/ yet. Keeps the
   layout intact instead of showing a broken-image icon or an empty black well. */
function MediaFallback({ label }: { label?: string }) {
  return (
    <div className="flex aspect-video h-full w-full flex-col items-center justify-center gap-2.5 bg-night px-6 text-center">
      <Film size={20} className="text-white/25" />
      {label && (
        <span className="mono text-[10px] uppercase leading-relaxed tracking-widest text-white/30">
          {label}
        </span>
      )}
    </div>
  );
}

/* Case-study gallery thumbnail; falls back to a labelled tile if the file is missing. */
function GalleryImage({ src, alt }: { src: string; alt: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <div className="flex aspect-[4/3] w-full items-center justify-center rounded-lg border border-line bg-soft px-3">
        <span className="mono text-center text-[9.5px] leading-relaxed tracking-widest text-faint">
          {src}
        </span>
      </div>
    );
  }
  return (
    <img
      src={media(src)}
      alt={alt}
      loading="lazy"
      className="aspect-[4/3] w-full rounded-lg border border-line bg-white object-cover"
      onError={() => setFailed(true)}
    />
  );
}

/* Plays while in view (touch) or while hovered (pointer). Muted, looping, lazy. */
function PreviewVideo({ name, hovered }: { name: string; hovered: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [inView, setInView] = useState(false);
  const [failed, setFailed] = useState(false);
  const canHover = typeof window !== 'undefined' && window.matchMedia('(hover: hover)').matches;

  useEffect(() => {
    if (canHover || !ref.current) return;
    const obs = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.6 });
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [canHover]);

  useEffect(() => {
    const v = ref.current;
    if (!v || failed) return;
    const shouldPlay = canHover ? hovered : inView;
    if (shouldPlay) v.play().catch(() => {});
    else v.pause();
  }, [hovered, inView, canHover, failed]);

  if (failed) return <MediaFallback />;

  return (
    <video
      ref={ref}
      className="h-full w-full object-cover"
      src={media(`${name}.mp4`)}
      poster={media(`${name}-poster.jpg`)}
      muted
      loop
      playsInline
      preload="none"
      aria-hidden="true"
      onError={() => setFailed(true)}
    />
  );
}

function SimCard({ p, index, onOpen }: { p: SimProject; index: number; onOpen: () => void }) {
  const [hovered, setHovered] = useState(false);
  const [stillFailed, setStillFailed] = useState(false);
  return (
    <button
      type="button"
      onClick={onOpen}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      className="card card-hover group flex w-full flex-col overflow-hidden text-left"
      data-reveal
      style={{ ['--reveal-delay' as string]: `${(index % 3) * 70}ms` }}
    >
      <div className="relative aspect-video w-full overflow-hidden bg-night">
        {p.video ? (
          <>
            <PreviewVideo name={p.video} hovered={hovered} />
            <span className="mono pointer-events-none absolute bottom-3 right-3 hidden items-center gap-1.5 rounded-full bg-black/60 px-2.5 py-1 text-[10.5px] text-white/80 backdrop-blur [@media(hover:hover)]:inline-flex">
              <Play size={10} fill="currentColor" /> hover
            </span>
          </>
        ) : stillFailed ? (
          <MediaFallback />
        ) : (
          <img
            src={media(p.image!)}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover"
            onError={() => setStillFailed(true)}
          />
        )}
      </div>
      <div className="flex flex-1 flex-col p-6">
        <span className="mono text-[10.5px] uppercase tracking-widest text-faint">{p.course}</span>
        <h3 className="mt-2.5 text-[19px] font-semibold leading-snug text-ink">{p.title}</h3>
        <p className="mt-2.5 text-[14px] leading-relaxed text-subink">{p.blurb}</p>
        <p className="mono mt-4 text-[11.5px] leading-relaxed text-vital">{p.kpi}</p>
        <div className="mt-auto flex flex-wrap gap-1.5 pt-5">
          {p.tools.map((t) => (
            <span key={t} className="pill">
              {t}
            </span>
          ))}
        </div>
      </div>
    </button>
  );
}

function CaseStudy({ p, onClose }: { p: SimProject | null; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const [mediaFailed, setMediaFailed] = useState(false);

  useEffect(() => setMediaFailed(false), [p?.id]);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (p && !d.open) d.showModal();
    if (!p && d.open) d.close();
  }, [p]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()}
      aria-labelledby="sim-case-title"
      className="m-auto max-h-[calc(100dvh-32px)] w-[calc(100%-32px)] max-w-[960px] overflow-y-auto rounded-2xl border border-line bg-white p-0 text-ink shadow-2xl backdrop:bg-black/70 backdrop:backdrop-blur-sm"
    >
      {p && (
        <>
          <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-line bg-white/90 px-6 py-5 backdrop-blur">
            <div>
              <span className="mono text-[10.5px] uppercase tracking-widest text-faint">{p.course}</span>
              <h3 id="sim-case-title" className="mt-1.5 text-[22px] font-semibold leading-tight">
                {p.title}
              </h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close case study"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-subink hover:bg-soft hover:text-ink"
            >
              <X size={19} />
            </button>
          </div>

          <div className="px-6 pb-8 pt-6">
            <div className="overflow-hidden rounded-xl border border-line bg-night">
              {mediaFailed ? (
                <MediaFallback label={`${p.video ?? p.image} — media not added yet`} />
              ) : p.video ? (
                <video
                  key={p.id}
                  className="block aspect-video w-full"
                  src={media(`${p.video}.mp4`)}
                  poster={media(`${p.video}-poster.jpg`)}
                  controls
                  autoPlay
                  muted
                  loop
                  playsInline
                  onError={() => setMediaFailed(true)}
                />
              ) : (
                <img
                  src={media(p.image!)}
                  alt={p.title}
                  className="block w-full bg-white"
                  onError={() => setMediaFailed(true)}
                />
              )}
            </div>

            {p.gallery && (
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {p.gallery.map((g) => (
                  <GalleryImage key={g.src} src={g.src} alt={g.alt} />
                ))}
              </div>
            )}

            <dl className="mt-7 border-t border-line">
              {p.blocks.map((b) => (
                <div key={b.label} className="grid gap-1 border-b border-line py-4 sm:grid-cols-[150px_1fr] sm:gap-6">
                  <dt className="mono text-[11px] uppercase tracking-widest text-vital sm:pt-1">{b.label}</dt>
                  <dd className="text-[15px] leading-relaxed text-ink/85">
                    {b.text}
                    {b.items && (
                      <ul className="space-y-2">
                        {b.items.map((it, i) => (
                          <li key={i} className="flex gap-2.5">
                            <span className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-vital" />
                            <span>{it}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </>
      )}
    </dialog>
  );
}

function Reel() {
  const ref = useRef<HTMLVideoElement>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const v = ref.current;
    if (!v || failed) return;
    const obs = new IntersectionObserver(
      ([e]) => (e.isIntersecting ? v.play().catch(() => {}) : v.pause()),
      { threshold: 0.35 }
    );
    obs.observe(v);
    return () => obs.disconnect();
  }, [failed]);
  return (
    <div className="mt-10 overflow-hidden rounded-2xl border border-line bg-night" data-reveal>
      {failed ? (
        <MediaFallback label="reel.mp4 — montage not added yet" />
      ) : (
      <video
        ref={ref}
        className="block aspect-video w-full object-cover"
        src={media('reel.mp4')}
        poster={media('reel-poster.jpg')}
        muted
        loop
        playsInline
        preload="none"
        aria-label="Montage of simulation clips: melt pool, Segway, motor control, glucose model, page-turner"
        onError={() => setFailed(true)}
      />
      )}
    </div>
  );
}

export function Simulation() {
  const [filter, setFilter] = useState<SimTag | 'all'>('all');
  const [openId, setOpenId] = useState<string | null>(null);
  const open = SIMULATIONS.find((p) => p.id === openId) ?? null;

  return (
    <section id="simulation" className="section">
      <div className="shell">
        <SectionHead
          eyebrow={SIM_INTRO.eyebrow}
          title={
            <>
              Models, checked <span className="text-vital">against reality.</span>
            </>
          }
          kicker={SIM_INTRO.kicker}
        />

        <div className="mt-8 flex flex-wrap gap-2" data-reveal>
          {SIM_TOOLS.map((t) => (
            <span key={t} className="pill">
              {t}
            </span>
          ))}
        </div>

        <Reel />

        <div className="mt-12 flex flex-wrap gap-2" data-reveal role="toolbar" aria-label="Filter simulation projects">
          {SIM_FILTERS.map((f) => {
            const on = filter === f.key;
            return (
              <button
                key={f.key}
                type="button"
                aria-pressed={on}
                onClick={() => setFilter(f.key)}
                className={[
                  'rounded-full border px-4 py-2 text-[13px] font-medium transition-all duration-200',
                  on
                    ? 'border-ink bg-ink text-white'
                    : 'border-line bg-white text-subink hover:border-ink/30 hover:text-ink',
                ].join(' ')}
              >
                {f.label}
              </button>
            );
          })}
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SIMULATIONS.map((p, i) => (
            <div key={p.id} className={filter === 'all' || p.tags.includes(filter as SimTag) ? 'flex' : 'hidden'}>
              <SimCard p={p} index={i} onOpen={() => setOpenId(p.id)} />
            </div>
          ))}
        </div>
      </div>

      <CaseStudy p={open} onClose={() => setOpenId(null)} />
    </section>
  );
}
