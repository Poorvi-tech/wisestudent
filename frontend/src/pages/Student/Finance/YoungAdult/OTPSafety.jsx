import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const OTP_SAFETY_STAGES = [
  {
    id: 1,
    prompt: "Someone asks for your OTP. What should you do?",
    options: [
      {
        id: "share",
        label: "Share quickly to help them",
        reflection: "Sharing OTPs immediately compromises your financial security - legitimate services never ask for your one-time passwords.",
        isCorrect: false,
      },
      
      {
        id: "verify",
        label: "Verify their identity first",
        reflection: "Verification is impossible since legitimate organizations never request OTPs - any request should be treated as suspicious regardless of claimed identity.",
        isCorrect: false,
      },
      {
        id: "never",
        label: "Never share OTPs",
        reflection: "Exactly! OTPs are personal security codes that should never be shared, even with people claiming to be from your bank or payment service.",
        isCorrect: true,
      },
      {
        id: "partial",
        label: "Share only part of the code",
        reflection: "Partial sharing still compromises security - even fragments of OTPs can enable fraudulent transactions or account takeover attempts.",
        isCorrect: false,
      },
    ],
    reward: 10,
  },
  {
    id: 2,
    prompt: "Who should legitimately ask for your OTP?",
    options: [
      {
        id: "bank",
        label: "Your bank customer service",
        reflection: "Legitimate banks never request OTPs over phone or chat - they generate OTPs for you to initiate your own secure transactions.",
        isCorrect: false,
      },
      {
        id: "payment",
        label: "Payment app support team",
        reflection: "Official support teams don't need your OTPs - they can assist with account issues without accessing your transaction authorization codes.",
        isCorrect: false,
      },
      {
        id: "government",
        label: "Government agencies",
        reflection: "Government entities don't request personal OTPs - official communications come through verified channels with proper documentation procedures.",
        isCorrect: false,
      },
      {
        id: "noone",
        label: "No legitimate entity ever",
        reflection: "Perfect! OTPs are exclusively for your personal transaction authorization - no legitimate organization should ever request them from you.",
        isCorrect: true,
      },
    ],
    reward: 10,
  },
  {
    id: 3,
    prompt: "What's the primary purpose of OTPs?",
    options: [
      {
        id: "convenience",
        label: "Making transactions faster",
        reflection: "While OTPs streamline security processes, their primary function is protection rather than convenience enhancement.",
        isCorrect: false,
      },
      {
        id: "protection",
        label: "Protecting financial transactions",
        reflection: "Exactly! OTPs provide time-sensitive, single-use authorization that prevents unauthorized access even if passwords are compromised.",
        isCorrect: true,
      },
      {
        id: "verification",
        label: "Verifying your phone number",
        reflection: "Phone verification is a secondary function - the core purpose is securing financial transactions and account access authorization.",
        isCorrect: false,
      },
      {
        id: "tracking",
        label: "Tracking spending habits",
        reflection: "Spending tracking serves analytical purposes but isn't the fundamental security function that OTPs provide for transaction authorization.",
        isCorrect: false,
      },
    ],
    reward: 10,
  },
  {
    id: 4,
    prompt: "How should you handle suspicious OTP requests?",
    options: [
      {
        id: "ignore",
        label: "Ignore and delete messages",
        reflection: "Perfect! Suspicious OTP requests should be immediately disregarded and reported to prevent potential fraud escalation attempts.",
        isCorrect: true,
      },
      {
        id: "respond",
        label: "Ask why they need it",
        reflection: "Engaging with suspicious requests can validate contact methods and potentially expose you to more sophisticated social engineering attempts.",
        isCorrect: false,
      },
      {
        id: "delay",
        label: "Wait and see if they call again",
        reflection: "Waiting creates vulnerability windows - immediate action prevents fraudsters from refining their approaches or targeting you again.",
        isCorrect: false,
      },
      {
        id: "forward",
        label: "Forward to friends for advice",
        reflection: "Sharing suspicious messages spreads potential threats and may inadvertently help fraudsters refine their targeting methods.",
        isCorrect: false,
      },
    ],
    reward: 10,
  },
  {
    id: 5,
    prompt: "What's the relationship between OTP security and financial safety?",
    options: [
      {
        id: "separate",
        label: "They're completely separate issues",
        reflection: "Actually, OTP security directly impacts financial safety - weak OTP practices create vulnerabilities that fraudsters actively exploit.",
        isCorrect: false,
      },
      
      {
        id: "minimal",
        label: "OTP security has minimal impact",
        reflection: "OTP security is critical - compromised authorization codes enable direct access to funds and account takeover regardless of other security measures.",
        isCorrect: false,
      },
      {
        id: "obstacle",
        label: "Security creates user obstacles",
        reflection: "While OTPs add steps, they prevent much greater obstacles like account theft, fund loss, and identity compromise that create real problems.",
        isCorrect: false,
      },
      {
        id: "foundational",
        label: "OTP security is foundational to safety",
        reflection: "Exactly! Strong OTP practices create the first line of defense that protects all your digital financial accounts and transactions.",
        isCorrect: true,
      },
    ],
    reward: 10,
  },
];

const totalStages = OTP_SAFETY_STAGES.length;
const successThreshold = totalStages;

const OTPSafety = () => {
  const location = useLocation();
  const gameId = "finance-young-adult-43";
  const gameData = getGameDataById(gameId);
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 10;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 10;
  const totalXp = gameData?.xp || location.state?.totalXp || 20;
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const [currentStage, setCurrentStage] = useState(0);
  const [coins, setCoins] = useState(0);
  const [history, setHistory] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [selectedReflection, setSelectedReflection] = useState(null);
  const [canProceed, setCanProceed] = useState(false);

  const reflectionPrompts = useMemo(
    () => [
      "How can strong OTP practices actually increase your financial freedom rather than restrict it?",
      "What personal protocols help you maintain OTP security without creating unnecessary anxiety about legitimate transactions?",
    ],
    []
  );

  const handleChoice = (option) => {
    if (selectedOption || showResult) return;

    resetFeedback();
    const currentStageData = OTP_SAFETY_STAGES[currentStage];
    const updatedHistory = [
      ...history,
      { stageId: currentStageData.id, isCorrect: option.isCorrect },
    ];
    setHistory(updatedHistory);
    setSelectedOption(option.id);
    setSelectedReflection(option.reflection);
    setShowFeedback(true);
    setCanProceed(false);
    
    if (option.isCorrect) {
      setCoins(prevCoins => prevCoins + 1);
    }
    
    setTimeout(() => {
      setCanProceed(true);
    }, 1500);
    
    if (currentStage === totalStages - 1) {
      setTimeout(() => {
        const correctCount = updatedHistory.filter((item) => item.isCorrect).length;
        const passed = correctCount === successThreshold;
        setFinalScore(correctCount);
        setCoins(passed ? totalCoins : 0);
        setShowResult(true);
      }, 2500);
    }
    
    if (option.isCorrect) {
      showCorrectAnswerFeedback(currentStageData.reward, true);
    } else {
      showCorrectAnswerFeedback(0, false);
    }
  };

  const handleRetry = () => {
    resetFeedback();
    setCurrentStage(0);
    setHistory([]);
    setSelectedOption(null);
    setCoins(0);
    setFinalScore(0);
    setShowResult(false);
  };

  const subtitle = `Stage ${Math.min(currentStage + 1, totalStages)} of ${totalStages}`;
  const stage = OTP_SAFETY_STAGES[Math.min(currentStage, totalStages - 1)];
  const hasPassed = finalScore === successThreshold;

  return (
    <GameShell
      title="OTP Safety"
      subtitle={subtitle}
      score={coins}
      coins={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      maxScore={OTP_SAFETY_STAGES.length}
      currentLevel={Math.min(currentStage + 1, OTP_SAFETY_STAGES.length)}
      totalLevels={OTP_SAFETY_STAGES.length}
      gameId={gameId}
      gameType="finance"
      showGameOver={showResult}
      showConfetti={showResult && hasPassed}
      shouldSubmitGameCompletion={hasPassed}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-5 text-white">
        <div className="bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-4 text-sm uppercase tracking-[0.3em] text-white/60">
            <span>Scenario</span>
            <span>Digital Security</span>
          </div>
          <p className="text-lg text-white/90 mb-6">{stage.prompt}</p>
          <div className="grid grid-cols-2 gap-4">
            {stage.options.map((option) => {
              const isSelected = selectedOption === option.id;
              return (
                <button
                  key={option.id}
                  onClick={() => handleChoice(option)}
                  disabled={!!selectedOption}
                  className={`rounded-2xl border-2 p-5 text-left transition ${isSelected
                      ? option.isCorrect
                        ? "border-emerald-400 bg-emerald-500/20"
                        : "border-rose-400 bg-rose-500/10"
                      : "border-white/30 bg-white/5 hover:border-white/60 hover:bg-white/10"
                    }`}
                >
                  <div className="flex justify-between items-center mb-2 text-sm text-white/70">
                    <span>Choice {option.id.toUpperCase()}</span>
                  </div>
                  <p className="text-white font-semibold">{option.label}</p>
                </button>
              );
            })}
          </div>
          {(showResult || showFeedback) && (
            <div className="bg-white/5 border border-white/20 rounded-3xl p-6 shadow-xl max-w-4xl mx-auto space-y-3">
              <h4 className="text-lg font-semibold text-white">Reflection</h4>
              {selectedReflection && (
                <div className="max-h-24 overflow-y-auto pr-2">
                  <p className="text-sm text-white/90">{selectedReflection}</p>
                </div>
              )}
              {showFeedback && !showResult && (
                <div className="mt-4 flex justify-center">
                  {canProceed ? (
                    <button
                      onClick={() => {
                        if (currentStage < totalStages - 1) {
                          setCurrentStage((prev) => prev + 1);
                          setSelectedOption(null);
                          setSelectedReflection(null);
                          setShowFeedback(false);
                          setCanProceed(false);
                        }
                      }}
                      className="rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-2 px-6 font-semibold shadow-lg hover:opacity-90"
                    >
                      Continue
                    </button>
                  ) : (
                    <div className="py-2 px-6 text-white font-semibold">Reading...</div>
                  )}
                </div>
              )}
              {!showResult && currentStage === totalStages - 1 && canProceed && (
                <div className="mt-4 flex justify-center">
                  <button
                    onClick={() => {
                      const updatedHistory = [
                        ...history,
                        { stageId: OTP_SAFETY_STAGES[currentStage].id, isCorrect: OTP_SAFETY_STAGES[currentStage].options.find(opt => opt.id === selectedOption)?.isCorrect },
                      ];
                      const correctCount = updatedHistory.filter((item) => item.isCorrect).length;
                      const passed = correctCount === successThreshold;
                      setFinalScore(correctCount);
                      setCoins(passed ? totalCoins : 0);
                      setShowResult(true);
                    }}
                    className="rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-2 px-6 font-semibold shadow-lg hover:opacity-90"
                  >
                  Finish
                  </button>
                </div>
              )}
              {showResult && (
                <>
                  <ul className="text-sm list-disc list-inside space-y-1">
                    {reflectionPrompts.map((prompt) => (
                      <li key={prompt}>{prompt}</li>
                    ))}
                  </ul>
                  <p className="text-sm text-white/70">
                    Skill unlocked: <strong>OTP security mastery</strong>
                  </p>
                  {!hasPassed && (
                    <p className="text-xs text-amber-300">
                      Answer all {totalStages} choices correctly to earn the full reward.
                    </p>
                  )}
                  {!hasPassed && (
                    <button
                      onClick={handleRetry}
                      className="w-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-3 font-semibold shadow-lg hover:opacity-90"
                    >
                      Try Again
                    </button>
                  )}
                </>
              )}
            </div>
          )}
          
        </div>
        {showResult && (
          <div className="bg-white/5 border border-white/20 rounded-3xl p-6 shadow-xl max-w-4xl mx-auto space-y-3">
            <h4 className="text-lg font-semibold text-white">Reflection Prompts</h4>
            <ul className="text-sm list-disc list-inside space-y-1">
              {reflectionPrompts.map((prompt) => (
                <li key={prompt}>{prompt}</li>
              ))}
            </ul>
            <p className="text-sm text-white/70">
              Skill unlocked: <strong>OTP security mastery</strong>
            </p>
            {!hasPassed && (
              <p className="text-xs text-amber-300">
                Answer all {totalStages} choices correctly to earn the full reward.
              </p>
            )}
            {!hasPassed && (
              <button
                onClick={handleRetry}
                className="w-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-3 font-semibold shadow-lg hover:opacity-90"
              >
                Try Again
              </button>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default OTPSafety;