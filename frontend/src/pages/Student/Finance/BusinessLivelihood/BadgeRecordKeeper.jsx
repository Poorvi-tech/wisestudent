import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const STAGES = [
  {
    id: 1,
    prompt: "Why are oral promises dangerous in business?",
    options: [
      { id: "opt1", text: "They save time and paper", outcome: "Saves time now, causes disputes later.", isCorrect: false },
      { id: "opt2", text: "They build strong trust", outcome: "Trust is good, but memory fails.", isCorrect: false },
      { id: "opt3", text: "They leave no legal proof in a dispute", outcome: "Correct. Without records, it's just your word against theirs.", isCorrect: true },
      { id: "opt4", text: "They are legally binding everywhere", outcome: "Rarely enforceable without evidence.", isCorrect: false },
    ],
  },
  {
    id: 2,
    prompt: "What is the best way to handle stock purchases from a supplier?",
    options: [
      { id: "opt1", text: "Pay cash and walk away", outcome: "No proof of purchase or payment.", isCorrect: false },
      { id: "opt2", text: "Always get a formal invoice and receipt", outcome: "Correct. This tracks costs and proves ownership.", isCorrect: true },
      { id: "opt3", text: "Just write the total amount on a rough paper", outcome: "Lacks details needed for accounting.", isCorrect: false },
      { id: "opt4", text: "Trust the supplier's memory", outcome: "A recipe for overpaying.", isCorrect: false },
    ],
  },
  {
    id: 3,
    prompt: "How does tracking daily expenses help a business grow?",
    options: [
      { id: "opt1", text: "It prevents silent cash leaks", outcome: "Correct. Small unrecorded expenses destroy profits secretly.", isCorrect: true },
      { id: "opt2", text: "It only helps the tax department", outcome: "It primarily helps you understand your profit.", isCorrect: false },
      { id: "opt3", text: "It guarantees an immediate loan", outcome: "It helps, but isn't a guarantee alone.", isCorrect: false },
      { id: "opt4", text: "It slows down the daily sales", outcome: "A few minutes of tracking saves hours of confusion.", isCorrect: false },
    ],
  },
  {
    id: 4,
    prompt: "When a customer buys on credit, what must you record immediately?",
    options: [
      { id: "opt1", text: "Just their first name", outcome: "Not enough to collect the debt later.", isCorrect: false },
      { id: "opt2", text: "Date, Item, Exact Amount, and Signature/Proof", outcome: "Correct. A complete record ensures you get paid.", isCorrect: true },
      { id: "opt3", text: "Nothing, if they are a regular", outcome: "Even regulars forget or dispute amounts.", isCorrect: false },
      { id: "opt4", text: "Only amounts over ₹1000", outcome: "Small debts add up to massive losses.", isCorrect: false },
    ],
  },
  {
    id: 5,
    prompt: "Overall Mastery: What does a true 'Record Keeper' do?",
    options: [
      { id: "opt1", text: "Relies entirely on mental math and memory", outcome: "Memory fades, records stay.", isCorrect: false },
      { id: "opt3", text: "Only notes down large transactions", outcome: "Small leaks sink great ships.", isCorrect: false },
      { id: "opt2", text: "Documents every inflow and outflow to secure the business", outcome: "Correct! You have mastered the art of business records.", isCorrect: true },
      { id: "opt4", text: "Copies records from competitors", outcome: "Your business needs its own unique data.", isCorrect: false },
    ],
  },
];

const BadgeRecordKeeper = () => {
  const location = useLocation();
  const totalStages = STAGES.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const { showAnswerConfetti, showCorrectAnswerFeedback, flashPoints } = useGameFeedback();
  const gameId = "finance-business-livelihood-finance-20";
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
    }, 3200); // slightly longer delay to read the outcome
  };

  const progressLabel = `${currentStageIndex + 1}/${totalStages}`;

  return (
    <GameShell
      title="Badge: Record Keeper"
      subtitle={
        showResult
          ? "Achievement unlocked! You're a Master Record Keeper."
          : `Challenge ${currentStageIndex + 1} of ${totalStages}`
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
            <div className="bg-slate-900/80 backdrop-blur-xl rounded-3xl p-6 md:p-8 border border-amber-500/30 shadow-2xl shadow-black/50 relative overflow-hidden">
              
              {/* Ledger paper lines background effect */}
              <div className="absolute inset-0 opacity-10 pointer-events-none" 
                   style={{ backgroundImage: 'repeating-linear-gradient(transparent, transparent 31px, rgba(255,255,255,0.5) 31px, rgba(255,255,255,0.5) 32px)' }}>
              </div>
              <div className="absolute left-10 top-0 bottom-0 w-px bg-red-500/30 pointer-events-none"></div>

              <div className="flex items-center justify-between text-sm font-bold uppercase tracking-[0.2em] text-amber-500/80 mb-6 pl-12">
                <span>Challenge {progressLabel}</span>
                <span>
                  Accuracy: {score}/{totalStages}
                </span>
              </div>
              
              <div className="bg-white/5 rounded-xl p-6 mb-8 border-l-4 border-amber-500 pl-8 ml-4 relative z-10">
                <p className="text-white text-xl md:text-2xl font-serif leading-relaxed">
                  {stage.prompt}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-4 relative z-10">
                {stage.options.map((option) => {
                  const isSelected = selectedChoice?.id === option.id;
                  
                  let baseStyle = "from-slate-800 to-slate-900 border-slate-700 hover:border-amber-500/50 hover:from-slate-800 hover:to-amber-900/20 text-slate-300";
                  
                  if (isSelected) {
                    baseStyle = option.isCorrect
                      ? "from-emerald-900/80 to-emerald-800 border-emerald-500 text-emerald-100 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                      : "from-rose-900/80 to-rose-800 border-rose-500 text-rose-100 shadow-[0_0_15px_rgba(244,63,94,0.3)]";
                  } else if (selectedChoice && option.isCorrect && !isSelected) {
                    baseStyle = "from-emerald-900/30 to-slate-900 border-emerald-500/50 text-emerald-400/80 mt-1 mb-1 opacity-70";
                  } else if (selectedChoice) {
                    baseStyle = "from-slate-900 to-slate-900 border-slate-800 text-slate-600 opacity-40";
                  }

                  return (
                    <button
                      key={option.id}
                      onClick={() => handleChoice(option)}
                      disabled={Boolean(selectedChoice)}
                      className={`relative rounded-xl bg-gradient-to-br ${baseStyle} border-2 p-5 text-left font-semibold transition-all duration-300 disabled:cursor-not-allowed`}
                    >
                      <span className="block text-lg mb-2">{option.text}</span>
                      
                      {/* Show outcome text if this option is selected */}
                      {isSelected && (
                         <div className={`mt-3 text-sm p-3 rounded-lg border bg-black/30 ${option.isCorrect ? 'text-emerald-300 border-emerald-500/30' : 'text-rose-300 border-rose-500/30'} animate-fade-in`}>
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

export default BadgeRecordKeeper;
