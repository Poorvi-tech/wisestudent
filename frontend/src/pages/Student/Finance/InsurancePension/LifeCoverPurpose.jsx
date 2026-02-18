import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const LIFE_COVER_PURPOSE_STAGES = [
  {
    id: 1,
    prompt: "A father is sole earner for family. Why consider life insurance?",
    options: [
      {
        id: "luxury-bonus",
        text: "For luxury bonus",
        outcome:
          "Life insurance is about protection, not luxury spending.",
        isCorrect: false,
      },
      {
        id: "tax-only",
        text: "For tax only",
        outcome:
          "Tax benefits can be a side benefit, but protection is the main purpose.",
        isCorrect: false,
      },
      {
        id: "protect-income",
        text: "To protect family income",
        outcome:
          "Correct. Life cover protects dependents from income loss.",
        isCorrect: true,
      },
      {
        id: "travel-benefits",
        text: "For travel benefits",
        outcome:
          "Travel perks are not the main reason to buy life insurance.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 2,
    prompt: "Who benefits most from a life insurance payout?",
    options: [
      {
        id: "no-dependents",
        text: "Only people with no dependents",
        outcome:
          "Life insurance is most helpful when others rely on your income.",
        isCorrect: false,
      },
      {
        id: "dependents",
        text: "Dependents who rely on the earner's income",
        outcome:
          "Correct. It helps cover living expenses and obligations.",
        isCorrect: true,
      },
      {
        id: "insurance-company",
        text: "The insurance company only",
        outcome:
          "The payout is meant for beneficiaries, not the insurer.",
        isCorrect: false,
      },
      {
        id: "employer",
        text: "The employer",
        outcome:
          "The employer does not receive the benefit in a personal policy.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 3,
    prompt: "Which costs can life insurance help cover if the earner dies?",
    options: [
      {
        id: "no-costs",
        text: "None, it has no financial impact",
        outcome:
          "It can provide funds to meet real obligations and daily needs.",
        isCorrect: false,
      },
      {
        id: "daily-and-debts",
        text: "Daily living costs, loans, and education expenses",
        outcome:
          "Correct. It can help cover ongoing expenses and major commitments.",
        isCorrect: true,
      },
      {
        id: "luxury-only",
        text: "Only luxury spending",
        outcome:
          "Protection is about essentials, not luxury consumption.",
        isCorrect: false,
      },
      {
        id: "tax-fines",
        text: "Only tax fines",
        outcome:
          "Life cover is broader than just tax-related issues.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 4,
    prompt: "What should determine how much life cover a family needs?",
    options: [
      {
        id: "income-and-obligations",
        text: "Income replacement needs and family obligations",
        outcome:
          "Correct. Coverage should reflect dependents, debts, and future goals.",
        isCorrect: true,
      },
      {
        id: "random-amount",
        text: "A random number",
        outcome:
          "Coverage should be based on real needs and obligations.",
        isCorrect: false,
      },
      {
        id: "friend-choice",
        text: "Whatever a friend buys",
        outcome:
          "Every family's needs are different.",
        isCorrect: false,
      },
      {
        id: "minimum-possible",
        text: "Always the minimum possible",
        outcome:
          "Too little coverage may not protect the family adequately.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 5,
    prompt: "What is a key outcome of having life cover for a family?",
    options: [
      {
        id: "no-need-budget",
        text: "No need for a budget ever again",
        outcome:
          "Families still need to budget and plan even with coverage.",
        isCorrect: false,
      },
      {
        id: "guaranteed-profit",
        text: "Guaranteed profits every year",
        outcome:
          "Life insurance is for protection, not guaranteed profit.",
        isCorrect: false,
      },
      {
        id: "no-emergencies",
        text: "No emergencies will happen",
        outcome:
          "Coverage doesn't prevent emergencies; it reduces financial impact.",
        isCorrect: false,
      },
      {
        id: "financial-stability",
        text: "Better financial stability if income is lost",
        outcome:
          "Correct. It helps dependents maintain stability during a crisis.",
        isCorrect: true,
      },
    ],
  },
];

const LifeCoverPurpose = () => {
  const location = useLocation();
  const gameId = "finance-insurance-pension-5";
  const gameData = getGameDataById(gameId);
  const totalStages = LIFE_COVER_PURPOSE_STAGES.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const totalCoins = gameData?.coins ?? location.state?.totalCoins ?? 5;
  const coinsPerLevel = Math.max(1, Math.floor(totalCoins / totalStages));
  const totalXp = gameData?.xp ?? location.state?.totalXp ?? 10;
  const stage = LIFE_COVER_PURPOSE_STAGES[currentStageIndex];

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
      title="Life Cover Purpose"
      subtitle={
        showResult
          ? "Quiz complete! You understand why life cover protects dependents."
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

export default LifeCoverPurpose;
