import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const INTEREST_TYPE_COMPARISON_STAGES = [
  {
    id: 1,
    prompt: "Which loan has predictable EMIs?",
    options: [
      
      {
        id: "variable",
        label: "Variable interest loan with fluctuating payments",
        reflection: "Variable interest loans have rates that change with market conditions, causing EMIs to fluctuate up and down, making long-term budgeting challenging and unpredictable.",
        isCorrect: false,
      },
      {
        id: "hybrid",
        label: "Hybrid loan combining both features",
        reflection: "While hybrid loans exist, they typically still involve some variable components that create payment uncertainty. Pure fixed-rate loans provide the most predictable payment structure.",
        isCorrect: false,
      },
      {
        id: "floating",
        label: "Floating rate loan with market-linked payments",
        reflection: "Floating rates are directly tied to market benchmarks, causing immediate payment fluctuations with any rate changes. This creates significant budgeting uncertainty compared to fixed rates.",
        isCorrect: false,
      },
      {
        id: "fixed",
        label: "Fixed interest loan with consistent payments",
        reflection: "Exactly! Fixed interest loans maintain the same interest rate throughout the loan term, providing predictable, consistent EMIs that make budgeting straightforward.",
        isCorrect: true,
      },
    ],
    reward: 10,
  },
  {
    id: 2,
    prompt: "What's the main advantage of fixed interest loans?",
    options: [
      
      {
        id: "lower",
        label: "Consistently lower interest rates than market",
        reflection: "Fixed rates aren't necessarily lower - they often include a premium for the predictability benefit. The advantage is stability, not guaranteed lower costs compared to variable rates.",
        isCorrect: false,
      },
      {
        id: "flexibility",
        label: "Greater flexibility to take advantage of rate drops",
        reflection: "Fixed rates actually limit flexibility to benefit from rate decreases. Variable rates provide that flexibility but at the cost of payment uncertainty.",
        isCorrect: false,
      },
      {
        id: "predictability",
        label: "Payment predictability for reliable budgeting",
        reflection: "Correct! Fixed rates eliminate interest rate risk, allowing you to plan your finances with confidence knowing exactly what your monthly payments will be throughout the loan term.",
        isCorrect: true,
      },
      {
        id: "conversion",
        label: "Easy conversion to variable rates when beneficial",
        reflection: "Most fixed-rate loans don't offer easy conversion options. The trade-off for predictability is typically reduced flexibility to change loan structures mid-term.",
        isCorrect: false,
      },
    ],
    reward: 10,
  },
  {
    id: 3,
    prompt: "When do variable interest loans make sense?",
    options: [
      
      {
        id: "rising",
        label: "When interest rates are expected to rise significantly",
        reflection: "Rising rate expectations make variable loans risky since your payments would increase along with rates, potentially becoming unaffordable and defeating the purpose of predictable budgeting.",
        isCorrect: false,
      },
      {
        id: "declining",
        label: "When interest rates are expected to decline",
        reflection: "Perfect! Variable rates can provide savings when market rates fall, making them attractive if you believe rates will decrease during your loan term and you can handle potential increases.",
        isCorrect: true,
      },
      {
        id: "stable",
        label: "When market rates remain completely stable",
        reflection: "While stable rates would make variable loans predictable, perfect rate stability is rare. Fixed rates provide certainty regardless of market conditions.",
        isCorrect: false,
      },
      {
        id: "emergency",
        label: "When facing immediate financial emergencies",
        reflection: "Emergency situations require stable, predictable payments rather than variable ones. Financial emergencies demand certainty in monthly obligations, making fixed rates more appropriate.",
        isCorrect: false,
      },
    ],
    reward: 10,
  },
  {
    id: 4,
    prompt: "What risk do variable interest loans present?",
    options: [
      {
        id: "payment",
        label: "Payment shock from sudden rate increases",
        reflection: "Exactly! Variable rates can jump unexpectedly, creating payment shocks that may strain your budget, reduce financial flexibility, and potentially lead to default if payments become unaffordable.",
        isCorrect: true,
      },
      {
        id: "approval",
        label: "Difficulty getting loan approval initially",
        reflection: "Variable rate loans are often easier to qualify for since lenders face less risk. The main risk is post-approval payment volatility rather than initial approval challenges.",
        isCorrect: false,
      },
      {
        id: "prepayment",
        label: "Higher prepayment penalties typically apply",
        reflection: "Prepayment terms are usually similar between fixed and variable loans. The primary risk with variable rates is ongoing payment uncertainty rather than prepayment restrictions.",
        isCorrect: false,
      },
      {
        id: "tenure",
        label: "Shorter loan tenure options available",
        reflection: "Loan tenure options are generally comparable between fixed and variable products. The distinguishing factor is payment predictability, not loan term availability.",
        isCorrect: false,
      },
    ],
    reward: 10,
  },
  {
    id: 5,
    prompt: "What's the golden rule for interest rate selection?",
    options: [
      
      {
        id: "speculation",
        label: "Choose variable rates to speculate on market movements",
        reflection: "Speculative rate betting can backfire significantly. Essential financial obligations require stability rather than gambling on uncertain market movements that could create payment hardships.",
        isCorrect: false,
      },
      {
        id: "lowest",
        label: "Always select whichever rate is lowest today",
        reflection: "Today's lowest rate isn't necessarily tomorrow's best choice. The key is matching loan structure to your risk tolerance and financial planning needs rather than chasing current rate levels.",
        isCorrect: false,
      },
      {
        id: "complex",
        label: "Opt for complex hybrid structures for maximum benefit",
        reflection: "Complex loan structures often create confusion and hidden risks. Simple, transparent fixed-rate loans typically provide better long-term outcomes for most borrowers' financial stability needs.",
        isCorrect: false,
      },
      {
        id: "stability",
        label: "Choose fixed rates for financial stability and planning",
        reflection: "Perfect! Fixed rates provide the foundation for reliable financial planning, especially for essential expenses like housing where payment predictability protects against budget disruption and financial stress.",
        isCorrect: true,
      },
    ],
    reward: 10,
  },
];

const totalStages = INTEREST_TYPE_COMPARISON_STAGES.length;
const successThreshold = totalStages;

const FixedVsVariableInterest = () => {
  const location = useLocation();
  const gameId = "finance-adults-40";
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
      "How can you evaluate whether you can handle potential payment increases with variable rate loans?",
      "What factors should determine your choice between fixed and variable interest rates for different loan purposes?",
    ],
    []
  );

  const handleChoice = (option) => {
    if (selectedOption || showResult) return;

    resetFeedback();
    const currentStageData = INTEREST_TYPE_COMPARISON_STAGES[currentStage];
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
  const stage = INTEREST_TYPE_COMPARISON_STAGES[Math.min(currentStage, totalStages - 1)];
  const hasPassed = finalScore === successThreshold;

  return (
    <GameShell
      title="Fixed vs Variable Interest"
      subtitle={subtitle}
      score={showResult ? finalScore : coins}
      coins={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      maxScore={INTEREST_TYPE_COMPARISON_STAGES.length}
      currentLevel={Math.min(currentStage + 1, INTEREST_TYPE_COMPARISON_STAGES.length)}
      totalLevels={INTEREST_TYPE_COMPARISON_STAGES.length}
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
            <span>Interest Rate Types</span>
            <span>Payment Predictability</span>
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
                    Skill unlocked: <strong>Interest rate risk assessment</strong>
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
              Skill unlocked: <strong>Interest rate risk assessment</strong>
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

export default FixedVsVariableInterest;