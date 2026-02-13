import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const PUBLIC_WIFI_STAGES = [
  {
    id: 1,
    prompt: "Is it safe to use banking apps on public Wi-Fi?",
    options: [
      {
        id: "yes",
        label: "Yes",
        reflection: "Public Wi-Fi networks lack security encryption and create significant vulnerability to data interception and financial information theft.",
        isCorrect: false,
      },
     
      {
        id: "sometimes",
        label: "Sometimes with precautions",
        reflection: "Even with precautions, public Wi-Fi fundamentally lacks the security infrastructure needed to protect sensitive financial transactions adequately.",
        isCorrect: false,
      },
       {
        id: "no",
        label: "No, it risks data theft",
        reflection: "Exactly! Public networks are prime targets for hackers who can intercept sensitive financial data transmitted over unsecured connections.",
        isCorrect: true,
      },
      {
        id: "password",
        label: "Only with password protection",
        reflection: "Password protection secures network access but doesn't encrypt data transmission - financial information remains vulnerable to interception.",
        isCorrect: false,
      },
    ],
    reward: 10,
  },
  {
    id: 2,
    prompt: "What makes public Wi-Fi particularly dangerous?",
    options: [
      {
        id: "crowded",
        label: "Many people using the same network",
        reflection: "Crowded networks increase exposure but the fundamental danger lies in lacking encryption and authentication security measures.",
        isCorrect: false,
      },
      {
        id: "unsecured",
        label: "Lack of encryption and security",
        reflection: "Perfect! Public Wi-Fi typically lacks end-to-end encryption, allowing hackers to intercept and steal transmitted financial data.",
        isCorrect: true,
      },
      {
        id: "slow",
        label: "Slower connection speeds",
        reflection: "Speed issues affect performance but don't create the security vulnerabilities that make public networks dangerous for financial activities.",
        isCorrect: false,
      },
      {
        id: "free",
        label: "Being free to use",
        reflection: "Cost doesn't determine security - the danger comes from inadequate protection mechanisms rather than the pricing model of the network.",
        isCorrect: false,
      },
    ],
    reward: 10,
  },
  {
    id: 3,
    prompt: "How do hackers exploit public Wi-Fi?",
    options: [
      {
        id: "guessing",
        label: "Guessing passwords",
        reflection: "Modern banking uses multi-factor authentication that goes beyond simple password guessing on public networks.",
        isCorrect: false,
      },
      {
        id: "interception",
        label: "Intercepting data transmission",
        reflection: "Exactly! Hackers create fake networks or use packet sniffing tools to capture sensitive information transmitted over public connections.",
        isCorrect: true,
      },
      {
        id: "malware",
        label: "Installing malware remotely",
        reflection: "Remote malware installation requires different attack vectors - public Wi-Fi primarily enables data interception during transmission.",
        isCorrect: false,
      },
      {
        id: "phishing",
        label: "Sending phishing emails",
        reflection: "Phishing attacks are delivery method independent - public Wi-Fi specifically enables real-time data capture during legitimate transactions.",
        isCorrect: false,
      },
    ],
    reward: 10,
  },
  {
    id: 4,
    prompt: "What's the safest alternative to public Wi-Fi banking?",
    options: [
      
      {
        id: "vpn",
        label: "Connect through VPN service",
        reflection: "VPNs add protection but introduce additional complexity and potential vulnerabilities - direct mobile data is simpler and more reliable.",
        isCorrect: false,
      },
      {
        id: "later",
        label: "Wait until home network",
        reflection: "Delaying transactions creates inconvenience and may miss time-sensitive opportunities - secure mobile data enables immediate safe transactions.",
        isCorrect: false,
      },
      {
        id: "caution",
        label: "Proceed with extra caution",
        reflection: "Extra caution can't overcome fundamental security gaps - the network infrastructure itself lacks necessary protections for financial data.",
        isCorrect: false,
      },
      {
        id: "mobile",
        label: "Use mobile data network",
        reflection: "Perfect! Mobile networks provide encrypted, authenticated connections that are significantly more secure than public Wi-Fi for financial activities.",
        isCorrect: true,
      },
    ],
    reward: 10,
  },
  {
    id: 5,
    prompt: "What should you do if you must use public Wi-Fi?",
    options: [
     
      {
        id: "quick",
        label: "Complete transactions quickly",
        reflection: "Speed doesn't reduce risk - even brief exposure on unsecured networks creates vulnerability windows for data interception.",
        isCorrect: false,
      },
      {
        id: "apps",
        label: "Use only trusted apps",
        reflection: "App trustworthiness matters but doesn't compensate for network-level security deficiencies that enable data capture regardless of app quality.",
        isCorrect: false,
      },
       {
        id: "avoid",
        label: "Avoid financial activities completely",
        reflection: "Exactly! When public Wi-Fi is unavoidable, postponing financial transactions eliminates exposure to interception risks entirely.",
        isCorrect: true,
      },
      {
        id: "logout",
        label: "Log out immediately after",
        reflection: "Logging out protects against session hijacking but doesn't prevent real-time data interception during the actual transaction process.",
        isCorrect: false,
      },
    ],
    reward: 10,
  },
];

const totalStages = PUBLIC_WIFI_STAGES.length;
const successThreshold = totalStages;

const PublicWifiRisk = () => {
  const location = useLocation();
  const gameId = "finance-young-adult-47";
  const gameData = getGameDataById(gameId);
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 10;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 10;
  const totalXp = gameData?.xp || location.state?.totalXp || 20;
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const [currentStage, setCurrentStage] = useState(0);
  const [coins, setCoins] = useState(0);
  const [history, setHistory] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [selectedReflection, setSelectedReflection] = useState(null);
  const [canProceed, setCanProceed] = useState(false);

  const reflectionPrompts = useMemo(
    () => [
      "How can avoiding public Wi-Fi for financial activities actually increase your transaction flexibility rather than restrict it?",
      "What personal protocols help you maintain financial security without creating unnecessary anxiety about legitimate mobile data usage?",
    ],
    []
  );

  const handleChoice = (option) => {
    if (selectedOption || showResult) return;

    resetFeedback();
    const currentStageData = PUBLIC_WIFI_STAGES[currentStage];
    const updatedHistory = [
      ...history,
      { stageId: currentStageData.id, isCorrect: option.isCorrect },
    ];
    setHistory(updatedHistory);
    setSelectedOption(option.id);
    setSelectedReflection(option.reflection);
    setShowFeedback(true);
    setCanProceed(false);
    
    if (option.isCorrect) {
      setCoins(prevCoins => prevCoins + 1);
    }
    
    setTimeout(() => {
      setCanProceed(true);
    }, 1500);
    
    if (currentStage === totalStages - 1) {
      setTimeout(() => {
        const correctCount = updatedHistory.filter((item) => item.isCorrect).length;
        const passed = correctCount === successThreshold;
        setFinalScore(correctCount);
        setCoins(passed ? totalCoins : 0);
        setShowResult(true);
      }, 5500);
    }
    
    if (option.isCorrect) {
      showCorrectAnswerFeedback(currentStageData.reward, true);
    } else {
      showCorrectAnswerFeedback(0, false);
    }
  };

  const handleRetry = () => {
    resetFeedback();
    setCurrentStage(0);
    setHistory([]);
    setSelectedOption(null);
    setCoins(0);
    setFinalScore(0);
    setShowResult(false);
  };

  const subtitle = `Stage ${Math.min(currentStage + 1, totalStages)} of ${totalStages}`;
  const stage = PUBLIC_WIFI_STAGES[Math.min(currentStage, totalStages - 1)];
  const hasPassed = finalScore === successThreshold;

  return (
    <GameShell
      title="Public Wi-Fi Risk"
      subtitle={subtitle}
      score={coins}
      coins={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      maxScore={PUBLIC_WIFI_STAGES.length}
      currentLevel={Math.min(currentStage + 1, PUBLIC_WIFI_STAGES.length)}
      totalLevels={PUBLIC_WIFI_STAGES.length}
      gameId={gameId}
      gameType="finance"
      showGameOver={showResult}
      showConfetti={showResult && hasPassed}
      shouldSubmitGameCompletion={hasPassed}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-5 text-white">
        <div className="bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-4 text-sm uppercase tracking-[0.3em] text-white/60">
            <span>Scenario</span>
            <span>Digital Security</span>
          </div>
          <p className="text-lg text-white/90 mb-6">{stage.prompt}</p>
          <div className="grid grid-cols-2 gap-4">
            {stage.options.map((option) => {
              const isSelected = selectedOption === option.id;
              return (
                <button
                  key={option.id}
                  onClick={() => handleChoice(option)}
                  disabled={!!selectedOption}
                  className={`rounded-2xl border-2 p-5 text-left transition ${isSelected
                      ? option.isCorrect
                        ? "border-emerald-400 bg-emerald-500/20"
                        : "border-rose-400 bg-rose-500/10"
                      : "border-white/30 bg-white/5 hover:border-white/60 hover:bg-white/10"
                    }`}
                >
                  <div className="flex justify-between items-center mb-2 text-sm text-white/70">
                    <span>Choice {option.id.toUpperCase()}</span>
                  </div>
                  <p className="text-white font-semibold">{option.label}</p>
                </button>
              );
            })}
          </div>
          {(showResult || showFeedback) && (
            <div className="bg-white/5 border border-white/20 rounded-3xl p-6 shadow-xl max-w-4xl mx-auto space-y-3">
              <h4 className="text-lg font-semibold text-white">Reflection</h4>
              {selectedReflection && (
                <div className="max-h-24 overflow-y-auto pr-2">
                  <p className="text-sm text-white/90">{selectedReflection}</p>
                </div>
              )}
              {showFeedback && !showResult && (
                <div className="mt-4 flex justify-center">
                  {canProceed ? (
                    <button
                      onClick={() => {
                        if (currentStage < totalStages - 1) {
                          setCurrentStage((prev) => prev + 1);
                          setSelectedOption(null);
                          setSelectedReflection(null);
                          setShowFeedback(false);
                          setCanProceed(false);
                        }
                      }}
                      className="rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-2 px-6 font-semibold shadow-lg hover:opacity-90"
                    >
                      Continue
                    </button>
                  ) : (
                    <div className="py-2 px-6 text-white font-semibold">Reading...</div>
                  )}
                </div>
              )}
              {!showResult && currentStage === totalStages - 1 && canProceed && (
                <div className="mt-4 flex justify-center">
                 
                </div>
              )}
              {showResult && (
                <>
                  <ul className="text-sm list-disc list-inside space-y-1">
                    {reflectionPrompts.map((prompt) => (
                      <li key={prompt}>{prompt}</li>
                    ))}
                  </ul>
                  <p className="text-sm text-white/70">
                    Skill unlocked: <strong>Network security awareness</strong>
                  </p>
                  {!hasPassed && (
                    <p className="text-xs text-amber-300">
                      Answer all {totalStages} choices correctly to earn the full reward.
                    </p>
                  )}
                  {!hasPassed && (
                    <button
                      onClick={handleRetry}
                      className="w-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-3 font-semibold shadow-lg hover:opacity-90"
                    >
                      Try Again
                    </button>
                  )}
                </>
              )}
            </div>
          )}
          
        </div>
        {showResult && (
          <div className="bg-white/5 border border-white/20 rounded-3xl p-6 shadow-xl max-w-4xl mx-auto space-y-3">
            <h4 className="text-lg font-semibold text-white">Reflection Prompts</h4>
            <ul className="text-sm list-disc list-inside space-y-1">
              {reflectionPrompts.map((prompt) => (
                <li key={prompt}>{prompt}</li>
              ))}
            </ul>
            <p className="text-sm text-white/70">
              Skill unlocked: <strong>Network security awareness</strong>
            </p>
            {!hasPassed && (
              <p className="text-xs text-amber-300">
                Answer all {totalStages} choices correctly to earn the full reward.
              </p>
            )}
            {!hasPassed && (
              <button
                onClick={handleRetry}
                className="w-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-3 font-semibold shadow-lg hover:opacity-90"
              >
                Try Again
              </button>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PublicWifiRisk;