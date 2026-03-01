import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion"; // eslint-disable-line no-unused-vars
import { Trophy } from "lucide-react";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const CAREER_QUIZ_STAGES = [
  {
    id: 1,
    prompt: "You work daily but feel your job is only for income. What should be your primary focus for long-term growth?",
    options: [
      {
        id: "a",
        label: "Focus only on the salary",
        reflection: "While salary is important, focusing only on it can lead to stagnation. Building skills is the key to a true career.",
        isCorrect: false,
      },
      {
        id: "b",
        label: "Build long-term skills",
        reflection: "Correct! Investing in your skills turns a 'job' into a stepping stone for a career.",
        isCorrect: true,
      },
      {
        id: "c",
        label: "Wait for a promotion to learn new things",
        reflection: "Waiting for a promotion before learning limits your growth. Career-builders learn first to earn the promotion later.",
        isCorrect: false,
      },
      {
        id: "d",
        label: "Avoid extra work that doesn't pay immediately",
        reflection: "While boundaries are good, avoiding all extra work can mean missing out on high-value skill development opportunities.",
        isCorrect: false,
      }
    ],
  },
  {
    id: 2,
    prompt: "What is the core difference between a 'job' mindset and a 'career' mindset?",
    options: [
      {
        id: "a",
        label: "A job is for immediate pay; a career is for growth and long-term impact",
        reflection: "Exactly! A career is an intentional journey of skill-building and meaningful progression.",
        isCorrect: true,
      },
      {
        id: "b",
        label: "A career always requires more education than a job",
        reflection: "Not necessarily. Mindset defines the difference, not just formal education levels.",
        isCorrect: false,
      },
      {
        id: "c",
        label: "A job is easier to handle than a career",
        reflection: "Ease depends on the role, not the mindset. A career mindset can actually make work more engaging and less stressful.",
        isCorrect: false,
      },
      {
        id: "d",
        label: "A career is only for office-based roles",
        reflection: "False. Skilled trades, creative paths, and service roles can all be careers if approached with growth in mind.",
        isCorrect: false,
      }
    ],
  },
  {
    id: 3,
    prompt: "Which of these is a hallmark of building a successful career?",
    options: [
      {
        id: "a",
        label: "Doing only what is explicitly in your job description",
        reflection: "This is a job-focused approach. Career-builders often seek ways to add extra value.",
        isCorrect: false,
      },
      {
        id: "b",
        label: "Seeking feedback and volunteering for challenging projects",
        reflection: "Perfect! Active learning and visibility are essential for career development.",
        isCorrect: true,
      },
      {
        id: "c",
        label: "Focusing on being liked rather than being competent",
        reflection: "While social skills matter, competence is the foundation of professional respect and career growth.",
        isCorrect: false,
      },
      {
        id: "d",
        label: "Changing jobs every 6 months for a small pay raise",
        reflection: "Frequent jumping without building deep skills can harm your long-term reputation and growth potential.",
        isCorrect: false,
      }
    ],
  },
  {
    id: 4,
    prompt: "How should you view setbacks or failures in your professional life?",
    options: [
      {
        id: "a",
        label: "As proof that you are not good enough for the role",
        reflection: "Setbacks happen to everyone. A career mindset sees them as data for improvement.",
        isCorrect: false,
      },
      {
        id: "b",
        label: "As learning opportunities to extract lessons for next time",
        reflection: "Exactly! Resilience and reflection turn failures into future successes.",
        isCorrect: true,
      },
      {
        id: "c",
        label: "As a reason to blame your manager or teammates",
        reflection: "Blaming others prevents you from learning and can damage your professional relationships.",
        isCorrect: false,
      },
      {
        id: "d",
        label: "As something to hide from others at all costs",
        reflection: "Hiding mistakes prevents growth and can lead to bigger problems later. Owning them shows integrity.",
        isCorrect: false,
      }
    ],
  },
  {
    id: 5,
    prompt: "What is the long-term benefit of focusing on skill-building rather than just income?",
    options: [
      {
        id: "a",
        label: "It makes you adaptable to market changes and increases your overall value",
        reflection: "Spot on! Skills are your personal currency that stays with you across different roles.",
        isCorrect: true,
      },
      {
        id: "b",
        label: "It guarantees you will never have to work a job you don't like",
        reflection: "While it helps, no choice can guarantee that. It does, however, give you more options.",
        isCorrect: false,
      },
      {
        id: "c",
        label: "It ensures you will retire earlier than everyone else",
        reflection: "Retirement depends on many factors. Skill-building primarily ensures you stay valuable and relevant.",
        isCorrect: false,
      },
      {
        id: "d",
        label: "It makes you the most important person in your company",
        reflection: "Skill-building makes you valuable, but true success also involves teamwork and shared goals.",
        isCorrect: false,
      }
    ],
  },
];

const CareerIsNotJustAJob = () => {
  const location = useLocation();
  const gameId = "ehe-adults-1";
  const gameData = getGameDataById(gameId);

  const totalCoins = gameData?.coins || location.state?.totalCoins || 20;
  const totalXp = gameData?.xp || location.state?.totalXp || 50;
  const coinsPerLevel = Math.floor(totalCoins / CAREER_QUIZ_STAGES.length);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [coins, setCoins] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const handleAnswerSelect = (option) => {
    if (answered) return;
    
    setAnswered(true);
    setSelectedId(option.id);
    resetFeedback();

    if (option.isCorrect) {
      const newCoins = coins + coinsPerLevel;
      setCoins(newCoins);
      setFinalScore(finalScore + 1);
      showCorrectAnswerFeedback(coinsPerLevel, true);
    } else {
      showCorrectAnswerFeedback(0, false);
    }

    setTimeout(() => {
      if (currentQuestion < CAREER_QUIZ_STAGES.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setAnswered(false);
        setSelectedId(null);
      } else {
        setShowResult(true);
      }
    }, 2000);
  };

  const currentStage = CAREER_QUIZ_STAGES[currentQuestion];

  return (
    <GameShell
      title="Career Is Not Just a Job Quiz"
      score={coins}
      currentLevel={currentQuestion + 1}
      totalLevels={CAREER_QUIZ_STAGES.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      gameId={gameId}
      gameType="ehe"
      showGameOver={showResult}
      maxScore={finalScore}
      showConfetti={showAnswerConfetti}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-6 max-w-4xl mx-auto p-4">
        {!showResult ? (
          <>
            {/* Question */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-white">
                Question {currentQuestion + 1 } of {CAREER_QUIZ_STAGES.length}
              </h3>
              <p className="text-lg text-white/90 leading-relaxed">
                {currentStage.prompt}
              </p>
            </div>

            {/* Options */}
            <div className="space-y-3">
              {currentStage.options.map((option) => {
                const isSelected = selectedId === option.id;
                const showCorrect = answered && option.isCorrect;
                const showWrong = isSelected && !option.isCorrect;

                return (
                  <button
                    key={option.id}
                    onClick={() => handleAnswerSelect(option)}
                    disabled={answered}
                    className={`w-full text-left p-4 rounded-lg border transition-all group ${
                      showCorrect
                        ? "border-green-500 bg-green-500/20"
                        : showWrong
                        ? "border-red-500 bg-red-500/20"
                        : isSelected
                        ? "border-white/60 bg-white/20"
                        : "border-white/20 bg-white/5 hover:border-white/40 hover:bg-white/10"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className={`text-lg font-bold mt-0.5 ${
                        showCorrect ? "text-green-400" : showWrong ? "text-red-400" : "text-white/70 group-hover:text-white"
                      }`}>
                        {option.id.toUpperCase()}
                      </span>
                      <span className="text-white/90 group-hover:text-white">
                        {option.label}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Reflection Feedback */}
            {answered && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-lg border ${
                  currentStage.options.find(opt => opt.id === selectedId)?.isCorrect
                    ? "bg-green-500/10 border-green-500/50 text-green-200"
                    : "bg-red-500/10 border-red-500/50 text-red-200"
                }`}
              >
                <p className="text-sm leading-relaxed">
                  {currentStage.options.find(opt => opt.id === selectedId)?.reflection}
                </p>
              </motion.div>
            )}
          </>
        ) : (
          <div className="text-center space-y-6">
            <Trophy className="w-16 h-16 text-yellow-400 mx-auto" />
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">Quiz Complete!</h2>
              <p className="text-xl text-white/80">
                You answered {finalScore} out of {CAREER_QUIZ_STAGES.length} questions correctly!
              </p>
            </div>
            <div className="bg-white/10 border border-white/20 rounded-lg p-6">
              <p className="text-white/80 mb-4">
                ✓ Achievement: <span className="font-semibold text-green-300">Career vs Job Mindset Expert</span>
              </p>
              <p className="text-white/70 text-sm leading-relaxed">
                A career is built through intentional learning, skill development, and reputation building. 
                By mastering these concepts, you're better equipped to turn any role into a meaningful 
                part of your professional journey.
              </p>
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default CareerIsNotJustAJob;
