import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const CREDIT_EMERGENCIES_STAGES = [
  {
    id: 1,
    prompt: "Is credit the first solution for emergencies?",
    options: [
      {
        id: "yes",
        label: "Yes, credit provides immediate access to funds",
        reflection: "While credit offers quick access, it creates debt obligations with interest that compound financial stress during emergencies.",
        isCorrect: false,
      },
    
      {
        id: "sometimes",
        label: "Sometimes, depending on the emergency size",
        reflection: "The priority should always be existing emergency funds first. Credit should be a last resort when savings are insufficient.",
        isCorrect: false,
      },
        {
        id: "no",
        label: "No, savings should come first if possible",
        reflection: "Exactly! Emergency savings provide immediate access without debt obligations, protecting your financial stability during crises.",
        isCorrect: true,
      },
      {
        id: "alternative",
        label: "Only if traditional savings aren't available",
        reflection: "Emergency funds should be built specifically for this purpose. Relying on credit as primary emergency funding creates long-term financial problems.",
        isCorrect: false,
      },
    ],
    reward: 10,
  },
  {
    id: 2,
    prompt: "What's the main problem with using credit for emergencies?",
    options: [
      {
        id: "approval",
        label: "Credit approval might be delayed during crises",
        reflection: "While approval timing can be an issue, the fundamental problem is creating debt obligations that persist long after the emergency passes.",
        isCorrect: false,
      },
      {
        id: "debt",
        label: "You create debt obligations with interest charges",
        reflection: "Correct! Emergency credit creates ongoing financial obligations that compound stress during already difficult times.",
        isCorrect: true,
      },
      {
        id: "limits",
        label: "Credit limits may not cover full emergency costs",
        reflection: "Coverage limitations are practical concerns, but the core issue is the debt creation that undermines long-term financial recovery.",
        isCorrect: false,
      },
      {
        id: "tracking",
        label: "It's harder to track emergency spending on credit",
        reflection: "Spending tracking is a management issue, not the primary concern. The real problem is the debt burden that hinders financial healing.",
        isCorrect: false,
      },
    ],
    reward: 10,
  },
  {
    id: 3,
    prompt: "How do emergency funds differ from emergency credit?",
    options: [
      {
        id: "ownership",
        label: "Funds are yours to keep, credit must be repaid with interest",
        reflection: "Perfect! Emergency funds provide liquidity you own outright, while credit creates obligations that drain future financial resources.",
        isCorrect: true,
      },
      {
        id: "access",
        label: "Funds are harder to access than credit lines",
        reflection: "Actually, emergency funds provide immediate access without applications, approvals, or waiting periods that credit often requires.",
        isCorrect: false,
      },
      
      {
        id: "flexibility",
        label: "Credit offers more spending flexibility than funds",
        reflection: "Both provide flexibility, but credit flexibility comes at the cost of interest and repayment obligations that can devastate financial recovery.",
        isCorrect: false,
      },
      {
        id: "amount",
        label: "Funds typically cover smaller emergencies than credit",
        reflection: "The amount difference isn't the key distinction. The fundamental difference is ownership - funds are assets, credit is debt.",
        isCorrect: false,
      },
    ],
    reward: 10,
  },
  {
    id: 4,
    prompt: "What should you prioritize when building emergency preparedness?",
    options: [
      {
        id: "credit",
        label: "Establishing multiple credit lines for backup",
        reflection: "Credit lines create debt risks. Priority should be building actual emergency savings that provide protection without financial obligations.",
        isCorrect: false,
      },
      
      {
        id: "insurance",
        label: "Getting comprehensive insurance coverage first",
        reflection: "Insurance is important but addresses specific risks. Emergency funds provide universal protection for any unexpected financial crisis.",
        isCorrect: false,
      },
      {
        id: "investment",
        label: "Creating emergency investment portfolios",
        reflection: "Investments fluctuate in value and may be illiquid during emergencies. Dedicated emergency funds provide stable, immediate access when needed.",
        isCorrect: false,
      },
      {
        id: "savings",
        label: "Building emergency savings before relying on credit",
        reflection: "Exactly! Emergency funds should be the foundation of crisis preparedness, with credit as only a secondary backup option.",
        isCorrect: true,
      },
    ],
    reward: 10,
  },
  {
    id: 5,
    prompt: "What's the golden rule for emergency financial planning?",
    options: [
      {
        id: "diversify",
        label: "Diversify emergency funding across multiple sources",
        reflection: "Diversification helps, but the fundamental principle is prioritizing self-owned emergency funds over debt-based solutions.",
        isCorrect: false,
      },
      
      {
        id: "minimal",
        label: "Keep minimal emergency reserves to maximize investments",
        reflection: "Minimal reserves increase vulnerability to emergencies. Adequate emergency funds protect your ability to maintain other financial goals.",
        isCorrect: false,
      },
      {
        id: "preparation",
        label: "Prepare emergency funds before crises occur",
        reflection: "Perfect! Proactive emergency fund building prevents the need for harmful borrowing and maintains financial stability during unexpected events.",
        isCorrect: true,
      },
      {
        id: "reactive",
        label: "Build emergency funds reactively as situations arise",
        reflection: "Reactive building defeats the purpose of emergency preparation. Funds must exist before emergencies to provide effective protection.",
        isCorrect: false,
      },
    ],
    reward: 10,
  },
];

const totalStages = CREDIT_EMERGENCIES_STAGES.length;
const successThreshold = totalStages;

const CreditForEmergencies = () => {
  const location = useLocation();
  const gameId = "finance-adults-30";
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
      "How can you start building emergency funds even with limited income?",
      "What's the minimum emergency fund size that would prevent harmful borrowing?",
    ],
    []
  );

  const handleChoice = (option) => {
    if (selectedOption || showResult) return;

    resetFeedback();
    const currentStageData = CREDIT_EMERGENCIES_STAGES[currentStage];
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
  const stage = CREDIT_EMERGENCIES_STAGES[Math.min(currentStage, totalStages - 1)];
  const hasPassed = finalScore === successThreshold;

  return (
    <GameShell
      title="Credit for Emergencies"
      subtitle={subtitle}
      score={coins}
      coins={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      maxScore={CREDIT_EMERGENCIES_STAGES.length}
      currentLevel={Math.min(currentStage + 1, CREDIT_EMERGENCIES_STAGES.length)}
      totalLevels={CREDIT_EMERGENCIES_STAGES.length}
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
            <span>Emergency Funding</span>
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
                    Skill unlocked: <strong>Emergency fund planning</strong>
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
              Skill unlocked: <strong>Emergency fund planning</strong>
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

export default CreditForEmergencies;