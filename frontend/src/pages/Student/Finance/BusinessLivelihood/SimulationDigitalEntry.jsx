import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const SIMULATION_STAGES = [
  {
    id: 1,
    prompt: "You just bought milk and sugar to make tea for your shop. It cost ₹50. Where does this go in your digital ledger?",
    options: [
       {
        id: "expense",
        text: "Enter ₹50 under 'Business Expenses / Cost of Goods'.",
        outcome: "Correct! Logging every penny spent ensures accurate profit tracking.",
        isCorrect: true,
      },
      {
        id: "ignore",
        text: "Nowhere, ₹50 is too small to record.",
        outcome: "Incorrect. Small unrecorded expenses add up and drain your daily profits without you noticing.",
        isCorrect: false,
      },
     
      {
        id: "income",
        text: "Enter ₹50 under 'Income' because you brought items into the shop.",
        outcome: "Incorrect. Money leaving your business is an expense, regardless of the physical goods you receive.",
        isCorrect: false,
      },
      {
        id: "personal",
        text: "Enter it in your personal diary at home.",
        outcome: "Incorrect. Business data must stay in your dedicated business application.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 2,
    prompt: "A customer buys ₹500 worth of samosas and pays via UPI. How do you log this in the app?",
    options: [
      {
        id: "wait-end-day",
        text: "Wait until the end of the day and try to remember all sales.",
        outcome: "Incorrect. Memory fades; you will likely misreport your income.",
        isCorrect: false,
      },
      {
        id: "digital-income",
        text: "Create a ₹500 'Income' entry and mark the payment method as 'Digital/UPI'.",
        outcome: "Correct! Tagging the payment method perfectly syncs your digital ledger with your bank statement.",
        isCorrect: true,
      },
      {
        id: "only-cash",
        text: "Only enter cash sales; UPI is already in the bank so why log it?",
        outcome: "Incorrect. Your ledger must show total business revenue, not just cash handling.",
        isCorrect: false,
      },
      {
        id: "expense-fake",
        text: "Log it as an expense to lower your daily tax bracket.",
        outcome: "Incorrect. This is fraudulent accounting and highly illegal.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 3,
    prompt: "Your supplier delivers a new gas cylinder but says 'Pay me ₹1,500 next week'. What is the correct entry?",
    options: [
      {
        id: "do-nothing",
        text: "Do nothing until you actually pay him next week.",
        outcome: "Incorrect. You might forget, and you won't know your true outstanding debt.",
        isCorrect: false,
      },
      {
        id: "pay-now",
        text: "Log ₹1,500 as an 'Expense' immediately, reducing your digital cash balance.",
        outcome: "Incorrect. Your digital cash balance will mismatch your actual pocket money.",
        isCorrect: false,
      },
      {
        id: "payable",
        text: "Create a 'Purchase on Credit / Account Payable' entry for ₹1,500 under the supplier's name.",
        outcome: "Correct! This records the expense while accurately tracking your liabilities (money you owe).",
        isCorrect: true,
      },
      {
        id: "income-cylinder",
        text: "Log ₹1,500 as 'Income' because you received a cylinder.",
        outcome: "Incorrect. Goods received on credit are not income; they are liabilities and expenses.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 4,
    prompt: "You notice the app says your physical cash box should have ₹2,000, but you only count ₹1,800. What happened?",
    options: [
      {
        id: "blame-app",
        text: "The app is broken and bad at math.",
        outcome: "Incorrect. Digital calculators do not make math errors; data entry does.",
        isCorrect: false,
      },
      {
        id: "missing-entry",
        text: "You probably forgot to log a ₹200 cash expense or an owner cash withdrawal.",
        outcome: "Correct! A mismatch usually means an unrecorded cash outflow. Time to review the day's actions!",
        isCorrect: true,
      },
      {
        id: "ignore-it",
        text: "Ignore it. ₹200 isn't a big deal.",
        outcome: "Incorrect. A daily ₹200 leak equals ₹6,000 lost per month.",
        isCorrect: false,
      },
      {
        id: "fake-income",
        text: "Add a fake ₹200 expense so the numbers match.",
        outcome: "Incorrect. Fudging the numbers defeats the entire purpose of honest tracking.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 5,
    prompt: "It’s the end of the month. You click 'Generate Profit Report' in the app. Why is this report so powerful?",
    options: [
      {
        id: "looks-pretty",
        text: "It generates colorful pie charts you can show your family.",
        outcome: "Incorrect. Visuals are nice, but not the primary business value.",
        isCorrect: false,
      },
      
      {
        id: "auto-taxes",
        text: "It automatically pays your taxes for you.",
        outcome: "Incorrect. You still have to file and pay, though the report makes it much easier.",
        isCorrect: false,
      },
      {
        id: "magic-money",
        text: "Clicking the button deposits extra money into your account.",
        outcome: "Incorrect. Reports organize data; they don't generate free cash.",
        isCorrect: false,
      },
      {
        id: "proves-worth",
        text: "It provides instantaneous, mathematically perfect proof of your business health for banks or investors.",
        outcome: "Correct! You immediately know your margins and have professional documentation ready for growth.",
        isCorrect: true,
      },
    ],
  },
];

const SimulationDigitalEntry = () => {
  const location = useLocation();
  // Registering at index 82 (game-82 in mapping logic according to surrounding entries)
  const gameId = "finance-business-livelihood-finance-82"; 
  const gameData = getGameDataById(gameId);
  const totalStages = SIMULATION_STAGES.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const totalCoins = gameData?.coins ?? location.state?.totalCoins ?? 5;
  const coinsPerLevel = Math.max(1, Math.floor(totalCoins / totalStages));
  const totalXp = gameData?.xp ?? location.state?.totalXp ?? 10;
  const stage = SIMULATION_STAGES[currentStageIndex];

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
      }, 1200);
    }
  };

  const handleNextStage = () => {
    if (!selectedChoice) return;
    if (currentStageIndex === totalStages - 1) {
      setShowResult(true);
    } else {
      setCurrentStageIndex((prev) => prev + 1);
    }
    setSelectedChoice(null);
  };

  const progressLabel = `${currentStageIndex + 1}/${totalStages}`;

  return (
    <GameShell
      title="Simulation: Digital Entry"
      subtitle={
        showResult
          ? "Simulation complete! You successfully managed a digital bookkeeping app."
          : `Device Ledger Step ${currentStageIndex + 1} of ${totalStages}`
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
            <div className="bg-slate-900/90 backdrop-blur-xl rounded-3xl p-6 border-2 border-cyan-500/30 shadow-2xl relative overflow-hidden">
               
              <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
              
              <div className="flex items-center justify-between text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400 mb-6 relative z-10 border-b border-cyan-500/20 pb-4">
                <span>App Prompt {progressLabel}</span>
                <span className="bg-cyan-950/80 px-4 py-1.5 rounded shadow-sm border border-cyan-500/30">
                  Score: {score}/{totalStages}
                </span>
              </div>

              <div className="bg-gradient-to-br from-cyan-950/80 to-slate-900/80 p-6 rounded-2xl border-l-4 border-cyan-500 mb-8 shadow-inner relative z-10">
                 <p className="text-white text-xl md:text-2xl font-serif leading-relaxed italic">
                   {stage.prompt}
                 </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 relative z-10">
                {stage.options.map((option) => {
                  const isSelected = selectedChoice?.id === option.id;
                  let baseStyle = "from-slate-800 to-cyan-950/40 border-cyan-500/30 hover:border-cyan-400 hover:from-slate-700 hover:to-cyan-900/60 text-slate-200";
                  
                  if (isSelected) {
                    baseStyle = option.isCorrect
                      ? "from-emerald-900 to-emerald-800 border-emerald-400 ring-4 ring-emerald-500/30 scale-[1.03] text-emerald-50 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                      : "from-rose-900 to-rose-800 border-rose-400 ring-4 ring-rose-500/30 scale-[1.03] text-rose-50 shadow-[0_0_20px_rgba(244,63,94,0.3)]";
                  } else if (selectedChoice && option.isCorrect && !isSelected) {
                    baseStyle = "from-emerald-950 to-emerald-900 border-emerald-500/50 text-emerald-200/70";
                  } else if (selectedChoice && !isSelected) {
                    baseStyle = "from-slate-900 to-slate-900 border-slate-700 opacity-40 text-slate-500";
                  }

                  return (
                    <button
                      key={option.id}
                      onClick={() => handleChoice(option)}
                      disabled={Boolean(selectedChoice)}
                      className={`relative rounded-2xl bg-gradient-to-r ${baseStyle} border-2 p-5 text-left font-medium transition-all min-h-[110px] flex items-center disabled:cursor-not-allowed text-lg`}
                    >
                      {option.text}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {selectedChoice && (
          <div className="animate-fade-in-up max-w-3xl mx-auto">
            <div className={`rounded-xl border-l-[6px] p-6 text-lg shadow-xl bg-slate-900/95 ${selectedChoice.isCorrect ? 'border-emerald-500 text-emerald-100' : 'border-rose-500 text-rose-100'}`}>
              <span className={`block font-bold text-sm uppercase tracking-widest mb-2 ${selectedChoice.isCorrect ? 'text-emerald-400' : 'text-rose-400'}`}>
                {selectedChoice.isCorrect ? 'Data Synced' : 'Sync Error'}
              </span> 
              <span className="font-serif italic leading-relaxed">{selectedChoice.outcome}</span>
            </div>
            {currentStageIndex < totalStages - 1 && (
              <div className="flex justify-end mt-6">
                <button
                  onClick={handleNextStage}
                  className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-700 text-white font-bold tracking-wide shadow-[0_5px_20px_rgba(6,182,212,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all text-lg"
                >
                  Save & Continue
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default SimulationDigitalEntry;
