import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const STAGES = [
  {
    id: 1,
    prompt: "Before buying, what is the safest first step?",
    options: [
      
      {
        id: "trust-sales",
        text: "Trust only the sales pitch",
        outcome: "Sales talk is not the contract.",
        isCorrect: false,
      },
      {
        id: "read-terms",
        text: "Read coverage, exclusions, and claim rules",
        outcome: "Correct. Decisions should be based on written terms.",
        isCorrect: true,
      },
      {
        id: "ignore-docs",
        text: "Ignore documents and sign fast",
        outcome: "Skipping documents risks claim problems.",
        isCorrect: false,
      },
      {
        id: "choose-colour",
        text: "Choose brochure with best colour",
        outcome: "Colour does not affect protection.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 2,
    prompt: "A plan offers unrealistic returns as insurance. Safe action?",
    options: [
      {
        id: "verify-regulator",
        text: "Verify insurer on official regulator/insurer portal",
        outcome: "Correct. Independently verify authenticity.",
        isCorrect: true,
      },
      {
        id: "pay-now",
        text: "Pay immediately to lock the offer",
        outcome: "Rushing increases fraud risk.",
        isCorrect: false,
      },
      {
        id: "share-otp",
        text: "Share OTP for ‘verification’",
        outcome: "Never share OTP.",
        isCorrect: false,
      },
      {
        id: "trust-forward",
        text: "Trust forwarded PDF screenshots",
        outcome: "Documents can be faked; verify officially.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 3,
    prompt: "Choosing life cover amount: better approach?",
    options: [
      
      {
        id: "tax-only",
        text: "Pick minimum for tax only",
        outcome: "Tax should not be the only reason.",
        isCorrect: false,
      },
      {
        id: "random-guess",
        text: "Random amount without assessment",
        outcome: "Coverage must match needs.",
        isCorrect: false,
      },
      {
        id: "friend-number",
        text: "Use a friend's number without context",
        outcome: "Personal needs differ; assess properly.",
        isCorrect: false,
      },
      {
        id: "income-replacement",
        text: "Estimate income replacement for dependents",
        outcome: "Correct. Sum assured should protect dependents.",
        isCorrect: true,
      },
    ],
  },
  {
    id: 4,
    prompt: "During a claim, what is a safe, effective step?",
    options: [
      
      {
        id: "pay-bribe",
        text: "Pay someone unofficially to speed up",
        outcome: "Unsafe and unnecessary.",
        isCorrect: false,
      },
      {
        id: "do-nothing",
        text: "Do nothing after initiating",
        outcome: "Follow-ups may be required.",
        isCorrect: false,
      },
      {
        id: "keep-docs",
        text: "Keep documents ready and submit promptly",
        outcome: "Correct. Documentation speeds claims.",
        isCorrect: true,
      },
      {
        id: "whatsapp-only",
        text: "Use only personal WhatsApp for all steps",
        outcome: "Use official channels for records.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 5,
    prompt: "Which habit supports safe insurance decisions?",
    options: [
      
      {
        id: "share-credentials",
        text: "Share credentials with anyone who asks",
        outcome: "Never share credentials or OTPs.",
        isCorrect: false,
      },
      {
        id: "organize",
        text: "Organize policy numbers and helplines for quick access",
        outcome: "Correct. Preparedness helps in emergencies.",
        isCorrect: true,
      },
      {
        id: "ignore-renewal",
        text: "Ignore renewal reminders",
        outcome: "Lapses risk loss of protection.",
        isCorrect: false,
      },
      {
        id: "guess-coverage",
        text: "Assume every event is covered",
        outcome: "Coverage is specific to policy terms.",
        isCorrect: false,
      },
    ],
  },
];

const BadgeInsuranceAware = () => {
  const location = useLocation();
  const gameId = "finance-insurance-pension-20";
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
      title="Badge: Insurance Aware"
      subtitle={
        showResult
          ? "Achievement unlocked! You earned the Insurance Aware badge."
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
            <div className="text-3xl font-extrabold mb-2">🏅 Insurance Aware</div>
            <div className="text-white/80">
              You completed 5 safe insurance decisions and earned a badge!
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default BadgeInsuranceAware;

