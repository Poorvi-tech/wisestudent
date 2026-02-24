import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const HEALTH_MONITOR_STAGES = [
  {
    id: 1,
    prompt: "A customer pays in cash and you put it straight into your personal wallet.",
    options: [
      { id: "opt1", text: "Deposit in Shop Register", outcome: "Incorrect! That's the right thing to do, but this habit described is wrong.", isCorrect: false },
      { id: "opt2", text: "Bad Habit – Mixing Funds", outcome: "Correct! Never mix personal and business cash.", isCorrect: true },
      { id: "opt3", text: "Good – Saves Bank Fees", outcome: "Incorrect! Mixing funds hurts business tracking.", isCorrect: false },
      { id: "opt4", text: "Normal for Small Shops", outcome: "Incorrect! Even small shops must separate funds.", isCorrect: false },
    ],
  },
  {
    id: 2,
    prompt: "You record every single expense in a notebook at the end of the day.",
    options: [
      { id: "opt1", text: "Waste of Time", outcome: "Incorrect! Tracking expenses is vital for success.", isCorrect: false },
      { id: "opt2", text: "Only for Big Businesses", outcome: "Incorrect! Every business benefits from daily tracking.", isCorrect: false },
      { id: "opt3", text: "Smart Habit – Prevents Leaks", outcome: "Correct! Daily tracking stops cash leaks early.", isCorrect: true },
      { id: "opt4", text: "Unnecessary if Profitable", outcome: "Incorrect! Even profitable businesses need expense records.", isCorrect: false },
    ],
  },
  {
    id: 3,
    prompt: "Selling goods on credit to a friend without noting it down anywhere.",
    options: [
      { id: "opt1", text: "Fine – Friends Always Pay", outcome: "Incorrect! Trust is good, records are better.", isCorrect: false },
      { id: "opt2", text: "Good Customer Service", outcome: "Incorrect! Good service still requires documentation.", isCorrect: false },
      { id: "opt3", text: "Risky – Unrecorded Debt", outcome: "Correct! If it's not written down, it's easily forgotten.", isCorrect: true },
      { id: "opt4", text: "Normal Business Practice", outcome: "Incorrect! No professional business skips recording credit.", isCorrect: false },
    ],
  },
  {
    id: 4,
    prompt: "Keeping a separate bank account just for business transactions.",
    options: [
      { id: "opt1", text: "Unnecessary Extra Work", outcome: "Incorrect! A separate account simplifies everything.", isCorrect: false },
      { id: "opt2", text: "Excellent Practice", outcome: "Correct! The best way to measure true profit and track business health.", isCorrect: true },
      { id: "opt3", text: "Only for Large Firms", outcome: "Incorrect! Even solo entrepreneurs benefit from this.", isCorrect: false },
      { id: "opt4", text: "Too Many Bank Charges", outcome: "Incorrect! The clarity it provides far outweighs any fees.", isCorrect: false },
    ],
  },
  {
    id: 5,
    prompt: "Paying suppliers entirely in cash to avoid showing turnover.",
    options: [
      { id: "opt1", text: "Smart Tax Saving", outcome: "Incorrect! This is tax evasion, not saving.", isCorrect: false },
      { id: "opt2", text: "Common and Acceptable", outcome: "Incorrect! Being common doesn't make it right.", isCorrect: false },
      { id: "opt3", text: "Saves Paperwork", outcome: "Incorrect! You lose the audit trail and loan eligibility.", isCorrect: false },
      { id: "opt4", text: "Harmful – Ruins Loan Chances", outcome: "Correct! Hiding turnover destroys your creditworthiness and growth potential.", isCorrect: true },
    ],
  },
];

const ReflexHealthMonitor = () => {
  const location = useLocation();
  const gameId = "finance-business-livelihood-finance-52";
  const gameData = getGameDataById(gameId);
  const totalStages = HEALTH_MONITOR_STAGES.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const totalCoins = gameData?.coins ?? location.state?.totalCoins ?? 5;
  const coinsPerLevel = Math.max(1, Math.floor(totalCoins / totalStages));
  const totalXp = gameData?.xp ?? location.state?.totalXp ?? 10;
  const stage = HEALTH_MONITOR_STAGES[currentStageIndex];

  useEffect(() => {
    if (showResult || selectedChoice || !stage) return;

    if (timeLeft === 0) {
      setSelectedChoice({ id: "timeout", text: "Time's up!", outcome: "You didn't diagnose the habit.", isCorrect: false });
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
      title="Reflex: Health Monitor"
      subtitle={
        showResult
          ? "Monitoring complete! Keep those green habits growing."
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
            <div className="bg-slate-900/40 backdrop-blur-xl rounded-3xl p-6 border border-slate-700 shadow-2xl relative overflow-hidden">
              {/* Timer Bar */}
              <div 
                className={`absolute bottom-0 left-0 h-1.5 transition-all duration-1000 ease-linear ${timeLeft <= 3 ? "bg-rose-500" : "bg-emerald-400"}`}
                style={{ width: `${(timeLeft / 10) * 100}%` }}
              />
              <div className="flex items-center justify-between text-sm font-semibold uppercase tracking-[0.2em] text-slate-300">
                <span>Stage {progressLabel}</span>
                <span className={`text-xl font-bold ${timeLeft <= 3 ? 'text-rose-400 animate-pulse' : 'text-emerald-400'}`}>00:{timeLeft.toString().padStart(2, '0')}</span>
                <span>Score: {score}/{totalStages}</span>
              </div>

              {/* Heartbeat / Monitor display area */}
              <div className="bg-black/40 p-6 rounded-2xl border-2 border-slate-700/50 mt-6 shadow-inner relative overflow-hidden">
                 <div className="absolute top-0 left-0 w-full h-[1px] bg-green-500/20 shadow-[0_0_10px_rgba(34,197,94,0.5)] animate-[scan_2s_linear_infinite]"></div>
                 <p className="text-white text-lg md:text-xl font-bold leading-snug text-center z-10 relative">
                   {stage.prompt}
                 </p>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-8">
                {stage.options.map((option, idx) => {
                  const isSelected = selectedChoice?.id === option.id;
                  const isPositiveOption = option.isCorrect;
                  
                  // Monitor Button Styles
                  let baseStyle = "from-slate-600 to-slate-700 border-slate-500 hover:from-slate-500 hover:to-slate-600";
                  
                  if (isSelected) {
                    baseStyle = option.isCorrect
                      ? "from-emerald-500 to-green-500 border-green-400 shadow-[0_0_25px_rgba(34,197,94,0.6)] scale-105"
                      : "from-rose-500 to-red-600 border-red-400 shadow-[0_0_25px_rgba(244,63,94,0.6)] scale-105";
                  } else if (selectedChoice && option.isCorrect && !isSelected) {
                    baseStyle = "from-emerald-700/50 to-green-800/50 border-green-600/50 ring-2 ring-green-400/50 opacity-80";
                  } else if (selectedChoice) {
                    baseStyle = "from-slate-800 to-slate-900 border-slate-700 opacity-30 scale-95";
                  }

                  return (
                    <button
                      key={option.id}
                      onClick={() => handleChoice(option)}
                      disabled={Boolean(selectedChoice)}
                      className={`relative flex items-center justify-center rounded-2xl bg-gradient-to-t ${baseStyle} border-b-[6px] active:border-b-0 active:translate-y-[6px] p-4 text-center text-white font-extrabold transition-all disabled:cursor-not-allowed text-sm md:text-base leading-tight min-h-[100px] uppercase tracking-wide`}
                    >
                      <span className="drop-shadow-md z-10 w-full">{option.text}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {selectedChoice && (
          <div className="animate-fade-in-up">
            <div className={`rounded-xl border-2 p-5 text-center font-bold text-lg shadow-lg ${selectedChoice.isCorrect ? 'bg-emerald-900/50 border-emerald-500 text-emerald-200' : 'bg-rose-900/50 border-rose-500 text-rose-200'}`}>
              <span className="block text-xs uppercase opacity-70 mb-1">{selectedChoice.isCorrect ? 'Accurate Diagnosis' : 'Misdiagnosis'}</span>
              {selectedChoice.outcome}
            </div>
            {currentStageIndex < totalStages - 1 && (
              <div className="flex justify-center mt-6">
                <button
                  onClick={handleNextStage}
                  className="px-8 py-3 rounded-full bg-slate-700 text-white font-black tracking-widest uppercase shadow-[0_5px_15px_rgba(0,0,0,0.3)] hover:scale-105 transform transition-all border border-slate-500 hover:bg-slate-600"
                >
                  NEXT HABIT
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default ReflexHealthMonitor;
