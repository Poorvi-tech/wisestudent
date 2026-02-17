import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const BUSINESS_VS_PERSONAL_LOAN_USE_STAGES = [
  {
    id: 1,
    prompt: "Owner uses business loan for family wedding. What risk arises?",
    options: [
      {
        id: "no-risk",
        text: "No risk",
        outcome: "Using business loans for personal use creates real risk.",
        isCorrect: false,
      },
      {
        id: "cash-shortage",
        text: "Business cash shortage and repayment stress",
        outcome: "Correct. Loans should match their purpose.",
        isCorrect: true,
      },
      {
        id: "faster-growth",
        text: "Faster growth",
        outcome: "Personal spending does not grow the business.",
        isCorrect: false,
      },
      {
        id: "tax-reduction",
        text: "Tax reduction",
        outcome: "Misuse does not reduce taxes and can increase risk.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 2,
    prompt: "Why should a business loan be used only for business needs?",
    options: [
      {
        id: "cash-flow",
        text: "It protects cash flow and business stability",
        outcome: "Correct. Purpose-based use keeps cash healthy.",
        isCorrect: true,
      },
      {
        id: "avoid-customers",
        text: "It helps avoid customers",
        outcome: "Loan use is about cash control, not customers.",
        isCorrect: false,
      },
      {
        id: "skip-records",
        text: "It removes the need for records",
        outcome: "Records are still essential.",
        isCorrect: false,
      },
      {
        id: "increase-loans",
        text: "It guarantees more loans",
        outcome: "Good use helps reputation but does not guarantee loans.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 3,
    prompt: "What is a likely outcome of mixing personal expenses with business loan money?",
    options: [
      {
        id: "repayment-stress",
        text: "Repayment becomes harder",
        outcome: "Correct. Business funds get diverted.",
        isCorrect: true,
      },
      {
        id: "more-profit",
        text: "More profit automatically",
        outcome: "Profit does not increase with misuse.",
        isCorrect: false,
      },
      {
        id: "no-impact",
        text: "No impact",
        outcome: "Misuse impacts cash flow and credit.",
        isCorrect: false,
      },
      {
        id: "lower-interest",
        text: "Lower interest rates",
        outcome: "Interest depends on lender terms, not misuse.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 4,
    prompt: "What is a smart practice when taking a business loan?",
    options: [
      {
        id: "plan-use",
        text: "Plan loan use for business goals and track spending",
        outcome: "Correct. Planning keeps the loan productive.",
        isCorrect: true,
      },
      {
        id: "personal-use",
        text: "Use part of it for personal needs",
        outcome: "Mixing personal use increases risk.",
        isCorrect: false,
      },
      {
        id: "no-records",
        text: "Avoid keeping records",
        outcome: "Records are essential for accountability.",
        isCorrect: false,
      },
      {
        id: "delay-repay",
        text: "Delay repayments if sales are good",
        outcome: "Delays can hurt credit and relationships.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 5,
    prompt: "What is the key takeaway about business vs personal loan use?",
    options: [
      {
        id: "match-purpose",
        text: "Loans should match their purpose",
        outcome: "Correct. Proper use protects cash and credit.",
        isCorrect: true,
      },
      {
        id: "optional",
        text: "Purpose does not matter",
        outcome: "Purpose matters for stability and repayment.",
        isCorrect: false,
      },
      {
        id: "no-risk",
        text: "Personal use has no risk",
        outcome: "Personal use raises business risk.",
        isCorrect: false,
      },
      {
        id: "only-big",
        text: "Only big businesses need to be careful",
        outcome: "Small businesses are even more sensitive to misuse.",
        isCorrect: false,
      },
    ],
  },
];

const BusinessVsPersonalLoanUse = () => {
  const location = useLocation();
  const gameId = "finance-business-livelihood-finance-35";
  const gameData = getGameDataById(gameId);
  const totalStages = BUSINESS_VS_PERSONAL_LOAN_USE_STAGES.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const totalCoins = gameData?.coins ?? location.state?.totalCoins ?? 10;
  const coinsPerLevel = Math.max(1, Math.floor(totalCoins / totalStages));
  const totalXp = gameData?.xp ?? location.state?.totalXp ?? 20;
  const stage = BUSINESS_VS_PERSONAL_LOAN_USE_STAGES[currentStageIndex];

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
      title="Business vs Personal Loan Use"
      subtitle={
        showResult
          ? "Quiz complete! You now know why loans must match their purpose."
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

export default BusinessVsPersonalLoanUse;
