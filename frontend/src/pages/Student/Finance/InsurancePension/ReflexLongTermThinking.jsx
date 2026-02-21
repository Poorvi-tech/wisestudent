import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const TIME_LIMIT = 10;

const STAGES = [
  {
    id: 1,
    prompt: "Quick reflex: Which tap builds future security?",
    options: [
      { id: "impulse-buy", text: "Impulse Buy", outcome: "Impulse spending weakens future security.", isCorrect: false },
      { id: "skip-planning", text: "Skip Planning", outcome: "Skipping plans creates risk later.", isCorrect: false },
      { id: "start-emergency-fund", text: "Start Emergency Fund", outcome: "Correct. A buffer protects you from shocks.", isCorrect: true },
      { id: "spend-cash-fast", text: "Spend Cash Fast", outcome: "Quick spending leaves no cushion.", isCorrect: false },
    ],
  },
  {
    id: 2,
    prompt: "Bonus income appears. Best reflex?",
    options: [
      { id: "upgrade-phone", text: "Upgrade Phone Now", outcome: "Upgrades can wait; goals come first.", isCorrect: false },
      { id: "lend-risky-friend", text: "Lend to Risky Friend", outcome: "Risky lending can cause losses.", isCorrect: false },
      { id: "keep-cash-home", text: "Keep Cash at Home", outcome: "Idle cash loses value to inflation.", isCorrect: false },
      { id: "allocate-to-goals", text: "Allocate to Goals & Buffers", outcome: "Correct. Top up goals and emergency fund.", isCorrect: true },
    ],
  },
  {
    id: 3,
    prompt: "Long-term goal: retirement comfort. Best reflex?",
    options: [
      { id: "automate-pension", text: "Automate Pension Contributions", outcome: "Correct. Automatic, steady investing builds the corpus.", isCorrect: true },
      { id: "rely-on-family", text: "Rely Fully on Family", outcome: "Dependence is uncertain and risky.", isCorrect: false },
      { id: "ignore-longevity", text: "Ignore Longevity/Inflation", outcome: "Ignoring key risks reduces adequacy.", isCorrect: false },
      { id: "speculate-random", text: "Speculate Randomly", outcome: "Random bets threaten long-term goals.", isCorrect: false },
    ],
  },
  {
    id: 4,
    prompt: "Peer pressure: ‘Enjoy now, plan later’. Safer reflex?",
    options: [
      { id: "follow-crowd", text: "Follow Friends’ Spending", outcome: "Following others derails your plan.", isCorrect: false },
      { id: "delay-investments", text: "Delay Investments", outcome: "Delays shrink compounding benefits.", isCorrect: false },
      { id: "cancel-insurance", text: "Cancel Insurance", outcome: "Removing protection increases risk.", isCorrect: false },
      { id: "stick-to-plan", text: "Stick to Savings Plan", outcome: "Correct. Stay consistent with long-term priorities.", isCorrect: true },
    ],
  },
  {
    id: 5,
    prompt: "Month starts. First move?",
    options: [
      { id: "spend-then-check", text: "Spend First, Check Later", outcome: "Spending first risks overshooting essentials.", isCorrect: false },
      { id: "borrow-for-wants", text: "Borrow for Wants", outcome: "Debt for wants reduces flexibility.", isCorrect: false },
      { id: "skip-tracking", text: "Skip Tracking", outcome: "No tracking means no control.", isCorrect: false },
      { id: "pay-yourself-first", text: "Save First, Then Budget", outcome: "Correct. Pay yourself first and plan the month.", isCorrect: true },
    ],
  },
];

const ReflexLongTermThinking = () => {
  const location = useLocation();
  const totalStages = STAGES.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const gameId = "finance-insurance-pension-45";
  const gameData = getGameDataById(gameId);
  const totalCoins = gameData?.coins ?? location.state?.totalCoins ?? 10;
  const coinsPerLevel = Math.max(2, Math.floor(totalCoins / totalStages));
  const totalXp = gameData?.xp ?? location.state?.totalXp ?? 20;
  const stage = STAGES[currentStageIndex];

  useEffect(() => {
    setTimeLeft(TIME_LIMIT);
    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timer);
          if (!selectedChoice) {
            if (currentStageIndex === totalStages - 1) {
              setShowResult(true);
            } else {
              setCurrentStageIndex((i) => i + 1);
            }
          }
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [currentStageIndex]);

  const handleChoice = (option) => {
    if (selectedChoice || !stage) return;
    setSelectedChoice(option);
    if (option.isCorrect) {
      setScore((s) => s + 1);
      showCorrectAnswerFeedback(1, true);
    }
    setTimeout(() => {
      if (currentStageIndex === totalStages - 1) {
        setShowResult(true);
      } else {
        setCurrentStageIndex((i) => i + 1);
      }
      setSelectedChoice(null);
    }, 600);
  };

  const progressLabel = `${currentStageIndex + 1}/${totalStages}`;

  return (
    <GameShell
      title="Reflex: Long-Term Thinking"
      subtitle={
        showResult
          ? "Reflex complete! Planning ahead beats short-term impulses."
          : `Stage ${currentStageIndex + 1} of ${totalStages}`
      }
      currentLevel={currentStageIndex + 1}
      totalLevels={totalStages}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult}
      score={score}
      showConfetti={showResult && score === totalStages}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      gameId={gameId}
      gameType="finance"
      nextGamePath={location.state?.nextGamePath}
      nextGameId={location.state?.nextGameId}
      backPath={location.state?.returnPath}
    >
      <div className="space-y-8">
        {!showResult && stage && (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-2xl shadow-black/30">
              <div className="flex items-center justify-between text-sm font-semibold uppercase tracking-[0.2em] text-white/70">
                <span>Stage {progressLabel}</span>
                <span>Time: {timeLeft}s</span>
                <span>
                  Score: {score}/{totalStages}
                </span>
              </div>
              <p className="text-white text-lg md:text-xl font-bold leading-snug mt-4">
                {stage.prompt}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                {stage.options.map((option) => {
                  const isSelected = selectedChoice?.id === option.id;
                  const baseStyle = isSelected
                    ? option.isCorrect
                      ? "from-emerald-500 to-lime-500 border-emerald-400/80"
                      : "from-rose-500 to-orange-500 border-rose-400/80"
                    : "from-blue-500 to-cyan-500 border-transparent";
                  return (
                    <button
                      key={option.id}
                      onClick={() => handleChoice(option)}
                      disabled={Boolean(selectedChoice)}
                      className={`relative rounded-2xl bg-gradient-to-r ${baseStyle} border-2 p-5 text-left text-white font-semibold transition-all transform hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60 shadow-lg`}
                    >
                      {option.text}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default ReflexLongTermThinking;
