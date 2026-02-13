import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const PEER_PRESSURE_LOANS_STAGES = [
  {
    id: 1,
    prompt: "Friends encourage you to take a loan. What should guide you?",
    options: [
      {
        id: "advice",
        label: "Their advice and recommendations",
        reflection: "Actually, friends' advice shouldn't drive your borrowing decisions. While their intentions may be good, they don't bear the financial consequences of your loan obligations. Personal financial decisions must be based on your own circumstances, repayment capacity, and long-term financial goals rather than peer influence.",
        isCorrect: false,
      },
     
      {
        id: "comparison",
        label: "What others in your circle are doing",
        reflection: "Following peer behavior creates dangerous financial conformity rather than responsible decision-making. Just because others are borrowing doesn't mean it's right for your situation. Financial decisions should be based on individual circumstances and capacity, not social pressure or fear of missing out.",
        isCorrect: false,
      },
      {
        id: "pressure",
        label: "Avoiding social awkwardness or exclusion",
        reflection: "Financial decisions based on social concerns rather than practical needs create long-term problems. The temporary discomfort of saying no is insignificant compared to years of debt obligations and financial stress. Responsible borrowing requires prioritizing financial well-being over social dynamics.",
        isCorrect: false,
      },
       {
        id: "ability",
        label: "Your personal repayment ability and financial situation",
        reflection: "Exactly! Borrowing decisions must be personal and realistic, based solely on your income, expenses, credit situation, and genuine need. Friends may have different financial circumstances, risk tolerance, and obligations, making their advice potentially inappropriate for your specific situation.",
        isCorrect: true,
      },
    ],
    reward: 10,
  },
  {
    id: 2,
    prompt: "What makes peer-influenced borrowing particularly risky?",
    options: [
      {
        id: "validation",
        label: "It provides social validation and acceptance",
        reflection: "Social validation is temporary and superficial compared to financial consequences. The immediate social approval fades quickly, while debt obligations persist for years. Making financial decisions for social reasons creates the worst combination: temporary social benefits with long-term financial damage.",
        isCorrect: false,
      },
      {
        id: "circumstances",
        label: "Others' financial circumstances rarely match yours",
        reflection: "Correct! Friends have different incomes, expenses, credit scores, and financial obligations. What's manageable for them may be unsustainable for you. Their ability to handle debt doesn't translate to your capacity, making peer-based financial decisions inherently flawed and potentially dangerous.",
        isCorrect: true,
      },
      {
        id: "support",
        label: "Friends will help you manage the payments",
        reflection: "Relying on friends for payment support creates unrealistic expectations and potential relationship strain. Financial obligations are legally your responsibility, and depending on others for debt service is neither reliable nor fair. True financial independence requires making decisions based on your own capability.",
        isCorrect: false,
      },
      {
        id: "trends",
        label: "It follows current popular financial trends",
        reflection: "Popular trends often prioritize appearance over substance and may not align with individual financial realities. Responsible borrowing requires evaluating genuine need and personal capacity rather than following fashionable financial behaviors that may be inappropriate for your specific circumstances and goals.",
        isCorrect: false,
      },
    ],
    reward: 10,
  },
  {
    id: 3,
    prompt: "How should you respond to peer loan recommendations?",
    options: [
      {
        id: "evaluative",
        label: "Evaluate based on your personal financial analysis",
        reflection: "Exactly! Friend recommendations deserve consideration but require thorough personal evaluation. Assess whether their suggestions align with your income, expenses, credit situation, and genuine needs. The final decision should be based on objective financial analysis rather than social influence, ensuring choices serve your best interests.",
        isCorrect: true,
      },
      {
        id: "automatic",
        label: "Consider them automatically since friends care about you",
        reflection: "Care and concern don't substitute for financial expertise or personal suitability. Well-meaning friends may lack understanding of your complete financial picture, risk tolerance, or long-term goals. Their recommendations should be evaluated critically rather than accepted automatically, regardless of good intentions.",
        isCorrect: false,
      },
      
      {
        id: "avoid",
        label: "Avoid discussing finances to prevent awkward conversations",
        reflection: "Avoiding financial discussions prevents valuable learning opportunities and may isolate you from helpful perspectives. The key is having mature conversations where you can politely decline inappropriate suggestions while maintaining relationships. Open dialogue about financial boundaries strengthens rather than weakens friendships.",
        isCorrect: false,
      },
      {
        id: "compromise",
        label: "Compromise between their advice and your comfort level",
        reflection: "Compromise suggests splitting the difference between good advice and poor advice, which isn't prudent. Financial decisions require clear judgment based on objective analysis rather than averaging conflicting recommendations. The goal is making the right choice for your situation, not finding middle ground between suitable and unsuitable options.",
        isCorrect: false,
      },
    ],
    reward: 10,
  },
  {
    id: 4,
    prompt: "What's the smarter approach to peer financial pressure?",
    options: [
      {
        id: "conformity",
        label: "Align your decisions with group norms to fit in",
        reflection: "Financial conformity creates uniform mediocrity rather than individual prosperity. The pressure to fit in financially often leads to debt accumulation and poor money management. Smart approach is developing independent financial judgment while maintaining respectful relationships, prioritizing long-term well-being over temporary social acceptance.",
        isCorrect: false,
      },
      
      {
        id: "deception",
        label: "Hide your financial decisions to avoid discussion",
        reflection: "Secrecy about financial decisions creates distance and prevents genuine friendship development. Transparent communication about financial boundaries, even when saying no to peer suggestions, builds stronger relationships based on mutual respect and understanding rather than surface-level social dynamics.",
        isCorrect: false,
      },
      {
        id: "independent",
        label: "Make independent decisions with polite explanations",
        reflection: "Perfect! Independent decision-making with clear, respectful communication maintains relationships while preserving financial integrity. Explain your reasoning calmly and confidently—most friends respect thoughtful financial boundaries. This approach builds trust through transparency and demonstrates mature financial responsibility.",
        isCorrect: true,
      },
      {
        id: "confrontation",
        label: "Directly confront friends about their financial choices",
        reflection: "Confrontation creates unnecessary conflict and may damage relationships over financial differences. The constructive approach is focusing on your own decisions while respectfully acknowledging that others have different circumstances and perspectives. Healthy friendships accommodate financial diversity without pressure or judgment.",
        isCorrect: false,
      },
    ],
    reward: 10,
  },
  {
    id: 5,
    prompt: "What's the fundamental principle for peer-influenced financial decisions?",
    options: [
      {
        id: "popularity",
        label: "Choose options that maintain social popularity",
        reflection: "Social popularity is fleeting and irrelevant to long-term financial success. The fundamental principle is making decisions based on objective financial analysis rather than social approval. Popular choices may seem attractive short-term but often conflict with individual financial goals and sustainability requirements.",
        isCorrect: false,
      },
      {
        id: "appropriateness",
        label: "Ensure decisions are appropriate for your specific situation",
        reflection: "Exactly! The fundamental principle is situational appropriateness—evaluating whether financial choices align with your income, expenses, goals, and risk tolerance. Individual circumstances vary significantly, making universal peer recommendations potentially harmful. Personal financial decisions must be tailored to individual reality rather than group norms.",
        isCorrect: true,
      },
      {
        id: "consensus",
        label: "Seek consensus among your friend group",
        reflection: "Financial consensus-seeking often leads to lowest-common-denominator decisions that satisfy no one's specific needs optimally. The fundamental principle is individual appropriateness rather than group agreement. Effective financial management requires personalized strategies based on individual circumstances rather than collective compromise.",
        isCorrect: false,
      },
      {
        id: "avoidance",
        label: "Avoid making any decisions that might cause disagreement",
        reflection: "Decision avoidance prevents financial growth and responsibility development. The fundamental principle is making appropriate individual choices while managing social dynamics constructively. Mature relationships accommodate financial differences through respectful communication rather than avoidance of necessary decisions.",
        isCorrect: false,
      },
    ],
    reward: 10,
  },
];

const totalStages = PEER_PRESSURE_LOANS_STAGES.length;
const successThreshold = totalStages;

const PeerPressureLoans = () => {
  const location = useLocation();
  const gameId = "finance-adults-50";
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
      "How can you politely decline peer financial recommendations while maintaining relationships?",
      "What personal financial factors should guide your borrowing decisions regardless of peer influence?",
    ],
    []
  );

  const handleChoice = (option) => {
    if (selectedOption || showResult) return;

    resetFeedback();
    const currentStageData = PEER_PRESSURE_LOANS_STAGES[currentStage];
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
  const stage = PEER_PRESSURE_LOANS_STAGES[Math.min(currentStage, totalStages - 1)];
  const hasPassed = finalScore === successThreshold;

  return (
    <GameShell
      title="Peer Pressure Loans"
      subtitle={subtitle}
      score={coins}
      coins={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      maxScore={PEER_PRESSURE_LOANS_STAGES.length}
      currentLevel={Math.min(currentStage + 1, PEER_PRESSURE_LOANS_STAGES.length)}
      totalLevels={PEER_PRESSURE_LOANS_STAGES.length}
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
            <span>Social Influence</span>
            <span>Independent Judgment</span>
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
                    Skill unlocked: <strong>Financial independence</strong>
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
              Skill unlocked: <strong>Financial independence</strong>
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

export default PeerPressureLoans;