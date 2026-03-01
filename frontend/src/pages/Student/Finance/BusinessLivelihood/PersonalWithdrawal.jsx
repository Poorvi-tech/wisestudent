import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const PERSONAL_WITHDRAWAL_STAGES = [
  {
    id: 1,
    prompt: "Owner takes cash randomly from business drawer. What problem arises?",
    options: [
      {
        id: "no-issue",
        text: "No issue",
        outcome: "Random withdrawals make it hard to see true cash flow.",
        isCorrect: false,
      },
      {
        id: "cashflow-confusion",
        text: "Business cash flow confusion",
        outcome: "Correct. Separation keeps finances clear.",
        isCorrect: true,
      },
      {
        id: "faster-growth",
        text: "Faster growth",
        outcome: "Growth depends on clear records, not random withdrawals.",
        isCorrect: false,
      },
      {
        id: "less-effort",
        text: "Less effort",
        outcome: "It may feel easy now but causes confusion later.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 2,
    prompt: "Why should owners separate personal and business money?",
    options: [
      {
        id: "avoid-customers",
        text: "To avoid customers",
        outcome: "Separation is about records, not customers.",
        isCorrect: false,
      },
      {
        id: "skip-taxes",
        text: "To skip taxes",
        outcome: "Separation helps compliance, not tax avoidance.",
        isCorrect: false,
      },
      {
        id: "increase-rent",
        text: "To increase rent",
        outcome: "Rent is unrelated to separation.",
        isCorrect: false,
      },
      {
        id: "clear-profit",
        text: "To see real business profit",
        outcome: "Correct. Clear separation shows true performance.",
        isCorrect: true,
      }
    ],
  },
  {
    id: 3,
    prompt: "What is a risk of random cash withdrawals?",
    options: [
      {
        id: "more-sales",
        text: "More sales automatically",
        outcome: "Sales depend on customers and products.",
        isCorrect: false,
      },
      {
        id: "free-profit",
        text: "Free profit",
        outcome: "Withdrawals reduce available business cash.",
        isCorrect: false,
      },
      {
        id: "missing-bills",
        text: "Bills and supplier payments may be missed",
        outcome: "Correct. Untracked withdrawals can cause shortages.",
        isCorrect: true,
      },
      {
        id: "no-risk",
        text: "No risk at all",
        outcome: "There is risk without clear tracking.",
        isCorrect: false,
      }
    ],
  },
  {
    id: 4,
    prompt: "What is a simple best practice for owner withdrawals?",
    options: [
      {
        id: "fixed-draw",
        text: "Set a fixed owner draw and record it",
        outcome: "Correct. A fixed draw keeps cash flow visible.",
        isCorrect: true,
      },
      {
        id: "take-anytime",
        text: "Take cash anytime without notes",
        outcome: "This creates confusion and weak records.",
        isCorrect: false,
      },
      {
        id: "never-pay",
        text: "Never take money out",
        outcome: "Owners can take money, but it should be tracked.",
        isCorrect: false,
      },
      {
        id: "borrow-from-suppliers",
        text: "Borrow from suppliers to cover gaps",
        outcome: "Better to plan withdrawals than create new debt.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 5,
    prompt: "What is the key takeaway about personal withdrawals?",
    options: [
      {
        id: "random-ok",
        text: "Random withdrawals are fine",
        outcome: "Random withdrawals hide cash flow problems.",
        isCorrect: false,
      },
      {
        id: "records-optional",
        text: "Records are optional",
        outcome: "Records are essential for clear finances.",
        isCorrect: false,
      },
      {
        id: "separate-clear",
        text: "Separation keeps finances clear",
        outcome: "Correct. Track withdrawals to protect business health.",
        isCorrect: true,
      },
      {
        id: "only-large",
        text: "Only large businesses need separation",
        outcome: "Small businesses benefit even more from separation.",
        isCorrect: false,
      }
    ],
  },
];

const PersonalWithdrawal = () => {
  const location = useLocation();
  const gameId = "finance-business-livelihood-finance-21";
  const gameData = getGameDataById(gameId);
  const totalStages = PERSONAL_WITHDRAWAL_STAGES.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const totalCoins = gameData?.coins ?? location.state?.totalCoins ?? 5;
  const coinsPerLevel = Math.max(1, Math.floor(totalCoins / totalStages));
  const totalXp = gameData?.xp ?? location.state?.totalXp ?? 10;
  const stage = PERSONAL_WITHDRAWAL_STAGES[currentStageIndex];

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
      title="Personal Withdrawal"
      subtitle={
        showResult
          ? "Quiz complete! You now know why separation keeps finances clear."
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

export default PersonalWithdrawal;
