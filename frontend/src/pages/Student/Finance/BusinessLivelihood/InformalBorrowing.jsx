import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const INFORMAL_BORROWING_STAGES = [
  {
    id: 1,
    prompt: "A shop owner borrows from a local lender without record. What risk exists?",
    options: [
      {
        id: "disputes-proof",
        text: "Disputes and unclear repayment proof",
        outcome: "Correct. Written records prevent conflicts.",
        isCorrect: true,
      },
      {
        id: "no-risk",
        text: "No risk",
        outcome: "Borrowing without records can create disputes.",
        isCorrect: false,
      },
      {
        id: "free-money",
        text: "Free money",
        outcome: "Borrowed money must be repaid.",
        isCorrect: false,
      },
      {
        id: "guaranteed-growth",
        text: "Guaranteed growth",
        outcome: "Loans can help, but growth is never guaranteed.",
        isCorrect: false,
      }
    ],
  },
  {
    id: 2,
    prompt: "Why is a written loan record important?",
    options: [
      {
        id: "avoid-repay",
        text: "It helps avoid repayment",
        outcome: "Records ensure repayment is clear, not avoidable.",
        isCorrect: false,
      },
      {
        id: "increase-interest",
        text: "It increases interest automatically",
        outcome: "Interest should be agreed, not automatic.",
        isCorrect: false,
      },
      {
        id: "clear-terms",
        text: "It shows amount, interest, and repayment terms",
        outcome: "Correct. Clear terms reduce misunderstandings.",
        isCorrect: true,
      },
      {
        id: "replace-trust",
        text: "It replaces trust completely",
        outcome: "Trust matters, but records protect both sides.",
        isCorrect: false,
      }
    ],
  },
  {
    id: 3,
    prompt: "What is a common problem with informal borrowing?",
    options: [
      {
        id: "clear-ledger",
        text: "Clear ledger always exists",
        outcome: "Informal loans often lack clear ledgers.",
        isCorrect: false,
      },
      {
        id: "lower-risk",
        text: "Lower risk than formal loans",
        outcome: "Informal loans can be riskier due to unclear terms.",
        isCorrect: false,
      },
      {
        id: "guaranteed-approval",
        text: "Guaranteed approval always helps",
        outcome: "Approval may be easy, but terms can be unclear.",
        isCorrect: false,
      },
      {
        id: "changing-terms",
        text: "Terms can change or be disputed later",
        outcome: "Correct. Without records, disputes are common.",
        isCorrect: true,
      }
    ],
  },
  {
    id: 4,
    prompt: "What is a safe step when borrowing from a local lender?",
    options: [
      {
        id: "verbal-only",
        text: "Keep it verbal only",
        outcome: "Verbal promises can be misunderstood.",
        isCorrect: false,
      },
      {
        id: "written-agreement",
        text: "Write down the amount and repayment schedule",
        outcome: "Correct. Even a simple written agreement helps.",
        isCorrect: true,
      },
      {
        id: "no-witness",
        text: "Avoid witnesses and records",
        outcome: "Witnesses and notes protect both sides.",
        isCorrect: false,
      },
      {
        id: "delay-repay",
        text: "Delay repayment and hope",
        outcome: "Delays create conflicts and penalties.",
        isCorrect: false,
      }
    ],
  },
  {
    id: 5,
    prompt: "What is the key takeaway about informal borrowing?",
    options: [
      {
        id: "records-unneeded",
        text: "Records are unnecessary for small loans",
        outcome: "Even small loans need clear records.",
        isCorrect: false,
      },
      {
        id: "borrow-anytime",
        text: "Borrow anytime without planning",
        outcome: "Borrowing should be planned with clear terms.",
        isCorrect: false,
      },
      {
        id: "trust-only",
        text: "Trust alone is enough",
        outcome: "Trust plus records is safer.",
        isCorrect: false,
      },
      {
        id: "written-proofs",
        text: "Written records prevent disputes",
        outcome: "Correct. Documentation protects both borrower and lender.",
        isCorrect: true,
      }
    ],
  },
];

const InformalBorrowing = () => {
  const location = useLocation();
  const gameId = "finance-business-livelihood-finance-8";
  const gameData = getGameDataById(gameId);
  const totalStages = INFORMAL_BORROWING_STAGES.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const totalCoins = gameData?.coins ?? location.state?.totalCoins ?? 5;
  const coinsPerLevel = Math.max(1, Math.floor(totalCoins / totalStages));
  const totalXp = gameData?.xp ?? location.state?.totalXp ?? 10;
  const stage = INFORMAL_BORROWING_STAGES[currentStageIndex];

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
      title="Informal Borrowing"
      subtitle={
        showResult
          ? "Quiz complete! You now understand why written records prevent disputes."
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

export default InformalBorrowing;
