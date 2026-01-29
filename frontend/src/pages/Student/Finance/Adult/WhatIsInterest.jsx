import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const WHAT_IS_INTEREST_STAGES = [
  {
    id: 1,
    prompt: "Interest is:",
    options: [
      {
        id: "penalty",
        label: "A penalty for borrowing money",
        reflection: "While interest feels like a cost, it's not a punishment but the legitimate price lenders charge for providing financial resources when you need them.",
        isCorrect: false,
      },
      {
        id: "cost",
        label: "The cost of borrowing money",
        reflection: "Exactly! Interest represents the fee you pay lenders for using their money, compensating them for the risk and opportunity cost of lending.",
        isCorrect: true,
      },
      {
        id: "fee",
        label: "A service fee for financial transactions",
        reflection: "Interest is specifically the cost of borrowing, not a general transaction fee. It's the price paid for accessing funds that belong to someone else.",
        isCorrect: false,
      },
      {
        id: "tax",
        label: "A government tax on financial products",
        reflection: "Interest is a private market mechanism between borrowers and lenders, not a government-imposed tax on financial activities.",
        isCorrect: false,
      },
    ],
    reward: 10,
  },
  {
    id: 2,
    prompt: "What determines how much interest you pay?",
    options: [
      {
        id: "factors",
        label: "Credit score, loan terms, and market rates",
        reflection: "Correct! Your creditworthiness, agreed-upon terms, and prevailing market conditions determine the interest cost of borrowing money.",
        isCorrect: true,
      },
      {
        id: "amount",
        label: "The loan amount and time period",
        reflection: "While loan size and duration matter, the key factors are your creditworthiness, market rates, and the specific terms negotiated with your lender.",
        isCorrect: false,
      },
      
      {
        id: "lender",
        label: "Which bank or lender you choose",
        reflection: "Lender choice influences rates, but the fundamental determinants are your financial profile and broader economic conditions affecting all lenders.",
        isCorrect: false,
      },
      {
        id: "speed",
        label: "How quickly you need the funds",
        reflection: "Urgency may affect approval chances, but interest rates are primarily determined by credit risk and market conditions, not processing speed.",
        isCorrect: false,
      },
    ],
    reward: 10,
  },
  {
    id: 3,
    prompt: "Why do lenders charge interest?",
    options: [
      {
        id: "profit",
        label: "To make profit from borrowers",
        reflection: "While lenders do profit, the primary reason is compensation for risk, administrative costs, and the opportunity cost of not using their money elsewhere.",
        isCorrect: false,
      },
      {
        id: "compensation",
        label: "To compensate for risk and opportunity cost",
        reflection: "Perfect! Interest compensates lenders for default risk, operational costs, and the fact that they can't use their money for other investments while it's lent to you.",
        isCorrect: true,
      },
      {
        id: "regulation",
        label: "Because regulations require interest charges",
        reflection: "Regulations govern lending practices but don't mandate interest. Lenders charge interest based on market forces and risk assessment.",
        isCorrect: false,
      },
      {
        id: "competition",
        label: "To stay competitive with other lenders",
        reflection: "Competition affects rates, but the fundamental reason for charging interest is economic necessity - compensating for risk and lost opportunities.",
        isCorrect: false,
      },
    ],
    reward: 10,
  },
  {
    id: 4,
    prompt: "How does interest affect your total repayment?",
    options: [
      {
        id: "addition",
        label: "You repay only the original borrowed amount",
        reflection: "Actually, interest adds to your total obligation. You must repay both the principal amount borrowed plus the interest charges accumulated over time.",
        isCorrect: false,
      },
      
      {
        id: "discount",
        label: "Interest reduces your total payment obligation",
        reflection: "Interest increases, not decreases, your total payment. It represents additional cost beyond the original borrowed amount.",
        isCorrect: false,
      },
      {
        id: "principal",
        label: "You repay principal plus accumulated interest",
        reflection: "Exactly! The total repayment includes both the original amount borrowed (principal) and all interest charges that accrue according to your loan terms.",
        isCorrect: true,
      },
      {
        id: "waiver",
        label: "Interest can be waived for good borrowers",
        reflection: "While some promotional offers waive interest temporarily, standard loans require interest payment as compensation for the lending risk and service provided.",
        isCorrect: false,
      },
    ],
    reward: 10,
  },
  {
    id: 5,
    prompt: "What's the golden rule for managing interest costs?",
    options: [
      {
        id: "comparison",
        label: "Always compare rates from multiple lenders",
        reflection: "Rate comparison is valuable, but the fundamental principle is understanding that lower interest rates save you money over the loan's lifetime.",
        isCorrect: false,
      },
      
      {
        id: "accept",
        label: "Accept the first interest rate offered",
        reflection: "Accepting the first offer without comparison often means paying more than necessary. Shopping around typically reveals better interest rate options.",
        isCorrect: false,
      },
      {
        id: "ignore",
        label: "Focus on monthly payments, not total interest",
        reflection: "Monthly payment focus can be misleading. The total interest paid over the loan term is often more important for long-term financial planning.",
        isCorrect: false,
      },
      {
        id: "minimize",
        label: "Minimize interest by choosing lower rates and shorter terms",
        reflection: "Perfect! Lower interest rates and shorter repayment periods reduce the total cost of borrowing, saving you money over time.",
        isCorrect: true,
      },
    ],
    reward: 10,
  },
];

const totalStages = WHAT_IS_INTEREST_STAGES.length;
const successThreshold = totalStages;

const WhatIsInterest = () => {
  const location = useLocation();
  const gameId = "finance-adults-33";
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
      "How can understanding interest calculations help you make better borrowing decisions?",
      "What factors should you research before accepting any loan offer?",
    ],
    []
  );

  const handleChoice = (option) => {
    if (selectedOption || showResult) return;

    resetFeedback();
    const currentStageData = WHAT_IS_INTEREST_STAGES[currentStage];
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
  const stage = WHAT_IS_INTEREST_STAGES[Math.min(currentStage, totalStages - 1)];
  const hasPassed = finalScore === successThreshold;

  return (
    <GameShell
      title="What Is Interest?"
      subtitle={subtitle}
      score={coins}
      coins={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      maxScore={WHAT_IS_INTEREST_STAGES.length}
      currentLevel={Math.min(currentStage + 1, WHAT_IS_INTEREST_STAGES.length)}
      totalLevels={WHAT_IS_INTEREST_STAGES.length}
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
            <span>Interest Basics</span>
            <span>Borrowing Costs</span>
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
                        { stageId: WHAT_IS_INTEREST_STAGES[currentStage].id, isCorrect: WHAT_IS_INTEREST_STAGES[currentStage].options.find(opt => opt.id === selectedOption)?.isCorrect },
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
                    Skill unlocked: <strong>Interest calculation awareness</strong>
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
              Skill unlocked: <strong>Interest calculation awareness</strong>
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

export default WhatIsInterest;