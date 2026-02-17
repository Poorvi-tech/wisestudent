import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const CUSTOMER_CREDIT_TRACKING_STAGES = [
  {
    id: 1,
    prompt: "A shop starts noting who owes money. What improves?",
    options: [
      {
        id: "nothing",
        text: "Nothing",
        outcome: "Tracking improves clarity and recovery.",
        isCorrect: false,
      },
      {
        id: "recovery-clarity",
        text: "Recovery and clarity",
        outcome: "Correct. Credit tracking protects cash flow.",
        isCorrect: true,
      },
      {
        id: "decoration",
        text: "Decoration",
        outcome: "Records are for proof, not decoration.",
        isCorrect: false,
      },
      {
        id: "tax-only",
        text: "Tax only",
        outcome: "Credit tracking is mainly for cash flow control.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 2,
    prompt: "Why does credit tracking help a shop?",
    options: [
      {
        id: "know-dues",
        text: "It shows who owes what and when",
        outcome: "Correct. Clear records reduce disputes.",
        isCorrect: true,
      },
      {
        id: "avoid-customers",
        text: "It helps avoid customers",
        outcome: "Tracking is about clarity, not avoidance.",
        isCorrect: false,
      },
      {
        id: "guarantee-profit",
        text: "It guarantees profit",
        outcome: "Profit depends on sales and costs.",
        isCorrect: false,
      },
      {
        id: "skip-invoices",
        text: "It removes the need for invoices",
        outcome: "Invoices and credit records work together.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 3,
    prompt: "What is a risk of not tracking customer credit?",
    options: [
      {
        id: "missed-collections",
        text: "Missed collections and cash shortages",
        outcome: "Correct. Unrecorded credit hurts cash flow.",
        isCorrect: true,
      },
      {
        id: "more-profit",
        text: "More profit automatically",
        outcome: "Missing records does not increase profit.",
        isCorrect: false,
      },
      {
        id: "faster-growth",
        text: "Faster growth",
        outcome: "Growth needs healthy cash flow.",
        isCorrect: false,
      },
      {
        id: "no-risk",
        text: "No risk",
        outcome: "There is real risk without tracking.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 4,
    prompt: "What is a simple way to track customer credit?",
    options: [
      {
        id: "credit-ledger",
        text: "Maintain a credit ledger with names and amounts",
        outcome: "Correct. A simple ledger keeps clarity.",
        isCorrect: true,
      },
      {
        id: "memory-only",
        text: "Keep everything in memory",
        outcome: "Memory is unreliable for credit tracking.",
        isCorrect: false,
      },
      {
        id: "ignore-small",
        text: "Ignore small dues",
        outcome: "Small dues add up to big losses.",
        isCorrect: false,
      },
      {
        id: "yearly-check",
        text: "Check dues once a year",
        outcome: "Yearly checks are too late.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 5,
    prompt: "What is the key takeaway about customer credit tracking?",
    options: [
      {
        id: "protect-cashflow",
        text: "Credit tracking protects cash flow",
        outcome: "Correct. Clear records improve recovery.",
        isCorrect: true,
      },
      {
        id: "optional",
        text: "Tracking is optional",
        outcome: "Tracking is essential for cash flow.",
        isCorrect: false,
      },
      {
        id: "no-impact",
        text: "Tracking makes no impact",
        outcome: "Tracking reduces disputes and shortages.",
        isCorrect: false,
      },
      {
        id: "only-big",
        text: "Only big shops need it",
        outcome: "Small shops benefit just as much.",
        isCorrect: false,
      },
    ],
  },
];

const CustomerCreditTracking = () => {
  const location = useLocation();
  const gameId = "finance-business-livelihood-finance-44";
  const gameData = getGameDataById(gameId);
  const totalStages = CUSTOMER_CREDIT_TRACKING_STAGES.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const totalCoins = gameData?.coins ?? location.state?.totalCoins ?? 10;
  const coinsPerLevel = Math.max(1, Math.floor(totalCoins / totalStages));
  const totalXp = gameData?.xp ?? location.state?.totalXp ?? 20;
  const stage = CUSTOMER_CREDIT_TRACKING_STAGES[currentStageIndex];

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
      title="Customer Credit Tracking"
      subtitle={
        showResult
          ? "Quiz complete! You now know why credit tracking protects cash flow."
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

export default CustomerCreditTracking;
