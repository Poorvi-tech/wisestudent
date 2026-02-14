import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const SAVING_BEFORE_INVESTING_STAGES = [
  {
    id: 1,
    prompt: "What should come first?",
    options: [
      {
        id: "investing",
        label: "Investing immediately",
        reflection: "While investing is important for growth, jumping into investments without a solid savings foundation can be risky. You need stability before seeking growth.",
        isCorrect: false,
      },
      {
        id: "savings",
        label: "Basic savings discipline",
        reflection: "Exactly! Savings create the safety net you need before taking on investment risks. This disciplined approach protects you from financial setbacks.",
        isCorrect: true,
      },
      {
        id: "both",
        label: "Do both at the same time",
        reflection: "While it's possible to save and invest simultaneously, having a solid savings foundation first reduces risk and provides flexibility for investment opportunities.",
        isCorrect: false,
      },
      {
        id: "neither",
        label: "Neither - focus on spending",
        reflection: "Focusing solely on spending misses the opportunity to build financial security and future wealth through both savings and investing.",
        isCorrect: false,
      },
    ],
    reward: 15,
  },
  {
    id: 2,
    prompt: "Why is building savings important before investing?",
    options: [
      {
        id: "emergency",
        label: "Emergency funds prevent panic selling",
        reflection: "Perfect! Having 3-6 months of expenses saved provides security and prevents you from having to liquidate investments during emergencies or market downturns.",
        isCorrect: true,
      },
      {
        id: "no-reason",
        label: "There's no real reason",
        reflection: "Actually, there are significant reasons why savings should come first. Savings provide liquidity, emergency funds, and reduce the pressure to sell investments during difficult times.",
        isCorrect: false,
      },
      
      {
        id: "taxes",
        label: "It helps with tax optimization",
        reflection: "While tax considerations are important, the primary benefit of savings before investing is financial security and risk management, not tax optimization.",
        isCorrect: false,
      },
      {
        id: "interest",
        label: "Savings earn higher interest than investments",
        reflection: "Generally, investments offer higher long-term returns than savings accounts. The benefit of savings is stability and accessibility, not higher returns.",
        isCorrect: false,
      },
    ],
    reward: 15,
  },
  {
    id: 3,
    prompt: "How much should you save before starting to invest?",
    options: [
      {
        id: "nothing",
        label: "Save nothing - start investing immediately",
        reflection: "Starting to invest without any savings is risky. You should have an emergency fund and some basic savings before taking on investment risks.",
        isCorrect: false,
      },
      
      {
        id: "half",
        label: "Save half of your income first",
        reflection: "While saving 50% of your income is admirable, it's more practical to focus on building an adequate emergency fund (3-6 months of expenses) before investing.",
        isCorrect: false,
      },
      {
        id: "year",
        label: "Save for one full year first",
        reflection: "Saving for a full year might be excessive for most people. The key is having enough emergency savings (3-6 months) rather than a fixed time period.",
        isCorrect: false,
      },
      {
        id: "emergency",
        label: "3-6 months of expenses as emergency fund",
        reflection: "Exactly! Financial experts recommend having 3-6 months of living expenses saved as an emergency fund before investing. This provides a safety net and peace of mind.",
        isCorrect: true,
      },
    ],
    reward: 15,
  },
  {
    id: 4,
    prompt: "What happens when you invest without proper savings?",
    options: [
      {
        id: "no-problem",
        label: "Nothing bad happens",
        reflection: "Actually, investing without proper savings can lead to serious financial stress during emergencies or market downturns when you might need to sell investments at a loss.",
        isCorrect: false,
      },
      
      {
        id: "missed",
        label: "You miss out on better investment opportunities",
        reflection: "Having savings actually provides more flexibility to take advantage of investment opportunities, not less. Proper savings enable you to invest confidently without pressure.",
        isCorrect: false,
      },
      {
        id: "forced",
        label: "You're forced to sell during downturns",
        reflection: "Exactly! Without adequate savings, unexpected expenses or emergencies can force you to liquidate investments at inopportune times, potentially locking in losses and missing recovery opportunities.",
        isCorrect: true,
      },
      {
        id: "growth",
        label: "Your investments grow faster",
        reflection: "Investing more money might seem beneficial, but without proper risk management through savings, you're more likely to make emotional decisions that hurt long-term returns.",
        isCorrect: false,
      },
    ],
    reward: 15,
  },
  {
    id: 5,
    prompt: "What's the relationship between saving and investing?",
    options: [
      {
        id: "opposite",
        label: "They're opposite financial strategies",
        reflection: "Saving and investing are complementary strategies, not opposites. Both are essential components of a comprehensive financial plan that balances security and growth.",
        isCorrect: false,
      },
      {
        id: "foundation",
        label: "Savings provide foundation for smart investing",
        reflection: "Exactly! Savings create the stability and security needed for long-term investing success. They reduce risk, provide flexibility, and enable you to make better investment decisions.",
        isCorrect: true,
      },
      {
        id: "same",
        label: "They're essentially the same thing",
        reflection: "While both involve setting aside money, saving and investing serve different purposes. Saving provides security and liquidity, while investing builds long-term wealth through growth.",
        isCorrect: false,
      },
      {
        id: "conflict",
        label: "They conflict with each other",
        reflection: "Saving and investing work together rather than against each other. Proper saving actually enables more effective and confident investing by reducing financial stress and providing options.",
        isCorrect: false,
      },
    ],
    reward: 15,
  },
];

const totalStages = SAVING_BEFORE_INVESTING_STAGES.length;
const successThreshold = totalStages;

const SavingBeforeInvesting = () => {
  const location = useLocation();
  const gameId = "finance-young-adult-62";
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
      "How can you build a balanced approach that includes both saving and investing?",
      "What steps can you take today to strengthen your financial foundation?",
    ],
    []
  );

  const handleChoice = (option) => {
    if (selectedOption || showResult) return;

    resetFeedback();
    const currentStageData = SAVING_BEFORE_INVESTING_STAGES[currentStage];
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
      }, 5500);
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
  const stage = SAVING_BEFORE_INVESTING_STAGES[Math.min(currentStage, totalStages - 1)];
  const hasPassed = finalScore === successThreshold;

  return (
    <GameShell
      title="Saving Before Investing"
      subtitle={subtitle}
      score={showResult ? finalScore : coins}
      coins={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      maxScore={SAVING_BEFORE_INVESTING_STAGES.length}
      currentLevel={Math.min(currentStage + 1, SAVING_BEFORE_INVESTING_STAGES.length)}
      totalLevels={SAVING_BEFORE_INVESTING_STAGES.length}
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
            <span>Savings vs Investing</span>
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
                    Skill unlocked: <strong>Financial foundation building</strong>
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
              Skill unlocked: <strong>Financial foundation building</strong>
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

export default SavingBeforeInvesting;