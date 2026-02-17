import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const INVOICE_REFUSAL_STAGES = [
  {
    id: 1,
    prompt: "A customer asks for a bill, but the shopkeeper refuses. What could this affect?",
    options: [
      {
        id: "nothing",
        text: "Nothing",
        outcome: "Refusing a bill can reduce trust and clarity.",
        isCorrect: false,
      },
      {
        id: "trust-proof",
        text: "Customer trust and legal proof",
        outcome: "Correct. Bills increase trust and provide legal proof.",
        isCorrect: true,
      },
      {
        id: "shop-decoration",
        text: "Shop decoration",
        outcome: "Decoration does not change the need for a bill.",
        isCorrect: false,
      },
      {
        id: "internet-speed",
        text: "Internet speed",
        outcome: "Invoices are about records, not internet speed.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 2,
    prompt: "Why do customers value getting a bill?",
    options: [
      {
        id: "proof-purchase",
        text: "It proves the purchase and price",
        outcome: "Correct. A bill is proof of what was sold and paid.",
        isCorrect: true,
      },
      {
        id: "avoid-payment",
        text: "It helps avoid paying",
        outcome: "Bills are for proof, not avoiding payment.",
        isCorrect: false,
      },
      {
        id: "decorate-wallet",
        text: "It decorates their wallet",
        outcome: "Bills are for records, not decoration.",
        isCorrect: false,
      },
      {
        id: "skip-tax",
        text: "It skips taxes",
        outcome: "Bills help comply with taxes rather than avoid them.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 3,
    prompt: "What is a risk for a business that refuses to issue bills?",
    options: [
      {
        id: "better-credibility",
        text: "Better credibility",
        outcome: "Credibility usually improves when bills are provided.",
        isCorrect: false,
      },
      {
        id: "disputes",
        text: "More disputes and weak records",
        outcome: "Correct. Without bills, disputes are harder to resolve.",
        isCorrect: true,
      },
      {
        id: "faster-service",
        text: "Always faster service",
        outcome: "Bills can be simple and quick with basic tools.",
        isCorrect: false,
      },
      {
        id: "lower-costs",
        text: "Lower costs automatically",
        outcome: "Costs depend on operations, not billing alone.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 4,
    prompt: "What is a simple way to start issuing bills?",
    options: [
      {
        id: "simple-receipts",
        text: "Use a simple receipt book or digital bill",
        outcome: "Correct. Even basic receipts create proof.",
        isCorrect: true,
      },
      {
        id: "avoid-records",
        text: "Avoid records and trust memory",
        outcome: "Memory creates confusion and disputes.",
        isCorrect: false,
      },
      {
        id: "no-bills-ever",
        text: "Never issue bills to save time",
        outcome: "Skipping bills reduces trust and clarity.",
        isCorrect: false,
      },
      {
        id: "charge-extra",
        text: "Charge extra only for bills",
        outcome: "Bills should be standard practice, not a penalty.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 5,
    prompt: "What is the key takeaway about invoice refusal?",
    options: [
      {
        id: "issue-bills",
        text: "Issue bills to build trust and transparency",
        outcome: "Correct. Bills increase trust and protect both sides.",
        isCorrect: true,
      },
      {
        id: "skip-bills",
        text: "Skip bills to save time",
        outcome: "Skipping bills often costs trust and causes disputes.",
        isCorrect: false,
      },
      {
        id: "bills-optional",
        text: "Bills are optional for small shops",
        outcome: "Even small shops benefit from clear records.",
        isCorrect: false,
      },
      {
        id: "only-digital",
        text: "Only large businesses need invoices",
        outcome: "Any business can use basic receipts.",
        isCorrect: false,
      },
    ],
  },
];

const InvoiceRefusal = () => {
  const location = useLocation();
  const gameId = "finance-business-livelihood-finance-4";
  const gameData = getGameDataById(gameId);
  const totalStages = INVOICE_REFUSAL_STAGES.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const totalCoins = gameData?.coins ?? location.state?.totalCoins ?? 5;
  const coinsPerLevel = Math.max(1, Math.floor(totalCoins / totalStages));
  const totalXp = gameData?.xp ?? location.state?.totalXp ?? 10;
  const stage = INVOICE_REFUSAL_STAGES[currentStageIndex];

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
      title="Invoice Refusal"
      subtitle={
        showResult
          ? "Quiz complete! You now know why issuing bills builds trust."
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

export default InvoiceRefusal;
