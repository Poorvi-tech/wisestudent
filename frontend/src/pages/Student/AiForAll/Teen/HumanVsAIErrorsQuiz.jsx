import React, { useState, useMemo } from "react";
import { useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getAiTeenGames } from "../../../../pages/Games/GameCategories/AiForAll/teenGamesData";

const HumanVsAIErrorsQuiz = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "ai-teen-73";
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
    text: "A navigation app sends you to a blocked road because its map is outdated. What kind of error is this?",
    emoji: "🗺️",
    options: [
      
      {
        id: "human-driving",
        text: "Human driving mistake",
        emoji: "🚗",
        isCorrect: false
      },
      {
        id: "ai-data",
        text: "AI using outdated data",
        emoji: "📉",
        isCorrect: true
      },
      {
        id: "no-error",
        text: "Not an error at all",
        emoji: "❌",
        isCorrect: false
      }
    ],
    explanation: "AI depends on data. If the data isn’t updated, it can make wrong decisions."
  },
  {
    id: 2,
    text: "A student enters the wrong marks into a school system, causing wrong results. What caused the problem?",
    emoji: "📝",
    options: [
      {
        id: "human-error",
        text: "Human input mistake",
        emoji: "🙋",
        isCorrect: true
      },
      {
        id: "ai-decision",
        text: "AI decision failure",
        emoji: "🤖",
        isCorrect: false
      },
      {
        id: "system-hack",
        text: "System was hacked",
        emoji: "🕵️",
        isCorrect: false
      }
    ],
    explanation: "Even the best systems fail if humans enter incorrect information."
  },
  {
    id: 3,
    text: "An AI photo app wrongly tags a stranger as your friend. Why did this happen?",
    emoji: "📸",
    options: [
      
      {
        id: "human-choice",
        text: "Human chose the wrong friend",
        emoji: "👥",
        isCorrect: false
      },
      {
        id: "pattern-error",
        text: "AI confused similar facial patterns",
        emoji: "🧠",
        isCorrect: true
      },
      {
        id: "camera-fault",
        text: "Camera was broken",
        emoji: "📷",
        isCorrect: false
      }
    ],
    explanation: "AI predicts using patterns. Similar faces can confuse the model."
  },
  {
    id: 4,
    text: "A human judge gets tired and gives an unfair decision late at night. What caused this error?",
    emoji: "⚖️",
    options: [
     
      {
        id: "ai-bias",
        text: "AI algorithm bias",
        emoji: "🤖",
        isCorrect: false
      },
      {
        id: "lack-rules",
        text: "No rules existed",
        emoji: "📜",
        isCorrect: false
      },
       {
        id: "fatigue",
        text: "Human fatigue and stress",
        emoji: "😴",
        isCorrect: true
      },
    ],
    explanation: "Humans are affected by emotions, tiredness, and pressure — AI is not."
  },
  {
    id: 5,
    text: "An AI chatbot gives wrong advice because it was trained on incorrect examples. What lesson does this show?",
    emoji: "📚",
    options: [
      {
        id: "training-matters",
        text: "AI quality depends on training data",
        emoji: "🌱",
        isCorrect: true
      },
      {
        id: "ai-thinking",
        text: "AI thinks like humans",
        emoji: "🧍",
        isCorrect: false
      },
      {
        id: "users-fault",
        text: "Users always cause AI errors",
        emoji: "🙅",
        isCorrect: false
      }
    ],
    explanation: "AI is only as good as the data and examples it learns from."
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
      title="Human vs AI Errors Quiz"
      subtitle={levelCompleted ? "Quiz Complete!" : `Question ${currentQuestion + 1} of ${questions.length}`}
      score={finalScore}
      currentLevel={currentQuestion + 1}
      totalLevels={questions.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      gameId={gameId}
      nextGamePathProp="/student/ai-for-all/teen/balanced-data-story"
      nextGameIdProp="ai-teen-74"
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

export default HumanVsAIErrorsQuiz;