import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const MINIMUM_DUE_TRAP_STAGES = [
  {
    id: 1,
    prompt: "You receive your first credit card bill. What does paying only the minimum due actually mean?",
    options: [
      {
        id: "no-problem",
        label: "No problem - I can pay more later",
        reflection: "Paying only the minimum creates a false sense of security while interest continues to accumulate.",
        isCorrect: false,
      },
      
      {
        id: "manageable",
        label: "It's manageable if I'm careful with spending",
        reflection: "While spending control is important, minimum payments alone won't reduce your debt significantly.",
        isCorrect: false,
      },
      {
        id: "temporary",
        label: "Just a temporary solution until I get more money",
        reflection: "Temporary solutions often become permanent problems when dealing with compound interest.",
        isCorrect: false,
      },
      {
        id: "growing-interest",
        label: "Growing interest and debt over time",
        reflection: "Exactly! Minimum payments cover mostly interest, leaving the principal debt largely untouched.",
        isCorrect: true,
      },
    ],
    reward: 15,
  },
  {
    id: 2,
    prompt: "If you carry a balance and only pay minimum due, what happens to your debt over 12 months?",
    options: [
      {
        id: "decrease",
        label: "It decreases significantly",
        reflection: "Minimum payments are designed to keep you in debt longer, not to pay it off quickly.",
        isCorrect: false,
      },
      {
        id: "stay-same",
        label: "It stays roughly the same",
        reflection: "While the balance might appear stable, interest continues to compound, making the real debt grow.",
        isCorrect: false,
      },
      {
        id: "increase",
        label: "It increases due to accumulating interest",
        reflection: "Correct! Interest compounds on the remaining balance, causing your debt to grow even with minimum payments.",
        isCorrect: true,
      },
      {
        id: "fluctuate",
        label: "It fluctuates based on new purchases",
        reflection: "New purchases do affect the balance, but the core issue is interest accumulation on existing debt.",
        isCorrect: false,
      },
    ],
    reward: 15,
  },
  {
    id: 3,
    prompt: "Why do credit card companies prefer customers who pay only minimum due?",
    options: [
      {
        id: "customer-service",
        label: "They want to provide good customer service",
        reflection: "While customer service is important, the business model relies on interest income from revolving balances.",
        isCorrect: false,
      },
      {
        id: "profit",
        label: "They profit from interest charges over time",
        reflection: "Exactly! Interest income is a major revenue source, making minimum payment customers very profitable.",
        isCorrect: true,
      },
      {
        id: "loyalty",
        label: "They value customer loyalty and long-term relationships",
        reflection: "While relationships matter, the financial incentive comes from ongoing interest payments.",
        isCorrect: false,
      },
      {
        id: "convenience",
        label: "It's more convenient for their billing system",
        reflection: "Convenience for the company isn't the primary reason - profit from interest is the main driver.",
        isCorrect: false,
      },
    ],
    reward: 15,
  },
  {
    id: 4,
    prompt: "What's the real cost of making only minimum payments on a ₹50,000 debt at 36% annual interest?",
    options: [
      {
        id: "time",
        label: "It takes years to pay off with mostly interest payments",
        reflection: "Correct! At 36% interest, it could take over 20 years to pay off with minimum payments, paying much more in interest than principal.",
        isCorrect: true,
      },
      {
        id: "manageable",
        label: "It's manageable if I make small extra payments",
        reflection: "Small extra payments help, but the fundamental issue is that minimum payments are structured to maximize interest income.",
        isCorrect: false,
      },
      {
        id: "quick",
        label: "It gets paid off relatively quickly",
        reflection: "Minimum payments are specifically calculated to extend the repayment period and maximize interest charges.",
        isCorrect: false,
      },
      {
        id: "negligible",
        label: "The interest cost is negligible for small amounts",
        reflection: "Even small amounts can accumulate significant interest over time with high-interest rates.",
        isCorrect: false,
      },
    ],
    reward: 15,
  },
  {
    id: 5,
    prompt: "What's the best strategy when you can't pay the full credit card bill?",
    options: [
      {
        id: "minimum",
        label: "Pay the minimum due and worry about the rest later",
        reflection: "This approach maximizes the time you stay in debt and the interest you pay over the long term.",
        isCorrect: false,
      },
      {
        id: "partial",
        label: "Pay as much as possible beyond the minimum",
        reflection: "Excellent! Paying more than the minimum significantly reduces both the principal and the total interest paid.",
        isCorrect: true,
      },
      {
        id: "ignore",
        label: "Ignore the bill temporarily to avoid stress",
        reflection: "Ignoring bills leads to late fees, higher interest rates, and damage to your credit score.",
        isCorrect: false,
      },
      {
        id: "borrow",
        label: "Borrow from another source to pay the full amount",
        reflection: "This can create a cycle of debt and should only be considered if the new debt has better terms.",
        isCorrect: false,
      },
    ],
    reward: 15,
  },
];

const totalStages = MINIMUM_DUE_TRAP_STAGES.length;
const successThreshold = totalStages;

const MinimumDueTrap = () => {
  const location = useLocation();
  const gameId = "finance-young-adult-55";
  const gameData = getGameDataById(gameId);
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 15;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 15;
  const totalXp = gameData?.xp || location.state?.totalXp || 30;
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
      "How can you avoid falling into the minimum payment trap?",
      "What strategies can help you pay more than the minimum consistently?",
    ],
    []
  );

  const handleChoice = (option) => {
    if (selectedOption || showResult) return;

    resetFeedback();
    const currentStageData = MINIMUM_DUE_TRAP_STAGES[currentStage];
    const updatedHistory = [
      ...history,
      { stageId: currentStageData.id, isCorrect: option.isCorrect },
    ];
    setHistory(updatedHistory);
    setSelectedOption(option.id);
    setSelectedReflection(option.reflection);
    setShowFeedback(true);
    setCanProceed(false);
    
    if (option.isCorrect) {
      setCoins(prevCoins => prevCoins + 1);
    }
    
    setTimeout(() => {
      setCanProceed(true);
    }, 1500);
    
    if (currentStage === totalStages - 1) {
      setTimeout(() => {
        const correctCount = updatedHistory.filter((item) => item.isCorrect).length;
        const passed = correctCount === successThreshold;
        setFinalScore(correctCount);
        setCoins(passed ? totalCoins : 0);
        setShowResult(true);
      }, 5500);
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
  const stage = MINIMUM_DUE_TRAP_STAGES[Math.min(currentStage, totalStages - 1)];
  const hasPassed = finalScore === successThreshold;

  return (
    <GameShell
      title="Minimum Due Trap"
      subtitle={subtitle}
      score={showResult ? finalScore : coins}
      coins={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      maxScore={MINIMUM_DUE_TRAP_STAGES.length}
      currentLevel={Math.min(currentStage + 1, MINIMUM_DUE_TRAP_STAGES.length)}
      totalLevels={MINIMUM_DUE_TRAP_STAGES.length}
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
            <span>Scenario</span>
            <span>Minimum Due Trap</span>
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
                    Skill unlocked: <strong>Minimum payment awareness</strong>
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
              Skill unlocked: <strong>Minimum payment awareness</strong>
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

export default MinimumDueTrap;