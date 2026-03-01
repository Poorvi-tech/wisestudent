import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const SIMULATION_STAGES = [
  {
    id: 1,
    prompt: "Customer: 'My fan broke! I bought it here last week, fix it!' What is your first step?",
    options: [
      {
        id: "fix-immediately",
        text: "Apologize and give them a new fan immediately",
        outcome: "Incorrect. You might be replacing a fan they bought elsewhere.",
        isCorrect: false,
      },
      {
        id: "ask-for-bill",
        text: "Politely ask for their digital or physical bill/invoice",
        outcome: "Correct! You must verify the purchase before honoring a warranty.",
        isCorrect: true,
      },
      {
        id: "refuse",
        text: "Tell them you don't do returns, ever",
        outcome: "Incorrect. Refusing valid warranties destroys your reputation.",
        isCorrect: false,
      },
      {
        id: "trust-face",
        text: "Trust them because you vaguely remember their face",
        outcome: "Incorrect. Memory is not proof. You need documented verification.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 2,
    prompt: "They say: 'I lost the paper bill, but you sent me an SMS receipt!' How do you verify this?",
    options: [
      {
        id: "check-system",
        text: "Search your digital billing system using their phone number",
        outcome: "Correct! Digital logs make it easy to verify past sales.",
        isCorrect: true,
      },
      {
        id: "deny-sms",
        text: "Tell them SMS receipts don't count for warranty",
        outcome: "Incorrect. A digital receipt is just as valid as a paper one.",
        isCorrect: false,
      },
      {
        id: "make-excuse",
        text: "Say your computer is broken and ask them to come back next year",
        outcome: "Incorrect. This is terrible customer service.",
        isCorrect: false,
      },
      {
        id: "guess-date",
        text: "Look at the fan and guess if it looks a week old",
        outcome: "Incorrect. Guesswork leads to unfair losses or angry customers.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 3,
    prompt: "You find the invoice in your system. It says the fan was bought 14 months ago. The warranty is for 12 months.",
    options: [
      {
        id: "still-replace",
        text: "Replace it anyway to be nice",
        outcome: "Incorrect. This causes an unnecessary loss for your business.",
        isCorrect: false,
      },
      {
        id: "hide-screen",
        text: "Lie and say you can't find the invoice",
        outcome: "Incorrect. Honesty is crucial for business trust.",
        isCorrect: false,
      },
      {
        id: "explain-expired",
        text: "Show them the invoice date and explain the warranty has expired",
        outcome: "Correct! Data provides a neutral, undeniable fact to resolve the issue.",
        isCorrect: true,
      },
      {
        id: "blame-manufacturer",
        text: "Yell at them for trying to trick you",
        outcome: "Incorrect. Stay professional. They might genuinely have forgotten when they bought it.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 4,
    prompt: "The customer is disappointed but understands. They ask if you can at least repair it for a fee.",
    options: [
      {
        id: "repair-no-record",
        text: "Take it, fix it, and pocket the cash without recording it",
        outcome: "Incorrect. All income, including repairs, must be recorded.",
        isCorrect: false,
      },
      {
        id: "refuse-repair",
        text: "Tell them to throw it away and buy a new one",
        outcome: "Incorrect. You are losing out on potential repair income and goodwill.",
        isCorrect: false,
      },
      {
        id: "generate-repair-bill",
        text: "Agree, give an estimate, and generate a 'Repair Service' invoice",
        outcome: "Correct! You turn a warranty dispute into formal, recorded business income.",
        isCorrect: true,
      },
      {
        id: "do-it-free",
        text: "Feel bad and fix it for free",
        outcome: "Incorrect. Pity doesn't pay your shop's rent.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 5,
    prompt: "Another customer is watching all this. They want to buy a TV and ask: 'Will I get an SMS bill too?'",
    options: [
      {
        id: "confirm-yes",
        text: "Yes, every purchase comes with a verifiable digital invoice.",
        outcome: "Correct! Seeing your formal process builds massive confidence for new buyers.",
        isCorrect: true,
      },
      {
        id: "say-no",
        text: "No, that takes too much time. Paper only.",
        outcome: "Incorrect. You just showed them how useful digital records are.",
        isCorrect: false,
      },
      {
        id: "demand-extra",
        text: "Yes, but I charge an extra 5% for an SMS bill.",
        outcome: "Incorrect. Bills should be a standard, free part of the transaction.",
        isCorrect: false,
      },
      {
        id: "avoid-question",
        text: "Tell them not to worry about bills unless something breaks.",
        outcome: "Incorrect. Always establish the receipt rule immediately.",
        isCorrect: false,
      },
    ],
  },
];

const SimulationWarrantyCheck = () => {
  const location = useLocation();
  // Registering at index 32 (game-33 in the mapping)
  const gameId = "finance-business-livelihood-finance-32";
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
      title="Simulation: Warranty Check"
      subtitle={
        showResult
          ? "Simulation complete! You successfully managed the warranty dispute."
          : `Scenario ${currentStageIndex + 1} of ${totalStages}`
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
              
              <div className="flex items-center justify-between text-sm font-semibold uppercase tracking-[0.2em] text-indigo-300 mb-6 relative z-10 border-b border-indigo-500/20 pb-4">
                <span>Interaction {progressLabel}</span>
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
                  let baseStyle = "from-slate-800 to-indigo-950 border-indigo-500/30 hover:border-indigo-400 hover:from-slate-700 hover:to-indigo-900 text-slate-200";
                  
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
                {selectedChoice.isCorrect ? 'Professional Choice' : 'Critical Error'}
              </span> 
              <span className="font-serif italic leading-relaxed">{selectedChoice.outcome}</span>
            </div>
            {currentStageIndex < totalStages - 1 && (
              <div className="flex justify-end mt-6">
                <button
                  onClick={handleNextStage}
                  className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-600 text-white font-bold tracking-wide shadow-[0_5px_20px_rgba(79,70,229,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all text-lg"
                >
                  Continue Simulation
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default SimulationWarrantyCheck;
