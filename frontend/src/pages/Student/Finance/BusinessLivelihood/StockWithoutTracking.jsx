import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const STOCK_WITHOUT_TRACKING_STAGES = [
  {
    id: 1,
    prompt: "A business buys stock but doesn’t track sales vs inventory. What happens?",
    options: [
      {
        id: "profit-auto",
        text: "Profit increases automatically",
        outcome: "Profit does not increase without control.",
        isCorrect: false,
      },
      {
        id: "loss-unknown",
        text: "Loss or theft may go unnoticed",
        outcome: "Correct. Inventory tracking prevents hidden losses.",
        isCorrect: true,
      },
      {
        id: "customers-increase",
        text: "Customers increase",
        outcome: "Customer growth depends on service, not tracking alone.",
        isCorrect: false,
      },
      {
        id: "tax-reduces",
        text: "Tax reduces",
        outcome: "Taxes do not reduce because of missing records.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 2,
    prompt: "Why is tracking inventory important?",
    options: [
      {
        id: "know-stock",
        text: "It shows what is sold and what is left",
        outcome: "Correct. This prevents shortages and losses.",
        isCorrect: true,
      },
      {
        id: "avoid-sales",
        text: "It avoids sales",
        outcome: "Tracking supports sales, it does not avoid them.",
        isCorrect: false,
      },
      {
        id: "replace-suppliers",
        text: "It replaces suppliers",
        outcome: "Suppliers are still needed for stock.",
        isCorrect: false,
      },
      {
        id: "only-big-shops",
        text: "Only big shops need it",
        outcome: "Small shops benefit the most from control.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 3,
    prompt: "Which is an example of a tracking problem?",
    options: [
      {
        id: "missing-items",
        text: "Items missing but no record to explain",
        outcome: "Correct. Without records, losses remain hidden.",
        isCorrect: true,
      },
      {
        id: "daily-counts",
        text: "Daily stock counts recorded",
        outcome: "Recording counts is good tracking.",
        isCorrect: false,
      },
      {
        id: "supplier-bills",
        text: "Supplier bills filed properly",
        outcome: "Proper bills help tracking.",
        isCorrect: false,
      },
      {
        id: "barcode-use",
        text: "Using simple labels",
        outcome: "Labels can support tracking, not cause problems.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 4,
    prompt: "What is a simple way to start tracking inventory?",
    options: [
      {
        id: "stock-register",
        text: "Maintain a stock register for received and sold items",
        outcome: "Correct. Even a simple register works.",
        isCorrect: true,
      },
      {
        id: "memory-only",
        text: "Keep everything in memory",
        outcome: "Memory leads to gaps and errors.",
        isCorrect: false,
      },
      {
        id: "ignore-small",
        text: "Ignore small items",
        outcome: "Small items can add up to big losses.",
        isCorrect: false,
      },
      {
        id: "track-yearly",
        text: "Track once a year",
        outcome: "Yearly tracking misses daily issues.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 5,
    prompt: "What is the key takeaway about tracking stock?",
    options: [
      {
        id: "protect-health",
        text: "Inventory tracking protects business health",
        outcome: "Correct. Tracking keeps losses visible and manageable.",
        isCorrect: true,
      },
      {
        id: "optional",
        text: "Tracking is optional for small shops",
        outcome: "Small shops need tracking to prevent leakages.",
        isCorrect: false,
      },
      {
        id: "profits-auto",
        text: "Tracking makes profits automatic",
        outcome: "Tracking helps decisions but does not guarantee profit.",
        isCorrect: false,
      },
      {
        id: "no-need",
        text: "No need to track if sales are high",
        outcome: "High sales still require control of stock.",
        isCorrect: false,
      },
    ],
  },
];

const StockWithoutTracking = () => {
  const location = useLocation();
  const gameId = "finance-business-livelihood-finance-9";
  const gameData = getGameDataById(gameId);
  const totalStages = STOCK_WITHOUT_TRACKING_STAGES.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const totalCoins = gameData?.coins ?? location.state?.totalCoins ?? 5;
  const coinsPerLevel = Math.max(1, Math.floor(totalCoins / totalStages));
  const totalXp = gameData?.xp ?? location.state?.totalXp ?? 10;
  const stage = STOCK_WITHOUT_TRACKING_STAGES[currentStageIndex];

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
      title="Stock Without Tracking"
      subtitle={
        showResult
          ? "Quiz complete! You now know why inventory tracking protects business health."
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

export default StockWithoutTracking;
