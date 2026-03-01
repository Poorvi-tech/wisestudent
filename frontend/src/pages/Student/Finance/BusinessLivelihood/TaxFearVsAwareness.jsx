import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const TAX_FEAR_VS_AWARENESS_STAGES = [
  {
    id: 1,
    prompt: "Owner fears tax rules without understanding them. What is better?",
    options: [
      {
        id: "avoid-knowledge",
        text: "Avoid knowledge",
        outcome: "Avoiding knowledge increases risk and confusion.",
        isCorrect: false,
      },
      {
        id: "close-shop",
        text: "Close shop",
        outcome: "Closing is unnecessary; learning basics is safer.",
        isCorrect: false,
      },
      {
        id: "hide-income",
        text: "Hide income",
        outcome: "Hiding income can lead to penalties and legal issues.",
        isCorrect: false,
      },
      {
        id: "learn-basics",
        text: "Learn basics to stay compliant",
        outcome: "Correct. Awareness reduces anxiety and risk.",
        isCorrect: true,
      }
    ],
  },
  {
    id: 2,
    prompt: "Why does tax awareness help a business owner?",
    options: [
      {
        id: "avoid-penalties",
        text: "It prevents penalties and mistakes",
        outcome: "Correct. Awareness reduces compliance problems.",
        isCorrect: true,
      },
      {
        id: "increase-sales",
        text: "It automatically increases sales",
        outcome: "Sales depend on customers, not tax knowledge.",
        isCorrect: false,
      },
      {
        id: "skip-records",
        text: "It removes the need for records",
        outcome: "Records are still required.",
        isCorrect: false,
      },
      {
        id: "remove-taxes",
        text: "It removes tax obligations",
        outcome: "Awareness does not remove obligations.",
        isCorrect: false,
      }
    ],
  },
  {
    id: 3,
    prompt: "What risk grows when tax rules are ignored?",
    options: [
      {
        id: "more-profit",
        text: "More profit automatically",
        outcome: "Ignoring rules does not increase profit.",
        isCorrect: false,
      },
      {
        id: "faster-loans",
        text: "Faster loan approval",
        outcome: "Loans require clean records and compliance.",
        isCorrect: false,
      },
      {
        id: "penalties",
        text: "Penalties and compliance trouble",
        outcome: "Correct. Ignoring rules creates avoidable risks.",
        isCorrect: true,
      },
      {
        id: "lower-rent",
        text: "Lower rent",
        outcome: "Rent is unrelated to tax awareness.",
        isCorrect: false,
      }
    ],
  },
  {
    id: 4,
    prompt: "What is a simple step to reduce tax fear?",
    options: [
      {
        id: "ignore-updates",
        text: "Ignore updates and notices",
        outcome: "Ignoring updates increases risk.",
        isCorrect: false,
      },
      {
        id: "learn-basics",
        text: "Learn basic rules and thresholds relevant to business",
        outcome: "Correct. Basics help decide next steps.",
        isCorrect: true,
      },
      {
        id: "avoid-bills",
        text: "Avoid giving bills",
        outcome: "Bills improve compliance and records.",
        isCorrect: false,
      },
      {
        id: "delay-forever",
        text: "Delay learning forever",
        outcome: "Delays create avoidable trouble.",
        isCorrect: false,
      }
    ],
  },
  {
    id: 5,
    prompt: "What is the key takeaway about tax fear vs awareness?",
    options: [
      {
        id: "optional",
        text: "Knowledge is optional",
        outcome: "Knowledge is essential for compliance.",
        isCorrect: false,
      },
      {
        id: "hide-income",
        text: "Hiding income is safer",
        outcome: "Hiding income increases legal risk.",
        isCorrect: false,
      },
      {
        id: "awareness",
        text: "Awareness reduces anxiety and risk",
        outcome: "Correct. Knowledge keeps business safer.",
        isCorrect: true,
      },
      {
        id: "no-impact",
        text: "Awareness makes no impact",
        outcome: "Awareness reduces penalties and stress.",
        isCorrect: false,
      }
    ],
  },
];

const TaxFearVsAwareness = () => {
  const location = useLocation();
  const gameId = "finance-business-livelihood-finance-83";
  const gameData = getGameDataById(gameId);
  const totalStages = TAX_FEAR_VS_AWARENESS_STAGES.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const totalCoins = gameData?.coins ?? location.state?.totalCoins ?? 10;
  const coinsPerLevel = Math.max(1, Math.floor(totalCoins / totalStages));
  const totalXp = gameData?.xp ?? location.state?.totalXp ?? 20;
  const stage = TAX_FEAR_VS_AWARENESS_STAGES[currentStageIndex];

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
      title="Tax Fear vs Awareness"
      subtitle={
        showResult
          ? "Quiz complete! You now know why awareness reduces risk."
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

export default TaxFearVsAwareness;
