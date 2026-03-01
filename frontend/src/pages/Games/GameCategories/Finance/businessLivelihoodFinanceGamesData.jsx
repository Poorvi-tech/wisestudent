import { Briefcase, Wallet, Store, TrendingUp, PiggyBank, ClipboardList } from "lucide-react";

export const businessLivelihoodFinanceGameIds = Array.from(
  { length: 100 },
  (_, index) => `finance-business-livelihood-finance-${index + 1}`
);

const baseGames = [
  {
    title: "Mixing Personal & Business Money",
    slug: "mixing-personal-business-money",
    description:
      "A shop owner uses the same cash for home expenses and business stock. Learn why this can hide true performance.",
    difficulty: "Easy",
  },
  {
    title: "Reflex: Cash Separator",
    slug: "reflex-cash-separator",
    description:
      "A quick reflex game! Tap the correct 'Shop Stock' coins before time runs out to separate business and home expenses.",
    difficulty: "Medium",
  },
  {
    title: "Why Records Matter",
    slug: "why-records-matter",
    description:
      "A small trader keeps everything in memory instead of writing records. Learn why this creates confusion and disputes.",
    difficulty: "Easy",
  },
  {
    title: "Puzzle: Record Matcher",
    slug: "puzzle-record-matcher",
    description:
      "Match 'Bill' with 'Proof', and 'Memory' with 'Confusion'. Learn the value of good financial habits.",
    difficulty: "Medium",
  },
  {
    title: "Cash Only Business",
    slug: "cash-only-business",
    description:
      "A seller accepts only cash. Learn how digital records build credibility and proof.",
    difficulty: "Easy",
  },
  {
    title: "Journal: My Digital Choice",
    slug: "journal-my-digital-choice",
    description:
      "Which digital payment app would you use for your shop and why? Reflect on formalizing your business.",
    difficulty: "Medium",
  },
  {
    title: "Invoice Refusal",
    slug: "invoice-refusal",
    description:
      "A customer asks for a bill but the shopkeeper refuses. Learn how invoices build trust and legal proof.",
    difficulty: "Easy",
  },
  {
    title: "Simulation: The First Customer",
    slug: "simulation-first-customer",
    description:
      "A simulation where you manage typical counter situations. Should you give a bill or take cash without records? Choose wisely.",
    difficulty: "Medium",
  },
  {
    title: "Reflex: Speed Biller",
    slug: "reflex-speed-biller",
    description:
      "Tap on the 'Generate Invoice' button before the timer runs out! A fun game testing your invoicing reflexes.",
    difficulty: "Medium",
  },
  {
    title: "Badge: Foundation Master",
    slug: "badge-foundation-master",
    description:
      "A quiz proving your mastery of basic business finance principles like records, bank accounts, and separating funds.",
    difficulty: "Hard",
    isBadgeGame: true,
    badgeName: "Badge: Foundation Master",
    badgeImage: "/badges/finance/BusinessLivelihood/foundation-master.png",
  },
  {
    title: "Proof of Income",
    slug: "proof-of-income",
    description:
      "A trader wants a bank loan but has no records. Learn why income proof and transaction trails matter.",
    difficulty: "Easy",
  },
  {
    title: "Debate: Cash vs Digital",
    slug: "debate-cash-vs-digital",
    description:
      "Is cash better for small vendors than UPI? Debate the risks and the importance of a digital trail.",
    difficulty: "Medium",
  },
  {
    title: "Daily Expense Tracking",
    slug: "daily-expense-tracking",
    description:
      "A vendor never notes daily spending. Learn how tracking prevents silent losses.",
    difficulty: "Easy",
  },
  {
    title: "Puzzle: Expense Sort",
    slug: "puzzle-expense-sort",
    description:
      "Sort transactions into the correct ledger categories like 'Fixed Expenses' or 'Sales Income'.",
    difficulty: "Medium",
  },
  {
    title: "Digital Payment Advantage",
    slug: "digital-payment-advantage",
    description:
      "A customer pays via UPI. Learn how digital payments build transaction history.",
    difficulty: "Easy",
  },
  {
    title: "Simulation: Daily Ledger",
    slug: "simulation-daily-ledger",
    description:
      "You earned ₹2000 and spent ₹1200. Calculate the daily balance correctly to close your ledger!",
    difficulty: "Medium",
  },
  {
    title: "Informal Borrowing",
    slug: "informal-borrowing",
    description:
      "A shop owner borrows from a local lender without a record. Learn why written proof prevents disputes.",
    difficulty: "Easy",
  },
  {
    title: "Reflex: Grab the Receipt",
    slug: "reflex-grab-receipt",
    description:
      "Catch the falling 'Receipts' and avoid 'Oral Promises'. Quick decisions build strong financial proofs.",
    difficulty: "Medium",
  },
  {
    title: "Stock Without Tracking",
    slug: "stock-without-tracking",
    description:
      "A business buys stock but doesn’t track sales vs inventory. Learn how inventory tracking prevents hidden losses.",
    difficulty: "Easy",
  },
  {
    title: "Badge: Record Keeper",
    slug: "badge-record-keeper",
    description:
      "A quiz assessing your ability to manage invoices, receipts, and maintain clear business cash records.",
    difficulty: "Hard",
    isBadgeGame: true,
    badgeName: "Badge: Record Keeper",
    badgeImage: "/badges/finance/BusinessLivelihood/record-keeper.png",
  },
  {
    title: "Personal Withdrawal",
    slug: "personal-withdrawal",
    description:
      "An owner takes cash randomly from the business drawer. Learn why separation keeps finances clear.",
    difficulty: "Easy",
  },
  {
    title: "Journal: My Business Rule",
    slug: "journal-my-business-rule",
    description:
      "Write one rule you will follow to keep business money separate.",
    difficulty: "Easy",
  },
  {
    title: "Supplier Payment Proof",
    slug: "supplier-payment-proof",
    description:
      "A supplier claims payment not received. Learn how proof resolves disputes.",
    difficulty: "Easy",
  },
  {
    title: "Reflex: Fraud Filter",
    slug: "reflex-fraud-filter",
    description:
      "Tap on 'Original Bill' and ignore 'Fake Quote'. Test your reflex at spotting genuine proofs!",
    difficulty: "Medium",
  },
  {
    title: "Bank Account Use",
    slug: "bank-account-use",
    description:
      "A business keeps all money in cash, without a bank account. Learn why a bank trail improves credibility.",
    difficulty: "Easy",
  },
  {
    title: "Puzzle: Banking Benefits",
    slug: "puzzle-banking-benefits",
    description:
      "Match 'Bank Account' -> 'Interest/Loans', 'Cash Box' -> 'Risk/No Trail'.",
    difficulty: "Medium",
  },
  {
    title: "GST Confusion",
    slug: "gst-confusion",
    description:
      "A trader hears about GST but ignores it completely. Learn why basic awareness prevents compliance trouble.",
    difficulty: "Easy",
  },
  {
    title: "Debate: Formal vs Informal",
    slug: "debate-formal-vs-informal",
    description:
      "Should a small tea-stall register its business?",
    difficulty: "Medium",
  },
  {
    title: "Business Growth Limit",
    slug: "business-growth-limit",
    description:
      "A shop grows but keeps informal practices. Learn why records and proof support scaling.",
    difficulty: "Easy",
  },
  {
    title: "Badge: Growth Mindset",
    slug: "badge-growth-mindset",
    description:
      "A quiz proving your vision to scale a business formally through financial clarity and modern tools.",
    difficulty: "Hard",
    isBadgeGame: true,
    badgeName: "Badge: Growth Mindset",
    badgeImage: "/badges/finance/BusinessLivelihood/growth-mindset.png",
  },
  {
    title: "Invoice Importance",
    slug: "invoice-importance",
    description:
      "A customer wants an invoice for a warranty claim. Learn how invoices protect both buyer and seller.",
    difficulty: "Easy",
  },
  
  {
    title: "Simulation: Warranty Check",
    slug: "simulation-warranty-check",
    description:
      "Customer brings a broken item. Check the 'Digital Invoice' to see if it's within warranty.",
    difficulty: "Medium",
  },
  {
    title: "Credit Sales Without Record",
    slug: "credit-sales-without-record",
    description:
      "A shop sells on credit but doesn’t write it down. Learn why credit tracking prevents loss.",
    difficulty: "Easy",
  },
  {
    title: "Reflex: Credit Collector",
    slug: "reflex-credit-collector",
    description:
      "Tap 'Reminder Sent' when an invoice passes 30 days. Test your reflexes on staying cash-positive!",
    difficulty: "Medium",
  },
  
  {
    title: "Business Reputation",
    slug: "business-reputation",
    description:
      "A shop gives bills, keeps records, and accepts digital payments. Learn how professional habits build trust.",
    difficulty: "Easy",
  },
  {
    title: "Journal: The Trust Factor",
    slug: "journal-the-trust-factor",
    description:
      "How does giving a bill make you feel as a customer?",
    difficulty: "Easy",
  },
  {
    title: "Separate Bank Accounts",
    slug: "separate-bank-accounts",
    description:
      "An owner opens a separate business account. Learn why separation improves income tracking.",
    difficulty: "Easy",
  },
  {
    title: "Puzzle: Money Maze",
    slug: "puzzle-money-maze",
    description:
      "Guide the 'Business Profit' to the 'Bank' and 'Personal Expense' to 'Savings'.",
    difficulty: "Medium",
  },
  {
    title: "Supplier Invoice Check",
    slug: "supplier-invoice-check",
    description:
      "A trader pays supplier without checking bill details. Learn why invoice checks prevent mistakes.",
    difficulty: "Easy",
  },
  
  {
    title: "Badge: Professional Trader",
    slug: "badge-professional-trader",
    description:
      "A quiz assessing your ability to act professionally with suppliers, handle invoices, and maintain formal business relationships.",
    difficulty: "Hard",
    isBadgeGame: true,
    badgeName: "Badge: Professional Trader",
    badgeImage: "/badges/finance/BusinessLivelihood/professional-trader.png",
  },
  
  {
    title: "Informal Worker Payment",
    slug: "informal-worker-payment",
    description:
      "An owner pays staff in cash with no record. Learn why payment proof prevents disputes.",
    difficulty: "Easy",
  },
  {
    title: "Simulation: Salary Day",
    slug: "simulation-salary-day",
    description:
      "Create a simple salary slip for an employee for the month of January.",
    difficulty: "Medium",
  },
  {
    title: "Digital Receipts",
    slug: "digital-receipts",
    description:
      "A shop sends a digital receipt after payment. Learn how proof improves transparency.",
    difficulty: "Easy",
  },
  {
    title: "Reflex: Receipt Dispatch",
    slug: "reflex-receipt-dispatch",
    description:
      "Drag the receipt to the customer's phone icon before they walk out! Fast invoicing builds trust.",
    difficulty: "Medium",
  },
  {
    title: "Business Loan Preparation",
    slug: "business-loan-preparation",
    description:
      "A trader wants to apply for a formal loan. Learn why transaction history builds lender confidence.",
    difficulty: "Easy",
  },
  {
    title: "Debate: Loan vs Savings",
    slug: "debate-loan-vs-savings",
    description:
      "Is it better to wait and save or take a loan to expand faster?",
    difficulty: "Medium",
  },
  {
    title: "Record Discipline",
    slug: "record-discipline",
    description:
      "An owner writes income daily but not expenses. Learn why complete records show the full picture.",
    difficulty: "Easy",
  },
  {
    title: "Puzzle: The Missing Piece",
    slug: "puzzle-the-missing-piece",
    description:
      "Find the 'Missing Expense' in the ledger to balance the books.",
    difficulty: "Medium",
  },
  {
    title: "Digital Trail Advantage",
    slug: "digital-trail-advantage",
    description:
      "A vendor accepts only digital payments. Learn how transaction history supports growth and loans.",
    difficulty: "Easy",
  },
  {
    title: "Badge: Finance Ready",
    slug: "badge-finance-ready",
    description:
      "Test your ultimate readiness for formal growth, verifying your grasp on ledgers, bank trails, and professional discipline.",
    difficulty: "Hard",
    isBadgeGame: true,
    badgeName: "Badge: Finance Ready",
    badgeImage: "/badges/finance/BusinessLivelihood/finance-ready.png",
  },
  {
    title: "Business Health Checkpoint",
    slug: "business-health-checkpoint",
    description:
      "A business keeps records, separates money, and issues bills. Learn why good practices enable stability and growth.",
    difficulty: "Easy",
  },
   {
    title: "Reflex: Health Monitor",
    slug: "reflex-health-monitor",
    description:
      "Tap 'Green' for profit-making habits and 'Red' for loss-making routines. Diagnose the business health quickly!",
    difficulty: "Medium",
  },
  {
    title: "Growing Beyond Informal Stage",
    slug: "growing-beyond-informal-stage",
    description:
      "A shop’s sales increase but the owner keeps no proper records. Learn why proof is needed for growth.",
    difficulty: "Easy",
  },
  {
    title: "Journal: Scaling Up",
    slug: "journal-scaling-up",
    description:
      "If your business doubles tomorrow, what is the first thing you'll automate?",
    difficulty: "Medium",
  },
  {
    title: "GST Fear",
    slug: "gst-fear",
    description:
      "A trader avoids learning GST because it sounds complicated. Learn why basic awareness prevents trouble.",
    difficulty: "Easy",
  },
  {
    title: "Simulation: Tax Calculator",
    slug: "simulation-tax-calculator",
    description:
      "Apply 5% tax on a product worth ₹1000. What is the total?",
    difficulty: "Medium",
  },
  {
    title: "Bill vs No Bill Sale",
    slug: "bill-vs-no-bill-sale",
    description:
      "Two shops sell the same product; one gives a bill and one doesn’t. Learn how transparency builds trust.",
    difficulty: "Easy",
  },
  {
    title: "Debate: Customer Loyalty",
    slug: "debate-customer-loyalty",
    description:
      "Does a bill matter if the price is the lowest in town?",
    difficulty: "Medium",
  },
  {
    title: "Record During Inspection",
    slug: "record-during-inspection",
    description:
      "An officer asks for transaction records. Learn why written or digital records reduce stress.",
    difficulty: "Medium",
  },
  {
    title: "Badge: Compliance Officer",
    slug: "badge-compliance-officer",
    description:
      "A rigorous check of your understanding of formal business laws, tax adherence, and legal transparency.",
    difficulty: "Hard",
    isBadgeGame: true,
    badgeName: "Badge: Compliance Officer",
    badgeImage: "/badges/finance/BusinessLivelihood/compliance-officer.png",
  },
  {
    title: "Formal Registration Advantage",
    slug: "formal-registration-advantage",
    description:
      "A business registers officially. Learn how formalisation opens growth opportunities.",
    difficulty: "Medium",
  },
  {
    title: "Puzzle: Registration Steps",
    slug: "puzzle-registration-steps",
    description:
      "Arrange the steps: [Name Choice] -> [Registration] -> [Bank Account] -> [Open Shop].",
    difficulty: "Medium",
  },
  
  {
    title: "Supplier Trust",
    slug: "supplier-trust",
    description:
      "A supplier checks a shop’s stability before offering bulk stock. Learn why records build supplier trust.",
    difficulty: "Hard",
  },
  {
    title: "Reflex: Partner Picker",
    slug: "reflex-partner-picker",
    description:
      "Tap on the 'Verified Supplier' tag as it scrolls by. Formal partnerships safeguard your enterprise.",
    difficulty: "Medium",
  },
  {
    title: "Cash Flow Surprise",
    slug: "cash-flow-surprise",
    description:
      "A business has good sales but no cash for rent. Learn why cash flow tracking matters.",
    difficulty: "Medium",
  },
  {
    title: "Journal: My Rainy Day Fund",
    slug: "journal-my-rainy-day-fund",
    description:
      "How much money should a business keep aside for emergencies?",
    difficulty: "Medium",
  },
  {
    title: "Growth Loan Requirement",
    slug: "growth-loan-requirement",
    description:
      "A trader wants to expand a shop. Learn why banks check financial records and income proof.",
    difficulty: "Medium",
  },
  {
    title: "Simulation: The Loan Pitch",
    slug: "simulation-the-loan-pitch",
    description:
      "Choose the 3 documents to show a bank manager for a loan. (Ledger, Bill Book, Tax Proof).",
    difficulty: "Hard",
  },
  {
    title: "Employee Payment Records",
    slug: "employee-payment-records",
    description:
      "An owner starts recording staff payments. Learn how records improve trust and legal safety.",
    difficulty: "Medium",
  },
  {
    title: "Badge: People Manager",
    slug: "badge-people-manager",
    description:
      "A quiz measuring your capability to legally, fairly, and formally manage employee payroll and disputes.",
    difficulty: "Hard",
    isBadgeGame: true,
    badgeName: "Badge: People Manager",
    badgeImage: "/badges/finance/BusinessLivelihood/people-manager.png",
  },
  {
    title: "Business vs Personal Loan Use",
    slug: "business-vs-personal-loan-use",
    description:
      "An owner uses a business loan for a family wedding. Learn why loans should match their purpose.",
    difficulty: "Medium",
  },
  {
    title: "Debate: Re-investing Profit",
    slug: "debate-reinvesting-profit",
    description:
      "Should profit be spent on personal luxury or put back into business?",
    difficulty: "Medium",
  },
  {
    title: "Customer Return Issue",
    slug: "customer-return-issue",
    description:
      "A customer returns a product but no bill exists. Learn why bills protect both sides in disputes.",
    difficulty: "Medium",
  },
  {
    title: "Reflex: Quick Verify",
    slug: "reflex-quick-verify",
    description:
      "Check if the serial number on the item matches the digital record in 5 seconds. Accuracy counts!",
    difficulty: "Medium",
  },
  {
    title: "Business Reputation Growth",
    slug: "business-reputation-growth",
    description:
      "A formal business gets big clients easily. Learn how professional records grow a business.",
    difficulty: "Medium",
  },
  {
    title: "Puzzle: Brand Builder",
    slug: "puzzle-brand-builder",
    description:
      "Connect 'Fair Price' + 'Bill' + 'Good Quality' to 'Star Rating'.",
    difficulty: "Medium",
  },
  {
    title: "Informal Expansion Limit",
    slug: "informal-expansion-limit",
    description:
      "A vendor wants to supply to a big company. Learn why formal records and invoices are required.",
    difficulty: "Hard",
  },
  {
    title: "Simulation: Big Contract",
    slug: "simulation-big-contract",
    description:
      "A company wants to buy 100 units. They need a GST invoice. Can you provide it?",
    difficulty: "Medium",
  },
  {
    title: "Seasonal Income Planning",
    slug: "seasonal-income-planning",
    description:
      "A business earns high only during festival season. Learn why planning reserves stabilizes slow months.",
    difficulty: "Hard",
  },
  {
    title: "Badge: Strategic Planner",
    slug: "badge-strategic-planner",
    description:
      "A quiz assessing your ability to interpret financial data, predict risks, and plan for sustainable business growth.",
    difficulty: "Hard",
    isBadgeGame: true,
    badgeName: "Badge: Strategic Planner",
    badgeImage: "/badges/finance/BusinessLivelihood/strategic-planner.png",
  },
   {
    title: "Digital Accounting App",
    slug: "digital-accounting-app",
    description:
      "A trader starts using a simple digital ledger app. Learn how digital tools improve accuracy and tracking.",
    difficulty: "Hard",
  },
  {
    title: "Simulation: Digital Entry",
    slug: "simulation-digital-entry",
    description:
      "Enter 'Spent ₹50 for Chai' and 'Earned ₹500 for Samosa' in the app.",
    difficulty: "Medium",
  },
 {
    title: "Tax Fear vs Awareness",
    slug: "tax-fear-vs-awareness",
    description:
      "An owner fears tax rules without understanding them. Learn how basic awareness reduces risk.",
    difficulty: "Hard",
  },
  {
    title: "Journal: My Honest Business",
    slug: "journal-my-honest-business",
    description:
      "Why is paying tax good for the country's roads and schools?",
    difficulty: "Hard",
  },
  
  {
    title: "Inventory Loss",
    slug: "inventory-loss",
    description:
      "Stock is missing but no inventory list exists. Learn why tracking prevents hidden losses.",
    difficulty: "Hard",
  },
  {
    title: "Reflex: Stock Guard",
    slug: "reflex-stock-guard",
    description:
      "Tap on 'Theft' or 'Damage' icons to prevent inventory loss. Fast decisions save money!",
    difficulty: "Medium",
  },
  {
    title: "Business Stability Decision",
    slug: "business-stability-decision",
    description:
      "An owner considers formalising records. Learn how structure supports scaling and financing.",
    difficulty: "Hard",
  },
  {
    title: "Debate: Small vs Big",
    slug: "debate-small-vs-big",
    description:
      "Is it better to stay small and informal or grow big and formal?",
    difficulty: "Medium",
  },
  {
    title: "Customer Credit Tracking",
    slug: "customer-credit-tracking",
    description:
      "A shop starts noting who owes money. Learn how credit tracking protects cash flow.",
    difficulty: "Hard",
  },
  {
    title: "Badge: Livelihood Leader",
    slug: "badge-livelihood-leader",
    description:
      "The ultimate test proving you can lead a legally sound, formally tracked, and highly profitable enterprise.",
    difficulty: "Hard",
    isBadgeGame: true,
    badgeName: "Badge: Livelihood Leader",
    badgeImage: "/badges/finance/BusinessLivelihood/livelihood-leader.png",
  },
 
  {
    title: "Proof for Insurance Claim",
    slug: "proof-for-insurance-claim",
    description:
      "A business loses goods but has invoices. Learn how documents support financial recovery.",
    difficulty: "Hard",
  },
  {
    title: "Puzzle: Recovery Match",
    slug: "puzzle-recovery-match",
    description:
      "Match 'Fire/Theft' -> 'Insurance Claim', 'Invoice' -> 'Proof of Loss'.",
    difficulty: "Medium",
  },
  {
    title: "Growth Decision Point",
    slug: "growth-decision-point",
    description:
      "A trader chooses between keeping informal or becoming structured. Learn why formal habits enable scale.",
    difficulty: "Hard",
  },
  {
    title: "Journal: My 5-Year Plan",
    slug: "journal-my-5-year-plan",
    description:
      "Where do you see your business after 5 years of disciplined record-keeping?",
    difficulty: "Hard",
  },
  {
    title: "Supplier Credit Terms",
    slug: "supplier-credit-terms",
    description:
      "A supplier offers credit only to businesses with records. Learn why data builds trust.",
    difficulty: "Hard",
  },
  {
    title: "Simulation: Credit Negotiation",
    slug: "simulation-credit-negotiation",
    description:
      "Show your Bank Statement to the supplier to get 30 days of extra time to pay.",
    difficulty: "Medium",
  },
  {
    title: "Financial Discipline Check",
    slug: "financial-discipline-check",
    description:
      "An owner reviews monthly income, expenses, stock, and loans. Learn how reviews build control and stability.",
    difficulty: "Hard",
  },
  {
    title: "Business Future Thinking",
    slug: "business-future-thinking",
    description:
      "A trader wants the business to survive long-term. Learn why records, proof, and discipline support growth.",
    difficulty: "Hard",
  },
  {
    title: "Business Readiness Checkpoint",
    slug: "business-readiness-checkpoint",
    description:
      "Multiple scenarios appear about records, payments, loans, and growth. Learn why discipline and documentation ensure stability.",
    difficulty: "Hard",
  },
  {
    title: "Badge: Business Mogul",
    slug: "badge-business-mogul",
    description:
      "The pinnacle of enterprise management. Prove your mastery over corporate strategy, valuation, and empire building.",
    difficulty: "Hard",
    isBadgeGame: true,
    badgeName: "Badge: Business Mogul",
    badgeImage: "/badges/finance/BusinessLivelihood/business-mogul.png",
  },
];

const icons = [Briefcase, Wallet, Store, TrendingUp, PiggyBank, ClipboardList];

const getRewards = (index) => {
  if (index < 25) return { coins: 5, xp: 10 };       // Game 1–25
  if (index < 50) return { coins: 10, xp: 20 };      // Game 26–50
  if (index < 75) return { coins: 15, xp: 30 };      // Game 51–75
  return { coins: 20, xp: 40 };                       // Game 76–100
};

export const getBusinessLivelihoodFinanceGames = (gameCompletionStatus = {}) =>
  baseGames.map((template, index) => {
    const Icon = icons[index % icons.length];
    const gameId = businessLivelihoodFinanceGameIds[index];
    const { coins, xp } = getRewards(index);

    return {
      id: gameId,
      title: template.title,
      description: template.description,
      icon: <Icon className="w-6 h-6" />,
      difficulty: template.difficulty,
      duration: `${6 + (index % 5)} min`,
      coins,
      xp,
      completed: gameCompletionStatus[gameId] || false,
      isSpecial: true,
      path: `/student/finance/business-livelihood-finance/${template.slug}`,
      slug: template.slug,
      index,
      ...(template.isBadgeGame && {
        isBadgeGame: true,
        badgeName: template.badgeName,
        badgeImage: template.badgeImage,
      }),
    };
  });
