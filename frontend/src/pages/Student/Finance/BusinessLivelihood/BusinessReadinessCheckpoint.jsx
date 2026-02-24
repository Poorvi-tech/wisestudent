import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const BUSINESS_READINESS_CHECKPOINT_STAGES = [
  {
    id: 1,
    prompt:
      "Multiple scenarios appear about records, payments, loans, and growth. Best long-term approach?",
    options: [
      {
        id: "build-discipline",
        text: "Build gradual financial discipline and documentation",
        outcome: "Correct. Strong systems create stable livelihoods.",
        isCorrect: true,
      },
      {
        id: "stay-informal",
        text: "Stay informal always",
        outcome: "Informal practices often limit growth and stability.",
        isCorrect: false,
      },
      {
        id: "depend-luck",
        text: "Depend on luck",
        outcome: "Luck is not a business strategy.",
        isCorrect: false,
      },
      {
        id: "ignore-systems",
        text: "Ignore systems",
        outcome: "Ignoring systems increases risk.",
        isCorrect: false,
      }
    ],
  },
  {
    id: 2,
    prompt: "Why does documentation matter for long-term success?",
    options: [
      {
        id: "avoid-customers",
        text: "It helps avoid customers",
        outcome: "Documentation is for clarity, not avoidance.",
        isCorrect: false,
      },
      {
        id: "skip-bills",
        text: "It removes the need for bills",
        outcome: "Bills are part of documentation.",
        isCorrect: false,
      },
      {
        id: "guarantee-growth",
        text: "It guarantees growth",
        outcome: "Documentation helps but does not guarantee growth.",
        isCorrect: false,
      },
      {
        id: "proof-trust",
        text: "It provides proof and builds trust",
        outcome: "Correct. Proof supports financing and partnerships.",
        isCorrect: true,
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
        id: "prevent-problems",
        text: "It prevents slow financial problems",
        outcome: "Correct. Regular checks catch issues early.",
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
    prompt: "What is a practical habit for readiness?",
    options: [
      {
        id: "memory-only",
        text: "Keep everything in memory",
        outcome: "Memory is unreliable for planning.",
        isCorrect: false,
      },
      {
        id: "monthly-review",
        text: "Review income, expenses, stock, and loans monthly",
        outcome: "Correct. Reviews keep the business on track.",
        isCorrect: true,
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
        outcome: "Small expenses add up over time.",
        isCorrect: false,
      }
    ],
  },
  {
    id: 5,
    prompt: "What is the key takeaway about business readiness checkpoint?",
    options: [
      {
        id: "optional",
        text: "Systems are optional",
        outcome: "Systems are essential for long-term success.",
        isCorrect: false,
      },
      {
        id: "no-impact",
        text: "Systems make no impact",
        outcome: "Systems improve stability and access to finance.",
        isCorrect: false,
      },
      {
        id: "strong-systems",
        text: "Strong systems create stable livelihoods",
        outcome: "Correct. Discipline and documentation support growth.",
        isCorrect: true,
      },
      {
        id: "luck-only",
        text: "Luck is the main factor",
        outcome: "Systems reduce dependence on luck.",
        isCorrect: false,
      }
    ],
  },
];

const BusinessReadinessCheckpoint = () => {
  const location = useLocation();
  const gameId = "finance-business-livelihood-finance-99";
  const gameData = getGameDataById(gameId);
  const totalStages = BUSINESS_READINESS_CHECKPOINT_STAGES.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const totalCoins = gameData?.coins ?? location.state?.totalCoins ?? 10;
  const coinsPerLevel = Math.max(1, Math.floor(totalCoins / totalStages));
  const totalXp = gameData?.xp ?? location.state?.totalXp ?? 20;
  const stage = BUSINESS_READINESS_CHECKPOINT_STAGES[currentStageIndex];

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
      title="Business Readiness Checkpoint"
      subtitle={
        showResult
          ? "Quiz complete! You now know why strong systems create stability."
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

export default BusinessReadinessCheckpoint;
