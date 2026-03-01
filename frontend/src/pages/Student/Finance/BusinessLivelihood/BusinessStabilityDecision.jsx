import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const BUSINESS_STABILITY_DECISION_STAGES = [
  {
    id: 1,
    prompt: "Owner considers formalising records. What is long-term impact?",
    options: [
      {
        id: "no-difference",
        text: "No difference",
        outcome: "Formal records create real advantages over time.",
        isCorrect: false,
      },
      {
        id: "scaling-finance",
        text: "Easier scaling and financing",
        outcome: "Correct. Structure supports growth.",
        isCorrect: true,
      },
      {
        id: "less-profit",
        text: "Less profit",
        outcome: "Records help protect and improve profit.",
        isCorrect: false,
      },
      {
        id: "more-stress",
        text: "More stress only",
        outcome: "Good systems reduce stress by adding clarity.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 2,
    prompt: "Why do formal records help with scaling?",
    options: [
      {
        id: "clear-performance",
        text: "They show clear performance and cash flow",
        outcome: "Correct. Clear data enables better decisions.",
        isCorrect: true,
      },
      {
        id: "avoid-customers",
        text: "They help avoid customers",
        outcome: "Records are for clarity, not avoidance.",
        isCorrect: false,
      },
      {
        id: "skip-bills",
        text: "They remove the need for bills",
        outcome: "Bills are still important for proof.",
        isCorrect: false,
      },
      {
        id: "guarantee-growth",
        text: "They guarantee growth",
        outcome: "Records help but do not guarantee growth.",
        isCorrect: false,
      }
    ],
  },
  {
    id: 3,
    prompt: "How do formal records help with financing?",
    options: [
      {
        id: "avoid-banks",
        text: "They help avoid banks",
        outcome: "Records support working with banks.",
        isCorrect: false,
      },
      {
        id: "remove-docs",
        text: "They remove the need for documentation",
        outcome: "Records are the documentation.",
        isCorrect: false,
      },
      {
        id: "increase-interest",
        text: "They increase interest automatically",
        outcome: "Interest depends on risk and terms.",
        isCorrect: false,
      },
      {
        id: "loan-proof",
        text: "They provide income proof for lenders",
        outcome: "Correct. Proof builds lender confidence.",
        isCorrect: true,
      }
    ],
  },
  {
    id: 4,
    prompt: "What is a simple first step to formalise records?",
    options: [
      {
        id: "ignore-expenses",
        text: "Ignore small expenses",
        outcome: "Small expenses add up over time.",
        isCorrect: false,
      },
      {
        id: "delay-forever",
        text: "Delay record-keeping forever",
        outcome: "Delays reduce growth readiness.",
        isCorrect: false,
      },
      {
        id: "daily-records",
        text: "Maintain daily sales and expense logs",
        outcome: "Correct. Consistent records create structure.",
        isCorrect: true,
      },
      {
        id: "cash-only",
        text: "Use cash only and skip receipts",
        outcome: "Cash-only reduces proof.",
        isCorrect: false,
      }
    ],
  },
  {
    id: 5,
    prompt: "What is the key takeaway about business stability decision?",
    options: [
      {
        id: "optional",
        text: "Formal records are optional",
        outcome: "Formal records are essential for scaling.",
        isCorrect: false,
      },
      {
        id: "no-impact",
        text: "Records make no impact",
        outcome: "Records improve trust and access to finance.",
        isCorrect: false,
      },
      {
        id: "profit-down",
        text: "Records reduce profit",
        outcome: "Records improve decisions and protect profit.",
        isCorrect: false,
      },
      {
        id: "structure",
        text: "Structure supports growth",
        outcome: "Correct. Formal records enable stability and expansion.",
        isCorrect: true,
      }
    ],
  },
];

const BusinessStabilityDecision = () => {
  const location = useLocation();
  const gameId = "finance-business-livelihood-finance-87";
  const gameData = getGameDataById(gameId);
  const totalStages = BUSINESS_STABILITY_DECISION_STAGES.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const totalCoins = gameData?.coins ?? location.state?.totalCoins ?? 10;
  const coinsPerLevel = Math.max(1, Math.floor(totalCoins / totalStages));
  const totalXp = gameData?.xp ?? location.state?.totalXp ?? 20;
  const stage = BUSINESS_STABILITY_DECISION_STAGES[currentStageIndex];

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
      title="Business Stability Decision"
      subtitle={
        showResult
          ? "Quiz complete! You now know how structure supports growth."
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

export default BusinessStabilityDecision;
