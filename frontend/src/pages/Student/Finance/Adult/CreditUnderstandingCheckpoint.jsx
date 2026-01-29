import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const CREDIT_UNDERSTANDING_STAGES = [
  {
    id: 1,
    prompt: "What's the fundamental difference between credit and income?",
    options: [
      {
        id: "source",
        label: "Credit comes from lenders, income comes from work",
        reflection: "While this describes the source difference, the fundamental distinction is that income is yours to keep while credit must be repaid with interest.",
        isCorrect: false,
      },
     
      {
        id: "access",
        label: "Income requires effort, credit requires good credit score",
        reflection: "Both require different qualifications, but the key distinction is ownership - income is earned and kept, credit is borrowed and must be returned.",
        isCorrect: false,
      },
       {
        id: "repayment",
        label: "Income stays with you, credit must be repaid with interest",
        reflection: "Exactly! This core difference is why credit should never be treated as income - it creates future financial obligations.",
        isCorrect: true,
      },
      {
        id: "timing",
        label: "Income is immediate, credit takes time to process",
        reflection: "Processing time isn't the key difference. The fundamental distinction is permanence - income becomes your money, credit remains someone else's.",
        isCorrect: false,
      },
    ],
    reward: 10,
  },
  {
    id: 2,
    prompt: "When should you use credit responsibly?",
    options: [
      {
        id: "convenience",
        label: "For everyday purchases and convenience",
        reflection: "Daily purchases on credit create unnecessary debt. Credit should be reserved for strategic financial purposes, not routine spending.",
        isCorrect: false,
      },
      {
        id: "strategic",
        label: "For investments or emergencies with clear repayment plans",
        reflection: "Perfect! Responsible credit use involves strategic purposes like investments or true emergencies with concrete repayment strategies.",
        isCorrect: true,
      },
      {
        id: "rewards",
        label: "To maximize cashback and rewards programs",
        reflection: "Rewards are secondary benefits. Primary consideration should be whether you can afford to repay borrowed amounts without financial strain.",
        isCorrect: false,
      },
      {
        id: "status",
        label: "To maintain lifestyle and social status",
        reflection: "Using credit for status maintenance creates debt to support appearances, leading to financial stress and reduced long-term wealth building.",
        isCorrect: false,
      },
    ],
    reward: 10,
  },
  {
    id: 3,
    prompt: "What's the danger of treating credit like income?",
    options: [
      {
        id: "debt",
        label: "You'll accumulate debt that creates long-term financial stress",
        reflection: "Exactly! When credit feels like income, people overspend and accumulate debt they can't afford to repay, creating lasting financial problems.",
        isCorrect: true,
      },
      {
        id: "spending",
        label: "You'll spend more freely without budget constraints",
        reflection: "While increased spending is a symptom, the real danger is accumulating debt obligations that compound financial stress and reduce future flexibility.",
        isCorrect: false,
      },
      
      {
        id: "habits",
        label: "You'll develop poor spending habits permanently",
        reflection: "Bad habits are concerning, but the immediate danger is the debt accumulation that makes breaking those habits financially necessary rather than behavioral.",
        isCorrect: false,
      },
      {
        id: "tracking",
        label: "You'll lose track of your actual financial position",
        reflection: "Loss of financial awareness is problematic, but the core issue is the debt creation that makes accurate financial tracking increasingly difficult.",
        isCorrect: false,
      },
    ],
    reward: 10,
  },
  {
    id: 4,
    prompt: "How should you manage credit card limits?",
    options: [
      {
        id: "income",
        label: "As additional monthly income to spend freely",
        reflection: "Credit limits are borrowing capacity, not income. Spending up to your limit creates debt obligations you must repay with interest.",
        isCorrect: false,
      },
     
      {
        id: "opportunity",
        label: "As opportunities to make big purchases",
        reflection: "Big purchases on credit create long-term debt obligations. True opportunities come from purchases you can afford with actual income.",
        isCorrect: false,
      },
      {
        id: "flexibility",
        label: "As financial flexibility tools for any situation",
        reflection: "Credit cards offer transaction convenience, but the flexibility comes at the cost of interest and repayment obligations if not managed carefully.",
        isCorrect: false,
      },
       {
        id: "borrowing",
        label: "As maximum borrowing capacity with repayment obligations",
        reflection: "Perfect! Understanding that credit limits represent borrowed money you must repay prevents overspending and debt accumulation.",
        isCorrect: true,
      },
    ],
    reward: 10,
  },
  {
    id: 5,
    prompt: "What's the golden rule for credit usage?",
    options: [
     
      {
        id: "maximum",
        label: "Use as much as your credit limit allows",
        reflection: "Using maximum credit creates maximum debt. Responsible credit use means borrowing only what you can comfortably repay.",
        isCorrect: false,
      },
      {
        id: "emergency",
        label: "Save credit for true emergencies only",
        reflection: "While emergencies are important, the broader principle is treating credit as temporary support that must be repaid, not income to spend.",
        isCorrect: false,
      },
       {
        id: "limit",
        label: "Only spend what you can repay by the next billing cycle",
        reflection: "Perfect! This rule ensures credit serves as temporary support rather than creating long-term debt obligations.",
        isCorrect: true,
      },
      {
        id: "rewards",
        label: "Maximize rewards and cashback benefits",
        reflection: "Rewards are secondary benefits. The primary responsibility is ensuring you can repay borrowed amounts without financial strain.",
        isCorrect: false,
      },
    ],
    reward: 10,
  },
];

const totalStages = CREDIT_UNDERSTANDING_STAGES.length;
const successThreshold = totalStages;

const CreditUnderstandingCheckpoint = () => {
  const location = useLocation();
  const gameId = "finance-adults-32";
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
      "How does understanding credit fundamentals prevent common financial mistakes?",
      "What specific behaviors indicate someone is treating credit responsibly versus irresponsibly?",
    ],
    []
  );

  const handleChoice = (option) => {
    if (selectedOption || showResult) return;

    resetFeedback();
    const currentStageData = CREDIT_UNDERSTANDING_STAGES[currentStage];
    const updatedHistory = [
      ...history,
      { stageId: currentStageData.id, isCorrect: option.isCorrect },
    ];
    setHistory(updatedHistory);
    setSelectedOption(option.id);
    setSelectedReflection(option.reflection); // Set the reflection for the selected option
    setShowFeedback(true); // Show feedback after selection
    setCanProceed(false); // Disable proceeding initially
    
    // Update coins if the answer is correct
    if (option.isCorrect) {
      setCoins(prevCoins => prevCoins + 1);
    }
    
    // Wait for the reflection period before allowing to proceed
    setTimeout(() => {
      setCanProceed(true); // Enable proceeding after showing reflection
    }, 1500); // Wait 2.5 seconds before allowing to proceed
    
    // Handle the final stage separately
    if (currentStage === totalStages - 1) {
      setTimeout(() => {
        const correctCount = updatedHistory.filter((item) => item.isCorrect).length;
        const passed = correctCount === successThreshold;
        setFinalScore(correctCount);
        setCoins(passed ? totalCoins : 0); // Set final coins based on performance
        setShowResult(true);
      }, 2500); // Wait longer before showing final results
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
  const stage = CREDIT_UNDERSTANDING_STAGES[Math.min(currentStage, totalStages - 1)];
  const hasPassed = finalScore === successThreshold;

  return (
    <GameShell
      title="Credit Understanding Checkpoint"
      subtitle={subtitle}
      score={coins}
      coins={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      maxScore={CREDIT_UNDERSTANDING_STAGES.length}
      currentLevel={Math.min(currentStage + 1, CREDIT_UNDERSTANDING_STAGES.length)}
      totalLevels={CREDIT_UNDERSTANDING_STAGES.length}
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
            <span>Credit Fundamentals</span>
            <span>Understanding Check</span>
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
              {/* Automatically advance if we're in the last stage and the timeout has passed */}
              {!showResult && currentStage === totalStages - 1 && canProceed && (
                <div className="mt-4 flex justify-center">
                  <button
                    onClick={() => {
                      const updatedHistory = [
                        ...history,
                        { stageId: CREDIT_UNDERSTANDING_STAGES[currentStage].id, isCorrect: CREDIT_UNDERSTANDING_STAGES[currentStage].options.find(opt => opt.id === selectedOption)?.isCorrect },
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
                    Skill unlocked: <strong>Credit fundamentals mastery</strong>
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
              Skill unlocked: <strong>Credit fundamentals mastery</strong>
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

export default CreditUnderstandingCheckpoint;