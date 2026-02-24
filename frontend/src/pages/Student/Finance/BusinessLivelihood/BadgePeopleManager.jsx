import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const STAGES = [
  {
    id: 1,
    prompt: "You run a growing workshop. How should you handle monthly payments to your staff?",
    options: [
      { id: "opt1", text: "Hand out cash whenever they say they need it, no tracking required", outcome: "Creates confusion about who is owed what.", isCorrect: false },
      { id: "opt2", text: "Maintain a formal digital or signed physical salary register to track all payments", outcome: "Correct! Formal payroll protects both you and the worker.", isCorrect: true },
      { id: "opt3", text: "Pay them in unsold goods to save cash", outcome: "Workers need cash for their own livelihoods.", isCorrect: false },
      { id: "opt4", text: "Delay payment indefinitely until the business makes more profit", outcome: "Unethical and illegal. Wages must be prioritized.", isCorrect: false },
    ],
  },
  {
    id: 2,
    prompt: "A worker asks for an advance on their salary for a medical emergency. A 'People Manager' handles this by:",
    options: [
      { id: "opt1", text: "Documenting the advance loan formally and agreeing on a fair deduction schedule", outcome: "Correct! Compassion mixed with professional tracking.", isCorrect: true },
      { id: "opt2", text: "Refusing it completely to avoid the hassle of math", outcome: "A quick way to lose loyal employees.", isCorrect: false },
      { id: "opt3", text: "Giving them cash from the till but forgetting to write it down", outcome: "You just lost business money with no record.", isCorrect: false },
      { id: "opt4", text: "Firing them because emergencies disrupt work", outcome: "Extremely unprofessional and poor leadership.", isCorrect: false },
    ],
  },
  {
    id: 3,
    prompt: "Why is issuing a formal payslip important for your employees?",
    options: [
      { id: "opt1", text: "It's just a waste of paper", outcome: "It's a critical legal document.", isCorrect: false },
     
      { id: "opt3", text: "It proves to competitors that you pay the best", outcome: "Not the primary reason.", isCorrect: false },
      { id: "opt4", text: "It gives them a reason to ask for a raise", outcome: "Fair pay is right, regardless of a payslip.", isCorrect: false },
       { id: "opt2", text: "It allows them to prove their income to rent a house or get a small loan", outcome: "Correct! Your formalization empowers their financial independence.", isCorrect: true },
    ],
  },
  {
    id: 4,
    prompt: "A dispute arises: an employee claims they weren't paid for last month. How do you resolve it?",
    options: [
      { id: "opt1", text: "Yell at them until they back down", outcome: "Toxic workplace behavior.", isCorrect: false },
      { id: "opt2", text: "Check your formal payment records (bank transfer receipts or signed cash registers)", outcome: "Correct! Records turn an emotional argument into a factual check.", isCorrect: true },
      { id: "opt3", text: "Just pay them again to keep the peace", outcome: "Doubles your expenses unnecessarily.", isCorrect: false },
      { id: "opt4", text: "Call the police immediately", outcome: "An extreme overreaction to a payroll dispute.", isCorrect: false },
    ],
  },
  {
    id: 5,
    prompt: "Ultimate Management: Treating your staff formally and fairly results in:",
    options: [
      { id: "opt1", text: "Lower productivity because rules make people lazy", outcome: "Fairness usually increases productivity.", isCorrect: false },
      { id: "opt2", text: "High turnover because employees hate signing receipts", outcome: "Employees appreciate clear, reliable payment.", isCorrect: false },
      { id: "opt3", text: "Higher trust, lower turnover, and a strong reputation as an employer of choice", outcome: "Correct! Good management builds a loyal, capable team.", isCorrect: true },
      { id: "opt4", text: "Immediate bankruptcy due to high wages", outcome: "Fair wages are an investment, not an instant bankruptcy.", isCorrect: false },
    ],
  },
];

const BadgePeopleManager = () => {
  const location = useLocation();
  const totalStages = STAGES.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const { showAnswerConfetti, showCorrectAnswerFeedback, flashPoints } = useGameFeedback();
  const gameId = "finance-business-livelihood-finance-70";
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
      title="Badge: People Manager"
      subtitle={
        showResult
          ? "Achievement unlocked! You're an expert People Manager."
          : `HR Scenario ${currentStageIndex + 1} of ${totalStages}`
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
            <div className="bg-indigo-950/90 backdrop-blur-2xl rounded-3xl p-6 md:p-8 border-2 border-indigo-500/30 shadow-[0_0_30px_rgba(99,102,241,0.2)] overflow-hidden relative">
              
              {/* Human Resources aesthetic background */}
              <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-tr from-indigo-900/10 to-violet-800/20 pointer-events-none"></div>
              
              {/* Networking nodes visual */}
              <svg className="absolute top-5 right-5 w-24 h-24 text-indigo-500/20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
              </svg>

              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-[0.15em] text-indigo-300 mb-6 border-b border-indigo-500/20 pb-4 relative z-10">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
                  HR Scenario #{progressLabel}
                </span>
                <span className="bg-indigo-500/10 px-3 py-1 rounded shadow-sm border border-indigo-500/30 text-indigo-200">
                  Leadership: {score}/{totalStages}
                </span>
              </div>
              
              <div className="bg-black/30 rounded-xl p-6 mb-8 border-l-4 border-indigo-400 relative z-10">
                <p className="text-indigo-50 text-xl font-medium leading-relaxed">
                  {stage.prompt}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
                {stage.options.map((option) => {
                  const isSelected = selectedChoice?.id === option.id;
                  
                  let baseStyle = "bg-slate-900 border-slate-700 hover:border-indigo-400 hover:bg-slate-800 text-slate-300";
                  
                  if (isSelected) {
                    baseStyle = option.isCorrect
                      ? "bg-emerald-950 border-emerald-500 text-emerald-100 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                      : "bg-rose-950 border-rose-500 text-rose-100 shadow-[0_0_15px_rgba(244,63,94,0.3)]";
                  } else if (selectedChoice && option.isCorrect && !isSelected) {
                    baseStyle = "bg-emerald-950/40 border-emerald-500/40 text-emerald-300 opacity-80 ring-1 ring-emerald-500/30";
                  } else if (selectedChoice) {
                    baseStyle = "bg-slate-900/50 border-slate-800 text-slate-500 opacity-40";
                  }

                  return (
                    <button
                      key={option.id}
                      onClick={() => handleChoice(option)}
                      disabled={Boolean(selectedChoice)}
                      className={`relative rounded-xl ${baseStyle} border-2 p-5 text-left transition-all duration-300 disabled:cursor-not-allowed`}
                    >
                      <span className="block font-medium text-lg leading-snug">{option.text}</span>
                      
                      {isSelected && (
                         <div className={`mt-4 text-sm font-semibold p-3 rounded-lg bg-black/50 border ${option.isCorrect ? 'text-emerald-400 border-emerald-500/30' : 'text-rose-400 border-rose-500/30'} animate-fade-in-up`}>
                           <span className="uppercase text-[10px] tracking-widest opacity-70 block mb-1">
                             {option.isCorrect ? 'Good Leadership' : 'Poor Management'}
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

export default BadgePeopleManager;
