import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const TRUSTING_LOAN_OFFERS_STAGES = [
  {
    id: 1,
    prompt: "A lender promises “guaranteed approval.” What should you do?",
    options: [
      {
        id: "accept",
        label: "Accept immediately to secure the funds quickly",
        reflection: "Guaranteed approval offers often hide unfavorable terms, high fees, or predatory conditions that can create serious financial problems.",
        isCorrect: false,
      },
      {
        id: "cautious",
        label: "Be cautious and verify all terms carefully",
        reflection: "Exactly! Guaranteed offers require thorough verification of terms, fees, and conditions to avoid hidden risks and unfavorable agreements.",
        isCorrect: true,
      },
      {
        id: "compare",
        label: "Compare with other lenders before deciding",
        reflection: "Comparison shopping is wise, but the fundamental principle is verifying any 'guaranteed' offer thoroughly regardless of alternatives.",
        isCorrect: false,
      },
      {
        id: "ignore",
        label: "Ignore the offer entirely without investigation",
        reflection: "While skepticism is healthy, completely ignoring potentially legitimate offers isn't optimal. The key is careful verification of all guaranteed claims.",
        isCorrect: false,
      },
    ],
    reward: 10,
  },
  {
    id: 2,
    prompt: "What's the main red flag with guaranteed loan offers?",
    options: [
      {
        id: "marketing",
        label: "They use aggressive marketing tactics",
        reflection: "Aggressive marketing is concerning but not the primary red flag. The core issue is that guarantees often mask unfavorable terms and hidden costs.",
        isCorrect: false,
      },
      
      {
        id: "approval",
        label: "They approve everyone regardless of credit history",
        reflection: "While broad approval is suspicious, the real danger is the hidden financial costs and terms that make these loans ultimately damaging.",
        isCorrect: false,
      },
      {
        id: "speed",
        label: "They promise unusually fast processing times",
        reflection: "Fast processing alone isn't the main concern. The fundamental issue is that speed often comes with hidden financial penalties and unfavorable conditions.",
        isCorrect: false,
      },
      {
        id: "terms",
        label: "They hide unfavorable terms and high costs",
        reflection: "Correct! Guaranteed approval typically conceals expensive fees, high interest rates, or restrictive conditions that make the loan financially harmful.",
        isCorrect: true,
      },
    ],
    reward: 10,
  },
  {
    id: 3,
    prompt: "How should you verify a guaranteed loan offer?",
    options: [
      
      {
        id: "phone",
        label: "Call the lender to ask verbal questions",
        reflection: "Phone inquiries provide some information, but written documentation is essential for proper evaluation and future reference of all stated terms.",
        isCorrect: false,
      },
      {
        id: "friend",
        label: "Ask friends who've used the same lender",
        reflection: "Personal experiences can be helpful, but individual circumstances vary. The priority is verifying the specific terms of your own potential agreement.",
        isCorrect: false,
      },
      {
        id: "documents",
        label: "Request all terms in writing before accepting",
        reflection: "Perfect! Written documentation allows proper review of all terms, fees, and conditions to ensure the offer is genuinely beneficial rather than deceptive.",
        isCorrect: true,
      },
      {
        id: "website",
        label: "Check the lender's website for reviews",
        reflection: "Online research helps, but websites can be manipulated. Official written terms from the lender provide the most reliable basis for decision-making.",
        isCorrect: false,
      },
    ],
    reward: 10,
  },
  {
    id: 4,
    prompt: "What should you look for in guaranteed loan terms?",
    options: [
      {
        id: "interest",
        label: "Total interest costs and annual percentage rate",
        reflection: "Exactly! Understanding true borrowing costs through APR and total interest prevents being trapped by seemingly attractive guaranteed approval offers.",
        isCorrect: true,
      },
      {
        id: "logo",
        label: "Professional-looking marketing materials",
        reflection: "Professional presentation can be misleading. Focus on concrete financial terms rather than marketing aesthetics when evaluating loan offers.",
        isCorrect: false,
      },
      {
        id: "endorsement",
        label: "Celebrity endorsements or testimonials",
        reflection: "Endorsements don't reflect your personal financial situation. Evaluate actual loan terms and costs rather than promotional claims or social proof.",
        isCorrect: false,
      },
      {
        id: "office",
        label: "Impressive physical office locations",
        reflection: "Physical presence doesn't guarantee fair lending practices. Concentrate on written loan terms and financial obligations rather than business appearance.",
        isCorrect: false,
      },
    ],
    reward: 10,
  },
  {
    id: 5,
    prompt: "What's the golden rule for dealing with guaranteed offers?",
    options: [
      {
        id: "skepticism",
        label: "Assume all guaranteed offers are scams",
        reflection: "Healthy skepticism is important, but blanket dismissal might miss legitimate opportunities. The key is systematic verification of all guaranteed claims.",
        isCorrect: false,
      },
      {
        id: "verification",
        label: "Verify all claims through official documentation",
        reflection: "Perfect! Systematic verification through official documents protects against deceptive offers while allowing legitimate opportunities to be properly evaluated.",
        isCorrect: true,
      },
      {
        id: "urgency",
        label: "Act quickly before the offer expires",
        reflection: "Urgency pressure is typically a manipulation tactic. Legitimate offers provide reasonable time for proper evaluation and verification of terms.",
        isCorrect: false,
      },
      {
        id: "comparison",
        label: "Always get multiple competing offers first",
        reflection: "Comparison shopping is valuable, but shouldn't delay verification of questionable guaranteed offers. Priority is confirming legitimacy before considering alternatives.",
        isCorrect: false,
      },
    ],
    reward: 10,
  },
];

const totalStages = TRUSTING_LOAN_OFFERS_STAGES.length;
const successThreshold = totalStages;

const TrustingLoanOffers = () => {
  const location = useLocation();
  const gameId = "finance-adults-31";
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
      "What specific documents should you request from any lender making guaranteed promises?",
      "How can you distinguish between legitimate fast approval and deceptive guaranteed offers?",
    ],
    []
  );

  const handleChoice = (option) => {
    if (selectedOption || showResult) return;

    resetFeedback();
    const currentStageData = TRUSTING_LOAN_OFFERS_STAGES[currentStage];
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
      }, 2500); // Wait longer before showing final results
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
  const stage = TRUSTING_LOAN_OFFERS_STAGES[Math.min(currentStage, totalStages - 1)];
  const hasPassed = finalScore === successThreshold;

  return (
    <GameShell
      title="Trusting Loan Offers"
      subtitle={subtitle}
      score={coins}
      coins={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      maxScore={TRUSTING_LOAN_OFFERS_STAGES.length}
      currentLevel={Math.min(currentStage + 1, TRUSTING_LOAN_OFFERS_STAGES.length)}
      totalLevels={TRUSTING_LOAN_OFFERS_STAGES.length}
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
            <span>Loan Verification</span>
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
                  <button
                    onClick={() => {
                      const updatedHistory = [
                        ...history,
                        { stageId: TRUSTING_LOAN_OFFERS_STAGES[currentStage].id, isCorrect: TRUSTING_LOAN_OFFERS_STAGES[currentStage].options.find(opt => opt.id === selectedOption)?.isCorrect },
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
                    Skill unlocked: <strong>Loan offer verification</strong>
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
              Skill unlocked: <strong>Loan offer verification</strong>
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

export default TrustingLoanOffers;