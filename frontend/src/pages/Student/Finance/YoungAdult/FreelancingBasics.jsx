import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const FREELANCING_STAGES = [
  {
    id: 1,
    prompt: "What matters most in freelancing?",
    options: [
      {
        id: "low-pricing",
        label: "Low pricing",
        reflection: "While competitive pricing is important, focusing solely on low prices can lead to undervaluing your work and attracting clients who only care about cost rather than quality. This approach often results in poor project experiences and limited growth opportunities.",
        isCorrect: false,
      },
      
      {
        id: "speed",
        label: "Speed over everything",
        reflection: "While efficiency is valuable, prioritizing speed over quality often leads to mistakes, revisions, and dissatisfied clients. The best approach balances reasonable timelines with high-quality deliverables.",
        isCorrect: false,
      },
      {
        id: "reliability-quality",
        label: "Reliability and quality",
        reflection: "Exactly! Reliability and quality are the foundation of successful freelancing. Clients value professionals who deliver consistent, high-quality work on time, which leads to positive reviews, repeat business, and referrals.",
        isCorrect: true,
      },
      {
        id: "availability",
        label: "Being available 24/7",
        reflection: "While responsiveness is important, being available around the clock can lead to burnout and decreased quality of work. Setting clear boundaries and reasonable response times is healthier for both you and your clients.",
        isCorrect: false,
      },
    ],
    reward: 15,
  },
  {
    id: 2,
    prompt: "How should you handle client feedback and revisions?",
    options: [
      {
        id: "ignore",
        label: "Ignore feedback to maintain your artistic vision",
        reflection: "Ignoring client feedback can lead to deliverables that don't meet client expectations and damaged professional relationships. Successful freelancers balance their expertise with client needs and preferences.",
        isCorrect: false,
      },
     
      {
        id: "unlimited",
        label: "Accept unlimited revisions for any price",
        reflection: "Accepting unlimited revisions without proper boundaries can lead to scope creep and financial losses. Professional freelancers set clear revision policies and communicate them upfront to protect both parties.",
        isCorrect: false,
      },
      {
        id: "reject",
        label: "Reject all revision requests immediately",
        reflection: "Rejecting all revision requests can damage client relationships and lead to negative reviews. Reasonable revisions are part of professional service, but they should be within agreed-upon parameters.",
        isCorrect: false,
      },
       {
        id: "collaborate",
        label: "Collaborate professionally on reasonable revisions",
        reflection: "Perfect! Professional collaboration on revisions shows respect for the client's vision while maintaining the quality of your work. Clear communication about revision limits and additional costs helps manage expectations.",
        isCorrect: true,
      },
    ],
    reward: 15,
  },
  {
    id: 3,
    prompt: "What is the best approach to building a freelance portfolio?",
    options: [
      {
        id: "quantity",
        label: "Focus on quantity over quality to show experience",
        reflection: "While having multiple examples is beneficial, a portfolio filled with low-quality work can harm your reputation. Clients are more impressed by a few excellent pieces that demonstrate your skills and professionalism.",
        isCorrect: false,
      },
      {
        id: "quality",
        label: "Showcase quality work that demonstrates your skills",
        reflection: "Exactly! A portfolio of high-quality work that showcases your best skills and diverse capabilities attracts better clients and commands higher rates. Quality always trumps quantity in professional portfolios.",
        isCorrect: true,
      },
      {
        id: "everything",
        label: "Include every project you've ever worked on",
        reflection: "Including every project, especially those with poor outcomes or that don't represent your current skill level, can dilute the impact of your portfolio. Curate your best work to make the strongest impression.",
        isCorrect: false,
      },
      {
        id: "generic",
        label: "Use generic descriptions for all projects",
        reflection: "Generic descriptions don't help potential clients understand your specific skills and the value you bring. Detailed, specific descriptions of your role and achievements in each project are much more effective.",
        isCorrect: false,
      },
    ],
    reward: 15,
  },
  {
    id: 4,
    prompt: "How important is communication with freelance clients?",
    options: [
       {
        id: "clear",
        label: "Maintain clear, regular communication",
        reflection: "Exactly! Clear, regular communication builds trust, prevents misunderstandings, and keeps projects on track. Proactive updates and prompt responses to client inquiries are hallmarks of professional freelancers.",
        isCorrect: true,
      },
      {
        id: "minimal",
        label: "Keep communication minimal to focus on work",
        reflection: "Minimal communication can lead to misunderstandings, missed expectations, and project delays. Regular, clear communication is essential for successful freelance relationships and client satisfaction.",
        isCorrect: false,
      },
     
      {
        id: "excessive",
        label: "Communicate excessively about every small detail",
        reflection: "While communication is important, excessive updates about minor details can overwhelm clients and waste time. Focus on communicating key milestones, important updates, and addressing client concerns promptly.",
        isCorrect: false,
      },
      {
        id: "formal",
        label: "Use only formal communication channels",
        reflection: "While professionalism is important, the communication method should match client preferences and project needs. The key is consistency and clarity, not necessarily formality in every interaction.",
        isCorrect: false,
      },
    ],
    reward: 15,
  },
  {
    id: 5,
    prompt: "What is the key to sustainable freelancing success?",
    options: [
      {
        id: "undercut",
        label: "Always undercut competitors on price",
        reflection: "Consistently undercutting competitors leads to a race to the bottom that harms the entire industry and devalues your work. Sustainable success comes from demonstrating value and building long-term client relationships.",
        isCorrect: false,
      },
      
      {
        id: "availability",
        label: "Take on as many projects as possible",
        reflection: "Taking on too many projects leads to burnout, decreased quality, and missed deadlines. Sustainable success requires managing workload effectively to maintain quality and client satisfaction.",
        isCorrect: false,
      },
      {
        id: "quick",
        label: "Focus only on quick, easy projects",
        reflection: "Focusing only on quick, easy projects limits growth opportunities and skill development. Sustainable success involves challenging yourself with diverse projects that build your expertise and portfolio.",
        isCorrect: false,
      },
      {
        id: "reputation",
        label: "Build a strong reputation for reliability",
        reflection: "Exactly! Reputation creates repeat income. A strong reputation for reliability, quality work, and professional communication leads to repeat clients, referrals, and the ability to command fair rates for your expertise.",
        isCorrect: true,
      },
    ],
    reward: 15,
  },
];

const totalStages = FREELANCING_STAGES.length;
const successThreshold = totalStages;

const FreelancingBasics = () => {
  const location = useLocation();
  const gameId = "finance-young-adult-75";
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
      "How can you demonstrate reliability and quality in your freelance work?",
      "What strategies help build a strong reputation in freelancing?",
    ],
    []
  );

  const handleChoice = (option) => {
    if (selectedOption || showResult) return;

    resetFeedback();
    const currentStageData = FREELANCING_STAGES[currentStage];
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
  const stage = FREELANCING_STAGES[Math.min(currentStage, totalStages - 1)];
  const hasPassed = finalScore === successThreshold;

  return (
    <GameShell
      title="Freelancing Basics"
      subtitle={subtitle}
      score={coins}
      coins={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      maxScore={FREELANCING_STAGES.length}
      currentLevel={Math.min(currentStage + 1, FREELANCING_STAGES.length)}
      totalLevels={FREELANCING_STAGES.length}
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
            <span>Freelancing</span>
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
                    Skill unlocked: <strong>Freelancing fundamentals</strong>
                  </p>
                  <p className="text-base text-green-400 font-semibold mt-4">
                    Outcome: Reputation creates repeat income.
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
              Skill unlocked: <strong>Freelancing fundamentals</strong>
            </p>
            <p className="text-base text-green-400 font-semibold">
              Reputation creates repeat income.
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

export default FreelancingBasics;