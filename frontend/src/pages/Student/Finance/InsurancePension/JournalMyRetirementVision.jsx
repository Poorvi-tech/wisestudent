import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const PROMPTS = [
  "At age 60, I want my life to look like ___",
  "What daily routine do you want in retirement?",
  "How will you support health and independence?",
  "Where will you live and what support will you need?",
  "What monthly pension/income would make you feel secure?",
];

const JournalMyRetirementVision = () => {
  const location = useLocation();
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();
  const totalStages = PROMPTS.length;
  const gameId = "finance-insurance-pension-33";
  const gameData = getGameDataById(gameId);
  const totalCoins = gameData?.coins ?? location.state?.totalCoins ?? 10;
  const coinsPerLevel = Math.max(2, Math.floor(totalCoins / totalStages));
  const totalXp = gameData?.xp ?? location.state?.totalXp ?? 20;

  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [inputs, setInputs] = useState(Array.from({ length: totalStages }, () => ""));
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  const stagePrompt = PROMPTS[currentStageIndex];
  const progressLabel = `${currentStageIndex + 1}/${totalStages}`;
  const value = inputs[currentStageIndex] || "";
  const isValid = value.trim().length >= 10;

  const handleChange = (e) => {
    const v = e.target.value;
    setInputs((prev) => {
      const next = [...prev];
      next[currentStageIndex] = v;
      return next;
    });
  };

  const handleSaveNext = () => {
    if (!isValid) return;
    showCorrectAnswerFeedback(1, true);
    setScore((s) => s + 1);
    if (currentStageIndex === totalStages - 1) {
      setShowResult(true);
    } else {
      setCurrentStageIndex((i) => i + 1);
    }
  };

  const handleBack = () => {
    if (currentStageIndex > 0) setCurrentStageIndex((i) => i - 1);
  };

  return (
    <GameShell
      title="Journal: My Retirement Vision"
      subtitle={
        showResult
          ? "Journal complete! You’ve drafted your retirement vision."
          : `Stage ${progressLabel}: Minimum 10 characters`
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
      <div className="space-y-8">
        {!showResult && (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-2xl shadow-black/30">
              <div className="flex items-center justify-between text-sm font-semibold uppercase tracking-[0.2em] text-white/70">
                <span>Stage {progressLabel}</span>
                <span>
                  Saved: {score}/{totalStages}
                </span>
              </div>
              <p className="text-white text-lg md:text-xl font-bold leading-snug mt-4">
                {stagePrompt}
              </p>
              <textarea
                value={value}
                onChange={handleChange}
                rows={5}
                placeholder="Write at least 10 characters..."
                className="mt-5 w-full rounded-2xl bg-white/10 border border-white/20 p-4 text-white/90 placeholder-white/50 focus:outline-none"
              />
              <div className="mt-2 text-xs text-white/60">
                {value.trim().length < 10
                  ? `${Math.max(0, 10 - value.trim().length)} more characters needed`
                  : "Looks good"}
              </div>
              <div className="flex gap-3 justify-end mt-5">
                <button
                  onClick={handleBack}
                  disabled={currentStageIndex === 0}
                  className="px-5 py-2 rounded-full bg-white/10 border border-white/20 text-white font-semibold shadow hover:opacity-90 disabled:opacity-40"
                >
                  Back
                </button>
                <button
                  onClick={handleSaveNext}
                  disabled={!isValid}
                  className="px-5 py-2 rounded-full bg-gradient-to-r from-amber-400 to-pink-500 text-white font-semibold shadow-lg hover:opacity-90 disabled:opacity-60"
                >
                  Save & Next
                </button>
              </div>
            </div>
          </div>
        )}
        {showResult && (
          <div className="space-y-4">
            <div className="rounded-2xl bg-white/10 border border-white/20 p-4 text-sm text-white/80">
              Your reflections outline lifestyle, health, support, and income needs at retirement.
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default JournalMyRetirementVision;
