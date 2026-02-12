import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const SIDE_INCOME_STAGES = [
  {
    id: 1,
    prompt: "Side income works best when:",
    options: [
      {
        id: "shortcut",
        label: "It's a shortcut to wealth",
        reflection: "Treating side income as a quick shortcut to wealth often leads to unrealistic expectations and poor decisions. Wealth building requires consistent effort and smart financial strategies.",
        isCorrect: false,
      },
      {
        id: "skills",
        label: "It uses skills and time wisely",
        reflection: "Exactly! The most successful side income opportunities leverage your existing skills and available time efficiently. This creates sustainable earnings without overwhelming your primary responsibilities.",
        isCorrect: true,
      },
      {
        id: "random",
        label: "It's chosen randomly without planning",
        reflection: "Choosing side income opportunities without planning often leads to inconsistent earnings and time wastage. Strategic selection based on your skills and available time yields better results.",
        isCorrect: false,
      },
      {
        id: "avoid",
        label: "It's avoided due to primary job restrictions",
        reflection: "While primary job restrictions need to be considered, there are many legitimate side income opportunities that can be pursued responsibly with proper time management.",
        isCorrect: false,
      },
    ],
    reward: 15,
  },
  {
    id: 2,
    prompt: "How should you prioritize between your main job and side income?",
    options: [
      {
        id: "ignore-main",
        label: "Ignore your main job responsibilities for more side income",
        reflection: "Neglecting your primary job can lead to serious career consequences and potentially losing your main income source. Your main job should remain the priority for career stability.",
        isCorrect: false,
      },
     
      {
        id: "abandon",
        label: "Abandon side income entirely to focus on the main job",
        reflection: "Completely avoiding side income can miss opportunities to develop new skills, create additional financial security, and test new business ideas.",
        isCorrect: false,
      },
      {
        id: "swap",
        label: "Swap roles between main and side income",
        reflection: "Regularly switching primary focus creates inconsistency and may affect the quality of both income streams. Choose a primary income source and make strategic adjustments for side activities.",
        isCorrect: false,
      },
       {
        id: "balanced",
        label: "Keep your main job priority but manage time for side income",
        reflection: "Perfect! Maintain your primary job's excellence while efficiently allocating time for side income. This ensures job security while building additional revenue streams.",
        isCorrect: true,
      },
    ],
    reward: 15,
  },
  {
    id: 3,
    prompt: "What is the sustainable approach to generating side income?",
    options: [
      {
        id: "sustainable",
        label: "Use legitimate methods that create consistent income streams",
        reflection: "Exactly! Legitimate methods like freelancing, tutoring, e-commerce, content creation, or investment dividends offer the sustainable, steady growth necessary for real wealth accumulation.",
        isCorrect: true,
      },
      {
        id: "scam",
        label: "Look for 'get rich quick' schemes and fast money options",
        reflection: "'Get rich quick' schemes are rarely sustainable and often involve risk or even illegitimate practices. Building side income should involve ethical methods that offer consistent long-term earnings.",
        isCorrect: false,
      },
      
      {
        id: "multiple-random",
        label: "Spread across too many random methods for minimal time investment",
        reflection: "Attempting numerous scattered efforts with limited time and effort rarely leads to substantial income. It's more effective to focus on fewer methods done thoroughly than many attempted lightly.",
        isCorrect: false,
      },
      {
        id: "no-budget",
        label: "Don't set clear time limits or budget rules for side work",
        reflection: "Lacking defined boundaries causes poor resource management, excessive time dedication that affects rest/recreation, and reduces work efficiency. It's healthier to follow strategic time-use approaches.",
        isCorrect: false,
      },
    ],
    reward: 15,
  },
  {
    id: 4,
    prompt: "How much of your overall effort should realistically go towards side income?",
    options: [
      {
        id: "unlimited",
        label: "Max out all remaining available time constantly to increase productivity",
        reflection: "Expecting too high demands from unvarying contribution inevitably threatens professional momentum & neglect personal comfort thereby proving irrational while progressing otherwise.",
        isCorrect: false,
      },
      
      {
        id: "minimal",
        label: "Only 5% effort to avoid any real commitment",
        reflection: "Minimal effort rarely produces meaningful results. Side income requires genuine investment of time and energy to generate substantial returns and develop valuable skills.",
        isCorrect: false,
      },
      {
        id: "balanced-split",
        label: "85:20 split between main job and side income",
        reflection: "Perfect! A balanced approach like 85% focus on your main job and 20% on side income ensures career growth while maintaining additional income streams without compromising quality or well-being.",
        isCorrect: true,
      },
      {
        id: "equal",
        label: "50:50 equal division between both income sources",
        reflection: "Equal division often leads to neither income source receiving sufficient attention for optimal performance. It's generally better to maintain a primary focus while supporting the secondary stream.",
        isCorrect: false,
      },
    ],
    reward: 15,
  },
  {
    id: 5,
    prompt: "What is the key to making side income truly beneficial?",
    options: [
      {
        id: "immediate",
        label: "Focus only on immediate monetary rewards",
        reflection: "Focusing solely on immediate rewards misses the bigger picture. The real value of side income often lies in skill development, network building, and long-term financial security.",
        isCorrect: false,
      },
      {
        id: "long-term",
        label: "Use it to build skills and long-term financial security",
        reflection: "Exactly! The most beneficial side income opportunities help you develop new skills, expand your professional network, and create long-term financial stability beyond just immediate cash flow.",
        isCorrect: true,
      },
      {
        id: "spend-all",
        label: "Spend all side income immediately on wants and desires",
        reflection: "Spending all side income on immediate wants defeats the purpose of building financial security. The additional income should be used strategically to improve your overall financial position.",
        isCorrect: false,
      },
      {
        id: "ignore",
        label: "Ignore the potential for skill development and growth",
        reflection: "Ignoring the growth potential of side income opportunities limits your long-term career prospects and financial development. Every side income venture should be viewed as a learning and growth opportunity.",
        isCorrect: false,
      },
    ],
    reward: 15,
  },
];

const totalStages = SIDE_INCOME_STAGES.length;
const successThreshold = totalStages;

const SideIncomeTruth = () => {
  const location = useLocation();
  const gameId = "finance-young-adult-73";
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
      "How can you leverage your existing skills to create sustainable side income?",
      "What balance between your main job and side income works best for your situation?",
    ],
    []
  );

  const handleChoice = (option) => {
    if (selectedOption || showResult) return;

    resetFeedback();
    const currentStageData = SIDE_INCOME_STAGES[currentStage];
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
  const stage = SIDE_INCOME_STAGES[Math.min(currentStage, totalStages - 1)];
  const hasPassed = finalScore === successThreshold;

  return (
    <GameShell
      title="Side Income Truth"
      subtitle={subtitle}
      score={coins}
      coins={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      maxScore={SIDE_INCOME_STAGES.length}
      currentLevel={Math.min(currentStage + 1, SIDE_INCOME_STAGES.length)}
      totalLevels={SIDE_INCOME_STAGES.length}
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
            <span>Side Income</span>
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
                    Skill unlocked: <strong>Side income strategy</strong>
                  </p>
                  <p className="text-base text-green-400 font-semibold mt-4">
                    Outcome: Sustainable side income needs effort.
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
              Skill unlocked: <strong>Side income strategy</strong>
            </p>
            <p className="text-base text-green-400 font-semibold">
              Sustainable side income needs effort.
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

export default SideIncomeTruth;