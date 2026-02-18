import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const BANK_ACCOUNT_USE_STAGES = [
  {
    id: 1,
    prompt: "A business keeps all money in cash, no bank account. What opportunity is lost?",
    options: [
      {
        id: "privacy",
        text: "Privacy",
        outcome: "Privacy may increase, but important financial benefits are lost.",
        isCorrect: false,
      },
      {
        id: "track-record",
        text: "Financial track record and loan eligibility",
        outcome: "Correct. Bank trail improves credibility.",
        isCorrect: true,
      },
      {
        id: "speed",
        text: "Speed",
        outcome: "Cash is fast, but it loses formal records.",
        isCorrect: false,
      },
      {
        id: "independence",
        text: "Independence",
        outcome: "Bank accounts do not remove independence.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 2,
    prompt: "Why does a bank account help a business?",
    options: [
      {
        id: "avoid-customers",
        text: "It avoids customers",
        outcome: "Banking is about records, not avoiding customers.",
        isCorrect: false,
      },
      {
        id: "no-records",
        text: "It removes the need for records",
        outcome: "Records are still needed.",
        isCorrect: false,
      },
      {
        id: "guarantee-profit",
        text: "It guarantees profit",
        outcome: "Profit depends on sales and costs.",
        isCorrect: false,
      },
      {
        id: "build-history",
        text: "It builds a transaction history",
        outcome: "Correct. History supports loans and credibility.",
        isCorrect: true,
      },
    ],
  },
  {
    id: 3,
    prompt: "What is a risk of keeping only cash?",
    options: [
      {
        id: "more-credit",
        text: "More credit availability",
        outcome: "Credit needs proof, not just cash.",
        isCorrect: false,
      },
      {
        id: "faster-loans",
        text: "Faster loan approvals",
        outcome: "Loans often require bank statements.",
        isCorrect: false,
      },
      {
        id: "loss-theft",
        text: "Higher risk of loss or theft",
        outcome: "Correct. Cash has higher risk and less proof.",
        isCorrect: true,
      },
      {
        id: "easy-taxes",
        text: "Easier taxes",
        outcome: "Taxes are easier with records, not just cash.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 4,
    prompt: "What is a simple first step to build a bank trail?",
    options: [
      {
        id: "keep-cash",
        text: "Keep all money at home",
        outcome: "Home cash provides no formal trail.",
        isCorrect: false,
      },
      {
        id: "open-account",
        text: "Open a business bank account and use it for sales",
        outcome: "Correct. Regular deposits build a trail.",
        isCorrect: true,
      },
      {
        id: "delay",
        text: "Delay until business grows",
        outcome: "Early records are valuable for growth.",
        isCorrect: false,
      },
      {
        id: "borrow-only",
        text: "Borrow without any account",
        outcome: "Borrowing still needs records.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 5,
    prompt: "What is the key takeaway about bank account use?",
    options: [
      {
        id: "trail-credibility",
        text: "A bank trail improves credibility",
        outcome: "Correct. Records support access to finance.",
        isCorrect: true,
      },
      {
        id: "cash-best",
        text: "Cash-only is always best",
        outcome: "Cash-only loses records and credibility.",
        isCorrect: false,
      },
      {
        id: "records-optional",
        text: "Records are optional",
        outcome: "Records are essential for trust and growth.",
        isCorrect: false,
      },
      {
        id: "only-large",
        text: "Only large businesses need bank accounts",
        outcome: "Small businesses benefit the most from trails.",
        isCorrect: false,
      },
    ],
  },
];

const BankAccountUse = () => {
  const location = useLocation();
  const gameId = "finance-business-livelihood-finance-12";
  const gameData = getGameDataById(gameId);
  const totalStages = BANK_ACCOUNT_USE_STAGES.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const totalCoins = gameData?.coins ?? location.state?.totalCoins ?? 5;
  const coinsPerLevel = Math.max(1, Math.floor(totalCoins / totalStages));
  const totalXp = gameData?.xp ?? location.state?.totalXp ?? 10;
  const stage = BANK_ACCOUNT_USE_STAGES[currentStageIndex];

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
      title="Bank Account Use"
      subtitle={
        showResult
          ? "Quiz complete! You now know why a bank trail improves credibility."
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

export default BankAccountUse;
