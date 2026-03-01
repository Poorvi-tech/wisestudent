import { Briefcase } from "lucide-react";
import buildIds from "../buildGameIds";

export const eheGameIdsYoungAdult = buildIds("ehe", "young-adult");

export const getEheYoungAdultGames = (gameCompletionStatus) => {
  const eheYoungAdultGames = [
    {
      id: "ehe-young-adult-1",
      title: "Job vs Career",
      description:
        "Understand the mindset difference between viewing work as a job versus building a career through strategic questioning.",
      icon: <Briefcase className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "8 min",
      coins: 5,
      xp: 50,
      completed: gameCompletionStatus["ehe-young-adult-1"] || false,
      isSpecial: true,
      reflective: false,
      path: "/student/ehe/young-adult/job-vs-career",
      index: 0,
    },
  ];

  return eheYoungAdultGames;
};

