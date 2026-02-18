import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const SUDDEN_HOSPITAL_BILL_STAGES = [
  {
    id: 1,
    prompt:
      "A worker is hospitalised and treatment costs Rs 1.5 lakh. What is insurance meant to do?",
    options: [
      {
        id: "increase-income",
        text: "Increase income",
        outcome:
          "Insurance does not increase regular income. It protects you from sudden large costs.",
        isCorrect: false,
      },
      {
        id: "replace-savings",
        text: "Replace savings completely",
        outcome:
          "Insurance helps with risk, but savings are still important for day-to-day and planned needs.",
        isCorrect: false,
      },
      {
        id: "remove-expenses",
        text: "Remove all expenses",
        outcome:
          "No policy removes all costs. Insurance reduces the financial shock from major events.",
        isCorrect: false,
      },
      {
        id: "reduce-risk",
        text: "Reduce financial risk",
        outcome:
          "Correct. Insurance protects against large unexpected costs like hospital bills.",
        isCorrect: true,
      },
    ],
  },
  {
    id: 2,
    prompt: "If a family has no health insurance and a medical emergency happens, what is most likely?",
    options: [
      {
        id: "no-cost",
        text: "Hospital treatment becomes free",
        outcome:
          "Hospitals usually charge full amounts. Without insurance, the family pays from pocket.",
        isCorrect: false,
      },
      {
        id: "out-of-pocket",
        text: "They may need to use savings or borrow money",
        outcome:
          "Correct. Uninsured emergencies often force families to dip into savings or take debt.",
        isCorrect: true,
      },
      {
        id: "income-rise",
        text: "Their income immediately increases",
        outcome:
          "Income does not increase automatically after a medical emergency.",
        isCorrect: false,
      },
      {
        id: "tax-waiver",
        text: "All taxes are waived",
        outcome:
          "Taxes and medical expenses are separate. A medical emergency does not waive all taxes.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 3,
    prompt: "What is the key reason to buy insurance before an emergency happens?",
    options: [
      {
        id: "after-event",
        text: "You can buy it after the emergency to cover that cost",
        outcome:
          "Insurance must be active before the event. It cannot usually cover costs from a past event.",
        isCorrect: false,
      },
      {
        id: "predict-market",
        text: "It predicts market returns",
        outcome:
          "Insurance is for protection, not for predicting market returns.",
        isCorrect: false,
      },
      {
        id: "risk-transfer",
        text: "It transfers part of the financial risk to the insurer",
        outcome:
          "Correct. You pay a premium so the insurer covers large eligible losses.",
        isCorrect: true,
      },
      {
        id: "double-salary",
        text: "It doubles your monthly salary",
        outcome:
          "Insurance does not double salary. It protects against specific risks.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 4,
    prompt: "How do insurance premiums help in financial planning?",
    options: [
      {
        id: "uncertain-large",
        text: "By replacing one huge uncertain cost with a smaller planned payment",
        outcome:
          "Correct. Premiums make risk costs more predictable and easier to budget.",
        isCorrect: true,
      },
      {
        id: "no-budget",
        text: "By removing the need for any monthly budget",
        outcome:
          "You still need a budget. Premiums are one part of good planning.",
        isCorrect: false,
      },
      {
        id: "free-cover",
        text: "By giving free coverage without any conditions",
        outcome:
          "Coverage depends on policy terms, and premiums are required.",
        isCorrect: false,
      },
      {
        id: "all-losses",
        text: "By covering every possible loss in life",
        outcome:
          "Policies cover specific risks. No single policy covers everything.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 5,
    prompt: "What is the smartest approach for handling big future risks?",
    options: [
      {
        id: "only-savings",
        text: "Rely only on savings and skip insurance",
        outcome:
          "Savings help, but very large shocks can wipe them out without insurance protection.",
        isCorrect: false,
      },
      {
        id: "only-insurance",
        text: "Buy insurance and keep no emergency savings",
        outcome:
          "Insurance and savings work best together. Each serves a different purpose.",
        isCorrect: false,
      },
      {
        id: "ignore-risks",
        text: "Ignore risks and decide later",
        outcome:
          "Delaying protection can be costly if an emergency occurs before you prepare.",
        isCorrect: false,
      },
      {
        id: "balanced-plan",
        text: "Use both insurance and savings as a safety net",
        outcome:
          "Correct. A balanced plan uses insurance for major risk and savings for immediate needs.",
        isCorrect: true,
      },
    ],
  },
];

const SuddenHospitalBill = () => {
  const location = useLocation();
  const gameId = "finance-insurance-pension-1";
  const gameData = getGameDataById(gameId);
  const totalStages = SUDDEN_HOSPITAL_BILL_STAGES.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const totalCoins = gameData?.coins ?? location.state?.totalCoins ?? 5;
  const coinsPerLevel = Math.max(1, Math.floor(totalCoins / totalStages));
  const totalXp = gameData?.xp ?? location.state?.totalXp ?? 10;
  const stage = SUDDEN_HOSPITAL_BILL_STAGES[currentStageIndex];

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
      title="Sudden Hospital Bill"
      subtitle={
        showResult
          ? "Quiz complete! You understand insurance risk protection."
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

export default SuddenHospitalBill;
