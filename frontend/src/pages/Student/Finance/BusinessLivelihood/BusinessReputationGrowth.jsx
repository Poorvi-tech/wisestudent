import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const BUSINESS_REPUTATION_GROWTH_STAGES = [
  {
    id: 1,
    prompt: "A shop keeps clear accounts and invoices. What may happen over time?",
    options: [
      {
        id: "no-change",
        text: "No change",
        outcome: "Clear records usually improve trust.",
        isCorrect: false,
      },
      {
        id: "higher-trust",
        text: "Higher trust from customers and banks",
        outcome: "Correct. Credibility compounds over time.",
        isCorrect: true,
      },
      {
        id: "less-profit",
        text: "Less profit",
        outcome: "Records help control costs and protect profit.",
        isCorrect: false,
      },
      {
        id: "fewer-buyers",
        text: "Fewer buyers",
        outcome: "Transparency usually attracts more buyers.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 2,
    prompt: "Why do clear invoices build customer confidence?",
    options: [
      {
        id: "proof",
        text: "They provide proof of purchase",
        outcome: "Correct. Proof reduces disputes.",
        isCorrect: true,
      },
      {
        id: "avoid-customers",
        text: "They help avoid customers",
        outcome: "Invoices build transparency, not avoidance.",
        isCorrect: false,
      },
      {
        id: "increase-price",
        text: "They increase prices automatically",
        outcome: "Invoices do not change prices.",
        isCorrect: false,
      },
      {
        id: "skip-service",
        text: "They replace good service",
        outcome: "Service still matters alongside proof.",
        isCorrect: false,
      }
    ],
  },
  {
    id: 3,
    prompt: "How do clear accounts help with banks?",
    options: [
      {
        id: "avoid-banks",
        text: "They help avoid banks",
        outcome: "Records support working with banks.",
        isCorrect: false,
      },
      {
        id: "skip-records",
        text: "They remove the need for records",
        outcome: "Clear accounts are the records.",
        isCorrect: false,
      },
      {
        id: "show-cashflow",
        text: "They show stable cash flow and repayment capacity",
        outcome: "Correct. Records make lending safer.",
        isCorrect: true,
      },
      {
        id: "guarantee-approval",
        text: "They guarantee loan approval",
        outcome: "Records help but do not guarantee approval.",
        isCorrect: false,
      }
    ],
  },
  {
    id: 4,
    prompt: "What habit supports long-term reputation?",
    options: [
      {
        id: "cash-only",
        text: "Cash-only with no receipts",
        outcome: "No receipts reduce transparency.",
        isCorrect: false,
      },
      {
        id: "delay-bills",
        text: "Issue bills only when asked",
        outcome: "Proactive proof builds stronger trust.",
        isCorrect: false,
      },
      {
        id: "ignore-feedback",
        text: "Ignore customer feedback",
        outcome: "Feedback helps improve reputation.",
        isCorrect: false,
      },
      {
        id: "daily-records",
        text: "Maintain daily sales and expense records",
        outcome: "Correct. Consistency builds trust over time.",
        isCorrect: true,
      }
    ],
  },
  {
    id: 5,
    prompt: "What is the key takeaway about business reputation growth?",
    options: [
      {
        id: "optional",
        text: "Records are optional",
        outcome: "Records are essential for long-term growth.",
        isCorrect: false,
      },
      {
        id: "no-impact",
        text: "Records make no impact",
        outcome: "Records improve trust and access.",
        isCorrect: false,
      },
      {
        id: "credibility-compounds",
        text: "Credibility compounds over time",
        outcome: "Correct. Clear records build lasting trust.",
        isCorrect: true,
      },
      {
        id: "price-only",
        text: "Only price matters",
        outcome: "Trust and proof drive repeat business.",
        isCorrect: false,
      }
    ],
  },
];

const BusinessReputationGrowth = () => {
  const location = useLocation();
  const gameId = "finance-business-livelihood-finance-75";
  const gameData = getGameDataById(gameId);
  const totalStages = BUSINESS_REPUTATION_GROWTH_STAGES.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const totalCoins = gameData?.coins ?? location.state?.totalCoins ?? 10;
  const coinsPerLevel = Math.max(1, Math.floor(totalCoins / totalStages));
  const totalXp = gameData?.xp ?? location.state?.totalXp ?? 20;
  const stage = BUSINESS_REPUTATION_GROWTH_STAGES[currentStageIndex];

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
      title="Business Reputation Growth"
      subtitle={
        showResult
          ? "Quiz complete! You now know how credibility compounds over time."
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

export default BusinessReputationGrowth;
