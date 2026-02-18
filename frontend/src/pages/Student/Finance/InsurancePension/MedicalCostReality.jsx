import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const MEDICAL_COST_REALITY_STAGES = [
  {
    id: 1,
    prompt: "A healthy person suddenly needs surgery. What does this show?",
    options: [
      {
        id: "predictable-costs",
        text: "Health costs are predictable",
        outcome:
          "Medical emergencies are often unexpected and costs can be sudden.",
        isCorrect: false,
      },
      {
        id: "only-old-age",
        text: "Illness only happens in old age",
        outcome:
          "Illness and accidents can happen at any age.",
        isCorrect: false,
      },
      {
        id: "risk-anytime",
        text: "Medical risk can occur anytime",
        outcome:
          "Correct. Insurance reduces the impact of uncertainty.",
        isCorrect: true,
      },
      {
        id: "random-charges",
        text: "Hospitals charge randomly",
        outcome:
          "Hospitals charge based on treatments and services, not randomly.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 2,
    prompt: "Why is emergency medical spending hard to plan for?",
    options: [
      {
        id: "fixed-amount",
        text: "It is always the same fixed amount",
        outcome:
          "Medical costs vary widely by condition and treatment.",
        isCorrect: false,
      },
      {
        id: "never-happens",
        text: "Emergencies never happen",
        outcome:
          "Emergencies can happen unexpectedly and need preparation.",
        isCorrect: false,
      },
      {
        id: "uncertain-costs",
        text: "Timing and cost are unpredictable",
        outcome:
          "Correct. This uncertainty is why insurance is useful.",
        isCorrect: true,
      },
      {
        id: "always-free",
        text: "Hospitals always provide free care",
        outcome:
          "Care is usually paid and can be costly without coverage.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 3,
    prompt: "What is the role of insurance when surgery costs are high?",
    options: [
      {
        id: "pay-nothing",
        text: "It makes all costs disappear automatically",
        outcome:
          "Policies have limits and terms; they don't erase every expense.",
        isCorrect: false,
      },
      {
        id: "share-risk",
        text: "It shares the financial risk with the insurer",
        outcome:
          "Correct. Insurance helps cover large eligible costs.",
        isCorrect: true,
      },
      {
        id: "replace-savings",
        text: "It replaces the need for any savings",
        outcome:
          "Savings are still important for deductibles and quick expenses.",
        isCorrect: false,
      },
      {
        id: "raise-income",
        text: "It increases your salary",
        outcome:
          "Insurance protects against costs; it doesn't increase income.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 4,
    prompt: "Which is the best way to reduce the impact of medical uncertainty?",
    options: [
      {
        id: "insurance-plus-savings",
        text: "Use insurance and maintain emergency savings",
        outcome:
          "Correct. Together they provide stronger protection.",
        isCorrect: true,
      },
      {
        id: "ignore-risk",
        text: "Ignore the risk and hope for the best",
        outcome:
          "Ignoring risk can lead to financial shocks.",
        isCorrect: false,
      },
      {
        id: "only-savings",
        text: "Rely only on savings",
        outcome:
          "Savings help, but large bills can drain them quickly.",
        isCorrect: false,
      },
      {
        id: "delay-coverage",
        text: "Buy coverage only after a problem appears",
        outcome:
          "Coverage usually must be active before the event.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 5,
    prompt: "What is a realistic expectation of health insurance?",
    options: [
      {
        id: "no-conditions",
        text: "It covers every cost with no conditions",
        outcome:
          "Policies have terms, exclusions, and limits.",
        isCorrect: false,
      },
      {
        id: "free-healthcare",
        text: "It guarantees free healthcare forever",
        outcome:
          "Coverage depends on policy rules and eligible services.",
        isCorrect: false,
      },
      {
        id: "investment-profit",
        text: "It guarantees investment profits",
        outcome:
          "Insurance is for protection, not guaranteed profits.",
        isCorrect: false,
      },
      {
        id: "risk-reduction",
        text: "It reduces the financial impact of large medical bills",
        outcome:
          "Correct. It protects against large, unexpected expenses.",
        isCorrect: true,
      },
    ],
  },
];

const MedicalCostReality = () => {
  const location = useLocation();
  const gameId = "finance-insurance-pension-4";
  const gameData = getGameDataById(gameId);
  const totalStages = MEDICAL_COST_REALITY_STAGES.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const totalCoins = gameData?.coins ?? location.state?.totalCoins ?? 5;
  const coinsPerLevel = Math.max(1, Math.floor(totalCoins / totalStages));
  const totalXp = gameData?.xp ?? location.state?.totalXp ?? 10;
  const stage = MEDICAL_COST_REALITY_STAGES[currentStageIndex];

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
      title="Medical Cost Reality"
      subtitle={
        showResult
          ? "Quiz complete! You understand medical cost uncertainty."
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

export default MedicalCostReality;
