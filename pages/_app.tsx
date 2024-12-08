import "../app/globals.css";
// pages/_app.js
import { appWithTranslation } from "next-i18next";
import nextI18NextConfig from "../next-i18next.config.js";
import { AppProps } from "next/app";
import { LanguageProvider } from "@/app/contexts/LanguageContext";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <LanguageProvider>
      <Component {...pageProps} />
    </LanguageProvider>
  );
}

export default appWithTranslation(MyApp, nextI18NextConfig);
