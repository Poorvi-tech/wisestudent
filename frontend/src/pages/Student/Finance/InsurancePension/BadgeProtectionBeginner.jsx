import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const STAGES = [
  {
    id: 1,
    prompt: "What does paying an insurance premium primarily do?",
    options: [
      {
        id: "buys-protection",
        text: "Buys financial protection against risks",
        outcome: "Correct. Premiums purchase risk protection.",
        isCorrect: true,
      },
      {
        id: "guarantee-returns",
        text: "Guarantees investment returns",
        outcome: "Insurance is protection, not a guaranteed-return product.",
        isCorrect: false,
      },
      
      {
        id: "removes-expenses",
        text: "Removes all expenses from life",
        outcome: "No plan can remove all expenses.",
        isCorrect: false,
      },
      {
        id: "optional-always",
        text: "Is always optional for everyone",
        outcome: "Protection need depends on risk and responsibilities.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 2,
    prompt: "What is a claim in insurance?",
    options: [
      {
        id: "otp-sharing",
        text: "Sharing OTP with an agent",
        outcome: "Never share OTP. Claims are formal benefit requests.",
        isCorrect: false,
      },
      
      {
        id: "premium-refund",
        text: "A refund of premiums at any time",
        outcome: "Refunds are not what a claim means.",
        isCorrect: false,
      },
      {
        id: "random-inspection",
        text: "A routine inspection visit",
        outcome: "Inspections may happen, but a claim is a benefit request.",
        isCorrect: false,
      },
      {
        id: "compensation-request",
        text: "A request for compensation per policy terms",
        outcome: "Correct. A claim asks the insurer to pay as per coverage.",
        isCorrect: true,
      },
    ],
  },
  {
    id: 3,
    prompt: "Insurance helps families mainly by…",
    options: [
      {
        id: "eliminate-risk",
        text: "Eliminating all risk",
        outcome: "Risk cannot be eliminated; it can be managed.",
        isCorrect: false,
      },
      
      {
        id: "increase-salary",
        text: "Increasing monthly salary",
        outcome: "Insurance is not income generation.",
        isCorrect: false,
      },
      {
        id: "manage-uncertainty",
        text: "Managing financial uncertainty from big events",
        outcome: "Correct. Insurance transfers part of the financial risk.",
        isCorrect: true,
      },
      {
        id: "free-money",
        text: "Providing free money anytime",
        outcome: "Benefits depend on events and policy terms.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 4,
    prompt: "Why read policy terms and exclusions carefully?",
    options: [
      {
        id: "colour-choice",
        text: "To choose the best brochure colour",
        outcome: "Colour doesn’t matter; coverage details do.",
        isCorrect: false,
      },
       {
        id: "understand-coverage",
        text: "To understand when claims are payable",
        outcome: "Correct. Terms and exclusions define benefits.",
        isCorrect: true,
      },
      {
        id: "sales-pitch",
        text: "Because sales pitch decides claim",
        outcome: "Claims are decided by written terms, not sales talk.",
        isCorrect: false,
      },
     
      {
        id: "never-needed",
        text: "Reading is never needed",
        outcome: "Skipping terms risks unpleasant claim surprises.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 5,
    prompt: "Which is a good beginner’s protection habit?",
    options: [
      {
        id: "confirm-coverage",
        text: "Start small: confirm basic coverage and keep documents",
        outcome: "Correct. Build habits: right cover and documentation.",
        isCorrect: true,
      },
      {
        id: "no-planning",
        text: "Avoid all planning",
        outcome: "No planning leaves families exposed.",
        isCorrect: false,
      },
      
      {
        id: "share-otp",
        text: "Share OTP if asked on phone",
        outcome: "Never share OTP; risk of fraud.",
        isCorrect: false,
      },
      {
        id: "assume-free",
        text: "Assume every event is covered",
        outcome: "Coverage is specific; assumptions can be costly.",
        isCorrect: false,
      },
    ],
  },
];

const BadgeProtectionBeginner = () => {
  const location = useLocation();
  const gameId = "finance-insurance-pension-10";
  const gameData = getGameDataById(gameId);
  const totalStages = STAGES.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const totalCoins = gameData?.coins ?? location.state?.totalCoins ?? 5;
  const coinsPerLevel = Math.max(1, Math.floor(totalCoins / totalStages));
  const totalXp = gameData?.xp ?? location.state?.totalXp ?? 10;
  const stage = STAGES[currentStageIndex];

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
      title="Badge: Protection Beginner"
      subtitle={
        showResult
          ? "Achievement unlocked! You earned the Protection Beginner badge."
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
        {selectedChoice && !showResult && (
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
        {showResult && (
          <div className="rounded-2xl bg-white/10 border border-white/20 p-6 text-white text-center">
            <div className="text-3xl font-extrabold mb-2">🏅 Protection Beginner</div>
            <div className="text-white/80">
              You completed 5 protection basics challenges and earned a badge!
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default BadgeProtectionBeginner;

