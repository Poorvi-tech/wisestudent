import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const STAGES = [
  {
    id: 1,
    prompt: "A 25-year-old wants dignity at 60. Best start?",
    options: [
      { id: "wait-50", text: "Wait till 50 for higher income", outcome: "Waiting reduces time and raises pressure.", isCorrect: false },
      { id: "no-plan", text: "Skip planning; rely on luck", outcome: "Luck is uncertain and risky.", isCorrect: false },
      { id: "start-early", text: "Start early with monthly retirement savings", outcome: "Correct. Early, steady saving uses time and compounding.", isCorrect: true },
      { id: "spend-all", text: "Spend fully now; plan later", outcome: "Overspending harms long-term security.", isCorrect: false },
    ],
  },
  {
    id: 2,
    prompt: "A worker mixes retirement and daily expense money. Safer step?",
    options: [
      { id: "one-wallet", text: "Use the same account for all", outcome: "Mixing funds risks using pension money.", isCorrect: false },
      { id: "separate-goals", text: "Keep separate retirement goal and account", outcome: "Correct. Separation protects long-term savings.", isCorrect: true },
      { id: "borrow-later", text: "Borrow when short; no need to plan", outcome: "Borrowing increases future burden.", isCorrect: false },
      { id: "ignore", text: "Ignore tracking", outcome: "Lack of tracking causes leakage.", isCorrect: false },
    ],
  },
  {
    id: 3,
    prompt: "A saver ignores inflation and longevity. Better approach?",
    options: [
      { id: "factor-both", text: "Plan for inflation and longer life", outcome: "Correct. Adequacy needs both considered.", isCorrect: true },
      { id: "ignore-inflation", text: "Ignore inflation", outcome: "Ignoring inflation erodes value.", isCorrect: false },
      { id: "assume-short", text: "Assume short life expectancy", outcome: "Underestimating longevity risks shortfall.", isCorrect: false },
      { id: "only-returns", text: "Chase returns only", outcome: "Return-chasing without adequacy risks.", isCorrect: false },
    ],
  },
  {
    id: 4,
    prompt: "An emergency drains savings each year. What helps protect pension?",
    options: [
      { id: "use-pension", text: "Use pension money for emergencies", outcome: "This delays or reduces corpus.", isCorrect: false },
      { id: "no-buffer", text: "Keep no buffer; depend on loans", outcome: "Debt increases future pressure.", isCorrect: false },
      { id: "sell-assets", text: "Plan to sell assets later", outcome: "Forced asset sales are risky.", isCorrect: false },
      { id: "build-emergency", text: "Build a separate emergency fund", outcome: "Correct. Separate buffers protect retirement money.", isCorrect: true },
    ],
  },
  {
    id: 5,
    prompt: "Choosing a retirement vehicle. Safer principle?",
    options: [
      { id: "single-bet", text: "Put all money in one product", outcome: "Concentration increases risk.", isCorrect: false },
      { id: "illiquid-only", text: "Prefer only illiquid options", outcome: "Illiquidity can hurt flexibility.", isCorrect: false },
      { id: "diversify", text: "Diversify and align with risk, taxes, liquidity", outcome: "Correct. Fit choices to horizon and risk.", isCorrect: true },
      { id: "tax-only", text: "Choose by tax benefit only", outcome: "Tax is one factor, not the only one.", isCorrect: false },
    ],
  },
];

const BadgeFuturePlanner = () => {
  const location = useLocation();
  const { flashPoints, showAnswerConfetti } = useGameFeedback();

  const totalStages = STAGES.length;
  const gameId = "finance-insurance-pension-30";
  const gameData = getGameDataById(gameId);
  const totalCoins = gameData?.coins ?? location.state?.totalCoins ?? 10;
  const coinsPerLevel = Math.max(2, Math.floor(totalCoins / totalStages));
  const totalXp = gameData?.xp ?? location.state?.totalXp ?? 20;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const stage = STAGES[currentStageIndex];

  const handleChoice = (option) => {
    if (selectedChoice || !stage) return;
    setSelectedChoice(option);
    if (option.isCorrect) {
      setScore((prev) => prev + 1);
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
      setCurrentStageIndex((prev) => prev + 1);
    }
    setSelectedChoice(null);
  };

  const progressLabel = `${currentStageIndex + 1}/${totalStages}`;

  return (
    <GameShell
      title="Badge: Future Planner"
      subtitle={
        showResult
          ? "Achievement complete! You’ve earned the Future Planner badge."
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
                <span>Score: {score}/{totalStages}</span>
              </div>
              <p className="text-white text-lg md:text-xl font-bold leading-snug mt-4">{stage.prompt}</p>
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

export default BadgeFuturePlanner;
