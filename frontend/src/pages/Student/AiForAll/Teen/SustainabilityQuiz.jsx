import React, { useState, useMemo } from "react";
import { useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getAiTeenGames } from "../../../../pages/Games/GameCategories/AiForAll/teenGamesData";

const SustainabilityQuiz = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "ai-teen-87";
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
    text: "Your school leaves fans and lights on after classes. How can AI help reduce this energy waste?",
    emoji: "💡",
    options: [
      
      {
        id: 2,
        text: "Ask students to manually check every room",
        emoji: "🚶",
        isCorrect: false
      },
      {
        id: 3,
        text: "Increase electricity supply",
        emoji: "⚡",
        isCorrect: false
      },
      {
        id: 1,
        text: "Automatically turn off devices using motion sensors",
        emoji: "🤖",
        isCorrect: true
      },
    ],
    explanation:
      "AI-powered systems use sensors to detect empty rooms and automatically switch off lights and fans, reducing unnecessary energy consumption without relying on human effort."
  },
  {
    id: 2,
    text: "A city wants to avoid power cuts during summer. What is the smartest AI-based solution?",
    emoji: "🌆",
    options: [
      
      {
        id: 2,
        text: "Build more power plants immediately",
        emoji: "🏭",
        isCorrect: false
      },
      {
        id: 1,
        text: "Predict electricity demand using past data and weather",
        emoji: "📊",
        isCorrect: true
      },
      {
        id: 3,
        text: "Limit electricity for everyone",
        emoji: "🚫",
        isCorrect: false
      }
    ],
    explanation:
      "AI can forecast energy demand by analyzing usage patterns and weather, helping cities balance supply and reduce wastage without causing blackouts."
  },
  {
    id: 3,
    text: "Air pollution levels suddenly rise in your city. How can AI help authorities respond faster?",
    emoji: "🌫️",
    options: [
      {
        id: 1,
        text: "Analyze sensor and satellite data in real time",
        emoji: "🛰️",
        isCorrect: true
      },
      {
        id: 2,
        text: "Wait for citizen complaints",
        emoji: "📞",
        isCorrect: false
      },
      {
        id: 3,
        text: "Shut down the entire city",
        emoji: "🚧",
        isCorrect: false
      }
    ],
    explanation:
      "AI combines data from pollution sensors and satellites to detect rising pollution instantly, allowing quicker action like traffic control or factory regulation."
  },
  {
    id: 4,
    text: "An apartment complex wants to reduce water bills. What AI-based method is most effective?",
    emoji: "💧",
    options: [
      
      {
        id: 2,
        text: "Reduce water supply for all residents",
        emoji: "🚱",
        isCorrect: false
      },
      {
        id: 3,
        text: "Ignore small leaks",
        emoji: "🙈",
        isCorrect: false
      },
      {
        id: 1,
        text: "Detect leaks and unusual water usage automatically",
        emoji: "🔍",
        isCorrect: true
      },
    ],
    explanation:
      "AI systems connected to smart meters can detect leaks early and monitor usage patterns, preventing water loss and saving money."
  },
  {
    id: 5,
    text: "A new eco-friendly building is being planned. Where can AI make the biggest impact?",
    emoji: "🌿",
    options: [
      {
        id: 1,
        text: "Designing layouts that use natural light and ventilation",
        emoji: "☀️",
        isCorrect: true
      },
      {
        id: 2,
        text: "Using only glass for the building",
        emoji: "🪟",
        isCorrect: false
      },
      {
        id: 3,
        text: "Adding more air conditioners",
        emoji: "❄️",
        isCorrect: false
      }
    ],
    explanation:
      "AI helps architects simulate energy use and design buildings that stay cool and bright naturally, reducing electricity consumption long-term."
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
    }, isCorrect ? 10000 : 10000);
  };

  const currentQuestionData = questions[currentQuestion];
  const finalScore = score;

  return (
    <GameShell
      title="Sustainability Quiz"
      subtitle={levelCompleted ? "Quiz Complete!" : `Question ${currentQuestion + 1} of ${questions.length}`}
      score={finalScore}
      currentLevel={currentQuestion + 1}
      totalLevels={questions.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      gameId={gameId}
      nextGamePathProp="/student/ai-for-all/teen/robot-honesty-game"
      nextGameIdProp="ai-teen-88"
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

export default SustainabilityQuiz;