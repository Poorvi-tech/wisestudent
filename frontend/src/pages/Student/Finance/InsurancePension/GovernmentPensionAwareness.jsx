import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const GOVERNMENT_PENSION_AWARENESS_STAGES = [
  {
    id: 1,
    prompt: "A worker hears about pension schemes. First step?",
    options: [
      {
        id: "ignore",
        text: "Ignore",
        outcome:
          "Ignoring opportunities can mean missing support.",
        isCorrect: false,
      },
      {
        id: "pay-now",
        text: "Pay immediately",
        outcome:
          "Always verify eligibility and official process first.",
        isCorrect: false,
      },
      {
        id: "learn-eligibility",
        text: "Learn eligibility and process",
        outcome:
          "Correct. Awareness helps use available support.",
        isCorrect: true,
      },
      {
        id: "depend-rumours",
        text: "Depend on rumours",
        outcome:
          "Rumours are unreliable. Use verified sources.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 2,
    prompt: "Why is checking eligibility important?",
    options: [
      {
        id: "skip-docs",
        text: "It lets you skip documents",
        outcome:
          "Documents are usually required.",
        isCorrect: false,
      },
      {
        id: "avoid-waste",
        text: "It prevents wasted time and wrong applications",
        outcome:
          "Correct. Eligibility saves effort and confusion.",
        isCorrect: true,
      },
      {
        id: "instant-money",
        text: "It guarantees instant money",
        outcome:
          "Processing takes time and approvals.",
        isCorrect: false,
      },
      {
        id: "no-need-steps",
        text: "It removes all steps",
        outcome:
          "You still need to follow the process.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 3,
    prompt: "What is a smart way to learn about a pension scheme?",
    options: [
      {
        id: "official-source",
        text: "Use official government or verified sources",
        outcome:
          "Correct. Verified sources reduce misinformation.",
        isCorrect: true,
      },
      {
        id: "random-chat",
        text: "Ask random people only",
        outcome:
          "Informal advice can be wrong or incomplete.",
        isCorrect: false,
      },
      {
        id: "pay-agent",
        text: "Pay anyone who promises fast approval",
        outcome:
          "Promises of fast approval can be scams.",
        isCorrect: false,
      },
      {
        id: "ignore-info",
        text: "Ignore all details",
        outcome:
          "Details are crucial for enrollment and benefits.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 4,
    prompt: "What should you prepare for a pension application?",
    options: [
      {
        id: "no-docs",
        text: "No documents needed",
        outcome:
          "Most schemes need proof of identity and eligibility.",
        isCorrect: false,
      },
      {
        id: "cash-only",
        text: "Cash payment only",
        outcome:
          "Payments should follow official channels.",
        isCorrect: false,
      },
      {
        id: "basic-docs",
        text: "Basic identification and required documents",
        outcome:
          "Correct. Documentation is usually required.",
        isCorrect: true,
      },
      {
        id: "social-media",
        text: "Social media profile screenshots",
        outcome:
          "Social media is not official documentation.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 5,
    prompt: "What is the key takeaway about pension schemes?",
    options: [
      {
        id: "ignore",
        text: "Ignore all schemes",
        outcome:
          "Ignoring may mean missing helpful support.",
        isCorrect: false,
      },
      {
        id: "rumours",
        text: "Rely on rumours",
        outcome:
          "Rumours are unreliable.",
        isCorrect: false,
      },
      {
        id: "pay-now",
        text: "Pay immediately to anyone",
        outcome:
          "Always verify the official process.",
        isCorrect: false,
      },
      {
        id: "awareness",
        text: "Awareness helps access available support",
        outcome:
          "Correct. Knowing the process helps you benefit.",
        isCorrect: true,
      },
    ],
  },
];

const GovernmentPensionAwareness = () => {
  const location = useLocation();
  const gameId = "finance-insurance-pension-29";
  const gameData = getGameDataById(gameId);
  const totalStages = GOVERNMENT_PENSION_AWARENESS_STAGES.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const totalCoins = gameData?.coins ?? location.state?.totalCoins ?? 10;
  const coinsPerLevel = Math.max(2, Math.floor(totalCoins / totalStages));
  const totalXp = gameData?.xp ?? location.state?.totalXp ?? 20;
  const stage = GOVERNMENT_PENSION_AWARENESS_STAGES[currentStageIndex];

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
      title="Government Pension Awareness"
      subtitle={
        showResult
          ? "Quiz complete! You understand how awareness helps access support."
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

export default GovernmentPensionAwareness;
