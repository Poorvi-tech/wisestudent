import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const GROWING_BEYOND_INFORMAL_STAGE_STAGES = [
  {
    id: 1,
    prompt:
      "A shop’s sales increase but owner keeps no proper records. What may stop growth?",
    options: [
      {
        id: "shop-size",
        text: "Shop size",
        outcome: "Size matters, but lack of records often blocks growth first.",
        isCorrect: false,
      },
      {
        id: "customer-loyalty",
        text: "Customer loyalty",
        outcome: "Loyalty helps growth, not stop it.",
        isCorrect: false,
      },
      {
        id: "location",
        text: "Location",
        outcome: "Location matters, but records are essential for scaling.",
        isCorrect: false,
      },
      {
        id: "lack-proof",
        text: "Lack of proof and documentation",
        outcome: "Correct. Growth needs formal financial visibility.",
        isCorrect: true,
      }
    ],
  },
  {
    id: 2,
    prompt: "Why do proper records matter as sales grow?",
    options: [
      {
        id: "track-performance",
        text: "They show true performance and cash flow",
        outcome: "Correct. Records show what is really working.",
        isCorrect: true,
      },
      {
        id: "avoid-customers",
        text: "They help avoid customers",
        outcome: "Records are about clarity, not avoiding customers.",
        isCorrect: false,
      },
      {
        id: "remove-bills",
        text: "They remove the need for bills",
        outcome: "Bills are still important for proof.",
        isCorrect: false,
      },
      {
        id: "guarantee-growth",
        text: "They guarantee growth",
        outcome: "Records help decisions but do not guarantee growth.",
        isCorrect: false,
      }
    ],
  },
  {
    id: 3,
    prompt: "What is a common problem of informal records at higher scale?",
    options: [
      {
        id: "more-profit",
        text: "More profit automatically",
        outcome: "Profit depends on control, not informality.",
        isCorrect: false,
      },
      {
        id: "less-competition",
        text: "Less competition",
        outcome: "Competition is unrelated to record-keeping.",
        isCorrect: false,
      },
      {
        id: "no-proof",
        text: "Weak proof for loans and partnerships",
        outcome: "Correct. Missing proof limits expansion opportunities.",
        isCorrect: true,
      },
      {
        id: "faster-scaling",
        text: "Faster scaling",
        outcome: "Scaling usually needs stronger systems.",
        isCorrect: false,
      }
    ],
  },
  {
    id: 4,
    prompt: "What is a simple step to move beyond informal records?",
    options: [
      {
        id: "cash-only",
        text: "Use only cash and skip receipts",
        outcome: "Cash-only without receipts reduces proof.",
        isCorrect: false,
      },
      {
        id: "daily-records",
        text: "Maintain daily sales and expense records",
        outcome: "Correct. Daily records create strong visibility.",
        isCorrect: true,
      },
      {
        id: "delay-forever",
        text: "Delay records until much later",
        outcome: "Delays increase risk and confusion.",
        isCorrect: false,
      },
      {
        id: "memory-only",
        text: "Rely on memory",
        outcome: "Memory is unreliable as scale grows.",
        isCorrect: false,
      }
    ],
  },
  {
    id: 5,
    prompt: "What is the key takeaway about growing beyond informal stage?",
    options: [
      {
        id: "informal-enough",
        text: "Informal practices are enough",
        outcome: "Informal practices often block growth.",
        isCorrect: false,
      },
      {
        id: "records-optional",
        text: "Records are optional",
        outcome: "Records are essential for scaling.",
        isCorrect: false,
      },
      {
        id: "visibility-growth",
        text: "Growth needs formal financial visibility",
        outcome: "Correct. Clear records enable expansion.",
        isCorrect: true,
      },
      {
        id: "only-big",
        text: "Only big businesses need records",
        outcome: "Small businesses benefit early from strong records.",
        isCorrect: false,
      }
    ],
  },
];

const GrowingBeyondInformalStage = () => {
  const location = useLocation();
  const gameId = "finance-business-livelihood-finance-26";
  const gameData = getGameDataById(gameId);
  const totalStages = GROWING_BEYOND_INFORMAL_STAGE_STAGES.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const totalCoins = gameData?.coins ?? location.state?.totalCoins ?? 5;
  const coinsPerLevel = Math.max(1, Math.floor(totalCoins / totalStages));
  const totalXp = gameData?.xp ?? location.state?.totalXp ?? 10;
  const stage = GROWING_BEYOND_INFORMAL_STAGE_STAGES[currentStageIndex];

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
      title="Growing Beyond Informal Stage"
      subtitle={
        showResult
          ? "Quiz complete! You now know why formal visibility supports growth."
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

export default GrowingBeyondInformalStage;
