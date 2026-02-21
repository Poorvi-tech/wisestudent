import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const STAGES = [
  {
    id: 1,
    prompt: "Which is the correct overall claim process order?",
    options: [
      {
        id: "correct-order",
        text: "Upload documents → Verification → Claim approved",
        outcome: "Correct. Submit documents, verification happens, then approval.",
        isCorrect: true,
      },
      {
        id: "approve-first",
        text: "Claim approved → Upload documents → Verification",
        outcome: "Approval comes after verification, not before.",
        isCorrect: false,
      },
      {
        id: "verify-before-upload",
        text: "Verification → Upload documents → Claim approved",
        outcome: "Verification needs documents first.",
        isCorrect: false,
      },
      {
        id: "random-order",
        text: "Verification → Claim approved → Upload documents",
        outcome: "Documents must be submitted before verification.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 2,
    prompt: "After an incident occurs, what should be your first action?",
    options: [
      
      {
        id: "wait-approval",
        text: "Wait for approval before uploading",
        outcome: "Approval happens after documents and verification.",
        isCorrect: false,
      },
      {
        id: "submit-docs",
        text: "Upload necessary documents and details",
        outcome: "Correct. Start by submitting required documents.",
        isCorrect: true,
      },
      {
        id: "share-otp",
        text: "Share OTP with caller",
        outcome: "Never share OTP. It’s unrelated and unsafe.",
        isCorrect: false,
      },
      {
        id: "pay-cash",
        text: "Pay cash to speed the process",
        outcome: "Payments don’t replace official steps.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 3,
    prompt: "What does the verification step typically check?",
    options: [
      
      {
        id: "brochure-colour",
        text: "Colour of the brochure",
        outcome: "Marketing materials don’t decide claims.",
        isCorrect: false,
      },
      {
        id: "agent-friendliness",
        text: "Agent’s friendliness",
        outcome: "Claims are decided per policy and facts.",
        isCorrect: false,
      },{
        id: "check-terms",
        text: "Whether documents and event match policy terms",
        outcome: "Correct. Verification ensures terms and documents align.",
        isCorrect: true,
      },
      {
        id: "bank-balance",
        text: "Your current bank balance",
        outcome: "Balance is not a claim criterion.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 4,
    prompt: "If documents are missing or incorrect, what should you do?",
    options: [
      
      {
        id: "do-nothing",
        text: "Wait and do nothing",
        outcome: "Inaction delays or rejects the claim.",
        isCorrect: false,
      },
      {
        id: "close-claim",
        text: "Close the claim immediately",
        outcome: "Better to complete documents instead.",
        isCorrect: false,
      },
      {
        id: "share-otp-again",
        text: "Share OTP again to fix it",
        outcome: "OTP sharing is unsafe and unrelated.",
        isCorrect: false,
      },
      {
        id: "provide-missing",
        text: "Provide the missing or corrected documents",
        outcome: "Correct. Respond and complete documentation.",
        isCorrect: true,
      },
    ],
  },
  {
    id: 5,
    prompt: "When is the claim approved?",
    options: [
      {
        id: "after-verification",
        text: "After verification confirms coverage and documents",
        outcome: "Correct. Approval follows successful verification.",
        isCorrect: true,
      },
      {
        id: "immediately",
        text: "Immediately after purchase of policy",
        outcome: "Approval is event-based, not automatic.",
        isCorrect: false,
      },
      {
        id: "friend-recommendation",
        text: "When a friend recommends approval",
        outcome: "Recommendations don’t decide claims.",
        isCorrect: false,
      },
      {
        id: "premium-hike",
        text: "When premium is increased",
        outcome: "Premium change is unrelated to claim approval.",
        isCorrect: false,
      },
    ],
  },
];

const ClaimProcessSimulation = () => {
  const location = useLocation();
  const gameId = "finance-insurance-pension-15";
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
      title="Claim Process Simulation"
      subtitle={
        showResult
          ? "Simulation complete! You understand the claim process flow."
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
      </div>
    </GameShell>
  );
};

export default ClaimProcessSimulation;

