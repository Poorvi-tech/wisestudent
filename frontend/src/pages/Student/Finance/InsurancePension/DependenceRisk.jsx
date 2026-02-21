import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const DEPENDENCE_RISK_STAGES = [
  {
    id: 1,
    prompt: "Someone plans to rely fully on children in old age. What's safer?",
    options: [
      {
        id: "depend-completely",
        text: "Depend completely",
        outcome:
          "Full dependence is uncertain and can strain families.",
        isCorrect: false,
      },
      {
        id: "spend-all",
        text: "Spend all income now",
        outcome:
          "Spending everything leaves no support for later years.",
        isCorrect: false,
      },
      {
        id: "ignore-future",
        text: "Ignore future",
        outcome:
          "Ignoring the future can lead to hardship later.",
        isCorrect: false,
      },
      {
        id: "build-security",
        text: "Build personal financial security",
        outcome:
          "Correct. Personal planning reduces future burden.",
        isCorrect: true,
      },
    ],
  },
  {
    id: 2,
    prompt: "Why is relying completely on children risky?",
    options: [
      {
        id: "always-available",
        text: "Children are always financially available",
        outcome:
          "Their own responsibilities may limit their ability to help.",
        isCorrect: false,
      },
      {
        id: "uncertain-income",
        text: "Their income and circumstances can change",
        outcome:
          "Correct. Depending fully on others is uncertain.",
        isCorrect: true,
      },
      {
        id: "no-costs",
        text: "Old age has no costs",
        outcome:
          "Healthcare and living costs can increase with age.",
        isCorrect: false,
      },
      {
        id: "plan-later",
        text: "Planning can wait until retirement",
        outcome:
          "Early planning is safer and more effective.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 3,
    prompt: "What is a good way to reduce future dependence?",
    options: [
      {
        id: "save-regularly",
        text: "Save regularly and build retirement funds",
        outcome:
          "Correct. Regular saving builds financial security.",
        isCorrect: true,
      },
      {
        id: "borrow-later",
        text: "Borrow money later",
        outcome:
          "Borrowing in old age can be risky and expensive.",
        isCorrect: false,
      },
      {
        id: "skip-savings",
        text: "Skip savings and spend freely",
        outcome:
          "Skipping savings increases future risk.",
        isCorrect: false,
      },
      {
        id: "hope-best",
        text: "Hope for the best",
        outcome:
          "Hope is not a plan.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 4,
    prompt: "Which is the most reliable source of retirement support?",
    options: [
      {
        id: "personal-savings",
        text: "Personal savings and pension plan",
        outcome:
          "Correct. Your own plan is the most reliable.",
        isCorrect: true,
      },
      {
        id: "children-only",
        text: "Children only",
        outcome:
          "Children may not always be able to support financially.",
        isCorrect: false,
      },
      {
        id: "lottery",
        text: "Winning a lottery",
        outcome:
          "Lottery wins are highly uncertain.",
        isCorrect: false,
      },
      {
        id: "no-plan",
        text: "No plan needed",
        outcome:
          "Planning reduces future burden.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 5,
    prompt: "What is the key takeaway from dependence risk?",
    options: [
      {
        id: "depend-others",
        text: "Depending on others is safest",
        outcome:
          "Full dependence is uncertain and risky.",
        isCorrect: false,
      },
      {
        id: "ignore-future",
        text: "Ignore the future",
        outcome:
          "Ignoring the future can create hardship.",
        isCorrect: false,
      },
      {
        id: "spend-now",
        text: "Spend everything now",
        outcome:
          "Spending now can leave you exposed later.",
        isCorrect: false,
      },
      {
        id: "plan-self",
        text: "Plan and build your own security",
        outcome:
          "Correct. Personal planning reduces future burden.",
        isCorrect: true,
      },
    ],
  },
];

const DependenceRisk = () => {
  const location = useLocation();
  const gameId = "finance-insurance-pension-22";
  const gameData = getGameDataById(gameId);
  const totalStages = DEPENDENCE_RISK_STAGES.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const totalCoins = gameData?.coins ?? location.state?.totalCoins ?? 5;
  const coinsPerLevel = Math.max(1, Math.floor(totalCoins / totalStages));
  const totalXp = gameData?.xp ?? location.state?.totalXp ?? 10;
  const stage = DEPENDENCE_RISK_STAGES[currentStageIndex];

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
      title="Dependence Risk"
      subtitle={
        showResult
          ? "Quiz complete! You understand how to reduce future dependence."
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

export default DependenceRisk;
