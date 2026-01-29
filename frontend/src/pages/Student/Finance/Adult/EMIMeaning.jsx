import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const EMI_MEANING_STAGES = [
  {
    id: 1,
    prompt: "EMI stands for:",
    options: [
        {
        id: "instalment",
        label: "Equated Monthly Instalment",
        reflection: "Exactly! EMI is the fixed amount you pay each month to gradually repay your loan principal plus accumulated interest over the loan term.",
        isCorrect: true,
      },
      {
        id: "income",
        label: "Easy Monthly Income",
        reflection: "Actually, EMI refers to loan repayment, not income generation. It's about systematically paying back borrowed money in manageable monthly amounts.",
        isCorrect: false,
      },
    
      {
        id: "investment",
        label: "Monthly Investment Option",
        reflection: "EMI is about debt repayment, not investment. While some loans fund investments, EMI specifically refers to the structured repayment mechanism.",
        isCorrect: false,
      },
      {
        id: "insurance",
        label: "Emergency Money Insurance",
        reflection: "EMI relates to loan repayment schedules, not insurance products. It's a systematic approach to paying back borrowed funds over time.",
        isCorrect: false,
      },
    ],
    reward: 10,
  },
  {
    id: 2,
    prompt: "What's the main purpose of EMI structure?",
    options: [
      {
        id: "flexibility",
        label: "To provide payment flexibility for borrowers",
        reflection: "While EMIs offer predictability, the primary purpose is dividing large loan amounts into manageable, scheduled payments over time.",
        isCorrect: false,
      },
      {
        id: "division",
        label: "To divide large loan repayment into monthly amounts",
        reflection: "Correct! EMIs break down substantial loan obligations into regular, predictable monthly payments that fit within borrowers' budget constraints.",
        isCorrect: true,
      },
      {
        id: "profit",
        label: "To maximize lender profits from borrowers",
        reflection: "Profit maximization isn't the purpose - EMIs serve to make large loan repayments affordable and predictable for both parties involved.",
        isCorrect: false,
      },
      {
        id: "convenience",
        label: "To make borrowing more convenient for consumers",
        reflection: "Convenience is a benefit, but the core purpose is structuring loan repayment into systematic, manageable monthly installments over the loan term.",
        isCorrect: false,
      },
    ],
    reward: 10,
  },
  {
    id: 3,
    prompt: "How is EMI amount calculated?",
    options: [
      {
        id: "simple",
        label: "Principal divided by number of months",
        reflection: "Simple division doesn't account for interest charges. EMI calculations include both principal repayment and accumulated interest over the loan period.",
        isCorrect: false,
      },
      
      {
        id: "negotiation",
        label: "Through negotiation between borrower and lender",
        reflection: "While terms can be negotiated, EMI amounts are calculated using standardized formulas that factor in principal, interest rate, and loan duration.",
        isCorrect: false,
      },
      {
        id: "formula",
        label: "Using a formula that includes principal, interest, and tenure",
        reflection: "Perfect! EMI uses a mathematical formula incorporating loan amount, interest rate, and repayment period to determine the fixed monthly payment.",
        isCorrect: true,
      },
      {
        id: "standard",
        label: "Based on industry standard percentages",
        reflection: "Industry benchmarks provide guidance, but actual EMI calculations use precise mathematical formulas specific to each loan's principal, rate, and term.",
        isCorrect: false,
      },
    ],
    reward: 10,
  },
  {
    id: 4,
    prompt: "What happens to EMI payments over time?",
    options: [
      {
        id: "decreasing",
        label: "The payment amount decreases each month",
        reflection: "EMI payments remain constant throughout the loan term. What changes is the principal-interest ratio within each payment.",
        isCorrect: false,
      },
      
      {
        id: "increasing",
        label: "Payments increase as loan balance decreases",
        reflection: "This would be counterproductive - EMIs provide predictability by keeping payments constant while the underlying principal-interest mix evolves.",
        isCorrect: false,
      },
      {
        id: "variable",
        label: "Amount varies based on monthly income fluctuations",
        reflection: "EMI structure provides stability with fixed payments. Variable payments would defeat the purpose of predictable, scheduled loan repayment.",
        isCorrect: false,
      },
      {
        id: "constant",
        label: "The amount stays the same, but composition changes",
        reflection: "Exactly! While your EMI amount remains fixed, early payments are mostly interest with small principal portions, gradually shifting toward more principal over time.",
        isCorrect: true,
      },
    ],
    reward: 10,
  },
  {
    id: 5,
    prompt: "What's the golden rule for EMI management?",
    options: [
      {
        id: "affordable",
        label: "Select an EMI that fits comfortably in your monthly budget",
        reflection: "Perfect! The ideal EMI allows consistent, stress-free payments while maintaining your financial stability and other important financial commitments.",
        isCorrect: true,
      },
      {
        id: "maximum",
        label: "Choose the highest EMI you can afford for faster repayment",
        reflection: "While higher EMIs reduce total interest, the key is selecting an EMI that fits comfortably within your budget without causing financial stress.",
        isCorrect: false,
      },
      
      {
        id: "minimum",
        label: "Always choose the minimum EMI to preserve cash flow",
        reflection: "Minimum EMIs extend loan terms and increase total interest costs. Balance affordability with reasonable repayment timelines for optimal financial health.",
        isCorrect: false,
      },
      {
        id: "flexible",
        label: "Opt for flexible EMI options that can be adjusted monthly",
        reflection: "Flexibility sounds appealing, but consistent, predictable EMIs provide better financial planning and often more favorable interest terms.",
        isCorrect: false,
      },
    ],
    reward: 10,
  },
];

const totalStages = EMI_MEANING_STAGES.length;
const successThreshold = totalStages;

const EMIMeaning = () => {
  const location = useLocation();
  const gameId = "finance-adults-35";
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
      "How can you calculate if an EMI fits within your monthly budget before taking a loan?",
      "What factors should you consider when choosing between different EMI options for the same loan amount?",
    ],
    []
  );

  const handleChoice = (option) => {
    if (selectedOption || showResult) return;

    resetFeedback();
    const currentStageData = EMI_MEANING_STAGES[currentStage];
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
  const stage = EMI_MEANING_STAGES[Math.min(currentStage, totalStages - 1)];
  const hasPassed = finalScore === successThreshold;

  return (
    <GameShell
      title="EMI Meaning"
      subtitle={subtitle}
      score={coins}
      coins={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      maxScore={EMI_MEANING_STAGES.length}
      currentLevel={Math.min(currentStage + 1, EMI_MEANING_STAGES.length)}
      totalLevels={EMI_MEANING_STAGES.length}
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
            <span>EMI Basics</span>
            <span>Repayment Structure</span>
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
                        { stageId: EMI_MEANING_STAGES[currentStage].id, isCorrect: EMI_MEANING_STAGES[currentStage].options.find(opt => opt.id === selectedOption)?.isCorrect },
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
                    Skill unlocked: <strong>EMI calculation and management</strong>
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
              Skill unlocked: <strong>EMI calculation and management</strong>
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

export default EMIMeaning;