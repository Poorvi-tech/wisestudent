import { Shield, CreditCard, Briefcase, Wallet, Banknote, ShieldCheck, Coins, FileText, HeartHandshake } from "lucide-react";

export const insurancePensionGameIds = Array.from({ length: 100 }, (_, index) => `finance-insurance-pension-${index + 1}`);

const baseGames = [
  {
    title: "Sudden Hospital Bill",
    slug: "sudden-hospital-bill",
    description:
      "A worker is hospitalised and treatment costs Rs 1.5 lakh. What is insurance meant to do?",
    difficulty: "Easy",
    scenario: {
      question:
        "A worker is hospitalised and treatment costs Rs 1.5 lakh. What is insurance meant to do?",
      options: [
        "Increase income",
        "Reduce financial risk",
        "Replace savings completely",
        "Remove all expenses",
      ],
      correct: 2,
      outcome: "Insurance protects against large unexpected costs.",
    },
  },
  {
    title: "Protection Reflex",
    slug: "protection-reflex",
    description: "Tap “Risk Covered” when large expense appears; avoid “No Planning.”",
    difficulty: "Easy",
    scenario: {
      question: "A sudden large expense appears. Best reflex?",
      options: [
        "Risk Covered (appropriate insurance)",
        "No Planning",
        "Borrow immediately",
        "Delay decision",
      ],
      correct: 1,
      outcome: "Reflex to protection reduces shock; avoiding “No Planning” prevents crisis.",
    },
  },
  {
    title: "Savings Alone",
    slug: "savings-alone",
    description:
      "A family has Rs 20,000 savings but faces Rs 1 lakh medical cost. What helps most?",
    difficulty: "Easy",
    scenario: {
      question:
        "A family has Rs 20,000 savings but faces Rs 1 lakh medical cost. What helps most?",
      options: [
        "Savings only",
        "Insurance only",
        "Insurance plus savings",
        "Borrow from friends",
      ],
      correct: 3,
      outcome: "Savings help small needs; insurance protects big risks.",
    },
  },
  {
    title: "Insurance Coverage Match",
    slug: "insurance-coverage-match",
    description:
      "Match: “Premium → Protection”, “Claim → Compensation”, “Risk → Uncertainty”.",
    difficulty: "Easy",
    scenario: {
      question: "Match each insurance term to its correct meaning.",
      options: [
        "Premium → Protection",
        "Claim → Compensation",
        "Risk → Uncertainty",
        "Policy → Contract",
      ],
      correct: 1,
      outcome: "Understanding core terms builds strong protection decisions.",
    },
  },
  {
    title: "Who Needs Insurance",
    slug: "who-needs-insurance",
    description: "Understand why protection planning should start early for anyone with risks or dependents.",
    difficulty: "Easy",
    scenario: {
      question: "A 28-year-old says insurance is only for old people. What's correct?",
      options: [
        "Only elderly need it",
        "Only rich people need it",
        "Anyone with risk or dependents may need it",
        "Nobody needs it",
      ],
      correct: 3,
      outcome: "Protection planning should start early.",
    },
  },
   {
    title: "Journal: My Family Risks",
    slug: "journal-my-family-risks",
    description: "Write: “One risk my family may face is ___.”",
    difficulty: "Easy",
    scenario: {
      question: "Reflect and write at least 10 characters about a family risk.",
      options: [
        "Health expenses",
        "Job loss",
        "Accident",
        "Weather shock",
      ],
      correct: 1,
      outcome: "Writing builds awareness of risks and the need for protection.",
    },
  },
  {
    title: "Medical Cost Reality",
    slug: "medical-cost-reality",
    description: "See how unexpected medical needs can create sudden costs and why coverage matters.",
    difficulty: "Easy",
    scenario: {
      question: "A healthy person suddenly needs surgery. What does this show?",
      options: [
        "Health costs are predictable",
        "Illness only happens in old age",
        "Medical risk can occur anytime",
        "Hospitals charge randomly",
      ],
      correct: 3,
      outcome: "Insurance reduces the impact of uncertainty.",
    },
  },
  {
    title: "Life Cover Purpose",
    slug: "life-cover-purpose",
    description: "Learn why life cover protects dependents from sudden income loss.",
    difficulty: "Easy",
    scenario: {
      question: "A father is sole earner for family. Why consider life insurance?",
      options: [
        "For luxury bonus",
        "For tax only",
        "To protect family income",
        "For travel benefits",
      ],
      correct: 3,
      outcome: "Life cover protects dependents from income loss.",
    },
  },
 
  {
    title: "Premium Confusion",
    slug: "premium-confusion",
    description: "Understand why paying a premium is about protection, not guaranteed returns.",
    difficulty: "Easy",
    scenario: {
      question: "Someone says insurance premium is wasted money. What's true?",
      options: [
        "Premium is loss",
        "Premium buys safety",
        "Premium guarantees profit",
        "Premium is optional always",
      ],
      correct: 2,
      outcome: "Insurance is about protection, not returns.",
    },
  },
  {
    title: "Badge: Protection Beginner",
    slug: "badge-protection-beginner",
    description: "Complete 5 protection basics to earn the “Protection Beginner” badge.",
    difficulty: "Easy",
    isBadgeGame: true,
          badgeName: "Badge: Protection Beginner",
          badgeImage: "/badges/finance/InsurancePension/badge-protection-beginner.png",
    scenario: {
      question: "Test your protection basics and earn a starter badge.",
      options: [
        "Premium → Protection",
        "Claim → Compensation",
        "Read policy terms",
        "Manage uncertainty",
      ],
      correct: 1,
      outcome: "Basics mastered. Achievement: Protection Beginner.",
    },
  },
  {
    title: "Policy Reading",
    slug: "policy-reading",
    description: "See why reading coverage and exclusions prevents claim problems.",
    difficulty: "Easy",
    scenario: {
      question: "A buyer signs without reading policy. What's safer?",
      options: [
        "Trust agent blindly",
        "Read coverage and exclusions",
        "Ignore documents",
        "Assume all policies same",
      ],
      correct: 2,
      outcome: "Understanding terms prevents claim problems.",
    },
  },
  {
    title: "Coverage Puzzle",
    slug: "coverage-puzzle",
    description:
      "Match: “Hospitalization → Health Cover”, “Death → Life Cover”, “Fire → Property Cover”.",
    difficulty: "Easy",
    scenario: {
      question: "Match each event to the right coverage type.",
      options: [
        "Hospitalization → Health Cover",
        "Death → Life Cover",
        "Fire → Property Cover",
        "Third-Party → Motor Cover",
      ],
      correct: 1,
      outcome: "Linking events to coverage builds correct protection habits.",
    },
  },
  {
    title: "Claim Preparation",
    slug: "claim-preparation",
    description: "Learn why keeping documents ready speeds up insurance claims.",
    difficulty: "Easy",
    scenario: {
      question: "A family struggles to claim because documents missing. What should be done earlier?",
      options: [
        "Ignore paperwork",
        "Keep documents ready",
        "Depend on hospital",
        "Call agent later",
      ],
      correct: 2,
      outcome: "Prepared documentation speeds claims.",
    },
  },
  {
    title: "Fake Insurance Offer",
    slug: "fake-insurance-offer",
    description: "Learn how to spot unrealistic promises and verify insurer authenticity.",
    difficulty: "Easy",
    scenario: {
      question: "Someone promises \"double money insurance\". What should you do first?",
      options: [
        "Buy quickly",
        "Verify insurer authenticity",
        "Share OTP",
        "Pay cash",
      ],
      correct: 2,
      outcome: "Fraud often hides behind unrealistic promises.",
    },
  },
  {
    title: "Claim Process Simulation",
    slug: "claim-process-simulation",
    description: "Upload documents → Verify → Claim Approved. Choose the correct order.",
    difficulty: "Easy",
    scenario: {
      question: "Choose the correct order for a typical claim.",
      options: [
        "Upload documents → Verification → Claim approved",
        "Claim approved → Upload documents → Verification",
        "Verification → Upload documents → Claim approved",
        "Verification → Claim approved → Upload documents",
      ],
      correct: 1,
      outcome: "Correct flow: submit documents, verification, then approval.",
    },
  },
  {
    title: "When Insurance Matters",
    slug: "when-insurance-matters",
    description: "Understand how responsibility and dependents increase the need for protection.",
    difficulty: "Easy",
    scenario: {
      question: "A worker asks when to consider insurance. Best answer:",
      options: [
        "Only after becoming rich",
        "When income supports family",
        "Only after retirement",
        "Only when sick",
      ],
      correct: 2,
      outcome: "Responsibility increases need for protection.",
    },
  },
  {
    title: "Business Risk",
    slug: "business-risk",
    description: "Learn how insurance can reduce income shocks from business losses.",
    difficulty: "Easy",
    scenario: {
      question: "A shop owner loses stock in a fire. What lesson fits insurance?",
      options: [
        "Business risks never happen",
        "Protection planning helps income stability",
        "Insurance stops disasters",
        "Loans solve all losses",
      ],
      correct: 2,
      outcome: "Insurance reduces income shock.",
    },
  },
  {
    title: "Insurance Decision Check",
    slug: "insurance-decision-check",
    description: "Focus on coverage and claim rules instead of sales pitch or brochures.",
    difficulty: "Easy",
    scenario: {
      question:
        "A worker compares two policies but doesn’t know what to check. What matters most?",
      options: [
        "Agent’s friendliness",
        "Coverage and claim rules",
        "Colour of brochure",
        "Premium discount only",
      ],
      correct: 2,
      outcome: "Protection value matters more than sales pitch.",
    },
  },
  {
    title: "Reflex: Safe vs Risk",
    slug: "reflex-safe-vs-risk",
    description: "Tap “Verify Insurer”, avoid “Blind Trust”. Timed 10s reflex choices.",
    difficulty: "Easy",
    scenario: {
      question: "Quick reflex: safer tap in risky outreach?",
      options: [
        "Verify Insurer",
        "Blind Trust",
        "Share OTP",
        "Click Unknown Link",
      ],
      correct: 1,
      outcome: "Safer reflexes reduce fraud risk.",
    },
  },
  {
    title: "Badge: Insurance Aware",
    slug: "badge-insurance-aware",
    description: "Complete 5 safe insurance decisions to earn the “Insurance Aware” badge.",
    difficulty: "Easy",
    isBadgeGame: true,
          badgeName: "Badge: Insurance Aware",
          badgeImage: "/badges/finance/InsurancePension/badge-insurance-aware.png",
    scenario: {
      question: "Practice safe insurance decisions to unlock the badge.",
      options: [
        "Read policy terms",
        "Verify insurer",
        "Keep documents ready",
        "Avoid OTP sharing",
      ],
      correct: 1,
      outcome: "Safe decisions build long-term protection.",
    },
  },
  {
    title: "Work Forever Myth",
    slug: "work-forever-myth",
    description: "Learn why retirement planning protects independence as work ability changes.",
    difficulty: "Easy",
    scenario: {
      question: "A worker assumes income will continue forever. What's realistic?",
      options: [
        "Income never stops",
        "Work ability reduces with age",
        "Children will always pay",
        "Savings unnecessary",
      ],
      correct: 2,
      outcome: "Retirement planning protects independence.",
    },
  },
  {
    title: "Dependence Risk",
    slug: "dependence-risk",
    description: "Understand why personal financial security reduces future burden.",
    difficulty: "Easy",
    scenario: {
      question: "Someone plans to rely fully on children in old age. What's safer?",
      options: [
        "Depend completely",
        "Build personal financial security",
        "Spend all income now",
        "Ignore future",
      ],
      correct: 2,
      outcome: "Personal planning reduces future burden.",
    },
  },
  {
    title: "Retirement Planning Debate",
    slug: "retirement-planning-debate",
    description: "Topic: “Should retirement planning start early?” Choose the stronger argument.",
    difficulty: "Easy",
    scenario: {
      question: "Debate focus: When is the right time to start?",
      options: [
        "Start early for time and compounding",
        "Start only near retirement",
        "No need to plan",
      ],
      correct: 1,
      outcome: "Early planning wins debate: time and compounding matter.",
    },
  },
  {
    title: "Early Saving Advantage",
    slug: "early-saving-advantage",
    description: "See how starting early strengthens long-term savings.",
    difficulty: "Easy",
    scenario: {
      question: "Two people start saving at 25 and 40. Who benefits more long-term?",
      options: [
        "Both equal",
        "Early saver",
        "Late saver",
        "Depends on luck",
      ],
      correct: 2,
      outcome: "Time strengthens savings.",
    },
  },
 {
    title: "Small Savings Logic",
    slug: "small-savings-logic",
    description: "Learn how consistency turns small savings into real security.",
    scenario: {
      question: "A worker says ₹500 monthly is useless. What's true?",
      options: [
        "Small savings useless",
        "Consistent saving builds security",
        "Only big investments matter",
        "Saving optional",
      ],
      correct: 2,
      outcome: "Discipline matters more than size.",
    },
  },
  {
    title: "Informal Worker Reality",
    slug: "informal-worker-reality",
    description: "Understand why informal workers need extra retirement planning.",
    difficulty: "Easy",
    scenario: {
      question: "A daily wage worker has no retirement plan. Main risk?",
      options: [
        "No problem",
        "Financial stress in later life",
        "Higher income later",
        "Free pension guaranteed",
      ],
      correct: 2,
      outcome: "Informal workers need extra planning.",
    },
  },
   {
    title: "Pension Fund Puzzle",
    slug: "pension-fund-puzzle",
    description:
      "Match: “Monthly Saving → Long-term Growth”, “Delay → Less Corpus”, “Early Start → More Compounding”.",
    difficulty: "Easy",
    scenario: {
      question: "Match each pension action to its correct outcome.",
      options: [
        "Monthly Saving → Long-term Growth",
        "Delay → Less Corpus",
        "Early Start → More Compounding",
        "Employer Contribution → Extra Boost",
      ],
      correct: 1,
      outcome: "Monthly saving and early start grow pension; delays reduce corpus.",
    },
  },
  
  {
    title: "Pension vs Emergency Fund",
    slug: "pension-vs-emergency-fund",
    description: "Learn why retirement and emergency savings should be kept separate.",
    difficulty: "Easy",
    scenario: {
      question: "A person uses retirement savings for daily expenses. Better approach?",
      options: [
        "Mix all funds",
        "Keep separate savings goals",
        "Spend pension early",
        "Ignore emergencies",
      ],
      correct: 2,
      outcome: "Different goals need separate funds.",
    },
  },
  {
    title: "Government Pension Awareness",
    slug: "government-pension-awareness",
    description: "Learn eligibility and process to access available pension support.",
    difficulty: "Easy",
    scenario: {
      question: "A worker hears about pension schemes. First step?",
      options: [
        "Ignore",
        "Learn eligibility and process",
        "Pay immediately",
        "Depend on rumours",
      ],
      correct: 2,
      outcome: "Awareness helps use available support.",
    },
  },
  {
    title: "Badge: Future Planner",
    slug: "badge-future-planner",
    description: "Handle 5 retirement planning cases and earn the “Future Planner” badge.",
    difficulty: "Easy",
    isBadgeGame: true,
          badgeName: "Badge: Future Planner",
          badgeImage: "/badges/finance/InsurancePension/badge-future-planner.png",
    scenario: {
      question: "Test your retirement planning skills to unlock the badge.",
      options: [
        "Start early and separate goals",
        "Ignore inflation and longevity",
        "Use pension for emergencies",
        "Rely entirely on luck",
      ],
      correct: 1,
      outcome: "Future planning requires early disciplined saving and buffers.",
    },
  },
  
  {
    title: "Lifestyle vs Future",
    slug: "lifestyle-vs-future",
    description: "Learn why balancing present spending with future planning prevents dependence.",
    scenario: {
      question: "A person spends entire salary each month. What's wiser?",
      options: [
        "Spend fully",
        "Balance present and future",
        "Borrow later",
        "Depend on family",
      ],
      correct: 2,
      outcome: "Planning prevents future dependence.",
    },
  },
  {
    title: "Retirement Reality",
    slug: "retirement-reality",
    description: "See how long-term planning supports dignity in old age.",
    difficulty: "Easy",
    scenario: {
      question: "A retired person has no savings. What could have helped earlier?",
      options: [
        "Luck",
        "Long-term financial planning",
        "More spending",
        "Ignoring future",
      ],
      correct: 2,
      outcome: "Preparation supports dignity in old age.",
    },
  },
  {
    title: "Journal: My Retirement Vision",
    slug: "journal-my-retirement-vision",
    description: "Write: “At age 60, I want my life to look like ___.”",
    difficulty: "Easy",
    scenario: {
      question: "Reflect in at least 10 characters on your retirement vision.",
      options: [
        "Lifestyle",
        "Health",
        "Home/Location",
        "Monthly income",
      ],
      correct: 1,
      outcome: "Writing clarifies goals and guides planning.",
    },
  },
  {
    title: "Saving Habit Choice",
    slug: "saving-habit-choice",
    description: "Learn how saving part of windfalls strengthens long-term security.",
    difficulty: "Easy",
    scenario: {
      question: "A worker gets small yearly bonus. Best use for long-term security?",
      options: [
        "Spend fully",
        "Save part for future",
        "Lend to risky friend",
        "Buy luxury",
      ],
      correct: 2,
      outcome: "Occasional savings strengthen future security.",
    },
  },
  
  {
    title: "Income vs Longevity",
    slug: "income-vs-longevity",
    description: "Learn why confirming benefits and building backup savings reduces uncertainty.",
    difficulty: "Easy",
    scenario: {
      question: "A person expects pension from employer but has no written plan. Safer action?",
      options: [
        "Assume employer will handle",
        "Confirm and create personal backup savings",
        "Ignore",
        "Borrow later",
      ],
      correct: 2,
      outcome: "Personal planning reduces uncertainty.",
    },
  },
   {
    title: "Pension Growth Simulation",
    slug: "pension-growth-simulation",
    description: "Invest ₹1000 yearly at steady growth. See 20-year projection.",
    difficulty: "Easy",
    scenario: {
      question: "Which habit best grows a pension over 20 years?",
      options: [
        "Start early and stay consistent",
        "Skip contributions often",
        "Withdraw returns yearly",
        "Switch funds constantly",
      ],
      correct: 1,
      outcome: "Consistency and compounding build a larger retirement corpus.",
    },
  },
  {
    title: "Financial Independence Goal",
    slug: "financial-independence-goal",
    description: "Learn how gradual long-term savings support independence in old age.",
    difficulty: "Easy",
    scenario: {
      question: "A worker wants dignity in old age. Best path?",
      options: [
        "Depend on others",
        "Build gradual long-term savings",
        "Avoid planning",
        "Spend today",
      ],
      correct: 2,
      outcome: "Security supports independence.",
    },
  },
  {
    title: "Long-Term Security Checkpoint",
    slug: "long-term-security-checkpoint",
    description: "Learn why balancing present needs with future security builds stability.",
    difficulty: "Easy",
    scenario: {
      question: "Multiple scenarios appear. Best guiding rule?",
      options: [
        "Focus only on today",
        "Balance present needs and future security",
        "Depend on luck",
        "Ignore planning",
      ],
      correct: 2,
      outcome: "Consistent planning creates stability over life.",
    },
  },
  {
    title: "Reflex: Secure Future",
    slug: "reflex-secure-future",
    description: "Tap “Save Consistently”, avoid “Spend Fully.” 10s timed reflex.",
    difficulty: "Easy",
    scenario: {
      question: "Quick reflex: Which habit secures your future?",
      options: [
        "Save Consistently",
        "Spend Fully",
        "Skip Pension",
        "Borrow for lifestyle",
      ],
      correct: 1,
      outcome: "Habit-first choices support a secure future.",
    },
  },
  {
    title: "Badge: Retirement Ready",
    slug: "badge-retirement-ready",
    description: "Complete 5 long-term planning tasks to earn the badge.",
    difficulty: "Easy",
    isBadgeGame: true,
          badgeName: "Badge: Retirement Ready",
          badgeImage: "/badges/finance/InsurancePension/badge-retirement-ready.png",
    scenario: {
      question: "Which action earns progress toward ‘Retirement Ready’?",
      options: [
        "Start early contributions",
        "Skip savings often",
        "Withdraw returns yearly",
        "Invest by hype only",
      ],
      correct: 1,
      outcome: "Early, consistent planning builds retirement readiness.",
    },
  },
  {
    title: "Risk Priority Puzzle",
    slug: "risk-priority-puzzle",
    description: "Match: “Health → Insurance”, “Old Age → Pension”, “Emergency → Savings”.",
    difficulty: "Easy",
    scenario: {
      question: "Match each risk category to the right priority.",
      options: [
        "Health → Insurance",
        "Old Age → Pension",
        "Emergency → Savings",
        "Income Loss → Life Insurance",
      ],
      correct: 1,
      outcome: "Prioritizing the right tool for each risk builds resilience.",
    },
  },
  {
    title: "Debate: Insurance vs Investment",
    slug: "debate-insurance-vs-investment",
    description: "Which should come first? Weigh protection and growth.",
    difficulty: "Easy",
    scenario: {
      question: "In most cases, what should come first?",
      options: [
        "Adequate insurance, then investments",
        "Invest first, insure later",
        "Neither is necessary",
      ],
      correct: 1,
      outcome: "Protection first prevents setbacks that derail investments.",
    },
  },
  {
    title: "Journal: Protection Checklist",
    slug: "journal-protection-checklist",
    description: "Write 3 steps to secure the future. Min 10 characters each.",
    difficulty: "Easy",
    scenario: {
      question: "Write one step you will take to protect your future.",
      options: [
        "Health cover",
        "Term cover",
        "Emergency fund",
        "Avoid fraud",
      ],
      correct: 1,
      outcome: "Writing concrete steps builds action and accountability.",
    },
  },
  {
    title: "Life Planning Simulation",
    slug: "life-planning-simulation",
    description: "Income ₹30,000: allocate Insurance, Savings, Expenses. Balanced choice wins.",
    difficulty: "Easy",
    scenario: {
      question: "Choose the allocation approach that balances protection and growth.",
      options: [
        "Adequate cover + steady savings + essentials",
        "No insurance, high savings",
        "All expenses, little saving",
        "Only insurance, no savings",
      ],
      correct: 1,
      outcome: "Balance protection and savings; avoid extremes.",
    },
  },
   {
    title: "Reflex: Long-Term Thinking",
    slug: "reflex-long-term-thinking",
    description: "Tap “Plan Ahead”, avoid “Ignore Future.” Timed 10s reflex choices.",
    difficulty: "Easy",
    scenario: {
      question: "Quick reflex: which tap aligns with long-term success?",
      options: [
        "Plan Ahead",
        "Ignore Future",
        "Spend All Now",
        "Delay All Planning",
      ],
      correct: 1,
      outcome: "Planning ahead consistently builds long-term security.",
    },
  },
  {
    title: "Multi-Risk Puzzle",
    slug: "multi-risk-puzzle",
    description: "Match: “Health → Health Insurance”, “Old Age → Pension”, “Accident → PA Cover”.",
    difficulty: "Easy",
    scenario: {
      question: "Match each risk type with the correct financial tool.",
      options: [
        "Health → Health Insurance",
        "Old Age → Pension",
        "Accident → Personal Accident Cover",
        "Job Loss → Emergency Fund",
      ],
      correct: 1,
      outcome: "Right tool for each risk strengthens overall security.",
    },
  },
  {
    title: "Journal: My Financial Promise",
    slug: "journal-my-financial-promise",
    description: "Write: “I will protect my future by ___.” Min 10 characters.",
    difficulty: "Easy",
    scenario: {
      question: "Write at least 10 characters describing your financial promise.",
      options: [
        "Build emergency fund",
        "Keep adequate insurance",
        "Save consistently",
        "Avoid scams",
      ],
      correct: 1,
      outcome: "Writing commitments increases follow-through and long-term discipline.",
    },
  },
  {
    title: "Debate: Dependence vs Independence",
    slug: "debate-dependence-vs-independence",
    description: "Is planning freedom? Choose stronger arguments for independence.",
    difficulty: "Easy",
    scenario: {
      question: "Which argument better supports independence?",
      options: [
        "Planning and self-reliance",
        "Fully depend on others",
        "Ignore future",
      ],
      correct: 1,
      outcome: "Planning reduces dependence and increases freedom.",
    },
  },
  {
    title: "Protection Simulation Challenge",
    slug: "protection-simulation-challenge",
    description: "Handle illness, job loss, retirement. Balanced planning wins.",
    difficulty: "Easy",
    scenario: {
      question: "Best overall plan across shocks?",
      options: [
        "Only insurance, no savings",
        "Only savings, no insurance",
        "Balanced: cover + emergency fund + pension",
        "Spend all now",
      ],
      correct: 3,
      outcome: "Balance protection and liquidity for resilience and independence.",
    },
  },
  {
    title: "Badge: Financial Security Master",
    slug: "badge-financial-security-master",
    description: "Complete insurance + pension mastery track. Earn the badge.",
    difficulty: "Easy",
    isBadgeGame: true,
    badgeName: "Badge: Financial Security Master",
    badgeImage: "/badges/finance/InsurancePension/badge-financial-security-master.png",
    scenario: {
      question: "Which set best represents financial security mastery?",
      options: [
        "Adequate cover + emergency fund + pension + fraud safety",
        "Invest all; skip cover",
        "Only insurance; no savings",
        "Only savings; no insurance",
      ],
      correct: 1,
      outcome: "Mastery blends protection, liquidity, long-term saving and safety.",
    },
  },
  
];

const icons = [Shield, CreditCard, Briefcase, Wallet, Banknote, ShieldCheck, Coins, FileText, HeartHandshake];

export const getInsurancePensionGames = (gameCompletionStatus) =>
  baseGames.map((template, index) => {
    const Icon = icons[index % icons.length];
    const gameId = insurancePensionGameIds[index];
    const inFirstBand = index < 25;
    const inSecondBand = index >= 25 && index < 50;
    const coins = inSecondBand ? 10 : 5;
    const xp = inSecondBand ? 20 : 10;
    return {
      id: gameId,
      title: template.title,
      description: template.description,
      icon: <Icon className="w-6 h-6" />,
      difficulty: template.difficulty,
      duration: `${6 + (index % 5)} min`,
      coins,
      xp,
      isBadgeGame: Boolean(template.isBadgeGame),
      badgeName: template.badgeName || null,
      badgeImage: template.badgeImage || null,
      completed: gameCompletionStatus[gameId] || false,
      isSpecial: true,
      path: `/student/finance/insurance-pension/${template.slug || `game-${index + 1}`}`,
      slug: template.slug || `game-${index + 1}`,
      index,
    };
  });
