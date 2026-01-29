import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const SKILLS_INCOME_STAGES = [
  {
    id: 1,
    prompt: "What mostly determines earning potential?",
    options: [
      {
        id: "luck",
        label: "Luck alone",
        reflection: "While luck can play a role in opportunities, relying solely on luck is not a sustainable strategy for building long-term earning potential. Success typically requires effort and skill development.",
        isCorrect: false,
      },
      {
        id: "skills",
        label: "Skills and effort over time",
        reflection: "Exactly! Skills compound income. The more you develop your abilities and work consistently, the more valuable you become in the marketplace, leading to higher earning potential.",
        isCorrect: true,
      },
      {
        id: "connections",
        label: "Connections and networking only",
        reflection: "While networking is valuable, it's not sufficient on its own. Strong skills and consistent effort are what make you genuinely valuable to employers and clients over the long term.",
        isCorrect: false,
      },
      {
        id: "inheritance",
        label: "Inheritance or family wealth",
        reflection: "Inheritance can provide a financial head start, but it doesn't determine your earning potential from work. Your skills and effort are what you can control to build sustainable income.",
        isCorrect: false,
      },
    ],
    reward: 15,
  },
  {
    id: 2,
    prompt: "How do skills impact your career progression?",
    options: [
      {
        id: "stagnant",
        label: "They keep you in the same position",
        reflection: "Skills are the key to career advancement. Without developing new abilities and improving existing ones, you're likely to remain stagnant while others who invest in their skills move ahead.",
        isCorrect: false,
      },
      
      {
        id: "irrelevant",
        label: "They become irrelevant quickly",
        reflection: "While some specific skills may become outdated, the ability to learn and adapt is itself a valuable skill. Core competencies and learning abilities remain relevant throughout your career.",
        isCorrect: false,
      },
      {
        id: "growth",
        label: "They unlock new opportunities and higher pay",
        reflection: "Perfect! As you develop skills, you become more valuable to employers, qualify for promotions, and can command higher salaries. Skills are the foundation of career growth.",
        isCorrect: true,
      },
      {
        id: "automatic",
        label: "They automatically lead to promotions",
        reflection: "Skills alone don't guarantee automatic promotions. You also need to demonstrate your abilities, take initiative, and sometimes seek out opportunities to apply your enhanced skills.",
        isCorrect: false,
      },
    ],
    reward: 15,
  },
  {
    id: 3,
    prompt: "What is the relationship between investment in skills and income?",
    options: [
      {
        id: "no",
        label: "There is no relationship",
        reflection: "There's a strong positive correlation between skill investment and income. The more you invest in developing your abilities, the more valuable you become and the higher your earning potential.",
        isCorrect: false,
      },
     
      {
        id: "negative",
        label: "Investing in skills decreases income",
        reflection: "Investing in skills requires time and sometimes money upfront, but it typically pays dividends through higher income, better opportunities, and increased job security over time.",
        isCorrect: false,
      },
      {
        id: "random",
        label: "The relationship is completely random",
        reflection: "While there can be some variability based on industry and timing, the general trend is clear: skill investment leads to increased earning potential across most career paths.",
        isCorrect: false,
      },
       {
        id: "positive",
        label: "Investing in skills typically increases income over time",
        reflection: "Exactly! Like compound interest in finance, investing in skills compounds your income potential. Each new skill builds on previous ones, creating exponential value over your career.",
        isCorrect: true,
      },
    ],
    reward: 15,
  },
  {
    id: 4,
    prompt: "How should you approach skill development for maximum income impact?",
    options: [
      {
        id: "strategic",
        label: "Strategically develop high-value skills",
        reflection: "Perfect! Identifying and developing skills that are in demand, align with your career goals, and complement your existing strengths maximizes your return on investment in learning.",
        isCorrect: true,
      },
      {
        id: "random",
        label: "Learn whatever seems interesting",
        reflection: "While learning what interests you can be motivating, focusing on skills that are in demand in your field or desired career path will have a more direct impact on your earning potential.",
        isCorrect: false,
      },
      
      {
        id: "avoid",
        label: "Avoid learning new skills to save time",
        reflection: "In today's rapidly changing economy, avoiding skill development can actually hurt your career prospects. Continuous learning is essential for maintaining and growing your earning potential.",
        isCorrect: false,
      },
      {
        id: "quantity",
        label: "Focus on learning many skills superficially",
        reflection: "While having broad knowledge can be helpful, depth in key areas typically has more impact on income than surface-level knowledge across many topics. Prioritize depth over breadth.",
        isCorrect: false,
      },
    ],
    reward: 15,
  },
  {
    id: 5,
    prompt: "What is the long-term benefit of consistent skill building?",
    options: [
      {
        id: "limited",
        label: "Limited to your current job role",
        reflection: "Skills are transferable assets. The abilities you develop often apply across different roles, industries, and career stages, providing long-term value beyond any single position.",
        isCorrect: false,
      },
      {
        id: "compounding",
        label: "Creates compounding advantages throughout your career",
        reflection: "Exactly! Skills compound income. Each new skill enhances your existing capabilities, making you more valuable and opening up new opportunities. This creates a snowball effect over time.",
        isCorrect: true,
      },
      {
        id: "obsolete",
        label: "Becomes obsolete as you age",
        reflection: "While specific technical skills may evolve, the core competencies of critical thinking, problem-solving, and adaptability become more valuable with experience. Your accumulated skills are assets, not liabilities.",
        isCorrect: false,
      },
      {
        id: "diminishing",
        label: "Provides diminishing returns over time",
        reflection: "The opposite is typically true. As you build a foundation of skills, each new addition becomes easier and more valuable, creating increasing returns rather than diminishing ones.",
        isCorrect: false,
      },
    ],
    reward: 15,
  },
];

const totalStages = SKILLS_INCOME_STAGES.length;
const successThreshold = totalStages;

const IncomeComesFromSkills = () => {
  const location = useLocation();
  const gameId = "finance-young-adult-71";
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
      "Which skills in your field have the highest earning potential?",
      "How can you strategically invest time in skill development for maximum career impact?",
    ],
    []
  );

  const handleChoice = (option) => {
    if (selectedOption || showResult) return;

    resetFeedback();
    const currentStageData = SKILLS_INCOME_STAGES[currentStage];
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
  const stage = SKILLS_INCOME_STAGES[Math.min(currentStage, totalStages - 1)];
  const hasPassed = finalScore === successThreshold;

  return (
    <GameShell
      title="Income Comes from Skills"
      subtitle={subtitle}
      score={coins}
      coins={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      maxScore={SKILLS_INCOME_STAGES.length}
      currentLevel={Math.min(currentStage + 1, SKILLS_INCOME_STAGES.length)}
      totalLevels={SKILLS_INCOME_STAGES.length}
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
            <span>Skill Development</span>
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
                        { stageId: SKILLS_INCOME_STAGES[currentStage].id, isCorrect: SKILLS_INCOME_STAGES[currentStage].options.find(opt => opt.id === selectedOption)?.isCorrect },
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
                    Skill unlocked: <strong>Strategic skill development</strong>
                  </p>
                  <p className="text-base text-green-400 font-semibold mt-4">
                    Outcome: Skills compound income.
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
              Skill unlocked: <strong>Strategic skill development</strong>
            </p>
            <p className="text-base text-green-400 font-semibold">
              Skills compound income.
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

export default IncomeComesFromSkills;