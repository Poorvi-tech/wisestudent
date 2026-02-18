import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const WHO_NEEDS_INSURANCE_STAGES = [
  {
    id: 1,
    prompt:
      "A 28-year-old says insurance is only for old people. What's correct?",
    options: [
      {
        id: "only-elderly",
        text: "Only elderly need it",
        outcome:
          "People of any age can face medical, accident, or income risks.",
        isCorrect: false,
      },
      {
        id: "only-rich",
        text: "Only rich people need it",
        outcome:
          "Insurance is about protection, not wealth. It can help anyone manage risk.",
        isCorrect: false,
      },
      {
        id: "risk-or-dependents",
        text: "Anyone with risk or dependents may need it",
        outcome:
          "Correct. Protection planning should start early for anyone with responsibilities or risks.",
        isCorrect: true,
      },
      {
        id: "nobody-needs",
        text: "Nobody needs it",
        outcome:
          "Risks are real. Insurance is one tool to prevent financial shocks.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 2,
    prompt: "Why might a young adult still benefit from insurance?",
    options: [
      {
        id: "never-risk",
        text: "Young people never face accidents or illness",
        outcome:
          "Accidents and health issues can happen at any age.",
        isCorrect: false,
      },
      {
        id: "guaranteed-returns",
        text: "Insurance guarantees high investment returns",
        outcome:
          "Insurance is primarily for protection, not guaranteed returns.",
        isCorrect: false,
      },
      {
        id: "no-need-savings",
        text: "Insurance removes the need for any savings",
        outcome:
          "Savings are still important for day-to-day and short-term needs.",
        isCorrect: false,
      },
      {
        id: "risk-anytime",
        text: "Risks can occur anytime, and coverage protects savings",
        outcome:
          "Correct. Insurance helps protect savings from unexpected costs.",
        isCorrect: true,
      },
    ],
  },
  {
    id: 3,
    prompt: "Who should consider life insurance?",
    options: [
      {
        id: "no-dependents",
        text: "Only people with no dependents",
        outcome:
          "Life insurance is more useful when others rely on your income.",
        isCorrect: false,
      },
      {
        id: "dependent-or-debt",
        text: "People with dependents or loans they want protected",
        outcome:
          "Correct. It can help cover income gaps and outstanding obligations.",
        isCorrect: true,
      },
      {
        id: "only-retired",
        text: "Only retired people",
        outcome:
          "Retired people may need different planning, but working adults can benefit too.",
        isCorrect: false,
      },
      {
        id: "only-wealthy",
        text: "Only very wealthy people",
        outcome:
          "Insurance is about protection, not only wealth.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 4,
    prompt: "What is the main purpose of insurance in a financial plan?",
    options: [
      {
        id: "big-shocks",
        text: "To protect against low-frequency, high-cost shocks",
        outcome:
          "Correct. Insurance transfers major risks that could derail finances.",
        isCorrect: true,
      },
      {
        id: "daily-spending",
        text: "To pay for daily expenses",
        outcome:
          "Insurance is not meant for routine daily costs.",
        isCorrect: false,
      },
      {
        id: "avoid-budgeting",
        text: "To avoid budgeting altogether",
        outcome:
          "Good budgeting is still necessary, even with insurance.",
        isCorrect: false,
      },
      {
        id: "replace-savings",
        text: "To replace all savings",
        outcome:
          "Savings and insurance serve different roles and work best together.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 5,
    prompt: "Why is starting insurance early often a smart move?",
    options: [
      {
        id: "no-cost",
        text: "It costs nothing if you start early",
        outcome:
          "Policies still require premiums, even when you start early.",
        isCorrect: false,
      },
      {
        id: "cancel-savings",
        text: "It lets you cancel your savings plan",
        outcome:
          "Insurance does not replace the need for savings.",
        isCorrect: false,
      },
      {
        id: "guarantee-profit",
        text: "It guarantees a large profit later",
        outcome:
          "Insurance is protection, not a profit guarantee.",
        isCorrect: false,
      },
      {
        id: "lower-cost",
        text: "Premiums are often lower and coverage is easier to secure",
        outcome:
          "Correct. Starting early can lock in better rates and fewer exclusions.",
        isCorrect: true,
      },
    ],
  },
];

const WhoNeedsInsurance = () => {
  const location = useLocation();
  const gameId = "finance-insurance-pension-3";
  const gameData = getGameDataById(gameId);
  const totalStages = WHO_NEEDS_INSURANCE_STAGES.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const totalCoins = gameData?.coins ?? location.state?.totalCoins ?? 5;
  const coinsPerLevel = Math.max(1, Math.floor(totalCoins / totalStages));
  const totalXp = gameData?.xp ?? location.state?.totalXp ?? 10;
  const stage = WHO_NEEDS_INSURANCE_STAGES[currentStageIndex];

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
      title="Who Needs Insurance"
      subtitle={
        showResult
          ? "Quiz complete! You understand why insurance planning starts early."
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

export default WhoNeedsInsurance;
