import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const SIMULATION_STAGES = [
  {
    id: 1,
    prompt: "It's the 1st of the month. Your employee Ravi’s salary is ₹15,000. How do you prepare to pay him?",
    options: [
      {
        id: "cash-handover",
        text: "Hand him ₹15,000 in cash from the register and say 'Good job!'",
        outcome: "Incorrect. You have no proof of payment if a dispute arises.",
        isCorrect: false,
      },
      {
        id: "generate-slip",
        text: "Generate a formal Salary Slip and pay via bank transfer",
        outcome: "Correct! A formal slip and digital transfer provide legal proof.",
        isCorrect: true,
      },
      {
        id: "delay",
        text: "Tell him business was slow and pay him next week",
        outcome: "Incorrect. Delaying salaries ruins trust and morale.",
        isCorrect: false,
      },
      {
        id: "give-goods",
        text: "Give him ₹10,000 and ₹5,000 worth of shop inventory",
        outcome: "Incorrect. Employees need cash, not forced goods.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 2,
    prompt: "Ravi took a ₹2,000 advance mid-month. How is this reflected on the salary slip?",
    options: [
      {
        id: "ignore-advance",
        text: "Ignore it and just pay him ₹13,000",
        outcome: "Incorrect. Verbal agreements lead to confusion and arguments later.",
        isCorrect: false,
      },
      {
        id: "deduction-line",
        text: "Add a 'Deductions: Salary Advance' line item for ₹2,000",
        outcome: "Correct! Clear deductions prevent misunderstandings.",
        isCorrect: true,
      },
      {
        id: "scold-him",
        text: "Yell at him for taking an advance and deduct ₹3,000 as a penalty",
        outcome: "Incorrect. This is unfair and unprofessional.",
        isCorrect: false,
      },
      {
        id: "forget-it",
        text: "Forget about the advance and pay the full ₹15,000",
        outcome: "Incorrect. You just lost ₹2,000 of your business money.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 3,
    prompt: "You notice Ravi worked 3 extra days on holidays. What should you do?",
    options: [
      {
        id: "pat-on-back",
        text: "Pat him on the back and say thanks",
        outcome: "Incorrect. Appreciation doesn't pay his bills.",
        isCorrect: false,
      },
      {
        id: "secret-cash",
        text: "Slip him some extra cash quietly",
        outcome: "Incorrect. Unrecorded cash messes up your monthly expense tracking.",
        isCorrect: false,
      },
      {
        id: "add-bonus",
        text: "Add an 'Overtime/Bonus' line item to his salary slip",
        outcome: "Correct! Formalizing overtime rewards hard work legally and clearly.",
        isCorrect: true,
      },
      {
        id: "ignore",
        text: "Pretend you didn't notice",
        outcome: "Incorrect. He will stop working extra if he isn't compensated.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 4,
    prompt: "You generate the final slip: Basic: ₹15,000, Overtime: ₹1,500, Deductions: ₹2,000. What is the Net Pay?",
    options: [
      {
        id: "math-1",
        text: "₹15,000",
        outcome: "Incorrect. You forgot the adjustments.",
        isCorrect: false,
      },
      {
        id: "math-2",
        text: "₹14,500",
        outcome: "Correct! (15,000 + 1,500) - 2,000 = 14,500. Perfect calculation.",
        isCorrect: true,
      },
      {
        id: "math-3",
        text: "₹16,500",
        outcome: "Incorrect. You forgot to deduct the advance.",
        isCorrect: false,
      },
      {
        id: "math-4",
        text: "₹13,000",
        outcome: "Incorrect. You forgot to add his overtime.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 5,
    prompt: "Ravi asks why he needs to sign the salary slip. You explain:",
    options: [
      {
        id: "scare-tactic",
        text: "'Because I am the boss.'",
        outcome: "Incorrect. This causes unnecessary hostility.",
        isCorrect: false,
      },
      {
        id: "meaningless",
        text: "'It doesn't mean anything, just sign it.'",
        outcome: "Incorrect. It is a legal document.",
        isCorrect: false,
      },
      {
        id: "mutual-protection",
        text: "'It protects both of us. It proves I paid you fairly, and proves your official income for loans.'",
        outcome: "Correct! A formal slip helps the employee and secures your business.",
        isCorrect: true,
      },
      {
        id: "tax-trick",
        text: "'It's a trick to avoid taxes.'",
        outcome: "Incorrect. Never use documents for illegal purposes.",
        isCorrect: false,
      },
    ],
  },
];

const SimulationSalaryDay = () => {
  const location = useLocation();
  // Registering at index 42 (game-43 in 1-based index mapping)
  const gameId = "finance-business-livelihood-finance-42";
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
      title="Simulation: Salary Day"
      subtitle={
        showResult
          ? "Simulation complete! You generated a perfect, legal salary slip."
          : `Payroll Step ${currentStageIndex + 1} of ${totalStages}`
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
            <div className="bg-slate-900/90 backdrop-blur-xl rounded-3xl p-6 border-2 border-teal-500/30 shadow-2xl relative overflow-hidden">
               
              <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
              
              <div className="flex items-center justify-between text-sm font-semibold uppercase tracking-[0.2em] text-teal-300 mb-6 relative z-10 border-b border-teal-500/20 pb-4">
                <span>Task {progressLabel}</span>
                <span className="bg-teal-950/80 px-4 py-1.5 rounded shadow-sm border border-teal-500/30">
                  Score: {score}/{totalStages}
                </span>
              </div>

              <div className="bg-gradient-to-br from-teal-950/80 to-slate-900/80 p-6 rounded-2xl border-l-4 border-teal-500 mb-8 shadow-inner relative z-10">
                 <p className="text-white text-xl md:text-2xl font-serif leading-relaxed italic">
                   {stage.prompt}
                 </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 relative z-10">
                {stage.options.map((option) => {
                  const isSelected = selectedChoice?.id === option.id;
                  let baseStyle = "from-slate-800 to-teal-950 border-teal-500/30 hover:border-teal-400 hover:from-slate-700 hover:to-teal-900 text-slate-200";
                  
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
                {selectedChoice.isCorrect ? 'Professional Action' : 'Accounting Error'}
              </span> 
              <span className="font-serif italic leading-relaxed">{selectedChoice.outcome}</span>
            </div>
            {currentStageIndex < totalStages - 1 && (
              <div className="flex justify-end mt-6">
                <button
                  onClick={handleNextStage}
                  className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-700 text-white font-bold tracking-wide shadow-[0_5px_20px_rgba(20,184,166,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all text-lg"
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

export default SimulationSalaryDay;
