import AsyncStorage from "@react-native-async-storage/async-storage";
import { getLocales } from "expo-localization";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./en/translation.json";
import pl from "./pl/translation.json";

const LANG_STORAGE_KEY = "user-language";

const detectLanguage = async () => {
  const storedLang = await AsyncStorage.getItem(LANG_STORAGE_KEY);

  if (storedLang) return storedLang;

  const deviceLang = getLocales()[0]?.languageCode || "en";
  return deviceLang || "en";
};

(async () => {
  const lng = await detectLanguage();

  // eslint-disable-next-line import/no-named-as-default-member
  i18n.use(initReactI18next).init({
    compatibilityJSON: "v4",
    lng,
    fallbackLng: "en",
    resources: {
      en: { translation: en },
      pl: { translation: pl },
    },
    interpolation: {
      escapeValue: false,
    },
  });
})();

i18n.on("languageChanged", async (lng) => {
  await AsyncStorage.setItem(LANG_STORAGE_KEY, lng);
});

export default i18n;
