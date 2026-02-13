import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const BORROWING_FOR_WANTS_STAGES = [
  {
    id: 1,
    prompt: "Is it wise to borrow for luxury spending?",
    options: [
      {
        id: "no",
        label: "No, it creates unnecessary debt and long-term stress",
        reflection: "Exactly! Borrowing for wants means paying interest on items that provide temporary satisfaction while creating lasting financial obligations. The debt burden reduces your ability to save, invest, and handle genuine needs, turning short-term pleasure into long-term financial stress.",
        isCorrect: true,
      },
      {
        id: "yes",
        label: "Yes, it helps me enjoy life now",
        reflection: "Actually, borrowing for luxury creates long-term financial stress. The temporary enjoyment comes at the cost of ongoing debt obligations, interest payments, and reduced financial flexibility that can last for years, ultimately diminishing rather than enhancing your quality of life.",
        isCorrect: false,
      },
      
      {
        id: "sometimes",
        label: "Sometimes, if I can afford the payments easily",
        reflection: "Even affordable payments for non-essentials create problematic financial habits. The ability to make payments doesn't eliminate the fundamental issue that you're using debt to fund lifestyle rather than building wealth, creating a cycle of consumption debt that undermines long-term financial security.",
        isCorrect: false,
      },
      {
        id: "investment",
        label: "Yes, luxury purchases are investments in happiness",
        reflection: "Luxury items depreciate in value rather than appreciate, making them poor financial investments. Unlike productive assets that generate returns, luxury purchases represent consumption that loses value over time while the debt obligation continues, creating negative net worth impact.",
        isCorrect: false,
      },
    ],
    reward: 10,
  },
  {
    id: 2,
    prompt: "What happens when you borrow for non-essential purchases?",
    options: [
      {
        id: "freedom",
        label: "You gain financial freedom and flexibility",
        reflection: "Borrowing for wants actually reduces financial freedom by creating mandatory payment obligations. The debt commitment limits your ability to make other financial decisions, redirects income toward debt service rather than wealth building, and creates ongoing financial pressure that constrains rather than enhances flexibility.",
        isCorrect: false,
      },
      
      {
        id: "builds",
        label: "It builds credit history and improves borrowing capacity",
        reflection: "While credit usage can help build history, borrowing for wants creates the wrong type of credit pattern. Lenders prefer to see responsible borrowing for productive purposes rather than consumption debt. This approach can actually harm your credit profile by demonstrating poor financial judgment and over-leverage.",
        isCorrect: false,
      },
      {
        id: "manageable",
        label: "The costs are manageable if spread over time",
        reflection: "Spreading costs over time through installment payments doesn't make unnecessary debt wise—it just makes the financial damage less immediately painful. The total cost including interest remains higher than saving and paying cash, while you lose the opportunity to invest those funds productively during the repayment period.",
        isCorrect: false,
      },
      {
        id: "obligation",
        label: "You create ongoing payment obligations for temporary satisfaction",
        reflection: "Correct! Non-essential borrowing means you're legally committed to making payments for items that provided fleeting enjoyment. The permanent financial obligation for temporary pleasure creates a mismatch where long-term costs far exceed short-term benefits, undermining financial stability and future opportunities.",
        isCorrect: true,
      },
    ],
    reward: 10,
  },
  {
    id: 3,
    prompt: "How does want-based borrowing affect your financial priorities?",
    options: [
      {
        id: "enhances",
        label: "Enhances ability to focus on important financial goals",
        reflection: "Want-based borrowing actually distracts from important financial goals by consuming income and mental energy. The debt payments reduce available resources for genuine needs, emergency savings, and wealth building, while the psychological burden of unnecessary debt creates stress that impedes clear financial decision-making.",
        isCorrect: false,
      },
      
      {
        id: "neutral",
        label: "Has minimal impact on long-term financial planning",
        reflection: "Want-based borrowing creates significant long-term impacts by establishing poor financial habits and creating ongoing obligations. The debt burden affects cash flow, credit utilization, and financial flexibility for years, while the pattern of using debt for consumption undermines disciplined financial planning and wealth accumulation strategies.",
        isCorrect: false,
      },
      {
        id: "distorts",
        label: "Distorts priorities by shifting focus to debt service",
        reflection: "Exactly! When you borrow for wants, debt payments become a priority that competes with essential expenses, savings goals, and investment opportunities. The financial and psychological burden of unnecessary debt obligations crowds out more important financial objectives and creates ongoing stress about meeting payment requirements.",
        isCorrect: true,
      },
      {
        id: "motivates",
        label: "Motivates better money management to handle payments",
        reflection: "While debt payments may encourage some budgeting, they create the wrong motivation—managing debt rather than building wealth. The focus becomes debt avoidance rather than proactive financial growth, and the stress of unnecessary obligations often leads to poor financial decisions rather than improved money management skills.",
        isCorrect: false,
      },
    ],
    reward: 10,
  },
  {
    id: 4,
    prompt: "What's the smarter approach to luxury purchases?",
    options: [
      {
        id: "borrow",
        label: "Borrow to get what you want immediately",
        reflection: "Immediate gratification through borrowing creates long-term financial problems. The temporary satisfaction comes at enormous cost—ongoing payments, interest charges, and reduced financial flexibility—that can persist long after the purchased item loses its appeal or becomes obsolete.",
        isCorrect: false,
      },
      {
        id: "save",
        label: "Save and pay cash when you can truly afford it",
        reflection: "Perfect! Saving for luxury items ensures you only purchase what you can genuinely afford without creating debt burdens. This approach builds discipline, provides true ownership without ongoing obligations, and maintains financial flexibility for genuine needs and opportunities while you save.",
        isCorrect: true,
      },
      {
        id: "installments",
        label: "Use installment plans to spread the cost",
        reflection: "Installment plans for non-essentials still represent consumption debt with interest costs and ongoing obligations. While payments may seem manageable, you're still using future income to fund present consumption, creating the same fundamental problem of debt-financed lifestyle rather than building financial capacity.",
        isCorrect: false,
      },
      {
        id: "credit",
        label: "Put it on credit cards and pay minimums",
        reflection: "Credit card minimum payments for luxury items create the worst of both worlds—high interest rates and prolonged debt obligations. The minimum payment trap means you pay mostly interest while the debt persists, turning temporary purchases into long-term financial drains that compound rather than solve financial challenges.",
        isCorrect: false,
      },
    ],
    reward: 10,
  },
  {
    id: 5,
    prompt: "What's the fundamental problem with borrowing for wants?",
    options: [
      {
        id: "unsustainable",
        label: "Creates unsustainable consumption funded by future income",
        reflection: "Exactly! Borrowing for wants means living beyond your current means by pledging future income to fund present consumption. This creates an unsustainable cycle where debt obligations grow faster than income, financial stress increases over time, and genuine financial security becomes increasingly difficult to achieve.",
        isCorrect: true,
      },
      {
        id: "approval",
        label: "Difficulty getting loan approval for luxury items",
        reflection: "Approval availability isn't the fundamental problem—many lenders readily provide financing for consumer goods. The core issue is the financial unsoundness of using debt to fund non-essential purchases, regardless of approval ease, because it creates unsustainable consumption patterns and long-term financial obligations for temporary benefits.",
        isCorrect: false,
      },
      
      {
        id: "interest",
        label: "Higher interest rates on consumer loans",
        reflection: "While interest rates matter, they're secondary to the fundamental problem. The core issue is using debt to fund consumption rather than productive purposes. Even low-rate borrowing for wants represents poor financial allocation since you're paying to maintain lifestyle rather than investing in assets or opportunities that build wealth.",
        isCorrect: false,
      },
      {
        id: "availability",
        label: "Limited availability of want-financing options",
        reflection: "Want-financing is actually widely available through credit cards, personal loans, and store financing. The fundamental problem isn't availability—it's the financial wisdom of using readily available credit to fund consumption rather than needs, creating debt obligations for temporary satisfaction that undermine long-term financial health.",
        isCorrect: false,
      },
    ],
    reward: 10,
  },
];

const totalStages = BORROWING_FOR_WANTS_STAGES.length;
const successThreshold = totalStages;

const BorrowingForWants = () => {
  const location = useLocation();
  const gameId = "finance-adults-48";
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
      "How can you distinguish between needs and wants in financial decisions?",
      "What saving strategies help you purchase luxuries without debt?",
    ],
    []
  );

  const handleChoice = (option) => {
    if (selectedOption || showResult) return;

    resetFeedback();
    const currentStageData = BORROWING_FOR_WANTS_STAGES[currentStage];
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
  const stage = BORROWING_FOR_WANTS_STAGES[Math.min(currentStage, totalStages - 1)];
  const hasPassed = finalScore === successThreshold;

  return (
    <GameShell
      title="Borrowing for Wants"
      subtitle={subtitle}
      score={coins}
      coins={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      maxScore={BORROWING_FOR_WANTS_STAGES.length}
      currentLevel={Math.min(currentStage + 1, BORROWING_FOR_WANTS_STAGES.length)}
      totalLevels={BORROWING_FOR_WANTS_STAGES.length}
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
            <span>Consumption Debt</span>
            <span>Luxury Financing</span>
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
                    Skill unlocked: <strong>Disciplined consumption planning</strong>
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
              Skill unlocked: <strong>Disciplined consumption planning</strong>
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

export default BorrowingForWants;