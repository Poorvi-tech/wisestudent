import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const POLICY_READING_STAGES = [
  {
    id: 1,
    prompt: "A buyer signs without reading policy. What's safer?",
    options: [
      {
        id: "trust-agent",
        text: "Trust agent blindly",
        outcome:
          "Agents help, but you should still understand what you are buying.",
        isCorrect: false,
      },
      {
        id: "read-terms",
        text: "Read coverage and exclusions",
        outcome:
          "Correct. Understanding terms prevents claim problems.",
        isCorrect: true,
      },
      {
        id: "ignore-docs",
        text: "Ignore documents",
        outcome:
          "Skipping documents can hide important limits and exclusions.",
        isCorrect: false,
      },
      {
        id: "assume-same",
        text: "Assume all policies same",
        outcome:
          "Policies differ in coverage, exclusions, and claim limits.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 2,
    prompt: "Which part of a policy tells you what is NOT covered?",
    options: [
      {
        id: "exclusions",
        text: "Exclusions section",
        outcome:
          "Correct. Exclusions list situations the policy will not cover.",
        isCorrect: true,
      },
      {
        id: "premium",
        text: "Premium amount",
        outcome:
          "Premium shows cost, not coverage gaps.",
        isCorrect: false,
      },
      {
        id: "contact-info",
        text: "Contact information",
        outcome:
          "Contact details do not explain coverage limits.",
        isCorrect: false,
      },
      {
        id: "logo",
        text: "Company logo",
        outcome:
          "A logo doesn't explain policy terms.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 3,
    prompt: "Why should you check coverage limits before buying?",
    options: [
      {
        id: "limits-ignore",
        text: "Limits are irrelevant",
        outcome:
          "Limits determine the maximum payout.",
        isCorrect: false,
      },
      {
        id: "limits-optional",
        text: "Limits only matter for rich people",
        outcome:
          "Limits matter for anyone who wants adequate protection.",
        isCorrect: false,
      },
      {
        id: "limits-too-low",
        text: "To ensure the limits are not too low for your risks",
        outcome:
          "Correct. Limits should match your potential costs.",
        isCorrect: true,
      },
      {
        id: "limits-hidden",
        text: "Limits are hidden and cannot be checked",
        outcome:
          "Limits are listed in the policy documents.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 4,
    prompt: "What is a smart step before signing an insurance policy?",
    options: [
      {
        id: "compare-policies",
        text: "Compare policies and ask questions",
        outcome:
          "Correct. Comparing terms helps you choose the right coverage.",
        isCorrect: true,
      },
      {
        id: "sign-fast",
        text: "Sign quickly to finish",
        outcome:
          "Rushing can lead to missing key details.",
        isCorrect: false,
      },
      {
        id: "skip-reading",
        text: "Skip reading to save time",
        outcome:
          "Reading terms saves trouble later.",
        isCorrect: false,
      },
      {
        id: "assume-coverage",
        text: "Assume everything is covered",
        outcome:
          "Policies never cover everything.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 5,
    prompt: "What is the main benefit of understanding policy terms?",
    options: [
      {
        id: "guarantee-profit",
        text: "Guarantee big profits",
        outcome:
          "Insurance is not designed to guarantee profit.",
        isCorrect: false,
      },
      {
        id: "never-pay-premiums",
        text: "Never pay premiums again",
        outcome:
          "Premiums are required to keep coverage active.",
        isCorrect: false,
      },
      {
        id: "remove-risk",
        text: "Remove all risk from life",
        outcome:
          "Insurance reduces financial risk, not all risk.",
        isCorrect: false,
      },
      {
        id: "avoid-surprises",
        text: "Avoid claim surprises later",
        outcome:
          "Correct. Knowing terms prevents unexpected claim denials.",
        isCorrect: true,
      },
    ],
  },
];

const PolicyReading = () => {
  const location = useLocation();
  const gameId = "finance-insurance-pension-7";
  const gameData = getGameDataById(gameId);
  const totalStages = POLICY_READING_STAGES.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const totalCoins = gameData?.coins ?? location.state?.totalCoins ?? 5;
  const coinsPerLevel = Math.max(1, Math.floor(totalCoins / totalStages));
  const totalXp = gameData?.xp ?? location.state?.totalXp ?? 10;
  const stage = POLICY_READING_STAGES[currentStageIndex];

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
      title="Policy Reading"
      subtitle={
        showResult
          ? "Quiz complete! You understand why policy terms matter."
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

export default PolicyReading;
