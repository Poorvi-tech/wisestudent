import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const FIRST_CREDIT_STAGES = [
  {
    id: 1,
    prompt: "When is it okay to use credit?",
    options: [
      {
        id: "impulse",
        label: "For impulse spending",
        reflection: "Using credit for impulse purchases can lead to debt accumulation and financial stress. It's important to distinguish between wants and needs before using credit.",
        isCorrect: false,
      },
      {
        id: "planned",
        label: "For planned needs with repayment ability",
        reflection: "Exactly! Credit should be used for planned expenses where you have a clear repayment strategy. This ensures you can afford the debt without financial strain.",
        isCorrect: true,
      },
      {
        id: "luxury",
        label: "For luxury items to impress others",
        reflection: "Using credit to impress others can lead to financial problems and doesn't build genuine relationships. True confidence comes from financial responsibility.",
        isCorrect: false,
      },
      {
        id: "emergency",
        label: "Only for true emergencies",
        reflection: "While emergencies are valid uses of credit, planned expenses with clear repayment ability are also appropriate. The key is responsible usage with a strategy.",
        isCorrect: false,
      },
    ],
    reward: 15,
  },
  {
    id: 2,
    prompt: "What is the primary purpose of credit?",
    options: [
      {
        id: "free",
        label: "Free money to spend however you want",
        reflection: "Credit is not free money - it's borrowed money that must be repaid, often with interest. This misconception can lead to serious financial problems.",
        isCorrect: false,
      },
      {
        id: "tool",
        label: "A financial tool for strategic purchases",
        reflection: "Perfect! Credit is a tool that, when used strategically, can help you make important purchases and build financial credibility.",
        isCorrect: true,
      },
      {
        id: "status",
        label: "To increase your social status",
        reflection: "Using credit for status symbols can create financial stress and doesn't reflect true wealth or success. Financial security comes from responsible management.",
        isCorrect: false,
      },
      {
        id: "escape",
        label: "To escape from financial problems",
        reflection: "Credit rarely solves financial problems and often makes them worse. The solution lies in budgeting and responsible spending habits.",
        isCorrect: false,
      },
    ],
    reward: 15,
  },
  {
    id: 3,
    prompt: "How much credit should you use?",
    options: [
      {
        id: "max",
        label: "As much as you're approved for",
        reflection: "Using maximum credit increases your debt burden and can negatively impact your credit score. It's better to borrow only what you need and can afford.",
        isCorrect: false,
      },
     
      {
        id: "minimum",
        label: "Always the minimum amount possible",
        reflection: "While being conservative is good, completely avoiding credit when you can handle it responsibly means missing opportunities to build credit history.",
        isCorrect: false,
      },
      {
        id: "random",
        label: "Whatever feels right in the moment",
        reflection: "Making credit decisions based on emotions can lead to poor financial choices. It's important to have a systematic approach to credit usage.",
        isCorrect: false,
      },
       {
        id: "responsible",
        label: "Only what fits your budget and repayment plan",
        reflection: "Exactly! Responsible credit usage means borrowing within your means and having a clear plan for repayment without financial strain.",
        isCorrect: true,
      },
    ],
    reward: 15,
  },
  {
    id: 4,
    prompt: "What should you consider before using credit?",
    options: [
      {
        id: "ignore",
        label: "Ignore the interest rates and fees",
        reflection: "Ignoring the cost of credit can lead to expensive mistakes. Always understand the total cost including interest rates and fees before borrowing.",
        isCorrect: false,
      },
      
      {
        id: "comparison",
        label: "Compare different credit options available",
        reflection: "While comparing options is helpful, the most important factor is your ability to repay. The best credit option is one you can afford to use responsibly.",
        isCorrect: false,
      },
      {
        id: "evaluate",
        label: "Evaluate your ability to repay on time",
        reflection: "Perfect! Before using credit, you should assess whether you can comfortably make payments without jeopardizing other financial obligations.",
        isCorrect: true,
      },
      {
        id: "friends",
        label: "What your friends are doing with credit",
        reflection: "Following friends' credit habits can lead to financial trouble. Your credit decisions should be based on your personal financial situation and goals.",
        isCorrect: false,
      },
    ],
    reward: 15,
  },
  {
    id: 5,
    prompt: "What is the outcome of responsible credit use?",
    options: [
      {
        id: "debt",
        label: "Increased debt and financial stress",
        reflection: "Responsible credit use should not lead to increased debt or stress. If you're experiencing these issues, it's time to reassess your credit usage habits.",
        isCorrect: false,
      },
      {
        id: "stability",
        label: "Financial stability and improved credit score",
        reflection: "Exactly! When used responsibly, credit can help build a positive credit history, improve your credit score, and provide financial flexibility for future needs.",
        isCorrect: true,
      },
      {
        id: "dependence",
        label: "Increased dependence on borrowing",
        reflection: "Responsible credit use builds financial independence, not dependence. The goal is to use credit strategically while maintaining control over your finances.",
        isCorrect: false,
      },
      {
        id: "ignore",
        label: "You don't need to track it",
        reflection: "Tracking your credit usage is essential for responsible management. Regular monitoring helps you stay within limits and avoid surprises.",
        isCorrect: false,
      },
    ],
    reward: 15,
  },
];

const totalStages = FIRST_CREDIT_STAGES.length;
const successThreshold = totalStages;

const FirstCreditDecision = () => {
  const location = useLocation();
  const gameId = "finance-young-adult-52";
  const gameData = getGameDataById(gameId);
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 15;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 15;
  const totalXp = gameData?.xp || location.state?.totalXp || 30;
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
      "How can understanding responsible credit use help you build long-term financial security?",
      "What strategies can you implement to ensure credit supports your financial goals rather than hinders them?",
    ],
    []
  );

  const handleChoice = (option) => {
    if (selectedOption || showResult) return;

    resetFeedback();
    const currentStageData = FIRST_CREDIT_STAGES[currentStage];
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
  const stage = FIRST_CREDIT_STAGES[Math.min(currentStage, totalStages - 1)];
  const hasPassed = finalScore === successThreshold;

  return (
    <GameShell
      title="First Credit Decision"
      subtitle={subtitle}
      score={coins}
      coins={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      maxScore={FIRST_CREDIT_STAGES.length}
      currentLevel={Math.min(currentStage + 1, FIRST_CREDIT_STAGES.length)}
      totalLevels={FIRST_CREDIT_STAGES.length}
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
            <span>Credit Decisions</span>
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
                    Skill unlocked: <strong>Responsible credit usage</strong>
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
              Skill unlocked: <strong>Responsible credit usage</strong>
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

export default FirstCreditDecision;