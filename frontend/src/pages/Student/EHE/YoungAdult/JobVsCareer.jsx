import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const JOB_VS_CAREER_STAGES = [
  {
    id: 1,
    prompt: "What is the core difference between a job and a career?",
    options: [
      {
        id: "a",
        label: "A job is always temporary while a career is permanent",
        reflection: "Not quite. Both jobs and careers can be temporary or permanent. The real difference lies in intent and approach to growth, not duration.",
        isCorrect: false,
      },
      {
        id: "b",
        label: "A job is work you do for income; a career is work you do for growth and long-term impact",
        reflection: "Exactly! A job is often viewed as a means to earn money, while a career is an intentional journey of skill-building, reputation development, and meaningful progression.",
        isCorrect: true,
      },
      {
        id: "c",
        label: "A job requires less education than a career",
        reflection: "Not necessarily. Education level doesn't define the difference. You can have a career-mindset at any job level, and many highly educated people treat their work as just a job.",
        isCorrect: false,
      },
      {
        id: "d",
        label: "A career is only for people who work in professional fields",
        reflection: "False. Anyone in any field—skilled trades, creative work, service industries—can build a career with intention and commitment to continuous growth.",
        isCorrect: false,
      },
    ],
    reward: 20,
  },
  {
    id: 2,
    prompt: "When you receive your first job offer, what mindset matters most for building a career?",
    options: [
      {
        id: "a",
        label: "Focus only on the salary and benefits package",
        reflection: "While salary matters, focusing only on it ignores the bigger picture. The skills you'll gain, people you'll meet, and experience you'll build are often more valuable long-term.",
        isCorrect: false,
      },
      {
        id: "b",
        label: "Ask 'What can I learn here that will make me more valuable over time?'",
        reflection: "Perfect! This career-mindset question reframes your first job from just income to an investment in yourself. It shifts focus to skill-building and reputation.",
        isCorrect: true,
      },
      {
        id: "c",
        label: "Take any job that pays immediately without thinking ahead",
        reflection: "This job-mindset approach prioritizes immediate needs over long-term positioning. While understandable, it limits your ability to shape your career trajectory.",
        isCorrect: false,
      },
      {
        id: "d",
        label: "Wait for the 'perfect' job before starting any work",
        reflection: "Waiting for perfection often leads to missed opportunities. Even imperfect first jobs teach valuable lessons and build momentum for career growth.",
        isCorrect: false,
      },
    ],
    reward: 20,
  },
  {
    id: 3,
    prompt: "How does a career mindset show itself in daily work?",
    options: [
      {
        id: "a",
        label: "You do only what's required in your job description",
        reflection: "This is a job-focused approach. While staying within scope matters, career-builders often go beyond to develop new skills and demonstrate impact.",
        isCorrect: false,
      },
      {
        id: "b",
        label: "You seek feedback, volunteer for challenging projects, and document your growth",
        reflection: "Exactly! Career-minded people actively pursue learning opportunities, ask for feedback, and build a visible record of their development and contributions.",
        isCorrect: true,
      },
      {
        id: "c",
        label: "You avoid extra responsibilities to keep work-life balance",
        reflection: "Balance is important, but career-builders find ways to grow without burning out. It's not about doing more—it's about doing things intentionally.",
        isCorrect: false,
      },
      {
        id: "d",
        label: "You focus on being liked by your manager rather than building skills",
        reflection: "This prioritizes short-term approval over long-term value creation. Genuine career growth builds respect based on competence and contribution.",
        isCorrect: false,
      },
    ],
    reward: 20,
  },
  {
    id: 4,
    prompt: "When facing a setback or failure at work, what's the career-building response?",
    options: [
      {
        id: "a",
        label: "View it as proof you're not good enough and quit",
        reflection: "Setbacks happen at every career stage. Career-builders see failures as learning opportunities, not evidence of inadequacy.",
        isCorrect: false,
      },
      {
        id: "b",
        label: "Analyze what went wrong, extract the lesson, and apply it next time",
        reflection: "Perfect! This is true career-thinking. Each setback becomes data that makes you more skilled and resilient for future challenges.",
        isCorrect: true,
      },
      {
        id: "c",
        label: "Pretend it didn't happen and move on to the next task",
        reflection: "Ignoring failures means missing the learning opportunity. Career growth requires reflection and intentional improvement.",
        isCorrect: false,
      },
      {
        id: "d",
        label: "Blame others and move to a different job",
        reflection: "Blaming externals prevents you from taking control of your development. This stops career building before it starts.",
        isCorrect: false,
      },
    ],
    reward: 20,
  },
  {
    id: 5,
    prompt: "How does the job vs. career mindset affect your long-term opportunities?",
    options: [
      {
        id: "a",
        label: "Job mindset keeps you employable; career mindset makes you positioned for leadership",
        reflection: "Great insight! Job-focused work keeps you afloat, but career-focused development opens doors to growth, influence, and new opportunities.",
        isCorrect: true,
      },
      {
        id: "b",
        label: "They're the same thing—it doesn't matter which mindset you adopt",
        reflection: "They're actually very different. Over 5-10 years, the person with a career mindset will have accumulated more skills, connections, and opportunities.",
        isCorrect: false,
      },
      {
        id: "c",
        label: "Career mindset makes you overqualified and harder to work with",
        reflection: "False. Career-builders who grow well develop both expertise AND collaboration skills. They become more valuable, not more difficult.",
        isCorrect: false,
      },
      {
        id: "d",
        label: "Only people with specific job titles can build careers",
        reflection: "Careers can be built in any role. The difference is mindset, not title. A commitment to growth applies everywhere.",
        isCorrect: false,
      },
    ],
    reward: 20,
  },
];

const JobVsCareer = () => {
  const location = useLocation();
  const gameId = "ehe-young-adult-1";
  const gameData = getGameDataById(gameId);

  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const coinsPerLevel = Math.floor(totalCoins / JOB_VS_CAREER_STAGES.length);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [coins, setCoins] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const handleAnswerSelect = (option) => {
    resetFeedback();

    if (option.isCorrect) {
      const newCoins = coins + coinsPerLevel;
      setCoins(newCoins);
      setFinalScore(finalScore + 1);
      showCorrectAnswerFeedback(coinsPerLevel, true);
    }

    setTimeout(() => {
      if (currentQuestion < JOB_VS_CAREER_STAGES.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        setShowResult(true);
      }
    }, 1500);
  };

  const currentStage = JOB_VS_CAREER_STAGES[currentQuestion];

  return (
    <GameShell
      title="Job vs Career"
      score={coins}
      currentLevel={currentQuestion + 1}
      totalLevels={JOB_VS_CAREER_STAGES.length}
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
                Question {currentQuestion + 1 } of {JOB_VS_CAREER_STAGES.length}
              </h3>
              <p className="text-lg text-white/90 leading-relaxed">
                {currentStage.prompt}
              </p>
            </div>

            {/* Options */}
            <div className="space-y-3">
              {currentStage.options.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleAnswerSelect(option)}
                  className="w-full text-left p-4 rounded-lg border border-white/20 bg-white/5 hover:border-white/40 hover:bg-white/10 transition-all group"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-lg font-bold text-white/70 group-hover:text-white mt-0.5">
                      {option.id.toUpperCase()}
                    </span>
                    <span className="text-white/90 group-hover:text-white">
                      {option.label}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center space-y-6">
            <Trophy className="w-16 h-16 text-yellow-400 mx-auto" />
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">Great Job!</h2>
              <p className="text-xl text-white/80">
                You answered {finalScore} out of {JOB_VS_CAREER_STAGES.length} questions correctly!
              </p>
            </div>
            <div className="bg-white/10 border border-white/20 rounded-lg p-6">
              <p className="text-white/80 mb-4">
                ✓ Skill Unlocked: <span className="font-semibold text-green-300">Career Mindset vs Job Mindset</span>
              </p>
              <p className="text-white/70 text-sm leading-relaxed">
                A career is built through intentional learning, skill development, and reputation building. 
                Each job is an opportunity to strengthen your value in the market and move closer to your 
                professional goals.
              </p>
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default JobVsCareer;
