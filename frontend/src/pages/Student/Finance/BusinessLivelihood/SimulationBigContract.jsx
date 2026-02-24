import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const SIMULATION_STAGES = [
  {
    id: 1,
    prompt: "A purchasing manager from a large local company walks in. They want to buy 100 uniforms from your shop. What is your first reaction?",
    options: [
      {
        id: "panic",
        text: "Tell them you can't handle such a big order and send them away.",
        outcome: "Incorrect. You just threw away a huge growth opportunity.",
        isCorrect: false,
      },
      
      {
        id: "bribe",
        text: "Offer them a personal kickback to guarantee the deal.",
        outcome: "Incorrect. Bribery is illegal and corrupts your business ethics.",
        isCorrect: false,
      },
      {
        id: "cash-discount",
        text: "Tell them you'll do it cheap if they pay in hidden cash.",
        outcome: "Incorrect. Companies cannot pay in unrecorded cash; they need paper trails.",
        isCorrect: false,
      },
      {
        id: "welcome",
        text: "Welcome them professionally and confirm you can supply the required quantity.",
        outcome: "Correct! Confidence and professionalism secure large contracts.",
        isCorrect: true,
      },
    ],
  },
  {
    id: 2,
    prompt: "The manager agrees to the price but says: 'We are a formal company. We need an official GST Invoice to process your payment.'",
    options: [
      {
        id: "refuse-gst",
        text: "Refuse, saying GST is too complicated for your small shop.",
        outcome: "Incorrect. This immediately disqualifies you from the contract.",
        isCorrect: false,
      },
      {
        id: "agree-gst",
        text: "Agree enthusiastically, as you have a registered GST number and billing software.",
        outcome: "Correct! Formal compliance is the golden key to corporate contracts.",
        isCorrect: true,
      },
      {
        id: "fake-bill",
        text: "Give them a manually written slip that says 'Tax Paid'.",
        outcome: "Incorrect. Companies require official, verifiable tax invoices with GSTINs.",
        isCorrect: false,
      },
      {
        id: "borrow-gst",
        text: "Ask to use your friend's GST number for this one bill.",
        outcome: "Incorrect. Using another entity's tax registration is fraudulent.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 3,
    prompt: "They ask for 30 days of credit. How do you formalize this agreement to ensure you get paid?",
    options: [
      {
        id: "purchase-order",
        text: "Ask them to issue a formal Purchase Order (PO) before delivering.",
        outcome: "Correct! A PO is a legally binding document guaranteeing payment terms.",
        isCorrect: true,
      },
      {
        id: "handshake",
        text: "A firm handshake and their verbal promise.",
        outcome: "Incorrect. Verbal agreements are useless if the company disputes the payment later.",
        isCorrect: false,
      },
      
      {
        id: "social-pressure",
        text: "Threaten to post bad things on social media if they don't pay.",
        outcome: "Incorrect. This is unprofessional and legally dangerous.",
        isCorrect: false,
      },
      {
        id: "refuse-credit",
        text: "Yell that you don't do credit and demand money upfront.",
        outcome: "Incorrect. 30-day credit is standard for large B2B (business-to-business) contracts.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 4,
    prompt: "You deliver the 100 uniforms perfectly. Now, how do you request your payment from their accounting department?",
    options: [
      {
        id: "whatsapp",
        text: "Send a WhatsApp message saying 'Send money soon'.",
        outcome: "Incorrect. Corporate finance departments ignore informal texts.",
        isCorrect: false,
      },
      
      {
        id: "show-up",
        text: "Go to their office and wait in the lobby until they pay.",
        outcome: "Incorrect. Bypassing the accounts protocol annoys the client and wastes your time.",
        isCorrect: false,
      },
      {
        id: "formal-invoice",
        text: "Submit the physical/digital Delivery Challan signed by them, attached to your GST Invoice.",
        outcome: "Correct! This is the flawless, undeniable proof required for corporate payment cycles.",
        isCorrect: true,
      },
      {
        id: "call-boss",
        text: "Call the company CEO repeatedly.",
        outcome: "Incorrect. The CEO doesn't process invoices; the accounts payable team does.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 5,
    prompt: "The 30 days are up. The money—a massive ₹50,000—hits your formal business bank account electronically. What is the main benefit of this?",
    options: [
      {
        id: "hide-it",
        text: "You can quickly withdraw it as cash and hide it.",
        outcome: "Incorrect. The point of formal business is transparency, not hiding.",
        isCorrect: false,
      },
      {
        id: "spend-personal",
        text: "You can immediately buy a new TV for your house.",
        outcome: "Incorrect. Mixing business capital with personal expenses destroys growth.",
        isCorrect: false,
      },
      
      {
        id: "complain-tax",
        text: "Now you have to complain because the government knows you made money.",
        outcome: "Incorrect. Paying taxes on formal income is the price of unlimited scalability.",
        isCorrect: false,
      },
      {
        id: "bank-record",
        text: "This large, formal bank entry massively boosts your credit score for future bank loans.",
        outcome: "Correct! Formal B2B payments prove high revenue capability to banks, unlocking massive growth capital.",
        isCorrect: true,
      },
    ],
  },
];

const SimulationBigContract = () => {
  const location = useLocation();
  // Registering at index 78 (game-78 in mapping logic)
  const gameId = "finance-business-livelihood-finance-78"; 
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
      title="Simulation: Big Contract"
      subtitle={
        showResult
          ? "Simulation complete! You successfully managed a corporate B2B contract."
          : `Contract Stage ${currentStageIndex + 1} of ${totalStages}`
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
            <div className="bg-slate-900/90 backdrop-blur-xl rounded-3xl p-6 border-2 border-amber-500/30 shadow-2xl relative overflow-hidden">
               
              <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
              
              <div className="flex items-center justify-between text-sm font-semibold uppercase tracking-[0.2em] text-amber-400 mb-6 relative z-10 border-b border-amber-500/20 pb-4">
                <span>Negotiation {progressLabel}</span>
                <span className="bg-amber-950/80 px-4 py-1.5 rounded shadow-sm border border-amber-500/30">
                  Score: {score}/{totalStages}
                </span>
              </div>

              <div className="bg-gradient-to-br from-amber-950/80 to-slate-900/80 p-6 rounded-2xl border-l-4 border-amber-500 mb-8 shadow-inner relative z-10">
                 <p className="text-white text-xl md:text-2xl font-serif leading-relaxed italic">
                   {stage.prompt}
                 </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 relative z-10">
                {stage.options.map((option) => {
                  const isSelected = selectedChoice?.id === option.id;
                  let baseStyle = "from-slate-800 to-amber-950/40 border-amber-500/30 hover:border-amber-400 hover:from-slate-700 hover:to-amber-900/60 text-slate-200";
                  
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
                {selectedChoice.isCorrect ? 'Professional Success' : 'Deal Breaker'}
              </span> 
              <span className="font-serif italic leading-relaxed">{selectedChoice.outcome}</span>
            </div>
            {currentStageIndex < totalStages - 1 && (
              <div className="flex justify-end mt-6">
                <button
                  onClick={handleNextStage}
                  className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-700 text-white font-bold tracking-wide shadow-[0_5px_20px_rgba(245,158,11,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all text-lg"
                >
                  Continue Negotiation
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default SimulationBigContract;
