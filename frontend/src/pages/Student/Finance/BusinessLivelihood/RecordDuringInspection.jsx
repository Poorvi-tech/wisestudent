import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const RECORD_DURING_INSPECTION_STAGES = [
  {
    id: 1,
    prompt: "An officer asks for transaction records. What helps most?",
    options: [
      {
        id: "memory",
        text: "Memory",
        outcome: "Memory is unreliable during inspections.",
        isCorrect: false,
      },
      {
        id: "friend-support",
        text: "Friend support",
        outcome: "Support helps, but records are what matter.",
        isCorrect: false,
      },
      {
        id: "written-digital",
        text: "Written or digital records",
        outcome: "Correct. Records reduce stress during checks.",
        isCorrect: true,
      },
      {
        id: "guessing",
        text: "Guessing",
        outcome: "Guessing increases risk and confusion.",
        isCorrect: false,
      }
    ],
  },
  {
    id: 2,
    prompt: "Why do records help during inspections?",
    options: [
      {
        id: "clear-proof",
        text: "They provide clear proof of transactions",
        outcome: "Correct. Proof makes checks smoother.",
        isCorrect: true,
      },
      {
        id: "avoid-officers",
        text: "They help avoid officers",
        outcome: "Records support compliance, not avoidance.",
        isCorrect: false,
      },
      {
        id: "skip-rules",
        text: "They remove the need for rules",
        outcome: "Rules still apply; records show compliance.",
        isCorrect: false,
      },
      {
        id: "increase-sales",
        text: "They increase sales automatically",
        outcome: "Records do not automatically raise sales.",
        isCorrect: false,
      }
    ],
  },
  {
    id: 3,
    prompt: "What risk increases without proper records?",
    options: [
      {
        id: "more-profit",
        text: "More profit automatically",
        outcome: "Missing records do not increase profit.",
        isCorrect: false,
      },
      {
        id: "stress-penalties",
        text: "Stress, delays, and possible penalties",
        outcome: "Correct. Missing proof can create trouble.",
        isCorrect: true,
      },
      {
        id: "faster-growth",
        text: "Faster growth",
        outcome: "Growth needs strong compliance systems.",
        isCorrect: false,
      },
      {
        id: "no-risk",
        text: "No risk",
        outcome: "There is real risk without records.",
        isCorrect: false,
      }
    ],
  },
  {
    id: 4,
    prompt: "What is a simple habit to stay ready for inspections?",
    options: [
      {
        id: "memory-only",
        text: "Keep everything in memory",
        outcome: "Memory is unreliable for compliance.",
        isCorrect: false,
      },
      {
        id: "delay-records",
        text: "Record only at year-end",
        outcome: "Year-end records miss ongoing requirements.",
        isCorrect: false,
      },
      {
        id: "ignore-bills",
        text: "Ignore bills and invoices",
        outcome: "Bills are important for proof.",
        isCorrect: false,
      },
      {
        id: "store-records",
        text: "Store records neatly and update regularly",
        outcome: "Correct. Organization keeps checks smooth.",
        isCorrect: true,
      }
    ],
  },
  {
    id: 5,
    prompt: "What is the key takeaway about records during inspection?",
    options: [
      {
        id: "optional",
        text: "Records are optional",
        outcome: "Records are essential for compliance.",
        isCorrect: false,
      },
      {
        id: "reduce-stress",
        text: "Records reduce stress during checks",
        outcome: "Correct. Proof makes compliance easier.",
        isCorrect: true,
      },
      {
        id: "no-impact",
        text: "Records make no impact",
        outcome: "Records directly affect inspection outcomes.",
        isCorrect: false,
      },
      {
        id: "only-big",
        text: "Only large businesses need records",
        outcome: "Small businesses benefit just as much.",
        isCorrect: false,
      }
    ],
  },
];

const RecordDuringInspection = () => {
  const location = useLocation();
  const gameId = "finance-business-livelihood-finance-29";
  const gameData = getGameDataById(gameId);
  const totalStages = RECORD_DURING_INSPECTION_STAGES.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const totalCoins = gameData?.coins ?? location.state?.totalCoins ?? 10;
  const coinsPerLevel = Math.max(1, Math.floor(totalCoins / totalStages));
  const totalXp = gameData?.xp ?? location.state?.totalXp ?? 20;
  const stage = RECORD_DURING_INSPECTION_STAGES[currentStageIndex];

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
      title="Record During Inspection"
      subtitle={
        showResult
          ? "Quiz complete! You now know why records reduce inspection stress."
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

export default RecordDuringInspection;
