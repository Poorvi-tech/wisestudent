import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const LOAN_RESTRUCTURING_STAGES = [
  {
    id: 1,
    prompt: "If income drops suddenly, what should you do?",
    options: [
      {
        id: "ignore",
        label: "Ignore EMIs and hope for improvement",
        reflection: "Actually, ignoring payment obligations leads to missed payments, penalties, credit damage, and potential legal action. Proactive communication with lenders is essential for finding viable solutions.",
        isCorrect: false,
      },
      {
        id: "communicate",
        label: "Talk to lender early for restructuring options",
        reflection: "Exactly! Early communication prevents defaults and opens doors to payment holidays, reduced EMIs, extended tenures, or other restructuring options that protect your financial situation.",
        isCorrect: true,
      },
      {
        id: "delay",
        label: "Delay payments until income stabilizes naturally",
        reflection: "Unilateral payment delays without lender agreement create missed payment reporting, penalties, and credit damage. Formal restructuring requires proactive communication and documented arrangements.",
        isCorrect: false,
      },
      {
        id: "borrow",
        label: "Take another loan to cover existing EMIs",
        reflection: "Taking on additional debt to pay existing obligations creates a dangerous debt cycle. The solution is communicating with current lenders for structured relief rather than adding more financial burden.",
        isCorrect: false,
      },
    ],
    reward: 10,
  },
  {
    id: 2,
    prompt: "What lenders typically offer during income disruption?",
    options: [
      {
        id: "options",
        label: "Payment holidays, reduced EMIs, or tenure extensions",
        reflection: "Correct! Most lenders have restructuring programs including payment moratoriums, EMI reductions, tenure extensions, or temporary interest-only payments to help borrowers during genuine financial hardship.",
        isCorrect: true,
      },
      {
        id: "nothing",
        label: "Nothing - contracts must be honored regardless of circumstances",
        reflection: "While contracts are important, most responsible lenders offer restructuring options for temporary hardships. Regulatory frameworks and business practices encourage working with customers facing genuine difficulties.",
        isCorrect: false,
      },
      {
        id: "penalties",
        label: "Additional penalties and higher interest rates",
        reflection: "Adding penalties during hardship would worsen the situation. Reputable lenders focus on sustainable solutions that help borrowers recover rather than imposing additional financial burdens during difficulties.",
        isCorrect: false,
      },
      {
        id: "forgiveness",
        label: "Complete loan forgiveness for temporary setbacks",
        reflection: "While some assistance programs exist, complete forgiveness is rare and typically reserved for extreme circumstances. More commonly, lenders offer temporary relief measures that maintain the loan structure while providing breathing room.",
        isCorrect: false,
      },
    ],
    reward: 10,
  },
  {
    id: 3,
    prompt: "When should you approach lenders for restructuring?",
    options: [
      
      {
        id: "missed",
        label: "After missing several payments to prove hardship",
        reflection: "Waiting until after missed payments creates credit damage and limits available options. Proactive communication before defaults occur typically yields better restructuring terms and preserves your credit standing.",
        isCorrect: false,
      },
      {
        id: "desperate",
        label: "Only when facing desperate financial circumstances",
        reflection: "Waiting for desperation limits your negotiating position. Early intervention with documented financial challenges typically results in more favorable restructuring terms and preserves lender relationships.",
        isCorrect: false,
      },
      {
        id: "early",
        label: "As soon as you anticipate payment difficulties",
        reflection: "Perfect! Early communication gives lenders time to process applications and implement solutions before missed payments occur, protecting your credit record and demonstrating financial responsibility.",
        isCorrect: true,
      },
      {
        id: "legal",
        label: "When legal notices arrive from the lender",
        reflection: "Legal action represents the final stage of delinquency resolution. Early restructuring discussions should happen well before formal notices to maintain control over the solution and avoid legal complications.",
        isCorrect: false,
      },
    ],
    reward: 10,
  },
  {
    id: 4,
    prompt: "What documentation should you prepare for loan restructuring?",
    options: [
      
      {
        id: "nothing",
        label: "Just explain verbally without any documentation",
        reflection: "Verbal explanations alone aren't sufficient for formal restructuring. Lenders need documented financial information to assess your situation objectively and comply with regulatory requirements for hardship programs.",
        isCorrect: false,
      },
      {
        id: "proof",
        label: "Income proof, expense details, and hardship documentation",
        reflection: "Exactly! Lenders require documented evidence of financial hardship including salary slips, bank statements, expense breakdowns, and proof of circumstances affecting your income to evaluate restructuring eligibility.",
        isCorrect: true,
      },
      {
        id: "future",
        label: "Proof of future income recovery projections",
        reflection: "While future projections help, lenders primarily focus on current financial reality and documented hardship. Concrete evidence of present circumstances is more important than optimistic future predictions for restructuring approval.",
        isCorrect: false,
      },
      {
        id: "personal",
        label: "Personal letters explaining your difficult situation",
        reflection: "Personal explanations are helpful but insufficient alone. Formal restructuring requires standardized documentation that lenders can evaluate systematically according to their policies and regulatory guidelines.",
        isCorrect: false,
      },
    ],
    reward: 10,
  },
  {
    id: 5,
    prompt: "What's the golden rule for loan restructuring?",
    options: [
     
      {
        id: "wait",
        label: "Wait to see if the financial situation improves on its own",
        reflection: "Waiting without communication risks missed payments, credit damage, and limited restructuring options. The key is taking control through early dialogue rather than hoping problems resolve themselves.",
        isCorrect: false,
      },
      {
        id: "multiple",
        label: "Approach multiple lenders simultaneously for better deals",
        reflection: "Simultaneous approaches can create conflicts and appear desperate. Focus on transparent communication with your current lenders who already understand your financial history and are best positioned to help.",
        isCorrect: false,
      },
      {
        id: "avoid",
        label: "Avoid discussing financial difficulties to prevent embarrassment",
        reflection: "Avoiding communication creates bigger problems than temporary embarrassment. Professional lenders routinely handle hardship cases, and honest dialogue is the path to sustainable financial solutions.",
        isCorrect: false,
      },
       {
        id: "proactive",
        label: "Communicate proactively before missing any payments",
        reflection: "Perfect! Proactive communication demonstrates financial responsibility and gives you maximum options for favorable restructuring terms while protecting your credit history from negative reporting.",
        isCorrect: true,
      },
    ],
    reward: 10,
  },
];

const totalStages = LOAN_RESTRUCTURING_STAGES.length;
const successThreshold = totalStages;

const LoanRestructuringAwareness = () => {
  const location = useLocation();
  const gameId = "finance-adults-43";
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
      "How can you prepare documentation to support your restructuring request?",
      "What are the key points to communicate when discussing financial hardship with lenders?",
    ],
    []
  );

  const handleChoice = (option) => {
    if (selectedOption || showResult) return;

    resetFeedback();
    const currentStageData = LOAN_RESTRUCTURING_STAGES[currentStage];
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
  const stage = LOAN_RESTRUCTURING_STAGES[Math.min(currentStage, totalStages - 1)];
  const hasPassed = finalScore === successThreshold;

  return (
    <GameShell
      title="Loan Restructuring Awareness"
      subtitle={subtitle}
      score={coins}
      coins={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      maxScore={LOAN_RESTRUCTURING_STAGES.length}
      currentLevel={Math.min(currentStage + 1, LOAN_RESTRUCTURING_STAGES.length)}
      totalLevels={LOAN_RESTRUCTURING_STAGES.length}
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
            <span>Financial Hardship</span>
            <span>Restructuring Solutions</span>
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
                    Skill unlocked: <strong>Financial hardship management</strong>
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
              Skill unlocked: <strong>Financial hardship management</strong>
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

export default LoanRestructuringAwareness;