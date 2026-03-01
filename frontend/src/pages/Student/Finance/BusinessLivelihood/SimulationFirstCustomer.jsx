import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const SIMULATION_STAGES = [
  {
    id: 1,
    prompt: "A customer buys goods worth ₹500 and is in a hurry. What do you do?",
    options: [
      {
        id: "no-bill",
        text: "Take cash and let them go (No Bill)",
        outcome: "Incorrect. Without a bill, there is no proof of sale or warranty.",
        isCorrect: false,
      },
      {
        id: "give-bill",
        text: "Quickly generate and provide a bill",
        outcome: "Correct! Every transaction needs a record to build business trust.",
        isCorrect: true,
      },
      {
        id: "ask-later",
        text: "Tell them to collect the bill next time",
        outcome: "Incorrect. Customers usually forget, and your daily count will mismatch.",
        isCorrect: false,
      },
      {
        id: "only-warranty",
        text: "Give bill only if they ask for warranty",
        outcome: "Incorrect. A bill is a must for proper accounting, regardless of warranty.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 2,
    prompt: "The supplier drops off stock and asks for payment in cash right away. What is the best action?",
    options: [
      {
        id: "pay-cash-no-record",
        text: "Pay from the register without noting it",
        outcome: "Incorrect. You will lose track of your expenses.",
        isCorrect: false,
      },
      {
        id: "pay-digital",
        text: "Pay via bank/UPI for an automatic record",
        outcome: "Correct! Digital payments automatically create an expense trail.",
        isCorrect: true,
      },
      {
        id: "promise-later",
        text: "Tell them to come tomorrow",
        outcome: "Incorrect. Delaying payment damages your supplier relationship.",
        isCorrect: false,
      },
      {
        id: "personal-cash",
        text: "Pay from your personal wallet",
        outcome: "Incorrect. Mixing personal and business money causes confusion.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 3,
    prompt: "A regular customer wants to buy items on credit till next month.",
    options: [
      {
        id: "memorize",
        text: "Agree and memorize the amount",
        outcome: "Incorrect. Memory fades and leads to disputes.",
        isCorrect: false,
      },
      {
        id: "deny-loyalty",
        text: "Refuse completely, risking their loyalty",
        outcome: "Incorrect. Managing credit is common, it just needs tracking.",
        isCorrect: false,
      },
      {
        id: "note-credit",
        text: "Write it in a dedicated customer ledger/app",
        outcome: "Correct! Tracking credit ensures you get paid and maintains the relationship.",
        isCorrect: true,
      },
      {
        id: "ask-deposit",
        text: "Keep their phone as deposit",
        outcome: "Incorrect. That is unprofessional and damages customer trust.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 4,
    prompt: "At the end of the day, there's an extra ₹2000 in the cash box.",
    options: [
      {
        id: "take-home",
        text: "Take it home as a bonus",
        outcome: "Incorrect. This breaks financial discipline and messes up records.",
        isCorrect: false,
      },
      {
        id: "ignore",
        text: "Leave it there and ignore it",
        outcome: "Incorrect. Unaccounted money means a missed record somewhere.",
        isCorrect: false,
      },
      {
        id: "spend-stock",
        text: "Immediately buy more stock with it",
        outcome: "Incorrect. You need to know where it came from first.",
        isCorrect: false,
      },
      {
        id: "verify-records",
        text: "Check records to find the unrecorded sale",
        outcome: "Correct! Always reconcile cash with your sales book.",
        isCorrect: true,
      },
    ],
  },
  {
    id: 5,
    prompt: "You notice a popular item is mostly purchased via card/UPI, but some customers only carry cash.",
    options: [
      {
        id: "card-only",
        text: "Stop accepting cash for this item",
        outcome: "Incorrect. You might lose customers who rely on cash.",
        isCorrect: false,
      },
      {
        id: "cash-only",
        text: "Make it cash-only to avoid digital fees",
        outcome: "Incorrect. You will lose the digital-paying customers.",
        isCorrect: false,
      },
      {
        id: "accept-both",
        text: "Accept both and give a bill for every mode",
        outcome: "Correct! Giving customers payment choices with proper bills is the best strategy.",
        isCorrect: true,
      },
      {
        id: "different-price",
        text: "Charge more for digital payments",
        outcome: "Incorrect. This frustrates customers and hurts your reputation.",
        isCorrect: false,
      },
    ],
  },
];

const SimulationFirstCustomer = () => {
  const location = useLocation();
  const gameId = "finance-business-livelihood-finance-8";
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
      title="Simulation: The First Customer"
      subtitle={
        showResult
          ? "Simulation complete! You are ready to handle real customers."
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
      <div className="space-y-8">
        {!showResult && stage && (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-2xl shadow-black/30">
              <div className="flex items-center justify-between text-sm font-semibold uppercase tracking-[0.2em] text-cyan-200/80 mb-2">
                <span>Scenario {progressLabel}</span>
                <span>
                  Score: {score}/{totalStages}
                </span>
              </div>

              <div className="bg-gradient-to-r from-blue-900/50 to-indigo-900/50 p-5 rounded-2xl border border-blue-500/30 mb-6 shadow-inner">
                 <p className="text-white text-lg md:text-xl font-bold leading-snug">
                   {stage.prompt}
                 </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {stage.options.map((option) => {
                  const isSelected = selectedChoice?.id === option.id;
                  let baseStyle = "from-cyan-600 to-blue-600 border-cyan-400/50 hover:from-cyan-500 hover:to-blue-500";
                  
                  if (isSelected) {
                    baseStyle = option.isCorrect
                      ? "from-emerald-500 to-lime-500 border-emerald-400 ring-4 ring-emerald-500/30 scale-[1.02]"
                      : "from-rose-500 to-orange-500 border-rose-400 ring-4 ring-rose-500/30 scale-[1.02]";
                  } else if (selectedChoice && option.isCorrect && !isSelected) {
                    baseStyle = "from-emerald-600/60 to-lime-600/60 border-emerald-500/50";
                  } else if (selectedChoice && !isSelected) {
                    baseStyle = "from-slate-700 to-slate-800 border-slate-600 opacity-50";
                  }

                  return (
                    <button
                      key={option.id}
                      onClick={() => handleChoice(option)}
                      disabled={Boolean(selectedChoice)}
                      className={`relative rounded-2xl bg-gradient-to-r ${baseStyle} border-2 p-5 text-left text-white font-semibold transition-all shadow-lg min-h-[100px] flex items-center disabled:cursor-not-allowed`}
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
          <div className="animate-fade-in-up">
            <div className={`rounded-2xl border p-5 text-md font-medium shadow-lg ${selectedChoice.isCorrect ? 'bg-emerald-900/40 border-emerald-500/50 text-emerald-100' : 'bg-rose-900/40 border-rose-500/50 text-rose-100'}`}>
              <span className="font-bold mr-2">{selectedChoice.isCorrect ? 'Customer says: Thank you!' : 'Mistake!'}</span> 
              {selectedChoice.outcome}
            </div>
            {currentStageIndex < totalStages - 1 && (
              <div className="flex justify-end mt-4">
                <button
                  onClick={handleNextStage}
                  className="px-6 py-3 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-white font-bold tracking-wide shadow-xl hover:scale-105 transition-transform"
                >
                  Next Scenario
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default SimulationFirstCustomer;
