import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const FRAUD_FILTER_STAGES = [
  {
    id: 1,
    prompt: "Supplier hands you a piece of paper for ₹5,000 worth of stock.",
    options: [
      { id: "opt1", text: "Reject – No GST Number", outcome: "Correct! A bill without GST details is not valid.", isCorrect: true },
      { id: "opt2", text: "Accept – Looks Official", outcome: "Incorrect. It had no shop name or GST number.", isCorrect: false },
      { id: "opt3", text: "File It for Later", outcome: "Incorrect. Filing a fake document causes accounting errors.", isCorrect: false },
      { id: "opt4", text: "Pay Without Checking", outcome: "Incorrect. Always verify before paying.", isCorrect: false },
    ],
  },
  {
    id: 2,
    prompt: "A customer returns a mixer grinder showing a printed receipt with shop name, date, and GST.",
    options: [
      { id: "opt1", text: "Refuse the Return", outcome: "Incorrect. The receipt was printed and valid.", isCorrect: false },
      { id: "opt2", text: "Verify & Accept Return", outcome: "Correct! The receipt had all valid details, so the return is legitimate.", isCorrect: true },
      { id: "opt3", text: "Demand Original Box", outcome: "Incorrect. A valid receipt is sufficient proof of purchase.", isCorrect: false },
      { id: "opt4", text: "Call Police", outcome: "Incorrect. There is no fraud here — the receipt is real.", isCorrect: false },
    ],
  },
  {
    id: 3,
    prompt: "An agent WhatsApps you a 'bill' that is just a typed message with amounts.",
    options: [
      { id: "opt1", text: "Save as Proof", outcome: "Incorrect. A typed message is not a legal invoice.", isCorrect: false },
      { id: "opt2", text: "Forward to Accountant", outcome: "Incorrect. Your accountant needs real invoices, not chat messages.", isCorrect: false },
      { id: "opt3", text: "Reject – Not a Valid Bill", outcome: "Correct! A WhatsApp message is not legal proof of transaction.", isCorrect: true },
      { id: "opt4", text: "Pay and Forget", outcome: "Incorrect. Always demand a proper PDF/paper bill.", isCorrect: false },
    ],
  },
  {
    id: 4,
    prompt: "You receive inventory and an invoice with GST number, date, item list, and amounts.",
    options: [
      { id: "opt1", text: "Reject – Seems Too Perfect", outcome: "Incorrect. Having all details is exactly what makes a real invoice.", isCorrect: false },
      { id: "opt2", text: "Ask for Handwritten Copy", outcome: "Incorrect. Printed invoices with proper details are standard.", isCorrect: false },
      { id: "opt3", text: "Ignore the Invoice", outcome: "Incorrect. You should process legitimate invoices promptly.", isCorrect: false },
      { id: "opt4", text: "Accept – Properly Documented", outcome: "Correct! This invoice has all legal requirements — GST, date, and itemized amounts.", isCorrect: true },
    ],
  },
  {
    id: 5,
    prompt: "Purchased raw materials, but seller gives an 'Estimate' slip instead of a tax invoice.",
    options: [
      { id: "opt1", text: "Accept as Final Bill", outcome: "Incorrect. An 'Estimate' is not a final bill.", isCorrect: false },
      { id: "opt2", text: "Demand Tax Invoice", outcome: "Correct! You must always get a final tax invoice, not just an estimate.", isCorrect: true },
      { id: "opt3", text: "Use for GST Filing", outcome: "Incorrect. Estimates cannot be used for GST input credit.", isCorrect: false },
      { id: "opt4", text: "Throw It Away", outcome: "Incorrect. Keep the estimate but insist on a proper invoice too.", isCorrect: false },
    ],
  },
];

const ReflexFraudFilter = () => {
  const location = useLocation();
  const gameId = "finance-business-livelihood-finance-24";
  const gameData = getGameDataById(gameId);
  const totalStages = FRAUD_FILTER_STAGES.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const totalCoins = gameData?.coins ?? location.state?.totalCoins ?? 5;
  const coinsPerLevel = Math.max(1, Math.floor(totalCoins / totalStages));
  const totalXp = gameData?.xp ?? location.state?.totalXp ?? 10;
  const stage = FRAUD_FILTER_STAGES[currentStageIndex];

  useEffect(() => {
    if (showResult || selectedChoice || !stage) return;

    if (timeLeft === 0) {
      setSelectedChoice({ id: "timeout", text: "Time's up!", outcome: "You didn't decide in time.", isCorrect: false });
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
      title="Reflex: Fraud Filter"
      subtitle={
        showResult
          ? "Great job filtering the fakes from the real bills."
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
              {/* Timer Bar representing 10 seconds */}
              <div 
                className={`absolute bottom-0 left-0 h-1.5 transition-all duration-1000 ease-linear ${timeLeft <= 3 ? "bg-red-500" : "bg-emerald-400"}`}
                style={{ width: `${(timeLeft / 10) * 100}%` }}
              />
              <div className="flex items-center justify-between text-sm font-semibold uppercase tracking-[0.2em] text-slate-300">
                <span>Stage {progressLabel}</span>
                <span className={`text-xl font-bold ${timeLeft <= 3 ? 'text-red-400 animate-pulse' : 'text-emerald-400'}`}>00:{timeLeft.toString().padStart(2, '0')}</span>
                <span>Score: {score}/{totalStages}</span>
              </div>

              <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-600 mt-6 shadow-inner">
                 <p className="text-white text-lg md:text-xl font-bold leading-snug text-center">
                   {stage.prompt}
                 </p>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-8">
                {stage.options.map((option, idx) => {
                  const isSelected = selectedChoice?.id === option.id;
                  
                  // Scifi/Tech filter style
                  let baseStyle = "from-slate-700 to-slate-800 border-slate-500 hover:from-slate-600 hover:to-slate-700 hover:scale-105 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]";
                  
                  if (isSelected) {
                    baseStyle = option.isCorrect
                      ? "from-emerald-600 to-teal-700 border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.5)] scale-105"
                      : "from-rose-600 to-red-800 border-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.5)] scale-105";
                  } else if (selectedChoice && option.isCorrect && !isSelected) {
                    baseStyle = "from-emerald-700/60 to-teal-800/60 border-emerald-500/50 ring-2 ring-emerald-400/50 opacity-80";
                  } else if (selectedChoice) {
                    baseStyle = "from-slate-800 to-slate-900 border-slate-700 opacity-40 scale-95";
                  }

                  return (
                    <button
                      key={option.id}
                      onClick={() => handleChoice(option)}
                      disabled={Boolean(selectedChoice)}
                      className={`relative flex items-center justify-center rounded-xl bg-gradient-to-b ${baseStyle} border-[3px] p-4 text-center text-white font-bold transition-all disabled:cursor-not-allowed text-sm md:text-base leading-tight min-h-[90px]`}
                    >
                      {/* Decorative dot */}
                      <div className={`absolute top-2 right-2 w-3 h-3 rounded-full opacity-50 bg-blue-400`}></div>
                      
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
            <div className={`rounded-xl border-2 p-4 text-center font-bold text-lg shadow-lg ${selectedChoice.isCorrect ? 'bg-emerald-900/40 border-emerald-500 text-emerald-300' : 'bg-rose-900/40 border-rose-500 text-rose-300'}`}>
              <span className="opacity-80 block text-xs uppercase tracking-widest mb-1">{selectedChoice.isCorrect ? 'Filter Success' : 'Filter Failed'}</span>
              {selectedChoice.outcome}
            </div>
            {currentStageIndex < totalStages - 1 && (
              <div className="flex justify-center mt-6">
                <button
                  onClick={handleNextStage}
                  className="px-8 py-3 rounded-full bg-gradient-to-r from-teal-500 to-emerald-600 text-white font-black tracking-widest uppercase shadow-[0_5px_20px_rgba(20,184,166,0.4)] hover:scale-105 transform transition-all border border-emerald-400"
                >
                  NEXT
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default ReflexFraudFilter;
