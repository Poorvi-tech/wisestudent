import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const PROMPTS = [
  "If your business doubles tomorrow, what is the first manual task you will automate to save time?",
  "How can keeping a digital ledger help you manage an unexpected surge in new customers?",
  "Why is it risky to rely only on your memory when your daily transaction volume triples?",
  "What formal tool or system would you introduce to handle employee salaries if you hire five more people?",
  "Write a short journal entry describing your vision of your business 5 years from now.",
];

const MIN_LEN = 10;

const JournalScalingUp = () => {
  const location = useLocation();
  const totalStages = PROMPTS.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [entry, setEntry] = useState("");
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();
  
  // Registering at index 54 (game-55 in 1-based index mapping, but array position 54)
  const gameId = "finance-business-livelihood-finance-54";
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
      title="Journal: Scaling Up"
      subtitle={
        showResult
          ? "Journal complete! You are ready to scale formally."
          : `Vision ${progressLabel}`
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
        <div className="space-y-6 max-w-3xl mx-auto border-2 border-fuchsia-500/30 rounded-3xl p-6 md:p-8 bg-fuchsia-950/80 backdrop-blur-xl shadow-[0_0_40px_rgba(192,38,211,0.15)] relative">
          
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(192,38,211,0.1),transparent_70%)] pointer-events-none rounded-3xl"></div>

          <div className="flex items-center justify-between text-sm font-semibold uppercase tracking-[0.2em] text-fuchsia-300 relative z-10">
            <span>Growth Plan {progressLabel}</span>
            <span className="bg-fuchsia-900/50 px-3 py-1 rounded shadow-sm border border-fuchsia-500/30">
              Score: {score}/{totalStages}
            </span>
          </div>
          
          <p className="text-pink-400 font-bold tracking-wider uppercase text-xs mt-6 mb-2 relative z-10">Prompt:</p>
          <p className="text-white text-xl md:text-2xl font-serif leading-relaxed italic relative z-10">
            "{stage}"
          </p>
          
          <div className="mt-8 relative z-10">
            <textarea
              value={entry}
              onChange={(e) => setEntry(e.target.value)}
              className="w-full rounded-2xl bg-black/40 text-fuchsia-50 p-5 border border-fuchsia-500/30 outline-none focus:border-fuchsia-400 focus:ring-1 focus:ring-fuchsia-400 transition-all font-medium resize-none shadow-inner text-lg placeholder-fuchsia-700/50 min-h-[160px]"
              placeholder="Jot down your scaling thoughts here..."
              rows={5}
            />
            <div className={`absolute bottom-4 right-4 text-xs font-bold px-3 py-1.5 rounded-md backdrop-blur-md transition-colors ${entry.trim().length >= MIN_LEN ? 'bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'}`}>
              {entry.trim().length} / {MIN_LEN}
            </div>
          </div>
          
          <div className="flex justify-end mt-8 relative z-10">
            <button
              onClick={handleSubmit}
              disabled={entry.trim().length < MIN_LEN}
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white font-bold tracking-wide shadow-[0_5px_20px_rgba(192,38,211,0.4)] hover:opacity-95 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
            >
              Log Strategy
            </button>
          </div>
        </div>
      )}
    </GameShell>
  );
};

export default JournalScalingUp;
