import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

interface LanguageContextProps {
  language: string;
  changeLanguage: (lang: string) => void;
}

interface LanguageProviderProps {
  children: ReactNode;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(
  undefined
);

export const LanguageProvider: React.FC<LanguageProviderProps> = ({
  children,
}) => {
  const { i18n } = useTranslation("common");
  const [language, setLanguage] = useState(i18n.language);
  const router = useRouter();
  const { locale, locales, asPath } = router;

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang).then(() => {
      setUserLocale(lang);
    });
    setLanguage(lang);
  };

  const setUserLocale = (lang: string) => {
    localStorage.setItem("userLocale", lang);
    setLanguage(lang);
    router.push(asPath, asPath, { locale: lang });
  };

  const getUserLocale = () => {
    return localStorage.getItem("userLocale") || "en";
  };

  useEffect(() => {
    const userLocale = getUserLocale();
    if (userLocale) {
      changeLanguage(userLocale);
    }
  }, []);

  return (
    <LanguageContext.Provider value={{ language, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    // throw new Error("useLanguage must be used within a LanguageProvider");
    return;
  }
  return context;
};
