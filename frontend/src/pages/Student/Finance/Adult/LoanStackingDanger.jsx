import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const LOAN_STACKING_DANGER_STAGES = [
  {
    id: 1,
    prompt: "Taking multiple loans at the same time causes:",
    options: [
      {
        id: "flexibility",
        label: "Better flexibility and financial options",
        reflection: "Actually, multiple simultaneous loans reduce rather than enhance flexibility. Managing multiple payment schedules, due dates, and varying interest rates creates complexity that constrains financial maneuverability and increases stress rather than providing genuine flexibility.",
        isCorrect: false,
      },
      
      {
        id: "efficiency",
        label: "More efficient debt management and lower costs",
        reflection: "Multiple loans actually decrease efficiency through fragmented payments, varied terms, and coordination challenges. The administrative burden and increased risk of missed payments typically result in higher overall costs rather than improved management efficiency.",
        isCorrect: false,
      },
      {
        id: "opportunity",
        label: "Enhanced borrowing capacity for future opportunities",
        reflection: "Taking multiple loans simultaneously demonstrates over-leverage rather than financial strength. Lenders view high concurrent debt obligations as risk factors, potentially reducing rather than enhancing future borrowing capacity for genuine opportunities.",
        isCorrect: false,
      },
      {
        id: "confusion",
        label: "Confusing repayments and increased default risk",
        reflection: "Exactly! Multiple loans create payment confusion with different due dates, varying interest rates, and complex tracking requirements. This complexity significantly increases the likelihood of missed payments, late fees, and eventual defaults that can severely damage credit scores.",
        isCorrect: true,
      },
    ],
    reward: 10,
  },
  {
    id: 2,
    prompt: "What makes loan stacking particularly dangerous?",
    options: [
      {
        id: "simplicity",
        label: "The apparent simplicity of managing multiple small loans",
        reflection: "Multiple small loans are actually more complex to manage than single larger loans. Different lenders, varying terms, multiple due dates, and diverse communication channels create administrative burden that often leads to oversight and missed payments.",
        isCorrect: false,
      },
      
      {
        id: "approval",
        label: "Easier approval process for smaller individual amounts",
        reflection: "Easy approval for smaller amounts can be deceptive. While individual approvals may seem simpler, the cumulative debt burden and multiple obligations create greater overall financial strain than a single, properly sized loan for legitimate needs.",
        isCorrect: false,
      },
      {
        id: "coordination",
        label: "Difficulty coordinating multiple payment schedules and terms",
        reflection: "Correct! Coordinating multiple loans requires tracking various due dates, interest rates, payment amounts, and lender requirements. This complexity increases the probability of payment errors, missed deadlines, and administrative oversights that can trigger cascading financial problems.",
        isCorrect: true,
      },
      {
        id: "rates",
        label: "Lower interest rates on smaller loan amounts",
        reflection: "Smaller loans don't necessarily mean lower rates—in fact, they often carry higher rates due to administrative costs and risk premiums. The total cost of multiple small loans frequently exceeds that of a single appropriately sized loan with better terms.",
        isCorrect: false,
      },
    ],
    reward: 10,
  },
  {
    id: 3,
    prompt: "How does loan stacking affect your credit profile?",
    options: [
      {
        id: "improves",
        label: "Improves credit mix and demonstrates borrowing capacity",
        reflection: "Multiple active loans actually harm credit profiles by increasing credit utilization ratios and debt-to-income metrics. The appearance of borrowing capacity is outweighed by the demonstrated over-leverage and increased default risk that lenders view negatively.",
        isCorrect: false,
      },
      {
        id: "deteriorates",
        label: "Deteriorates credit scores through increased utilization and risk",
        reflection: "Exactly! Multiple concurrent loans increase credit utilization percentages, debt-to-income ratios, and payment complexity. The elevated risk profile and potential for missed payments create negative reporting that significantly damages credit scores and future borrowing prospects.",
        isCorrect: true,
      },
      {
        id: "neutral",
        label: "Has minimal impact on established credit history",
        reflection: "Multiple concurrent loans create measurable negative impacts regardless of existing credit history. The increased debt burden, payment complexity, and heightened default risk generate adverse credit reporting that affects scores and lending decisions across all credit profiles.",
        isCorrect: false,
      },
      {
        id: "diversifies",
        label: "Diversifies credit portfolio and reduces concentration risk",
        reflection: "Credit diversification refers to different types of credit (mortgage, auto, credit cards), not multiple similar loans. Multiple concurrent personal loans actually increase concentration risk by creating redundant debt obligations with similar risk characteristics and correlated default probabilities.",
        isCorrect: false,
      },
    ],
    reward: 10,
  },
  {
    id: 4,
    prompt: "What's the smarter approach to multiple financial needs?",
    options: [
      {
        id: "separate",
        label: "Take separate loans for each distinct financial requirement",
        reflection: "Separate loans multiply complexity and risk unnecessarily. The administrative burden of multiple payments, varying terms, and coordination challenges typically outweighs any perceived benefits of addressing needs individually rather than holistically.",
        isCorrect: false,
      },
      {
        id: "consolidated",
        label: "Consolidate needs into single appropriate loan when possible",
        reflection: "Perfect! Consolidation simplifies management through single payment, unified terms, and clearer financial oversight. This approach reduces administrative burden, minimizes default risk, and provides better visibility into total debt obligations and repayment progress.",
        isCorrect: true,
      },
      {
        id: "sequential",
        label: "Take loans one at a time as each need arises",
        reflection: "Sequential borrowing can work but may not address urgent concurrent needs effectively. The key is evaluating whether needs can be consolidated into a single appropriate loan or whether genuine separation is necessary based on timing and purpose differences.",
        isCorrect: false,
      },
      {
        id: "maximum",
        label: "Borrow maximum available to cover all potential future needs",
        reflection: "Maximum borrowing for potential future needs creates unnecessary debt burden and financial strain. Smart approach is consolidating current actual needs while maintaining financial flexibility for genuine future requirements through disciplined saving rather than speculative borrowing.",
        isCorrect: false,
      },
    ],
    reward: 10,
  },
  {
    id: 5,
    prompt: "What's the fundamental danger of loan stacking?",
    options: [
      {
        id: "multiplicative",
        label: "Multiplicative risk of payment failures and credit damage",
        reflection: "Exactly! Loan stacking creates multiplicative risk where each additional loan exponentially increases the probability of missed payments, late fees, and credit reporting issues. The interconnected nature of multiple obligations means one failure can trigger cascading defaults and severe credit deterioration.",
        isCorrect: true,
      },
      {
        id: "management",
        label: "Increased administrative burden and paperwork",
        reflection: "While administrative complexity is problematic, it's not the fundamental danger. The core issue is the multiplicative financial risk—multiple obligations create exponentially increasing probability of payment failures, credit damage, and cascading financial consequences that overwhelm borrowers.",
        isCorrect: false,
      },
      
      {
        id: "approval",
        label: "Difficulty getting approval for additional loans later",
        reflection: "Future approval challenges are consequences rather than fundamental dangers. The primary risk is the immediate multiplicative probability of payment failures and credit damage from managing multiple concurrent obligations, which creates the conditions that lead to restricted future borrowing capacity.",
        isCorrect: false,
      },
      {
        id: "rates",
        label: "Higher average interest rates across multiple small loans",
        reflection: "Rate disadvantages are significant but secondary to the core multiplicative risk. The fundamental danger is the exponential increase in payment failure probability and credit damage potential from multiple concurrent obligations, which creates systemic financial vulnerability beyond mere cost considerations.",
        isCorrect: false,
      },
    ],
    reward: 10,
  },
];

const totalStages = LOAN_STACKING_DANGER_STAGES.length;
const successThreshold = totalStages;

const LoanStackingDanger = () => {
  const location = useLocation();
  const gameId = "finance-adults-47";
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
      "How can you consolidate multiple financial needs into single appropriate loans?",
      "What warning signs indicate you're taking on too many concurrent obligations?",
    ],
    []
  );

  const handleChoice = (option) => {
    if (selectedOption || showResult) return;

    resetFeedback();
    const currentStageData = LOAN_STACKING_DANGER_STAGES[currentStage];
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
  const stage = LOAN_STACKING_DANGER_STAGES[Math.min(currentStage, totalStages - 1)];
  const hasPassed = finalScore === successThreshold;

  return (
    <GameShell
      title="Loan Stacking Danger"
      subtitle={subtitle}
      score={coins}
      coins={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      maxScore={LOAN_STACKING_DANGER_STAGES.length}
      currentLevel={Math.min(currentStage + 1, LOAN_STACKING_DANGER_STAGES.length)}
      totalLevels={LOAN_STACKING_DANGER_STAGES.length}
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
            <span>Debt Management</span>
            <span>Credit Risk</span>
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
                        { stageId: LOAN_STACKING_DANGER_STAGES[currentStage].id, isCorrect: LOAN_STACKING_DANGER_STAGES[currentStage].options.find(opt => opt.id === selectedOption)?.isCorrect },
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
                    Skill unlocked: <strong>Strategic debt consolidation</strong>
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
              Skill unlocked: <strong>Strategic debt consolidation</strong>
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

export default LoanStackingDanger;