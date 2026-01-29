import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const MULTIPLE_ACCOUNTS_STAGES = [
  {
    id: 1,
    prompt: "Is opening many bank accounts helpful?",
    options: [
      {
        id: "always",
        label: "Yes, always",
        reflection: "Multiple accounts often create complexity without proportional benefits - management overhead typically outweighs any advantages.",
        isCorrect: false,
      },
      {
        id: "confusion",
        label: "No, it can create confusion",
        reflection: "Exactly! Multiple accounts and make it harder to maintain clear oversight of your total financial position.",
        isCorrect: true,
      },
      {
        id: "benefits",
        label: "Yes, for earning interest",
        reflection: "While interest earning is possible, the administrative burden and potential fees often negate benefits from spreading money across many accounts.",
        isCorrect: false,
      },
      {
        id: "flexibility",
        label: "Yes, for payment flexibility",
        reflection: "Single well-managed accounts with good features typically provide sufficient flexibility without the complications of multiple account management.",
        isCorrect: false,
      },
    ],
    reward: 10,
  },
  {
    id: 2,
    prompt: "What's the main downside of multiple bank accounts?",
    options: [
      {
        id: "fees",
        label: "Monthly maintenance fees",
        reflection: "Fees are a concern but the fundamental issue is the cognitive load and tracking complexity that undermines financial awareness.",
        isCorrect: false,
      },
      
      {
        id: "benefits",
        label: "Missing out on account benefits",
        reflection: "Benefit optimization is possible but secondary to the primary challenge of maintaining clear financial oversight across multiple accounts.",
        isCorrect: false,
      },
      {
        id: "security",
        label: "Increased security risks",
        reflection: "Security concerns exist but aren't the primary issue - rather than safety.",
        isCorrect: false,
      },
      {
        id: "tracking",
        label: "Difficulty tracking total balance",
        reflection: "Perfect! Multiple accounts make it challenging to maintain clear picture of overall financial position and spending patterns.",
        isCorrect: true,
      },
    ],
    reward: 10,
  },
  {
    id: 3,
    prompt: "How should you organize bank accounts effectively?",
    options: [
      {
        id: "many",
        label: "Separate account for every purpose",
        reflection: "Over-separation creates management complexity that often leads to neglected accounts and poor overall financial oversight.",
        isCorrect: false,
      },
      {
        id: "focused",
        label: "Few accounts with clear purposes",
        reflection: "Exactly! Limited accounts with specific, well-defined roles enable better tracking and more effective financial management.",
        isCorrect: true,
      },
      {
        id: "maximize",
        label: "Maximize number of free accounts",
        reflection: "Free accounts sound appealing but the administrative burden typically outweighs any benefits from promotional offers.",
        isCorrect: false,
      },
      {
        id: "random",
        label: "Open accounts based on promotions",
        reflection: "Promotion-driven account opening creates scattered financial footprint that's difficult to manage and monitor effectively.",
        isCorrect: false,
      },
    ],
    reward: 10,
  },
  {
    id: 4,
    prompt: "What's the relationship between account count and financial control?",
    options: [
      {
        id: "fewer",
        label: "Fewer accounts improve oversight",
        reflection: "Exactly! Consolidated accounts enable clearer picture of financial position and more effective management of resources.",
        isCorrect: true,
      },
      {
        id: "more",
        label: "More accounts equal more control",
        reflection: "Actually, more accounts typically reduce control by分散注意力 and making it harder to maintain comprehensive financial awareness.",
        isCorrect: false,
      },
      
      {
        id: "neutral",
        label: "Account count doesn't matter",
        reflection: "Account quantity significantly impacts management ease - fewer accounts generally enable better control and financial discipline.",
        isCorrect: false,
      },
      {
        id: "complex",
        label: "Complexity enhances financial skills",
        reflection: "While complexity might build some skills, it more commonly creates stress and reduces rather than improves financial effectiveness.",
        isCorrect: false,
      },
    ],
    reward: 10,
  },
  {
    id: 5,
    prompt: "When might multiple accounts make sense?",
    options: [
      {
        id: "strategic",
        label: "Specific strategic purposes only",
        reflection: "Exactly! Limited multiple accounts can work when each serves distinct, well-defined financial goals with clear management protocols.",
        isCorrect: true,
      },
      {
        id: "never",
        label: "Never - always consolidate",
        reflection: "Complete consolidation isn't always optimal - specific circumstances can justify strategic multiple account usage.",
        isCorrect: false,
      },
      
      {
        id: "convenience",
        label: "For payment convenience",
        reflection: "Single accounts with good features typically provide adequate convenience without the complications of managing multiple account relationships.",
        isCorrect: false,
      },
      {
        id: "rewards",
        label: "To maximize reward programs",
        reflection: "Reward optimization is possible but requires careful management - the benefits rarely justify the complexity for most people's needs.",
        isCorrect: false,
      },
    ],
    reward: 10,
  },
];

const totalStages = MULTIPLE_ACCOUNTS_STAGES.length;
const successThreshold = totalStages;

const MultipleBankAccounts = () => {
  const location = useLocation();
  const gameId = "finance-young-adult-44";
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
      "How can consolidated banking actually increase your financial effectiveness rather than limit your options?",
      "What account structure provides the right balance between functionality and manageability for your specific needs?",
    ],
    []
  );

  const handleChoice = (option) => {
    if (selectedOption || showResult) return;

    resetFeedback();
    const currentStageData = MULTIPLE_ACCOUNTS_STAGES[currentStage];
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
      }, 2500);
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
  const stage = MULTIPLE_ACCOUNTS_STAGES[Math.min(currentStage, totalStages - 1)];
  const hasPassed = finalScore === successThreshold;

  return (
    <GameShell
      title="Multiple Bank Accounts"
      subtitle={subtitle}
      score={coins}
      coins={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      maxScore={MULTIPLE_ACCOUNTS_STAGES.length}
      currentLevel={Math.min(currentStage + 1, MULTIPLE_ACCOUNTS_STAGES.length)}
      totalLevels={MULTIPLE_ACCOUNTS_STAGES.length}
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
            <span>Account Management</span>
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
                  <button
                    onClick={() => {
                      const updatedHistory = [
                        ...history,
                        { stageId: MULTIPLE_ACCOUNTS_STAGES[currentStage].id, isCorrect: MULTIPLE_ACCOUNTS_STAGES[currentStage].options.find(opt => opt.id === selectedOption)?.isCorrect },
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
                    Skill unlocked: <strong>Account consolidation strategy</strong>
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
              Skill unlocked: <strong>Account consolidation strategy</strong>
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

export default MultipleBankAccounts;