import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const BORROWING_AS_LAST_OPTION_STAGES = [
  {
    id: 1,
    prompt: "You face a temporary cash gap. What should come first?",
    options: [
      {
        id: "loan",
        label: "Immediate loan to cover the gap",
        reflection: "Actually, borrowing should be the last resort after exhausting other options. Taking on debt for temporary gaps creates unnecessary interest costs and financial obligations that could be avoided through better planning.",
        isCorrect: false,
      },
      {
        id: "adjust",
        label: "Expense adjustment or using existing savings",
        reflection: "Exactly! Adjusting expenses or using emergency savings should always come before borrowing. This approach avoids debt costs and maintains financial flexibility for genuine emergencies that truly require external funding.",
        isCorrect: true,
      },
      {
        id: "ignore",
        label: "Ignore the gap and hope it resolves itself",
        reflection: "Ignoring financial gaps without planning creates stress and potential missed opportunities or obligations. Proactive management through expense adjustment or savings use provides better control and financial stability.",
        isCorrect: false,
      },
      {
        id: "credit",
        label: "Use credit card for convenience and pay later",
        reflection: "Credit card usage for temporary gaps often leads to high-interest debt and minimum payment traps. The disciplined approach is adjusting spending or using designated emergency funds rather than shifting expenses to expensive credit.",
        isCorrect: false,
      },
    ],
    reward: 10,
  },
  {
    id: 2,
    prompt: "What's the fundamental principle of responsible borrowing?",
    options: [
      {
        id: "last",
        label: "Borrow only when all other options are exhausted",
        reflection: "Correct! Responsible borrowing means using debt only after exhausting savings, expense reduction, income generation, and other non-debt solutions. Debt should supplement, not replace, financial planning.",
        isCorrect: true,
      },
      {
        id: "available",
        label: "Borrow whenever credit is available and approved",
        reflection: "Availability and approval don't indicate necessity or wisdom. Responsible borrowing requires evaluating whether the expense is essential, whether alternatives exist, and whether you can comfortably repay without financial stress.",
        isCorrect: false,
      },
      {
        id: "convenient",
        label: "Choose borrowing when it's the easiest option",
        reflection: "Ease of access shouldn't drive financial decisions. The most convenient option is often the most expensive long-term. Responsible borrowing requires effort to evaluate alternatives and ensure debt serves genuine needs rather than convenience.",
        isCorrect: false,
      },
      {
        id: "competitive",
        label: "Borrow when interest rates are historically low",
        reflection: "While rate environment matters, timing shouldn't override fundamental need assessment. The principle is matching borrowing to actual requirements after exhausting non-debt alternatives, regardless of current rate levels.",
        isCorrect: false,
      },
    ],
    reward: 10,
  },
  {
    id: 3,
    prompt: "Before considering a loan, you should evaluate:",
    options: [
      
      {
        id: "lenders",
        label: "Which lenders offer the quickest approval",
        reflection: "Speed of approval focuses on access rather than necessity. Proper evaluation prioritizes whether borrowing is truly needed after considering all alternatives, not which lender provides fastest access to funds.",
        isCorrect: false,
      },
      {
        id: "maximum",
        label: "Maximum amount you qualify to borrow",
        reflection: "Qualification amounts represent lending capacity, not financial need. Responsible evaluation focuses on actual requirements and repayment capability rather than maximum approved amounts that may exceed genuine needs.",
        isCorrect: false,
      },
      {
        id: "terms",
        label: "Loan terms and interest rates only",
        reflection: "Terms and rates are important but secondary considerations. Primary evaluation should determine if borrowing is necessary after exhausting alternatives, then assess whether terms make the genuine need financially viable.",
        isCorrect: false,
      },
      {
        id: "alternatives",
        label: "All non-debt alternatives including savings and expense cuts",
        reflection: "Perfect! Thorough evaluation means examining emergency funds, reducing discretionary spending, delaying non-essential purchases, generating additional income, or negotiating payment terms before debt becomes necessary.",
        isCorrect: true,
      },
    ],
    reward: 10,
  },
  {
    id: 4,
    prompt: "What indicates you're ready to consider borrowing?",
    options: [
      
      {
        id: "desire",
        label: "Strong desire to make a particular purchase",
        reflection: "Desire alone doesn't create borrowing readiness. Genuine need assessment requires determining whether the expense is essential, whether alternatives exist, and whether you can maintain financial stability while repaying the debt obligation.",
        isCorrect: false,
      },
      {
        id: "approval",
        label: "Getting preliminary approval from multiple lenders",
        reflection: "Approval indicates borrowing capacity but not readiness. True readiness requires exhausting alternatives and confirming that debt is necessary for essential needs rather than wants, regardless of lender willingness to lend.",
        isCorrect: false,
      },
      {
        id: "exhausted",
        label: "All personal resources and alternatives are exhausted",
        reflection: "Exactly! Readiness means you've genuinely evaluated and utilized emergency savings, reduced expenses to essential levels, explored income opportunities, and negotiated alternatives before determining that external funding is the only viable solution.",
        isCorrect: true,
      },
      {
        id: "convenience",
        label: "Borrowing seems more convenient than saving",
        reflection: "Convenience creates poor financial decisions. Readiness requires demonstrating that saving or alternative approaches aren't feasible, not simply that borrowing appears easier or faster than building financial resources.",
        isCorrect: false,
      },
    ],
    reward: 10,
  },
  {
    id: 5,
    prompt: "What's the golden rule for borrowing decisions?",
    options: [
      
      {
        id: "opportunity",
        label: "Borrow to take advantage of investment opportunities",
        reflection: "Investment borrowing adds risk layers and should be approached cautiously. The fundamental rule is exhausting personal resources first, then carefully evaluating whether debt-financed opportunities provide returns exceeding borrowing costs with acceptable risk levels.",
        isCorrect: false,
      },
      {
        id: "necessity",
        label: "Borrow only for genuine necessities after exhausting alternatives",
        reflection: "Perfect! The golden rule is reserving debt for authentic needs that cannot be addressed through savings, expense management, income generation, or other non-debt solutions, ensuring borrowing serves financial goals rather than substituting for planning.",
        isCorrect: true,
      },
      {
        id: "flexibility",
        label: "Maintain borrowing flexibility for future opportunities",
        reflection: "Preserving borrowing capacity is secondary to financial discipline. The priority is building savings and managing expenses efficiently, using debt strategically only when alternatives are genuinely exhausted and needs are essential.",
        isCorrect: false,
      },
      {
        id: "timing",
        label: "Time borrowing to coincide with favorable market conditions",
        reflection: "Market timing is less important than fundamental need assessment. The principle is matching borrowing to actual requirements after exhausting alternatives, rather than attempting to optimize timing for rate or market conditions.",
        isCorrect: false,
      },
    ],
    reward: 10,
  },
];

const totalStages = BORROWING_AS_LAST_OPTION_STAGES.length;
const successThreshold = totalStages;

const BorrowingAsLastOption = () => {
  const location = useLocation();
  const gameId = "finance-adults-45";
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
      "How can you build emergency funds to avoid unnecessary borrowing?",
      "What expense reduction strategies should you implement before considering debt?",
    ],
    []
  );

  const handleChoice = (option) => {
    if (selectedOption || showResult) return;

    resetFeedback();
    const currentStageData = BORROWING_AS_LAST_OPTION_STAGES[currentStage];
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
  const stage = BORROWING_AS_LAST_OPTION_STAGES[Math.min(currentStage, totalStages - 1)];
  const hasPassed = finalScore === successThreshold;

  return (
    <GameShell
      title="Borrowing as Last Option"
      subtitle={subtitle}
      score={showResult ? finalScore : coins}
      coins={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      maxScore={BORROWING_AS_LAST_OPTION_STAGES.length}
      currentLevel={Math.min(currentStage + 1, BORROWING_AS_LAST_OPTION_STAGES.length)}
      totalLevels={BORROWING_AS_LAST_OPTION_STAGES.length}
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
            <span>Responsible Borrowing</span>
            <span>Debt Management</span>
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
                    Skill unlocked: <strong>Responsible borrowing judgment</strong>
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
              Skill unlocked: <strong>Responsible borrowing judgment</strong>
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

export default BorrowingAsLastOption;