import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const FIXED_DEPOSIT_STAGES = [
  {
    id: 1,
    prompt: "Fixed deposits are best for:",
    options: [
      {
        id: "quick",
        label: "Quick wealth",
        reflection: "Fixed deposits are not designed for quick wealth generation. They offer steady, predictable returns over time rather than rapid growth.",
        isCorrect: false,
      },
      
      {
        id: "high-risk",
        label: "High-risk, high-reward investments",
        reflection: "Fixed deposits are low-risk instruments. For high-risk investments, other financial products like stocks or mutual funds would be more appropriate.",
        isCorrect: false,
      },
      {
        id: "liquidity",
        label: "Immediate access to funds",
        reflection: "Fixed deposits typically have lock-in periods. For immediate access, savings accounts or liquid funds would be better options.",
        isCorrect: false,
      },
      {
        id: "safe",
        label: "Safe and predictable savings",
        reflection: "Exactly! Fixed deposits are ideal for preserving capital with guaranteed returns, making them perfect for conservative investors seeking stability.",
        isCorrect: true,
      },
    ],
    reward: 15,
  },
  {
    id: 2,
    prompt: "What is the main advantage of fixed deposits?",
    options: [
      {
        id: "returns",
        label: "Highest possible returns",
        reflection: "Fixed deposits offer moderate returns. For highest returns, you would need to consider higher-risk investments like equities.",
        isCorrect: false,
      },
      {
        id: "capital",
        label: "Capital protection with guaranteed returns",
        reflection: "Exactly! Fixed deposits protect your principal amount and provide assured returns, making them a safe investment option.",
        isCorrect: true,
      },
      {
        id: "flexibility",
        label: "Complete flexibility in withdrawals",
        reflection: "Fixed deposits usually have penalties for early withdrawal. They are better suited for funds you don't need immediate access to.",
        isCorrect: false,
      },
      {
        id: "tax",
        label: "Tax-free income generation",
        reflection: "Fixed deposit interest is taxable. For tax-free options, consider instruments like PPF or ELSS mutual funds.",
        isCorrect: false,
      },
    ],
    reward: 15,
  },
  {
    id: 3,
    prompt: "When should you consider fixed deposits?",
    options: [
      {
        id: "emergency",
        label: "For emergency fund purposes",
        reflection: "Emergency funds should be kept in highly liquid instruments. Fixed deposits may have penalties for early withdrawal, making them unsuitable for emergencies.",
        isCorrect: false,
      },
      
      {
        id: "long-term",
        label: "For long-term wealth creation",
        reflection: "For long-term wealth creation, equity investments typically offer better returns due to the power of compounding over extended periods.",
        isCorrect: false,
      },
      {
        id: "short-term",
        label: "For short-term goals with capital safety",
        reflection: "Perfect! Fixed deposits are ideal for short to medium-term goals (1-5 years) where you want to preserve capital while earning steady returns.",
        isCorrect: true,
      },
      {
        id: "speculation",
        label: "For speculative trading",
        reflection: "Fixed deposits are not suitable for trading or speculation. They are designed for conservative, long-term holding.",
        isCorrect: false,
      },
    ],
    reward: 15,
  },
  {
    id: 4,
    prompt: "What happens if you withdraw a fixed deposit early?",
    options: [
      {
        id: "penalty",
        label: "You may face penalty or reduced interest",
        reflection: "Exactly! Most banks charge a penalty for premature withdrawal, which could be a percentage of the principal or reduced interest rate.",
        isCorrect: true,
      },
      {
        id: "nothing",
        label: "Nothing - you get full amount back",
        reflection: "Early withdrawal usually involves penalties or reduced interest rates. The exact terms depend on the bank's policy.",
        isCorrect: false,
      },
      
      {
        id: "bonus",
        label: "You get bonus interest for early withdrawal",
        reflection: "Banks don't offer bonus interest for early withdrawal. In fact, they discourage it through penalties to maintain their lending capacity.",
        isCorrect: false,
      },
      {
        id: "forbidden",
        label: "It's completely forbidden",
        reflection: "While discouraged, early withdrawal is usually allowed with penalties. Some banks may have stricter policies, but it's not universally forbidden.",
        isCorrect: false,
      },
    ],
    reward: 15,
  },
  {
    id: 5,
    prompt: "How do fixed deposits compare to savings accounts?",
    options: [
      {
        id: "lower",
        label: "Lower interest rates than savings accounts",
        reflection: "Fixed deposits typically offer higher interest rates than regular savings accounts, making them attractive for parking idle funds.",
        isCorrect: false,
      },
      
      {
        id: "same",
        label: "Same interest rates as savings accounts",
        reflection: "Fixed deposits generally offer higher interest rates to compensate for the lock-in period and commitment from the investor.",
        isCorrect: false,
      },
      {
        id: "unrelated",
        label: "They are completely unrelated products",
        reflection: "Both are banking products, but they serve different purposes. Fixed deposits are for earning higher returns with commitment, while savings accounts offer liquidity.",
        isCorrect: false,
      },
      {
        id: "higher",
        label: "Higher interest rates with locked-in funds",
        reflection: "Exactly! Fixed deposits offer better returns than savings accounts, but your money is locked in for a specified period.",
        isCorrect: true,
      },
    ],
    reward: 15,
  },
];

const totalStages = FIXED_DEPOSIT_STAGES.length;
const successThreshold = totalStages;

const FixedDepositAwareness = () => {
  const location = useLocation();
  const gameId = "finance-young-adult-64";
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
      "How can you balance safety and growth in your investment portfolio?",
      "When would fixed deposits be the right choice for your financial goals?",
    ],
    []
  );

  const handleChoice = (option) => {
    if (selectedOption || showResult) return;

    resetFeedback();
    const currentStageData = FIXED_DEPOSIT_STAGES[currentStage];
    const updatedHistory = [
      ...history,
      { stageId: currentStageData.id, isCorrect: option.isCorrect },
    ];
    setHistory(updatedHistory);
    setSelectedOption(option.id);
    setSelectedReflection(option.reflection);
    setShowFeedback(true);
    setCanProceed(false);
    
    if (option.isCorrect) {
      setCoins(prevCoins => prevCoins + 1);
    }
    
    setTimeout(() => {
      setCanProceed(true);
    }, 1500);
    
    if (currentStage === totalStages - 1) {
      setTimeout(() => {
        const correctCount = updatedHistory.filter((item) => item.isCorrect).length;
        const passed = correctCount === successThreshold;
        setFinalScore(correctCount);
        setCoins(passed ? totalCoins : 0);
        setShowResult(true);
      }, 5500);
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
  const stage = FIXED_DEPOSIT_STAGES[Math.min(currentStage, totalStages - 1)];
  const hasPassed = finalScore === successThreshold;

  return (
    <GameShell
      title="Fixed Deposit Awareness"
      subtitle={subtitle}
      score={showResult ? finalScore : coins}
      coins={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      maxScore={FIXED_DEPOSIT_STAGES.length}
      currentLevel={Math.min(currentStage + 1, FIXED_DEPOSIT_STAGES.length)}
      totalLevels={FIXED_DEPOSIT_STAGES.length}
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
            <span>Fixed Deposit Basics</span>
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
                    Skill unlocked: <strong>Fixed deposit strategy</strong>
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
              Skill unlocked: <strong>Fixed deposit strategy</strong>
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

export default FixedDepositAwareness;