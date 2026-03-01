import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const CASH_SEPARATOR_STAGES = [
  {
    id: 1,
    prompt: "Quick! Which of these coins is a 'Shop Stock' expense? Tap it!",
    options: [
      { id: "opt1", text: "Family Rice", outcome: "Oops! That's a Home Expense.", isCorrect: false },
      { id: "opt2", text: "Shop Sugar", outcome: "Correct! That's Shop Stock.", isCorrect: true },
      { id: "opt3", text: "School Fee", outcome: "Oops! That's a Home Expense.", isCorrect: false },
      { id: "opt4", text: "Movie Ticket", outcome: "Oops! That's a Home Expense.", isCorrect: false },
    ],
  },
  {
    id: 2,
    prompt: "Tap the 'Shop Stock' coin before time runs out!",
    options: [
      { id: "opt1", text: "Home Electricity", outcome: "Oops! That's a Home Expense.", isCorrect: false },
      { id: "opt2", text: "Personal Medicine", outcome: "Oops! That's a Home Expense.", isCorrect: false },
      { id: "opt3", text: "Display Racks", outcome: "Correct! That's Shop Stock/Asset.", isCorrect: true },
      { id: "opt4", text: "Relative's Gift", outcome: "Oops! That's a Home Expense.", isCorrect: false },
    ],
  },
  {
    id: 3,
    prompt: "Separate the 'Shop Stock' from Home Expenses fast!",
    options: [
      { id: "opt1", text: "Bulk Cooking Oil", outcome: "Correct! That's Shop Stock.", isCorrect: true },
      { id: "opt2", text: "Home Cooking Oil", outcome: "Oops! That's a Home Expense.", isCorrect: false },
      { id: "opt3", text: "House Rent", outcome: "Oops! That's a Home Expense.", isCorrect: false },
      { id: "opt4", text: "TV Repair", outcome: "Oops! That's a Home Expense.", isCorrect: false },
    ],
  },
  {
    id: 4,
    prompt: "Only tap the 'Shop Stock' coin!",
    options: [
      { id: "opt1", text: "Vacation Ticket", outcome: "Oops! That's a Home Expense.", isCorrect: false },
      { id: "opt2", text: "Kitchen Grocery", outcome: "Oops! That's a Home Expense.", isCorrect: false },
      { id: "opt3", text: "New Shirt", outcome: "Oops! That's a Home Expense.", isCorrect: false },
      { id: "opt4", text: "Wholesale Notebooks", outcome: "Correct! That's Shop Stock.", isCorrect: true },
    ],
  },
  {
    id: 5,
    prompt: "Final challenge! Find the 'Shop Stock' quick!",
    options: [
      { id: "opt1", text: "Supplier Payment", outcome: "Correct! That's a business expense/Shop Stock.", isCorrect: true },
      { id: "opt2", text: "Kid's Toy", outcome: "Oops! That's a Home Expense.", isCorrect: false },
      { id: "opt3", text: "Property Tax", outcome: "Oops! That's a Home Expense.", isCorrect: false },
      { id: "opt4", text: "Home Milk Bill", outcome: "Oops! That's a Home Expense.", isCorrect: false },
    ],
  },
];

const CashSeparator = () => {
  const location = useLocation();
  const gameId = "finance-business-livelihood-finance-2";
  const gameData = getGameDataById(gameId);
  const totalStages = CASH_SEPARATOR_STAGES.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const totalCoins = gameData?.coins ?? location.state?.totalCoins ?? 5;
  const coinsPerLevel = Math.max(1, Math.floor(totalCoins / totalStages));
  const totalXp = gameData?.xp ?? location.state?.totalXp ?? 10;
  const stage = CASH_SEPARATOR_STAGES[currentStageIndex];

  useEffect(() => {
    if (showResult || selectedChoice || !stage) return;

    if (timeLeft === 0) {
      setSelectedChoice({ id: "timeout", text: "Time's up!", outcome: "You didn't answer in time.", isCorrect: false });
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, showResult, selectedChoice, stage]);

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
      }, 800);
    }
  };

  const handleNextStage = () => {
    if (!selectedChoice) return;
    if (currentStageIndex === totalStages - 1) {
      setShowResult(true);
    } else {
      setCurrentStageIndex((prev) => prev + 1);
      setTimeLeft(10);
    }
    setSelectedChoice(null);
  };

  const progressLabel = `${currentStageIndex + 1}/${totalStages}`;

  return (
    <GameShell
      title="Reflex: Cash Separator"
      subtitle={
        showResult
          ? "Game complete! Great job separating your cash."
          : `Stage ${currentStageIndex + 1} of ${totalStages}`
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
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-2xl relative overflow-hidden">
              {/* Timer Bar representing 10 seconds */}
              <div 
                className={`absolute bottom-0 left-0 h-1.5 transition-all duration-1000 ease-linear ${timeLeft <= 3 ? "bg-red-500" : "bg-amber-400"}`}
                style={{ width: `${(timeLeft / 10) * 100}%` }}
              />
              <div className="flex items-center justify-between text-sm font-semibold uppercase tracking-[0.2em] text-white/70">
                <span>Stage {progressLabel}</span>
                <span className={`text-xl font-bold ${timeLeft <= 3 ? 'text-red-400 animate-pulse' : 'text-amber-400'}`}>00:{timeLeft.toString().padStart(2, '0')}</span>
                <span>Score: {score}/{totalStages}</span>
              </div>

              <p className="text-white text-lg md:text-xl font-bold leading-snug mt-4 text-center">
                {stage.prompt}
              </p>

              <div className="grid grid-cols-2 gap-4 mt-8 place-items-center">
                {stage.options.map((option) => {
                  const isSelected = selectedChoice?.id === option.id;
                  let baseStyle = "from-amber-400 to-orange-500 border-amber-300 ring-4 ring-orange-600/50";
                  
                  if (isSelected) {
                    baseStyle = option.isCorrect
                      ? "from-emerald-500 to-lime-500 border-emerald-400 ring-4 ring-lime-400/50 scale-105"
                      : "from-rose-500 to-orange-500 border-rose-400 ring-4 ring-rose-500/50 scale-105";
                  } else if (selectedChoice && option.isCorrect && !isSelected) {
                    // highlight correct answer if wrong one was picked
                    baseStyle = "from-emerald-500/60 to-lime-500/60 border-emerald-400/60 ring-2 ring-lime-400/30";
                  }

                  return (
                    <button
                      key={option.id}
                      onClick={() => handleChoice(option)}
                      disabled={Boolean(selectedChoice)}
                      className={`relative flex items-center justify-center rounded-full aspect-square w-full max-w-[140px] md:max-w-[160px] bg-gradient-to-br ${baseStyle} border-4 p-4 text-center text-white font-bold transition-all transform hover:scale-105 hover:shadow-2xl disabled:cursor-not-allowed shadow-[0_10px_20px_rgba(0,0,0,0.3)] text-sm md:text-base leading-tight`}
                    >
                      <div className="absolute inset-2 rounded-full border border-white/30 pointer-events-none"></div>
                      <span className="drop-shadow-md z-10">{option.text}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {selectedChoice && (
          <div className="animate-fade-in-up">
            <div className={`rounded-2xl border p-4 text-sm font-medium ${selectedChoice.isCorrect ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-100' : 'bg-rose-500/20 border-rose-500/50 text-rose-100'}`}>
              {selectedChoice.outcome}
            </div>
            {currentStageIndex < totalStages - 1 && (
              <div className="flex justify-end mt-4">
                <button
                  onClick={handleNextStage}
                  className="px-6 py-2.5 rounded-full bg-gradient-to-r from-amber-400 to-pink-500 text-white font-bold tracking-wide shadow-[0_5px_15px_rgba(251,191,36,0.3)] hover:opacity-90 transform hover:-translate-y-0.5 transition-all"
                >
                  NEXT
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default CashSeparator;
