import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const PAIRS = [
  { left: "Monthly Saving", right: "Long-term Growth", id: "monthly-saving" },
  { left: "Delay", right: "Less Corpus", id: "delay" },
  { left: "Early Start", right: "More Compounding", id: "early-start" },
  { left: "Employer Contribution", right: "Extra Boost", id: "employer" },
  { left: "Inflation", right: "Erodes Value", id: "inflation" },
];

const buildShuffled = (arr) => {
  const left = arr.map((p, idx) => ({
    type: "left",
    text: p.left,
    key: `L${idx}`,
    id: p.id,
  }));

  const right = arr
    .map((p, idx) => ({
      type: "right",
      text: p.right,
      key: `R${idx}`,
      id: p.id,
    }))
    .sort(() => Math.random() - 0.5);

  return { left, right };
};

const PensionFundPuzzle = () => {
  const location = useLocation();

  // ✅ flashPoints removed
  const { showAnswerConfetti, showCorrectAnswerFeedback } =
    useGameFeedback();

  const totalStages = PAIRS.length;
  const gameId = "finance-insurance-pension-27";
  const gameData = getGameDataById(gameId);

  const totalCoins = gameData?.coins ?? location.state?.totalCoins ?? 10;
  const coinsPerLevel = Math.max(
    2,
    Math.floor(totalCoins / totalStages)
  );
  const totalXp = gameData?.xp ?? location.state?.totalXp ?? 20;

  const [pairsState, setPairsState] = useState(buildShuffled(PAIRS));
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedLeft, setSelectedLeft] = useState(null);
  const [matchedIds, setMatchedIds] = useState(new Set());
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const progressLabel = `${currentStageIndex + 1}/${totalStages}`;

  const rightOptions = useMemo(
    () => pairsState.right.filter((r) => !matchedIds.has(r.id)),
    [pairsState.right, matchedIds]
  );

  const handleSelectLeft = (item) => {
    if (showResult) return;
    setSelectedLeft(item);
  };

  const handleSelectRight = (item) => {
    if (showResult || !selectedLeft) return;

    const correct = selectedLeft.id === item.id;

    if (correct) {
      setScore((prev) => prev + 1);
      showCorrectAnswerFeedback(2, true);

      const newMatched = new Set(matchedIds);
      newMatched.add(item.id);
      setMatchedIds(newMatched);

      if (currentStageIndex === totalStages - 1) {
        setTimeout(() => setShowResult(true), 600);
      } else {
        setTimeout(
          () => setCurrentStageIndex((prev) => prev + 1),
          400
        );
      }
    }

    setSelectedLeft(null);
  };

  const resetPuzzle = () => {
    setPairsState(buildShuffled(PAIRS));
    setSelectedLeft(null);
    setMatchedIds(new Set());
    setScore(0);
    setCurrentStageIndex(0);
    setShowResult(false);
  };

  return (
    <GameShell
      title="Pension Fund Puzzle"
      subtitle={
        showResult
          ? "Puzzle complete! Monthly saving + time grow your pension."
          : `Match ${progressLabel}: Link action to outcome`
      }
      currentLevel={currentStageIndex + 1}
      totalLevels={totalStages}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult}
      score={score}
      showConfetti={showResult && score === totalStages}
      showAnswerConfetti={showAnswerConfetti}
      gameId={gameId}
      gameType="finance"
      nextGamePath={location.state?.nextGamePath}
      nextGameId={location.state?.nextGameId}
      backPath={location.state?.returnPath}
    >
      <div className="space-y-8">
        {!showResult && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white/10 border border-white/20 rounded-2xl p-5">
              <div className="text-white/80 text-sm font-semibold mb-3">
                Actions
              </div>
              <div className="space-y-3">
                {pairsState.left.map((l) => {
                  const isMatched = matchedIds.has(l.id);
                  const isSelected = selectedLeft?.key === l.key;

                  const base = isMatched
                    ? "from-emerald-500 to-lime-500 border-emerald-400/70 opacity-70"
                    : isSelected
                    ? "from-amber-500 to-pink-500 border-amber-400/70"
                    : "from-blue-500 to-cyan-500 border-transparent";

                  return (
                    <button
                      key={l.key}
                      onClick={() => handleSelectLeft(l)}
                      disabled={isMatched}
                      className={`w-full text-left rounded-xl bg-gradient-to-r ${base} border-2 p-4 text-white font-semibold transition-all disabled:opacity-60`}
                    >
                      {l.text}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="bg-white/10 border border-white/20 rounded-2xl p-5">
              <div className="text-white/80 text-sm font-semibold mb-3">
                Outcomes
              </div>
              <div className="space-y-3">
                {rightOptions.map((r) => (
                  <button
                    key={r.key}
                    onClick={() => handleSelectRight(r)}
                    className="w-full text-left rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 border-2 border-transparent p-4 text-white font-semibold transition-all"
                  >
                    {r.text}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {showResult && (
          <div className="space-y-4">
            <div className="rounded-2xl bg-white/10 border border-white/20 p-4 text-sm text-white/80">
              Monthly saving plus early start and employer boosts grow a
              pension. Delays and inflation reduce corpus.
            </div>

            <div className="flex gap-3">
              <button
                onClick={resetPuzzle}
                className="px-5 py-2 rounded-full bg-gradient-to-r from-amber-400 to-pink-500 text-white font-semibold shadow-lg hover:opacity-90"
              >
                Replay
              </button>
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PensionFundPuzzle;