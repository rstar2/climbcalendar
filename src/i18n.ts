import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import Backend from "i18next-http-backend";

const englishLang = "en";

const allowedLanguages = ["en", "bg"/* , "pl" */] as const;

i18n
  .use(LanguageDetector)
  .use(Backend)
  .use(initReactI18next)
  .init({
    // the translations
    // (tip move them in a JSON file and import them (statically or on demand)
    // resources: {
    //   "en": {
    //     // only a single namespace
    //     translation: {
    //        "title": "Climbing Competitions",
    //     }
    //   },
    // },
    //lng: englishLang, // if you're using a language detector, do not define the lng option

    fallbackLng: englishLang,

    react: {
      transSupportBasicHtmlNodes: true,
    },

    interpolation: {
      escapeValue: false, // react already safes from xss => https://www.i18next.com/translation-function/interpolation#unescape
    },

    // configure the Backend plugin
    backend: {
      // for all available options read the backend's repository readme file
      loadPath: "/locales/{{lng}}.json",
    },
  });

type LanguageDict = { [key: string]: string | LanguageDict };

const i18nUtil = {
  /**
   * The set of languages known to be present in the server
   */
  allowedLanguages,

  /**
   * Change current language
   */
  changeLanguage(lang: string) {
    i18n.changeLanguage(lang);
  },

  /**
   * Add a language bundle
   */
  addLanguage(lang: string, dictionary: LanguageDict) {
    i18n.addResourceBundle(lang, "translation", dictionary);
  },

  /**
   * Check if language is valid, e.g. among the added bundles
   */
  isValidLanguage(lang: string): boolean {
    return i18n.hasResourceBundle(lang.toLowerCase(), "translation");
  },

  /**
   * Return the currently set and used language
   */
  get currentLanguage(): string {
    return i18n.language;
  },

  /**
   * Re-export the t function
   */
  t: i18n.t,
};

/**
 * Export as common utils
 */
export default i18nUtil;
