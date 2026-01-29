import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const DIGITAL_MONEY_STAGES = [
  {
    id: 1,
    prompt: "What's the first rule of digital money safety?",
    options: [
      {
        id: "protection",
        label: "Never share login credentials",
        reflection: "Exactly! Your login information is the key to your digital finances - sharing it compromises all your accounts and financial security.",
        isCorrect: true,
      },
      {
        id: "convenience",
        label: "Use whatever is most convenient",
        reflection: "Convenience shouldn't override security - responsible digital money usage requires prioritizing protection over ease of access.",
        isCorrect: false,
      },
      
      {
        id: "multitasking",
        label: "Manage multiple accounts simultaneously",
        reflection: "Multitasking increases error risk rather than security - focused, careful management of each transaction is safer than juggling multiple platforms.",
        isCorrect: false,
      },
      {
        id: "public",
        label: "Use public computers when needed",
        reflection: "Public devices create security vulnerabilities through keyloggers and session hijacking - personal secured devices are essential for financial activities.",
        isCorrect: false,
      },
    ],
    reward: 10,
  },
  {
    id: 2,
    prompt: "How should you verify digital payment requests?",
    options: [
      {
        id: "immediate",
        label: "Act immediately on all requests",
        reflection: "Urgent pressure often indicates scams - legitimate requests allow reasonable time for verification and don't create artificial time constraints.",
        isCorrect: false,
      },
      
      {
        id: "small",
        label: "Send small test amounts first",
        reflection: "Test amounts still represent real money loss and don't prevent larger fraud - proper verification eliminates risk entirely rather than minimizing potential losses.",
        isCorrect: false,
      },
      {
        id: "verify",
        label: "Confirm through official channels",
        reflection: "Perfect! Always verify payment requests by contacting the supposed sender through known, official communication methods rather than replying to messages.",
        isCorrect: true,
      },
      {
        id: "ignore",
        label: "Ignore all unsolicited requests",
        reflection: "While ignoring unknown requests is wise, legitimate requests from known contacts still require verification to prevent account compromise scenarios.",
        isCorrect: false,
      },
    ],
    reward: 10,
  },
  {
    id: 3,
    prompt: "What's essential for secure digital transactions?",
    options: [
      {
        id: "speed",
        label: "Complete transactions quickly",
        reflection: "Rushing increases error likelihood - taking time to verify details, check balances, and confirm recipients prevents costly mistakes and fraud.",
        isCorrect: false,
      },
      {
        id: "doublecheck",
        label: "Double-check recipient and amount",
        reflection: "Exactly! Verifying recipient details and amounts prevents irreversible transfer errors and ensures funds reach intended destinations accurately.",
        isCorrect: true,
      },
      {
        id: "autopilot",
        label: "Use saved payment templates",
        reflection: "Templates speed processes but bypass verification steps - manual confirmation for each transaction catches errors that automation might miss.",
        isCorrect: false,
      },
      {
        id: "multiple",
        label: "Use multiple payment methods",
        reflection: "Multiple methods increase complexity without enhancing security - focused use of secure, verified payment channels with proper checks is more effective.",
        isCorrect: false,
      },
    ],
    reward: 10,
  },
  {
    id: 4,
    prompt: "How should you protect your digital wallet?",
    options: [
      {
        id: "simple",
        label: "Use simple, easy-to-remember PINs",
        reflection: "Simple PINs are easily guessed or cracked - strong, unique authentication methods provide necessary protection for financial access points.",
        isCorrect: false,
      },
      
      {
        id: "shared",
        label: "Share access with family members",
        reflection: "Shared access increases security risks and removes accountability - individual secure access ensures proper oversight and reduces fraud opportunities.",
        isCorrect: false,
      },
      {
        id: "default",
        label: "Keep default security settings",
        reflection: "Default settings often provide minimal protection - customized security configurations tailored to your needs offer stronger defense against threats.",
        isCorrect: false,
      },
      {
        id: "secure",
        label: "Enable biometric authentication",
        reflection: "Exactly! Biometric security (fingerprint, face recognition) combined with strong PINs creates multiple layers of protection against unauthorized access.",
        isCorrect: true,
      },
    ],
    reward: 10,
  },
  {
    id: 5,
    prompt: "What's the best practice for transaction monitoring?",
    options: [
      {
        id: "ignore",
        label: "Trust the system completely",
        reflection: "Blind trust ignores potential errors and fraud - active monitoring catches unauthorized transactions and system glitches that could impact your finances.",
        isCorrect: false,
      },
      {
        id: "monitor",
        label: "Review transactions regularly",
        reflection: "Exactly! Regular monitoring helps detect unauthorized activities quickly, track spending patterns, and identify billing errors before they become major issues.",
        isCorrect: true,
      },
      {
        id: "annual",
        label: "Check statements annually",
        reflection: "Annual reviews miss timely opportunities to address fraud and errors - frequent monitoring enables rapid response and minimizes financial damage.",
        isCorrect: false,
      },
      {
        id: "notifications",
        label: "Rely solely on notifications",
        reflection: "Notifications help but aren't comprehensive - proactive review catches issues that automated alerts might miss and provides complete financial oversight.",
        isCorrect: false,
      },
    ],
    reward: 10,
  },
];

const totalStages = DIGITAL_MONEY_STAGES.length;
const successThreshold = totalStages;

const DigitalMoneyCheckpoint = () => {
  const location = useLocation();
  const gameId = "finance-young-adult-50";
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
      "How can systematic digital money safety practices actually increase your financial freedom rather than restrict your transaction flexibility?",
      "What personal security protocols help you use digital money confidently while maintaining the convenience that makes digital transactions valuable?",
    ],
    []
  );

  const handleChoice = (option) => {
    if (selectedOption || showResult) return;

    resetFeedback();
    const currentStageData = DIGITAL_MONEY_STAGES[currentStage];
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
  const stage = DIGITAL_MONEY_STAGES[Math.min(currentStage, totalStages - 1)];
  const hasPassed = finalScore === successThreshold;

  return (
    <GameShell
      title="Digital Money Checkpoint"
      subtitle={subtitle}
      score={coins}
      coins={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      maxScore={DIGITAL_MONEY_STAGES.length}
      currentLevel={Math.min(currentStage + 1, DIGITAL_MONEY_STAGES.length)}
      totalLevels={DIGITAL_MONEY_STAGES.length}
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
            <span>Digital Finance Safety</span>
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
                        { stageId: DIGITAL_MONEY_STAGES[currentStage].id, isCorrect: DIGITAL_MONEY_STAGES[currentStage].options.find(opt => opt.id === selectedOption)?.isCorrect },
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
                    Skill unlocked: <strong>Digital money safety mastery</strong>
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
              Skill unlocked: <strong>Digital money safety mastery</strong>
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

export default DigitalMoneyCheckpoint;