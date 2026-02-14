import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const MISSED_EMI_CONSEQUENCE_STAGES = [
  {
    id: 1,
    prompt: "What happens if you miss EMIs?",
    options: [
      {
        id: "nothing",
        label: "Nothing serious, just a minor inconvenience",
        reflection: "Actually, missed EMIs have significant consequences including penalties, credit score damage, and potential legal action that can severely impact your financial future.",
        isCorrect: false,
      },
      {
        id: "penalties",
        label: "Penalties and credit damage that affect future borrowing",
        reflection: "Exactly! Missed payments trigger late fees, damage your credit score, and create barriers to future loan approvals, affecting your borrowing ability for years.",
        isCorrect: true,
      },
      {
        id: "warning",
        label: "Just a warning letter from the lender",
        reflection: "While initial notices may be warnings, repeated missed payments lead to serious penalties, credit reporting, and potential legal consequences beyond simple notifications.",
        isCorrect: false,
      },
      {
        id: "extension",
        label: "Automatic payment extension with no consequences",
        reflection: "Lenders don't automatically extend payments without consequences. Missed payments require proactive communication and often involve fees or modified terms with potential credit impact.",
        isCorrect: false,
      },
    ],
    reward: 10,
  },
  {
    id: 2,
    prompt: "What's the immediate consequence of missing an EMI?",
    options: [
      {
        id: "notification",
        label: "You receive a friendly reminder notification",
        reflection: "While reminders are sent, the immediate consequence is typically late payment fees and the beginning of negative credit reporting that affects your financial standing.",
        isCorrect: false,
      },
      {
        id: "fees",
        label: "Late payment fees and penalty charges apply",
        reflection: "Correct! Missed EMIs immediately trigger penalty fees, typically 2-3% of the overdue amount, plus potential processing charges that increase your total debt burden.",
        isCorrect: true,
      },
      {
        id: "interest",
        label: "Interest rates automatically increase on your loan",
        reflection: "While some loans may have penalty rate provisions, the immediate consequence is late fees rather than automatic interest rate increases on the entire loan balance.",
        isCorrect: false,
      },
      {
        id: "grace",
        label: "You get a automatic grace period with no charges",
        reflection: "Grace periods, when available, are typically short (7-15 days) and may still incur fees. They're not automatic forgiveness of missed payments without consequences.",
        isCorrect: false,
      },
    ],
    reward: 10,
  },
  {
    id: 3,
    prompt: "How does missing EMIs affect your credit score?",
    options: [
      {
        id: "significant",
        label: "Significant damage that stays on credit reports for years",
        reflection: "Exactly! Payment history comprises 35% of credit scores. Missed EMIs create long-term damage that can prevent future loan approvals and increase borrowing costs.",
        isCorrect: true,
      },
      {
        id: "slight",
        label: "Slight temporary dip that recovers quickly",
        reflection: "Missed payments cause significant, lasting damage to credit scores. Even one missed payment can drop scores by 50-100 points and remain on credit reports for years.",
        isCorrect: false,
      },
      
      {
        id: "immediate",
        label: "Immediate improvement due to reduced debt",
        reflection: "Missed payments increase, not decrease, debt through penalties and fees. The financial burden grows rather than improving your debt-to-income ratio or credit position.",
        isCorrect: false,
      },
      {
        id: "unaffected",
        label: "Credit score remains completely unaffected",
        reflection: "Credit bureaus are notified of missed payments, creating immediate negative reporting. Payment history is the most important factor in credit scoring algorithms.",
        isCorrect: false,
      },
    ],
    reward: 10,
  },
  {
    id: 4,
    prompt: "What long-term impact do missed EMIs create?",
    options: [
      {
        id: "approval",
        label: "Future loan approvals become more difficult and expensive",
        reflection: "Perfect! Poor payment history leads to higher interest rates, stricter approval criteria, or outright rejection for future loans, credit cards, and financial products.",
        isCorrect: true,
      },
      {
        id: "forgiveness",
        label: "Lenders eventually forgive and forget past misses",
        reflection: "While some hardship programs exist, credit reporting agencies maintain payment history records for 7 years, affecting borrowing capacity long after the original loan is resolved.",
        isCorrect: false,
      },
      {
        id: "opportunity",
        label: "Creates opportunities for better loan terms later",
        reflection: "Missed payments damage rather than improve your financial profile. Good payment history, not poor performance, creates opportunities for favorable lending terms.",
        isCorrect: false,
      },
      {
        id: "neutral",
        label: "Has no meaningful impact on long-term financial goals",
        reflection: "Payment history fundamentally affects financial opportunities. Missed EMIs create cascading effects that impact housing, employment, insurance rates, and major purchase financing.",
        isCorrect: false,
      },
    ],
    reward: 10,
  },
  {
    id: 5,
    prompt: "What's the golden rule for EMI management?",
    options: [
     
      {
        id: "flexible",
        label: "Treat EMIs flexibly based on monthly cash flow",
        reflection: "Flexible treatment of essential obligations creates financial instability. EMIs require consistent, planned allocation to avoid the serious consequences of missed payments.",
        isCorrect: false,
      },
      {
        id: "minimum",
        label: "Pay minimum amounts when facing financial difficulty",
        reflection: "Minimum payments on missed amounts still incur penalties and credit damage. Proactive communication with lenders is better than partial payments that don't satisfy obligations.",
        isCorrect: false,
      },
      {
        id: "postpone",
        label: "Postpone payments during challenging months",
        reflection: "Postponement without formal arrangement creates missed payment reporting. Structured deferment or modification programs are necessary to avoid credit and penalty consequences.",
        isCorrect: false,
      },
       {
        id: "prioritize",
        label: "Prioritize EMI payments above discretionary spending",
        reflection: "Perfect! Treating EMIs as essential obligations like rent or utilities ensures consistent payments that protect your credit and maintain future borrowing capacity.",
        isCorrect: true,
      },
    ],
    reward: 10,
  },
];

const totalStages = MISSED_EMI_CONSEQUENCE_STAGES.length;
const successThreshold = totalStages;

const MissedEMIConsequence = () => {
  const location = useLocation();
  const gameId = "finance-adults-38";
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
      "How can you prepare for potential income disruptions to avoid missing EMIs?",
      "What steps should you take immediately if you anticipate difficulty making an EMI payment?",
    ],
    []
  );

  const handleChoice = (option) => {
    if (selectedOption || showResult) return;

    resetFeedback();
    const currentStageData = MISSED_EMI_CONSEQUENCE_STAGES[currentStage];
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
  const stage = MISSED_EMI_CONSEQUENCE_STAGES[Math.min(currentStage, totalStages - 1)];
  const hasPassed = finalScore === successThreshold;

  return (
    <GameShell
      title="Missed EMI Consequence"
      subtitle={subtitle}
      score={showResult ? finalScore : coins}
      coins={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      maxScore={MISSED_EMI_CONSEQUENCE_STAGES.length}
      currentLevel={Math.min(currentStage + 1, MISSED_EMI_CONSEQUENCE_STAGES.length)}
      totalLevels={MISSED_EMI_CONSEQUENCE_STAGES.length}
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
            <span>EMI Responsibility</span>
            <span>Payment Consequences</span>
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
                    Skill unlocked: <strong>EMI payment discipline</strong>
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
              Skill unlocked: <strong>EMI payment discipline</strong>
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

export default MissedEMIConsequence;