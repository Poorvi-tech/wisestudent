import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const STAGES = [
  {
    id: 1,
    prompt: "Mastery check: What shows protection readiness?",
    options: [
      { id: "invest-only", text: "Invest everything; skip protection", outcome: "Leaves big risks uncovered.", isCorrect: false },
      { id: "cash-only", text: "Keep only cash at home", outcome: "Inflation erodes value.", isCorrect: false },
      { id: "no-plan", text: "No plan; decide later", outcome: "Increases vulnerability.", isCorrect: false },
      { id: "cover-emergency", text: "Adequate health & term cover + emergency fund", outcome: "Correct. Cover big risks and keep buffer.", isCorrect: true },
    ],
  },
  {
    id: 2,
    prompt: "Pension mastery: Which habit supports independence?",
    options: [
      { id: "consistent", text: "Consistent contributions for long term", outcome: "Correct. Consistency compounds.", isCorrect: true },
      { id: "skip-often", text: "Skip contributions frequently", outcome: "Breaks compounding.", isCorrect: false },
      { id: "withdraw", text: "Withdraw returns yearly", outcome: "Reduces growth.", isCorrect: false },
      { id: "hype", text: "Switch by hype often", outcome: "Churn adds risk.", isCorrect: false },
    ],
  },
  {
    id: 3,
    prompt: "Fraud safety: Best reflex in suspicious outreach?",
    options: [
      { id: "blind-trust", text: "Trust and pay quickly", outcome: "High risk of fraud.", isCorrect: false },
      { id: "click-links", text: "Click unknown links", outcome: "Unsafe behavior.", isCorrect: false },
      { id: "share-otp", text: "Share OTP if asked", outcome: "Compromises security.", isCorrect: false },
      { id: "verify", text: "Verify insurer and avoid sharing OTP", outcome: "Correct. Verification prevents fraud.", isCorrect: true },
    ],
  },
  {
    id: 4,
    prompt: "Claim success: What preparation helps most?",
    options: [
      { id: "ignore-terms", text: "Ignore policy terms", outcome: "Causes claim issues.", isCorrect: false },
      { id: "only-agent", text: "Depend entirely on agent", outcome: "Personal readiness still needed.", isCorrect: false },
      { id: "docs-ready", text: "Keep documents and terms ready", outcome: "Correct. Preparation speeds claims.", isCorrect: true },
      { id: "delay-paper", text: "Delay paperwork until crisis", outcome: "Slows process.", isCorrect: false },
    ],
  },
  {
    id: 5,
    prompt: "Overall mastery: Which set earns the badge?",
    options: [
      { id: "only-spend", text: "Spend now; ignore future", outcome: "No long‑term security.", isCorrect: false },
      { id: "balanced", text: "Cover big risks + emergency fund + pension + fraud safety", outcome: "Correct. This is financial security mastery.", isCorrect: true },
      { id: "only-insure", text: "Only insurance; no savings", outcome: "Liquidity gaps remain.", isCorrect: false },
      { id: "only-save", text: "Only savings; no insurance", outcome: "Big risks uncovered.", isCorrect: false },
    ],
  },
];

const BadgeFinancialSecurityMaster = () => {
  const location = useLocation();
  const totalStages = STAGES.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const { showAnswerConfetti, showCorrectAnswerFeedback, flashPoints } = useGameFeedback();
  const gameId = "finance-insurance-pension-50";
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
      title="Badge: Financial Security Master"
      subtitle={
        showResult
          ? "Achievement unlocked! You’re a Financial Security Master."
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

export default BadgeFinancialSecurityMaster;
