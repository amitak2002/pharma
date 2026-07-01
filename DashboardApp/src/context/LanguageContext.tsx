import React, { createContext, useContext, useState } from 'react';
import { translations } from '../translations';
import type { Translations } from '../translations';

export type LanguageType = 'en' | 'hi' | 'hinglish';

interface LanguageContextType {
  language: LanguageType;
  setLanguage: (lang: LanguageType) => void;
  t: (key: keyof Translations, variables?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<LanguageType>(() => {
    const saved = localStorage.getItem('medveda-lang');
    if (saved === 'en' || saved === 'hi' || saved === 'hinglish') {
      return saved;
    }
    return 'en'; // default
  });

  const setLanguage = (lang: LanguageType) => {
    setLanguageState(lang);
    localStorage.setItem('medveda-lang', lang);
  };

  const t = (key: keyof Translations, variables?: Record<string, string | number>): string => {
    const dictionary = translations[language] || translations.en;
    let text = dictionary[key] || translations.en[key] || String(key);
    
    if (variables) {
      Object.entries(variables).forEach(([varKey, varVal]) => {
        text = text.replace(`{${varKey}}`, String(varVal));
      });
    }
    
    return text;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
