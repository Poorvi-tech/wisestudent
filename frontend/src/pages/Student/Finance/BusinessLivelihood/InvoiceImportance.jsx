import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const INVOICE_IMPORTANCE_STAGES = [
  {
    id: 1,
    prompt: "Customer wants invoice for warranty claim. Why is invoice useful?",
    options: [
      {
        id: "decoration",
        text: "Decoration",
        outcome: "Invoices are for proof, not decoration.",
        isCorrect: false,
      },
      {
        id: "legal-proof",
        text: "Legal proof of transaction",
        outcome: "Correct. Invoice protects both buyer and seller.",
        isCorrect: true,
      },
      {
        id: "advertising",
        text: "Advertising",
        outcome: "Invoices are records, not advertisements.",
        isCorrect: false,
      },
      {
        id: "payment-delay",
        text: "Payment delay",
        outcome: "Invoices are for proof, not delaying payments.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 2,
    prompt: "How does an invoice help a buyer?",
    options: [
      {
        id: "warranty-claim",
        text: "It supports warranty and return claims",
        outcome: "Correct. Buyers need proof of purchase.",
        isCorrect: true,
      },
      {
        id: "avoid-payment",
        text: "It helps avoid payment",
        outcome: "Invoices confirm payment, not avoid it.",
        isCorrect: false,
      },
      {
        id: "increase-price",
        text: "It increases the price automatically",
        outcome: "Invoices do not increase prices.",
        isCorrect: false,
      },
      {
        id: "skip-records",
        text: "It removes the need for records",
        outcome: "Invoices are part of proper records.",
        isCorrect: false,
      }
    ],
  },
  {
    id: 3,
    prompt: "How does an invoice help the seller?",
    options: [
      {
        id: "avoid-tax",
        text: "It avoids tax rules",
        outcome: "Invoices help compliance, not avoidance.",
        isCorrect: false,
      },
      {
        id: "hide-income",
        text: "It hides income",
        outcome: "Invoices document income clearly.",
        isCorrect: false,
      },
      {
        id: "no-customer",
        text: "It prevents customers",
        outcome: "Invoices build trust with customers.",
        isCorrect: false,
      },
      {
        id: "proof-sale",
        text: "It provides proof of sale and reduces disputes",
        outcome: "Correct. Proof helps resolve misunderstandings.",
        isCorrect: true,
      }
    ],
  },
  {
    id: 4,
    prompt: "What is a simple way to issue invoices?",
    options: [
      {
        id: "verbal-only",
        text: "Give verbal confirmation only",
        outcome: "Verbal confirmation is hard to prove later.",
        isCorrect: false,
      },
      {
        id: "no-invoices",
        text: "Avoid invoices to save time",
        outcome: "Skipping invoices reduces trust and clarity.",
        isCorrect: false,
      },
      {
        id: "receipt-book",
        text: "Use a simple receipt book or digital bill",
        outcome: "Correct. Even simple invoices create proof.",
        isCorrect: true,
      },
      {
        id: "charge-extra",
        text: "Charge extra only for invoices",
        outcome: "Invoices should be standard practice.",
        isCorrect: false,
      }
    ],
  },
  {
    id: 5,
    prompt: "What is the key takeaway about invoice importance?",
    options: [
      {
        id: "optional",
        text: "Invoices are optional for small shops",
        outcome: "Small shops benefit from invoices too.",
        isCorrect: false,
      },
      {
        id: "decoration-only",
        text: "Invoices are just decoration",
        outcome: "Invoices are legal and financial records.",
        isCorrect: false,
      },
      {
        id: "delay-payment",
        text: "Invoices delay payments",
        outcome: "Invoices are about proof, not delays.",
        isCorrect: false,
      },
      {
        id: "protects-both",
        text: "Invoices protect both buyer and seller",
        outcome: "Correct. Clear records build trust and safety.",
        isCorrect: true,
      }
    ],
  },
];

const InvoiceImportance = () => {
  const location = useLocation();
  const gameId = "finance-business-livelihood-finance-31";
  const gameData = getGameDataById(gameId);
  const totalStages = INVOICE_IMPORTANCE_STAGES.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const totalCoins = gameData?.coins ?? location.state?.totalCoins ?? 5;
  const coinsPerLevel = Math.max(1, Math.floor(totalCoins / totalStages));
  const totalXp = gameData?.xp ?? location.state?.totalXp ?? 10;
  const stage = INVOICE_IMPORTANCE_STAGES[currentStageIndex];

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
      title="Invoice Importance"
      subtitle={
        showResult
          ? "Quiz complete! You now know why invoices protect both sides."
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

export default InvoiceImportance;
