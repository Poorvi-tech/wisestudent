import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const PROMPTS = [
  "What is one rule you will follow to make sure you never mix shop money with house money?",
  "Why is it dangerous for a business owner to treat the cash register like a personal wallet?",
  "Imagine you want to buy a personal gift. How will you take that money out of your business 'formally'?",
  "How does keeping business money separate make it easier to calculate your true monthly profit?",
  "Write down a promise to your future business self about separating personal and business finances.",
];

const MIN_LEN = 10;

const JournalMyBusinessRule = () => {
  const location = useLocation();
  const totalStages = PROMPTS.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [entry, setEntry] = useState("");
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();
  
  // Registering at index 22 (game-23 in the 1-based index naming, but array index 22)
  const gameId = "finance-business-livelihood-finance-22";
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
      title="Journal: My Business Rule"
      subtitle={
        showResult
          ? "Journal complete! Your financial discipline is set in stone."
          : `Entry ${progressLabel}`
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
        <div className="space-y-6 max-w-3xl mx-auto">
          <div className="bg-indigo-950/90 backdrop-blur-xl rounded-3xl p-6 md:p-8 border-2 border-indigo-400/30 shadow-[0_0_30px_rgba(99,102,241,0.2)]">
            <div className="flex items-center justify-between text-sm font-semibold uppercase tracking-[0.2em] text-indigo-300">
              <span>Rule Reflection {progressLabel}</span>
              <span className="bg-indigo-900/50 px-3 py-1 rounded shadow-sm border border-indigo-500/30">
                Score: {score}/{totalStages}
              </span>
            </div>
            
            <p className="text-emerald-400 font-bold tracking-wider uppercase text-xs mt-6 mb-2">Prompt:</p>
            <p className="text-indigo-50 text-xl md:text-2xl font-serif leading-relaxed italic">
              "{stage}"
            </p>
            
            <div className="mt-8 relative">
              <textarea
                value={entry}
                onChange={(e) => setEntry(e.target.value)}
                className="w-full rounded-2xl bg-black/40 text-indigo-100 p-5 border border-indigo-500/30 outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition-all font-medium resize-none shadow-inner text-lg placeholder-indigo-700/50 min-h-[160px]"
                placeholder="Write your rule here..."
                rows={5}
              />
              <div className={`absolute bottom-4 right-4 text-xs font-bold px-3 py-1.5 rounded-md backdrop-blur-md ${entry.trim().length >= MIN_LEN ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'}`}>
                {entry.trim().length} / {MIN_LEN}
              </div>
            </div>
            
            <div className="flex justify-end mt-8">
              <button
                onClick={handleSubmit}
                disabled={entry.trim().length < MIN_LEN}
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 text-white font-bold tracking-wide shadow-[0_5px_20px_rgba(99,102,241,0.4)] hover:opacity-95 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
              >
                Seal the Rule
              </button>
            </div>
          </div>
        </div>
      )}
    </GameShell>
  );
};

export default JournalMyBusinessRule;
