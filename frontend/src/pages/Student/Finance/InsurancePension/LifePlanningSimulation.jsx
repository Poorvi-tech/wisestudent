import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const STAGES = [
  {
    id: 1,
    prompt: "₹30,000 income: which monthly allocation is most balanced?",
    options: [
      { id: "low-save", text: "Insurance ₹500, Savings ₹1,000, Expenses ₹28,500", outcome: "Too little cover and savings.", isCorrect: false },
      { id: "no-ins", text: "Insurance ₹0, Savings ₹8,000, Expenses ₹22,000", outcome: "No cover risks derail plans.", isCorrect: false },
      { id: "oversave", text: "Insurance ₹4,000, Savings ₹10,000, Expenses ₹16,000", outcome: "Might starve essentials; may be hard to sustain.", isCorrect: false },
      { id: "balanced-1", text: "Insurance ₹2,500, Savings ₹5,000, Expenses ₹22,500", outcome: "Balanced start with protection and savings.", isCorrect: true },
    ],
  },
  {
    id: 2,
    prompt: "After a raise, how to improve allocation?",
    options: [
      { id: "increase-expenses", text: "Increase expenses only", outcome: "Lifestyle creep reduces progress.", isCorrect: false },
      { id: "increase-both", text: "Increase insurance adequacy and savings", outcome: "Correct. Improve cover and growth together.", isCorrect: true },
      { id: "only-ins", text: "Only increase insurance, no savings", outcome: "Balance both for long-term goals.", isCorrect: false },
      { id: "only-save", text: "Only increase savings, ignore cover", outcome: "Undercoverage risks setbacks.", isCorrect: false },
    ],
  },
  {
    id: 3,
    prompt: "Unexpected medical cost appears. Best response?",
    options: [
      { id: "stop-sip", text: "Stop all investments permanently", outcome: "Overreaction and harms goals.", isCorrect: false },
      { id: "high-interest", text: "Take high-interest loan first", outcome: "Costly; last resort if no cover.", isCorrect: false },
      { id: "use-ins-ef", text: "Rely on health cover + emergency fund", outcome: "Correct. Avoids high-cost borrowing.", isCorrect: true },
      { id: "sell-assets", text: "Sell long-term assets immediately", outcome: "Derails compounding; better to plan protection.", isCorrect: false },
    ],
  },
  {
    id: 4,
    prompt: "To build stability, which is most sensible?",
    options: [
      { id: "prioritize-essential", text: "Prioritize essential cover + steady savings", outcome: "Correct. Balance risk protection and growth.", isCorrect: true },
      { id: "all-expense", text: "Spend almost all income", outcome: "Leaves no buffer for shocks.", isCorrect: false },
      { id: "only-cover", text: "Only buy insurance, no savings", outcome: "Protection without growth misses goals.", isCorrect: false },
      { id: "only-invest", text: "Only invest, no cover", outcome: "Uncovered risks can wipe progress.", isCorrect: false },
    ],
  },
  {
    id: 5,
    prompt: "Review after 1 year. Best action?",
    options: [
      { id: "no-review", text: "Never review allocations", outcome: "Misses changing needs.", isCorrect: false },
      { id: "cut-savings", text: "Cut savings to raise lifestyle", outcome: "Slows long-term progress.", isCorrect: false },
      { id: "drop-cover", text: "Drop insurance to boost returns", outcome: "Increases vulnerability.", isCorrect: false },
      { id: "rebalance", text: "Reassess needs and rebalance allocations", outcome: "Correct. Adjust with income and goals.", isCorrect: true },
    ],
  },
];

const LifePlanningSimulation = () => {
  const location = useLocation();
  const totalStages = STAGES.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();
  const gameId = "finance-insurance-pension-44";
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
    if (currentStageIndex === totalStages - 1) {
      setTimeout(() => setShowResult(true), 800);
    }
  };

  const handleNextStage = () => {
    if (!selectedChoice) return;
    if (currentStageIndex === totalStages - 1) {
      setShowResult(true);
    } else {
      setCurrentStageIndex((i) => i + 1);
    }
    setSelectedChoice(null);
  };

  const progressLabel = `${currentStageIndex + 1}/${totalStages}`;

  return (
    <GameShell
      title="Life Planning Simulation"
      subtitle={
        showResult
          ? "Simulation complete! Balance protection, savings, and expenses."
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

export default LifePlanningSimulation;
