import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const STATEMENT_CHECKING_STAGES = [
  {
    id: 1,
    prompt: "Why should you check statements?",
    options: [
      {
        id: "curiosity",
        label: "For curiosity",
        reflection: "While curiosity can motivate checking, the primary purpose is practical financial management and error detection rather than casual browsing.",
        isCorrect: false,
      },
      
      {
        id: "routine",
        label: "Because it's a monthly routine",
        reflection: "Routine checking is valuable but the underlying purpose is active financial monitoring rather than simply fulfilling a habitual obligation.",
        isCorrect: false,
      },
      {
        id: "tracking",
        label: "To track spending and detect errors",
        reflection: "Exactly! Regular statement review helps monitor financial habits, catch unauthorized transactions, and identify billing mistakes early.",
        isCorrect: true,
      },
      {
        id: "requirement",
        label: "To meet bank requirements",
        reflection: "Banks provide statements for customer benefit rather than imposing requirements - the value comes from your active review and analysis.",
        isCorrect: false,
      },
    ],
    reward: 10,
  },
  {
    id: 2,
    prompt: "What's the main benefit of regular statement checking?",
    options: [
      
      {
        id: "balance",
        label: "Knowing current account balance",
        reflection: "While balance awareness helps, the deeper value is understanding spending patterns and catching irregularities that affect your finances.",
        isCorrect: false,
      },
      {
        id: "awareness",
        label: "Increased spending awareness",
        reflection: "Perfect! Seeing actual transaction patterns reveals unconscious spending habits and helps identify areas for financial improvement.",
        isCorrect: true,
      },
      {
        id: "rewards",
        label: "Earning bank rewards points",
        reflection: "Statement checking doesn't directly generate rewards - the benefit comes from identifying optimization opportunities and preventing losses.",
        isCorrect: false,
      },
      {
        id: "history",
        label: "Having transaction history records",
        reflection: "Record keeping is automatic, but the real value lies in actively reviewing patterns and discrepancies rather than passive documentation.",
        isCorrect: false,
      },
    ],
    reward: 10,
  },
  {
    id: 3,
    prompt: "How often should you review bank statements?",
    options: [
      {
        id: "monthly",
        label: "Monthly when they arrive",
        reflection: "Exactly! Monthly review aligns with statement cycles and provides regular checkpoints for financial monitoring and pattern recognition.",
        isCorrect: true,
      },
      {
        id: "weekly",
        label: "Weekly for better control",
        reflection: "Weekly reviews can work but may be excessive for most people - monthly aligns with billing cycles and provides sufficient oversight.",
        isCorrect: false,
      },
      {
        id: "quarterly",
        label: "Quarterly to save time",
        reflection: "Quarterly intervals are too infrequent and may miss timely opportunities to address errors or unauthorized transactions effectively.",
        isCorrect: false,
      },
      {
        id: "annually",
        label: "Annually during tax season",
        reflection: "Annual review misses too many opportunities for course correction and fraud detection - regular monitoring is essential for financial health.",
        isCorrect: false,
      },
    ],
    reward: 10,
  },
  {
    id: 4,
    prompt: "What should you look for when checking statements?",
    options: [
     
      {
        id: "large",
        label: "Focus only on large amounts",
        reflection: "Large transaction focus misses small recurring charges and micro-fraud that can accumulate significantly over time.",
        isCorrect: false,
      },
      {
        id: "recent",
        label: "Check only recent transactions",
        reflection: "Recent-only review may miss patterns and recurring issues that become apparent when examining complete transaction history.",
        isCorrect: false,
      },
      {
        id: "balance",
        label: "Verify ending balance only",
        reflection: "Balance verification alone won't reveal unauthorized transactions or categorization errors that affect your financial understanding.",
        isCorrect: false,
      },
       {
        id: "everything",
        label: "Review every single transaction",
        reflection: "Perfect! Comprehensive review catches both obvious errors and subtle irregularities that might otherwise go unnoticed in cursory examination.",
        isCorrect: true,
      },
    ],
    reward: 10,
  },
  {
    id: 5,
    prompt: "What's the consequence of ignoring statement errors?",
    options: [
      {
        id: "minor",
        label: "Small errors aren't worth the effort",
        reflection: "Actually, small errors often indicate larger systematic issues and compound over time - early detection prevents bigger financial problems.",
        isCorrect: false,
      },
      
      {
        id: "forgotten",
        label: "Banks will fix them automatically",
        reflection: "Banks require customer reporting to address errors - relying on automatic correction leaves you vulnerable to ongoing financial damage.",
        isCorrect: false,
      },
      {
        id: "escalation",
        label: "Errors can grow and multiply",
        reflection: "Exactly! Unaddressed errors compound through interest, fees, and expanded unauthorized activity - prompt attention prevents escalation.",
        isCorrect: true,
      },
      {
        id: "learning",
        label: "Errors provide learning opportunities",
        reflection: "While learning can occur, the primary impact is financial loss - the cost of errors typically outweighs any educational benefit gained.",
        isCorrect: false,
      },
    ],
    reward: 10,
  },
];

const totalStages = STATEMENT_CHECKING_STAGES.length;
const successThreshold = totalStages;

const CheckingBankStatements = () => {
  const location = useLocation();
  const gameId = "finance-young-adult-46";
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
      "How can regular statement checking actually increase your financial confidence and control rather than create anxiety?",
      "What systematic approach makes statement review efficient while maximizing the insights you gain about your spending patterns?",
    ],
    []
  );

  const handleChoice = (option) => {
    if (selectedOption || showResult) return;

    resetFeedback();
    const currentStageData = STATEMENT_CHECKING_STAGES[currentStage];
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
  const stage = STATEMENT_CHECKING_STAGES[Math.min(currentStage, totalStages - 1)];
  const hasPassed = finalScore === successThreshold;

  return (
    <GameShell
      title="Checking Bank Statements"
      subtitle={subtitle}
      score={coins}
      coins={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      maxScore={STATEMENT_CHECKING_STAGES.length}
      currentLevel={Math.min(currentStage + 1, STATEMENT_CHECKING_STAGES.length)}
      totalLevels={STATEMENT_CHECKING_STAGES.length}
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
            <span>Financial Monitoring</span>
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
                        { stageId: STATEMENT_CHECKING_STAGES[currentStage].id, isCorrect: STATEMENT_CHECKING_STAGES[currentStage].options.find(opt => opt.id === selectedOption)?.isCorrect },
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
                    Skill unlocked: <strong>Statement analysis mastery</strong>
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
              Skill unlocked: <strong>Statement analysis mastery</strong>
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

export default CheckingBankStatements;