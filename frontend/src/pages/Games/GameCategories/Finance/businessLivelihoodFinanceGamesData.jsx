import { Briefcase, Wallet, Store, TrendingUp, PiggyBank, ClipboardList } from "lucide-react";

export const businessLivelihoodFinanceGameIds = Array.from(
  { length: 50 },
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
    title: "Why Records Matter",
    slug: "why-records-matter",
    description:
      "A small trader keeps everything in memory instead of writing records. Learn why this creates confusion and disputes.",
    difficulty: "Easy",
  },
  {
    title: "Cash Only Business",
    slug: "cash-only-business",
    description:
      "A seller accepts only cash. Learn how digital records build credibility and proof.",
    difficulty: "Easy",
  },
  {
    title: "Invoice Refusal",
    slug: "invoice-refusal",
    description:
      "A customer asks for a bill but the shopkeeper refuses. Learn how invoices build trust and legal proof.",
    difficulty: "Easy",
  },
  {
    title: "Proof of Income",
    slug: "proof-of-income",
    description:
      "A trader wants a bank loan but has no records. Learn why income proof and transaction trails matter.",
    difficulty: "Easy",
  },
  {
    title: "Daily Expense Tracking",
    slug: "daily-expense-tracking",
    description:
      "A vendor never notes daily spending. Learn how tracking prevents silent losses.",
    difficulty: "Easy",
  },
  {
    title: "Digital Payment Advantage",
    slug: "digital-payment-advantage",
    description:
      "A customer pays via UPI. Learn how digital payments build transaction history.",
    difficulty: "Easy",
  },
  {
    title: "Informal Borrowing",
    slug: "informal-borrowing",
    description:
      "A shop owner borrows from a local lender without a record. Learn why written proof prevents disputes.",
    difficulty: "Easy",
  },
  {
    title: "Stock Without Tracking",
    slug: "stock-without-tracking",
    description:
      "A business buys stock but doesn’t track sales vs inventory. Learn how inventory tracking prevents hidden losses.",
    difficulty: "Easy",
  },
  {
    title: "Personal Withdrawal",
    slug: "personal-withdrawal",
    description:
      "An owner takes cash randomly from the business drawer. Learn why separation keeps finances clear.",
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
    title: "Bank Account Use",
    slug: "bank-account-use",
    description:
      "A business keeps all money in cash, without a bank account. Learn why a bank trail improves credibility.",
    difficulty: "Easy",
  },
  {
    title: "GST Confusion",
    slug: "gst-confusion",
    description:
      "A trader hears about GST but ignores it completely. Learn why basic awareness prevents compliance trouble.",
    difficulty: "Easy",
  },
  {
    title: "Business Growth Limit",
    slug: "business-growth-limit",
    description:
      "A shop grows but keeps informal practices. Learn why records and proof support scaling.",
    difficulty: "Easy",
  },
  {
    title: "Invoice Importance",
    slug: "invoice-importance",
    description:
      "A customer wants an invoice for a warranty claim. Learn how invoices protect both buyer and seller.",
    difficulty: "Easy",
  },
  {
    title: "Credit Sales Without Record",
    slug: "credit-sales-without-record",
    description:
      "A shop sells on credit but doesn’t write it down. Learn why credit tracking prevents loss.",
    difficulty: "Easy",
  },
  {
    title: "Business Reputation",
    slug: "business-reputation",
    description:
      "A shop gives bills, keeps records, and accepts digital payments. Learn how professional habits build trust.",
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
    title: "Supplier Invoice Check",
    slug: "supplier-invoice-check",
    description:
      "A trader pays supplier without checking bill details. Learn why invoice checks prevent mistakes.",
    difficulty: "Easy",
  },
  {
    title: "Informal Worker Payment",
    slug: "informal-worker-payment",
    description:
      "An owner pays staff in cash with no record. Learn why payment proof prevents disputes.",
    difficulty: "Easy",
  },
  {
    title: "Digital Receipts",
    slug: "digital-receipts",
    description:
      "A shop sends a digital receipt after payment. Learn how proof improves transparency.",
    difficulty: "Easy",
  },
  {
    title: "Business Loan Preparation",
    slug: "business-loan-preparation",
    description:
      "A trader wants to apply for a formal loan. Learn why transaction history builds lender confidence.",
    difficulty: "Easy",
  },
  {
    title: "Record Discipline",
    slug: "record-discipline",
    description:
      "An owner writes income daily but not expenses. Learn why complete records show the full picture.",
    difficulty: "Easy",
  },
  {
    title: "Digital Trail Advantage",
    slug: "digital-trail-advantage",
    description:
      "A vendor accepts only digital payments. Learn how transaction history supports growth and loans.",
    difficulty: "Easy",
  },
  {
    title: "Business Health Checkpoint",
    slug: "business-health-checkpoint",
    description:
      "A business keeps records, separates money, and issues bills. Learn why good practices enable stability and growth.",
    difficulty: "Easy",
  },
  {
    title: "Growing Beyond Informal Stage",
    slug: "growing-beyond-informal-stage",
    description:
      "A shop’s sales increase but the owner keeps no proper records. Learn why proof is needed for growth.",
    difficulty: "Easy",
  },
  {
    title: "GST Fear",
    slug: "gst-fear",
    description:
      "A trader avoids learning GST because it sounds complicated. Learn why basic awareness prevents trouble.",
    difficulty: "Easy",
  },
  {
    title: "Bill vs No Bill Sale",
    slug: "bill-vs-no-bill-sale",
    description:
      "Two shops sell the same product; one gives a bill and one doesn’t. Learn how transparency builds trust.",
    difficulty: "Easy",
  },
  {
    title: "Record During Inspection",
    slug: "record-during-inspection",
    description:
      "An officer asks for transaction records. Learn why written or digital records reduce stress.",
    difficulty: "Medium",
  },
  {
    title: "Formal Registration Advantage",
    slug: "formal-registration-advantage",
    description:
      "A business registers officially. Learn how formalisation opens growth opportunities.",
    difficulty: "Medium",
  },
  {
    title: "Supplier Trust",
    slug: "supplier-trust",
    description:
      "A supplier prefers businesses that keep records. Learn why reliability and tracking build partnerships.",
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
    title: "Growth Loan Requirement",
    slug: "growth-loan-requirement",
    description:
      "A trader wants to expand a shop. Learn why banks check financial records and income proof.",
    difficulty: "Medium",
  },
  {
    title: "Employee Payment Records",
    slug: "employee-payment-records",
    description:
      "An owner starts recording staff payments. Learn how records improve trust and legal safety.",
    difficulty: "Medium",
  },
  {
    title: "Business vs Personal Loan Use",
    slug: "business-vs-personal-loan-use",
    description:
      "An owner uses a business loan for a family wedding. Learn why loans should match their purpose.",
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
    title: "Business Reputation Growth",
    slug: "business-reputation-growth",
    description:
      "A shop keeps clear accounts and invoices. Learn how credibility compounds over time.",
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
    title: "Seasonal Income Planning",
    slug: "seasonal-income-planning",
    description:
      "A business earns high only during festival season. Learn why planning reserves stabilizes slow months.",
    difficulty: "Hard",
  },
  {
    title: "Digital Accounting App",
    slug: "digital-accounting-app",
    description:
      "A trader starts using a simple digital ledger app. Learn how digital tools improve accuracy and tracking.",
    difficulty: "Hard",
  },
  {
    title: "Tax Fear vs Awareness",
    slug: "tax-fear-vs-awareness",
    description:
      "An owner fears tax rules without understanding them. Learn how basic awareness reduces risk.",
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
    title: "Business Stability Decision",
    slug: "business-stability-decision",
    description:
      "An owner considers formalising records. Learn how structure supports scaling and financing.",
    difficulty: "Hard",
  },
  {
    title: "Customer Credit Tracking",
    slug: "customer-credit-tracking",
    description:
      "A shop starts noting who owes money. Learn how credit tracking protects cash flow.",
    difficulty: "Hard",
  },
  {
    title: "Proof for Insurance Claim",
    slug: "proof-for-insurance-claim",
    description:
      "A business loses goods but has invoices. Learn how documents support financial recovery.",
    difficulty: "Hard",
  },
  {
    title: "Growth Decision Point",
    slug: "growth-decision-point",
    description:
      "A trader chooses between keeping informal or becoming structured. Learn why formal habits enable scale.",
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
];

const icons = [Briefcase, Wallet, Store, TrendingUp, PiggyBank, ClipboardList];

export const getBusinessLivelihoodFinanceGames = (gameCompletionStatus = {}) =>
  baseGames.map((template, index) => {
    const Icon = icons[index % icons.length];
    const gameId = businessLivelihoodFinanceGameIds[index];
    const isFirstTier = index < 25;

    return {
      id: gameId,
      title: template.title,
      description: template.description,
      icon: <Icon className="w-6 h-6" />,
      difficulty: template.difficulty,
      duration: `${6 + (index % 5)} min`,
      coins: isFirstTier ? 5 : 10,
      xp: isFirstTier ? 10 : 20,
      completed: gameCompletionStatus[gameId] || false,
      isSpecial: true,
      path: `/student/finance/business-livelihood-finance/${template.slug}`,
      slug: template.slug,
      index,
    };
  });
