import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const STOCK_GUARD_STAGES = [
  {
    id: 1,
    prompt: "A box of biscuits is near the edge of the shelf!",
    options: [
      { id: "opt1", text: "Ignore it", outcome: "Incorrect! It fell and broke.", isCorrect: false },
      { id: "opt2", text: "Push safely back", outcome: "Correct! You caught it before it dropped.", isCorrect: true },
      { id: "opt3", text: "Accuse customer", outcome: "Incorrect! No one is stealing it.", isCorrect: false },
      { id: "opt4", text: "Discount it immediately", outcome: "Incorrect! It's about to fall, not expired.", isCorrect: false },
    ],
  },
  {
    id: 2,
    prompt: "Someone is slipping a flashlight into their pocket.",
    options: [
      { id: "opt1", text: "Rearrange items", outcome: "Incorrect! They aren't breaking anything.", isCorrect: false },
      { id: "opt2", text: "Smile and wave", outcome: "Incorrect! You just got robbed.", isCorrect: false },
      { id: "opt3", text: "Alert security", outcome: "Correct! You stopped the shoplifter.", isCorrect: true },
      { id: "opt4", text: "Ignore for now", outcome: "Incorrect! Stop the thief first.", isCorrect: false },
    ],
  },
  {
    id: 3,
    prompt: "A heavy carton is crushing fragile items below it.",
    options: [
      { id: "opt1", text: "Move heavy carton", outcome: "Correct! You rearranged them and saved stock.", isCorrect: true },
      { id: "opt2", text: "Call the police", outcome: "Incorrect! The box isn't stealing.", isCorrect: false },
      { id: "opt3", text: "Leave it alone", outcome: "Incorrect! The stock is ruined.", isCorrect: false },
      { id: "opt4", text: "Discount fragile items", outcome: "Incorrect! Fix the problem, don't lose margin.", isCorrect: false },
    ],
  },
  {
    id: 4,
    prompt: "An employee is leaving with unbilled inventory.",
    options: [
      { id: "opt1", text: "Assume it's damaged", outcome: "Incorrect! This is internal shrinkage.", isCorrect: false },
      { id: "opt2", text: "Trust them blindly", outcome: "Incorrect! Trust requires verification.", isCorrect: false },
      { id: "opt3", text: "Wave goodbye", outcome: "Incorrect! You are losing money.", isCorrect: false },
      { id: "opt4", text: "Demand the bill", outcome: "Correct! You caught the internal theft.", isCorrect: true },
    ],
  },
  {
    id: 5,
    prompt: "A water leak is dripping right onto the electronics section.",
    options: [
      { id: "opt1", text: "Relocate electronics", outcome: "Awesome! You moved the items and prevented loss.", isCorrect: true },
      { id: "opt2", text: "Call for backup", outcome: "Incorrect! Water can't wait.", isCorrect: false },
      { id: "opt3", text: "Watch the drip", outcome: "Incorrect! The electronics are shorting out.", isCorrect: false },
      { id: "opt4", text: "Call plumber later", outcome: "Incorrect! Move the stock NOW.", isCorrect: false },
    ],
  },
];

const ReflexStockGuard = () => {
  const location = useLocation();
  const gameId = "finance-business-livelihood-finance-86";
  const gameData = getGameDataById(gameId);
  const totalStages = STOCK_GUARD_STAGES.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const totalCoins = gameData?.coins ?? location.state?.totalCoins ?? 5;
  const coinsPerLevel = Math.max(1, Math.floor(totalCoins / totalStages));
  const totalXp = gameData?.xp ?? location.state?.totalXp ?? 10;
  const stage = STOCK_GUARD_STAGES[currentStageIndex];

  useEffect(() => {
    if (showResult || selectedChoice || !stage) return;

    if (timeLeft === 0) {
      setSelectedChoice({ id: "timeout", text: "Time's up!", outcome: "You failed to guard the stock!", isCorrect: false });
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, showResult, selectedChoice, stage]);

  const handleChoice = (option) => {
    if (selectedChoice || !stage) return;
    setSelectedChoice(option);

    if (option.isCorrect) {
      setScore((prev) => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }

    if (currentStageIndex === totalStages - 1) {
      setTimeout(() => {
        setShowResult(true);
      }, 800);
    }
  };

  const handleNextStage = () => {
    if (!selectedChoice) return;
    if (currentStageIndex === totalStages - 1) {
      setShowResult(true);
    } else {
      setCurrentStageIndex((prev) => prev + 1);
      setTimeLeft(10);
    }
    setSelectedChoice(null);
  };



  const progressLabel = `${currentStageIndex + 1}/${totalStages}`;

  return (
    <GameShell
      title="Reflex: Stock Guard"
      subtitle={
        showResult
          ? "Shift over! Your inventory is safe and accounted for."
          : `Stage ${currentStageIndex + 1} of ${totalStages}`
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
        {!showResult && stage && (
          <div className="space-y-6">
            <div className="bg-slate-900/60 backdrop-blur-xl rounded-3xl p-6 border border-slate-700 shadow-2xl relative overflow-hidden">
              {/* Timer Bar */}
              <div 
                className={`absolute bottom-0 left-0 h-1.5 transition-all duration-1000 ease-linear ${timeLeft <= 3 ? "bg-red-500" : "bg-orange-400"}`}
                style={{ width: `${(timeLeft / 10) * 100}%` }}
              />
              <div className="flex items-center justify-between text-sm font-semibold uppercase tracking-[0.2em] text-slate-300">
                <span>Stage {progressLabel}</span>
                <span className={`text-xl font-bold ${timeLeft <= 3 ? 'text-red-400 animate-pulse' : 'text-orange-400'}`}>00:{timeLeft.toString().padStart(2, '0')}</span>
                <span>Score: {score}/{totalStages}</span>
              </div>

              {/* CCTV Camera / Guard View Aesthetic */}
              <div className="bg-black/60 border-2 border-orange-900/50 shadow-[0_0_15px_rgba(234,88,12,0.1)] p-6 rounded-xl mt-6 relative overflow-hidden">
                 <div className="absolute top-2 left-3 text-red-500 text-xs font-mono font-bold animate-pulse flex items-center gap-2">
                    <span className="w-2 h-2 bg-red-500 rounded-full"></span> REC
                 </div>
                 <div className="absolute top-0 right-0 w-full h-full bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:100%_4px] opacity-20 pointer-events-none"></div>
                 <p className="text-white text-lg md:text-xl font-mono leading-snug text-center mt-4 relative z-10">
                   {stage.prompt}
                 </p>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-8">
                {stage.options.map((option, idx) => {
                  const isSelected = selectedChoice?.id === option.id;
                  
                  // Guard Action styling
                  let baseStyle = "bg-slate-800 border-slate-600 text-slate-300 hover:bg-slate-700 hover:border-slate-500 border-2";
                  
                  if (isSelected) {
                    baseStyle = option.isCorrect
                      ? "bg-emerald-900/80 border-emerald-500 text-emerald-200 shadow-[0_0_20px_rgba(16,185,129,0.5)] scale-105"
                      : "bg-rose-900/80 border-rose-500 text-rose-200 shadow-[0_0_20px_rgba(244,63,94,0.5)] scale-105";
                  } else if (selectedChoice && option.isCorrect && !isSelected) {
                    baseStyle = "bg-emerald-900/40 border-emerald-500/50 text-emerald-300/80 ring-2 ring-emerald-500/30";
                  } else if (selectedChoice) {
                    baseStyle = "bg-slate-900/50 border-slate-700/50 text-slate-600 opacity-50 scale-95";
                  }

                  return (
                    <button
                      key={option.id}
                      onClick={() => handleChoice(option)}
                      disabled={Boolean(selectedChoice)}
                      className={`relative flex flex-col items-center justify-center rounded-xl ${baseStyle} p-4 text-center font-bold transition-all disabled:cursor-not-allowed text-sm md:text-base leading-tight min-h-[100px]`}
                    >

                      <span className="z-10">{option.text}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {selectedChoice && (
          <div className="animate-fade-in-up">
            <div className={`rounded-xl border-2 p-5 text-center font-bold text-lg shadow-lg ${selectedChoice.isCorrect ? 'bg-emerald-900/60 border-emerald-500 text-emerald-200' : 'bg-rose-900/60 border-rose-500 text-rose-200'}`}>
              <span className="block text-xs uppercase opacity-70 mb-1 font-mono tracking-widest">{selectedChoice.isCorrect ? 'INCIDENT RESOLVED' : 'INCIDENT LOGGED'}</span>
              {selectedChoice.outcome}
            </div>
            {currentStageIndex < totalStages - 1 && (
              <div className="flex justify-center mt-6">
                <button
                  onClick={handleNextStage}
                  className="px-8 py-3 rounded-full bg-orange-600 text-white font-black tracking-widest uppercase shadow-[0_5px_15px_rgba(234,88,12,0.4)] hover:scale-105 transform transition-all border border-orange-400 hover:bg-orange-500 font-mono"
                >
                  NEXT CAMERA
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default ReflexStockGuard;
