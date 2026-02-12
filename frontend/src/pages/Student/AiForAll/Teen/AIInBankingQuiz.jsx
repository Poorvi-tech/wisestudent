import React, { useState, useMemo } from "react";
import { useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getAiTeenGames } from "../../../../pages/Games/GameCategories/AiForAll/teenGamesData";

const AIInBankingQuiz = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "ai-teen-36";
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
    text: "You withdraw money from an ATM in a new city, and the transaction is blocked. Why might AI stop it?",
    emoji: "🏧",
    options: [
      {
        id: "unusual-location",
        text: "The location and timing look unusual compared to past use",
        emoji: "📍",
        isCorrect: true
      },
      {
        id: "atm-broken",
        text: "The ATM machine is always faulty",
        emoji: "⚙️",
        isCorrect: false
      },
      {
        id: "daily-limit",
        text: "AI blocks all withdrawals after one use",
        emoji: "🚫",
        isCorrect: false
      }
    ],
    explanation: "AI watches spending patterns. A sudden change in location or behavior can trigger fraud protection."
  },
  {
    id: 2,
    text: "A bank approves a loan very quickly using AI. What is AI mainly checking?",
    emoji: "💳",
    options: [
      
      {
        id: "social-media",
        text: "Your social media followers",
        emoji: "📱",
        isCorrect: false
      },
      {
        id: "financial-patterns",
        text: "Income, spending habits, and repayment history",
        emoji: "📊",
        isCorrect: true
      },
      {
        id: "luck-based",
        text: "Random chance to be fair to everyone",
        emoji: "🎲",
        isCorrect: false
      }
    ],
    explanation: "AI reviews financial data patterns to assess risk faster than manual review."
  },
  {
    id: 3,
    text: "An AI app claims it can guarantee stock market profits. What should you think?",
    emoji: "📈",
    options: [
      
      {
        id: "trust-ai",
        text: "Trust it because AI is always accurate",
        emoji: "🤖",
        isCorrect: false
      },
      {
        id: "invest-all",
        text: "Invest all savings to maximize profit",
        emoji: "💸",
        isCorrect: false
      },
      {
        id: "be-skeptical",
        text: "Be skeptical—no system can predict markets perfectly",
        emoji: "⚠️",
        isCorrect: true
      },
    ],
    explanation: "AI can analyze trends, but markets are unpredictable due to real-world events."
  },
  {
    id: 4,
    text: "You chat with a bank chatbot late at night. What task is it best suited for?",
    emoji: "💬",
    options: [
      
      {
        id: "legal-disputes",
        text: "Handling legal complaints",
        emoji: "⚖️",
        isCorrect: false
      },
      {
        id: "basic-help",
        text: "Checking balance or recent transactions",
        emoji: "📄",
        isCorrect: true
      },
      {
        id: "emergency-decisions",
        text: "Approving major financial exceptions",
        emoji: "🚨",
        isCorrect: false
      }
    ],
    explanation: "Bank chatbots handle routine questions; complex issues still need humans."
  },
  {
    id: 5,
    text: "Why do banks still keep human bankers even with AI systems?",
    emoji: "🏦",
    options: [
      {
        id: "human-judgment",
        text: "Humans handle empathy, trust, and complex decisions",
        emoji: "🤝",
        isCorrect: true
      },
      {
        id: "ai-is-expensive",
        text: "AI is too expensive to use fully",
        emoji: "💰",
        isCorrect: false
      },
      {
        id: "ai-is-illegal",
        text: "AI is not allowed in banks",
        emoji: "🚫",
        isCorrect: false
      }
    ],
    explanation: "AI supports banking, but human judgment is essential for trust and complex cases."
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
      title="AI in Banking Quiz"
      subtitle={levelCompleted ? "Quiz Complete!" : `Question ${currentQuestion + 1} of ${questions.length}`}
      score={finalScore}
      currentLevel={currentQuestion + 1}
      totalLevels={questions.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      gameId={gameId}
      nextGamePathProp="/student/ai-for-all/teen/news-recommendation-game"
      nextGameIdProp="ai-teen-37"
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

export default AIInBankingQuiz;