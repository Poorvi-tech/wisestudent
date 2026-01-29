import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const FIRST_CREDIT_STAGES = [
  {
    id: 1,
    prompt: "Before applying for your first credit card, what should be your primary consideration?",
    options: [
      {
        id: "status",
        label: "Getting a card for social status",
        reflection: "Using credit cards for status can lead to overspending and debt. Credit should be a financial tool, not a status symbol.",
        isCorrect: false,
      },
      {
        id: "responsibility",
        label: "Understanding your ability to repay",
        reflection: "Exactly! Responsible credit use starts with knowing your limits and ensuring you can make payments on time.",
        isCorrect: true,
      },
      {
        id: "rewards",
        label: "Maximizing reward points and benefits",
        reflection: "While rewards are nice, they shouldn't be the primary focus. Responsible repayment should always come first.",
        isCorrect: false,
      },
      {
        id: "approval",
        label: "Getting approved for the highest limit",
        reflection: "Higher limits can be tempting but dangerous if you're not ready to handle them responsibly.",
        isCorrect: false,
      },
    ],
    reward: 15,
  },
  {
    id: 2,
    prompt: "What's the most important habit to develop with your first credit card?",
    options: [
       {
        id: "payment",
        label: "Paying the full balance every month",
        reflection: "Perfect! This is the golden rule of credit card use. It builds good credit while avoiding interest charges.",
        isCorrect: true,
      },
      {
        id: "spending",
        label: "Using it for all purchases to build credit",
        reflection: "Using credit for everything can lead to overspending. It's better to use it strategically for purchases you can afford.",
        isCorrect: false,
      },
     
      {
        id: "minimum",
        label: "Paying only the minimum amount due",
        reflection: "Minimum payments lead to accumulating interest and debt. Always aim to pay the full balance.",
        isCorrect: false,
      },
      {
        id: "timing",
        label: "Making purchases right before the statement date",
        reflection: "Timing purchases isn't as important as making responsible choices and paying on time.",
        isCorrect: false,
      },
    ],
    reward: 15,
  },
  {
    id: 3,
    prompt: "How should you handle credit card offers and promotions?",
    options: [
      {
        id: "accept",
        label: "Accept all offers to maximize benefits",
        reflection: "Accepting too many offers can lead to overspending and financial complexity. Choose wisely based on your needs.",
        isCorrect: false,
      },
     
      {
        id: "ignore",
        label: "Ignore all credit offers completely",
        reflection: "While you shouldn't accept every offer, completely ignoring credit can limit your financial tools and opportunities.",
        isCorrect: false,
      },
      {
        id: "compare",
        label: "Only compare interest rates, ignore other terms",
        reflection: "Interest rates are important, but fees, rewards, and terms also matter. Consider the complete package.",
        isCorrect: false,
      },
       {
        id: "evaluate",
        label: "Evaluate each offer carefully based on your needs",
        reflection: "Exactly! Good financial decisions come from careful evaluation, not impulsive acceptance of every offer.",
        isCorrect: true,
      },
    ],
    reward: 15,
  },
  {
    id: 4,
    prompt: "What should you do if you can't make a full payment on your credit card?",
    options: [
      {
        id: "skip",
        label: "Skip the payment and hope for the best",
        reflection: "Skipping payments damages your credit score and leads to late fees. Always make at least the minimum payment.",
        isCorrect: false,
      },
      
      {
        id: "borrow",
        label: "Borrow from another source to pay it off",
        reflection: "Borrowing to pay credit cards can create a cycle of debt. It's better to reduce spending and pay what you can.",
        isCorrect: false,
      },
      {
        id: "minimum",
        label: "Pay at least the minimum and contact your issuer",
        reflection: "Good! Making minimum payments protects your credit while you work on paying the full amount. Communication with your issuer is also key.",
        isCorrect: true,
      },
      {
        id: "delay",
        label: "Delay payment until next month when you have more money",
        reflection: "Delaying payments leads to late fees and credit damage. It's always better to pay something rather than nothing.",
        isCorrect: false,
      },
    ],
    reward: 15,
  },
  {
    id: 5,
    prompt: "What's the best approach to building a good credit history?",
    options: [
      {
        id: "multiple",
        label: "Open multiple credit accounts quickly",
        reflection: "Opening too many accounts at once can hurt your credit score and make it harder to manage your finances.",
        isCorrect: false,
      },
      {
        id: "consistent",
        label: "Use credit consistently and responsibly over time",
        reflection: "Perfect! Good credit history is built through consistent, responsible use over months and years, not quick fixes.",
        isCorrect: true,
      },
      {
        id: "high",
        label: "Maintain high balances to show credit usage",
        reflection: "High balances hurt your credit utilization ratio. It's better to keep balances low and pay them off regularly.",
        isCorrect: false,
      },
      {
        id: "avoid",
        label: "Avoid credit entirely to prevent any risk",
        reflection: "While avoiding credit eliminates risk, it also prevents you from building the credit history needed for loans, mortgages, and other financial opportunities.",
        isCorrect: false,
      },
    ],
    reward: 15,
  },
];

const totalStages = FIRST_CREDIT_STAGES.length;
const successThreshold = totalStages;

const FirstCreditCheckpoint = () => {
  const location = useLocation();
  const gameId = "finance-young-adult-60";
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
      "How can you use credit as a tool for financial growth rather than a source of debt?",
      "What strategies will help you maintain responsible credit habits over time?",
    ],
    []
  );

  const handleChoice = (option) => {
    if (selectedOption || showResult) return;

    resetFeedback();
    const currentStageData = FIRST_CREDIT_STAGES[currentStage];
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
  const stage = FIRST_CREDIT_STAGES[Math.min(currentStage, totalStages - 1)];
  const hasPassed = finalScore === successThreshold;

  return (
    <GameShell
      title="First Credit Checkpoint"
      subtitle={subtitle}
      score={coins}
      coins={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      maxScore={FIRST_CREDIT_STAGES.length}
      currentLevel={Math.min(currentStage + 1, FIRST_CREDIT_STAGES.length)}
      totalLevels={FIRST_CREDIT_STAGES.length}
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
            <span>First Credit</span>
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
                        { stageId: FIRST_CREDIT_STAGES[currentStage].id, isCorrect: FIRST_CREDIT_STAGES[currentStage].options.find(opt => opt.id === selectedOption)?.isCorrect },
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
                    Skill unlocked: <strong>Responsible credit management</strong>
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
              Skill unlocked: <strong>Responsible credit management</strong>
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

export default FirstCreditCheckpoint;