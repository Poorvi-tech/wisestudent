import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const HIGHER_LOAN_HIGHER_COST_STAGES = [
  {
    id: 1,
    prompt: "If you borrow more money:",
    options: [
      {
        id: "increases",
        label: "Total interest usually increases proportionally",
        reflection: "Exactly! Bigger loans mean higher principal amounts, resulting in more total interest paid over the life of the loan.",
        isCorrect: true,
      },
      {
        id: "same",
        label: "Interest stays the same regardless of loan size",
        reflection: "Actually, larger loans typically generate more total interest because you're paying interest on a bigger principal amount over time.",
        isCorrect: false,
      },
      
      {
        id: "decreases",
        label: "Interest rates decrease for larger loans",
        reflection: "While some large loans may have better rates, the total interest cost still increases because you're borrowing more money overall.",
        isCorrect: false,
      },
      {
        id: "negotiable",
        label: "Interest depends entirely on negotiation skills",
        reflection: "Negotiation can help, but loan size fundamentally affects total interest - larger amounts mean more money subject to interest charges.",
        isCorrect: false,
      },
    ],
    reward: 10,
  },
  {
    id: 2,
    prompt: "Why does borrowing more create higher costs?",
    options: [
      {
        id: "complexity",
        label: "Larger loans are more administratively complex",
        reflection: "Administrative complexity affects processing, but the core reason is mathematical - more principal means more interest accumulates over time.",
        isCorrect: false,
      },
     
      {
        id: "risk",
        label: "Lenders perceive bigger loans as higher risk",
        reflection: "Risk perception affects interest rates, but even with the same rate, larger principals generate more total interest dollars.",
        isCorrect: false,
      },
      {
        id: "duration",
        label: "Large loans typically have longer repayment terms",
        reflection: "Extended terms are common but not universal. The fundamental issue is that more borrowed money equals more interest regardless of term length.",
        isCorrect: false,
      },
       {
        id: "principal",
        label: "More principal amount means more interest accumulation",
        reflection: "Correct! Interest is calculated on the outstanding principal, so larger loans have more money accruing interest throughout the repayment period.",
        isCorrect: true,
      },
    ],
    reward: 10,
  },
  {
    id: 3,
    prompt: "How does loan size affect monthly payments?",
    options: [
      {
        id: "unchanged",
        label: "Monthly payments stay the same regardless of loan amount",
        reflection: "Monthly payments typically increase with loan size because you're repaying more principal plus the corresponding interest charges.",
        isCorrect: false,
      },
      
      {
        id: "negligible",
        label: "The difference is negligible for small loan increases",
        reflection: "Even small increases compound over time. Each additional rupee borrowed adds to both immediate payments and total interest costs.",
        isCorrect: false,
      },
      {
        id: "proportional",
        label: "Payments increase proportionally with borrowed amount",
        reflection: "Perfect! Larger loans require higher monthly payments to repay both the increased principal and accumulated interest within the same timeframe.",
        isCorrect: true,
      },
      {
        id: "flexible",
        label: "You can always adjust payments based on affordability",
        reflection: "Payment flexibility varies by lender terms. The mathematical reality is that larger loans require larger payments to maintain the same repayment schedule.",
        isCorrect: false,
      },
    ],
    reward: 10,
  },
  {
    id: 4,
    prompt: "What's the relationship between loan size and total repayment?",
    options: [
      {
        id: "linear",
        label: "Total repayment increases linearly with loan size",
        reflection: "Close! Total repayment typically increases more than linearly because interest compounds on the larger principal amount over time.",
        isCorrect: false,
      },
      {
        id: "exponential",
        label: "Larger loans create exponentially higher total costs",
        reflection: "Exactly! The combination of larger principal and compound interest creates disproportionately higher total repayment amounts for bigger loans.",
        isCorrect: true,
      },
      {
        id: "inverse",
        label: "Smaller loans actually cost more in total",
        reflection: "This is backwards - smaller loans cost less overall. The principle is straightforward: borrow less, pay less in total interest and principal.",
        isCorrect: false,
      },
      {
        id: "unrelated",
        label: "Loan size and total cost are unrelated factors",
        reflection: "These are directly related - loan size is the foundation for calculating all interest charges and determines your total repayment obligation.",
        isCorrect: false,
      },
    ],
    reward: 10,
  },
  {
    id: 5,
    prompt: "What's the golden rule for loan sizing?",
    options: [
       {
        id: "minimum",
        label: "Borrow only what you truly need and can repay",
        reflection: "Perfect! This principle minimizes both your monthly payment burden and total interest costs over the life of the loan.",
        isCorrect: true,
      },
      {
        id: "maximum",
        label: "Borrow the maximum amount you're approved for",
        reflection: "Maximum borrowing creates maximum debt. The wise approach is borrowing only what you actually need and can comfortably repay.",
        isCorrect: false,
      },
     
      {
        id: "future",
        label: "Consider future needs when determining loan size",
        reflection: "Future planning is important, but borrowing for anticipated needs often leads to unnecessary debt. Stick to current, verified requirements.",
        isCorrect: false,
      },
      {
        id: "comparison",
        label: "Match what others are borrowing for similar purposes",
        reflection: "Others' borrowing decisions don't reflect your financial situation. Base loan amounts on your actual needs and repayment capacity.",
        isCorrect: false,
      },
    ],
    reward: 10,
  },
];

const totalStages = HIGHER_LOAN_HIGHER_COST_STAGES.length;
const successThreshold = totalStages;

const HigherLoanHigherCost = () => {
  const location = useLocation();
  const gameId = "finance-adults-34";
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
      "How can you calculate the true cost difference between loan sizes before borrowing?",
      "What strategies help you determine the minimum loan amount needed for your specific situation?",
    ],
    []
  );

  const handleChoice = (option) => {
    if (selectedOption || showResult) return;

    resetFeedback();
    const currentStageData = HIGHER_LOAN_HIGHER_COST_STAGES[currentStage];
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
  const stage = HIGHER_LOAN_HIGHER_COST_STAGES[Math.min(currentStage, totalStages - 1)];
  const hasPassed = finalScore === successThreshold;

  return (
    <GameShell
      title="Higher Loan, Higher Cost"
      subtitle={subtitle}
      score={showResult ? finalScore : coins}
      coins={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      maxScore={HIGHER_LOAN_HIGHER_COST_STAGES.length}
      currentLevel={Math.min(currentStage + 1, HIGHER_LOAN_HIGHER_COST_STAGES.length)}
      totalLevels={HIGHER_LOAN_HIGHER_COST_STAGES.length}
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
            <span>Loan Sizing</span>
            <span>Cost Analysis</span>
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
                    Skill unlocked: <strong>Loan size optimization</strong>
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
              Skill unlocked: <strong>Loan size optimization</strong>
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

export default HigherLoanHigherCost;