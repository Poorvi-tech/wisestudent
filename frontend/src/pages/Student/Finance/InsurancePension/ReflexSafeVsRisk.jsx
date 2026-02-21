import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const STAGES = [
  {
    id: 1,
    prompt: "A caller promises \"double money insurance\". Best reflex?",
    options: [
      
      {
        id: "blind-trust",
        text: "Blind trust and pay quickly",
        outcome: "Unsafe. Avoid rushing and verify first.",
        isCorrect: false,
      },
      {
        id: "share-otp",
        text: "Share OTP when asked",
        outcome: "Never share OTP.",
        isCorrect: false,
      },
      {
        id: "send-docs-to-whatsapp",
        text: "Send documents on personal WhatsApp",
        outcome: "Use official channels only.",
        isCorrect: false,
      },
      {
        id: "verify-insurer",
        text: "Verify insurer authenticity via official regulator/insurer site",
        outcome: "Correct. Always verify independently.",
        isCorrect: true,
      },
    ],
  },
  {
    id: 2,
    prompt: "You receive a link that looks suspicious. What do you tap?",
    options: [
      {
        id: "official-site",
        text: "Open official website manually to check policy/insurer",
        outcome: "Correct. Use official portals typed by you.",
        isCorrect: true,
      },
      {
        id: "click-link",
        text: "Click the link immediately",
        outcome: "Risky. Could be phishing.",
        isCorrect: false,
      },
      {
        id: "install-app",
        text: "Install unknown app from the link",
        outcome: "Unsafe. Avoid unknown apps.",
        isCorrect: false,
      },
      {
        id: "send-id",
        text: "Send ID details first",
        outcome: "Do not share personal data without verification.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 3,
    prompt: "Agent asks for OTP to \"verify claim\". Best action?",
    options: [
      
      {
        id: "share-otp-fast",
        text: "Share OTP quickly to finish",
        outcome: "Unsafe and unnecessary.",
        isCorrect: false,
      },
      {
        id: "refuse-otp",
        text: "Do not share OTP; contact official helpline",
        outcome: "Correct. OTP should never be shared.",
        isCorrect: true,
      },
      {
        id: "give-bank-details",
        text: "Share bank details immediately",
        outcome: "Do not share sensitive details unverified.",
        isCorrect: false,
      },
      {
        id: "pay-cash",
        text: "Pay small cash to speed",
        outcome: "Payments do not verify claims.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 4,
    prompt: "To confirm policy status, what is a safe practice?",
    options: [
      
      {
        id: "trust-forwarded-pdf",
        text: "Trust any forwarded PDF",
        outcome: "Documents can be faked.",
        isCorrect: false,
      },
      {
        id: "friend-advice",
        text: "Rely on a friend’s advice only",
        outcome: "Cross-check officially.",
        isCorrect: false,
      },
      {
        id: "check-policy",
        text: "Check policy number on official insurer portal",
        outcome: "Correct. Verify using official portals.",
        isCorrect: true,
      },
      {
        id: "social-media",
        text: "Use social media DMs for confirmation",
        outcome: "Use official verified channels.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 5,
    prompt: "Which tap shows a safe reflex?",
    options: [
      
      {
        id: "blind-trust-again",
        text: "Blind Trust",
        outcome: "Unsafe. Always verify.",
        isCorrect: false,
      },
      {
        id: "share-otp-again",
        text: "Share OTP",
        outcome: "Never share OTP.",
        isCorrect: false,
      },
      {
        id: "click-unknown",
        text: "Click Unknown Link",
        outcome: "Avoid unknown links.",
        isCorrect: false,
      },
      {
        id: "verify",
        text: "Verify Insurer",
        outcome: "Correct. Verification protects you.",
        isCorrect: true,
      },
    ],
  },
];

const ReflexSafeVsRisk = () => {
  const location = useLocation();
  const gameId = "finance-insurance-pension-19";
  const gameData = getGameDataById(gameId);
  const totalStages = STAGES.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const totalCoins = gameData?.coins ?? location.state?.totalCoins ?? 5;
  const coinsPerLevel = Math.max(1, Math.floor(totalCoins / totalStages));
  const totalXp = gameData?.xp ?? location.state?.totalXp ?? 10;
  const stage = STAGES[currentStageIndex];

  useEffect(() => {
    setTimeLeft(10);
    if (selectedChoice || showResult) return;
    const timer = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [currentStageIndex, selectedChoice, showResult]);

  useEffect(() => {
    if (timeLeft <= 0 && !selectedChoice && !showResult) {
      const timeoutChoice = { id: "time-up", text: "Time up", outcome: "Time up.", isCorrect: false };
      setSelectedChoice(timeoutChoice);
      setTimeout(() => {
        if (currentStageIndex === totalStages - 1) {
          setShowResult(true);
        } else {
          setCurrentStageIndex((prev) => prev + 1);
          setSelectedChoice(null);
        }
      }, 800);
    }
  }, [timeLeft, selectedChoice, showResult, currentStageIndex, totalStages]);

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
    } else {
      setTimeout(() => {
        setCurrentStageIndex((prev) => prev + 1);
        setSelectedChoice(null);
      }, 800);
    }
  };

  const progressLabel = `${currentStageIndex + 1}/${totalStages}`;

  return (
    <GameShell
      title="Reflex: Safe vs Risk"
      subtitle={
        showResult
          ? "Reflex challenge complete! Safer taps lead to protection."
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
      showAnswerConfetti={false}
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
                <span>Time: {timeLeft}s</span>
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
      </div>
    </GameShell>
  );
};

export default ReflexSafeVsRisk;

