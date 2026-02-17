import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const INVENTORY_LOSS_STAGES = [
  {
    id: 1,
    prompt: "Stock missing but no inventory list exists. What caused the problem?",
    options: [
      {
        id: "theft-only",
        text: "Theft only",
        outcome: "The core issue is missing tracking, not just theft.",
        isCorrect: false,
      },
      {
        id: "lack-tracking",
        text: "Lack of tracking system",
        outcome: "Correct. Tracking prevents hidden losses.",
        isCorrect: true,
      },
      {
        id: "staff-laziness",
        text: "Staff laziness",
        outcome: "Staff issues may exist, but tracking is the key fix.",
        isCorrect: false,
      },
      {
        id: "bad-luck",
        text: "Bad luck",
        outcome: "Luck is not the main factor; systems are.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 2,
    prompt: "Why is inventory tracking important?",
    options: [
      {
        id: "visible-stock",
        text: "It shows what is sold and what is left",
        outcome: "Correct. Visibility prevents losses.",
        isCorrect: true,
      },
      {
        id: "avoid-customers",
        text: "It helps avoid customers",
        outcome: "Tracking is for control, not avoidance.",
        isCorrect: false,
      },
      {
        id: "increase-price",
        text: "It increases prices automatically",
        outcome: "Tracking does not change prices.",
        isCorrect: false,
      },
      {
        id: "skip-records",
        text: "It removes the need for records",
        outcome: "Tracking is part of keeping records.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 3,
    prompt: "What is a common result of no inventory list?",
    options: [
      {
        id: "hidden-loss",
        text: "Hidden losses and missing stock",
        outcome: "Correct. Missing lists hide losses.",
        isCorrect: true,
      },
      {
        id: "more-profit",
        text: "More profit automatically",
        outcome: "Profit does not increase without control.",
        isCorrect: false,
      },
      {
        id: "faster-growth",
        text: "Faster growth",
        outcome: "Growth needs strong systems.",
        isCorrect: false,
      },
      {
        id: "no-risk",
        text: "No risk at all",
        outcome: "There is real risk without tracking.",
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
        outcome: "Correct. A simple register works.",
        isCorrect: true,
      },
      {
        id: "memory-only",
        text: "Keep it all in memory",
        outcome: "Memory is unreliable for inventory control.",
        isCorrect: false,
      },
      {
        id: "ignore-small",
        text: "Ignore small items",
        outcome: "Small items add up to big losses.",
        isCorrect: false,
      },
      {
        id: "track-yearly",
        text: "Track only once a year",
        outcome: "Yearly tracking misses daily issues.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 5,
    prompt: "What is the key takeaway about inventory loss?",
    options: [
      {
        id: "tracking-prevents",
        text: "Tracking prevents hidden losses",
        outcome: "Correct. Inventory control protects business health.",
        isCorrect: true,
      },
      {
        id: "optional",
        text: "Tracking is optional",
        outcome: "Tracking is essential for control.",
        isCorrect: false,
      },
      {
        id: "no-impact",
        text: "Tracking makes no impact",
        outcome: "Tracking directly reduces losses.",
        isCorrect: false,
      },
      {
        id: "only-big",
        text: "Only big shops need tracking",
        outcome: "Small shops benefit just as much.",
        isCorrect: false,
      },
    ],
  },
];

const InventoryLoss = () => {
  const location = useLocation();
  const gameId = "finance-business-livelihood-finance-42";
  const gameData = getGameDataById(gameId);
  const totalStages = INVENTORY_LOSS_STAGES.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const totalCoins = gameData?.coins ?? location.state?.totalCoins ?? 10;
  const coinsPerLevel = Math.max(1, Math.floor(totalCoins / totalStages));
  const totalXp = gameData?.xp ?? location.state?.totalXp ?? 20;
  const stage = INVENTORY_LOSS_STAGES[currentStageIndex];

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
      title="Inventory Loss"
      subtitle={
        showResult
          ? "Quiz complete! You now know why tracking prevents hidden losses."
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

export default InventoryLoss;
