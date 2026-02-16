import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const CREDIT_STAGES = [
  {
    id: 1,
    prompt: "Credit means:",
    options: [
      {
        id: "extra",
        label: "Extra income",
        reflection: "Credit is not extra income - it's borrowed money that must be repaid. Thinking of credit as extra income can lead to overspending and financial difficulties.",
        isCorrect: false,
      },
      {
        id: "borrowed",
        label: "Borrowed money that must be repaid",
        reflection: "Exactly! Credit is borrowed money that comes with a cost - you must repay it, often with interest. Understanding this is crucial for responsible credit usage.",
        isCorrect: true,
      },
      {
        id: "free",
        label: "Free money that doesn't need to be paid back",
        reflection: "Credit is never free money. It always requires repayment, and often with additional interest charges. This misconception can lead to serious financial problems.",
        isCorrect: false,
      },
      {
        id: "gift",
        label: "A gift from the bank",
        reflection: "Banks don't give gifts - they're businesses that lend money to make a profit. Credit is a loan, not a gift, and must be repaid according to the agreed terms.",
        isCorrect: false,
      },
    ],
    reward: 15,
  },
  {
    id: 2,
    prompt: "When is credit helpful?",
    options: [
      {
        id: "always",
        label: "Always, it's free money",
        reflection: "Credit is not free money and shouldn't be used carelessly. Using credit without a repayment plan can lead to debt accumulation and financial stress.",
        isCorrect: false,
      },
      
      {
        id: "emergency",
        label: "Only for emergencies",
        reflection: "While credit can be useful for emergencies, it's also helpful for planned purchases when you have a repayment strategy. The key is responsible usage with clear repayment intentions.",
        isCorrect: false,
      },
      {
        id: "never",
        label: "Never, it's always dangerous",
        reflection: "Credit can be a useful financial tool when used responsibly. The danger comes from misuse, not from credit itself. Responsible credit usage can build financial credibility and help in emergencies.",
        isCorrect: false,
      },
      {
        id: "planned",
        label: "When repayment is planned",
        reflection: "Perfect! Credit is helpful when you have a clear plan to repay it. This includes budgeting for payments and ensuring you can afford the debt without financial strain.",
        isCorrect: true,
      },
    ],
    reward: 15,
  },
  {
    id: 3,
    prompt: "What happens if you don't repay credit?",
    options: [
      {
        id: "nothing",
        label: "Nothing, it's forgotten",
        reflection: "Failure to repay credit has serious consequences including damaged credit scores, legal action, and difficulty obtaining future credit. Debts don't simply disappear.",
        isCorrect: false,
      },
     
      {
        id: "delay",
        label: "You can delay payment indefinitely",
        reflection: "While you might delay payments temporarily, eventually the debt must be settled. Delaying only increases the total cost through late fees, interest, and potential legal action.",
        isCorrect: false,
      },
       {
        id: "consequences",
        label: "Credit score damage and legal issues",
        reflection: "Exactly! Non-repayment leads to serious consequences including damaged credit history, collection actions, potential lawsuits, and difficulty getting future loans or credit cards.",
        isCorrect: true,
      },
      {
        id: "forgiven",
        label: "The bank will forgive the debt",
        reflection: "Banks are businesses that expect repayment. While they might work with you on payment plans, they won't simply forgive debts. Personal responsibility for repayment is essential.",
        isCorrect: false,
      },
    ],
    reward: 15,
  },
  {
    id: 4,
    prompt: "How should you use credit responsibly?",
    options: [
      {
        id: "budget",
        label: "Only borrow what fits your budget",
        reflection: "Exactly! Responsible credit usage means borrowing only what you can comfortably repay within your budget. This prevents financial strain and maintains your ability to meet other financial obligations.",
        isCorrect: true,
      },
      {
        id: "max",
        label: "Use maximum available credit",
        reflection: "Using maximum credit increases your debt burden and financial risk. Responsible credit usage involves keeping balances manageable and within your ability to repay comfortably.",
        isCorrect: false,
      },
      
      {
        id: "impulse",
        label: "Use credit for impulse purchases",
        reflection: "Impulse purchases with credit can quickly lead to unmanageable debt. Credit should be used for planned expenses that fit within your financial capacity and repayment timeline.",
        isCorrect: false,
      },
      {
        id: "ignore",
        label: "Ignore monthly payment amounts",
        reflection: "Ignoring payment amounts can lead to missed payments and financial difficulties. Understanding and budgeting for monthly payments is essential for responsible credit management.",
        isCorrect: false,
      },
    ],
    reward: 15,
  },
  {
    id: 5,
    prompt: "What is the true cost of credit?",
    options: [
      {
        id: "principal",
        label: "Just the amount borrowed",
        reflection: "The true cost of credit includes not just the principal amount but also interest charges, fees, and potential impacts on your financial opportunities. Understanding the total cost is crucial for informed decisions.",
        isCorrect: false,
      },
      
      {
        id: "free",
        label: "Credit is free if paid on time",
        reflection: "Even when paid on time, credit typically involves interest charges or fees. 'Free' credit is rare, and even promotional offers often come with conditions or future costs.",
        isCorrect: false,
      },
      {
        id: "opportunity",
        label: "Opportunity to spend more",
        reflection: "While credit can increase your spending power, this is not the 'cost' but rather a feature. The actual cost is financial - the money you must repay plus interest and fees.",
        isCorrect: false,
      },
      {
        id: "total",
        label: "Principal plus interest and fees",
        reflection: "Exactly! The true cost of credit includes the principal amount borrowed plus interest charges, fees, and any other associated costs. This total cost should be considered when deciding whether to use credit.",
        isCorrect: true,
      },
    ],
    reward: 15,
  },
];

const totalStages = CREDIT_STAGES.length;
const successThreshold = totalStages;

const WhatIsCreditReally = () => {
  const location = useLocation();
  const gameId = "finance-young-adult-51";
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
      "How can understanding the true nature of credit help you make better financial decisions?",
      "What strategies can you use to ensure credit enhances rather than hinders your financial goals?",
    ],
    []
  );

  const handleChoice = (option) => {
    if (selectedOption || showResult) return;

    resetFeedback();
    const currentStageData = CREDIT_STAGES[currentStage];
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
  const stage = CREDIT_STAGES[Math.min(currentStage, totalStages - 1)];
  const hasPassed = finalScore === successThreshold;

  return (
    <GameShell
      title="What Is Credit Really?"
      subtitle={subtitle}
      score={showResult ? finalScore : coins}
      coins={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      maxScore={CREDIT_STAGES.length}
      currentLevel={Math.min(currentStage + 1, CREDIT_STAGES.length)}
      totalLevels={CREDIT_STAGES.length}
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
            <span>Credit Understanding</span>
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
                    Skill unlocked: <strong>Credit literacy</strong>
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
              Skill unlocked: <strong>Credit literacy</strong>
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

export default WhatIsCreditReally;