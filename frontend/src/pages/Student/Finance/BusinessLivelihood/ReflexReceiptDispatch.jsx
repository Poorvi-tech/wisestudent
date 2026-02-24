import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const RECEIPT_DISPATCH_STAGES = [
  {
    id: 1,
    prompt: "Customer just paid for 5 kgs of sugar and is walking out. Act fast!",
    options: [
      { id: "opt1", text: "Say 'Thanks!'", outcome: "Friendly, but no proof of sale!", isCorrect: false },
      { id: "opt2", text: "Dispatch Standard Bill", outcome: "Perfect! Customer has proof of purchase.", isCorrect: true },
      { id: "opt3", text: "Wave Goodbye", outcome: "Incorrect. Always give a bill.", isCorrect: false },
      { id: "opt4", text: "Count Cash Again", outcome: "Incorrect. The customer left without a bill!", isCorrect: false },
    ],
  },
  {
    id: 2,
    prompt: "A supplier dropped off inventory and is rushing to his truck.",
    options: [
      { id: "opt1", text: "Let him go", outcome: "Incorrect. You need a record of received goods.", isCorrect: false },
      { id: "opt2", text: "Yell 'Got it!'", outcome: "Incorrect. Verbal confirms mean nothing later.", isCorrect: false },
      { id: "opt3", text: "Sign & File GRN", outcome: "Correct! Legal acknowledgment of inventory.", isCorrect: true },
      { id: "opt4", text: "Check boxes tomorrow", outcome: "Incorrect. Acknowledge and document immediately.", isCorrect: false },
    ],
  },
  {
    id: 3,
    prompt: "Customer cleared their old ₹5,000 credit debt and is leaving.",
    options: [
      { id: "opt1", text: "Issue Clearance Receipt", outcome: "Awesome! Cleared debts must be documented.", isCorrect: true },
      { id: "opt2", text: "Nod head", outcome: "Incorrect. Nods don't update account books.", isCorrect: false },
      { id: "opt3", text: "Smile", outcome: "Incorrect. A smile won't prove they paid.", isCorrect: false },
      { id: "opt4", text: "Scratch name in diary", outcome: "Incorrect. Too informal, dispatch a real receipt.", isCorrect: false },
    ],
  },
  {
    id: 4,
    prompt: "You paid your shop helper his weekly wage in cash.",
    options: [
      { id: "opt1", text: "Assume he remembers", outcome: "Incorrect. Memories fade, disputes happen.", isCorrect: false },
      { id: "opt2", text: "Generate Salary Voucher", outcome: "Correct! Always record employee payouts.", isCorrect: true },
      { id: "opt3", text: "Give him a bonus", outcome: "Generous, but still needs documentation!", isCorrect: false },
      { id: "opt4", text: "Tell him 'All settled'", outcome: "Incorrect. Get it signed/recorded.", isCorrect: false },
    ],
  },
  {
    id: 5,
    prompt: "Final challenge! A bulk B2B buyer is leaving with 50 boxes.",
    options: [
      { id: "opt1", text: "Trust them to pay later", outcome: "Incorrect. Very risky without documentation.", isCorrect: false },
      { id: "opt2", text: "Send a text message", outcome: "Incorrect. Text messages aren't valid tax invoices.", isCorrect: false },
      { id: "opt3", text: "Dispatch Tax Invoice", outcome: "Champion! B2B sales require immediate tax invoices.", isCorrect: true },
      { id: "opt4", text: "Shake hands", outcome: "Incorrect. Handshakes don't pay taxes.", isCorrect: false },
    ],
  },
];

const ReflexReceiptDispatch = () => {
  const location = useLocation();
  const gameId = "finance-business-livelihood-finance-44";
  const gameData = getGameDataById(gameId);
  const totalStages = RECEIPT_DISPATCH_STAGES.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const totalCoins = gameData?.coins ?? location.state?.totalCoins ?? 5;
  const coinsPerLevel = Math.max(1, Math.floor(totalCoins / totalStages));
  const totalXp = gameData?.xp ?? location.state?.totalXp ?? 10;
  const stage = RECEIPT_DISPATCH_STAGES[currentStageIndex];

  useEffect(() => {
    if (showResult || selectedChoice || !stage) return;

    if (timeLeft === 0) {
      setSelectedChoice({ id: "timeout", text: "Time's up!", outcome: "They left without the receipt!", isCorrect: false });
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
      title="Reflex: Receipt Dispatch"
      subtitle={
        showResult
          ? "Great reflexes! Your audit trail is spotless."
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
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-2xl relative overflow-hidden">
              {/* Timer Bar */}
              <div 
                className={`absolute bottom-0 left-0 h-1.5 transition-all duration-1000 ease-linear ${timeLeft <= 3 ? "bg-red-500" : "bg-cyan-400"}`}
                style={{ width: `${(timeLeft / 10) * 100}%` }}
              />
              <div className="flex items-center justify-between text-sm font-semibold uppercase tracking-[0.2em] text-white/70">
                <span>Stage {progressLabel}</span>
                <span className={`text-xl font-bold ${timeLeft <= 3 ? 'text-red-400 animate-pulse' : 'text-cyan-400'}`}>00:{timeLeft.toString().padStart(2, '0')}</span>
                <span>Score: {score}/{totalStages}</span>
              </div>

              <div className="bg-sky-900/40 p-5 rounded-2xl border border-sky-500/30 mt-6 shadow-inner relative">
                 {/* Visual indicator of "customer walking away" */}
                 <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-20 text-4xl animate-pulse">🚶</div>
                 <p className="text-white text-lg md:text-xl font-bold leading-snug pr-8">
                   {stage.prompt}
                 </p>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-8">
                {stage.options.map((option, idx) => {
                  const isSelected = selectedChoice?.id === option.id;
                  
                  // Mobile/Dispatch action styling
                  let baseStyle = "from-cyan-600 to-blue-700 border-blue-500 hover:from-cyan-500 hover:to-blue-600 hover:-translate-y-2 hover:shadow-[0_10px_20px_rgba(6,182,212,0.3)]";
                  
                  if (isSelected) {
                    baseStyle = option.isCorrect
                      ? "from-emerald-500 to-teal-600 border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.5)] -translate-y-2"
                      : "from-rose-500 to-red-600 border-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.5)] -translate-y-2";
                  } else if (selectedChoice && option.isCorrect && !isSelected) {
                    baseStyle = "from-emerald-700/60 to-teal-800/60 border-emerald-500/50 ring-2 ring-emerald-400/50 opacity-80";
                  } else if (selectedChoice) {
                    baseStyle = "from-slate-700 to-slate-800 border-slate-600 opacity-40 translate-y-0";
                  }

                  return (
                    <button
                      key={option.id}
                      onClick={() => handleChoice(option)}
                      disabled={Boolean(selectedChoice)}
                      className={`relative flex flex-col items-center justify-center rounded-2xl bg-gradient-to-t ${baseStyle} border-b-[6px] active:border-b-0 active:translate-y-[6px] p-4 text-center text-white font-bold transition-all disabled:cursor-not-allowed text-sm md:text-base leading-tight min-h-[110px]`}
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
            <div className={`rounded-xl border-2 p-5 text-center font-bold text-lg shadow-lg ${selectedChoice.isCorrect ? 'bg-emerald-900/60 border-emerald-500 text-emerald-200' : 'bg-rose-900/60 border-rose-500 text-rose-200'}`}>
              {selectedChoice.outcome}
            </div>
            {currentStageIndex < totalStages - 1 && (
              <div className="flex justify-center mt-6">
                <button
                  onClick={handleNextStage}
                  className="px-8 py-3 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 text-white font-black tracking-widest uppercase shadow-[0_5px_20px_rgba(6,182,212,0.4)] hover:scale-105 transform transition-all border border-cyan-300"
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

export default ReflexReceiptDispatch;
