"use client";

import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { toast } from "react-hot-toast";
import { AuthLayout } from "../app/components/auth/AuthLayout";
import { AuthProps } from "@/app/types";
import AuthService from "@/app/services/authService";
import { useTranslation } from "next-i18next";
import { GetServerSideProps } from "next";
import { getI18nProps } from "@/utils/server-side-translation";
import { useRouter } from "next/router";
import { useAuth } from "@/app/contexts/AuthContext";
import Loader from "@/app/components/Loader/Loader";

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  return getI18nProps(locale);
};
export default function CustomerLogin() {
  const router = useRouter();
  const { t } = useTranslation("common");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loader, setLoader] = useState(false);
  const { loading, isAuthenticated } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoader(true);

    try {
      const response = await AuthService.login({
        email: formData.email,
        password: formData.password,
      });
      // Verify user type
      if (response.user.user_type !== "customer") {
        toast.error("Please use customer login");
        return;
      }

      toast.success("Login successful!");
      router.push("/");
    } catch (error: any) {
      toast.error(error.message || "Login failed");
      console.error("Login error:", error);
    } finally {
      setLoader(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (isAuthenticated) {
    router.push("/");
    return null;
  }

  return (
    <AuthLayout>
      <div className="flex justify-center items-center min-h-[calc(100vh-80px)]">
        <div className="w-full max-w-md bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <div className="flex items-center mb-4">
              <button
                onClick={() => {
                  router.push("/index-dummy-window");
                }}
                className="text-gray-600 hover:text-gray-900"
                disabled={loader}
              >
                <ArrowLeft size={20} />
              </button>
              <h2 className="text-2xl font-bold text-gray-900 ml-2">
                {t("login.customer-login")}
              </h2>
            </div>
            <p className="text-gray-600 mb-6">{t("login.welcome")}</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  {t("login.email")}
                </label>
                <input
                  id="email"
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  disabled={loader}
                  required
                />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  {t("login.password")}
                </label>
                <input
                  id="password"
                  type="password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  disabled={loader}
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loader}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200 disabled:bg-blue-400"
              >
                {loader ? `${t("login.logging-in")}...` : t("login.login")}
              </button>
            </form>
          </div>
          <div className="px-6 py-4 bg-gray-50 border-t">
            <p className="text-sm text-gray-600 text-center">
              {t("login.no-account")}{" "}
              <button
                onClick={() => {
                  router.push("/customer-sign-up");
                }}
                className="text-blue-600 hover:underline font-medium"
                disabled={loader}
              >
                {t("login.register")}
              </button>
            </p>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}
