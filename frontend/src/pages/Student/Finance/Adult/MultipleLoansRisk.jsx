import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const MULTIPLE_LOANS_STAGES = [
  {
    id: 1,
    prompt: "Taking many loans at once leads to:",
    options: [
      {
        id: "growth",
        label: "Faster growth and financial advancement",
        reflection: "While multiple loans might seem to accelerate goals, they actually create overwhelming repayment obligations that can derail financial progress.",
        isCorrect: false,
      },
      
      {
        id: "opportunity",
        label: "More opportunities to invest and build wealth",
        reflection: "Multiple loans increase debt obligations rather than investment capacity. True wealth building requires managing existing debt first.",
        isCorrect: false,
      },
      {
        id: "flexibility",
        label: "Greater financial flexibility and options",
        reflection: "Multiple loan payments actually reduce flexibility by committing large portions of your income to debt service rather than choices.",
        isCorrect: false,
      },
      {
        id: "stress",
        label: "Higher repayment stress and financial burden",
        reflection: "Exactly! Multiple loans multiply your monthly obligations, creating stress and increasing the risk of default.",
        isCorrect: true,
      },
    ],
    reward: 10,
  },
  {
    id: 2,
    prompt: "What's the main danger of loan stacking?",
    options: [
      {
        id: "benefits",
        label: "Missing out on loan benefits and rewards",
        reflection: "The real danger isn't missed rewards - it's the overwhelming debt burden that makes meeting basic financial obligations difficult.",
        isCorrect: false,
      },
      {
        id: "default",
        label: "Increased risk of default and credit damage",
        reflection: "Correct! Multiple loans increase the likelihood of missed payments, defaults, and serious damage to your credit score.",
        isCorrect: true,
      },
      {
        id: "approval",
        label: "Difficulty getting future loan approvals",
        reflection: "While future approvals may be affected, the immediate danger is managing current obligations and avoiding default on existing loans.",
        isCorrect: false,
      },
      {
        id: "tracking",
        label: "Harder to track all payment due dates",
        reflection: "Organization challenges are secondary concerns. The primary risk is the financial strain that makes timely payments nearly impossible.",
        isCorrect: false,
      },
    ],
    reward: 10,
  },
  {
    id: 3,
    prompt: "How does multiple loan debt affect your financial health?",
    options: [
      {
        id: "improves",
        label: "Improves your debt-to-income ratio",
        reflection: "Multiple loans actually worsen your debt-to-income ratio by increasing total debt obligations relative to your income.",
        isCorrect: false,
      },
     
      {
        id: "neutral",
        label: "Has no significant impact on financial metrics",
        reflection: "Multiple loans significantly impact key financial ratios and create measurable stress on your ability to meet all financial obligations.",
        isCorrect: false,
      },
       {
        id: "worsens",
        label: "Worsens your debt-to-income ratio and financial stability",
        reflection: "Perfect! More loans mean higher debt obligations relative to income, reducing financial stability and borrowing capacity.",
        isCorrect: true,
      },
      {
        id: "temporarily",
        label: "Temporarily affects credit until loans are paid off",
        reflection: "The impact isn't temporary - multiple active loans continuously strain your finances and credit profile while outstanding.",
        isCorrect: false,
      },
    ],
    reward: 10,
  },
  {
    id: 4,
    prompt: "What should you prioritize when considering multiple loans?",
    options: [
       {
        id: "manageability",
        label: "Ensuring you can manage all payments comfortably",
        reflection: "Exactly! Financial health requires confirming you can handle total debt obligations without stress before taking on additional loans.",
        isCorrect: true,
      },
      {
        id: "speed",
        label: "Getting funds quickly for immediate needs",
        reflection: "Speed shouldn't override financial responsibility. Prioritize your ability to manage existing obligations before taking on new debt.",
        isCorrect: false,
      },
     
      {
        id: "interest",
        label: "Finding the lowest interest rates available",
        reflection: "While interest rates matter, they're secondary to whether you can actually afford the combined payments from all your loans.",
        isCorrect: false,
      },
      {
        id: "convenience",
        label: "Choosing lenders with convenient payment options",
        reflection: "Convenience features don't address the fundamental challenge of managing multiple debt obligations simultaneously.",
        isCorrect: false,
      },
    ],
    reward: 10,
  },
  {
    id: 5,
    prompt: "What's the golden rule for responsible borrowing with multiple needs?",
    options: [
      {
        id: "consolidate",
        label: "Consolidate needs into one larger loan",
        reflection: "Consolidation can help, but the fundamental principle is limiting total debt to what you can comfortably repay, regardless of structure.",
        isCorrect: false,
      },
      {
        id: "capacity",
        label: "Only borrow what fits your repayment capacity",
        reflection: "Perfect! This rule prevents over-leveraging and ensures you maintain financial stability while meeting all debt obligations.",
        isCorrect: true,
      },
      {
        id: "timing",
        label: "Spread loans over time to reduce monthly impact",
        reflection: "Timing strategies don't eliminate the core issue - if total debt exceeds your repayment capacity, problems will eventually surface.",
        isCorrect: false,
      },
      {
        id: "emergency",
        label: "Keep some loans for emergency backup funding",
        reflection: "Emergency funds should come from savings, not additional debt. Backup borrowing creates more financial risk, not security.",
        isCorrect: false,
      },
    ],
    reward: 10,
  },
];

const totalStages = MULTIPLE_LOANS_STAGES.length;
const successThreshold = totalStages;

const MultipleLoansRisk = () => {
  const location = useLocation();
  const gameId = "finance-adults-29";
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
      "How can you assess whether you're taking on too much debt across multiple loans?",
      "What warning signs indicate you're approaching your borrowing capacity limits?",
    ],
    []
  );

  const handleChoice = (option) => {
    if (selectedOption || showResult) return;

    resetFeedback();
    const currentStageData = MULTIPLE_LOANS_STAGES[currentStage];
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
  const stage = MULTIPLE_LOANS_STAGES[Math.min(currentStage, totalStages - 1)];
  const hasPassed = finalScore === successThreshold;

  return (
    <GameShell
      title="Multiple Loans Risk"
      subtitle={subtitle}
      score={showResult ? finalScore : coins}
      coins={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      maxScore={MULTIPLE_LOANS_STAGES.length}
      currentLevel={Math.min(currentStage + 1, MULTIPLE_LOANS_STAGES.length)}
      totalLevels={MULTIPLE_LOANS_STAGES.length}
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
            <span>Multiple Loans</span>
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
                    Skill unlocked: <strong>Multi-loan risk assessment</strong>
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
              Skill unlocked: <strong>Multi-loan risk assessment</strong>
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

export default MultipleLoansRisk;