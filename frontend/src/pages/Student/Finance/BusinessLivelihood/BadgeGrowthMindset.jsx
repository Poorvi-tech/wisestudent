import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const STAGES = [
  {
    id: 1,
    prompt: "What is the primary benefit of maintaining clear financial records as a business grows?",
    options: [
      { id: "opt1", text: "It allows the owner to memorize everything", outcome: "Growth makes memorization impossible.", isCorrect: false },
      { id: "opt2", text: "It provides solid proof of income to access bank loans for expansion", outcome: "Correct. Good records unlock formal growth capital.", isCorrect: true },
      { id: "opt3", text: "It reduces the need to hire more employees", outcome: "Records don't replace labor, they manage it.", isCorrect: false },
      { id: "opt4", text: "It completely eliminates taxes", outcome: "It organizes taxes, but doesn't eliminate them.", isCorrect: false },
    ],
  },
  {
    id: 2,
    prompt: "When transitioning from a cash-only model to accepting digital payments (UPI), what is the key mindset shift?",
    options: [
      { id: "opt1", text: "Fearing that banks will take all the profits", outcome: "A limiting belief that stunts growth.", isCorrect: false },
      { id: "opt2", text: "Accepting digital payments builds a verifiable transaction history and attracts more customers", outcome: "Correct. It's a stepping stone to a modern, scalable business.", isCorrect: true },
      { id: "opt3", text: "Assuming cash goes missing faster than digital money", outcome: "While true, the main benefit is the verifiable trail.", isCorrect: false },
      { id: "opt4", text: "Digital payments mean you don't need a cash drawer at all", outcome: "Most businesses still need a hybrid approach.", isCorrect: false },
    ],
  },
  {
    id: 3,
    prompt: "A supplier offers a massive discount if paid in unrecorded cash. A Growth Mindset owner would:",
    options: [
      { id: "opt1", text: "Always take the unrecorded cash deal to save money now", outcome: "Short-term savings, long-term risk and no proof of purchase.", isCorrect: false },
      { id: "opt2", text: "Ask for an invoice and pay formally to build inventory proof and business credit", outcome: "Correct. Formal supply chains build true business value.", isCorrect: true },
      { id: "opt3", text: "Take the goods but delay payment indefinitely", outcome: "Ruins business reputation.", isCorrect: false },
      { id: "opt4", text: "Pay cash but write it in a personal diary", outcome: "Personal diaries aren't formal business records.", isCorrect: false },
    ],
  },
  {
    id: 4,
    prompt: "Why is separating personal and business bank accounts a 'Growth' move rather than just 'Survival'?",
    options: [
      { id: "opt1", text: "Because banks give higher interest to business accounts", outcome: "Interest rates vary, this isn't the primary reason.", isCorrect: false },
      { id: "opt2", text: "Because it makes the wallet feel lighter", outcome: "Not a real business strategy.", isCorrect: false },
      { id: "opt3", text: "It provides a crystal clear picture of true business profitability to attract investors or loans", outcome: "Correct. Clarity breeds confidence for growth.", isCorrect: true },
      { id: "opt4", text: "It means the business owner pays themselves less", outcome: "It just organizes finances, doesn't dictate salary size.", isCorrect: false },
    ],
  },
  {
    id: 5,
    prompt: "Ultimate Mindset Check: A business that refuses to formalize its operations (staying informal indefinitely) is most likely to:",
    options: [
      { id: "opt1", text: "Hit a growth plateau and remain vulnerable to shocks", outcome: "Correct! Informality is a ceiling on your potential.", isCorrect: true },
      { id: "opt2", text: "Become a massive multinational corporation secretly", outcome: "MNCs require intense formalization.", isCorrect: false },
      { id: "opt3", text: "Never have to worry about cash flow issues", outcome: "Informal businesses often struggle the most with cash flow.", isCorrect: false },
      { id: "opt4", text: "Easily sell the business to a buyer for millions", outcome: "Buyers won't pay for a business with no records.", isCorrect: false },
    ],
  },
];

const BadgeGrowthMindset = () => {
  const location = useLocation();
  const totalStages = STAGES.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const { showAnswerConfetti, showCorrectAnswerFeedback, flashPoints } = useGameFeedback();
  const gameId = "finance-business-livelihood-finance-30";
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
      title="Badge: Growth Mindset"
      subtitle={
        showResult
          ? "Achievement unlocked! You possess a true Growth Mindset."
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
            <div className="bg-sky-900/80 backdrop-blur-xl rounded-3xl p-6 md:p-8 border border-sky-400/30 shadow-2xl shadow-black/50 overflow-hidden relative">
              
              {/* Growth arrow aesthetic background */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>

              <div className="flex items-center justify-between text-sm font-bold uppercase tracking-[0.2em] text-sky-400 mb-6 border-b border-sky-500/30 pb-4">
                <span>Phase {progressLabel}</span>
                <span className="bg-sky-500/20 px-3 py-1 rounded border border-sky-400/30">
                  Mindset Score: {score}/{totalStages}
                </span>
              </div>
              
              <div className="bg-black/20 rounded-2xl p-6 mb-8 border border-sky-500/20 shadow-inner">
                <p className="text-white text-xl md:text-2xl font-semibold leading-relaxed">
                  {stage.prompt}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {stage.options.map((option) => {
                  const isSelected = selectedChoice?.id === option.id;
                  
                  let baseStyle = "bg-slate-800 border-slate-700 hover:border-sky-400 hover:bg-slate-700/80 text-slate-200";
                  
                  if (isSelected) {
                    baseStyle = option.isCorrect
                      ? "bg-emerald-900 border-emerald-500 text-emerald-100 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                      : "bg-rose-900 border-rose-500 text-rose-100 shadow-[0_0_15px_rgba(244,63,94,0.3)]";
                  } else if (selectedChoice && option.isCorrect && !isSelected) {
                    baseStyle = "bg-emerald-900/40 border-emerald-500/50 text-emerald-300 opacity-80 ring-1 ring-emerald-500/40";
                  } else if (selectedChoice) {
                    baseStyle = "bg-slate-900/50 border-slate-800 text-slate-600 opacity-50";
                  }

                  return (
                    <button
                      key={option.id}
                      onClick={() => handleChoice(option)}
                      disabled={Boolean(selectedChoice)}
                      className={`relative rounded-xl ${baseStyle} border-2 p-5 text-left font-medium transition-all duration-300 disabled:cursor-not-allowed`}
                    >
                      <span className="block text-lg">{option.text}</span>
                      
                      {isSelected && (
                         <div className={`mt-4 text-sm font-semibold p-3 rounded bg-black/40 ${option.isCorrect ? 'text-emerald-400' : 'text-rose-400'} animate-fade-in`}>
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

export default BadgeGrowthMindset;
