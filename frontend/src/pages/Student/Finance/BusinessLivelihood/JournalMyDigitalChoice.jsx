import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const PROMPTS = [
  "Which digital payment app would you use for your shop and why?",
  "How would using a digital payment app help you track your daily sales?",
  "What is the biggest advantage of receiving money directly into your bank account?",
  "How do digital payments protect you from the risk of fake currency?",
  "How can a history of digital transactions help you get a business loan in the future?",
];

const MIN_LEN = 10;

const JournalMyDigitalChoice = () => {
  const location = useLocation();
  const totalStages = PROMPTS.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [entry, setEntry] = useState("");
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();
  
  const gameId = "finance-business-livelihood-finance-6";
  const gameData = getGameDataById(gameId);
  const totalCoins = gameData?.coins ?? location.state?.totalCoins ?? 10;
  const coinsPerLevel = Math.max(2, Math.floor(totalCoins / totalStages));
  const totalXp = gameData?.xp ?? location.state?.totalXp ?? 20;

  const handleSubmit = () => {
    if (entry.trim().length < MIN_LEN) return;
    setScore((s) => s + 1);
    showCorrectAnswerFeedback(1, true);
    if (currentStageIndex === totalStages - 1) {
      setTimeout(() => {
        setShowResult(true);
      }, 800);
    } else {
      setTimeout(() => {
        setCurrentStageIndex((i) => i + 1);
        setEntry("");
      }, 800);
    }
  };

  const stage = PROMPTS[currentStageIndex];
  const progressLabel = `${currentStageIndex + 1}/${totalStages}`;

  return (
    <GameShell
      title="Journal: My Digital Choice"
      subtitle={
        showResult
          ? "Journal complete! Digital payments help formalize your business."
          : `Stage ${progressLabel}`
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
      {!showResult && (
        <div className="space-y-6">
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-2xl">
            <div className="flex items-center justify-between text-sm font-semibold uppercase tracking-[0.2em] text-white/70">
              <span>Stage {progressLabel}</span>
              <span>
                Score: {score}/{totalStages}
              </span>
            </div>
            
            <p className="text-emerald-400 font-bold tracking-wider uppercase text-xs mt-4 mb-2">Question:</p>
            <p className="text-white text-lg md:text-xl font-bold leading-snug">
              {stage}
            </p>
            
            <div className="mt-6 relative">
              <textarea
                value={entry}
                onChange={(e) => setEntry(e.target.value)}
                className="w-full rounded-2xl bg-black/20 text-white p-4 border border-white/20 outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all font-medium resize-none shadow-inner"
                placeholder="Write your journal entry here (min 10 characters)..."
                rows={4}
              />
              <div className={`absolute bottom-3 right-3 text-xs font-bold px-2 py-1 rounded-md ${entry.trim().length >= MIN_LEN ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                {entry.trim().length} / {MIN_LEN}
              </div>
            </div>
            
            <div className="flex justify-end mt-6">
              <button
                onClick={handleSubmit}
                disabled={entry.trim().length < MIN_LEN}
                className="px-6 py-2.5 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-white font-bold tracking-wide shadow-[0_5px_15px_rgba(251,191,36,0.3)] hover:opacity-90 transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
              >
                Submit Entry
              </button>
            </div>
          </div>
        </div>
      )}
    </GameShell>
  );
};

export default JournalMyDigitalChoice;
