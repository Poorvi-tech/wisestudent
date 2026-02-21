import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const STAGES = [
  {
    id: 1,
    prompt: "Which should come first for most families?",
    options: [
      { id: "invest-first", text: "Invest first, insurance later", outcome: "Risky. Big shocks can derail investments.", isCorrect: false },
      { id: "none", text: "Neither is needed", outcome: "Ignoring both increases vulnerability.", isCorrect: false },
      { id: "insurance-first", text: "Adequate insurance, then investments", outcome: "Correct. Protection prevents forced sell-offs.", isCorrect: true },
    ],
  },
  {
    id: 2,
    prompt: "With dependents and tight budget, best priority?",
    options: [
      { id: "only-sip", text: "Only SIPs for high returns", outcome: "Uncovered risks can wipe out gains.", isCorrect: false },
      { id: "term-then-sip", text: "Basic term/health cover, then small SIPs", outcome: "Correct. Cover big risks, then grow steadily.", isCorrect: true },
      { id: "no-plan", text: "No plan for now", outcome: "Inaction leaves the family exposed.", isCorrect: false },
    ],
  },
  {
    id: 3,
    prompt: "What is the key argument for insurance-before-investment?",
    options: [
      { id: "stability", text: "Stability against income/health shocks", outcome: "Correct. Stability enables consistent investing.", isCorrect: true },
      { id: "guaranteed-returns", text: "Insurance guarantees highest returns", outcome: "Insurance provides protection, not high returns.", isCorrect: false },
      { id: "tax-only", text: "Only useful for tax", outcome: "Tax is secondary to risk protection.", isCorrect: false },
    ],
  },
  {
    id: 4,
    prompt: "When might investing before full cover be acceptable?",
    options: [
      { id: "always-invest", text: "Always invest first", outcome: "One-size-fits-all is unsafe.", isCorrect: false },
      { id: "no-dependents-ef", text: "No dependents, emergency fund, low risk", outcome: "Correct. Context matters.", isCorrect: true },
      { id: "never-invest", text: "Never invest until fully insured", outcome: "Balance is needed once major risks covered.", isCorrect: false },
    ],
  },
  {
    id: 5,
    prompt: "Best combined approach for long-term security?",
    options: [
      { id: "cover-only", text: "Only insurance, never invest", outcome: "Protection without growth may miss goals.", isCorrect: false },
      { id: "invest-only", text: "Only investing, no cover", outcome: "Uncovered risks can undo progress.", isCorrect: false },
      { id: "cover+invest", text: "Adequate cover + disciplined investing", outcome: "Correct. Protection plus growth builds wealth safely.", isCorrect: true },
    ],
  },
];

const DebateInsuranceVsInvestment = () => {
  const location = useLocation();
  const totalStages = STAGES.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();
  const gameId = "finance-insurance-pension-42";
  const gameData = getGameDataById(gameId);
  const totalCoins = gameData?.coins ?? location.state?.totalCoins ?? 10;
  const coinsPerLevel = Math.max(2, Math.floor(totalCoins / totalStages));
  const totalXp = gameData?.xp ?? location.state?.totalXp ?? 20;
  const stage = STAGES[currentStageIndex];

  const handleChoice = (option) => {
    if (selectedChoice || !stage) return;
    setSelectedChoice(option);
    if (option.isCorrect) {
      setScore((s) => s + 1);
      showCorrectAnswerFeedback(1, true);
    }
    if (currentStageIndex === totalStages - 1) {
      setTimeout(() => setShowResult(true), 800);
    }
  };

  const handleNextStage = () => {
    if (!selectedChoice) return;
    if (currentStageIndex === totalStages - 1) {
      setShowResult(true);
    } else {
      setCurrentStageIndex((i) => i + 1);
    }
    setSelectedChoice(null);
  };

  const progressLabel = `${currentStageIndex + 1}/${totalStages}`;

  return (
    <GameShell
      title="Debate: Insurance vs Investment"
      subtitle={
        showResult
          ? "Debate complete! Balance protection and growth wisely."
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
                <span>
                  Score: {score}/{totalStages}
                </span>
              </div>
              <p className="text-white text-lg md:text-xl font-bold leading-snug mt-4">
                {stage.prompt}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
        {selectedChoice && (
          <>
            <div className="rounded-2xl bg-white/10 border border-white/20 p-4 text-sm text-white/80">
              {selectedChoice.outcome}
            </div>
            {currentStageIndex < totalStages - 1 && (
              <div className="flex justify-end">
                <button
                  onClick={handleNextStage}
                  className="px-5 py-2 rounded-full bg-gradient-to-r from-amber-400 to-pink-500 text-white font-semibold shadow-lg hover:opacity-90"
                >
                  Next Stage
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </GameShell>
  );
};

export default DebateInsuranceVsInvestment;
