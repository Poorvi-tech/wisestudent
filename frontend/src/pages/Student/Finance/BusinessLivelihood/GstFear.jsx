import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const GST_FEAR_STAGES = [
  {
    id: 1,
    prompt:
      "A trader avoids learning GST because it sounds complicated. What is wiser?",
    options: [
      {
        id: "ignore",
        text: "Ignore it completely",
        outcome: "Ignoring GST can lead to penalties and confusion.",
        isCorrect: false,
      },
      {
        id: "learn-basics",
        text: "Learn basics relevant to business",
        outcome: "Correct. Basic awareness prevents future trouble.",
        isCorrect: true,
      },
      {
        id: "close-shop",
        text: "Close shop",
        outcome: "Closing is unnecessary; learning basics is safer.",
        isCorrect: false,
      },
      {
        id: "stop-selling",
        text: "Stop selling",
        outcome: "Stopping sales is not a solution.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 2,
    prompt: "Why is GST awareness important for a trader?",
    options: [
      {
        id: "avoid-penalties",
        text: "To avoid penalties and compliance mistakes",
        outcome: "Correct. Awareness reduces compliance risk.",
        isCorrect: true,
      },
      {
        id: "increase-sales",
        text: "To automatically increase sales",
        outcome: "Sales depend on customers, not GST awareness.",
        isCorrect: false,
      },
      {
        id: "skip-records",
        text: "To skip record-keeping",
        outcome: "GST often requires better records, not fewer.",
        isCorrect: false,
      },
      {
        id: "remove-tax",
        text: "To remove taxes",
        outcome: "Awareness does not remove tax obligations.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 3,
    prompt: "What can happen if GST rules are ignored?",
    options: [
      {
        id: "penalties",
        text: "Penalties and missed filings",
        outcome: "Correct. Ignoring rules leads to compliance trouble.",
        isCorrect: true,
      },
      {
        id: "extra-profit",
        text: "Extra profit",
        outcome: "Ignoring GST does not increase profit.",
        isCorrect: false,
      },
      {
        id: "faster-loans",
        text: "Faster loan approvals",
        outcome: "Loans depend on records and compliance.",
        isCorrect: false,
      },
      {
        id: "lower-rent",
        text: "Lower rent",
        outcome: "Rent is unrelated to GST compliance.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 4,
    prompt: "What is a simple first step to reduce GST fear?",
    options: [
      {
        id: "learn-basics",
        text: "Learn basic rules and eligibility thresholds",
        outcome: "Correct. Basics help decide next steps.",
        isCorrect: true,
      },
      {
        id: "ignore-updates",
        text: "Ignore updates and notices",
        outcome: "Ignoring updates increases risk.",
        isCorrect: false,
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
      },
    ],
  },
  {
    id: 5,
    prompt: "What is the key takeaway about GST fear?",
    options: [
      {
        id: "awareness",
        text: "Basic awareness prevents future trouble",
        outcome: "Correct. Knowledge keeps business safer.",
        isCorrect: true,
      },
      {
        id: "ignore-safe",
        text: "Ignoring GST is safe",
        outcome: "Ignoring rules can lead to penalties.",
        isCorrect: false,
      },
      {
        id: "only-big",
        text: "Only big businesses need to care",
        outcome: "Small businesses should still know the basics.",
        isCorrect: false,
      },
      {
        id: "records-optional",
        text: "Records are optional",
        outcome: "Records are essential for compliance.",
        isCorrect: false,
      },
    ],
  },
];

const GstFear = () => {
  const location = useLocation();
  const gameId = "finance-business-livelihood-finance-27";
  const gameData = getGameDataById(gameId);
  const totalStages = GST_FEAR_STAGES.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const totalCoins = gameData?.coins ?? location.state?.totalCoins ?? 10;
  const coinsPerLevel = Math.max(1, Math.floor(totalCoins / totalStages));
  const totalXp = gameData?.xp ?? location.state?.totalXp ?? 20;
  const stage = GST_FEAR_STAGES[currentStageIndex];

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
      title="GST Fear"
      subtitle={
        showResult
          ? "Quiz complete! You now know why basic GST awareness matters."
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

export default GstFear;
