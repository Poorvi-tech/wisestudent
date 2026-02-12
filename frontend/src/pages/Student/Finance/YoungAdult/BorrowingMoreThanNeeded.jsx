import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const BORROWING_MORE_THAN_NEEDED_STAGES = [
  {
    id: 1,
    prompt: "You qualify for a loan larger than your actual need. What's the wiser approach?",
    options: [
      {
        id: "full",
        label: "Take the full amount to have extra cushion",
        reflection: "Taking more than needed increases your debt burden and monthly payments, creating unnecessary financial stress.",
        isCorrect: false,
      },
      {
        id: "needed",
        label: "Take only what's needed for your specific purpose",
        reflection: "Exactly! Borrowing only what you need keeps your debt manageable and reduces financial stress.",
        isCorrect: true,
      },
      {
        id: "future",
        label: "Take extra for potential future expenses",
        reflection: "Borrowing for uncertain future needs is risky and can lead to over-indebtedness without clear benefits.",
        isCorrect: false,
      },
      {
        id: "investment",
        label: "Use extra amount as an investment opportunity",
        reflection: "Using borrowed money for investments is extremely risky since you're leveraging debt with uncertain returns.",
        isCorrect: false,
      },
    ],
    reward: 15,
  },
  {
    id: 2,
    prompt: "Why is it dangerous to borrow more than you actually need?",
    options: [
       {
        id: "stress",
        label: "It increases monthly payments and financial stress",
        reflection: "Correct! Larger loans mean higher monthly payments, which can strain your budget and reduce your financial flexibility.",
        isCorrect: true,
      },
      {
        id: "flexibility",
        label: "It gives you more financial flexibility",
        reflection: "Extra borrowing actually reduces flexibility by increasing your debt obligations and monthly payments.",
        isCorrect: false,
      },
     
      {
        id: "opportunity",
        label: "You might miss opportunities without extra funds",
        reflection: "Borrowing extra for uncertain opportunities is speculative and can create more financial problems than it solves.",
        isCorrect: false,
      },
      {
        id: "emergency",
        label: "It serves as an emergency fund",
        reflection: "Emergency funds should come from savings, not additional borrowing that increases your debt burden.",
        isCorrect: false,
      },
    ],
    reward: 15,
  },
  {
    id: 3,
    prompt: "What should you consider before accepting a loan offer?",
    options: [
      {
        id: "maximum",
        label: "Accept the maximum amount you're approved for",
        reflection: "Accepting the maximum amount often leads to over-borrowing and unnecessary financial stress.",
        isCorrect: false,
      },
      
      {
        id: "future",
        label: "Consider potential future needs in your calculation",
        reflection: "Planning for uncertain future needs through borrowing is risky and often leads to over-indebtedness.",
        isCorrect: false,
      },
      {
        id: "negotiation",
        label: "Negotiate for even more to have maximum options",
        reflection: "Negotiating for more than needed creates unnecessary financial obligations and increases risk.",
        isCorrect: false,
      },
      {
        id: "calculation",
        label: "Calculate exactly what you need and add a small buffer",
        reflection: "Perfect! Precise calculation with a small buffer ensures you have enough while avoiding unnecessary debt.",
        isCorrect: true,
      },
    ],
    reward: 15,
  },
  {
    id: 4,
    prompt: "How does borrowing only what you need benefit your financial health?",
    options: [
      {
        id: "restriction",
        label: "It restricts your ability to handle emergencies",
        reflection: "Borrowing only what you need actually improves your ability to handle emergencies by keeping debt manageable.",
        isCorrect: false,
      },
      
      {
        id: "opportunity",
        label: "It limits your investment opportunities",
        reflection: "Manageable debt actually provides more opportunities since you have better cash flow and financial flexibility.",
        isCorrect: false,
      },
      {
        id: "manageable",
        label: "It keeps debt payments manageable and predictable",
        reflection: "Exactly! Manageable debt payments leave room in your budget for other expenses and savings, improving overall financial health.",
        isCorrect: true,
      },
      {
        id: "credit",
        label: "It shows lenders you're not creditworthy",
        reflection: "Borrowing responsibly demonstrates good financial judgment and creditworthiness to lenders.",
        isCorrect: false,
      },
    ],
    reward: 15,
  },
  {
    id: 5,
    prompt: "What's the best practice when you're approved for more than you need?",
    options: [
      {
        id: "accept",
        label: "Accept the full amount since you're approved",
        reflection: "Approval for more than needed doesn't mean you should borrow it - responsible borrowing is key to financial health.",
        isCorrect: false,
      },
      {
        id: "decline",
        label: "Politely decline the excess amount or request a lower loan",
        reflection: "Excellent! Declining excess borrowing shows financial discipline and helps maintain manageable debt levels.",
        isCorrect: true,
      },
      {
        id: "save",
        label: "Accept it and save the extra for future use",
        reflection: "Saving borrowed money still means you're paying interest on funds you don't immediately need, which is inefficient.",
        isCorrect: false,
      },
      {
        id: "invest",
        label: "Use the extra amount for high-return investments",
        reflection: "Investing borrowed money is extremely risky since you're leveraging debt with uncertain investment returns.",
        isCorrect: false,
      },
    ],
    reward: 15,
  },
];

const totalStages = BORROWING_MORE_THAN_NEEDED_STAGES.length;
const successThreshold = totalStages;

const BorrowingMoreThanNeeded = () => {
  const location = useLocation();
  const gameId = "finance-young-adult-58";
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
      "How can you ensure you're borrowing only what you truly need?",
      "What strategies help you resist the temptation to borrow extra 'just in case'?",
    ],
    []
  );

  const handleChoice = (option) => {
    if (selectedOption || showResult) return;

    resetFeedback();
    const currentStageData = BORROWING_MORE_THAN_NEEDED_STAGES[currentStage];
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
  const stage = BORROWING_MORE_THAN_NEEDED_STAGES[Math.min(currentStage, totalStages - 1)];
  const hasPassed = finalScore === successThreshold;

  return (
    <GameShell
      title="Borrowing More Than Needed"
      subtitle={subtitle}
      score={coins}
      coins={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      maxScore={BORROWING_MORE_THAN_NEEDED_STAGES.length}
      currentLevel={Math.min(currentStage + 1, BORROWING_MORE_THAN_NEEDED_STAGES.length)}
      totalLevels={BORROWING_MORE_THAN_NEEDED_STAGES.length}
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
            <span>Borrowing Responsibly</span>
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
                    Skill unlocked: <strong>Responsible borrowing mindset</strong>
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
              Skill unlocked: <strong>Responsible borrowing mindset</strong>
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

export default BorrowingMoreThanNeeded;