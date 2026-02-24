import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const STAGES = [
  {
    id: 1,
    prompt: "You started the day with ₹500. You earned ₹2000 from sales and spent ₹1200 on new stock. What is your closing balance?",
    options: [
      { id: "opt1", text: "₹800", outcome: "You forgot the starting balance!", isCorrect: false },
      { id: "opt2", text: "₹1700", outcome: "Wait, ₹500 + ₹2000 - ₹1200 is not ₹1700.", isCorrect: false },
      { id: "opt3", text: "₹1300", outcome: "Correct! ₹500 (Start) + ₹2000 (In) - ₹1200 (Out) = ₹1300.", isCorrect: true },
      { id: "opt4", text: "₹2500", outcome: "You added the expenses instead of subtracting.", isCorrect: false },
    ],
  },
  {
    id: 2,
    prompt: "Closing balance yesterday was ₹1300. Today, you sold goods worth ₹1500, paid ₹300 for electricity, and gave ₹500 to a supplier. New balance?",
    options: [
      { id: "opt1", text: "₹2000", outcome: "Correct! ₹1300 + ₹1500 - ₹300 - ₹500 = ₹2000.", isCorrect: true },
      { id: "opt2", text: "₹2500", outcome: "You missed the supplier payment calculation.", isCorrect: false },
      { id: "opt3", text: "₹1800", outcome: "Math is slightly off here.", isCorrect: false },
      { id: "opt4", text: "₹2800", outcome: "You forgot to deduct the expenses completely.", isCorrect: false },
    ],
  },
  {
    id: 3,
    prompt: "You have ₹2000. A customer buys ₹800 of goods on credit (no cash received today). You spend ₹400 on shop repairs. Cash balance?",
    options: [
      { id: "opt1", text: "₹2400", outcome: "Credit sales don't add to today's cash!", isCorrect: false },
      { id: "opt2", text: "₹1600", outcome: "Correct! ₹2000 - ₹400 = ₹1600. Credit doesn't hit the cash box yet.", isCorrect: true },
      { id: "opt3", text: "₹1200", outcome: "You subtracted the credit sale from your cash?", isCorrect: false },
      { id: "opt4", text: "₹2000", outcome: "You forgot to deduct the repair cost.", isCorrect: false },
    ],
  },
  {
    id: 4,
    prompt: "Starting with ₹1600. The credit customer pays back ₹500 today. You take ₹600 from the till for personal groceries. What's left for the business?",
    options: [
      { id: "opt1", text: "₹2100", outcome: "You forgot you took money out for groceries.", isCorrect: false },
      { id: "opt2", text: "₹1500", outcome: "Correct! ₹1600 + ₹500 - ₹600 = ₹1500.", isCorrect: true },
      { id: "opt3", text: "₹1000", outcome: "You deducted the customer payment instead of adding it.", isCorrect: false },
      { id: "opt4", text: "₹1600", outcome: "Your math is unbalanced.", isCorrect: false },
    ],
  },
  {
    id: 5,
    prompt: "You have ₹1500 cash. You deposit ₹1000 into the bank. You keep ₹500 in the till. What is your total business asset value (Cash + Bank)?",
    options: [
      { id: "opt1", text: "₹500", outcome: "That's just the till cash!", isCorrect: false },
      { id: "opt2", text: "₹1000", outcome: "That's just the bank balance!", isCorrect: false },
      { id: "opt3", text: "₹1500", outcome: "Correct! Moving money to the bank doesn't reduce total business value.", isCorrect: true },
      { id: "opt4", text: "₹2500", outcome: "You counted the ₹1000 twice.", isCorrect: false },
    ],
  },
];

const SimulationDailyLedger = () => {
  const location = useLocation();
  const gameId = "finance-business-livelihood-finance-16";
  const gameData = getGameDataById(gameId);
  const totalStages = STAGES.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const totalCoins = gameData?.coins ?? location.state?.totalCoins ?? 5;
  const coinsPerLevel = Math.max(1, Math.floor(totalCoins / totalStages));
  const totalXp = gameData?.xp ?? location.state?.totalXp ?? 10;
  const stage = STAGES[currentStageIndex];

  const handleChoice = (option) => {
    if (selectedChoice || !stage) return;
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
      setCurrentStageIndex((p) => p + 1);
      setSelectedChoice(null);
    }
  };

  const progressLabel = `${currentStageIndex + 1}/${totalStages}`;

  return (
    <GameShell
      title="Simulation: Daily Ledger"
      subtitle={
        showResult
          ? "Ledger reconciled! Great math skills."
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
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      gameId={gameId}
      gameType="finance"
      nextGamePath={location.state?.nextGamePath}
      nextGameId={location.state?.nextGameId}
      backPath={location.state?.returnPath}
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {!showResult && stage && (
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 md:p-8 border border-white/20 shadow-xl relative overflow-hidden">
            {/* Bookkeeping Notebook Aesthetic */}
            <div className="absolute top-0 left-0 bottom-0 w-8 border-r-2 border-red-500/30 flex flex-col justify-evenly pl-2">
               {[...Array(10)].map((_, i) => (
                 <div key={i} className="w-3 h-3 rounded-full bg-slate-800/50 outline outline-1 outline-slate-600 shadow-inner"></div>
               ))}
            </div>

            <div className="pl-6">
                <div className="flex justify-between items-center mb-6 border-b-2 border-slate-600/50 pb-2">
                  <h3 className="text-slate-300 font-mono text-sm tracking-widest uppercase">
                    Day {currentStageIndex + 1} Calculation
                  </h3>
                  <span className="text-emerald-400 font-bold font-mono text-xl bg-slate-900/50 px-3 py-1 rounded shadow-inner border border-slate-700">
                    {progressLabel}
                  </span>
                </div>

                <div className="bg-amber-100/10 p-5 rounded-lg border border-amber-200/20 mb-8 shadow-inner">
                  <p className="text-white text-xl md:text-2xl font-serif leading-relaxed">
                    {stage.prompt}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {stage.options.map((option) => {
                    const isSelected = selectedChoice?.id === option.id;
                    
                    let bgStyle = "bg-slate-800 border-slate-600 text-slate-200 hover:bg-slate-700 hover:border-slate-400";
                    if (isSelected) {
                      bgStyle = option.isCorrect
                        ? "bg-emerald-800/80 border-emerald-400 text-emerald-100 shadow-[0_0_15px_rgba(52,211,153,0.3)] scale-[1.02]"
                        : "bg-rose-800/80 border-rose-400 text-rose-100 shadow-[0_0_15px_rgba(244,63,94,0.3)] scale-[1.02]";
                    } else if (selectedChoice && option.isCorrect && !isSelected) {
                      bgStyle = "bg-emerald-900/30 border-emerald-500/50 text-emerald-300 ring-1 ring-emerald-500/30";
                    } else if (selectedChoice) {
                      bgStyle = "bg-slate-900/50 border-slate-700/50 text-slate-500 opacity-60";
                    }

                    return (
                      <button
                        key={option.id}
                        onClick={() => handleChoice(option)}
                        disabled={Boolean(selectedChoice)}
                        className={`border-2 rounded-xl p-5 text-center font-bold text-lg md:text-xl font-mono transition-all duration-300 ${bgStyle}`}
                      >
                        {option.text}
                      </button>
                    );
                  })}
                </div>

                {selectedChoice && (
                  <div className="mt-8 animate-fade-in-up">
                    <div className={`p-4 rounded-xl border-2 text-center font-medium shadow-lg ${selectedChoice.isCorrect ? 'bg-emerald-900/40 border-emerald-500 text-emerald-200' : 'bg-rose-900/40 border-rose-500 text-rose-200'}`}>
                      <span className="block text-xs uppercase opacity-70 mb-1 font-bold">{selectedChoice.isCorrect ? "Math Verified" : "Calculation Error"}</span>
                      {selectedChoice.outcome}
                    </div>
                    
                    <button
                      onClick={handleNext}
                      className="mt-6 w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-lg uppercase tracking-widest shadow-[0_4px_14px_rgba(37,99,235,0.4)] transition-all hover:-translate-y-1"
                    >
                      {currentStageIndex === totalStages - 1 ? "Close Ledger" : "Next Entry"}
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

export default SimulationDailyLedger;
