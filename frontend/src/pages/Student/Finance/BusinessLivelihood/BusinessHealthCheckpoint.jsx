import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const BUSINESS_HEALTH_CHECKPOINT_STAGES = [
  {
    id: 1,
    prompt:
      "A business keeps records, separates money, issues bills. What does this show?",
    options: [
      {
        id: "strong-foundation",
        text: "Strong foundation for growth and finance access",
        outcome: "Correct. Good practices enable business stability.",
        isCorrect: true,
      },
      {
        id: "complication",
        text: "Complication",
        outcome: "These habits actually simplify decision-making.",
        isCorrect: false,
      },
      {
        id: "unnecessary-effort",
        text: "Unnecessary effort",
        outcome: "These efforts protect profits and reputation.",
        isCorrect: false,
      },
      {
        id: "no-impact",
        text: "No impact",
        outcome: "Records and separation create real impact.",
        isCorrect: false,
      }
    ],
  },
  {
    id: 2,
    prompt: "Why do good records help a business grow?",
    options: [
      {
        id: "avoid-customers",
        text: "They help avoid customers",
        outcome: "Records are about clarity, not avoidance.",
        isCorrect: false,
      },
      {
        id: "skip-bills",
        text: "They remove the need for bills",
        outcome: "Bills are still important for proof.",
        isCorrect: false,
      },
      {
        id: "clear-performance",
        text: "They show clear performance and cash flow",
        outcome: "Correct. Clear data supports better decisions.",
        isCorrect: true,
      },
      {
        id: "guarantee-growth",
        text: "They guarantee growth",
        outcome: "Records help, but growth depends on many factors.",
        isCorrect: false,
      }
    ],
  },
  {
    id: 3,
    prompt: "How does separating money help business health?",
    options: [
      {
        id: "less-control",
        text: "It reduces control",
        outcome: "Separation improves control, not reduces it.",
        isCorrect: false,
      },
      {
        id: "true-profit",
        text: "It shows true profit and prevents confusion",
        outcome: "Correct. Separation keeps performance visible.",
        isCorrect: true,
      },
      {
        id: "higher-rent",
        text: "It increases rent",
        outcome: "Rent is unrelated to separation.",
        isCorrect: false,
      },
      {
        id: "more-tax",
        text: "It increases taxes",
        outcome: "Taxes depend on income, not separation.",
        isCorrect: false,
      }
    ],
  },
  {
    id: 4,
    prompt: "What is a simple habit that reflects business health?",
    options: [
      {
        id: "ignore-expenses",
        text: "Ignore small expenses",
        outcome: "Small expenses add up to big losses.",
        isCorrect: false,
      },
      {
        id: "cash-only",
        text: "Take cash only and skip receipts",
        outcome: "Cash-only without receipts weakens proof.",
        isCorrect: false,
      },
      {
        id: "delay-records",
        text: "Record only at year-end",
        outcome: "Year-end records miss daily insights.",
        isCorrect: false,
      },
      {
        id: "issue-bills",
        text: "Issue bills and keep daily records",
        outcome: "Correct. Consistent records show discipline.",
        isCorrect: true,
      }
    ],
  },
  {
    id: 5,
    prompt: "What is the key takeaway about business health checkpoint?",
    options: [
      {
        id: "optional",
        text: "Good practices are optional",
        outcome: "Good practices are essential for stability.",
        isCorrect: false,
      },
      {
        id: "good-practices",
        text: "Good practices enable business stability",
        outcome: "Correct. Strong habits keep a business resilient.",
        isCorrect: true,
      },
      {
        id: "no-impact",
        text: "Practices make no impact",
        outcome: "Strong practices create real impact.",
        isCorrect: false,
      },
      {
        id: "only-big",
        text: "Only large businesses need good practices",
        outcome: "Small businesses benefit even more from discipline.",
        isCorrect: false,
      }
    ],
  },
];

const BusinessHealthCheckpoint = () => {
  const location = useLocation();
  const gameId = "finance-business-livelihood-finance-25";
  const gameData = getGameDataById(gameId);
  const totalStages = BUSINESS_HEALTH_CHECKPOINT_STAGES.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const totalCoins = gameData?.coins ?? location.state?.totalCoins ?? 5;
  const coinsPerLevel = Math.max(1, Math.floor(totalCoins / totalStages));
  const totalXp = gameData?.xp ?? location.state?.totalXp ?? 10;
  const stage = BUSINESS_HEALTH_CHECKPOINT_STAGES[currentStageIndex];

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
      title="Business Health Checkpoint"
      subtitle={
        showResult
          ? "Quiz complete! You now know why good practices enable stability."
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

export default BusinessHealthCheckpoint;
