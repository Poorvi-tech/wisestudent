import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const PREMIUM_CONFUSION_STAGES = [
  {
    id: 1,
    prompt: "Someone says insurance premium is wasted money. What's true?",
    options: [
      {
        id: "premium-loss",
        text: "Premium is loss",
        outcome:
          "Premiums are paid for protection against big financial shocks.",
        isCorrect: false,
      },
      {
        id: "buys-safety",
        text: "Premium buys safety",
        outcome:
          "Correct. Insurance is about protection, not returns.",
        isCorrect: true,
      },
      {
        id: "guaranteed-profit",
        text: "Premium guarantees profit",
        outcome:
          "Insurance is not a guaranteed profit product.",
        isCorrect: false,
      },
      {
        id: "always-optional",
        text: "Premium is optional always",
        outcome:
          "Premiums are required to keep coverage active.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 2,
    prompt: "What is the main value of paying a premium?",
    options: [
      {
        id: "profit",
        text: "To earn a sure profit",
        outcome:
          "Insurance is about protection, not guaranteed profit.",
        isCorrect: false,
      },
      {
        id: "free-care",
        text: "To make all services free",
        outcome:
          "Coverage depends on policy terms and limits.",
        isCorrect: false,
      },
      {
        id: "risk-transfer",
        text: "To transfer major risk to the insurer",
        outcome:
          "Correct. The premium funds protection against big losses.",
        isCorrect: true,
      },
      {
        id: "stop-budgeting",
        text: "To stop budgeting",
        outcome:
          "You still need a budget to manage expenses and premiums.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 3,
    prompt: "Why do people compare premiums to a safety net?",
    options: [
      {
        id: "avoid-shock",
        text: "They help avoid huge financial shocks",
        outcome:
          "Correct. Insurance reduces the impact of big unexpected costs.",
        isCorrect: true,
      },
      {
        id: "refund-every-time",
        text: "You always get premiums back",
        outcome:
          "Premiums are not always refunded; the value is protection.",
        isCorrect: false,
      },
      {
        id: "no-risk",
        text: "They remove all risk from life",
        outcome:
          "Risks still exist; insurance only reduces financial impact.",
        isCorrect: false,
      },
      {
        id: "increase-income",
        text: "They increase monthly income",
        outcome:
          "Insurance does not increase income.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 4,
    prompt: "When can a premium feel 'wasted' but still be valuable?",
    options: [
      {
        id: "late-payment",
        text: "When you pay late",
        outcome:
          "Late payment can cause coverage gaps.",
        isCorrect: false,
      },
      {
        id: "unlimited-claims",
        text: "When you file unlimited claims",
        outcome:
          "Claims are subject to policy limits and terms.",
        isCorrect: false,
      },
      {
        id: "skip-policy",
        text: "When you skip the policy",
        outcome:
          "Skipping coverage removes protection.",
        isCorrect: false,
      },
      {
        id: "no-claim",
        text: "When no claim is needed",
        outcome:
          "Correct. Not needing a claim is good, and the coverage still protected you.",
        isCorrect: true,
      },
    ],
  },
  {
    id: 5,
    prompt: "What is the most accurate way to view insurance premiums?",
    options: [
      {
        id: "investment-only",
        text: "As an investment that must pay back",
        outcome:
          "Insurance is primarily risk protection, not investment.",
        isCorrect: false,
      },
      {
        id: "protection-cost",
        text: "As the cost of protection against big risks",
        outcome:
          "Correct. Premiums fund protection against large losses.",
        isCorrect: true,
      },
      {
        id: "fee-for-profit",
        text: "As a fee for guaranteed profit",
        outcome:
          "No guarantee of profit exists in standard insurance.",
        isCorrect: false,
      },
      {
        id: "optional-bonus",
        text: "As an optional bonus payment",
        outcome:
          "Premiums are required to keep coverage active.",
        isCorrect: false,
      },
    ],
  },
];

const PremiumConfusion = () => {
  const location = useLocation();
  const gameId = "finance-insurance-pension-9";
  const gameData = getGameDataById(gameId);
  const totalStages = PREMIUM_CONFUSION_STAGES.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const totalCoins = gameData?.coins ?? location.state?.totalCoins ?? 5;
  const coinsPerLevel = Math.max(1, Math.floor(totalCoins / totalStages));
  const totalXp = gameData?.xp ?? location.state?.totalXp ?? 10;
  const stage = PREMIUM_CONFUSION_STAGES[currentStageIndex];

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
      title="Premium Confusion"
      subtitle={
        showResult
          ? "Quiz complete! You understand premiums as protection."
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

export default PremiumConfusion;
