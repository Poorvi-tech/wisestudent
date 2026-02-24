import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const WHY_RECORDS_MATTER_STAGES = [
  {
    id: 1,
    prompt:
      "A small trader keeps everything in memory, not written. What risk does this create?",
    options: [
      {
        id: "faster-business",
        text: "Faster business",
        outcome:
          "Memory-only tracking usually creates confusion, not speed.",
        isCorrect: false,
      },
      {
        id: "more-profit",
        text: "More profit",
        outcome:
          "No records do not increase profit automatically.",
        isCorrect: false,
      },
      {
        id: "less-work",
        text: "Less work",
        outcome:
          "Short-term effort savings can create bigger issues later.",
        isCorrect: false,
      },
      {
        id: "track-payments-losses",
        text: "Difficulty tracking payments and losses",
        outcome:
          "Correct. Records prevent confusion and disputes.",
        isCorrect: true,
      }
    ],
  },
  {
    id: 2,
    prompt: "Why are written records important for daily business?",
    options: [
      {
        id: "clarity",
        text: "They show clear inflow, outflow, and pending payments",
        outcome:
          "Correct. Clarity helps better decisions and follow-ups.",
        isCorrect: true,
      },
      {
        id: "no-need",
        text: "No need if business is small",
        outcome:
          "Small businesses also need clarity.",
        isCorrect: false,
      },
      {
        id: "memory-best",
        text: "Memory is always enough",
        outcome:
          "Memory can fail, especially with many transactions.",
        isCorrect: false,
      },
      {
        id: "ignore-loss",
        text: "Loss tracking is optional",
        outcome:
          "Loss tracking is essential to control business health.",
        isCorrect: false,
      }
    ],
  },
  {
    id: 3,
    prompt: "What problem appears without payment records?",
    options: [
      {
        id: "no-dispute",
        text: "No disputes happen",
        outcome:
          "Without records, payment disputes are more likely.",
        isCorrect: false,
      },
      {
        id: "customer-conflict",
        text: "Confusion over who paid and who still owes",
        outcome:
          "Correct. Records reduce conflict and misunderstandings.",
        isCorrect: true,
      },
      {
        id: "automatic-proof",
        text: "Automatic proof always exists",
        outcome:
          "Without written proof, claims are harder to verify.",
        isCorrect: false,
      },
      {
        id: "higher-sales",
        text: "Sales increase automatically",
        outcome:
          "Sales growth needs better operations, not guesswork.",
        isCorrect: false,
      }
    ],
  },
  {
    id: 4,
    prompt: "Which habit improves record discipline?",
    options: [
      {
        id: "monthly-guess",
        text: "Guess everything at month-end",
        outcome:
          "Guesswork at month-end usually causes errors.",
        isCorrect: false,
      },
      {
        id: "skip-small",
        text: "Skip small transactions",
        outcome:
          "Small transactions add up and affect true results.",
        isCorrect: false,
      },
      {
        id: "write-daily",
        text: "Write sales, expenses, and dues every day",
        outcome:
          "Correct. Daily entries keep numbers accurate.",
        isCorrect: true,
      },
      {
        id: "share-no-proof",
        text: "Take payments without receipts",
        outcome:
          "No receipts increase payment disputes.",
        isCorrect: false,
      }
    ],
  },
  {
    id: 5,
    prompt: "What is the key takeaway from this scenario?",
    options: [
      {
        id: "memory-enough",
        text: "Memory is enough for business",
        outcome:
          "Memory-only systems break as transactions increase.",
        isCorrect: false,
      },
      {
        id: "records-core",
        text: "Records are core to tracking profit, payments, and losses",
        outcome:
          "Correct. Records prevent confusion and disputes.",
        isCorrect: true,
      },
      {
        id: "records-late",
        text: "Record only when problems happen",
        outcome:
          "Delayed records reduce accuracy.",
        isCorrect: false,
      },
      {
        id: "ignore-dues",
        text: "Ignore pending dues",
        outcome:
          "Pending dues must be tracked to protect cash flow.",
        isCorrect: false,
      }
    ],
  },
];

const WhyRecordsMatter = () => {
  const location = useLocation();
  const gameId = "finance-business-livelihood-finance-3";
  const gameData = getGameDataById(gameId);
  const totalStages = WHY_RECORDS_MATTER_STAGES.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const totalCoins = gameData?.coins ?? location.state?.totalCoins ?? 5;
  const coinsPerLevel = Math.max(1, Math.floor(totalCoins / totalStages));
  const totalXp = gameData?.xp ?? location.state?.totalXp ?? 10;
  const stage = WHY_RECORDS_MATTER_STAGES[currentStageIndex];

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
      title="Why Records Matter"
      subtitle={
        showResult
          ? "Quiz complete! You now understand why records are essential."
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

export default WhyRecordsMatter;

