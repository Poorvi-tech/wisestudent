import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const WORK_FOREVER_MYTH_STAGES = [
  {
    id: 1,
    prompt: "A worker assumes income will continue forever. What's realistic?",
    options: [
      {
        id: "income-never-stops",
        text: "Income never stops",
        outcome:
          "Income can change with job loss, illness, or retirement.",
        isCorrect: false,
      },
      {
        id: "ability-reduces",
        text: "Work ability reduces with age",
        outcome:
          "Correct. Retirement planning protects independence.",
        isCorrect: true,
      },
      {
        id: "children-pay",
        text: "Children will always pay",
        outcome:
          "Depending on children is uncertain and not a plan.",
        isCorrect: false,
      },
      {
        id: "savings-unnecessary",
        text: "Savings unnecessary",
        outcome:
          "Savings are essential for long-term security.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 2,
    prompt: "Why is planning for retirement important?",
    options: [
      {
        id: "no-need",
        text: "You will earn the same forever",
        outcome:
          "Income often changes with age or career shifts.",
        isCorrect: false,
      },
      {
        id: "independence",
        text: "It helps maintain independence later in life",
        outcome:
          "Correct. Planning helps you live on your own terms.",
        isCorrect: true,
      },
      {
        id: "avoid-budget",
        text: "It removes the need for budgeting",
        outcome:
          "Budgeting remains important even after retirement.",
        isCorrect: false,
      },
      {
        id: "guarantee-profit",
        text: "It guarantees investment profit",
        outcome:
          "No investment can guarantee profits.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 3,
    prompt: "What can happen to income as people age?",
    options: [
      {
        id: "always-increase",
        text: "It always increases",
        outcome:
          "Income can plateau or decrease with reduced work.",
        isCorrect: false,
      },
      {
        id: "may-reduce",
        text: "It may reduce as work capacity changes",
        outcome:
          "Correct. Reduced work can lower income.",
        isCorrect: true,
      },
      {
        id: "never-change",
        text: "It never changes",
        outcome:
          "Income can change due to health or job changes.",
        isCorrect: false,
      },
      {
        id: "no-planning",
        text: "No need to plan for changes",
        outcome:
          "Planning helps handle income changes.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 4,
    prompt: "Which is a realistic retirement strategy?",
    options: [
      {
        id: "depend-children",
        text: "Depend only on children to pay expenses",
        outcome:
          "Relying on others is uncertain and risky.",
        isCorrect: false,
      },
      {
        id: "save-and-plan",
        text: "Save regularly and plan early",
        outcome:
          "Correct. Early planning builds security.",
        isCorrect: true,
      },
      {
        id: "ignore-planning",
        text: "Ignore planning until retirement",
        outcome:
          "Late planning can leave gaps.",
        isCorrect: false,
      },
      {
        id: "spend-all",
        text: "Spend all income now",
        outcome:
          "Spending everything leaves no cushion.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 5,
    prompt: "What is the key takeaway from the work-forever myth?",
    options: [
      {
        id: "income-permanent",
        text: "Income is permanent",
        outcome:
          "Income is not guaranteed forever.",
        isCorrect: false,
      },
      {
        id: "plan-independence",
        text: "Plan early to protect independence",
        outcome:
          "Correct. Retirement planning supports independence.",
        isCorrect: true,
      },
      {
        id: "savings-useless",
        text: "Savings are useless",
        outcome:
          "Savings are essential for long-term stability.",
        isCorrect: false,
      },
      {
        id: "wait-crisis",
        text: "Wait until a crisis to plan",
        outcome:
          "Waiting increases risk.",
        isCorrect: false,
      },
    ],
  },
];

const WorkForeverMyth = () => {
  const location = useLocation();
  const gameId = "finance-insurance-pension-13";
  const gameData = getGameDataById(gameId);
  const totalStages = WORK_FOREVER_MYTH_STAGES.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const totalCoins = gameData?.coins ?? location.state?.totalCoins ?? 5;
  const coinsPerLevel = Math.max(1, Math.floor(totalCoins / totalStages));
  const totalXp = gameData?.xp ?? location.state?.totalXp ?? 10;
  const stage = WORK_FOREVER_MYTH_STAGES[currentStageIndex];

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
      title="Work Forever Myth"
      subtitle={
        showResult
          ? "Quiz complete! You understand why retirement planning matters."
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

export default WorkForeverMyth;
