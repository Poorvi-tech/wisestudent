import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const BILL_VS_NO_BILL_SALE_STAGES = [
  {
    id: 1,
    prompt:
      "Two shops sell same product; one gives bill, one doesn’t. Which builds long-term trust?",
    options: [
      {
        id: "no-bill",
        text: "No-bill shop",
        outcome: "Without bills, trust and proof are weaker.",
        isCorrect: false,
      },
      {
        id: "bill-shop",
        text: "Bill-providing shop",
        outcome: "Correct. Transparency builds customer confidence.",
        isCorrect: true,
      },
      {
        id: "both-equal",
        text: "Both equal",
        outcome: "Bills usually improve trust and clarity.",
        isCorrect: false,
      },
      {
        id: "cheapest-only",
        text: "Cheapest price only",
        outcome: "Price matters, but trust builds long-term loyalty.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 2,
    prompt: "Why do bills help build trust?",
    options: [
      {
        id: "avoid-customers",
        text: "They help avoid customers",
        outcome: "Bills build transparency, not avoidance.",
        isCorrect: false,
      },
      {
        id: "increase-price",
        text: "They increase price automatically",
        outcome: "Bills do not automatically increase price.",
        isCorrect: false,
      },
      {
        id: "proof",
        text: "They provide proof of purchase",
        outcome: "Correct. Proof reduces disputes and builds confidence.",
        isCorrect: true,
      },
      {
        id: "skip-service",
        text: "They replace good service",
        outcome: "Service still matters alongside bills.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 3,
    prompt: "What is a common issue in a no-bill shop?",
    options: [
      {
        id: "higher-loyalty",
        text: "Higher loyalty automatically",
        outcome: "Loyalty grows with trust and proof.",
        isCorrect: false,
      },
      {
        id: "more-returns",
        text: "More returns always accepted",
        outcome: "Returns need proof to process.",
        isCorrect: false,
      },
      {
        id: "lower-costs",
        text: "Lower costs automatically",
        outcome: "Costs depend on operations, not just bills.",
        isCorrect: false,
      },
      {
        id: "disputes",
        text: "Disputes are harder to resolve",
        outcome: "Correct. Without proof, disputes become harder.",
        isCorrect: true,
      },
    ],
  },
  {
    id: 4,
    prompt: "What is a simple way to provide bills?",
    options: [
      {
        id: "receipt-book",
        text: "Use a receipt book or digital bill",
        outcome: "Correct. Simple tools create clear proof.",
        isCorrect: true,
      },
      {
        id: "verbal-only",
        text: "Give verbal confirmation only",
        outcome: "Verbal confirmation is hard to prove later.",
        isCorrect: false,
      },
      {
        id: "avoid-bills",
        text: "Avoid bills to save time",
        outcome: "Skipping bills reduces trust.",
        isCorrect: false,
      },
      {
        id: "delay-days",
        text: "Provide bills days later",
        outcome: "Bills are most useful at the time of purchase.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 5,
    prompt: "What is the key takeaway about bill vs no-bill sales?",
    options: [
      {
        id: "optional",
        text: "Bills are optional",
        outcome: "Bills are important for long-term trust.",
        isCorrect: false,
      },
      {
        id: "transparency",
        text: "Transparency builds customer confidence",
        outcome: "Correct. Bills strengthen trust and reputation.",
        isCorrect: true,
      },
      {
        id: "no-impact",
        text: "Bills make no impact",
        outcome: "Bills have a real impact on trust.",
        isCorrect: false,
      },
      {
        id: "price-only",
        text: "Only price matters",
        outcome: "Price matters, but trust drives repeat business.",
        isCorrect: false,
      },
    ],
  },
];

const BillVsNoBillSale = () => {
  const location = useLocation();
  const gameId = "finance-business-livelihood-finance-28";
  const gameData = getGameDataById(gameId);
  const totalStages = BILL_VS_NO_BILL_SALE_STAGES.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const totalCoins = gameData?.coins ?? location.state?.totalCoins ?? 10;
  const coinsPerLevel = Math.max(1, Math.floor(totalCoins / totalStages));
  const totalXp = gameData?.xp ?? location.state?.totalXp ?? 20;
  const stage = BILL_VS_NO_BILL_SALE_STAGES[currentStageIndex];

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
      title="Bill vs No Bill Sale"
      subtitle={
        showResult
          ? "Quiz complete! You now know why transparency builds confidence."
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

export default BillVsNoBillSale;
