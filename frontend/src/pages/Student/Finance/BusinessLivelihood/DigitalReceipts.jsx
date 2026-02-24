import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const DIGITAL_RECEIPTS_STAGES = [
  {
    id: 1,
    prompt: "A shop sends digital receipt after payment. What benefit does this give?",
    options: [
      {
        id: "extra-cost",
        text: "Extra cost",
        outcome: "Digital receipts usually reduce costs and errors.",
        isCorrect: false,
      },
      {
        id: "slower-business",
        text: "Slower business",
        outcome: "Receipts can be instant and efficient.",
        isCorrect: false,
      },
      {
        id: "clear-proof",
        text: "Clear proof for customer and seller",
        outcome: "Correct. Digital proof improves transparency.",
        isCorrect: true,
      },
      {
        id: "less-profit",
        text: "Less profit",
        outcome: "Proof does not reduce profit; it protects it.",
        isCorrect: false,
      }
    ],
  },
  {
    id: 2,
    prompt: "Why do customers value digital receipts?",
    options: [
      {
        id: "avoid-payment",
        text: "They help avoid paying",
        outcome: "Receipts confirm payment, not avoid it.",
        isCorrect: false,
      },
      {
        id: "increase-price",
        text: "They increase prices",
        outcome: "Receipts do not increase prices.",
        isCorrect: false,
      },
      {
        id: "skip-service",
        text: "They replace good service",
        outcome: "Service still matters, receipts only support it.",
        isCorrect: false,
      },
      {
        id: "proof-claim",
        text: "They provide proof for returns or warranty",
        outcome: "Correct. Proof supports customer claims.",
        isCorrect: true,
      }
    ],
  },
  {
    id: 3,
    prompt: "How do digital receipts help a business?",
    options: [
      {
        id: "hide-sales",
        text: "They hide sales",
        outcome: "Digital receipts make sales more visible.",
        isCorrect: false,
      },
      {
        id: "record-keeping",
        text: "They keep records organized and searchable",
        outcome: "Correct. Digital records are easy to store and find.",
        isCorrect: true,
      },
      {
        id: "avoid-taxes",
        text: "They avoid taxes",
        outcome: "Receipts support compliance, not avoidance.",
        isCorrect: false,
      },
      {
        id: "reduce-customers",
        text: "They reduce customers",
        outcome: "Transparency often builds loyalty.",
        isCorrect: false,
      }
    ],
  },
  {
    id: 4,
    prompt: "What is a simple way to send digital receipts?",
    options: [
      {
        id: "sms-whatsapp",
        text: "Send via SMS or WhatsApp after payment",
        outcome: "Correct. Simple tools create quick proof.",
        isCorrect: true,
      },
      {
        id: "verbal-only",
        text: "Give verbal confirmation only",
        outcome: "Verbal confirmation is hard to prove later.",
        isCorrect: false,
      },
      {
        id: "no-receipts",
        text: "Avoid receipts to save time",
        outcome: "Receipts protect both sides and save disputes.",
        isCorrect: false,
      },
      {
        id: "delay-days",
        text: "Send receipts days later",
        outcome: "Receipts are most useful immediately.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 5,
    prompt: "What is the key takeaway about digital receipts?",
    options: [
      {
        id: "optional",
        text: "Receipts are optional",
        outcome: "Receipts are important for proof.",
        isCorrect: false,
      },
      {
        id: "transparency",
        text: "Digital proof improves transparency",
        outcome: "Correct. Records strengthen trust and clarity.",
        isCorrect: true,
      },
      {
        id: "slow-business",
        text: "Receipts slow business",
        outcome: "Digital receipts are fast and efficient.",
        isCorrect: false,
      },
      {
        id: "only-large",
        text: "Only large shops need receipts",
        outcome: "Small shops benefit just as much.",
        isCorrect: false,
      }
    ],
  },
];

const DigitalReceipts = () => {
  const location = useLocation();
  const gameId = "finance-business-livelihood-finance-43";
  const gameData = getGameDataById(gameId);
  const totalStages = DIGITAL_RECEIPTS_STAGES.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const totalCoins = gameData?.coins ?? location.state?.totalCoins ?? 5;
  const coinsPerLevel = Math.max(1, Math.floor(totalCoins / totalStages));
  const totalXp = gameData?.xp ?? location.state?.totalXp ?? 10;
  const stage = DIGITAL_RECEIPTS_STAGES[currentStageIndex];

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
      title="Digital Receipts"
      subtitle={
        showResult
          ? "Quiz complete! You now know how digital proof improves transparency."
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

export default DigitalReceipts;
