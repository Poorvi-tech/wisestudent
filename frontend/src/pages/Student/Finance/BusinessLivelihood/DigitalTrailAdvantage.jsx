import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const DIGITAL_TRAIL_ADVANTAGE_STAGES = [
  {
    id: 1,
    prompt: "A vendor accepts only digital payments. What long-term benefit exists?",
    options: [
      {
        id: "no-benefit",
        text: "No benefit",
        outcome: "Digital payments create useful records over time.",
        isCorrect: false,
      },
      {
        id: "less-work",
        text: "Less work",
        outcome: "Digital payments can help but still need discipline.",
        isCorrect: false,
      },
      {
        id: "lower-income",
        text: "Lower income",
        outcome: "Income depends on sales, not payment type.",
        isCorrect: false,
      },
      {
        id: "financial-history",
        text: "Easy financial history for loans or growth",
        outcome: "Correct. Transaction history supports expansion.",
        isCorrect: true,
      }
    ],
  },
  {
    id: 2,
    prompt: "Why does a digital trail help with loans?",
    options: [
      {
        id: "avoid-bank",
        text: "It helps avoid banks",
        outcome: "Digital trails help when working with banks.",
        isCorrect: false,
      },
      {
        id: "repayment-proof",
        text: "It shows consistent cash flow for repayment",
        outcome: "Correct. Lenders need proof of stability.",
        isCorrect: true,
      },
      {
        id: "skip-records",
        text: "It removes the need for records",
        outcome: "Records are still needed, not removed.",
        isCorrect: false,
      },
      {
        id: "guarantee-approval",
        text: "It guarantees approval",
        outcome: "Proof helps but does not guarantee approval.",
        isCorrect: false,
      }
    ],
  },
  {
    id: 3,
    prompt: "What is another benefit of digital-only payments?",
    options: [
      {
        id: "no-customers",
        text: "Fewer customers",
        outcome: "Digital options often attract more customers.",
        isCorrect: false,
      },
      {
        id: "slower-sales",
        text: "Slower sales",
        outcome: "Digital payments can be quick and convenient.",
        isCorrect: false,
      },
      {
        id: "less-cash-risk",
        text: "Lower risk of cash loss or theft",
        outcome: "Correct. Less cash handling reduces risk.",
        isCorrect: true,
      },
      {
        id: "no-proof",
        text: "No proof of payment",
        outcome: "Digital transactions create proof automatically.",
        isCorrect: false,
      }
    ],
  },
  {
    id: 4,
    prompt: "What is a smart habit when relying on digital payments?",
    options: [
      {
        id: "save-statements",
        text: "Save transaction statements regularly",
        outcome: "Correct. Statements build a clean history.",
        isCorrect: true,
      },
      {
        id: "ignore-notifications",
        text: "Ignore payment notifications",
        outcome: "Ignoring notifications can miss issues.",
        isCorrect: false,
      },
      {
        id: "share-otp",
        text: "Share OTPs to confirm payments",
        outcome: "Never share OTPs. It is unsafe.",
        isCorrect: false,
      },
      {
        id: "delay-records",
        text: "Delay recording until year-end",
        outcome: "Regular records are more reliable.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 5,
    prompt: "What is the key takeaway about digital trail advantage?",
    options: [
      {
        id: "optional",
        text: "Digital trails are optional",
        outcome: "A clear trail is valuable for growth.",
        isCorrect: false,
      },
      {
        id: "no-benefit",
        text: "There is no benefit",
        outcome: "Digital trails provide strong proof.",
        isCorrect: false,
      },
      {
        id: "history-growth",
        text: "Transaction history supports expansion",
        outcome: "Correct. Digital trails build credibility.",
        isCorrect: true,
      },
      {
        id: "lower-profit",
        text: "Digital trails lower profit",
        outcome: "Profit depends on sales and costs, not trails.",
        isCorrect: false,
      }
    ],
  },
];

const DigitalTrailAdvantage = () => {
  const location = useLocation();
  const gameId = "finance-business-livelihood-finance-24";
  const gameData = getGameDataById(gameId);
  const totalStages = DIGITAL_TRAIL_ADVANTAGE_STAGES.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const totalCoins = gameData?.coins ?? location.state?.totalCoins ?? 5;
  const coinsPerLevel = Math.max(1, Math.floor(totalCoins / totalStages));
  const totalXp = gameData?.xp ?? location.state?.totalXp ?? 10;
  const stage = DIGITAL_TRAIL_ADVANTAGE_STAGES[currentStageIndex];

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
      title="Digital Trail Advantage"
      subtitle={
        showResult
          ? "Quiz complete! You now know how transaction history supports expansion."
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

export default DigitalTrailAdvantage;
