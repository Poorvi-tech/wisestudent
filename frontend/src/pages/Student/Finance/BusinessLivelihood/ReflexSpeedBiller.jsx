import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const SPEED_BILLER_STAGES = [
  {
    id: 1,
    prompt: "Customer bought 5 notebooks. What do you do?",
    options: [
      { id: "opt1", text: "Take Cash", outcome: "Incorrect! You missed the bill.", isCorrect: false },
      { id: "opt2", text: "Write on Paper", outcome: "Too slow and informal.", isCorrect: false },
      { id: "opt3", text: "Say 'No Bill'", outcome: "Bad practice!", isCorrect: false },
      { id: "opt4", text: "Generate POS Receipt", outcome: "Great! Invoice generated instantly.", isCorrect: true },
    ],
  },
  {
    id: 2,
    prompt: "Supplier dropped off 20 boxes. Quick, record it!",
    options: [
      { id: "opt1", text: "Generate GRN", outcome: "Perfect! Purchase recorded.", isCorrect: true },
      { id: "opt2", text: "Pay Cash Later", outcome: "No record created!", isCorrect: false },
      { id: "opt3", text: "Shake Hands", outcome: "Trust is good, records are better.", isCorrect: false },
      { id: "opt4", text: "Forget It", outcome: "You'll lose track of stock.", isCorrect: false },
    ],
  },
  {
    id: 3,
    prompt: "Online order received. Action required!",
    options: [
      { id: "opt1", text: "Ignore", outcome: "Order will be cancelled.", isCorrect: false },
      { id: "opt2", text: "Generate E-Way Bill", outcome: "Awesome! Ready for dispatch.", isCorrect: true },
      { id: "opt3", text: "Call Customer", outcome: "Time wasted. Just bill it.", isCorrect: false },
      { id: "opt4", text: "Pack without Bill", outcome: "Courier won't accept this.", isCorrect: false },
    ],
  },
  {
    id: 4,
    prompt: "Customer returning a shirt. Process it fast.",
    options: [
      { id: "opt1", text: "Argue", outcome: "Bad customer service.", isCorrect: false },
      { id: "opt2", text: "Give Cash Back", outcome: "Without a record? Bad idea.", isCorrect: false },
      { id: "opt3", text: "Issue Credit Note", outcome: "Correct! Credit note/invoice adjusting generated.", isCorrect: true },
      { id: "opt4", text: "Refuse", outcome: "Lost a customer forever.", isCorrect: false },
    ],
  },
  {
    id: 5,
    prompt: "End of month bulk sale! Hit the right button.",
    options: [
      { id: "opt1", text: "High Five", outcome: "Celebrate later, bill first.", isCorrect: false },
      { id: "opt2", text: "Print Tax Invoice", outcome: "Nailed it! Big sale recorded.", isCorrect: true },
      { id: "opt3", text: "Take Check", outcome: "Need an invoice against that check.", isCorrect: false },
      { id: "opt4", text: "Keep Secret", outcome: "Tax trouble incoming!", isCorrect: false },
    ],
  },
];

const ReflexSpeedBiller = () => {
  const location = useLocation();
  const gameId = "finance-business-livelihood-finance-9";
  const gameData = getGameDataById(gameId);
  const totalStages = SPEED_BILLER_STAGES.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const totalCoins = gameData?.coins ?? location.state?.totalCoins ?? 5;
  const coinsPerLevel = Math.max(1, Math.floor(totalCoins / totalStages));
  const totalXp = gameData?.xp ?? location.state?.totalXp ?? 10;
  const stage = SPEED_BILLER_STAGES[currentStageIndex];

  useEffect(() => {
    if (showResult || selectedChoice || !stage) return;

    if (timeLeft === 0) {
      setSelectedChoice({ id: "timeout", text: "Time's up!", outcome: "You didn't bill in time.", isCorrect: false });
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
      title="Reflex: Speed Biller"
      subtitle={
        showResult
          ? "Shift over! Your billing reflexes are sharp."
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
                className={`absolute bottom-0 left-0 h-1.5 transition-all duration-1000 ease-linear ${timeLeft <= 3 ? "bg-red-500" : "bg-purple-400"}`}
                style={{ width: `${(timeLeft / 10) * 100}%` }}
              />
              <div className="flex items-center justify-between text-sm font-semibold uppercase tracking-[0.2em] text-white/70">
                <span>Stage {progressLabel}</span>
                <span className={`text-xl font-bold ${timeLeft <= 3 ? 'text-red-400 animate-pulse' : 'text-purple-400'}`}>00:{timeLeft.toString().padStart(2, '0')}</span>
                <span>Score: {score}/{totalStages}</span>
              </div>

              <p className="text-white text-lg md:text-xl font-bold leading-snug mt-4 text-center">
                {stage.prompt}
              </p>

              <div className="grid grid-cols-2 gap-4 mt-8">
                {stage.options.map((option) => {
                  const isSelected = selectedChoice?.id === option.id;
                  
                  // Base retro-arcade button style
                  let baseStyle = "from-purple-500 to-indigo-600 border-indigo-400 hover:from-purple-400 hover:to-indigo-500 border-b-8 active:border-b-0 active:translate-y-2";
                  
                  if (isSelected) {
                    baseStyle = option.isCorrect
                      ? "from-emerald-500 to-lime-500 border-emerald-600 border-b-0 translate-y-2"
                      : "from-rose-500 to-red-600 border-rose-700 border-b-0 translate-y-2";
                  } else if (selectedChoice && option.isCorrect && !isSelected) {
                    baseStyle = "from-emerald-500/60 to-lime-500/60 border-emerald-600/60 border-b-8 opacity-70";
                  } else if (selectedChoice) {
                    baseStyle = "from-slate-600 to-slate-700 border-slate-800 border-b-8 opacity-50";
                  }

                  return (
                    <button
                      key={option.id}
                      onClick={() => handleChoice(option)}
                      disabled={Boolean(selectedChoice)}
                      className={`relative rounded-xl bg-gradient-to-b ${baseStyle} p-4 text-center text-white font-black uppercase tracking-wider transition-all disabled:cursor-not-allowed shadow-lg text-sm md:text-base leading-tight h-24 flex items-center justify-center`}
                    >
                      <span className="drop-shadow-md">{option.text}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {selectedChoice && (
          <div className="animate-fade-in-up">
            <div className={`rounded-xl border-2 p-4 text-center font-bold text-lg ${selectedChoice.isCorrect ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300' : 'bg-rose-500/20 border-rose-500 text-rose-300'}`}>
              {selectedChoice.outcome}
            </div>
            {currentStageIndex < totalStages - 1 && (
              <div className="flex justify-center mt-6">
                <button
                  onClick={handleNextStage}
                  className="px-8 py-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-black tracking-widest uppercase shadow-[0_0_20px_rgba(168,85,247,0.5)] hover:scale-110 transform transition-all animate-pulse hover:animate-none"
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

export default ReflexSpeedBiller;
