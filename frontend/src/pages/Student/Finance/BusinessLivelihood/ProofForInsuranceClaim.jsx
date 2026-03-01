import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const PROOF_FOR_INSURANCE_CLAIM_STAGES = [
  {
    id: 1,
    prompt: "A business loses goods but has invoices. What benefit do invoices give?",
    options: [
      {
        id: "decoration",
        text: "Decoration",
        outcome: "Invoices are for proof, not decoration.",
        isCorrect: false,
      },
      {
        id: "proof-value",
        text: "Proof of value for claim or compensation",
        outcome: "Correct. Documents support financial recovery.",
        isCorrect: true,
      },
      {
        id: "no-use",
        text: "No use",
        outcome: "Invoices are critical for claims.",
        isCorrect: false,
      },
      {
        id: "tax-only",
        text: "Only tax record",
        outcome: "Invoices help with tax and claims.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 2,
    prompt: "Why do insurers ask for invoices?",
    options: [
      {
        id: "delay-claim",
        text: "To delay the claim",
        outcome: "Invoices are for verification, not delay.",
        isCorrect: false,
      },
      {
        id: "avoid-claims",
        text: "To avoid paying claims",
        outcome: "Insurers use proof to assess claims fairly.",
        isCorrect: false,
      },
      {
        id: "skip-records",
        text: "To remove the need for records",
        outcome: "Invoices are part of records, not a replacement for them.",
        isCorrect: false,
      },
      {
        id: "verify-value",
        text: "To verify the value of goods lost",
        outcome: "Correct. Proof helps determine compensation.",
        isCorrect: true,
      }
    ],
  },
  {
    id: 3,
    prompt: "What risk increases when invoices are missing?",
    options: [
      {
        id: "claim-rejection",
        text: "Claim delays or rejection",
        outcome: "Correct. Lack of proof can delay or deny claims.",
        isCorrect: true,
      },
      {
        id: "more-profit",
        text: "More profit automatically",
        outcome: "Missing invoices do not increase profit.",
        isCorrect: false,
      },
      {
        id: "faster-recovery",
        text: "Faster recovery",
        outcome: "Recovery is harder without proof.",
        isCorrect: false,
      },
      {
        id: "no-impact",
        text: "No impact",
        outcome: "Missing invoices have real impact.",
        isCorrect: false,
      }
    ],
  },
  {
    id: 4,
    prompt: "What is a simple habit to support insurance claims?",
    options: [
      {
        id: "avoid-bills",
        text: "Avoid invoices to save time",
        outcome: "Skipping invoices weakens proof.",
        isCorrect: false,
      },
      {
        id: "memory-only",
        text: "Rely on memory of purchases",
        outcome: "Memory is unreliable for claims.",
        isCorrect: false,
      },
      {
        id: "store-invoices",
        text: "Store invoices safely and digitally",
        outcome: "Correct. Safe storage speeds claims.",
        isCorrect: true,
      },
      {
        id: "delay-records",
        text: "Record only after a loss",
        outcome: "Records are needed before a loss.",
        isCorrect: false,
      }
    ],
  },
  {
    id: 5,
    prompt: "What is the key takeaway about proof for insurance claims?",
    options: [
      {
        id: "documents-recovery",
        text: "Documents support financial recovery",
        outcome: "Correct. Proof strengthens claims.",
        isCorrect: true,
      },
      {
        id: "optional",
        text: "Invoices are optional",
        outcome: "Invoices are essential for strong claims.",
        isCorrect: false,
      },
      {
        id: "no-impact",
        text: "Documents make no impact",
        outcome: "Documents directly impact claim outcomes.",
        isCorrect: false,
      },
      {
        id: "tax-only",
        text: "Invoices are only for tax",
        outcome: "Invoices help with tax and claims.",
        isCorrect: false,
      }
    ],
  },
];

const ProofForInsuranceClaim = () => {
  const location = useLocation();
  const gameId = "finance-business-livelihood-finance-91";
  const gameData = getGameDataById(gameId);
  const totalStages = PROOF_FOR_INSURANCE_CLAIM_STAGES.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const totalCoins = gameData?.coins ?? location.state?.totalCoins ?? 10;
  const coinsPerLevel = Math.max(1, Math.floor(totalCoins / totalStages));
  const totalXp = gameData?.xp ?? location.state?.totalXp ?? 20;
  const stage = PROOF_FOR_INSURANCE_CLAIM_STAGES[currentStageIndex];

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
      title="Proof for Insurance Claim"
      subtitle={
        showResult
          ? "Quiz complete! You now know why documents support recovery."
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

export default ProofForInsuranceClaim;
