import React, { useState, useMemo } from "react";
import { useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getAiTeenGames } from "../../../../pages/Games/GameCategories/AiForAll/teenGamesData";

const WrongPredictionQuizz = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "ai-teen-69";
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
    title: "AI Exam Predictor",
    text: "An AI predicts you will score low because you missed classes, but you studied hard later. What went wrong?",
    emoji: "🤖",
    options: [
      { id: 1, text: "AI ignored recent effort", emoji: "⏳", isCorrect: true },
      { id: 2, text: "AI wanted to discourage you", emoji: "😈", isCorrect: false },
      { id: 3, text: "AI cannot read books", emoji: "📕", isCorrect: false }
    ],
    explanation:
      "AI predictions depend on past data. If recent changes aren’t included, predictions can be wrong."
  },
  {
    id: 2,
    title: "Weather Prediction",
    text: "An AI forecast says no rain, but it suddenly pours in your city. Why?",
    emoji: "🌧️",
    options: [
      { id: 2, text: "AI doesn't understand clouds", emoji: "☁️", isCorrect: false },
      { id: 3, text: "Satellites stopped working", emoji: "🛰️", isCorrect: false },
      { id: 1, text: "Weather systems change fast", emoji: "🌪️", isCorrect: true },
    ],
    explanation:
      "Weather is chaotic. Small changes can make predictions inaccurate, even with powerful AI."
  },
  {
    id: 3,
    title: "Social Media Algorithm",
    text: "AI predicts you like only gaming videos, but you suddenly enjoy cooking reels. Why is the prediction wrong?",
    emoji: "📱",
    options: [
      { id: 2, text: "AI dislikes cooking", emoji: "🍳", isCorrect: false },
      { id: 1, text: "Your interests changed", emoji: "🔄", isCorrect: true },
      { id: 3, text: "Videos are randomly chosen", emoji: "🎲", isCorrect: false }
    ],
    explanation:
      "AI learns from past behavior. When humans change, predictions can lag behind."
  },
  {
    id: 4,
    title: "Self-Driving Car",
    text: "An AI car slows down suddenly because of a plastic bag on the road. What caused the mistake?",
    emoji: "🚗",
    options: [
      { id: 1, text: "Object looked dangerous to sensors", emoji: "📡", isCorrect: true },
      { id: 2, text: "Car wanted to stop", emoji: "🛑", isCorrect: false },
      { id: 3, text: "Road rules changed", emoji: "🛣️", isCorrect: false }
    ],
    explanation:
      "AI sometimes misclassifies objects because sensors can’t fully understand context."
  },
  {
    id: 5,
    title: "Health App Prediction",
    text: "A fitness AI says you're unhealthy based only on step count. What’s missing?",
    emoji: "🏃‍♂️",
    options: [
      { id: 2, text: "Your phone brand", emoji: "📱", isCorrect: false },
      { id: 3, text: "App update version", emoji: "⬆️", isCorrect: false },
      { id: 1, text: "Sleep, diet, and medical data", emoji: "🧠", isCorrect: true },
    ],
    explanation:
      "Limited data leads to weak predictions. Good decisions need full context."
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
    }, isCorrect ? 3000 : 3000);
  };

  const currentQuestionData = questions[currentQuestion];
  const finalScore = score;

  return (
    <GameShell
      title="Wrong Prediction Quiz"
      subtitle={levelCompleted ? "Quiz Complete!" : `Question ${currentQuestion + 1} of ${questions.length}`}
      score={finalScore}
      currentLevel={currentQuestion + 1}
      totalLevels={questions.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      gameId={gameId}
      nextGamePathProp="/student/ai-for-all/teen/pattern-vs-noise-game"
      nextGameIdProp="ai-teen-70"
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
              
              <div className="text-4xl mb-2 text-center font-bold text-white">{currentQuestionData.title}</div>
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

export default WrongPredictionQuizz;