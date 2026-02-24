import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const LEFT_ITEMS = [
  { id: "fair-price", text: "Fair & Transparent Pricing" },
  { id: "bill-receipt", text: "Providing Bills & Receipts" },
  { id: "good-quality", text: "Consistent Product Quality" },
  { id: "digital-presence", text: "Active Digital / Online Presence" },
  { id: "customer-service", text: "Responsive Customer Service" },
];

const RIGHT_ITEMS = [
  { id: "legal-credibility", text: "Legal Credibility & Dispute Safety" },
  { id: "trust-loyalty", text: "Customer Trust & Loyalty" },
  { id: "wider-reach", text: "Wider Market Reach & Discovery" },
  { id: "star-rating", text: "High Star Rating & Repeat Buyers" },
  { id: "word-of-mouth", text: "Positive Word-of-Mouth Referrals" },
];

const SOLUTIONS = {
  "fair-price": "trust-loyalty",
  "bill-receipt": "legal-credibility",
  "good-quality": "star-rating",
  "digital-presence": "wider-reach",
  "customer-service": "word-of-mouth",
};

const PuzzleBrandBuilder = () => {
  const location = useLocation();
  const totalPairs = LEFT_ITEMS.length;
  const [selectedLeft, setSelectedLeft] = useState(null);
  const [selectedRight, setSelectedRight] = useState(null);
  const [matched, setMatched] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [outcomeText, setOutcomeText] = useState("");
  const { flashPoints, showCorrectAnswerFeedback } = useGameFeedback();

  // Registering at index 76
  const gameId = "finance-business-livelihood-finance-76";
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
      setOutcomeText(`Brand boost! ${selectedLeft.text} → ${r.text}`);
      const doneCount = Object.keys(matched).length + 1;
      if (doneCount === totalPairs) {
        setShowResult(true);
      }
    } else {
      setOutcomeText("Not quite! Think about what outcome this practice directly drives.");
    }
    setSelectedLeft(null);
    setSelectedRight(null);
  };

  const currentLevel = Math.min(score + 1, totalPairs);

  return (
    <GameShell
      title="Puzzle: Brand Builder"
      subtitle={
        showResult
          ? "Puzzle complete! You understand how professional practices build a strong brand."
          : `Connect practices to outcomes: ${score}/${totalPairs} matched`
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
            <div className="bg-slate-900/60 backdrop-blur-xl rounded-3xl p-6 border border-slate-700 shadow-xl">
              <div className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400 mb-4 border-b border-slate-700 pb-2">
                Business Practice
              </div>
              <div className="space-y-3">
                {LEFT_ITEMS.map((l) => {
                  const isMatched = Boolean(matched[l.id]);
                  const isSelected = selectedLeft?.id === l.id;
                  const base =
                    isMatched
                      ? "from-emerald-900/50 to-emerald-800/50 border-emerald-500/50 opacity-50 text-emerald-200"
                      : isSelected
                      ? "from-blue-600 to-indigo-600 border-indigo-400 text-white shadow-[0_0_15px_rgba(99,102,241,0.5)] scale-[1.02]"
                      : "from-slate-800 to-slate-900 border-slate-600 text-slate-300 hover:border-indigo-500";
                  return (
                    <button
                      key={l.id}
                      onClick={() => handleLeftSelect(l)}
                      disabled={isMatched}
                      className={`w-full text-left rounded-xl bg-gradient-to-r ${base} border-2 p-4 font-semibold transition-all duration-300`}
                    >
                      {l.text}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="bg-slate-900/60 backdrop-blur-xl rounded-3xl p-6 border border-slate-700 shadow-xl">
              <div className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400 mb-4 border-b border-slate-700 pb-2">
                Brand Outcome
              </div>
              <div className="grid grid-cols-1 gap-3">
                {RIGHT_ITEMS.map((r) => {
                  const used = Object.values(matched).includes(r.id);
                  const isActive = selectedRight?.id === r.id;
                  const base =
                    used
                      ? "from-emerald-900/50 to-emerald-800/50 border-emerald-500/50 opacity-50 text-emerald-200"
                      : isActive
                      ? "from-rose-600 to-pink-600 border-rose-400 text-white shadow-[0_0_15px_rgba(244,63,94,0.5)] scale-[1.02]"
                      : "from-slate-800 to-slate-900 border-slate-600 text-slate-300 hover:border-rose-500";
                  return (
                    <button
                      key={r.id}
                      onClick={() => handleRightSelect(r)}
                      disabled={used}
                      className={`w-full text-left rounded-xl bg-gradient-to-r ${base} border-2 p-4 font-semibold transition-all duration-300`}
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
          <div className="rounded-xl bg-slate-800/80 border border-slate-600 p-4 text-center text-sm text-slate-300 font-medium animate-fade-in-up">
            {outcomeText}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PuzzleBrandBuilder;
