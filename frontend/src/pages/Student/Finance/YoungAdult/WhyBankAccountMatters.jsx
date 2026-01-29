import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const BANK_ACCOUNT_STAGES = [
  {
    id: 1,
    prompt: "Why is having a bank account important?",
    options: [
      {
        id: "salary",
        label: "Only for salary deposits",
        reflection: "While salary deposit is one function, bank accounts provide much broader financial benefits and security features.",
        isCorrect: false,
      },
      {
        id: "foundation",
        label: "For safety, records, and access to services",
        reflection: "Exactly! Bank accounts provide security, transaction history, and gateway to essential financial services and opportunities.",
        isCorrect: true,
      },
      {
        id: "status",
        label: "Shows financial status to others",
        reflection: "While bank accounts can indicate financial engagement, their primary value lies in practical benefits rather than social signaling.",
        isCorrect: false,
      },
      {
        id: "convenience",
        label: "Just for ATM withdrawals",
        reflection: "ATM access is one feature, but bank accounts offer comprehensive financial management tools beyond simple cash access.",
        isCorrect: false,
      },
    ],
    reward: 10,
  },
  {
    id: 2,
    prompt: "What's the main security benefit of bank accounts?",
    options: [
      {
        id: "insurance",
        label: "Government deposit insurance",
        reflection: "Perfect! FDIC/NCUA insurance protects deposits up to $250,000, providing security that cash or informal storage cannot match.",
        isCorrect: true,
      },
      {
        id: "password",
        label: "Password protection online",
        reflection: "While passwords help, the fundamental security comes from institutional protection and regulatory oversight of deposits.",
        isCorrect: false,
      },
      {
        id: "location",
        label: "Physical bank location security",
        reflection: "Branch security is relevant but secondary to the systemic protections and insurance that safeguard deposited funds.",
        isCorrect: false,
      },
      {
        id: "cards",
        label: "Secure debit card transactions",
        reflection: "Card security is valuable but represents just one aspect of the comprehensive protection offered by insured banking institutions.",
        isCorrect: false,
      },
    ],
    reward: 10,
  },
  {
    id: 3,
    prompt: "How do bank accounts facilitate financial growth?",
    options: [
      {
        id: "spending",
        label: "Enable easier spending",
        reflection: "While convenient spending is possible, bank accounts more importantly enable saving, investing, and building financial security.",
        isCorrect: false,
      },
      
      {
        id: "fees",
        label: "Charge fees for premium features",
        reflection: "Fees are costs rather than growth facilitators - the real value lies in accessing services that build financial capability and wealth.",
        isCorrect: false,
      },
      {
        id: "marketing",
        label: "Receive targeted financial offers",
        reflection: "Marketing offers may provide some value but don't represent the core growth potential of established banking relationships.",
        isCorrect: false,
      },
      {
        id: "services",
        label: "Provide access to financial services",
        reflection: "Exactly! Bank accounts unlock credit building, investment opportunities, and advanced financial products that drive long-term growth.",
        isCorrect: true,
      },
    ],
    reward: 10,
  },
  {
    id: 4,
    prompt: "What record-keeping advantage do banks provide?",
    options: [
     
      {
        id: "apps",
        label: "Mobile banking apps",
        reflection: "Apps provide access but the fundamental value is in the comprehensive, auditable transaction history they display.",
        isCorrect: false,
      },
      {
        id: "alerts",
        label: "Fraud alert notifications",
        reflection: "Alerts are protective but the core record-keeping value lies in maintaining complete, organized financial transaction history.",
        isCorrect: false,
      },
       {
        id: "statements",
        label: "Automatic transaction statements",
        reflection: "Perfect! Detailed, organized records help track spending, prepare taxes, and maintain financial awareness automatically.",
        isCorrect: true,
      },
      {
        id: "branches",
        label: "Physical branch locations",
        reflection: "Branch access provides service options but doesn't directly contribute to the systematic record-keeping benefits of banking.",
        isCorrect: false,
      },
    ],
    reward: 10,
  },
  {
    id: 5,
    prompt: "How do bank accounts impact financial inclusion?",
    options: [
      {
        id: "exclusion",
        label: "Create barriers for some people",
        reflection: "While access challenges exist, bank accounts generally expand rather than restrict financial participation and opportunities.",
        isCorrect: false,
      },
      {
        id: "inclusion",
        label: "Open doors to economic participation",
        reflection: "Exactly! Bank accounts enable payroll participation, credit building, and access to the formal economy essential for financial stability.",
        isCorrect: true,
      },
      {
        id: "complexity",
        label: "Make finances more complicated",
        reflection: "Banking adds structure rather than complexity - it provides frameworks that simplify rather than complicate financial management.",
        isCorrect: false,
      },
      {
        id: "cost",
        label: "Require expensive minimum balances",
        reflection: "While some accounts have requirements, many low-cost or no-minimum options exist, and the benefits typically outweigh costs.",
        isCorrect: false,
      },
    ],
    reward: 10,
  },
];

const totalStages = BANK_ACCOUNT_STAGES.length;
const successThreshold = totalStages;

const WhyBankAccountMatters = () => {
  const location = useLocation();
  const gameId = "finance-young-adult-41";
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
      "How can bank accounts actually increase your financial freedom and opportunities rather than just adding complexity?",
      "What specific banking features align best with your current financial goals and lifestyle needs?",
    ],
    []
  );

  const handleChoice = (option) => {
    if (selectedOption || showResult) return;

    resetFeedback();
    const currentStageData = BANK_ACCOUNT_STAGES[currentStage];
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
  const stage = BANK_ACCOUNT_STAGES[Math.min(currentStage, totalStages - 1)];
  const hasPassed = finalScore === successThreshold;

  return (
    <GameShell
      title="Why a Bank Account Matters"
      subtitle={subtitle}
      score={coins}
      coins={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      maxScore={BANK_ACCOUNT_STAGES.length}
      currentLevel={Math.min(currentStage + 1, BANK_ACCOUNT_STAGES.length)}
      totalLevels={BANK_ACCOUNT_STAGES.length}
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
            <span>Banking Fundamentals</span>
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
                        { stageId: BANK_ACCOUNT_STAGES[currentStage].id, isCorrect: BANK_ACCOUNT_STAGES[currentStage].options.find(opt => opt.id === selectedOption)?.isCorrect },
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
                    Skill unlocked: <strong>Banking fundamentals mastery</strong>
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
              Skill unlocked: <strong>Banking fundamentals mastery</strong>
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

export default WhyBankAccountMatters;