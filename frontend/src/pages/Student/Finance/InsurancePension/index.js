import SuddenHospitalBill from "./SuddenHospitalBill";
import SavingsAlone from "./SavingsAlone";
import WhoNeedsInsurance from "./WhoNeedsInsurance";
import MedicalCostReality from "./MedicalCostReality";
import LifeCoverPurpose from "./LifeCoverPurpose";
import PremiumConfusion from "./PremiumConfusion";
import PolicyReading from "./PolicyReading";
import ClaimPreparation from "./ClaimPreparation";
import FakeInsuranceOffer from "./FakeInsuranceOffer";
import WhenInsuranceMatters from "./WhenInsuranceMatters";
import BusinessRisk from "./BusinessRisk";
import InsuranceDecisionCheck from "./InsuranceDecisionCheck";
import WorkForeverMyth from "./WorkForeverMyth";
import DependenceRisk from "./DependenceRisk";
import EarlySavingAdvantage from "./EarlySavingAdvantage";
import SmallSavingsLogic from "./SmallSavingsLogic";
import InformalWorkerReality from "./InformalWorkerReality";
import PensionVsEmergencyFund from "./PensionVsEmergencyFund";
import GovernmentPensionAwareness from "./GovernmentPensionAwareness";
import LifestyleVsFuture from "./LifestyleVsFuture";
import RetirementReality from "./RetirementReality";
import SavingHabitChoice from "./SavingHabitChoice";
import IncomeVsLongevity from "./IncomeVsLongevity";
import FinancialIndependenceGoal from "./FinancialIndependenceGoal";
import LongTermSecurityCheckpoint from "./LongTermSecurityCheckpoint";
import ProtectionReflex from "./ProtectionReflex";
import InsuranceCoverageMatch from "./InsuranceCoverageMatch";
import MyFamilyRisksJournal from "./MyFamilyRisksJournal";
import BadgeProtectionBeginner from "./BadgeProtectionBeginner";
import CoveragePuzzle from "./CoveragePuzzle";
import ClaimProcessSimulation from "./ClaimProcessSimulation";
import ReflexSafeVsRisk from "./ReflexSafeVsRisk";
import BadgeInsuranceAware from "./BadgeInsuranceAware";
import RetirementPlanningDebate from "./RetirementPlanningDebate";
import PensionFundPuzzle from "./PensionFundPuzzle";
import BadgeFuturePlanner from "./BadgeFuturePlanner";
import JournalMyRetirementVision from "./JournalMyRetirementVision";
import PensionGrowthSimulation from "./PensionGrowthSimulation";
import ReflexSecureFuture from "./ReflexSecureFuture";
import BadgeRetirementReady from "./BadgeRetirementReady";
import RiskPriorityPuzzle from "./RiskPriorityPuzzle";
import DebateInsuranceVsInvestment from "./DebateInsuranceVsInvestment";
import JournalProtectionChecklist from "./JournalProtectionChecklist";
import LifePlanningSimulation from "./LifePlanningSimulation";
import ReflexLongTermThinking from "./ReflexLongTermThinking";
import MultiRiskPuzzle from "./MultiRiskPuzzle";
import JournalMyFinancialPromise from "./JournalMyFinancialPromise";
import DebateDependenceVsIndependence from "./DebateDependenceVsIndependence";
import ProtectionSimulationChallenge from "./ProtectionSimulationChallenge";
import BadgeFinancialSecurityMaster from "./BadgeFinancialSecurityMaster";

const insurancePensionGames = {
  "sudden-hospital-bill": SuddenHospitalBill,
  "savings-alone": SavingsAlone,
  "who-needs-insurance": WhoNeedsInsurance,
  "medical-cost-reality": MedicalCostReality,
  "life-cover-purpose": LifeCoverPurpose,
  "premium-confusion": PremiumConfusion,
  "policy-reading": PolicyReading,
  "claim-preparation": ClaimPreparation,
  "fake-insurance-offer": FakeInsuranceOffer,
  "when-insurance-matters": WhenInsuranceMatters,
  "business-risk": BusinessRisk,
  "insurance-decision-check": InsuranceDecisionCheck,
  "work-forever-myth": WorkForeverMyth,
  "dependence-risk": DependenceRisk,
  "early-saving-advantage": EarlySavingAdvantage,
  "small-savings-logic": SmallSavingsLogic,
  "informal-worker-reality": InformalWorkerReality,
  "pension-vs-emergency-fund": PensionVsEmergencyFund,
  "government-pension-awareness": GovernmentPensionAwareness,
  "lifestyle-vs-future": LifestyleVsFuture,
  "retirement-reality": RetirementReality,
  "saving-habit-choice": SavingHabitChoice,
  "income-vs-longevity": IncomeVsLongevity,
  "financial-independence-goal": FinancialIndependenceGoal,
  "long-term-security-checkpoint": LongTermSecurityCheckpoint,
  "protection-reflex": ProtectionReflex,
  "insurance-coverage-match": InsuranceCoverageMatch,
  "journal-my-family-risks": MyFamilyRisksJournal,
  "badge-protection-beginner": BadgeProtectionBeginner,
  "coverage-puzzle": CoveragePuzzle,
  "claim-process-simulation": ClaimProcessSimulation,
  "reflex-safe-vs-risk": ReflexSafeVsRisk,
  "badge-insurance-aware": BadgeInsuranceAware,
  "retirement-planning-debate": RetirementPlanningDebate,
  "pension-fund-puzzle": PensionFundPuzzle,
  "badge-future-planner": BadgeFuturePlanner,
  "journal-my-retirement-vision": JournalMyRetirementVision,
  "pension-growth-simulation": PensionGrowthSimulation,
  "reflex-secure-future": ReflexSecureFuture,
  "badge-retirement-ready": BadgeRetirementReady,
  "risk-priority-puzzle": RiskPriorityPuzzle,
  "debate-insurance-vs-investment": DebateInsuranceVsInvestment,
  "journal-protection-checklist": JournalProtectionChecklist,
  "life-planning-simulation": LifePlanningSimulation,
  "reflex-long-term-thinking": ReflexLongTermThinking,
  "multi-risk-puzzle": MultiRiskPuzzle,
  "journal-my-financial-promise": JournalMyFinancialPromise,
  "debate-dependence-vs-independence": DebateDependenceVsIndependence,
  "protection-simulation-challenge": ProtectionSimulationChallenge,
  "badge-financial-security-master": BadgeFinancialSecurityMaster,
  "game-1": SuddenHospitalBill,
  "game-2": ProtectionReflex,
  "game-3": SavingsAlone,
  "game-4": InsuranceCoverageMatch,
  "game-5": WhoNeedsInsurance,
  "game-6": MyFamilyRisksJournal,
  "game-7": MedicalCostReality,
  "game-8": LifeCoverPurpose,
  "game-9": PremiumConfusion,
  "game-10": BadgeProtectionBeginner,
  "game-11": PolicyReading,
  "game-12": CoveragePuzzle,
  "game-13": ClaimPreparation,
  "game-14": FakeInsuranceOffer,
  "game-15": ClaimProcessSimulation,
  "game-16": WhenInsuranceMatters,
  "game-17": BusinessRisk,
  "game-18": InsuranceDecisionCheck,
  "game-19": ReflexSafeVsRisk,
  "game-20": BadgeInsuranceAware,
  "game-21": WorkForeverMyth,
  "game-22": DependenceRisk,
  "game-23": RetirementPlanningDebate,
  "game-24": EarlySavingAdvantage,
  "game-25": SmallSavingsLogic,
  "game-26": InformalWorkerReality,
  "game-27": PensionFundPuzzle,
  "game-28": PensionVsEmergencyFund,
  "game-29": GovernmentPensionAwareness,
  "game-30": BadgeFuturePlanner,
  "game-31": LifestyleVsFuture,
  "game-32": RetirementReality,
  "game-33": JournalMyRetirementVision,
  "game-34": SavingHabitChoice,
  "game-35": IncomeVsLongevity,
  "game-36": PensionGrowthSimulation,
  "game-37": FinancialIndependenceGoal,
  "game-38": LongTermSecurityCheckpoint,
  "game-39": ReflexSecureFuture,
  "game-40": BadgeRetirementReady,
  "game-41": RiskPriorityPuzzle,
  "game-42": DebateInsuranceVsInvestment,
  "game-43": JournalProtectionChecklist,
  "game-44": LifePlanningSimulation,
  "game-45": ReflexLongTermThinking,
  "game-46": MultiRiskPuzzle,
  "game-47": JournalMyFinancialPromise,
  "game-48": DebateDependenceVsIndependence,
  "game-49": ProtectionSimulationChallenge,
  "game-50": BadgeFinancialSecurityMaster,
};

export const getInsurancePensionGame = (gameId) => insurancePensionGames[gameId];

export default insurancePensionGames;
