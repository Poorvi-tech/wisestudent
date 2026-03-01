import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const PROMPTS = [
  "How does receiving a formal, printed bill make you feel about the shop you are buying from?",
  "If a shopkeeper refuses to give you a bill and asks for only cash, what do you suspect?",
  "Why is it important for a customer to have a bill when buying an expensive electronic item?",
  "How does providing a digital receipt via SMS or email show that a business is modern and professional?",
  "Write down a brief promise to always provide bills to your future customers to build long-term trust.",
];

const MIN_LEN = 10;

const JournalTheTrustFactor = () => {
  const location = useLocation();
  const totalStages = PROMPTS.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [entry, setEntry] = useState("");
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();
  
  // Registering at index 36 (game-37 in 1-based index mapping, but array position 36)
  const gameId = "finance-business-livelihood-finance-36";
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
      title="Journal: The Trust Factor"
      subtitle={
        showResult
          ? "Journal complete! Trust is your most valuable asset."
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
        <div className="space-y-6 max-w-3xl mx-auto border-2 border-emerald-500/30 rounded-3xl p-6 md:p-8 bg-emerald-950/80 backdrop-blur-xl shadow-2xl relative">
          
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.1),transparent_50%)] pointer-events-none rounded-3xl"></div>

          <div className="flex items-center justify-between text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300 relative z-10">
            <span>Trust Reflection {progressLabel}</span>
            <span className="bg-emerald-900/50 px-3 py-1 rounded shadow-sm border border-emerald-500/30">
              Score: {score}/{totalStages}
            </span>
          </div>
          
          <p className="text-emerald-400 font-bold tracking-wider uppercase text-xs mt-6 mb-2 relative z-10">Prompt:</p>
          <p className="text-white text-xl md:text-2xl font-serif leading-relaxed italic relative z-10">
            "{stage}"
          </p>
          
          <div className="mt-8 relative z-10">
            <textarea
              value={entry}
              onChange={(e) => setEntry(e.target.value)}
              className="w-full rounded-2xl bg-black/40 text-emerald-50 p-5 border border-emerald-500/30 outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-all font-medium resize-none shadow-inner text-lg placeholder-emerald-700/50 min-h-[160px]"
              placeholder="Write your reflection on trust and billing here..."
              rows={5}
            />
            <div className={`absolute bottom-4 right-4 text-xs font-bold px-3 py-1.5 rounded-md backdrop-blur-md transition-colors ${entry.trim().length >= MIN_LEN ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'}`}>
              {entry.trim().length} / {MIN_LEN}
            </div>
          </div>
          
          <div className="flex justify-end mt-8 relative z-10">
            <button
              onClick={handleSubmit}
              disabled={entry.trim().length < MIN_LEN}
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold tracking-wide shadow-[0_5px_20px_rgba(16,185,129,0.4)] hover:opacity-95 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
            >
              Sign Journal
            </button>
          </div>
        </div>
      )}
    </GameShell>
  );
};

export default JournalTheTrustFactor;
