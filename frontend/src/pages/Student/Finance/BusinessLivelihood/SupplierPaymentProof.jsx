import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const SUPPLIER_PAYMENT_PROOF_STAGES = [
  {
    id: 1,
    prompt: "A supplier claims payment not received. What helps resolve dispute?",
    options: [
      {
        id: "verbal-promise",
        text: "Verbal promise",
        outcome: "Verbal promises are hard to prove later.",
        isCorrect: false,
      },
      {
        id: "payment-proof",
        text: "Written or digital payment proof",
        outcome: "Correct. Proof prevents financial disputes.",
        isCorrect: true,
      },
      {
        id: "memory",
        text: "Memory",
        outcome: "Memory fades and can be disputed.",
        isCorrect: false,
      },
      {
        id: "guessing",
        text: "Guessing",
        outcome: "Guessing never resolves disputes.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 2,
    prompt: "Why is digital payment proof helpful?",
    options: [
      {
        id: "time-stamp",
        text: "It shows date, time, and amount",
        outcome: "Correct. A timestamped trail is reliable.",
        isCorrect: true,
      },
      {
        id: "avoid-supplier",
        text: "It avoids suppliers",
        outcome: "Proof helps relationships, not avoidance.",
        isCorrect: false,
      },
      {
        id: "skip-records",
        text: "It removes the need for records",
        outcome: "Records are still needed for clarity.",
        isCorrect: false,
      },
      {
        id: "increase-cost",
        text: "It increases costs automatically",
        outcome: "Costs depend on terms, not on having proof.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 3,
    prompt: "What is a common result of missing payment proof?",
    options: [
      {
        id: "smooth-relationship",
        text: "Smooth relationship always",
        outcome: "Without proof, relationships can be strained.",
        isCorrect: false,
      },
      {
        id: "disputes-delay",
        text: "Disputes and delayed supplies",
        outcome: "Correct. Disputes can delay future deliveries.",
        isCorrect: true,
      },
      {
        id: "lower-prices",
        text: "Lower prices",
        outcome: "Prices are not reduced because of missing proof.",
        isCorrect: false,
      },
      {
        id: "extra-credit",
        text: "Extra credit lines",
        outcome: "Credit lines usually require stronger proof.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 4,
    prompt: "What is a simple practice to avoid payment disputes?",
    options: [
      {
        id: "save-receipts",
        text: "Save receipts or UPI screenshots",
        outcome: "Correct. Simple proof saves time later.",
        isCorrect: true,
      },
      {
        id: "delete-messages",
        text: "Delete payment messages",
        outcome: "Deleting records removes proof.",
        isCorrect: false,
      },
      {
        id: "cash-only",
        text: "Pay only in cash with no notes",
        outcome: "Cash without notes is hard to prove.",
        isCorrect: false,
      },
      {
        id: "trust-only",
        text: "Rely only on trust",
        outcome: "Trust helps, but proof protects both sides.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 5,
    prompt: "What is the key takeaway about supplier payment proof?",
    options: [
      {
        id: "proof-prevents",
        text: "Proof prevents financial disputes",
        outcome: "Correct. Documentation keeps supplier relationships strong.",
        isCorrect: true,
      },
      {
        id: "records-optional",
        text: "Records are optional",
        outcome: "Records are essential for clarity.",
        isCorrect: false,
      },
      {
        id: "memory-enough",
        text: "Memory is enough",
        outcome: "Memory is unreliable for disputes.",
        isCorrect: false,
      },
      {
        id: "verbal-best",
        text: "Verbal promises are best",
        outcome: "Written proof is safer than verbal promises.",
        isCorrect: false,
      },
    ],
  },
];

const SupplierPaymentProof = () => {
  const location = useLocation();
  const gameId = "finance-business-livelihood-finance-11";
  const gameData = getGameDataById(gameId);
  const totalStages = SUPPLIER_PAYMENT_PROOF_STAGES.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const totalCoins = gameData?.coins ?? location.state?.totalCoins ?? 5;
  const coinsPerLevel = Math.max(1, Math.floor(totalCoins / totalStages));
  const totalXp = gameData?.xp ?? location.state?.totalXp ?? 10;
  const stage = SUPPLIER_PAYMENT_PROOF_STAGES[currentStageIndex];

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
      title="Supplier Payment Proof"
      subtitle={
        showResult
          ? "Quiz complete! You now know why proof prevents disputes."
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

export default SupplierPaymentProof;
