import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const PROMPTS = [
  "If you keep a perfect record of every rupee you earn and spend, where do you see your business in 5 years?",
  "How will having 5 years of clean, formal business records help you if you want to buy a permanent shop or office space?",
  "Imagine you want to pass this business on to your children. Why will a documented business history be easier for them to inherit?",
  "A foreign investor reads your 5-year ledger and sees consistent, legal profits. What might they offer you?",
  "Write down your ultimate 5-year goal for your business, and how formal discipline will help you reach it.",
];

const MIN_LEN = 10;

const JournalMy5YearPlan = () => {
  const location = useLocation();
  const totalStages = PROMPTS.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [entry, setEntry] = useState("");
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();
  
  // Registering at index 94 (game-95 in 1-based index mapping, but array position 94)
  const gameId = "finance-business-livelihood-finance-94";
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
      title="Journal: My 5-Year Plan"
      subtitle={
        showResult
          ? "Journal complete! Your future is secured by your present discipline."
          : `Horizon ${progressLabel}`
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
        <div className="space-y-6 max-w-3xl mx-auto border-[3px] border-sky-500/30 rounded-3xl p-6 md:p-8 bg-blue-950/90 backdrop-blur-xl shadow-[0_0_50px_rgba(14,165,233,0.15)] relative overflow-hidden">
          
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(14,165,233,0.15),transparent_60%)] pointer-events-none"></div>
          
          {/* Subtle calendar/planning motifs */}
          <div className="absolute top-10 right-10 w-32 h-32 border-[1px] border-sky-500/10 rounded-full pointer-events-none"></div>
          <div className="absolute top-14 right-14 w-24 h-24 border-[1px] border-sky-500/20 rounded-full pointer-events-none"></div>
          <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-sky-500/20 to-transparent pointer-events-none"></div>

          <div className="flex items-center justify-between text-sm font-semibold uppercase tracking-[0.2em] text-sky-400 relative z-10">
            <span>Future Projection {progressLabel}</span>
            <span className="bg-sky-950/80 px-4 py-1.5 rounded shadow-sm border border-sky-500/40">
              Score: {score}/{totalStages}
            </span>
          </div>
          
          <p className="text-sky-300 font-bold tracking-widest uppercase text-xs mt-6 mb-2 relative z-10 opacity-80">Vision:</p>
          <p className="text-white text-xl md:text-2xl font-serif leading-relaxed italic relative z-10 border-l-4 border-sky-500/50 pl-5 py-2 font-medium">
            "{stage}"
          </p>
          
          <div className="mt-8 relative z-10">
            <textarea
              value={entry}
              onChange={(e) => setEntry(e.target.value)}
              className="w-full rounded-2xl bg-black/50 text-sky-50 p-5 border border-sky-500/40 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-500/50 transition-all font-medium resize-none shadow-inner text-lg placeholder-sky-800/80 min-h-[160px]"
              placeholder="Jot down your 5-year outlook..."
              rows={5}
            />
            <div className={`absolute bottom-4 right-4 text-xs font-bold px-3 py-1.5 rounded-md backdrop-blur-md transition-colors ${entry.trim().length >= MIN_LEN ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
              {entry.trim().length} / {MIN_LEN}
            </div>
          </div>
          
          <div className="flex justify-end mt-8 relative z-10">
            <button
              onClick={handleSubmit}
              disabled={entry.trim().length < MIN_LEN}
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-sky-600 to-blue-700 text-white font-bold tracking-wide shadow-[0_5px_20px_rgba(14,165,233,0.4)] hover:opacity-95 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
            >
              Document Future
            </button>
          </div>
        </div>
      )}
    </GameShell>
  );
};

export default JournalMy5YearPlan;
