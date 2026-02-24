import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const SEPARATE_BANK_ACCOUNTS_STAGES = [
  {
    id: 1,
    prompt: "Owner opens separate business account. Main benefit?",
    options: [
      {
        id: "more-tax",
        text: "More tax",
        outcome: "Taxes depend on income, not on having separate accounts.",
        isCorrect: false,
      },
      {
        id: "less-control",
        text: "Less control",
        outcome: "Separation improves control, not reduces it.",
        isCorrect: false,
      },
      {
        id: "clear-tracking",
        text: "Clear income tracking",
        outcome: "Correct. Separation shows true business performance.",
        isCorrect: true,
      },
      {
        id: "more-work",
        text: "More work",
        outcome: "It may take a small setup effort but saves time later.",
        isCorrect: false,
      }
    ],
  },
  {
    id: 2,
    prompt: "Why does a separate account improve decisions?",
    options: [
      {
        id: "avoid-customers",
        text: "It avoids customers",
        outcome: "Accounts are for records, not avoiding customers.",
        isCorrect: false,
      },
      {
        id: "remove-bills",
        text: "It removes the need for bills",
        outcome: "Bills and records still matter.",
        isCorrect: false,
      },
      {
        id: "guarantee-growth",
        text: "It guarantees growth",
        outcome: "Growth depends on many factors, not just accounts.",
        isCorrect: false,
      },
      {
        id: "see-profit",
        text: "It shows real business profit clearly",
        outcome: "Correct. Clean records support better decisions.",
        isCorrect: true,
      }
    ],
  },
  {
    id: 3,
    prompt: "What problem happens if business and personal accounts mix?",
    options: [
      {
        id: "confusion",
        text: "Cash flow confusion and unclear profits",
        outcome: "Correct. Mixing makes performance hard to read.",
        isCorrect: true,
      },
      {
        id: "more-profit",
        text: "More profit automatically",
        outcome: "Mixing does not create profit.",
        isCorrect: false,
      },
      {
        id: "less-records",
        text: "Less need for records",
        outcome: "Mixing increases the need for careful records.",
        isCorrect: false,
      },
      {
        id: "no-risk",
        text: "No risk at all",
        outcome: "There is risk in mixed accounts.",
        isCorrect: false,
      }
    ],
  },
  {
    id: 4,
    prompt: "What is a simple step to keep accounts separate?",
    options: [
      {
        id: "withdraw-randomly",
        text: "Withdraw cash randomly without records",
        outcome: "Random withdrawals create confusion.",
        isCorrect: false,
      },
      {
        id: "use-business-account",
        text: "Use the business account for all sales and expenses",
        outcome: "Correct. Consistent use keeps the trail clean.",
        isCorrect: true,
      },
      {
        id: "mix-cash",
        text: "Mix cash from both accounts regularly",
        outcome: "Mixing defeats the purpose of separation.",
        isCorrect: false,
      },
      {
        id: "delay-forever",
        text: "Delay separation forever",
        outcome: "Delays create avoidable problems.",
        isCorrect: false,
      }
    ],
  },
  {
    id: 5,
    prompt: "What is the key takeaway about separate bank accounts?",
    options: [
      {
        id: "separation-clear",
        text: "Separation shows true business performance",
        outcome: "Correct. Clear records strengthen control and planning.",
        isCorrect: true,
      },
      {
        id: "optional",
        text: "Separation is optional",
        outcome: "Separation is essential for clarity.",
        isCorrect: false,
      },
      {
        id: "only-big",
        text: "Only big businesses need separate accounts",
        outcome: "Small businesses benefit from separation too.",
        isCorrect: false,
      },
      {
        id: "no-records",
        text: "Records are unnecessary",
        outcome: "Records are essential for strong finances.",
        isCorrect: false,
      }
    ],
  },
];

const SeparateBankAccounts = () => {
  const location = useLocation();
  const gameId = "finance-business-livelihood-finance-37";
  const gameData = getGameDataById(gameId);
  const totalStages = SEPARATE_BANK_ACCOUNTS_STAGES.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const totalCoins = gameData?.coins ?? location.state?.totalCoins ?? 5;
  const coinsPerLevel = Math.max(1, Math.floor(totalCoins / totalStages));
  const totalXp = gameData?.xp ?? location.state?.totalXp ?? 10;
  const stage = SEPARATE_BANK_ACCOUNTS_STAGES[currentStageIndex];

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
      title="Separate Bank Accounts"
      subtitle={
        showResult
          ? "Quiz complete! You now know why separation shows true performance."
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

export default SeparateBankAccounts;
