'use client';

import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { AuthLayout } from './AuthLayout';
import { AuthProps, ShopOwnerSignupData } from '@/app/types';
import { useAuth } from '@/app/contexts/AuthContext';
import { apiService } from '@/app/services/api';
import React from 'react';

export const ShopOwnerSignup = ({ onBack, onSwitch, onSuccess }: AuthProps) => {
  const { login } = useAuth();
  const [formData, setFormData] = useState<ShopOwnerSignupData>({
    shopName: '',
    ownerName: '',
    email: '',
    phone: '',
    address: '',
    zipCode: '',
    serviceArea: '',
    pricePerItem: '',
    password: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof ShopOwnerSignupData, string>>>({});

  const validateForm = () => {
    const newErrors: Partial<Record<keyof ShopOwnerSignupData, string>> = {};

    if (!formData.shopName.trim()) newErrors.shopName = 'Shop name is required';
    if (!formData.ownerName.trim()) newErrors.ownerName = 'Owner name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.zipCode.trim()) newErrors.zipCode = 'ZIP code is required';
    if (!formData.serviceArea.trim()) newErrors.serviceArea = 'Service area is required';
    if (!formData.pricePerItem.trim()) newErrors.pricePerItem = 'Price per item is required';
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await apiService.post('/auth/register/shop', formData);

      // Auto login after successful registration
      await login(formData.email, formData.password);

      toast.success('Shop registered successfully!');
      onSuccess();
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Registration failed';
      toast.error(errorMessage);

      // Handle validation errors from backend
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }
    } finally {
      setLoading(false);
    }
  };

  // Helper function to handle input changes
  const handleInputChange = (field: keyof ShopOwnerSignupData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  interface InputFieldProps {
    id: keyof ShopOwnerSignupData;
    label: string;
    type?: string;
    placeholder?: string;
    required?: boolean;
    value: string;
    onChange: React.ChangeEventHandler<HTMLInputElement>;
    error?: string;
  }
  
  const InputField = React.memo(({
    id,
    label,
    type = 'text',
    placeholder = '',
    required = true,
    value,
    onChange,
    error,
  }: InputFieldProps) => (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        className={`w-full px-3 py-2 border ${
          error ? 'border-red-500' : 'border-gray-300'
        } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
        value={value}
        onChange={onChange}
        required={required}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  ));

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
              <h2 className="text-2xl font-bold text-gray-900 ml-2">Register Your Shop</h2>
            </div>
            <p className="text-gray-600 mb-6">Create an account for your ironing shop</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Shop Information */}
              <div className="border-b pb-4 mb-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Shop Information</h3>
                <div className="space-y-4">
                  <InputField
                    id="shopName"
                    label="Shop Name"
                    placeholder="Enter your shop name"
                    value={formData.shopName}
                    onChange={handleInputChange('shopName')}
                    error={errors.shopName}
                  />
                  <InputField
                    id="ownerName"
                    label="Owner Name"
                    placeholder="Enter owner's full name"
                    value={formData.ownerName}
                    onChange={handleInputChange('ownerName')}
                    error={errors.ownerName}
                  />
                </div>
              </div>

              {/* Contact Information */}
              <div className="border-b pb-4 mb-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
                <div className="space-y-4">
                  <InputField
                    id="email"
                    label="Email"
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={handleInputChange('email')}
                    error={errors.email}
                  />
                  <InputField
                    id="phone"
                    label="Phone Number"
                    type="tel"
                    placeholder="Enter your phone number"
                    value={formData.phone}
                    onChange={handleInputChange('phone')}
                    error={errors.phone}
                  />
                </div>
              </div>

              {/* Location & Service */}
              <div className="border-b pb-4 mb-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Location & Service</h3>
                <div className="space-y-4">
                  <InputField
                    id="address"
                    label="Shop Address"
                    placeholder="Enter your shop address"
                    value={formData.address}
                    onChange={handleInputChange('address')}
                    error={errors.address}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <InputField
                      id="zipCode"
                      label="ZIP Code"
                      placeholder="Enter ZIP code"
                      value={formData.zipCode}
                      onChange={handleInputChange('zipCode')}
                      error={errors.zipCode}
                    />
                    <InputField
                      id="serviceArea"
                      label="Service Area"
                      placeholder="e.g., 5 km radius"
                      value={formData.serviceArea}
                      onChange={handleInputChange('serviceArea')}
                      error={errors.serviceArea}
                    />
                  </div>
                  <InputField
                    id="pricePerItem"
                    label="Price per Item"
                    type="number"
                    placeholder="Enter base price per item"
                    value={formData.pricePerItem}
                    onChange={handleInputChange('pricePerItem')}
                    error={errors.pricePerItem}
                  />
                </div>
              </div>

              {/* Account Security */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Account Security</h3>
                <InputField
                  id="password"
                  label="Password"
                  type="password"
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={handleInputChange('password')}
                  error={errors.password}
                />
                <InputField
                  id="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange('confirmPassword')}
                  error={errors.confirmPassword}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-2 px-4 bg-blue-600 text-white rounded-md ${
                  loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
                }`}
              >
                {loading ? 'Registering...' : 'Register'}
              </button>
            </form>

            <p className="text-center text-gray-600 mt-4">
              Already have an account?{' '}
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
