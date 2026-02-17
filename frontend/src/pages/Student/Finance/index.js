import kidFinanceGames from "./Kids";
import teenFinanceGames from "./Teen";
import youngAdultFinanceGames from "./YoungAdult";
import adultFinanceGames from "./Adult";
import insurancePensionGames from "./InsurancePension";
import businessLivelihoodFinanceGames from "./BusinessLivelihood";


const financeGames = {
  kids: kidFinanceGames,
  teen: teenFinanceGames,
  "young-adult": youngAdultFinanceGames,
  adults: adultFinanceGames,
  "insurance-pension": insurancePensionGames,
  "business-livelihood-finance": businessLivelihoodFinanceGames,
};

export const getFinanceGame = (ageGroup, gameId) => {
  let normalizedAgeGroup;
  if (["teens", "teen"].includes(ageGroup)) {
    normalizedAgeGroup = "teen";
  } else if (ageGroup === "young-adult") {
    normalizedAgeGroup = "young-adult";
  } else if (ageGroup === "insurance-pension") {
    normalizedAgeGroup = "insurance-pension";
  } else if (ageGroup === "business-livelihood-finance") {
    normalizedAgeGroup = "business-livelihood-finance";
  } else {
    normalizedAgeGroup = ageGroup;
  }

  const normalizedGameId = gameId?.toLowerCase();
  return (
    financeGames[normalizedAgeGroup]?.[normalizedGameId] ||
    financeGames[normalizedAgeGroup]?.[gameId]
  );
};

export default financeGames;
