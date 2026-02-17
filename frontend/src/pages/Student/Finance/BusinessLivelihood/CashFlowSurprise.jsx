import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const CASH_FLOW_SURPRISE_STAGES = [
  {
    id: 1,
    prompt:
      "Owner realises there’s no cash for rent though sales were good. What’s the issue?",
    options: [
      {
        id: "sales-low",
        text: "Sales low",
        outcome: "Sales were good, so the problem is elsewhere.",
        isCorrect: false,
      },
      {
        id: "cash-flow",
        text: "Cash flow not tracked",
        outcome: "Correct. Profit and cash flow are different.",
        isCorrect: true,
      },
      {
        id: "rent-high",
        text: "Rent too high",
        outcome: "Rent may be normal, but cash timing is the issue.",
        isCorrect: false,
      },
      {
        id: "staff-problem",
        text: "Staff problem",
        outcome: "Staffing is not the core issue here.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 2,
    prompt: "Why can good sales still create cash shortages?",
    options: [
      {
        id: "timing-gap",
        text: "Cash timing gaps between income and expenses",
        outcome: "Correct. Timing issues cause shortages.",
        isCorrect: true,
      },
      {
        id: "avoid-customers",
        text: "Avoiding customers",
        outcome: "Customers are the source of income, not the problem.",
        isCorrect: false,
      },
      {
        id: "more-profit",
        text: "More profit automatically",
        outcome: "Profit does not automatically mean cash on hand.",
        isCorrect: false,
      },
      {
        id: "lower-rent",
        text: "Lower rent fixes everything",
        outcome: "Lower rent helps but tracking is still needed.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 3,
    prompt: "What is a sign of poor cash flow tracking?",
    options: [
      {
        id: "surprise-bills",
        text: "Surprise shortages when bills are due",
        outcome: "Correct. Cash flow planning prevents surprises.",
        isCorrect: true,
      },
      {
        id: "steady-balance",
        text: "Steady cash balance always",
        outcome: "Steady balance suggests cash flow is managed.",
        isCorrect: false,
      },
      {
        id: "clear-forecast",
        text: "Clear forecast of payments",
        outcome: "Forecasting indicates good tracking.",
        isCorrect: false,
      },
      {
        id: "no-expenses",
        text: "No expenses at all",
        outcome: "Every business has expenses.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 4,
    prompt: "What is a simple way to track cash flow?",
    options: [
      {
        id: "weekly-plan",
        text: "List expected cash in and cash out each week",
        outcome: "Correct. Simple planning avoids shortages.",
        isCorrect: true,
      },
      {
        id: "memory-only",
        text: "Keep it all in memory",
        outcome: "Memory is unreliable for cash planning.",
        isCorrect: false,
      },
      {
        id: "ignore-bills",
        text: "Ignore upcoming bills",
        outcome: "Ignoring bills causes cash surprises.",
        isCorrect: false,
      },
      {
        id: "delay-records",
        text: "Record only at year-end",
        outcome: "Year-end records are too late for cash planning.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 5,
    prompt: "What is the key takeaway about cash flow surprise?",
    options: [
      {
        id: "track-flow",
        text: "Profit and cash flow are different",
        outcome: "Correct. Tracking cash flow keeps bills covered.",
        isCorrect: true,
      },
      {
        id: "sales-only",
        text: "Good sales always mean enough cash",
        outcome: "Sales can be good while cash is tight.",
        isCorrect: false,
      },
      {
        id: "optional",
        text: "Cash flow tracking is optional",
        outcome: "Tracking is essential for stability.",
        isCorrect: false,
      },
      {
        id: "rent-lower",
        text: "Lower rent is the only solution",
        outcome: "Rent changes help, but tracking is still needed.",
        isCorrect: false,
      },
    ],
  },
];

const CashFlowSurprise = () => {
  const location = useLocation();
  const gameId = "finance-business-livelihood-finance-32";
  const gameData = getGameDataById(gameId);
  const totalStages = CASH_FLOW_SURPRISE_STAGES.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const totalCoins = gameData?.coins ?? location.state?.totalCoins ?? 10;
  const coinsPerLevel = Math.max(1, Math.floor(totalCoins / totalStages));
  const totalXp = gameData?.xp ?? location.state?.totalXp ?? 20;
  const stage = CASH_FLOW_SURPRISE_STAGES[currentStageIndex];

  const handleChoice = (option) => {
    if (selectedChoice || !stage) return;
    setSelectedChoice(option);

    if (option.isCorrect) {
      setScore((prev) => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }

    if (currentStageIndex === totalStages - 1) {
      setTimeout(() => {
        setShowResult(true);
      }, 800);
    }
  };

  const handleNextStage = () => {
    if (!selectedChoice) return;
    if (currentStageIndex === totalStages - 1) {
      setShowResult(true);
    } else {
      setCurrentStageIndex((prev) => prev + 1);
    }
    setSelectedChoice(null);
  };

  const progressLabel = `${currentStageIndex + 1}/${totalStages}`;

  return (
    <GameShell
      title="Cash Flow Surprise"
      subtitle={
        showResult
          ? "Quiz complete! You now know profit and cash flow are different."
          : `Stage ${currentStageIndex + 1} of ${totalStages}`
      }
      currentLevel={currentStageIndex + 1}
      totalLevels={totalStages}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult}
      score={score}
      showConfetti={showResult && score === totalStages}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      gameId={gameId}
      gameType="finance"
      nextGamePath={location.state?.nextGamePath}
      nextGameId={location.state?.nextGameId}
      backPath={location.state?.returnPath}
    >
      <div className="space-y-8">
        {!showResult && stage && (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-2xl shadow-black/30">
              <div className="flex items-center justify-between text-sm font-semibold uppercase tracking-[0.2em] text-white/70">
                <span>Stage {progressLabel}</span>
                <span>
                  Score: {score}/{totalStages}
                </span>
              </div>

              <p className="text-white text-lg md:text-xl font-bold leading-snug mt-4">
                {stage.prompt}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                {stage.options.map((option) => {
                  const isSelected = selectedChoice?.id === option.id;
                  const baseStyle = isSelected
                    ? option.isCorrect
                      ? "from-emerald-500 to-lime-500 border-emerald-400/80"
                      : "from-rose-500 to-orange-500 border-rose-400/80"
                    : "from-blue-500 to-cyan-500 border-transparent";

                  return (
                    <button
                      key={option.id}
                      onClick={() => handleChoice(option)}
                      disabled={Boolean(selectedChoice)}
                      className={`relative rounded-2xl bg-gradient-to-r ${baseStyle} border-2 p-5 text-left text-white font-semibold transition-all transform hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60 shadow-lg`}
                    >
                      {option.text}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {selectedChoice && (
          <>
            <div className="rounded-2xl bg-white/10 border border-white/20 p-4 text-sm text-white/80">
              {selectedChoice.outcome}
            </div>
            {currentStageIndex < totalStages - 1 && (
              <div className="flex justify-end">
                <button
                  onClick={handleNextStage}
                  className="px-5 py-2 rounded-full bg-gradient-to-r from-amber-400 to-pink-500 text-white font-semibold shadow-lg hover:opacity-90"
                >
                  Next Stage
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </GameShell>
  );
};

export default CashFlowSurprise;
