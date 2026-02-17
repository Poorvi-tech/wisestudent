import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const SEASONAL_INCOME_PLANNING_STAGES = [
  {
    id: 1,
    prompt: "A business earns high during festival season only. What should owner do?",
    options: [
      {
        id: "spend-all",
        text: "Spend all during season",
        outcome: "Spending all creates shortages in slow months.",
        isCorrect: false,
      },
      {
        id: "plan-reserves",
        text: "Plan reserves for slow months",
        outcome: "Correct. Stability needs seasonal planning.",
        isCorrect: true,
      },
      {
        id: "borrow-later",
        text: "Borrow later",
        outcome: "Borrowing can be costly if planning is weak.",
        isCorrect: false,
      },
      {
        id: "ignore-planning",
        text: "Ignore planning",
        outcome: "Ignoring planning increases risk.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 2,
    prompt: "Why should seasonal businesses build reserves?",
    options: [
      {
        id: "cover-costs",
        text: "To cover expenses during low-income months",
        outcome: "Correct. Reserves keep operations stable.",
        isCorrect: true,
      },
      {
        id: "avoid-customers",
        text: "To avoid customers",
        outcome: "Reserves are for stability, not avoidance.",
        isCorrect: false,
      },
      {
        id: "increase-prices",
        text: "To increase prices automatically",
        outcome: "Prices depend on market and strategy.",
        isCorrect: false,
      },
      {
        id: "skip-records",
        text: "To skip records",
        outcome: "Records are still important.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 3,
    prompt: "What is a risk of spending all income during peak season?",
    options: [
      {
        id: "cash-shortage",
        text: "Cash shortages in off-season",
        outcome: "Correct. Lack of reserves creates stress later.",
        isCorrect: true,
      },
      {
        id: "higher-loyalty",
        text: "Higher loyalty automatically",
        outcome: "Loyalty depends on service, not spending.",
        isCorrect: false,
      },
      {
        id: "faster-growth",
        text: "Faster growth",
        outcome: "Growth needs planning, not spending all earnings.",
        isCorrect: false,
      },
      {
        id: "no-risk",
        text: "No risk",
        outcome: "There is real risk without reserves.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 4,
    prompt: "What is a simple step for seasonal planning?",
    options: [
      {
        id: "set-aside",
        text: "Set aside a fixed portion of peak-season profit",
        outcome: "Correct. Regular saving builds a buffer.",
        isCorrect: true,
      },
      {
        id: "spend-all",
        text: "Spend extra during peak months",
        outcome: "Extra spending reduces stability later.",
        isCorrect: false,
      },
      {
        id: "ignore-offseason",
        text: "Ignore off-season expenses",
        outcome: "Off-season expenses still need coverage.",
        isCorrect: false,
      },
      {
        id: "delay-records",
        text: "Record only at year-end",
        outcome: "Year-end records miss seasonal planning needs.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 5,
    prompt: "What is the key takeaway about seasonal income planning?",
    options: [
      {
        id: "stability",
        text: "Stability needs seasonal planning",
        outcome: "Correct. Reserves smooth income ups and downs.",
        isCorrect: true,
      },
      {
        id: "optional",
        text: "Planning is optional",
        outcome: "Planning is essential for stability.",
        isCorrect: false,
      },
      {
        id: "no-impact",
        text: "Planning makes no impact",
        outcome: "Planning reduces risk and stress.",
        isCorrect: false,
      },
      {
        id: "borrow-only",
        text: "Borrowing is the best solution",
        outcome: "Reserves are safer than debt.",
        isCorrect: false,
      },
    ],
  },
];

const SeasonalIncomePlanning = () => {
  const location = useLocation();
  const gameId = "finance-business-livelihood-finance-39";
  const gameData = getGameDataById(gameId);
  const totalStages = SEASONAL_INCOME_PLANNING_STAGES.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const totalCoins = gameData?.coins ?? location.state?.totalCoins ?? 10;
  const coinsPerLevel = Math.max(1, Math.floor(totalCoins / totalStages));
  const totalXp = gameData?.xp ?? location.state?.totalXp ?? 20;
  const stage = SEASONAL_INCOME_PLANNING_STAGES[currentStageIndex];

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
      title="Seasonal Income Planning"
      subtitle={
        showResult
          ? "Quiz complete! You now know why seasonal planning keeps business stable."
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

export default SeasonalIncomePlanning;
