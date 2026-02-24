import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const PROOF_OF_INCOME_STAGES = [
  {
    id: 1,
    prompt: "A trader wants a bank loan but has no records. What is missing?",
    options: [
      {
        id: "education-certificate",
        text: "Education certificate",
        outcome: "Education may help, but banks need income proof.",
        isCorrect: false,
      },
      {
        id: "business-idea",
        text: "Business idea",
        outcome: "Ideas matter, but proof of income is still required.",
        isCorrect: false,
      },
      {
        id: "income-proof",
        text: "Income proof and transaction trail",
        outcome: "Correct. Records help access formal finance.",
        isCorrect: true,
      },
      {
        id: "bank-relationship",
        text: "Bank relationship",
        outcome: "Relationships help, but documentation is essential.",
        isCorrect: false,
      }
    ],
  },
  {
    id: 2,
    prompt: "Why do banks ask for transaction history?",
    options: [
      {
        id: "increase-interest",
        text: "To increase interest rates",
        outcome: "Rates depend on risk, not just documents.",
        isCorrect: false,
      },
      {
        id: "repayment-capacity",
        text: "To assess repayment capacity",
        outcome: "Correct. Banks need to see stable cash flow.",
        isCorrect: true,
      },
      {
        id: "delay-approval",
        text: "To delay approval",
        outcome: "History is for assessment, not delay.",
        isCorrect: false,
      },
      {
        id: "replace-guarantor",
        text: "To replace a guarantor",
        outcome: "History helps assessment but does not replace all requirements.",
        isCorrect: false,
      }
    ],
  },
  {
    id: 3,
    prompt: "Which habit helps build proof of income?",
    options: [
      {
        id: "record-sales",
        text: "Record daily sales and expenses",
        outcome: "Correct. Consistent records create proof.",
        isCorrect: true,
      },
      {
        id: "avoid-bank",
        text: "Avoid banks to stay flexible",
        outcome: "Avoiding banks limits access to formal finance.",
        isCorrect: false,
      },
      {
        id: "cash-only",
        text: "Use only cash and no receipts",
        outcome: "Cash without receipts reduces proof.",
        isCorrect: false,
      },
      {
        id: "guess-profits",
        text: "Estimate profits by memory",
        outcome: "Memory-based estimates are unreliable.",
        isCorrect: false,
      }
    ],
  },
  {
    id: 4,
    prompt: "What is a simple way to start building a transaction trail?",
    options: [
      {
        id: "keep-cash",
        text: "Keep all money in cash at home",
        outcome: "Cash at home provides no formal proof.",
        isCorrect: false,
      },
      {
        id: "no-receipts",
        text: "Avoid receipts for faster sales",
        outcome: "Receipts are part of income proof.",
        isCorrect: false,
      },
      {
        id: "single-wallet",
        text: "Use one personal wallet for everything",
        outcome: "Mixing funds makes proof harder.",
        isCorrect: false,
      },
      {
        id: "bank-account",
        text: "Use a business bank account for payments",
        outcome: "Correct. Bank records create a clear trail.",
        isCorrect: true,
      }
    ],
  },
  {
    id: 5,
    prompt: "What is the key takeaway about proof of income?",
    options: [
      {
        id: "records-help",
        text: "Records help access formal finance",
        outcome: "Correct. Strong records unlock better financing options.",
        isCorrect: true,
      },
      {
        id: "records-unneeded",
        text: "Records are unnecessary for loans",
        outcome: "Most loans require proof of income.",
        isCorrect: false,
      },
      {
        id: "only-big-business",
        text: "Only big businesses need records",
        outcome: "Even small businesses benefit from records.",
        isCorrect: false,
      },
      {
        id: "loan-always-cash",
        text: "Loans are always cash-based",
        outcome: "Formal loans require documentation and trails.",
        isCorrect: false,
      }
    ],
  },
];

const ProofOfIncome = () => {
  const location = useLocation();
  const gameId = "finance-business-livelihood-finance-11";
  const gameData = getGameDataById(gameId);
  const totalStages = PROOF_OF_INCOME_STAGES.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const totalCoins = gameData?.coins ?? location.state?.totalCoins ?? 5;
  const coinsPerLevel = Math.max(1, Math.floor(totalCoins / totalStages));
  const totalXp = gameData?.xp ?? location.state?.totalXp ?? 10;
  const stage = PROOF_OF_INCOME_STAGES[currentStageIndex];

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
      title="Proof of Income"
      subtitle={
        showResult
          ? "Quiz complete! You now understand why records unlock formal finance."
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

export default ProofOfIncome;
