import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const STAGES = [
  {
    id: 1,
    prompt: "Should retirement planning start early?",
    options: [
      
      {
        id: "start-late",
        text: "No, start only near retirement",
        outcome: "Late start reduces options and growth time.",
        isCorrect: false,
      },
      {
        id: "start-early",
        text: "Yes, start early to use time and compounding",
        outcome: "Correct. Early planning benefits from compounding.",
        isCorrect: true,
      },
      {
        id: "no-need",
        text: "No need to plan for retirement",
        outcome: "Ignoring retirement risks future dependence.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 2,
    prompt: "What is a strong argument for starting early?",
    options: [
      {
        id: "small-consistent",
        text: "Small consistent savings grow significantly over time",
        outcome: "Correct. Consistency + time build larger corpus.",
        isCorrect: true,
      },
      {
        id: "spend-first",
        text: "Spending fully now is always better",
        outcome: "Over-spending harms long-term security.",
        isCorrect: false,
      },
      {
        id: "depend-children",
        text: "Depend entirely on children later",
        outcome: "Dependence is risky and uncertain.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 3,
    prompt: "How does early planning affect risk?",
    options: [
     
      {
        id: "increase-risk",
        text: "It increases financial risk automatically",
        outcome: "Planning reduces uncertainty; it doesn't add risk.",
        isCorrect: false,
      },
      {
        id: "no-effect",
        text: "No effect on risk at all",
        outcome: "Time horizon directly affects risk handling.",
        isCorrect: false,
      },
       {
        id: "manage-risk",
        text: "More time to manage risk and adjust plans",
        outcome: "Correct. Time allows gradual, safer adjustments.",
        isCorrect: true,
      },
    ],
  },
  {
    id: 4,
    prompt: "Pick the better debate point:",
    options: [
      {
        id: "age-25",
        text: "Start at 25: affordable amounts, long horizon",
        outcome: "Correct. Affordability + time strengthen results.",
        isCorrect: true,
      },
      {
        id: "age-55",
        text: "Start at 55: very short horizon",
        outcome: "Late start forces larger contributions.",
        isCorrect: false,
      },
      {
        id: "no-start",
        text: "Never start; rely on luck",
        outcome: "Luck is not a plan.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 5,
    prompt: "What is a practical first step for early starters?",
    options: [
      
      {
        id: "mix-funds",
        text: "Mix retirement savings with daily expenses",
        outcome: "Mixing funds risks spending retirement money.",
        isCorrect: false,
      },
      {
        id: "separate-goal",
        text: "Define a separate retirement goal and save monthly",
        outcome: "Correct. Clear goal + habit creates progress.",
        isCorrect: true,
      },
      {
        id: "ignore-inflation",
        text: "Ignore inflation and longevity",
        outcome: "Ignoring these reduces adequacy of savings.",
        isCorrect: false,
      },
    ],
  },
];

const RetirementPlanningDebate = () => {
  const location = useLocation();
  const gameId = "finance-insurance-pension-23";
  const gameData = getGameDataById(gameId);
  const totalStages = STAGES.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const totalCoins = gameData?.coins ?? location.state?.totalCoins ?? 5;
  const coinsPerLevel = Math.max(1, Math.floor(totalCoins / totalStages));
  const totalXp = gameData?.xp ?? location.state?.totalXp ?? 10;
  const stage = STAGES[currentStageIndex];

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
      title="Retirement Planning Debate"
      subtitle={
        showResult
          ? "Debate complete! Early planning wins with time advantage."
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
        {selectedChoice && !showResult && (
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

export default RetirementPlanningDebate;

