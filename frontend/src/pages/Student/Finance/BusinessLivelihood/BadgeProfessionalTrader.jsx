import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const STAGES = [
  {
    id: 1,
    prompt: "How does a professional trader handle supplier invoices?",
    options: [
      { id: "opt1", text: "Pays immediately without checking", outcome: "Trust is good, but errors happen.", isCorrect: false },
      { id: "opt2", text: "Verifies items, quantities, and rates before paying", outcome: "Correct! Verification prevents overpaying.", isCorrect: true },
      { id: "opt3", text: "Loses the invoice and pays from memory", outcome: "A quick way to ruin accounting.", isCorrect: false },
      { id: "opt4", text: "Refuses to pay for months to save cash", outcome: "Destroys supplier relationships.", isCorrect: false },
    ],
  },
  {
    id: 2,
    prompt: "A customer wants to buy items but asks you not to generate a bill to save tax. A professional response is:",
    options: [
      { id: "opt1", text: "Agree immediately to make the sale", outcome: "Illegal and harms your business record.", isCorrect: false },
      { id: "opt2", text: "Refuse the sale entirely and shout at them", outcome: "Unprofessional behavior.", isCorrect: false },
      { id: "opt3", text: "Explain that a formal bill provides them with a valid warranty and protects both parties", outcome: "Correct! Educating the customer builds long-term trust.", isCorrect: true },
      { id: "opt4", text: "Write the bill on a piece of scrap paper", outcome: "Scrap paper isn't a valid tax invoice.", isCorrect: false },
    ],
  },
  {
    id: 3,
    prompt: "Why is a dedicated business bank account essential for a Professional Trader?",
    options: [
      { id: "opt1", text: "It separates personal spending from business cash flow, showing true profit", outcome: "Correct! Clear separation is the hallmark of a pro.", isCorrect: true },
      { id: "opt2", text: "It allows hiding money from the family", outcome: "Not the professional purpose of the account.", isCorrect: false },
      { id: "opt3", text: "Because banks give free gifts for opening accounts", outcome: "Nice, but not the business reason.", isCorrect: false },
      { id: "opt4", text: "It prevents you from ever using cash again", outcome: "Cash is still used, just tracked better.", isCorrect: false },
    ],
  },
  {
    id: 4,
    prompt: "You need to hire a part-time helper. How should you manage their payment?",
    options: [
      { id: "opt1", text: "Give them cash whenever they ask, without a record", outcome: "Leads to confusion and disputes over unpaid wages.", isCorrect: false },
      { id: "opt2", text: "Pay cash but maintain a signed payment register or use digital transfers", outcome: "Correct! Documented payroll protects you and the worker.", isCorrect: true },
      { id: "opt3", text: "Promise to pay them 'eventually'", outcome: "Exploitative and unprofessional.", isCorrect: false },
      { id: "opt4", text: "Pay them in unsold inventory instead of money", outcome: "Workers need cash, not just goods.", isCorrect: false },
    ],
  },
  {
    id: 5,
    prompt: "The ultimate mark of a Professional Trader in the eyes of a bank offering a loan is:",
    options: [
      { id: "opt1", text: "Having the biggest, loudest shop on the street", outcome: "Looks don't prove financial health.", isCorrect: false },
      { id: "opt2", text: "Being friends with the bank manager", outcome: "Connections help, but data approves loans.", isCorrect: false },
      { id: "opt3", text: "Providing a clean, verifiable trail of steady digital payments, invoices, and consistent records", outcome: "Correct! Verifiable data is what lenders trust.", isCorrect: true },
      { id: "opt4", text: "Having zero debt and zero growth", outcome: "Healthy debt fuels growth; zero debt isn't always the goal.", isCorrect: false },
    ],
  },
];

const BadgeProfessionalTrader = () => {
  const location = useLocation();
  const totalStages = STAGES.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const { showAnswerConfetti, showCorrectAnswerFeedback, flashPoints } = useGameFeedback();
  const gameId = "finance-business-livelihood-finance-40";
  const gameData = getGameDataById(gameId);
  const totalCoins = gameData?.coins ?? location.state?.totalCoins ?? 10;
  const coinsPerLevel = Math.max(2, Math.floor(totalCoins / totalStages));
  const totalXp = gameData?.xp ?? location.state?.totalXp ?? 20;
  const stage = STAGES[currentStageIndex];

  const handleChoice = (option) => {
    if (selectedChoice || !stage) return;
    setSelectedChoice(option);
    if (option.isCorrect) {
      setScore((s) => s + 1);
      showCorrectAnswerFeedback(1, true);
    }
    setTimeout(() => {
      if (currentStageIndex === totalStages - 1) {
        setShowResult(true);
      } else {
        setCurrentStageIndex((i) => i + 1);
      }
      setSelectedChoice(null);
    }, 3200);
  };

  const progressLabel = `${currentStageIndex + 1}/${totalStages}`;

  return (
    <GameShell
      title="Badge: Professional Trader"
      subtitle={
        showResult
          ? "Achievement unlocked! You are a Professional Trader."
          : `Scenario ${currentStageIndex + 1} of ${totalStages}`
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
      <div className="space-y-8 max-w-4xl mx-auto">
        {!showResult && stage && (
          <div className="space-y-6">
            <div className="bg-fuchsia-950/80 backdrop-blur-xl rounded-3xl p-6 md:p-8 border border-fuchsia-400/30 shadow-2xl shadow-black/50 overflow-hidden relative">
              
              {/* Professional aesthetic background */}
              <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-fuchsia-500/5 to-purple-800/20 pointer-events-none"></div>
              <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-fuchsia-600/10 rounded-full blur-3xl pointer-events-none"></div>

              <div className="flex items-center justify-between text-sm font-bold uppercase tracking-[0.2em] text-fuchsia-300 mb-6 border-b border-fuchsia-500/30 pb-4 relative z-10">
                <span>Scenario {progressLabel}</span>
                <span className="bg-fuchsia-500/20 px-3 py-1 rounded-full border border-fuchsia-400/30 shadow-inner">
                  Professionalism: {score}/{totalStages}
                </span>
              </div>
              
              <div className="bg-black/30 rounded-2xl p-6 mb-8 border-l-4 border-fuchsia-500 shadow-inner relative z-10">
                <p className="text-white text-xl md:text-2xl font-serif leading-relaxed tracking-wide">
                  {stage.prompt}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
                {stage.options.map((option) => {
                  const isSelected = selectedChoice?.id === option.id;
                  
                  let baseStyle = "bg-slate-900 border-slate-700 hover:border-fuchsia-400 hover:bg-slate-800 text-slate-300";
                  
                  if (isSelected) {
                    baseStyle = option.isCorrect
                      ? "bg-emerald-950 border-emerald-500 text-emerald-100 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                      : "bg-rose-950 border-rose-500 text-rose-100 shadow-[0_0_20px_rgba(244,63,94,0.3)]";
                  } else if (selectedChoice && option.isCorrect && !isSelected) {
                    baseStyle = "bg-emerald-950/50 border-emerald-500/50 text-emerald-400 opacity-80 ring-1 ring-emerald-500/40";
                  } else if (selectedChoice) {
                    baseStyle = "bg-slate-900/40 border-slate-800 text-slate-600 opacity-40";
                  }

                  return (
                    <button
                      key={option.id}
                      onClick={() => handleChoice(option)}
                      disabled={Boolean(selectedChoice)}
                      className={`relative rounded-xl ${baseStyle} border-2 p-5 text-left font-medium transition-all duration-300 disabled:cursor-not-allowed`}
                    >
                      <span className="block text-lg leading-snug">{option.text}</span>
                      
                      {isSelected && (
                         <div className={`mt-4 text-sm font-semibold p-3 rounded-lg bg-black/50 ${option.isCorrect ? 'text-emerald-400 border border-emerald-500/30' : 'text-rose-400 border border-rose-500/30'} animate-fade-in`}>
                           <span className="uppercase text-[10px] tracking-widest opacity-60 block mb-1">
                             {option.isCorrect ? 'Professional Choice' : 'Amateur Mistake'}
                           </span>
                           {option.outcome}
                         </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default BadgeProfessionalTrader;
