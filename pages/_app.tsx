import "../app/globals.css";
// pages/_app.js
import { appWithTranslation } from "next-i18next";
import nextI18NextConfig from "../next-i18next.config.js";
import { AppProps } from "next/app";
import { LanguageProvider } from "@/app/contexts/LanguageContext";
import { AuthProvider } from "@/app/contexts/AuthContext";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <LanguageProvider>
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </LanguageProvider>
  );
}

export default appWithTranslation(MyApp, nextI18NextConfig);
