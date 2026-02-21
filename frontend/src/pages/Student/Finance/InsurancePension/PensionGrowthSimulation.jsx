import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const STAGES = [
  {
    id: 1,
    prompt:
      "Invest ₹1,000 each year at steady growth. Which best describes compounding over 20 years?",
    options: [
      {
        id: "simple-interest",
        text: "Only principal grows; interest stays flat",
        outcome: "Compounding grows both principal and accumulated returns.",
        isCorrect: false,
      },
      {
        id: "compounding",
        text: "Returns earn returns; growth accelerates over time",
        outcome: "Correct. Compounding accelerates growth in later years.",
        isCorrect: true,
      },
      {
        id: "random",
        text: "Growth is random and unrelated to time",
        outcome: "A steady rate leads to compounding, not randomness.",
        isCorrect: false,
      },
      {
        id: "no-diff",
        text: "Compounding makes no real difference",
        outcome: "Compounding significantly increases long-term value.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 2,
    prompt:
      "If the annual growth is steady at 8%, which statement is most accurate?",
    options: [
      {
        id: "later-years-stronger",
        text: "Later years contribute more to growth than early years",
        outcome:
          "Correct. Larger base in later years leads to bigger annual gains.",
        isCorrect: true,
      },
      {
        id: "equal-every-year",
        text: "Each year adds exactly the same rupee gain",
        outcome: "With compounding, rupee gains increase over time.",
        isCorrect: false,
      },
      {
        id: "declining",
        text: "Growth declines each year automatically",
        outcome: "At steady rate, growth increases in rupee terms.",
        isCorrect: false,
      },
      {
        id: "only-first",
        text: "Only the first year’s investment grows",
        outcome: "All contributions grow over time.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 3,
    prompt:
      "After 20 years of investing ₹1,000 yearly at 8%, which is most reasonable?",
    options: [
      {
        id: "below-10k",
        text: "Total value under ₹10,000",
        outcome: "Too low; contributions alone are ₹20,000.",
        isCorrect: false,
      },
      {
        id: "around-46k",
        text: "Total value in the tens of thousands (e.g., ₹40–₹60k)",
        outcome:
          "Correct ballpark for a simple 8% steady growth with annual contributions.",
        isCorrect: true,
      },
      {
        id: "crores",
        text: "Multiple crores guaranteed",
        outcome: "Unrealistic for ₹1,000/yr over 20 years at 8%.",
        isCorrect: false,
      },
      {
        id: "same-20k",
        text: "Exactly ₹20,000 because only principal counts",
        outcome: "Compounding adds returns over principal.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 4,
    prompt:
      "If you increase the yearly contribution from ₹1,000 to ₹1,500 at the same rate, what happens?",
    options: [
      {
        id: "linear-only",
        text: "Value increases only by ₹10,000 total after 20 years",
        outcome: "Compounding on higher contributions increases value more than linearly.",
        isCorrect: false,
      },
      {
        id: "higher-base",
        text: "Higher contributions compound, increasing the final corpus faster",
        outcome: "Correct. Bigger base + compounding = larger final amount.",
        isCorrect: true,
      },
      {
        id: "no-change",
        text: "No change compared to ₹1,000",
        outcome: "Higher contribution increases final value.",
        isCorrect: false,
      },
      {
        id: "delay-great",
        text: "Better to delay contributions to the end",
        outcome: "Early, consistent contributions benefit more from compounding.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 5,
    prompt:
      "For long-term pension growth, which habit supports the largest corpus at retirement?",
    options: [
      {
        id: "early-consistent",
        text: "Start early, contribute consistently, and stay invested",
        outcome: "Correct. Time + consistency + compounding build the largest corpus.",
        isCorrect: true,
      },
      {
        id: "skip-often",
        text: "Skip contributions frequently",
        outcome: "Gaps reduce the compounding effect.",
        isCorrect: false,
      },
      {
        id: "withdraw-returns",
        text: "Withdraw returns each year",
        outcome: "Withdrawing erodes compounding benefits.",
        isCorrect: false,
      },
      {
        id: "churn",
        text: "Constantly switch funds without plan",
        outcome: "Unplanned churn can hurt long-term growth.",
        isCorrect: false,
      },
    ],
  },
];

const PensionGrowthSimulation = () => {
  const location = useLocation();
  const gameId = "finance-insurance-pension-36";
  const gameData = getGameDataById(gameId);
  const totalStages = STAGES.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const totalCoins = gameData?.coins ?? location.state?.totalCoins ?? 10;
  const coinsPerLevel = Math.max(2, Math.floor(totalCoins / totalStages));
  const totalXp = gameData?.xp ?? location.state?.totalXp ?? 20;
  const stage = STAGES[currentStageIndex];

  const handleChoice = (option) => {
    if (selectedChoice || !stage) return;
    setSelectedChoice(option);
    if (option.isCorrect) {
      setScore((s) => s + 1);
      showCorrectAnswerFeedback(1, true);
    }
    if (currentStageIndex === totalStages - 1) {
      setTimeout(() => setShowResult(true), 800);
    }
  };

  const handleNextStage = () => {
    if (!selectedChoice) return;
    if (currentStageIndex === totalStages - 1) {
      setShowResult(true);
    } else {
      setCurrentStageIndex((i) => i + 1);
    }
    setSelectedChoice(null);
  };

  const progressLabel = `${currentStageIndex + 1}/${totalStages}`;

  return (
    <GameShell
      title="Pension Growth Simulation"
      subtitle={
        showResult
          ? "Simulation complete! You understand long-term pension growth basics."
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

export default PensionGrowthSimulation;
