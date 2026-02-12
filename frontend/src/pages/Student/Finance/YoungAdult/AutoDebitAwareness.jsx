import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const AUTO_DEBIT_STAGES = [
  {
    id: 1,
    prompt: "Auto-debits are useful when:",
    options: [
      {
        id: "forget",
        label: "You forget they exist",
        reflection: "Forgetting about auto-debits creates financial blind spots and potential overspending - awareness and active management are essential for responsible usage.",
        isCorrect: false,
      },
      {
        id: "control",
        label: "You monitor and control them",
        reflection: "Exactly! Auto-debits work best when you actively track subscriptions, review charges, and maintain clear oversight of automated financial commitments.",
        isCorrect: true,
      },
      {
        id: "convenience",
        label: "Maximum convenience is needed",
        reflection: "While convenience is a benefit, unchecked automation without monitoring can lead to unnoticed charges and budget disruptions.",
        isCorrect: false,
      },
      {
        id: "avoid",
        label: "You want to avoid manual payments",
        reflection: "Automation should supplement rather than replace financial awareness - the goal is efficient management, not avoidance of responsibility.",
        isCorrect: false,
      },
    ],
    reward: 10,
  },
  {
    id: 2,
    prompt: "What's the main risk of unmonitored auto-debits?",
    options: [
      {
        id: "late",
        label: "Late payment penalties",
        reflection: "Auto-debits typically prevent late payments rather than cause them - the real risk lies in forgotten or unnecessary recurring charges.",
        isCorrect: false,
      },
     
      {
        id: "security",
        label: "Increased security vulnerabilities",
        reflection: "Security risks relate more to authorization methods than monitoring frequency - the primary issue is financial oversight rather than data protection.",
        isCorrect: false,
      },
      {
        id: "complexity",
        label: "Too many payment methods",
        reflection: "Multiple payment methods create complexity but the core risk is financial unawareness rather than the sheer number of transaction channels.",
        isCorrect: false,
      },
       {
        id: "oversight",
        label: "Forgotten recurring charges",
        reflection: "Perfect! Unmonitored subscriptions accumulate unnoticed, creating budget strain and financial commitments you may no longer want or need.",
        isCorrect: true,
      },
    ],
    reward: 10,
  },
  {
    id: 3,
    prompt: "How should you manage auto-debit subscriptions?",
    options: [
      {
        id: "annual",
        label: "Review once per year",
        reflection: "Annual reviews are insufficient - monthly monitoring prevents accumulation of unwanted charges and maintains current budget alignment.",
        isCorrect: false,
      },
      
      {
        id: "automatic",
        label: "Let them run automatically",
        reflection: "Complete automation without oversight leads to financial leakage - active management ensures subscriptions remain valuable and affordable.",
        isCorrect: false,
      },
      {
        id: "monthly",
        label: "Monthly review and adjustment",
        reflection: "Exactly! Regular monthly checks align with billing cycles and enable timely cancellation of services you no longer use or need.",
        isCorrect: true,
      },
      {
        id: "cancel",
        label: "Cancel all subscriptions",
        reflection: "Blanket cancellation isn't optimal - strategic retention of valuable services with proper monitoring provides both convenience and control.",
        isCorrect: false,
      },
    ],
    reward: 10,
  },
  {
    id: 4,
    prompt: "What's the relationship between auto-debits and budgeting?",
    options: [
      {
        id: "independent",
        label: "They operate independently",
        reflection: "Auto-debits directly impact your available funds and must be integrated into budget planning rather than treated as separate financial activities.",
        isCorrect: false,
      },
      {
        id: "integrated",
        label: "They should be budget-integrated",
        reflection: "Exactly! Auto-debits represent committed expenses that must be planned for in your budget to maintain overall financial stability and awareness.",
        isCorrect: true,
      },
      {
        id: "disruptive",
        label: "They disrupt budget planning",
        reflection: "Well-managed auto-debits actually support budgeting by creating predictable, automated expense patterns rather than causing disruption.",
        isCorrect: false,
      },
      {
        id: "unnecessary",
        label: "They're unnecessary for budgets",
        reflection: "Recurring automatic payments are common financial realities that effective budgeting must account for rather than ignore or treat as exceptions.",
        isCorrect: false,
      },
    ],
    reward: 10,
  },
  {
    id: 5,
    prompt: "When should you cancel an auto-debit?",
    options: [
      {
        id: "unused",
        label: "When you haven't used the service",
        reflection: "Perfect! Services you don't use represent wasted money - regular evaluation identifies and eliminates these unnecessary recurring financial commitments.",
        isCorrect: true,
      },
      {
        id: "expensive",
        label: "When the price increases",
        reflection: "Price increases warrant review but may not require immediate cancellation - evaluate value proposition and available alternatives before deciding.",
        isCorrect: false,
      },
      {
        id: "convenient",
        label: "When manual payment is easier",
        reflection: "Payment method preference shouldn't drive cancellation decisions - focus on whether the service provides ongoing value relative to cost.",
        isCorrect: false,
      },
      {
        id: "temporary",
        label: "After temporary usage period",
        reflection: "Temporary usage suggests review timing but doesn't automatically justify cancellation - assess continued value and budget impact instead.",
        isCorrect: false,
      },
    ],
    reward: 10,
  },
];

const totalStages = AUTO_DEBIT_STAGES.length;
const successThreshold = totalStages;

const AutoDebitAwareness = () => {
  const location = useLocation();
  const gameId = "finance-young-adult-48";
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
      "How can systematic auto-debit monitoring actually increase your financial flexibility rather than create administrative burden?",
      "What review system helps you maintain subscription value while preventing unwanted recurring charges from accumulating unnoticed?",
    ],
    []
  );

  const handleChoice = (option) => {
    if (selectedOption || showResult) return;

    resetFeedback();
    const currentStageData = AUTO_DEBIT_STAGES[currentStage];
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
  const stage = AUTO_DEBIT_STAGES[Math.min(currentStage, totalStages - 1)];
  const hasPassed = finalScore === successThreshold;

  return (
    <GameShell
      title="Auto-Debit Awareness"
      subtitle={subtitle}
      score={coins}
      coins={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      maxScore={AUTO_DEBIT_STAGES.length}
      currentLevel={Math.min(currentStage + 1, AUTO_DEBIT_STAGES.length)}
      totalLevels={AUTO_DEBIT_STAGES.length}
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
            <span>Subscription Management</span>
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
                    Skill unlocked: <strong>Subscription management mastery</strong>
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
              Skill unlocked: <strong>Subscription management mastery</strong>
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

export default AutoDebitAwareness;