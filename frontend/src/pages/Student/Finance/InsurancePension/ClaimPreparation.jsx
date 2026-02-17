import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const CLAIM_PREPARATION_STAGES = [
  {
    id: 1,
    prompt:
      "A family struggles to claim because documents are missing. What should be done earlier?",
    options: [
      {
        id: "ignore-paperwork",
        text: "Ignore paperwork",
        outcome:
          "Ignoring paperwork can delay or even block a claim.",
        isCorrect: false,
      },
      {
        id: "keep-docs-ready",
        text: "Keep documents ready",
        outcome:
          "Correct. Prepared documentation speeds claims.",
        isCorrect: true,
      },
      {
        id: "depend-hospital",
        text: "Depend on hospital",
        outcome:
          "Hospitals help, but you still need your own documents.",
        isCorrect: false,
      },
      {
        id: "call-agent-later",
        text: "Call agent later",
        outcome:
          "Waiting too long can slow down the claim process.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 2,
    prompt: "Which documents are commonly needed for a health claim?",
    options: [
      {
        id: "bills-reports",
        text: "Hospital bills and medical reports",
        outcome:
          "Correct. These prove treatment and costs.",
        isCorrect: true,
      },
      {
        id: "shopping-receipts",
        text: "Grocery shopping receipts",
        outcome:
          "Groceries are unrelated to a health claim.",
        isCorrect: false,
      },
      {
        id: "social-media",
        text: "Social media posts",
        outcome:
          "Social posts are not valid claim documents.",
        isCorrect: false,
      },
      {
        id: "gift-cards",
        text: "Gift card details",
        outcome:
          "Gift cards are not relevant to insurance claims.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 3,
    prompt: "Why should you keep policy documents accessible?",
    options: [
      {
        id: "faster-claims",
        text: "They help you file claims faster",
        outcome:
          "Correct. Access to policy details speeds up the process.",
        isCorrect: true,
      },
      {
        id: "avoid-premiums",
        text: "They let you avoid premiums",
        outcome:
          "Premiums are still required to keep coverage active.",
        isCorrect: false,
      },
      {
        id: "guarantee-profit",
        text: "They guarantee profit",
        outcome:
          "Insurance is not a profit guarantee.",
        isCorrect: false,
      },
      {
        id: "no-need-id",
        text: "You never need identification",
        outcome:
          "Identification is often required for claims.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 4,
    prompt: "What happens when claim paperwork is incomplete?",
    options: [
      {
        id: "faster-approval",
        text: "Claims are approved faster",
        outcome:
          "Incomplete paperwork usually delays approval.",
        isCorrect: false,
      },
      {
        id: "delay-or-reject",
        text: "Claims can be delayed or rejected",
        outcome:
          "Correct. Missing documents can slow or block the claim.",
        isCorrect: true,
      },
      {
        id: "automatic-pay",
        text: "Payment happens automatically",
        outcome:
          "Insurers need documents to verify the claim.",
        isCorrect: false,
      },
      {
        id: "no-effect",
        text: "It has no effect",
        outcome:
          "Incomplete documents affect claim decisions.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 5,
    prompt: "What is the best habit for claim readiness?",
    options: [
      {
        id: "keep-folder",
        text: "Keep a simple folder of key documents",
        outcome:
          "Correct. Organized documents reduce stress during emergencies.",
        isCorrect: true,
      },
      {
        id: "wait-emergency",
        text: "Collect documents only after an emergency",
        outcome:
          "Waiting makes the process slower during a crisis.",
        isCorrect: false,
      },
      {
        id: "ignore-renewal",
        text: "Ignore policy renewal notices",
        outcome:
          "Renewal notices keep coverage active and current.",
        isCorrect: false,
      },
      {
        id: "keep-nowhere",
        text: "Store documents nowhere",
        outcome:
          "Not storing documents makes claims harder.",
        isCorrect: false,
      },
    ],
  },
];

const ClaimPreparation = () => {
  const location = useLocation();
  const gameId = "finance-insurance-pension-8";
  const gameData = getGameDataById(gameId);
  const totalStages = CLAIM_PREPARATION_STAGES.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const totalCoins = gameData?.coins ?? location.state?.totalCoins ?? 5;
  const coinsPerLevel = Math.max(1, Math.floor(totalCoins / totalStages));
  const totalXp = gameData?.xp ?? location.state?.totalXp ?? 10;
  const stage = CLAIM_PREPARATION_STAGES[currentStageIndex];

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
      title="Claim Preparation"
      subtitle={
        showResult
          ? "Quiz complete! You understand how to prepare for claims."
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

export default ClaimPreparation;
