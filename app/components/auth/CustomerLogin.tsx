"use client";

import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { toast } from "react-hot-toast";
import { AuthLayout } from "./AuthLayout";
import { AuthProps } from "@/app/types";
import AuthService from "@/app/services/authService";
import { useTranslation } from "next-i18next";

export const CustomerLogin = ({ onBack, onSwitch, onSuccess }: AuthProps) => {
  const { t } = useTranslation("common");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

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
      onSuccess();
    } catch (error: any) {
      toast.error(error.message || "Login failed");
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="flex justify-center items-center min-h-[calc(100vh-80px)]">
        <div className="w-full max-w-md bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <div className="flex items-center mb-4">
              <button
                onClick={onBack}
                className="text-gray-600 hover:text-gray-900"
                disabled={loading}
              >
                <ArrowLeft size={20} />
              </button>
              <h2 className="text-2xl font-bold text-gray-900 ml-2">
                Customer Login
              </h2>
            </div>
            <p className="text-gray-600 mb-6">Welcome back! Please login to your account</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  disabled={loading}
                  required
                />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  disabled={loading}
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200 disabled:bg-blue-400"
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>
          </div>
          <div className="px-6 py-4 bg-gray-50 border-t">
            <p className="text-sm text-gray-600 text-center">
              Don't have an account?{" "}
              <button
                onClick={onSwitch}
                className="text-blue-600 hover:underline font-medium"
                disabled={loading}
              >
                Sign up
              </button>
            </p>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
};
