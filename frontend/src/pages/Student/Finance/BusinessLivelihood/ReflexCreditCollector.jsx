import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const CREDIT_COLLECTOR_STAGES = [
  {
    id: 1,
    prompt: "Customer A purchased goods 30 days ago and payment is due today.",
    options: [
      { id: "opt1", text: "Wait 10 More Days", outcome: "Incorrect. Delaying collection hurts cash flow.", isCorrect: false },
      { id: "opt2", text: "Send Payment Reminder", outcome: "Correct! Prompt follow-ups ensure timely payments.", isCorrect: true },
      { id: "opt3", text: "Ignore It", outcome: "Bad idea. You might never get paid.", isCorrect: false },
      { id: "opt4", text: "Offer Discount", outcome: "Incorrect. Never discount an overdue payment.", isCorrect: false },
    ],
  },
  {
    id: 2,
    prompt: "A loyal customer is 35 days late on a 30-day invoice.",
    options: [
      { id: "opt1", text: "Stop All Supply", outcome: "Too harsh. You risk losing the customer entirely.", isCorrect: false },
      { id: "opt2", text: "Wait for Them", outcome: "Incorrect. Hope is not a strategy.", isCorrect: false },
      { id: "opt3", text: "Set a Firm Deadline", outcome: "Correct! A firm but polite deadline protects the relationship and your money.", isCorrect: true },
      { id: "opt4", text: "Forgive Debt", outcome: "Incorrect. Don't throw away earned money.", isCorrect: false },
    ],
  },
  {
    id: 3,
    prompt: "You notice an invoice became due this morning.",
    options: [
      { id: "opt1", text: "Call the Customer", outcome: "Correct! A same-day call shows professionalism and urgency.", isCorrect: true },
      { id: "opt2", text: "Forget About It", outcome: "Incorrect. That's a direct loss.", isCorrect: false },
      { id: "opt3", text: "Wait till Next Month", outcome: "Incorrect. The longer you wait, the harder it is to collect.", isCorrect: false },
      { id: "opt4", text: "Only Act if Big Amount", outcome: "Incorrect. Every invoice matters regardless of size.", isCorrect: false },
    ],
  },
  {
    id: 4,
    prompt: "A client promised to pay 'next week' but 30 days have passed.",
    options: [
      { id: "opt1", text: "Trust Them Again", outcome: "Incorrect. Repeated promises without payment need action.", isCorrect: false },
      { id: "opt2", text: "Charge Late Fee", outcome: "Correct! Enforcing late fees encourages timely payments.", isCorrect: true },
      { id: "opt3", text: "Get Angry", outcome: "Incorrect. Keep it professional.", isCorrect: false },
      { id: "opt4", text: "Do Nothing", outcome: "Incorrect. Taking action is mandatory.", isCorrect: false },
    ],
  },
  {
    id: 5,
    prompt: "End of month check: Several 30-day invoices are unpaid.",
    options: [
      { id: "opt1", text: "Handle Them Later", outcome: "Incorrect. Urgency is required.", isCorrect: false },
      { id: "opt2", text: "Write off as Bad Debt", outcome: "Incorrect. Try collecting first!", isCorrect: false },
      { id: "opt3", text: "Complain to Friends", outcome: "Incorrect. Complaining doesn't collect cash.", isCorrect: false },
      { id: "opt4", text: "Batch Send Invoices", outcome: "Correct! Batch sending invoices keeps cash flow healthy.", isCorrect: true },
    ],
  },
];

const ReflexCreditCollector = () => {
  const location = useLocation();
  const gameId = "finance-business-livelihood-finance-34";
  const gameData = getGameDataById(gameId);
  const totalStages = CREDIT_COLLECTOR_STAGES.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const totalCoins = gameData?.coins ?? location.state?.totalCoins ?? 5;
  const coinsPerLevel = Math.max(1, Math.floor(totalCoins / totalStages));
  const totalXp = gameData?.xp ?? location.state?.totalXp ?? 10;
  const stage = CREDIT_COLLECTOR_STAGES[currentStageIndex];

  useEffect(() => {
    if (showResult || selectedChoice || !stage) return;

    if (timeLeft === 0) {
      setSelectedChoice({ id: "timeout", text: "Time's up!", outcome: "You missed the collection window.", isCorrect: false });
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
      title="Reflex: Credit Collector"
      subtitle={
        showResult
          ? "Great! Prompt reminders ensure stable cash flow."
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
              {/* Timer Bar */}
              <div 
                className={`absolute bottom-0 left-0 h-1.5 transition-all duration-1000 ease-linear ${timeLeft <= 3 ? "bg-red-500" : "bg-yellow-400"}`}
                style={{ width: `${(timeLeft / 10) * 100}%` }}
              />
              <div className="flex items-center justify-between text-sm font-semibold uppercase tracking-[0.2em] text-white/70">
                <span>Stage {progressLabel}</span>
                <span className={`text-xl font-bold ${timeLeft <= 3 ? 'text-red-400 animate-pulse' : 'text-yellow-400'}`}>00:{timeLeft.toString().padStart(2, '0')}</span>
                <span>Score: {score}/{totalStages}</span>
              </div>

              <div className="bg-amber-900/40 p-5 rounded-2xl border border-amber-600/50 mt-6 shadow-inner">
                 <p className="text-white text-lg md:text-xl font-bold leading-snug text-center">
                   {stage.prompt}
                 </p>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-8">
                {stage.options.map((option, idx) => {
                  const isSelected = selectedChoice?.id === option.id;
                  
                  // Mail/Alert styling
                  let baseStyle = "from-amber-600 to-orange-600 border-orange-400 hover:from-amber-500 hover:to-orange-500 hover:scale-[1.03] shadow-md hover:shadow-xl";
                  
                  if (isSelected) {
                    baseStyle = option.isCorrect
                      ? "from-emerald-600 to-lime-600 border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.5)] scale-[1.03]"
                      : "from-rose-600 to-red-600 border-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.5)] scale-[1.03]";
                  } else if (selectedChoice && option.isCorrect && !isSelected) {
                    baseStyle = "from-emerald-700/60 to-lime-700/60 border-emerald-500/50 ring-2 ring-emerald-400/50 opacity-80";
                  } else if (selectedChoice) {
                    baseStyle = "from-slate-700 to-slate-800 border-slate-600 opacity-40 scale-[0.97]";
                  }


                  return (
                    <button
                      key={option.id}
                      onClick={() => handleChoice(option)}
                      disabled={Boolean(selectedChoice)}
                      className={`relative flex items-center justify-center rounded-2xl bg-gradient-to-br ${baseStyle} border-[3px] p-4 text-center text-white font-bold transition-all disabled:cursor-not-allowed text-sm md:text-base leading-tight min-h-[100px]`}
                    >
                      {/* Envelope/Alert icon abstraction */}
                      <div className={`absolute top-2 left-2 w-8 h-8 rounded-full flex items-center justify-center ${option.isCorrect ? 'bg-white/20' : 'bg-black/10'}`}>
                        💭
                      </div>
                      
                      <span className="drop-shadow-md z-10 w-full mt-4">{option.text}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {selectedChoice && (
          <div className="animate-fade-in-up">
            <div className={`rounded-xl border-2 p-5 text-center font-bold text-lg shadow-lg ${selectedChoice.isCorrect ? 'bg-emerald-900/60 border-emerald-500 text-emerald-200' : 'bg-rose-900/60 border-rose-500 text-rose-200'}`}>
              {selectedChoice.outcome}
            </div>
            {currentStageIndex < totalStages - 1 && (
              <div className="flex justify-center mt-6">
                <button
                  onClick={handleNextStage}
                  className="px-8 py-3 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 text-white font-black tracking-widest uppercase shadow-[0_5px_20px_rgba(245,158,11,0.4)] hover:scale-105 transform transition-all border border-orange-400"
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

export default ReflexCreditCollector;
