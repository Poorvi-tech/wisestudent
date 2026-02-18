import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const INCOME_VS_LONGEVITY_STAGES = [
  {
    id: 1,
    prompt:
      "A person expects pension from employer but has no written plan. Safer action?",
    options: [
      {
        id: "assume-employer",
        text: "Assume employer will handle",
        outcome:
          "Assumptions can fail. Always confirm details in writing.",
        isCorrect: false,
      },
      {
        id: "confirm-backup",
        text: "Confirm and create personal backup savings",
        outcome:
          "Correct. Personal planning reduces uncertainty.",
        isCorrect: true,
      },
      {
        id: "ignore",
        text: "Ignore",
        outcome:
          "Ignoring plans increases risk later.",
        isCorrect: false,
      },
      {
        id: "borrow-later",
        text: "Borrow later",
        outcome:
          "Borrowing later can create stress and debt.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 2,
    prompt: "Why is written confirmation of pension benefits important?",
    options: [
      {
        id: "clarity",
        text: "It clarifies eligibility, amount, and timing",
        outcome:
          "Correct. Written details reduce confusion and surprises.",
        isCorrect: true,
      },
      {
        id: "no-need",
        text: "It is not needed at all",
        outcome:
          "Without documentation, plans can be uncertain.",
        isCorrect: false,
      },
      {
        id: "guarantee-profit",
        text: "It guarantees high profits",
        outcome:
          "Pensions are not about guaranteed profits.",
        isCorrect: false,
      },
      {
        id: "replace-savings",
        text: "It replaces the need for savings",
        outcome:
          "Backup savings are still important.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 3,
    prompt: "What is a good backup plan if pension details are unclear?",
    options: [
      {
        id: "spend-now",
        text: "Spend now and hope later",
        outcome:
          "Spending without planning increases future risk.",
        isCorrect: false,
      },
      {
        id: "depend-others",
        text: "Depend fully on others",
        outcome:
          "Dependence is uncertain and risky.",
        isCorrect: false,
      },
      {
        id: "ignore-benefits",
        text: "Ignore benefits completely",
        outcome:
          "Benefits should be verified and included in planning.",
        isCorrect: false,
      },
      {
        id: "build-savings",
        text: "Build personal savings alongside retirement benefits",
        outcome:
          "Correct. Savings reduce uncertainty and risk.",
        isCorrect: true,
      },
    ],
  },
  {
    id: 4,
    prompt: "Which action reduces longevity risk the most?",
    options: [
      {
        id: "assume",
        text: "Assume benefits will cover everything",
        outcome:
          "Assumptions can leave gaps in retirement.",
        isCorrect: false,
      },
      {
        id: "borrow",
        text: "Plan to borrow later",
        outcome:
          "Borrowing later can create long-term stress.",
        isCorrect: false,
      },
      {
        id: "confirm-plan",
        text: "Confirm employer benefits and save independently",
        outcome:
          "Correct. Combining both reduces uncertainty.",
        isCorrect: true,
      },
      {
        id: "no-plan",
        text: "No plan is needed",
        outcome:
          "Planning reduces risks and uncertainty.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 5,
    prompt: "What is the key takeaway about income vs longevity?",
    options: [
      {
        id: "confirm-backup",
        text: "Confirm benefits and build backup savings",
        outcome:
          "Correct. Personal planning reduces uncertainty.",
        isCorrect: true,
      },
      {
        id: "assume",
        text: "Assume employer handles everything",
        outcome:
          "Assumptions can lead to gaps.",
        isCorrect: false,
      },
      {
        id: "ignore",
        text: "Ignore retirement planning",
        outcome:
          "Ignoring planning increases risk.",
        isCorrect: false,
      },
      {
        id: "borrow",
        text: "Borrow later to cover needs",
        outcome:
          "Borrowing later can add debt and stress.",
        isCorrect: false,
      },
    ],
  },
];

const IncomeVsLongevity = () => {
  const location = useLocation();
  const gameId = "finance-insurance-pension-23";
  const gameData = getGameDataById(gameId);
  const totalStages = INCOME_VS_LONGEVITY_STAGES.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const totalCoins = gameData?.coins ?? location.state?.totalCoins ?? 5;
  const coinsPerLevel = Math.max(1, Math.floor(totalCoins / totalStages));
  const totalXp = gameData?.xp ?? location.state?.totalXp ?? 10;
  const stage = INCOME_VS_LONGEVITY_STAGES[currentStageIndex];

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
      title="Income vs Longevity"
      subtitle={
        showResult
          ? "Quiz complete! You understand how planning reduces uncertainty."
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

export default IncomeVsLongevity;
