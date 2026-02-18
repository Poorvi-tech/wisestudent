import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const RECORD_DISCIPLINE_STAGES = [
  {
    id: 1,
    prompt: "Owner writes income daily but not expenses. What is missing?",
    options: [
      {
        id: "nothing",
        text: "Nothing",
        outcome: "Without expenses, the picture is incomplete.",
        isCorrect: false,
      },
      {
        id: "profit-calculation",
        text: "Profit calculation",
        outcome: "Profit depends on both income and expenses.",
        isCorrect: false,
      },
      {
        id: "complete-picture",
        text: "Complete financial picture",
        outcome: "Correct. Both income and expense records matter.",
        isCorrect: true,
      },
      {
        id: "sales-tracking",
        text: "Sales tracking",
        outcome: "Sales are tracked by income, but expenses are still missing.",
        isCorrect: false,
      }
    ],
  },
  {
    id: 2,
    prompt: "Why are expense records important?",
    options: [
      {
        id: "avoid-customers",
        text: "They help avoid customers",
        outcome: "Records are for clarity, not avoidance.",
        isCorrect: false,
      },
      {
        id: "true-profit",
        text: "They show true profit after costs",
        outcome: "Correct. Expenses determine real profit.",
        isCorrect: true,
      },
      {
        id: "increase-prices",
        text: "They increase prices automatically",
        outcome: "Prices depend on strategy, not just records.",
        isCorrect: false,
      },
      {
        id: "remove-bills",
        text: "They remove the need for bills",
        outcome: "Bills are still important for proof.",
        isCorrect: false,
      }
    ],
  },
  {
    id: 3,
    prompt: "What happens when expenses are not tracked?",
    options: [
      {
        id: "higher-profit",
        text: "Higher profit automatically",
        outcome: "Profit does not increase without control.",
        isCorrect: false,
      },
      {
        id: "more-savings",
        text: "More savings",
        outcome: "Savings depend on true profit, not missing data.",
        isCorrect: false,
      },
      {
        id: "no-risk",
        text: "No risk",
        outcome: "There is real risk without expense tracking.",
        isCorrect: false,
      },
      {
        id: "hidden-losses",
        text: "Hidden losses and cash leaks",
        outcome: "Correct. Missing expense records hide leaks.",
        isCorrect: true,
      }
    ],
  },
  {
    id: 4,
    prompt: "What is a simple habit to improve record discipline?",
    options: [
      {
        id: "daily-log",
        text: "Log both income and expenses daily",
        outcome: "Correct. Daily records create clarity.",
        isCorrect: true,
      },
      {
        id: "memory-only",
        text: "Keep expenses in memory",
        outcome: "Memory is unreliable for tracking.",
        isCorrect: false,
      },
      {
        id: "track-yearly",
        text: "Track expenses only yearly",
        outcome: "Yearly tracking misses daily issues.",
        isCorrect: false,
      },
      {
        id: "ignore-small",
        text: "Ignore small expenses",
        outcome: "Small expenses add up to big losses.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 5,
    prompt: "What is the key takeaway about record discipline?",
    options: [
      {
        id: "income-only",
        text: "Income records are enough",
        outcome: "Income alone cannot show profit.",
        isCorrect: false,
      },
      {
        id: "records-optional",
        text: "Records are optional",
        outcome: "Records are essential for smart decisions.",
        isCorrect: false,
      },
      {
        id: "only-big",
        text: "Only large businesses need expense records",
        outcome: "Small businesses benefit even more from clarity.",
        isCorrect: false,
      },
      {
        id: "both-matter",
        text: "Both income and expense records matter",
        outcome: "Correct. Complete records show real performance.",
        isCorrect: true,
      }
    ],
  },
];

const RecordDiscipline = () => {
  const location = useLocation();
  const gameId = "finance-business-livelihood-finance-23";
  const gameData = getGameDataById(gameId);
  const totalStages = RECORD_DISCIPLINE_STAGES.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const totalCoins = gameData?.coins ?? location.state?.totalCoins ?? 5;
  const coinsPerLevel = Math.max(1, Math.floor(totalCoins / totalStages));
  const totalXp = gameData?.xp ?? location.state?.totalXp ?? 10;
  const stage = RECORD_DISCIPLINE_STAGES[currentStageIndex];

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
      title="Record Discipline"
      subtitle={
        showResult
          ? "Quiz complete! You now know why complete records matter."
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

export default RecordDiscipline;
