import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const CUSTOMER_RETURN_ISSUE_STAGES = [
  {
    id: 1,
    prompt: "Customer returns product but no bill exists. What problem occurs?",
    options: [
      {
        id: "no-problem",
        text: "No problem",
        outcome: "Without a bill, proof is missing.",
        isCorrect: false,
      },
      {
        id: "more-profit",
        text: "More profit",
        outcome: "Missing bills do not create profit.",
        isCorrect: false,
      },
      {
        id: "verify-purchase",
        text: "Hard to verify purchase",
        outcome: "Correct. Bills protect both sides in disputes.",
        isCorrect: true,
      },
      {
        id: "faster-refund",
        text: "Faster refund",
        outcome: "Refunds are harder without proof.",
        isCorrect: false,
      }
    ],
  },
  {
    id: 2,
    prompt: "Why is a bill important for returns?",
    options: [
      {
        id: "avoid-customers",
        text: "It helps avoid customers",
        outcome: "Bills build trust, not avoidance.",
        isCorrect: false,
      },
      {
        id: "proof-date",
        text: "It proves purchase date and item details",
        outcome: "Correct. Proof avoids confusion in returns.",
        isCorrect: true,
      },
      {
        id: "increase-price",
        text: "It increases price automatically",
        outcome: "Bills do not change prices.",
        isCorrect: false,
      },
      {
        id: "skip-service",
        text: "It replaces good service",
        outcome: "Service still matters alongside proof.",
        isCorrect: false,
      }
    ],
  },
  {
    id: 3,
    prompt: "What risk increases when no bill is provided?",
    options: [
      {
        id: "higher-loyalty",
        text: "Higher loyalty automatically",
        outcome: "Trust grows with transparency and proof.",
        isCorrect: false,
      },
      {
        id: "faster-sales",
        text: "Faster sales",
        outcome: "Sales depend on many factors, not missing bills.",
        isCorrect: false,
      },
      {
        id: "lower-costs",
        text: "Lower costs automatically",
        outcome: "Costs do not reduce because of missing bills.",
        isCorrect: false,
      },
      {
        id: "disputes",
        text: "Disputes about whether the item was purchased",
        outcome: "Correct. Missing bills lead to disputes.",
        isCorrect: true,
      }
    ],
  },
  {
    id: 4,
    prompt: "What is a simple way to prevent return disputes?",
    options: [
      {
        id: "issue-bill",
        text: "Issue a bill or receipt for every sale",
        outcome: "Correct. Simple receipts create proof.",
        isCorrect: true,
      },
      {
        id: "verbal-only",
        text: "Give verbal confirmation only",
        outcome: "Verbal confirmations are hard to prove later.",
        isCorrect: false,
      },
      {
        id: "delay-receipt",
        text: "Give receipt only if asked later",
        outcome: "Receipts are most useful at the time of sale.",
        isCorrect: false,
      },
      {
        id: "avoid-bills",
        text: "Avoid bills to save time",
        outcome: "Skipping bills reduces trust and clarity.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 5,
    prompt: "What is the key takeaway about customer return issues?",
    options: [
      {
        id: "optional",
        text: "Bills are optional",
        outcome: "Bills are important for trust and proof.",
        isCorrect: false,
      },
      {
        id: "no-impact",
        text: "Bills make no impact",
        outcome: "Bills strongly affect return clarity.",
        isCorrect: false,
      },
      {
        id: "price-only",
        text: "Only price matters",
        outcome: "Transparency matters for repeat business.",
        isCorrect: false,
      },
      {
        id: "bills-protect",
        text: "Bills protect both sides in disputes",
        outcome: "Correct. Proof makes returns fair and clear.",
        isCorrect: true,
      }
    ],
  },
];

const CustomerReturnIssue = () => {
  const location = useLocation();
  const gameId = "finance-business-livelihood-finance-73";
  const gameData = getGameDataById(gameId);
  const totalStages = CUSTOMER_RETURN_ISSUE_STAGES.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const totalCoins = gameData?.coins ?? location.state?.totalCoins ?? 10;
  const coinsPerLevel = Math.max(1, Math.floor(totalCoins / totalStages));
  const totalXp = gameData?.xp ?? location.state?.totalXp ?? 20;
  const stage = CUSTOMER_RETURN_ISSUE_STAGES[currentStageIndex];

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
      title="Customer Return Issue"
      subtitle={
        showResult
          ? "Quiz complete! You now know why bills protect both sides."
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

export default CustomerReturnIssue;
