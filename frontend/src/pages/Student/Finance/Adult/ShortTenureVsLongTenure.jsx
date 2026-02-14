import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const TENURE_COMPARISON_STAGES = [
  {
    id: 1,
    prompt: "Longer loan tenure usually means:",
    options: [
      {
        id: "lower",
        label: "Lower total interest over the loan period",
        reflection: "Actually, longer tenures typically mean higher total interest because you're paying interest on the principal for a longer period of time.",
        isCorrect: false,
      },
      {
        id: "higher",
        label: "Higher total interest due to extended payment period",
        reflection: "Exactly! Smaller EMIs over long periods cost more overall because interest accumulates on the outstanding principal for more years.",
        isCorrect: true,
      },
      {
        id: "flexible",
        label: "More flexible payment options available",
        reflection: "While longer terms may offer payment flexibility, the core financial impact is increased total interest costs over the extended repayment period.",
        isCorrect: false,
      },
      {
        id: "approval",
        label: "Easier approval for borrowers with lower credit scores",
        reflection: "Approval ease is a separate consideration. The fundamental financial truth is that longer tenures increase total interest expenses regardless of approval factors.",
        isCorrect: false,
      },
    ],
    reward: 10,
  },
  {
    id: 2,
    prompt: "What's the main trade-off with longer loan tenures?",
    options: [
      {
        id: "approval",
        label: "Higher chance of loan approval vs lower monthly payments",
        reflection: "Approval probability is secondary to the core financial trade-off - longer terms reduce monthly payments but increase total interest costs significantly.",
        isCorrect: false,
      },
      
      {
        id: "flexibility",
        label: "Payment flexibility vs commitment duration",
        reflection: "Flexibility considerations are important, but the primary trade-off is the financial cost - lower immediate payments versus much higher total repayment.",
        isCorrect: false,
      },
      {
        id: "payments",
        label: "Lower monthly payments vs higher total repayment amount",
        reflection: "Correct! Longer tenures reduce monthly EMIs but dramatically increase the total amount repaid due to extended interest accumulation.",
        isCorrect: true,
      },
      {
        id: "risk",
        label: "Reduced default risk vs extended financial obligation",
        reflection: "Default risk reduction is a benefit, but the fundamental trade-off is monetary - trading lower monthly payments for substantially higher total interest costs.",
        isCorrect: false,
      },
    ],
    reward: 10,
  },
  {
    id: 3,
    prompt: "How does loan tenure affect monthly EMI amounts?",
    options: [
      {
        id: "increase",
        label: "Longer tenure increases monthly payment amounts",
        reflection: "Actually, longer tenures typically decrease monthly EMIs because the same principal is spread over more payment periods.",
        isCorrect: false,
      },
      
      {
        id: "variable",
        label: "EMI amounts vary unpredictably with tenure changes",
        reflection: "EMI calculations are mathematical and predictable. Longer tenures systematically reduce monthly payments through structured amortization schedules.",
        isCorrect: false,
      },
      {
        id: "unchanged",
        label: "Tenure length doesn't affect monthly payment amounts",
        reflection: "Tenure directly affects EMIs - longer periods reduce monthly payments while shorter periods increase them, all else being equal.",
        isCorrect: false,
      },
      {
        id: "decrease",
        label: "Longer tenure decreases monthly EMIs by spreading payments",
        reflection: "Perfect! Extended tenures reduce monthly payment burdens by distributing the principal and interest charges over a longer repayment schedule.",
        isCorrect: true,
      },
    ],
    reward: 10,
  },
  {
    id: 4,
    prompt: "What should you consider when choosing loan tenure?",
    options: [
      {
        id: "minimum",
        label: "Always choose the minimum tenure for lowest total cost",
        reflection: "While shortest tenures minimize total interest, they require higher monthly payments. The key is balancing affordability with reasonable total costs.",
        isCorrect: false,
      },
      {
        id: "balance",
        label: "Balance monthly affordability with reasonable total costs",
        reflection: "Exactly! Optimal tenure selection considers both your ability to make comfortable monthly payments and keeping total interest costs within reasonable limits.",
        isCorrect: true,
      },
      {
        id: "maximum",
        label: "Choose maximum tenure to preserve cash flow",
        reflection: "Maximum tenure preservation prioritizes immediate cash flow over long-term financial health, often resulting in unnecessarily high total interest expenses.",
        isCorrect: false,
      },
      {
        id: "standard",
        label: "Follow industry standard tenure recommendations",
        reflection: "Industry standards provide guidance, but optimal tenure depends on your specific financial situation, income stability, and long-term financial goals.",
        isCorrect: false,
      },
    ],
    reward: 10,
  },
  {
    id: 5,
    prompt: "What's the golden rule for loan tenure selection?",
    options: [
      {
        id: "shortest",
        label: "Choose the shortest tenure your budget can handle",
        reflection: "Perfect! This approach minimizes total interest costs while ensuring monthly payments remain within your comfortable affordability range.",
        isCorrect: true,
      },
      {
        id: "longest",
        label: "Select the longest tenure to minimize monthly burden",
        reflection: "Longest tenure focus reduces immediate payments but significantly increases total costs. Balance is key for optimal long-term financial outcomes.",
        isCorrect: false,
      },
      {
        id: "average",
        label: "Go with average market tenure lengths",
        reflection: "Average market tenures don't account for individual circumstances. Personal financial capacity and goals should drive tenure decisions rather than averages.",
        isCorrect: false,
      },
      {
        id: "flexible",
        label: "Choose adjustable tenure options for future changes",
        reflection: "Adjustable tenures offer flexibility but may come with higher rates or fees. Fixed tenures with optimal length typically provide better value and predictability.",
        isCorrect: false,
      },
    ],
    reward: 10,
  },
];

const totalStages = TENURE_COMPARISON_STAGES.length;
const successThreshold = totalStages;

const ShortTenureVsLongTenure = () => {
  const location = useLocation();
  const gameId = "finance-adults-37";
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
      "How can you calculate the total interest difference between short and long tenure options?",
      "What factors should influence your choice between lower monthly payments and lower total costs?",
    ],
    []
  );

  const handleChoice = (option) => {
    if (selectedOption || showResult) return;

    resetFeedback();
    const currentStageData = TENURE_COMPARISON_STAGES[currentStage];
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
  const stage = TENURE_COMPARISON_STAGES[Math.min(currentStage, totalStages - 1)];
  const hasPassed = finalScore === successThreshold;

  return (
    <GameShell
      title="Short Tenure vs Long Tenure"
      subtitle={subtitle}
      score={showResult ? finalScore : coins}
      coins={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      maxScore={TENURE_COMPARISON_STAGES.length}
      currentLevel={Math.min(currentStage + 1, TENURE_COMPARISON_STAGES.length)}
      totalLevels={TENURE_COMPARISON_STAGES.length}
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
            <span>Tenure Trade-offs</span>
            <span>Loan Duration</span>
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
                    Skill unlocked: <strong>Loan tenure optimization</strong>
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
              Skill unlocked: <strong>Loan tenure optimization</strong>
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

export default ShortTenureVsLongTenure;