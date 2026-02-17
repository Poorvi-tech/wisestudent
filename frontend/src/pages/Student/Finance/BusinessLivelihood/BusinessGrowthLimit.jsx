import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const BUSINESS_GROWTH_LIMIT_STAGES = [
  {
    id: 1,
    prompt: "A shop grows but keeps informal practices. What may slow expansion?",
    options: [
      {
        id: "product-quality",
        text: "Product quality",
        outcome: "Quality matters, but informal records often limit growth.",
        isCorrect: false,
      },
      {
        id: "lack-records",
        text: "Lack of records and proof",
        outcome: "Correct. Formal practices support scaling.",
        isCorrect: true,
      },
      {
        id: "customer-loyalty",
        text: "Customer loyalty",
        outcome: "Customer loyalty supports growth, not slow it.",
        isCorrect: false,
      },
      {
        id: "staff-behaviour",
        text: "Staff behaviour",
        outcome: "Staff matters, but missing records often block expansion.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 2,
    prompt: "Why do records matter more as a business grows?",
    options: [
      {
        id: "track-performance",
        text: "They help track performance across more sales and stock",
        outcome: "Correct. Growth needs stronger tracking.",
        isCorrect: true,
      },
      {
        id: "avoid-customers",
        text: "They help avoid customers",
        outcome: "Records are about control, not avoiding customers.",
        isCorrect: false,
      },
      {
        id: "replace-strategy",
        text: "They replace business strategy",
        outcome: "Records support decisions but do not replace strategy.",
        isCorrect: false,
      },
      {
        id: "remove-costs",
        text: "They remove costs",
        outcome: "Costs still exist; records help manage them.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 3,
    prompt: "What is a common limitation of informal practices?",
    options: [
      {
        id: "weak-proof",
        text: "Weak proof for loans and partnerships",
        outcome: "Correct. Lack of proof limits financing and trust.",
        isCorrect: true,
      },
      {
        id: "extra-profit",
        text: "Extra profit automatically",
        outcome: "Informality does not create profit.",
        isCorrect: false,
      },
      {
        id: "faster-scaling",
        text: "Faster scaling",
        outcome: "Scaling usually needs stronger systems.",
        isCorrect: false,
      },
      {
        id: "less-competition",
        text: "Less competition",
        outcome: "Competition is unrelated to record-keeping.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 4,
    prompt: "What is a simple first step toward formal practices?",
    options: [
      {
        id: "basic-records",
        text: "Maintain basic sales and expense records daily",
        outcome: "Correct. Simple records build a solid base.",
        isCorrect: true,
      },
      {
        id: "ignore-bills",
        text: "Ignore bills to save time",
        outcome: "Ignoring bills reduces proof and trust.",
        isCorrect: false,
      },
      {
        id: "cash-only",
        text: "Use only cash and no receipts",
        outcome: "Cash-only limits records and proof.",
        isCorrect: false,
      },
      {
        id: "delay-forever",
        text: "Delay until expansion is complete",
        outcome: "Records should improve before expansion, not after.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 5,
    prompt: "What is the key takeaway about business growth limits?",
    options: [
      {
        id: "formal-support",
        text: "Formal practices support scaling",
        outcome: "Correct. Records and proof unlock growth.",
        isCorrect: true,
      },
      {
        id: "informal-best",
        text: "Informal practices are enough",
        outcome: "Informal practices often block financing and growth.",
        isCorrect: false,
      },
      {
        id: "records-optional",
        text: "Records are optional",
        outcome: "Records are essential for scaling.",
        isCorrect: false,
      },
      {
        id: "only-big",
        text: "Only big businesses need records",
        outcome: "Small businesses benefit early from formal habits.",
        isCorrect: false,
      },
    ],
  },
];

const BusinessGrowthLimit = () => {
  const location = useLocation();
  const gameId = "finance-business-livelihood-finance-14";
  const gameData = getGameDataById(gameId);
  const totalStages = BUSINESS_GROWTH_LIMIT_STAGES.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const totalCoins = gameData?.coins ?? location.state?.totalCoins ?? 5;
  const coinsPerLevel = Math.max(1, Math.floor(totalCoins / totalStages));
  const totalXp = gameData?.xp ?? location.state?.totalXp ?? 10;
  const stage = BUSINESS_GROWTH_LIMIT_STAGES[currentStageIndex];

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
      title="Business Growth Limit"
      subtitle={
        showResult
          ? "Quiz complete! You now know why formal practices support scaling."
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

export default BusinessGrowthLimit;
