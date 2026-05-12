import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import es from "../locales/es.json";
import en from "../locales/en.json";
import ma from "../locales/ma.json";

i18n.use(initReactI18next).init({
  compatibilityJSON: "v4",
  lng: "es",
  fallbackLng: "es",
  resources: {
    es: { translation: es },
    en: { translation: en },
    ma: { translation: ma },
  },
  interpolation: {
    escapeValue: false,
  },
  // Flatten nested keys automatically (same structure as web app)
  returnNull: false,
});

export default i18n;
