import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const WHY_SAVE_EARLY_STAGES = [
  {
    id: 1,
    prompt: "Why is saving early powerful?",
    options: [
      {
        id: "doesnt-matter",
        label: "It doesn't matter",
        reflection: "Actually, time is one of the most powerful tools in building wealth. Starting early gives you a significant advantage.",
        isCorrect: false,
      },
      {
        id: "time-helps",
        label: "Time helps money grow",
        reflection: "Exactly! The power of compound interest means your money can grow exponentially over time when you start early.",
        isCorrect: true,
      },
      {
        id: "money-grows",
        label: "Money grows on its own",
        reflection: "Money doesn't grow on its own - it needs time and consistent contributions to benefit from compound interest.",
        isCorrect: false,
      },
      {
        id: "later-better",
        label: "Saving later is better",
        reflection: "While it's never too late to start saving, starting early maximizes the benefits of compound growth over decades.",
        isCorrect: false,
      },
    ],
    reward: 15,
  },
  {
    id: 2,
    prompt: "What happens when you start saving early?",
    options: [
      {
        id: "no-difference",
        label: "No real difference in the long run",
        reflection: "Starting early makes a massive difference due to the compounding effect. Even small amounts can grow significantly over time.",
        isCorrect: false,
      },
      
      {
        id: "more-pressure",
        label: "You feel more financial pressure",
        reflection: "Starting early actually reduces financial pressure by giving you more time to build your wealth gradually.",
        isCorrect: false,
      },
      {
        id: "compound-advantage",
        label: "Compound interest works in your favor",
        reflection: "Perfect! Compound interest allows your earnings to generate their own earnings, creating exponential growth over time.",
        isCorrect: true,
      },
      {
        id: "restrictive",
        label: "It becomes too restrictive",
        reflection: "Early saving habits, when started small, become natural and don't feel restrictive. They actually provide financial freedom.",
        isCorrect: false,
      },
    ],
    reward: 15,
  },
  {
    id: 3,
    prompt: "How does time affect your savings growth?",
    options: [
       {
        id: "exponential-growth",
        label: "Time creates exponential growth potential",
        reflection: "Exactly! The longer your money has to compound, the more dramatic the growth becomes. This is the power of starting early.",
        isCorrect: true,
      },
      {
        id: "linear-growth",
        label: "Savings grow at a steady, linear rate",
        reflection: "Savings with compound interest grow exponentially, not linearly. The growth accelerates over time as interest earns interest.",
        isCorrect: false,
      },
     
      {
        id: "slows-down",
        label: "Growth slows down over time",
        reflection: "With compound interest, growth actually accelerates over time. The longer you leave money invested, the faster it grows.",
        isCorrect: false,
      },
      {
        id: "unpredictable",
        label: "It's unpredictable and risky",
        reflection: "While investments carry risk, the time value of money is a mathematical certainty. Starting early reduces the risk of not having enough saved.",
        isCorrect: false,
      },
    ],
    reward: 15,
  },
  {
    id: 4,
    prompt: "What's the biggest advantage young adults have when saving?",
    options: [
      {
        id: "more-income",
        label: "Higher income than older adults",
        reflection: "While income may increase, the biggest advantage isn't necessarily higher income, but the abundance of time available.",
        isCorrect: false,
      },
      
      {
        id: "fewer-expenses",
        label: "Fewer financial responsibilities",
        reflection: "While young adults may have fewer responsibilities, time remains the most powerful advantage for wealth building regardless of current expenses.",
        isCorrect: false,
      },
      {
        id: "better-investments",
        label: "Access to better investment options",
        reflection: "Investment options are generally available to everyone. The key differentiator for young adults is the time horizon for their investments.",
        isCorrect: false,
      },
      {
        id: "time-advantage",
        label: "Time is their greatest asset",
        reflection: "Perfect! Young adults have decades of potential compounding ahead of them, making time their most valuable resource for building wealth.",
        isCorrect: true,
      },
    ],
    reward: 15,
  },
  {
    id: 5,
    prompt: "What should be your approach to early saving?",
    options: [
      {
        id: "wait-large-amount",
        label: "Wait until you can save large amounts",
        reflection: "Waiting for large amounts often means missing out on years of compounding. Starting small early is more beneficial than waiting.",
        isCorrect: false,
      },
      
      {
        id: "focus-on-spending",
        label: "Focus on enjoying your money now",
        reflection: "While enjoying your money is important, balancing present enjoyment with future security through early saving creates the best outcome.",
        isCorrect: false,
      },
      {
        id: "start-small-consistent",
        label: "Start small but be consistent",
        reflection: "Exactly! Consistent small contributions early on can grow to substantial amounts due to the power of compound interest over time.",
        isCorrect: true,
      },
      {
        id: "save-everything",
        label: "Save everything you earn",
        reflection: "Saving everything isn't sustainable or necessary. The key is finding a balance that allows for both current enjoyment and future growth through compounding.",
        isCorrect: false,
      },
    ],
    reward: 15,
  },
];

const totalStages = WHY_SAVE_EARLY_STAGES.length;
const successThreshold = totalStages;

const WhySaveEarly = () => {
  const location = useLocation();
  const gameId = "finance-young-adult-61";
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
      "How can you start building your savings habit today, even with a small amount?",
      "What long-term goals could benefit most from the power of compound interest?",
    ],
    []
  );

  const handleChoice = (option) => {
    if (selectedOption || showResult) return;

    resetFeedback();
    const currentStageData = WHY_SAVE_EARLY_STAGES[currentStage];
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
  const stage = WHY_SAVE_EARLY_STAGES[Math.min(currentStage, totalStages - 1)];
  const hasPassed = finalScore === successThreshold;

  return (
    <GameShell
      title="Why Save Early?"
      subtitle={subtitle}
      score={coins}
      coins={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      maxScore={WHY_SAVE_EARLY_STAGES.length}
      currentLevel={Math.min(currentStage + 1, WHY_SAVE_EARLY_STAGES.length)}
      totalLevels={WHY_SAVE_EARLY_STAGES.length}
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
            <span>Early Saving</span>
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
                    Skill unlocked: <strong>Early saving advantage</strong>
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
              Skill unlocked: <strong>Early saving advantage</strong>
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

export default WhySaveEarly;