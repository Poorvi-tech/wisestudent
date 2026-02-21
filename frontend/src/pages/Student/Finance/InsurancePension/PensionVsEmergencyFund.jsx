import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const PENSION_VS_EMERGENCY_FUND_STAGES = [
  {
    id: 1,
    prompt: "A person uses retirement savings for daily expenses. Better approach?",
    options: [
      {
        id: "mix-all",
        text: "Mix all funds",
        outcome:
          "Mixing goals can leave you short for both emergencies and retirement.",
        isCorrect: false,
      },
      {
        id: "spend-early",
        text: "Spend pension early",
        outcome:
          "Using retirement money early reduces future security.",
        isCorrect: false,
      },
      {
        id: "ignore-emergencies",
        text: "Ignore emergencies",
        outcome:
          "Emergency planning is essential.",
        isCorrect: false,
      },
      {
        id: "separate-goals",
        text: "Keep separate savings goals",
        outcome:
          "Correct. Different goals need separate funds.",
        isCorrect: true,
      },
    ],
  },
  {
    id: 2,
    prompt: "Why should emergency funds be separate from retirement savings?",
    options: [
      {
        id: "different-purpose",
        text: "They serve different purposes and time horizons",
        outcome:
          "Correct. Emergency funds are for short-term shocks, retirement is long-term.",
        isCorrect: true,
      },
      {
        id: "no-need",
        text: "No need for emergency funds",
        outcome:
          "Emergencies can happen anytime and require quick cash.",
        isCorrect: false,
      },
      {
        id: "retirement-covers",
        text: "Retirement savings cover all emergencies",
        outcome:
          "Using retirement money early can hurt future security.",
        isCorrect: false,
      },
      {
        id: "only-big",
        text: "Only big expenses matter",
        outcome:
          "Small emergencies add up too.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 3,
    prompt: "What is the best use of an emergency fund?",
    options: [
      {
        id: "daily-spend",
        text: "Daily spending",
        outcome:
          "Daily spending should come from a budget, not emergency reserves.",
        isCorrect: false,
      },
      {
        id: "unexpected-costs",
        text: "Unexpected costs like medical or repair bills",
        outcome:
          "Correct. Emergency funds are for sudden expenses.",
        isCorrect: true,
      },
      {
        id: "vacations",
        text: "Vacation trips",
        outcome:
          "Vacations are planned expenses, not emergencies.",
        isCorrect: false,
      },
      {
        id: "luxury-items",
        text: "Luxury purchases",
        outcome:
          "Luxury spending should not come from emergency reserves.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 4,
    prompt: "What happens when retirement savings are used for emergencies?",
    options: [
      {
        id: "no-effect",
        text: "No effect on retirement",
        outcome:
          "Using retirement savings reduces future security.",
        isCorrect: false,
      },
      {
        id: "reduces-growth",
        text: "It reduces long-term growth and future income",
        outcome:
          "Correct. Early withdrawals shrink retirement outcomes.",
        isCorrect: true,
      },
      {
        id: "guarantees-profit",
        text: "It guarantees profit later",
        outcome:
          "Early withdrawals do not guarantee profits.",
        isCorrect: false,
      },
      {
        id: "better-returns",
        text: "It improves returns",
        outcome:
          "Withdrawals generally reduce returns.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 5,
    prompt: "What is the key takeaway about pension vs emergency funds?",
    options: [
      {
        id: "one-fund",
        text: "One fund is enough for everything",
        outcome:
          "Different goals require separate funds.",
        isCorrect: false,
      },
      {
        id: "ignore-emergency",
        text: "Ignore emergencies",
        outcome:
          "Emergency planning is essential.",
        isCorrect: false,
      },
      {
        id: "separate-funds",
        text: "Keep separate funds for different goals",
        outcome:
          "Correct. Separate funds protect both short- and long-term needs.",
        isCorrect: true,
      },
      {
        id: "spend-pension",
        text: "Spend pension early",
        outcome:
          "Early spending reduces retirement security.",
        isCorrect: false,
      },
    ],
  },
];

const PensionVsEmergencyFund = () => {
  const location = useLocation();
  const gameId = "finance-insurance-pension-28";
  const gameData = getGameDataById(gameId);
  const totalStages = PENSION_VS_EMERGENCY_FUND_STAGES.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const totalCoins = gameData?.coins ?? location.state?.totalCoins ?? 10;
  const coinsPerLevel = Math.max(2, Math.floor(totalCoins / totalStages));
  const totalXp = gameData?.xp ?? location.state?.totalXp ?? 20;
  const stage = PENSION_VS_EMERGENCY_FUND_STAGES[currentStageIndex];

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
      title="Pension vs Emergency Fund"
      subtitle={
        showResult
          ? "Quiz complete! You understand why goals need separate funds."
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

export default PensionVsEmergencyFund;
