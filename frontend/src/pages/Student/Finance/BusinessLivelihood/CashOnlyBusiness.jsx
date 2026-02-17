import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const CASH_ONLY_BUSINESS_STAGES = [
  {
    id: 1,
    prompt: "A seller accepts only cash. What opportunity is missed?",
    options: [
      {
        id: "lower-effort",
        text: "Lower effort",
        outcome: "Cash may be simple, but it misses useful records.",
        isCorrect: false,
      },
      {
        id: "digital-record-proof",
        text: "Digital payment record for proof",
        outcome: "Correct. A digital trail builds credibility and proof.",
        isCorrect: true,
      },
      {
        id: "less-responsibility",
        text: "Less responsibility",
        outcome: "Responsibility still exists, but tracking becomes harder.",
        isCorrect: false,
      },
      {
        id: "no-difference",
        text: "No difference",
        outcome: "There is a difference: records and trust improve with digital payments.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 2,
    prompt: "Why do digital payments help a small business grow?",
    options: [
      {
        id: "transaction-history",
        text: "They create a transaction history",
        outcome: "Correct. A clear history supports loans and customer trust.",
        isCorrect: true,
      },
      {
        id: "remove-need-records",
        text: "They remove the need for any records",
        outcome: "Records are still needed for taxes and planning.",
        isCorrect: false,
      },
      {
        id: "guarantee-profit",
        text: "They guarantee profit",
        outcome: "Profit depends on pricing and sales, not just payment method.",
        isCorrect: false,
      },
      {
        id: "avoid-customers",
        text: "They reduce customers",
        outcome: "Digital options often make it easier for customers to pay.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 3,
    prompt: "What is a risk of handling only cash?",
    options: [
      {
        id: "easy-tracking",
        text: "Easier tracking",
        outcome: "Cash is usually harder to track without receipts.",
        isCorrect: false,
      },
      {
        id: "loss-theft",
        text: "Higher risk of loss or theft without proof",
        outcome: "Correct. Lost cash is hard to recover or prove.",
        isCorrect: true,
      },
      {
        id: "automatic-audits",
        text: "Automatic audits",
        outcome: "Audits are not automatic just because of cash.",
        isCorrect: false,
      },
      {
        id: "no-customers",
        text: "No customers will buy",
        outcome: "Some customers still pay cash, but many prefer digital.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 4,
    prompt: "What is a simple first step to build digital records?",
    options: [
      {
        id: "enable-upi",
        text: "Enable UPI or wallet payments and save receipts",
        outcome: "Correct. Start with one method and keep records.",
        isCorrect: true,
      },
      {
        id: "ignore-transactions",
        text: "Ignore transaction details",
        outcome: "Ignoring details defeats the purpose of records.",
        isCorrect: false,
      },
      {
        id: "cash-only-sign",
        text: "Put a cash-only sign",
        outcome: "That blocks digital history and limits options.",
        isCorrect: false,
      },
      {
        id: "delay-forever",
        text: "Delay until business is big",
        outcome: "Early records are more useful than late ones.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 5,
    prompt: "What is the key takeaway about cash-only business?",
    options: [
      {
        id: "mix-payments",
        text: "Add digital payments to create proof and trust",
        outcome: "Correct. A digital trail builds credibility.",
        isCorrect: true,
      },
      {
        id: "cash-best",
        text: "Cash is always best",
        outcome: "Cash can be useful, but records matter.",
        isCorrect: false,
      },
      {
        id: "no-records",
        text: "Records are optional",
        outcome: "Records are essential for healthy business decisions.",
        isCorrect: false,
      },
      {
        id: "digital-only",
        text: "Stop taking cash completely",
        outcome: "Many businesses benefit from offering both options.",
        isCorrect: false,
      },
    ],
  },
];

const CashOnlyBusiness = () => {
  const location = useLocation();
  const gameId = "finance-business-livelihood-finance-3";
  const gameData = getGameDataById(gameId);
  const totalStages = CASH_ONLY_BUSINESS_STAGES.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const totalCoins = gameData?.coins ?? location.state?.totalCoins ?? 5;
  const coinsPerLevel = Math.max(1, Math.floor(totalCoins / totalStages));
  const totalXp = gameData?.xp ?? location.state?.totalXp ?? 10;
  const stage = CASH_ONLY_BUSINESS_STAGES[currentStageIndex];

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
      title="Cash Only Business"
      subtitle={
        showResult
          ? "Quiz complete! You now understand the value of digital payment records."
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

export default CashOnlyBusiness;
