import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const SIMULATION_STAGES = [
  {
    id: 1,
    prompt: "You are meeting a bank manager for a business loan. He asks: 'How do I know your daily business is profitable?' What do you show him?",
    options: [
      {
        id: "verbal-promise",
        text: "Tell him 'Trust me, I have many customers.'",
        outcome: "Incorrect. Banks cannot lend money based on promises.",
        isCorrect: false,
      },
      {
        id: "daily-ledger",
        text: "Show your Daily Income & Expense Ledger.",
        outcome: "Correct! The ledger proves your daily cash flow and profitability.",
        isCorrect: true,
      },
      {
        id: "shop-photo",
        text: "Show a photo of your crowded shop.",
        outcome: "Incorrect. A crowd doesn't legally prove financial health.",
        isCorrect: false,
      },
      {
        id: "personal-wallet",
        text: "Show him the cash in your wallet.",
        outcome: "Incorrect. That proves nothing about sustained business income.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 2,
    prompt: "The manager asks: 'How can I verify that these ledger entries are real sales, not just made-up numbers?'",
    options: [
      {
        id: "get-angry",
        text: "Offend him for questioning your honesty.",
        outcome: "Incorrect. Verification is a standard, legal banking procedure.",
        isCorrect: false,
      },
      {
        id: "bill-book",
        text: "Hand over your sequential Bill Book/Digital Invoice copies.",
        outcome: "Correct! Invoices verify the ledger entries with specific customer details.",
        isCorrect: true,
      },
      {
        id: "bring-customer",
        text: "Offer to bring a customer to testify.",
        outcome: "Incorrect. Banks need documentary evidence, not anecdotes.",
        isCorrect: false,
      },
      {
        id: "ignore-question",
        text: "Change the subject to how much money you need.",
        outcome: "Incorrect. You must answer compliance questions directly.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 3,
    prompt: "He nods, but then asks: 'Are you legally operating and contributing to the system?'",
    options: [
      {
        id: "tax-proof",
        text: "Present your Tax Filing Proof (e.g., GST returns, Income Tax).",
        outcome: "Correct! Tax proofs show you are a formally recognized, compliant business.",
        isCorrect: true,
      },
      {
        id: "bribe",
        text: "Offer him a small personal cut of the loan.",
        outcome: "Incorrect. Bribery is a serious crime that will ruin you.",
        isCorrect: false,
      },
      {
        id: "say-yes",
        text: "Just say 'Yes, absolutely!'",
        outcome: "Incorrect. Again, verbal claims mean nothing without documents.",
        isCorrect: false,
      },
      {
        id: "complaint",
        text: "Complain that taxes are too high.",
        outcome: "Incorrect. This makes you look unstable and risky.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 4,
    prompt: "The manager reviews the documents. 'Your personal expenses seem mixed with business expenses in the bank statement.' How do you address this?",
    options: [
      {
        id: "admit-mix",
        text: "Say it's easier to manage everything in one account.",
        outcome: "Incorrect. This is a massive red flag for financial mismanagement.",
        isCorrect: false,
      },
      {
        id: "blame-bank",
        text: "Blame the bank for not telling you sooner.",
        outcome: "Incorrect. Basic financial discipline is your responsibility.",
        isCorrect: false,
      },
      {
        id: "separate-account",
        text: "Show your newly separated Business Current Account statements.",
        outcome: "Correct! A dedicated business account shows professional financial discipline.",
        isCorrect: true,
      },
      {
        id: "hide-statement",
        text: "Refuse to show him any more bank statements.",
        outcome: "Incorrect. Hiding documents will instantly reject your application.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 5,
    prompt: "Final question from the manager: 'Why do you need this loan, and how will you pay it back?'",
    options: [
      {
        id: "personal-use",
        text: "'To pay for my child's wedding. I'll figure it out.'",
        outcome: "Incorrect. Business loans cannot be used for personal expenses.",
        isCorrect: false,
      },
      {
        id: "vague-plan",
        text: "'Just to have more money. I'll pay it eventually.'",
        outcome: "Incorrect. Lenders require a specific, profitable use case.",
        isCorrect: false,
      },
    
      {
        id: "demand",
        text: "'It's my right to get a loan!'",
        outcome: "Incorrect. Loans are granted based on merit and proof, not demands.",
        isCorrect: false,
      },
        {
        id: "business-plan",
        text: "Present a clear expansion plan showing projected extra income based on your past records.",
        outcome: "Correct! Using past data to prove future repayment capability secures the loan.",
        isCorrect: true,
      },
    ],
  },
];

const SimulationTheLoanPitch = () => {
  const location = useLocation();
  // Registering at index 68 (mapped as game-68 or 69 depending on array alignment, usually aligns as game-68 based on current data layout)
  const gameId = "finance-business-livelihood-finance-68"; 
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
      title="Simulation: The Loan Pitch"
      subtitle={
        showResult
          ? "Simulation complete! You successfully pitched and secured the business loan."
          : `Bank Meeting Step ${currentStageIndex + 1} of ${totalStages}`
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
            <div className="bg-slate-900/90 backdrop-blur-xl rounded-3xl p-6 border-2 border-emerald-500/30 shadow-2xl relative overflow-hidden">
               
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
              
              <div className="flex items-center justify-between text-sm font-semibold uppercase tracking-[0.2em] text-emerald-400 mb-6 relative z-10 border-b border-emerald-500/20 pb-4">
                <span>Manager Inquiry {progressLabel}</span>
                <span className="bg-emerald-950/80 px-4 py-1.5 rounded shadow-sm border border-emerald-500/30">
                  Score: {score}/{totalStages}
                </span>
              </div>

              <div className="bg-gradient-to-br from-emerald-950/80 to-slate-900/80 p-6 rounded-2xl border-l-4 border-emerald-500 mb-8 shadow-inner relative z-10">
                 <p className="text-white text-xl md:text-2xl font-serif leading-relaxed italic">
                   {stage.prompt}
                 </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 relative z-10">
                {stage.options.map((option) => {
                  const isSelected = selectedChoice?.id === option.id;
                  let baseStyle = "from-slate-800 to-emerald-950 border-emerald-500/30 hover:border-emerald-400 hover:from-slate-700 hover:to-emerald-900 text-slate-200";
                  
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
                {selectedChoice.isCorrect ? 'Document Approved' : 'Application Risk'}
              </span> 
              <span className="font-serif italic leading-relaxed">{selectedChoice.outcome}</span>
            </div>
            {currentStageIndex < totalStages - 1 && (
              <div className="flex justify-end mt-6">
                <button
                  onClick={handleNextStage}
                  className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-bold tracking-wide shadow-[0_5px_20px_rgba(16,185,129,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all text-lg"
                >
                  Next Question
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default SimulationTheLoanPitch;
