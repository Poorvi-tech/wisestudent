import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const MATCH_PAIRS = [
  { id: 1, left: "Bill / Invoice", right: "Proof" },
  { id: 2, left: "Memory", right: "Confusion" },
  { id: 3, left: "Written Diary", right: "Expense Tracking" },
  { id: 4, left: "Oral Promise", right: "Disputes" },
  { id: 5, left: "Separate Bank", right: "Clear Income" },
];

const PuzzleRecordMatcher = () => {
  const location = useLocation();
  const gameId = "finance-business-livelihood-finance-4";
  const gameData = getGameDataById(gameId);

  const [leftItems, setLeftItems] = useState([]);
  const [rightItems, setRightItems] = useState([]);
  const [selectedLeft, setSelectedLeft] = useState(null);
  const [selectedRight, setSelectedRight] = useState(null);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [errorPair, setErrorPair] = useState(null);

  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const totalStages = 1; 
  const totalCoins = gameData?.coins ?? location.state?.totalCoins ?? 5;
  const coinsPerLevel = Math.max(1, Math.floor(totalCoins / MATCH_PAIRS.length));
  const totalXp = gameData?.xp ?? location.state?.totalXp ?? 10;

  useEffect(() => {
    // Shuffle left and right items independently on mount
    const shuffledLeft = [...MATCH_PAIRS].sort(() => Math.random() - 0.5);
    const shuffledRight = [...MATCH_PAIRS].sort(() => Math.random() - 0.5);
    setLeftItems(shuffledLeft);
    setRightItems(shuffledRight);
  }, []);

  useEffect(() => {
    // Check for match
    if (selectedLeft && selectedRight) {
      if (selectedLeft.id === selectedRight.id) {
        // Match found
        setMatchedPairs((prev) => [...prev, selectedLeft.id]);
        setScore((prev) => prev + 1);
        showCorrectAnswerFeedback(1, true);
        setSelectedLeft(null);
        setSelectedRight(null);
        
        if (matchedPairs.length + 1 === MATCH_PAIRS.length) {
          setTimeout(() => setShowResult(true), 800);
        }
      } else {
        // No match
        setErrorPair({ left: selectedLeft.id, right: selectedRight.id });
        setTimeout(() => {
          setSelectedLeft(null);
          setSelectedRight(null);
          setErrorPair(null);
        }, 800);
      }
    }
  }, [selectedLeft, selectedRight, matchedPairs.length, showCorrectAnswerFeedback]);

  const handleLeftClick = (item) => {
    if (matchedPairs.includes(item.id) || errorPair) return;
    setSelectedLeft(item);
  };

  const handleRightClick = (item) => {
    if (matchedPairs.includes(item.id) || errorPair) return;
    setSelectedRight(item);
  };

  const currentLevel = Math.min(score + 1, MATCH_PAIRS.length);

  return (
    <GameShell
      title="Puzzle: Record Matcher"
      subtitle={
        showResult
          ? "Puzzle complete! You're a record keeping expert."
          : `Match the correct pairs!`
      }
      currentLevel={currentLevel}
      totalLevels={MATCH_PAIRS.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult}
      score={score}
      showConfetti={showResult}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      gameId={gameId}
      gameType="finance"
      nextGamePath={location.state?.nextGamePath}
      nextGameId={location.state?.nextGameId}
      backPath={location.state?.returnPath}
    >
      <div className="space-y-8">
        {!showResult && (
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-4 md:p-6 border border-white/20 shadow-2xl">
            <div className="flex items-center justify-between text-sm font-semibold uppercase tracking-[0.2em] text-white/70 mb-6">
              <span>Find 5 Matches</span>
              <span>Score: {score}/5</span>
            </div>

            <div className="flex flex-row justify-between gap-4 md:gap-8">
              {/* Left Column */}
              <div className="flex flex-col gap-3 w-1/2">
                {leftItems.map((item) => {
                  const isMatched = matchedPairs.includes(item.id);
                  const isSelected = selectedLeft?.id === item.id;
                  const isError = errorPair?.left === item.id;
                  
                  let baseStyle = "bg-white/5 border-white/10 hover:bg-white/10 text-white/90";
                  if (isSelected) baseStyle = "bg-blue-500/40 border-blue-400 ring-2 ring-blue-400 text-white";
                  if (isMatched) baseStyle = "bg-emerald-500/20 border-emerald-500/50 text-emerald-200 opacity-50";
                  if (isError) baseStyle = "bg-rose-500/40 border-rose-500 ring-2 ring-rose-500 text-white animate-shake";

                  return (
                    <button
                      key={`left-${item.id}`}
                      onClick={() => handleLeftClick(item)}
                      disabled={isMatched}
                      style={{ animationDuration: '0.3s' }}
                      className={`relative w-full rounded-2xl border-2 p-4 text-center font-bold transition-all shadow-md min-h-[80px] flex items-center justify-center ${baseStyle}`}
                    >
                      {item.left}
                    </button>
                  );
                })}
              </div>

              {/* Right Column */}
              <div className="flex flex-col gap-3 w-1/2">
                {rightItems.map((item) => {
                  const isMatched = matchedPairs.includes(item.id);
                  const isSelected = selectedRight?.id === item.id;
                  const isError = errorPair?.right === item.id;
                  
                  let baseStyle = "bg-white/5 border-white/10 hover:bg-white/10 text-white/90";
                  if (isSelected) baseStyle = "bg-purple-500/40 border-purple-400 ring-2 ring-purple-400 text-white";
                  if (isMatched) baseStyle = "bg-emerald-500/20 border-emerald-500/50 text-emerald-200 opacity-50";
                  if (isError) baseStyle = "bg-rose-500/40 border-rose-500 ring-2 ring-rose-500 text-white animate-shake";

                  return (
                    <button
                      key={`right-${item.id}`}
                      onClick={() => handleRightClick(item)}
                      disabled={isMatched}
                      style={{ animationDuration: '0.3s' }}
                      className={`relative w-full rounded-2xl border-2 p-4 text-center font-bold transition-all shadow-md min-h-[80px] flex items-center justify-center ${baseStyle}`}
                    >
                      {item.right}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          50% { transform: translateX(5px); }
          75% { transform: translateX(-5px); }
        }
        .animate-shake {
          animation: shake cubic-bezier(.36,.07,.19,.97) both;
        }
      `}} />
    </GameShell>
  );
};

export default PuzzleRecordMatcher;
