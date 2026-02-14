import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const FIRST_JOB_STAGES = [
  {
    id: 1,
    prompt: "First jobs usually offer:",
    options: [
      {
        id: "high-pay",
        label: "High pay immediately",
        reflection: "First jobs typically don't offer high immediate pay. They're designed to provide learning opportunities and entry-level experience rather than premium compensation.",
        isCorrect: false,
      },
      
      {
        id: "leadership",
        label: "Leadership responsibilities",
        reflection: "Leadership roles typically come after gaining sufficient experience. First jobs are usually about learning the ropes, not leading others.",
        isCorrect: false,
      },
      {
        id: "perks",
        label: "Extensive benefits and perks",
        reflection: "While some companies offer good benefits, first jobs often have limited perks compared to more senior positions. The focus is usually on growth opportunities.",
        isCorrect: false,
      },
      {
        id: "learning-experience",
        label: "Learning and experience first",
        reflection: "Exactly! First jobs are primarily about gaining experience, building skills, and understanding your industry. The learning value often outweighs the immediate pay.",
        isCorrect: true,
      },
    ],
    reward: 15,
  },
  {
    id: 2,
    prompt: "What should be your primary focus in your first job?",
    options: [
      {
        id: "salary",
        label: "Maximizing immediate salary",
        reflection: "While salary is important, focusing solely on immediate pay in your first job can limit long-term career growth. The experience and skills you gain are often more valuable.",
        isCorrect: false,
      },
      {
        id: "skills",
        label: "Developing skills and competencies",
        reflection: "Perfect! Building skills and competencies in your first job creates the foundation for future career advancement and higher earning potential.",
        isCorrect: true,
      },
      {
        id: "title",
        label: "Getting the best job title",
        reflection: "Job titles are less important than actual experience and skills. A prestigious title without real growth opportunities won't advance your career effectively.",
        isCorrect: false,
      },
      {
        id: "office",
        label: "Finding the most comfortable office environment",
        reflection: "While a good work environment matters, it shouldn't be the primary consideration. Focus on growth opportunities and learning experiences first.",
        isCorrect: false,
      },
    ],
    reward: 15,
  },
  {
    id: 3,
    prompt: "How should you evaluate the value of your first job?",
    options: [
       {
        id: "growth",
        label: "Based on growth opportunities and learning",
        reflection: "Exactly! The growth opportunities, mentorship, and skills development in your first job are investments in your future career and earning potential.",
        isCorrect: true,
      },
      {
        id: "pay-only",
        label: "Based solely on the paycheck amount",
        reflection: "Evaluating only by pay misses the bigger picture. The skills, network, and experience you gain often provide much greater long-term value than immediate compensation.",
        isCorrect: false,
      },
     
      {
        id: "hours",
        label: "Based on the number of hours worked",
        reflection: "While work-life balance is important, the quality of work and learning opportunities matter more than just the number of hours you put in.",
        isCorrect: false,
      },
      {
        id: "location",
        label: "Based on the office location convenience",
        reflection: "Location convenience is a factor, but it shouldn't be the primary measure of your first job's value. Consider the long-term career benefits more importantly.",
        isCorrect: false,
      },
    ],
    reward: 15,
  },
  {
    id: 4,
    prompt: "What is the relationship between first job experience and future income?",
    options: [
      {
        id: "no-relationship",
        label: "There is no relationship between them",
        reflection: "There is a strong positive relationship. The experience, skills, and network you build in your first job directly impact your future earning potential and career advancement.",
        isCorrect: false,
      },
      {
        id: "strong-relationship",
        label: "Early experience builds future income",
        reflection: "Exactly! The foundation you build in your first job through experience, skills, and professional relationships compounds over time to create significant future income growth.",
        isCorrect: true,
      },
      {
        id: "negative",
        label: "First job experience reduces future income",
        reflection: "This is incorrect. First job experience typically enhances rather than reduces future income potential by building essential skills and professional networks.",
        isCorrect: false,
      },
      {
        id: "random",
        label: "The relationship is completely random",
        reflection: "While individual outcomes vary, there's a clear pattern that quality first job experiences lead to better long-term career prospects and higher income potential.",
        isCorrect: false,
      },
    ],
    reward: 15,
  },
  {
    id: 5,
    prompt: "What should you prioritize when choosing your first job?",
    options: [
      {
        id: "highest-pay",
        label: "The company offering the highest immediate pay",
        reflection: "While competitive pay is important, it shouldn't be the sole deciding factor. Consider the learning opportunities, mentorship, and long-term growth potential more heavily.",
        isCorrect: false,
      },
      
      {
        id: "easiest",
        label: "The easiest job with minimal responsibilities",
        reflection: "Choosing the easiest path initially may limit your growth. Challenging opportunities with good learning potential are better investments in your future career.",
        isCorrect: false,
      },
      {
        id: "closest",
        label: "The job closest to your home",
        reflection: "While commute time matters for work-life balance, it shouldn't be the primary factor in choosing your first job. Career growth opportunities should take precedence.",
        isCorrect: false,
      },
      {
        id: "best-learning",
        label: "The opportunity with the best learning potential",
        reflection: "Exactly! Prioritizing learning potential in your first job sets you up for long-term success. The skills and experience gained will compound throughout your career.",
        isCorrect: true,
      },
    ],
    reward: 15,
  },
];

const totalStages = FIRST_JOB_STAGES.length;
const successThreshold = totalStages;

const FirstJobReality = () => {
  const location = useLocation();
  const gameId = "finance-young-adult-72";
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
      "What skills from your first job will be most valuable throughout your career?",
      "How can you maximize the learning opportunities in your first professional role?",
    ],
    []
  );

  const handleChoice = (option) => {
    if (selectedOption || showResult) return;

    resetFeedback();
    const currentStageData = FIRST_JOB_STAGES[currentStage];
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
  const stage = FIRST_JOB_STAGES[Math.min(currentStage, totalStages - 1)];
  const hasPassed = finalScore === successThreshold;

  return (
    <GameShell
      title="First Job Reality"
      subtitle={subtitle}
      score={showResult ? finalScore : coins}
      coins={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      maxScore={FIRST_JOB_STAGES.length}
      currentLevel={Math.min(currentStage + 1, FIRST_JOB_STAGES.length)}
      totalLevels={FIRST_JOB_STAGES.length}
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
            <span>First Job</span>
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
                    Skill unlocked: <strong>First job value assessment</strong>
                  </p>
                  <p className="text-base text-green-400 font-semibold mt-4">
                    Outcome: Early experience builds future income.
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
              Skill unlocked: <strong>First job value assessment</strong>
            </p>
            <p className="text-base text-green-400 font-semibold">
              Early experience builds future income.
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

export default FirstJobReality;