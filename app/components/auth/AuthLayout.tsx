"use client";

import { Store } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";
import { AVAILABLE_LANGUAGES } from "@/constant";
interface AuthLayoutProps {
  children: React.ReactNode;
}
export const AuthLayout = ({ children }: AuthLayoutProps) => {
  const languageObj = useLanguage();
  return (
    <div>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm flex items-center justify-between">
          <div className="w-full px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <div className="flex items-center">
              <Store className="h-8 w-8 text-blue-600" />
              <h1 className="ml-2 text-xl font-bold text-gray-900">Pressto</h1>
            </div>

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
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
      </div>
    </div>
  );
};
