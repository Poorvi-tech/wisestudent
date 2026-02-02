import React, { useState, useMemo } from "react";
import { useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getAiTeenGames } from "../../../../pages/Games/GameCategories/AiForAll/teenGamesData";

const CybersecurityAIQuiz = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "ai-teen-48";
  const gameData = getGameDataById(gameId);
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  
  // Find next game path and ID if not provided in location.state
  const { nextGamePath, nextGameId } = useMemo(() => {
    if (location.state?.nextGamePath) {
      return {
        nextGamePath: location.state.nextGamePath,
        nextGameId: location.state.nextGameId || null
      };
    }
    
    try {
      const games = getAiTeenGames({});
      const currentGame = games.find(g => g.id === gameId);
      if (currentGame && currentGame.index !== undefined) {
        const nextGame = games.find(g => g.index === currentGame.index + 1 && g.isSpecial && g.path);
        return {
          nextGamePath: nextGame ? nextGame.path : null,
          nextGameId: nextGame ? nextGame.id : null
        };
      }
    } catch (error) {
      console.warn("Error finding next game:", error);
    }
    
    return { nextGamePath: null, nextGameId: null };
  }, [location.state, gameId]);
  
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [levelCompleted, setLevelCompleted] = useState(false);
  const [answered, setAnswered] = useState(false);

  const questions = [
  {
    id: 1,
    text: "Your gaming account suddenly logs in from another country at midnight. How can AI help here?",
    emoji: "🎮",
    options: [
      
      {
        id: "password-change",
        text: "Automatically change your username",
        emoji: "🔤",
        isCorrect: false
      },
      {
        id: "block-internet",
        text: "Turn off the internet for everyone",
        emoji: "🚫",
        isCorrect: false
      },
      {
        id: "pattern-detection",
        text: "Detect unusual login location and time",
        emoji: "📍",
        isCorrect: true
      },
    ],
    explanation: "AI compares login behavior and flags unusual activity like new locations or odd times."
  },
  {
    id: 2,
    text: "You receive an email saying you won a free phone and must click a link. What AI feature protects you?",
    emoji: "📧",
    options: [
      {
        id: "link-analysis",
        text: "Analyze links and sender behavior",
        emoji: "🔍",
        isCorrect: true
      },
      {
        id: "auto-reply",
        text: "Reply asking if the offer is real",
        emoji: "💬",
        isCorrect: false
      },
      {
        id: "delete-all",
        text: "Delete your entire inbox",
        emoji: "🗑️",
        isCorrect: false
      }
    ],
    explanation: "AI detects phishing by checking suspicious links, language patterns, and sender history."
  },
  {
    id: 3,
    text: "A school website slows down suddenly due to heavy traffic. How can AI assist?",
    emoji: "🏫",
    options: [
      
      {
        id: "upgrade-website",
        text: "Redesign the website layout",
        emoji: "🎨",
        isCorrect: false
      },
      {
        id: "attack-prediction",
        text: "Identify a possible DDoS attack pattern",
        emoji: "📊",
        isCorrect: true
      },
      {
        id: "notify-students",
        text: "Send apology emails to students",
        emoji: "📨",
        isCorrect: false
      }
    ],
    explanation: "AI monitors traffic spikes and recognizes attack-like behavior early."
  },
  {
    id: 4,
    text: "You download a file that behaves strangely after opening. What does AI do first?",
    emoji: "📁",
    options: [
      {
        id: "behavior-check",
        text: "Analyze file behavior before damage",
        emoji: "🧪",
        isCorrect: true
      },
      {
        id: "delete-files",
        text: "Delete all files on the device",
        emoji: "❌",
        isCorrect: false
      },
      {
        id: "restart-system",
        text: "Restart the computer immediately",
        emoji: "🔄",
        isCorrect: false
      }
    ],
    explanation: "AI-based security watches how a file behaves, not just its name."
  },
  {
    id: 5,
    text: "Someone tries many passwords on your social media account quickly. How does AI respond?",
    emoji: "🔐",
    options: [
      
      {
        id: "allow-attempts",
        text: "Allow unlimited login attempts",
        emoji: "🔓",
        isCorrect: false
      },
      {
        id: "change-username",
        text: "Change profile name automatically",
        emoji: "👤",
        isCorrect: false
      },
      {
        id: "lock-alert",
        text: "Lock account and alert the user",
        emoji: "🚨",
        isCorrect: true
      },
    ],
    explanation: "AI detects brute-force attacks and reacts fast to protect accounts."
  }
];


  const handleAnswer = (optionId) => {
    if (answered || levelCompleted) return;
    
    setAnswered(true);
    setSelectedOption(optionId);
    resetFeedback();
    
    const currentQuestionData = questions[currentQuestion];
    const selectedOptionData = currentQuestionData.options.find(opt => opt.id === optionId);
    const isCorrect = selectedOptionData?.isCorrect || false;
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    } else {
      showCorrectAnswerFeedback(0, false);
    }
    
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setSelectedOption(null);
        setAnswered(false);
        resetFeedback();
      } else {
        setLevelCompleted(true);
      }
    }, isCorrect ? 5000 : 5000);
  };

  const currentQuestionData = questions[currentQuestion];
  const finalScore = score;

  return (
    <GameShell
      title="Cybersecurity AI Quiz"
      subtitle={levelCompleted ? "Quiz Complete!" : `Question ${currentQuestion + 1} of ${questions.length}`}
      score={finalScore}
      currentLevel={currentQuestion + 1}
      totalLevels={questions.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      gameId={gameId}
      nextGamePathProp="/student/ai-for-all/teen/smart-home-simulation"
      nextGameIdProp="ai-teen-49"
      gameType="ai"
      showGameOver={levelCompleted}
      maxScore={questions.length}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      nextGamePath={nextGamePath}
      nextGameId={nextGameId}
      showConfetti={levelCompleted && finalScore >= 3}
    >
      <div className="space-y-8 max-w-4xl mx-auto px-4 min-h-[calc(100vh-200px)] flex flex-col justify-center">
        {!levelCompleted && currentQuestionData ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
                <span className="text-yellow-400 font-bold">Score: {finalScore}/{questions.length}</span>
              </div>
              
              <div className="text-6xl mb-4 text-center">{currentQuestionData.emoji}</div>
              
              <p className="text-white text-lg md:text-xl mb-6 text-center">
                {currentQuestionData.text}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {currentQuestionData.options.map(option => {
                  const isSelected = selectedOption === option.id;
                  const showCorrect = answered && option.isCorrect;
                  const showIncorrect = answered && isSelected && !option.isCorrect;
                  
                  return (
                    <button
                      key={option.id}
                      onClick={() => handleAnswer(option.id)}
                      disabled={answered}
                      className={`p-6 rounded-2xl shadow-lg transition-all transform text-center ${
                        showCorrect
                          ? "bg-green-500/30 border-4 border-green-400 ring-4 ring-green-400"
                          : showIncorrect
                          ? "bg-red-500/20 border-2 border-red-400 opacity-75"
                          : isSelected
                          ? "bg-blue-600 border-2 border-blue-300 scale-105"
                          : "bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white border-2 border-white/20 hover:border-white/40 hover:scale-105"
                      } ${answered ? "cursor-not-allowed" : ""}`}
                    >
                      <div className="text-2xl mb-2">{option.emoji}</div>
                      <h4 className="font-bold text-base mb-2">{option.text}</h4>
                      <p className="text-white/90 text-sm">{option.description}</p>
                    </button>
                  );
                })}
              </div>
              
              {answered && (
                <div className={`rounded-lg p-4 mt-6 ${
                  currentQuestionData.options.find(opt => opt.id === selectedOption)?.isCorrect
                    ? "bg-green-500/20"
                    : "bg-red-500/20"
                }`}>
                  <p className="text-white text-center">
                    {currentQuestionData.explanation}
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </GameShell>
  );
};

export default CybersecurityAIQuiz;