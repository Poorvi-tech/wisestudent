import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const EARLY_SAVING_ADVANTAGE_STAGES = [
  {
    id: 1,
    prompt: "Two people start saving at 25 and 40. Who benefits more long-term?",
    options: [
      {
        id: "both-equal",
        text: "Both equal",
        outcome:
          "Starting earlier gives more time to grow savings.",
        isCorrect: false,
      },
      {
        id: "early-saver",
        text: "Early saver",
        outcome:
          "Correct. Time strengthens savings.",
        isCorrect: true,
      },
      {
        id: "late-saver",
        text: "Late saver",
        outcome:
          "Starting late usually means less time for growth.",
        isCorrect: false,
      },
      {
        id: "depends-luck",
        text: "Depends on luck",
        outcome:
          "Time and consistency matter more than luck.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 2,
    prompt: "Why does starting early help savings grow?",
    options: [
      {
        id: "more-time",
        text: "More time for growth and compounding",
        outcome:
          "Correct. Time increases the effect of compounding.",
        isCorrect: true,
      },
      {
        id: "no-need-budget",
        text: "No need to budget if you start early",
        outcome:
          "Budgeting is still important at any age.",
        isCorrect: false,
      },
      {
        id: "guarantee-profit",
        text: "It guarantees profit every year",
        outcome:
          "No investment guarantees profit every year.",
        isCorrect: false,
      },
      {
        id: "skip-savings",
        text: "You can skip saving later",
        outcome:
          "Consistent saving is still important.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 3,
    prompt: "What is the biggest advantage of saving at 25 instead of 40?",
    options: [
      {
        id: "shorter-time",
        text: "Shorter time to grow",
        outcome:
          "Starting early gives more, not less, time.",
        isCorrect: false,
      },
      {
        id: "longer-horizon",
        text: "Longer time horizon for growth",
        outcome:
          "Correct. More years means more growth potential.",
        isCorrect: true,
      },
      {
        id: "no-risk",
        text: "No risk at all",
        outcome:
          "All investing carries some risk.",
        isCorrect: false,
      },
      {
        id: "free-money",
        text: "Free money from the bank",
        outcome:
          "Savings grow from contributions and returns.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 4,
    prompt: "If you start saving late, what usually needs to happen?",
    options: [
      {
        id: "save-more",
        text: "Save more each month to catch up",
        outcome:
          "Correct. Less time often means higher monthly savings.",
        isCorrect: true,
      },
      {
        id: "save-less",
        text: "Save less each month",
        outcome:
          "Saving less makes it harder to reach goals.",
        isCorrect: false,
      },
      {
        id: "no-change",
        text: "No change needed",
        outcome:
          "Late starts often require adjustments.",
        isCorrect: false,
      },
      {
        id: "skip-plan",
        text: "Skip retirement planning",
        outcome:
          "Planning remains important regardless of age.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 5,
    prompt: "What is the main takeaway about early saving?",
    options: [
      {
        id: "time-helps",
        text: "Time helps savings grow",
        outcome:
          "Correct. Starting early gives savings more time to build.",
        isCorrect: true,
      },
      {
        id: "luck-matters",
        text: "Luck matters most",
        outcome:
          "Consistency matters more than luck.",
        isCorrect: false,
      },
      {
        id: "late-better",
        text: "Starting late is better",
        outcome:
          "Starting late generally reduces growth time.",
        isCorrect: false,
      },
      {
        id: "no-plan",
        text: "No planning is needed",
        outcome:
          "Planning improves outcomes.",
        isCorrect: false,
      },
    ],
  },
];

const EarlySavingAdvantage = () => {
  const location = useLocation();
  const gameId = "finance-insurance-pension-15";
  const gameData = getGameDataById(gameId);
  const totalStages = EARLY_SAVING_ADVANTAGE_STAGES.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const totalCoins = gameData?.coins ?? location.state?.totalCoins ?? 5;
  const coinsPerLevel = Math.max(1, Math.floor(totalCoins / totalStages));
  const totalXp = gameData?.xp ?? location.state?.totalXp ?? 10;
  const stage = EARLY_SAVING_ADVANTAGE_STAGES[currentStageIndex];

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
      title="Early Saving Advantage"
      subtitle={
        showResult
          ? "Quiz complete! You understand why starting early helps."
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

export default EarlySavingAdvantage;
