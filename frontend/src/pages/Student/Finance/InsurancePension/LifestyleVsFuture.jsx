import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const LIFESTYLE_VS_FUTURE_STAGES = [
  {
    id: 1,
    prompt: "A person spends entire salary each month. What's wiser?",
    options: [
      {
        id: "spend-fully",
        text: "Spend fully",
        outcome:
          "Spending everything leaves no cushion for the future.",
        isCorrect: false,
      },
      {
        id: "borrow-later",
        text: "Borrow later",
        outcome:
          "Borrowing later can create debt and stress.",
        isCorrect: false,
      },
      {
        id: "balance",
        text: "Balance present and future",
        outcome:
          "Correct. Planning prevents future dependence.",
        isCorrect: true,
      },
      {
        id: "depend-family",
        text: "Depend on family",
        outcome:
          "Dependence can be uncertain and burdensome.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 2,
    prompt: "Why is balancing spending and saving important?",
    options: [
      {
        id: "no-need",
        text: "There is no need to save",
        outcome:
          "Saving builds protection against future risks.",
        isCorrect: false,
      },
      {
        id: "future-security",
        text: "It builds security for future needs",
        outcome:
          "Correct. Balancing helps handle emergencies and retirement.",
        isCorrect: true,
      },
      {
        id: "guarantee-profit",
        text: "It guarantees profits every month",
        outcome:
          "Savings do not guarantee monthly profits.",
        isCorrect: false,
      },
      {
        id: "spend-more",
        text: "It lets you spend more later without planning",
        outcome:
          "Planning is still needed even with savings.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 3,
    prompt: "What is a wise rule for monthly income?",
    options: [
      {
        id: "save-some",
        text: "Save a portion before spending the rest",
        outcome:
          "Correct. Paying yourself first builds future security.",
        isCorrect: true,
      },
      {
        id: "spend-all",
        text: "Spend all and save if anything is left",
        outcome:
          "This often leads to saving nothing.",
        isCorrect: false,
      },
      {
        id: "borrow",
        text: "Borrow for savings",
        outcome:
          "Borrowing to save increases risk.",
        isCorrect: false,
      },
      {
        id: "no-plan",
        text: "No plan is needed",
        outcome:
          "A plan helps keep finances stable.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 4,
    prompt: "What happens when lifestyle spending grows too much?",
    options: [
      {
        id: "more-security",
        text: "More security",
        outcome:
          "Higher spending without saving reduces security.",
        isCorrect: false,
      },
      {
        id: "less-savings",
        text: "Less savings and higher future risk",
        outcome:
          "Correct. Overspending erodes future safety.",
        isCorrect: true,
      },
      {
        id: "no-impact",
        text: "No impact at all",
        outcome:
          "Spending choices affect future security.",
        isCorrect: false,
      },
      {
        id: "guarantee-income",
        text: "Guarantee income later",
        outcome:
          "Spending now does not guarantee future income.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 5,
    prompt: "What is the key takeaway about lifestyle vs future?",
    options: [
      {
        id: "spend-now",
        text: "Spend everything now",
        outcome:
          "Spending all income increases future risk.",
        isCorrect: false,
      },
      {
        id: "borrow-later",
        text: "Borrow later to cover needs",
        outcome:
          "Borrowing later can create financial stress.",
        isCorrect: false,
      },
      {
        id: "ignore-future",
        text: "Ignore the future",
        outcome:
          "Ignoring the future can cause dependency.",
        isCorrect: false,
      },
      {
        id: "balance",
        text: "Balance present enjoyment with future planning",
        outcome:
          "Correct. Balance prevents future dependence.",
        isCorrect: true,
      },
    ],
  },
];

const LifestyleVsFuture = () => {
  const location = useLocation();
  const gameId = "finance-insurance-pension-20";
  const gameData = getGameDataById(gameId);
  const totalStages = LIFESTYLE_VS_FUTURE_STAGES.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const totalCoins = gameData?.coins ?? location.state?.totalCoins ?? 5;
  const coinsPerLevel = Math.max(1, Math.floor(totalCoins / totalStages));
  const totalXp = gameData?.xp ?? location.state?.totalXp ?? 10;
  const stage = LIFESTYLE_VS_FUTURE_STAGES[currentStageIndex];

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
      title="Lifestyle vs Future"
      subtitle={
        showResult
          ? "Quiz complete! You understand how planning prevents dependence."
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

export default LifestyleVsFuture;
