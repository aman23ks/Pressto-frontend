"use client";

import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { toast } from "react-hot-toast";
import { AuthLayout } from "./AuthLayout";
import { AuthProps, ShopOwnerSignupData } from "@/app/types";
import { useAuth } from "@/app/contexts/AuthContext";
import { apiService } from "@/app/services/api";
import React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

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
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z
      .string()
      .min(8, "Confirm password must be at least 8 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export const ShopOwnerSignup = ({ onBack, onSwitch, onSuccess }: AuthProps) => {
  const { login } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ShopOwnerSignupData>({
    resolver: zodResolver(ownerRegistrationSchema),
  });
  const [loading, setLoading] = useState(false);

  const handleFormSubmit = async (data: ShopOwnerSignupData) => {
    data.phone = String(data.phone);
    data.zipCode = String(data.zipCode);
    setLoading(true);
    try {
      await apiService.post("/auth/register/shop", data);
      // Auto login after successful registration
      await login(data.email, data.password);
      toast.success("Shop registered successfully!");
      onSuccess();
      reset();
    } catch (error: any) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="flex justify-center items-center min-h-[calc(100vh-80px)] py-8">
        <div className="w-full max-w-md bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <div className="flex items-center mb-4">
              <button
                onClick={onBack}
                className="text-gray-600 hover:text-gray-900 transition duration-200"
              >
                <ArrowLeft size={20} />
              </button>
              <h2 className="text-2xl font-bold text-gray-900 ml-2">
                Register Your Shop
              </h2>
            </div>
            <p className="text-gray-600 mb-6">
              Create an account for your ironing shop
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
                  Shop Information
                </h3>
                <div className="space-y-4">
                  <InputField
                    register={register}
                    id="shopName"
                    label="Shop Name"
                    placeholder="Enter your shop name"
                    error={errors.shopName?.message}
                  />
                  <InputField
                    register={register}
                    id="ownerName"
                    label="Owner Name"
                    placeholder="Enter owner's full name"
                    error={errors.ownerName?.message}
                  />
                </div>
              </div>

              {/* Contact Information */}
              <div className="border-b pb-4 mb-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Contact Information
                </h3>
                <div className="space-y-4">
                  <InputField
                    register={register}
                    id="email"
                    label="Email"
                    placeholder="your@email.com"
                    error={errors.email?.message}
                  />
                  <InputField
                    register={register}
                    id="phone"
                    label="Phone Number"
                    type="number"
                    placeholder="Enter your phone number"
                    error={errors.phone?.message}
                  />
                </div>
              </div>

              {/* Location */}
              <div className="border-b pb-4 mb-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Location
                </h3>
                <div className="space-y-4">
                  <InputField
                    register={register}
                    id="address"
                    label="Shop Address"
                    placeholder="Enter your shop address"
                    error={errors.address?.message}
                  />
                  <InputField
                    register={register}
                    id="zipCode"
                    label="ZIP Code"
                    placeholder="Enter ZIP code"
                    type="number"
                    error={errors.zipCode?.message}
                  />
                </div>
              </div>

              {/* Account Security */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Account Security
                </h3>
                <InputField
                  register={register}
                  id="password"
                  label="Password"
                  type="password"
                  placeholder="Enter password"
                  error={errors.password?.message}
                />
                <InputField
                  register={register}
                  id="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  placeholder="Confirm your password"
                  error={errors.confirmPassword?.message}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-2 px-4 bg-blue-600 text-white rounded-md ${
                  loading
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-blue-700"
                }`}
              >
                {loading ? "Registering..." : "Register"}
              </button>
            </form>

            <p className="text-center text-gray-600 mt-4">
              Already have an account?{" "}
              <button
                onClick={onSwitch}
                className="text-blue-600 hover:text-blue-800 transition duration-200"
              >
                Log in
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