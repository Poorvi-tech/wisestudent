import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const RETIREMENT_REALITY_STAGES = [
  {
    id: 1,
    prompt: "A retired person has no savings. What could have helped earlier?",
    options: [
      {
        id: "luck",
        text: "Luck",
        outcome:
          "Relying on luck is not a financial plan.",
        isCorrect: false,
      },
      {
        id: "long-term-planning",
        text: "Long-term financial planning",
        outcome:
          "Correct. Preparation supports dignity in old age.",
        isCorrect: true,
      },
      {
        id: "more-spending",
        text: "More spending",
        outcome:
          "Higher spending without saving reduces future security.",
        isCorrect: false,
      },
      {
        id: "ignore-future",
        text: "Ignoring future",
        outcome:
          "Ignoring the future increases risk later.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 2,
    prompt: "Why is retirement planning important?",
    options: [
      {
        id: "income-forever",
        text: "Income continues forever",
        outcome:
          "Income can stop or reduce after retirement.",
        isCorrect: false,
      },
      {
        id: "dignity",
        text: "It helps maintain dignity and independence",
        outcome:
          "Correct. Planning reduces reliance on others.",
        isCorrect: true,
      },
      {
        id: "no-expenses",
        text: "There are no expenses in old age",
        outcome:
          "Healthcare and living costs often rise with age.",
        isCorrect: false,
      },
      {
        id: "optional",
        text: "Planning is optional",
        outcome:
          "Planning improves outcomes and security.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 3,
    prompt: "What is a realistic way to prepare for retirement?",
    options: [
      {
        id: "save-early",
        text: "Start saving early and consistently",
        outcome:
          "Correct. Early saving builds long-term security.",
        isCorrect: true,
      },
      {
        id: "spend-now",
        text: "Spend everything now",
        outcome:
          "Spending all income leaves no cushion later.",
        isCorrect: false,
      },
      {
        id: "depend-others",
        text: "Depend fully on others",
        outcome:
          "Full dependence is uncertain.",
        isCorrect: false,
      },
      {
        id: "ignore-plan",
        text: "Ignore planning until retirement",
        outcome:
          "Late planning can create gaps.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 4,
    prompt: "What often happens without retirement savings?",
    options: [
      {
        id: "stable-income",
        text: "Stable income without worry",
        outcome:
          "Without savings, income can become uncertain.",
        isCorrect: false,
      },
      {
        id: "financial-stress",
        text: "Financial stress and dependence",
        outcome:
          "Correct. Savings reduce stress in later life.",
        isCorrect: true,
      },
      {
        id: "automatic-support",
        text: "Automatic support always appears",
        outcome:
          "Support is not guaranteed without planning.",
        isCorrect: false,
      },
      {
        id: "no-impact",
        text: "No impact",
        outcome:
          "Lack of savings has serious impact.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 5,
    prompt: "What is the key takeaway about retirement reality?",
    options: [
      {
        id: "prepare",
        text: "Prepare early to support dignity in old age",
        outcome:
          "Correct. Preparation supports dignity in old age.",
        isCorrect: true,
      },
      {
        id: "ignore",
        text: "Ignore the future",
        outcome:
          "Ignoring the future increases risk.",
        isCorrect: false,
      },
      {
        id: "spend",
        text: "Spend more to feel secure",
        outcome:
          "Spending without saving reduces security.",
        isCorrect: false,
      },
      {
        id: "luck",
        text: "Rely on luck",
        outcome:
          "Luck is not a plan.",
        isCorrect: false,
      },
    ],
  },
];

const RetirementReality = () => {
  const location = useLocation();
  const gameId = "finance-insurance-pension-21";
  const gameData = getGameDataById(gameId);
  const totalStages = RETIREMENT_REALITY_STAGES.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const totalCoins = gameData?.coins ?? location.state?.totalCoins ?? 5;
  const coinsPerLevel = Math.max(1, Math.floor(totalCoins / totalStages));
  const totalXp = gameData?.xp ?? location.state?.totalXp ?? 10;
  const stage = RETIREMENT_REALITY_STAGES[currentStageIndex];

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
      title="Retirement Reality"
      subtitle={
        showResult
          ? "Quiz complete! You understand why early preparation matters."
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

export default RetirementReality;
