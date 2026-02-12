import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const HIDDEN_CHARGES_STAGES = [
  {
    id: 1,
    prompt: "Loan cost includes:",
    options: [
      {
        id: "emi",
        label: "Only EMI payments as advertised",
        reflection: "Actually, loan costs typically include various fees and charges beyond the monthly EMI. Focusing only on EMI can lead to underestimating the true total cost of borrowing.",
        isCorrect: false,
      },
      {
        id: "full",
        label: "Processing fees, penalties, and additional charges",
        reflection: "Exactly! Always check the full cost breakdown including processing fees, documentation charges, prepayment penalties, and other applicable fees that significantly increase the total loan expense.",
        isCorrect: true,
      },
      {
        id: "interest",
        label: "Just the interest component of the loan",
        reflection: "While interest is a major component, loan costs also include various fees and charges. The complete cost picture requires examining all applicable fees in addition to interest payments.",
        isCorrect: false,
      },
      {
        id: "principal",
        label: "Principal amount plus standard interest rates",
        reflection: "Principal and interest are core components, but lenders typically add various processing fees, administrative charges, and potential penalty fees that substantially increase the total borrowing cost.",
        isCorrect: false,
      },
    ],
    reward: 10,
  },
  {
    id: 2,
    prompt: "What's typically included in total loan cost beyond EMIs?",
    options: [
      {
        id: "fees",
        label: "Processing fees, documentation charges, and insurance",
        reflection: "Correct! These additional costs can add 2-5% to the loan amount and significantly impact the true cost of borrowing, making it essential to factor them into your financial planning.",
        isCorrect: true,
      },
      {
        id: "interest",
        label: "Only the interest portion of monthly payments",
        reflection: "Interest is included in EMIs, but the additional costs are separate fees charged upfront or periodically. Total loan cost requires examining both EMI components and separate fee structures.",
        isCorrect: false,
      },
      {
        id: "taxes",
        label: "Government taxes and regulatory compliance fees",
        reflection: "While some government fees may apply, the primary hidden costs are lender-imposed processing fees, documentation charges, and service fees that aren't always clearly disclosed upfront.",
        isCorrect: false,
      },
      {
        id: "maintenance",
        label: "Account maintenance and annual service charges",
        reflection: "These ongoing charges are less common for standard loans. The main hidden costs are upfront processing fees and potential prepayment penalties rather than regular maintenance fees.",
        isCorrect: false,
      },
    ],
    reward: 10,
  },
  {
    id: 3,
    prompt: "Why do lenders advertise low EMIs but charge additional fees?",
    options: [
    
      {
        id: "regulatory",
        label: "Regulatory requirements mandate separate fee disclosure",
        reflection: "While regulations require transparency, the practice of emphasizing low EMIs while burying fee information in fine print is a marketing tactic rather than regulatory compliance necessity.",
        isCorrect: false,
      },
      {
        id: "competitive",
        label: "To remain competitive with other lending institutions",
        reflection: "Competitive pressure actually drives transparency about total costs. The EMI-focused advertising is more about creating perceived affordability than responding to competitive market forces.",
        isCorrect: false,
      },
      {
        id: "administrative",
        label: "To cover legitimate administrative processing costs",
        reflection: "While administrative costs exist, the disconnect between advertised EMIs and actual total costs serves marketing purposes rather than simply covering operational expenses for loan processing.",
        isCorrect: false,
      },
        {
        id: "attract",
        label: "To attract borrowers with seemingly affordable payments",
        reflection: "Perfect! Low EMI advertising creates the impression of affordability while additional fees increase total costs. This marketing strategy can mislead borrowers about the true financial commitment required.",
        isCorrect: true,
      },
    ],
    reward: 10,
  },
  {
    id: 4,
    prompt: "What should you always check before accepting a loan offer?",
    options: [
      
      {
        id: "emi",
        label: "Monthly EMI amount and payment schedule only",
        reflection: "EMI focus alone can be misleading. The complete picture requires examining all associated costs, fee structures, and potential penalties that significantly impact the total financial commitment.",
        isCorrect: false,
      },
      {
        id: "interest",
        label: "Interest rate and comparison with market rates",
        reflection: "Interest rate comparison is important, but total cost assessment requires examining all fees, charges, and penalty structures that can substantially increase the effective borrowing cost beyond headline rates.",
        isCorrect: false,
      },
      {
        id: "breakdown",
        label: "Complete cost breakdown including all fees and charges",
        reflection: "Exactly! Review the loan agreement thoroughly for processing fees, documentation charges, prepayment penalties, late payment fees, and any other applicable costs that affect the total borrowing expense.",
        isCorrect: true,
      },
      {
        id: "tenure",
        label: "Loan tenure and total repayment period",
        reflection: "Tenure affects total interest, but doesn't reveal additional fees. Complete cost evaluation requires examining all applicable charges, processing fees, and penalty structures regardless of loan term length.",
        isCorrect: false,
      },
    ],
    reward: 10,
  },
  {
    id: 5,
    prompt: "What's the golden rule for loan cost evaluation?",
    options: [
      
      {
        id: "lowest",
        label: "Choose the loan with the lowest advertised EMI",
        reflection: "Lowest EMI focus ignores hidden costs. The best loan balances reasonable monthly payments with minimal total fees and charges, requiring comprehensive cost analysis rather than EMI-only comparison.",
        isCorrect: false,
      },
      {
        id: "comprehensive",
        label: "Calculate total cost including all fees, not just EMIs",
        reflection: "Perfect! The golden rule is to compute the complete financial obligation by adding all fees, charges, and potential penalties to the principal and interest, ensuring you understand the true cost of borrowing.",
        isCorrect: true,
      },
      {
        id: "flexible",
        label: "Select loans with flexible payment options",
        reflection: "Payment flexibility addresses cash flow needs but doesn't solve hidden cost issues. The fundamental principle is transparency about total costs rather than payment structure flexibility.",
        isCorrect: false,
      },
      {
        id: "quick",
        label: "Opt for fastest loan approval and disbursement",
        reflection: "Speed of approval shouldn't override cost considerations. Proper loan evaluation requires time to examine all fees, terms, and conditions to avoid costly surprises that outweigh quick access benefits.",
        isCorrect: false,
      },
    ],
    reward: 10,
  },
];

const totalStages = HIDDEN_CHARGES_STAGES.length;
const successThreshold = totalStages;

const HiddenCharges = () => {
  const location = useLocation();
  const gameId = "finance-adults-41";
  const gameData = getGameDataById(gameId);
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 10;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 10;
  const totalXp = gameData?.xp || location.state?.totalXp || 20;
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const [currentStage, setCurrentStage] = useState(0);
  const [coins, setCoins] = useState(0);
  const [history, setHistory] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [selectedReflection, setSelectedReflection] = useState(null);
  const [canProceed, setCanProceed] = useState(false);

  const reflectionPrompts = useMemo(
    () => [
      "How can you identify and calculate all potential fees before signing a loan agreement?",
      "What questions should you ask lenders to uncover hidden charges in loan offers?",
    ],
    []
  );

  const handleChoice = (option) => {
    if (selectedOption || showResult) return;

    resetFeedback();
    const currentStageData = HIDDEN_CHARGES_STAGES[currentStage];
    const updatedHistory = [
      ...history,
      { stageId: currentStageData.id, isCorrect: option.isCorrect },
    ];
    setHistory(updatedHistory);
    setSelectedOption(option.id);
    setSelectedReflection(option.reflection); // Set the reflection for the selected option
    setShowFeedback(true); // Show feedback after selection
    setCanProceed(false); // Disable proceeding initially
    
    // Update coins if the answer is correct
    if (option.isCorrect) {
      setCoins(prevCoins => prevCoins + 1);
    }
    
    // Wait for the reflection period before allowing to proceed
    setTimeout(() => {
      setCanProceed(true); // Enable proceeding after showing reflection
    }, 1500); // Wait 2.5 seconds before allowing to proceed
    
    // Handle the final stage separately
    if (currentStage === totalStages - 1) {
      setTimeout(() => {
        const correctCount = updatedHistory.filter((item) => item.isCorrect).length;
        const passed = correctCount === successThreshold;
        setFinalScore(correctCount);
        setCoins(passed ? totalCoins : 0); // Set final coins based on performance
        setShowResult(true);
      }, 5500); // Wait longer before showing final results
    }
    
    if (option.isCorrect) {
      showCorrectAnswerFeedback(currentStageData.reward, true);
    } else {
      showCorrectAnswerFeedback(0, false);
    }
  };

  const handleRetry = () => {
    resetFeedback();
    setCurrentStage(0);
    setHistory([]);
    setSelectedOption(null);
    setCoins(0);
    setFinalScore(0);
    setShowResult(false);
  };

  const subtitle = `Stage ${Math.min(currentStage + 1, totalStages)} of ${totalStages}`;
  const stage = HIDDEN_CHARGES_STAGES[Math.min(currentStage, totalStages - 1)];
  const hasPassed = finalScore === successThreshold;

  return (
    <GameShell
      title="Hidden Charges"
      subtitle={subtitle}
      score={coins}
      coins={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      maxScore={HIDDEN_CHARGES_STAGES.length}
      currentLevel={Math.min(currentStage + 1, HIDDEN_CHARGES_STAGES.length)}
      totalLevels={HIDDEN_CHARGES_STAGES.length}
      gameId={gameId}
      gameType="finance"
      showGameOver={showResult}
      showConfetti={showResult && hasPassed}
      shouldSubmitGameCompletion={hasPassed}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-5 text-white">
        <div className="bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-4 text-sm uppercase tracking-[0.3em] text-white/60">
            <span>Total Loan Cost</span>
            <span>Beyond EMIs</span>
          </div>
          <p className="text-lg text-white/90 mb-6">{stage.prompt}</p>
          <div className="grid grid-cols-2 gap-4">
            {stage.options.map((option) => {
              const isSelected = selectedOption === option.id;
              return (
                <button
                  key={option.id}
                  onClick={() => handleChoice(option)}
                  disabled={!!selectedOption}
                  className={`rounded-2xl border-2 p-5 text-left transition ${isSelected
                      ? option.isCorrect
                        ? "border-emerald-400 bg-emerald-500/20"
                        : "border-rose-400 bg-rose-500/10"
                      : "border-white/30 bg-white/5 hover:border-white/60 hover:bg-white/10"
                    }`}
                >
                  <div className="flex justify-between items-center mb-2 text-sm text-white/70">
                    <span>Choice {option.id.toUpperCase()}</span>
                    
                  </div>
                  <p className="text-white font-semibold">{option.label}</p>
                  
                </button>
              );
            })}
          </div>
          {(showResult || showFeedback) && (
            <div className="bg-white/5 border border-white/20 rounded-3xl p-6 shadow-xl max-w-4xl mx-auto space-y-3">
              <h4 className="text-lg font-semibold text-white">Reflection</h4>
              {selectedReflection && (
                <div className="max-h-24 overflow-y-auto pr-2">
                  <p className="text-sm text-white/90">{selectedReflection}</p>
                </div>
              )}
              {showFeedback && !showResult && (
                <div className="mt-4 flex justify-center">
                  {canProceed ? (
                    <button
                      onClick={() => {
                        if (currentStage < totalStages - 1) {
                          setCurrentStage((prev) => prev + 1);
                          setSelectedOption(null);
                          setSelectedReflection(null);
                          setShowFeedback(false);
                          setCanProceed(false);
                        }
                      }}
                      className="rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-2 px-6 font-semibold shadow-lg hover:opacity-90"
                    >
                      Continue
                    </button>
                  ) : (
                    <div className="py-2 px-6 text-white font-semibold">Reading...</div>
                  )}
                </div>
              )}
              {/* Automatically advance if we're in the last stage and the timeout has passed */}
              {!showResult && currentStage === totalStages - 1 && canProceed && (
                <div className="mt-4 flex justify-center">
                  
                </div>
              )}
              {showResult && (
                <>
                  <ul className="text-sm list-disc list-inside space-y-1">
                    {reflectionPrompts.map((prompt) => (
                      <li key={prompt}>{prompt}</li>
                    ))}
                  </ul>
                  <p className="text-sm text-white/70">
                    Skill unlocked: <strong>Loan cost transparency</strong>
                  </p>
                  {!hasPassed && (
                    <p className="text-xs text-amber-300">
                      Answer all {totalStages} choices correctly to earn the full reward.
                    </p>
                  )}
                  {!hasPassed && (
                    <button
                      onClick={handleRetry}
                      className="w-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-3 font-semibold shadow-lg hover:opacity-90"
                    >
                      Try Again
                    </button>
                  )}
                </>
              )}
            </div>
          )}
          
        </div>
        {showResult && (
          <div className="bg-white/5 border border-white/20 rounded-3xl p-6 shadow-xl max-w-4xl mx-auto space-y-3">
            <h4 className="text-lg font-semibold text-white">Reflection Prompts</h4>
            <ul className="text-sm list-disc list-inside space-y-1">
              {reflectionPrompts.map((prompt) => (
                <li key={prompt}>{prompt}</li>
              ))}
            </ul>
            <p className="text-sm text-white/70">
              Skill unlocked: <strong>Loan cost transparency</strong>
            </p>
            {!hasPassed && (
              <p className="text-xs text-amber-300">
                Answer all {totalStages} choices correctly to earn the full reward.
              </p>
            )}
            {!hasPassed && (
              <button
                onClick={handleRetry}
                className="w-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-3 font-semibold shadow-lg hover:opacity-90"
              >
                Try Again
              </button>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default HiddenCharges;