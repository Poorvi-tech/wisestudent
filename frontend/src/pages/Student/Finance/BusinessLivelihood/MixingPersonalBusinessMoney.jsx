import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const MIXING_PERSONAL_BUSINESS_MONEY_STAGES = [
  {
    id: 1,
    prompt:
      "A shop owner uses the same cash for home expenses and business stock. What problem can this cause?",
    options: [
      {
        id: "no-issue",
        text: "No issue",
        outcome:
          "Mixing funds creates confusion and makes decisions harder.",
        isCorrect: false,
      },
      {
        id: "track-profit-loss",
        text: "Hard to track profit or loss",
        outcome:
          "Correct. Mixing funds hides true business performance.",
        isCorrect: true,
      },
      {
        id: "more-income",
        text: "More income automatically",
        outcome:
          "Mixing funds does not increase income automatically.",
        isCorrect: false,
      },
      {
        id: "tax-reduces",
        text: "Tax reduces",
        outcome:
          "Mixed records can actually create tax and compliance issues.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 2,
    prompt: "What is the best first step to avoid mixing money?",
    options: [
      {
        id: "separate-records",
        text: "Keep separate business and personal records",
        outcome:
          "Correct. Separate records improve clarity and control.",
        isCorrect: true,
      },
      {
        id: "guess-balance",
        text: "Estimate balance by memory",
        outcome:
          "Guessing causes errors and poor decisions.",
        isCorrect: false,
      },
      {
        id: "single-cash-box",
        text: "Use one cash box for everything",
        outcome:
          "One cash box makes tracking very difficult.",
        isCorrect: false,
      },
      {
        id: "ignore-expenses",
        text: "Ignore small expenses",
        outcome:
          "Small expenses add up and affect profit.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 3,
    prompt: "Why does separation help in business decisions?",
    options: [
      {
        id: "clear-profit",
        text: "It shows real business profit clearly",
        outcome:
          "Correct. Clear numbers support better decisions.",
        isCorrect: true,
      },
      {
        id: "no-record-need",
        text: "It removes the need for records",
        outcome:
          "Separation works only with proper records.",
        isCorrect: false,
      },
      {
        id: "automatic-sales",
        text: "It automatically increases sales",
        outcome:
          "Sales growth requires strategy, not just separation.",
        isCorrect: false,
      },
      {
        id: "no-budget",
        text: "Budgeting is no longer needed",
        outcome:
          "Budgeting is still essential.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 4,
    prompt: "Which example is a sign of mixing funds?",
    options: [
      {
        id: "stock-withdrawal",
        text: "Using stock purchase money for personal shopping",
        outcome:
          "Correct. This directly mixes business and personal spending.",
        isCorrect: true,
      },
      {
        id: "salary-account",
        text: "Taking a fixed owner salary from business account",
        outcome:
          "A fixed salary is a structured approach, not random mixing.",
        isCorrect: false,
      },
      {
        id: "invoice-record",
        text: "Maintaining invoices properly",
        outcome:
          "Proper invoicing improves business tracking.",
        isCorrect: false,
      },
      {
        id: "daily-ledger",
        text: "Recording daily income and costs",
        outcome:
          "Daily records help prevent mixing problems.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 5,
    prompt: "What is the key takeaway for business money management?",
    options: [
      {
        id: "separate-funds",
        text: "Keep personal and business money separate",
        outcome:
          "Correct. Separation keeps performance visible and decisions stronger.",
        isCorrect: true,
      },
      {
        id: "mix-safe",
        text: "Mixing is safe if business is small",
        outcome:
          "Even small businesses need clean records.",
        isCorrect: false,
      },
      {
        id: "track-later",
        text: "Track money only at month-end",
        outcome:
          "Delayed tracking can miss important signals.",
        isCorrect: false,
      },
      {
        id: "ignore-cashflow",
        text: "Cash flow tracking is optional",
        outcome:
          "Cash flow tracking is critical for survival.",
        isCorrect: false,
      },
    ],
  },
];

const MixingPersonalBusinessMoney = () => {
  const location = useLocation();
  const gameId = "finance-business-livelihood-finance-1";
  const gameData = getGameDataById(gameId);
  const totalStages = MIXING_PERSONAL_BUSINESS_MONEY_STAGES.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const totalCoins = gameData?.coins ?? location.state?.totalCoins ?? 5;
  const coinsPerLevel = Math.max(1, Math.floor(totalCoins / totalStages));
  const totalXp = gameData?.xp ?? location.state?.totalXp ?? 10;
  const stage = MIXING_PERSONAL_BUSINESS_MONEY_STAGES[currentStageIndex];

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
      title="Mixing Personal & Business Money"
      subtitle={
        showResult
          ? "Quiz complete! You can now separate personal and business finances better."
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

export default MixingPersonalBusinessMoney;
