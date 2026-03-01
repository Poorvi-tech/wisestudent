import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const INFORMAL_EXPANSION_LIMIT_STAGES = [
  {
    id: 1,
    prompt: "A vendor wants to supply to a big company. What is usually required?",
    options: [
      {
        id: "records-invoices",
        text: "Business records and invoices",
        outcome: "Correct. Larger clients need formal documentation.",
        isCorrect: true,
      },
      {
        id: "good-product",
        text: "Only good product",
        outcome: "Quality matters, but documentation is still required.",
        isCorrect: false,
      },
      {
        id: "family-reference",
        text: "Family reference",
        outcome: "References may help, but documentation is essential.",
        isCorrect: false,
      },
      {
        id: "low-price",
        text: "Low price",
        outcome: "Price helps, but formal records are still required.",
        isCorrect: false,
      }
    ],
  },
  {
    id: 2,
    prompt: "Why do large companies ask for invoices?",
    options: [
      {
        id: "avoid-suppliers",
        text: "To avoid suppliers",
        outcome: "Invoices build transparency, not avoidance.",
        isCorrect: false,
      },
      {
        id: "increase-price",
        text: "To increase prices automatically",
        outcome: "Invoices do not change pricing automatically.",
        isCorrect: false,
      },
      {
        id: "skip-records",
        text: "To skip records",
        outcome: "Invoices are records, not a replacement for them.",
        isCorrect: false,
      },
      {
        id: "compliance",
        text: "To meet compliance and audit needs",
        outcome: "Correct. Formal records support compliance.",
        isCorrect: true,
      }
    ],
  },
  {
    id: 3,
    prompt: "What is a common barrier for informal vendors?",
    options: [
      {
        id: "too-many-customers",
        text: "Too many customers",
        outcome: "The issue is documentation, not customer volume.",
        isCorrect: false,
      },
      {
        id: "more-profit",
        text: "More profit automatically",
        outcome: "Profit does not increase without systems.",
        isCorrect: false,
      },
      {
        id: "lack-proof",
        text: "Lack of proof and documentation",
        outcome: "Correct. Missing proof limits partnerships.",
        isCorrect: true,
      },
      {
        id: "no-competition",
        text: "No competition",
        outcome: "Competition is unrelated to documentation.",
        isCorrect: false,
      }
    ],
  },
  {
    id: 4,
    prompt: "What is a simple step to become eligible for large clients?",
    options: [
      {
        id: "cash-only",
        text: "Only accept cash and skip receipts",
        outcome: "Cash-only reduces proof and eligibility.",
        isCorrect: false,
      },
      {
        id: "issue-bills",
        text: "Start issuing bills and keeping records",
        outcome: "Correct. Basic documentation is the first step.",
        isCorrect: true,
      },
      {
        id: "delay-forever",
        text: "Delay formal records",
        outcome: "Delays keep doors closed.",
        isCorrect: false,
      },
      {
        id: "verbal-only",
        text: "Keep everything verbal",
        outcome: "Verbal deals lack proof.",
        isCorrect: false,
      }
    ],
  },
  {
    id: 5,
    prompt: "What is the key takeaway about informal expansion limits?",
    options: [
      {
        id: "optional",
        text: "Documentation is optional",
        outcome: "Documentation is essential for large clients.",
        isCorrect: false,
      },
      {
        id: "price-only",
        text: "Only price matters",
        outcome: "Price helps, but documentation is required.",
        isCorrect: false,
      },
      {
        id: "formal-needed",
        text: "Larger clients need formal documentation",
        outcome: "Correct. Records enable bigger partnerships.",
        isCorrect: true,
      },
      {
        id: "no-impact",
        text: "Records make no impact",
        outcome: "Records directly affect eligibility.",
        isCorrect: false,
      }
    ],
  },
];

const InformalExpansionLimit = () => {
  const location = useLocation();
  const gameId = "finance-business-livelihood-finance-77";
  const gameData = getGameDataById(gameId);
  const totalStages = INFORMAL_EXPANSION_LIMIT_STAGES.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const totalCoins = gameData?.coins ?? location.state?.totalCoins ?? 10;
  const coinsPerLevel = Math.max(1, Math.floor(totalCoins / totalStages));
  const totalXp = gameData?.xp ?? location.state?.totalXp ?? 20;
  const stage = INFORMAL_EXPANSION_LIMIT_STAGES[currentStageIndex];

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
      title="Informal Expansion Limit"
      subtitle={
        showResult
          ? "Quiz complete! You now know why formal documentation enables growth."
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

export default InformalExpansionLimit;
