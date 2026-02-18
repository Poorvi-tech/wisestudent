import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const BUSINESS_FUTURE_THINKING_STAGES = [
  {
    id: 1,
    prompt: "A trader wants business to survive long-term. Best guiding rule?",
    options: [
      {
        id: "records-discipline",
        text: "Maintain records, proof, and financial discipline",
        outcome: "Correct. Structure ensures survival and growth.",
        isCorrect: true,
      },
      {
        id: "daily-sales",
        text: "Focus only on daily sales",
        outcome: "Daily sales matter, but structure ensures survival.",
        isCorrect: false,
      },
      {
        id: "ignore-planning",
        text: "Ignore planning",
        outcome: "Ignoring planning increases risk.",
        isCorrect: false,
      },
      {
        id: "borrow-often",
        text: "Borrow often",
        outcome: "Frequent borrowing without discipline increases risk.",
        isCorrect: false,
      }
    ],
  },
  {
    id: 2,
    prompt: "Why do records matter for long-term survival?",
    options: [
      {
        id: "avoid-customers",
        text: "They help avoid customers",
        outcome: "Records are about clarity, not avoidance.",
        isCorrect: false,
      },
      {
        id: "clear-performance",
        text: "They show clear performance and cash flow",
        outcome: "Correct. Clear data supports better decisions.",
        isCorrect: true,
      },
      {
        id: "skip-bills",
        text: "They remove the need for bills",
        outcome: "Bills are still important for proof.",
        isCorrect: false,
      },
      {
        id: "guarantee-growth",
        text: "They guarantee growth",
        outcome: "Records help but do not guarantee growth.",
        isCorrect: false,
      }
    ],
  },
  {
    id: 3,
    prompt: "How does financial discipline help stability?",
    options: [
      {
        id: "more-profit",
        text: "More profit automatically",
        outcome: "Profit depends on actions, not just discipline.",
        isCorrect: false,
      },
      {
        id: "no-expenses",
        text: "No expenses",
        outcome: "Expenses still exist; discipline manages them.",
        isCorrect: false,
      },
      {
        id: "prevent-leaks",
        text: "It prevents slow leaks and surprises",
        outcome: "Correct. Discipline reduces hidden problems.",
        isCorrect: true,
      },
      {
        id: "no-risk",
        text: "No risk",
        outcome: "Discipline reduces risk but does not remove it.",
        isCorrect: false,
      }
    ],
  },
  {
    id: 4,
    prompt: "What is a simple habit to build long-term stability?",
    options: [
      {
        id: "memory-only",
        text: "Keep everything in memory",
        outcome: "Memory is unreliable for long-term planning.",
        isCorrect: false,
      },
      {
        id: "delay-records",
        text: "Record only at year-end",
        outcome: "Year-end records miss monthly issues.",
        isCorrect: false,
      },
      {
        id: "ignore-expenses",
        text: "Ignore small expenses",
        outcome: "Small expenses add up to big losses.",
        isCorrect: false,
      },
      {
        id: "monthly-review",
        text: "Review income, expenses, stock, and loans monthly",
        outcome: "Correct. Reviews keep the business on track.",
        isCorrect: true,
      }
    ],
  },
  {
    id: 5,
    prompt: "What is the key takeaway about business future thinking?",
    options: [
      {
        id: "optional",
        text: "Structure is optional",
        outcome: "Structure is essential for long-term success.",
        isCorrect: false,
      },
      {
        id: "no-impact",
        text: "Structure makes no impact",
        outcome: "Structure improves stability and access to finance.",
        isCorrect: false,
      },
      {
        id: "structure",
        text: "Structure ensures survival and growth",
        outcome: "Correct. Records and discipline build resilience.",
        isCorrect: true,
      },
      {
        id: "borrow-only",
        text: "Borrowing is the main solution",
        outcome: "Borrowing without structure increases risk.",
        isCorrect: false,
      }
    ],
  },
];

const BusinessFutureThinking = () => {
  const location = useLocation();
  const gameId = "finance-business-livelihood-finance-49";
  const gameData = getGameDataById(gameId);
  const totalStages = BUSINESS_FUTURE_THINKING_STAGES.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const totalCoins = gameData?.coins ?? location.state?.totalCoins ?? 10;
  const coinsPerLevel = Math.max(1, Math.floor(totalCoins / totalStages));
  const totalXp = gameData?.xp ?? location.state?.totalXp ?? 20;
  const stage = BUSINESS_FUTURE_THINKING_STAGES[currentStageIndex];

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
      title="Business Future Thinking"
      subtitle={
        showResult
          ? "Quiz complete! You now know why structure ensures survival."
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

export default BusinessFutureThinking;
