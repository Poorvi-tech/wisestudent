import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const SUPPLIER_INVOICE_CHECK_STAGES = [
  {
    id: 1,
    prompt: "A trader pays supplier without checking bill details. What risk arises?",
    options: [
      {
        id: "no-risk",
        text: "No risk",
        outcome: "Skipping checks can lead to costly mistakes.",
        isCorrect: false,
      },
      {
        id: "overpayment",
        text: "Overpayment or wrong stock",
        outcome: "Correct. Checking invoices prevents mistakes.",
        isCorrect: true,
      },
      {
        id: "faster-growth",
        text: "Faster growth",
        outcome: "Growth depends on accuracy and control.",
        isCorrect: false,
      },
      {
        id: "better-relationship",
        text: "Better relationship",
        outcome: "Trust improves with clear, accurate records.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 2,
    prompt: "Why should a trader verify invoice details?",
    options: [
      {
        id: "match-items",
        text: "To confirm quantity, price, and items",
        outcome: "Correct. Verification prevents errors and overcharges.",
        isCorrect: true,
      },
      {
        id: "delay-payment",
        text: "To delay payment without reason",
        outcome: "Checks should be quick, not unnecessary delays.",
        isCorrect: false,
      },
      {
        id: "avoid-suppliers",
        text: "To avoid suppliers",
        outcome: "Verification builds trust, not avoidance.",
        isCorrect: false,
      },
      {
        id: "skip-records",
        text: "To skip record-keeping",
        outcome: "Verification supports record-keeping.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 3,
    prompt: "What is a common mistake when invoices are not checked?",
    options: [
      {
        id: "extra-items",
        text: "Paying for items not received",
        outcome: "Correct. Unchecked invoices cause overpayment.",
        isCorrect: true,
      },
      {
        id: "clear-accounts",
        text: "Clearer accounts",
        outcome: "Unchecked invoices reduce clarity.",
        isCorrect: false,
      },
      {
        id: "higher-sales",
        text: "Higher sales",
        outcome: "Sales are unrelated to invoice checking.",
        isCorrect: false,
      },
      {
        id: "lower-costs",
        text: "Lower costs automatically",
        outcome: "Costs do not reduce without accurate checks.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 4,
    prompt: "What is a simple way to check a supplier invoice?",
    options: [
      {
        id: "match-delivery",
        text: "Match the invoice with delivered goods",
        outcome: "Correct. Matching prevents wrong payments.",
        isCorrect: true,
      },
      {
        id: "pay-first",
        text: "Pay first and check later",
        outcome: "Checking after payment is risky.",
        isCorrect: false,
      },
      {
        id: "ignore-details",
        text: "Ignore item details",
        outcome: "Details are essential for accuracy.",
        isCorrect: false,
      },
      {
        id: "trust-only",
        text: "Trust only, no checks needed",
        outcome: "Trust plus verification is safer.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 5,
    prompt: "What is the key takeaway about supplier invoice checks?",
    options: [
      {
        id: "prevent-mistakes",
        text: "Checking invoices prevents mistakes",
        outcome: "Correct. Verification protects profits and trust.",
        isCorrect: true,
      },
      {
        id: "optional",
        text: "Checks are optional",
        outcome: "Checks are essential for accuracy.",
        isCorrect: false,
      },
      {
        id: "delay-pay",
        text: "Always delay payments",
        outcome: "Checks should be prompt and fair.",
        isCorrect: false,
      },
      {
        id: "ignore-small",
        text: "Ignore small differences",
        outcome: "Small differences add up over time.",
        isCorrect: false,
      },
    ],
  },
];

const SupplierInvoiceCheck = () => {
  const location = useLocation();
  const gameId = "finance-business-livelihood-finance-19";
  const gameData = getGameDataById(gameId);
  const totalStages = SUPPLIER_INVOICE_CHECK_STAGES.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const totalCoins = gameData?.coins ?? location.state?.totalCoins ?? 5;
  const coinsPerLevel = Math.max(1, Math.floor(totalCoins / totalStages));
  const totalXp = gameData?.xp ?? location.state?.totalXp ?? 10;
  const stage = SUPPLIER_INVOICE_CHECK_STAGES[currentStageIndex];

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
      title="Supplier Invoice Check"
      subtitle={
        showResult
          ? "Quiz complete! You now know why invoice checks prevent mistakes."
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

export default SupplierInvoiceCheck;
