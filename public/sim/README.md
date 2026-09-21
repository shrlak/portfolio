# public/sim/ — simulation media

Files referenced by `src/simulations.ts` and `src/components/sections/Simulation.tsx`.
Anything missing renders a labelled placeholder tile rather than a broken image,
so the section is safe to ship before every clip is finished.

Paths are built as `${import.meta.env.BASE_URL}sim/<file>`, so drop the files in
here directly — no import needed.

## Section reel
| File | Notes |
| --- | --- |
| `reel.mp4` | Montage: melt pool, Segway, motor, glucose, page-turner |
| `reel-poster.jpg` | First frame of the montage |

## Project clips
Each project with a `video:` key needs both an `.mp4` and a `-poster.jpg`.

| File | Project |
| --- | --- |
| `meltpool.mp4` / `meltpool-poster.jpg` | LPBF melt-pool model (24-321) |
| `segway.mp4` / `segway-poster.jpg` | Segway LQR balance (24-352) |
| `motor.mp4` / `motor-poster.jpg` | DC motor speed/position control (24-352) |
| `glucose.mp4` / `glucose-poster.jpg` | Glucose–insulin pump design (42-302) |
| `pageturner.mp4` / `pageturner-poster.jpg` | Assistive page-turner (24-370) |

## Stills
| File | Used by |
| --- | --- |
| `tf-homelab.jpg` | Thermal-fluids lab series card (`image:` key) |
| `pt-assembly.jpg` | Page-turner gallery — final SolidWorks assembly |
| `pt-subassembly.jpg` | Page-turner gallery — pivot-arm subassembly |
| `pt-crank.jpg` | Page-turner gallery — crank-and-gear concept |
| `pt-fea-arm.jpg` | Page-turner gallery — ANSYS von Mises on the servo arm |

## Encoding

Clips are muted, looping, `preload="none"`, and autoplay on hover (pointer) or
in view (touch), so keep them short and small — a few seconds, a few MB at most:

```sh
ffmpeg -i in.mov -an -vf "scale=1280:-2,fps=30" -c:v libx264 -crf 26 \
  -movflags +faststart out.mp4
ffmpeg -i out.mp4 -vframes 1 -q:v 4 out-poster.jpg
```
