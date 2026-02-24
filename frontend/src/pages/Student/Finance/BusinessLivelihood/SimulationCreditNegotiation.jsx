import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const SIMULATION_STAGES = [
  {
    id: 1,
    prompt: "You want to buy ₹20,000 worth of stock, but you only have ₹10,000 in cash. What is your best move?",
    options: [
      {
        id: "borrow-shark",
        text: "Borrow ₹10,000 from a local loan shark at 5% interest per day.",
        outcome: "Incorrect. Informal, high-interest loans are a trap that will destroy your business.",
        isCorrect: false,
      },
      
      {
        id: "buy-less",
        text: "Just buy ₹10,000 worth of stock and lose the extra sales.",
        outcome: "Incorrect. While safe, you are limiting your growth potential if demand is high.",
        isCorrect: false,
      },
      {
        id: "steal",
        text: "Take the stock when the supplier isn't looking.",
        outcome: "Incorrect. Theft will put you in jail, not in business.",
        isCorrect: false,
      },
      {
        id: "ask-credit",
        text: "Ask the supplier to give you the goods now and pay the remaining ₹10,000 in 30 days (Credit).",
        outcome: "Correct! Leveraging supplier credit is a standard way to scale without high-interest loans.",
        isCorrect: true,
      },
    ],
  },
  {
    id: 2,
    prompt: "You ask the supplier for 30 days of credit for the remaining ₹10,000. He says, 'I don't know you well. How do I know you'll pay me back?'",
    options: [
      {
        id: "swear",
        text: "Swear on your life that you will pay him.",
        outcome: "Incorrect. Suppliers deal in data, not emotional promises.",
        isCorrect: false,
      },
      {
        id: "show-bank",
        text: "Show him your Business Bank Statement highlighting regular, healthy monthly revenue.",
        outcome: "Correct! Hard financial data immediately establishes trust and capability.",
        isCorrect: true,
      },
      {
        id: "get-angry",
        text: "Get offended and yell that your word is your bond.",
        outcome: "Incorrect. Anger destroys professional relationships.",
        isCorrect: false,
      },
      {
        id: "ignore",
        text: "Just walk away and give up.",
        outcome: "Incorrect. Negotiation requires providing proof, not running away.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 3,
    prompt: "He looks at your bank statement. 'Okay, your account looks active. But how do I know this is business money and not just personal savings?'",
    options: [
       {
        id: "match-ledger",
        text: "Pull up your Digital Ledger app to show how your recorded sales match the bank deposits.",
        outcome: "Correct! Cross-verifying your ledger with your bank statement proves operational authenticity.",
        isCorrect: true,
      },
      {
        id: "mix",
        text: "Admit it's mostly personal savings from your spouse.",
        outcome: "Incorrect. This makes you look unprofessional and risky.",
        isCorrect: false,
      },
     
      {
        id: "say-trust-me",
        text: "Tell him 'Trust me, it's business.'",
        outcome: "Incorrect. Again, 'trust me' is not a financial document.",
        isCorrect: false,
      },
      {
        id: "fake-it",
        text: "Lie and say it's all from a massive secret contract.",
        outcome: "Incorrect. If he verifies this lie, you'll be blacklisted.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 4,
    prompt: "He is impressed! He agrees to the 30-day credit. What document should you BOTH sign to finalize this deal legally?",
    options: [
      {
        id: "nothing",
        text: "Nothing, a handshake is enough.",
        outcome: "Incorrect. A handshake cannot be enforced in a commercial dispute.",
        isCorrect: false,
      },
      {
        id: "blank-paper",
        text: "Sign a blank piece of paper.",
        outcome: "Incorrect. Never sign blank documents; it's extremely dangerous.",
        isCorrect: false,
      },
      {
        id: "invoice-terms",
        text: "A formal GST Invoice clearly stating the 'Payment Terms: Net 30 Days' and the outstanding ₹10,000.",
        outcome: "Correct! A detailed invoice legally locks in expectations for both parties.",
        isCorrect: true,
      },
      {
        id: "diary",
        text: "Write it in your personal diary.",
        outcome: "Incorrect. He doesn't have a copy of your personal diary.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 5,
    prompt: "On day 28, you have the money ready. How should you pay the ₹10,000 to maximize your business reputation?",
    options: [
      {
        id: "hide",
        text: "Wait for him to call and beg for the money, then pay on day 35.",
        outcome: "Incorrect. Late payments ruin your credit score and supplier relationship.",
        isCorrect: false,
      },
      {
        id: "cash-no-receipt",
        text: "Give him cash and don't ask for a receipt.",
        outcome: "Incorrect. Without a receipt, he could legally claim you never paid.",
        isCorrect: false,
      },
      
      {
        id: "pay-half",
        text: "Only pay ₹5,000 and say business is slow.",
        outcome: "Incorrect. Breaking a formal credit agreement damages your market reputation.",
        isCorrect: false,
      },
      {
        id: "digital-pay",
        text: "Transfer it via NEFT/UPI directly to his business account, keeping the digital receipt.",
        outcome: "Correct! On-time digital payments build massive trust for future, larger credit limits.",
        isCorrect: true,
      },
    ],
  },
];

const SimulationCreditNegotiation = () => {
  const location = useLocation();
  // Registering at index 96
  const gameId = "finance-business-livelihood-finance-96"; 
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
      title="Simulation: Credit Negotiation"
      subtitle={
        showResult
          ? "Simulation complete! You successfully secured and managed supplier credit."
          : `Negotiation Step ${currentStageIndex + 1} of ${totalStages}`
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
            <div className="bg-slate-900/90 backdrop-blur-xl rounded-3xl p-6 border-2 border-indigo-500/30 shadow-2xl relative overflow-hidden">
               
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
              
              <div className="flex items-center justify-between text-sm font-semibold uppercase tracking-[0.2em] text-indigo-400 mb-6 relative z-10 border-b border-indigo-500/20 pb-4">
                <span>Scenario {progressLabel}</span>
                <span className="bg-indigo-950/80 px-4 py-1.5 rounded shadow-sm border border-indigo-500/30">
                  Score: {score}/{totalStages}
                </span>
              </div>

              <div className="bg-gradient-to-br from-indigo-950/80 to-slate-900/80 p-6 rounded-2xl border-l-4 border-indigo-500 mb-8 shadow-inner relative z-10">
                 <p className="text-white text-xl md:text-2xl font-serif leading-relaxed italic">
                   {stage.prompt}
                 </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 relative z-10">
                {stage.options.map((option) => {
                  const isSelected = selectedChoice?.id === option.id;
                  let baseStyle = "from-slate-800 to-indigo-950/40 border-indigo-500/30 hover:border-indigo-400 hover:from-slate-700 hover:to-indigo-900/60 text-slate-200";
                  
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
                {selectedChoice.isCorrect ? 'Smart Move' : 'Poor Tactic'}
              </span> 
              <span className="font-serif italic leading-relaxed">{selectedChoice.outcome}</span>
            </div>
            {currentStageIndex < totalStages - 1 && (
              <div className="flex justify-end mt-6">
                <button
                  onClick={handleNextStage}
                  className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-700 text-white font-bold tracking-wide shadow-[0_5px_20px_rgba(79,70,229,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all text-lg"
                >
                  Next Step
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default SimulationCreditNegotiation;
