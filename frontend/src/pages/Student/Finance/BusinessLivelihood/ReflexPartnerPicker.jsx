import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const PARTNER_PICKER_STAGES = [
  {
    id: 1,
    prompt: "You need a new supplier for raw materials. Who do you pick?",
    options: [
      { id: "opt1", text: "Cash Only, No Bill Supplier", outcome: "Incorrect. Always demand bills to track expenses properly.", isCorrect: false },
      { id: "opt2", text: "Verified & Registered Supplier", outcome: "Correct! Verified suppliers protect your business and ensure quality.", isCorrect: true },
      { id: "opt3", text: "Friend's Recommendation (Unregistered)", outcome: "Incorrect. Make sure any supplier is properly registered.", isCorrect: false },
      { id: "opt4", text: "Cheapest, Secret Source", outcome: "Incorrect. Hidden sources bring legal and quality risks.", isCorrect: false },
    ],
  },
  {
    id: 2,
    prompt: "A delivery company offers to handle your logistics.",
    options: [
      { id: "opt1", text: "Unregistered WhatsApp Group", outcome: "Incorrect. You need official transport records and accountability.", isCorrect: false },
      { id: "opt2", text: "Verbal Agreement Only", outcome: "Incorrect. Logistics need formal contracts and invoices.", isCorrect: false },
      { id: "opt3", text: "Reputed & Insured Transporter", outcome: "Correct! Reliable logistics need proper documentation and insurance.", isCorrect: true },
      { id: "opt4", text: "Anonymous Driver", outcome: "Incorrect. This is a huge risk for your inventory's safety.", isCorrect: false },
    ],
  },
  {
    id: 3,
    prompt: "Looking for an accountant to manage your business taxes.",
    options: [
      { id: "opt1", text: "Neighbour's Nephew", outcome: "Incorrect. Qualifications matter significantly for taxes.", isCorrect: false },
      { id: "opt2", text: "Certified Professional Accountant", outcome: "Correct! Always use verified professionals to avoid compliance issues.", isCorrect: true },
      { id: "opt3", text: "Someone 'Who Knows a Guy'", outcome: "Incorrect. Never gamble your business with tax compliance.", isCorrect: false },
      { id: "opt4", text: "Do It Yourself (Incorrectly)", outcome: "Incorrect. Hire a pro if you don't know the regulations.", isCorrect: false },
    ],
  },
  {
    id: 4,
    prompt: "You are setting up online payment gateways for your shop.",
    options: [
      { id: "opt1", text: "Official Bank Aggregator", outcome: "Great! Official payment apps secure your money and provide clear records.", isCorrect: true },
      { id: "opt2", text: "Personal Crypto Wallet", outcome: "Incorrect. Keep business transactions standard and trackable.", isCorrect: false },
      { id: "opt3", text: "Random Unknown App", outcome: "Incorrect. There is a high risk of fraud with unverified apps.", isCorrect: false },
      { id: "opt4", text: "Direct Bank Transfers Only", outcome: "Okay, but a verified gateway is safer, better, and faster for customers.", isCorrect: false },
    ],
  },
  {
    id: 5,
    prompt: "You need to purchase a new billing software.",
    options: [
      { id: "opt1", text: "Pirated Copy", outcome: "Incorrect. Illegal software lacks support and gets you in trouble.", isCorrect: false },
      { id: "opt2", text: "Free Unsigned Tool", outcome: "Incorrect. Huge risk of data loss or theft.", isCorrect: false },
      { id: "opt3", text: "Custom Script from a Friend", outcome: "Incorrect. Go with established, legally compliant software.", isCorrect: false },
      { id: "opt4", text: "Licensed & Compliant Software", outcome: "Awesome! Verified software ensures long-term compliance and security.", isCorrect: true },
    ],
  },
];

const ReflexPartnerPicker = () => {
  const location = useLocation();
  const gameId = "finance-business-livelihood-finance-64";
  const gameData = getGameDataById(gameId);
  const totalStages = PARTNER_PICKER_STAGES.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const totalCoins = gameData?.coins ?? location.state?.totalCoins ?? 5;
  const coinsPerLevel = Math.max(1, Math.floor(totalCoins / totalStages));
  const totalXp = gameData?.xp ?? location.state?.totalXp ?? 10;
  const stage = PARTNER_PICKER_STAGES[currentStageIndex];

  useEffect(() => {
    if (showResult || selectedChoice || !stage) return;

    if (timeLeft === 0) {
      setSelectedChoice({ id: "timeout", text: "Time's up!", outcome: "You missed the verified partner.", isCorrect: false });
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
      title="Reflex: Partner Picker"
      subtitle={
        showResult
          ? "Verification complete! You know how to pick the right partners."
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
            <div className="bg-slate-800/80 backdrop-blur-xl rounded-3xl p-6 border border-slate-600 shadow-xl relative overflow-hidden">
              {/* Timer Bar */}
              <div 
                className={`absolute bottom-0 left-0 h-1.5 transition-all duration-1000 ease-linear ${timeLeft <= 3 ? "bg-rose-500" : "bg-indigo-400"}`}
                style={{ width: `${(timeLeft / 10) * 100}%` }}
              />
              <div className="flex items-center justify-between text-sm font-semibold uppercase tracking-[0.2em] text-slate-300">
                <span>Stage {progressLabel}</span>
                <span className={`text-xl font-bold ${timeLeft <= 3 ? 'text-rose-400 animate-pulse' : 'text-indigo-400'}`}>00:{timeLeft.toString().padStart(2, '0')}</span>
                <span>Score: {score}/{totalStages}</span>
              </div>

              {/* Terminal / Search Panel Aesthetic */}
              <div className="bg-slate-900 border border-slate-700 p-5 rounded-xl mt-6">
                 <div className="flex items-center gap-2 mb-3">
                   <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                   <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                   <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                   <span className="text-slate-500 text-xs ml-2 font-mono">vendor_search.exe</span>
                 </div>
                 <p className="text-indigo-200 text-lg md:text-xl font-mono leading-snug">
                   &gt; {stage.prompt}_
                 </p>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-8">
                {stage.options.map((option, idx) => {
                  const isSelected = selectedChoice?.id === option.id;
                  
                  // Verification Tag Styling
                  let baseStyle = "bg-slate-700 border-slate-600 text-slate-200 hover:bg-slate-600 hover:border-slate-500 border-2";
                  
                  if (isSelected) {
                    baseStyle = option.isCorrect
                      ? "bg-emerald-900/80 border-emerald-500 text-emerald-200 shadow-[0_0_15px_rgba(16,185,129,0.4)]"
                      : "bg-rose-900/80 border-rose-500 text-rose-200 shadow-[0_0_15px_rgba(244,63,94,0.4)]";
                  } else if (selectedChoice && option.isCorrect && !isSelected) {
                    baseStyle = "bg-emerald-900/40 border-emerald-500/50 text-emerald-300/80 ring-2 ring-emerald-500/30";
                  } else if (selectedChoice) {
                    baseStyle = "bg-slate-800/50 border-slate-700/50 text-slate-500 opacity-50";
                  }

                  // Simulated scanning animation speed offsets
                  const animDurList = ['animate-[pulse_2s_ease-in-out_infinite]', 'animate-[pulse_3s_ease-in-out_infinite]', 'animate-[pulse_2.5s_ease-in-out_infinite]', 'animate-[pulse_3.5s_ease-in-out_infinite]'];
                  const scanAnim = !selectedChoice ? animDurList[idx % 4] : '';

                  return (
                    <button
                      key={option.id}
                      onClick={() => handleChoice(option)}
                      disabled={Boolean(selectedChoice)}
                      className={`relative flex items-center justify-center rounded-lg ${baseStyle} p-4 text-center font-bold transition-all disabled:cursor-not-allowed text-sm md:text-base leading-tight min-h-[90px] ${scanAnim}`}
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
              <span className="block text-xs uppercase opacity-70 mb-1">{selectedChoice.isCorrect ? 'Partner Verified' : 'Risk Detected'}</span>
              {selectedChoice.outcome}
            </div>
            {currentStageIndex < totalStages - 1 && (
              <div className="flex justify-center mt-6">
                <button
                  onClick={handleNextStage}
                  className="px-8 py-3 rounded-full bg-indigo-600 text-white font-black tracking-widest uppercase shadow-[0_5px_15px_rgba(79,70,229,0.4)] hover:scale-105 transform transition-all border border-indigo-400 hover:bg-indigo-500"
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

export default ReflexPartnerPicker;
