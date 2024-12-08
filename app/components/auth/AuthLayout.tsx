"use client";
import Link from "next/link";
import { Store } from "lucide-react";
import { LanguageSelect } from "@/app/components/LanguageSelect";
interface AuthLayoutProps {
  children: React.ReactNode;
}
export const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm flex items-center justify-between">
          <div className="w-full px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <Store className="h-8 w-8 text-blue-600" />
                <h1 className="ml-2 text-xl font-bold text-gray-900">
                  Pressto
                </h1>
              </Link>
            </div>

            <LanguageSelect />
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
      </div>
    </div>
  );
};
