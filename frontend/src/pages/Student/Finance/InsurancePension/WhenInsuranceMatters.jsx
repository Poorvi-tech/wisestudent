import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const WHEN_INSURANCE_MATTERS_STAGES = [
  {
    id: 1,
    prompt: "A worker asks when to consider insurance. Best answer:",
    options: [
      {
        id: "only-rich",
        text: "Only after becoming rich",
        outcome:
          "Insurance is about protection, not only wealth.",
        isCorrect: false,
      },
      {
        id: "after-retirement",
        text: "Only after retirement",
        outcome:
          "Protection matters long before retirement for working families.",
        isCorrect: false,
      },
      {
        id: "only-sick",
        text: "Only when sick",
        outcome:
          "Insurance must be in place before a risk happens.",
        isCorrect: false,
      },
      {
        id: "supports-family",
        text: "When income supports family",
        outcome:
          "Correct. Responsibility increases need for protection.",
        isCorrect: true,
      },
    ],
  },
  {
    id: 2,
    prompt: "What is a key signal that insurance becomes more important?",
    options: [
      {
        id: "no-dependents",
        text: "Having no dependents and no liabilities",
        outcome:
          "Fewer responsibilities may reduce coverage needs.",
        isCorrect: false,
      },
      {
        id: "free-care",
        text: "Free healthcare for all needs",
        outcome:
          "Costs and gaps still exist even with public care.",
        isCorrect: false,
      },
      {
        id: "responsibilities",
        text: "Supporting dependents or paying loans",
        outcome:
          "Correct. Dependents and liabilities increase risk impact.",
        isCorrect: true,
      },
      {
        id: "no-risks",
        text: "Having no risks at all",
        outcome:
          "Risks still exist in real life.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 3,
    prompt: "Why should insurance be considered before a crisis?",
    options: [
      {
        id: "after-crisis",
        text: "It can be bought after the crisis",
        outcome:
          "Most policies do not cover past events.",
        isCorrect: false,
      },
      {
        id: "earlier-coverage",
        text: "Coverage starts only if it is active beforehand",
        outcome:
          "Correct. Protection must be in place before the event.",
        isCorrect: true,
      },
      {
        id: "avoid-savings",
        text: "It replaces the need for savings",
        outcome:
          "Savings and insurance work together.",
        isCorrect: false,
      },
      {
        id: "guarantee-profit",
        text: "It guarantees profit",
        outcome:
          "Insurance is protection, not guaranteed profit.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 4,
    prompt: "Which situation most clearly increases the need for life cover?",
    options: [
      {
        id: "single-no-loans",
        text: "Single with no dependents and no loans",
        outcome:
          "Coverage needs may be lower here.",
        isCorrect: false,
      },
      {
        id: "family-income",
        text: "Family relies on one person's income",
        outcome:
          "Correct. Income loss would strongly impact dependents.",
        isCorrect: true,
      },
      {
        id: "extra-savings",
        text: "Having extra savings",
        outcome:
          "Savings help but do not remove risk.",
        isCorrect: false,
      },
      {
        id: "short-commute",
        text: "Having a short commute",
        outcome:
          "Commute length is not the main factor.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 5,
    prompt: "What is the main takeaway about when insurance matters most?",
    options: [
      {
        id: "when-responsible",
        text: "When responsibility and dependents increase",
        outcome:
          "Correct. Responsibility raises the need for protection.",
        isCorrect: true,
      },
      {
        id: "after-retirement",
        text: "Only after retirement",
        outcome:
          "Protection is relevant throughout working life.",
        isCorrect: false,
      },
      {
        id: "only-wealthy",
        text: "Only for wealthy people",
        outcome:
          "Insurance is about protection, not wealth.",
        isCorrect: false,
      },
      {
        id: "only-illness",
        text: "Only when already ill",
        outcome:
          "Coverage is most useful when in place before illness.",
        isCorrect: false,
      },
    ],
  },
];

const WhenInsuranceMatters = () => {
  const location = useLocation();
  const gameId = "finance-insurance-pension-16";
  const gameData = getGameDataById(gameId);
  const totalStages = WHEN_INSURANCE_MATTERS_STAGES.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const totalCoins = gameData?.coins ?? location.state?.totalCoins ?? 5;
  const coinsPerLevel = Math.max(1, Math.floor(totalCoins / totalStages));
  const totalXp = gameData?.xp ?? location.state?.totalXp ?? 10;
  const stage = WHEN_INSURANCE_MATTERS_STAGES[currentStageIndex];

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
      title="When Insurance Matters"
      subtitle={
        showResult
          ? "Quiz complete! You understand when insurance becomes critical."
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

export default WhenInsuranceMatters;
