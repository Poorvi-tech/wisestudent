import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const FINANCIAL_DISCIPLINE_CHECK_STAGES = [
  {
    id: 1,
    prompt:
      "Owner reviews monthly income, expenses, stock, and loans. What does this practice build?",
    options: [
      {
        id: "extra-work",
        text: "Extra work only",
        outcome: "Reviews take time but improve control.",
        isCorrect: false,
      },
      {
        id: "control-stability",
        text: "Control and stability",
        outcome: "Correct. Review prevents slow financial problems.",
        isCorrect: true,
      },
      {
        id: "less-profit",
        text: "Less profit",
        outcome: "Reviews help protect profit, not reduce it.",
        isCorrect: false,
      },
      {
        id: "no-impact",
        text: "No impact",
        outcome: "Regular reviews have a real impact.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 2,
    prompt: "Why is monthly review important for a business?",
    options: [
      {
        id: "spot-issues",
        text: "It helps spot problems early",
        outcome: "Correct. Early action prevents bigger losses.",
        isCorrect: true,
      },
      {
        id: "avoid-customers",
        text: "It helps avoid customers",
        outcome: "Reviews are about clarity, not avoidance.",
        isCorrect: false,
      },
      {
        id: "skip-records",
        text: "It removes the need for records",
        outcome: "Reviews require good records.",
        isCorrect: false,
      },
      {
        id: "increase-tax",
        text: "It increases tax automatically",
        outcome: "Taxes depend on income, not reviews.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 3,
    prompt: "What does reviewing stock help prevent?",
    options: [
      {
        id: "hidden-loss",
        text: "Hidden losses and shortages",
        outcome: "Correct. Reviews reveal gaps early.",
        isCorrect: true,
      },
      {
        id: "more-profit",
        text: "More profit automatically",
        outcome: "Profit depends on actions, not just reviews.",
        isCorrect: false,
      },
      {
        id: "no-expenses",
        text: "No expenses",
        outcome: "Expenses still exist; reviews help manage them.",
        isCorrect: false,
      },
      {
        id: "no-risk",
        text: "No risk",
        outcome: "Reviews reduce risk but do not remove it.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 4,
    prompt: "What is a simple way to keep monthly discipline?",
    options: [
      {
        id: "monthly-checklist",
        text: "Use a monthly checklist for income, expenses, stock, and loans",
        outcome: "Correct. A checklist keeps reviews consistent.",
        isCorrect: true,
      },
      {
        id: "memory-only",
        text: "Keep everything in memory",
        outcome: "Memory is unreliable for reviews.",
        isCorrect: false,
      },
      {
        id: "delay-yearly",
        text: "Review only once a year",
        outcome: "Yearly reviews miss monthly problems.",
        isCorrect: false,
      },
      {
        id: "ignore-loans",
        text: "Ignore loan status",
        outcome: "Loans need regular monitoring.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 5,
    prompt: "What is the key takeaway about financial discipline checks?",
    options: [
      {
        id: "stability",
        text: "Reviews build control and stability",
        outcome: "Correct. Discipline prevents slow financial problems.",
        isCorrect: true,
      },
      {
        id: "optional",
        text: "Reviews are optional",
        outcome: "Reviews are essential for control.",
        isCorrect: false,
      },
      {
        id: "no-impact",
        text: "Reviews make no impact",
        outcome: "Reviews improve decision-making.",
        isCorrect: false,
      },
      {
        id: "only-big",
        text: "Only big businesses need reviews",
        outcome: "Small businesses benefit just as much.",
        isCorrect: false,
      },
    ],
  },
];

const FinancialDisciplineCheck = () => {
  const location = useLocation();
  const gameId = "finance-business-livelihood-finance-48";
  const gameData = getGameDataById(gameId);
  const totalStages = FINANCIAL_DISCIPLINE_CHECK_STAGES.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const totalCoins = gameData?.coins ?? location.state?.totalCoins ?? 10;
  const coinsPerLevel = Math.max(1, Math.floor(totalCoins / totalStages));
  const totalXp = gameData?.xp ?? location.state?.totalXp ?? 20;
  const stage = FINANCIAL_DISCIPLINE_CHECK_STAGES[currentStageIndex];

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
      title="Financial Discipline Check"
      subtitle={
        showResult
          ? "Quiz complete! You now know why reviews build stability."
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

export default FinancialDisciplineCheck;
