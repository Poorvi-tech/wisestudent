import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const FORMAL_REGISTRATION_ADVANTAGE_STAGES = [
  {
    id: 1,
    prompt: "A business registers officially. What benefit can this bring?",
    options: [
      {
        id: "no-benefit",
        text: "No benefit",
        outcome: "Registration can unlock real opportunities.",
        isCorrect: false,
      },
      {
        id: "more-expenses",
        text: "More expenses only",
        outcome: "There may be some costs, but benefits are significant.",
        isCorrect: false,
      },
      {
        id: "less-customers",
        text: "Less customers",
        outcome: "Registration does not reduce customers.",
        isCorrect: false,
      },
      {
        id: "access-finance",
        text: "Easier access to finance and contracts",
        outcome: "Correct. Formalisation opens growth opportunities.",
        isCorrect: true,
      }
    ],
  },
  {
    id: 2,
    prompt: "Why do banks prefer registered businesses?",
    options: [
      {
        id: "avoid-customers",
        text: "They avoid customers",
        outcome: "Registration is about credibility, not avoidance.",
        isCorrect: false,
      },
      {
        id: "skip-records",
        text: "They can skip records",
        outcome: "Registered businesses still need strong records.",
        isCorrect: false,
      },
      {
        id: "verified-status",
        text: "They have verified status and records",
        outcome: "Correct. Verified status reduces lender risk.",
        isCorrect: true,
      },
      {
        id: "guarantee-profit",
        text: "They guarantee profit",
        outcome: "Profit depends on operations, not registration alone.",
        isCorrect: false,
      }
    ],
  },
  {
    id: 3,
    prompt: "What is a common advantage of formal registration?",
    options: [
      {
        id: "contract-eligibility",
        text: "Eligibility for contracts and larger clients",
        outcome: "Correct. Many clients require formal registration.",
        isCorrect: true,
      },
      {
        id: "higher-rent",
        text: "Higher rent",
        outcome: "Rent does not increase just because of registration.",
        isCorrect: false,
      },
      {
        id: "less-competition",
        text: "Less competition",
        outcome: "Competition is unrelated to registration.",
        isCorrect: false,
      },
      {
        id: "no-taxes",
        text: "No taxes",
        outcome: "Registration does not remove tax obligations.",
        isCorrect: false,
      }
    ],
  },
  {
    id: 4,
    prompt: "What is a smart first step to formalize a business?",
    options: [
      {
        id: "ignore-docs",
        text: "Ignore documentation",
        outcome: "Documentation is essential for registration.",
        isCorrect: false,
      },
      {
        id: "learn-requirements",
        text: "Learn registration requirements and start basic records",
        outcome: "Correct. Understanding requirements is a strong first step.",
        isCorrect: true,
      },
      {
        id: "delay-forever",
        text: "Delay until growth stops",
        outcome: "Formalizing earlier supports growth.",
        isCorrect: false,
      },
      {
        id: "cash-only",
        text: "Keep everything cash-only",
        outcome: "Cash-only makes proof harder.",
        isCorrect: false,
      }
    ],
  },
  {
    id: 5,
    prompt: "What is the key takeaway about formal registration advantage?",
    options: [
      {
        id: "opens-growth",
        text: "Formalisation opens growth opportunities",
        outcome: "Correct. Registration improves access and credibility.",
        isCorrect: true,
      },
      {
        id: "optional",
        text: "Registration is optional for growth",
        outcome: "Formal status often helps growth significantly.",
        isCorrect: false,
      },
      {
        id: "no-impact",
        text: "Registration makes no impact",
        outcome: "Registration improves trust and access.",
        isCorrect: false,
      },
      {
        id: "only-costs",
        text: "Registration only adds costs",
        outcome: "Costs exist, but benefits outweigh them.",
        isCorrect: false,
      }
    ],
  },
];

const FormalRegistrationAdvantage = () => {
  const location = useLocation();
  const gameId = "finance-business-livelihood-finance-61";
  const gameData = getGameDataById(gameId);
  const totalStages = FORMAL_REGISTRATION_ADVANTAGE_STAGES.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const totalCoins = gameData?.coins ?? location.state?.totalCoins ?? 10;
  const coinsPerLevel = Math.max(1, Math.floor(totalCoins / totalStages));
  const totalXp = gameData?.xp ?? location.state?.totalXp ?? 20;
  const stage = FORMAL_REGISTRATION_ADVANTAGE_STAGES[currentStageIndex];

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
      title="Formal Registration Advantage"
      subtitle={
        showResult
          ? "Quiz complete! You now know how formalisation opens growth opportunities."
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

export default FormalRegistrationAdvantage;
