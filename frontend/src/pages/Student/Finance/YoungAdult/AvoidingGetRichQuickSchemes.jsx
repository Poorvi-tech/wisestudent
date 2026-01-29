import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const GET_RICH_QUICK_STAGES = [
  {
    id: 1,
    prompt: "“Guaranteed high returns” usually indicate:",
    options: [
      {
        id: "safe",
        label: "Safe investment",
        reflection: "Guaranteed high returns are extremely rare and usually indicate either fraud or extremely high risk. Legitimate investments always carry some level of risk.",
        isCorrect: false,
      },
      
      {
        id: "opportunity",
        label: "Great opportunity you shouldn't miss",
        reflection: "Claims of 'can't miss' opportunities with guaranteed returns are typically marketing tactics used by scammers to pressure you into making quick decisions.",
        isCorrect: false,
      },
      {
        id: "professional",
        label: "Professional investment advice",
        reflection: "Professional advisors don't guarantee returns. They provide guidance based on analysis, but all investments carry uncertainty and risk.",
        isCorrect: false,
      },
      {
        id: "scam",
        label: "Scam or high risk",
        reflection: "Exactly! Guaranteed returns are a red flag. No legitimate investment can guarantee high returns without corresponding high risk or potential fraud.",
        isCorrect: true,
      },
    ],
    reward: 15,
  },
  {
    id: 2,
    prompt: "What should you be suspicious of in investment offers?",
    options: [
      {
        id: "guarantees",
        label: "Guaranteed returns with no risk",
        reflection: "Perfect! Any investment promising guaranteed returns with no risk should be viewed with extreme skepticism. All investments involve some level of risk.",
        isCorrect: true,
      },
      {
        id: "diversification",
        label: "Diversification strategies",
        reflection: "Diversification is a legitimate and recommended investment strategy. It's used to spread risk across different investments, not eliminate it entirely.",
        isCorrect: false,
      },
      {
        id: "research",
        label: "Thorough research and documentation",
        reflection: "Legitimate investments are backed by proper research and documentation. These are positive signs, not red flags to be suspicious of.",
        isCorrect: false,
      },
      {
        id: "regulation",
        label: "Regulatory compliance",
        reflection: "Regulatory compliance is a good sign for legitimate investments. It shows the investment follows proper legal and financial standards.",
        isCorrect: false,
      },
    ],
    reward: 15,
  },
  {
    id: 3,
    prompt: "How do legitimate investments typically perform?",
    options: [
      {
        id: "instant",
        label: "Instant wealth creation",
        reflection: "Legitimate wealth creation takes time and involves gradual growth. Claims of instant wealth are usually associated with scams or extremely high-risk investments.",
        isCorrect: false,
      },
      
      {
        id: "guaranteed",
        label: "Guaranteed steady returns every month",
        reflection: "Guaranteed monthly returns are unrealistic for most investments. Market conditions change, and legitimate investments reflect these changes.",
        isCorrect: false,
      },
      {
        id: "volatile",
        label: "Extremely volatile with huge swings",
        reflection: "While some investments can be volatile, consistently huge swings are usually a sign of high risk or potential fraud, not legitimate long-term investing.",
        isCorrect: false,
      },
      {
        id: "gradual",
        label: "Gradual growth with market fluctuations",
        reflection: "Exactly! Legitimate investments typically show gradual growth over time, with normal market ups and downs. This is the reality of sound investing.",
        isCorrect: true,
      },
    ],
    reward: 15,
  },
  {
    id: 4,
    prompt: "What is a common tactic used by investment scammers?",
    options: [
      {
        id: "transparency",
        label: "Full transparency about risks",
        reflection: "Transparency about risks is a sign of legitimate investment offerings. Scammers typically hide or downplay risks to make their schemes more attractive.",
        isCorrect: false,
      },
      
      {
        id: "education",
        label: "Providing educational resources",
        reflection: "Legitimate investment firms often provide educational resources to help investors make informed decisions. This is a positive practice, not a scam tactic.",
        isCorrect: false,
      },
      {
        id: "urgency",
        label: "Creating artificial urgency",
        reflection: "Exactly! Scammers often create false urgency with phrases like 'limited time offer' or 'act now before it's too late' to pressure you into making hasty decisions without proper research.",
        isCorrect: true,
      },
      {
        id: "credentials",
        label: "Showing proper credentials",
        reflection: "Displaying proper credentials and regulatory information is standard practice for legitimate investment professionals. Scammers typically lack or fake these credentials.",
        isCorrect: false,
      },
    ],
    reward: 15,
  },
  {
    id: 5,
    prompt: "What should you do before making any investment?",
    options: [
      {
        id: "ignore",
        label: "Ignore research and trust your gut",
        reflection: "Trusting your gut without research is risky. Proper due diligence is essential for making informed investment decisions and avoiding potential scams.",
        isCorrect: false,
      },
      {
        id: "research",
        label: "Research thoroughly and understand the risks",
        reflection: "Perfect! Always research investments thoroughly, understand the risks involved, and only invest money you can afford to lose. This approach helps protect against scams.",
        isCorrect: true,
      },
      {
        id: "follow",
        label: "Follow what everyone else is doing",
        reflection: "Following the crowd without understanding the investment is dangerous. Popular investments can still be scams, and what works for others may not be suitable for your situation.",
        isCorrect: false,
      },
      {
        id: "quick",
        label: "Make quick decisions to get the best deals",
        reflection: "Rushing into investment decisions often leads to poor outcomes. Legitimate investments don't require immediate action, and taking time to evaluate is usually beneficial.",
        isCorrect: false,
      },
    ],
    reward: 15,
  },
];

const totalStages = GET_RICH_QUICK_STAGES.length;
const successThreshold = totalStages;

const AvoidingGetRichQuickSchemes = () => {
  const location = useLocation();
  const gameId = "finance-young-adult-68";
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
      "How can you verify the legitimacy of an investment opportunity?",
      "What steps can you take to protect yourself from investment scams?",
    ],
    []
  );

  const handleChoice = (option) => {
    if (selectedOption || showResult) return;

    resetFeedback();
    const currentStageData = GET_RICH_QUICK_STAGES[currentStage];
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
  const stage = GET_RICH_QUICK_STAGES[Math.min(currentStage, totalStages - 1)];
  const hasPassed = finalScore === successThreshold;

  return (
    <GameShell
      title="Avoiding Get-Rich-Quick Schemes"
      subtitle={subtitle}
      score={coins}
      coins={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      maxScore={GET_RICH_QUICK_STAGES.length}
      currentLevel={Math.min(currentStage + 1, GET_RICH_QUICK_STAGES.length)}
      totalLevels={GET_RICH_QUICK_STAGES.length}
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
            <span>Investment Scams</span>
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
                        { stageId: GET_RICH_QUICK_STAGES[currentStage].id, isCorrect: GET_RICH_QUICK_STAGES[currentStage].options.find(opt => opt.id === selectedOption)?.isCorrect },
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
                    Skill unlocked: <strong>Investment scam awareness</strong>
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
              Skill unlocked: <strong>Investment scam awareness</strong>
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

export default AvoidingGetRichQuickSchemes;