import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const PROMPTS = [
  "How does paying taxes help build better roads for your suppliers to reach you faster?",
  "When a business pays its fair share of taxes, how does that support the local schools your children (or your employees' children) attend?",
  "Why might a bank trust a business that officially pays taxes more than a business that hides its income?",
  "Imagine you see a new hospital being built in your town. How does your tax contribution play a role in that?",
  "Write a short, honest pledge about running a legal, tax-compliant business that contributes to the country's growth.",
];

const MIN_LEN = 10;

const JournalMyHonestBusiness = () => {
  const location = useLocation();
  const totalStages = PROMPTS.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [entry, setEntry] = useState("");
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();
  
  // Registering at index 84 (game-85 in 1-based index mapping, but array position 84)
  const gameId = "finance-business-livelihood-finance-84";
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
      title="Journal: My Honest Business"
      subtitle={
        showResult
          ? "Journal complete! You are building the nation."
          : `Contribution ${progressLabel}`
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
        <div className="space-y-6 max-w-3xl mx-auto border-[3px] border-amber-500/30 rounded-3xl p-6 md:p-8 bg-orange-950/90 backdrop-blur-xl shadow-[0_0_50px_rgba(245,158,11,0.15)] relative overflow-hidden">
          
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.15),transparent_60%)] pointer-events-none"></div>
          
          {/* Subtle national building motifs - simple geometric shapes in background */}
          <div className="absolute bottom-0 left-10 w-24 h-32 bg-amber-900/10 border-t border-r border-l border-amber-500/20 rounded-t-sm pointer-events-none"></div>
          <div className="absolute bottom-0 left-36 w-16 h-48 bg-amber-900/10 border-t border-r border-l border-amber-500/20 rounded-t-sm pointer-events-none"></div>

          <div className="flex items-center justify-between text-sm font-semibold uppercase tracking-[0.2em] text-amber-400 relative z-10">
            <span>Civic Duty {progressLabel}</span>
            <span className="bg-amber-950/80 px-4 py-1.5 rounded shadow-sm border border-amber-500/40">
              Score: {score}/{totalStages}
            </span>
          </div>
          
          <p className="text-amber-300 font-bold tracking-widest uppercase text-xs mt-6 mb-2 relative z-10 opacity-80">Reflection:</p>
          <p className="text-white text-xl md:text-2xl font-serif leading-relaxed italic relative z-10 border-l-4 border-amber-500/50 pl-5 py-2 font-medium">
            "{stage}"
          </p>
          
          <div className="mt-8 relative z-10">
            <textarea
              value={entry}
              onChange={(e) => setEntry(e.target.value)}
              className="w-full rounded-2xl bg-black/50 text-amber-50 p-5 border border-amber-500/40 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-500/50 transition-all font-medium resize-none shadow-inner text-lg placeholder-amber-800/80 min-h-[160px]"
              placeholder="Reflect on your business's impact on society..."
              rows={5}
            />
            <div className={`absolute bottom-4 right-4 text-xs font-bold px-3 py-1.5 rounded-md backdrop-blur-md transition-colors ${entry.trim().length >= MIN_LEN ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
              {entry.trim().length} / {MIN_LEN}
            </div>
          </div>
          
          <div className="flex justify-end mt-8 relative z-10">
            <button
              onClick={handleSubmit}
              disabled={entry.trim().length < MIN_LEN}
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 text-white font-bold tracking-wide shadow-[0_5px_20px_rgba(245,158,11,0.4)] hover:opacity-95 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
            >
              Submit Reflection
            </button>
          </div>
        </div>
      )}
    </GameShell>
  );
};

export default JournalMyHonestBusiness;
