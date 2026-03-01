import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const QUICK_VERIFY_STAGES = [
  {
    id: 1,
    prompt: "Scan matching detail: You are verifying a customer's payment screenshot.",
    options: [
      { id: "opt1", text: "Look at the sender's mobile number", outcome: "Incorrect! Names can match, numbers verify the sender.", isCorrect: false },
      { id: "opt2", text: "Check Date & Time, Amount, Trans ID", outcome: "Match Verified! Full verification is crucial.", isCorrect: true },
      { id: "opt3", text: "Only check the total amount", outcome: "Incorrect! Scammers can edit the total amount.", isCorrect: false },
      { id: "opt4", text: "Trust the 'Success' graphic", outcome: "Incorrect! Graphics are easily faked.", isCorrect: false },
    ],
  },
  {
    id: 2,
    prompt: "Scan matching detail: A supplier sends an invoice with a 5% discount.",
    options: [
      { id: "opt1", text: "Verify the list of items only", outcome: "Incorrect! You must check the discount calculation.", isCorrect: false },
      { id: "opt2", text: "Just pay the grand total", outcome: "Incorrect! Verify before trusting the final number.", isCorrect: false },
      { id: "opt3", text: "Calculate 5% on subtotal to verify", outcome: "Match Verified! Always double-check supplier math.", isCorrect: true },
      { id: "opt4", text: "Assume their software is correct", outcome: "Incorrect! Software glitches or typos happen.", isCorrect: false },
    ],
  },
  {
    id: 3,
    prompt: "Scan matching detail: A new delivery batch arrived from the wholesaler.",
    options: [
      { id: "opt1", text: "Count the total number of boxes", outcome: "Incorrect! Boxes might not contain the right items.", isCorrect: false },
      { id: "opt2", text: "Trust the delivery driver's word", outcome: "Incorrect! Drivers don't always know the contents.", isCorrect: false },
      { id: "opt3", text: "Sign the receipt immediately", outcome: "Incorrect! Sign only after verifying.", isCorrect: false },
      { id: "opt4", text: "Cross-check items against purchase order", outcome: "Match Verified! Verify received items against your order.", isCorrect: true },
    ],
  },
  {
    id: 4,
    prompt: "Verify Detail: An employee requests petty cash for 'shop supplies'.",
    options: [
      { id: "opt1", text: "Require a written physical receipt", outcome: "Match Verified! Always get proof of business expenses.", isCorrect: true },
      { id: "opt2", text: "Give the cash and forget about it", outcome: "Incorrect! Cash leaks destroy small businesses.", isCorrect: false },
      { id: "opt3", text: "Tell them to figure it out", outcome: "Incorrect! You need supplies, just need a process.", isCorrect: false },
      { id: "opt4", text: "Ask them verbally later", outcome: "Incorrect! Verbal confirmations are forgotten.", isCorrect: false },
    ],
  },
  {
    id: 5,
    prompt: "Check Detail: You are reviewing your bank statement at the end of the month.",
    options: [
      { id: "opt1", text: "Only check if the final balance is positive", outcome: "Incorrect! Hidden fees could be draining your account.", isCorrect: false },
      { id: "opt2", text: "Verify every withdrawal against ledger", outcome: "Match Verified! Monthly reconciliation spots unauthorized charges.", isCorrect: true },
      { id: "opt3", text: "Glance at the largest transactions", outcome: "Incorrect! Small recurring fees add up to large losses.", isCorrect: false },
      { id: "opt4", text: "Assume the bank never makes mistakes", outcome: "Incorrect! Bank errors happen and you must catch them.", isCorrect: false },
    ],
  },
];

const ReflexQuickVerify = () => {
  const location = useLocation();
  const gameId = "finance-business-livelihood-finance-74";
  const gameData = getGameDataById(gameId);
  const totalStages = QUICK_VERIFY_STAGES.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10); // Increased because questions are longer
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const totalCoins = gameData?.coins ?? location.state?.totalCoins ?? 5;
  const coinsPerLevel = Math.max(1, Math.floor(totalCoins / totalStages));
  const totalXp = gameData?.xp ?? location.state?.totalXp ?? 10;
  const stage = QUICK_VERIFY_STAGES[currentStageIndex];

  useEffect(() => {
    if (showResult || selectedChoice || !stage) return;

    if (timeLeft === 0) {
      setSelectedChoice({ id: "timeout", text: "Time's up!", outcome: "Verification failed (Timeout).", isCorrect: false });
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
      setTimeLeft(10); // Changed from 5 to 10 seconds since questions are longer now
    }
    setSelectedChoice(null);
  };



  const progressLabel = `${currentStageIndex + 1}/${totalStages}`;

  return (
    <GameShell
      title="Reflex: Quick Verify"
      subtitle={
        showResult
          ? "Verification complete! Sharp eyes!"
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
                className={`absolute bottom-0 left-0 h-1.5 transition-all duration-1000 ease-linear ${timeLeft <= 3 ? "bg-red-500" : "bg-fuchsia-400"}`}
                style={{ width: `${(timeLeft / 10) * 100}%` }}
              />
              <div className="flex items-center justify-between text-sm font-semibold uppercase tracking-[0.2em] text-slate-300">
                <span>Stage {progressLabel}</span>
                <span className={`text-xl font-bold ${timeLeft <= 3 ? 'text-red-400 animate-pulse' : 'text-fuchsia-400'}`}>00:{timeLeft.toString().padStart(2, '0')}</span>
                <span>Score: {score}/{totalStages}</span>
              </div>

              {/* Barcode / Scanner Screen */}
              <div className="bg-black/50 border-2 border-fuchsia-900 shadow-[0_0_15px_rgba(192,38,211,0.2)] p-6 rounded-xl mt-6">
                 <div className="text-center font-mono text-fuchsia-300 text-lg tracking-widest uppercase mb-4 opacity-50">
                    ||| |||| || ||| || |||
                 </div>
                 <p className="text-white text-xl md:text-2xl font-mono leading-snug text-center tracking-wider">
                   {stage.prompt.split(': ')[1]}
                 </p>
                 <div className="text-center font-mono text-fuchsia-300 text-lg tracking-widest uppercase mt-4 opacity-50">
                    |||| || ||| |||| || ||
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-8">
                {stage.options.map((option, idx) => {
                  const isSelected = selectedChoice?.id === option.id;
                  
                  // Holographic/Digital styling
                  let baseStyle = "border-fuchsia-700 bg-slate-800 text-fuchsia-100 hover:bg-slate-700 hover:border-fuchsia-500 border-[3px]";
                  
                  if (isSelected) {
                    baseStyle = option.isCorrect
                      ? "bg-emerald-900/80 border-emerald-400 text-emerald-200 shadow-[0_0_20px_rgba(52,211,153,0.5)] scale-105"
                      : "bg-rose-900/80 border-rose-400 text-rose-200 shadow-[0_0_20px_rgba(244,63,94,0.5)] scale-105";
                  } else if (selectedChoice && option.isCorrect && !isSelected) {
                    baseStyle = "bg-emerald-900/40 border-emerald-500/50 text-emerald-300/80 ring-2 ring-emerald-500/30";
                  } else if (selectedChoice) {
                    baseStyle = "bg-slate-900/50 border-slate-700/50 text-slate-500 opacity-50 scale-95";
                  }

                  return (
                    <button
                      key={option.id}
                      onClick={() => handleChoice(option)}
                      disabled={Boolean(selectedChoice)}
                      className={`relative flex items-center justify-center rounded-xl ${baseStyle} p-4 text-center font-bold transition-all disabled:cursor-not-allowed text-sm md:text-base leading-tight min-h-[90px]`}
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
              <span className="block text-xs uppercase opacity-70 mb-1">{selectedChoice.isCorrect ? 'Match Verified' : 'Scan Error'}</span>
              {selectedChoice.outcome}
            </div>
            {currentStageIndex < totalStages - 1 && (
              <div className="flex justify-center mt-6">
                <button
                  onClick={handleNextStage}
                  className="px-8 py-3 rounded-full bg-fuchsia-600 text-white font-black tracking-widest uppercase shadow-[0_5px_15px_rgba(192,38,211,0.4)] hover:scale-105 transform transition-all border border-fuchsia-400 hover:bg-fuchsia-500"
                >
                  NEXT SCAN
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default ReflexQuickVerify;
