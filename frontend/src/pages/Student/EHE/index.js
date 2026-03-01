import kidEheGames from "./Kids";
import teenEheGames from "./Teens";
import youngAdultEheGames from "./YoungAdult";
import adultEheGames from "./Adult";

const eheGames = {
  kids: kidEheGames,
  teen: teenEheGames,
  "young-adult": youngAdultEheGames,
  adults: adultEheGames,
  adult: adultEheGames
};

export const getEheGame = (ageGroup, gameId) => {
  const normalizedAgeGroup = ["teens", "young-adult", "adults", "adult"].includes(ageGroup) ? ageGroup : (ageGroup === "teen" ? "teen" : ageGroup);
  return eheGames[normalizedAgeGroup]?.[gameId];
};

export default eheGames;
