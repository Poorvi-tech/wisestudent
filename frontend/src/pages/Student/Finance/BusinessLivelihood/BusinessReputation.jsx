import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const BUSINESS_REPUTATION_STAGES = [
  {
    id: 1,
    prompt:
      "A shop gives bills, keeps records, accepts digital payments. What does this improve?",
    options: [
      {
        id: "trust-credibility",
        text: "Trust and credibility",
        outcome: "Correct. Professional habits build reputation.",
        isCorrect: true,
      },
      {
        id: "decoration",
        text: "Decoration",
        outcome: "These habits improve trust, not decoration.",
        isCorrect: false,
      },
      {
        id: "electricity",
        text: "Electricity cost",
        outcome: "Electricity costs are unrelated to record-keeping.",
        isCorrect: false,
      },
      {
        id: "rent",
        text: "Rent",
        outcome: "Rent does not change because of billing habits.",
        isCorrect: false,
      }
    ],
  },
  {
    id: 2,
    prompt: "Why do bills and records increase customer trust?",
    options: [
      {
        id: "avoid-customers",
        text: "They help avoid customers",
        outcome: "Trust grows with transparency, not avoidance.",
        isCorrect: false,
      },
      {
        id: "increase-prices",
        text: "They increase prices",
        outcome: "Records do not automatically increase prices.",
        isCorrect: false,
      },
      {
        id: "skip-service",
        text: "They remove the need for service",
        outcome: "Good service is still required.",
        isCorrect: false,
      },
      {
        id: "proof",
        text: "They provide clear proof of transactions",
        outcome: "Correct. Proof increases confidence.",
        isCorrect: true,
      }
    ],
  },
  {
    id: 3,
    prompt: "How do digital payments help reputation?",
    options: [
      {
        id: "hide-sales",
        text: "They hide sales",
        outcome: "Digital payments create more visible records.",
        isCorrect: false,
      },
      {
        id: "modern",
        text: "They show professionalism and transparency",
        outcome: "Correct. Digital trails show reliability.",
        isCorrect: true,
      },
      {
        id: "reduce-quality",
        text: "They reduce product quality",
        outcome: "Quality depends on products, not payment method.",
        isCorrect: false,
      },
      {
        id: "avoid-taxes",
        text: "They avoid taxes",
        outcome: "Digital records support compliance, not avoidance.",
        isCorrect: false,
      }
    ],
  },
  {
    id: 4,
    prompt: "What is a simple habit that boosts reputation?",
    options: [
      {
        id: "cash-only",
        text: "Only take cash and avoid records",
        outcome: "Cash-only with no records reduces trust.",
        isCorrect: false,
      },
      {
        id: "delay-proof",
        text: "Give proof only when asked",
        outcome: "Proactive proof builds stronger trust.",
        isCorrect: false,
      },
      {
        id: "issue-bills",
        text: "Issue bills and record every sale",
        outcome: "Correct. Consistent records build trust.",
        isCorrect: true,
      },
      {
        id: "ignore-feedback",
        text: "Ignore customer feedback",
        outcome: "Feedback helps improve reputation.",
        isCorrect: false,
      }
    ],
  },
  {
    id: 5,
    prompt: "What is the key takeaway about business reputation?",
    options: [
      {
        id: "records-optional",
        text: "Records are optional",
        outcome: "Records are essential for credibility.",
        isCorrect: false,
      },
      {
        id: "professional-habits",
        text: "Professional habits build reputation",
        outcome: "Correct. Trust grows with transparency and records.",
        isCorrect: true,
      },
      {
        id: "only-ads",
        text: "Reputation comes only from advertising",
        outcome: "Reputation is built through consistent behavior.",
        isCorrect: false,
      },
      {
        id: "no-change",
        text: "Habits do not affect reputation",
        outcome: "Customer experience and records affect trust.",
        isCorrect: false,
      }
    ],
  },
];

const BusinessReputation = () => {
  const location = useLocation();
  const gameId = "finance-business-livelihood-finance-35";
  const gameData = getGameDataById(gameId);
  const totalStages = BUSINESS_REPUTATION_STAGES.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const totalCoins = gameData?.coins ?? location.state?.totalCoins ?? 5;
  const coinsPerLevel = Math.max(1, Math.floor(totalCoins / totalStages));
  const totalXp = gameData?.xp ?? location.state?.totalXp ?? 10;
  const stage = BUSINESS_REPUTATION_STAGES[currentStageIndex];

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
      title="Business Reputation"
      subtitle={
        showResult
          ? "Quiz complete! You now know how professional habits build trust."
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

export default BusinessReputation;
