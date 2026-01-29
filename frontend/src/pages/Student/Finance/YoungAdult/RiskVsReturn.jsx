import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const RISK_RETURN_STAGES = [
  {
    id: 1,
    prompt: "Higher returns usually mean:",
    options: [
      {
        id: "no-risk",
        label: "No risk",
        reflection: "Higher returns typically come with higher risk. Investments with no risk usually offer lower, more predictable returns.",
        isCorrect: false,
      },
      {
        id: "higher-risk",
        label: "Higher risk",
        reflection: "Exactly! The fundamental principle of investing is that higher potential returns are associated with higher levels of risk.",
        isCorrect: true,
      },
      {
        id: "guaranteed",
        label: "Guaranteed profits",
        reflection: "No investment is truly guaranteed. Even seemingly safe investments carry some level of risk, and higher returns usually mean higher uncertainty.",
        isCorrect: false,
      },
      {
        id: "stable",
        label: "Stable and predictable",
        reflection: "Stability and predictability are typically associated with lower returns. Higher returns usually involve more volatility and uncertainty.",
        isCorrect: false,
      },
    ],
    reward: 15,
  },
  {
    id: 2,
    prompt: "What is the relationship between risk and return?",
    options: [
      {
        id: "independent",
        label: "They are completely independent",
        reflection: "Risk and return are closely related. Understanding this relationship is fundamental to making informed investment decisions.",
        isCorrect: false,
      },
      
      {
        id: "reversed",
        label: "Higher returns always mean lower risk",
        reflection: "This is generally not true. The risk-return relationship typically works in the opposite direction, with higher returns associated with higher risk.",
        isCorrect: false,
      },
      {
        id: "opposite",
        label: "Higher risk generally leads to higher potential returns",
        reflection: "Perfect! This is a core principle of investing - the risk-return tradeoff suggests that investments offering higher potential returns also come with higher risk.",
        isCorrect: true,
      },
      {
        id: "same",
        label: "Risk and return always stay the same",
        reflection: "Investment risk and return vary together. They don't remain constant - they have a dynamic relationship that changes based on market conditions.",
        isCorrect: false,
      },
    ],
    reward: 15,
  },
  {
    id: 3,
    prompt: "Why might an investor accept higher risk?",
    options: [
      {
        id: "returns",
        label: "To potentially achieve higher returns",
        reflection: "Exactly! Investors may accept higher risk for the possibility of earning higher returns, understanding that there's no guarantee of success.",
        isCorrect: true,
      },
      {
        id: "security",
        label: "To achieve better security",
        reflection: "Accepting higher risk usually reduces security, not improves it. Lower risk investments typically offer more stability and protection.",
        isCorrect: false,
      },
      
      {
        id: "safety",
        label: "To ensure complete safety",
        reflection: "Higher risk investments don't provide complete safety. For safety, investors typically choose lower-risk options like savings accounts or government bonds.",
        isCorrect: false,
      },
      {
        id: "liquidity",
        label: "To improve liquidity",
        reflection: "Risk level doesn't directly determine liquidity. Some high-risk investments are highly liquid, while some low-risk investments may be less liquid.",
        isCorrect: false,
      },
    ],
    reward: 15,
  },
  {
    id: 4,
    prompt: "What should you consider before choosing high-risk investments?",
    options: [
      {
        id: "nothing",
        label: "Nothing - just go for the highest returns",
        reflection: "Making investment decisions without considering risk can lead to significant losses. It's important to evaluate your risk tolerance and financial goals.",
        isCorrect: false,
      },
      
      {
        id: "trends",
        label: "Only recent market trends",
        reflection: "While market trends are important, they shouldn't be the only factor. Your personal financial situation and long-term goals are equally important.",
        isCorrect: false,
      },
      {
        id: "friends",
        label: "What your friends are investing in",
        reflection: "Following others' investment choices without considering your own situation can be risky. Your investment decisions should be based on your personal financial goals.",
        isCorrect: false,
      },
      {
        id: "factors",
        label: "Your risk tolerance, financial goals, and time horizon",
        reflection: "Perfect! These factors are crucial in determining whether high-risk investments align with your overall financial strategy and personal circumstances.",
        isCorrect: true,
      },
    ],
    reward: 15,
  },
  {
    id: 5,
    prompt: "How can understanding risk-return help you?",
    options: [
      {
        id: "ignore",
        label: "Ignore all investment advice",
        reflection: "Understanding risk-return principles should help you make better decisions, not ignore advice. It gives you a framework for evaluating investment opportunities.",
        isCorrect: false,
      },
      
      {
        id: "avoid",
        label: "Avoid all investments",
        reflection: "Understanding risk-return should help you make better investment choices, not avoid investing altogether. Some level of investment is usually necessary for financial growth.",
        isCorrect: false,
      },
      {
        id: "decisions",
        label: "Make more informed investment decisions",
        reflection: "Exactly! Understanding the risk-return relationship helps you evaluate investment opportunities and choose options that align with your risk tolerance and goals.",
        isCorrect: true,
      },
      {
        id: "gamble",
        label: "Take unnecessary risks",
        reflection: "Understanding risk-return should help you make calculated decisions, not encourage unnecessary gambling. The goal is to find the right balance for your situation.",
        isCorrect: false,
      },
    ],
    reward: 15,
  },
];

const totalStages = RISK_RETURN_STAGES.length;
const successThreshold = totalStages;

const RiskVsReturn = () => {
  const location = useLocation();
  const gameId = "finance-young-adult-66";
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
      "How can you balance potential returns with acceptable risk levels?",
      "What factors should influence your risk tolerance in investments?",
    ],
    []
  );

  const handleChoice = (option) => {
    if (selectedOption || showResult) return;

    resetFeedback();
    const currentStageData = RISK_RETURN_STAGES[currentStage];
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
  const stage = RISK_RETURN_STAGES[Math.min(currentStage, totalStages - 1)];
  const hasPassed = finalScore === successThreshold;

  return (
    <GameShell
      title="Risk vs Return"
      subtitle={subtitle}
      score={coins}
      coins={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      maxScore={RISK_RETURN_STAGES.length}
      currentLevel={Math.min(currentStage + 1, RISK_RETURN_STAGES.length)}
      totalLevels={RISK_RETURN_STAGES.length}
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
            <span>Risk and Return</span>
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
                        { stageId: RISK_RETURN_STAGES[currentStage].id, isCorrect: RISK_RETURN_STAGES[currentStage].options.find(opt => opt.id === selectedOption)?.isCorrect },
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
                    Skill unlocked: <strong>Risk-return analysis</strong>
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
              Skill unlocked: <strong>Risk-return analysis</strong>
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

export default RiskVsReturn;