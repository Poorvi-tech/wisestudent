import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const CONSISTENT_INVESTING_STAGES = [
  {
    id: 1,
    prompt: "What matters more?",
    options: [
      {
        id: "large",
        label: "Large one-time investments",
        reflection: "While large one-time investments can be beneficial, they're not always feasible for young adults with limited capital. The key is starting with what you can afford consistently.",
        isCorrect: false,
      },
      {
        id: "small",
        label: "Small, regular contributions",
        reflection: "Exactly! Consistency beats size early on. Small, regular contributions build the habit of investing and can grow significantly over time through compound interest.",
        isCorrect: true,
      },
      {
        id: "timing",
        label: "Perfect market timing",
        reflection: "Trying to time the market perfectly is extremely difficult even for professionals. Consistent investing through market ups and downs is more reliable than timing.",
        isCorrect: false,
      },
      {
        id: "lump",
        label: "Waiting to invest a lump sum",
        reflection: "Waiting for a large lump sum may mean missing out on years of potential growth. Starting small and staying consistent often leads to better long-term results.",
        isCorrect: false,
      },
    ],
    reward: 15,
  },
  {
    id: 2,
    prompt: "Why is starting small beneficial for beginners?",
    options: [
      {
        id: "pressure",
        label: "Reduces financial pressure",
        reflection: "Perfect! Starting small reduces the financial pressure and risk. It allows you to learn about investing without putting your financial security at risk.",
        isCorrect: true,
      },
      {
        id: "returns",
        label: "Guarantees higher returns",
        reflection: "Starting small doesn't guarantee higher returns. The benefit is in building sustainable habits and reducing risk, not in immediate returns.",
        isCorrect: false,
      },
      {
        id: "complexity",
        label: "Makes investing more complex",
        reflection: "Starting small actually simplifies investing by allowing you to focus on learning fundamentals without the stress of managing large amounts.",
        isCorrect: false,
      },
      {
        id: "delay",
        label: "Delays wealth building significantly",
        reflection: "While starting small may seem slower initially, the power of compound interest over time can make up for the smaller starting amounts.",
        isCorrect: false,
      },
    ],
    reward: 15,
  },
  {
    id: 3,
    prompt: "What is the advantage of regular contributions?",
    options: [
      
      {
        id: "timing",
        label: "Perfect timing every time",
        reflection: "Regular contributions don't guarantee perfect timing, but they help smooth out market volatility through consistent investing regardless of market conditions.",
        isCorrect: false,
      },
      {
        id: "control",
        label: "Complete control over market movements",
        reflection: "Regular contributions don't give you control over market movements. They provide a disciplined approach to investing despite market fluctuations.",
        isCorrect: false,
      },
      {
        id: "guarantee",
        label: "Guaranteed profits in all market conditions",
        reflection: "No investment strategy can guarantee profits in all market conditions. Regular contributions help manage risk but don't eliminate it entirely.",
        isCorrect: false,
      },
      {
        id: "dollar",
        label: "Dollar-cost averaging benefits",
        reflection: "Exactly! Regular contributions allow you to buy more shares when prices are low and fewer when prices are high, averaging out your purchase price over time.",
        isCorrect: true,
      },
    ],
    reward: 15,
  },
  {
    id: 4,
    prompt: "How does consistency impact long-term wealth building?",
    options: [
      
      {
        id: "quick",
        label: "Creates quick wealth overnight",
        reflection: "Consistency is about long-term wealth building, not quick gains. Sustainable wealth creation takes time and patience with consistent contributions.",
        isCorrect: false,
      },
      {
        id: "compound",
        label: "Enables compound growth over time",
        reflection: "Perfect! Consistency allows compound interest to work its magic. Even small amounts invested regularly can grow substantially over decades through reinvested returns.",
        isCorrect: true,
      },
      {
        id: "volatile",
        label: "Makes investments more volatile",
        reflection: "Consistency actually helps smooth out volatility by spreading investments over time rather than making large, sporadic investments.",
        isCorrect: false,
      },
      {
        id: "complex",
        label: "Complicates investment strategies",
        reflection: "Consistency simplifies investing by creating a routine. It removes the need to constantly decide when and how much to invest.",
        isCorrect: false,
      },
    ],
    reward: 15,
  },
  {
    id: 5,
    prompt: "What should you prioritize when starting to invest?",
    options: [
      {
        id: "amount",
        label: "The amount you invest each month",
        reflection: "While the amount matters, consistency in investing regularly is more important than the specific amount. Start with what you can afford and maintain the habit.",
        isCorrect: false,
      },
      
      {
        id: "stocks",
        label: "Choosing the perfect stocks or funds",
        reflection: "While choosing good investments is important, building the investing habit comes first. You can refine your investment choices over time as you gain experience.",
        isCorrect: false,
      },
      {
        id: "habit",
        label: "Building the habit of regular investing",
        reflection: "Exactly! Building the habit of regular investing is the most important priority. Once the habit is established, you can gradually increase the amount as your financial situation improves.",
        isCorrect: true,
      },
      {
        id: "timing",
        label: "Finding the perfect time to start",
        reflection: "Waiting for the perfect time often means never starting. The best time to begin investing is now, even if it's with small amounts.",
        isCorrect: false,
      },
    ],
    reward: 15,
  },
];

const totalStages = CONSISTENT_INVESTING_STAGES.length;
const successThreshold = totalStages;

const StartSmallStayConsistent = () => {
  const location = useLocation();
  const gameId = "finance-young-adult-69";
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
      "How can you start building an investing habit with your current income?",
      "What strategies can help you maintain consistency in your investment approach?",
    ],
    []
  );

  const handleChoice = (option) => {
    if (selectedOption || showResult) return;

    resetFeedback();
    const currentStageData = CONSISTENT_INVESTING_STAGES[currentStage];
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
  const stage = CONSISTENT_INVESTING_STAGES[Math.min(currentStage, totalStages - 1)];
  const hasPassed = finalScore === successThreshold;

  return (
    <GameShell
      title="Start Small, Stay Consistent"
      subtitle={subtitle}
      score={showResult ? finalScore : coins}
      coins={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      maxScore={CONSISTENT_INVESTING_STAGES.length}
      currentLevel={Math.min(currentStage + 1, CONSISTENT_INVESTING_STAGES.length)}
      totalLevels={CONSISTENT_INVESTING_STAGES.length}
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
            <span>Consistent Investing</span>
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
                    Skill unlocked: <strong>Consistent investing habit</strong>
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
              Skill unlocked: <strong>Consistent investing habit</strong>
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

export default StartSmallStayConsistent;