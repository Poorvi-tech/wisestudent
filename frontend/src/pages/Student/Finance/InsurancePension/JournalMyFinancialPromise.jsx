import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const PROMPTS = [
  "I will protect my future by building an emergency fund.",
  "I will protect my future by keeping adequate health and term cover.",
  "I will protect my future by saving consistently every month.",
  "I will protect my future by avoiding scams and verifying offers.",
  "I will protect my future by reading policy terms before buying.",
];

const MIN_LEN = 10;

const JournalMyFinancialPromise = () => {
  const location = useLocation();
  const totalStages = PROMPTS.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [entry, setEntry] = useState("");
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const { showCorrectAnswerFeedback } = useGameFeedback();
  const gameId = "finance-insurance-pension-47";
  const gameData = getGameDataById(gameId);
  const totalCoins = gameData?.coins ?? location.state?.totalCoins ?? 10;
  const coinsPerLevel = Math.max(2, Math.floor(totalCoins / totalStages));
  const totalXp = gameData?.xp ?? location.state?.totalXp ?? 20;

  const handleSubmit = () => {
    if (entry.trim().length < MIN_LEN) return;
    setScore((s) => s + 1);
    showCorrectAnswerFeedback(1, true);
    if (currentStageIndex === totalStages - 1) {
      setShowResult(true);
    } else {
      setCurrentStageIndex((i) => i + 1);
      setEntry("");
    }
  };

  const stage = PROMPTS[currentStageIndex];
  const progressLabel = `${currentStageIndex + 1}/${totalStages}`;

  return (
    <GameShell
      title="Journal: My Financial Promise"
      subtitle={
        showResult
          ? "Journal complete! Clear commitments strengthen future security."
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
      gameId={gameId}
      gameType="finance"
      nextGamePath={location.state?.nextGamePath}
      nextGameId={location.state?.nextGameId}
      backPath={location.state?.returnPath}
    >
      {!showResult && (
        <div className="space-y-6">
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20">
            <div className="flex items-center justify-between text-sm font-semibold uppercase tracking-[0.2em] text-white/70">
              <span>Stage {progressLabel}</span>
              <span>
                Score: {score}/{totalStages}
              </span>
            </div>
            <p className="text-white text-lg md:text-xl font-bold leading-snug mt-4">
              {stage}
            </p>
            <textarea
              value={entry}
              onChange={(e) => setEntry(e.target.value)}
              className="mt-4 w-full rounded-2xl bg-white/10 text-white p-4 border border-white/20 outline-none"
              placeholder="Write your promise here (min 10 characters)"
              rows={4}
            />
            <div className="mt-3 text-xs text-white/70">
              {entry.trim().length < MIN_LEN ? `Min ${MIN_LEN} characters` : "Looks good"}
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={handleSubmit}
                disabled={entry.trim().length < MIN_LEN}
                className="px-5 py-2 rounded-full bg-gradient-to-r from-amber-400 to-pink-500 text-white font-semibold shadow-lg hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </GameShell>
  );
};

export default JournalMyFinancialPromise;
