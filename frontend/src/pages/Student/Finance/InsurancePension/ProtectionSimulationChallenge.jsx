import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const STAGES = [
  {
    id: 1,
    prompt: "Illness event: Which plan balances cost and protection?",
    options: [
      { id: "no-cover", text: "No insurance, pay from savings", outcome: "Large costs can wipe savings.", isCorrect: false },
      { id: "over-cover", text: "Very high cover, no savings", outcome: "Overpaying leaves no buffer.", isCorrect: false },
      { id: "balanced", text: "Adequate health cover + small emergency fund", outcome: "Correct. Cover big risks and keep buffer.", isCorrect: true },
      { id: "borrow", text: "Borrow immediately", outcome: "Debt increases strain.", isCorrect: false },
    ],
  },
  {
    id: 2,
    prompt: "Job loss event: What keeps bills paid for a few months?",
    options: [
      { id: "efund", text: "3–6 months emergency fund + basic expenses cut", outcome: "Correct. Liquidity maintains stability.", isCorrect: true },
      { id: "no-buffer", text: "No buffer, hope for quick job", outcome: "Hope is not a plan.", isCorrect: false },
      { id: "all-invested", text: "All money locked in long-term funds", outcome: "Illiquid funds can’t pay bills now.", isCorrect: false },
      { id: "loan", text: "High-interest loan for monthly costs", outcome: "Increases burden.", isCorrect: false },
    ],
  },
  {
    id: 3,
    prompt: "Retirement event: Which approach supports independence?",
    options: [
      { id: "depend", text: "Depend completely on family", outcome: "Dependence reduces choices.", isCorrect: false },
      { id: "no-plan", text: "No plan, spend as it comes", outcome: "Uncertain and risky.", isCorrect: false },
      { id: "balanced", text: "Pension contributions + diversified savings", outcome: "Correct. Steady planning supports dignity.", isCorrect: true },
      { id: "only-cash", text: "Keep only cash at home", outcome: "Erodes to inflation.", isCorrect: false },
    ],
  },
  {
    id: 4,
    prompt: "Medical inflation rises. Best ongoing adjustment?",
    options: [
      { id: "ignore", text: "Ignore; keep same cover forever", outcome: "Cover can become inadequate.", isCorrect: false },
      { id: "cut-savings", text: "Cut all savings to pay premiums", outcome: "Creates other vulnerabilities.", isCorrect: false },
      { id: "no-claims", text: "Stop cover if no recent claims", outcome: "Risks are uncertain.", isCorrect: false },
      { id: "raise-cover", text: "Review and adjust health cover over time", outcome: "Correct. Coverage should track costs.", isCorrect: true },
    ],
  },
  {
    id: 5,
    prompt: "Overall plan across illness, job loss, retirement:",
    options: [
      { id: "single-focus", text: "Focus only on one event", outcome: "Gaps create setbacks.", isCorrect: false },
      { id: "balanced", text: "Balance: insurance + emergency fund + pension", outcome: "Correct. Balanced planning wins.", isCorrect: true },
      { id: "all-expense", text: "Spend all income now", outcome: "Future becomes fragile.", isCorrect: false },
      { id: "only-invest", text: "Invest everything; skip protection", outcome: "Big risks remain uncovered.", isCorrect: false },
    ],
  },
];

const ProtectionSimulationChallenge = () => {
  const location = useLocation();
  const totalStages = STAGES.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const { showAnswerConfetti, showCorrectAnswerFeedback, flashPoints } = useGameFeedback();
  const gameId = "finance-insurance-pension-49";
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
      title="Protection Simulation Challenge"
      subtitle={
        showResult
          ? "Simulation complete! Balanced planning across events wins."
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
      </div>
    </GameShell>
  );
};

export default ProtectionSimulationChallenge;
