import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const EMERGENCY_FUND_STAGES = [
  {
    id: 1,
    prompt: "Before investing, what should you build?",
    options: [
      {
        id: "emergency",
        label: "Emergency fund",
        reflection: "Exactly! An emergency fund provides the financial security needed to invest confidently without the fear of forced withdrawals during unexpected situations.",
        isCorrect: true,
      },
      {
        id: "portfolio",
        label: "High-return portfolio",
        reflection: "While high returns are attractive, investing without an emergency fund can lead to forced withdrawals during emergencies, potentially locking in losses at market lows.",
        isCorrect: false,
      },
      {
        id: "both",
        label: "Build both simultaneously",
        reflection: "While building both is ideal long-term, prioritizing an emergency fund first reduces risk and provides the stability needed for successful investing.",
        isCorrect: false,
      },
      {
        id: "nothing",
        label: "Nothing - just start investing",
        reflection: "Starting to invest without any safety net is risky. Unexpected expenses can force you to sell investments at inopportune times, potentially at a loss.",
        isCorrect: false,
      },
    ],
    reward: 15,
  },
  {
    id: 2,
    prompt: "How much should your emergency fund cover?",
    options: [
      {
        id: "minimal",
        label: "Just enough for one month",
        reflection: "One month is typically insufficient for most emergencies. Unexpected situations like job loss or medical expenses often last longer than a month.",
        isCorrect: false,
      },
      {
        id: "standard",
        label: "3-6 months of expenses",
        reflection: "Perfect! Financial experts recommend 3-6 months of living expenses. This provides adequate coverage for most emergencies while keeping the goal achievable.",
        isCorrect: true,
      },
      {
        id: "extreme",
        label: "One year of all expenses",
        reflection: "While comprehensive, saving for a full year can be overwhelming and may prevent you from starting to invest. The 3-6 month guideline balances security with practicality.",
        isCorrect: false,
      },
      {
        id: "luxury",
        label: "Enough for luxury spending",
        reflection: "Emergency funds should cover essential expenses, not discretionary spending. The purpose is financial security, not maintaining lifestyle during emergencies.",
        isCorrect: false,
      },
    ],
    reward: 15,
  },
  {
    id: 3,
    prompt: "Where should you keep your emergency fund?",
    options: [
      {
        id: "stocks",
        label: "In volatile stocks",
        reflection: "Emergency funds need to be accessible and stable. Stocks can lose value when you need the money most, defeating the purpose of having an emergency fund.",
        isCorrect: false,
      },
      
      {
        id: "real-estate",
        label: "In real estate investments",
        reflection: "Real estate is illiquid and can't be quickly converted to cash during emergencies. Emergency funds need to be immediately accessible.",
        isCorrect: false,
      },
      {
        id: "savings",
        label: "In high-yield savings account",
        reflection: "Exactly! High-yield savings accounts offer liquidity, safety, and better returns than regular savings while keeping your money accessible during emergencies.",
        isCorrect: true,
      },
      {
        id: "cryptocurrency",
        label: "In cryptocurrency",
        reflection: "Cryptocurrency is highly volatile and not suitable for emergency funds. You need stability and predictability when facing unexpected financial needs.",
        isCorrect: false,
      },
    ],
    reward: 15,
  },
  {
    id: 4,
    prompt: "What happens if you invest without an emergency fund?",
    options: [
      {
        id: "no-risk",
        label: "Nothing - it's the same either way",
        reflection: "Actually, investing without an emergency fund significantly increases risk. Unexpected expenses can force premature withdrawals, potentially at market lows.",
        isCorrect: false,
      },
      
      {
        id: "benefit",
        label: "You'll benefit from compound growth",
        reflection: "While compound growth is beneficial, it can be negated by forced withdrawals during emergencies. The security of an emergency fund actually enables better long-term investing.",
        isCorrect: false,
      },
      {
        id: "opportunity",
        label: "You'll have more investment opportunities",
        reflection: "Having an emergency fund actually provides more flexibility to take advantage of investment opportunities without the stress of financial insecurity.",
        isCorrect: false,
      },
      {
        id: "forced",
        label: "You might be forced to sell at losses",
        reflection: "Exactly! Without emergency savings, unexpected expenses can force you to liquidate investments during market downturns, locking in losses and missing recovery opportunities.",
        isCorrect: true,
      },
    ],
    reward: 15,
  },
  {
    id: 5,
    prompt: "When should you start investing after building emergency fund?",
    options: [
      {
        id: "immediately",
        label: "Immediately after reaching the goal",
        reflection: "Perfect! Once you have adequate emergency savings, you can invest confidently knowing you have a financial safety net to fall back on.",
        isCorrect: true,
      },
      {
        id: "wait",
        label: "Wait until you have more money",
        reflection: "Waiting too long can mean missing out on investment opportunities and the benefits of compound growth. Start investing once your emergency fund is established.",
        isCorrect: false,
      },
      {
        id: "never",
        label: "Never - keep saving forever",
        reflection: "While saving is important, the purpose of an emergency fund is to provide security so you can also invest for long-term growth. Both saving and investing are important.",
        isCorrect: false,
      },
      {
        id: "reduce",
        label: "Reduce emergency fund to invest more",
        reflection: "Reducing your emergency fund defeats its purpose. The fund should remain intact to provide security while you invest for growth.",
        isCorrect: false,
      },
    ],
    reward: 15,
  },
];

const totalStages = EMERGENCY_FUND_STAGES.length;
const successThreshold = totalStages;

const EmergencyFundFirst = () => {
  const location = useLocation();
  const gameId = "finance-young-adult-63";
  const gameData = getGameDataById(gameId);
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 15;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 15;
  const totalXp = gameData?.xp || location.state?.totalXp || 30;
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
      "How can you start building your emergency fund today, even with a small amount?",
      "What investment opportunities could you pursue more confidently with an emergency fund in place?",
    ],
    []
  );

  const handleChoice = (option) => {
    if (selectedOption || showResult) return;

    resetFeedback();
    const currentStageData = EMERGENCY_FUND_STAGES[currentStage];
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
  const stage = EMERGENCY_FUND_STAGES[Math.min(currentStage, totalStages - 1)];
  const hasPassed = finalScore === successThreshold;

  return (
    <GameShell
      title="Emergency Fund First"
      subtitle={subtitle}
      score={coins}
      coins={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      maxScore={EMERGENCY_FUND_STAGES.length}
      currentLevel={Math.min(currentStage + 1, EMERGENCY_FUND_STAGES.length)}
      totalLevels={EMERGENCY_FUND_STAGES.length}
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
            <span>Emergency Fund Priority</span>
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
                        { stageId: EMERGENCY_FUND_STAGES[currentStage].id, isCorrect: EMERGENCY_FUND_STAGES[currentStage].options.find(opt => opt.id === selectedOption)?.isCorrect },
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
                    Skill unlocked: <strong>Emergency fund strategy</strong>
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
              Skill unlocked: <strong>Emergency fund strategy</strong>
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

export default EmergencyFundFirst;