import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const LOAN_REJECTION_STAGES = [
  {
    id: 1,
    prompt: "Why do banks typically reject loan applications?",
    options: [
      {
        id: "poor",
        label: "Poor repayment history or unclear income",
        reflection: "Banks assess risk based on your financial track record and ability to repay. A weak repayment history or unclear income sources signal higher risk.",
        isCorrect: true,
      },
      {
        id: "random",
        label: "Random decisions",
        reflection: "Bank lending decisions are based on systematic risk assessment, not randomness. They follow established criteria to evaluate creditworthiness.",
        isCorrect: false,
      },
      {
        id: "bias",
        label: "Personal bias against applicants",
        reflection: "Professional lending institutions follow standardized procedures and regulations to ensure fair and objective evaluation of all applications.",
        isCorrect: false,
      },
      {
        id: "profit",
        label: "They don't want to lend money",
        reflection: "Banks are in the business of lending money profitably. They reject applications when the risk doesn't match their return requirements.",
        isCorrect: false,
      },
    ],
    reward: 10,
  },
  {
    id: 2,
    prompt: "What does a loan rejection actually indicate about your financial readiness?",
    options: [
      {
        id: "punishment",
        label: "Punishment for past financial mistakes",
        reflection: "Rejection isn't punishment—it's feedback that you need to strengthen certain financial areas before taking on debt obligations.",
        isCorrect: false,
      },
      {
        id: "readiness",
        label: "Signal that you need to improve financial readiness",
        reflection: "Exactly! Rejection identifies specific areas where you need to build stronger financial foundations before qualifying for credit.",
        isCorrect: true,
      },
      {
        id: "permanent",
        label: "Permanent barrier to future borrowing",
        reflection: "Rejection is temporary feedback, not a permanent verdict. You can address the issues and reapply when better prepared.",
        isCorrect: false,
      },
      {
        id: "luck",
        label: "Bad luck with the application timing",
        reflection: "While timing can play a role, rejections primarily reflect whether your current financial profile meets lending criteria.",
        isCorrect: false,
      },
    ],
    reward: 10,
  },
  {
    id: 3,
    prompt: "Which factor is most likely to cause a bank to reject your loan application?",
    options: [
      {
        id: "score",
        label: "Low credit score or limited credit history",
        reflection: "Credit scores and history are primary indicators of repayment reliability. Banks rely heavily on these metrics to assess risk.",
        isCorrect: true,
      },
      {
        id: "color",
        label: "The color of your application folder",
        reflection: "Application appearance doesn't affect lending decisions. Banks focus on financial qualifications and documentation.",
        isCorrect: false,
      },
      {
        id: "name",
        label: "Unusual spelling of your name",
        reflection: "Professional lenders evaluate financial credentials objectively, regardless of personal identifiers like name spelling.",
        isCorrect: false,
      },
      {
        id: "branch",
        label: "Which bank branch you visited",
        reflection: "While branch location might affect processing time, lending decisions are based on standardized financial criteria across all branches.",
        isCorrect: false,
      },
    ],
    reward: 10,
  },
  {
    id: 4,
    prompt: "How should you respond when your loan application gets rejected?",
    options: [
      {
        id: "ignore",
        label: "Ignore the rejection letter entirely",
        reflection: "Ignoring rejection feedback misses valuable information about what you need to improve for future successful applications.",
        isCorrect: false,
      },
      {
        id: "improve",
        label: "Review reasons and work on improving those areas",
        reflection: "Perfect approach! Understanding rejection reasons helps you systematically strengthen your financial profile for future success.",
        isCorrect: true,
      },
      {
        id: "complain",
        label: "Complain to multiple bank managers",
        reflection: "Complaining won't change objective financial criteria. Focus on addressing the specific issues that led to rejection.",
        isCorrect: false,
      },
      {
        id: "quit",
        label: "Give up on borrowing altogether",
        reflection: "Rejection is redirection toward better preparation, not elimination of future borrowing possibilities when you're ready.",
        isCorrect: false,
      },
    ],
    reward: 10,
  },
  {
    id: 5,
    prompt: "What positive outcome can come from a loan rejection experience?",
    options: [
     
      {
        id: "nothing",
        label: "Nothing positive—it's just a setback",
        reflection: "While disappointing, rejection provides specific feedback that can guide meaningful financial improvement efforts.",
        isCorrect: false,
      },
      {
        id: "delay",
        label: "Delay in achieving your financial goals",
        reflection: "Temporary delays can actually prevent future financial difficulties by ensuring you're properly prepared before taking on debt.",
        isCorrect: false,
      },
      {
        id: "frustration",
        label: "Increased financial frustration and stress",
        reflection: "Frustration is natural, but channeling it productively toward financial improvement creates long-term benefits.",
        isCorrect: false,
      },
       {
        id: "motivation",
        label: "Motivation to strengthen financial habits and credit profile",
        reflection: "Absolutely! Rejection often serves as a catalyst for building better financial discipline and credit management practices.",
        isCorrect: true,
      },
    ],
    reward: 10,
  },
];

const totalStages = LOAN_REJECTION_STAGES.length;
const successThreshold = totalStages;

const LoanRejectionReality = () => {
  const location = useLocation();
  const gameId = "finance-adults-26";
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
      "How can loan rejections serve as valuable financial feedback rather than failures?",
      "What specific steps can you take to improve your creditworthiness after a rejection?",
    ],
    []
  );

  const handleChoice = (option) => {
    if (selectedOption || showResult) return;

    resetFeedback();
    const currentStageData = LOAN_REJECTION_STAGES[currentStage];
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
  const stage = LOAN_REJECTION_STAGES[Math.min(currentStage, totalStages - 1)];
  const hasPassed = finalScore === successThreshold;

  return (
    <GameShell
      title="Loan Rejection Reality"
      subtitle={subtitle}
      score={coins}
      coins={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      maxScore={LOAN_REJECTION_STAGES.length}
      currentLevel={Math.min(currentStage + 1, LOAN_REJECTION_STAGES.length)}
      totalLevels={LOAN_REJECTION_STAGES.length}
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
            <span>Loan Rejection</span>
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
                    Skill unlocked: <strong>Loan rejection analysis</strong>
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
              Skill unlocked: <strong>Loan rejection analysis</strong>
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

export default LoanRejectionReality;