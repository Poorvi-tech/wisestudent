import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const INFORMAL_WORKER_PAYMENT_STAGES = [
  {
    id: 1,
    prompt: "Owner pays staff cash with no record. What problem may occur?",
    options: [
      {
        id: "no-issue",
        text: "No issue",
        outcome: "Without records, disputes can arise later.",
        isCorrect: false,
      },
      {
        id: "disputes-legal",
        text: "Salary disputes or legal issues",
        outcome: "Correct. Payment records protect both sides.",
        isCorrect: true,
      },
      {
        id: "higher-productivity",
        text: "Higher productivity",
        outcome: "Productivity depends on management, not missing records.",
        isCorrect: false,
      },
      {
        id: "lower-expenses",
        text: "Lower expenses",
        outcome: "Expenses may be the same, but disputes can add costs.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 2,
    prompt: "Why is payment proof important for staff wages?",
    options: [
      {
        id: "clear-agreement",
        text: "It shows what was paid and when",
        outcome: "Correct. Proof reduces misunderstandings.",
        isCorrect: true,
      },
      {
        id: "avoid-workers",
        text: "It helps avoid workers",
        outcome: "Records are for fairness, not avoidance.",
        isCorrect: false,
      },
      {
        id: "remove-salary",
        text: "It removes the need to pay salary",
        outcome: "Salaries must be paid regardless of records.",
        isCorrect: false,
      },
      {
        id: "increase-rent",
        text: "It increases rent",
        outcome: "Rent is unrelated to wage records.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 3,
    prompt: "What is a common risk of cash wages without records?",
    options: [
      {
        id: "duplicate-payments",
        text: "Disputes about whether payment was made",
        outcome: "Correct. Without proof, disputes are common.",
        isCorrect: true,
      },
      {
        id: "more-savings",
        text: "More savings automatically",
        outcome: "Savings depend on profits, not missing records.",
        isCorrect: false,
      },
      {
        id: "faster-growth",
        text: "Faster growth",
        outcome: "Growth needs stability and clear systems.",
        isCorrect: false,
      },
      {
        id: "no-risk",
        text: "No risk",
        outcome: "There is real risk without records.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 4,
    prompt: "What is a simple way to keep payment records?",
    options: [
      {
        id: "payment-register",
        text: "Maintain a wage register or signed receipt",
        outcome: "Correct. A simple record protects both sides.",
        isCorrect: true,
      },
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
        id: "delay-records",
        text: "Write records only once a year",
        outcome: "Yearly records miss monthly disputes.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 5,
    prompt: "What is the key takeaway about informal worker payment?",
    options: [
      {
        id: "records-protect",
        text: "Payment records protect both sides",
        outcome: "Correct. Documentation prevents disputes and legal issues.",
        isCorrect: true,
      },
      {
        id: "records-optional",
        text: "Records are optional",
        outcome: "Records are essential for fairness and proof.",
        isCorrect: false,
      },
      {
        id: "cash-only",
        text: "Cash without records is safe",
        outcome: "Cash without records increases risk.",
        isCorrect: false,
      },
      {
        id: "no-need",
        text: "No need to track wages",
        outcome: "Wage tracking protects employer and employee.",
        isCorrect: false,
      },
    ],
  },
];

const InformalWorkerPayment = () => {
  const location = useLocation();
  const gameId = "finance-business-livelihood-finance-20";
  const gameData = getGameDataById(gameId);
  const totalStages = INFORMAL_WORKER_PAYMENT_STAGES.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const totalCoins = gameData?.coins ?? location.state?.totalCoins ?? 5;
  const coinsPerLevel = Math.max(1, Math.floor(totalCoins / totalStages));
  const totalXp = gameData?.xp ?? location.state?.totalXp ?? 10;
  const stage = INFORMAL_WORKER_PAYMENT_STAGES[currentStageIndex];

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
      title="Informal Worker Payment"
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

export default InformalWorkerPayment;
