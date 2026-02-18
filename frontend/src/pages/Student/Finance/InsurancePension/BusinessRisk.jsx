import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const BUSINESS_RISK_STAGES = [
  {
    id: 1,
    prompt: "A shop owner loses stock in a fire. What lesson fits insurance?",
    options: [
      {
        id: "never-happens",
        text: "Business risks never happen",
        outcome:
          "Risks do happen, and losses can be sudden.",
        isCorrect: false,
      },
      {
        id: "income-stability",
        text: "Protection planning helps income stability",
        outcome:
          "Correct. Insurance reduces income shock.",
        isCorrect: true,
      },
      {
        id: "stops-disasters",
        text: "Insurance stops disasters",
        outcome:
          "Insurance doesn't prevent disasters; it reduces financial impact.",
        isCorrect: false,
      },
      {
        id: "loans-solve",
        text: "Loans solve all losses",
        outcome:
          "Loans can add debt and do not replace protection.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 2,
    prompt: "Why is business insurance important for a small shop?",
    options: [
      {
        id: "no-risk",
        text: "Small shops never face losses",
        outcome:
          "Small businesses can face theft, fire, and other risks.",
        isCorrect: false,
      },
      {
        id: "guarantee-profit",
        text: "It guarantees profit every month",
        outcome:
          "Insurance is protection, not guaranteed profit.",
        isCorrect: false,
      },
      {
        id: "avoid-planning",
        text: "It removes the need for planning",
        outcome:
          "Planning is still needed even with insurance.",
        isCorrect: false,
      },
      {
        id: "protects-cashflow",
        text: "It protects cash flow during major losses",
        outcome:
          "Correct. Coverage helps keep the business running.",
        isCorrect: true,
      },
    ],
  },
  {
    id: 3,
    prompt: "Which risk can business insurance help cover?",
    options: [
      {
        id: "fire-theft",
        text: "Fire or theft-related losses",
        outcome:
          "Correct. These are common covered risks.",
        isCorrect: true,
      },
      {
        id: "all-future-profits",
        text: "All future profits guaranteed",
        outcome:
          "Insurance does not guarantee profit.",
        isCorrect: false,
      },
      {
        id: "no-coverage",
        text: "No risks at all",
        outcome:
          "Insurance exists to cover specified risks.",
        isCorrect: false,
      },
      {
        id: "marketing-costs",
        text: "All marketing costs",
        outcome:
          "Marketing costs are generally not insured.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 4,
    prompt: "What should a business owner do before buying a policy?",
    options: [
      {
        id: "skip-terms",
        text: "Skip reading the policy terms",
        outcome:
          "Reading terms avoids unpleasant surprises.",
        isCorrect: false,
      },
      {
        id: "assess-risks",
        text: "Assess business risks and choose coverage",
        outcome:
          "Correct. Coverage should match real risks.",
        isCorrect: true,
      },
      {
        id: "buy-cheapest",
        text: "Buy the cheapest option without checking",
        outcome:
          "Cheap coverage may leave big gaps.",
        isCorrect: false,
      },
      {
        id: "delay-forever",
        text: "Delay the decision forever",
        outcome:
          "Delaying can leave the business exposed.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 5,
    prompt: "What is the main outcome of business insurance?",
    options: [
      {
        id: "prevents-losses",
        text: "It prevents losses from happening",
        outcome:
          "Insurance doesn't prevent loss; it reduces financial impact.",
        isCorrect: false,
      },
      {
        id: "free-money",
        text: "It provides free money anytime",
        outcome:
          "Payouts depend on covered events and terms.",
        isCorrect: false,
      },
      {
        id: "reduces-shock",
        text: "It reduces the income shock after loss",
        outcome:
          "Correct. It helps stabilize income after major events.",
        isCorrect: true,
      },
      {
        id: "no-budget",
        text: "It removes the need for budgeting",
        outcome:
          "Budgeting remains essential for business health.",
        isCorrect: false,
      },
    ],
  },
];

const BusinessRisk = () => {
  const location = useLocation();
  const gameId = "finance-insurance-pension-11";
  const gameData = getGameDataById(gameId);
  const totalStages = BUSINESS_RISK_STAGES.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const totalCoins = gameData?.coins ?? location.state?.totalCoins ?? 5;
  const coinsPerLevel = Math.max(1, Math.floor(totalCoins / totalStages));
  const totalXp = gameData?.xp ?? location.state?.totalXp ?? 10;
  const stage = BUSINESS_RISK_STAGES[currentStageIndex];

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
      title="Business Risk"
      subtitle={
        showResult
          ? "Quiz complete! You understand how insurance reduces income shocks."
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

export default BusinessRisk;
