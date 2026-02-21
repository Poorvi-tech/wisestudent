import React, { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const TIMER_SECONDS = 10;

const STAGES = [
  {
    id: 1,
    prompt: "Quick reflex: Best tap for a secure future?",
    options: [
      { id: "spend", text: "Spend Fully", isCorrect: false, outcome: "Spending fully leaves no base for growth." },
      { id: "borrow", text: "Borrow for lifestyle", isCorrect: false, outcome: "Debt reduces future security." },
      { id: "delay", text: "Delay saving", isCorrect: false, outcome: "Delays weaken compounding potential." },
      { id: "save", text: "Save Consistently", isCorrect: true, outcome: "Correct. Consistency powers compounding." },
    ],
  },
  {
    id: 2,
    prompt: "Reflex: Which action strengthens pension growth?",
    options: [
      { id: "skip", text: "Skip contributions", isCorrect: false, outcome: "Gaps break compounding momentum." },
      { id: "cash-only", text: "Keep cash idle", isCorrect: false, outcome: "Idle cash doesn’t compound." },
      { id: "auto-save", text: "Automate savings", isCorrect: true, outcome: "Correct. Automation keeps habit steady." },
      { id: "churn", text: "Switch funds constantly", isCorrect: false, outcome: "Churn without plan can harm returns." },
    ],
  },
  {
    id: 3,
    prompt: "Reflex: In a bonus month, safer choice?",
    options: [
      { id: "splurge", text: "Splurge fully", isCorrect: false, outcome: "Short-term fun reduces long-term security." },
      { id: "save-bonus", text: "Add to pension", isCorrect: true, outcome: "Correct. Extra boosts long-term corpus." },
      { id: "loan-emi", text: "Increase EMI without plan", isCorrect: false, outcome: "Unplanned liabilities reduce flexibility." },
      { id: "cash-home", text: "Keep cash at home", isCorrect: false, outcome: "Non-earning cash loses to inflation." },
    ],
  },
  {
    id: 4,
    prompt: "Reflex: When expenses rise a bit, better habit?",
    options: [
      { id: "trim", text: "Trim spends, keep saving", isCorrect: true, outcome: "Correct. Maintain contribution discipline." },
      { id: "cut-save", text: "Cut pension first", isCorrect: false, outcome: "Cutting savings weakens future security." },
      { id: "credit", text: "Swipe credit more", isCorrect: false, outcome: "Higher interest erodes future value." },
      { id: "ignore", text: "Ignore budget", isCorrect: false, outcome: "Ignoring budgets increases risk." },
    ],
  },
  {
    id: 5,
    prompt: "Reflex: To secure retirement, your first tap should be?",
    options: [
      { id: "spend-now", text: "Spend Fully", isCorrect: false, outcome: "Spending all delays the goal." },
      { id: "random", text: "Invest randomly", isCorrect: false, outcome: "Random investing increases risk." },
      { id: "skip-year", text: "Skip this year", isCorrect: false, outcome: "Skipping loses compounding time." },
      { id: "consistent", text: "Save Consistently", isCorrect: true, outcome: "Correct. Habit > intention." },
    ],
  },
];

const ReflexSecureFuture = () => {
  const location = useLocation();
  const totalStages = STAGES.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS);
  const { flashPoints, showCorrectAnswerFeedback } = useGameFeedback();

  const stage = STAGES[currentStageIndex];
  const gameId = "finance-insurance-pension-39";
  const gameData = getGameDataById(gameId);
  const totalCoins = gameData?.coins ?? location.state?.totalCoins ?? 10;
  const coinsPerLevel = Math.max(2, Math.floor(totalCoins / totalStages));
  const totalXp = gameData?.xp ?? location.state?.totalXp ?? 20;

  useEffect(() => {
    setTimeLeft(TIMER_SECONDS);
    setSelectedChoice(null);
  }, [currentStageIndex]);

  useEffect(() => {
    if (showResult) return;
    if (selectedChoice) return;
    if (timeLeft <= 0) {
      if (currentStageIndex === totalStages - 1) {
        setShowResult(true);
      } else {
        setCurrentStageIndex((i) => i + 1);
      }
      return;
    }
    const t = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, selectedChoice, currentStageIndex, totalStages, showResult]);

  const handleChoice = (option) => {
    if (selectedChoice || timeLeft <= 0) return;
    setSelectedChoice(option);
    if (option.isCorrect) {
      setScore((s) => s + 1);
      showCorrectAnswerFeedback(1, true);
    }
  };

  const handleNext = () => {
    if (currentStageIndex === totalStages - 1) {
      setShowResult(true);
    } else {
      setCurrentStageIndex((i) => i + 1);
    }
  };

  const progressLabel = `${currentStageIndex + 1}/${totalStages}`;

  return (
    <GameShell
      title="Reflex: Secure Future"
      subtitle={
        showResult
          ? "Reflex complete! Habit-first choices support a secure future."
          : `Stage ${currentStageIndex + 1} of ${totalStages} • ${timeLeft}s`
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
                <span>Stage {progressLabel}</span>
                <span>Time: {timeLeft}s</span>
              </div>
              <p className="text-white text-lg md:text-xl font-bold leading-snug mt-4">
                {stage.prompt}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                {stage.options.map((option) => {
                  const isSelected = selectedChoice?.id === option.id;
                  const baseStyle = isSelected
                    ? option.isCorrect
                      ? "from-emerald-500 to-lime-500 border-emerald-400/80"
                      : "from-rose-500 to-orange-500 border-rose-400/80"
                    : "from-blue-500 to-cyan-500 border-transparent";
                  return (
                    <button
                      key={option.id}
                      onClick={() => handleChoice(option)}
                      disabled={Boolean(selectedChoice) || timeLeft <= 0}
                      className={`relative rounded-2xl bg-gradient-to-r ${baseStyle} border-2 p-5 text-left text-white font-semibold transition-all transform hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60 shadow-lg`}
                    >
                      {option.text}
                    </button>
                  );
                })}
              </div>
              {selectedChoice && (
                <div className="rounded-2xl bg-white/10 border border-white/20 p-4 text-sm text-white/80 mt-4">
                  {selectedChoice.outcome}
                </div>
              )}
              {(selectedChoice || timeLeft <= 0) && (
                <div className="flex justify-end mt-4">
                  <button
                    onClick={handleNext}
                    className="px-5 py-2 rounded-full bg-gradient-to-r from-amber-400 to-pink-500 text-white font-semibold shadow-lg hover:opacity-90"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default ReflexSecureFuture;
