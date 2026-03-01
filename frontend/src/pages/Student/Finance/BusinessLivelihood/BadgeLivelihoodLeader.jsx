import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const STAGES = [
  {
    id: 1,
    prompt: "You've successfully managed your shop for 5 years. A young entrepreneur asks for your secret. You say:",
    options: [
      { id: "opt1", text: "I kept everything in my head and worked 20 hours a day", outcome: "Burnout is not a sustainable secret.", isCorrect: false },
      { id: "opt3", text: "I never paid taxes and hid from inspectors", outcome: "A secret recipe for disaster, not success.", isCorrect: false },
      { id: "opt4", text: "I fired anyone who asked for a raise", outcome: "Terrible leadership.", isCorrect: false },
      { id: "opt2", text: "I separated my business money from my family money from day one", outcome: "Correct! The foundational rule of lasting livelihood.", isCorrect: true },
    ],
  },
  {
    id: 2,
    prompt: "Your community respects you. Another local business is failing due to poor tracking. A Livelihood Leader would:",
    options: [
      { id: "opt1", text: "Buy their dying business for pennies on the euro", outcome: "Predatory, not leadership.", isCorrect: false },
      { id: "opt3", text: "Steal their remaining customers", outcome: "Short-sighted and damages community trust.", isCorrect: false },
      { id: "opt2", text: "Mentor them on setting up a basic cash flow ledger or digital tracking system", outcome: "Correct! True leaders uplift their business community.", isCorrect: true },
      { id: "opt4", text: "Ignore them; it's a harsh world", outcome: "You lose out on a potential future strong partner.", isCorrect: false },
    ],
  },
  {
    id: 3,
    prompt: "A massive new corporate chain opens nearby. As a Livelihood Leader, your strategy is:",
    options: [
      { id: "opt1", text: "Panic and close down your formalized business", outcome: "Quitting isn't leadership.", isCorrect: false },
      { id: "opt2", text: "Leverage your proven formal records to secure a loan and upgrade your local, personalized services", outcome: "Correct! Use your formal foundation to compete on quality.", isCorrect: true },
      { id: "opt3", text: "Start selling illegal goods to make quick cash", outcome: "Completely ruins your livelihood.", isCorrect: false },
      { id: "opt4", text: "Try to burn down the corporate store", outcome: "Obviously illegal and disastrous.", isCorrect: false },
    ],
  },
  {
    id: 4,
    prompt: "You are planning for your retirement. How does your business help?",
    options: [
      { id: "opt2", text: "Because I tracked everything, the business has verifiable value and can be sold or formally handed over to the next generation", outcome: "Correct! A formal business is an asset, not just a job.", isCorrect: true },
      { id: "opt1", text: "I will just keep working until the day I drop", outcome: "Not a plan.", isCorrect: false },
      { id: "opt3", text: "I hope my children will just magically know how to run it without any written processes", outcome: "A very common mistake that destroys family wealth.", isCorrect: false },
      { id: "opt4", text: "I'll empty the till on my last day and vanish", outcome: "Irresponsible and destroys the business value.", isCorrect: false },
    ],
  },
  {
    id: 5,
    prompt: "Ultimate Legacy: What is the highest achievement of a business owner regarding financial literacy?",
    options: [
      { id: "opt1", text: "Accumulating the most cash hidden in a mattress", outcome: "Cash loses value to inflation and is unsafe.", isCorrect: false },
      { id: "opt3", text: "Never having to use a bank", outcome: "Banks are essential tools for true wealth building.", isCorrect: false },
      { id: "opt4", text: "Being feared by all employees", outcome: "Fear breeds turnover, not legacy.", isCorrect: false },
      { id: "opt2", text: "Building a legally sound, formally tracked, profitable enterprise that sustains multiple families and outlasts the founder", outcome: "Correct! This is the true mark of a Livelihood Leader.", isCorrect: true },
    ],
  },
];

const BadgeLivelihoodLeader = () => {
  const location = useLocation();
  const totalStages = STAGES.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const { showAnswerConfetti, showCorrectAnswerFeedback, flashPoints } = useGameFeedback();
  const gameId = "finance-business-livelihood-finance-90";
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
    }, 3500); 
  };

  const progressLabel = `${currentStageIndex + 1}/${totalStages}`;

  return (
    <GameShell
      title="Badge: Livelihood Leader"
      subtitle={
        showResult
          ? "Achievement unlocked! You are the ultimate Livelihood Leader."
          : `Leadership Scenario ${currentStageIndex + 1} of ${totalStages}`
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
            <div className="bg-amber-950/90 backdrop-blur-2xl rounded-3xl p-6 md:p-8 border-2 border-amber-500/30 shadow-[0_0_40px_rgba(245,158,11,0.2)] overflow-hidden relative">
              
              {/* Premium/Gold/Legacy aesthetic background */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.15),transparent_50%)] pointer-events-none"></div>
              
              {/* Laurel wreath stylized background accent */}
              <svg className="absolute -left-10 -bottom-10 w-64 h-64 text-amber-500/10" viewBox="0 0 24 24" fill="currentColor">
                 <path d="M12,2A10,10 0 0,1 22,12C22,13.14 21.8,14.23 21.43,15.26L19.5,13.33C19.82,12.92 20,12.48 20,12A8,8 0 0,0 12,4A8,8 0 0,0 4,12C4,12.48 4.18,12.92 4.5,13.33L2.57,15.26C2.2,14.23 2,13.14 2,12A10,10 0 0,1 12,2M12,22A10,10 0 0,1 2,12C2,10.86 2.2,9.77 2.57,8.74L4.5,10.67C4.18,11.08 4,11.52 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12C20,11.52 19.82,11.08 19.5,10.67L21.43,8.74C21.8,9.77 22,10.86 22,12A10,10 0 0,1 12,22Z" />
              </svg>

              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-[0.2em] text-amber-400 mb-6 border-b border-amber-500/30 pb-4 relative z-10">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rotate-45 bg-amber-400"></span>
                  Scenario #{progressLabel}
                </span>
                <span className="bg-amber-900/50 px-4 py-1 border border-amber-500/50 text-amber-200 uppercase tracking-widest text-[10px] rounded shadow-sm">
                  Legacy Score: {score}/{totalStages}
                </span>
              </div>
              
              <div className="bg-black/40 rounded-xl p-6 mb-8 border border-amber-500/20 shadow-inner relative z-10">
                <p className="text-amber-50 text-xl md:text-2xl font-serif leading-relaxed tracking-wide">
                  {stage.prompt}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
                {stage.options.map((option) => {
                  const isSelected = selectedChoice?.id === option.id;
                  
                  let baseStyle = "bg-slate-900 border-slate-700 hover:border-amber-400 hover:bg-slate-800 text-slate-300";
                  
                  if (isSelected) {
                    baseStyle = option.isCorrect
                      ? "bg-amber-900/80 border-amber-400 text-amber-50 shadow-[0_0_20px_rgba(245,158,11,0.4)] scale-[1.02]"
                      : "bg-red-950 border-red-500 text-red-100 shadow-[0_0_20px_rgba(239,68,68,0.4)] scale-[1.02]";
                  } else if (selectedChoice && option.isCorrect && !isSelected) {
                    baseStyle = "bg-amber-900/30 border-amber-500/50 text-amber-200 opacity-90 ring-1 ring-amber-500/50";
                  } else if (selectedChoice) {
                    baseStyle = "bg-slate-900/60 border-slate-800 text-slate-500 opacity-40";
                  }

                  return (
                    <button
                      key={option.id}
                      onClick={() => handleChoice(option)}
                      disabled={Boolean(selectedChoice)}
                      className={`relative rounded-xl ${baseStyle} border-2 p-5 text-left transition-all duration-300 disabled:cursor-not-allowed`}
                    >
                      <span className="block font-medium text-[1.1rem] leading-snug">{option.text}</span>
                      
                      {isSelected && (
                         <div className={`mt-5 text-sm font-semibold p-4 rounded-lg bg-black/60 border ${option.isCorrect ? 'text-amber-300 border-amber-500/40' : 'text-red-300 border-red-500/40'} animate-fade-in-up shadow-inner`}>
                           <span className="uppercase text-[9px] tracking-[0.2em] opacity-80 block mb-1">
                             {option.isCorrect ? 'True Leadership' : 'Leadership Failure'}
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

export default BadgeLivelihoodLeader;
