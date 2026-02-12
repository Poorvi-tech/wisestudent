import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const LONG_TERM_STAGES = [
  {
    id: 1,
    prompt: "Investing works best when:",
    options: [
      {
        id: "chase",
        label: "You chase daily prices",
        reflection: "Chasing daily prices often leads to emotional decision-making and can result in buying high and selling low. This approach typically undermines long-term investment success.",
        isCorrect: false,
      },
      
      {
        id: "timing",
        label: "You try to time the market perfectly",
        reflection: "Market timing is extremely difficult even for professionals. Attempting to time the market often leads to missed opportunities and poor investment outcomes.",
        isCorrect: false,
      },
      {
        id: "panic",
        label: "You panic during market downturns",
        reflection: "Panicking during downturns and selling investments can lock in losses. Long-term investors typically benefit from staying invested through market cycles.",
        isCorrect: false,
      },
      {
        id: "long-term",
        label: "You stay invested long-term",
        reflection: "Exactly! Long-term investing allows you to benefit from compound growth and ride out short-term market volatility. Patience is a key ingredient for investment success.",
        isCorrect: true,
      },
    ],
    reward: 15,
  },
  {
    id: 2,
    prompt: "What is the benefit of compound interest?",
    options: [
      {
        id: "immediate",
        label: "Immediate large returns",
        reflection: "Compound interest works gradually over time. The real power comes from reinvesting returns, which creates exponential growth over extended periods.",
        isCorrect: false,
      },
      {
        id: "growth",
        label: "Exponential growth over time",
        reflection: "Perfect! Compound interest allows your money to earn returns on returns, creating accelerated growth the longer you stay invested. This is why starting early matters.",
        isCorrect: true,
      },
      {
        id: "simple",
        label: "Simple interest on principal only",
        reflection: "That's simple interest, not compound interest. Compound interest includes returns on both your principal and previously earned returns.",
        isCorrect: false,
      },
      {
        id: "fixed",
        label: "Fixed returns regardless of time",
        reflection: "Compound interest grows over time. The longer your money is invested, the more powerful the compounding effect becomes.",
        isCorrect: false,
      },
    ],
    reward: 15,
  },
  {
    id: 3,
    prompt: "How should you handle short-term market volatility?",
    options: [
      {
        id: "react",
        label: "React immediately to every change",
        reflection: "Reacting to every market movement often leads to poor decisions. Short-term volatility is normal and expected in long-term investing.",
        isCorrect: false,
      },
      
      {
        id: "sell",
        label: "Sell everything when markets drop",
        reflection: "Selling during downturns locks in losses and prevents you from participating in the eventual recovery. This is typically counterproductive for long-term wealth building.",
        isCorrect: false,
      },
      {
        id: "ignore",
        label: "Stay focused on long-term goals",
        reflection: "Exactly! Long-term investors understand that short-term fluctuations are part of the journey. Staying focused on your goals helps you avoid emotional decisions.",
        isCorrect: true,
      },
      {
        id: "avoid",
        label: "Avoid investing during volatile periods",
        reflection: "Avoiding volatile periods means missing opportunities. Long-term success comes from staying invested through various market conditions.",
        isCorrect: false,
      },
    ],
    reward: 15,
  },
  {
    id: 4,
    prompt: "What is the advantage of starting to invest early?",
    options: [
      {
        id: "time",
        label: "More time for compound growth",
        reflection: "Exactly! The earlier you start, the more time your money has to grow through compound interest. Even small amounts can become substantial over decades.",
        isCorrect: true,
      },
      {
        id: "lucky",
        label: "You get lucky with timing",
        reflection: "While timing can play a role, the main advantage of starting early is the power of compound interest over a longer time horizon, not luck.",
        isCorrect: false,
      },
      
      {
        id: "knowledge",
        label: "You learn investment strategies faster",
        reflection: "Starting early doesn't necessarily mean faster learning. The key advantage is the extended time horizon for your investments to compound.",
        isCorrect: false,
      },
      {
        id: "opportunity",
        label: "You get better investment opportunities",
        reflection: "Investment opportunities are generally available to all investors. The main benefit of starting early is time, not access to special opportunities.",
        isCorrect: false,
      },
    ],
    reward: 15,
  },
  {
    id: 5,
    prompt: "What mindset should long-term investors cultivate?",
    options: [
      {
        id: "greedy",
        label: "Get rich quick mentality",
        reflection: "A 'get rich quick' mentality often leads to risky behavior and poor investment decisions. Sustainable wealth building requires patience and discipline.",
        isCorrect: false,
      },
      
      {
        id: "fear",
        label: "Fear of missing out on trends",
        reflection: "FOMO can lead to chasing hot investments at the wrong time. Long-term investors focus on their strategy rather than market trends.",
        isCorrect: false,
      },
      {
        id: "comparison",
        label: "Constant comparison with others",
        reflection: "Comparing your portfolio to others can lead to poor decisions based on incomplete information. Focus on your own financial goals and timeline.",
        isCorrect: false,
      },
      {
        id: "patient",
        label: "Patience and discipline",
        reflection: "Perfect! Patience rewards discipline. Long-term investing success comes from consistently following your strategy and resisting the urge to make impulsive decisions.",
        isCorrect: true,
      },
    ],
    reward: 15,
  },
];

const totalStages = LONG_TERM_STAGES.length;
const successThreshold = totalStages;

const LongTermInvestingMindset = () => {
  const location = useLocation();
  const gameId = "finance-young-adult-67";
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
      "How can you maintain a long-term perspective during market volatility?",
      "What strategies can help you stay disciplined with your investment approach?",
    ],
    []
  );

  const handleChoice = (option) => {
    if (selectedOption || showResult) return;

    resetFeedback();
    const currentStageData = LONG_TERM_STAGES[currentStage];
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
  const stage = LONG_TERM_STAGES[Math.min(currentStage, totalStages - 1)];
  const hasPassed = finalScore === successThreshold;

  return (
    <GameShell
      title="Long-Term Investing Mindset"
      subtitle={subtitle}
      score={coins}
      coins={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      maxScore={LONG_TERM_STAGES.length}
      currentLevel={Math.min(currentStage + 1, LONG_TERM_STAGES.length)}
      totalLevels={LONG_TERM_STAGES.length}
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
            <span>Long-Term Investing</span>
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
                    Skill unlocked: <strong>Long-term investment discipline</strong>
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
              Skill unlocked: <strong>Long-term investment discipline</strong>
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

export default LongTermInvestingMindset;