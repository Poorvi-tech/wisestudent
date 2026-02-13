import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const INCOME_STABILITY_CHECK_STAGES = [
  {
    id: 1,
    prompt: "When is borrowing safer?",
    options: [
     
      {
        id: "uncertain",
        label: "With uncertain income",
        reflection: "Actually, uncertain income makes borrowing risky. Irregular earnings create difficulty predicting payment ability, increase default probability, and generate financial stress. The unpredictability of cash flow means you might struggle to meet obligations during lean periods, making debt potentially dangerous rather than helpful.",
        isCorrect: false,
      },
       {
        id: "stable",
        label: "With stable and predictable income",
        reflection: "Exactly! Stable income provides reliable cash flow for consistent loan payments. Predictable earnings enable accurate budgeting, reduce default risk, and demonstrate financial responsibility to lenders, making borrowing much safer and more manageable for both borrower and lender.",
        isCorrect: true,
      },
      {
        id: "high",
        label: "With high but volatile income",
        reflection: "High volatility creates significant borrowing risk even with substantial earnings. Income fluctuations mean you might face periods where payments become challenging despite overall high earnings. The inconsistency makes financial planning difficult and increases the probability of missed payments during low-income periods.",
        isCorrect: false,
      },
      {
        id: "multiple",
        label: "With multiple income sources",
        reflection: "Multiple income sources can provide stability, but only if they're predictable and consistent. Diversified but irregular income streams still create uncertainty about total monthly cash flow, making it difficult to budget for fixed payment obligations and maintain consistent debt servicing capability.",
        isCorrect: false,
      },
    ],
    reward: 10,
  },
  {
    id: 2,
    prompt: "What makes income stability crucial for loan repayment?",
    options: [
      {
        id: "predictability",
        label: "Predictable cash flow enables consistent payment planning",
        reflection: "Correct! Stable income allows accurate monthly budgeting and reliable payment scheduling. When you know exactly how much money will arrive and when, you can confidently commit to fixed payment amounts without worrying about shortfalls or the need to adjust budgets mid-month.",
        isCorrect: true,
      },
      {
        id: "amount",
        label: "Higher income automatically means better repayment ability",
        reflection: "Income amount matters, but stability is more important than size. High but unpredictable income creates uncertainty about future payment capacity, while moderate but steady earnings provide the reliability needed for consistent debt servicing and long-term financial planning confidence.",
        isCorrect: false,
      },
      {
        id: "variety",
        label: "Having diverse income sources reduces repayment risk",
        reflection: "Diversity helps only if the various income streams are themselves stable and predictable. Unpredictable multiple sources still create cash flow uncertainty. True repayment security comes from consistent, reliable income that enables accurate forecasting of payment capability month after month.",
        isCorrect: false,
      },
      {
        id: "growth",
        label: "Income growth potential ensures future payment capacity",
        reflection: "Future growth potential doesn't address current repayment obligations. Loans require present payment capability based on current income stability. Expected future increases don't guarantee current ability to meet fixed monthly obligations, making present income predictability essential for responsible borrowing.",
        isCorrect: false,
      },
    ],
    reward: 10,
  },
  {
    id: 3,
    prompt: "How does unstable income affect borrowing decisions?",
    options: [
      {
        id: "opportunities",
        label: "Creates more borrowing opportunities and flexibility",
        reflection: "Actually, unstable income reduces rather than increases borrowing opportunities. Lenders view income unpredictability as high risk, leading to stricter approval criteria, higher interest rates, or outright rejection. The instability constrains rather than enhances borrowing options and financial flexibility.",
        isCorrect: false,
      },
     
      {
        id: "advantage",
        label: "Provides advantage in negotiating better loan terms",
        reflection: "Income instability is viewed as a disadvantage rather than negotiation leverage. Lenders see unpredictable cash flow as increased default risk, leading them to offer less favorable terms or require additional security. Stable, predictable income provides better negotiating position for competitive rates and flexible terms.",
        isCorrect: false,
      },
      {
        id: "neutral",
        label: "Has minimal impact on loan approval and pricing",
        reflection: "Income stability significantly impacts loan decisions. Lenders heavily weight income predictability in risk assessment, affecting approval likelihood, interest rates, loan amounts, and terms offered. Unstable income typically results in higher costs and more restrictive borrowing conditions compared to stable income situations.",
        isCorrect: false,
      },
       {
        id: "constraints",
        label: "Significantly constrains borrowing options and terms",
        reflection: "Exactly! Unstable income signals risk to lenders, resulting in limited approval options, higher costs, and restrictive terms. Lenders require stronger guarantees or charge premium rates to compensate for default risk, while borrowers face reduced access to favorable loan products and may need co-signers or collateral.",
        isCorrect: true,
      },
    ],
    reward: 10,
  },
  {
    id: 4,
    prompt: "What should you assess before borrowing with variable income?",
    options: [
      {
        id: "minimum",
        label: "Minimum monthly income needed to cover essential expenses",
        reflection: "Essential expense coverage is important but insufficient for responsible borrowing. You need to assess whether your typical or average income reliably covers both essentials AND debt payments, plus maintain emergency reserves. Minimum income scenarios don't account for consistent payment capability.",
        isCorrect: false,
      },
      
      {
        id: "maximum",
        label: "Maximum income achieved in recent months",
        reflection: "Maximum income creates unrealistic borrowing expectations. Relying on peak earnings ignores the probability of lower income periods when payments become difficult. Responsible assessment requires conservative evaluation based on typical rather than exceptional income performance.",
        isCorrect: false,
      },
      {
        id: "average",
        label: "Average income over 6-12 months with emergency buffer",
        reflection: "Perfect! Historical average income provides realistic payment capacity assessment, while emergency buffer ensures you can handle temporary income dips without defaulting. This approach accounts for income variability while maintaining consistent payment capability through both high and low earning periods.",
        isCorrect: true,
      },
      {
        id: "projected",
        label: "Projected future income growth and opportunities",
        reflection: "Future projections don't address current payment obligations. Loans require present income stability for immediate payment capability. Expected income increases, while potentially positive, don't guarantee current ability to meet fixed monthly payments or provide reliable cash flow for debt servicing.",
        isCorrect: false,
      },
    ],
    reward: 10,
  },
  {
    id: 5,
    prompt: "What's the fundamental principle linking income stability to borrowing?",
    options: [
      {
        id: "accessibility",
        label: "Stable income makes more loan products accessible",
        reflection: "While accessibility is a benefit, it's not the fundamental principle. The core connection is that stable income enables consistent debt servicing capability—the foundation of responsible borrowing. Access to products is secondary to the primary requirement of reliable payment ability that stable income provides.",
        isCorrect: false,
      },
      {
        id: "capability",
        label: "Stable income demonstrates consistent payment capability",
        reflection: "Exactly! The fundamental principle is that predictable income proves you can reliably meet fixed payment obligations month after month. This demonstrated capability forms the basis for responsible borrowing decisions, enabling lenders to assess risk accurately and borrowers to commit to sustainable debt levels.",
        isCorrect: true,
      },
      {
        id: "negotiation",
        label: "Stable income provides better negotiation leverage",
        reflection: "Negotiation advantage is a secondary benefit rather than the fundamental principle. The core issue is payment reliability—stable income proves you can consistently meet obligations without default risk. This reliability is what makes borrowing safe and responsible, with better terms being a consequential benefit.",
        isCorrect: false,
      },
      {
        id: "confidence",
        label: "Stable income builds borrower confidence in repayment",
        reflection: "Borrower confidence is subjective and not the fundamental principle. The objective reality is that stable income demonstrates measurable, consistent payment capability to lenders. This proven reliability—not personal confidence—is what establishes the foundation for safe, responsible borrowing and successful loan outcomes.",
        isCorrect: false,
      },
    ],
    reward: 10,
  },
];

const totalStages = INCOME_STABILITY_CHECK_STAGES.length;
const successThreshold = totalStages;

const IncomeStabilityCheck = () => {
  const location = useLocation();
  const gameId = "finance-adults-49";
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
      "How can you assess your income stability before taking on debt obligations?",
      "What emergency planning should accompany variable income borrowing decisions?",
    ],
    []
  );

  const handleChoice = (option) => {
    if (selectedOption || showResult) return;

    resetFeedback();
    const currentStageData = INCOME_STABILITY_CHECK_STAGES[currentStage];
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
  const stage = INCOME_STABILITY_CHECK_STAGES[Math.min(currentStage, totalStages - 1)];
  const hasPassed = finalScore === successThreshold;

  return (
    <GameShell
      title="Income Stability Check"
      subtitle={subtitle}
      score={coins}
      coins={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      maxScore={INCOME_STABILITY_CHECK_STAGES.length}
      currentLevel={Math.min(currentStage + 1, INCOME_STABILITY_CHECK_STAGES.length)}
      totalLevels={INCOME_STABILITY_CHECK_STAGES.length}
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
            <span>Borrowing Safety</span>
            <span>Income Assessment</span>
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
                    Skill unlocked: <strong>Income stability assessment</strong>
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
              Skill unlocked: <strong>Income stability assessment</strong>
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

export default IncomeStabilityCheck;