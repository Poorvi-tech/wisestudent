import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const REPAYMENT_READINESS_STAGES = [
  {
    id: 1,
    prompt: "Before taking a loan, you should:",
    options: [
     
      {
        id: "focus",
        label: "Focus only on the monthly EMI amount",
        reflection: "Actually, EMI-only focus can be misleading. Total loan cost assessment requires examining all fees, charges, and the complete interest burden over the loan term, not just monthly payments.",
        isCorrect: false,
      },
      {
        id: "compare",
        label: "Compare only interest rates between lenders",
        reflection: "While interest rate comparison is important, total cost evaluation requires examining all applicable fees, charges, penalty structures, and terms that significantly impact the overall borrowing expense.",
        isCorrect: false,
      },
      {
        id: "assume",
        label: "Assume you'll earn more to handle higher payments",
        reflection: "Assumptions about future income are risky financial planning. Proper loan evaluation requires basing decisions on current financial capacity and realistic repayment scenarios rather than optimistic projections.",
        isCorrect: false,
      },
       {
        id: "calculate",
        label: "Calculate total cost including interest and all fees",
        reflection: "Exactly! Understanding the complete financial obligation including principal, interest, processing fees, and other charges ensures you can make informed borrowing decisions and realistic repayment plans.",
        isCorrect: true,
      },
    ],
    reward: 10,
  },
  {
    id: 2,
    prompt: "Which EMI payment strategy is most financially responsible?",
    options: [
      {
        id: "timely",
        label: "Pay on or before due date consistently",
        reflection: "Correct! Timely payments protect your credit history, avoid penalties, and demonstrate financial reliability. Payment consistency is fundamental to successful loan management and future borrowing capacity.",
        isCorrect: true,
      },
      {
        id: "whenever",
        label: "Pay whenever you have spare cash available",
        reflection: "Irregular payment timing creates risk of missed due dates, late fees, and credit damage. Systematic, scheduled payments provide reliability and protect your financial standing consistently.",
        isCorrect: false,
      },
      {
        id: "minimum",
        label: "Pay minimum amounts to preserve cash flow",
        reflection: "Minimum payments prevent default but don't protect credit scores and can lead to accumulating interest. Responsible strategy involves complete, timely payment fulfillment for optimal financial outcomes.",
        isCorrect: false,
      },
      {
        id: "extra",
        label: "Pay extra only when you feel wealthy",
        reflection: "Extra payments are beneficial for interest reduction, but the foundation of responsible loan management is consistent, complete payment fulfillment rather than sporadic additional contributions.",
        isCorrect: false,
      },
    ],
    reward: 10,
  },
  {
    id: 3,
    prompt: "If facing temporary income reduction, the best approach is:",
    options: [
      
      {
        id: "ignore",
        label: "Ignore the situation and hope it resolves itself",
        reflection: "Ignoring payment obligations leads to missed payments, penalties, credit damage, and potential legal action. Proactive communication with documented financial hardship is essential for finding sustainable solutions.",
        isCorrect: false,
      },
      {
        id: "borrow",
        label: "Take another loan to cover existing loan payments",
        reflection: "Debt cycling creates increasingly dangerous financial situations. The solution is communicating with current lenders for structured relief rather than adding more debt burden to solve payment difficulties.",
        isCorrect: false,
      },
      {
        id: "communicate",
        label: "Contact lender early to discuss restructuring options",
        reflection: "Perfect! Early communication prevents defaults and opens doors to payment holidays, EMI reductions, or tenure extensions that provide breathing room during financial hardship while protecting your credit standing.",
        isCorrect: true,
      },
      {
        id: "delay",
        label: "Delay payments until income naturally improves",
        reflection: "Unilateral payment delays without lender agreement create missed payment reporting and credit damage. Formal restructuring requires proactive communication and documented arrangements for sustainable solutions.",
        isCorrect: false,
      },
    ],
    reward: 10,
  },
  {
    id: 4,
    prompt: "What indicates you're ready for loan repayment responsibility?",
    options: [
      
      {
        id: "desire",
        label: "Strong desire to own the financed item immediately",
        reflection: "Desire alone doesn't create repayment capability. Loan readiness requires financial capacity assessment including stable income, expense management, and emergency preparedness rather than emotional purchasing motivations.",
        isCorrect: false,
      },
      {
        id: "stable",
        label: "Stable income covering EMI plus emergency buffer",
        reflection: "Exactly! Repayment readiness requires consistent income that comfortably covers loan payments while maintaining adequate emergency funds for unexpected expenses, ensuring financial stability during the loan term.",
        isCorrect: true,
      },
      {
        id: "approval",
        label: "Getting loan approval from multiple lenders",
        reflection: "Approval indicates borrowing capacity but doesn't guarantee repayment readiness. True readiness requires stable income, expense management skills, and emergency financial planning for sustainable loan fulfillment.",
        isCorrect: false,
      },
      {
        id: "pressure",
        label: "Social pressure or peer influence to borrow",
        reflection: "External pressure creates poor financial decisions. Loan readiness should be based on personal financial capacity, realistic repayment planning, and genuine need rather than social influences or comparison shopping.",
        isCorrect: false,
      },
    ],
    reward: 10,
  },
  {
    id: 5,
    prompt: "What's the golden rule for successful loan repayment?",
    options: [
      {
        id: "affordability",
        label: "Borrow only what you can comfortably repay",
        reflection: "Perfect! The fundamental principle is matching loan amounts to your repayment capacity with adequate income stability and emergency preparedness, ensuring sustainable financial obligations without compromising other essential needs.",
        isCorrect: true,
      },
      {
        id: "maximum",
        label: "Borrow maximum amount lenders will approve",
        reflection: "Maximum borrowing based on approval limits often exceeds comfortable repayment capacity. Successful loan management requires conservative borrowing within your actual financial means rather than maximum approved amounts.",
        isCorrect: false,
      },
      {
        id: "flexible",
        label: "Choose loans with the most flexible terms",
        reflection: "Flexibility considerations are secondary to fundamental affordability. The key to successful repayment is borrowing within your means and maintaining consistent payment discipline rather than seeking flexible terms that may not address core capacity issues.",
        isCorrect: false,
      },
      {
        id: "quick",
        label: "Select loans with fastest approval and disbursement",
        reflection: "Speed shouldn't override careful financial evaluation. Proper loan readiness involves thorough cost assessment, term analysis, and capacity verification rather than prioritizing quick access over sustainable repayment planning.",
        isCorrect: false,
      },
    ],
    reward: 10,
  },
];

const totalStages = REPAYMENT_READINESS_STAGES.length;
const successThreshold = totalStages;

const RepaymentReadinessCheckpoint = () => {
  const location = useLocation();
  const gameId = "finance-adults-44";
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
      "How can you calculate the true total cost of a loan before borrowing?",
      "What emergency planning should accompany loan repayment commitments?",
    ],
    []
  );

  const handleChoice = (option) => {
    if (selectedOption || showResult) return;

    resetFeedback();
    const currentStageData = REPAYMENT_READINESS_STAGES[currentStage];
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
  const stage = REPAYMENT_READINESS_STAGES[Math.min(currentStage, totalStages - 1)];
  const hasPassed = finalScore === successThreshold;

  return (
    <GameShell
      title="Repayment Readiness Checkpoint"
      subtitle={subtitle}
      score={showResult ? finalScore : coins}
      coins={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      maxScore={REPAYMENT_READINESS_STAGES.length}
      currentLevel={Math.min(currentStage + 1, REPAYMENT_READINESS_STAGES.length)}
      totalLevels={REPAYMENT_READINESS_STAGES.length}
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
            <span>Loan Preparedness</span>
            <span>Repayment Mastery</span>
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
                    Skill unlocked: <strong>Loan repayment proficiency</strong>
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
              Skill unlocked: <strong>Loan repayment proficiency</strong>
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

export default RepaymentReadinessCheckpoint;