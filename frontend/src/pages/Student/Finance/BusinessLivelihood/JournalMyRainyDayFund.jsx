import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const PROMPTS = [
  "Why is it dangerous to assume your business will make the exact same amount of money every single month?",
  "If your shop had to close for a week due to illness, how would an emergency fund help you?",
  "How much money (in terms of months of expenses) do you think a business should keep saved for a 'rainy day'?",
  "What is the difference between reinvesting your profits into the business versus saving cash for emergencies?",
  "Write down a promise to always save a small percentage of your profits before spending them.",
];

const MIN_LEN = 10;

const JournalMyRainyDayFund = () => {
  const location = useLocation();
  const totalStages = PROMPTS.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [entry, setEntry] = useState("");
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();
  
  // Registering at index 66 (game-67 in 1-based index mapping, but array position 66)
  const gameId = "finance-business-livelihood-finance-66";
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
      title="Journal: My Rainy Day Fund"
      subtitle={
        showResult
          ? "Journal complete! You are prepared for the unexpected."
          : `Savings Plan ${progressLabel}`
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
        <div className="space-y-6 max-w-3xl mx-auto border-[3px] border-cyan-500/30 rounded-3xl p-6 md:p-8 bg-slate-900/90 backdrop-blur-xl shadow-[0_0_50px_rgba(6,182,212,0.15)] relative">
          
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(6,182,212,0.1),transparent_60%)] pointer-events-none rounded-3xl"></div>

          <div className="flex items-center justify-between text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400 relative z-10">
            <span>Security Check {progressLabel}</span>
            <span className="bg-cyan-950/80 px-4 py-1.5 rounded shadow-sm border border-cyan-500/40">
              Score: {score}/{totalStages}
            </span>
          </div>
          
          <p className="text-cyan-300 font-bold tracking-widest uppercase text-xs mt-6 mb-2 relative z-10 opacity-80">Prompt:</p>
          <p className="text-white text-xl md:text-2xl font-serif leading-relaxed italic relative z-10 border-l-4 border-cyan-500/50 pl-4 bg-slate-800/30 py-2 rounded-r pr-2 shadow-inner">
            "{stage}"
          </p>
          
          <div className="mt-8 relative z-10">
            <textarea
              value={entry}
              onChange={(e) => setEntry(e.target.value)}
              className="w-full rounded-2xl bg-black/50 text-cyan-50 p-5 border border-cyan-500/40 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/50 transition-all font-medium resize-none shadow-inner text-lg placeholder-cyan-800 min-h-[160px]"
              placeholder="Reflect on your emergency fund strategy..."
              rows={5}
            />
            <div className={`absolute bottom-4 right-4 text-xs font-bold px-3 py-1.5 rounded-md backdrop-blur-md transition-colors ${entry.trim().length >= MIN_LEN ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
              {entry.trim().length} / {MIN_LEN}
            </div>
          </div>
          
          <div className="flex justify-end mt-8 relative z-10">
            <button
              onClick={handleSubmit}
              disabled={entry.trim().length < MIN_LEN}
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold tracking-wide shadow-[0_5px_20px_rgba(6,182,212,0.4)] hover:opacity-95 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
            >
              Secure Entry
            </button>
          </div>
        </div>
      )}
    </GameShell>
  );
};

export default JournalMyRainyDayFund;
