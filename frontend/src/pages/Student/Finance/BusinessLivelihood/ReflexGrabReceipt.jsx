import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const GRAB_RECEIPT_STAGES = [
  {
    id: 1,
    prompt: "A customer wants proof of their purchase. Quick, what do you give?",
    options: [
      { id: "opt1", text: "Oral Promise", outcome: "No, oral promises hold no legal value.", isCorrect: false },
      { id: "opt2", text: "Digital Receipt", outcome: "Correct! A receipt is clear proof.", isCorrect: true },
      { id: "opt3", text: "Smile", outcome: "Friendly, but not proof!", isCorrect: false },
      { id: "opt4", text: "Free Candy", outcome: "Nice gesture, wrong answer.", isCorrect: false },
    ],
  },
  {
    id: 2,
    prompt: "Supplier asks you to return defective items later. Best choice?",
    returnText: "Catch!",
    options: [
      { id: "opt1", text: "Handshake", outcome: "A handshake won't get your money back.", isCorrect: false },
      { id: "opt2", text: "Remember It", outcome: "Memory fades, records stay.", isCorrect: false },
      { id: "opt3", text: "Return Note/Receipt", outcome: "Exactly! Written proof protects you.", isCorrect: true },
      { id: "opt4", text: "Trust Them", outcome: "Trust is good, receipts are better.", isCorrect: false },
    ],
  },
  {
    id: 3,
    prompt: "Giving salary to an employee in cash. What's missing?",
    options: [
      { id: "opt1", text: "Payment Voucher/Receipt", outcome: "Great! Protects against salary disputes.", isCorrect: true },
      { id: "opt2", text: "Oral Confirmation", outcome: "Not enough if a disagreement happens.", isCorrect: false },
      { id: "opt3", text: "A Pat on the Back", outcome: "Good for morale, bad for accounting.", isCorrect: false },
      { id: "opt4", text: "A Bonus", outcome: "Only if earned, but still needs a receipt.", isCorrect: false },
    ],
  },
  {
    id: 4,
    prompt: "Customer pays off their old credit balance.",
    options: [
      { id: "opt1", text: "Cross name out", outcome: "Too informal, can be disputed.", isCorrect: false },
      { id: "opt2", text: "Say 'Clear'", outcome: "Words disappear.", isCorrect: false },
      { id: "opt3", text: "Nod head", outcome: "Doesn't update your books.", isCorrect: false },
      { id: "opt4", text: "Issue Cash Receipt", outcome: "Perfect! Both parties are clear.", isCorrect: true },
    ],
  },
  {
    id: 5,
    prompt: "Final challenge! Choose the best habit for a growing business.",
    options: [
      { id: "opt1", text: "Avoid Paperwork", outcome: "Keeps you small and informal.", isCorrect: false },
      { id: "opt2", text: "Issue Receipts & Bills", outcome: "Champion! This builds a rock-solid business.", isCorrect: true },
      { id: "opt3", text: "Rely on Memory", outcome: "The fastest way to lose money.", isCorrect: false },
      { id: "opt4", text: "Hide Transactions", outcome: "Bad for loans and growth.", isCorrect: false },
    ],
  },
];

const ReflexGrabReceipt = () => {
  const location = useLocation();
  const gameId = "finance-business-livelihood-finance-18";
  const gameData = getGameDataById(gameId);
  const totalStages = GRAB_RECEIPT_STAGES.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const totalCoins = gameData?.coins ?? location.state?.totalCoins ?? 5;
  const coinsPerLevel = Math.max(1, Math.floor(totalCoins / totalStages));
  const totalXp = gameData?.xp ?? location.state?.totalXp ?? 10;
  const stage = GRAB_RECEIPT_STAGES[currentStageIndex];

  useEffect(() => {
    if (showResult || selectedChoice || !stage) return;

    if (timeLeft === 0) {
      setSelectedChoice({ id: "timeout", text: "Time's up!", outcome: "You didn't grab the receipt in time.", isCorrect: false });
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
      // Shuffle options for the next stage
      const nextStage = GRAB_RECEIPT_STAGES[currentStageIndex + 1];
      nextStage.options = [...nextStage.options].sort(() => Math.random() - 0.5);
      
      setCurrentStageIndex((prev) => prev + 1);
      setTimeLeft(10);
    }
    setSelectedChoice(null);
  };

  // Shuffle initial stage options on mount
  useEffect(() => {
    GRAB_RECEIPT_STAGES[0].options = [...GRAB_RECEIPT_STAGES[0].options].sort(() => Math.random() - 0.5);
  }, []);

  const progressLabel = `${currentStageIndex + 1}/${totalStages}`;

  return (
    <GameShell
      title="Reflex: Grab the Receipt"
      subtitle={
        showResult
          ? "Game over! You know exactly what proofs to grab."
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
              {/* Timer Bar representing 10 seconds */}
              <div 
                className={`absolute bottom-0 left-0 h-1.5 transition-all duration-1000 ease-linear ${timeLeft <= 3 ? "bg-red-500" : "bg-sky-400"}`}
                style={{ width: `${(timeLeft / 10) * 100}%` }}
              />
              <div className="flex items-center justify-between text-sm font-semibold uppercase tracking-[0.2em] text-white/70">
                <span>Stage {progressLabel}</span>
                <span className={`text-xl font-bold ${timeLeft <= 3 ? 'text-red-400 animate-pulse' : 'text-sky-400'}`}>00:{timeLeft.toString().padStart(2, '0')}</span>
                <span>Score: {score}/{totalStages}</span>
              </div>

              <p className="text-white text-lg md:text-xl font-bold leading-snug mt-4 text-center">
                {stage.prompt}
              </p>

              <div className="grid grid-cols-2 gap-4 mt-8">
                {stage.options.map((option, idx) => {
                  const isSelected = selectedChoice?.id === option.id;
                  
                  // Paper/Receipt style vs generic options
                  let baseStyle = "from-sky-500 to-blue-600 border-blue-400 hover:from-sky-400 hover:to-blue-500 hover:-translate-y-1 hover:shadow-xl";
                  
                  if (isSelected) {
                    baseStyle = option.isCorrect
                      ? "from-emerald-500 to-lime-500 border-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.6)] scale-105"
                      : "from-rose-500 to-orange-500 border-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.6)] scale-105";
                  } else if (selectedChoice && option.isCorrect && !isSelected) {
                    baseStyle = "from-emerald-500/60 to-lime-500/60 border-emerald-500/50 opacity-80 ring-2 ring-emerald-300";
                  } else if (selectedChoice) {
                    baseStyle = "from-slate-700 to-slate-800 border-slate-600 opacity-40 scale-95";
                  }

                  // Adding animation delays to simulate "falling/appearing" options
                  const animDelay = `${idx * 100}ms`;

                  return (
                    <button
                      key={option.id}
                      onClick={() => handleChoice(option)}
                      disabled={Boolean(selectedChoice)}
                      style={{ animationDelay: animDelay }}
                      className={`relative flex flex-col items-center justify-center rounded-lg bg-gradient-to-b ${baseStyle} border-2 border-t-8 border-t-white/30 p-4 text-center text-white font-bold transition-all disabled:cursor-not-allowed shadow-lg text-sm md:text-base leading-tight min-h-[100px] animate-fade-in-up`}
                    >
                       {/* Subtle graphic to look like a receipt/paper */}
                      <div className="absolute top-2 left-2 right-2 h-[2px] bg-white/20 rounded-full"></div>
                      <div className="absolute top-4 left-2 right-8 h-[2px] bg-white/20 rounded-full"></div>
                      
                      <span className="drop-shadow-md z-10 mt-2">{option.text}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {selectedChoice && (
          <div className="animate-fade-in-up">
            <div className={`rounded-2xl border-2 p-5 text-center font-bold text-lg shadow-xl ${selectedChoice.isCorrect ? 'bg-emerald-900/60 border-emerald-500 text-emerald-200' : 'bg-rose-900/60 border-rose-500 text-rose-200'}`}>
              {selectedChoice.outcome}
            </div>
            {currentStageIndex < totalStages - 1 && (
              <div className="flex justify-center mt-6">
                <button
                  onClick={handleNextStage}
                  className="px-8 py-3 rounded-full bg-gradient-to-r from-sky-400 to-indigo-500 text-white font-black tracking-widest uppercase shadow-[0_5px_15px_rgba(56,189,248,0.4)] hover:scale-105 transform transition-all"
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

export default ReflexGrabReceipt;
