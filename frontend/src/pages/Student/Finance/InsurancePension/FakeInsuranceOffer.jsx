import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const FAKE_INSURANCE_OFFER_STAGES = [
  {
    id: 1,
    prompt: "Someone promises \"double money insurance\". What should you do first?",
    options: [
      {
        id: "buy-quickly",
        text: "Buy quickly",
        outcome:
          "Rushing increases the chance of falling for a scam.",
        isCorrect: false,
      },
      {
        id: "verify-authenticity",
        text: "Verify insurer authenticity",
        outcome:
          "Correct. Fraud often hides behind unrealistic promises.",
        isCorrect: true,
      },
      {
        id: "share-otp",
        text: "Share OTP",
        outcome:
          "Never share OTPs. They can be used to steal money or data.",
        isCorrect: false,
      },
      {
        id: "pay-cash",
        text: "Pay cash",
        outcome:
          "Cash payments to unknown parties are risky and hard to trace.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 2,
    prompt: "Which promise is a red flag for insurance fraud?",
    options: [
      {
        id: "guaranteed-double",
        text: "Guaranteed double money in a short time",
        outcome:
          "Correct. Unrealistic returns are a common scam signal.",
        isCorrect: true,
      },
      {
        id: "policy-terms",
        text: "Clear policy terms and coverage limits",
        outcome:
          "Transparent terms are a good sign, not a red flag.",
        isCorrect: false,
      },
      {
        id: "licensed-company",
        text: "Licensed insurer with verifiable registration",
        outcome:
          "Verification is what you should look for.",
        isCorrect: false,
      },
      {
        id: "cooling-off",
        text: "Cooling-off period included",
        outcome:
          "A cooling-off period is normal and consumer-friendly.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 3,
    prompt: "What is the safest way to pay an insurance premium?",
    options: [
      {
        id: "official-channel",
        text: "Pay through official insurer channels",
        outcome:
          "Correct. Official channels provide receipts and traceability.",
        isCorrect: true,
      },
      {
        id: "agent-personal",
        text: "Pay into an agent's personal account",
        outcome:
          "Personal accounts are risky and not standard practice.",
        isCorrect: false,
      },
      {
        id: "cash-no-receipt",
        text: "Pay cash without receipt",
        outcome:
          "No receipt means no proof of payment.",
        isCorrect: false,
      },
      {
        id: "share-otp",
        text: "Share OTP over phone",
        outcome:
          "Never share OTPs with anyone.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 4,
    prompt: "What should you verify before buying any policy?",
    options: [
      {
        id: "insurer-license",
        text: "Insurer registration and license",
        outcome:
          "Correct. Authenticity and licensing protect you from fraud.",
        isCorrect: true,
      },
      {
        id: "agent-promise",
        text: "Only the agent's promise",
        outcome:
          "Promises are not enough without verified credentials.",
        isCorrect: false,
      },
      {
        id: "social-media",
        text: "Social media popularity",
        outcome:
          "Popularity is not proof of legitimacy.",
        isCorrect: false,
      },
      {
        id: "no-questions",
        text: "Nothing, just trust",
        outcome:
          "Always verify before paying.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 5,
    prompt: "What is a smart response to unrealistic insurance offers?",
    options: [
      {
        id: "report-verify",
        text: "Verify and report suspicious offers",
        outcome:
          "Correct. Verification protects you and others.",
        isCorrect: true,
      },
      {
        id: "buy-fast",
        text: "Buy fast to lock the deal",
        outcome:
          "Scams often pressure quick decisions.",
        isCorrect: false,
      },
      {
        id: "share-otp",
        text: "Share OTP to confirm",
        outcome:
          "Sharing OTPs is unsafe and unnecessary.",
        isCorrect: false,
      },
      {
        id: "pay-cash",
        text: "Pay cash to avoid delays",
        outcome:
          "Cash to unknown parties is a major risk.",
        isCorrect: false,
      },
    ],
  },
];

const FakeInsuranceOffer = () => {
  const location = useLocation();
  const gameId = "finance-insurance-pension-9";
  const gameData = getGameDataById(gameId);
  const totalStages = FAKE_INSURANCE_OFFER_STAGES.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const totalCoins = gameData?.coins ?? location.state?.totalCoins ?? 5;
  const coinsPerLevel = Math.max(1, Math.floor(totalCoins / totalStages));
  const totalXp = gameData?.xp ?? location.state?.totalXp ?? 10;
  const stage = FAKE_INSURANCE_OFFER_STAGES[currentStageIndex];

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
      title="Fake Insurance Offer"
      subtitle={
        showResult
          ? "Quiz complete! You can spot unrealistic insurance promises."
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

export default FakeInsuranceOffer;
