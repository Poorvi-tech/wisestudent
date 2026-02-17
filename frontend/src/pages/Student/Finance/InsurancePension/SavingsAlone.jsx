import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const SAVINGS_ALONE_STAGES = [
  {
    id: 1,
    prompt:
      "A family has Rs 20,000 savings but faces a Rs 1 lakh medical cost. What helps most?",
    options: [
      {
        id: "savings-only",
        text: "Savings only",
        outcome:
          "Savings help, but Rs 20,000 alone cannot fully absorb a Rs 1 lakh medical emergency.",
        isCorrect: false,
      },
      {
        id: "insurance-only",
        text: "Insurance only",
        outcome:
          "Insurance is critical for major costs, but families still need savings for smaller immediate expenses.",
        isCorrect: false,
      },
      {
        id: "insurance-plus-savings",
        text: "Insurance plus savings",
        outcome:
          "Correct. Savings help small needs; insurance protects big risks.",
        isCorrect: true,
      },
      {
        id: "borrow-friends",
        text: "Borrow from friends",
        outcome:
          "Borrowing may help temporarily, but it is not as reliable as planned risk protection.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 2,
    prompt: "Why can depending only on savings be risky for medical emergencies?",
    options: [
      {
        id: "always-enough",
        text: "Savings are always enough for any emergency",
        outcome:
          "Emergency costs can be much higher than planned savings.",
        isCorrect: false,
      },
      {
        id: "wipes-buffer",
        text: "A single large bill can wipe out years of savings",
        outcome:
          "Correct. One major hospital bill can drain savings quickly.",
        isCorrect: true,
      },
      {
        id: "more-income",
        text: "Savings automatically generate salary",
        outcome:
          "Savings do not increase monthly salary automatically.",
        isCorrect: false,
      },
      {
        id: "no-planning",
        text: "It removes the need for financial planning",
        outcome:
          "Financial planning is still essential even when you save regularly.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 3,
    prompt: "What role does insurance play in a financial safety plan?",
    options: [
      {
        id: "small-expense-only",
        text: "Covers only tiny daily expenses",
        outcome:
          "Insurance is mainly for larger covered risks, not daily small spending.",
        isCorrect: false,
      },
      {
        id: "big-risk-shield",
        text: "Shields against large unexpected costs",
        outcome:
          "Correct. Insurance transfers part of major risk to the insurer.",
        isCorrect: true,
      },
      {
        id: "replace-budget",
        text: "Replaces budgeting forever",
        outcome:
          "Budgeting is still needed to manage premiums, savings, and daily spending.",
        isCorrect: false,
      },
      {
        id: "all-costs",
        text: "Pays all expenses in all situations",
        outcome:
          "Policies have terms and limits; they do not pay every expense.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 4,
    prompt: "If a family has insurance, why should they still keep emergency savings?",
    options: [
      {
        id: "no-need-savings",
        text: "They should not keep savings at all",
        outcome:
          "Savings are still needed for quick cash needs and non-covered costs.",
        isCorrect: false,
      },
      {
        id: "small-gaps",
        text: "Savings cover small gaps, deductibles, and immediate expenses",
        outcome:
          "Correct. Savings handle short-term cash needs while insurance handles major risks.",
        isCorrect: true,
      },
      {
        id: "double-premium",
        text: "Savings reduce all premiums to zero",
        outcome:
          "Savings do not make premiums disappear.",
        isCorrect: false,
      },
      {
        id: "ignore-claims",
        text: "So they never need to file claims",
        outcome:
          "Claims are still important when major covered events happen.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 5,
    prompt: "Which strategy is strongest for long-term family protection?",
    options: [
      {
        id: "cash-home",
        text: "Keep all money in cash at home",
        outcome:
          "This is risky and does not provide structured risk protection.",
        isCorrect: false,
      },
      {
        id: "random-borrowing",
        text: "Borrow whenever emergencies happen",
        outcome:
          "Repeated borrowing creates stress and debt burden.",
        isCorrect: false,
      },
      {
        id: "balanced-protection",
        text: "Build savings and maintain insurance cover",
        outcome:
          "Correct. Combined planning gives both liquidity and major-risk protection.",
        isCorrect: true,
      },
      {
        id: "wait-and-see",
        text: "Delay planning until a crisis comes",
        outcome:
          "Planning after a crisis is usually more expensive and less effective.",
        isCorrect: false,
      },
    ],
  },
];

const SavingsAlone = () => {
  const location = useLocation();
  const gameId = "finance-insurance-pension-2";
  const gameData = getGameDataById(gameId);
  const totalStages = SAVINGS_ALONE_STAGES.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const totalCoins = gameData?.coins ?? location.state?.totalCoins ?? 5;
  const coinsPerLevel = Math.max(1, Math.floor(totalCoins / totalStages));
  const totalXp = gameData?.xp ?? location.state?.totalXp ?? 10;
  const stage = SAVINGS_ALONE_STAGES[currentStageIndex];

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
      title="Savings Alone"
      subtitle={
        showResult
          ? "Quiz complete! You understand savings and insurance balance."
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

export default SavingsAlone;
