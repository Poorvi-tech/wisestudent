import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const DIGITAL_RECORD_STAGES = [
  {
    id: 1,
    prompt: "Why are digital records helpful?",
    options: [
      {
        id: "disappear",
        label: "They disappear",
        reflection: "Digital records actually provide permanent, searchable documentation rather than disappearing - their persistence is a key advantage for financial management.",
        isCorrect: false,
      },
      {
        id: "budgeting",
        label: "They help budgeting and future credit access",
        reflection: "Exactly! Digital records enable detailed spending analysis for budgeting and provide documented payment history that lenders use to assess creditworthiness.",
        isCorrect: true,
      },
      {
        id: "convenience",
        label: "They're more convenient to access",
        reflection: "While convenience is valuable, the fundamental benefit lies in analytical capabilities and credit-building potential rather than mere accessibility.",
        isCorrect: false,
      },
      {
        id: "backup",
        label: "They serve as backup copies",
        reflection: "Backup functionality is useful but secondary to the primary value of enabling financial analysis and establishing credit history through documented transactions.",
        isCorrect: false,
      },
    ],
    reward: 10,
  },
  {
    id: 2,
    prompt: "What's the main advantage of digital transaction records?",
    options: [
      {
        id: "instant",
        label: "Instant access to information",
        reflection: "Immediate access is helpful but the deeper value lies in the analytical insights and pattern recognition that digital records enable over time.",
        isCorrect: false,
      },
      
      {
        id: "storage",
        label: "Reduced physical storage needs",
        reflection: "Storage efficiency benefits users but doesn't capture the primary financial value of having comprehensive, searchable transaction documentation.",
        isCorrect: false,
      },
      {
        id: "sharing",
        label: "Easy sharing with advisors",
        reflection: "Sharing capability supports financial planning but the fundamental advantage is personal insight generation through systematic record analysis.",
        isCorrect: false,
      },
      {
        id: "analysis",
        label: "Enabling spending pattern analysis",
        reflection: "Perfect! Digital records allow detailed examination of spending habits, seasonal trends, and category breakdowns that inform better financial decisions.",
        isCorrect: true,
      },
    ],
    reward: 10,
  },
  {
    id: 3,
    prompt: "How do digital records impact credit applications?",
    options: [
       {
        id: "history",
        label: "Demonstrating payment history",
        reflection: "Exactly! Lenders rely on documented transaction records to verify income consistency, payment behavior, and overall financial responsibility.",
        isCorrect: true,
      },
      {
        id: "speed",
        label: "Faster application processing",
        reflection: "Processing speed improves but the core impact is in providing comprehensive payment history that demonstrates financial reliability to lenders.",
        isCorrect: false,
      },
     
      {
        id: "automation",
        label: "Automated credit scoring",
        reflection: "While some automation occurs, human underwriters still review detailed records - the value is in providing evidence rather than triggering algorithms.",
        isCorrect: false,
      },
      {
        id: "comparison",
        label: "Comparing with industry standards",
        reflection: "Benchmarking helps context but lenders primarily need individual transaction evidence to assess personal creditworthiness accurately.",
        isCorrect: false,
      },
    ],
    reward: 10,
  },
  {
    id: 4,
    prompt: "What should you do with your digital financial records?",
    options: [
      {
        id: "ignore",
        label: "Store and forget about them",
        reflection: "Simply storing records without review misses opportunities for financial insight - active analysis transforms data into actionable budgeting intelligence.",
        isCorrect: false,
      },
      
      {
        id: "print",
        label: "Print everything for physical files",
        reflection: "Physical printing defeats digital advantages - the power lies in electronic searchability, categorization, and trend analysis capabilities.",
        isCorrect: false,
      },
      {
        id: "analyze",
        label: "Regularly review and analyze",
        reflection: "Exactly! Systematic review of digital records reveals spending patterns, identifies optimization opportunities, and tracks progress toward financial goals.",
        isCorrect: true,
      },
      {
        id: "share",
        label: "Share with all your contacts",
        reflection: "Selective sharing with trusted advisors makes sense, but indiscriminate distribution compromises privacy without necessarily improving financial management.",
        isCorrect: false,
      },
    ],
    reward: 10,
  },
  {
    id: 5,
    prompt: "What's the relationship between record keeping and financial growth?",
    options: [
      {
        id: "administrative",
        label: "Purely administrative task",
        reflection: "Record keeping is strategic rather than merely administrative - it enables informed decision-making that drives actual financial improvement and opportunity access.",
        isCorrect: false,
      },
      {
        id: "strategic",
        label: "Foundation for informed decisions",
        reflection: "Exactly! Comprehensive records provide the data needed for strategic financial planning, opportunity identification, and credit-building activities.",
        isCorrect: true,
      },
      {
        id: "burdensome",
        label: "Creates unnecessary complexity",
        reflection: "Good record systems reduce rather than increase complexity by providing clarity and enabling confident financial management rather than guesswork.",
        isCorrect: false,
      },
      {
        id: "optional",
        label: "Only needed for businesses",
        reflection: "Personal financial management benefits significantly from good record keeping - it's essential for optimizing individual financial health and future opportunities.",
        isCorrect: false,
      },
    ],
    reward: 10,
  },
];

const totalStages = DIGITAL_RECORD_STAGES.length;
const successThreshold = totalStages;

const DigitalRecordAdvantage = () => {
  const location = useLocation();
  const gameId = "finance-young-adult-49";
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
      "How can systematic digital record analysis actually increase your financial opportunities rather than just create administrative work?",
      "What review system maximizes the value of your digital records while supporting your specific financial goals and credit-building timeline?",
    ],
    []
  );

  const handleChoice = (option) => {
    if (selectedOption || showResult) return;

    resetFeedback();
    const currentStageData = DIGITAL_RECORD_STAGES[currentStage];
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
  const stage = DIGITAL_RECORD_STAGES[Math.min(currentStage, totalStages - 1)];
  const hasPassed = finalScore === successThreshold;

  return (
    <GameShell
      title="Digital Record Advantage"
      subtitle={subtitle}
      score={showResult ? finalScore : coins}
      coins={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      maxScore={DIGITAL_RECORD_STAGES.length}
      currentLevel={Math.min(currentStage + 1, DIGITAL_RECORD_STAGES.length)}
      totalLevels={DIGITAL_RECORD_STAGES.length}
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
            <span>Financial Documentation</span>
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
                    Skill unlocked: <strong>Digital record utilization mastery</strong>
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
              Skill unlocked: <strong>Digital record utilization mastery</strong>
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

export default DigitalRecordAdvantage;