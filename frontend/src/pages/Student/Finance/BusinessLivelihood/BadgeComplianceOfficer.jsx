import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const STAGES = [
  {
    id: 1,
    prompt: "A customer wants a product without a GST bill to save money. What is the compliant response?",
    options: [
      { id: "opt1", text: "Agree, because saving the customer money is the priority", outcome: "Illegal. Evading tax puts your whole business at risk.", isCorrect: false },
      { id: "opt2", text: "Tell them you can only give a normal paper slip", outcome: "A normal slip without tax details is not a valid tax invoice.", isCorrect: false },
      { id: "opt3", text: "Explain that a formal GST bill is mandatory, ensures product warranty, and supports national growth", outcome: "Correct! Compliance protects everyone and is legally required.", isCorrect: true },
      { id: "opt4", text: "Charge them GST but don't record the sale", outcome: "That is tax fraud.", isCorrect: false },
    ],
  },
  {
    id: 2,
    prompt: "You want to supply goods to a large, formal corporate chain. What is the very first requirement they will check?",
    options: [
      { id: "opt1", text: "Your personal charisma", outcome: "Charm helps, but compliance signs the contract.", isCorrect: false },
      { id: "opt2", text: "Your formal business registration and tax compliance certificates (like GSTIN)", outcome: "Correct! Big clients legally require their vendors to be fully compliant.", isCorrect: true },
      { id: "opt3", text: "How cheaply you can provide goods off the books", outcome: "Corporates cannot buy 'off the books'.", isCorrect: false },
      { id: "opt4", text: "Your social media follower count", outcome: "Irrelevant for basic vendor compliance.", isCorrect: false },
    ],
  },
  {
    id: 3,
    prompt: "A surprise inspection occurs at your warehouse. A 'Compliance Officer' mindset ensures:",
    options: [
      { id: "opt1", text: "All inventory is accurately recorded in a digital or physical register that matches the physical stock", outcome: "Correct! Accurate records mean stress-free inspections.", isCorrect: true },
      { id: "opt2", text: "Hiding the most expensive stock quickly", outcome: "This guarantees heavy fines.", isCorrect: false },
      { id: "opt3", text: "Refusing to answer any questions", outcome: "Non-cooperation leads to legal trouble.", isCorrect: false },
      { id: "opt4", text: "Offering the inspector free samples", outcome: "Bribery is illegal and makes things worse.", isCorrect: false },
    ],
  },
  {
    id: 4,
    prompt: "Why should you issue formal payment records (like payslips) to your workers?",
    options: [
      { id: "opt1", text: "Because it makes the workers feel important", outcome: "It does, but that's not the legal reason.", isCorrect: false },
      { id: "opt2", text: "It wastes ink and paper", outcome: "Paperwork is a cost of doing formal business.", isCorrect: false },
      { id: "opt3", text: "It provides legal proof of wages paid, protecting you from future labor disputes", outcome: "Correct! Compliance protects the employer as much as the employee.", isCorrect: true },
      { id: "opt4", text: "It allows you to pay them less", outcome: "Records don't reduce minimum wage requirements.", isCorrect: false },
    ],
  },
  {
    id: 5,
    prompt: "Ultimate Rule: What is the core definition of Business Compliance?",
    options: [
      { id: "opt1", text: "Following the laws, taxes, and regulations set by the government to operate legally and ethically", outcome: "Correct! Compliance is the foundation of a lasting business.", isCorrect: true },
      { id: "opt2", text: "Finding every possible loophole to avoid paying taxes", outcome: "Loophole chasing often ends in penalties.", isCorrect: false },
      { id: "opt3", text: "Only following the rules when an inspector is present", outcome: "Compliance must be consistent, not occasional.", isCorrect: false },
      { id: "opt4", text: "Ignoring rules that you disagree with", outcome: "The law applies whether you agree or not.", isCorrect: false },
    ],
  },
];

const BadgeComplianceOfficer = () => {
  const location = useLocation();
  const totalStages = STAGES.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const { showAnswerConfetti, showCorrectAnswerFeedback, flashPoints } = useGameFeedback();
  const gameId = "finance-business-livelihood-finance-60";
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
      title="Badge: Compliance Officer"
      subtitle={
        showResult
          ? "Achievement unlocked! You are officially a Compliance Officer."
          : `Audit ${currentStageIndex + 1} of ${totalStages}`
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
            <div className="bg-slate-900/95 backdrop-blur-2xl rounded-3xl p-6 md:p-8 border-2 border-slate-600 shadow-2xl overflow-hidden relative">
              
              {/* Official/Audit aesthetic background */}
              <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
                {/* Stamp graphic placeholder */}
                <svg viewBox="0 0 100 100" className="w-full h-full text-blue-500 fill-current" style={{ transform: 'rotate(-15deg)' }}>
                  <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="5" fill="none" strokeDasharray="5,5"/>
                  <circle cx="50" cy="50" r="35" stroke="currentColor" strokeWidth="2" fill="none"/>
                  <text x="50" y="55" textAnchor="middle" fontSize="16" fontWeight="bold" fontFamily="monospace">APPROVED</text>
                </svg>
              </div>

              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-[0.2em] text-blue-400 mb-6 border-b border-blue-500/20 pb-4 relative z-10">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded bg-blue-500"></span>
                  Official Audit #{progressLabel}
                </span>
                <span className="bg-blue-900/50 px-3 py-1 border border-blue-500/50 text-blue-300">
                  Compliance Score: {score}/{totalStages}
                </span>
              </div>
              
              <div className="bg-slate-800/80 rounded border-l-4 border-blue-500 p-6 mb-8 relative z-10">
                <p className="text-white text-lg md:text-xl font-mono leading-relaxed">
                  <span className="text-blue-400 opacity-50 block text-xs mb-2">CASE FILE #{currentStageIndex + 1}</span>
                  {stage.prompt}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
                {stage.options.map((option) => {
                  const isSelected = selectedChoice?.id === option.id;
                  
                  let baseStyle = "bg-slate-900 border-slate-700 hover:border-blue-400 hover:bg-slate-800 text-slate-300";
                  
                  if (isSelected) {
                    baseStyle = option.isCorrect
                      ? "bg-blue-950 border-blue-500 text-blue-100 shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                      : "bg-red-950 border-red-500 text-red-100 shadow-[0_0_15px_rgba(239,68,68,0.3)]";
                  } else if (selectedChoice && option.isCorrect && !isSelected) {
                    baseStyle = "bg-blue-950/40 border-blue-500/40 text-blue-300 opacity-80 ring-1 ring-blue-500/30";
                  } else if (selectedChoice) {
                    baseStyle = "bg-slate-900/50 border-slate-800 text-slate-500 opacity-40";
                  }

                  return (
                    <button
                      key={option.id}
                      onClick={() => handleChoice(option)}
                      disabled={Boolean(selectedChoice)}
                      className={`relative rounded ${baseStyle} border-2 p-5 text-left transition-all duration-300 disabled:cursor-not-allowed`}
                    >
                      <span className="block font-medium">{option.text}</span>
                      
                      {isSelected && (
                         <div className={`mt-4 text-sm font-mono p-3 rounded bg-black/60 border ${option.isCorrect ? 'text-blue-400 border-blue-500/30' : 'text-red-400 border-red-500/30'} animate-fade-in-up`}>
                           <span className="uppercase text-[10px] tracking-widest opacity-70 block mb-1">
                             {option.isCorrect ? 'FINDING: COMPLIANT' : 'FINDING: VIOLATION'}
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

export default BadgeComplianceOfficer;
