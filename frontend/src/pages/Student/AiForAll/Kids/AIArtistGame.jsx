import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const AIArtistGame = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [choices, setChoices] = useState([]);
  const [finalScore, setFinalScore] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const quizQuestions = [
  {
    text: "You type: 'A rainbow dragon in the sky'. What does the AI artist do?",
    emoji: "🐉",
    choices: [
      { id: 1, text: "Creates a picture from your words", emoji: "🖼️", isCorrect: true },
      { id: 2, text: "Plays music instead", emoji: "🎵", isCorrect: false },
      { id: 3, text: "Deletes the idea", emoji: "🗑️", isCorrect: false }
    ],
    explanation:
      "AI artists turn your ideas (text prompts) into pictures using imagination and patterns."
  },
  {
    text: "You want a picture in cartoon style. What helps the AI understand this?",
    emoji: "🖍️",
    choices: [
      { id: 2, text: "The time of day", emoji: "⏰", isCorrect: false },
      { id: 3, text: "How loud you type", emoji: "🔊", isCorrect: false },
      { id: 1, text: "Style words like cartoon or sketch", emoji: "✏️", isCorrect: true },
    ],
    explanation:
      "AI understands styles when you describe how the picture should look."
  },
  {
    text: "An AI artist learns to draw animals. What helps it learn?",
    emoji: "🦁",
    choices: [
      { id: 2, text: "Going to the zoo", emoji: "🦓", isCorrect: false },
      { id: 1, text: "Looking at many animal pictures", emoji: "📸", isCorrect: true },
      { id: 3, text: "Watching cartoons all day", emoji: "📺", isCorrect: false }
    ],
    explanation:
      "AI learns from lots of examples to understand shapes, colors, and patterns."
  },
  {
    text: "Your drawing looks too dark. How can AI help fix it?",
    emoji: "🌙",
    choices: [
      { id: 1, text: "Adjust brightness and colors", emoji: "🎨", isCorrect: true },
      { id: 2, text: "Erase the whole picture", emoji: "❌", isCorrect: false },
      { id: 3, text: "Ignore the problem", emoji: "🙈", isCorrect: false }
    ],
    explanation:
      "AI tools can improve colors, lighting, and details in artwork."
  },
  {
    text: "Who gives the best ideas when making AI art?",
    emoji: "🎨",
    choices: [
      { id: 2, text: "AI alone with no human", emoji: "🤖", isCorrect: false },
      { id: 3, text: "Only paint brushes", emoji: "🖌️", isCorrect: false },
      { id: 1, text: "Human imagination with AI help", emoji: "🧠", isCorrect: true },
    ],
    explanation:
      "AI is a helper — humans imagine, and AI helps bring ideas to life."
  }
];


  const currentQuestion = quizQuestions[currentIndex];

  const handleChoice = (choiceId) => {
    const choice = currentQuestion.choices.find((c) => c.id === choiceId);
    const isCorrect = choice?.isCorrect;
    
    const newChoices = [...choices, { 
      questionId: currentQuestion.id, 
      choice: choiceId,
      isCorrect: isCorrect
    }];
    
    setChoices(newChoices);
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      setCoins(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }
    
    if (currentIndex < quizQuestions.length - 1) {
      setTimeout(() => {
        setCurrentIndex(prev => prev + 1);
      }, isCorrect ? 1000 : 800);
    } else {
      // Calculate final score
      const correctAnswers = newChoices.filter(choice => choice.isCorrect).length;
      setFinalScore(correctAnswers);
      setTimeout(() => {
        setShowResult(true);
      }, isCorrect ? 1000 : 800);
    }
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setCurrentIndex(0);
    setScore(0);
    setCoins(0);
    setChoices([]);
    setFinalScore(0);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/student/ai-for-all/kids/music-ai-story"); // update next route as needed
  };

  return (
    <GameShell
      title="AI Artist Game 🎨"
      score={score}
      subtitle={showResult ? "Game Complete!" : `Question ${currentIndex + 1} of ${quizQuestions.length}`}
      onNext={handleNext}
      nextGamePathProp="/student/ai-for-all/kids/music-ai-story"
      nextGameIdProp="ai-kids-44"
      nextEnabled={showResult && finalScore >= 3}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult && finalScore >= 3}
      maxScore={quizQuestions.length}
      gameId="ai-kids-43"
      gameType="ai"
      totalLevels={quizQuestions.length}
      currentLevel={currentIndex + 1}
      showConfetti={showResult && finalScore >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/ai-for-all/kids"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="text-9xl mb-6 text-center">{currentQuestion.emoji}</div>
            <h3 className="text-white text-2xl font-bold mb-6 text-center">
              {currentQuestion.text}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {currentQuestion.choices.map((choice) => (
                <button
                  key={choice.id}
                  onClick={() => handleChoice(choice.id)}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white p-6 rounded-xl text-lg font-semibold transition-all transform hover:scale-105"
                >
                  <div className="text-2xl mb-2">{choice.emoji}</div>
                  <h3 className="font-bold text-xl mb-2">{choice.text}</h3>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-center">
            {finalScore >= 3 ? (
              <div>
                <div className="text-5xl mb-4">🎉</div>
                <h3 className="text-2xl font-bold text-white mb-4">Creative Genius!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You answered {finalScore} out of {quizQuestions.length} correctly! ({Math.round((finalScore / quizQuestions.length) * 100)}%)
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{coins} Coins</span>
                </div>
                <p className="text-white/80">
                  💡 AI artists are amazing tools that can help bring your creative visions to life. Great job learning about them!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You answered {finalScore} out of {quizQuestions.length} correctly. ({Math.round((finalScore / quizQuestions.length) * 100)}%)
                  Keep practicing to learn more about AI artists!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  💡 AI artists are amazing tools that can help bring your creative visions to life. Great job learning about them!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default AIArtistGame;