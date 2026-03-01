import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const STAGES = [
  {
    id: 1,
    prompt: "You are applying for a business loan to expand. What is the FIRST thing the bank will ask for?",
    options: [
      { id: "opt1", text: "A photo of your shop", outcome: "Looks don't prove you can repay the loan.", isCorrect: false },
      { id: "opt2", text: "Your verifiable financial records and digital transaction history", outcome: "Correct! Proof of consistent income is mandatory for formal loans.", isCorrect: true },
      { id: "opt3", text: "A verbal promise from a local politician", outcome: "Banks lend on data, not just local influence.", isCorrect: false },
      { id: "opt4", text: "Cash upfront equal to the loan amount", outcome: "That defeats the purpose of the loan!", isCorrect: false },
    ],
  },
  {
    id: 2,
    prompt: "An investor is reviewing your business health. What shows true stability?",
    options: [
      { id: "opt2", text: "A clean ledger showing separated business and personal finances, with steady profit margins", outcome: "Correct! Separation and tracking prove structural health.", isCorrect: true },
      { id: "opt1", text: "High daily sales, but no written track of expenses", outcome: "Sales without expense tracking means unknown true profit.", isCorrect: false },
      { id: "opt3", text: "A huge pile of cash hidden in the back room", outcome: "Unverifiable and risky.", isCorrect: false },
      { id: "opt4", text: "Owing money to multiple informal lenders", outcome: "A sign of financial instability.", isCorrect: false },
    ],
  },
  {
    id: 3,
    prompt: "Your business faces an unexpected sudden expense (e.g., equipment repair). A 'Finance Ready' business handles this by:",
    options: [
      { id: "opt2", text: "Borrowing at a very high interest rate from a street lender instantly", outcome: "A last resort that creates a debt trap.", isCorrect: false },
      { id: "opt3", text: "Selling off core inventory at a massive loss", outcome: "Hurts long-term business survival.", isCorrect: false },
      { id: "opt1", text: "Dipping into the 'Emergency Savings' or utilizing an established line of credit", outcome: "Correct. Preparation prevents panic.", isCorrect: true },
      { id: "opt4", text: "Ignoring the repair and halting operations indefinitely", outcome: "Costs you daily income until fixed.", isCorrect: false },
    ],
  },
  {
    id: 4,
    prompt: "A tax inspector visits your shop to verify your operations. How do you respond?",
    options: [
      { id: "opt1", text: "Panic, close the shop, and run away", outcome: "Creates suspicion and legal trouble.", isCorrect: false },
      { id: "opt2", text: "Confidently present your organized invoices, receipts, and formal registration documents", outcome: "Correct! Organization brings peace of mind and compliance.", isCorrect: true },
      { id: "opt3", text: "Show them a notebook with messy, crossed-out numbers", outcome: "Unprofessional and invites deeper scrutiny.", isCorrect: false },
      { id: "opt4", text: "Offer them free goods to leave", outcome: "Bribery is illegal and unsustainable.", isCorrect: false },
    ],
  },
  {
    id: 5,
    prompt: "Ultimate Readiness: What transforms a simple vendor into a 'Finance Ready' enterprise?",
    options: [
      { id: "opt1", text: "Avoiding all technology and keeping everything entirely informal", outcome: "This limits growth entirely.", isCorrect: false },
      { id: "opt3", text: "Selling completely on unrecorded credit to attract more customers", outcome: "A quick way to go bankrupt.", isCorrect: false },
      { id: "opt4", text: "Changing business names every year to avoid tracking", outcome: "Fraudulent and destroys customer trust.", isCorrect: false },
      { id: "opt2", text: "Consistent, verifiable financial discipline: digital trails, clear ledgers, formal proofs, and separate accounts", outcome: "Correct! This discipline is the key to unlocking major growth opportunities.", isCorrect: true },
    ],
  },
];

const BadgeFinanceReady = () => {
  const location = useLocation();
  const totalStages = STAGES.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const { showAnswerConfetti, showCorrectAnswerFeedback, flashPoints } = useGameFeedback();
  const gameId = "finance-business-livelihood-finance-50";
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
    }, 3500); // Slightly longer delay for reading the longer outcomes
  };

  const progressLabel = `${currentStageIndex + 1}/${totalStages}`;

  return (
    <GameShell
      title="Badge: Finance Ready"
      subtitle={
        showResult
          ? "Achievement unlocked! Your business is officially Finance Ready!"
          : `Assessment ${currentStageIndex + 1} of ${totalStages}`
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
          <div className="space-y-6 animate-fade-in">
            <div className="bg-slate-900/90 backdrop-blur-2xl rounded-3xl p-6 md:p-8 border border-emerald-500/30 shadow-[0_0_40px_rgba(16,185,129,0.15)] overflow-hidden relative">
              
              {/* Premium/Ready aesthetic background */}
              <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-emerald-500/5 to-teal-900/20 pointer-events-none"></div>
              
              {/* Animated scanning line effect */}
              <div className="absolute left-0 top-0 w-full h-[2px] bg-emerald-500/50 blur-sm animate-[scan_4s_ease-in-out_infinite]"></div>

              <div className="flex items-center justify-between text-sm font-bold uppercase tracking-[0.2em] text-emerald-400 mb-6 border-b border-emerald-500/30 pb-4 relative z-10">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  Assessment {progressLabel}
                </span>
                <span className="bg-emerald-500/10 px-3 py-1 rounded border border-emerald-500/30">
                  Readiness: {score}/{totalStages}
                </span>
              </div>
              
              <div className="bg-black/40 rounded-2xl p-6 mb-8 border border-emerald-500/20 shadow-inner relative z-10">
                <p className="text-white text-xl md:text-2xl font-serif leading-relaxed">
                  {stage.prompt}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
                {stage.options.map((option) => {
                  const isSelected = selectedChoice?.id === option.id;
                  
                  let baseStyle = "bg-slate-800 border-slate-700 hover:border-emerald-400 hover:bg-slate-700 text-slate-200";
                  
                  if (isSelected) {
                    baseStyle = option.isCorrect
                      ? "bg-emerald-900 border-emerald-400 text-emerald-50 shadow-[0_0_20px_rgba(52,211,153,0.4)] scale-[1.02]"
                      : "bg-rose-900 border-rose-500 text-rose-100 shadow-[0_0_20px_rgba(244,63,94,0.4)] scale-[1.02]";
                  } else if (selectedChoice && option.isCorrect && !isSelected) {
                    baseStyle = "bg-emerald-900/30 border-emerald-500/50 text-emerald-300 opacity-90 ring-1 ring-emerald-500/50";
                  } else if (selectedChoice) {
                    baseStyle = "bg-slate-900/60 border-slate-800 text-slate-500 opacity-50";
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
                         <div className={`mt-4 text-sm font-semibold p-3 rounded-lg bg-black/50 border ${option.isCorrect ? 'text-emerald-300 border-emerald-500/40' : 'text-rose-300 border-rose-500/40'} animate-fade-in-up`}>
                           <span className="uppercase text-[10px] tracking-widest opacity-70 block mb-1">
                             {option.isCorrect ? 'Status: Approved' : 'Status: Denied'}
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

export default BadgeFinanceReady;
