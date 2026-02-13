import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const TIME_MONEY_STAGES = [
  {
    id: 1,
    prompt: "Taking too many gigs leads to:",
    options: [
      {
        id: "faster",
        label: "Faster growth",
        reflection: "While taking on multiple gigs might seem like a way to accelerate growth, overcommitting often leads to decreased quality of work and increased stress, which can actually hinder long-term progress.",
        isCorrect: false,
      },
      
      {
        id: "balance",
        label: "Perfect work-life balance",
        reflection: "Taking on too many gigs typically disrupts work-life balance rather than improving it. The key is finding a sustainable number of commitments that allows for quality work and personal time.",
        isCorrect: false,
      },
      {
        id: "opportunity",
        label: "More networking opportunities",
        reflection: "While multiple gigs might offer more networking opportunities, spreading yourself too thin can prevent you from building meaningful relationships or delivering quality work that leads to genuine professional connections.",
        isCorrect: false,
      },
      {
        id: "burnout",
        label: "Burnout and poor performance",
        reflection: "Exactly! Taking on too many gigs without proper time management leads to exhaustion, decreased productivity, and ultimately poor performance across all commitments.",
        isCorrect: true,
      },
    ],
    reward: 15,
  },
  {
    id: 2,
    prompt: "How should you prioritize your time when managing multiple income sources?",
    options: [
      {
        id: "maximize",
        label: "Maximize the number of gigs to increase total income",
        reflection: "Focusing solely on quantity over quality often leads to burnout and decreased performance. It's better to focus on a manageable number of high-quality commitments.",
        isCorrect: false,
      },
      {
        id: "quality",
        label: "Focus on quality and sustainable workload",
        reflection: "Perfect! Prioritizing quality work and maintaining a sustainable workload ensures better performance, reduces stress, and protects your long-term earning ability.",
        isCorrect: true,
      },
      {
        id: "random",
        label: "Accept every opportunity that comes your way",
        reflection: "Accepting every opportunity without consideration leads to overcommitment and poor time management. Strategic selection of opportunities is key to sustainable success.",
        isCorrect: false,
      },
      {
        id: "avoid",
        label: "Avoid all additional income sources to prevent stress",
        reflection: "Completely avoiding additional income sources can limit growth opportunities. The goal is to find a balance that allows for growth without compromising well-being.",
        isCorrect: false,
      },
    ],
    reward: 15,
  },
  {
    id: 3,
    prompt: "What is the impact of consistently overworking on your career?",
    options: [
      {
        id: "accelerate",
        label: "Accelerates career advancement",
        reflection: "While hard work is important, consistently overworking leads to burnout, decreased productivity, and potential health issues that can actually hinder career advancement in the long run.",
        isCorrect: false,
      },
      
      {
        id: "no-impact",
        label: "Has no significant impact on career trajectory",
        reflection: "Overworking consistently has a significant negative impact on career trajectory through decreased performance, increased error rates, and potential health issues that affect long-term productivity.",
        isCorrect: false,
      },
      {
        id: "sustainable",
        label: "Creates sustainable long-term career growth",
        reflection: "Exactly! Consistent, sustainable effort over time leads to better career growth than short-term bursts of overwork that lead to burnout and decreased performance.",
        isCorrect: true,
      },
      {
        id: "immediate",
        label: "Provides immediate benefits with no long-term consequences",
        reflection: "Overworking may provide short-term benefits but typically leads to long-term consequences such as burnout, decreased job satisfaction, and potential career setbacks due to poor performance.",
        isCorrect: false,
      },
    ],
    reward: 15,
  },
  {
    id: 4,
    prompt: "How does proper time management affect your earning potential?",
    options: [
      {
        id: "enhance",
        label: "Enhances earning potential through improved performance",
        reflection: "Exactly! Good time management leads to higher quality work, better relationships, and sustained productivity, all of which enhance long-term earning potential and career advancement opportunities.",
        isCorrect: true,
      },
      {
        id: "limit",
        label: "Limits earning potential by reducing available work hours",
        reflection: "Proper time management actually enhances earning potential by improving work quality, reducing errors, and preventing burnout that would limit long-term productivity and career advancement.",
        isCorrect: false,
      },
      
      {
        id: "no-effect",
        label: "Has no effect on earning potential",
        reflection: "Time management significantly affects earning potential through its impact on work quality, productivity, and career advancement opportunities. Poor time management can severely limit earning potential.",
        isCorrect: false,
      },
      {
        id: "reduce",
        label: "Reduces earning potential by creating unnecessary boundaries",
        reflection: "Setting appropriate boundaries through good time management actually increases earning potential by preventing burnout and maintaining high performance levels over the long term.",
        isCorrect: false,
      },
    ],
    reward: 15,
  },
  {
    id: 5,
    prompt: "What is the key to maintaining long-term earning ability?",
    options: [
      {
        id: "maximize-now",
        label: "Maximize current income at all costs",
        reflection: "Maximizing current income at all costs often leads to burnout and decreased long-term earning ability. Sustainable growth requires balancing current opportunities with long-term career health.",
        isCorrect: false,
      },
      
      {
        id: "minimize-effort",
        label: "Minimize effort to avoid stress",
        reflection: "Minimizing effort to avoid stress can limit career growth and earning potential. The key is finding an optimal level of effort that maximizes results while maintaining sustainability.",
        isCorrect: false,
      },
      {
        id: "constant-hustle",
        label: "Constant hustle and overcommitment",
        reflection: "Constant hustle and overcommitment lead to burnout and decreased performance over time. Sustainable success requires strategic effort and proper time management rather than constant overwork.",
        isCorrect: false,
      },
      {
        id: "balance",
        label: "Balance current opportunities with sustainable practices",
        reflection: "Exactly! Maintaining long-term earning ability requires finding a balance between taking advantage of current opportunities and implementing sustainable practices that protect your health and career trajectory.",
        isCorrect: true,
      },
    ],
    reward: 15,
  },
];

const totalStages = TIME_MONEY_STAGES.length;
const successThreshold = totalStages;

const TimeVsMoneyTradeoff = () => {
  const location = useLocation();
  const gameId = "finance-young-adult-74";
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
      "How can you determine the optimal number of commitments for your situation?",
      "What strategies help you maintain quality work while managing multiple income sources?",
    ],
    []
  );

  const handleChoice = (option) => {
    if (selectedOption || showResult) return;

    resetFeedback();
    const currentStageData = TIME_MONEY_STAGES[currentStage];
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
  const stage = TIME_MONEY_STAGES[Math.min(currentStage, totalStages - 1)];
  const hasPassed = finalScore === successThreshold;

  return (
    <GameShell
      title="Time vs Money Trade-off"
      subtitle={subtitle}
      score={coins}
      coins={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      maxScore={TIME_MONEY_STAGES.length}
      currentLevel={Math.min(currentStage + 1, TIME_MONEY_STAGES.length)}
      totalLevels={TIME_MONEY_STAGES.length}
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
            <span>Time Management</span>
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
                    Skill unlocked: <strong>Time management strategy</strong>
                  </p>
                  <p className="text-base text-green-400 font-semibold mt-4">
                    Outcome: Balance protects long-term earning ability.
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
              Skill unlocked: <strong>Time management strategy</strong>
            </p>
            <p className="text-base text-green-400 font-semibold">
              Balance protects long-term earning ability.
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

export default TimeVsMoneyTradeoff;