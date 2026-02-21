import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const PROMPTS = [
  "Write one action to secure your family's health risk.",
  "Write one action to protect dependents from income loss.",
  "Write one action to build an emergency fund.",
  "Write one action to keep documents and policy details ready.",
  "Write one action to avoid fraud and unsafe links/OTPs.",
];

const MIN_LEN = 10;

const JournalProtectionChecklist = () => {
  const location = useLocation();
  const totalStages = PROMPTS.length;
  const [current, setCurrent] = useState(0);
  const [input, setInput] = useState("");
  const [entries, setEntries] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const { flashPoints, showCorrectAnswerFeedback } = useGameFeedback();
  const gameId = "finance-insurance-pension-43";
  const gameData = getGameDataById(gameId);
  const totalCoins = gameData?.coins ?? location.state?.totalCoins ?? 10;
  const coinsPerLevel = Math.max(2, Math.floor(totalCoins / totalStages));
  const totalXp = gameData?.xp ?? location.state?.totalXp ?? 20;



  const handleSubmit = () => {
    if (input.trim().length < MIN_LEN) return;
    const updated = [...entries, input.trim()];
    setEntries(updated);
    setScore((s) => s + 1);
    showCorrectAnswerFeedback(1, true);
    setInput("");
    if (current === totalStages - 1) {
      setShowResult(true);
    } else {
      setCurrent((c) => c + 1);
    }
  };

  return (
    <GameShell
      title="Journal: Protection Checklist"
      subtitle={
        showResult
          ? "Checklist complete! Protection steps noted for your future."
          : `Entry ${current + 1} of ${totalStages} (min ${MIN_LEN} chars)`
      }
      currentLevel={current + 1}
      totalLevels={totalStages}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult}
      score={score}
      showConfetti={showResult && score === totalStages}
      flashPoints={flashPoints}
      gameId={gameId}
      gameType="finance"
      nextGamePath={location.state?.nextGamePath}
      nextGameId={location.state?.nextGameId}
      backPath={location.state?.returnPath}
    >
      <div className="space-y-6">
        {!showResult && (
          <div className="space-y-4">
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20">
              <div className="text-sm font-semibold uppercase tracking-[0.2em] text-white/70">
                {`Prompt ${current + 1}/${totalStages}`}
              </div>
              <p className="text-white text-lg md:text-xl font-bold leading-snug mt-2">
                {PROMPTS[current]}
              </p>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                rows={4}
                placeholder="Type your step here..."
                className="w-full mt-4 p-4 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none"
              />
              <div className="flex items-center justify-between mt-3 text-white/70 text-sm">
                <span>{input.trim().length}/{MIN_LEN} characters</span>
                <button
                  onClick={handleSubmit}
                  disabled={input.trim().length < MIN_LEN}
                  className="px-5 py-2 rounded-full bg-gradient-to-r from-emerald-500 to-lime-500 text-white font-semibold shadow-lg disabled:opacity-60"
                >
                  Save Step
                </button>
              </div>
            </div>
            {entries.length > 0 && (
              <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20">
                <div className="text-sm font-semibold uppercase tracking-[0.2em] text-white/70 mb-2">
                  Saved Steps
                </div>
                <ul className="list-disc list-inside text-white/90 space-y-2">
                  {entries.map((e, idx) => (
                    <li key={idx}>{e}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default JournalProtectionChecklist;
