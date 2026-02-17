import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const GST_CONFUSION_STAGES = [
  {
    id: 1,
    prompt: "A trader hears about GST but ignores it completely. What is safer?",
    options: [
      {
        id: "ignore-rules",
        text: "Ignore rules",
        outcome: "Ignoring rules can create penalties and confusion.",
        isCorrect: false,
      },
      {
        id: "learn-basics",
        text: "Learn basics relevant to business",
        outcome: "Correct. Awareness prevents compliance trouble.",
        isCorrect: true,
      },
      {
        id: "close-shop",
        text: "Close shop",
        outcome: "Closing is not necessary; learning basics is safer.",
        isCorrect: false,
      },
      {
        id: "avoid-customers",
        text: "Avoid customers",
        outcome: "Avoiding customers is not a compliance solution.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 2,
    prompt: "Why should a business understand GST basics?",
    options: [
      {
        id: "avoid-penalties",
        text: "To avoid penalties and filing mistakes",
        outcome: "Correct. Basic knowledge reduces compliance risks.",
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
        text: "To skip maintaining records",
        outcome: "GST usually requires better records, not fewer.",
        isCorrect: false,
      },
      {
        id: "remove-tax",
        text: "To remove all taxes",
        outcome: "GST awareness does not remove tax obligations.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 3,
    prompt: "What is a common risk of ignoring GST rules?",
    options: [
      {
        id: "confusion-penalties",
        text: "Confusion, missed filings, and penalties",
        outcome: "Correct. Ignoring rules creates compliance trouble.",
        isCorrect: true,
      },
      {
        id: "extra-profit",
        text: "Extra profit",
        outcome: "Ignoring rules does not increase profit.",
        isCorrect: false,
      },
      {
        id: "faster-approval",
        text: "Faster loan approval",
        outcome: "Loans still need proper records.",
        isCorrect: false,
      },
      {
        id: "lower-rent",
        text: "Lower rent",
        outcome: "Rent has nothing to do with GST rules.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 4,
    prompt: "What is a simple first step for GST awareness?",
    options: [
      {
        id: "learn-thresholds",
        text: "Learn the basics and eligibility thresholds",
        outcome: "Correct. Basics help decide next steps.",
        isCorrect: true,
      },
      {
        id: "ignore-notices",
        text: "Ignore notices and updates",
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
        outcome: "Delay creates avoidable trouble.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 5,
    prompt: "What is the key takeaway about GST confusion?",
    options: [
      {
        id: "awareness-helps",
        text: "Awareness prevents compliance trouble",
        outcome: "Correct. Basic knowledge keeps business safer.",
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
        outcome: "Small businesses should still know basics.",
        isCorrect: false,
      },
      {
        id: "no-records",
        text: "Records are optional",
        outcome: "Compliance needs clear records.",
        isCorrect: false,
      },
    ],
  },
];

const GstConfusion = () => {
  const location = useLocation();
  const gameId = "finance-business-livelihood-finance-13";
  const gameData = getGameDataById(gameId);
  const totalStages = GST_CONFUSION_STAGES.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const totalCoins = gameData?.coins ?? location.state?.totalCoins ?? 5;
  const coinsPerLevel = Math.max(1, Math.floor(totalCoins / totalStages));
  const totalXp = gameData?.xp ?? location.state?.totalXp ?? 10;
  const stage = GST_CONFUSION_STAGES[currentStageIndex];

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
      title="GST Confusion"
      subtitle={
        showResult
          ? "Quiz complete! You now know why GST awareness prevents trouble."
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

export default GstConfusion;
