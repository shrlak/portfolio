# Simulation & Design section: handoff notes for Claude Code

Branch: `feat/simulation-section`. Commit: "Add Simulation & Design section with motion case studies"

## What was added
| Path | Purpose |
|---|---|
| `src/components/sections/Simulation.tsx` | The section: reel, tool pills, filter tabs, video cards, `<dialog>` case study |
| `src/simulations.ts` | All card and case-study content (edit text here) |
| `public/sim/*.mp4, *-poster.jpg, *.jpg` | Clips (H.264, 1280×720, each < 1 MB), posters, CAD/FEA stills |
| `tools/sim-renders/` | Python scripts that regenerate every clip, plus a MATLAB VideoWriter template |
| `src/App.tsx` | Mounts `<Simulation />` after `<Projects />` and adds `'simulation'` to SECTION_IDS |
| `src/content.ts` | NAV_ITEMS: adds Simulation → `#simulation` |
| `src/components/chrome/Nav.tsx` | Desktop links from `lg`, hamburger below `lg`, Download CV from `xl` (so 8 links fit) |

## Where the source material lives (iCloud)
Root: `~/Library/Mobile Documents/com~apple~CloudDocs/CMU/2025-26/`
- Melt pool: `sem2/24-321/Lab 1 AM Project/` (report PDF, `Melt_Pool_Conduction_Model.m`, `plots/`)
- Segway / motor: `sem2/24-352/HW/HW9/` (`HW9_segway_setup.m`, `motor_control_analysis.m`, `spencer_data.txt`, `segway.slx`)
- Glucose: `sem2/42-302/project/` (`project1_*/runproject_*.m`, `.slx` models, `42-302 Project.pdf`)
- Page-turner: `sem 1/24-370/project/24-370 Group 17 Final Project Report.pdf`
- Thermal labs: `sem2/24-321/HT11/`, `sem2/24-321/homelab/`, `sem2/24-321/C15G/`, `sem2/24-321/Lab 2 HTFin/`

## Verified
- `npm run build` passes (tsc + vite)
- No horizontal overflow at 390, 900, 1024, or 1280 px. Filters work. The dialog opens, and closes on Esc and on a backdrop click.
- The melt-pool Python re-implementation matches the report's cooling rates within 4%. The LQR peak torque of 84 N·m matches the design comment in `HW9_segway_setup.m`.

## Open to-dos
1. Replace the page-turner slideshow with a real SolidWorks turntable or exploded-view export, re-encoded with:
   `ffmpeg -i in.avi -vf "scale=1280:-2,fps=30" -c:v libx264 -crf 26 -an -movflags +faststart public/sim/pageturner.mp4`
2. Check every "My role" line in `src/simulations.ts`.
3. The existing Projects card P-01 says "Ran hand calculations and FEA". The report credits teammates for FEA, so reword it to match.
4. Cook Lab / PAS work is excluded on purpose until the PI approves.
5. Optional: the 24-370 card is a `<button>` wrapping block elements. Swap it for an `<article>` plus a stretched link if an HTML validator complains.
