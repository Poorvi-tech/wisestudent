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
    difficulty: "Easy",
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
    title: "Lifestyle vs Future",
    slug: "lifestyle-vs-future",
    description: "Learn why balancing present spending with future planning prevents dependence.",
    difficulty: "Easy",
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
];

const icons = [Shield, CreditCard, Briefcase, Wallet, Banknote, ShieldCheck, Coins, FileText, HeartHandshake];

export const getInsurancePensionGames = (gameCompletionStatus) =>
  baseGames.map((template, index) => {
    const Icon = icons[index % icons.length];
    const gameId = insurancePensionGameIds[index];
    return {
      id: gameId,
      title: template.title,
      description: template.description,
      icon: <Icon className="w-6 h-6" />,
      difficulty: template.difficulty,
      duration: `${6 + (index % 5)} min`,
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus[gameId] || false,
      isSpecial: true,
      path: `/student/finance/insurance-pension/${template.slug || `game-${index + 1}`}`,
      slug: template.slug || `game-${index + 1}`,
      index,
    };
  });
