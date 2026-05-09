/* ----------------------------------------------------------------------------
 * CONTENT — Spencer Hoyun Kim
 * Undergraduate · Carnegie Mellon University College of Engineering
 * B.S. Mechanical Engineering with additional major in Biomedical Engineering
 * Research: Cook Cardiopulmonary Engineering Lab
 * -------------------------------------------------------------------------- */

export const PERSON = {
  shortName: 'SPENCER KIM',
  fullName: 'SPENCER HOYUN KIM',
  email: 'spencer3@cmu.edu',
  personalEmail: 'spencerkim1235@gmail.com',
  linkedin: 'https://www.linkedin.com/in/shrla/',
  linkedinHandle: 'in/shrla',
  github: 'https://github.com/shrlak',
  location: 'Pittsburgh, PA · Seoul, KR',
  institution: 'Carnegie Mellon University',
  college: 'College of Engineering',
  degree: 'Bachelor of Science',
  primaryMajor: 'Mechanical Engineering',
  additionalMajor: 'Biomedical Engineering',
  classYear: 'Class of 2027',
  lab: 'Cook Cardiopulmonary Engineering Lab',
  pi: 'Keith Cook, PhD',
  advisors: ['Ander Dorken Gallastegi, MD', 'Ryuji Nakamura, MD'],
};

export const HERO = {
  tag: 'A-001 · RESEARCH DOSSIER',
  accent: 'Engineering at the body-device interface.',
  heading: ['ARTIFICIAL', 'ORGANS.', 'ASSISTIVE', 'INSTRUMENTS.'],
  footnote:
    'CARNEGIE MELLON · UNDERGRADUATE · B.S. MECHANICAL ENGINEERING + ADDITIONAL MAJOR IN BIOMEDICAL ENGINEERING · CLASS OF 2027',
};

export const CREDENTIALS = {
  tag: '002 · ACADEMIC CREDENTIALS',
  accent: 'Engineer in training.',
  heading: ['UNDERGRADUATE', 'AT CARNEGIE MELLON.'],
  statement:
    'Undergraduate student in the College of Engineering at Carnegie Mellon University, pursuing a Bachelor of Science in Mechanical Engineering with an additional major in Biomedical Engineering.',
  items: [
    { label: 'INSTITUTION', value: 'Carnegie Mellon University' },
    { label: 'COLLEGE', value: 'College of Engineering' },
    { label: 'DEGREE', value: 'Bachelor of Science (B.S.)' },
    { label: 'PRIMARY MAJOR', value: 'Mechanical Engineering' },
    { label: 'ADDITIONAL MAJOR', value: 'Biomedical Engineering' },
    { label: 'EXPECTED GRADUATION', value: 'May 2027' },
    { label: 'RESEARCH HOME', value: 'Cook Cardiopulmonary Engineering Lab' },
    { label: 'PRINCIPAL INVESTIGATOR', value: 'Keith Cook, PhD' },
  ],
};

export const ABOUT = {
  tag: '003 · PROFILE',
  accent: 'Device engineer.',
  heading: ['HELLO.', "I'M SPENCER."],
  body: [
    'I design and validate the hardware that takes over when a human organ fails. My work sits at the intersection of mechanical design, fluid dynamics, and surgical-grade biomaterials — with a bias toward artificial lungs and assistive medical devices.',
    'At the Cook Cardiopulmonary Engineering Lab I work on the Pulmonary Assist System (PAS): a compact, ambulatory successor to ECMO intended to let patients with end-stage lung disease leave the ICU. Prior to CMU I co-invented a sensing cane with a motor-driven brake mechanism for the visually impaired, now registered with the Korean Intellectual Property Office.',
  ],
  keywordRows: [
    'ARTIFICIAL LUNGS · PULMONARY ASSIST SYSTEMS · IMPLANTABLE DEVICES · HEMOCOMPATIBLE SURFACES',
    'SURGICAL INSTRUMENTATION · ORAL ANTICOAGULATION · PHARMACOKINETICS · IN-VIVO VALIDATION',
    'COMPUTATIONAL MODELING · FEA · CFD · BLOOD-CONTACTING DEVICE RELIABILITY',
  ],
};

export const RESEARCH = {
  tag: '005 · INSTRUMENTATION INDEX',
  headingTop: 'SELECTED',
  headingAccent: 'instruments',
  cta: 'VIEW FULL CV',
};

export type CardSlug = 'pas' | 'coagulation' | 'cane';

export const RESEARCH_CARDS: Array<{
  slug: CardSlug;
  index: string;
  category: string;
  title: string;
  titleTwo: string;
  subtitle: string;
  metaLabel: string;
  metaValue: string;
  status: string;
}> = [
  {
    slug: 'pas',
    index: 'R-01',
    category: 'ARTIFICIAL ORGAN ENGINEERING',
    title: 'ARTIFICIAL',
    titleTwo: 'LUNG',
    subtitle: 'Pulmonary Assist System · 30-day ovine trial · In Progress',
    metaLabel: 'SYSTEM',
    metaValue: 'PAS · VV ECMO · IV RIVAROXABAN',
    status: 'ACTIVE',
  },
  {
    slug: 'coagulation',
    index: 'R-02',
    category: 'THROMBOSIS + ANTICOAGULATION',
    title: 'ANTI-',
    titleTwo: 'COAGULATION',
    subtitle: 'FXIIa inhibitor · hollow fiber surfaces',
    metaLabel: 'ABSTRACT',
    metaValue: 'FXII900-PCB · ISTH 2026',
    status: 'SUBMITTED',
  },
  {
    slug: 'cane',
    index: 'R-03',
    category: 'ASSISTIVE MEDICAL DEVICES',
    title: 'SENSING',
    titleTwo: 'CANE',
    subtitle: 'Obstacle-sensing mobility aid · KR Patent',
    metaLabel: 'PATENT',
    metaValue: 'KR · 10-2675388 · GRANTED 2024',
    status: 'REGISTERED',
  },
];

/* ----------------------------------------------------------------------------
 * DETAIL CONTENT — full landing pages for each research project
 * -------------------------------------------------------------------------- */

export const PAS_DETAIL = {
  slug: 'pas' as const,
  index: 'R-01',
  category: 'ARTIFICIAL ORGAN ENGINEERING',
  shortTitle: 'PULMONARY ASSIST SYSTEM',
  fullTitle: '30-DAY OVINE EVALUATION OF THE PULMONARY ASSIST SYSTEM',
  subtitle: 'Ovine Model · Chronic Respiratory Support · In Progress',
  lab: 'Cook Cardiopulmonary Engineering Lab',
  pi: 'Keith Cook, PhD',
  studyLead: ['Ander Dorken Gallastegi, MD', 'Ryuji Nakamura, MD'],
  role: 'Undergraduate Research Assistant · Fall 2025 onward',
  abstract:
    'Chronic lung disease is a leading cause of death, with end-stage treatment constrained by donor shortages and the short-term confinement of conventional ECMO. The Pulmonary Assist System (PAS) is a compact, mobile, and hemocompatible device designed to provide long-term pulmonary support outside the ICU setting. This ongoing study evaluates PAS function, safety, and biocompatibility in a 30-day ovine (sheep) model using IV rivaroxaban in PEG as the primary anticoagulation strategy — replacing the standard continuous IV heparin drip. Results are ongoing and will be published upon study completion.',
  objectives: [
    'Evaluate 30-day device patency, flow resistance, and stable gas exchange in an ovine model.',
    'Assess IV rivaroxaban in PEG as a viable anticoagulation strategy for long-term ECMO.',
    'Characterize ovine pharmacokinetics and biocompatibility over chronic device use.',
    'Inform protocol refinements to support a future powered efficacy trial.',
  ],
  methods: [
    {
      label: 'CONFIGURATION',
      value: 'Veno-venous (VV) cannulation · 20 Fr cannulas · right and left external jugular',
    },
    { label: 'PUMP', value: 'CDX centrifugal blood pump' },
    { label: 'OXYGENATOR', value: 'Hollow-fiber membrane · coated surfaces' },
    { label: 'IMAGING', value: 'C-arm fluoroscopy for intra-operative cannula placement' },
    {
      label: 'ANTICOAGULATION',
      value: 'IV rivaroxaban in PEG · 0.5 mg/kg q4h (dose-optimized from 0.75 mg/kg) · 36-hour heparin bridge post-op',
    },
    {
      label: 'MONITORING',
      value: 'Device resistance q2h · ABG / ACT / PT / CBC / pfHb / LFT / renal panel on structured timeline',
    },
  ],
  subjects: [
    { id: 'Sheep #1', name: 'Akio',     tone: 'ok',      start: '2025-09-01', outcome: '30 days', detail: 'Reached primary endpoint. Stable gas exchange, no pump thrombosis.' },
    { id: 'Sheep #2', name: 'Bento',    tone: 'ok',      start: '2025-09-01', outcome: '30 days', detail: 'Reached primary endpoint. Device resistance stable throughout.' },
    { id: 'Sheep #3', name: 'Chiikawa', tone: 'neutral', start: '2025-09-15', outcome: '14 days', detail: 'Study terminated at day 14 due to cannula positional drift.' },
    { id: 'Sheep #4', name: 'Ebisu',    tone: 'neutral', start: '2025-10-01', outcome: '9 days',  detail: 'Terminated day 9. Elevated pfHb — suspected oxygenator clot.' },
    { id: 'Sheep #5', name: 'Daifuku',  tone: 'neutral', start: '2025-10-15', outcome: '21 days', detail: 'Terminated day 21. Pneumonia unrelated to device.' },
    { id: 'Sheep #6', name: 'Goku',     tone: 'neutral', start: '2025-11-01', outcome: '6 days',  detail: 'Terminated day 6. Dosing protocol revised post-study.' },
  ],
  findings: [
    { label: 'PATENCY', value: '2 of 6 animals reached the 30-day primary endpoint with stable device function and no circuit thrombosis.' },
    { label: 'ANTICOAGULATION', value: 'IV rivaroxaban in PEG at 0.5 mg/kg q4h maintained therapeutic anti-Xa levels with acceptable bleeding risk vs. continuous heparin.' },
    { label: 'GAS EXCHANGE', value: 'Oxygenation and CO₂ clearance remained stable throughout in both endpoint animals; O₂ transfer efficiency >90% at study end.' },
    { label: 'RESISTANCE', value: 'Device resistance tracked q2h; no significant upward drift in the 30-day cohort, confirming membrane hemocompatibility over chronic use.' },
    { label: 'DOSE OPTIMIZATION', value: 'Starting dose of 0.75 mg/kg reduced to 0.5 mg/kg q4h after three animals to manage early post-op bleeding without sacrificing anti-Xa coverage.' },
  ],
  optimizations: [
    'Rivaroxaban dose reduced from 0.75 → 0.5 mg/kg q4h after early cohort bleeding events.',
    '36-hour heparin bridge post-surgery added to cover sub-therapeutic rivaroxaban window.',
    'Cannula fixation protocol tightened after Sheep #3 positional drift event.',
    'ABG sampling intervals adjusted from q6h to q4h to detect early gas-exchange decline.',
    'pfHb threshold for early study termination formalized at 0.5 g/dL.',
  ],
  outcome: '2 of 6 animals reached the 30-day endpoint — establishing proof of concept for chronic ambulatory PAS use with oral anticoagulation. Protocol refinements from this cohort inform a planned powered efficacy trial with n=10 targeting ≥80% endpoint survival.',
  monitoringParams: [
    { label: 'HEMODYNAMICS', value: 'Device resistance · flow · blood pressure · heart rate' },
    { label: 'HEMATOLOGY', value: 'CBC · plasma-free hemoglobin · activated clotting time' },
    { label: 'COAGULATION', value: 'PT/INR · rivaroxaban plasma levels · q4h dosing' },
    { label: 'ORGAN FUNCTION', value: 'Liver enzymes · renal panel · blood gases · electrolytes' },
  ],
  status: 'ONGOING — RESULTS PENDING PUBLICATION' as const,
};

export const COAG_DETAIL = {
  slug: 'coagulation' as const,
  index: 'R-02',
  category: 'THROMBOSIS + ANTICOAGULATION',
  shortTitle: 'FXIIa INHIBITION FOR BLOOD-CONTACTING DEVICES',
  fullTitle: 'SURFACE-INDUCED COAGULATION AND FXII900-PCB — A PATH BEYOND HEPARIN',
  abstractTitle:
    'Pharmacokinetic and Pharmacodynamic Profile Evaluation of Polycarboxybetaine-Conjugated FXIIa Inhibitor in Rabbits',
  subtitle: 'ISTH 2026 abstract · rabbit PK/PD · n=5 per group',
  authors: [
    { name: 'Suji Shin', affil: '1' },
    { name: 'Di Liu', affil: '2' },
    { name: 'Alexander Potchernikov', affil: '1' },
    { name: 'Helen Scala', affil: '1' },
    { name: 'Joshua Bennett', affil: '1' },
    { name: 'Ryuji Nakamura', affil: '1' },
    { name: 'McKenna Haggerty', affil: '1' },
    { name: 'Spencer Kim', affil: '1' },
    { name: 'Shaoyi Jiang', affil: '2' },
    { name: 'Keith E. Cook', affil: '1' },
  ],
  affiliations: [
    { id: '1', name: 'Department of Biomedical Engineering, Carnegie Mellon University, Pittsburgh, PA' },
    { id: '2', name: 'Meinig School of Biomedical Engineering, Cornell University, Ithaca, NY' },
  ],
  lab: 'Cook Cardiopulmonary Engineering Lab',
  pi: 'Keith Cook, PhD',
  role: 'Co-author · abstract submission for ISTH 2026',
  abstract:
    'Extracorporeal devices that contact blood — ECMO, dialysis, cardiopulmonary bypass — activate the contact (intrinsic) pathway of coagulation at their polymer and hollow-fiber surfaces. Heparin, the current standard, prevents clot at the cost of bleeding and HIT. Factor XIIa (FXIIa) inhibitors selectively block surface-induced clot while leaving hemostatic clotting intact. This study evaluated the PK/PD profile of three polycarboxybetaine (PCB) chain-length variants of FXII900 (20, 40, and 60 kDa) in New Zealand white rabbits (n=5 per group). Animals received a bolus IV injection at 0.64 μmol/kg; plasma was sampled at 0.5, 1, 2, 4, 6, 8, and 24 hours post-dose. The 60 kDa conjugate achieved a half-life of 6.60 ± 0.98 hours — a 33-fold improvement over unconjugated FXII900 — without significantly altering prothrombin time, confirming preserved hemostatic safety. ACT and aPTT were prolonged in a chain-length-dependent manner, confirming on-target anticoagulant activity.',
  problem: [
    'Hollow-fiber membranes in oxygenators present ~2 m² of synthetic surface to circulating blood.',
    'Contact with negatively charged surfaces auto-activates Factor XII to FXIIa, triggering the intrinsic cascade.',
    'Heparin blocks the entire cascade — effective, but with bleeding and heparin-induced thrombocytopenia.',
    'FXIIa inhibition uncouples surface-induced clot from physiological hemostasis.',
  ],
  approach: [
    { label: 'MOLECULE', value: 'FXII900 — selective small-molecule inhibitor of Factor XIIa' },
    { label: 'FORMULATION', value: 'Polycarboxybetaine (PCB) conjugate for surface presentation' },
    { label: 'MODEL', value: 'New Zealand white rabbits · n=5 per group · 3 PCB chain lengths (20, 40, 60 kDa) · bolus IV 0.64 μmol/kg · plasma sampled at 0.5/1/2/4/6/8/24 h' },
    { label: 'ENDPOINT', value: 'Half-life, ACT, aPTT, PT per chain length — 60 kDa: t½ = 6.60 ± 0.98 h (33× unconjugated), PT unchanged' },
    { label: 'APPLICATION', value: 'Hollow-fiber oxygenator coating for chronic respiratory support' },
  ],
  contributions: [
    'Literature synthesis on surface-induced thrombosis mechanisms.',
    'Abstract preparation for International Society on Thrombosis and Haemostasis 2026.',
    'Analysis of coagulation biomarker timecourses in ovine PAS cohort (ACT, PT, pfHb).',
    'Cross-referenced findings with FXIIa inhibition literature for translational relevance.',
  ],
  references: [
    'Jaffer et al. — Medical device-induced thrombosis.',
    'Palta et al. 2015 — Overview of the coagulation system.',
    'Dalton 2015 — Bleeding time, thrombosis, and ECMO survival.',
    'Seeliger 2020 — Anticoagulation for VV ECMO comparative study.',
    'Demarest 2020 — Time course of oxygenator failure.',
  ],
};

export const CANE_DETAIL = {
  slug: 'cane' as const,
  index: 'R-03',
  category: 'ASSISTIVE MEDICAL DEVICES',
  shortTitle: 'OBSTACLE-SENSING CANE — KR PATENT 10-2675388',
  fullTitle: 'A CANE WITH ULTRASONIC OBSTACLE DETECTION AND AUTOMATED BRAKE',
  subtitle: 'Assistive mobility for the visually impaired',
  patentNumber: 'KR 10-2675388',
  office: 'Korean Intellectual Property Office',
  filed: '2022.08.04',
  registered: '2024.06.11',
  inventor: 'KIM HOYUN (SPENCER)',
  status: 'GRANTED',
  role: 'Sole inventor',
  abstract:
    'Conventional canes for the visually impaired alert users only through passive touch or simple vibration. When an obstacle is detected, the user often continues walking and the cane itself collides and breaks. This invention adds two coupled safety features: (1) handle-level haptic feedback the moment an ultrasonic sensor detects an obstacle, and (2) a motor-driven brake assembly that extends a rubber bumper from the base of the cane to provide physical resistance — protecting the cane and signalling the user to stop.',
  problem: [
    'Existing detection canes notify only via vibration; users may continue walking on momentum.',
    'Canes frequently fracture on collision with hard obstacles.',
    'No mechanical stopping force is provided back to the user.',
  ],
  solution: [
    'Ultrasonic sensor mounted on the cane shaft detects obstacles ahead.',
    'Handle vibrator / vibration motor fires immediately on detection.',
    'Lower-body brake assembly (case + shaft + gear + motor + slider + guide rail) drives a rubber/silicon bumper out through a front opening.',
    'As the user approaches the obstacle, the bumper makes contact before the cane tip does, applying resistance to the hand.',
    'When the obstacle clears, the motor reverses and the bumper retracts into the housing.',
  ],
  components: [
    { id: 'C-01', label: 'SHAFT', detail: 'Main cane body with ergonomic handle' },
    { id: 'C-02', label: 'DETECTION', detail: 'Ultrasonic obstacle sensor on forward face' },
    { id: 'C-03', label: 'HAPTIC', detail: 'Vibration motor / vibrator embedded in handle' },
    { id: 'C-04', label: 'HOUSING', detail: 'Case at base with front opening — contains brake' },
    { id: 'C-05', label: 'DRIVE', detail: 'Motor + gear train rotating a horizontal shaft' },
    { id: 'C-06', label: 'SLIDER', detail: 'Threaded carrier on shaft — translates along guide rail' },
    { id: 'C-07', label: 'BUMPER', detail: 'Rubber / silicon contact element — extends out of case' },
  ],
  claims: [
    'Cane with a sensing unit, vibration unit, and extensible contact unit that couples detection to haptic + mechanical response.',
    'Brake assembly using a shaft-and-guide-rail slider to translate a protective bumper in and out of a case.',
    'Bidirectional motor control tied to sensor state — extend on detect, retract on clear.',
    'Rubber/silicon bumper geometry optimized for low-damage user-obstacle contact.',
  ],
  impact:
    'Converts a passive mobility aid into an active assistive device. Protects the instrument and gives the user a mechanical cue — not just an auditory or tactile alert — that physically couples to their grip.',
};

/* ----------------------------------------------------------------------------
 * CV content
 * -------------------------------------------------------------------------- */

export const CV = {
  tag: 'CV · CURRICULUM VITAE',
  heading: 'SPENCER HOYUN KIM',
  subheading: 'Undergraduate · Mechanical + Biomedical Engineering · Carnegie Mellon',
  education: [
    {
      inst: 'Carnegie Mellon University',
      loc: 'Pittsburgh, Pennsylvania',
      dates: 'Aug 2023 — May 2027 (expected)',
      degree: 'Bachelor of Science',
      program: 'College of Engineering — Mechanical Engineering with additional major in Biomedical Engineering',
    },
  ],
  research: [
    {
      lab: 'Cook Cardiopulmonary Engineering Lab',
      inst: 'Carnegie Mellon University · Department of Biomedical Engineering',
      role: 'Undergraduate Research Assistant',
      dates: 'Fall 2025 — Present',
      pi: 'Principal Investigator: Keith Cook, PhD',
      bullets: [
        'N=6 ovine evaluation of the Pulmonary Assist System (PAS) under IV rivaroxaban in PEG anticoagulation — 2 of 6 subjects reached the 30-day primary endpoint.',
        'Structured blood sampling, ABG / ACT / PT / CBC / pfHb / LFT / renal analyses; longitudinal device-resistance and pump-thrombosis surveillance.',
        'Co-author on FXII900-PCB PK/PD abstract submitted to ISTH 2026 — 60 kDa PCB conjugate achieved 33× half-life extension in New Zealand white rabbits.',
      ],
    },
  ],
  patents: [
    {
      number: 'KR 10-2675388',
      title: 'CANE — obstacle-sensing cane with motor-driven brake assembly',
      office: 'Korean Intellectual Property Office',
      filed: '2022.08.04',
      granted: '2024.06.11',
      inventor: 'Sole inventor',
    },
  ],
  skills: [
    {
      group: 'MEDICAL DEVICE R&D',
      items: [
        'Extracorporeal circuit assembly',
        'Hollow-fiber oxygenator characterization',
        'In-vivo large-animal studies',
        'Blood sampling protocols',
      ],
    },
    {
      group: 'ENGINEERING',
      items: ['SolidWorks', 'Fusion 360', 'Finite-element analysis', 'Machining / prototyping'],
    },
    {
      group: 'COMPUTATION',
      items: ['Python (NumPy / Pandas / Matplotlib)', 'MATLAB', 'Git', 'LaTeX'],
    },
    {
      group: 'CERTIFICATIONS',
      items: [
        'CITI — human subjects, animal research',
        'Bloodborne pathogens training',
        'OHS laboratory safety',
      ],
    },
  ],
  languages: ['English (native)', 'Korean (native)'],
};

/* ----------------------------------------------------------------------------
 * CONTACT content
 * -------------------------------------------------------------------------- */

export const CONTACT = {
  tag: '008 · ESTABLISH LINE',
  accent: "Let's build.",
  heading: ['FROM BLUEPRINT', 'TO IMPLANT.'],
  body: 'Collaborating on artificial organ support, assistive devices, or anything at the boundary between a living system and an engineered one — whether you want to sponsor an undergrad, recruit for a summer 2026 role, or just compare notes on oxygenator hemocompatibility. The form below drops straight into my inbox.',
  channels: [
    { label: 'ACADEMIC EMAIL', value: 'spencer3@cmu.edu', href: 'mailto:spencer3@cmu.edu' },
    { label: 'PERSONAL EMAIL', value: 'spencerkim1235@gmail.com', href: 'mailto:spencerkim1235@gmail.com' },
    { label: 'LINKEDIN', value: 'in/shrla', href: 'https://www.linkedin.com/in/shrla/' },
    { label: 'LAB', value: 'Cook Cardiopulmonary Engineering Lab', href: '#/research/pas' },
    { label: 'CAMPUS', value: 'Carnegie Mellon · Pittsburgh, PA', href: 'https://maps.apple.com/?q=Carnegie+Mellon+University' },
  ],
};

/* ----------------------------------------------------------------------------
 * NAV + SOCIAL
 * -------------------------------------------------------------------------- */

export const NAV_ITEMS = [
  { label: 'HOME', href: '#home' },
  { label: 'CREDENTIALS', href: '#credentials' },
  { label: 'PROFILE', href: '#about' },
  { label: 'RESEARCH', href: '#research' },
  { label: 'CONTACT', href: '#contact' },
];

/* ----------------------------------------------------------------------------
 * PUBLICATIONS
 * -------------------------------------------------------------------------- */

export const PUBLICATIONS: Array<{
  year: string;
  conference: string;
  title: string;
  authors: string;
  venue: string;
  status: 'SUBMITTED' | 'PUBLISHED';
}> = [
  {
    year: '2026',
    conference: 'ISTH',
    title:
      'Pharmacokinetic and Pharmacodynamic Profile Evaluation of Polycarboxybetaine-Conjugated FXIIa Inhibitor in Rabbits',
    authors:
      'Shin S, Liu D, Potchernikov A, Scala H, Bennett J, Nakamura R, Haggerty M, Kim S*, Jiang S, Cook KE',
    venue:
      'International Society on Thrombosis and Haemostasis · Abstract',
    status: 'SUBMITTED',
  },
];

/* ----------------------------------------------------------------------------
 * SKILLS
 * -------------------------------------------------------------------------- */

export const SKILLS: Array<{
  group: string;
  items: Array<{ name: string; pct: number }>;
}> = [
  {
    group: 'MEDICAL DEVICE R&D',
    items: [
      { name: 'Extracorporeal circuits', pct: 90 },
      { name: 'In-vivo large-animal studies', pct: 80 },
      { name: 'Blood sampling protocols', pct: 85 },
      { name: 'Hollow-fiber oxygenators', pct: 75 },
    ],
  },
  {
    group: 'ENGINEERING + COMPUTATION',
    items: [
      { name: 'SolidWorks / Fusion 360', pct: 85 },
      { name: 'Python · NumPy / Pandas', pct: 80 },
      { name: 'MATLAB', pct: 75 },
      { name: 'FEA / CFD', pct: 65 },
    ],
  },
];

/* ----------------------------------------------------------------------------
 * TIMELINE
 * -------------------------------------------------------------------------- */

export type TimelineState = 'done' | 'active' | 'pending';

export const TIMELINE: Array<{ label: string; sub: string; state: TimelineState }> = [
  { label: 'Protocol Design', sub: 'Complete', state: 'done' },
  { label: 'IACUC Approval', sub: 'Complete', state: 'done' },
  { label: 'Cohort 1', sub: '2/6 endpoint', state: 'done' },
  { label: 'Protocol Refinement', sub: 'In progress', state: 'active' },
  { label: 'Powered Trial', sub: 'n=10 planned', state: 'pending' },
  { label: 'Publication', sub: 'Pending', state: 'pending' },
];
