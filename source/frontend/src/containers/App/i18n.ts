import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import Backend from "i18next-http-backend";
import { initReactI18next } from "react-i18next";

import { isProduction } from "../../constants/frontendConstants";

export type LanguageType = "en" | "es" | "de" | "zh";

export const languages: {
  [language in LanguageType]: { nativeName: string };
} = {
  en: { nativeName: "English" },
  es: { nativeName: "Español" },
  de: { nativeName: "Deutsch" },
  zh: { nativeName: "Chinese" },
};

export function loadI18N(callback: () => void) {
  i18n
    // i18next-http-backend
    // loads translations from your server
    // https://github.com/i18next/i18next-http-backend
    .use(Backend)
    // detect user language
    // learn more: https://github.com/i18next/i18next-browser-languageDetector
    .use(LanguageDetector)
    // pass the i18n instance to react-i18next.
    .use(initReactI18next)
    // init i18next
    // for all options read: https://www.i18next.com/overview/configuration-options
    .init(
      {
        debug: !isProduction,
        fallbackLng: "en",
        interpolation: {
          escapeValue: false, // not needed for react as it escapes by default
        },
        backend: {
          loadPath: "/octo_ui2/static/locales/{{lng}}/translation.json",
        },
      },
      callback
    );
}

// export default i18n;
