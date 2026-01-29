import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const WALLET_BANK_STAGES = [
  {
    id: 1,
    prompt: "Which is safer for storing money?",
    options: [
      {
        id: "wallet",
        label: "Digital wallet",
        reflection: "Digital wallets are convenient for transactions but lack the comprehensive security and regulatory protections that bank accounts provide for money storage.",
        isCorrect: false,
      },
      {
        id: "bank",
        label: "Bank account",
        reflection: "Exactly! Bank accounts offer government insurance, regulatory oversight, and institutional security that make them much safer for storing significant amounts of money.",
        isCorrect: true,
      },
      {
        id: "both",
        label: "Both are equally safe",
        reflection: "While both have security features, bank accounts provide superior protection through deposit insurance and regulatory frameworks that digital wallets cannot match.",
        isCorrect: false,
      },
      {
        id: "neither",
        label: "Neither is particularly safe",
        reflection: "This overlooks the substantial protections available - bank accounts specifically offer robust security through institutional safeguards and government backing.",
        isCorrect: false,
      },
    ],
    reward: 10,
  },
  {
    id: 2,
    prompt: "What's the main difference in protection levels?",
    options: [
      {
        id: "insurance",
        label: "Banks offer deposit insurance",
        reflection: "Perfect! FDIC/NCUA insurance protects bank deposits up to $250,000, providing security that digital wallet balances typically don't have.",
        isCorrect: true,
      },
      {
        id: "convenience",
        label: "Wallets are more convenient to access",
        reflection: "Convenience differs but doesn't address protection levels - the key distinction is in regulatory oversight and insurance coverage.",
        isCorrect: false,
      },
      
      {
        id: "technology",
        label: "Wallets use newer technology",
        reflection: "Technology age isn't the protection factor - regulatory frameworks and institutional backing determine actual security levels for stored funds.",
        isCorrect: false,
      },
      {
        id: "fees",
        label: "Banks charge higher fees",
        reflection: "Fee structures vary but don't determine protection levels - the fundamental difference lies in regulatory safeguards and insurance coverage.",
        isCorrect: false,
      },
    ],
    reward: 10,
  },
  {
    id: 3,
    prompt: "When should you use digital wallets?",
    options: [
      {
        id: "storage",
        label: "For long-term money storage",
        reflection: "Long-term storage belongs in bank accounts where funds are protected by insurance and earn interest rather than sitting idle in transactional wallets.",
        isCorrect: false,
      },
     
      {
        id: "investing",
        label: "For investment portfolio management",
        reflection: "Investments belong in dedicated brokerage or investment accounts rather than either wallets or basic bank accounts designed for transactional purposes.",
        isCorrect: false,
      },
      {
        id: "emergency",
        label: "For emergency fund storage",
        reflection: "Emergency funds need maximum security and accessibility - bank accounts with deposit insurance provide better protection than digital wallet balances.",
        isCorrect: false,
      },
       {
        id: "transactions",
        label: "For daily spending and transactions",
        reflection: "Exactly! Digital wallets excel at facilitating quick, convenient payments while larger balances remain securely stored in bank accounts.",
        isCorrect: true,
      },
    ],
    reward: 10,
  },
  {
    id: 4,
    prompt: "What's the relationship between wallets and banks?",
    options: [
      {
        id: "competing",
        label: "They compete for customers",
        reflection: "While they serve different functions, the relationship is more complementary than competitive since wallets often connect to bank accounts.",
        isCorrect: false,
      },
      
      {
        id: "redundant",
        label: "One makes the other unnecessary",
        reflection: "Neither is redundant - they serve distinct purposes with wallets facilitating transactions powered by underlying bank account balances.",
        isCorrect: false,
      },
      {
        id: "complementary",
        label: "They work together effectively",
        reflection: "Exactly! Digital wallets provide transaction convenience while connecting to bank accounts for secure fund storage and regulatory protection.",
        isCorrect: true,
      },
      {
        id: "independent",
        label: "They operate completely separately",
        reflection: "Most digital wallets actually link to bank accounts for funding, making them interdependent rather than completely separate systems.",
        isCorrect: false,
      },
    ],
    reward: 10,
  },
  {
    id: 5,
    prompt: "How should you balance wallet and bank usage?",
    options: [
      {
        id: "exclusive",
        label: "Use only one exclusively",
        reflection: "Exclusive usage limits financial effectiveness - optimal strategy combines bank security for storage with wallet convenience for transactions.",
        isCorrect: false,
      },
      {
        id: "strategic",
        label: "Strategic division of purposes",
        reflection: "Exactly! Keep emergency and long-term funds in banks while using wallets for daily spending - leveraging each for their strengths.",
        isCorrect: true,
      },
      {
        id: "equal",
        label: "Split money equally between both",
        reflection: "Equal splitting doesn't optimize for purpose - security needs and transaction patterns should determine allocation rather than arbitrary percentages.",
        isCorrect: false,
      },
      {
        id: "maximum",
        label: "Maximize wallet usage for convenience",
        reflection: "Maximum wallet usage sacrifices security - effective strategy prioritizes bank protection for significant balances while using wallets appropriately.",
        isCorrect: false,
      },
    ],
    reward: 10,
  },
];

const totalStages = WALLET_BANK_STAGES.length;
const successThreshold = totalStages;

const WalletVsBank = () => {
  const location = useLocation();
  const gameId = "finance-young-adult-45";
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
      "How can strategic use of both wallets and banks actually enhance your financial security and convenience?",
      "What personal system helps you leverage wallet transaction ease while maintaining bank-level protection for your money?",
    ],
    []
  );

  const handleChoice = (option) => {
    if (selectedOption || showResult) return;

    resetFeedback();
    const currentStageData = WALLET_BANK_STAGES[currentStage];
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
  const stage = WALLET_BANK_STAGES[Math.min(currentStage, totalStages - 1)];
  const hasPassed = finalScore === successThreshold;

  return (
    <GameShell
      title="Wallet vs Bank"
      subtitle={subtitle}
      score={coins}
      coins={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      maxScore={WALLET_BANK_STAGES.length}
      currentLevel={Math.min(currentStage + 1, WALLET_BANK_STAGES.length)}
      totalLevels={WALLET_BANK_STAGES.length}
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
            <span>Money Storage Security</span>
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
                        { stageId: WALLET_BANK_STAGES[currentStage].id, isCorrect: WALLET_BANK_STAGES[currentStage].options.find(opt => opt.id === selectedOption)?.isCorrect },
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
                    Skill unlocked: <strong>Wallet-bank strategy mastery</strong>
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
              Skill unlocked: <strong>Wallet-bank strategy mastery</strong>
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

export default WalletVsBank;