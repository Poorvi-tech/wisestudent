import { Briefcase } from "lucide-react";
import buildIds from "../buildGameIds";

export const eheGameIdsAdults = buildIds("ehe", "adults");

export const getEheAdultGames = (gameCompletionStatus) => {
    const eheAdultGames = [
        {
            id: "ehe-adults-1",
            title: "Career Is Not Just a Job",
            description:
                "Story: You work daily but feel your job is only for income. Do you focus on just the salary, or do you build long-term skills?",
            icon: <Briefcase className="w-6 h-6" />,
            difficulty: "Medium",
            duration: "8 min",
            coins: 5,
            xp: 50,
            completed: gameCompletionStatus["ehe-adults-1"] || false,
            isSpecial: true,
            reflective: false,
            path: "/student/ehe/adult/career-is-not-just-a-job",
            index: 0,
        },
    ];

    return eheAdultGames;
};
