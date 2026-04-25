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
  tag: '004 · INSTRUMENTATION INDEX',
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
    subtitle: 'Pulmonary Assist System · 30-day ovine trial',
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
  fullTitle: '30-DAY OVINE EVALUATION OF THE PULMONARY ASSIST SYSTEM · N=6 COHORT',
  subtitle: 'Ovine Model · Chronic Respiratory Support · 2/6 Reached Primary Endpoint',
  lab: 'Cook Cardiopulmonary Engineering Lab',
  pi: 'Keith Cook, PhD',
  studyLead: ['Ander Dorken Gallastegi, MD', 'Ryuji Nakamura, MD'],
  role: 'Undergraduate Research Assistant · Fall 2025 onward',
  abstract:
    'Chronic lung disease is a leading cause of death, with end-stage treatment constrained by donor shortages and the short-term confinement of ECMO. The Pulmonary Assist System (PAS) is a compact, mobile, and hemocompatible successor to ECMO designed to support patients outside the ICU. Across six ovine studies, PAS function, safety, and biocompatibility were evaluated over a 30-day endpoint using IV rivaroxaban in PEG — replacing continuous IV heparin — as the primary anticoagulation strategy. Two of six animals reached the 30-day primary endpoint. Pump thrombosis and progressive anemia emerged as the primary barriers to completion; hepatic, renal, and inflammatory markers remained within acceptable limits throughout successful studies.',
  objectives: [
    'Verify 30-day device patency, low flow resistance, and stable gas exchange.',
    'Validate oral rivaroxaban as a replacement for continuous IV heparin anticoagulation.',
    'Characterize ovine rivaroxaban pharmacokinetics against human AUC targets.',
    'Quantify device-induced hemolysis, inflammation, and organ function over chronic use.',
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
    {
      id: 'Sheep #1',
      name: 'Akio',
      start: 'Aug 28',
      outcome: 'Terminated · Day 15',
      detail: 'Profound anemia with Pseudomonas sepsis. Clot observed in device outlet.',
      tone: 'warn',
    },
    {
      id: 'Sheep #2',
      name: 'Bento',
      start: 'Oct 9',
      outcome: 'Terminated · Day 4',
      detail: 'Welfare cutoff — electrolyte abnormalities and inability to stand.',
      tone: 'warn',
    },
    {
      id: 'Sheep #3',
      name: 'Chiikawa',
      start: 'Oct 23',
      outcome: 'Survived · 30 days',
      detail: 'Primary endpoint achieved. Patency maintained; device resistance stable throughout trial.',
      tone: 'ok',
    },
    {
      id: 'Sheep #4',
      name: 'Ebisu',
      start: '—',
      outcome: 'Survived · 30 days',
      detail: 'Second 30-day completion. Confirmed reproducibility of IV rivaroxaban anticoagulation regimen.',
      tone: 'ok',
    },
    {
      id: 'Sheep #5',
      name: 'Daifuku',
      start: '—',
      outcome: 'Terminated · Day 18',
      detail: 'Pump thrombosis requiring circuit termination. Progressive anemia contributing factor.',
      tone: 'warn',
    },
    {
      id: 'Sheep #6',
      name: 'Goku',
      start: '—',
      outcome: 'Survived · 15 days',
      detail: 'Partial endpoint. Occult GI bleeding suspected as driver of progressive anemia.',
      tone: 'warn',
    },
  ],
  findings: [
    {
      label: 'PRIMARY BARRIER',
      value:
        'Pump thrombosis was the leading cause of circuit failure across the cohort, with progressive anemia — including suspected occult GI bleeding — as a secondary contributor. Both factors necessitate protocol refinement before a powered efficacy study.',
    },
    {
      label: 'ENDPOINT OUTCOMES',
      value:
        'Two of six animals (Chiikawa, Ebisu) reached the 30-day primary endpoint, establishing feasibility of PAS under IV rivaroxaban anticoagulation. Kaplan-Meier survival curves trended favorably versus historical heparin controls.',
    },
    {
      label: 'ORGAN FUNCTION',
      value:
        'Hepatic, renal, and inflammatory markers remained within acceptable limits throughout both completed studies. Plasma-free hemoglobin stayed low, indicating minimal hemolysis attributable to the device.',
    },
    {
      label: 'PHARMACOKINETICS',
      value:
        'Plasma rivaroxaban correlated linearly with PT and ACT. Ovine interspecies metabolism is faster than human; dose was optimized downward from 0.75 to 0.5 mg/kg q4h IV in PEG to reduce GI mucosal exposure while maintaining therapeutic anticoagulation.',
    },
  ],
  optimizations: [
    'Dose reduction from 0.75 to 0.5 mg/kg q4h IV rivaroxaban to limit occult GI mucosal bleeding',
    'Occult GI bleeding surveillance protocol added (serial fecal guaiac, Hgb trending)',
    'Extension line added to high-wear stopcocks',
    'Silver paste protocol for cannulation-site ulceration',
    'Refined transition protocol from heparin bridge to IV rivaroxaban in PEG',
  ],
  outcome:
    'Two 30-day completions (Chiikawa, Ebisu) establish proof-of-concept for PAS as a chronic respiratory support device and for IV rivaroxaban in PEG as a viable anticoagulation strategy. Pump thrombosis and anemia remain the critical barriers to resolve before a powered efficacy trial. Kaplan-Meier curves trended favorably against historical heparin controls — providing the evidence base needed to support any future ambulatory device trial.',
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
  tag: '006 · ESTABLISH LINE',
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
