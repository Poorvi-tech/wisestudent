import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const STAGES = [
  {
    id: 1,
    prompt: "To be retirement ready, what’s the best first move?",
    options: [
      { id: "delay", text: "Delay until late 50s", outcome: "Delays reduce growth and corpus.", isCorrect: false },
      { id: "spend-all", text: "Spend all income now", outcome: "Leaves nothing for future security.", isCorrect: false },
      { id: "random", text: "Invest randomly each year", outcome: "Plan and consistency beat randomness.", isCorrect: false },
      { id: "start-early", text: "Start contributions early", outcome: "Correct. Time boosts compounding.", isCorrect: true },
    ],
  },
  {
    id: 2,
    prompt: "Which habit protects your pension plan during emergencies?",
    options: [
      { id: "use-pension", text: "Use pension money for emergencies", outcome: "Raiding pension slows long-term growth.", isCorrect: false },
      { id: "no-buffer", text: "Keep no buffer", outcome: "Increases risk and stress.", isCorrect: false },
      { id: "emergency-fund", text: "Keep a separate emergency fund", outcome: "Correct. Keeps pension contributions safe.", isCorrect: true },
      { id: "sell-assets", text: "Sell long-term assets first", outcome: "May lock in losses and disrupt plans.", isCorrect: false },
    ],
  },
  {
    id: 3,
    prompt: "What review practice supports long-term planning?",
    options: [
      { id: "never-review", text: "Never review the plan", outcome: "Misses course corrections.", isCorrect: false },
      { id: "annual-review", text: "Review and rebalance yearly", outcome: "Correct. Keeps plan aligned with goals.", isCorrect: true },
      { id: "weekly-churn", text: "Change funds every week", outcome: "Excess churn can harm returns.", isCorrect: false },
      { id: "follow-hype", text: "Follow latest hype", outcome: "Hype chasing increases risk.", isCorrect: false },
    ],
  },
  {
    id: 4,
    prompt: "Which approach builds the largest corpus by retirement?",
    options: [
      { id: "consistent-rise", text: "Increase contributions as income grows", outcome: "Correct. Step-up increases long-term corpus.", isCorrect: true },
      { id: "static-forever", text: "Keep fixed small amount forever", outcome: "May underfund goals with inflation.", isCorrect: false },
      { id: "stop-midway", text: "Stop contributions mid-way", outcome: "Breaks compounding momentum.", isCorrect: false },
      { id: "withdraw-returns", text: "Withdraw returns each year", outcome: "Erodes compounding effect.", isCorrect: false },
    ],
  },
  {
    id: 5,
    prompt: "Final step to earn the “Retirement Ready” badge?",
    options: [
      { id: "only-tax", text: "Plan only for tax season", outcome: "Short-term focus misses the goal.", isCorrect: false },
      { id: "guesswork", text: "Rely on guesswork", outcome: "Planning beats guesswork.", isCorrect: false },
      { id: "ignore-risk", text: "Ignore risk and coverage", outcome: "Protection shortfalls can derail plans.", isCorrect: false },
      { id: "document-plan", text: "Document plan and stick to it", outcome: "Correct. Clarity and discipline win.", isCorrect: true },
    ],
  },
];

const BadgeRetirementReady = () => {
  const location = useLocation();
  const totalStages = STAGES.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();
  const gameId = "finance-insurance-pension-40";
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

  const handleNext = () => {
    if (!selectedChoice) return;
    if (currentStageIndex === totalStages - 1) {
      setShowResult(true);
    } else {
      setCurrentStageIndex((i) => i + 1);
      setSelectedChoice(null);
    }
  };

  const progressLabel = `${currentStageIndex + 1}/${totalStages}`;

  return (
    <GameShell
      title="Badge: Retirement Ready"
      subtitle={
        showResult
          ? "Achievement complete! Badge unlocked: Retirement Ready."
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
              {selectedChoice && (
                <>
                  <div className="rounded-2xl bg-white/10 border border-white/20 p-4 text-sm text-white/80 mt-4">
                    {selectedChoice.outcome}
                  </div>
                  {currentStageIndex < totalStages - 1 && (
                    <div className="flex justify-end mt-4">
                      <button
                        onClick={handleNext}
                        className="px-5 py-2 rounded-full bg-gradient-to-r from-amber-400 to-pink-500 text-white font-semibold shadow-lg hover:opacity-90"
                      >
                        Next Stage
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default BadgeRetirementReady;
