import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const DAILY_EXPENSE_TRACKING_STAGES = [
  {
    id: 1,
    prompt: "A vendor never notes daily spending. What risk arises?",
    options: [
      {
        id: "extra-profit",
        text: "Extra profit",
        outcome: "Not tracking spending does not create profit.",
        isCorrect: false,
      },
      {
        id: "less-tax",
        text: "Less tax",
        outcome: "Taxes depend on records, not ignoring spending.",
        isCorrect: false,
      },
      {
        id: "unknown-losses",
        text: "Unknown losses and leakages",
        outcome: "Correct. Tracking prevents silent losses.",
        isCorrect: true,
      },
      {
        id: "faster-growth",
        text: "Faster growth",
        outcome: "Growth needs visibility into costs and profits.",
        isCorrect: false,
      }
    ],
  },
  {
    id: 2,
    prompt: "Why is daily expense tracking important?",
    options: [
      {
        id: "see-profit",
        text: "It shows real profit each day",
        outcome: "Correct. Daily tracking clarifies true earnings.",
        isCorrect: true,
      },
      {
        id: "avoid-customers",
        text: "It helps avoid customers",
        outcome: "Tracking is about managing money, not avoiding customers.",
        isCorrect: false,
      },
      {
        id: "increase-rent",
        text: "It increases rent",
        outcome: "Rent is unrelated to tracking.",
        isCorrect: false,
      },
      {
        id: "replace-sales",
        text: "It replaces sales",
        outcome: "Tracking does not replace selling.",
        isCorrect: false,
      }
    ],
  },
  {
    id: 3,
    prompt: "Which is an example of a leakage without tracking?",
    options: [
      {
        id: "recorded-fees",
        text: "Recorded supplier payments",
        outcome: "Recorded payments are not leakages.",
        isCorrect: false,
      },
      {
        id: "small-snacks",
        text: "Small daily cash uses that are forgotten",
        outcome: "Correct. Small leaks add up if ignored.",
        isCorrect: true,
      },
      {
        id: "billed-sales",
        text: "Billed customer sales",
        outcome: "Billed sales are income, not leakage.",
        isCorrect: false,
      },
      {
        id: "planned-budget",
        text: "Planned monthly budget",
        outcome: "Planning reduces leakages.",
        isCorrect: false,
      }
    ],
  },
  {
    id: 4,
    prompt: "What is a simple way to start tracking expenses?",
    options: [
      {
        id: "memory-only",
        text: "Keep everything in memory",
        outcome: "Memory leads to gaps and errors.",
        isCorrect: false,
      },
      {
        id: "ignore-small",
        text: "Ignore small expenses",
        outcome: "Small expenses are often the biggest leaks.",
        isCorrect: false,
      },
      {
        id: "track-yearly",
        text: "Track only once a year",
        outcome: "Yearly tracking misses daily issues.",
        isCorrect: false,
      },
      {
        id: "small-notebook",
        text: "Write daily expenses in a small notebook",
        outcome: "Correct. Simple records create clarity.",
        isCorrect: true,
      }
    ],
  },
  {
    id: 5,
    prompt: "What is the key takeaway about daily expense tracking?",
    options: [
      {
        id: "optional",
        text: "Tracking is optional for small vendors",
        outcome: "Small vendors benefit the most from clarity.",
        isCorrect: false,
      },
      {
        id: "stop-leaks",
        text: "Tracking prevents silent losses",
        outcome: "Correct. Consistent tracking protects profits.",
        isCorrect: true,
      },
      {
        id: "no-need",
        text: "Expenses do not affect profit",
        outcome: "Expenses directly affect profit.",
        isCorrect: false,
      },
      {
        id: "only-tax",
        text: "Tracking is only for taxes",
        outcome: "It helps with taxes and daily decisions.",
        isCorrect: false,
      }
    ],
  },
];

const DailyExpenseTracking = () => {
  const location = useLocation();
  const gameId = "finance-business-livelihood-finance-13";
  const gameData = getGameDataById(gameId);
  const totalStages = DAILY_EXPENSE_TRACKING_STAGES.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const totalCoins = gameData?.coins ?? location.state?.totalCoins ?? 5;
  const coinsPerLevel = Math.max(1, Math.floor(totalCoins / totalStages));
  const totalXp = gameData?.xp ?? location.state?.totalXp ?? 10;
  const stage = DAILY_EXPENSE_TRACKING_STAGES[currentStageIndex];

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
      title="Daily Expense Tracking"
      subtitle={
        showResult
          ? "Quiz complete! You now know how tracking prevents silent losses."
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

export default DailyExpenseTracking;
