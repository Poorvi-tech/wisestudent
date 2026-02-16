import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const MUTUAL_FUNDS_STAGES = [
  {
    id: 1,
    prompt: "Mutual funds work by:",
    options: [
      {
        id: "gambling",
        label: "Gambling on prices",
        reflection: "Mutual funds are not gambling. They follow structured investment strategies with professional management and diversification.",
        isCorrect: false,
      },
      
      {
        id: "individual",
        label: "Individual stock picking",
        reflection: "While mutual funds may hold individual stocks, they're not about individual stock picking but rather diversified portfolio management.",
        isCorrect: false,
      },
      {
        id: "guaranteed",
        label: "Guaranteed returns",
        reflection: "Mutual funds don't guarantee returns. They offer the potential for returns based on the performance of the underlying assets.",
        isCorrect: false,
      },
      {
        id: "pooling",
        label: "Pooling money and spreading risk",
        reflection: "Exactly! Mutual funds collect money from many investors and invest in a diversified portfolio, spreading risk across multiple assets.",
        isCorrect: true,
      },
    ],
    reward: 15,
  },
  {
    id: 2,
    prompt: "What is the main benefit of mutual funds?",
    options: [
      {
        id: "control",
        label: "Complete control over investments",
        reflection: "In mutual funds, professional fund managers make investment decisions, not individual investors.",
        isCorrect: false,
      },
      
      {
        id: "timing",
        label: "Perfect market timing",
        reflection: "Mutual funds don't guarantee perfect timing. They focus on long-term investment strategies rather than market timing.",
        isCorrect: false,
      },
      {
        id: "diversification",
        label: "Diversification with small investment",
        reflection: "Perfect! Mutual funds allow you to invest in a diversified portfolio even with a small amount, spreading risk across many assets.",
        isCorrect: true,
      },
      {
        id: "liquidity",
        label: "Immediate liquidity like savings",
        reflection: "While mutual funds are relatively liquid, they're not as immediately accessible as savings accounts. There may be exit loads or processing time.",
        isCorrect: false,
      },
    ],
    reward: 15,
  },
  {
    id: 3,
    prompt: "Who manages mutual fund investments?",
    options: [
      {
        id: "investor",
        label: "Each individual investor",
        reflection: "Individual investors don't manage mutual fund investments directly. Professional fund managers handle the investment decisions.",
        isCorrect: false,
      },
      {
        id: "professional",
        label: "Professional fund managers",
        reflection: "Exactly! Professional fund managers with expertise in financial markets make investment decisions on behalf of all investors.",
        isCorrect: true,
      },
      {
        id: "government",
        label: "Government officials",
        reflection: "While regulated by government bodies, mutual funds are managed by private fund management companies, not government officials.",
        isCorrect: false,
      },
      {
        id: "random",
        label: "Random selection process",
        reflection: "Mutual fund investments follow strategic investment approaches, not random selection. Professional analysis guides investment decisions.",
        isCorrect: false,
      },
    ],
    reward: 15,
  },
  {
    id: 4,
    prompt: "What does diversification in mutual funds mean?",
    options: [
      {
        id: "spread",
        label: "Spreading investments across different assets",
        reflection: "Exactly! Diversification means spreading investments across various stocks, bonds, or other securities to reduce overall risk.",
        isCorrect: true,
      },
      {
        id: "single",
        label: "Investing in a single stock",
        reflection: "Diversification means the opposite - investing in multiple assets to reduce risk, not concentrating in a single stock.",
        isCorrect: false,
      },
      
      {
        id: "sector",
        label: "Investing only in one sector",
        reflection: "Diversification involves investing across multiple sectors, not limiting to just one sector.",
        isCorrect: false,
      },
      {
        id: "company",
        label: "Investing in the fund management company",
        reflection: "Diversification refers to the portfolio holdings within the fund, not investing in the fund management company itself.",
        isCorrect: false,
      },
    ],
    reward: 15,
  },
  {
    id: 5,
    prompt: "When is mutual fund investment suitable?",
    options: [
      {
        id: "expert",
        label: "Only for financial experts",
        reflection: "Mutual funds are designed for all investors, including beginners. Professional management makes them accessible to everyone.",
        isCorrect: false,
      },
      
      {
        id: "large",
        label: "Only for large investments",
        reflection: "Mutual funds have low minimum investment requirements, making them accessible even for small investment amounts.",
        isCorrect: false,
      },
      {
        id: "short",
        label: "For short-term trading",
        reflection: "Mutual funds are typically better suited for medium to long-term investment horizons rather than short-term trading.",
        isCorrect: false,
      },
      {
        id: "beginner",
        label: "For beginners and experienced investors alike",
        reflection: "Exactly! Mutual funds are suitable for investors at all levels due to professional management and built-in diversification.",
        isCorrect: true,
      },
    ],
    reward: 15,
  },
];

const totalStages = MUTUAL_FUNDS_STAGES.length;
const successThreshold = totalStages;

const MutualFundsBasicIdea = () => {
  const location = useLocation();
  const gameId = "finance-young-adult-65";
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
      "How can diversification help protect your investments?",
      "When would mutual funds be appropriate for your investment goals?",
    ],
    []
  );

  const handleChoice = (option) => {
    if (selectedOption || showResult) return;

    resetFeedback();
    const currentStageData = MUTUAL_FUNDS_STAGES[currentStage];
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
  const stage = MUTUAL_FUNDS_STAGES[Math.min(currentStage, totalStages - 1)];
  const hasPassed = finalScore === successThreshold;

  return (
    <GameShell
      title="Mutual Funds – Basic Idea"
      subtitle={subtitle}
      score={showResult ? finalScore : coins}
      coins={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      maxScore={MUTUAL_FUNDS_STAGES.length}
      currentLevel={Math.min(currentStage + 1, MUTUAL_FUNDS_STAGES.length)}
      totalLevels={MUTUAL_FUNDS_STAGES.length}
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
            <span>Mutual Funds</span>
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
                    Skill unlocked: <strong>Mutual fund understanding</strong>
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
              Skill unlocked: <strong>Mutual fund understanding</strong>
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

export default MutualFundsBasicIdea;