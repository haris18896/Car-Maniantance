import { initReactI18next } from "react-i18next";
import { I18nManager } from "react-native";
import i18n from "i18next";

import ar from "./ar.json";
import en from "./en.json";

const resources = {
  en: {
    translation: en,
  },
  ar: {
    translation: ar,
  },
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: I18nManager.isRTL ? "ar" : "en",
    compatibilityJSON: "v3",
    fallbackLng: "en",
    // keySeparator: false,

    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
