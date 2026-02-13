import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const EMI_DISCIPLINE_STAGES = [
  {
    id: 1,
    prompt: "Best habit for EMI safety:",
    options: [
      {
        id: "whenever",
        label: "Pay whenever possible based on cash flow",
        reflection: "Actually, irregular payment timing can lead to missed due dates, late fees, and credit score damage. Consistent, timely payments are essential for financial discipline and credit protection.",
        isCorrect: false,
      },
      {
        id: "timely",
        label: "Pay on or before due date every month",
        reflection: "Exactly! Timely payment is the cornerstone of EMI discipline. It protects your credit history, avoids penalties, and demonstrates financial reliability to lenders and future creditors.",
        isCorrect: true,
      },
      {
        id: "minimum",
        label: "Pay minimum amount when facing financial difficulty",
        reflection: "While minimum payments prevent default, they don't protect your credit score and can lead to accumulating interest. Proactive communication with lenders is better than partial payments.",
        isCorrect: false,
      },
      {
        id: "extra",
        label: "Pay extra amounts whenever extra money is available",
        reflection: "Extra payments are beneficial for reducing interest, but the fundamental discipline is making required payments on time. Extra payments complement, not replace, timely EMI fulfillment.",
        isCorrect: false,
      },
    ],
    reward: 10,
  },
  {
    id: 2,
    prompt: "What happens when you consistently pay EMIs on time?",
    options: [
      {
        id: "credit",
        label: "Builds positive credit history and improves credit score",
        reflection: "Correct! Timely payments comprise 35% of credit scores. Consistent on-time payments demonstrate reliability and significantly improve your borrowing capacity and future loan terms.",
        isCorrect: true,
      },
      {
        id: "flexibility",
        label: "Increases monthly payment flexibility automatically",
        reflection: "Timely payments don't automatically increase flexibility - they protect your current terms and demonstrate reliability that may lead to better offers, but don't change existing payment structures.",
        isCorrect: false,
      },
      {
        id: "interest",
        label: "Reduces interest rates on existing loans immediately",
        reflection: "While good payment history may qualify you for better rates on future products, existing loan interest rates typically remain fixed according to original contract terms regardless of payment performance.",
        isCorrect: false,
      },
      {
        id: "approval",
        label: "Guarantees approval for all future loan applications",
        reflection: "Good payment history improves approval chances significantly, but lenders consider multiple factors including income, debt-to-income ratio, and current financial obligations, not just payment history alone.",
        isCorrect: false,
      },
    ],
    reward: 10,
  },
  {
    id: 3,
    prompt: "What's the consequence of missing EMI due dates?",
    options: [
      
      {
        id: "extension",
        label: "Automatic payment extension with no consequences",
        reflection: "Lenders don't automatically extend payments without formal arrangements. Missed payments require proactive communication and typically involve fees, credit reporting, and potential legal consequences.",
        isCorrect: false,
      },
      {
        id: "forgiveness",
        label: "Lenders usually forgive first-time misses",
        reflection: "While some hardship programs exist, consistent on-time payment is the expectation. First-time misses still typically incur fees and credit reporting, making prevention the better strategy.",
        isCorrect: false,
      },
      {
        id: "negotiation",
        label: "Easy negotiation for new payment terms",
        reflection: "Negotiation is possible but requires proactive communication before missing payments. Post-miss negotiations are more difficult and may involve higher costs or stricter terms than preventive arrangements.",
        isCorrect: false,
      },
      {
        id: "penalties",
        label: "Late fees, credit score damage, and future borrowing impact",
        reflection: "Perfect! Missed payments trigger immediate penalties, negative credit reporting, and create barriers to future financial opportunities including loans, credit cards, and even employment or housing prospects.",
        isCorrect: true,
      },
    ],
    reward: 10,
  },
  {
    id: 4,
    prompt: "How can you ensure you never miss an EMI payment?",
    options: [
      
      {
        id: "reminder",
        label: "Rely on calendar reminders and personal memory",
        reflection: "While reminders help, they depend on consistent action and can fail during busy periods. Systematic automation provides more reliable protection than memory-dependent methods prone to human error.",
        isCorrect: false,
      },
      {
        id: "manual",
        label: "Manually pay each month when you remember",
        reflection: "Manual payment relies entirely on memory and timing, creating significant risk of missed payments during busy periods, vacations, or life transitions when routine changes occur unexpectedly.",
        isCorrect: false,
      },
      {
        id: "automation",
        label: "Set up automatic payments from your bank account",
        reflection: "Exactly! Automatic payments eliminate human error and timing issues. Setting up autopay ensures payments are made on time even when you're busy, traveling, or forgetful, protecting your credit consistently.",
        isCorrect: true,
      },
      {
        id: "spare",
        label: "Keep extra money aside for emergency payment situations",
        reflection: "Emergency funds are important financial buffers, but they don't prevent missed payments. The key is systematic payment methods that ensure timely fulfillment regardless of cash flow variations.",
        isCorrect: false,
      },
    ],
    reward: 10,
  },
  {
    id: 5,
    prompt: "What's the golden rule for EMI management discipline?",
    options: [
      
      {
        id: "flexible",
        label: "Maintain flexible payment schedules based on monthly cash flow",
        reflection: "Flexibility sounds appealing but creates inconsistency that damages credit. Essential obligations require systematic, reliable fulfillment regardless of varying monthly circumstances.",
        isCorrect: false,
      },
      {
        id: "priority",
        label: "Treat EMI payments as non-negotiable financial priorities",
        reflection: "Perfect! EMI payments should rank alongside essential expenses like rent and utilities. This mindset ensures consistent fulfillment and protects your financial reputation and future borrowing capacity.",
        isCorrect: true,
      },
      {
        id: "minimum",
        label: "Focus on making minimum payments to preserve cash flow",
        reflection: "Minimum payments prevent default but don't build positive credit history. The discipline goal is consistent, complete payment fulfillment that demonstrates financial reliability and responsibility.",
        isCorrect: false,
      },
      {
        id: "postpone",
        label: "Postpone payments during challenging financial months",
        reflection: "Postponement without formal arrangement creates missed payment reporting. Proper discipline involves proactive communication with lenders for structured alternatives rather than unilateral payment delays.",
        isCorrect: false,
      },
    ],
    reward: 10,
  },
];

const totalStages = EMI_DISCIPLINE_STAGES.length;
const successThreshold = totalStages;

const EMIDiscipline = () => {
  const location = useLocation();
  const gameId = "finance-adults-42";
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
      "How can you set up automatic payment systems to ensure consistent EMI fulfillment?",
      "What backup plans should you have if automatic payments fail or accounts have insufficient funds?",
    ],
    []
  );

  const handleChoice = (option) => {
    if (selectedOption || showResult) return;

    resetFeedback();
    const currentStageData = EMI_DISCIPLINE_STAGES[currentStage];
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
  const stage = EMI_DISCIPLINE_STAGES[Math.min(currentStage, totalStages - 1)];
  const hasPassed = finalScore === successThreshold;

  return (
    <GameShell
      title="EMI Discipline"
      subtitle={subtitle}
      score={coins}
      coins={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      maxScore={EMI_DISCIPLINE_STAGES.length}
      currentLevel={Math.min(currentStage + 1, EMI_DISCIPLINE_STAGES.length)}
      totalLevels={EMI_DISCIPLINE_STAGES.length}
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
            <span>Payment Reliability</span>
            <span>Credit Protection</span>
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
                    Skill unlocked: <strong>Payment discipline mastery</strong>
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
              Skill unlocked: <strong>Payment discipline mastery</strong>
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

export default EMIDiscipline;