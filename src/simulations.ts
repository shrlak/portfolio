/* ----------------------------------------------------------------------------
 * SIMULATION & DESIGN — case studies
 *
 * Every figure below comes from the original reports, scripts, and logged data
 * in the CMU coursework folder (24-321, 24-352, 42-302, 24-370). Clips live in
 * public/sim/ and were rendered by tools/sim-renders/.
 * -------------------------------------------------------------------------- */

export type SimTag = 'thermal' | 'controls' | 'cad' | 'bio' | 'comp';

export const SIM_FILTERS: Array<{ key: SimTag | 'all'; label: string }> = [
  { key: 'all', label: 'All' },
  { key: 'thermal', label: 'Thermal' },
  { key: 'controls', label: 'Controls' },
  { key: 'cad', label: 'CAD / FEA' },
  { key: 'bio', label: 'Biomedical' },
  { key: 'comp', label: 'Computation' },
];

export const SIM_TOOLS = [
  'MATLAB',
  'Simulink',
  'SolidWorks',
  'ANSYS Mechanical',
  'Python · NumPy / SciPy',
  'Arduino / C++',
  'PID · pole placement · LQR',
];

export type SimBlock = { label: string; text?: string; items?: string[] };

export type SimProject = {
  id: string;
  tags: SimTag[];
  course: string;
  title: string;
  blurb: string;
  kpi: string;
  tools: string[];
  /** basename in public/sim/ — expects <video>.mp4 and <video>-poster.jpg */
  video?: string;
  /** static image in public/sim/ when there is no clip */
  image?: string;
  gallery?: Array<{ src: string; alt: string }>;
  blocks: SimBlock[];
};

export const SIM_INTRO = {
  eyebrow: 'SIMULATION & DESIGN',
  kicker:
    'I build models and then check them against data. That means physics-based simulation in MATLAB and Simulink, CAD and FEA for mechanical design, and controllers I tune on real hardware. Every project below shows the setup, the result, and how I validated it.',
};

export const SIMULATIONS: SimProject[] = [
  {
    id: 'meltpool',
    tags: ['thermal', 'comp'],
    course: '24-321 Thermal-Fluids · Spring 2026',
    title: 'Laser powder-bed fusion melt-pool model',
    blurb:
      'A moving Gaussian heat source (Eagar–Tsai) in 316L stainless steel. I swept laser power, scan speed, and spot size, then fit the thermal conductivity to measured temperatures.',
    kpi: 'G = 2.9×10⁵ → 1.45×10⁶ K/s over 0.2–1.0 m/s · fitted k = 26.37 W/m·K',
    tools: ['MATLAB', 'fminsearch', 'Python re-render'],
    video: 'meltpool',
    blocks: [
      {
        label: 'Problem',
        text: 'In metal 3D printing, the melt-pool depth and cooling rate set the part’s microstructure and whether it has defects. The goal was to predict both as laser power P, scan speed v, and spot radius r change, and to recover an unknown thermal conductivity from test data.',
      },
      {
        label: 'Model',
        text: 'Quasi-steady Eagar–Tsai solution for a Gaussian laser moving over a semi-infinite 316L plate, with conduction only. Inputs: c = 0.63 J/g·K, ρ = 7575 kg/m³, absorptivity 0.6, T₀ = 300 K, Tₘ = 1723 K.',
      },
      {
        label: 'Setup',
        items: [
          'Centerline temperature for P = 400 W at v = 0.2, 0.6, 1.0 m/s, and for v = 1 m/s at P = 100, 250, 400 W',
          'Melt-pool width and depth from the T = Tₘ isotherm across the full v and P sweeps',
          'Cooling rate G = v·dT/dx evaluated numerically at the back of the pool',
          'Inverse problem: minimized the RMSE between the model and measured centerline T to estimate k (grid search, then fminsearch)',
        ],
      },
      {
        label: 'Results',
        items: [
          'G rises linearly with speed, from 2.9×10⁵ to 1.45×10⁶ K/s. It falls as power rises: 5.9×10⁶ K/s at 100 W versus 1.45×10⁶ K/s at 400 W.',
          'Depth climbs steeply as v drops but roughly linearly with P, so speed is the stronger lever on depth.',
          'Mean top-surface temperature falls from about 4380 K to about 3580 K as r grows from 25 to 100 µm.',
          'Best-fit conductivity: k = 26.37 W/m·K.',
        ],
      },
      {
        label: 'Validation',
        items: [
          'A lumped-capacitance casting estimate gives about 179 K/s at Tₘ. That is 3–4 orders of magnitude slower than LPBF, as expected for a 1 cm³ cube in convection.',
          'I re-implemented the model independently in Python. It reproduces the report’s cooling rates within 4%: 2.8×10⁵ vs 2.9×10⁵, 1.40×10⁶ vs 1.45×10⁶, and 5.88×10⁶ vs 5.9×10⁶ K/s.',
          'Known limits: no latent heat, no Marangoni convection in the pool, and no powder layer. All three push the predicted pool larger and hotter than reality.',
        ],
      },
      {
        label: 'Takeaway',
        text: 'To control depth, change scan speed. To get faster cooling and a finer microstructure, raise speed or cut power. This is a conduction-only first pass that shows where a CFD or phase-change model would be needed.',
      },
      {
        label: 'My role',
        text: '3-person lab team. I co-wrote the MATLAB sweeps and the conductivity fit, and did the Python re-implementation and animation shown here.',
      },
    ],
  },
  {
    id: 'segway',
    tags: ['controls', 'comp'],
    course: '24-352 Dynamic Systems & Controls · Spring 2026',
    title: 'Segway balance: from nonlinear EOM to LQR',
    blurb:
      'I derived the wheel and body equations of motion, linearized them about upright, and compared classical PD, pole placement, and LQR on the full nonlinear model.',
    kpi: 'Recovers a 15° lean plus 3π wheel offset · peak torque 84 N·m (limit 100)',
    tools: ['MATLAB', 'Simulink', 'lqr / place'],
    video: 'segway',
    blocks: [
      {
        label: 'Problem',
        text: 'Stabilize an inverted-pendulum Segway (42 kg wheel assembly, 72.3 kg rider/body, L = 1.08 m) from a 15° lean while also driving the wheel back to its start, all under a 100 N·m motor-torque limit.',
      },
      {
        label: 'Model',
        text: 'Lagrangian EOM in matrix form: [A, B sinφ; B sinφ, C]·[θ̈; φ̈] + [B cosφ φ̇²; G cosφ] = [τ; −τ]. Linearized about φ = π/2 with state x = [φ − π/2, θ, φ̇, θ̇].',
      },
      {
        label: 'Setup',
        items: [
          'Classical PD on lean only, designed for 40% overshoot and Tₛ = 2 s',
          'Pole placement at s = −200, −100, −50, −1',
          'LQR with Q = diag(1, 2, 0.01, 0.001) and R = 1, tuned against the torque limit',
          'All three controllers run on the nonlinear Simulink plant, not the linear model',
        ],
      },
      {
        label: 'Results',
        items: [
          'LQR gain K = [−372, −1.41, −91.9, −4.58]. Closed-loop poles are −4.34 ± 0.03j and −0.36 ± 0.36j.',
          'The body is upright in about 1.5 s. The slow pole pair then walks the wheel back to θ = 0.',
          'Peak |τ| = 84 N·m, inside the 100 N·m limit.',
        ],
      },
      {
        label: 'Validation',
        items: [
          'Checked the linear model against the nonlinear response starting 15° off upright.',
          'Pole placement at −200 needs gains around 10⁶. It stabilizes the model on paper but saturates any real motor. That result is why I moved to LQR.',
        ],
      },
      {
        label: 'Takeaway',
        text: 'LQR puts the trade-off between speed and actuator effort in one tunable place (Q/R) instead of hand-picked pole locations. Checking the nonlinear plant is what catches designs that only work on the linear model.',
      },
      {
        label: 'My role',
        text: 'Individual assignment: derivation, MATLAB setup script, Simulink tuning. The animation was re-simulated from my equations and gains.',
      },
    ],
  },
  {
    id: 'motor',
    tags: ['controls'],
    course: '24-352 Dynamic Systems & Controls · Spring 2026',
    title: 'DC motor speed and position control on hardware',
    blurb:
      'I designed PI speed and PD position loops by pole placement, ran them on an Arduino motor rig, and overlaid the logged responses on the designed closed loop. The data didn’t match the model, and the mismatch explained why.',
    kpi: 'Speed steady-state error −0.003 rad/s · hardware rises ~4× faster than designed',
    tools: ['Arduino / C++', 'MATLAB', 'Pole placement'],
    video: 'motor',
    blocks: [
      {
        label: 'Problem',
        text: 'Close speed and position loops on a small encoder DC motor, then check how well a second-order pole-placement design predicts real hardware.',
      },
      {
        label: 'Model',
        text: 'Motor model identified from open-loop tests. Designed closed loops: speed 109/(s² + 20s + 109), with ζ ≈ 0.96 and essentially no overshoot, and position 256/(s² + 9.6s + 256), with ζ = 0.30 and 37% overshoot.',
      },
      {
        label: 'Setup',
        items: [
          'Gains computed in MATLAB, then implemented as discrete PI/PD on the Arduino',
          '5 rad/s speed step and 0.1 rad position step, logged over serial',
          'MATLAB script parses the log and computes steady-state error, overshoot, and 2% settling time',
        ],
      },
      {
        label: 'Results',
        items: [
          'Speed settles at 5.003 rad/s, a −0.003 rad/s error, so the integral action works. It reaches 90% in 0.035 s against about 0.2 s designed, and peaks at 6.35 rad/s (27%).',
          'Position reaches 90% in 0.033 s, then chatters ±0.015 rad (up to 0.119 rad) around the setpoint before locking at 0.100 rad.',
        ],
      },
      {
        label: 'Validation',
        text: 'The hardware is much faster and less damped than the model, which points to an under-estimated plant gain or time constant in the identification. The position chatter matches encoder quantization amplified by the unfiltered derivative term, plus gearbox deadband. Fixes: re-identify the plant from the step data, low-pass the D-term, and add a deadband compensator.',
      },
      {
        label: 'Takeaway',
        text: 'Always overlay hardware data on the model. The mismatch told me more about the plant than the design did.',
      },
      { label: 'My role', text: 'Individual lab: gain design, Arduino code, data collection, analysis.' },
    ],
  },
  {
    id: 'glucose',
    tags: ['bio', 'comp'],
    course: '42-302 Physiological Systems Modeling · Spring 2026',
    title: 'Glucose–insulin dynamics and insulin-pump design',
    blurb:
      'I built a nonlinear two-compartment glucose–insulin model in Simulink and MATLAB, simulated healthy, Type-1, and Type-2 diabetic subjects, then designed 24-hour pump schedules against clinical limits.',
    kpi: 'Basal + bolus: SD 0.167 mg/mL · min 0.72 · 0 min above 1.8',
    tools: ['Simulink', 'MATLAB ode45'],
    video: 'glucose',
    blocks: [
      {
        label: 'Problem',
        text: 'Predict blood glucose after meals for different patient types, then design an insulin infusion that keeps a Type-1 diabetic between 0.7 and 1.8 mg/mL, with no more than 30 consecutive minutes above 1.8.',
      },
      {
        label: 'Model',
        text: 'Two coupled nonlinear ODEs for plasma glucose x and insulin y, with liver release, insulin-dependent uptake (ν·x·y), renal excretion above threshold θ, and pancreatic secretion above φ. Type-2 is modeled as ν × 0.2 and Type-1 as β × 0.2.',
      },
      {
        label: 'Setup',
        items: [
          'Single-meal response for normal, T2D, T2D with medication (Q_L × 0.8, θ = 1.4), and T1D subjects',
          '24 h with four meals, comparing three pump schedules: constant basal, bolus only, and basal + bolus',
          'Three structural modifications of the Simulink model to test sensitivity',
          'Constraints checked on a 1-minute interpolated grid',
        ],
      },
      {
        label: 'Results',
        items: [
          'Constant basal (350 mU/hr): SD 0.178, min 0.79, passes both limits.',
          'Bolus only: SD 0.232, dips to 0.60, and fails the hypoglycemia floor.',
          'Basal + bolus: lowest variability (SD 0.167) and passes both limits.',
        ],
      },
      {
        label: 'Validation',
        text: 'Steady-state initial conditions for each subject type were confirmed by holding the model with zero input. The pass/fail checks run automatically for every schedule. The numbers above come from re-running my model with its original parameters.',
      },
      {
        label: 'Takeaway',
        text: 'A small basal rate plus meal-timed boluses mirrors how real pumps are programmed. Bolus alone lets glucose drift low between meals.',
      },
      { label: 'My role', text: 'Individual project: Simulink model, MATLAB drivers, pump design, analysis.' },
    ],
  },
  {
    id: 'pageturner',
    tags: ['cad'],
    course: '24-370 Mechanical Design · Fall 2025',
    title: 'Assistive page-turner for limited hand mobility',
    blurb:
      'A bidirectional page-turner for readers with cerebral palsy, taken from user survey through SolidWorks concepts, hand calcs, ANSYS FEA, and a costed BOM.',
    kpi: 'Wheel-torque FOS ≈ 76 · pivot-arm FEA FOS 5.33 · COGS $66 vs $199 incumbent',
    tools: ['SolidWorks', 'ANSYS Mechanical', 'Arduino'],
    video: 'pageturner',
    gallery: [
      { src: 'pt-assembly.jpg', alt: 'Final page-turner assembly in SolidWorks' },
      { src: 'pt-subassembly.jpg', alt: 'Pivot-arm subassembly with rubber wheel' },
      { src: 'pt-crank.jpg', alt: 'Early crank-and-gear concept' },
      { src: 'pt-fea-arm.jpg', alt: 'ANSYS von Mises stress on the servo arm' },
    ],
    blocks: [
      {
        label: 'Problem',
        text: 'Of surveyed readers with CP, 90% struggle to turn pages and 80% avoid physical books. The leading device needs manual pre-loading every 10 pages. The goal was hands-free, single-page, bidirectional turning with no page damage.',
      },
      {
        label: 'Geometry / CAD',
        text: 'Three concept rounds in SolidWorks: a servo sweep, a crank-and-gear belt, and an articulated servo arm. The final design uses a 12 V DC motor wheel that pre-bends the top sheet, then a servo fork sweeps it across. The lever flips sides to reverse direction.',
      },
      {
        label: 'Setup',
        items: [
          'Hand calc: wheel–paper FBD with F_b = 0.10 N and r = 32.2 mm, giving τ_req = 0.00322 N·m against the SG90’s 0.245 N·m. No slip, since μ_rubber = 0.60 > μ_paper = 0.44.',
          'ANSYS static structural on the PLA arm (yield about 60 MPa): 0.1 N page load on the servo arm, plus a 5 N user load on the lever end',
        ],
      },
      {
        label: 'Results',
        items: [
          'The pivot arm has an FEA factor of safety of 5.33. The simple wheel hand calc gives about 76 because it ignores the arm geometry.',
          'COGS is $66.12 at 250 units per year, priced at $119.99 (about 45% margin) against the $199 incumbent.',
        ],
      },
      {
        label: 'Validation',
        text: 'Cross-checked the hand calc against FEA. The large gap showed the arm’s bending, not the wheel torque, is the design-limiting load, which shifted refinement effort to the arm section.',
      },
      {
        label: 'Takeaway',
        text: 'Start from user research, size with hand calcs, and use FEA to find the component that actually governs the design.',
      },
      {
        label: 'My role',
        text: '6-person team. I co-led the summary and early ideation, and owned manufacturing drawings, the BOM and costing, and continuous improvement. Teammates ran the ANSYS studies.',
      },
    ],
  },
  {
    id: 'thermal-labs',
    tags: ['thermal'],
    course: '24-321 Thermal-Fluids Experimentation · Spring 2026',
    title: 'Thermal-fluids lab series: conduction, fins, wakes, lumped models',
    blurb:
      'A series of experiments, each paired with a model and a formal uncertainty analysis: linear conduction, fin heat-transfer coefficient, cylinder wake velocity, and a lumped-capacitance stove test at home.',
    kpi: 'Stove heat input 734.7 ± 6.0 W (24% of the burner rating) · k_brass = 149.2 W/m·K',
    tools: ['MATLAB', 'Python', 'DAQ'],
    image: 'tf-homelab.jpg',
    blocks: [
      {
        label: 'Problem',
        text: 'Extract physical properties from imperfect measurements and quantify how far to trust them.',
      },
      {
        label: 'Setup',
        items: [
          'HT11 linear conduction: brass k, contact resistance with and without paste, reduced-area section, paper k',
          'Fin lab: estimated h from transient fin temperatures',
          'C15 wake: pitot traverse behind a cylinder to get the velocity deficit and drag',
          'Home lab: energy balance on a pot of water, q_in fit by least squares on a lumped-capacitance model',
        ],
      },
      {
        label: 'Results',
        items: [
          'k_brass = 149.2 W/m·K. Removing the thermal paste raised contact resistance from 0.11 to 1.00 K/W. k_paper = 0.60 W/m·K.',
          'Stove heat actually entering the water was 734.7 ± 6.0 W for the 7″ pot and 1070 ± 16 W for the 11.9″ pot. That is 24% and 35% of the 3077 W rating.',
        ],
      },
      {
        label: 'Validation',
        text: 'k_brass came out 36% high. I traced this to unmodeled radial convection and radiation loss. The q_in uncertainty is the band where the MSE rises 20% above its minimum.',
      },
      {
        label: 'Takeaway',
        text: 'Uncertainty bands and a physical explanation for every discrepancy are what separate a measurement from a guess.',
      },
      { label: 'My role', text: '3-person lab team: data reduction scripts, uncertainty analysis, report sections.' },
    ],
  },
];
