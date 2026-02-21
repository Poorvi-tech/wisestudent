import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const LEFT_ITEMS = [
  { id: "health", text: "Health" },
  { id: "old-age", text: "Old Age" },
  { id: "emergency", text: "Emergency" },
  { id: "income-loss", text: "Income Loss" },
  { id: "property-damage", text: "Property Damage" },
];

const RIGHT_ITEMS = [
  { id: "pension", text: "Pension" },
  { id: "property-insurance", text: "Property Insurance" },
  { id: "life-insurance", text: "Life Insurance" },
  { id: "emergency-savings", text: "Emergency Savings" },
  { id: "health-insurance", text: "Health Insurance" },
];

const SOLUTIONS = {
  "health": "health-insurance",
  "old-age": "pension",
  "emergency": "emergency-savings",
  "income-loss": "life-insurance",
  "property-damage": "property-insurance",
};

const RiskPriorityPuzzle = () => {
  const location = useLocation();
  const totalPairs = LEFT_ITEMS.length;
  const [selectedLeft, setSelectedLeft] = useState(null);
  const [selectedRight, setSelectedRight] = useState(null);
  const [matched, setMatched] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [outcomeText, setOutcomeText] = useState("");
  const { flashPoints, showCorrectAnswerFeedback } = useGameFeedback();
  const gameId = "finance-insurance-pension-41";
  const gameData = getGameDataById(gameId);
  const totalCoins = gameData?.coins ?? location.state?.totalCoins ?? 10;
  const coinsPerLevel = Math.max(2, Math.floor(totalCoins / totalPairs));
  const totalXp = gameData?.xp ?? location.state?.totalXp ?? 20;

  const remainingLeft = useMemo(
    () => LEFT_ITEMS.filter((l) => !matched[l.id]),
    [matched]
  );
  const remainingRight = useMemo(() => {
    const used = new Set(Object.values(matched));
    return RIGHT_ITEMS.filter((r) => !used.has(r.id));
  }, [matched]);

  const handleLeftSelect = (l) => {
    if (matched[l.id]) return;
    setSelectedLeft(l);
    setOutcomeText("");
  };

  const handleRightSelect = (r) => {
    setSelectedRight(r);
    if (!selectedLeft) return;
    const correctRight = SOLUTIONS[selectedLeft.id];
    if (r.id === correctRight) {
      setMatched((m) => ({ ...m, [selectedLeft.id]: r.id }));
      setScore((s) => s + 1);
      showCorrectAnswerFeedback(1, true);
      setOutcomeText(`${selectedLeft.text} → ${r.text} matched`);
      const doneCount = Object.keys(matched).length + 1;
      if (doneCount === totalPairs) {
        setShowResult(true);
      }
    } else {
      setOutcomeText("Not a priority match. Try again.");
    }
    setSelectedLeft(null);
    setSelectedRight(null);
  };

  const currentLevel = Math.min(score + 1, totalPairs);

  return (
    <GameShell
      title="Risk Priority Puzzle"
      subtitle={
        showResult
          ? "Puzzle complete! You matched risks to the right priorities."
          : `Match the columns: ${score}/${totalPairs} matched`
      }
      currentLevel={currentLevel}
      totalLevels={totalPairs}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult}
      score={score}
      showConfetti={showResult && score === totalPairs}
      flashPoints={flashPoints}
      gameId={gameId}
      gameType="finance"
      nextGamePath={location.state?.nextGamePath}
      nextGameId={location.state?.nextGameId}
      backPath={location.state?.returnPath}
    >
      <div className="space-y-6">
        {!showResult && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20">
              <div className="text-sm font-semibold uppercase tracking-[0.2em] text-white/70 mb-3">
                Left: Risks
              </div>
              <div className="space-y-3">
                {LEFT_ITEMS.map((l) => {
                  const isMatched = Boolean(matched[l.id]);
                  const isSelected = selectedLeft?.id === l.id;
                  const base =
                    isMatched
                      ? "from-emerald-500 to-lime-500 border-emerald-400/80 opacity-80"
                      : isSelected
                      ? "from-blue-500 to-cyan-500 border-cyan-400/70"
                      : "from-blue-500 to-cyan-500 border-transparent";
                  return (
                    <button
                      key={l.id}
                      onClick={() => handleLeftSelect(l)}
                      disabled={isMatched}
                      className={`w-full text-left rounded-2xl bg-gradient-to-r ${base} border-2 p-4 text-white font-semibold transition-all disabled:opacity-60`}
                    >
                      {l.text}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20">
              <div className="text-sm font-semibold uppercase tracking-[0.2em] text-white/70 mb-3">
                Right: Priority
              </div>
              <div className="grid grid-cols-1 gap-3">
                {RIGHT_ITEMS.map((r) => {
                  const used = Object.values(matched).includes(r.id);
                  const isActive = selectedRight?.id === r.id;
                  const base =
                    used
                      ? "from-emerald-500 to-lime-500 border-emerald-400/80 opacity-80"
                      : isActive
                      ? "from-pink-500 to-rose-500 border-rose-400/70"
                      : "from-pink-500 to-rose-500 border-transparent";
                  return (
                    <button
                      key={r.id}
                      onClick={() => handleRightSelect(r)}
                      disabled={used}
                      className={`w-full text-left rounded-2xl bg-gradient-to-r ${base} border-2 p-4 text-white font-semibold transition-all disabled:opacity-60`}
                    >
                      {r.text}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
        {outcomeText && !showResult && (
          <div className="rounded-2xl bg-white/10 border border-white/20 p-4 text-sm text-white/80">
            {outcomeText}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default RiskPriorityPuzzle;
