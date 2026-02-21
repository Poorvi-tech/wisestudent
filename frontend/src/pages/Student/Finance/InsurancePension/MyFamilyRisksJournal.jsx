import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import { getGameDataById } from "../../../../utils/getGameData";

const JOURNAL_STAGES = [
  {
    id: 1,
    prompt: "One risk my family may face is unexpected medical expenses because...",
  },
  {
    id: 2,
    prompt: "One risk my family may face is temporary job loss because...",
  },
  {
    id: 3,
    prompt: "One risk my family may face is an accident or injury because...",
  },
  {
    id: 4,
    prompt: "One risk my family may face is crop or weather shock because...",
  },
  {
    id: 5,
    prompt: "One risk my family may face is a natural disaster because...",
  },
];

const MyFamilyRisksJournal = () => {
  const location = useLocation();
  const gameId = "finance-insurance-pension-6";
  const gameData = getGameDataById(gameId);
  const totalStages = JOURNAL_STAGES.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [entries, setEntries] = useState({});
  const [showResult, setShowResult] = useState(false);

  const totalCoins = gameData?.coins ?? location.state?.totalCoins ?? 5;
  const coinsPerLevel = Math.max(1, Math.floor(totalCoins / totalStages));
  const totalXp = gameData?.xp ?? location.state?.totalXp ?? 10;
  const stage = JOURNAL_STAGES[currentStageIndex];

  const currentText = entries[stage.id] ?? "";
  const isValid = currentText.trim().length >= 10;
  const score = Object.values(entries).filter((t) => (t || "").trim().length >= 10).length;

  const handleChange = (e) => {
    const v = e.target.value;
    setEntries((prev) => ({ ...prev, [stage.id]: v }));
  };

  const handleNext = () => {
    if (!isValid) return;
    if (currentStageIndex === totalStages - 1) {
      setShowResult(true);
    } else {
      setCurrentStageIndex((prev) => prev + 1);
    }
  };

  return (
    <GameShell
      title="Journal: My Family Risks"
      subtitle={
        showResult
          ? "Journal complete! You identified key family risks."
          : `Entry ${currentStageIndex + 1} of ${totalStages}`
      }
      currentLevel={currentStageIndex + 1}
      totalLevels={totalStages}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult}
      score={score}
      showConfetti={showResult && score === totalStages}
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
                <span>Entry {currentStageIndex + 1}/{totalStages}</span>
                <span>Score: {score}/{totalStages}</span>
              </div>
              <p className="text-white text-lg md:text-xl font-bold leading-snug mt-4">
                {stage.prompt}
              </p>
              <textarea
                value={currentText}
                onChange={handleChange}
                placeholder="Write at least 10 characters..."
                className="mt-4 w-full rounded-2xl p-4 border-2 border-white/20 bg-white/10 text-white placeholder-white/50 min-h-[140px] focus:outline-none focus:border-emerald-400/80"
              />
              {!isValid && (
                <div className="mt-2 text-xs text-white/70">
                  {currentText.trim().length}/10 characters
                </div>
              )}
              <div className="flex justify-end mt-4">
                <button
                  onClick={handleNext}
                  disabled={!isValid}
                  className="px-5 py-2 rounded-full bg-gradient-to-r from-emerald-500 to-lime-500 text-white font-semibold shadow-lg hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {currentStageIndex === totalStages - 1 ? "Finish" : "Next"}
                </button>
              </div>
            </div>
          </div>
        )}

        {showResult && (
          <div className="rounded-2xl bg-white/10 border border-white/20 p-4 text-sm text-white/80 space-y-2">
            <div className="font-semibold">Your entries:</div>
            {JOURNAL_STAGES.map((s) => (
              <div key={s.id} className="text-white/90">
                <div className="font-semibold">{s.prompt}</div>
                <div className="mt-1 opacity-90">{entries[s.id]}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default MyFamilyRisksJournal;

