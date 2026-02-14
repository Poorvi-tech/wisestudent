import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const EMI_VS_INCOME_STAGES = [
  {
    id: 1,
    prompt: "Which EMI is safer?",
    options: [
      {
        id: "comfortable",
        label: "EMI that fits comfortably within income",
        reflection: "Exactly! An EMI that leaves adequate income for living expenses, savings, and emergencies provides financial stability and peace of mind.",
        isCorrect: true,
      },
      {
        id: "consumes",
        label: "EMI that consumes most of income",
        reflection: "High EMIs that consume most of your income reduce financial flexibility, increase stress, and leave little room for unexpected expenses or opportunities.",
        isCorrect: false,
      },
      {
        id: "maximum",
        label: "Highest EMI possible to repay loan quickly",
        reflection: "While faster repayment reduces total interest, maximum EMIs can create financial strain and vulnerability to income disruptions or emergencies.",
        isCorrect: false,
      },
      {
        id: "minimum",
        label: "Lowest EMI to preserve maximum cash flow",
        reflection: "Minimum EMIs extend loan terms and total costs. The key is finding balance - comfortable payments that maintain financial health.",
        isCorrect: false,
      },
    ],
    reward: 10,
  },
  {
    id: 2,
    prompt: "What's the danger of high EMIs relative to income?",
    options: [
      {
        id: "approval",
        label: "May affect future loan approval chances",
        reflection: "While future approvals matter, the immediate danger is reduced financial flexibility and increased vulnerability to income changes or emergencies.",
        isCorrect: false,
      },
      
      {
        id: "lifestyle",
        label: "Forces lifestyle changes and spending cuts",
        reflection: "Lifestyle adjustments may be necessary, but the core issue is the reduced financial resilience that makes you vulnerable to various financial shocks.",
        isCorrect: false,
      },
      {
        id: "tracking",
        label: "Makes budget tracking more complicated",
        reflection: "Budget complexity is a management challenge, not the primary concern. The real danger is the financial stress and reduced options that high EMIs create.",
        isCorrect: false,
      },
      {
        id: "flexibility",
        label: "Reduces financial flexibility and emergency preparedness",
        reflection: "Correct! High EMIs limit your ability to handle unexpected expenses, invest in opportunities, or maintain quality of life during income disruptions.",
        isCorrect: true,
      },
    ],
    reward: 10,
  },
  {
    id: 3,
    prompt: "How should you determine appropriate EMI levels?",
    options: [
     
      {
        id: "maximum",
        label: "Maximum EMI based on lender approval limits",
        reflection: "Lender approval indicates borrowing capacity, but doesn't guarantee affordability. Personal financial circumstances should determine sustainable EMI levels.",
        isCorrect: false,
      },
      {
        id: "comparison",
        label: "Match what peers are paying for similar loans",
        reflection: "Peer comparisons don't reflect your unique financial situation. Base EMI decisions on your income, expenses, and financial goals rather than others' choices.",
        isCorrect: false,
      },
       {
        id: "percentage",
        label: "EMI should be 20-30% of gross monthly income",
        reflection: "Perfect! This range typically provides comfortable repayment while preserving adequate income for living expenses, savings, and financial security.",
        isCorrect: true,
      },
      {
        id: "desire",
        label: "Whatever EMI allows desired purchase or lifestyle",
        reflection: "Desired outcomes shouldn't drive EMI decisions. Sustainable repayment capacity should determine loan amounts and corresponding EMI levels.",
        isCorrect: false,
      },
    ],
    reward: 10,
  },
  {
    id: 4,
    prompt: "What happens when EMI exceeds comfortable income levels?",
    options: [
      {
        id: "delayed",
        label: "Payments get delayed automatically by lenders",
        reflection: "Lenders don't automatically delay payments - missed payments damage credit scores and incur penalties. The real consequence is financial stress and potential default.",
        isCorrect: false,
      },
      {
        id: "stress",
        label: "Creates financial stress and reduced quality of life",
        reflection: "Exactly! Overwhelming EMIs lead to constant financial anxiety, forced spending cuts, and reduced ability to enjoy life or pursue opportunities.",
        isCorrect: true,
      },
      {
        id: "forgiveness",
        label: "Lenders typically forgive excess burden",
        reflection: "Lenders operate on contractual obligations. Financial hardship programs exist but aren't automatic forgiveness - prevention through proper EMI planning is essential.",
        isCorrect: false,
      },
      {
        id: "adjustment",
        label: "EMI automatically adjusts to income changes",
        reflection: "Standard EMIs are fixed amounts. Some flexible options exist, but most require proactive renegotiation rather than automatic adjustment to changing circumstances.",
        isCorrect: false,
      },
    ],
    reward: 10,
  },
  {
    id: 5,
    prompt: "What's the golden rule for EMI-to-income ratio?",
    options: [
      {
        id: "balance",
        label: "Maintain EMI below 30% of net income for financial health",
        reflection: "Perfect! This guideline ensures comfortable repayment while preserving adequate income for living expenses, savings, and handling unexpected financial challenges.",
        isCorrect: true,
      },
      {
        id: "aggressive",
        label: "Maximize EMI to 50% for faster debt elimination",
        reflection: "Aggressive repayment can reduce total interest, but 50% EMI-to-income ratio creates financial vulnerability and reduces quality of life significantly.",
        isCorrect: false,
      },
      {
        id: "minimum",
        label: "Keep EMI as low as possible regardless of loan term",
        reflection: "While low EMIs preserve cash flow, extremely low payments extend loan terms and increase total interest costs. Balance is key for optimal financial outcomes.",
        isCorrect: false,
      },
      {
        id: "flexible",
        label: "Choose variable EMIs that adjust with income changes",
        reflection: "Variable payments sound appealing but create uncertainty. Fixed, comfortable EMIs provide better financial planning and often more favorable terms.",
        isCorrect: false,
      },
    ],
    reward: 10,
  },
];

const totalStages = EMI_VS_INCOME_STAGES.length;
const successThreshold = totalStages;

const EMIVsIncome = () => {
  const location = useLocation();
  const gameId = "finance-adults-36";
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
      "How can you calculate the maximum EMI that maintains your financial comfort and security?",
      "What warning signs indicate your EMI-to-income ratio has become unhealthy?",
    ],
    []
  );

  const handleChoice = (option) => {
    if (selectedOption || showResult) return;

    resetFeedback();
    const currentStageData = EMI_VS_INCOME_STAGES[currentStage];
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
      }, 5500); // Wait longer before showing final results
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
  const stage = EMI_VS_INCOME_STAGES[Math.min(currentStage, totalStages - 1)];
  const hasPassed = finalScore === successThreshold;

  return (
    <GameShell
      title="EMI vs Income"
      subtitle={subtitle}
      score={showResult ? finalScore : coins}
      coins={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      maxScore={EMI_VS_INCOME_STAGES.length}
      currentLevel={Math.min(currentStage + 1, EMI_VS_INCOME_STAGES.length)}
      totalLevels={EMI_VS_INCOME_STAGES.length}
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
            <span>EMI Planning</span>
            <span>Income Balance</span>
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
                    Skill unlocked: <strong>EMI-to-income ratio management</strong>
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
              Skill unlocked: <strong>EMI-to-income ratio management</strong>
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

export default EMIVsIncome;