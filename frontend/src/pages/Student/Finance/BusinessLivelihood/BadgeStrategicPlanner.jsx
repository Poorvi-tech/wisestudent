import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const STAGES = [
  {
    id: 1,
    prompt: "You notice your sales drop significantly every monsoon season. What does a Strategic Planner do?",
    options: [
      { id: "opt2", text: "Analyze past records to predict the drop, and save surplus cash during busy seasons to cover the gap", outcome: "Correct! Anticipating cycles is key to survival.", isCorrect: true },
      { id: "opt1", text: "Complain about the weather and close the shop", outcome: "Complaining doesn't pay the bills.", isCorrect: false },
      { id: "opt3", text: "Take an expensive short-term loan just before the monsoon", outcome: "Interest will eat up your small profits.", isCorrect: false },
      { id: "opt4", text: "Fire all employees temporarily every year", outcome: "You'll lose good workers forever.", isCorrect: false },
    ],
  },
  {
    id: 2,
    prompt: "You want to buy a new machine that doubles production. How do you decide if it's worth it?",
    options: [
      { id: "opt1", text: "Buy it immediately if the salesman is convincing", outcome: "Salesmen sell; you must plan.", isCorrect: false },
      { id: "opt2", text: "Calculate the Return on Investment (ROI) by comparing the machine's cost to the projected increase in formal sales", outcome: "Correct! Decisions must be based on data and math.", isCorrect: true },
      { id: "opt3", text: "Wait 10 years until you can buy it with cash only", outcome: "You might lose market share while waiting.", isCorrect: false },
      { id: "opt4", text: "Borrow money from your children's education fund", outcome: "Mixing personal and business funds is risky.", isCorrect: false },
    ],
  },
  {
    id: 3,
    prompt: "A competitor opens across the street, lowering prices by 10%. Your strategic response is:",
    options: [
      { id: "opt2", text: "Lower your prices by 20% immediately to destroy them", outcome: "A price war usually bankrupts both sides.", isCorrect: false },
      { id: "opt3", text: "Start selling fake/cheaper products to maintain margin", outcome: "Ruins your reputation and brings legal trouble.", isCorrect: false },
      { id: "opt1", text: "Review your profit margins via your ledger to see if you can match prices without taking a loss", outcome: "Correct! Only lower prices if the math supports it.", isCorrect: true },
      { id: "opt4", text: "Ignore them entirely", outcome: "You might lose customers if you don't adjust your strategy.", isCorrect: false },
    ],
  },
  {
    id: 4,
    prompt: "Why should a business maintain an emergency cash reserve buffer?",
    options: [
      { id: "opt1", text: "So the owner can go on luxury vacations", outcome: "That's personal money, not a business buffer.", isCorrect: false },
      { id: "opt3", text: "Because banks legally require you to keep cash idle", outcome: "Banks don't require this, common sense does.", isCorrect: false },
      { id: "opt4", text: "To avoid depositing money into a bank", outcome: "Reserves can (and should) be in a bank.", isCorrect: false },
      { id: "opt2", text: "To protect the business against sudden supply chain shocks or unexpected equipment failures", outcome: "Correct! A buffer keeps the business alive during shocks.", isCorrect: true },
    ],
  },
  {
    id: 5,
    prompt: "Ultimate Strategy: What is the main difference between a 'hustler' and a 'Strategic Planner'?",
    options: [
      { id: "opt1", text: "A hustler makes money today; a planner builds a system that generates sustainable wealth over decades", outcome: "Correct! Strategy is about long-term, scalable, verifiable growth.", isCorrect: true },
      { id: "opt2", text: "Planners write a lot but rarely make money", outcome: "Good planning directly increases profits.", isCorrect: false },
      { id: "opt3", text: "Hustlers don't need to pay taxes", outcome: "Everyone has a legal obligation to pay taxes.", isCorrect: false },
      { id: "opt4", text: "Planners only work in giant corporations", outcome: "Even a small street vendor can and should plan strategically.", isCorrect: false },
    ],
  },
];

const BadgeStrategicPlanner = () => {
  const location = useLocation();
  const totalStages = STAGES.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const { showAnswerConfetti, showCorrectAnswerFeedback, flashPoints } = useGameFeedback();
  const gameId = "finance-business-livelihood-finance-80";
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
      title="Badge: Strategic Planner"
      subtitle={
        showResult
          ? "Achievement unlocked! You are a master Strategic Planner."
          : `Horizon ${currentStageIndex + 1} of ${totalStages}`
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
            <div className="bg-slate-900/90 backdrop-blur-2xl rounded-3xl p-6 md:p-8 border border-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.15)] overflow-hidden relative">
              
              {/* Strategy/Blueprint aesthetic background */}
              <div className="absolute inset-0 pointer-events-none opacity-20"
                   style={{
                     backgroundImage: 'linear-gradient(rgba(6, 182, 212, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(6, 182, 212, 0.2) 1px, transparent 1px)',
                     backgroundSize: '20px 20px'
                   }}>
              </div>
              <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-cyan-900/10 to-transparent pointer-events-none"></div>

              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-[0.15em] text-cyan-400 mb-6 border-b border-cyan-500/30 pb-4 relative z-10">
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Forecast #{progressLabel}
                </span>
                <span className="bg-cyan-950 px-3 py-1 rounded shadow-sm border border-cyan-500/50 text-cyan-300">
                  Foresight: {score}/{totalStages}
                </span>
              </div>
              
              <div className="bg-slate-900/80 rounded-xl p-6 mb-8 border border-cyan-500/40 shadow-inner relative z-10">
                <p className="text-white text-xl font-serif leading-relaxed">
                  {stage.prompt}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
                {stage.options.map((option) => {
                  const isSelected = selectedChoice?.id === option.id;
                  
                  let baseStyle = "bg-slate-800 border-slate-700 hover:border-cyan-400 hover:bg-slate-700 text-slate-300";
                  
                  if (isSelected) {
                    baseStyle = option.isCorrect
                      ? "bg-cyan-950 border-cyan-400 text-cyan-50 shadow-[0_0_20px_rgba(34,211,238,0.3)] scale-[1.02]"
                      : "bg-rose-950 border-rose-500 text-rose-100 shadow-[0_0_20px_rgba(244,63,94,0.3)] scale-[1.02]";
                  } else if (selectedChoice && option.isCorrect && !isSelected) {
                    baseStyle = "bg-cyan-950/40 border-cyan-500/50 text-cyan-300 opacity-80 ring-1 ring-cyan-500/40";
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
                         <div className={`mt-4 text-sm font-medium p-3 rounded-lg bg-black/60 border ${option.isCorrect ? 'text-cyan-300 border-cyan-500/40' : 'text-rose-300 border-rose-500/40'} animate-fade-in-up`}>
                           <span className="uppercase text-[10px] tracking-widest opacity-70 block mb-1">
                             {option.isCorrect ? 'Strategic Insight' : 'Short-Sighted'}
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

export default BadgeStrategicPlanner;
