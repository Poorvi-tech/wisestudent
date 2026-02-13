import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const OVER_BORROWING_RISK_STAGES = [
  {
    id: 1,
    prompt: "Taking a loan larger than needed usually leads to:",
    options: [
      {
        id: "growth",
        label: "Faster growth and financial advancement",
        reflection: "Actually, bigger loans don't accelerate growth—they create unnecessary debt burden. Excess borrowing increases monthly obligations without providing proportional benefits, leading to higher repayment stress rather than advancement.",
        isCorrect: false,
      },
     
      {
        id: "flexibility",
        label: "More financial flexibility and options",
        reflection: "Contrary to appearances, oversized loans reduce flexibility by increasing fixed obligations. The larger payments consume more income, leaving less room for other financial goals, emergencies, or opportunities.",
        isCorrect: false,
      },
      {
        id: "security",
        label: "Enhanced financial security and backup funds",
        reflection: "Extra borrowing doesn't create security—it creates vulnerability. The additional debt obligation becomes a liability rather than an asset, increasing financial risk and reducing your ability to handle unexpected expenses.",
        isCorrect: false,
      },
       {
        id: "stress",
        label: "Higher repayment stress and financial pressure",
        reflection: "Exactly! Larger loans mean higher EMIs, more interest payments, and greater financial commitment. The extra borrowed amount creates disproportionate stress without delivering additional value or benefits.",
        isCorrect: true,
      },
    ],
    reward: 10,
  },
  {
    id: 2,
    prompt: "What happens when you borrow more than actually required?",
    options: [
      {
        id: "benefit",
        label: "You gain extra benefit proportional to the additional amount",
        reflection: "Borrowing excess rarely provides proportional benefits. The additional funds often sit unused or are spent on non-essentials, while you still pay interest and face higher repayment obligations for the extra amount.",
        isCorrect: false,
      },
      {
        id: "burden",
        label: "You create unnecessary debt burden without extra value",
        reflection: "Correct! Over-borrowing means paying interest and making higher payments for money you don't actually need. The extra amount becomes pure financial burden without delivering corresponding benefits or improvements.",
        isCorrect: true,
      },
      {
        id: "opportunity",
        label: "You preserve borrowing capacity for future opportunities",
        reflection: "Using excess borrowing capacity now reduces future flexibility. The higher current obligations limit your ability to borrow when genuine needs arise, making present over-borrowing counterproductive for future opportunities.",
        isCorrect: false,
      },
      {
        id: "investment",
        label: "You invest the extra funds for better returns",
        reflection: "Without specific investment plans, excess borrowed funds typically don't generate returns. More commonly, they're spent on consumption or sit idle, while you continue paying interest on unproductive debt—a losing financial proposition.",
        isCorrect: false,
      },
    ],
    reward: 10,
  },
  {
    id: 3,
    prompt: "How does over-borrowing affect your financial health?",
    options: [
      {
        id: "deteriorates",
        label: "Deteriorates cash flow and increases financial stress",
        reflection: "Exactly! Excessive borrowing consumes more income through higher payments, reduces available cash flow, and creates ongoing financial pressure. This undermines financial stability and limits your ability to handle emergencies or pursue opportunities.",
        isCorrect: true,
      },
      {
        id: "improves",
        label: "Improves debt-to-income ratio and credit profile",
        reflection: "Actually, over-borrowing worsens financial metrics. Higher debt loads increase debt-to-income ratios and create larger payment obligations, potentially straining your ability to meet other financial commitments and maintain healthy credit utilization.",
        isCorrect: false,
      },
      
      {
        id: "neutral",
        label: "Has neutral impact on overall financial position",
        reflection: "Over-borrowing definitely impacts your finances negatively. The additional debt creates measurable strain through higher payments, increased interest costs, and reduced financial flexibility—effects that compound over time rather than remaining neutral.",
        isCorrect: false,
      },
      {
        id: "enhances",
        label: "Enhances emergency preparedness and liquidity",
        reflection: "Extra debt actually reduces emergency preparedness by increasing fixed obligations and consuming cash flow. Rather than enhancing liquidity, over-borrowing creates additional financial vulnerabilities during challenging times.",
        isCorrect: false,
      },
    ],
    reward: 10,
  },
  {
    id: 4,
    prompt: "What's the smarter approach to loan sizing?",
    options: [
      {
        id: "maximum",
        label: "Borrow maximum approved amount for flexibility",
        reflection: "Maximum borrowing often leads to financial strain. The approved amount represents lending capacity, not optimal borrowing. Smart loan sizing matches actual needs with comfortable repayment capacity rather than maximizing available credit.",
        isCorrect: false,
      },
     
      {
        id: "round",
        label: "Round up to convenient round numbers",
        reflection: "Rounding up creates unnecessary debt. The convenience of round numbers comes at the cost of extra interest payments and higher obligations. Precise calculation based on actual requirements provides better financial outcomes than arbitrary rounding.",
        isCorrect: false,
      },
       {
        id: "precise",
        label: "Calculate exact need and add small buffer only",
        reflection: "Perfect! Precise calculation with modest buffer ensures you borrow only what's genuinely required. This approach minimizes debt burden while providing slight flexibility for minor variations, optimizing the balance between adequacy and financial comfort.",
        isCorrect: true,
      },
      {
        id: "future",
        label: "Include funds for anticipated future expenses",
        reflection: "Anticipating future needs through current borrowing often backfires. Future expenses may not materialize as expected, leaving you with unnecessary debt. Better approach is addressing future needs when they actually occur rather than pre-funding uncertainties.",
        isCorrect: false,
      },
    ],
    reward: 10,
  },
  {
    id: 5,
    prompt: "What's the fundamental risk of over-borrowing?",
    options: [
      {
        id: "opportunity",
        label: "Missing investment opportunities due to conservative approach",
        reflection: "Over-borrowing doesn't create opportunities—it creates obligations. The fundamental risk is becoming over-leveraged with debt that constrains rather than enables financial growth, limiting rather than expanding future possibilities.",
        isCorrect: false,
      },
      {
        id: "disproportionate",
        label: "Disproportionate cost relative to actual benefit received",
        reflection: "Exactly! Over-borrowing creates the core problem of paying significantly more in interest and payments than the actual value received. The financial cost far exceeds any marginal benefit, making it a fundamentally inefficient and risky borrowing practice.",
        isCorrect: true,
      },
      {
        id: "approval",
        label: "Difficulty getting approval for genuinely needed loans later",
        reflection: "While this can be a consequence, it's not the fundamental risk. The primary issue is the immediate financial inefficiency—paying excessive costs for unused or unproductive borrowed funds—rather than future approval challenges.",
        isCorrect: false,
      },
      {
        id: "flexibility",
        label: "Reduced flexibility in choosing loan terms and conditions",
        reflection: "Term flexibility is secondary to the core problem. The fundamental risk is financial inefficiency—the mismatch between borrowing costs and actual benefits received—which creates ongoing strain regardless of specific loan terms or conditions.",
        isCorrect: false,
      },
    ],
    reward: 10,
  },
];

const totalStages = OVER_BORROWING_RISK_STAGES.length;
const successThreshold = totalStages;

const OverBorrowingRisk = () => {
  const location = useLocation();
  const gameId = "finance-adults-46";
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
      "How can you calculate the exact amount needed before borrowing?",
      "What buffer percentage is reasonable for unexpected variations?",
    ],
    []
  );

  const handleChoice = (option) => {
    if (selectedOption || showResult) return;

    resetFeedback();
    const currentStageData = OVER_BORROWING_RISK_STAGES[currentStage];
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
  const stage = OVER_BORROWING_RISK_STAGES[Math.min(currentStage, totalStages - 1)];
  const hasPassed = finalScore === successThreshold;

  return (
    <GameShell
      title="Over-Borrowing Risk"
      subtitle={subtitle}
      score={coins}
      coins={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      maxScore={OVER_BORROWING_RISK_STAGES.length}
      currentLevel={Math.min(currentStage + 1, OVER_BORROWING_RISK_STAGES.length)}
      totalLevels={OVER_BORROWING_RISK_STAGES.length}
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
            <span>Risk Assessment</span>
            <span>Loan Sizing</span>
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
                    Skill unlocked: <strong>Precise loan sizing judgment</strong>
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
              Skill unlocked: <strong>Precise loan sizing judgment</strong>
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

export default OverBorrowingRisk;