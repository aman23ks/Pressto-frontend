"use client";

import { useState } from "react";
import { CustomerLogin } from "@/app/components/auth/CustomerLogin";
import { CustomerSignup } from "@/app/components/auth/CustomerSignup";
import { ShopOwnerLogin } from "@/app/components/auth/ShopOwnerLogin";
import { ShopOwnerSignup } from "@/app/components/auth/ShopOwnerSignup";
import { ViewType } from "@/app/types";
import { useAuth } from "@/app/contexts/AuthContext";
import { Store } from "lucide-react";
import { useTranslation } from "next-i18next";
import { GetServerSideProps } from "next";
import { getI18nProps } from "@/utils/server-side-translation";
import { useRouter } from "next/router";
import { AuthLayout } from "../app/components/auth/AuthLayout";
import { LanguageSelect } from "@/app/components/LanguageSelect";

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  return getI18nProps(locale);
};
// TODO: rename this file index when all other files moved to pages folder
const AuthFlow = () => {
  const [view, setView] = useState<ViewType>("role-select");
  const { loading } = useAuth();
  const router = useRouter();
  const { t } = useTranslation("common");

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl font-semibold">{t("loading")}...</div>
      </div>
    );
  }

  if (view === "role-select") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center">
        <div className="max-w-md w-full px-6 py-8 bg-white rounded-lg shadow-lg">
          <div className="text-center mb-8">
            <Store className="h-16 w-16 text-blue-600 mx-auto mb-4" />
            <h1 className="text-3xl font-extrabold text-gray-800">
              {t("index.welcome")} Pressto
            </h1>
            <p className="text-gray-600 mt-2">{t("index.choose-option")}</p>
          </div>

          <div className="space-y-6">
            <button
              onClick={() => {
                router.push("/customer-login");
              }}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white py-3 rounded-lg font-medium text-lg shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all"
            >
              {t("index.get-clothes-ironed")}
            </button>
            <button
              onClick={() => {
                router.push("/shop-owner-login");
              }}
              className="w-full bg-white border border-gray-300 py-3 rounded-lg font-medium text-lg text-gray-700 hover:bg-gray-50 shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all"
            >
              {t("index.own-ironing-shop")}
            </button>
          </div>
          <div className="mt-4 flex justify-center">
            <LanguageSelect />
          </div>
        </div>
      </div>
    );
  }

  const props = {
    onBack: () => setView("role-select"),
    onSuccess: () => {
      /* Success handled by context */
      window.location.href = "/";
    },
    onSwitch: () => {
      if (view === "customer-login") setView("customer-signup");
      else if (view === "customer-signup") setView("customer-login");
      else if (view === "shopOwner-login") setView("shopOwner-signup");
      else if (view === "shopOwner-signup") setView("shopOwner-login");
    },
  };

  return (
    <>
      {view === "customer-login" && <CustomerLogin {...props} />}
      {view === "customer-signup" && <CustomerSignup {...props} />}
      {view === "shopOwner-login" && <ShopOwnerLogin {...props} />}
      {view === "shopOwner-signup" && <ShopOwnerSignup {...props} />}
    </>
  );
};

export default AuthFlow;
