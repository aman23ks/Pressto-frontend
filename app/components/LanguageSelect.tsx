import React from "react";
import { useLanguage } from "@/app/contexts/LanguageContext";
import { AVAILABLE_LANGUAGES } from "@/constant";

export const LanguageSelect = () => {
  const languageObj = useLanguage();

  return (
    <select
      value={languageObj?.language || "en"}
      onChange={(e) => {
        if (languageObj) {
          languageObj.changeLanguage(e.target.value);
        }
      }}
    >
      {AVAILABLE_LANGUAGES.map((lang) => (
        <option key={lang.value} value={lang.value}>
          {lang.label}
        </option>
      ))}
    </select>
  );
};
