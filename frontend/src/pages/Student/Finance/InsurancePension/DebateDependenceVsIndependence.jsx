import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const STAGES = [
  {
    id: 1,
    prompt: "Is long-term planning a path to freedom?",
    options: [
      { id: "dependence-ok", text: "Dependence is preferable", outcome: "Dependence reduces choice and dignity.", isCorrect: false },
      { id: "independence", text: "Yes—planning builds independence", outcome: "Correct. Planning reduces future dependence.", isCorrect: true },
      { id: "no-need", text: "No need to plan", outcome: "Lack of planning increases risk.", isCorrect: false },
    ],
  },
  {
    id: 2,
    prompt: "Who benefits more from disciplined saving?",
    options: [
      { id: "spender", text: "The spender avoiding planning", outcome: "Avoidance increases future pressure.", isCorrect: false },
      { id: "luck", text: "Whoever is lucky", outcome: "Relying on luck is risky.", isCorrect: false },
      { id: "planner", text: "The planner seeking independence", outcome: "Correct. Savings support self-reliance.", isCorrect: true },
    ],
  },
  {
    id: 3,
    prompt: "What prevents burden on family in old age?",
    options: [
      { id: "personal-plan", text: "Personal plan and pension", outcome: "Correct. Planning protects dignity.", isCorrect: true },
      { id: "full-rely", text: "Fully relying on children", outcome: "Can create stress and uncertainty.", isCorrect: false },
      { id: "ignore", text: "Ignoring future", outcome: "Increases vulnerability later.", isCorrect: false },
    ],
  },
  {
    id: 4,
    prompt: "Which habit best supports freedom of choice later?",
    options: [
      { id: "spend-now", text: "Spend everything now", outcome: "Reduces future options.", isCorrect: false },
      { id: "consistent", text: "Consistent saving and protection", outcome: "Correct. Builds options and security.", isCorrect: true },
      { id: "delay", text: "Delay planning indefinitely", outcome: "Lost time reduces compounding.", isCorrect: false },
    ],
  },
  {
    id: 5,
    prompt: "Key debate point for independence:",
    options: [
      { id: "no-budget", text: "Avoid budgets for ‘freedom’", outcome: "Lack of structure invites chaos.", isCorrect: false },
      { id: "depend", text: "Depend fully on others", outcome: "Undermines autonomy.", isCorrect: false },
      { id: "early-plan", text: "Start early and stay disciplined", outcome: "Correct. Discipline compounds into freedom.", isCorrect: true },
    ],
  },
];

const DebateDependenceVsIndependence = () => {
  const location = useLocation();
  const totalStages = STAGES.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const { showAnswerConfetti, showCorrectAnswerFeedback, flashPoints } = useGameFeedback();
  const gameId = "finance-insurance-pension-48";
  const gameData = getGameDataById(gameId);
  const totalCoins = gameData?.coins ?? location.state?.totalCoins ?? 10;
  const coinsPerLevel = Math.max(2, Math.floor(totalCoins / totalStages));
  const totalXp = gameData?.xp ?? location.state?.totalXp ?? 20;
  const stage = STAGES[currentStageIndex];

  const handleChoice = (option) => {
    if (selectedChoice || !stage) return;
    setSelectedChoice(option);
    if (option.isCorrect) {
      setScore((s) => s + 1);
      showCorrectAnswerFeedback(1, true);
    }
    setTimeout(() => {
      if (currentStageIndex === totalStages - 1) {
        setShowResult(true);
      } else {
        setCurrentStageIndex((i) => i + 1);
      }
      setSelectedChoice(null);
    }, 700);
  };

  const progressLabel = `${currentStageIndex + 1}/${totalStages}`;

  return (
    <GameShell
      title="Debate: Dependence vs Independence"
      subtitle={
        showResult
          ? "Debate complete! Planning empowers independence."
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
      </div>
    </GameShell>
  );
};

export default DebateDependenceVsIndependence;
