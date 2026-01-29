import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const CREDIT_EMERGENCY_STAGES = [
  {
    id: 1,
    prompt: "Is credit a replacement for savings?",
    options: [
      {
        id: "replacement",
        label: "Yes, credit can replace savings",
        reflection: "While credit can provide temporary relief, it's not a true replacement for savings. Credit creates debt obligations that must be repaid with interest.",
        isCorrect: false,
      },
      
      {
        id: "both",
        label: "Both are equally important",
        reflection: "While both are important, savings should be the foundation. Credit should be used strategically, not as a substitute for emergency funds.",
        isCorrect: false,
      },
      {
        id: "savings-first",
        label: "No, savings should come first",
        reflection: "Exactly! Savings provide true financial security without the burden of debt or interest payments.",
        isCorrect: true,
      },
      {
        id: "credit-only",
        label: "Credit is better than savings",
        reflection: "Relying solely on credit creates financial vulnerability. Savings provide stability and peace of mind that credit cannot match.",
        isCorrect: false,
      },
    ],
    reward: 15,
  },
  {
    id: 2,
    prompt: "What happens when you use credit for emergencies?",
    options: [
      {
        id: "freedom",
        label: "You gain financial freedom",
        reflection: "Using credit for emergencies actually reduces financial freedom by creating debt obligations and interest payments.",
        isCorrect: false,
      },
      {
        id: "debt",
        label: "You create debt and interest obligations",
        reflection: "Correct! Credit emergencies create long-term financial burdens that can take months or years to resolve.",
        isCorrect: true,
      },
      {
        id: "easy",
        label: "It's the easiest solution",
        reflection: "While credit may seem easy in the moment, it creates complex financial problems that are harder to solve later.",
        isCorrect: false,
      },
      {
        id: "no-consequence",
        label: "There are no real consequences",
        reflection: "Credit always comes with consequences including interest charges, potential damage to credit scores, and ongoing payment obligations.",
        isCorrect: false,
      },
    ],
    reward: 15,
  },
  {
    id: 3,
    prompt: "How should you build an emergency fund?",
    options: [
      {
        id: "small-amounts",
        label: "Start with small amounts regularly",
        reflection: "Perfect! Building an emergency fund with small, regular contributions creates sustainable financial security over time.",
        isCorrect: true,
      },
      {
        id: "credit",
        label: "Use credit cards for emergencies",
        reflection: "Using credit for emergencies defeats the purpose of having an emergency fund. True emergency funds are built with actual savings.",
        isCorrect: false,
      },
      
      {
        id: "large-lump",
        label: "Save a large lump sum immediately",
        reflection: "While saving large amounts is ideal, it's not realistic for most people. Starting small and building consistently is more achievable.",
        isCorrect: false,
      },
      {
        id: "when-needed",
        label: "Save only when you need it",
        reflection: "Waiting until you need emergency funds means it's already too late. Emergency funds must be built in advance to be effective.",
        isCorrect: false,
      },
    ],
    reward: 15,
  },
  {
    id: 4,
    prompt: "What's the main difference between savings and credit?",
    options: [
      {
        id: "same-thing",
        label: "They're basically the same thing",
        reflection: "Savings and credit are fundamentally different. Savings represent money you own, while credit represents money you owe.",
        isCorrect: false,
      },
      
      {
        id: "convenience",
        label: "Credit is more convenient",
        reflection: "Credit may seem more convenient initially, but the long-term costs and obligations make savings the more convenient choice.",
        isCorrect: false,
      },
      {
        id: "speed",
        label: "Credit provides faster access",
        reflection: "While credit provides immediate access, savings offer faster long-term financial freedom without the burden of repayment.",
        isCorrect: false,
      },
      {
        id: "ownership",
        label: "Savings you own, credit you owe",
        reflection: "Exactly! This fundamental difference is why savings provide security while credit creates obligations.",
        isCorrect: true,
      },
    ],
    reward: 15,
  },
  {
    id: 5,
    prompt: "Why is relying on credit for emergencies risky?",
    options: [
     
      {
        id: "easy-access",
        label: "It's too easy to access",
        reflection: "Easy access is actually a benefit of credit, but it's the long-term consequences that make it risky for emergencies.",
        isCorrect: false,
      },
      {
        id: "credit-score",
        label: "It improves your credit score",
        reflection: "Using credit responsibly can help your credit score, but relying on it for emergencies often leads to financial stress that hurts your score.",
        isCorrect: false,
      },
       {
        id: "interest",
        label: "You pay interest on borrowed money",
        reflection: "Correct! Interest payments make emergencies even more expensive and create long-term financial drag.",
        isCorrect: true,
      },
      {
        id: "no-risk",
        label: "There's actually no risk involved",
        reflection: "There are significant risks including debt accumulation, interest payments, and potential damage to financial stability.",
        isCorrect: false,
      },
    ],
    reward: 15,
  },
];

const totalStages = CREDIT_EMERGENCY_STAGES.length;
const successThreshold = totalStages;

const CreditIsNotEmergencyFund = () => {
  const location = useLocation();
  const gameId = "finance-young-adult-59";
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
      "How can you build an emergency fund while managing regular expenses?",
      "What strategies help you resist the temptation to use credit for non-emergencies?",
    ],
    []
  );

  const handleChoice = (option) => {
    if (selectedOption || showResult) return;

    resetFeedback();
    const currentStageData = CREDIT_EMERGENCY_STAGES[currentStage];
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
  const stage = CREDIT_EMERGENCY_STAGES[Math.min(currentStage, totalStages - 1)];
  const hasPassed = finalScore === successThreshold;

  return (
    <GameShell
      title="Credit Is Not Emergency Fund"
      subtitle={subtitle}
      score={coins}
      coins={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      maxScore={CREDIT_EMERGENCY_STAGES.length}
      currentLevel={Math.min(currentStage + 1, CREDIT_EMERGENCY_STAGES.length)}
      totalLevels={CREDIT_EMERGENCY_STAGES.length}
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
            <span>Credit vs Savings</span>
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
                        { stageId: CREDIT_EMERGENCY_STAGES[currentStage].id, isCorrect: CREDIT_EMERGENCY_STAGES[currentStage].options.find(opt => opt.id === selectedOption)?.isCorrect },
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
                    Skill unlocked: <strong>Emergency fund awareness</strong>
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
              Skill unlocked: <strong>Emergency fund awareness</strong>
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

export default CreditIsNotEmergencyFund;