import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const SAVING_HABIT_CHOICE_STAGES = [
  {
    id: 1,
    prompt: "A worker gets small yearly bonus. Best use for long-term security?",
    options: [
      {
        id: "spend-fully",
        text: "Spend fully",
        outcome:
          "Spending everything leaves no benefit for the future.",
        isCorrect: false,
      },
      {
        id: "save-part",
        text: "Save part for future",
        outcome:
          "Correct. Occasional savings strengthen future security.",
        isCorrect: true,
      },
      {
        id: "lend-risky",
        text: "Lend to risky friend",
        outcome:
          "Risky lending can lose your bonus entirely.",
        isCorrect: false,
      },
      {
        id: "buy-luxury",
        text: "Buy luxury",
        outcome:
          "Luxury spending does not build long-term security.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 2,
    prompt: "Why is saving part of a bonus a good habit?",
    options: [
      {
        id: "future-buffer",
        text: "It builds a buffer for future needs",
        outcome:
          "Correct. Bonuses can strengthen emergency or retirement funds.",
        isCorrect: true,
      },
      {
        id: "no-value",
        text: "Bonuses have no value for savings",
        outcome:
          "Bonuses can make a real difference over time.",
        isCorrect: false,
      },
      {
        id: "spend-all",
        text: "Bonuses must always be spent",
        outcome:
          "Spending all removes the chance to build security.",
        isCorrect: false,
      },
      {
        id: "avoid-planning",
        text: "It removes the need for planning",
        outcome:
          "Planning is still important even with bonuses.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 3,
    prompt: "What is a wise split for a small bonus?",
    options: [
      {
        id: "save-some",
        text: "Save some, spend some",
        outcome:
          "Correct. Balance present enjoyment with future security.",
        isCorrect: true,
      },
      {
        id: "spend-all",
        text: "Spend all immediately",
        outcome:
          "Spending all leaves nothing for future goals.",
        isCorrect: false,
      },
      {
        id: "risky-loan",
        text: "Lend it all to a risky friend",
        outcome:
          "Risky loans can result in total loss.",
        isCorrect: false,
      },
      {
        id: "ignore",
        text: "Ignore the bonus",
        outcome:
          "Using it wisely can improve security.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 4,
    prompt: "Where can a saved bonus be most useful?",
    options: [
      {
        id: "emergency-fund",
        text: "Emergency or retirement fund",
        outcome:
          "Correct. These funds protect your future.",
        isCorrect: true,
      },
      {
        id: "luxury",
        text: "Luxury shopping only",
        outcome:
          "Luxury spending does not improve security.",
        isCorrect: false,
      },
      {
        id: "random-risk",
        text: "Random risky bets",
        outcome:
          "Risky bets can wipe out the bonus.",
        isCorrect: false,
      },
      {
        id: "short-term-spend",
        text: "Short-term consumption only",
        outcome:
          "Short-term spending misses long-term benefits.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 5,
    prompt: "What is the main takeaway from saving habit choice?",
    options: [
      {
        id: "save-part",
        text: "Saving part of windfalls builds security",
        outcome:
          "Correct. Occasional savings strengthen future security.",
        isCorrect: true,
      },
      {
        id: "spend-all",
        text: "Spend all windfalls",
        outcome:
          "Spending all removes future benefits.",
        isCorrect: false,
      },
      {
        id: "risky-lend",
        text: "Lend windfalls to risky people",
        outcome:
          "Risky lending can create losses.",
        isCorrect: false,
      },
      {
        id: "no-plan",
        text: "No plan is needed",
        outcome:
          "Planning helps convert bonuses into security.",
        isCorrect: false,
      },
    ],
  },
];

const SavingHabitChoice = () => {
  const location = useLocation();
  const gameId = "finance-insurance-pension-22";
  const gameData = getGameDataById(gameId);
  const totalStages = SAVING_HABIT_CHOICE_STAGES.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const totalCoins = gameData?.coins ?? location.state?.totalCoins ?? 5;
  const coinsPerLevel = Math.max(1, Math.floor(totalCoins / totalStages));
  const totalXp = gameData?.xp ?? location.state?.totalXp ?? 10;
  const stage = SAVING_HABIT_CHOICE_STAGES[currentStageIndex];

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
      title="Saving Habit Choice"
      subtitle={
        showResult
          ? "Quiz complete! You understand how bonuses can build security."
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

export default SavingHabitChoice;
