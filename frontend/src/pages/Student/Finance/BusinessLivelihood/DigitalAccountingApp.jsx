import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const DIGITAL_ACCOUNTING_APP_STAGES = [
  {
    id: 1,
    prompt: "A trader starts using simple digital ledger app. What improves?",
    options: [
      {
        id: "decoration",
        text: "Decoration",
        outcome: "Digital tools are for tracking, not decoration.",
        isCorrect: false,
      },
      {
        id: "accuracy-tracking",
        text: "Accuracy and easy tracking",
        outcome: "Correct. Digital tools simplify record discipline.",
        isCorrect: true,
      },
      {
        id: "electricity-use",
        text: "Electricity use",
        outcome: "Electricity use is not the key benefit.",
        isCorrect: false,
      },
      {
        id: "sales-speed",
        text: "Sales speed only",
        outcome: "Tracking improves decisions, not just speed.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 2,
    prompt: "Why are digital ledger apps useful?",
    options: [
      {
        id: "easy-records",
        text: "They organize records automatically",
        outcome: "Correct. Organization reduces errors.",
        isCorrect: true,
      },
      {
        id: "avoid-customers",
        text: "They help avoid customers",
        outcome: "Apps are for clarity, not avoidance.",
        isCorrect: false,
      },
      {
        id: "skip-bills",
        text: "They remove the need for bills",
        outcome: "Bills are still important for proof.",
        isCorrect: false,
      },
      {
        id: "increase-prices",
        text: "They increase prices automatically",
        outcome: "Apps do not change prices.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 3,
    prompt: "What problem can digital records help reduce?",
    options: [
      {
        id: "errors",
        text: "Calculation errors and missed entries",
        outcome: "Correct. Digital tools reduce mistakes.",
        isCorrect: true,
      },
      {
        id: "more-profit",
        text: "More profit automatically",
        outcome: "Profit still depends on sales and costs.",
        isCorrect: false,
      },
      {
        id: "no-costs",
        text: "No business costs",
        outcome: "Costs still exist, but records clarify them.",
        isCorrect: false,
      },
      {
        id: "no-planning",
        text: "No need for planning",
        outcome: "Planning is still essential.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 4,
    prompt: "What is a smart habit when using a ledger app?",
    options: [
      {
        id: "daily-entries",
        text: "Enter sales and expenses daily",
        outcome: "Correct. Regular updates keep records accurate.",
        isCorrect: true,
      },
      {
        id: "delay-forever",
        text: "Enter only at year-end",
        outcome: "Year-end entries miss daily insights.",
        isCorrect: false,
      },
      {
        id: "ignore-backup",
        text: "Ignore backups",
        outcome: "Backups protect important data.",
        isCorrect: false,
      },
      {
        id: "share-password",
        text: "Share password widely",
        outcome: "Sharing passwords risks data errors.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 5,
    prompt: "What is the key takeaway about digital accounting apps?",
    options: [
      {
        id: "simplify",
        text: "Digital tools simplify record discipline",
        outcome: "Correct. Easy tracking improves control.",
        isCorrect: true,
      },
      {
        id: "optional",
        text: "Digital tools are optional for tracking",
        outcome: "They are not required, but very helpful.",
        isCorrect: false,
      },
      {
        id: "no-impact",
        text: "They make no impact",
        outcome: "They improve accuracy and tracking.",
        isCorrect: false,
      },
      {
        id: "sales-only",
        text: "They only improve sales speed",
        outcome: "They primarily improve accuracy and clarity.",
        isCorrect: false,
      },
    ],
  },
];

const DigitalAccountingApp = () => {
  const location = useLocation();
  const gameId = "finance-business-livelihood-finance-40";
  const gameData = getGameDataById(gameId);
  const totalStages = DIGITAL_ACCOUNTING_APP_STAGES.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const totalCoins = gameData?.coins ?? location.state?.totalCoins ?? 10;
  const coinsPerLevel = Math.max(1, Math.floor(totalCoins / totalStages));
  const totalXp = gameData?.xp ?? location.state?.totalXp ?? 20;
  const stage = DIGITAL_ACCOUNTING_APP_STAGES[currentStageIndex];

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
      title="Digital Accounting App"
      subtitle={
        showResult
          ? "Quiz complete! You now know how digital tools improve records."
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

export default DigitalAccountingApp;
