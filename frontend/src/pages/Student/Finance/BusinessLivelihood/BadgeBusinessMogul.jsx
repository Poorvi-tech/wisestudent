import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const STAGES = [
  {
    id: 1,
    prompt: "You own three successful shops. How do you ensure total financial control across all of them?",
    options: [
      { id: "opt1", text: "Visit each shop daily and guess the profits based on how full the cash drawer looks", outcome: "Guesswork doesn't scale. You will lose money.", isCorrect: false },
      { id: "opt2", text: "Implement a centralized, formal digital accounting system that tracks every transaction across all locations in real-time", outcome: "Correct! Real-time data is the lifeblood of a mogul.", isCorrect: true },
      { id: "opt3", text: "Let the managers do whatever they want as long as they pay you a fixed amount", outcome: "You lose control of your brand and true profits.", isCorrect: false },
      { id: "opt4", text: "Keep all the money from all three shops mixed in one giant sack", outcome: "Impossible to track individual store performance.", isCorrect: false },
    ],
  },
  {
    id: 2,
    prompt: "A national bank offers you a massive corporatization loan. What must you provide to secure it?",
    options: [
      { id: "opt1", text: "A promise that you are a very hard worker", outcome: "Banks don't lend millions on promises.", isCorrect: false },
      { id: "opt3", text: "A handwritten note from your mother", outcome: "Not quite standard banking procedure.", isCorrect: false },
      { id: "opt4", text: "Collateral equal to 500% of the loan amount", outcome: "Good records reduce the need for excessive collateral.", isCorrect: false },
      { id: "opt2", text: "Years of flawless, audited financial statements, tax compliance records, and a data-backed business plan", outcome: "Correct! At the mogul level, audited data is your currency.", isCorrect: true },
    ],
  },
  {
    id: 3,
    prompt: "You want to offer employee benefits (health insurance, provident fund) to retain top talent. This requires:",
    options: [
      { id: "opt1", text: "A fully formal, legally compliant payroll system integrated with government portals", outcome: "Correct! Formal benefits require formal infrastructure.", isCorrect: true },
      { id: "opt2", text: "Just giving them extra cash secretly", outcome: "Cash isn't insurance, and secrecy isn't compliance.", isCorrect: false },
      { id: "opt3", text: "Only hiring family members", outcome: "Limits your talent pool severely.", isCorrect: false },
      { id: "opt4", text: "Telling them they don't need benefits if they work hard enough", outcome: "Top talent will leave for competitors who offer stability.", isCorrect: false },
    ],
  },
  {
    id: 4,
    prompt: "A foreign investor wants to buy a 20% stake in your company. What determines the valuation of your business?",
    options: [
      { id: "opt1", text: "How nicely your shops are painted", outcome: "Aesthetics matter, but they don't define enterprise value.", isCorrect: false },
      { id: "opt3", text: "How much cash you have hidden off the books", outcome: "Off-the-books cash has zero value to formal investors.", isCorrect: false },
      { id: "opt2", text: "The documented history of exponential revenue growth, clean ledgers, and formal asset ownership", outcome: "Correct! Investors buy verifiable future cash flows based on past clean data.", isCorrect: true },
      { id: "opt4", text: "The cost of the physical products currently sitting on the shelves", outcome: "That's just inventory value, not enterprise value.", isCorrect: false },
    ],
  },
  {
    id: 5,
    prompt: "The Grand Finale: A true Business Mogul understands that:",
    options: [
      { id: "opt1", text: "Financial literacy, strict compliance, and strategic foresight are the ultimate tools to transform a livelihood into an empire", outcome: "Correct! You have mastered the journey from vendor to Mogul.", isCorrect: true },
      { id: "opt2", text: "The goal is to eventually go back to being an informal street vendor", outcome: "Growth moves forward, not backward.", isCorrect: false },
      { id: "opt3", text: "Once you are rich, you no longer need to look at financial records", outcome: "The bigger the empire, the more critical the records become.", isCorrect: false },
      { id: "opt4", text: "Success is purely based on luck and avoiding the tax authorities", outcome: "Luck runs out; systems endure.", isCorrect: false },
    ],
  },
];

const BadgeBusinessMogul = () => {
  const location = useLocation();
  const totalStages = STAGES.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const { showAnswerConfetti, showCorrectAnswerFeedback, flashPoints } = useGameFeedback();
  const gameId = "finance-business-livelihood-finance-100";
  const gameData = getGameDataById(gameId);
  const totalCoins = gameData?.coins ?? location.state?.totalCoins ?? 25; // High reward for the final badge
  const coinsPerLevel = Math.max(5, Math.floor(totalCoins / totalStages));
  const totalXp = gameData?.xp ?? location.state?.totalXp ?? 50; 
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
    }, 3800); // Give plenty of time to read the final majestic outcomes
  };

  const progressLabel = `${currentStageIndex + 1}/${totalStages}`;

  return (
    <GameShell
      title="Badge: Business Mogul"
      subtitle={
        showResult
          ? "The Summit Reached! You are a master Business Mogul."
          : `Executive Decision ${currentStageIndex + 1} of ${totalStages}`
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
      <div className="space-y-8 max-w-5xl mx-auto">
        {!showResult && stage && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-slate-950/95 backdrop-blur-3xl rounded-3xl p-6 md:p-10 border-2 border-yellow-500/40 shadow-[0_0_60px_rgba(234,179,8,0.25)] overflow-hidden relative">
              
              {/* Ultra-premium "Mogul" aesthetic background */}
              <div className="absolute inset-0 bg-gradient-to-b from-yellow-500/10 via-amber-900/5 to-black pointer-events-none"></div>
              
              {/* Starlight/Sparkle effects */}
              <div className="absolute top-10 left-10 w-1 h-1 bg-yellow-300 rounded-full shadow-[0_0_10px_2px_rgba(253,224,71,0.8)] animate-pulse"></div>
              <div className="absolute bottom-20 right-20 w-1.5 h-1.5 bg-yellow-100 rounded-full shadow-[0_0_15px_3px_rgba(253,224,71,0.6)] animate-pulse delay-300"></div>
              <div className="absolute top-1/2 right-10 w-1 h-1 bg-yellow-400 rounded-full shadow-[0_0_10px_2px_rgba(253,224,71,0.8)] animate-pulse delay-700"></div>

              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-[0.3em] text-yellow-500 mb-8 border-b border-yellow-500/30 pb-4 relative z-10">
                <span className="flex items-center gap-3">
                  <span className="text-xl">👑</span>
                  Executive Decision #{progressLabel}
                </span>
                <span className="bg-yellow-900/30 px-5 py-2 border border-yellow-500/50 text-yellow-300 uppercase tracking-widest text-[11px] rounded shadow-sm">
                  Empire Status: {score}/{totalStages}
                </span>
              </div>
              
              <div className="bg-gradient-to-r from-black/60 to-black/30 rounded-2xl p-8 mb-10 border-l-4 border-yellow-500 shadow-inner relative z-10">
                <p className="text-yellow-50 text-2xl md:text-3xl font-serif leading-relaxed tracking-wide">
                  {stage.prompt}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 relative z-10">
                {stage.options.map((option) => {
                  const isSelected = selectedChoice?.id === option.id;
                  
                  let baseStyle = "bg-slate-900 border-slate-700 hover:border-yellow-400 hover:bg-slate-800 text-slate-300";
                  
                  if (isSelected) {
                    baseStyle = option.isCorrect
                      ? "bg-yellow-900/80 border-yellow-400 text-yellow-50 shadow-[0_0_30px_rgba(234,179,8,0.5)] scale-[1.03]"
                      : "bg-red-950 border-red-500 text-red-100 shadow-[0_0_30px_rgba(239,68,68,0.5)] scale-[1.03]";
                  } else if (selectedChoice && option.isCorrect && !isSelected) {
                    baseStyle = "bg-yellow-900/20 border-yellow-500/50 text-yellow-200 opacity-90 ring-1 ring-yellow-500/50";
                  } else if (selectedChoice) {
                    baseStyle = "bg-slate-900/60 border-slate-800 text-slate-500 opacity-30";
                  }

                  return (
                    <button
                      key={option.id}
                      onClick={() => handleChoice(option)}
                      disabled={Boolean(selectedChoice)}
                      className={`relative rounded-2xl ${baseStyle} border-[3px] p-6 text-left transition-all duration-300 disabled:cursor-not-allowed`}
                    >
                      <span className="block font-medium text-[1.15rem] leading-relaxed">{option.text}</span>
                      
                      {isSelected && (
                         <div className={`mt-6 text-sm font-semibold p-4 rounded-xl bg-black/80 border ${option.isCorrect ? 'text-yellow-400 border-yellow-500/40' : 'text-red-400 border-red-500/40'} animate-fade-in-up shadow-inner`}>
                           <span className="uppercase text-[9px] tracking-[0.3em] opacity-80 block mb-2">
                             {option.isCorrect ? 'Mogul Move' : 'Critical Error'}
                           </span>
                           <span className="text-base">{option.outcome}</span>
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

export default BadgeBusinessMogul;
