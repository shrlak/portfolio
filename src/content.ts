/* ----------------------------------------------------------------------------
 * CONTENT — Spencer Hoyun Kim
 * Undergraduate · Carnegie Mellon University
 * B.S. Mechanical Engineering & Biomedical Engineering · Class of 2027
 *
 * All content grounded in the CV of record. Descriptions paraphrase the CV
 * without inventing figures beyond what it states.
 * -------------------------------------------------------------------------- */

export const PERSON = {
  shortName: 'Spencer Kim',
  fullName: 'Spencer Hoyun Kim',
  email: 'spencer3@cmu.edu',
  personalEmail: 'spencerkim1235@gmail.com',
  phone: '+1 (404) 740-1028',
  phoneHref: 'tel:+14047401028',
  linkedin: 'https://www.linkedin.com/in/shrla/',
  linkedinHandle: 'in/shrla',
  github: 'https://github.com/shrlak',
  githubHandle: 'shrlak',
  location: 'Pittsburgh, PA',
  citizenship: 'U.S. Citizen',
  institution: 'Carnegie Mellon University',
  primaryMajor: 'Mechanical Engineering',
  additionalMajor: 'Biomedical Engineering',
  classYear: 'Class of 2027',
  lab: 'Cook Cardiopulmonary Engineering Lab',
  pi: 'Keith E. Cook, PhD',
  cvHref: `${import.meta.env.BASE_URL}spencer-kim-cv.pdf`,
};

export const HERO = {
  eyebrow: 'MECHANICAL + BIOMEDICAL ENGINEERING',
  name: 'Spencer Kim',
  headline: ['Engineering the', 'hardware that keeps', 'people alive.'],
  subhead:
    'Undergraduate researcher at Carnegie Mellon building artificial-organ support and assistive medical devices — from ambulatory lung machines to a patented sensing cane.',
  stats: [
    { value: 2027, label: 'B.S. — ME + BME', prefix: '', suffix: '', mono: 'CLASS OF' },
    { value: 1, label: 'granted patent', prefix: '', suffix: '', mono: 'KR 10-2675388' },
    { value: 2, label: 'conference abstracts', prefix: '', suffix: '', mono: 'ISTH · MCS' },
  ],
};

export const MARQUEE = [
  'ARTIFICIAL LUNGS',
  'ECMO',
  'PULMONARY ASSIST SYSTEM',
  'ANTICOAGULATION',
  'SOLIDWORKS',
  'ANSYS / FEA',
  'FORMULA SAE',
  'MATLAB',
  'HEMOCOMPATIBILITY',
  'ASSISTIVE DEVICES',
  'FUSION 360',
  'PATENTED INVENTOR',
];

export const ABOUT = {
  eyebrow: 'PROFILE',
  heading: 'I work at the boundary between a living system and an engineered one.',
  body: [
    'I’m a Mechanical and Biomedical Engineering undergraduate at Carnegie Mellon, drawn to the moment a device has to take over for a failing organ. My research home is the Cook Cardiopulmonary Engineering Lab, where I help evaluate a Pulmonary Assist System — a compact, ambulatory alternative to conventional ECMO — and study anticoagulation strategies that keep blood-contacting surfaces from clotting.',
    'That same instinct — build the thing that helps a person keep moving — runs through my project work: a patented obstacle-sensing cane for the visually impaired, an assistive page-turner for readers with limited hand mobility, and a full-electric Formula SAE car. I like problems where mechanical design and human physiology have to agree on an answer.',
  ],
  facts: [
    { label: 'FOCUS', value: 'Artificial organs · assistive medical devices' },
    { label: 'BASED IN', value: 'Pittsburgh, PA · from Duluth, GA' },
    { label: 'STATUS', value: 'U.S. Citizen · open to Summer 2026 roles' },
    { label: 'LANGUAGES', value: 'English (fluent) · Korean (fluent)' },
  ],
};

/* ── Education ─────────────────────────────────────────────────────── */

export const EDUCATION: Array<{
  inst: string;
  loc: string;
  credential: string;
  detail: string;
  gpa: string;
  dates: string;
}> = [
  {
    inst: 'Carnegie Mellon University',
    loc: 'Pittsburgh, PA',
    credential: 'B.S. Mechanical Engineering & Biomedical Engineering',
    detail: 'College of Engineering',
    gpa: 'GPA 3.32 / 4.0',
    dates: 'Expected May 2027',
  },
  {
    inst: 'Northview High School',
    loc: 'Duluth, GA',
    credential: 'High School Diploma',
    detail: '',
    gpa: 'GPA 3.8 / 4.0',
    dates: 'May 2023',
  },
];

/* ── Research ──────────────────────────────────────────────────────── */

export const RESEARCH = {
  eyebrow: 'RESEARCH',
  lab: 'Cook Cardiopulmonary Engineering Lab',
  role: 'Undergraduate Student Researcher',
  inst: 'Carnegie Mellon University · Department of Biomedical Engineering',
  pi: 'Principal Investigator — Keith E. Cook, PhD',
  dates: 'May 2025 — Present',
  intro:
    'Cardiopulmonary device research spanning large-animal evaluation of an ambulatory lung machine and the anticoagulation chemistry that makes chronic blood-contacting devices safe.',
  studies: [
    {
      tag: 'OVINE · 30-DAY',
      title: '30-Day Sheep Study — Pulmonary Assist System',
      body: 'Long-term ambulatory respiratory support for chronic lung disease: testing whether the Pulmonary Assist System (PAS), paired with oral anticoagulation and biocompatible surface coatings, can safely provide 30 days of support in an ovine model. Assist with sheep surgery, blood sampling, sample testing, data analysis, and around-the-clock study support.',
    },
    {
      tag: 'OVINE · 15-DAY',
      title: '15-Day Sheep Study — Pulmonary Assist System',
      body: 'A companion 15-day evaluation of the same ambulatory respiratory-support approach — PAS with oral anticoagulation and biocompatible coatings — in an ovine model, supporting surgery, blood sampling, sample testing, and data analysis across the study period.',
    },
    {
      tag: 'RABBIT · PK/PD',
      title: 'FXII900 Pharmacokinetics & Pharmacodynamics',
      body: 'A rabbit PK/PD study of FXII900’s effect on clotting time and on plasma and platelet counts sampled at 30 min, 1, 2, 4, 6, 8, and 24 hours. Assist with the coagulation testing and activated clotting time (ACT) measurements.',
    },
    {
      tag: 'RABBIT · SURGERY',
      title: 'FXII900 Anticoagulation — Acute Surgery',
      body: 'Rabbit surgery testing the anticoagulant benefits of FXII900: running CBC, ELISA, and coagulation assays (PT and aPTT) and charting the animal’s condition through a 2-hour surgery and 4-hour study period.',
    },
  ],
};

/* ── Publications & Patents ────────────────────────────────────────── */

export const PUBLICATIONS: Array<{
  kind: 'PUBLICATION' | 'PATENT';
  year: string;
  authors: string;
  title: string;
  venue: string;
  status: string;
}> = [
  {
    kind: 'PUBLICATION',
    year: '2026',
    authors:
      'Shin S, Liu D, Potchernikov A, Scala H, Bennett J, Nakamura R, Haggerty M, Kim S, Jiang S, Cook KE',
    title:
      'Pharmacokinetic and Pharmacodynamic Profile Evaluation of Polycarboxybetaine-Conjugated FXIIa Inhibitor in Rabbits',
    venue: '34th Congress of the International Society on Thrombosis and Haemostasis (ISTH) · July 2026',
    status: 'POSTER PRESENTATION',
  },
  {
    kind: 'PUBLICATION',
    year: '—',
    authors:
      'Kumpfbeck AR, Bennett J, Kelley JF, Bulard B, Bapatla S, Woo Y, Petrovic M, Kane S, Said B, Akhavanmalayeri A, Kim S, Shin S, Dorken-Gallastegi A, Strong K, Scala H, Demarest CT, Skoog DJ, Bacchetta M, Cook KE, Ukita R',
    title:
      'In Vivo Testing of a Novel, Low-Profile, Compact Centrifugal Pump in Veno-Venous and Veno-Arterial Configurations of Mechanical Circulatory Support',
    venue: 'Conference Abstract',
    status: 'SUBMITTED',
  },
  {
    kind: 'PATENT',
    year: '2024',
    authors: 'Kim H. (Spencer) — Sole Inventor',
    title: 'CANE — Obstacle-Sensing Cane with Motor-Driven Brake Assembly',
    venue: 'Korean Intellectual Property Office · Patent No. 10-2675388',
    status: 'GRANTED · JUNE 2024',
  },
];

/* ── Projects ──────────────────────────────────────────────────────── */

export const PROJECTS: Array<{
  index: string;
  domain: string;
  title: string;
  dates: string;
  context: string;
  bullets: string[];
  tags: string[];
}> = [
  {
    index: 'P-01',
    domain: 'ASSISTIVE DEVICE',
    title: 'Assistive Page-Turning Device',
    dates: 'Oct — Dec 2025',
    context: '24-370 Mechanical Design Final Project · CMU',
    bullets: [
      'Led a user-driven redesign of a page-turner for readers with cerebral palsy.',
      'Engineered a bidirectional single-page isolation mechanism — a rubber wheel to separate the top sheet and a servo-actuated sweep arm to complete the flip — with a large, low-force button and optional hands-free control.',
      'Ran hand calculations and FEA on the assembly and subassemblies to de-risk performance and durability.',
      'Delivered a manufacturable BOM and cost model: prototype built for $115.80 under a $200 budget, unit COGS of $66.12, and a $119.99 target price.',
    ],
    tags: ['SolidWorks', 'FEA', 'Servo control', 'DFM / BOM'],
  },
  {
    index: 'P-02',
    domain: 'MOBILITY AID',
    title: 'Sensing Cane for the Visually Impaired',
    dates: '2021 — 2024',
    context: 'Independent invention · Patented (KR 10-2675388)',
    bullets: [
      'Invented a cane that detects obstacles ahead of a visually impaired user and alerts them through vibration.',
      'Designed it to outperform a traditional cane while avoiding damage to surrounding people and objects.',
      'Granted a patent in South Korea in 2024 as sole inventor.',
    ],
    tags: ['Ultrasonic sensing', 'Haptics', 'Patent', 'Mechanism design'],
  },
  {
    index: 'P-03',
    domain: 'STRUCTURAL SAFETY',
    title: 'Bike Crank Arm Redesign for E-Bike Safety',
    dates: 'Feb — Mar 2025',
    context: 'Mechanical Design · CMU',
    bullets: [
      'Engineered a lightweight crank arm designed to fail predictably at a 40 N pedal load — a factor of safety near 1.0 at the critical threshold.',
      'Limited deflection under half-load to under 7 mm (10% of span) to keep the part rigid in normal use.',
      'Optimized geometry and material to minimize mass while forcing any failure to occur safely more than 1 cm from key interfaces.',
    ],
    tags: ['FEA', 'Failure analysis', 'FOS design', 'Lightweighting'],
  },
  {
    index: 'P-04',
    domain: 'THERMAL / ENERGY',
    title: 'Concentrated Solar Power Plant',
    dates: 'Mar — Apr 2025',
    context: 'Simulation project · CMU',
    bullets: [
      'Simulated a Brayton-cycle power plant in MATLAB, modifying turbine and compressor models to reflect 90% isentropic efficiency.',
      'Analyzed how solar intensity, molten-salt temperature, and pressure ratio drive power output and efficiency.',
      'Designed thermal storage to extend operation through periods of low irradiance.',
    ],
    tags: ['MATLAB', 'Brayton cycle', 'Thermal storage', 'Systems modeling'],
  },
  {
    index: 'P-05',
    domain: 'AERODYNAMICS',
    title: 'Wind Turbine Blade Design',
    dates: 'Feb — Mar 2025',
    context: 'Design + simulation · CMU',
    bullets: [
      'Optimized blade geometry with QBlade, MATLAB, and SolidWorks to maximize power output under design constraints.',
      'Analyzed aerodynamic performance and delivered a technical report with simulation data and design rationale.',
    ],
    tags: ['QBlade', 'MATLAB', 'SolidWorks', 'Aerodynamics'],
  },
  {
    index: 'P-06',
    domain: 'PRODUCT DESIGN',
    title: 'Custom Wilderness Chair',
    dates: 'Feb — May 2025',
    context: 'National Park Expedition Project · CMU',
    bullets: [
      'Designed a durable, wildlife-safe outdoor chair for climbers in Yosemite — portable, weather-resistant, and stable on rough terrain.',
      'Conducted user research to reach a cost-effective, multipurpose solution with quick setup and integrated gear storage for backcountry use.',
    ],
    tags: ['User research', 'Industrial design', 'Prototyping'],
  },
];

/* ── Experience (work · teaching · leadership) ─────────────────────── */

export type ExpKind = 'RESEARCH' | 'WORK' | 'TEACHING' | 'LEADERSHIP';

export const EXPERIENCE: Array<{
  kind: ExpKind;
  role: string;
  org: string;
  loc: string;
  dates: string;
  bullets: string[];
}> = [
  {
    kind: 'RESEARCH',
    role: 'Undergraduate Student Researcher',
    org: 'Cook Cardiopulmonary Engineering Lab · CMU',
    loc: 'Pittsburgh, PA',
    dates: 'May 2025 — Present',
    bullets: [
      'Evaluate the Pulmonary Assist System in 30-day and 15-day ovine studies of ambulatory respiratory support.',
      'Run FXII900 anticoagulation studies in rabbits — coagulation testing, ACT, CBC, ELISA, PT/aPTT — and support surgery and data analysis.',
    ],
  },
  {
    kind: 'LEADERSHIP',
    role: 'Founding Member',
    org: 'American Society for Artificial Internal Organs (ASAIO) — CMU Chapter',
    loc: 'Pittsburgh, PA',
    dates: 'Apr 2025 — Present',
    bullets: [
      'Help build CMU’s ASAIO student chapter around artificial organs, extracorporeal circulation, and cardiovascular devices.',
      'Connect students to research, clinical translation, and professional development in cardiopulmonary and artificial-organ technologies.',
    ],
  },
  {
    kind: 'LEADERSHIP',
    role: 'President',
    org: 'Central Church of Pittsburgh — Korean Ministry',
    loc: 'Pittsburgh, PA',
    dates: 'Aug 2025 — Present',
    bullets: [
      'Lead a CMU Korean ministry community: weekly gatherings, fellowship events, and student outreach.',
      'Coordinate between student members and church leadership and plan community-building activities around mentorship and belonging.',
    ],
  },
  {
    kind: 'LEADERSHIP',
    role: 'Member · Carnegie Mellon Racing (Formula SAE)',
    org: 'Carnegie Mellon Racing Club',
    loc: 'Pittsburgh, PA',
    dates: 'Aug 2024 — May 2026',
    bullets: [
      'Design and manufacture a fully electric and gasoline formula-style race car with a multidisciplinary team.',
      'Designed the carbon monocoque and chassis in SolidWorks and ran FEA in ANSYS Discovery for structural integrity under race loads.',
      'Machined precision parts on manual lathe, mill, and band saw, and 3D-printed custom components for rapid prototyping.',
      'Supported vehicle testing, validation, and mechanical troubleshooting for competition reliability.',
    ],
  },
  {
    kind: 'WORK',
    role: 'Technology Enhanced Facilities Operator Manager',
    org: 'Computing Services Department · CMU',
    loc: 'Pittsburgh, PA',
    dates: 'Feb 2024 — Present',
    bullets: [
      'Monitor campus computer labs, printers, and computing services, assisting students with the machines and devices across campus.',
    ],
  },
  {
    kind: 'WORK',
    role: 'Engineering Intern',
    org: 'XVision Technology',
    loc: 'Seoul, South Korea',
    dates: 'May — Jul 2024',
    bullets: [
      'Inspired by my younger brother, who is blind, built read-aloud Word files across a range of subjects for easy access by the visually impaired.',
      'Embedded sound clips into the files so users could hear their subjects — for example, the sound of the wind on Mars.',
    ],
  },
  {
    kind: 'TEACHING',
    role: 'Teaching Assistant',
    org: 'PSI Academy',
    loc: 'Seoul, South Korea',
    dates: 'May — Aug 2023',
    bullets: [
      'Taught the basics of biology and robotics to students preparing for the 2023 iGEM and FIRST Global competitions.',
      'Covered synthetic biology and competition topics, and introduced robot building — chassis, drivetrain, and other essentials.',
    ],
  },
];

export const EXP_FILTERS: Array<{ key: ExpKind | 'ALL'; label: string }> = [
  { key: 'ALL', label: 'All' },
  { key: 'RESEARCH', label: 'Research' },
  { key: 'LEADERSHIP', label: 'Leadership' },
  { key: 'WORK', label: 'Work' },
  { key: 'TEACHING', label: 'Teaching' },
];

/* ── Skills ────────────────────────────────────────────────────────── */

export const SKILLS: Array<{ group: string; note: string; items: string[] }> = [
  {
    group: 'Software',
    note: 'Design · simulation · compute',
    items: [
      'SolidWorks',
      'AutoCAD Fusion 360',
      'ANSYS Discovery',
      'ANSYS Fluent',
      'MATLAB',
      'Python',
      'Arduino',
      'Ultimaker Cura',
      'PreForm',
      'Visual Studio Code',
      'Microsoft Office',
      'Surgical Charting',
    ],
  },
  {
    group: 'Machines & Fabrication',
    note: 'Shop · rapid prototyping',
    items: [
      'Lathe',
      'Milling Machine',
      'CNC Machine',
      'Hand Mill',
      'Band Saw',
      'Grinder',
      'Laser Cutter',
      '3D Printer',
      'Sand Blaster',
    ],
  },
  {
    group: 'Lab Instrumentation',
    note: 'Blood gas · coagulation · hematology',
    items: [
      'Radiometer ABL 800 FLEX',
      'Radiometer ABL 90 FLEX PLUS',
      'Sysmex CA-600 Coagulation Analyzer',
      'ABAXIS Vetscan HM5',
    ],
  },
];

/* ── Contact ───────────────────────────────────────────────────────── */

export const CONTACT = {
  eyebrow: 'CONTACT',
  heading: 'From blueprint to implant.',
  body: 'Happy to talk about artificial-organ support, assistive devices, or anything at the boundary between a living system and an engineered one — recruiting for a Summer 2026 role, sponsoring an undergrad, or just comparing notes on oxygenator hemocompatibility.',
  channels: [
    { label: 'Email', value: 'spencer3@cmu.edu', href: 'mailto:spencer3@cmu.edu' },
    { label: 'LinkedIn', value: 'in/shrla', href: 'https://www.linkedin.com/in/shrla/' },
    { label: 'GitHub', value: 'shrlak', href: 'https://github.com/shrlak' },
    { label: 'Phone', value: '+1 (404) 740-1028', href: 'tel:+14047401028' },
  ],
};

/* ── Navigation ────────────────────────────────────────────────────── */

export const NAV_ITEMS = [
  { label: 'About', href: '/about' },
  { label: 'Research', href: '/research' },
  { label: 'Work', href: '/publications' },
  { label: 'Projects', href: '/projects' },
  { label: 'Experience', href: '/experience' },
  { label: 'Skills', href: '/skills' },
  { label: 'Contact', href: '/contact' },
];
