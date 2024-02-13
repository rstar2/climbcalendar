import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import Backend from "i18next-chained-backend";
import HttpBackend from "i18next-http-backend";
import LocalStorageBackend from "i18next-localstorage-backend";

const englishLang = "en";

const allowedLanguages = ["en", "bg" /* , "pl" */] as const;

i18n
  .use(LanguageDetector)
  .use(Backend)
  .use(initReactI18next)
  .init({
    // the translations
    // (tip move them in a JSON file and import them (statically or on demand)
    // resources: {
    //   en: {
    //     // only a single namespace
    //     // translation: {
    //     //    "title": "Climbing Competitions",
    //     // },
    //   },
    // },
    // lng: englishLang, // if you're using a language detector, do not define the lng option

    fallbackLng: englishLang,

    react: {
      transSupportBasicHtmlNodes: true,
    },

    interpolation: {
      escapeValue: false, // react already safes from xss => https://www.i18next.com/translation-function/interpolation#unescape
    },

    // if using a language detector plugin that detects region specific languages,
    // this can remove region the "en-US"
    // load: "languageOnly",

    // configure the Chain-Backend plugin
    backend: {
      backends: [
        LocalStorageBackend, // primary backend
        HttpBackend, // fallback backend
      ],
      backendOptions: [
        {
          /* options for primary LocalStorage backend */

          // prefix for stored languages
          prefix: "i18nextResources_",
          // expiration
          expirationTime: 365 * 24 * 60 * 60 * 1000, // 365 days
          // Version applied to all languages, can be overridden using the option `versions`
          defaultVersion: "v5",
          // language versions - when the localization is changed in a language xxx.json
          // then increase the language's version 
          //versions: { bg: "v4.1", },
        },
        {
          /* options for secondary HTTP backend */

          // for all available options read the backend's repository readme file
          loadPath: "/locales/{{lng}}.json",
        },
      ],
    },

    // debug: true
  });

// i18n.addResourceBundle("en", "zod", {
//     errors: {
//         invalid_type_received_undefined: "Required",
//         invalid_type_received_undefined_with_path: "{{path}} is required",
//     },
// }, true);

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
