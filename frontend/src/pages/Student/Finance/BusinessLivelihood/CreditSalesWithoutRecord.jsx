import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const CREDIT_SALES_WITHOUT_RECORD_STAGES = [
  {
    id: 1,
    prompt: "Shop sells on credit but doesn’t write it down. What risk exists?",
    options: [
      {
        id: "more-sales",
        text: "More sales",
        outcome: "Sales may happen, but losses can still occur.",
        isCorrect: false,
      },
      {
        id: "forgotten-payments",
        text: "Forgotten payments and disputes",
        outcome: "Correct. Credit tracking prevents loss.",
        isCorrect: true,
      },
      {
        id: "less-effort",
        text: "Less effort",
        outcome: "Less effort now can create bigger problems later.",
        isCorrect: false,
      },
      {
        id: "higher-trust",
        text: "Higher trust",
        outcome: "Trust is stronger with clear records.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 2,
    prompt: "Why is it important to record credit sales?",
    options: [
      {
        id: "avoid-customers",
        text: "To avoid customers",
        outcome: "Recording is about clarity, not avoidance.",
        isCorrect: false,
      },
      {
        id: "guarantee-profit",
        text: "To guarantee profit",
        outcome: "Profits depend on more than records.",
        isCorrect: false,
      },
      {
        id: "skip-invoices",
        text: "To skip invoices",
        outcome: "Invoices and records work together.",
        isCorrect: false,
      },
      {
        id: "track-dues",
        text: "To track who owes what and when",
        outcome: "Correct. Clear records reduce disputes.",
        isCorrect: true,
      }
    ],
  },
  {
    id: 3,
    prompt: "What is a common outcome of unrecorded credit?",
    options: [
      {
        id: "missed-dues",
        text: "Missed or delayed collections",
        outcome: "Correct. Without records, collections get missed.",
        isCorrect: true,
      },
      {
        id: "more-cash",
        text: "More cash on hand",
        outcome: "Unrecorded credit usually reduces cash.",
        isCorrect: false,
      },
      {
        id: "faster-growth",
        text: "Faster growth",
        outcome: "Growth needs clear cash flow.",
        isCorrect: false,
      },
      {
        id: "no-risk",
        text: "No risk at all",
        outcome: "There is risk without proper tracking.",
        isCorrect: false,
      }
    ],
  },
  {
    id: 4,
    prompt: "What is a simple way to track credit sales?",
    options: [
      {
        id: "memory-only",
        text: "Remember everything in your head",
        outcome: "Memory is unreliable for credit tracking.",
        isCorrect: false,
      },
      {
        id: "avoid-credit",
        text: "Offer credit with no records",
        outcome: "Credit without records increases loss risk.",
        isCorrect: false,
      },
      {
        id: "credit-ledger",
        text: "Maintain a credit ledger with names and amounts",
        outcome: "Correct. A simple ledger keeps clarity.",
        isCorrect: true,
      },
      {
        id: "yearly-check",
        text: "Check dues once a year",
        outcome: "Yearly checks are too late for credit control.",
        isCorrect: false,
      }
    ],
  },
  {
    id: 5,
    prompt: "What is the key takeaway about credit sales without record?",
    options: [
      {
        id: "track-credit",
        text: "Credit tracking prevents loss",
        outcome: "Correct. Records keep money and relationships safe.",
        isCorrect: true,
      },
      {
        id: "records-optional",
        text: "Records are optional",
        outcome: "Records are essential for credit safety.",
        isCorrect: false,
      },
      {
        id: "trust-only",
        text: "Trust alone is enough",
        outcome: "Trust plus records is much safer.",
        isCorrect: false,
      },
      {
        id: "credit-no-risk",
        text: "Credit has no risk",
        outcome: "Credit always carries risk without tracking.",
        isCorrect: false,
      }
    ],
  },
];

const CreditSalesWithoutRecord = () => {
  const location = useLocation();
  const gameId = "finance-business-livelihood-finance-16";
  const gameData = getGameDataById(gameId);
  const totalStages = CREDIT_SALES_WITHOUT_RECORD_STAGES.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const totalCoins = gameData?.coins ?? location.state?.totalCoins ?? 5;
  const coinsPerLevel = Math.max(1, Math.floor(totalCoins / totalStages));
  const totalXp = gameData?.xp ?? location.state?.totalXp ?? 10;
  const stage = CREDIT_SALES_WITHOUT_RECORD_STAGES[currentStageIndex];

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
      title="Credit Sales Without Record"
      subtitle={
        showResult
          ? "Quiz complete! You now know why credit tracking prevents loss."
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

export default CreditSalesWithoutRecord;
