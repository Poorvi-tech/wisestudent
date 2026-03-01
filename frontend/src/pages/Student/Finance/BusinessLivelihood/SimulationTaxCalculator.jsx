import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const SIMULATION_STAGES = [
  {
    id: 1,
    prompt: "You sell a product for ₹1,000. It falls under a 5% tax bracket. How do you explain the total bill to the customer?",
    options: [
      {
        id: "hide-tax",
        text: "Just say 'Give me ₹1,050' without explaining.",
        outcome: "Incorrect. Customers deserve transparency on what they are paying for.",
        isCorrect: false,
      },
      {
        id: "show-calc",
        text: "Say: 'Price is ₹1,000, plus 5% tax (₹50). Total: ₹1,050.'",
        outcome: "Correct! Clear communication builds immediate trust.",
        isCorrect: true,
      },
      {
        id: "blame-gov",
        text: "Complain about the government and ask for ₹1,050.",
        outcome: "Incorrect. Keep transactions professional, not political.",
        isCorrect: false,
      },
      {
        id: "charge-extra",
        text: "Charge ₹1,100 to make a little extra profit on the side.",
        outcome: "Incorrect. This is fraudulent and illegal.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 2,
    prompt: "The customer asks: 'Can I just pay ₹1,000 without the bill?'",
    options: [
       {
        id: "explain-duty",
        text: "No, the tax is mandatory and helps build our nation's infrastructure.",
        outcome: "Correct! Upholding formal procedures protects your business.",
        isCorrect: true,
      },
      {
        id: "agree-illegal",
        text: "Yes, saving ₹50 is good for both of us.",
        outcome: "Incorrect. You are participating in tax evasion, risking severe penalties.",
        isCorrect: false,
      },
      {
        id: "ignore",
        text: "Ignore them and just hand over the item.",
        outcome: "Incorrect. They will leave without paying the correct amount.",
        isCorrect: false,
      },
     
      {
        id: "yell",
        text: "Yell at them for asking such a question.",
        outcome: "Incorrect. Always handle customer inquiries calmly.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 3,
    prompt: "How exactly do you calculate the 5% tax on ₹1,000?",
    options: [
      {
        id: "math-1",
        text: "(1000 * 5) / 10 = ₹500",
        outcome: "Incorrect. That's 50%.",
        isCorrect: false,
      },
      {
        id: "math-2",
        text: "1000 + 5 = 1005",
        outcome: "Incorrect. You must multiply by the percentage.",
        isCorrect: false,
      },
      {
        id: "math-3",
        text: "(1000 * 5) / 100 = ₹50",
        outcome: "Correct! The simple formula for percentage calculation.",
        isCorrect: true,
      },
      {
        id: "math-4",
        text: "Just guess ₹100 to be safe.",
        outcome: "Incorrect. Invoicing must be mathematically precise.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 4,
    prompt: "Where does this ₹50 go after the customer pays you?",
    options: [
      {
        id: "pocket",
        text: "It's extra profit for my business.",
        outcome: "Incorrect. Tax money is not your revenue.",
        isCorrect: false,
      },
      {
        id: "staff",
        text: "I use it to pay my staff bonuses.",
        outcome: "Incorrect. It legally belongs to the government.",
        isCorrect: false,
      },
      
      {
        id: "charity",
        text: "I give it away to charity.",
        outcome: "Incorrect. While noble, tax funds must go to the tax authority.",
        isCorrect: false,
      },
      {
        id: "government",
        text: "I hold it temporarily and deposit it to the government during tax filing.",
        outcome: "Correct! You act as an agent collecting tax on behalf of the state.",
        isCorrect: true,
      },
    ],
  },
  {
    id: 5,
    prompt: "A month later, a tax inspector reviews your records. What do they want to see regarding this ₹1,050 sale?",
    options: [
      {
        id: "video",
        text: "CCTV footage of the customer handing me cash.",
        outcome: "Incorrect. Video does not prove the financial breakdown.",
        isCorrect: false,
      },
      {
        id: "invoice-proof",
        text: "The invoice showing ₹1,000 price + ₹50 tax, matching my bank deposit.",
        outcome: "Correct! A clear digital/paper trail prevents any compliance issues.",
        isCorrect: true,
      },
      {
        id: "verbal",
        text: "My verbal promise that I paid the ₹50.",
        outcome: "Incorrect. Auditors need hard, verifiable data.",
        isCorrect: false,
      },
      {
        id: "customer-call",
        text: "They want me to call the customer to confirm the price.",
        outcome: "Incorrect. Your written records must speak for themselves.",
        isCorrect: false,
      },
    ],
  },
];

const SimulationTaxCalculator = () => {
  const location = useLocation();
  // Registering at index 56 (mapped as game-57/58 depending on array alignment, using standard mapping logic below)
  const gameId = "finance-business-livelihood-finance-56"; 
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
      title="Simulation: Tax Calculator"
      subtitle={
        showResult
          ? "Simulation complete! You successfully managed tax compliance."
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
          <div className="space-y-6">
            <div className="bg-slate-900/90 backdrop-blur-xl rounded-3xl p-6 border-2 border-violet-500/30 shadow-2xl relative overflow-hidden">
               
              <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
              
              <div className="flex items-center justify-between text-sm font-semibold uppercase tracking-[0.2em] text-violet-300 mb-6 relative z-10 border-b border-violet-500/20 pb-4">
                <span>Scenario {progressLabel}</span>
                <span className="bg-violet-950/80 px-4 py-1.5 rounded shadow-sm border border-violet-500/30">
                  Score: {score}/{totalStages}
                </span>
              </div>

              <div className="bg-gradient-to-br from-violet-950/80 to-slate-900/80 p-6 rounded-2xl border-l-4 border-violet-500 mb-8 shadow-inner relative z-10">
                 <p className="text-white text-xl md:text-2xl font-serif leading-relaxed italic">
                   {stage.prompt}
                 </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 relative z-10">
                {stage.options.map((option) => {
                  const isSelected = selectedChoice?.id === option.id;
                  let baseStyle = "from-slate-800 to-violet-950 border-violet-500/30 hover:border-violet-400 hover:from-slate-700 hover:to-violet-900 text-slate-200";
                  
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
                {selectedChoice.isCorrect ? 'Compliant Resolution' : 'Tax Violation'}
              </span> 
              <span className="font-serif italic leading-relaxed">{selectedChoice.outcome}</span>
            </div>
            {currentStageIndex < totalStages - 1 && (
              <div className="flex justify-end mt-6">
                <button
                  onClick={handleNextStage}
                  className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-purple-700 text-white font-bold tracking-wide shadow-[0_5px_20px_rgba(139,92,246,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all text-lg"
                >
                  Proceed to Next Step
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default SimulationTaxCalculator;
