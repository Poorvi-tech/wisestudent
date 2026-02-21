import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import enFinancialLiteracyTeens from "../locales/en/pages/games/financial-literacy/teens.json";
import enFinancialLiteracyKids from "../locales/en/pages/games/financial-literacy/kids.json";
import enFinancialLiteracyYoungAdult from "../locales/en/pages/games/financial-literacy/young-adult.json";
import enFinancialLiteracyBusinessLivelihoodFinance from "../locales/en/pages/games/financial-literacy/business-livelihood-finance.json";
import enFinancialLiteracyInsurancePension from "../locales/en/pages/games/financial-literacy/insurance-pension.json";
import enFinancialLiteracyAdult from "../locales/en/pages/games/financial-literacy/adult.json";
import enBrainHealthKids from "../locales/en/pages/games/brain-health/kids.json";
import enBrainHealthTeens from "../locales/en/pages/games/brain-health/teens.json";
import enBrainHealthYoungAdult from "../locales/en/pages/games/brain-health/young-adult.json";
import enBrainHealthAdult from "../locales/en/pages/games/brain-health/adult.json";
import enUvlsKids from "../locales/en/pages/games/uvls/kids.json";
import enUvlsTeens from "../locales/en/pages/games/uvls/teens.json";
import enUvlsYoungAdult from "../locales/en/pages/games/uvls/young-adult.json";
import enUvlsAdult from "../locales/en/pages/games/uvls/adult.json";
import enDigitalCitizenshipKids from "../locales/en/pages/games/digital-citizenship/kids.json";
import enDigitalCitizenshipTeens from "../locales/en/pages/games/digital-citizenship/teens.json";
import enDigitalCitizenshipYoungAdult from "../locales/en/pages/games/digital-citizenship/young-adult.json";
import enDigitalCitizenshipAdult from "../locales/en/pages/games/digital-citizenship/adult.json";
import enMoralValuesKids from "../locales/en/pages/games/moral-values/kids.json";
import enMoralValuesTeens from "../locales/en/pages/games/moral-values/teens.json";
import enMoralValuesYoungAdult from "../locales/en/pages/games/moral-values/young-adult.json";
import enMoralValuesAdult from "../locales/en/pages/games/moral-values/adult.json";
import enAiForAllKids from "../locales/en/pages/games/ai-for-all/kids.json";
import enAiForAllTeens from "../locales/en/pages/games/ai-for-all/teens.json";
import enAiForAllYoungAdult from "../locales/en/pages/games/ai-for-all/young-adult.json";
import enAiForAllAdult from "../locales/en/pages/games/ai-for-all/adult.json";
import enHealthMaleKids from "../locales/en/pages/games/health-male/kids.json";
import enHealthMaleTeens from "../locales/en/pages/games/health-male/teens.json";
import enHealthMaleYoungAdult from "../locales/en/pages/games/health-male/young-adult.json";
import enHealthMaleAdult from "../locales/en/pages/games/health-male/adult.json";
import enHealthFemaleKids from "../locales/en/pages/games/health-female/kids.json";
import enHealthFemaleTeens from "../locales/en/pages/games/health-female/teens.json";
import enHealthFemaleYoungAdult from "../locales/en/pages/games/health-female/young-adult.json";
import enHealthFemaleAdult from "../locales/en/pages/games/health-female/adult.json";
import enEheKids from "../locales/en/pages/games/ehe/kids.json";
import enEheTeens from "../locales/en/pages/games/ehe/teens.json";
import enEheYoungAdult from "../locales/en/pages/games/ehe/young-adult.json";
import enEheAdult from "../locales/en/pages/games/ehe/adult.json";
import enCivicResponsibilityKids from "../locales/en/pages/games/civic-responsibility/kids.json";
import enCivicResponsibilityTeens from "../locales/en/pages/games/civic-responsibility/teens.json";
import enCivicResponsibilityYoungAdult from "../locales/en/pages/games/civic-responsibility/young-adult.json";
import enCivicResponsibilityAdult from "../locales/en/pages/games/civic-responsibility/adult.json";
import enSustainabilityKids from "../locales/en/pages/games/sustainability/kids.json";
import enSustainabilityTeens from "../locales/en/pages/games/sustainability/teens.json";
import enSustainabilityYoungAdult from "../locales/en/pages/games/sustainability/young-adult.json";
import enSustainabilityAdult from "../locales/en/pages/games/sustainability/adult.json";
import hiFinancialLiteracyTeens from "../locales/hi/pages/games/financial-literacy/teens.json";
import hiFinancialLiteracyKids from "../locales/hi/pages/games/financial-literacy/kids.json";
import hiFinancialLiteracyYoungAdult from "../locales/hi/pages/games/financial-literacy/young-adult.json";
import hiFinancialLiteracyBusinessLivelihoodFinance from "../locales/hi/pages/games/financial-literacy/business-livelihood-finance.json";
import hiFinancialLiteracyInsurancePension from "../locales/hi/pages/games/financial-literacy/insurance-pension.json";
import hiFinancialLiteracyAdult from "../locales/hi/pages/games/financial-literacy/adult.json";
import hiBrainHealthKids from "../locales/hi/pages/games/brain-health/kids.json";
import hiBrainHealthTeens from "../locales/hi/pages/games/brain-health/teens.json";
import hiBrainHealthYoungAdult from "../locales/hi/pages/games/brain-health/young-adult.json";
import hiBrainHealthAdult from "../locales/hi/pages/games/brain-health/adult.json";
import hiUvlsKids from "../locales/hi/pages/games/uvls/kids.json";
import hiUvlsTeens from "../locales/hi/pages/games/uvls/teens.json";
import hiUvlsYoungAdult from "../locales/hi/pages/games/uvls/young-adult.json";
import hiUvlsAdult from "../locales/hi/pages/games/uvls/adult.json";
import hiDigitalCitizenshipKids from "../locales/hi/pages/games/digital-citizenship/kids.json";
import hiDigitalCitizenshipTeens from "../locales/hi/pages/games/digital-citizenship/teens.json";
import hiDigitalCitizenshipYoungAdult from "../locales/hi/pages/games/digital-citizenship/young-adult.json";
import hiDigitalCitizenshipAdult from "../locales/hi/pages/games/digital-citizenship/adult.json";
import hiMoralValuesKids from "../locales/hi/pages/games/moral-values/kids.json";
import hiMoralValuesTeens from "../locales/hi/pages/games/moral-values/teens.json";
import hiMoralValuesYoungAdult from "../locales/hi/pages/games/moral-values/young-adult.json";
import hiMoralValuesAdult from "../locales/hi/pages/games/moral-values/adult.json";
import hiAiForAllKids from "../locales/hi/pages/games/ai-for-all/kids.json";
import hiAiForAllTeens from "../locales/hi/pages/games/ai-for-all/teens.json";
import hiAiForAllYoungAdult from "../locales/hi/pages/games/ai-for-all/young-adult.json";
import hiAiForAllAdult from "../locales/hi/pages/games/ai-for-all/adult.json";
import hiHealthMaleKids from "../locales/hi/pages/games/health-male/kids.json";
import hiHealthMaleTeens from "../locales/hi/pages/games/health-male/teens.json";
import hiHealthMaleYoungAdult from "../locales/hi/pages/games/health-male/young-adult.json";
import hiHealthMaleAdult from "../locales/hi/pages/games/health-male/adult.json";
import hiHealthFemaleKids from "../locales/hi/pages/games/health-female/kids.json";
import hiHealthFemaleTeens from "../locales/hi/pages/games/health-female/teens.json";
import hiHealthFemaleYoungAdult from "../locales/hi/pages/games/health-female/young-adult.json";
import hiHealthFemaleAdult from "../locales/hi/pages/games/health-female/adult.json";
import hiEheKids from "../locales/hi/pages/games/ehe/kids.json";
import hiEheTeens from "../locales/hi/pages/games/ehe/teens.json";
import hiEheYoungAdult from "../locales/hi/pages/games/ehe/young-adult.json";
import hiEheAdult from "../locales/hi/pages/games/ehe/adult.json";
import hiCivicResponsibilityKids from "../locales/hi/pages/games/civic-responsibility/kids.json";
import hiCivicResponsibilityTeens from "../locales/hi/pages/games/civic-responsibility/teens.json";
import hiCivicResponsibilityYoungAdult from "../locales/hi/pages/games/civic-responsibility/young-adult.json";
import hiCivicResponsibilityAdult from "../locales/hi/pages/games/civic-responsibility/adult.json";
import hiSustainabilityKids from "../locales/hi/pages/games/sustainability/kids.json";
import hiSustainabilityTeens from "../locales/hi/pages/games/sustainability/teens.json";
import hiSustainabilityYoungAdult from "../locales/hi/pages/games/sustainability/young-adult.json";
import hiSustainabilityAdult from "../locales/hi/pages/games/sustainability/adult.json";

const LANGUAGE_STORAGE_KEY = "app_language";
const savedLanguage = typeof window !== "undefined"
  ? window.localStorage.getItem(LANGUAGE_STORAGE_KEY)
  : null;

const resources = {
  en: {
    pages: {
      games: {
        "financial-literacy": {
          kids: enFinancialLiteracyKids,
          teens: enFinancialLiteracyTeens,
          "young-adult": enFinancialLiteracyYoungAdult,
          "business-livelihood-finance": enFinancialLiteracyBusinessLivelihoodFinance,
          "insurance-pension": enFinancialLiteracyInsurancePension,
          adult: enFinancialLiteracyAdult,
        },
        "brain-health": {
          kids: enBrainHealthKids,
          teens: enBrainHealthTeens,
          "young-adult": enBrainHealthYoungAdult,
          adult: enBrainHealthAdult,
        },
        uvls: {
          kids: enUvlsKids,
          teens: enUvlsTeens,
          "young-adult": enUvlsYoungAdult,
          adult: enUvlsAdult,
        },
        "digital-citizenship": {
          kids: enDigitalCitizenshipKids,
          teens: enDigitalCitizenshipTeens,
          "young-adult": enDigitalCitizenshipYoungAdult,
          adult: enDigitalCitizenshipAdult,
        },
        "moral-values": {
          kids: enMoralValuesKids,
          teens: enMoralValuesTeens,
          "young-adult": enMoralValuesYoungAdult,
          adult: enMoralValuesAdult,
        },
        "ai-for-all": {
          kids: enAiForAllKids,
          teens: enAiForAllTeens,
          "young-adult": enAiForAllYoungAdult,
          adult: enAiForAllAdult,
        },
        "health-male": {
          kids: enHealthMaleKids,
          teens: enHealthMaleTeens,
          "young-adult": enHealthMaleYoungAdult,
          adult: enHealthMaleAdult,
        },
        "health-female": {
          kids: enHealthFemaleKids,
          teens: enHealthFemaleTeens,
          "young-adult": enHealthFemaleYoungAdult,
          adult: enHealthFemaleAdult,
        },
        ehe: {
          kids: enEheKids,
          teens: enEheTeens,
          "young-adult": enEheYoungAdult,
          adult: enEheAdult,
        },
        "civic-responsibility": {
          kids: enCivicResponsibilityKids,
          teens: enCivicResponsibilityTeens,
          "young-adult": enCivicResponsibilityYoungAdult,
          adult: enCivicResponsibilityAdult,
        },
        sustainability: {
          kids: enSustainabilityKids,
          teens: enSustainabilityTeens,
          "young-adult": enSustainabilityYoungAdult,
          adult: enSustainabilityAdult,
        },
      },
    },
  },
  hi: {
    pages: {
      games: {
        "financial-literacy": {
          kids: hiFinancialLiteracyKids,
          teens: hiFinancialLiteracyTeens,
          "young-adult": hiFinancialLiteracyYoungAdult,
          "business-livelihood-finance": hiFinancialLiteracyBusinessLivelihoodFinance,
          "insurance-pension": hiFinancialLiteracyInsurancePension,
          adult: hiFinancialLiteracyAdult,
        },
        "brain-health": {
          kids: hiBrainHealthKids,
          teens: hiBrainHealthTeens,
          "young-adult": hiBrainHealthYoungAdult,
          adult: hiBrainHealthAdult,
        },
        uvls: {
          kids: hiUvlsKids,
          teens: hiUvlsTeens,
          "young-adult": hiUvlsYoungAdult,
          adult: hiUvlsAdult,
        },
        "digital-citizenship": {
          kids: hiDigitalCitizenshipKids,
          teens: hiDigitalCitizenshipTeens,
          "young-adult": hiDigitalCitizenshipYoungAdult,
          adult: hiDigitalCitizenshipAdult,
        },
        "moral-values": {
          kids: hiMoralValuesKids,
          teens: hiMoralValuesTeens,
          "young-adult": hiMoralValuesYoungAdult,
          adult: hiMoralValuesAdult,
        },
        "ai-for-all": {
          kids: hiAiForAllKids,
          teens: hiAiForAllTeens,
          "young-adult": hiAiForAllYoungAdult,
          adult: hiAiForAllAdult,
        },
        "health-male": {
          kids: hiHealthMaleKids,
          teens: hiHealthMaleTeens,
          "young-adult": hiHealthMaleYoungAdult,
          adult: hiHealthMaleAdult,
        },
        "health-female": {
          kids: hiHealthFemaleKids,
          teens: hiHealthFemaleTeens,
          "young-adult": hiHealthFemaleYoungAdult,
          adult: hiHealthFemaleAdult,
        },
        ehe: {
          kids: hiEheKids,
          teens: hiEheTeens,
          "young-adult": hiEheYoungAdult,
          adult: hiEheAdult,
        },
        "civic-responsibility": {
          kids: hiCivicResponsibilityKids,
          teens: hiCivicResponsibilityTeens,
          "young-adult": hiCivicResponsibilityYoungAdult,
          adult: hiCivicResponsibilityAdult,
        },
        sustainability: {
          kids: hiSustainabilityKids,
          teens: hiSustainabilityTeens,
          "young-adult": hiSustainabilityYoungAdult,
          adult: hiSustainabilityAdult,
        },
      },
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: savedLanguage || "en",
  fallbackLng: "en",
  defaultNS: "pages",
  interpolation: {
    escapeValue: false,
  },
});

export { LANGUAGE_STORAGE_KEY };
export default i18n;
