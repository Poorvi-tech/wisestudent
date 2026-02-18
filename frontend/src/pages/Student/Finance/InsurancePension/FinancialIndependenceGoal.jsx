import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const FINANCIAL_INDEPENDENCE_GOAL_STAGES = [
  {
    id: 1,
    prompt: "A worker wants dignity in old age. Best path?",
    options: [
      {
        id: "build-savings",
        text: "Build gradual long-term savings",
        outcome:
          "Correct. Security supports independence.",
        isCorrect: true,
      },
      {
        id: "depend-others",
        text: "Depend on others",
        outcome:
          "Full dependence is uncertain and can strain families.",
        isCorrect: false,
      },
      {
        id: "avoid-planning",
        text: "Avoid planning",
        outcome:
          "Avoiding planning increases future risk.",
        isCorrect: false,
      },
      {
        id: "spend-today",
        text: "Spend today",
        outcome:
          "Spending everything reduces future security.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 2,
    prompt: "Why does gradual saving support independence?",
    options: [
      {
        id: "time-growth",
        text: "Time allows savings to grow steadily",
        outcome:
          "Correct. Time and consistency build security.",
        isCorrect: true,
      },
      {
        id: "no-budget",
        text: "Budgeting is not needed",
        outcome:
          "Budgeting helps you save consistently.",
        isCorrect: false,
      },
      {
        id: "guarantee-profit",
        text: "It guarantees profit",
        outcome:
          "Savings do not guarantee profits.",
        isCorrect: false,
      },
      {
        id: "spend-more",
        text: "It lets you spend more now",
        outcome:
          "Saving usually means balancing spending today.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 3,
    prompt: "What is the best habit to reach financial independence?",
    options: [
      {
        id: "random-saving",
        text: "Saving only when convenient",
        outcome:
          "Irregular saving makes it harder to build security.",
        isCorrect: false,
      },
      {
        id: "depend-family",
        text: "Rely on family support",
        outcome:
          "Reliance can be uncertain and stressful.",
        isCorrect: false,
      },
      {
        id: "consistent-saving",
        text: "Consistent saving over time",
        outcome:
          "Correct. Consistency builds long-term security.",
        isCorrect: true,
      },
      {
        id: "ignore-goals",
        text: "Ignore goals",
        outcome:
          "Goals help keep savings consistent.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 4,
    prompt: "What happens if you avoid long-term planning?",
    options: [
      {
        id: "no-impact",
        text: "No impact at all",
        outcome:
          "Avoiding planning increases future risk.",
        isCorrect: false,
      },
      {
        id: "higher-risk",
        text: "Higher dependence and financial stress later",
        outcome:
          "Correct. Planning reduces dependence.",
        isCorrect: true,
      },
      {
        id: "more-security",
        text: "More security later",
        outcome:
          "Security usually comes from planning and saving.",
        isCorrect: false,
      },
      {
        id: "instant-wealth",
        text: "Instant wealth",
        outcome:
          "Wealth requires time, saving, and discipline.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 5,
    prompt: "What is the key takeaway about financial independence?",
    options: [
      {
        id: "depend-others",
        text: "Depending on others is safest",
        outcome:
          "Dependence can be uncertain.",
        isCorrect: false,
      },
      {
        id: "spend-now",
        text: "Spend now and ignore future",
        outcome:
          "Ignoring the future increases risk.",
        isCorrect: false,
      },
      {
        id: "avoid-plan",
        text: "Avoid planning",
        outcome:
          "Planning supports independence.",
        isCorrect: false,
      },
      {
        id: "save-gradually",
        text: "Gradual long-term saving builds independence",
        outcome:
          "Correct. Security supports independence.",
        isCorrect: true,
      },
    ],
  },
];

const FinancialIndependenceGoal = () => {
  const location = useLocation();
  const gameId = "finance-insurance-pension-24";
  const gameData = getGameDataById(gameId);
  const totalStages = FINANCIAL_INDEPENDENCE_GOAL_STAGES.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const totalCoins = gameData?.coins ?? location.state?.totalCoins ?? 5;
  const coinsPerLevel = Math.max(1, Math.floor(totalCoins / totalStages));
  const totalXp = gameData?.xp ?? location.state?.totalXp ?? 10;
  const stage = FINANCIAL_INDEPENDENCE_GOAL_STAGES[currentStageIndex];

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
      title="Financial Independence Goal"
      subtitle={
        showResult
          ? "Quiz complete! You understand how savings build independence."
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

export default FinancialIndependenceGoal;
