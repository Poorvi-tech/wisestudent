import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const DELAYED_GRATIFICATION_STAGES = [
  {
    id: 1,
    prompt: "Waiting before buying helps because:",
    options: [
      {
        id: "reduce",
        label: "It reduces desire",
        reflection: "While waiting may reduce immediate wanting, the primary benefit is improved decision-making rather than diminished desire.",
        isCorrect: false,
      },
      {
        id: "improve",
        label: "It improves decision quality",
        reflection: "Exactly! Delay creates space for rational evaluation and helps distinguish between impulse and genuine need or value.",
        isCorrect: true,
      },
      {
        id: "forget",
        label: "You forget you wanted it",
        reflection: "Forgetting wants entirely isn't the goal - thoughtful consideration helps prioritize what truly adds value to your life.",
        isCorrect: false,
      },
      {
        id: "bargain",
        label: "Prices drop while you wait",
        reflection: "While some prices do decrease over time, relying on this isn't a reliable strategy and misses the core benefit of deliberate decision-making.",
        isCorrect: false,
      },
    ],
    reward: 10,
  },
  {
    id: 2,
    prompt: "How long should you wait before major purchases?",
    options: [
      {
        id: "thoughtful",
        label: "24-48 hours for reflection",
        reflection: "Perfect! This timeframe allows emotional impulses to settle while still being practical for most purchasing decisions.",
        isCorrect: true,
      },
      {
        id: "instant",
        label: "Buy immediately when you want it",
        reflection: "Immediate purchasing often leads to buyer's remorse and financial decisions that don't align with long-term goals or true needs.",
        isCorrect: false,
      },
      
      {
        id: "extreme",
        label: "Months or years for everything",
        reflection: "Extremely long waiting periods can prevent enjoying life and may cause you to miss genuine opportunities or needs.",
        isCorrect: false,
      },
      {
        id: "random",
        label: "Random waiting based on mood",
        reflection: "Inconsistent approaches don't build the systematic thinking habits needed for reliable financial decision-making.",
        isCorrect: false,
      },
    ],
    reward: 10,
  },
  {
    id: 3,
    prompt: "What's the psychological benefit of delayed purchases?",
    options: [
      {
        id: "denial",
        label: "Denial of all wants",
        reflection: "Complete denial creates resentment and doesn't address the underlying need for reasonable enjoyment and fulfillment.",
        isCorrect: false,
      },
      
      {
        id: "scarcity",
        label: "Creating artificial scarcity",
        reflection: "Manufactured scarcity increases stress rather than providing the clarity needed for thoughtful financial decisions.",
        isCorrect: false,
      },
      {
        id: "boredom",
        label: "Learning patience through boredom",
        reflection: "While patience develops, the primary benefit is improved decision quality rather than endurance of uncomfortable feelings.",
        isCorrect: false,
      },
      {
        id: "clarity",
        label: "Clarity about true value",
        reflection: "Exactly! Delay allows you to assess whether purchases align with your values and provide genuine long-term satisfaction.",
        isCorrect: true,
      },
    ],
    reward: 10,
  },
  {
    id: 4,
    prompt: "How can you implement delayed gratification effectively?",
    options: [
      {
        id: "strict",
        label: "Strict waiting rules for everything",
        reflection: "Overly rigid rules can create unnecessary stress and may prevent reasonable spontaneous decisions that add genuine value.",
        isCorrect: false,
      },
     
      {
        id: "impulse",
        label: "Follow impulses but track spending",
        reflection: "Tracking alone doesn't address the core issue - delayed gratification specifically targets improved decision-making quality.",
        isCorrect: false,
      },
       {
        id: "systematic",
        label: "Systematic approach based on purchase type",
        reflection: "Perfect! Different waiting periods for different purchase categories creates practical discipline while allowing life flexibility.",
        isCorrect: true,
      },
      {
        id: "avoid",
        label: "Avoid all non-essential purchases",
        reflection: "Complete avoidance isn't sustainable and may prevent building the balanced decision-making skills that delayed gratification develops.",
        isCorrect: false,
      },
    ],
    reward: 10,
  },
  {
    id: 5,
    prompt: "What's the long-term impact of practicing delayed gratification?",
    options: [
      {
        id: "restriction",
        label: "Creates unnecessary restrictions",
        reflection: "Actually, delayed gratification increases freedom by building financial security and reducing regret from impulsive decisions.",
        isCorrect: false,
      },
      {
        id: "freedom",
        label: "Builds financial freedom and confidence",
        reflection: "Exactly! The discipline creates security and self-trust that enables greater future choices and opportunities.",
        isCorrect: true,
      },
      {
        id: "missed",
        label: "Causes missed opportunities",
        reflection: "Thoughtful timing often enhances rather than diminishes opportunities by ensuring resources are available for meaningful pursuits.",
        isCorrect: false,
      },
      {
        id: "stress",
        label: "Increases decision-making stress",
        reflection: "While initial practice may feel challenging, the skill ultimately reduces financial stress by creating better outcomes and confidence.",
        isCorrect: false,
      },
    ],
    reward: 10,
  },
];

const totalStages = DELAYED_GRATIFICATION_STAGES.length;
const successThreshold = totalStages;

const DelayedGratification = () => {
  const location = useLocation();
  const gameId = "finance-young-adult-39";
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
      "How can delayed gratification actually increase your long-term satisfaction and financial security?",
      "What waiting period system works best for your personality and financial goals?",
    ],
    []
  );

  const handleChoice = (option) => {
    if (selectedOption || showResult) return;

    resetFeedback();
    const currentStageData = DELAYED_GRATIFICATION_STAGES[currentStage];
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
  const stage = DELAYED_GRATIFICATION_STAGES[Math.min(currentStage, totalStages - 1)];
  const hasPassed = finalScore === successThreshold;

  return (
    <GameShell
      title="Delayed Gratification"
      subtitle={subtitle}
      score={coins}
      coins={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      maxScore={DELAYED_GRATIFICATION_STAGES.length}
      currentLevel={Math.min(currentStage + 1, DELAYED_GRATIFICATION_STAGES.length)}
      totalLevels={DELAYED_GRATIFICATION_STAGES.length}
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
            <span>Patience Strategy</span>
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
                        { stageId: DELAYED_GRATIFICATION_STAGES[currentStage].id, isCorrect: DELAYED_GRATIFICATION_STAGES[currentStage].options.find(opt => opt.id === selectedOption)?.isCorrect },
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
                    Skill unlocked: <strong>Delayed gratification mastery</strong>
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
              Skill unlocked: <strong>Delayed gratification mastery</strong>
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

export default DelayedGratification;