import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const SUPPLIER_CREDIT_TERMS_STAGES = [
  {
    id: 1,
    prompt: "Supplier offers credit only to businesses with records. Why?",
    options: [
      {
        id: "preference-only",
        text: "Preference only",
        outcome: "Records reduce risk, not just preference.",
        isCorrect: false,
      },
      {
        id: "reliability",
        text: "Records show reliability and repayment ability",
        outcome: "Correct. Data builds trust in business relationships.",
        isCorrect: true,
      },
      {
        id: "decoration",
        text: "Decoration",
        outcome: "Records are for proof, not decoration.",
        isCorrect: false,
      },
      {
        id: "random-choice",
        text: "Random choice",
        outcome: "Credit decisions are based on risk, not randomness.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 2,
    prompt: "How do records help suppliers offer credit?",
    options: [
      {
        id: "payment-history",
        text: "They show payment history and cash flow",
        outcome: "Correct. History reduces repayment risk.",
        isCorrect: true,
      },
      {
        id: "avoid-suppliers",
        text: "They help avoid suppliers",
        outcome: "Records build trust, not avoidance.",
        isCorrect: false,
      },
      {
        id: "skip-contracts",
        text: "They remove the need for contracts",
        outcome: "Contracts still matter for credit terms.",
        isCorrect: false,
      },
      {
        id: "increase-prices",
        text: "They increase prices",
        outcome: "Prices depend on terms, not record-keeping alone.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 3,
    prompt: "What risk grows without records?",
    options: [
      {
        id: "credit-disputes",
        text: "Credit disputes and repayment confusion",
        outcome: "Correct. Missing records create conflicts.",
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
        outcome: "Growth needs trust and clarity.",
        isCorrect: false,
      },
      {
        id: "no-risk",
        text: "No risk at all",
        outcome: "There is real risk without records.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 4,
    prompt: "What is a simple habit that improves credit terms?",
    options: [
      {
        id: "save-receipts",
        text: "Save invoices and payment receipts",
        outcome: "Correct. Proof strengthens trust.",
        isCorrect: true,
      },
      {
        id: "verbal-only",
        text: "Keep everything verbal",
        outcome: "Verbal terms are hard to prove.",
        isCorrect: false,
      },
      {
        id: "delay-payments",
        text: "Delay payments without updates",
        outcome: "Delays without clarity harm trust.",
        isCorrect: false,
      },
      {
        id: "ignore-bills",
        text: "Ignore supplier bills",
        outcome: "Ignoring bills leads to disputes.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 5,
    prompt: "What is the key takeaway about supplier credit terms?",
    options: [
      {
        id: "data-trust",
        text: "Data builds trust in business relationships",
        outcome: "Correct. Records improve credit access.",
        isCorrect: true,
      },
      {
        id: "optional",
        text: "Records are optional",
        outcome: "Records are essential for credit trust.",
        isCorrect: false,
      },
      {
        id: "trust-only",
        text: "Trust alone is enough",
        outcome: "Trust plus proof is safer.",
        isCorrect: false,
      },
      {
        id: "no-impact",
        text: "Records make no impact",
        outcome: "Records directly impact credit decisions.",
        isCorrect: false,
      },
    ],
  },
];

const SupplierCreditTerms = () => {
  const location = useLocation();
  const gameId = "finance-business-livelihood-finance-47";
  const gameData = getGameDataById(gameId);
  const totalStages = SUPPLIER_CREDIT_TERMS_STAGES.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const totalCoins = gameData?.coins ?? location.state?.totalCoins ?? 10;
  const coinsPerLevel = Math.max(1, Math.floor(totalCoins / totalStages));
  const totalXp = gameData?.xp ?? location.state?.totalXp ?? 20;
  const stage = SUPPLIER_CREDIT_TERMS_STAGES[currentStageIndex];

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
      title="Supplier Credit Terms"
      subtitle={
        showResult
          ? "Quiz complete! You now know why data builds trust."
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

export default SupplierCreditTerms;
