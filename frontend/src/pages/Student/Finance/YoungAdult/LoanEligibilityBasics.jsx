import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const LOAN_ELIGIBILITY_STAGES = [
  {
    id: 1,
    prompt: "You're applying for your first loan. What factor is most important for loan approval?",
    options: [
      {
        id: "multiple",
        label: "Having multiple loans shows financial activity",
        reflection: "Having multiple loans actually increases your debt burden and can hurt your loan eligibility by affecting your debt-to-income ratio.",
        isCorrect: false,
      },
      {
        id: "stable",
        label: "Stable income and repayment discipline",
        reflection: "Exactly! Lenders want to see that you have a consistent income and a track record of managing debt responsibly.",
        isCorrect: true,
      },
      {
        id: "assets",
        label: "Owning expensive assets like luxury cars",
        reflection: "While assets can help, lenders are more concerned with your ability to generate income and manage debt responsibly.",
        isCorrect: false,
      },
      {
        id: "friends",
        label: "Having friends with good credit scores",
        reflection: "Your friends' credit scores don't affect your loan eligibility - lenders focus on your individual financial behavior and capacity.",
        isCorrect: false,
      },
    ],
    reward: 15,
  },
  {
    id: 2,
    prompt: "Which of these demonstrates good repayment discipline to lenders?",
    options: [
      {
        id: "late",
        label: "Paying bills a few days late occasionally",
        reflection: "Late payments, even by a few days, can negatively impact your credit score and loan eligibility.",
        isCorrect: false,
      },
      {
        id: "minimum",
        label: "Always paying only the minimum amount due",
        reflection: "Paying only minimums suggests you're struggling financially and may not be able to handle additional loan payments.",
        isCorrect: false,
      },
      {
        id: "timely",
        label: "Paying all bills on time, every time",
        reflection: "Perfect! Consistent on-time payments demonstrate reliability and financial discipline to potential lenders.",
        isCorrect: true,
      },
      {
        id: "occasional",
        label: "Paying when you remember or have extra money",
        reflection: "Inconsistent payment behavior signals financial instability and poor money management skills.",
        isCorrect: false,
      },
    ],
    reward: 15,
  },
  {
    id: 3,
    prompt: "What should you do to improve your chances of loan approval?",
    options: [
      {
        id: "spend",
        label: "Spend more to show you're financially active",
        reflection: "Spending more without increasing income can hurt your debt-to-income ratio and reduce your loan eligibility.",
        isCorrect: false,
      },
      {
        id: "save",
        label: "Build an emergency fund and maintain low debt",
        reflection: "Excellent! Having savings shows financial responsibility, and low debt improves your debt-to-income ratio.",
        isCorrect: true,
      },
      {
        id: "borrow",
        label: "Borrow from multiple sources to build credit",
        reflection: "Taking on multiple debts simultaneously increases your risk profile and can make you appear over-leveraged to lenders.",
        isCorrect: false,
      },
      {
        id: "ignore",
        label: "Ignore your credit score since it's not important",
        reflection: "Your credit score is one of the most important factors lenders consider when evaluating loan applications.",
        isCorrect: false,
      },
    ],
    reward: 15,
  },
  {
    id: 4,
    prompt: "Why is maintaining a stable employment history important for loans?",
    options: [
      {
        id: "income",
        label: "It demonstrates reliable income generation over time",
        reflection: "Correct! Stable employment shows lenders that you have a consistent source of income to repay your loan.",
        isCorrect: true,
      },
      {
        id: "job",
        label: "It shows you change jobs frequently for better opportunities",
        reflection: "Frequent job changes can signal instability to lenders, making them concerned about your ability to maintain consistent income.",
        isCorrect: false,
      },
      
      {
        id: "networking",
        label: "It helps you build professional networking connections",
        reflection: "While networking is valuable, lenders are primarily concerned with your ability to generate steady income.",
        isCorrect: false,
      },
      {
        id: "experience",
        label: "It proves you're gaining diverse work experience",
        reflection: "Diverse experience is good, but lenders want to see job stability and consistent income rather than frequent career changes.",
        isCorrect: false,
      },
    ],
    reward: 15,
  },
  {
    id: 5,
    prompt: "What's the impact of having too many credit inquiries in a short period?",
    options: [
      {
        id: "approval",
        label: "It increases your chances of loan approval",
        reflection: "Multiple credit inquiries in a short period actually decrease your approval chances as they signal financial desperation.",
        isCorrect: false,
      },
      
      {
        id: "interest",
        label: "It shows you're shopping for the best interest rates",
        reflection: "While rate shopping is smart, too many inquiries suggest you're applying for credit frequently, which can raise red flags for lenders.",
        isCorrect: false,
      },
      {
        id: "no-effect",
        label: "It has no effect on your financial profile",
        reflection: "Credit inquiries do have an impact on your credit score and loan eligibility - lenders can see all recent inquiries on your credit report.",
        isCorrect: false,
      },
      {
        id: "score",
        label: "It can temporarily lower your credit score",
        reflection: "Exactly! Each credit inquiry can slightly reduce your credit score, and multiple inquiries in a short time can significantly impact your eligibility.",
        isCorrect: true,
      },
    ],
    reward: 15,
  },
];

const totalStages = LOAN_ELIGIBILITY_STAGES.length;
const successThreshold = totalStages;

const LoanEligibilityBasics = () => {
  const location = useLocation();
  const gameId = "finance-young-adult-57";
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
      "How can you build a strong financial profile to improve loan eligibility?",
      "What habits should you develop early to ensure future creditworthiness?",
    ],
    []
  );

  const handleChoice = (option) => {
    if (selectedOption || showResult) return;

    resetFeedback();
    const currentStageData = LOAN_ELIGIBILITY_STAGES[currentStage];
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
  const stage = LOAN_ELIGIBILITY_STAGES[Math.min(currentStage, totalStages - 1)];
  const hasPassed = finalScore === successThreshold;

  return (
    <GameShell
      title="Loan Eligibility Basics"
      subtitle={subtitle}
      score={coins}
      coins={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      maxScore={LOAN_ELIGIBILITY_STAGES.length}
      currentLevel={Math.min(currentStage + 1, LOAN_ELIGIBILITY_STAGES.length)}
      totalLevels={LOAN_ELIGIBILITY_STAGES.length}
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
            <span>Loan Eligibility</span>
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
                        { stageId: LOAN_ELIGIBILITY_STAGES[currentStage].id, isCorrect: LOAN_ELIGIBILITY_STAGES[currentStage].options.find(opt => opt.id === selectedOption)?.isCorrect },
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
                    Skill unlocked: <strong>Loan eligibility awareness</strong>
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
              Skill unlocked: <strong>Loan eligibility awareness</strong>
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

export default LoanEligibilityBasics;