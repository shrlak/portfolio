# Simulation clip renders

These scripts regenerate the clips in `public/sim/` for the Simulation & Design section. Each clip is 1280×720, H.264, under 1 MB, with a JPG poster frame.

| Clip | Script | Source |
|---|---|---|
| `meltpool.mp4` | `render_meltpool.py` (uses `eagar.py`) | Eagar–Tsai model, 24-321 AM project. Matches the report's cooling rates within 4%. |
| `segway.mp4` | `segway_sim.py`, then `render_segway.py` | HW9 constants and LQR weights (24-352) |
| `motor.mp4` | `render_motor.py` | Logged Arduino data `spencer_data.txt` (24-352 HW9) vs the designed transfer functions |
| `glucose.mp4` | `render_glucose.py` | `runproject_original.m` model and parameters (42-302) |
| `pageturner.mp4` | `render_pageturner.py` | SolidWorks and ANSYS figures from the 24-370 Group 17 report |
| `reel.mp4` | ffmpeg concat of the clips above | — |

Requirements: Python 3 with numpy, scipy, matplotlib, and pillow, plus ffmpeg. The scripts write frames to `/tmp/w/...` and encode into `/tmp/w/media/`. Adjust the paths at the top of each script if you run them elsewhere.

`matlab_export_animation.m` is a VideoWriter template for exporting the same kind of clip straight from MATLAB.
