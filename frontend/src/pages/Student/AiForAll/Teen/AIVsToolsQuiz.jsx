import React, { useState, useMemo } from "react";
import { useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getAiTeenGames } from "../../../../pages/Games/GameCategories/AiForAll/teenGamesData";

const AIVsToolsQuiz = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "ai-teen-23";
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
    text: "A microwave heats food when you press buttons. What best describes it?",
    emoji: "🍲",
    options: [
      
      {
        id: "learning-system",
        text: "A system that learns your food preferences",
        emoji: "🧠",
        isCorrect: false
      },
      {
        id: "decision-maker",
        text: "A system that decides meals on its own",
        emoji: "🍽️",
        isCorrect: false
      },
      {
        id: "fixed-machine",
        text: "A machine that follows fixed instructions",
        emoji: "⚙️",
        isCorrect: true
      },
    ],
    explanation: "A microwave follows preset rules. It doesn’t learn or make decisions, so it’s a tool—not AI."
  },
  {
    id: 2,
    text: "A calculator instantly solves math problems you enter. Why is it not AI?",
    emoji: "🧮",
    options: [
      {
        id: "no-learning",
        text: "It never learns from past calculations",
        emoji: "📏",
        isCorrect: true
      },
      {
        id: "voice-control",
        text: "It doesn’t accept voice commands",
        emoji: "🎙️",
        isCorrect: false
      },
      {
        id: "slow-processing",
        text: "It works slower than humans",
        emoji: "🐢",
        isCorrect: false
      }
    ],
    explanation: "AI systems learn and adapt. Calculators always follow the same math rules."
  },
  {
    id: 3,
    text: "Siri understands your voice, answers questions, and improves over time. What makes it AI?",
    emoji: "📱",
    options: [
      
      {
        id: "internet-access",
        text: "It is connected to the internet",
        emoji: "🌐",
        isCorrect: false
      },
      {
        id: "language-learning",
        text: "It understands language and learns from usage",
        emoji: "🧠",
        isCorrect: true
      },
      {
        id: "touchscreen",
        text: "It runs on a smartphone",
        emoji: "📲",
        isCorrect: false
      }
    ],
    explanation: "AI systems like Siri use language understanding and learning, not just internet access."
  },
  {
    id: 4,
    text: "A basic thermostat turns heating on at a fixed temperature. Why is this not AI?",
    emoji: "🌡️",
    options: [
      {
        id: "rule-based",
        text: "It follows fixed rules without learning",
        emoji: "📏",
        isCorrect: true
      },
      {
        id: "electric-device",
        text: "It uses electricity",
        emoji: "🔌",
        isCorrect: false
      },
      {
        id: "indoor-use",
        text: "It is used inside homes",
        emoji: "🏠",
        isCorrect: false
      }
    ],
    explanation: "Only smart thermostats that learn habits use AI. Basic ones are simple tools."
  },
  {
    id: 5,
    text: "A self-driving car detects traffic, pedestrians, and road signs. What makes it AI?",
    emoji: "🚗",
    options: [
      
      {
        id: "engine-power",
        text: "It has a powerful engine",
        emoji: "⚡",
        isCorrect: false
      },
      {
        id: "gps-maps",
        text: "It uses maps for navigation",
        emoji: "🗺️",
        isCorrect: false
      },
      {
        id: "real-time-decisions",
        text: "It makes real-time driving decisions using data",
        emoji: "📊",
        isCorrect: true
      },
    ],
    explanation: "AI allows the car to see, decide, and react—going far beyond basic automation."
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
      title="AI vs Tools Quiz"
      subtitle={levelCompleted ? "Quiz Complete!" : `Question ${currentQuestion + 1} of ${questions.length}`}
      score={finalScore}
      currentLevel={currentQuestion + 1}
      totalLevels={questions.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      gameId={gameId}
      nextGamePathProp="/student/ai-for-all/teen/future-of-ai-reflection"
      nextGameIdProp="ai-teen-24"
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

export default AIVsToolsQuiz;