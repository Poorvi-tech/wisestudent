import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const UPI_CASH_STAGES = [
  {
    id: 1,
    prompt: "Digital payments feel like cashless money. What's the truth?",
    options: [
      {
        id: "real",
        label: "UPI spends real bank balance",
        reflection: "Exactly! Digital payments instantly deduct from your actual bank account, just like withdrawing and spending physical cash.",
        isCorrect: true,
      },
      {
        id: "unlimited",
        label: "UPI money is unlimited",
        reflection: "UPI transactions draw directly from your bank account balance - there's no magical unlimited source of digital money.",
        isCorrect: false,
      },
      
      {
        id: "credit",
        label: "It's like getting instant credit",
        reflection: "Unless linked to credit facilities, UPI payments immediately reduce your available bank balance rather than creating debt.",
        isCorrect: false,
      },
      {
        id: "virtual",
        label: "Virtual currency with no real value",
        reflection: "UPI represents real rupees in your bank account - it's simply a digital method of transferring existing funds, not creating new value.",
        isCorrect: false,
      },
    ],
    reward: 10,
  },
  {
    id: 2,
    prompt: "How does UPI spending differ from cash spending psychologically?",
    options: [
      
      {
        id: "convenient",
        label: "UPI is more convenient to use",
        reflection: "While convenience is a feature, the key psychological difference is how easily digital payments can obscure the real spending impact.",
        isCorrect: false,
      },
      {
        id: "secure",
        label: "Digital payments feel more secure",
        reflection: "Security perceptions vary, but the fundamental psychological difference relates to spending awareness rather than safety feelings.",
        isCorrect: false,
      },
      {
        id: "fast",
        label: "UPI transactions happen instantly",
        reflection: "Speed is a characteristic but doesn't address the core psychological impact difference between physical and digital spending.",
        isCorrect: false,
      },
      {
        id: "tangible",
        label: "Cash feels more tangible and real",
        reflection: "Perfect! Physical money creates stronger psychological impact and spending awareness compared to seamless digital transactions.",
        isCorrect: true,
      },
    ],
    reward: 10,
  },
  {
    id: 3,
    prompt: "What's the main risk of treating UPI like unlimited money?",
    options: [
      
      {
        id: "security",
        label: "Increased fraud risk exposure",
        reflection: "While security matters, the primary risk is behavioral - treating digital payments as limitless leads to poor spending discipline.",
        isCorrect: false,
      },
      {
        id: "overspending",
        label: "Uncontrolled spending and budget busting",
        reflection: "Exactly! The ease of digital payments can disconnect spending actions from their real financial consequences and available resources.",
        isCorrect: true,
      },
      {
        id: "technology",
        label: "Technical transaction failures",
        reflection: "Technical issues are operational concerns rather than the fundamental behavioral risk of treating digital money as unlimited.",
        isCorrect: false,
      },
      {
        id: "fees",
        label: "Accumulating transaction fees",
        reflection: "UPI transactions are typically free - the real risk is psychological spending behavior rather than cost accumulation.",
        isCorrect: false,
      },
    ],
    reward: 10,
  },
  {
    id: 4,
    prompt: "How can you maintain spending awareness with UPI payments?",
    options: [
      {
        id: "ignore",
        label: "Ignore balances and spend freely",
        reflection: "Ignoring account balances removes the fundamental financial awareness needed for responsible money management regardless of payment method.",
        isCorrect: false,
      },
      
      {
        id: "limit",
        label: "Set strict daily spending limits",
        reflection: "While limits help, the core solution is maintaining awareness of actual balances rather than just restricting transaction amounts.",
        isCorrect: false,
      },
      {
        id: "track",
        label: "Track transactions and balances regularly",
        reflection: "Perfect! Active monitoring maintains the spending awareness that digital convenience can otherwise obscure from automatic transactions.",
        isCorrect: true,
      },
      {
        id: "cash",
        label: "Convert to cash for major purchases",
        reflection: "Cash conversion adds inconvenience without addressing the fundamental need for digital spending awareness and balance tracking.",
        isCorrect: false,
      },
    ],
    reward: 10,
  },
  {
    id: 5,
    prompt: "What's the relationship between UPI convenience and financial discipline?",
    options: [
       {
        id: "challenges",
        label: "Convenience challenges self-control",
        reflection: "Exactly! Easy payment methods require stronger internal discipline since external barriers to spending are removed.",
        isCorrect: true,
      },
      {
        id: "helps",
        label: "Convenience helps maintain discipline",
        reflection: "Actually, convenience often undermines discipline by making spending frictionless and reducing the psychological impact of each transaction.",
        isCorrect: false,
      },
     
      {
        id: "neutral",
        label: "Convenience has no impact on behavior",
        reflection: "Payment method significantly affects spending behavior - digital convenience typically increases spending frequency and amounts.",
        isCorrect: false,
      },
      {
        id: "automatic",
        label: "Convenience makes saving automatic",
        reflection: "Convenience affects spending behavior more than saving - automatic savings requires separate intentional systems rather than payment method features.",
        isCorrect: false,
      },
    ],
    reward: 10,
  },
];

const totalStages = UPI_CASH_STAGES.length;
const successThreshold = totalStages;

const UPIIsNotCash = () => {
  const location = useLocation();
  const gameId = "finance-young-adult-42";
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
      "How can digital payment awareness actually enhance your financial control rather than diminish it?",
      "What balance between payment convenience and spending mindfulness works best for your financial goals?",
    ],
    []
  );

  const handleChoice = (option) => {
    if (selectedOption || showResult) return;

    resetFeedback();
    const currentStageData = UPI_CASH_STAGES[currentStage];
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
  const stage = UPI_CASH_STAGES[Math.min(currentStage, totalStages - 1)];
  const hasPassed = finalScore === successThreshold;

  return (
    <GameShell
      title="UPI Is Not Cash"
      subtitle={subtitle}
      score={coins}
      coins={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      maxScore={UPI_CASH_STAGES.length}
      currentLevel={Math.min(currentStage + 1, UPI_CASH_STAGES.length)}
      totalLevels={UPI_CASH_STAGES.length}
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
            <span>Digital Spending Awareness</span>
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
                        { stageId: UPI_CASH_STAGES[currentStage].id, isCorrect: UPI_CASH_STAGES[currentStage].options.find(opt => opt.id === selectedOption)?.isCorrect },
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
                    Skill unlocked: <strong>Digital payment awareness</strong>
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
              Skill unlocked: <strong>Digital payment awareness</strong>
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

export default UPIIsNotCash;