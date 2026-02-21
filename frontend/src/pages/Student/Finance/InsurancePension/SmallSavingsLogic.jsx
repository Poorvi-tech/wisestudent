import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const SMALL_SAVINGS_LOGIC_STAGES = [
  {
    id: 1,
    prompt: "A worker says ₹500 monthly is useless. What's true?",
    options: [
      {
        id: "small-useless",
        text: "Small savings useless",
        outcome:
          "Even small amounts grow with consistency.",
        isCorrect: false,
      },
      {
        id: "only-big",
        text: "Only big investments matter",
        outcome:
          "Large investments help, but consistent saving is powerful too.",
        isCorrect: false,
      },
      {
        id: "consistent-builds",
        text: "Consistent saving builds security",
        outcome:
          "Correct. Discipline matters more than size.",
        isCorrect: true,
      },
      {
        id: "optional",
        text: "Saving optional",
        outcome:
          "Savings are important for stability and emergencies.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 2,
    prompt: "Why do small, regular savings matter?",
    options: [
      {
        id: "compound",
        text: "They build habits and allow compounding over time",
        outcome:
          "Correct. Time and consistency create growth.",
        isCorrect: true,
      },
      {
        id: "no-effect",
        text: "They have no effect",
        outcome:
          "Regular saving does have an effect over time.",
        isCorrect: false,
      },
      {
        id: "only-big-works",
        text: "Only large deposits work",
        outcome:
          "Smaller deposits still add up when consistent.",
        isCorrect: false,
      },
      {
        id: "skip-budget",
        text: "They remove the need for budgeting",
        outcome:
          "Budgeting is still important even with savings.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 3,
    prompt: "What is the best response to '₹500 is too small'?",
    options: [
      {
        id: "stop-saving",
        text: "Stop saving until you can save more",
        outcome:
          "Waiting delays progress.",
        isCorrect: false,
      },
      {
        id: "start-now",
        text: "Start now and increase gradually",
        outcome:
          "Correct. Starting small builds a saving habit.",
        isCorrect: true,
      },
      {
        id: "borrow-money",
        text: "Borrow money to save more",
        outcome:
          "Borrowing to save adds risk and interest.",
        isCorrect: false,
      },
      {
        id: "invest-only",
        text: "Only invest in high-risk assets",
        outcome:
          "High risk is not always suitable for everyone.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 4,
    prompt: "Which habit makes small savings effective?",
    options: [
      {
        id: "random",
        text: "Saving only when you feel like it",
        outcome:
          "Irregular saving makes growth slower.",
        isCorrect: false,
      },
      {
        id: "spend-all",
        text: "Spending all income first",
        outcome:
          "Saving should come before discretionary spending.",
        isCorrect: false,
      },
      {
        id: "consistency",
        text: "Saving consistently every month",
        outcome:
          "Correct. Consistency is the key.",
        isCorrect: true,
      },
      {
        id: "ignore-goals",
        text: "Ignoring goals",
        outcome:
          "Goals help keep saving consistent.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 5,
    prompt: "What is the main takeaway about small savings?",
    options: [
      {
        id: "size-only",
        text: "Only size matters",
        outcome:
          "Both size and consistency matter, but discipline is key.",
        isCorrect: false,
      },
      {
        id: "no-need",
        text: "Small savings are pointless",
        outcome:
          "Small savings add up over time.",
        isCorrect: false,
      },
      {
        id: "optional",
        text: "Saving is optional",
        outcome:
          "Saving helps build financial resilience.",
        isCorrect: false,
      },
      {
        id: "discipline",
        text: "Discipline matters more than size",
        outcome:
          "Correct. Consistency builds security over time.",
        isCorrect: true,
      },
    ],
  },
];

const SmallSavingsLogic = () => {
  const location = useLocation();
  const gameId = "finance-insurance-pension-25";
  const gameData = getGameDataById(gameId);
  const totalStages = SMALL_SAVINGS_LOGIC_STAGES.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const totalCoins = gameData?.coins ?? location.state?.totalCoins ?? 5;
  const coinsPerLevel = Math.max(1, Math.floor(totalCoins / totalStages));
  const totalXp = gameData?.xp ?? location.state?.totalXp ?? 10;
  const stage = SMALL_SAVINGS_LOGIC_STAGES[currentStageIndex];

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
      title="Small Savings Logic"
      subtitle={
        showResult
          ? "Quiz complete! You understand the power of consistent saving."
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

export default SmallSavingsLogic;
