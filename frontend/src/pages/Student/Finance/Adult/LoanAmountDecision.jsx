import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const LOAN_AMOUNT_STAGES = [
  {
    id: 1,
    prompt: "You qualify for ₹1,00,000 but only need ₹40,000. What should you take?",
    options: [
      {
        id: "full",
        label: "Take the full ₹1,00,000 amount",
        reflection: "Taking more than you need increases your debt burden and monthly payments, making it harder to manage your finances responsibly.",
        isCorrect: false,
      },
      {
        id: "needed",
        label: "Take only the ₹40,000 you actually need",
        reflection: "Exactly! Borrowing only what you need ensures manageable repayments and reduces financial stress.",
        isCorrect: true,
      },
      {
        id: "little-extra",
        label: "Take ₹60,000 to have some extra cushion",
        reflection: "While having a cushion seems wise, extra borrowed money still accrues interest and increases your debt obligation unnecessarily.",
        isCorrect: false,
      },
      {
        id: "minimum",
        label: "Take the minimum possible amount",
        reflection: "Borrowing the minimum ensures you're not over-leveraged, but make sure it covers your actual needs completely.",
        isCorrect: false,
      },
    ],
    reward: 10,
  },
  {
    id: 2,
    prompt: "What's the main risk of borrowing more than you need?",
    options: [
      {
        id: "interest",
        label: "You'll pay interest on money you don't use",
        reflection: "Correct! Extra borrowed amount means extra interest payments over the loan term, increasing your total cost significantly.",
        isCorrect: true,
      },
      {
        id: "approval",
        label: "Banks might not approve larger amounts",
        reflection: "If you qualify for the larger amount, approval isn't the issue. The problem is the unnecessary financial burden you create.",
        isCorrect: false,
      },
      {
        id: "flexibility",
        label: "You lose flexibility in choosing lenders",
        reflection: "Having extra borrowed money doesn't limit lender choices - it creates unnecessary debt that you'll struggle to repay.",
        isCorrect: false,
      },
      {
        id: "process",
        label: "The application process becomes more complex",
        reflection: "Loan application complexity doesn't depend on amount borrowed - it depends on your financial documentation and credit profile.",
        isCorrect: false,
      },
    ],
    reward: 10,
  },
  {
    id: 3,
    prompt: "How does borrowing only what you need affect your monthly payments?",
    options: [
      {
        id: "higher",
        label: "Monthly payments become unaffordable",
        reflection: "Actually, borrowing less makes payments more affordable and manageable within your budget.",
        isCorrect: false,
      },
      {
        id: "manageable",
        label: "Payments remain comfortably within your budget",
        reflection: "Perfect! Lower loan amounts mean lower EMIs, reducing financial stress and freeing up money for other needs.",
        isCorrect: true,
      },
      {
        id: "same",
        label: "Payments stay the same regardless of amount borrowed",
        reflection: "Loan payments are directly proportional to the amount borrowed - less borrowed means lower monthly obligations.",
        isCorrect: false,
      },
      {
        id: "complex",
        label: "Payment calculations become more complicated",
        reflection: "Smaller loans actually simplify financial planning since you have lower, more predictable monthly obligations.",
        isCorrect: false,
      },
    ],
    reward: 10,
  },
  {
    id: 4,
    prompt: "What should you consider before deciding how much to borrow?",
    options: [
      
      {
        id: "friends",
        label: "What your friends are borrowing",
        reflection: "Your borrowing decisions should be based on your personal financial situation, not peer behavior or social pressure.",
        isCorrect: false,
      },
      {
        id: "lender",
        label: "Which lender offers the quickest approval",
        reflection: "While quick approval is convenient, focus on terms that match your actual needs and repayment capacity.",
        isCorrect: false,
      },
      {
        id: "maximum",
        label: "The maximum amount you're eligible for",
        reflection: "Eligibility doesn't equal necessity. Always borrow based on actual needs, not maximum approval limits.",
        isCorrect: false,
      },
      {
        id: "future",
        label: "Your future income potential and stability",
        reflection: "Absolutely! Your ability to repay should be based on realistic future income expectations, not just current qualification.",
        isCorrect: true,
      },
    ],
    reward: 10,
  },
  {
    id: 5,
    prompt: "What's the golden rule for responsible borrowing?",
    options: [
      
      {
        id: "available",
        label: "Borrow whatever amount is available to you",
        reflection: "Availability doesn't determine appropriateness. Responsible borrowing requires matching loans to actual needs and repayment capacity.",
        isCorrect: false,
      },
      {
        id: "emergency",
        label: "Keep some extra for emergency situations",
        reflection: "While emergency funds are important, they shouldn't come from unnecessary borrowing. Build emergency savings separately.",
        isCorrect: false,
      },
      {
        id: "comfortable",
        label: "Borrow only what you can repay comfortably",
        reflection: "Exactly! This fundamental principle ensures financial stability and prevents debt-related stress.",
        isCorrect: true,
      },
      {
        id: "investment",
        label: "Borrow to invest in potential opportunities",
        reflection: "Speculative borrowing for investments is risky. Only borrow for clear, immediate needs you can confidently repay.",
        isCorrect: false,
      },
    ],
    reward: 10,
  },
];

const totalStages = LOAN_AMOUNT_STAGES.length;
const successThreshold = totalStages;

const LoanAmountDecision = () => {
  const location = useLocation();
  const gameId = "finance-adults-27";
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
      "How can borrowing only what you need prevent future financial stress?",
      "What factors should guide your loan amount decisions beyond lender approval?",
    ],
    []
  );

  const handleChoice = (option) => {
    if (selectedOption || showResult) return;

    resetFeedback();
    const currentStageData = LOAN_AMOUNT_STAGES[currentStage];
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
  const stage = LOAN_AMOUNT_STAGES[Math.min(currentStage, totalStages - 1)];
  const hasPassed = finalScore === successThreshold;

  return (
    <GameShell
      title="Loan Amount Decision"
      subtitle={subtitle}
      score={coins}
      coins={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      maxScore={LOAN_AMOUNT_STAGES.length}
      currentLevel={Math.min(currentStage + 1, LOAN_AMOUNT_STAGES.length)}
      totalLevels={LOAN_AMOUNT_STAGES.length}
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
            <span>Loan Amount</span>
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
                    Skill unlocked: <strong>Responsible borrowing mindset</strong>
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
              Skill unlocked: <strong>Responsible borrowing mindset</strong>
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

export default LoanAmountDecision;