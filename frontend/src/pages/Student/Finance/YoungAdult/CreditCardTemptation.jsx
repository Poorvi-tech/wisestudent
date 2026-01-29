import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const CREDIT_CARD_STAGES = [
  {
    id: 1,
    prompt: "Credit cards feel like free money because:",
    options: [
      {
        id: "income",
        label: "They are income",
        reflection: "Credit cards are not income - they're borrowed money that must be repaid. Thinking of them as income can lead to overspending and financial difficulties.",
        isCorrect: false,
      },
      
      {
        id: "unlimited",
        label: "They provide unlimited spending power",
        reflection: "Credit cards have spending limits and don't provide unlimited money. Exceeding your limit can result in fees and damage to your credit score.",
        isCorrect: false,
      },
      {
        id: "gift",
        label: "They're a gift from the bank",
        reflection: "Banks issue credit cards as a business service, not as gifts. They make money from interest charges and fees on your spending.",
        isCorrect: false,
      },
      {
        id: "delayed",
        label: "Payment is delayed but still required",
        reflection: "Exactly! Credit cards create the illusion of free money because you don't pay immediately, but the payment is still required and often with interest.",
        isCorrect: true,
      },
    ],
    reward: 15,
  },
  {
    id: 2,
    prompt: "What is the main danger of credit card spending?",
    options: [
      {
        id: "convenience",
        label: "They're too convenient to use",
        reflection: "While convenience is a factor, the real danger lies in the delayed payment structure that can hide the true cost of purchases.",
        isCorrect: false,
      },
      
      {
        id: "rewards",
        label: "The rewards programs encourage overspending",
        reflection: "While rewards can be a factor, the fundamental issue is the psychological disconnect between spending and paying.",
        isCorrect: false,
      },
      {
        id: "cost",
        label: "The real cost is hidden due to delayed payment",
        reflection: "Perfect! When you don't pay immediately, it's easy to forget the actual cost and accumulate debt without realizing it.",
        isCorrect: true,
      },
      {
        id: "security",
        label: "They're less secure than cash",
        reflection: "Credit cards generally offer better security than cash, including fraud protection and dispute resolution services.",
        isCorrect: false,
      },
    ],
    reward: 15,
  },
  {
    id: 3,
    prompt: "How should you treat credit card spending?",
    options: [
      {
        id: "freely",
        label: "Spend freely since you'll pay later",
        reflection: "Spending freely on credit cards can lead to accumulating debt that becomes difficult to manage. Always consider your ability to pay.",
        isCorrect: false,
      },
      {
        id: "budget",
        label: "As part of your budget, not extra money",
        reflection: "Exactly! Credit card spending should be planned within your budget, treating it as money you already have, not additional funds.",
        isCorrect: true,
      },
      {
        id: "emergency",
        label: "Only for emergencies and special occasions",
        reflection: "While credit cards can be useful for emergencies, they can also be part of regular planned spending when used responsibly.",
        isCorrect: false,
      },
      {
        id: "ignore",
        label: "Ignore the balance until the bill arrives",
        reflection: "Ignoring your balance until the bill arrives can lead to unpleasant surprises and potential overspending beyond your means.",
        isCorrect: false,
      },
    ],
    reward: 15,
  },
  {
    id: 4,
    prompt: "What happens when you only make minimum payments?",
    options: [
      {
        id: "interest",
        label: "Most payment goes to interest, not principal",
        reflection: "Exactly! Minimum payments are designed so that most of the money goes to interest charges, making it take much longer to pay off your debt.",
        isCorrect: true,
      },
      {
        id: "manageable",
        label: "Your debt remains manageable",
        reflection: "Making only minimum payments typically means most of your payment goes to interest, causing your debt to persist and grow over time.",
        isCorrect: false,
      },
      
      {
        id: "benefit",
        label: "You benefit from the bank's grace period",
        reflection: "The grace period only applies if you pay the full balance. Making minimum payments means you're already incurring interest charges.",
        isCorrect: false,
      },
      {
        id: "credit",
        label: "Your credit score improves significantly",
        reflection: "While making minimum payments is better than missing payments, it doesn't significantly improve your credit score and indicates high credit utilization.",
        isCorrect: false,
      },
    ],
    reward: 15,
  },
  {
    id: 5,
    prompt: "What is the best practice for credit card use?",
    options: [
      {
        id: "maximize",
        label: "Maximize rewards by using it for everything",
        reflection: "Maximizing rewards by spending more than you can afford defeats the purpose and can lead to debt accumulation and financial stress.",
        isCorrect: false,
      },
      
      {
        id: "avoid",
        label: "Avoid credit cards entirely",
        reflection: "While avoiding credit cards is one approach, responsible use can actually help build credit history and provide financial flexibility.",
        isCorrect: false,
      },
      {
        id: "carry",
        label: "Carry a balance to build credit faster",
        reflection: "Carrying a balance doesn't build credit faster and costs you money in interest. Responsible use without carrying balances is better for building credit.",
        isCorrect: false,
      },
      {
        id: "plan",
        label: "Plan spending and pay the full balance monthly",
        reflection: "Perfect! Planning your spending and paying the full balance each month allows you to enjoy the benefits of credit cards without the debt burden.",
        isCorrect: true,
      },
    ],
    reward: 15,
  },
];

const totalStages = CREDIT_CARD_STAGES.length;
const successThreshold = totalStages;

const CreditCardTemptation = () => {
  const location = useLocation();
  const gameId = "finance-young-adult-54";
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
      "How can you use credit cards responsibly while avoiding the temptation to overspend?",
      "What strategies can help you maintain awareness of your credit card spending in real-time?",
    ],
    []
  );

  const handleChoice = (option) => {
    if (selectedOption || showResult) return;

    resetFeedback();
    const currentStageData = CREDIT_CARD_STAGES[currentStage];
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
  const stage = CREDIT_CARD_STAGES[Math.min(currentStage, totalStages - 1)];
  const hasPassed = finalScore === successThreshold;

  return (
    <GameShell
      title="Credit Card Temptation"
      subtitle={subtitle}
      score={coins}
      coins={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      maxScore={CREDIT_CARD_STAGES.length}
      currentLevel={Math.min(currentStage + 1, CREDIT_CARD_STAGES.length)}
      totalLevels={CREDIT_CARD_STAGES.length}
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
            <span>Credit Card Awareness</span>
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
                        { stageId: CREDIT_CARD_STAGES[currentStage].id, isCorrect: CREDIT_CARD_STAGES[currentStage].options.find(opt => opt.id === selectedOption)?.isCorrect },
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
                    Skill unlocked: <strong>Credit card responsibility</strong>
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
              Skill unlocked: <strong>Credit card responsibility</strong>
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

export default CreditCardTemptation;