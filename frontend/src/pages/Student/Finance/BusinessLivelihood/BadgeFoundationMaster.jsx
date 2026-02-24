import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const STAGES = [
  {
    id: 1,
    prompt: "Mastery Check: What is the most critical habit for a new business?",
    options: [
      { id: "opt1", text: "Mixing personal and business cash", outcome: "Creates confusion and hides true profit.", isCorrect: false },
      { id: "opt2", text: "Keeping strict, separate accounts", outcome: "Correct. Separation is the foundation of business finance.", isCorrect: true },
      { id: "opt3", text: "Never giving bills to save paper", outcome: "Avoids creating a legal proof of sale.", isCorrect: false },
      { id: "opt4", text: "Trusting memory for inventory", outcome: "Leads to hidden losses and theft.", isCorrect: false },
    ],
  },
  {
    id: 2,
    prompt: "Record Keeping: Why are daily records essential?",
    options: [
      { id: "opt1", text: "They prevent silent cash leaks", outcome: "Correct. Tracking every rupee stops slow losses.", isCorrect: true },
      { id: "opt2", text: "They look good on a desk", outcome: "Records must be used, not just displayed.", isCorrect: false },
      { id: "opt3", text: "They are only needed for taxes", outcome: "They are needed for daily survival too.", isCorrect: false },
      { id: "opt4", text: "They guarantee you won't lose money", outcome: "They show you where it goes, but you still make the decisions.", isCorrect: false },
    ],
  },
  {
    id: 3,
    prompt: "Credit Management: How should you handle customers buying on credit?",
    options: [
      { id: "opt1", text: "Never give credit under any circumstance", outcome: "Sometimes credit is needed for business.", isCorrect: false },
      { id: "opt2", text: "Just remember their face and amount", outcome: "Memory fails, leading to disputes.", isCorrect: false },
      { id: "opt3", text: "Record the exact date, amount, and name instantly", outcome: "Correct. A written ledger protects your cash flow.", isCorrect: true },
      { id: "opt4", text: "Only write it down if it's a large amount", outcome: "Small amounts add up quickly.", isCorrect: false },
    ],
  },
  {
    id: 4,
    prompt: "Digital Finance: What is the primary benefit of digital payments?",
    options: [
      { id: "opt1", text: "They automatically generate a transaction trail", outcome: "Correct. This trail proves income for future loans.", isCorrect: true },
      { id: "opt2", text: "They are slower than counting cash", outcome: "Usually, they are much faster.", isCorrect: false },
      { id: "opt3", text: "They allow you to hide income", outcome: "Digital payments are completely transparent.", isCorrect: false },
      { id: "opt4", text: "They eliminate the need for bank accounts", outcome: "They are directly connected to bank accounts.", isCorrect: false },
    ],
  },
  {
    id: 5,
    prompt: "Overall Mastery: Which set of habits earns you the Foundation Badge?",
    options: [
      { id: "opt1", text: "Cash only + Memory + No Bills", outcome: "Keeps the business small and vulnerable.", isCorrect: false },
      { id: "opt2", text: "Separate Accounts + Daily Records + Clear Bills + Bank Trail", outcome: "Correct! This is true business foundation mastery.", isCorrect: true },
      { id: "opt3", text: "Loans for personal use + Unrecorded inventory", outcome: "A recipe for business failure.", isCorrect: false },
      { id: "opt4", text: "Only focus on sales, ignore expenses", outcome: "Sales without profit is just busywork.", isCorrect: false },
    ],
  },
];

const BadgeFoundationMaster = () => {
  const location = useLocation();
  const totalStages = STAGES.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const { showAnswerConfetti, showCorrectAnswerFeedback, flashPoints } = useGameFeedback();
  const gameId = "finance-business-livelihood-finance-10";
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
      title="Badge: Foundation Master"
      subtitle={
        showResult
          ? "Achievement unlocked! You're a Business Foundation Master."
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
                    : "from-blue-600 to-purple-600 border-transparent hover:from-blue-500 hover:to-purple-500";
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

export default BadgeFoundationMaster;
