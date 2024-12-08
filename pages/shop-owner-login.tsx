"use client";

import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { toast } from "react-hot-toast";
import { AuthLayout } from "../app/components/auth/AuthLayout";
import { AuthProps, LoginData } from "@/app/types";
import { useAuth } from "@/app/contexts/AuthContext";
import AuthService from "@/app/services/authService";
import { useTranslation } from "next-i18next";
import { GetServerSideProps } from "next";
import { getI18nProps } from "@/utils/server-side-translation";
import { useRouter } from "next/router";

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  return getI18nProps(locale);
};

const ShopOwnerLogin = ({ onBack, onSwitch, onSuccess }: AuthProps) => {
  const { login } = useAuth();
  const { t } = useTranslation("common");
  const router = useRouter();
  const [formData, setFormData] = useState<LoginData>({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Call AuthService directly
      const response = await AuthService.login(formData);

      // Verify it's a shop owner account
      if (response.user.user_type !== "shopOwner") {
        toast.error("Please use shop owner login");
        return;
      }

      // Update auth context
      login(formData.email, formData.password);

      toast.success("Login successful!");
      onSuccess();
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error || error.message || "Login failed";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange =
    (field: keyof LoginData) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    };

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
                disabled={loading}
                className="text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft size={20} />
              </button>
              <h2 className="text-2xl font-bold text-gray-900 ml-2">
                {t("login.shop-owner-login")}
              </h2>
            </div>
            <p className="text-gray-600 mb-6">
              {t("login.welcome-shop-owner")}
            </p>

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
                  onChange={handleInputChange("email")}
                  disabled={loading}
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
                  onChange={handleInputChange("password")}
                  disabled={loading}
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>
          </div>
          <div className="px-6 py-4 bg-gray-50 border-t">
            <p className="text-sm text-gray-600 text-center">
              {t("login.no-account")}{" "}
              <button
                onClick={onSwitch}
                disabled={loading}
                className="text-blue-600 hover:underline font-medium"
              >
                {t("login.register-shop-owner")}
              </button>
            </p>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
};

export default ShopOwnerLogin;
