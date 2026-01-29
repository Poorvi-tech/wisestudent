import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const GROWTH_BASICS_STAGES = [
  {
    id: 1,
    prompt: "Which is the safer approach to building wealth?",
    options: [
      {
        id: "speculate",
        label: "Speculate on high-risk investments",
        reflection: "Speculating on high-risk investments can lead to significant losses. While the potential for high returns exists, the risk of losing your principal is also substantial.",
        isCorrect: false,
      },
      {
        id: "diversify",
        label: "Diversify with a balanced portfolio",
        reflection: "Perfect! Diversification spreads risk across different investments, reducing the impact of any single investment's poor performance on your overall wealth.",
        isCorrect: true,
      },
      {
        id: "concentrate",
        label: "Put all money in one investment",
        reflection: "Concentrating all your money in one investment exposes you to significant risk. If that investment performs poorly, you could lose a large portion of your wealth.",
        isCorrect: false,
      },
      {
        id: "ignore",
        label: "Ignore investment risks entirely",
        reflection: "Ignoring risks doesn't eliminate them. Understanding and managing risk is crucial for long-term wealth building and financial security.",
        isCorrect: false,
      },
    ],
    reward: 15,
  },
  {
    id: 2,
    prompt: "What should be your first financial priority?",
    options: [
      {
        id: "emergency",
        label: "Building an emergency fund",
        reflection: "Exactly! An emergency fund provides financial security and prevents you from going into debt when unexpected expenses arise. This foundation is essential before other investments.",
        isCorrect: true,
      },
      {
        id: "luxury",
        label: "Buying luxury items to feel wealthy",
        reflection: "Purchasing luxury items early can derail your financial progress. These purchases often provide temporary satisfaction but can create long-term financial stress.",
        isCorrect: false,
      },
      
      {
        id: "investments",
        label: "Starting aggressive investments immediately",
        reflection: "While investing is important, starting without an emergency fund can be risky. Unexpected expenses might force you to sell investments at a loss during market downturns.",
        isCorrect: false,
      },
      {
        id: "debt",
        label: "Taking on more debt for lifestyle",
        reflection: "Taking on unnecessary debt for lifestyle purposes typically hinders wealth building. Focus on eliminating high-interest debt and building positive cash flow first.",
        isCorrect: false,
      },
    ],
    reward: 15,
  },
  {
    id: 3,
    prompt: "How should you approach investing when starting out?",
    options: [
      {
        id: "complex",
        label: "Use complex trading strategies",
        reflection: "Complex strategies are often unnecessary for beginners and can lead to poor outcomes due to lack of experience. Simple, consistent approaches typically perform better for new investors.",
        isCorrect: false,
      },
      
      {
        id: "timing",
        label: "Try to time the market perfectly",
        reflection: "Market timing is extremely difficult even for professionals. Attempting to time the market often leads to buying high and selling low, which hurts long-term returns.",
        isCorrect: false,
      },
      {
        id: "crypto",
        label: "Focus heavily on cryptocurrency",
        reflection: "While cryptocurrency can be part of a diversified portfolio, it shouldn't be the focus for beginners. Start with proven, stable investments before exploring more volatile assets.",
        isCorrect: false,
      },
      {
        id: "simple",
        label: "Start with simple, low-cost index funds",
        reflection: "Perfect! Simple index funds offer instant diversification, low fees, and have historically provided solid long-term returns. They're ideal for building a foundation.",
        isCorrect: true,
      },
    ],
    reward: 15,
  },
  {
    id: 4,
    prompt: "What is the most important factor in long-term wealth building?",
    options: [
      {
        id: "returns",
        label: "Getting the highest possible returns",
        reflection: "Chasing the highest returns often leads to taking excessive risk. Sustainable wealth building is more about consistency and risk management than maximum returns.",
        isCorrect: false,
      },
      
      {
        id: "luck",
        label: "Relying on market luck",
        reflection: "While market timing luck can play a role, relying on it is not a strategy. Successful wealth building requires consistent habits and disciplined approaches regardless of market conditions.",
        isCorrect: false,
      },
      {
        id: "time",
        label: "Starting early and staying consistent",
        reflection: "Exactly! Time is your greatest asset in wealth building. The power of compound interest means that starting early and staying consistent has a greater impact than chasing high returns.",
        isCorrect: true,
      },
      {
        id: "spending",
        label: "Spending less on everything",
        reflection: "While spending less can free up money for investing, it's not the most important factor. The key is building positive cash flow and investing consistently over time.",
        isCorrect: false,
      },
    ],
    reward: 15,
  },
  {
    id: 5,
    prompt: "What should you do with your investment gains?",
    options: [
      {
        id: "spend",
        label: "Spend them immediately on wants",
        reflection: "Spending investment gains immediately can undermine your long-term wealth building. These gains should typically be reinvested to maintain the growth momentum of your portfolio.",
        isCorrect: false,
      },
      {
        id: "reinvest",
        label: "Reinvest for continued growth",
        reflection: "Perfect! Reinvesting gains allows compound interest to work at full strength. This approach accelerates wealth building and helps you achieve your long-term financial goals faster.",
        isCorrect: true,
      },
      {
        id: "withdraw",
        label: "Withdraw and keep as cash",
        reflection: "Withdrawing gains and keeping them as cash eliminates the growth potential. While some cash reserves are important, keeping too much in low-yield cash can hurt long-term wealth accumulation.",
        isCorrect: false,
      },
      {
        id: "ignore",
        label: "Ignore the gains entirely",
        reflection: "Ignoring investment gains isn't a productive approach. While you shouldn't obsess over short-term fluctuations, being mindful of gains and making intentional decisions about them is important for financial growth.",
        isCorrect: false,
      },
    ],
    reward: 15,
  },
];

const totalStages = GROWTH_BASICS_STAGES.length;
const successThreshold = totalStages;

const GrowthBasicsCheckpoint = () => {
  const location = useLocation();
  const gameId = "finance-young-adult-70";
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
      "How can you build a diversified investment portfolio that matches your risk tolerance?",
      "What steps can you take today to establish the foundation for long-term wealth growth?",
    ],
    []
  );

  const handleChoice = (option) => {
    if (selectedOption || showResult) return;

    resetFeedback();
    const currentStageData = GROWTH_BASICS_STAGES[currentStage];
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
  const stage = GROWTH_BASICS_STAGES[Math.min(currentStage, totalStages - 1)];
  const hasPassed = finalScore === successThreshold;

  return (
    <GameShell
      title="Growth Basics Checkpoint"
      subtitle={subtitle}
      score={coins}
      coins={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      maxScore={GROWTH_BASICS_STAGES.length}
      currentLevel={Math.min(currentStage + 1, GROWTH_BASICS_STAGES.length)}
      totalLevels={GROWTH_BASICS_STAGES.length}
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
            <span>Task</span>
            <span>7 Safe Decisions</span>
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
                        { stageId: GROWTH_BASICS_STAGES[currentStage].id, isCorrect: GROWTH_BASICS_STAGES[currentStage].options.find(opt => opt.id === selectedOption)?.isCorrect },
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
                    Skill unlocked: <strong>Foundation wealth building</strong>
                  </p>
                  <p className="text-base text-green-400 font-semibold mt-4">
                    Outcome: You have built a foundation for long-term financial growth.
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
              Skill unlocked: <strong>Foundation wealth building</strong>
            </p>
            <p className="text-base text-green-400 font-semibold">
              You have built a foundation for long-term financial growth.
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

export default GrowthBasicsCheckpoint;