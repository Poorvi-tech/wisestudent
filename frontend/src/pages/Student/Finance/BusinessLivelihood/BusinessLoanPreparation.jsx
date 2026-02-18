import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const BUSINESS_LOAN_PREPARATION_STAGES = [
  {
    id: 1,
    prompt: "A trader wants to apply for formal loan. What helps approval most?",
    options: [
      {
        id: "transaction-history",
        text: "Transaction history and records",
        outcome: "Correct. Data builds lender confidence.",
        isCorrect: true,
      },
      {
        id: "verbal-promise",
        text: "Verbal promise",
        outcome: "Promises are not enough for formal lenders.",
        isCorrect: false,
      },
      {
        id: "friend-reference",
        text: "Friend reference",
        outcome: "References help, but records matter most.",
        isCorrect: false,
      },
      {
        id: "shop-location",
        text: "Shop location",
        outcome: "Location matters less than financial proof.",
        isCorrect: false,
      }
    ],
  },
  {
    id: 2,
    prompt: "Why do lenders want transaction history?",
    options: [
      {
        id: "delay-approval",
        text: "To delay approval",
        outcome: "History is for assessment, not delay.",
        isCorrect: false,
      },
      {
        id: "avoid-customers",
        text: "To avoid customers",
        outcome: "Lenders are focused on risk and repayment.",
        isCorrect: false,
      },
      {
        id: "repayment-capacity",
        text: "To assess repayment capacity",
        outcome: "Correct. History shows cash flow stability.",
        isCorrect: true,
      },
      {
        id: "skip-docs",
        text: "To skip documentation",
        outcome: "History is part of documentation.",
        isCorrect: false,
      }
    ],
  },
  {
    id: 3,
    prompt: "What record helps a loan application the most?",
    options: [
      {
        id: "verbal-claims",
        text: "Verbal claims of profit",
        outcome: "Verbal claims are hard to verify.",
        isCorrect: false,
      },
      {
        id: "social-proof",
        text: "Social media likes",
        outcome: "Likes do not show repayment capacity.",
        isCorrect: false,
      },
      {
        id: "shop-decor",
        text: "Shop decoration",
        outcome: "Decor does not prove cash flow.",
        isCorrect: false,
      },
      {
        id: "bank-statements",
        text: "Bank statements and sales records",
        outcome: "Correct. These show real business performance.",
        isCorrect: true,
      }
    ],
  },
  {
    id: 4,
    prompt: "What is a simple step to prepare for a loan?",
    options: [
      {
        id: "avoid-bank",
        text: "Avoid banks and keep cash only",
        outcome: "Cash-only makes proof harder.",
        isCorrect: false,
      },
      {
        id: "record-sales",
        text: "Record sales daily and use a business account",
        outcome: "Correct. Consistent records build proof.",
        isCorrect: true,
      },
      {
        id: "delay-records",
        text: "Start records only after applying",
        outcome: "Lenders need history, not just new records.",
        isCorrect: false,
      },
      {
        id: "borrow-informal",
        text: "Borrow informally instead",
        outcome: "Informal loans are risky and lack protection.",
        isCorrect: false,
      }
    ],
  },
  {
    id: 5,
    prompt: "What is the key takeaway about business loan preparation?",
    options: [
      {
        id: "records-optional",
        text: "Records are optional",
        outcome: "Records are essential for loan approval.",
        isCorrect: false,
      },
      {
        id: "promise-enough",
        text: "Promises are enough",
        outcome: "Formal lenders need proof, not promises.",
        isCorrect: false,
      },
      {
        id: "location-only",
        text: "Location matters most",
        outcome: "Location is secondary to financial proof.",
        isCorrect: false,
      },
      {
        id: "data-confidence",
        text: "Data builds lender confidence",
        outcome: "Correct. Records unlock formal finance.",
        isCorrect: true,
      }
    ],
  },
];

const BusinessLoanPreparation = () => {
  const location = useLocation();
  const gameId = "finance-business-livelihood-finance-22";
  const gameData = getGameDataById(gameId);
  const totalStages = BUSINESS_LOAN_PREPARATION_STAGES.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const totalCoins = gameData?.coins ?? location.state?.totalCoins ?? 5;
  const coinsPerLevel = Math.max(1, Math.floor(totalCoins / totalStages));
  const totalXp = gameData?.xp ?? location.state?.totalXp ?? 10;
  const stage = BUSINESS_LOAN_PREPARATION_STAGES[currentStageIndex];

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
      title="Business Loan Preparation"
      subtitle={
        showResult
          ? "Quiz complete! You now know how data builds lender confidence."
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

export default BusinessLoanPreparation;
