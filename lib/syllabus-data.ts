import type { ExamSyllabus } from '@/types'

export const EXAM_LIST = [
  { id: 'sbi_po',       name: 'SBI PO',              category: 'Banking',    color: '#6366f1' },
  { id: 'ibps_po',      name: 'IBPS PO',             category: 'Banking',    color: '#8b5cf6' },
  { id: 'ibps_clerk',   name: 'IBPS Clerk',           category: 'Banking',    color: '#a78bfa' },
  { id: 'rbi_grade_b',  name: 'RBI Grade B',          category: 'Banking',    color: '#7c3aed' },
  { id: 'lic_aao',      name: 'LIC AAO',              category: 'Insurance',  color: '#0ea5e9' },
  { id: 'niacl_ao',     name: 'NIACL AO',             category: 'Insurance',  color: '#38bdf8' },
  { id: 'upsc_prelims', name: 'UPSC Civil Services',  category: 'Government', color: '#f59e0b' },
  { id: 'cds',          name: 'CDS',                  category: 'Defence',    color: '#10b981' },
  { id: 'ssc_cgl',      name: 'SSC CGL',              category: 'Government', color: '#f97316' },
]

const quantSubject = (id: string): import('@/types').Subject => ({
  id: `${id}_quant`,
  name: 'Quantitative Aptitude',
  color: '#6366f1',
  sections: [
    {
      id: `${id}_quant_arithmetic`,
      name: 'Arithmetic',
      topics: [
        { id: `${id}_quant_percentage`, name: 'Percentage', description: 'Fraction to percent conversion, percentage change, successive percent, percentage error. Core foundation for most arithmetic chapters.', weightage: 'High', difficulty: 'Medium', prepTime: '2-3 days' },
        { id: `${id}_quant_ratio`, name: 'Ratio & Proportion', description: 'Compound ratios, proportionality theorems, variation, partnership problems, mixing and alligations.', weightage: 'High', difficulty: 'Medium', prepTime: '2-3 days' },
        { id: `${id}_quant_profit`, name: 'Profit & Loss', description: 'Cost price, selling price, marked price, discount, successive transactions, dishonest dealings using false weights.', weightage: 'High', difficulty: 'Medium', prepTime: '3-4 days' },
        { id: `${id}_quant_si_ci`, name: 'Simple & Compound Interest', description: 'SI/CI formula, half-yearly/quarterly compounding, difference between SI and CI after n years.', weightage: 'High', difficulty: 'Medium', prepTime: '2-3 days' },
        { id: `${id}_quant_tw`, name: 'Time & Work', description: 'Efficiency method, pipes and cisterns, men-days problems, work and wages, work done in parts.', weightage: 'Medium', difficulty: 'Medium', prepTime: '3-4 days' },
        { id: `${id}_quant_sdt`, name: 'Speed, Distance & Time', description: 'Relative speed concept, train problems, boats and streams, circular tracks, average speed vs mean speed.', weightage: 'High', difficulty: 'Hard', prepTime: '4-5 days' },
        { id: `${id}_quant_avg`, name: 'Averages', description: 'Weighted average, average speed, age-based problems, impact of adding/removing members.', weightage: 'Medium', difficulty: 'Easy', prepTime: '1-2 days' },
        { id: `${id}_quant_alligation`, name: 'Mixture & Alligation', description: 'Rule of alligation, mean price method, replacement problems, mixing two or more solutions.', weightage: 'Medium', difficulty: 'Medium', prepTime: '2-3 days' },
      ],
    },
    {
      id: `${id}_quant_di`,
      name: 'Data Interpretation',
      topics: [
        { id: `${id}_quant_bar_di`, name: 'Bar Chart DI', description: 'Simple, stacked, grouped bars. 5-question sets focusing on comparison, ratio, percentage change analysis.', weightage: 'High', difficulty: 'Medium', prepTime: '3-4 days' },
        { id: `${id}_quant_line_di`, name: 'Line Graph DI', description: 'Single/multiple line graphs, trend analysis, slope-based inference questions.', weightage: 'High', difficulty: 'Medium', prepTime: '3-4 days' },
        { id: `${id}_quant_pie_di`, name: 'Pie Chart DI', description: 'Degree/percentage-based charts, combination charts (pie + table), central angle calculations.', weightage: 'High', difficulty: 'Medium', prepTime: '3-4 days' },
        { id: `${id}_quant_table_di`, name: 'Tabular DI', description: 'Multi-row multi-column tables, missing data, row/column calculations, comparing multiple entities.', weightage: 'High', difficulty: 'Hard', prepTime: '3-4 days' },
        { id: `${id}_quant_caselet`, name: 'Caselet DI', description: 'Paragraph-based data. Extract values, set up equations, answer 5 derived questions. High difficulty.', weightage: 'Medium', difficulty: 'Hard', prepTime: '5-6 days' },
      ],
    },
    {
      id: `${id}_quant_algebra`,
      name: 'Algebra & Number System',
      topics: [
        { id: `${id}_quant_number`, name: 'Number System', description: 'Divisibility rules, HCF/LCM, unit digit, remainder theorem, BODMAS, surds and indices.', weightage: 'Medium', difficulty: 'Medium', prepTime: '3-4 days' },
        { id: `${id}_quant_quadratic`, name: 'Quadratic Equations', description: 'Roots of equations, relation between roots, comparing two roots, nature of roots discriminant.', weightage: 'High', difficulty: 'Easy', prepTime: '2-3 days' },
        { id: `${id}_quant_series`, name: 'Number Series', description: 'Finding missing/wrong term, pattern recognition — arithmetic, geometric, difference series, Fibonacci variants.', weightage: 'High', difficulty: 'Medium', prepTime: '3-4 days' },
        { id: `${id}_quant_approx`, name: 'Simplification & Approximation', description: 'BODMAS, square/cube roots, fraction simplification, approximation to nearest unit.', weightage: 'Medium', difficulty: 'Easy', prepTime: '2-3 days' },
      ],
    },
  ],
})

const reasoningSubject = (id: string): import('@/types').Subject => ({
  id: `${id}_reasoning`,
  name: 'Reasoning Ability',
  color: '#8b5cf6',
  sections: [
    {
      id: `${id}_reasoning_puzzles`,
      name: 'Puzzles & Arrangements',
      topics: [
        { id: `${id}_reasoning_seating`, name: 'Seating Arrangement', description: 'Linear (single/double row facing same/opposite directions), circular, rectangular/square, triangular arrangements.', weightage: 'High', difficulty: 'Hard', prepTime: '5-6 days' },
        { id: `${id}_reasoning_puzzles_t`, name: 'Puzzles', description: 'Floor puzzles, box-stack puzzles, month-day-year scheduling, designation-based puzzles, uncertain data puzzles.', weightage: 'High', difficulty: 'Hard', prepTime: '5-7 days' },
        { id: `${id}_reasoning_order`, name: 'Order & Ranking', description: 'Position from left/right, tallest/shortest rankings, combined arrangement problems.', weightage: 'Low', difficulty: 'Easy', prepTime: '1-2 days' },
      ],
    },
    {
      id: `${id}_reasoning_verbal`,
      name: 'Verbal Reasoning',
      topics: [
        { id: `${id}_reasoning_syllogism`, name: 'Syllogism', description: 'Venn diagram method, all-some-no statements, possibility cases, reverse syllogism (conclusion → premise).', weightage: 'Medium', difficulty: 'Medium', prepTime: '3-4 days' },
        { id: `${id}_reasoning_inequality`, name: 'Inequality', description: 'Mathematical inequalities (A>B, B≥C etc.), coded inequality (A@B means A>B), combined chains.', weightage: 'Medium', difficulty: 'Easy', prepTime: '2-3 days' },
        { id: `${id}_reasoning_blood`, name: 'Blood Relations', description: 'Building family trees, coded blood relations (pointing/saying type), mixed relationship chains.', weightage: 'Low', difficulty: 'Medium', prepTime: '2-3 days' },
        { id: `${id}_reasoning_direction`, name: 'Directions & Distances', description: 'Shadow-based directions, movement-based distance calculation, final position derivation.', weightage: 'Low', difficulty: 'Medium', prepTime: '2-3 days' },
        { id: `${id}_reasoning_coding`, name: 'Coding-Decoding', description: 'Letter/number coding, new pattern coding (row-based), message coding, conditional coding.', weightage: 'Medium', difficulty: 'Medium', prepTime: '3-4 days' },
        { id: `${id}_reasoning_alpha`, name: 'Alphanumeric Series', description: 'Letter sequences, number-letter mixed series, word-number based arrangements.', weightage: 'Medium', difficulty: 'Easy', prepTime: '2-3 days' },
      ],
    },
    {
      id: `${id}_reasoning_logical`,
      name: 'Logical Reasoning',
      topics: [
        { id: `${id}_reasoning_critical`, name: 'Critical Reasoning', description: 'Strong/weak arguments, course of action, cause and effect, inference-based questions (Mains level).', weightage: 'High', difficulty: 'Hard', prepTime: '5-6 days' },
        { id: `${id}_reasoning_input`, name: 'Input-Output', description: 'Word-number rearrangement machines, step-by-step pattern derivation.', weightage: 'Medium', difficulty: 'Hard', prepTime: '4-5 days' },
        { id: `${id}_reasoning_analogy`, name: 'Analogy & Classification', description: 'Semantic/symbolic/numeric analogies, odd one out classification.', weightage: 'Low', difficulty: 'Easy', prepTime: '1-2 days' },
      ],
    },
  ],
})

const englishSubject = (id: string): import('@/types').Subject => ({
  id: `${id}_english`,
  name: 'English Language',
  color: '#0ea5e9',
  sections: [
    {
      id: `${id}_english_rc`,
      name: 'Reading Comprehension',
      topics: [
        { id: `${id}_english_rc_main`, name: 'RC Passage', description: 'Business/economic/socio-political passages. Questions on main idea, inference, tone, title, vocabulary in context.', weightage: 'High', difficulty: 'Medium', prepTime: '7-10 days' },
        { id: `${id}_english_rc_vocab`, name: 'Vocabulary in Context', description: 'Synonyms/antonyms from passage, contextual meaning, one-word substitution.', weightage: 'Medium', difficulty: 'Medium', prepTime: '3-4 days' },
      ],
    },
    {
      id: `${id}_english_grammar`,
      name: 'Grammar',
      topics: [
        { id: `${id}_english_error`, name: 'Error Spotting', description: 'Subject-verb agreement, tense consistency, preposition use, article use, pronoun reference errors.', weightage: 'High', difficulty: 'Medium', prepTime: '5-6 days' },
        { id: `${id}_english_fib`, name: 'Fill in the Blanks', description: 'Single/double filler with options, word-pair fillers, grammatically correct + contextually fitting choice.', weightage: 'Medium', difficulty: 'Medium', prepTime: '4-5 days' },
        { id: `${id}_english_pj`, name: 'Para Jumbles', description: 'Rearranging 5-6 sentences into coherent paragraph. Identify opener, closer, mandatory pairs.', weightage: 'Medium', difficulty: 'Hard', prepTime: '5-6 days' },
        { id: `${id}_english_cloze`, name: 'Cloze Test', description: '10-word paragraph with blanks — choose contextually + grammatically correct word.', weightage: 'Medium', difficulty: 'Medium', prepTime: '3-4 days' },
        { id: `${id}_english_sentence`, name: 'Sentence Improvement', description: 'Identify incorrect part of sentence, choose correct replacement, correction in bold part.', weightage: 'Medium', difficulty: 'Medium', prepTime: '3-4 days' },
      ],
    },
  ],
})

const gaSubject = (id: string): import('@/types').Subject => ({
  id: `${id}_ga`,
  name: 'General Awareness',
  color: '#f59e0b',
  sections: [
    {
      id: `${id}_ga_banking`,
      name: 'Banking & Financial Awareness',
      topics: [
        { id: `${id}_ga_rbi`, name: 'RBI & Monetary Policy', description: 'RBI functions, repo/reverse repo/CRR/SLR rates, OMO, monetary policy committee, inflation targeting.', weightage: 'High', difficulty: 'Medium', prepTime: '4-5 days' },
        { id: `${id}_ga_banking_terms`, name: 'Banking Terminology', description: 'NPA/GNPA, SARFAESI, Basel norms, CRAR, priority sector lending, financial inclusion schemes.', weightage: 'High', difficulty: 'Medium', prepTime: '3-4 days' },
        { id: `${id}_ga_govt_schemes`, name: 'Government Schemes', description: 'PM Jan Dhan, PM Mudra, Kisan Credit Card, Atal Pension Yojana, PMJJBY, PMSBY — eligibility, benefits.', weightage: 'High', difficulty: 'Easy', prepTime: '3-4 days' },
        { id: `${id}_ga_intl_org`, name: 'International Organisations', description: 'IMF, World Bank, ADB, WTO, SWIFT — structure, HQ, India\'s role, recent news.', weightage: 'Medium', difficulty: 'Easy', prepTime: '2-3 days' },
      ],
    },
    {
      id: `${id}_ga_current`,
      name: 'Current Affairs',
      topics: [
        { id: `${id}_ga_ca_6m`, name: 'Last 6 Months Current Affairs', description: 'National/international events, appointments, sports awards, summits, MoUs, economic data.', weightage: 'High', difficulty: 'Easy', prepTime: 'Ongoing' },
        { id: `${id}_ga_static`, name: 'Static GK', description: 'National parks, capitals, currencies, headquarters, books & authors, important dates.', weightage: 'Medium', difficulty: 'Easy', prepTime: '5-7 days' },
        { id: `${id}_ga_economy`, name: 'Economy & Budget', description: 'Union Budget highlights, GDP data, Economic Survey, FDI/FII, trade balance, inflation indices.', weightage: 'High', difficulty: 'Medium', prepTime: '3-4 days' },
      ],
    },
  ],
})

export const syllabusData: ExamSyllabus[] = [
  // ─── SBI PO ──────────────────────────────────────────────────────────────────
  {
    examId: 'sbi_po',
    examName: 'SBI Probationary Officer',
    shortName: 'SBI PO',
    category: 'Banking',
    color: '#6366f1',
    icon: '🏦',
    stages: {
      prelims: {
        subjects: [
          quantSubject('sbi_po_pre'),
          reasoningSubject('sbi_po_pre'),
          englishSubject('sbi_po_pre'),
        ],
      },
      mains: {
        subjects: [
          {
            ...quantSubject('sbi_po_main'),
            id: 'sbi_po_main_quant',
            name: 'Data Analysis & Interpretation',
          },
          reasoningSubject('sbi_po_main'),
          englishSubject('sbi_po_main'),
          gaSubject('sbi_po_main'),
          {
            id: 'sbi_po_main_desc',
            name: 'Descriptive Paper',
            color: '#10b981',
            sections: [
              {
                id: 'sbi_po_main_desc_essay',
                name: 'Essay Writing',
                topics: [
                  { id: 'sbi_po_essay', name: 'Essay Writing (250 words)', description: 'Economy, social issues, banking, digital India, environment — structure: intro, body (3 para), conclusion.', weightage: 'High', difficulty: 'Hard', prepTime: '7-10 days' },
                ],
              },
              {
                id: 'sbi_po_main_desc_letter',
                name: 'Letter Writing',
                topics: [
                  { id: 'sbi_po_letter', name: 'Letter/Precis Writing', description: 'Formal letter to bank manager, complaint/application letters, précis writing in 80-100 words.', weightage: 'High', difficulty: 'Medium', prepTime: '4-5 days' },
                ],
              },
            ],
          },
        ],
      },
    },
  },

  // ─── IBPS PO ──────────────────────────────────────────────────────────────────
  {
    examId: 'ibps_po',
    examName: 'IBPS Probationary Officer',
    shortName: 'IBPS PO',
    category: 'Banking',
    color: '#8b5cf6',
    icon: '🏦',
    stages: {
      prelims: {
        subjects: [
          quantSubject('ibps_po_pre'),
          reasoningSubject('ibps_po_pre'),
          englishSubject('ibps_po_pre'),
        ],
      },
      mains: {
        subjects: [
          quantSubject('ibps_po_main'),
          reasoningSubject('ibps_po_main'),
          englishSubject('ibps_po_main'),
          gaSubject('ibps_po_main'),
          {
            id: 'ibps_po_main_comp',
            name: 'Computer Knowledge',
            color: '#06b6d4',
            sections: [
              {
                id: 'ibps_po_comp_basics',
                name: 'Computer Fundamentals',
                topics: [
                  { id: 'ibps_po_comp_os', name: 'Operating Systems', description: 'Windows, MS Office basics, file management, keyboard shortcuts.', weightage: 'Medium', difficulty: 'Easy', prepTime: '2-3 days' },
                  { id: 'ibps_po_comp_net', name: 'Networking & Internet', description: 'LAN/WAN/MAN, TCP/IP, HTTP/HTTPS, browsers, email protocols, cybersecurity basics.', weightage: 'Medium', difficulty: 'Easy', prepTime: '2-3 days' },
                  { id: 'ibps_po_comp_db', name: 'Database & MS Excel', description: 'DBMS concepts, spreadsheet functions, data types, queries basics.', weightage: 'Low', difficulty: 'Easy', prepTime: '2-3 days' },
                ],
              },
            ],
          },
        ],
      },
    },
  },

  // ─── IBPS Clerk ──────────────────────────────────────────────────────────────
  {
    examId: 'ibps_clerk',
    examName: 'IBPS Clerk',
    shortName: 'IBPS Clerk',
    category: 'Banking',
    color: '#a78bfa',
    icon: '🏦',
    stages: {
      prelims: {
        subjects: [
          quantSubject('ibps_clerk_pre'),
          reasoningSubject('ibps_clerk_pre'),
          englishSubject('ibps_clerk_pre'),
        ],
      },
      mains: {
        subjects: [
          quantSubject('ibps_clerk_main'),
          reasoningSubject('ibps_clerk_main'),
          englishSubject('ibps_clerk_main'),
          gaSubject('ibps_clerk_main'),
        ],
      },
    },
  },

  // ─── RBI Grade B ──────────────────────────────────────────────────────────────
  {
    examId: 'rbi_grade_b',
    examName: 'RBI Grade B Officer',
    shortName: 'RBI Grade B',
    category: 'Banking',
    color: '#7c3aed',
    icon: '🏦',
    stages: {
      prelims: {
        subjects: [
          quantSubject('rbi_gb_pre'),
          reasoningSubject('rbi_gb_pre'),
          englishSubject('rbi_gb_pre'),
          gaSubject('rbi_gb_pre'),
        ],
      },
      mains: {
        subjects: [
          {
            id: 'rbi_gb_main_eco',
            name: 'Economics & Social Issues',
            color: '#f59e0b',
            sections: [
              {
                id: 'rbi_gb_micro',
                name: 'Microeconomics',
                topics: [
                  { id: 'rbi_gb_demand', name: 'Demand & Supply Analysis', description: 'Demand/supply curves, elasticity (price, income, cross), market equilibrium, consumer surplus.', weightage: 'High', difficulty: 'Medium', prepTime: '4-5 days' },
                  { id: 'rbi_gb_market', name: 'Market Structures', description: 'Perfect competition, monopoly, oligopoly, monopolistic competition — pricing and output decisions.', weightage: 'High', difficulty: 'Hard', prepTime: '5-6 days' },
                ],
              },
              {
                id: 'rbi_gb_macro',
                name: 'Macroeconomics',
                topics: [
                  { id: 'rbi_gb_gdp', name: 'National Income Accounting', description: 'GDP/GNP/NNP, methods of calculation, deflator, base year revision.', weightage: 'High', difficulty: 'Medium', prepTime: '3-4 days' },
                  { id: 'rbi_gb_monetary', name: 'Monetary Policy', description: 'Money supply (M0-M4), credit creation, transmission mechanism, inflation targeting framework.', weightage: 'High', difficulty: 'Hard', prepTime: '5-7 days' },
                  { id: 'rbi_gb_fiscal', name: 'Fiscal Policy', description: 'Government budget, fiscal deficit, revenue deficit, FRBM Act, public debt management.', weightage: 'High', difficulty: 'Medium', prepTime: '4-5 days' },
                ],
              },
            ],
          },
          {
            id: 'rbi_gb_main_fin',
            name: 'Finance & Management',
            color: '#0ea5e9',
            sections: [
              {
                id: 'rbi_gb_fin',
                name: 'Financial Markets',
                topics: [
                  { id: 'rbi_gb_capital', name: 'Capital Markets', description: 'Primary/secondary market, SEBI, IPO process, derivatives (futures, options, swaps), bond valuation.', weightage: 'High', difficulty: 'Hard', prepTime: '6-7 days' },
                  { id: 'rbi_gb_banking_reg', name: 'Banking Regulation', description: 'Banking Regulation Act, RBI Act, FEMA, IBC, SARFAESI — key provisions and recent amendments.', weightage: 'High', difficulty: 'Medium', prepTime: '4-5 days' },
                ],
              },
            ],
          },
          englishSubject('rbi_gb_main'),
        ],
      },
    },
  },

  // ─── LIC AAO ──────────────────────────────────────────────────────────────────
  {
    examId: 'lic_aao',
    examName: 'LIC Assistant Administrative Officer',
    shortName: 'LIC AAO',
    category: 'Insurance',
    color: '#0ea5e9',
    icon: '🛡️',
    stages: {
      prelims: {
        subjects: [
          quantSubject('lic_aao_pre'),
          reasoningSubject('lic_aao_pre'),
          englishSubject('lic_aao_pre'),
        ],
      },
      mains: {
        subjects: [
          quantSubject('lic_aao_main'),
          reasoningSubject('lic_aao_main'),
          gaSubject('lic_aao_main'),
          {
            id: 'lic_aao_insurance',
            name: 'Insurance & Financial Market Awareness',
            color: '#0ea5e9',
            sections: [
              {
                id: 'lic_aao_ins_basics',
                name: 'Insurance Fundamentals',
                topics: [
                  { id: 'lic_aao_ins_principles', name: 'Principles of Insurance', description: 'Utmost good faith, insurable interest, indemnity, contribution, subrogation, proximate cause.', weightage: 'High', difficulty: 'Medium', prepTime: '4-5 days' },
                  { id: 'lic_aao_life_ins', name: 'Life Insurance Products', description: 'Term, whole life, endowment, ULIP, money-back policies. LIC schemes — Jeevan Anand, Bima Jyoti.', weightage: 'High', difficulty: 'Medium', prepTime: '3-4 days' },
                  { id: 'lic_aao_irdai', name: 'IRDAI Regulations', description: 'IRDAI structure, functions, FDI norms in insurance, grievance redressal, ombudsman scheme.', weightage: 'High', difficulty: 'Medium', prepTime: '3-4 days' },
                ],
              },
            ],
          },
        ],
      },
    },
  },

  // ─── NIACL AO ──────────────────────────────────────────────────────────────────
  {
    examId: 'niacl_ao',
    examName: 'New India Assurance Company AO',
    shortName: 'NIACL AO',
    category: 'Insurance',
    color: '#38bdf8',
    icon: '🛡️',
    stages: {
      prelims: {
        subjects: [
          quantSubject('niacl_pre'),
          reasoningSubject('niacl_pre'),
          englishSubject('niacl_pre'),
        ],
      },
      mains: {
        subjects: [
          quantSubject('niacl_main'),
          reasoningSubject('niacl_main'),
          englishSubject('niacl_main'),
          gaSubject('niacl_main'),
          {
            id: 'niacl_general_ins',
            name: 'General Insurance Awareness',
            color: '#38bdf8',
            sections: [
              {
                id: 'niacl_ins_products',
                name: 'General Insurance Products',
                topics: [
                  { id: 'niacl_motor', name: 'Motor Insurance', description: 'Own damage, third party liability, comprehensive cover, IMT endorsements, NCB.', weightage: 'High', difficulty: 'Medium', prepTime: '3-4 days' },
                  { id: 'niacl_health', name: 'Health Insurance', description: 'Mediclaim, cashless facility, TPA, pre-existing disease clause, PMJAY Ayushman Bharat.', weightage: 'High', difficulty: 'Medium', prepTime: '3-4 days' },
                  { id: 'niacl_marine', name: 'Marine & Fire Insurance', description: 'Marine cargo/hull, fire insurance perils, consequential loss, reinstatement value.', weightage: 'Medium', difficulty: 'Hard', prepTime: '4-5 days' },
                ],
              },
            ],
          },
        ],
      },
    },
  },

  // ─── UPSC Prelims ──────────────────────────────────────────────────────────────
  {
    examId: 'upsc_prelims',
    examName: 'UPSC Civil Services (Prelims)',
    shortName: 'UPSC CSE',
    category: 'Government',
    color: '#f59e0b',
    icon: '⚖️',
    stages: {
      prelims: {
        subjects: [
          {
            id: 'upsc_gs1',
            name: 'General Studies Paper I',
            color: '#f59e0b',
            sections: [
              {
                id: 'upsc_history',
                name: 'History',
                topics: [
                  { id: 'upsc_ancient', name: 'Ancient India', description: 'Indus Valley, Vedic period, Mauryas, Guptas, religious movements (Buddhism, Jainism), art and architecture.', weightage: 'High', difficulty: 'Medium', prepTime: '10-12 days' },
                  { id: 'upsc_medieval', name: 'Medieval India', description: 'Delhi Sultanate, Mughal Empire, Bhakti-Sufi movements, regional kingdoms, art and architecture.', weightage: 'High', difficulty: 'Medium', prepTime: '8-10 days' },
                  { id: 'upsc_modern', name: 'Modern India', description: 'British expansion, socio-religious reforms, 1857 revolt, national movement from 1885-1947, important personalities.', weightage: 'High', difficulty: 'Hard', prepTime: '12-15 days' },
                  { id: 'upsc_world_history', name: 'World History', description: 'American Revolution, French Revolution, World Wars, colonialism, Cold War — causes, events, impact.', weightage: 'Medium', difficulty: 'Medium', prepTime: '7-10 days' },
                ],
              },
              {
                id: 'upsc_geography',
                name: 'Geography',
                topics: [
                  { id: 'upsc_physical_geo', name: 'Physical Geography', description: 'Geomorphology, climatology, oceanography, earthquakes/volcanoes, drainage systems.', weightage: 'High', difficulty: 'Hard', prepTime: '10-12 days' },
                  { id: 'upsc_indian_geo', name: 'Indian Geography', description: 'Physical features, monsoon, rivers, soil types, natural vegetation, minerals distribution.', weightage: 'High', difficulty: 'Medium', prepTime: '8-10 days' },
                  { id: 'upsc_eco_geo', name: 'Economic Geography', description: 'Agriculture patterns, industries, transport networks, population distribution, urbanisation.', weightage: 'Medium', difficulty: 'Medium', prepTime: '5-7 days' },
                ],
              },
              {
                id: 'upsc_polity',
                name: 'Indian Polity & Governance',
                topics: [
                  { id: 'upsc_constitution', name: 'Constitution of India', description: 'Preamble, fundamental rights, DPSPs, fundamental duties, constitutional amendments, schedules.', weightage: 'High', difficulty: 'Medium', prepTime: '10-12 days' },
                  { id: 'upsc_parliament', name: 'Parliament & State Legislatures', description: 'Lok Sabha/Rajya Sabha composition, sessions, bills, committees, President/VP roles.', weightage: 'High', difficulty: 'Medium', prepTime: '6-8 days' },
                  { id: 'upsc_judiciary', name: 'Judiciary', description: 'Supreme Court, High Courts, judicial review, PILs, constitutional bodies (CAG, Election Commission, UPSC).', weightage: 'High', difficulty: 'Medium', prepTime: '6-8 days' },
                ],
              },
              {
                id: 'upsc_economy',
                name: 'Economy',
                topics: [
                  { id: 'upsc_eco_basics', name: 'Economic Development', description: 'Planning in India, LPG reforms 1991, sectors of economy, poverty, inequality, Human Development Index.', weightage: 'High', difficulty: 'Medium', prepTime: '7-10 days' },
                  { id: 'upsc_banking_eco', name: 'Banking & Finance', description: 'RBI functions, monetary policy, financial sector reforms, stock markets, foreign trade policy.', weightage: 'High', difficulty: 'Medium', prepTime: '5-7 days' },
                ],
              },
              {
                id: 'upsc_environment',
                name: 'Environment & Ecology',
                topics: [
                  { id: 'upsc_biodiversity', name: 'Biodiversity', description: 'Ecosystem types, biomes, hotspots, IUCN Red List, national parks, wildlife protection act.', weightage: 'High', difficulty: 'Medium', prepTime: '5-7 days' },
                  { id: 'upsc_climate_change', name: 'Climate Change & Env. Issues', description: 'UNFCCC, Paris Agreement, Kyoto Protocol, pollution types, environmental laws in India.', weightage: 'High', difficulty: 'Medium', prepTime: '5-7 days' },
                ],
              },
              {
                id: 'upsc_science',
                name: 'Science & Technology',
                topics: [
                  { id: 'upsc_sci_tech', name: 'Science & Technology', description: 'Space tech (ISRO), defence tech, biotech, nano technology, IT/AI, recent discoveries.', weightage: 'High', difficulty: 'Medium', prepTime: '5-7 days' },
                ],
              },
            ],
          },
          {
            id: 'upsc_csat',
            name: 'General Studies Paper II (CSAT)',
            color: '#6366f1',
            sections: [
              {
                id: 'upsc_csat_comp',
                name: 'Comprehension',
                topics: [
                  { id: 'upsc_csat_rc', name: 'Reading Comprehension', description: 'Dense passages from philosophy, science, policy. Inference, assumptions, conclusions. Qualifying (33%).', weightage: 'High', difficulty: 'Medium', prepTime: '5-7 days' },
                ],
              },
              {
                id: 'upsc_csat_quant',
                name: 'Quantitative Aptitude',
                topics: [
                  { id: 'upsc_csat_math', name: 'Basic Numeracy', description: 'Data sufficiency, arithmetic, basic algebra. Class 10 level. Qualifying paper — aim 40+ marks.', weightage: 'Medium', difficulty: 'Easy', prepTime: '5-7 days' },
                ],
              },
            ],
          },
        ],
      },
    },
  },

  // ─── CDS ──────────────────────────────────────────────────────────────────────
  {
    examId: 'cds',
    examName: 'Combined Defence Services',
    shortName: 'CDS',
    category: 'Defence',
    color: '#10b981',
    icon: '🎖️',
    stages: {
      paper1: {
        subjects: [
          {
            id: 'cds_english',
            name: 'English',
            color: '#0ea5e9',
            sections: [
              {
                id: 'cds_eng_comp',
                name: 'Comprehension & Grammar',
                topics: [
                  { id: 'cds_rc', name: 'Reading Comprehension', description: 'Literary/factual passages testing inference, attitude, structure. Class 12+ level.', weightage: 'High', difficulty: 'Medium', prepTime: '7-10 days' },
                  { id: 'cds_grammar', name: 'Grammar & Usage', description: 'Spotting errors, sentence arrangement, selecting words/phrases — tests basic grammatical correctness.', weightage: 'High', difficulty: 'Medium', prepTime: '5-6 days' },
                  { id: 'cds_vocabulary', name: 'Vocabulary', description: 'Synonyms, antonyms, idioms & phrases, one-word substitution, spelling errors.', weightage: 'Medium', difficulty: 'Easy', prepTime: '4-5 days' },
                ],
              },
            ],
          },
          {
            id: 'cds_gk',
            name: 'General Knowledge',
            color: '#f59e0b',
            sections: [
              {
                id: 'cds_gk_sec',
                name: 'General Knowledge Topics',
                topics: [
                  { id: 'cds_current', name: 'Current Events', description: 'National/international news, defence acquisitions, border issues, scientific achievements, awards.', weightage: 'High', difficulty: 'Easy', prepTime: 'Ongoing' },
                  { id: 'cds_history_gk', name: 'History of India', description: 'Indian independence movement, post-independence consolidation, wars (1962, 1965, 1971, Kargil).', weightage: 'High', difficulty: 'Medium', prepTime: '7-10 days' },
                  { id: 'cds_geo_gk', name: 'Geography', description: 'Physical geography, Indian geography, world geography — capitals, rivers, mountains.', weightage: 'Medium', difficulty: 'Easy', prepTime: '5-6 days' },
                  { id: 'cds_defence_knowledge', name: 'Defence & Armed Forces', description: 'Indian Army/Navy/Air Force structure, ranks, weapons systems, military history, NDA/INA.', weightage: 'High', difficulty: 'Medium', prepTime: '5-7 days' },
                ],
              },
            ],
          },
        ],
      },
      paper2: {
        subjects: [
          {
            id: 'cds_maths',
            name: 'Elementary Mathematics',
            color: '#6366f1',
            sections: [
              {
                id: 'cds_maths_arith',
                name: 'Arithmetic',
                topics: [
                  { id: 'cds_number_system', name: 'Number System', description: 'Natural numbers, integers, rational/irrational numbers, real numbers, LCM/HCF, prime factorisation.', weightage: 'High', difficulty: 'Easy', prepTime: '3-4 days' },
                  { id: 'cds_percentage_math', name: 'Percentage, Ratio, Proportion', description: 'Percentage calculations, ratio problems, proportionality, unitary method.', weightage: 'High', difficulty: 'Easy', prepTime: '3-4 days' },
                ],
              },
              {
                id: 'cds_maths_algebra',
                name: 'Algebra & Geometry',
                topics: [
                  { id: 'cds_algebra', name: 'Algebra', description: 'Basic algebraic operations, polynomials, simultaneous linear equations, quadratic equations.', weightage: 'High', difficulty: 'Medium', prepTime: '5-6 days' },
                  { id: 'cds_geometry', name: 'Geometry', description: 'Lines and angles, triangles, circles, quadrilaterals — properties and theorems.', weightage: 'High', difficulty: 'Medium', prepTime: '5-6 days' },
                  { id: 'cds_trigonometry', name: 'Trigonometry', description: 'Ratios, identities, heights and distances, trigonometric tables.', weightage: 'High', difficulty: 'Medium', prepTime: '5-7 days' },
                  { id: 'cds_statistics', name: 'Statistics', description: 'Mean, median, mode, frequency distribution, bar graphs, pie charts, histograms.', weightage: 'Medium', difficulty: 'Easy', prepTime: '3-4 days' },
                ],
              },
            ],
          },
        ],
      },
    },
  },

  // ─── SSC CGL ──────────────────────────────────────────────────────────────────
  {
    examId: 'ssc_cgl',
    examName: 'SSC Combined Graduate Level',
    shortName: 'SSC CGL',
    category: 'Government',
    color: '#f97316',
    icon: '📋',
    stages: {
      tier1: {
        subjects: [
          quantSubject('ssc_cgl_t1'),
          reasoningSubject('ssc_cgl_t1'),
          englishSubject('ssc_cgl_t1'),
          {
            id: 'ssc_cgl_gk',
            name: 'General Awareness',
            color: '#f59e0b',
            sections: [
              {
                id: 'ssc_cgl_gk_sec',
                name: 'General Awareness Topics',
                topics: [
                  { id: 'ssc_cgl_history', name: 'History', description: 'Indian history — ancient, medieval, modern. Focus on NCERT Class 6-12. SSC favours factual direct questions.', weightage: 'High', difficulty: 'Easy', prepTime: '7-10 days' },
                  { id: 'ssc_cgl_polity', name: 'Polity & Governance', description: 'Constitution, fundamental rights, elections, Parliament, constitutional bodies.', weightage: 'High', difficulty: 'Easy', prepTime: '5-7 days' },
                  { id: 'ssc_cgl_science', name: 'General Science', description: 'Physics (optics, mechanics), Chemistry (reactions, periodic table), Biology (cell, genetics, ecology).', weightage: 'High', difficulty: 'Easy', prepTime: '7-10 days' },
                  { id: 'ssc_cgl_ca', name: 'Current Affairs', description: 'Last 6-12 months news. Awards, appointments, sports, schemes, obituaries.', weightage: 'High', difficulty: 'Easy', prepTime: 'Ongoing' },
                ],
              },
            ],
          },
        ],
      },
      tier2: {
        subjects: [
          {
            id: 'ssc_cgl_t2_quant',
            name: 'Quantitative Aptitude (Advanced)',
            color: '#6366f1',
            sections: [
              {
                id: 'ssc_cgl_t2_adv',
                name: 'Advanced Arithmetic & Geometry',
                topics: [
                  { id: 'ssc_cgl_mensuration', name: 'Mensuration', description: '2D shapes (area, perimeter) and 3D shapes (volume, surface area) — cube, cylinder, cone, sphere.', weightage: 'High', difficulty: 'Medium', prepTime: '5-6 days' },
                  { id: 'ssc_cgl_trigonometry', name: 'Trigonometry', description: 'Trigonometric identities, complementary angles, heights and distances, inverse trig.', weightage: 'High', difficulty: 'Hard', prepTime: '7-8 days' },
                  { id: 'ssc_cgl_geometry', name: 'Geometry', description: 'Circles (chords, tangents, arcs), triangles (centres, congruence), quadrilaterals.', weightage: 'High', difficulty: 'Hard', prepTime: '7-8 days' },
                  { id: 'ssc_cgl_algebra_t2', name: 'Algebra', description: 'Identities (a+b)², a³+b³, simplification of algebraic expressions, surds and indices.', weightage: 'High', difficulty: 'Medium', prepTime: '4-5 days' },
                ],
              },
            ],
          },
          englishSubject('ssc_cgl_t2'),
        ],
      },
    },
  },
]

export function getExamById(examId: string): ExamSyllabus | undefined {
  return syllabusData.find(e => e.examId === examId)
}

export function getAllTopics(exam: ExamSyllabus): import('@/types').Topic[] {
  const topics: import('@/types').Topic[] = []
  Object.values(exam.stages).forEach(stage => {
    if (!stage) return
    stage.subjects.forEach(subject => {
      subject.sections.forEach(section => {
        section.topics.forEach(topic => topics.push(topic))
      })
    })
  })
  return topics
}

export function getTopicCount(exam: ExamSyllabus): number {
  return getAllTopics(exam).length
}
