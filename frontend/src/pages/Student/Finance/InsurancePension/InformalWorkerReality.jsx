import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const INFORMAL_WORKER_REALITY_STAGES = [
  {
    id: 1,
    prompt: "A daily wage worker has no retirement plan. Main risk?",
    options: [
      {
        id: "no-problem",
        text: "No problem",
        outcome:
          "Without a plan, later-life expenses can become difficult.",
        isCorrect: false,
      },
      {
        id: "financial-stress",
        text: "Financial stress in later life",
        outcome:
          "Correct. Informal workers need extra planning.",
        isCorrect: true,
      },
      {
        id: "higher-income",
        text: "Higher income later",
        outcome:
          "Future income is uncertain without a plan.",
        isCorrect: false,
      },
      {
        id: "free-pension",
        text: "Free pension guaranteed",
        outcome:
          "A guaranteed free pension is unlikely without enrollment.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 2,
    prompt: "Why is retirement planning harder for informal workers?",
    options: [
      {
        id: "steady-benefits",
        text: "They already have stable pensions",
        outcome:
          "Informal work often lacks employer pensions.",
        isCorrect: false,
      },
      {
        id: "irregular-income",
        text: "Income can be irregular and unpredictable",
        outcome:
          "Correct. Irregular income makes planning tougher.",
        isCorrect: true,
      },
      {
        id: "no-costs",
        text: "Retirement has no costs",
        outcome:
          "Living and healthcare costs continue in retirement.",
        isCorrect: false,
      },
      {
        id: "automatic-plan",
        text: "They are automatically covered",
        outcome:
          "Automatic coverage is uncommon in informal work.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 3,
    prompt: "What is a helpful step for informal workers?",
    options: [
      {
        id: "start-small",
        text: "Start small savings consistently",
        outcome:
          "Correct. Consistency builds long-term security.",
        isCorrect: true,
      },
      {
        id: "skip-planning",
        text: "Skip planning until old age",
        outcome:
          "Delaying planning increases risk.",
        isCorrect: false,
      },
      {
        id: "borrow-later",
        text: "Borrow later for retirement",
        outcome:
          "Borrowing can create debt in old age.",
        isCorrect: false,
      },
      {
        id: "depend-others",
        text: "Depend fully on others",
        outcome:
          "Full dependence is risky and uncertain.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 4,
    prompt: "Which habit best supports informal workers’ security?",
    options: [
      {
        id: "regular-saving",
        text: "Regular saving and budget tracking",
        outcome:
          "Correct. Small, steady habits build stability.",
        isCorrect: true,
      },
      {
        id: "spend-now",
        text: "Spend all income immediately",
        outcome:
          "Spending everything leaves no safety net.",
        isCorrect: false,
      },
      {
        id: "only-loans",
        text: "Use loans for all needs",
        outcome:
          "Loans can add debt and stress.",
        isCorrect: false,
      },
      {
        id: "ignore-risk",
        text: "Ignore future risks",
        outcome:
          "Ignoring risk makes later stress more likely.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 5,
    prompt: "What is the key takeaway for informal workers?",
    options: [
      {
        id: "no-plan-needed",
        text: "No plan is needed",
        outcome:
          "Planning is essential for long-term security.",
        isCorrect: false,
      },
      {
        id: "extra-planning",
        text: "Extra planning is needed for retirement",
        outcome:
          "Correct. Informal workers need extra planning.",
        isCorrect: true,
      },
      {
        id: "free-pension",
        text: "A free pension is guaranteed",
        outcome:
          "A guaranteed pension is not automatic.",
        isCorrect: false,
      },
      {
        id: "ignore-savings",
        text: "Savings are optional",
        outcome:
          "Savings are important for security.",
        isCorrect: false,
      },
    ],
  },
];

const InformalWorkerReality = () => {
  const location = useLocation();
  const gameId = "finance-insurance-pension-17";
  const gameData = getGameDataById(gameId);
  const totalStages = INFORMAL_WORKER_REALITY_STAGES.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const totalCoins = gameData?.coins ?? location.state?.totalCoins ?? 5;
  const coinsPerLevel = Math.max(1, Math.floor(totalCoins / totalStages));
  const totalXp = gameData?.xp ?? location.state?.totalXp ?? 10;
  const stage = INFORMAL_WORKER_REALITY_STAGES[currentStageIndex];

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
      title="Informal Worker Reality"
      subtitle={
        showResult
          ? "Quiz complete! You understand the need for extra planning."
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

export default InformalWorkerReality;
