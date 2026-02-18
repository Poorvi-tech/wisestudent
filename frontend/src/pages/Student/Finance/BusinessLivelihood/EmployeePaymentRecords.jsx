import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const EMPLOYEE_PAYMENT_RECORDS_STAGES = [
  {
    id: 1,
    prompt: "Owner starts recording staff payments. What improves?",
    options: [
      {
        id: "decoration",
        text: "Decoration",
        outcome: "Records are for proof, not decoration.",
        isCorrect: false,
      },
      {
        id: "rent-cost",
        text: "Rent cost",
        outcome: "Rent costs are unrelated to wage records.",
        isCorrect: false,
      },
      {
        id: "sales-speed",
        text: "Sales speed",
        outcome: "Sales speed depends on service, not payroll records.",
        isCorrect: false,
      },
      {
        id: "trust-clarity",
        text: "Trust, clarity, and legal safety",
        outcome: "Correct. Records protect both employer and worker.",
        isCorrect: true,
      }
    ],
  },
  {
    id: 2,
    prompt: "Why are payment records important for employees?",
    options: [
      {
        id: "avoid-workers",
        text: "They help avoid workers",
        outcome: "Records are for fairness, not avoidance.",
        isCorrect: false,
      },
      {
        id: "clear-proof",
        text: "They show what was paid and when",
        outcome: "Correct. Proof reduces misunderstandings.",
        isCorrect: true,
      },
      {
        id: "remove-salary",
        text: "They remove the need to pay salary",
        outcome: "Salaries must be paid regardless of records.",
        isCorrect: false,
      },
      {
        id: "increase-rent",
        text: "They increase rent",
        outcome: "Rent is unrelated to wage records.",
        isCorrect: false,
      }
    ],
  },
  {
    id: 3,
    prompt: "What risk is reduced by keeping payment records?",
    options: [
      {
        id: "disputes",
        text: "Salary disputes and legal issues",
        outcome: "Correct. Clear records prevent conflicts.",
        isCorrect: true,
      },
      {
        id: "more-profit",
        text: "More profit automatically",
        outcome: "Records improve clarity, not automatic profit.",
        isCorrect: false,
      },
      {
        id: "faster-growth",
        text: "Faster growth",
        outcome: "Growth depends on many factors, not just records.",
        isCorrect: false,
      },
      {
        id: "no-risk",
        text: "No risk at all",
        outcome: "Risk can never be zero, but records reduce it.",
        isCorrect: false,
      }
    ],
  },
  {
    id: 4,
    prompt: "What is a simple way to keep employee payment records?",
    options: [
      {
        id: "verbal-only",
        text: "Keep it verbal only",
        outcome: "Verbal promises are hard to prove later.",
        isCorrect: false,
      },
      {
        id: "cash-no-notes",
        text: "Pay cash with no notes",
        outcome: "No notes means no proof.",
        isCorrect: false,
      },
      {
        id: "wage-register",
        text: "Maintain a wage register or signed receipt",
        outcome: "Correct. A simple register creates proof.",
        isCorrect: true,
      },
      {
        id: "yearly-records",
        text: "Record only once a year",
        outcome: "Yearly records miss monthly issues.",
        isCorrect: false,
      }
    ],
  },
  {
    id: 5,
    prompt: "What is the key takeaway about employee payment records?",
    options: [
      {
        id: "protect-both",
        text: "Records protect both employer and worker",
        outcome: "Correct. Documentation builds trust and safety.",
        isCorrect: true,
      },
      {
        id: "optional",
        text: "Records are optional",
        outcome: "Records are essential for clarity and fairness.",
        isCorrect: false,
      },
      {
        id: "no-impact",
        text: "Records make no impact",
        outcome: "Records reduce disputes and improve trust.",
        isCorrect: false,
      },
      {
        id: "only-big",
        text: "Only large businesses need records",
        outcome: "Small businesses benefit just as much.",
        isCorrect: false,
      }
    ],
  },
];

const EmployeePaymentRecords = () => {
  const location = useLocation();
  const gameId = "finance-business-livelihood-finance-34";
  const gameData = getGameDataById(gameId);
  const totalStages = EMPLOYEE_PAYMENT_RECORDS_STAGES.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const totalCoins = gameData?.coins ?? location.state?.totalCoins ?? 10;
  const coinsPerLevel = Math.max(1, Math.floor(totalCoins / totalStages));
  const totalXp = gameData?.xp ?? location.state?.totalXp ?? 20;
  const stage = EMPLOYEE_PAYMENT_RECORDS_STAGES[currentStageIndex];

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
    }
    setSelectedChoice(null);
  };

  const progressLabel = `${currentStageIndex + 1}/${totalStages}`;

  return (
    <GameShell
      title="Employee Payment Records"
      subtitle={
        showResult
          ? "Quiz complete! You now know why payment records protect both sides."
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
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-2xl shadow-black/30">
              <div className="flex items-center justify-between text-sm font-semibold uppercase tracking-[0.2em] text-white/70">
                <span>Stage {progressLabel}</span>
                <span>
                  Score: {score}/{totalStages}
                </span>
              </div>

              <p className="text-white text-lg md:text-xl font-bold leading-snug mt-4">
                {stage.prompt}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                {stage.options.map((option) => {
                  const isSelected = selectedChoice?.id === option.id;
                  const baseStyle = isSelected
                    ? option.isCorrect
                      ? "from-emerald-500 to-lime-500 border-emerald-400/80"
                      : "from-rose-500 to-orange-500 border-rose-400/80"
                    : "from-blue-500 to-cyan-500 border-transparent";

                  return (
                    <button
                      key={option.id}
                      onClick={() => handleChoice(option)}
                      disabled={Boolean(selectedChoice)}
                      className={`relative rounded-2xl bg-gradient-to-r ${baseStyle} border-2 p-5 text-left text-white font-semibold transition-all transform hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60 shadow-lg`}
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
          <>
            <div className="rounded-2xl bg-white/10 border border-white/20 p-4 text-sm text-white/80">
              {selectedChoice.outcome}
            </div>
            {currentStageIndex < totalStages - 1 && (
              <div className="flex justify-end">
                <button
                  onClick={handleNextStage}
                  className="px-5 py-2 rounded-full bg-gradient-to-r from-amber-400 to-pink-500 text-white font-semibold shadow-lg hover:opacity-90"
                >
                  Next Stage
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </GameShell>
  );
};

export default EmployeePaymentRecords;
