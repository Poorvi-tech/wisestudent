import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const PREPAYMENT_AWARENESS_STAGES = [
  {
    id: 1,
    prompt: "Paying extra towards loan early can:",
    options: [
      {
        id: "reduce",
        label: "Reduce interest burden and shorten loan tenure",
        reflection: "Exactly! Early prepayment reduces the principal faster, which decreases the interest calculated on the remaining balance and shortens the overall loan period.",
        isCorrect: true,
      },
      {
        id: "increase",
        label: "Increase loan cost due to processing fees",
        reflection: "Actually, while some loans may have prepayment penalties, the fundamental benefit of early payment is interest reduction that typically outweighs any processing costs.",
        isCorrect: false,
      },
      {
        id: "extend",
        label: "Extend loan tenure by reducing monthly burden",
        reflection: "Early payments actually shorten, not extend, loan tenure. They reduce the principal faster, leading to less interest accumulation over time.",
        isCorrect: false,
      },
      {
        id: "complicate",
        label: "Complicate loan management without benefits",
        reflection: "Strategic prepayment simplifies financial planning by reducing debt faster. While it requires coordination, the interest savings typically provide clear financial benefits.",
        isCorrect: false,
      },
    ],
    reward: 10,
  },
  {
    id: 2,
    prompt: "What's the main benefit of loan prepayment?",
    options: [
     
      {
        id: "flexibility",
        label: "Increased monthly payment flexibility",
        reflection: "Prepayment typically reduces, rather than increases, monthly flexibility since it requires additional funds. The main benefit is long-term cost reduction, not payment flexibility.",
        isCorrect: false,
      },
      {
        id: "approval",
        label: "Better chances for future loan approvals",
        reflection: "While debt reduction can improve credit metrics, the direct benefit of prepayment is interest savings rather than improved approval odds for future borrowing.",
        isCorrect: false,
      },
      {
        id: "tenure",
        label: "Extended loan tenure for easier management",
        reflection: "Prepayment shortens loan tenure by reducing the principal faster. Extended tenure would actually increase total interest costs rather than providing management benefits.",
        isCorrect: false,
      },
       {
        id: "interest",
        label: "Significant interest savings over loan lifetime",
        reflection: "Correct! Prepaying reduces the principal balance faster, which dramatically decreases the total interest paid over the life of the loan.",
        isCorrect: true,
      },
    ],
    reward: 10,
  },
  {
    id: 3,
    prompt: "When should you consider prepaying a loan?",
    options: [
      {
        id: "extra",
        label: "When you have extra funds after meeting other obligations",
        reflection: "Perfect! Prepayment should come from surplus funds that don't compromise emergency savings, investments, or other essential financial commitments.",
        isCorrect: true,
      },
      {
        id: "anytime",
        label: "Anytime you have spare cash available",
        reflection: "While having cash is necessary, timing matters. Prepayment should align with your overall financial strategy and not compromise more pressing financial needs or opportunities.",
        isCorrect: false,
      },
      {
        id: "high",
        label: "When interest rates are historically high",
        reflection: "Interest rate environment affects investment decisions, but prepayment benefits are primarily about reducing your own debt burden regardless of broader rate trends.",
        isCorrect: false,
      },
      {
        id: "urgent",
        label: "When facing urgent financial pressures",
        reflection: "Urgent pressures typically require addressing immediate needs first. Prepayment is a strategic decision that works best when financial stability is already established.",
        isCorrect: false,
      },
    ],
    reward: 10,
  },
  {
    id: 4,
    prompt: "What should you check before making loan prepayments?",
    options: [
     
      {
        id: "market",
        label: "Current market interest rate trends",
        reflection: "Market rates affect new borrowing decisions but don't directly impact the benefit calculation for existing loan prepayment, which focuses on reducing your current debt burden.",
        isCorrect: false,
      },
      {
        id: "inflation",
        label: "Inflation rates and purchasing power changes",
        reflection: "Inflation considerations are important for long-term planning, but prepayment decisions should primarily focus on the direct interest savings and loan term reduction benefits.",
        isCorrect: false,
      },
       {
        id: "penalties",
        label: "Prepayment penalties and processing charges",
        reflection: "Exactly! Many loans have prepayment penalties or fees that can reduce the net benefit. Checking terms ensures your prepayment strategy maximizes savings.",
        isCorrect: true,
      },
      {
        id: "comparison",
        label: "Compare with alternative investment returns",
        reflection: "While comparing potential returns is wise, the guaranteed savings from prepayment (reduced interest) often beats speculative investment returns, especially for high-interest debt.",
        isCorrect: false,
      },
    ],
    reward: 10,
  },
  {
    id: 5,
    prompt: "What's the golden rule for loan prepayment?",
    options: [
     
      {
        id: "aggressive",
        label: "Aggressively prepay all available loans immediately",
        reflection: "Aggressive prepayment without strategic planning can compromise emergency preparedness and other financial goals. Balance is key for optimal long-term financial health.",
        isCorrect: false,
      },
       {
        id: "strategic",
        label: "Make strategic prepayments when financially advantageous",
        reflection: "Perfect! Strategic prepayment considers your complete financial picture - ensuring emergency funds are intact, high-priority goals are funded, and the prepayment provides meaningful interest savings.",
        isCorrect: true,
      },
      {
        id: "minimum",
        label: "Focus only on minimum required payments",
        reflection: "Minimum payments extend loan terms and total costs. Strategic additional payments when feasible provide significant long-term savings and debt reduction benefits.",
        isCorrect: false,
      },
      {
        id: "opportunistic",
        label: "Prepay whenever extra money becomes available",
        reflection: "Opportunistic prepayment without considering overall financial priorities can disrupt emergency planning and other important financial objectives. Strategic timing is essential.",
        isCorrect: false,
      },
    ],
    reward: 10,
  },
];

const totalStages = PREPAYMENT_AWARENESS_STAGES.length;
const successThreshold = totalStages;

const PrepaymentAwareness = () => {
  const location = useLocation();
  const gameId = "finance-adults-39";
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
      "How can you calculate the interest savings from different prepayment amounts?",
      "What factors should determine the optimal timing and amount for loan prepayments?",
    ],
    []
  );

  const handleChoice = (option) => {
    if (selectedOption || showResult) return;

    resetFeedback();
    const currentStageData = PREPAYMENT_AWARENESS_STAGES[currentStage];
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
      }, 2500); // Wait longer before showing final results
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
  const stage = PREPAYMENT_AWARENESS_STAGES[Math.min(currentStage, totalStages - 1)];
  const hasPassed = finalScore === successThreshold;

  return (
    <GameShell
      title="Prepayment Awareness"
      subtitle={subtitle}
      score={coins}
      coins={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      maxScore={PREPAYMENT_AWARENESS_STAGES.length}
      currentLevel={Math.min(currentStage + 1, PREPAYMENT_AWARENESS_STAGES.length)}
      totalLevels={PREPAYMENT_AWARENESS_STAGES.length}
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
            <span>Loan Optimization</span>
            <span>Prepayment Benefits</span>
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
                  <button
                    onClick={() => {
                      const updatedHistory = [
                        ...history,
                        { stageId: PREPAYMENT_AWARENESS_STAGES[currentStage].id, isCorrect: PREPAYMENT_AWARENESS_STAGES[currentStage].options.find(opt => opt.id === selectedOption)?.isCorrect },
                      ];
                      const correctCount = updatedHistory.filter((item) => item.isCorrect).length;
                      const passed = correctCount === successThreshold;
                      setFinalScore(correctCount);
                      setCoins(passed ? totalCoins : 0);
                      setShowResult(true);
                    }}
                    className="rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-2 px-6 font-semibold shadow-lg hover:opacity-90"
                  >
                  Finish
                  </button>
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
                    Skill unlocked: <strong>Strategic loan prepayment</strong>
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
              Skill unlocked: <strong>Strategic loan prepayment</strong>
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

export default PrepaymentAwareness;