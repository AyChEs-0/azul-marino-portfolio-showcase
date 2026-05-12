import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { I18nManager } from "react-native";
import i18n from "../lib/i18n";
import { getStoredLanguage, setStoredLanguage } from "../lib/storage";
import type { Language } from "../lib/types";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => Promise<void>;
  isRTL: boolean;
  isReady: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLang] = useState<Language>("es");
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    getStoredLanguage().then((stored) => {
      const lang = stored ?? "es";
      setLang(lang);
      i18n.changeLanguage(lang);
      I18nManager.forceRTL(lang === "ma");
      setIsReady(true);
    });
  }, []);

  const setLanguage = useCallback(async (lang: Language) => {
    await setStoredLanguage(lang);
    await i18n.changeLanguage(lang);
    I18nManager.forceRTL(lang === "ma");
    setLang(lang);
  }, []);

  return (
    <LanguageContext.Provider
      value={{ language, setLanguage, isRTL: language === "ma", isReady }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used inside LanguageProvider");
  return ctx;
};
