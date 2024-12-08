"use client";

import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { toast } from "react-hot-toast";
import { AuthLayout } from "../app/components/auth/AuthLayout";
import { ShopOwnerSignupData } from "@/app/types";
import { apiService } from "@/app/services/api";
import React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslation } from "next-i18next";
import { GetServerSideProps } from "next";
import { getI18nProps } from "@/utils/server-side-translation";
import { useRouter } from "next/router";
import { useAuth } from "@/app/contexts/AuthContext";
import Loader from "@/app/components/Loader/Loader";

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  return getI18nProps(locale);
};

const ownerRegistrationSchema = z
  .object({
    shopName: z.string().min(1, "Shop name is required"),
    ownerName: z.string().min(1, "Owner name is required"),
    email: z.string().email("Invalid email address"),
    phone: z
      .string()
      .transform((str) => Number(str))
      .refine((num) => !isNaN(num) && num.toString().length === 10, {
        message: "Phone number must be exactly 10 digits",
      }),
    address: z.string().min(1, "Address is required"),
    zipCode: z
      .string()
      .transform((str) => Number(str))
      .refine((num) => !isNaN(num) && num.toString().length === 6, {
        message: "ZIP code must be exactly 6 digits",
      }),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z
      .string()
      .min(6, "Confirm password must be at least 6 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

const ShopOwnerSignup = () => {
  const { loading, isAuthenticated, login } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ShopOwnerSignupData>({
    resolver: zodResolver(ownerRegistrationSchema),
  });
  const [loader, setLoader] = useState(false);
  const router = useRouter();
  const { t } = useTranslation("common");
  const handleFormSubmit = async (data: ShopOwnerSignupData) => {
    data.phone = String(data.phone);
    data.zipCode = String(data.zipCode);
    setLoader(true);
    try {
      await apiService.post("/auth/register/shop", data);
      // Auto login after successful registration
      await login(data.email, data.password);
      toast.success("Shop registered successfully!");
      router.push("/");
      reset();
    } catch (error: any) {
      toast.error("Something went wrong. Please try again.");
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
      <div className="flex justify-center items-center min-h-[calc(100vh-80px)] py-8">
        <div className="w-full max-w-md bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <div className="flex items-center mb-4">
              <button
                onClick={() => {
                  router.back();
                }}
                className="text-gray-600 hover:text-gray-900 transition duration-200"
              >
                <ArrowLeft size={20} />
              </button>
              <h2 className="text-2xl font-bold text-gray-900 ml-2">
                {t("sign-up.shop-owner-signup")}
              </h2>
            </div>
            <p className="text-gray-600 mb-6">
              {t("sign-up.create-shop-account")}
            </p>

            <form
              onSubmit={handleSubmit((data) => {
                console.log(data);
                handleFormSubmit(data);
              })}
              className="space-y-4"
            >
              {/* Shop Information */}
              <div className="border-b pb-4 mb-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  {t("sign-up.shop-information")}
                </h3>
                <div className="space-y-4">
                  <InputField
                    register={register}
                    id="shopName"
                    label={t("sign-up.shop-name")}
                    placeholder={t("sign-up.enter-shop-name")}
                    error={errors.shopName?.message}
                  />
                  <InputField
                    register={register}
                    id="ownerName"
                    label={t("sign-up.owner-name")}
                    placeholder={t("sign-up.enter-owner-name")}
                    error={errors.ownerName?.message}
                  />
                </div>
              </div>

              {/* Contact Information */}
              <div className="border-b pb-4 mb-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  {t("sign-up.contact-information")}
                </h3>
                <div className="space-y-4">
                  <InputField
                    register={register}
                    id="email"
                    label={t("sign-up.email")}
                    placeholder="your@email.com"
                    error={errors.email?.message}
                  />
                  <InputField
                    register={register}
                    id="phone"
                    label={t("sign-up.phone-number")}
                    type="number"
                    placeholder={t("sign-up.enter-phone-number")}
                    error={errors.phone?.message}
                  />
                </div>
              </div>

              {/* Location */}
              <div className="border-b pb-4 mb-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  {t("sign-up.location")}
                </h3>
                <div className="space-y-4">
                  <InputField
                    register={register}
                    id="address"
                    label={t("sign-up.shop-address")}
                    placeholder={t("sign-up.enter-shop-address")}
                    error={errors.address?.message}
                  />
                  <InputField
                    register={register}
                    id="zipCode"
                    label={t("sign-up.zip-code")}
                    placeholder={t("sign-up.enter-zip-code")}
                    type="number"
                    error={errors.zipCode?.message}
                  />
                </div>
              </div>

              {/* Account Security */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  {t("sign-up.account-security")}
                </h3>
                <InputField
                  register={register}
                  id="password"
                  label={t("sign-up.password")}
                  type="password"
                  placeholder={t("sign-up.enter-password")}
                  error={errors.password?.message}
                />
                <InputField
                  register={register}
                  id="confirmPassword"
                  label={t("sign-up.confirm-password")}
                  type="password"
                  placeholder={t("sign-up.confirm-password")}
                  error={errors.confirmPassword?.message}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loader}
                className={`w-full py-2 px-4 bg-blue-600 text-white rounded-md ${
                  loader ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
                }`}
              >
                {loader ? t("sign-up.registering") : t("sign-up.register")}
              </button>
            </form>

            <p className="text-center text-gray-600 mt-4">
              {t("sign-up.have-account")}{" "}
              <button
                onClick={() => {
                  router.push("/shop-owner-login");
                }}
                className="text-blue-600 hover:text-blue-800 transition duration-200"
              >
                {t("sign-up.login")}
              </button>
            </p>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
};

const InputField: React.FC<InputFieldProps> = ({
  id,
  label,
  type = "text",
  placeholder,
  error,
  register,
}) => {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label} <span className="text-red-500">*</span>
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        className={`w-full px-3 py-2 border "border-gray-300"
        rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
        {...register(id)}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

interface InputFieldProps {
  id: keyof ShopOwnerSignupData;
  label: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  error?: string;
  register: any;
}

export default ShopOwnerSignup;
