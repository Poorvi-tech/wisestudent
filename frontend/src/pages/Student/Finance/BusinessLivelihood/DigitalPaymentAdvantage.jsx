import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const DIGITAL_PAYMENT_ADVANTAGE_STAGES = [
  {
    id: 1,
    prompt: "A customer pays via UPI. What benefit does this give business?",
    options: [
      {
        id: "no-benefit",
        text: "No benefit",
        outcome: "Digital payments create records and trust.",
        isCorrect: false,
      },
      {
        id: "transaction-record",
        text: "Automatic transaction record",
        outcome: "Correct. Digital payments build financial history.",
        isCorrect: true,
      },
      {
        id: "higher-tax",
        text: "Higher tax only",
        outcome: "Taxes depend on income, not just payment method.",
        isCorrect: false,
      },
      {
        id: "more-work",
        text: "More work",
        outcome: "Digital tools often simplify tracking.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 2,
    prompt: "Why does a transaction record help a business?",
    options: [
      {
        id: "loan-proof",
        text: "It shows proof of income for loans",
        outcome: "Correct. Records support access to formal finance.",
        isCorrect: true,
      },
      {
        id: "reduce-customers",
        text: "It reduces customers",
        outcome: "Digital options often attract more customers.",
        isCorrect: false,
      },
      {
        id: "avoid-receipts",
        text: "It removes the need for receipts",
        outcome: "Receipts and records still matter.",
        isCorrect: false,
      },
      {
        id: "guarantee-profit",
        text: "It guarantees profit",
        outcome: "Profit depends on sales and costs.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 3,
    prompt: "What is another advantage of accepting digital payments?",
    options: [
      {
        id: "faster-settlement",
        text: "Clearer settlement and fewer cash handling risks",
        outcome: "Correct. It reduces cash loss and counting errors.",
        isCorrect: true,
      },
      {
        id: "no-need-bank",
        text: "No need for a bank account",
        outcome: "A bank account usually supports digital payments.",
        isCorrect: false,
      },
      {
        id: "zero-records",
        text: "Zero records",
        outcome: "Digital payments create records automatically.",
        isCorrect: false,
      },
      {
        id: "only-big-shops",
        text: "Only big shops benefit",
        outcome: "Small shops benefit as well.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 4,
    prompt: "What is a simple way to start accepting UPI?",
    options: [
      {
        id: "upi-qr",
        text: "Create a UPI QR and keep transaction slips",
        outcome: "Correct. A QR code and records are a strong start.",
        isCorrect: true,
      },
      {
        id: "cash-only",
        text: "Continue cash-only and ignore UPI",
        outcome: "Ignoring UPI can limit record-building.",
        isCorrect: false,
      },
      {
        id: "share-otp",
        text: "Share OTP with customers",
        outcome: "Never share OTPs. It is unsafe.",
        isCorrect: false,
      },
      {
        id: "delay-setup",
        text: "Delay until business grows",
        outcome: "Early records are valuable for growth.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 5,
    prompt: "What is the key takeaway about digital payment advantage?",
    options: [
      {
        id: "build-history",
        text: "Digital payments build financial history",
        outcome: "Correct. Records improve credibility and access.",
        isCorrect: true,
      },
      {
        id: "no-benefit",
        text: "Digital payments have no benefit",
        outcome: "They help create records and reduce cash risks.",
        isCorrect: false,
      },
      {
        id: "only-tax",
        text: "They only increase taxes",
        outcome: "Taxes depend on income, not payment method alone.",
        isCorrect: false,
      },
      {
        id: "avoid-digital",
        text: "Avoid digital payments always",
        outcome: "Offering digital options can build trust and history.",
        isCorrect: false,
      },
    ],
  },
];

const DigitalPaymentAdvantage = () => {
  const location = useLocation();
  const gameId = "finance-business-livelihood-finance-7";
  const gameData = getGameDataById(gameId);
  const totalStages = DIGITAL_PAYMENT_ADVANTAGE_STAGES.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const totalCoins = gameData?.coins ?? location.state?.totalCoins ?? 5;
  const coinsPerLevel = Math.max(1, Math.floor(totalCoins / totalStages));
  const totalXp = gameData?.xp ?? location.state?.totalXp ?? 10;
  const stage = DIGITAL_PAYMENT_ADVANTAGE_STAGES[currentStageIndex];

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
      title="Digital Payment Advantage"
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

export default DigitalPaymentAdvantage;
