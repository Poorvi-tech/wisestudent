import React, { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const PROTECTION_REFLEX_STAGES = [
  {
    id: 1,
    prompt:
      "Sudden hospital bill appears for an emergency surgery. Your reflex?",
    options: [
      
      {
        id: "no-planning",
        text: "No Planning",
        outcome:
          "Without planning, a big hospital bill can wipe out savings or force debt.",
        isCorrect: false,
      },
      {
        id: "risk-covered",
        text: "Risk Covered (Health cover)",
        outcome:
          "Correct. Insurance turns a large medical expense into a manageable claim.",
        isCorrect: true,
      },
      {
        id: "borrow-immediately",
        text: "Borrow Immediately",
        outcome:
          "Loans add burden and interest; cover is better for these shocks.",
        isCorrect: false,
      },
      {
        id: "delay-decision",
        text: "Delay Decision",
        outcome: "Delays worsen outcomes and stress. Protection is proactive.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 2,
    prompt:
      "Your two-wheeler meets an accident with third‑party damage. Your reflex?",
    options: [
      
      {
        id: "no-planning",
        text: "No Planning",
        outcome:
          "No cover means you may bear costly repairs and third‑party liabilities.",
        isCorrect: false,
      },
      {
        id: "borrow-immediately",
        text: "Borrow Immediately",
        outcome:
          "Borrowing is not protection; liability cover exists for this scenario.",
        isCorrect: false,
      },
      {
        id: "risk-covered",
        text: "Risk Covered (Motor/third‑party)",
        outcome:
          "Correct. Third‑party liability cover protects you from heavy penalties and payouts.",
        isCorrect: true,
      },
      {
        id: "hope-it-passes",
        text: "Hope It Passes",
        outcome: "Hope is not a plan. Protection absorbs the shock.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 3,
    prompt: "Home suffers a fire; repair costs are huge. Your reflex?",
    options: [
      {
        id: "risk-covered",
        text: "Risk Covered (Property cover)",
        outcome:
          "Correct. Property insurance helps recover from fire and allied perils.",
        isCorrect: true,
      },
      {
        id: "no-planning",
        text: "No Planning",
        outcome:
          "No cover means the entire replacement cost falls on your pocket.",
        isCorrect: false,
      },
      {
        id: "borrow-immediately",
        text: "Borrow Immediately",
        outcome:
          "Debt after disaster deepens losses; protection reduces the shock.",
        isCorrect: false,
      },
      {
        id: "delay-decision",
        text: "Delay Decision",
        outcome:
          "Delaying claims or decisions risks further damage and denial windows.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 4,
    prompt:
      "Primary earner diagnosed with a critical illness; income will pause. Reflex?",
    options: [
      
      {
        id: "no-planning",
        text: "No Planning",
        outcome:
          "Without protection, families face income loss plus treatment costs.",
        isCorrect: false,
      },
      {
        id: "borrow-immediately",
        text: "Borrow Immediately",
        outcome:
          "Loans may help cash flow but add stress; protection provides resilience.",
        isCorrect: false,
      },
      {
        id: "hope-it-passes",
        text: "Hope It Passes",
        outcome:
          "Hope alone cannot pay bills; planned protection cushions the blow.",
        isCorrect: false,
      },
      {
        id: "risk-covered",
        text: "Risk Covered (Critical illness/term)",
        outcome:
          "Correct. Payouts from protection ease income shock during treatment.",
        isCorrect: true,
      },
    ],
  },
  {
    id: 5,
    prompt: "Crop failure or weather shock hits family income. Reflex?",
    options: [
      {
        id: "risk-covered",
        text: "Risk Covered (Relevant agri/term cover)",
        outcome:
          "Correct. Suitable coverage transfers part of the risk away from income.",
        isCorrect: true,
      },
      {
        id: "no-planning",
        text: "No Planning",
        outcome:
          "Without planning, a single event can destabilize the entire budget.",
        isCorrect: false,
      },
      {
        id: "borrow-immediately",
        text: "Borrow Immediately",
        outcome:
          "Debt after loss can spiral; protection aims to reduce such shocks.",
        isCorrect: false,
      },
      {
        id: "delay-decision",
        text: "Delay Decision",
        outcome: "Reflex action beats delay; protection readies you beforehand.",
        isCorrect: false,
      },
    ],
  },
];

const ProtectionReflex = () => {
  const location = useLocation();
  const gameId = "finance-insurance-pension-2";
  const gameData = getGameDataById(gameId);
  const totalStages = PROTECTION_REFLEX_STAGES.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const totalCoins = gameData?.coins ?? location.state?.totalCoins ?? 5;
  const coinsPerLevel = Math.max(1, Math.floor(totalCoins / totalStages));
  const totalXp = gameData?.xp ?? location.state?.totalXp ?? 10;
  const stage = useMemo(() => PROTECTION_REFLEX_STAGES[currentStageIndex], [currentStageIndex]);

  useEffect(() => {
    setTimeLeft(10);
    setSelectedChoice(null);
  }, [currentStageIndex]);

  useEffect(() => {
    if (showResult) return;
    if (selectedChoice) return;
    let timer = null;
    setTimeLeft((t) => t); // ensure state inits
    timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          if (!selectedChoice) {
            const timeoutChoice = {
              id: "timeout",
              text: "Time's up",
              outcome:
                "Time's up! Reflex missed. Correct reflex: Tap “Risk Covered.”",
              isCorrect: false,
            };
            setSelectedChoice(timeoutChoice);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (timer) clearInterval(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStageIndex, selectedChoice, showResult]);

  const handleChoice = (option) => {
    if (selectedChoice || !stage) return;
    setSelectedChoice(option);
    if (option.isCorrect) {
      setScore((prev) => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }
    if (currentStageIndex === totalStages - 1) {
      setTimeout(() => {
        setShowResult(true);
      }, 600);
    }
  };

  const handleNextStage = () => {
    if (!selectedChoice) return;
    if (currentStageIndex === totalStages - 1) {
      setShowResult(true);
    } else {
      setCurrentStageIndex((prev) => prev + 1);
    }
  };

  const progressLabel = `${currentStageIndex + 1}/${totalStages}`;

  return (
    <GameShell
      title="Protection Reflex"
      subtitle={
        showResult
          ? "Reflex quiz complete! Protection beats no planning."
          : `Stage ${currentStageIndex + 1} of ${totalStages} • ${timeLeft}s`
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
                      disabled={Boolean(selectedChoice) || timeLeft <= 0}
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

export default ProtectionReflex;

