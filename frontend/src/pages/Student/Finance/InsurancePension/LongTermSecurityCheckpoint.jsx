import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const LONG_TERM_SECURITY_CHECKPOINT_STAGES = [
  {
    id: 1,
    prompt: "Multiple scenarios appear. Best guiding rule?",
    options: [
      {
        id: "today-only",
        text: "Focus only on today",
        outcome:
          "Ignoring the future can create long-term instability.",
        isCorrect: false,
      },
      {
        id: "balance",
        text: "Balance present needs and future security",
        outcome:
          "Correct. Consistent planning creates stability over life.",
        isCorrect: true,
      },
      {
        id: "depend-luck",
        text: "Depend on luck",
        outcome:
          "Luck is not a reliable financial strategy.",
        isCorrect: false,
      },
      {
        id: "ignore-planning",
        text: "Ignore planning",
        outcome:
          "Planning protects you through changing situations.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 2,
    prompt: "Why is balancing present and future important?",
    options: [
      {
        id: "future-security",
        text: "It protects both current needs and future goals",
        outcome:
          "Correct. Balance keeps life stable over time.",
        isCorrect: true,
      },
      {
        id: "spend-all",
        text: "It means spending everything now",
        outcome:
          "Spending everything removes future security.",
        isCorrect: false,
      },
      {
        id: "ignore-future",
        text: "It means ignoring the future",
        outcome:
          "Balance includes planning for the future.",
        isCorrect: false,
      },
      {
        id: "guarantee-profit",
        text: "It guarantees profit",
        outcome:
          "No plan can guarantee profit.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 3,
    prompt: "What does consistent planning help you handle?",
    options: [
      {
        id: "unexpected",
        text: "Unexpected events and long-term goals",
        outcome:
          "Correct. Planning prepares you for change.",
        isCorrect: true,
      },
      {
        id: "no-change",
        text: "Nothing, because life never changes",
        outcome:
          "Life changes often, so planning is valuable.",
        isCorrect: false,
      },
      {
        id: "instant-wealth",
        text: "Instant wealth",
        outcome:
          "Planning is about steady progress, not instant wealth.",
        isCorrect: false,
      },
      {
        id: "no-risks",
        text: "Removing all risks",
        outcome:
          "Planning reduces financial risk, but doesn't remove all risk.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 4,
    prompt: "Which habit best supports long-term security?",
    options: [
      {
        id: "steady-saving",
        text: "Steady saving and review of goals",
        outcome:
          "Correct. Regular review keeps plans on track.",
        isCorrect: true,
      },
      {
        id: "spend-all",
        text: "Spend everything now",
        outcome:
          "Spending everything removes future stability.",
        isCorrect: false,
      },
      {
        id: "ignore-plans",
        text: "Ignore plans",
        outcome:
          "Ignoring plans increases future risk.",
        isCorrect: false,
      },
      {
        id: "depend-others",
        text: "Depend on others",
        outcome:
          "Dependence is uncertain and risky.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 5,
    prompt: "What is the key takeaway from this checkpoint?",
    options: [
      {
        id: "balance",
        text: "Balance present needs with future security",
        outcome:
          "Correct. Consistent planning creates stability over life.",
        isCorrect: true,
      },
      {
        id: "luck",
        text: "Depend on luck",
        outcome:
          "Luck is unreliable for financial stability.",
        isCorrect: false,
      },
      {
        id: "today-only",
        text: "Focus only on today",
        outcome:
          "Ignoring the future increases risk.",
        isCorrect: false,
      },
      {
        id: "no-plan",
        text: "Ignore planning",
        outcome:
          "Planning creates long-term stability.",
        isCorrect: false,
      },
    ],
  },
];

const LongTermSecurityCheckpoint = () => {
  const location = useLocation();
  const gameId = "finance-insurance-pension-25";
  const gameData = getGameDataById(gameId);
  const totalStages = LONG_TERM_SECURITY_CHECKPOINT_STAGES.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const totalCoins = gameData?.coins ?? location.state?.totalCoins ?? 5;
  const coinsPerLevel = Math.max(1, Math.floor(totalCoins / totalStages));
  const totalXp = gameData?.xp ?? location.state?.totalXp ?? 10;
  const stage = LONG_TERM_SECURITY_CHECKPOINT_STAGES[currentStageIndex];

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
      title="Long-Term Security Checkpoint"
      subtitle={
        showResult
          ? "Quiz complete! You understand why balance builds stability."
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

export default LongTermSecurityCheckpoint;
