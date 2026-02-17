import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const INSURANCE_DECISION_CHECK_STAGES = [
  {
    id: 1,
    prompt:
      "A worker compares two policies but doesn’t know what to check. What matters most?",
    options: [
      {
        id: "agent-friendly",
        text: "Agent’s friendliness",
        outcome:
          "Friendliness is nice, but it doesn’t define coverage quality.",
        isCorrect: false,
      },
      {
        id: "coverage-claims",
        text: "Coverage and claim rules",
        outcome:
          "Correct. Protection value matters more than sales pitch.",
        isCorrect: true,
      },
      {
        id: "brochure-color",
        text: "Colour of brochure",
        outcome:
          "Design doesn’t change how the policy protects you.",
        isCorrect: false,
      },
      {
        id: "discount-only",
        text: "Premium discount only",
        outcome:
          "Price matters, but not at the expense of coverage.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 2,
    prompt: "Which item should be checked first when comparing policies?",
    options: [
      {
        id: "coverage-limits",
        text: "Coverage limits and exclusions",
        outcome:
          "Correct. Limits and exclusions define your real protection.",
        isCorrect: true,
      },
      {
        id: "agent-clothes",
        text: "The agent’s clothing style",
        outcome:
          "Appearance doesn’t affect policy protection.",
        isCorrect: false,
      },
      {
        id: "brochure-font",
        text: "The brochure font",
        outcome:
          "Fonts are not related to coverage terms.",
        isCorrect: false,
      },
      {
        id: "discounts-only",
        text: "Discounts only",
        outcome:
          "Discounts are secondary to actual coverage.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 3,
    prompt: "Why do claim rules matter in an insurance decision?",
    options: [
      {
        id: "faster-approval",
        text: "They decide when and how claims are paid",
        outcome:
          "Correct. Claim rules affect whether you get paid.",
        isCorrect: true,
      },
      {
        id: "no-effect",
        text: "They have no real effect",
        outcome:
          "Claim rules determine payout conditions.",
        isCorrect: false,
      },
      {
        id: "guarantee-profit",
        text: "They guarantee profits",
        outcome:
          "Insurance is protection, not guaranteed profit.",
        isCorrect: false,
      },
      {
        id: "remove-risk",
        text: "They remove all risks from life",
        outcome:
          "Insurance reduces financial risk, not all risk.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 4,
    prompt: "What is a smart way to evaluate a policy?",
    options: [
      {
        id: "compare-terms",
        text: "Compare coverage, exclusions, and claim process",
        outcome:
          "Correct. These define the real protection value.",
        isCorrect: true,
      },
      {
        id: "choose-cheapest",
        text: "Choose the cheapest without reading",
        outcome:
          "Cheap coverage may hide major gaps.",
        isCorrect: false,
      },
      {
        id: "choose-fast",
        text: "Choose the one sold fastest",
        outcome:
          "Speed of sale doesn’t reflect policy quality.",
        isCorrect: false,
      },
      {
        id: "ignore-terms",
        text: "Ignore the fine print",
        outcome:
          "Fine print includes exclusions and limits.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 5,
    prompt: "What is the main takeaway for insurance decisions?",
    options: [
      {
        id: "sales-pitch",
        text: "Sales pitch is the most important",
        outcome:
          "Sales pitch should never outweigh protection value.",
        isCorrect: false,
      },
      {
        id: "protection-value",
        text: "Protection value matters most",
        outcome:
          "Correct. Strong coverage matters more than presentation.",
        isCorrect: true,
      },
      {
        id: "color-choice",
        text: "Brochure color decides quality",
        outcome:
          "Design doesn’t define coverage.",
        isCorrect: false,
      },
      {
        id: "discount-first",
        text: "Discounts are all that matter",
        outcome:
          "Discounts are useful but not the main factor.",
        isCorrect: false,
      },
    ],
  },
];

const InsuranceDecisionCheck = () => {
  const location = useLocation();
  const gameId = "finance-insurance-pension-12";
  const gameData = getGameDataById(gameId);
  const totalStages = INSURANCE_DECISION_CHECK_STAGES.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const totalCoins = gameData?.coins ?? location.state?.totalCoins ?? 5;
  const coinsPerLevel = Math.max(1, Math.floor(totalCoins / totalStages));
  const totalXp = gameData?.xp ?? location.state?.totalXp ?? 10;
  const stage = INSURANCE_DECISION_CHECK_STAGES[currentStageIndex];

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
      title="Insurance Decision Check"
      subtitle={
        showResult
          ? "Quiz complete! You know how to evaluate policies."
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

export default InsuranceDecisionCheck;
