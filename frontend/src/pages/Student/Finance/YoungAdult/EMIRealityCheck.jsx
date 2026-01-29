import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const EMI_REALITY_STAGES = [
  {
    id: 1,
    prompt: "EMI payments should be:",
    options: [
      {
        id: "high",
        label: "As high as possible",
        reflection: "Taking on high EMIs can severely limit your financial flexibility and increase stress. It's important to choose EMIs that are manageable within your income.",
        isCorrect: false,
      },
      
      {
        id: "minimum",
        label: "The minimum amount to get the loan",
        reflection: "While minimum EMIs might seem attractive, they often result in longer repayment periods and higher total interest costs. Balance is key.",
        isCorrect: false,
      },
      {
        id: "ignore",
        label: "Whatever the lender offers",
        reflection: "Blindly accepting lender terms without considering your financial capacity can lead to financial distress. Always assess affordability first.",
        isCorrect: false,
      },
      {
        id: "comfortable",
        label: "Comfortable within income",
        reflection: "Exactly! EMI payments should be comfortably affordable within your income, leaving room for other expenses and savings. This ensures financial stability.",
        isCorrect: true,
      },
    ],
    reward: 15,
  },
  {
    id: 2,
    prompt: "What happens when you take high EMIs?",
    options: [
      {
        id: "freedom",
        label: "You get more financial freedom",
        reflection: "High EMIs actually reduce your financial freedom by limiting your ability to save, invest, or handle unexpected expenses. They create financial pressure.",
        isCorrect: false,
      },
      {
        id: "stress",
        label: "You face stress during repayment",
        reflection: "Perfect! High EMIs can create significant financial stress, especially if your income fluctuates or unexpected expenses arise.",
        isCorrect: true,
      },
      {
        id: "benefits",
        label: "You get better loan benefits",
        reflection: "Higher EMIs don't necessarily mean better loan benefits. They primarily mean faster repayment but also higher monthly financial commitment.",
        isCorrect: false,
      },
      {
        id: "growth",
        label: "Your credit score improves faster",
        reflection: "While timely EMI payments do help credit scores, taking on unaffordable EMIs can actually harm your credit if you struggle to make payments.",
        isCorrect: false,
      },
    ],
    reward: 15,
  },
  {
    id: 3,
    prompt: "How should you calculate your EMI affordability?",
    options: [
      {
        id: "income",
        label: "Based on your total monthly income",
        reflection: "Using total income without considering other expenses can lead to overcommitment. You need to account for all your financial obligations and savings goals.",
        isCorrect: false,
      },
      
      {
        id: "friends",
        label: "What your friends are paying",
        reflection: "Everyone's financial situation is different. What's affordable for others may not be for you. Base your decisions on your own financial capacity.",
        isCorrect: false,
      },
      {
        id: "disposable",
        label: "Based on your disposable income after expenses",
        reflection: "Exactly! Calculate EMIs based on what you can afford after covering essential expenses and setting aside some savings. This ensures sustainability.",
        isCorrect: true,
      },
      {
        id: "maximum",
        label: "The maximum amount the lender approves",
        reflection: "Lender approval doesn't guarantee affordability. Just because you're approved for a high EMI doesn't mean you should take it on.",
        isCorrect: false,
      },
    ],
    reward: 15,
  },
  {
    id: 4,
    prompt: "What is a good EMI-to-income ratio?",
    options: [
      {
        id: "20",
        label: "Ideally 20% or less of monthly income",
        reflection: "Perfect! Keeping EMIs at 20% or less of your income ensures you maintain financial flexibility and can handle emergencies or other goals.",
        isCorrect: true,
      },
      {
        id: "50",
        label: "Up to 50% of monthly income",
        reflection: "50% is too high and can severely limit your financial flexibility. This leaves little room for savings or unexpected expenses.",
        isCorrect: false,
      },
      
      {
        id: "30",
        label: "Around 30% of monthly income",
        reflection: "30% is on the higher side and may strain your finances. It's better to stay closer to 20% for better financial health.",
        isCorrect: false,
      },
      {
        id: "flexible",
        label: "It doesn't matter as long as I can pay",
        reflection: "The EMI amount does matter for your overall financial health. Even if you can pay, high EMIs reduce your financial flexibility and increase risk.",
        isCorrect: false,
      },
    ],
    reward: 15,
  },
  {
    id: 5,
    prompt: "Before taking a loan, you should:",
    options: [
      {
        id: "apply",
        label: "Apply first and see if you can manage",
        reflection: "This approach is risky. You should assess affordability before applying to avoid getting into a financial commitment you can't handle.",
        isCorrect: false,
      },
      
      {
        id: "compare",
        label: "Compare interest rates only",
        reflection: "While interest rates are important, they're not the only factor. Affordability and your ability to manage the EMI are equally crucial.",
        isCorrect: false,
      },
      {
        id: "urgent",
        label: "Take it if you need it urgently",
        reflection: "Urgent needs shouldn't override financial planning. Even urgent needs should be addressed within your financial capacity to avoid long-term problems.",
        isCorrect: false,
      },
      {
        id: "calculate",
        label: "Calculate if EMI fits your budget comfortably",
        reflection: "Exactly! Always calculate and ensure the EMI fits comfortably within your budget before taking any loan. This prevents future financial stress.",
        isCorrect: true,
      },
    ],
    reward: 15,
  },
];

const totalStages = EMI_REALITY_STAGES.length;
const successThreshold = totalStages;

const EMIRealityCheck = () => {
  const location = useLocation();
  const gameId = "finance-young-adult-53";
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
      "How can you ensure EMI payments enhance rather than hinder your financial goals?",
      "What strategies can you use to maintain financial flexibility while managing loan obligations?",
    ],
    []
  );

  const handleChoice = (option) => {
    if (selectedOption || showResult) return;

    resetFeedback();
    const currentStageData = EMI_REALITY_STAGES[currentStage];
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
  const stage = EMI_REALITY_STAGES[Math.min(currentStage, totalStages - 1)];
  const hasPassed = finalScore === successThreshold;

  return (
    <GameShell
      title="EMI Reality Check"
      subtitle={subtitle}
      score={coins}
      coins={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      maxScore={EMI_REALITY_STAGES.length}
      currentLevel={Math.min(currentStage + 1, EMI_REALITY_STAGES.length)}
      totalLevels={EMI_REALITY_STAGES.length}
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
            <span>EMI Decisions</span>
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
                        { stageId: EMI_REALITY_STAGES[currentStage].id, isCorrect: EMI_REALITY_STAGES[currentStage].options.find(opt => opt.id === selectedOption)?.isCorrect },
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
                    Skill unlocked: <strong>EMI affordability assessment</strong>
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
              Skill unlocked: <strong>EMI affordability assessment</strong>
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

export default EMIRealityCheck;